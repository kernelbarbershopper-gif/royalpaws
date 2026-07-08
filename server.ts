import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// IN-MEMORY DATABASE FOR HIGH-FIDELITY SANDBOX ENVIRONMENT
const db = {
  users: [
    {
      id: 'vendor-1',
      name: 'Roberto Dantas',
      email: 'vendor@royalpaws.com',
      role: 'vendor',
      companyName: 'RoyalPaws Premium Shop',
      phone: '(11) 98765-4321',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      vendorSubscription: {
        plan: 'pro',
        status: 'active',
        expiresAt: '2028-12-31T23:59:59.000Z',
        trialEndsAt: '2026-08-01T00:00:00.000Z',
        stripeSubscriptionId: 'sub_1O83h49988'
      },
      isActive: true
    },
    {
      id: 'employee-1',
      name: 'Ana Silva',
      email: 'ana.silva@royalpaws.com',
      role: 'employee',
      associatedVendorId: 'vendor-1',
      specialties: ['banho', 'tosa', 'banho_e_tosa'],
      commissionRate: 15,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      isActive: true
    },
    {
      id: 'employee-2',
      name: 'Carlos Souza',
      email: 'carlos.souza@royalpaws.com',
      role: 'employee',
      associatedVendorId: 'vendor-1',
      specialties: ['banho', 'tosa'],
      commissionRate: 12,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      isActive: true
    },
    {
      id: 'employee-3',
      name: 'Dr. Bruno Costa',
      email: 'bruno.vet@royalpaws.com',
      role: 'employee',
      associatedVendorId: 'vendor-1',
      specialties: ['consulta_vet'],
      commissionRate: 20,
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
      isActive: true
    },
    {
      id: 'customer-1',
      name: 'Mariana Costa',
      email: 'mariana@example.com',
      role: 'customer',
      phone: '(11) 91122-3344',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      isActive: true
    },
    {
      id: 'customer-2',
      name: 'Roberto Santos',
      email: 'roberto@example.com',
      role: 'customer',
      phone: '(11) 94455-6677',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      isActive: true
    }
  ],
  pets: [
    {
      id: 'pet-1',
      name: 'Thor',
      category: 'dog',
      breed: 'Golden Retriever',
      age: 18,
      gender: 'male',
      size: 'large',
      description: 'Lindo filhote de Golden Retriever com linhagem campeã de pedigree. Vacinado e dócil.',
      photos: ['https://images.unsplash.com/photo-1552053831-71594a27632d?w=400'],
      listingType: 'sale',
      price: 2500,
      status: 'available',
      ownerId: 'vendor-1',
      ownerType: 'vendor',
      vaccinated: true,
      dewormed: true,
      neutered: false,
      pedigree: true
    },
    {
      id: 'pet-2',
      name: 'Luna',
      category: 'cat',
      breed: 'Persa Cinza',
      age: 6,
      gender: 'female',
      size: 'small',
      description: 'Gatinha Persa dócil, ronronadora e muito brincalhona. Ideal para apartamentos.',
      photos: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400'],
      listingType: 'adoption',
      status: 'available',
      ownerId: 'vendor-1',
      ownerType: 'vendor',
      vaccinated: true,
      dewormed: true,
      neutered: true,
      pedigree: false
    },
    {
      id: 'pet-3',
      name: 'Pipoca',
      category: 'bird',
      breed: 'Calopsita Cara Branca',
      age: 12,
      gender: 'male',
      size: 'small',
      description: 'Calopsita mansa que assovia hinos e músicas. Super saudável.',
      photos: ['https://images.unsplash.com/photo-1522858547137-f1dcec554f55?w=400'],
      listingType: 'sale',
      price: 350,
      status: 'available',
      ownerId: 'customer-1',
      ownerType: 'customer',
      vaccinated: false,
      dewormed: true,
      neutered: false,
      pedigree: false
    },
    {
      id: 'pet-4',
      name: 'Nemo',
      category: 'fish',
      breed: 'Peixe Palhaço',
      age: 3,
      gender: 'unknown',
      size: 'small',
      description: 'Peixe palhaço ideal para aquários de água salgada, adaptado a rações secas.',
      photos: ['https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=400'],
      listingType: 'adoption',
      status: 'available',
      ownerId: 'vendor-1',
      ownerType: 'vendor',
      vaccinated: false,
      dewormed: false,
      neutered: false,
      pedigree: false
    }
  ],
  bookings: [
    {
      id: 'booking-1',
      vendorId: 'vendor-1',
      customerId: 'customer-1',
      customerName: 'Mariana Costa',
      petId: 'pet-1',
      petName: 'Thor',
      employeeId: 'employee-1',
      employeeName: 'Ana Silva',
      serviceType: 'banho_e_tosa',
      dateTime: (() => {
        const d = new Date();
        d.setHours(10, 0, 0, 0);
        return d.toISOString();
      })(),
      durationMinutes: 60,
      price: 120,
      status: 'completed',
      notes: 'Pet estava muito agitado, mas se comportou bem no final.',
      commissionPaid: true,
      commissionAmount: 18
    },
    {
      id: 'booking-2',
      vendorId: 'vendor-1',
      customerId: 'customer-2',
      customerName: 'Roberto Santos',
      petId: 'pet-2',
      petName: 'Luna',
      employeeId: 'employee-2',
      employeeName: 'Carlos Souza',
      serviceType: 'tosa',
      dateTime: (() => {
        const d = new Date();
        d.setHours(14, 0, 0, 0);
        return d.toISOString();
      })(),
      durationMinutes: 45,
      price: 80,
      status: 'scheduled',
      notes: 'Tosa higiênica e corte de unhas.',
      commissionPaid: false,
      commissionAmount: 9.6
    },
    {
      id: 'booking-3',
      vendorId: 'vendor-1',
      customerId: 'customer-1',
      customerName: 'Mariana Costa',
      petId: 'pet-1',
      petName: 'Thor',
      employeeId: 'employee-3',
      employeeName: 'Dr. Bruno Costa',
      serviceType: 'consulta_vet',
      dateTime: (() => {
        const d = new Date();
        d.setHours(16, 0, 0, 0);
        return d.toISOString();
      })(),
      durationMinutes: 60,
      price: 200,
      status: 'scheduled',
      notes: 'Retorno para verificação da alergia nas patinhas.',
      commissionPaid: false,
      commissionAmount: 40
    }
  ],
  products: [
    {
      id: 'prod-1',
      vendorId: 'vendor-1',
      name: 'Ração Golden Power Castrados Salmão 10kg',
      sku: 'GOLDEN-10K',
      barcode: '7896012345678',
      description: 'Ração especial Super Premium formulada para cães adultos castrados de porte médio e grande.',
      price: 159.90,
      costPrice: 110.00,
      category: 'Alimentos',
      stockQty: 25,
      minStockAlert: 5,
      isManagedInventory: true,
      isActive: true,
      imageUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300'
    },
    {
      id: 'prod-2',
      vendorId: 'vendor-1',
      name: 'Shampoo Hipoalergênico Pet Safe 500ml',
      sku: 'SHAMP-NEUT',
      barcode: '7896012345679',
      description: 'Shampoo neutro ideal para peles sensíveis, enriquecido com extrato de camomila e aloe vera.',
      price: 34.90,
      costPrice: 18.50,
      category: 'Higiene',
      stockQty: 18,
      minStockAlert: 3,
      isManagedInventory: true,
      isActive: true,
      imageUrl: 'https://images.unsplash.com/photo-1516715094727-ec48be335d79?w=300'
    },
    {
      id: 'prod-3',
      vendorId: 'vendor-1',
      name: 'Brinquedo Mordedor Resistente de Corda 30cm',
      sku: 'MORD-CORD',
      barcode: '7896012345680',
      description: 'Mordedor durável feito de corda de algodão natural trançado. Auxilia na limpeza dos dentes.',
      price: 19.90,
      costPrice: 8.00,
      category: 'Brinquedos',
      stockQty: 4, // triggers alert
      minStockAlert: 5,
      isManagedInventory: true,
      isActive: true,
      imageUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=300'
    },
    {
      id: 'prod-4',
      vendorId: 'vendor-1',
      name: 'Antipulgas e Carrapatos Frontline Tri-Act',
      sku: 'FRONT-CAES',
      barcode: '7896012345681',
      description: 'Pipeta de aplicação fácil para cães de 10 a 20kg. Ação rápida e prolongada contra parasitas.',
      price: 89.90,
      costPrice: 55.00,
      category: 'Farmácia',
      stockQty: 12,
      minStockAlert: 3,
      isManagedInventory: true,
      isActive: true,
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300'
    }
  ],
  medicalRecords: [
    {
      id: 'med-1',
      petId: 'pet-1',
      petName: 'Thor',
      customerId: 'customer-1',
      vetId: 'employee-3',
      vendorId: 'vendor-1',
      consultationDate: '2026-07-01T15:30:00.000Z',
      symptoms: 'Coceira intensa nas patinhas traseiras e vermelhidão entre os dedos.',
      diagnosis: 'Dermatite atópica sazonal por contato.',
      weight: 31.4,
      temperature: 38.6,
      heartRate: 98,
      treatments: [
        {
          treatmentName: 'Shampoo Terapêutico Clorexidina',
          dosage: 'Uso durante o banho',
          frequency: '2x por semana',
          startDate: '2026-07-01T00:00:00.000Z',
          endDate: '2026-07-15T00:00:00.000Z',
          notes: 'Deixar agir por 10 minutos antes de enxaguar bem.'
        },
        {
          treatmentName: 'Corticoide Antialérgico Oral',
          dosage: '1 comprimido de 10mg',
          frequency: 'A cada 24 horas',
          startDate: '2026-07-01T00:00:00.000Z',
          endDate: '2026-07-06T00:00:00.000Z',
          notes: 'Administrar logo após a refeição.'
        }
      ],
      vaccinesAdministered: ['V10 Importada (Anual)', 'Antirrábica'],
      prescriptionNotes: 'Evitar passeios em gramas altas durante a próxima semana. Retorno se não houver melhora expressiva.',
      followUpDate: '2026-07-15T15:30:00.000Z'
    }
  ]
};

