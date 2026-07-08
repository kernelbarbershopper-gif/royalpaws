import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

const supabaseUrl = process.env.SUPABASE_URL || 'https://vcddxvvcxnjevgamjalv.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjZGR4dnZjeG5qZXZnYW1qYWx2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzQ2NDc1NywiZXhwIjoyMDk5MDQwNzU3fQ.cK0uNxVgLoh8pUGIsfxF8zQEjMyPvcjYp22vXcrTDZQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

app.use(express.json());

function snakeToCamel(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(snakeToCamel);
  if (typeof obj === 'object' && !(obj instanceof Date)) {
    const camel: any = {};
    for (const key of Object.keys(obj)) {
      const camelKey = key.replace(/_([a-z])/g, (_, l) => l.toUpperCase());
      camel[camelKey] = snakeToCamel(obj[key]);
    }
    return camel;
  }
  return obj;
}

function camelToSnake(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(camelToSnake);
  if (typeof obj === 'object' && !(obj instanceof Date)) {
    const snake: any = {};
    for (const key of Object.keys(obj)) {
      const snakeKey = key.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`);
      snake[snakeKey] = camelToSnake(obj[key]);
    }
    return snake;
  }
  return obj;
}

async function checkCollision(employeeId: string, dateTime: string, durationMinutes: number, excludeBookingId?: string) {
  const proposedStart = new Date(dateTime).getTime();
  const proposedEnd = proposedStart + durationMinutes * 60 * 1000;

  const { data: existingBookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('employee_id', employeeId)
    .in('status', ['scheduled', 'in_progress'])
    .neq('id', excludeBookingId || '')
    .throwOnError();

  if (existingBookings) {
    for (const b of existingBookings) {
      const existingStart = new Date(b.date_time).getTime();
      const existingEnd = existingStart + b.duration_minutes * 60 * 1000;
      if (proposedStart < existingEnd && proposedEnd > existingStart) {
        return { hasCollision: true, conflictingBooking: b };
      }
    }
  }
  return { hasCollision: false };
}

app.post('/api/auth/login', async (req, res) => {
  const { email, role } = req.body;
  let query = supabase.from('users').select('*').eq('email', email);
  if (role) query = query.eq('role', role);
  const { data, error } = await query.single();
  if (error || !data) {
    return res.status(401).json({ error: 'Unauthorized', message: 'E-mail ou perfil não encontrado no sistema.' });
  }
  const user = snakeToCamel(data);
  const payload = { id: user.id, name: user.name, email: user.email, role: user.role };
  const token = 'mock-jwt-' + Buffer.from(JSON.stringify(payload)).toString('base64');
  return res.json({ token, user: { ...user, id: user.id } });
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, role, companyName, phone } = req.body;
  if (!name || !email || !role) {
    return res.status(400).json({ error: 'Validation Error', message: 'Nome, email e tipo de conta são obrigatórios.' });
  }
  const { data: existing } = await supabase.from('users').select('id').eq('email', email).maybeSingle();
  if (existing) {
    return res.status(400).json({ error: 'Duplicate Email', message: 'Este e-mail já está cadastrado.' });
  }
  const newUser = {
    name,
    email,
    role,
    company_name: role === 'vendor' ? (companyName || 'Petshop Sem Nome') : null,
    phone: phone || '',
    avatar_url: `https://images.unsplash.com/photo-${role === 'vendor' ? '1534528741775-53994a69daeb' : '1500648767791-00dcc994a43e'}?w=150`,
    is_active: true,
    vendor_subscription: role === 'vendor' ? { plan: 'pro', status: 'active', expiresAt: '2028-12-31T23:59:59.000Z' } : null
  };
  const { data, error } = await supabase.from('users').insert(newUser).select().single();
  if (error) {
    return res.status(500).json({ error: 'Server Error', message: 'Erro ao criar usuário.' });
  }
  const user = snakeToCamel(data);
  const payload = { id: user.id, name: user.name, email: user.email, role: user.role };
  const token = 'mock-jwt-' + Buffer.from(JSON.stringify(payload)).toString('base64');
  return res.status(201).json({ token, user });
});

app.get('/api/users', async (_req, res) => {
  const { data } = await supabase.from('users').select('*');
  res.json(snakeToCamel(data || []));
});

