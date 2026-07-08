import { Schema, model, models, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  role: 'superadmin' | 'vendor' | 'employee' | 'customer';
  phone: string;
  avatarUrl?: string;
  companyName?: string;
  isActive: boolean;
  vendorSubscription?: {
    plan: 'basic' | 'pro' | 'enterprise';
    status: 'active' | 'suspended' | 'cancelled';
    expiresAt: Date;
    trialEndsAt?: Date;
  };
  specialties?: string[];
  commissionRate?: number; // 0.15 represents 15%
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
  commissionRate: { type: Number, default: 0.15 }
}, {
  timestamps: true
});

UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

export const User: Model<IUser> = (models.User as Model<IUser>) || model<IUser>('User', UserSchema);
export default User;