// COLLISION FUNCTION FOR THE SERVER (In-Memory Simulator mimicking BookingController)
function checkCollision(employeeId: string, dateTime: string, durationMinutes: number, excludeBookingId?: string) {
  const proposedStart = new Date(dateTime).getTime();
  const proposedEnd = proposedStart + durationMinutes * 60 * 1000;

  for (const b of db.bookings) {
    if (b.id === excludeBookingId) continue;
    if (b.employeeId !== employeeId) continue;
    if (b.status !== 'scheduled' && b.status !== 'in_progress') continue;

    const existingStart = new Date(b.dateTime).getTime();
    const existingEnd = existingStart + b.durationMinutes * 60 * 1000;

    // Overlap: (proposedStart < existingEnd) AND (proposedEnd > existingStart)
    if (proposedStart < existingEnd && proposedEnd > existingStart) {
      return { hasCollision: true, conflictingBooking: b };
    }
  }

  return { hasCollision: false };
}

// REST API ROUTES
// Auth Endpoint Simulation
app.post('/api/auth/login', (req, res) => {
  const { email, role } = req.body;
  // If role is selected, check match, else check by email
  const user = db.users.find(u => u.email === email && (!role || u.role === role));
  if (user) {
    // Generate simple token representing payload base64 format for authMiddleware compatibility
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      associatedVendorId: (user as any).associatedVendorId
    };
    const token = 'mock-jwt-' + Buffer.from(JSON.stringify(payload)).toString('base64');
    return res.json({ token, user });
  }
  return res.status(401).json({ error: 'Unauthorized', message: 'E-mail ou perfil não encontrado no sistema.' });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, role, companyName, phone } = req.body;
  if (!name || !email || !role) {
    return res.status(400).json({ error: 'Validation Error', message: 'Nome, email e tipo de conta são obrigatórios.' });
  }
  const exists = db.users.some(u => u.email === email);
  if (exists) {
    return res.status(400).json({ error: 'Duplicate Email', message: 'Este e-mail já está cadastrado.' });
  }

  const userId = (role === 'vendor' ? 'vendor-' : role === 'employee' ? 'employee-' : 'customer-') + (db.users.length + 1);
  const newUser: any = {
    id: userId,
    name,
    email,
    role,
    companyName: role === 'vendor' ? (companyName || 'Petshop Sem Nome') : undefined,
    phone: phone || '',
    avatarUrl: `https://images.unsplash.com/photo-${role === 'vendor' ? '1534528741775-53994a69daeb' : '1500648767791-00dcc994a43e'}?w=150`,
    isActive: true,
    ...(role === 'vendor' ? { 
      vendorSubscription: { 
        plan: 'pro', 
        status: 'active', 
        expiresAt: '2028-12-31T23:59:59.000Z' 
      } 
    } : {})
  };

  db.users.push(newUser);

  const payload = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    associatedVendorId: (newUser as any).associatedVendorId
  };
  const token = 'mock-jwt-' + Buffer.from(JSON.stringify(payload)).toString('base64');
  return res.status(201).json({ token, user: newUser });
});

