export interface User {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'vendor' | 'employee' | 'customer';
  companyName?: string;
  phone?: string;
  avatarUrl?: string;
  vendorSubscription?: {
    plan: string;
    status: string;
    expiresAt: string;
  };
  specialties?: string[];
  commissionRate?: number;
}

export interface Pet {
  id: string;
  name: string;
  category: 'dog' | 'cat' | 'bird' | 'fish' | 'reptile' | 'other';
  breed: string;
  age: number;
  gender: 'male' | 'female' | 'unknown';
  size: 'small' | 'medium' | 'large' | 'extra_large';
  description: string;
  photos: string[];
  listingType: 'sale' | 'adoption';
  price?: number;
  status: 'available' | 'reserved' | 'adopted_sold' | 'inactive';
  ownerId: string;
  ownerType: 'vendor' | 'customer';
  vaccinated?: boolean;
  dewormed?: boolean;
  neutered?: boolean;
  pedigree?: boolean;
}

export interface Booking {
  id: string;
  vendorId: string;
  customerId: string;
  customerName: string;
  petId: string;
  petName: string;
  employeeId: string;
  employeeName: string;
  serviceType: 'banho' | 'tosa' | 'banho_e_tosa' | 'consulta_vet' | 'outros';
  dateTime: string;
  durationMinutes: number;
  price: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  commissionPaid?: boolean;
  commissionAmount?: number;
}

export interface Product {
  id: string;
  vendorId: string;
  name: string;
  sku: string;
  barcode?: string;
  description: string;
  price: number;
  costPrice?: number;
  category: string;
  stockQty: number;
  minStockAlert: number;
  isManagedInventory: boolean;
  isActive: boolean;
  imageUrl?: string;
}

export interface MedicalRecord {
  id: string;
  petId: string;
  petName: string;
  customerId: string;
  vetId: string;
  vendorId: string;
  consultationDate: string;
  symptoms: string;
  diagnosis: string;
  weight?: number;
  temperature?: number;
  heartRate?: number;
  treatments: Array<{
    treatmentName: string;
    dosage?: string;
    frequency?: string;
    startDate?: string;
    endDate?: string;
    notes?: string;
  }>;
  vaccinesAdministered?: string[];
  prescriptionNotes?: string;
  followUpDate?: string;
}
