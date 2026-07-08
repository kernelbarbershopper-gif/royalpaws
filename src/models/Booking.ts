import { Schema, model, models, Document, Types, Model } from 'mongoose';

export interface IBooking extends Document {
  customerId: Types.ObjectId;
  petId: Types.ObjectId;
  employeeId: Types.ObjectId;
  serviceType: 'banho' | 'tosa' | 'banho_e_tosa' | 'consulta_vet';
  dateTime: Date;
  durationMinutes: number;
  price: number;
  commissionAmount: number; // calculated using commissionRate from user
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  petId: { type: Schema.Types.ObjectId, required: true },
  employeeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  serviceType: { 
    type: String, 
    enum: ['banho', 'tosa', 'banho_e_tosa', 'consulta_vet'], 
    required: true 
  },
  dateTime: { type: Date, required: true },
  durationMinutes: { type: Number, required: true, default: 45 },
  price: { type: Number, required: true },
  commissionAmount: { type: Number, required: true, default: 0 },
  status: { 
    type: String, 
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'], 
    default: 'scheduled' 
  },
  notes: { type: String }
}, {
  timestamps: true
});

// Composite index to speed up conflict lookups
BookingSchema.index({ employeeId: 1, dateTime: 1 });
BookingSchema.index({ status: 1 });

export const Booking: Model<IBooking> = (models.Booking as Model<IBooking>) || model<IBooking>('Booking', BookingSchema);
export default Booking;