app.get('/api/users', (req, res) => {
  res.json(db.users);
});

// Bookings Endpoints with strict collision avoidance
app.get('/api/bookings', (req, res) => {
  res.json(db.bookings);
});

app.post('/api/bookings', (req, res) => {
  const {
    customerId,
    customerName,
    petId,
    petName,
    employeeId,
    serviceType,
    dateTime,
    durationMinutes,
    price,
    notes
  } = req.body;

  if (!customerId || !petId || !employeeId || !serviceType || !dateTime || !durationMinutes || !price) {
    return res.status(400).json({ error: 'Validation Error', message: 'Todos os campos obrigatórios devem ser preenchidos.' });
  }

  const employee = db.users.find(u => u.id === employeeId);
  if (!employee) {
    return res.status(404).json({ error: 'Not Found', message: 'Funcionário selecionado não existe.' });
  }

  // Check collision
  const { hasCollision, conflictingBooking } = checkCollision(employeeId, dateTime, Number(durationMinutes));

  if (hasCollision && conflictingBooking) {
    const conflictStart = new Date(conflictingBooking.dateTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const conflictEnd = new Date(new Date(conflictingBooking.dateTime).getTime() + conflictingBooking.durationMinutes * 60 * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return res.status(409).json({
      error: 'Schedule Collision',
      message: `Conflito de horários! O funcionário ${employee.name} já possui um agendamento (${conflictingBooking.serviceType.toUpperCase()}) das ${conflictStart} às ${conflictEnd}.`
    });
  }

  // Calculate commission
  const commissionRate = (employee as any).commissionRate || 0;
  const commissionAmount = Number(((price * commissionRate) / 100).toFixed(2));

  const newBooking = {
    id: 'booking-' + (db.bookings.length + 1),
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
  };

  db.bookings.push(newBooking);
  res.status(201).json({ message: 'Agendamento criado com sucesso!', booking: newBooking });
});

app.put('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const idx = db.bookings.findIndex(b => b.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Not Found', message: 'Agendamento não encontrado.' });
  }

  const currentBooking = db.bookings[idx];
  const proposedEmployeeId = updates.employeeId || currentBooking.employeeId;
  const proposedDateTime = updates.dateTime || currentBooking.dateTime;
  const proposedDuration = updates.durationMinutes !== undefined ? Number(updates.durationMinutes) : currentBooking.durationMinutes;

  // Collision checking if schedule-critical fields change
  if (updates.employeeId || updates.dateTime || updates.durationMinutes !== undefined) {
    const { hasCollision, conflictingBooking } = checkCollision(proposedEmployeeId, proposedDateTime, proposedDuration, id);
    if (hasCollision && conflictingBooking) {
      const employee = db.users.find(u => u.id === proposedEmployeeId);
      const conflictStart = new Date(conflictingBooking.dateTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const conflictEnd = new Date(new Date(conflictingBooking.dateTime).getTime() + conflictingBooking.durationMinutes * 60 * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      return res.status(409).json({
        error: 'Schedule Collision',
        message: `Conflito! O funcionário ${employee?.name || 'especialista'} já possui agendamento das ${conflictStart} às ${conflictEnd}.`
      });
    }
  }

  // Update commission if price or employee changed
  if (updates.price !== undefined || updates.employeeId) {
    const finalPrice = updates.price !== undefined ? Number(updates.price) : currentBooking.price;
    const finalEmpId = updates.employeeId || currentBooking.employeeId;
    const emp = db.users.find(u => u.id === finalEmpId);
    if (emp) {
      updates.employeeName = emp.name;
      const commissionRate = (emp as any).commissionRate || 0;
      updates.commissionAmount = Number(((finalPrice * commissionRate) / 100).toFixed(2));
    }
  }

  const updatedBooking = { ...currentBooking, ...updates };
  db.bookings[idx] = updatedBooking;

  res.json({ message: 'Agendamento atualizado com sucesso!', booking: updatedBooking });
});

