import { Request, Response } from 'express';
import Booking from '../models/Booking';
import User from '../models/User';

export class BookingController {
  /**
   * Creates a new booking after strictly validating employee schedule conflicts.
   * Overlap is detected when: (proposedStart < existingEnd) AND (proposedEnd > existingStart)
   */
  public async createBooking(req: Request, res: Response): Promise<Response> {
    const {
      customerId,
      petId,
      employeeId,
      serviceType,
      dateTime,
      durationMinutes,
      price,
      notes
    } = req.body;

    try {
      // 1. Basic Fields Validation
      if (!customerId || !petId || !employeeId || !serviceType || !dateTime || !durationMinutes || !price) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: 'Todos os campos obrigatórios devem ser fornecidos (customerId, petId, employeeId, serviceType, dateTime, durationMinutes, price).'
        });
      }

      // 2. Validate Employee Profile and Status
      const employee = await User.findById(employeeId);
      if (!employee) {
        return res.status(444).json({
          success: false,
          error: 'Not Found',
          message: 'Especialista/Funcionário selecionado não existe no sistema.'
        });
      }

      if (employee.role !== 'employee' && employee.role !== 'vendor') {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: 'O id do funcionário fornecido não corresponde a um perfil de prestador de serviços.'
        });
      }

      // 3. Define proposed schedule window
      const proposedStart = new Date(dateTime);
      const duration = Number(durationMinutes);
      const proposedEnd = new Date(proposedStart.getTime() + duration * 60000);

      // 4. ROBUST CONFLICT VALIDATION ENGINE
      // Searches the database for any active (scheduled or in_progress) bookings for the same specialist
      // that overlap with our proposed timeframe.
      // Mathematical overlap definition: (Start A < End B) AND (End A > Start B)
      const conflict = await Booking.findOne({
        employeeId,
        status: { $in: ['scheduled', 'in_progress'] },
        $or: [
          // Case A: Existing booking starts during or contains proposedStart
          // existingStart <= proposedStart AND (existingStart + existingDuration) > proposedStart
          {
            dateTime: { $lte: proposedStart },
            $expr: {
              $gt: [
                { $add: ['$dateTime', { $multiply: ['$durationMinutes', 60000] }] },
                proposedStart
              ]
            }
          },
          // Case B: Existing booking starts during or contains proposedEnd
          // existingStart < proposedEnd AND (existingStart + existingDuration) > proposedEnd
          {
            dateTime: { $lt: proposedEnd },
            $expr: {
              $gt: [
                { $add: ['$dateTime', { $multiply: ['$durationMinutes', 60000] }] },
                proposedEnd
              ]
            }
          },
          // Case C: Proposed booking fully engulfs an existing booking
          // proposedStart <= existingStart AND proposedEnd >= existingEnd
          {
            dateTime: { $gte: proposedStart, $lt: proposedEnd }
          }
        ]
      });

      if (conflict) {
        const conflictStart = new Date(conflict.dateTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const conflictEnd = new Date(new Date(conflict.dateTime).getTime() + conflict.durationMinutes * 60000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        return res.status(409).json({
          success: false,
          error: 'Schedule Collision',
          message: `Conflito de horários! O profissional ${employee.name} já possui um agendamento (${conflict.serviceType.toUpperCase()}) das ${conflictStart} às ${conflictEnd}.`
        });
      }

      // 5. Automatic Commission Calculation based on employee's contract rate
      // Default to 15% rate if not specified
      const rate = employee.commissionRate !== undefined ? employee.commissionRate : 0.15;
      // If employee's commissionRate is a whole percentage (e.g. 15), convert to decimal
      const decimalRate = rate > 1 ? rate / 100 : rate;
      const commissionAmount = Number((price * decimalRate).toFixed(2));

      // 6. Create and Save the booking document
      const newBooking = new Booking({
        customerId,
        petId,
        employeeId,
        serviceType,
        dateTime: proposedStart,
        durationMinutes: duration,
        price: Number(price),
        commissionAmount,
        status: 'scheduled',
        notes: notes || ''
      });

      await newBooking.save();

      return res.status(201).json({
        success: true,
        message: 'Agendamento criado com sucesso, integrado ao ERP PetSphere!',
        booking: newBooking
      });

    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: 'Server Error',
        message: 'Erro interno ao realizar agendamento no servidor.',
        details: error.message
      });
    }
  }

  /**
   * Retrieves all bookings for a specific employee or customer
   */
  public async getBookings(req: Request, res: Response): Promise<Response> {
    try {
      const { employeeId, customerId } = req.query;
      const query: any = {};

      if (employeeId) query.employeeId = employeeId;
      if (customerId) query.customerId = customerId;

      const bookings = await Booking.find(query).sort({ dateTime: 1 });
      return res.status(200).json({
        success: true,
        bookings
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: 'Server Error',
        message: 'Erro ao buscar agendamentos.',
        details: error.message
      });
    }
  }
}
