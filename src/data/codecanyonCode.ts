export interface CodeFile {
  name: string;
  path: string;
  language: string;
  content: string;
}

export const codecanyonFiles: CodeFile[] = [
  {
    name: "Estrutura do Monorepo",
    path: "projeto/ARQUITETURA.txt",
    language: "text",
    content: `royalpaws/
├── package.json
├── tsconfig.json
├── apps/
│   ├── api/                     # BACKEND: Node.js, Express & TypeScript
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── server.ts
│   │   │   ├── config/db.ts
│   │   │   ├── middlewares/
│   │   │   │   └── authMiddleware.ts
│   │   │   ├── models/
│   │   │   │   ├── User.ts
│   │   │   │   ├── Pet.ts
│   │   │   │   ├── MedicalRecord.ts
│   │   │   │   ├── Product.ts
│   │   │   │   └── Booking.ts
│   │   │   └── controllers/
│   │   │       └── BookingController.ts
│   │   └── dist/
│   ├── web/                     # DASHBOARD: React, Vite, Tailwind (ERP & Partner SaaS)
│   │   ├── package.json
│   │   ├── index.html
│   │   └── src/
│   │       ├── main.tsx
│   │       ├── App.tsx
│   │       ├── types.ts
│   │       └── components/
│   │           ├── VendorDashboard.tsx
│   │           ├── Marketplace.tsx
│   │           └── AuthPage.tsx
│   └── mobile/                  # MOBILE APP: React Native Expo, TypeScript & NativeWind
│       ├── package.json
│       ├── App.tsx
│       └── src/
│           ├── screens/
│           │   └── HomeScreen.tsx
│           ├── components/
│           │   └── PetCard.tsx
│           └── navigation/
│               └── AppNavigator.tsx`
  },
  {
    name: "Mongoose: User.ts",
    path: "apps/api/src/models/User.ts",
    language: "typescript",
    content: `import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  role: 'superadmin' | 'vendor' | 'employee' | 'customer';
  phone: string;
  avatarUrl?: string;
  companyName?: string; // Preenchido se role for 'vendor'
  isActive: boolean;
  vendorSubscription?: {
    plan: 'basic' | 'pro' | 'enterprise';
    status: 'active' | 'suspended' | 'cancelled';
    expiresAt: Date;
    trialEndsAt?: Date;
  };
  specialties?: string[]; // Preenchido se role for 'employee' (ex: 'banho', 'tosa', 'veterinário')
  commissionRate?: number; // Taxa de comissão para funcionários (ex: 0.20 para 20%)
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  role: { 
    type: String, 
    enum: ['superadmin', 'vendor', 'employee', 'customer'], 
    required: true 
  },
  phone: { type: String, required: true },
  avatarUrl: { type: String },
  companyName: { type: String, required: function(this: IUser) { return this.role === 'vendor'; } },
  isActive: { type: Boolean, default: true },
  vendorSubscription: {
    plan: { type: String, enum: ['basic', 'pro', 'enterprise'] },
    status: { type: String, enum: ['active', 'suspended', 'cancelled'] },
    expiresAt: { type: Date },
    trialEndsAt: { type: Date }
  },
  specialties: [{ type: String }],
  commissionRate: { type: Number, default: 0.0 }
}, {
  timestamps: true
});

// Índices para busca otimizada
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

export default model<IUser>('User', UserSchema);`
  },
  {
    name: "Mongoose: Pet.ts",
    path: "apps/api/src/models/Pet.ts",
    language: "typescript",
    content: `import { Schema, model, Document, Types } from 'mongoose';

export interface IPet extends Document {
  name: string;
  category: 'dog' | 'cat' | 'bird' | 'fish' | 'other';
  breed: string;
  ageMonths: number;
  gender: 'M' | 'F';
  size: 'small' | 'medium' | 'large';
  weight?: number;
  description: string;
  photos: string[];
  listingType: 'sale' | 'adoption';
  isB2C: boolean; // true se vendido por um petshop parceiro (B2C), false se por tutor individual (C2C)
  price?: number;
  vaccinated: boolean;
  dewormed: boolean;
  pedigree: boolean;
  ownerId: Types.ObjectId; // Referência ao modelo User (Tutor ou Vendor)
  status: 'available' | 'sold' | 'adopted';
  createdAt: Date;
}

const PetSchema = new Schema<IPet>({
  name: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    enum: ['dog', 'cat', 'bird', 'fish', 'other'], 
    required: true 
  },
  breed: { type: String, required: true, trim: true },
  ageMonths: { type: Number, required: true },
  gender: { type: String, enum: ['M', 'F'], required: true },
  size: { type: String, enum: ['small', 'medium', 'large'], required: true },
  weight: { type: Number },
  description: { type: String, required: true },
  photos: [{ type: String }],
  listingType: { type: String, enum: ['sale', 'adoption'], required: true },
  isB2C: { type: Boolean, default: false },
  price: { type: Number, required: function(this: IPet) { return this.listingType === 'sale'; } },
  vaccinated: { type: Boolean, default: false },
  dewormed: { type: Boolean, default: false },
  pedigree: { type: Boolean, default: false },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['available', 'sold', 'adopted'], default: 'available' }
}, {
  timestamps: true
});

PetSchema.index({ category: 1, breed: 1 });
PetSchema.index({ listingType: 1, status: 1 });
PetSchema.index({ ownerId: 1 });

export default model<IPet>('Pet', PetSchema);`
  },
  {
    name: "Mongoose: MedicalRecord.ts",
    path: "apps/api/src/models/MedicalRecord.ts",
    language: "typescript",
    content: `import { Schema, model, Document, Types } from 'mongoose';

export interface ITreatment {
  treatmentName: string;
  dosage: string;
  startDate: Date;
  endDate?: Date;
  notes?: string;
}

export interface IMedicalRecord extends Document {
  petId: Types.ObjectId; // Referência ao Pet do cliente
  customerId: Types.ObjectId; // Referência ao tutor do pet (User)
  vetId: Types.ObjectId; // Referência ao veterinário/colaborador (User)
  visitDate: Date;
  weight: number;
  temperature?: number;
  heartRate?: number;
  symptoms: string;
  diagnosis: string;
  treatments: ITreatment[];
  prescriptionNotes?: string;
  nextCheckupDate?: Date;
  createdAt: Date;
}

const TreatmentSchema = new Schema<ITreatment>({
  treatmentName: { type: String, required: true },
  dosage: { type: String, required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  notes: { type: String }
});

const MedicalRecordSchema = new Schema<IMedicalRecord>({
  petId: { type: Schema.Types.ObjectId, ref: 'Pet', required: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  vetId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  visitDate: { type: Date, default: Date.now },
  weight: { type: Number, required: true },
  temperature: { type: Number },
  heartRate: { type: Number },
  symptoms: { type: String, required: true },
  diagnosis: { type: String, required: true },
  treatments: [TreatmentSchema],
  prescriptionNotes: { type: String },
  nextCheckupDate: { type: Date }
}, {
  timestamps: true
});

MedicalRecordSchema.index({ petId: 1 });
MedicalRecordSchema.index({ customerId: 1 });

export default model<IMedicalRecord>('MedicalRecord', MedicalRecordSchema);`
  },
  {
    name: "Mongoose: Product.ts",
    path: "apps/api/src/models/Product.ts",
    language: "typescript",
    content: `import { Schema, model, Document, Types } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  sku: string;
  description?: string;
  category: string;
  price: number;
  stockQty: number;
  minStockAlert: number;
  vendorId: Types.ObjectId; // Referência ao lojista parceiro dono do estoque (User)
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true, trim: true },
  sku: { type: String, required: true, uppercase: true, trim: true },
  description: { type: String },
  category: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  stockQty: { type: Number, required: true, min: 0, default: 0 },
  minStockAlert: { type: Number, required: true, min: 0, default: 5 },
  vendorId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

// Composto único para garantir SKU por lojista
ProductSchema.index({ sku: 1, vendorId: 1 }, { unique: true });
ProductSchema.index({ vendorId: 1 });

export default model<IProduct>('Product', ProductSchema);`
  },
  {
    name: "Mongoose: Booking.ts",
    path: "apps/api/src/models/Booking.ts",
    language: "typescript",
    content: `import { Schema, model, Document, Types } from 'mongoose';

export interface IBooking extends Document {
  customerId: Types.ObjectId; // Referência ao cliente (User)
  petId: Types.ObjectId; // Referência ao pet (Pet)
  employeeId: Types.ObjectId; // Referência ao profissional que executa (User)
  serviceType: 'banho' | 'tosa' | 'banho_e_tosa' | 'consulta_vet';
  dateTime: Date;
  durationMinutes: number;
  price: number;
  commissionAmount: number; // Calculado no faturamento do serviço
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  petId: { type: Schema.Types.ObjectId, ref: 'Pet', required: true },
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

BookingSchema.index({ employeeId: 1, dateTime: 1 });
BookingSchema.index({ customerId: 1 });
BookingSchema.index({ status: 1 });

export default model<IBooking>('Booking', BookingSchema);`
  },
  {
    name: "Express: BookingController.ts",
    path: "apps/api/src/controllers/BookingController.ts",
    language: "typescript",
    content: `import { Request, Response } from 'express';
import Booking from '../models/Booking';
import User from '../models/User';

export class BookingController {
  
  /**
   * Realiza o agendamento de um serviço com validação estrita anti-conflito
   */
  public async create(req: Request, res: Response): Promise<Response> {
    const { customerId, petId, employeeId, serviceType, dateTime, durationMinutes, price, notes } = req.body;

    try {
      // 1. Validações Básicas
      if (!customerId || !petId || !employeeId || !serviceType || !dateTime || !price) {
        return res.status(400).json({ 
          success: false, 
          message: 'Todos os campos obrigatórios devem ser preenchidos.' 
        });
      }

      // 2. Buscar informações do Funcionário
      const employee = await User.findById(employeeId);
      if (!employee || employee.role !== 'employee') {
        return res.status(404).json({ 
          success: false, 
          message: 'Profissional especialista não encontrado no sistema.' 
        });
      }

      // 3. Conversão de datas e cálculo da janela de horário do serviço
      const startService = new Date(dateTime);
      const serviceDuration = durationMinutes || 45;
      const endService = new Date(startService.getTime() + serviceDuration * 60000);

      // 4. REGRA DE NEGÓCIO CRÍTICA: Prevenção de conflito de agenda do funcionário
      // O mesmo profissional NÃO pode ter agendamentos sobrepostos.
      const hasConflict = await Booking.findOne({
        employeeId,
        status: { $ne: 'cancelled' }, // Ignora horários cancelados
        $or: [
          // Caso 1: O agendamento proposto começa DURANTE outro serviço ativo
          {
            dateTime: { $lte: startService },
            $expr: {
              $gt: [
                { $add: ['$dateTime', { $multiply: ['$durationMinutes', 60000] }] },
                startService
              ]
            }
          },
          // Caso 2: O agendamento proposto termina DURANTE outro serviço ativo
          {
            dateTime: { $lt: endService },
            $expr: {
              $gt: [
                { $add: ['$dateTime', { $multiply: ['$durationMinutes', 60000] }] },
                endService
              ]
            }
          }
        ]
      });

      if (hasConflict) {
        return res.status(409).json({
          success: false,
          message: 'Conflito de Agenda: O especialista selecionado já possui um atendimento reservado neste mesmo horário.'
        });
      }

      // 5. Cálculo automático de comissão baseada na taxa do funcionário
      const commissionRate = employee.commissionRate || 0.15; // padrão 15%
      const commissionAmount = Number((price * commissionRate).toFixed(2));

      // 6. Persistência
      const booking = new Booking({
        customerId,
        petId,
        employeeId,
        serviceType,
        dateTime: startService,
        durationMinutes: serviceDuration,
        price,
        commissionAmount,
        status: 'scheduled',
        notes
      });

      await booking.save();

      return res.status(201).json({
        success: true,
        message: 'Agendamento registrado e integrado ao ERP com sucesso!',
        data: booking
      });

    } catch (error: any) {
      return res.status(500).json({ 
        success: false, 
        message: 'Erro interno do servidor ao criar agendamento.', 
        error: error.message 
      });
    }
  }
}`
  },
  {
    name: "Middleware: authMiddleware.ts",
    path: "apps/api/src/middlewares/authMiddleware.ts",
    language: "typescript",
    content: `import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'superadmin' | 'vendor' | 'employee' | 'customer';
  };
}

/**
 * Middleware para validar o Token JWT Mock/Real nas requisições do ecossistema
 */
export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Access Denied', 
      message: 'Token de autorização não fornecido ou inválido.' 
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // No ambiente PetSphere, decodificamos a base64 ou validamos o payload assinado
    if (token.startsWith('mock-jwt-')) {
      const base64Payload = token.replace('mock-jwt-', '');
      const jsonString = Buffer.from(base64Payload, 'base64').toString('utf-8');
      req.user = JSON.parse(jsonString);
      return next();
    }
    
    return res.status(401).json({ 
      error: 'Invalid Token', 
      message: 'Assinatura do token de segurança inválida.' 
    });
  } catch (err) {
    return res.status(401).json({ 
      error: 'Invalid Token', 
      message: 'O token fornecido está corrompido ou expirou.' 
    });
  }
}

/**
 * Middleware para restrição de rotas baseadas nos cargos autorizados (RBAC)
 */
export function authorizeRoles(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Usuário não autenticado.' 
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'Seu perfil de acesso não possui privilégios para esta operação.' 
      });
    }

    next();
  };
}`
  },
  {
    name: "React Native: HomeScreen.tsx",
    path: "apps/mobile/src/screens/HomeScreen.tsx",
    language: "typescript",
    content: `import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock de dados dos Pets baseados nos esquemas do marketplace
const petsMock = [
  { id: '1', name: 'Max', breed: 'Golden Retriever', age: '3 meses', price: 'R$ 2.500', listingType: 'sale', photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300', isB2C: true },
  { id: '2', name: 'Bella', breed: 'Gato Persa', age: '2 meses', price: 'Grátis', listingType: 'adoption', photo: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300', isB2C: false },
  { id: '3', name: 'Bidu', breed: 'Schnauzer', age: '4 meses', price: 'R$ 1.800', listingType: 'sale', photo: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300', isB2C: true },
  { id: '4', name: 'Luna', breed: 'SRD', age: '6 meses', price: 'Grátis', listingType: 'adoption', photo: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300', isB2C: false },
];

const categories = [
  { id: 'all', label: 'Todos', icon: '🐾' },
  { id: 'dog', label: 'Cães', icon: '🐶' },
  { id: 'cat', label: 'Gatos', icon: '🐱' },
  { id: 'bird', label: 'Aves', icon: '🦜' },
];

export default function HomeScreen({ navigation }: any) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.locationLabel}>Sua Localização</Text>
            <Text style={styles.locationValue}>📍 São Paulo, SP</Text>
          </View>
          <TouchableOpacity style={styles.cartButton}>
            <Text style={{ fontSize: 18 }}>🛒</Text>
            <View style={styles.cartBadge} />
          </TouchableOpacity>
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchContainer}>
          <TextInput 
            placeholder="Pesquisar raças, brinquedos ou clínicas..."
            placeholderTextColor="#888"
            style={styles.searchInput}
          />
        </View>

        {/* CATEGORIES HORIZONTAL CAROUSEL */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Categorias</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {categories.map(cat => (
              <TouchableOpacity 
                key={cat.id} 
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.categoryCard, 
                  selectedCategory === cat.id && styles.categoryCardSelected
                ]}
              >
                <Text style={{ fontSize: 18 }}>{cat.icon}</Text>
                <Text style={[styles.categoryLabel, selectedCategory === cat.id && styles.categoryLabelSelected]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* HERO BANNER FOR BOOKINGS */}
        <View style={styles.promoBanner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.promoTag}>AGENDAMENTO ERP</Text>
            <Text style={styles.promoTitle}>Banho, Tosa & Veterinário</Text>
            <Text style={styles.promoSubtitle}>Reserve o melhor horário com especialistas integrados ao ERP PetSphere.</Text>
            <TouchableOpacity style={styles.promoButton}>
              <Text style={styles.promoButtonText}>Agendar Agora</Text>
            </TouchableOpacity>
          </View>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300' }} 
            style={styles.promoImage} 
          />
        </View>

        {/* PET GRID */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Pets em Destaque</Text>
          <View style={styles.grid}>
            {petsMock.map(pet => (
              <View key={pet.id} style={styles.petCard}>
                <Image source={{ uri: pet.photo }} style={styles.petImage} />
                
                {/* Sale / Adoption Tag */}
                <View style={[styles.typeTag, { backgroundColor: pet.listingType === 'sale' ? '#F59E0B' : '#10B981' }]}>
                  <Text style={styles.typeTagText}>
                    {pet.listingType === 'sale' ? 'Compra' : 'Adoção'}
                  </Text>
                </View>

                {/* Favorite button */}
                <TouchableOpacity onPress={() => toggleFavorite(pet.id)} style={styles.favBtn}>
                  <Text style={{ color: favorites.includes(pet.id) ? '#EF4444' : '#64748B', fontSize: 14 }}>
                    {favorites.includes(pet.id) ? '❤️' : '🖤'}
                  </Text>
                </TouchableOpacity>

                <View style={styles.petDetails}>
                  <Text style={styles.petName}>{pet.name}</Text>
                  <Text style={styles.petBreed}>{pet.breed} • {pet.age}</Text>
                  <View style={styles.petFooter}>
                    <Text style={styles.petPrice}>{pet.price}</Text>
                    <Text style={styles.tagB2C}>{pet.isB2C ? '🏢 Petshop' : '👤 Tutor'}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12 },
  locationLabel: { fontSize: 10, color: '#64748B', fontWeight: 'bold', uppercase: true },
  locationValue: { fontSize: 13, fontWeight: '800', color: '#1E293B', marginTop: 2 },
  cartButton: { width: 40, height: 40, backgroundColor: '#FFF', borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' },
  cartBadge: { width: 8, height: 8, backgroundColor: '#EF4444', borderRadius: 4, position: 'absolute', top: 10, right: 10 },
  searchContainer: { paddingHorizontal: 16, marginTop: 16 },
  searchInput: { height: 46, backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 16, fontSize: 12, color: '#1E293B', borderWidth: 1, borderColor: '#F1F5F9' },
  sectionContainer: { marginTop: 24, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#1E293B', marginBottom: 12, trackingTight: true },
  categoryCard: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#FFF', borderRadius: 12, gap: 8, borderWidth: 1, borderColor: '#F1F5F9' },
  categoryCardSelected: { backgroundColor: '#10B981', borderColor: '#10B981' },
  categoryLabel: { fontSize: 11, fontWeight: 'bold', color: '#64748B' },
  categoryLabelSelected: { color: '#0F172A' },
  promoBanner: { marginHorizontal: 16, marginTop: 24, padding: 16, backgroundColor: '#0F172A', borderRadius: 20, flexDirection: 'row', overflow: 'hidden' },
  promoTag: { color: '#10B981', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  promoTitle: { color: '#FFF', fontSize: 16, fontWeight: '900', marginTop: 4 },
  promoSubtitle: { color: '#94A3B8', fontSize: 10, marginTop: 4, lineHeight: 14 },
  promoButton: { backgroundColor: '#10B981', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, marginTop: 12 },
  promoButtonText: { color: '#0F172A', fontSize: 11, fontWeight: 'bold' },
  promoImage: { width: 100, height: 100, borderRadius: 12, marginLeft: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  petCard: { width: '48%', backgroundColor: '#FFF', borderRadius: 16, overflow: 'hidden', borderContent: '1px solid #F1F5F9', marginBottom: 12, position: 'relative' },
  petImage: { width: '100%', height: 120, objectFit: 'cover' },
  typeTag: { position: 'absolute', top: 8, left: 8, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  typeTagText: { color: '#FFF', fontSize: 8, fontWeight: 'bold' },
  favBtn: { position: 'absolute', top: 8, right: 8, width: 28, height: 28, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  petDetails: { padding: 10 },
  petName: { fontSize: 12, fontWeight: 'bold', color: '#1E293B' },
  petBreed: { fontSize: 9, color: '#64748B', marginTop: 2 },
  petFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 6, borderTopWidth: 1, borderTopColor: '#F8FAFC' },
  petPrice: { fontSize: 11, fontWeight: '800', color: '#0F172A' },
  tagB2C: { fontSize: 8, color: '#64748B', fontWeight: 'bold' },
});`
  }
];