app.get('/api/bookings', async (_req, res) => {
  const { data } = await supabase.from('bookings').select('*').order('date_time', { ascending: true });
  res.json(snakeToCamel(data || []));
});

app.post('/api/bookings', async (req, res) => {
  const { customerId, customerName, petId, petName, employeeId, serviceType, dateTime, durationMinutes, price, notes } = req.body;
  if (!customerId || !petId || !employeeId || !serviceType || !dateTime || !durationMinutes || !price) {
    return res.status(400).json({ error: 'Validation Error', message: 'Todos os campos obrigatórios devem ser preenchidos.' });
  }
  const { data: employee } = await supabase.from('users').select('*').eq('id', employeeId).single();
  if (!employee) {
    return res.status(404).json({ error: 'Not Found', message: 'Funcionário selecionado não existe.' });
  }
  const { hasCollision, conflictingBooking } = await checkCollision(employeeId, dateTime, Number(durationMinutes));
  if (hasCollision && conflictingBooking) {
    const conflictStart = new Date(conflictingBooking.date_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const conflictEnd = new Date(new Date(conflictingBooking.date_time).getTime() + conflictingBooking.duration_minutes * 60 * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return res.status(409).json({
      error: 'Schedule Collision',
      message: `Conflito de horários! O funcionário ${employee.name} já possui um agendamento (${conflictingBooking.service_type.toUpperCase()}) das ${conflictStart} às ${conflictEnd}.`
    });
  }
  const commissionRate = employee.commission_rate || 0;
  const commissionAmount = Number(((price * commissionRate) / 100).toFixed(2));
  const newBooking = camelToSnake({
    vendorId: 'vendor-1',
    customerId,
    customerName: customerName || 'Cliente Geral',
    petId,
    petName: petName || 'Pet',
    employeeId,
    employeeName: employee.name,
    serviceType,
    dateTime,
    durationMinutes: Number(durationMinutes),
    price: Number(price),
    status: 'scheduled',
    notes: notes || '',
    commissionPaid: false,
    commissionAmount
  });
  const { data, error } = await supabase.from('bookings').insert(camelToSnake(newBooking)).select().single();
  if (error) {
    return res.status(500).json({ error: 'Server Error', message: 'Erro ao criar agendamento.' });
  }
  res.status(201).json({ message: 'Agendamento criado com sucesso!', booking: snakeToCamel(data) });
});

app.put('/api/bookings/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const { data: currentBooking } = await supabase.from('bookings').select('*').eq('id', id).single();
  if (!currentBooking) {
    return res.status(404).json({ error: 'Not Found', message: 'Agendamento não encontrado.' });
  }
  const proposedEmployeeId = updates.employeeId || currentBooking.employee_id;
  const proposedDateTime = updates.dateTime || currentBooking.date_time;
  const proposedDuration = updates.durationMinutes !== undefined ? Number(updates.durationMinutes) : currentBooking.duration_minutes;
  if (updates.employeeId || updates.dateTime || updates.durationMinutes !== undefined) {
    const { hasCollision, conflictingBooking } = await checkCollision(proposedEmployeeId, proposedDateTime, proposedDuration, id);
    if (hasCollision && conflictingBooking) {
      const { data: emp } = await supabase.from('users').select('name').eq('id', proposedEmployeeId).single();
      const conflictStart = new Date(conflictingBooking.date_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const conflictEnd = new Date(new Date(conflictingBooking.date_time).getTime() + conflictingBooking.duration_minutes * 60 * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      return res.status(409).json({
        error: 'Schedule Collision',
        message: `Conflito! O funcionário ${emp?.name || 'especialista'} já possui agendamento das ${conflictStart} às ${conflictEnd}.`
      });
    }
  }
  if (updates.price !== undefined || updates.employeeId) {
    const finalPrice = updates.price !== undefined ? Number(updates.price) : currentBooking.price;
    const finalEmpId = updates.employeeId || currentBooking.employee_id;
    const { data: emp } = await supabase.from('users').select('name, commission_rate').eq('id', finalEmpId).single();
    if (emp) {
      updates.employeeName = emp.name;
      updates.commissionAmount = Number(((finalPrice * (emp.commission_rate || 0)) / 100).toFixed(2));
    }
  }
  const { data, error } = await supabase.from('bookings').update(camelToSnake(updates)).eq('id', id).select().single();
  if (error) {
    return res.status(500).json({ error: 'Server Error', message: 'Erro ao atualizar agendamento.' });
  }
  res.json({ message: 'Agendamento atualizado com sucesso!', booking: snakeToCamel(data) });
});

app.delete('/api/bookings/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id).select().single();
  if (error || !data) {
    return res.status(404).json({ error: 'Not Found', message: 'Agendamento não encontrado.' });
  }
  res.json({ message: 'Agendamento cancelado com sucesso!', booking: snakeToCamel(data) });
});

app.get('/api/pets', async (_req, res) => {
  const { data } = await supabase.from('pets').select('*');
  res.json(snakeToCamel(data || []));
});

app.post('/api/pets', async (req, res) => {
  const newPet = camelToSnake({ status: 'available', ownerId: 'vendor-1', ownerType: 'vendor', ...req.body });
  const { data, error } = await supabase.from('pets').insert(newPet).select().single();
  if (error) {
    return res.status(500).json({ error: 'Server Error', message: 'Erro ao cadastrar pet.' });
  }
  res.status(201).json(snakeToCamel(data));
});

app.get('/api/products', async (_req, res) => {
  const { data } = await supabase.from('products').select('*');
  res.json(snakeToCamel(data || []));
});

app.post('/api/products', async (req, res) => {
  const { name, sku, price, stockQty, category, ...rest } = req.body;
  const { data: existing } = await supabase.from('products').select('sku').eq('sku', sku).maybeSingle();
  if (existing) {
    return res.status(409).json({ error: 'Duplicate SKU', message: `SKU ${sku} já cadastrado no sistema.` });
  }
  const newProduct = camelToSnake({
    vendorId: 'vendor-1',
    name,
    sku,
    price,
    stockQty: stockQty || 0,
    category: category || 'Alimentos',
    barcode: '',
    description: '',
    costPrice: Math.round(price * 0.7 * 100) / 100,
    minStockAlert: 5,
    isManagedInventory: true,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300',
    ...rest
  });
  const { data, error } = await supabase.from('products').insert(newProduct).select().single();
  if (error) {
    return res.status(500).json({ error: 'Server Error', message: 'Erro ao adicionar produto.' });
  }
  res.status(201).json(snakeToCamel(data));
});

app.get('/api/medical-records', async (_req, res) => {
  const { data } = await supabase.from('medical_records').select('*').order('consultation_date', { ascending: false });
  res.json(snakeToCamel(data || []));
});

app.post('/api/medical-records', async (req, res) => {
  const newRecord = camelToSnake({
    consultationDate: new Date().toISOString(),
    vendorId: 'vendor-1',
    vetId: 'employee-3',
    ...req.body
  });
  const { data, error } = await supabase.from('medical_records').insert(newRecord).select().single();
  if (error) {
    return res.status(500).json({ error: 'Server Error', message: 'Erro ao salvar prontuário.' });
  }
  res.status(201).json(snakeToCamel(data));
});

async function seedInitialData() {
  const { count } = await supabase.from('users').select('*', { head: true, count: 'exact' });
  if (count && count > 0) return;

  const users = [
    { id: 'a0000000-0000-0000-0000-000000000001', name: 'Roberto Dantas', email: 'vendor@royalpaws.com', role: 'vendor', company_name: 'RoyalPaws Premium Shop', phone: '(11) 98765-4321', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', is_active: true, commission_rate: 0, vendor_subscription: { plan: 'pro', status: 'active', expiresAt: '2028-12-31T23:59:59.000Z', trialEndsAt: '2026-08-01T00:00:00.000Z' } },
    { id: 'a0000000-0000-0000-0000-000000000002', name: 'Ana Silva', email: 'ana.silva@royalpaws.com', role: 'employee', phone: '', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', is_active: true, specialties: ['banho', 'tosa', 'banho_e_tosa'], commission_rate: 15 },
    { id: 'a0000000-0000-0000-0000-000000000003', name: 'Carlos Souza', email: 'carlos.souza@royalpaws.com', role: 'employee', phone: '', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', is_active: true, specialties: ['banho', 'tosa'], commission_rate: 12 },
    { id: 'a0000000-0000-0000-0000-000000000004', name: 'Dr. Bruno Costa', email: 'bruno.vet@royalpaws.com', role: 'employee', phone: '', avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150', is_active: true, specialties: ['consulta_vet'], commission_rate: 20 },
    { id: 'a0000000-0000-0000-0000-000000000005', name: 'Mariana Costa', email: 'mariana@example.com', role: 'customer', phone: '(11) 91122-3344', avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', is_active: true },
    { id: 'a0000000-0000-0000-0000-000000000006', name: 'Roberto Santos', email: 'roberto@example.com', role: 'customer', phone: '(11) 94455-6677', avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', is_active: true }
  ];
  await supabase.from('users').insert(users);

  const pets = [
    { id: 'b0000000-0000-0000-0000-000000000001', name: 'Thor', category: 'dog', breed: 'Golden Retriever', age: 18, gender: 'male', size: 'large', description: 'Lindo filhote de Golden Retriever com linhagem campeã de pedigree. Vacinado e dócil.', photos: ['https://images.unsplash.com/photo-1552053831-71594a27632d?w=400'], listing_type: 'sale', price: 2500, status: 'available', owner_id: 'a0000000-0000-0000-0000-000000000001', owner_type: 'vendor', vaccinated: true, dewormed: true, neutered: false, pedigree: true },
    { id: 'b0000000-0000-0000-0000-000000000002', name: 'Luna', category: 'cat', breed: 'Persa Cinza', age: 6, gender: 'female', size: 'small', description: 'Gatinha Persa dócil, ronronadora e muito brincalhona. Ideal para apartamentos.', photos: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400'], listing_type: 'adoption', status: 'available', owner_id: 'a0000000-0000-0000-0000-000000000001', owner_type: 'vendor', vaccinated: true, dewormed: true, neutered: true, pedigree: false },
    { id: 'b0000000-0000-0000-0000-000000000003', name: 'Pipoca', category: 'bird', breed: 'Calopsita Cara Branca', age: 12, gender: 'male', size: 'small', description: 'Calopsita mansa que assovia hinos e músicas. Super saudável.', photos: ['https://images.unsplash.com/photo-1522858547137-f1dcec554f55?w=400'], listing_type: 'sale', price: 350, status: 'available', owner_id: 'a0000000-0000-0000-0000-000000000005', owner_type: 'customer', vaccinated: false, dewormed: true, neutered: false, pedigree: false },
    { id: 'b0000000-0000-0000-0000-000000000004', name: 'Nemo', category: 'fish', breed: 'Peixe Palhaço', age: 3, gender: 'unknown', size: 'small', description: 'Peixe palhaço ideal para aquários de água salgada, adaptado a rações secas.', photos: ['https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=400'], listing_type: 'adoption', status: 'available', owner_id: 'a0000000-0000-0000-0000-000000000001', owner_type: 'vendor', vaccinated: false, dewormed: false, neutered: false, pedigree: false }
  ];
  await supabase.from('pets').insert(pets);

  const now = new Date();
  const booking1Time = new Date(now); booking1Time.setHours(10, 0, 0, 0);
  const booking2Time = new Date(now); booking2Time.setHours(14, 0, 0, 0);
  const booking3Time = new Date(now); booking3Time.setHours(16, 0, 0, 0);

  const bookings = [
    { vendor_id: 'a0000000-0000-0000-0000-000000000001', customer_id: 'a0000000-0000-0000-0000-000000000005', customer_name: 'Mariana Costa', pet_id: 'b0000000-0000-0000-0000-000000000001', pet_name: 'Thor', employee_id: 'a0000000-0000-0000-0000-000000000002', employee_name: 'Ana Silva', service_type: 'banho_e_tosa', date_time: booking1Time.toISOString(), duration_minutes: 60, price: 120, status: 'completed', notes: 'Pet estava muito agitado, mas se comportou bem no final.', commission_paid: true, commission_amount: 18 },
    { vendor_id: 'a0000000-0000-0000-0000-000000000001', customer_id: 'a0000000-0000-0000-0000-000000000006', customer_name: 'Roberto Santos', pet_id: 'b0000000-0000-0000-0000-000000000002', pet_name: 'Luna', employee_id: 'a0000000-0000-0000-0000-000000000003', employee_name: 'Carlos Souza', service_type: 'tosa', date_time: booking2Time.toISOString(), duration_minutes: 45, price: 80, status: 'scheduled', notes: 'Tosa higiênica e corte de unhas.', commission_paid: false, commission_amount: 9.6 },
    { vendor_id: 'a0000000-0000-0000-0000-000000000001', customer_id: 'a0000000-0000-0000-0000-000000000005', customer_name: 'Mariana Costa', pet_id: 'b0000000-0000-0000-0000-000000000001', pet_name: 'Thor', employee_id: 'a0000000-0000-0000-0000-000000000004', employee_name: 'Dr. Bruno Costa', service_type: 'consulta_vet', date_time: booking3Time.toISOString(), duration_minutes: 60, price: 200, status: 'scheduled', notes: 'Retorno para verificação da alergia nas patinhas.', commission_paid: false, commission_amount: 40 }
  ];
  await supabase.from('bookings').insert(bookings);

  const products = [
    { vendor_id: 'a0000000-0000-0000-0000-000000000001', name: 'Ração Golden Power Castrados Salmão 10kg', sku: 'GOLDEN-10K', barcode: '7896012345678', description: 'Ração especial Super Premium formulada para cães adultos castrados de porte médio e grande.', price: 159.90, cost_price: 110.00, category: 'Alimentos', stock_qty: 25, min_stock_alert: 5, is_managed_inventory: true, is_active: true, image_url: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300' },
    { vendor_id: 'a0000000-0000-0000-0000-000000000001', name: 'Shampoo Hipoalergênico Pet Safe 500ml', sku: 'SHAMP-NEUT', barcode: '7896012345679', description: 'Shampoo neutro ideal para peles sensíveis, enriquecido com extrato de camomila e aloe vera.', price: 34.90, cost_price: 18.50, category: 'Higiene', stock_qty: 18, min_stock_alert: 3, is_managed_inventory: true, is_active: true, image_url: 'https://images.unsplash.com/photo-1516715094727-ec48be335d79?w=300' },
    { vendor_id: 'a0000000-0000-0000-0000-000000000001', name: 'Brinquedo Mordedor Resistente de Corda 30cm', sku: 'MORD-CORD', barcode: '7896012345680', description: 'Mordedor durável feito de corda de algodão natural trançado. Auxilia na limpeza dos dentes.', price: 19.90, cost_price: 8.00, category: 'Brinquedos', stock_qty: 4, min_stock_alert: 5, is_managed_inventory: true, is_active: true, image_url: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=300' },
    { vendor_id: 'a0000000-0000-0000-0000-000000000001', name: 'Antipulgas e Carrapatos Frontline Tri-Act', sku: 'FRONT-CAES', barcode: '7896012345681', description: 'Pipeta de aplicação fácil para cães de 10 a 20kg. Ação rápida e prolongada contra parasitas.', price: 89.90, cost_price: 55.00, category: 'Farmácia', stock_qty: 12, min_stock_alert: 3, is_managed_inventory: true, is_active: true, image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300' }
  ];
  await supabase.from('products').insert(products);

  const medicalRecords = [
    { pet_id: 'b0000000-0000-0000-0000-000000000001', pet_name: 'Thor', customer_id: 'a0000000-0000-0000-0000-000000000005', vet_id: 'a0000000-0000-0000-0000-000000000004', vendor_id: 'a0000000-0000-0000-0000-000000000001', consultation_date: '2026-07-01T15:30:00.000Z', symptoms: 'Coceira intensa nas patinhas traseiras e vermelhidão entre os dedos.', diagnosis: 'Dermatite atópica sazonal por contato.', weight: 31.4, temperature: 38.6, heart_rate: 98, treatments: [{ treatmentName: 'Shampoo Terapêutico Clorexidina', dosage: 'Uso durante o banho', frequency: '2x por semana', startDate: '2026-07-01T00:00:00.000Z', endDate: '2026-07-15T00:00:00.000Z', notes: 'Deixar agir por 10 minutos antes de enxaguar bem.' }, { treatmentName: 'Corticoide Antialérgico Oral', dosage: '1 comprimido de 10mg', frequency: 'A cada 24 horas', startDate: '2026-07-01T00:00:00.000Z', endDate: '2026-07-06T00:00:00.000Z', notes: 'Administrar logo após a refeição.' }], vaccines_administered: ['V10 Importada (Anual)', 'Antirrábica'], prescription_notes: 'Evitar passeios em gramas altas durante a próxima semana.', follow_up_date: '2026-07-15T15:30:00.000Z' }
  ];
  await supabase.from('medical_records').insert(medicalRecords);

  console.log('Seed data inserted successfully.');
}

async function startServer() {
  await seedInitialData();

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