app.delete('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const idx = db.bookings.findIndex(b => b.id === id);
  if (idx !== -1) {
    db.bookings[idx].status = 'cancelled';
    return res.json({ message: 'Agendamento cancelado com sucesso!', booking: db.bookings[idx] });
  }
  res.status(404).json({ error: 'Not Found', message: 'Agendamento não encontrado.' });
});

// Pets Endpoints
app.get('/api/pets', (req, res) => {
  res.json(db.pets);
});

app.post('/api/pets', (req, res) => {
  const newPet = {
    id: 'pet-' + (db.pets.length + 1),
    status: 'available',
    ownerId: 'vendor-1',
    ownerType: 'vendor',
    ...req.body
  };
  db.pets.push(newPet);
  res.status(201).json(newPet);
});

// Products Endpoints
app.get('/api/products', (req, res) => {
  res.json(db.products);
});

app.post('/api/products', (req, res) => {
  const { name, sku, price, stockQty, category } = req.body;
  const exists = db.products.some(p => p.sku === sku);
  if (exists) {
    return res.status(409).json({ error: 'Duplicate SKU', message: `SKU ${sku} já cadastrado no sistema.` });
  }
  const newProduct = {
    id: 'prod-' + (db.products.length + 1),
    vendorId: 'vendor-1',
    barcode: '',
    description: '',
    costPrice: Math.round(price * 0.7 * 100) / 100,
    minStockAlert: 5,
    isManagedInventory: true,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300',
    ...req.body
  };
  db.products.push(newProduct);
  res.status(201).json(newProduct);
});

// Medical Records Endpoints
app.get('/api/medical-records', (req, res) => {
  res.json(db.medicalRecords);
});

app.post('/api/medical-records', (req, res) => {
  const newRecord = {
    id: 'med-' + (db.medicalRecords.length + 1),
    consultationDate: new Date().toISOString(),
    vendorId: 'vendor-1',
    vetId: 'employee-3',
    ...req.body
  };
  db.medicalRecords.push(newRecord);
  res.status(201).json(newRecord);
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
