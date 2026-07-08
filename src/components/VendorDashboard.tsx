import React, { useState } from 'react';
import { Booking, Product, MedicalRecord, User, Pet } from '../types';
import { 
  DollarSign, ShoppingBag, Calendar, AlertTriangle, ShieldCheck, 
  Sparkles, Plus, Check, Edit3, Trash2, ShieldAlert, Heart, Activity,
  Folder, FileText, Copy, Terminal
} from 'lucide-react';
import { codecanyonFiles } from '../data/codecanyonCode';

interface VendorDashboardProps {
  bookings: Booking[];
  products: Product[];
  medicalRecords: MedicalRecord[];
  users: User[];
  pets: Pet[];
  onBookingUpdate: () => void;
  onProductUpdate: () => void;
  onRecordUpdate: () => void;
}

export default function VendorDashboard({ 
  bookings, products, medicalRecords, users, pets, 
  onBookingUpdate, onProductUpdate, onRecordUpdate 
}: VendorDashboardProps) {

  const [activeTab, setActiveTab] = useState<'bookings' | 'inventory' | 'clinic' | 'add_booking' | 'code_explorer'>('bookings');
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [copiedFileIdx, setCopiedFileIdx] = useState<number | null>(null);
  
  // Dashboard Metrics Calculations
  const totalRevenue = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + b.price, 0);

  const completedSales = bookings.filter(b => b.status === 'completed').length;
  
  const todayStart = new Date();
  todayStart.setHours(0,0,0,0);
  const todayEnd = new Date();
  todayEnd.setHours(23,59,59,999);
  
  const todayBookingsCount = bookings.filter(b => {
    const bDate = new Date(b.dateTime);
    return bDate >= todayStart && bDate <= todayEnd && b.status !== 'cancelled';
  }).length;

  const lowStockProducts = products.filter(p => p.stockQty <= p.minStockAlert);

  // Forms states
  const [newBooking, setNewBooking] = useState({
    customerId: 'customer-1',
    petId: 'pet-1',
    employeeId: '',
    serviceType: 'banho_e_tosa',
    dateTime: '',
    durationMinutes: 60,
    price: 120,
    notes: ''
  });
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    price: 0,
    category: 'Alimentos',
    stockQty: 10,
    minStockAlert: 3,
    description: ''
  });
  const [productError, setProductError] = useState<string | null>(null);
  const [productSuccess, setProductSuccess] = useState<string | null>(null);

  const [newRecord, setNewRecord] = useState({
    petId: 'pet-1',
    customerId: 'customer-1',
    vetId: 'employee-3',
    symptoms: '',
    diagnosis: '',
    weight: 10,
    temperature: 38.5,
    heartRate: 100,
    treatmentName: '',
    treatmentDosage: '',
    treatmentNotes: '',
    prescriptionNotes: ''
  });
  const [recordError, setRecordError] = useState<string | null>(null);
  const [recordSuccess, setRecordSuccess] = useState<string | null>(null);

  // Handlers
  const handleBookingStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        onBookingUpdate();
      }
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);
    setBookingSuccess(null);

    const petObj = pets.find(p => p.id === newBooking.petId);
    const customerObj = users.find(u => u.id === newBooking.customerId);

    const payload = {
      ...newBooking,
      customerName: customerObj?.name || 'Cliente',
      petName: petObj?.name || 'Pet'
    };

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao criar agendamento');
      }
      setBookingSuccess('Agendamento cadastrado com sucesso!');
      onBookingUpdate();
      setNewBooking({
        customerId: 'customer-1',
        petId: 'pet-1',
        employeeId: '',
        serviceType: 'banho_e_tosa',
        dateTime: '',
        durationMinutes: 60,
        price: 120,
        notes: ''
      });
    } catch (err: any) {
      setBookingError(err.message);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductError(null);
    setProductSuccess(null);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao adicionar produto');
      }
      setProductSuccess('Produto adicionado com sucesso!');
      onProductUpdate();
      setNewProduct({
        name: '',
        sku: '',
        price: 0,
        category: 'Alimentos',
        stockQty: 10,
        minStockAlert: 3,
        description: ''
      });
    } catch (err: any) {
      setProductError(err.message);
    }
  };

  const handleRecordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecordError(null);
    setRecordSuccess(null);

    const petObj = pets.find(p => p.id === newRecord.petId);

    const payload = {
      petId: newRecord.petId,
      petName: petObj?.name || 'Pet',
      customerId: newRecord.customerId,
      vetId: newRecord.vetId,
      symptoms: newRecord.symptoms,
      diagnosis: newRecord.diagnosis,
      weight: Number(newRecord.weight),
      temperature: Number(newRecord.temperature),
      heartRate: Number(newRecord.heartRate),
      treatments: [
        {
          treatmentName: newRecord.treatmentName,
          dosage: newRecord.treatmentDosage,
          notes: newRecord.treatmentNotes
        }
      ],
      prescriptionNotes: newRecord.prescriptionNotes
    };

    try {
      const response = await fetch('/api/medical-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error('Erro ao salvar prontuário veterinário');
      }
      setRecordSuccess('Prontuário salvo com sucesso!');
      onRecordUpdate();
      setNewRecord({
        petId: 'pet-1',
        customerId: 'customer-1',
        vetId: 'employee-3',
        symptoms: '',
        diagnosis: '',
        weight: 10,
        temperature: 38.5,
        heartRate: 100,
        treatmentName: '',
        treatmentDosage: '',
        treatmentNotes: '',
        prescriptionNotes: ''
      });
    } catch (err: any) {
      setRecordError(err.message);
    }
  };

  const handleCopyCode = (content: string, index: number) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedFileIdx(index);
      setTimeout(() => setCopiedFileIdx(null), 2000);
    }).catch(err => {
      console.error('Falha ao copiar', err);
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[680px]">
      
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 px-2.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px] uppercase tracking-wider border border-emerald-500/15">
              Área Administrativa
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2">
            <span>Painel de Controle</span>
          </h2>
          <p className="text-slate-400 text-xs mt-1">Gerenciamento completo de Banho & Tosa, Estoque, Prontuários e Comissões.</p>
        </div>

        {/* Store Status */}
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/15 rounded-lg flex items-center justify-center text-emerald-400 font-bold">
            ✓
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Unidade Principal</p>
            <span className="text-xs text-slate-200 font-medium">Funcionamento Regular</span>
          </div>
        </div>
      </div>

      {/* THREE CORE METRIC CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        
        {/* Faturamento (Revenue) Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Faturamento (Serviços)</p>
              <h3 className="text-2xl font-black text-emerald-400 mt-1 font-mono">
                R$ {totalRevenue.toFixed(2)}
              </h3>
            </div>
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 rounded-lg">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="text-emerald-400 font-bold">↑ 14%</span>
            <span>este mês</span>
          </div>
        </div>

        {/* Vendas Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Atendimentos Concluídos</p>
              <h3 className="text-2xl font-black text-amber-500 mt-1 font-mono">
                {completedSales}
              </h3>
            </div>
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/15 text-amber-500 rounded-lg">
              <ShoppingBag size={18} />
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="text-amber-500 font-bold">+{completedSales}</span>
            <span>clientes satisfeitos</span>
          </div>
        </div>

        {/* Agendamentos do Dia Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Agendamentos Hoje</p>
              <h3 className="text-2xl font-black text-sky-400 mt-1 font-mono">
                {todayBookingsCount}
              </h3>
            </div>
            <div className="p-2.5 bg-sky-500/10 border border-sky-500/15 text-sky-400 rounded-lg">
              <Calendar size={18} />
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1.5">
            {lowStockProducts.length > 0 ? (
              <span className="text-rose-400 font-bold flex items-center gap-0.5 animate-pulse">
                <AlertTriangle size={12} />
                {lowStockProducts.length} itens sem estoque!
              </span>
            ) : (
              <span className="text-emerald-400 font-semibold">✓ Estoque de produtos estável</span>
            )}
          </div>
        </div>

      </div>

      {/* TABS SELECTOR */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3 mb-5">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'bookings'
              ? 'bg-emerald-500 text-slate-950'
              : 'text-slate-400 hover:text-slate-200 bg-slate-950/40 border border-slate-800'
          }`}
        >
          📅 Agenda / Banho & Tosa
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'inventory'
              ? 'bg-emerald-500 text-slate-950'
              : 'text-slate-400 hover:text-slate-200 bg-slate-950/40 border border-slate-800'
          }`}
        >
          📦 Controle de Estoque
        </button>
        <button
          onClick={() => setActiveTab('clinic')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'clinic'
              ? 'bg-emerald-500 text-slate-950'
              : 'text-slate-400 hover:text-slate-200 bg-slate-950/40 border border-slate-800'
          }`}
        >
          🩺 Prontuários Veterinários
        </button>
        <button
          onClick={() => setActiveTab('add_booking')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border border-amber-500/30 ${
            activeTab === 'add_booking'
              ? 'bg-amber-500 text-slate-950'
              : 'text-amber-400 hover:text-amber-300 bg-slate-950/40'
          }`}
        >
          <Plus size={14} />
          <span>Criar Agendamento (ERP)</span>
        </button>
        <button
          onClick={() => setActiveTab('code_explorer')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'code_explorer'
              ? 'bg-emerald-500 text-slate-950'
              : 'text-slate-400 hover:text-slate-200 bg-slate-950/40 border border-slate-800'
          }`}
        >
          📂 Código Base (CodeCanyon)
        </button>
      </div>

      {/* TAB CONTENT 1: ACTIVE AGENDA */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">Agendamentos de Serviços</h4>
            <span className="text-xs text-slate-500">Mude status para gerar comissão ao funcionário</span>
          </div>

          <div className="overflow-x-auto bg-slate-950 border border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-3">Horário</th>
                  <th className="p-3">Cliente / Pet</th>
                  <th className="p-3">Profissional</th>
                  <th className="p-3">Serviço</th>
                  <th className="p-3">Valor</th>
                  <th className="p-3">Comissão Est.</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {bookings.map((booking) => {
                  const bDate = new Date(booking.dateTime);
                  return (
                    <tr key={booking.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-200">
                        {bDate.toLocaleDateString('pt-BR', {day: 'numeric', month: 'short'})} às {bDate.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-slate-200">{booking.customerName}</span>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <span>🐾 {booking.petName}</span>
                        </div>
                      </td>
                      <td className="p-3 text-slate-400 font-medium">
                        {booking.employeeName}
                      </td>
                      <td className="p-3 font-semibold">
                        <span className="bg-slate-800 px-2 py-0.5 rounded-md text-slate-300">
                          {booking.serviceType.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-400">
                        R$ {booking.price.toFixed(2)}
                      </td>
                      <td className="p-3 font-mono text-amber-500 font-bold">
                        R$ {booking.commissionAmount ? booking.commissionAmount.toFixed(2) : '0.00'}
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-block ${
                          booking.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          booking.status === 'scheduled' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          booking.status === 'cancelled' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                        }`}>
                          {booking.status === 'completed' ? 'CONCLUÍDO' :
                           booking.status === 'scheduled' ? 'AGENDADO' :
                           booking.status === 'cancelled' ? 'CANCELADO' : 'EM ANDAMENTO'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {booking.status === 'scheduled' && (
                            <>
                              <button 
                                onClick={() => handleBookingStatusChange(booking.id, 'completed')}
                                className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-lg text-xs font-bold transition-colors"
                                title="Concluir serviço"
                              >
                                <Check size={13} />
                              </button>
                              <button 
                                onClick={() => handleBookingStatusChange(booking.id, 'cancelled')}
                                className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs font-bold transition-colors"
                                title="Cancelar agendamento"
                              >
                                <Trash2 size={13} />
                              </button>
                            </>
                          )}
                          {booking.status === 'completed' && (
                            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5">
                              <Check size={11} /> Pago
                            </span>
                          )}
                          {booking.status === 'cancelled' && (
                            <span className="text-[10px] text-rose-500/60 font-bold">Cancelado</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: INVENTORY MANAGEMENT */}
      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products List (Left & Center) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">Estoque de Produtos</h4>
            <div className="overflow-x-auto bg-slate-950 border border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase">
                    <th className="p-3">Produto</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Categoria</th>
                    <th className="p-3">Preço</th>
                    <th className="p-3">Qtd. Estoque</th>
                    <th className="p-3">Status Estoque</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-900/60">
                      <td className="p-3 font-semibold text-slate-200">{p.name}</td>
                      <td className="p-3 font-mono text-slate-400">{p.sku}</td>
                      <td className="p-3"><span className="bg-slate-800 px-2 py-0.5 rounded-sm">{p.category}</span></td>
                      <td className="p-3 font-mono font-bold text-emerald-400">R$ {p.price.toFixed(2)}</td>
                      <td className="p-3 font-mono font-bold">{p.stockQty} un</td>
                      <td className="p-3">
                        {p.stockQty <= p.minStockAlert ? (
                          <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-md font-bold text-[10px] uppercase flex items-center gap-1 w-max">
                            <ShieldAlert size={11} /> Alerta Mínimo ({p.minStockAlert})
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md font-bold text-[10px] uppercase flex items-center gap-1 w-max">
                            <ShieldCheck size={11} /> Estável
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Product Form (Right) */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <Plus size={14} className="text-emerald-400" />
                <span>Adicionar ao Estoque</span>
              </h4>

              {productError && (
                <div className="p-2.5 mb-3 bg-red-500/10 text-red-400 rounded-lg text-xs font-mono">
                  {productError}
                </div>
              )}

              {productSuccess && (
                <div className="p-2.5 mb-3 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-medium">
                  {productSuccess}
                </div>
              )}

              <form onSubmit={handleProductSubmit} className="space-y-3 text-slate-300 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nome do Produto</label>
                  <input 
                    type="text" 
                    required
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="ex. Coleira Antitratamento"
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">SKU único</label>
                    <input 
                      type="text" 
                      required
                      value={newProduct.sku}
                      onChange={e => setNewProduct({...newProduct, sku: e.target.value.toUpperCase()})}
                      placeholder="SKU-123"
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Categoria</label>
                    <select 
                      value={newProduct.category}
                      onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Alimentos">Alimentos</option>
                      <option value="Higiene">Higiene</option>
                      <option value="Farmácia">Farmácia</option>
                      <option value="Brinquedos">Brinquedos</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Preço (R$)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      required
                      value={newProduct.price || ''}
                      onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
                      placeholder="0.00"
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Estoque</label>
                    <input 
                      type="number" 
                      required
                      value={newProduct.stockQty}
                      onChange={e => setNewProduct({...newProduct, stockQty: Number(e.target.value)})}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Alerta Mín.</label>
                    <input 
                      type="number" 
                      required
                      value={newProduct.minStockAlert}
                      onChange={e => setNewProduct({...newProduct, minStockAlert: Number(e.target.value)})}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Descrição</label>
                  <textarea 
                    rows={2}
                    value={newProduct.description}
                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                    placeholder="Descrição para inventário..."
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold rounded-lg transition-colors"
                >
                  Cadastrar Produto
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: CLINIC & MEDICAL RECORDS */}
      {activeTab === 'clinic' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Medical Records History */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">Histórico de Prontuários Clinicos</h4>
            
            {medicalRecords.map(record => (
              <div key={record.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1 px-2 rounded-md bg-amber-500/10 text-amber-400 font-bold text-[10px]">
                      CONSULTA VET
                    </span>
                    <h5 className="font-extrabold text-slate-200">{record.petName}</h5>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    {new Date(record.consultationDate).toLocaleDateString('pt-BR')} {new Date(record.consultationDate).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
                  <div><span className="text-slate-500 font-bold uppercase block text-[9px]">Peso:</span> <strong className="text-slate-300">{record.weight || '--'} kg</strong></div>
                  <div><span className="text-slate-500 font-bold uppercase block text-[9px]">Temperatura:</span> <strong className="text-slate-300">{record.temperature || '--'} °C</strong></div>
                  <div><span className="text-slate-500 font-bold uppercase block text-[9px]">Fid. Cardíaca:</span> <strong className="text-slate-300">{record.heartRate || '--'} bpm</strong></div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <p><strong>Sintomas:</strong> <span className="text-slate-400">{record.symptoms}</span></p>
                  <p><strong>Diagnóstico:</strong> <span className="text-slate-400">{record.diagnosis}</span></p>
                </div>

                {record.treatments && record.treatments.length > 0 && (
                  <div className="pt-2 border-t border-slate-900 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">Tratamentos Prescritos:</span>
                    {record.treatments.map((t, idx) => (
                      <div key={idx} className="bg-slate-900/40 p-2 rounded-lg border border-slate-900">
                        <strong className="text-slate-200 block text-xs">{t.treatmentName}</strong>
                        <p className="text-slate-400 text-[11px] mt-0.5">Frequência: {t.frequency || 'Não informado'} • Dosagem: {t.dosage || 'Não informado'}</p>
                        {t.notes && <p className="text-[10px] text-slate-500 italic mt-0.5">Nota: {t.notes}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Medical Record Form */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Activity className="text-amber-500" size={14} />
              <span>Novo Prontuário Veterinário</span>
            </h4>

            {recordError && (
              <div className="p-2.5 mb-3 bg-red-500/10 text-red-400 rounded-lg text-xs font-mono">
                {recordError}
              </div>
            )}

            {recordSuccess && (
              <div className="p-2.5 mb-3 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-medium">
                {recordSuccess}
              </div>
            )}

            <form onSubmit={handleRecordSubmit} className="space-y-3 text-slate-300 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Selecione o Pet Clinico</label>
                <select 
                  value={newRecord.petId}
                  onChange={e => {
                    const selected = pets.find(p => p.id === e.target.value);
                    setNewRecord({...newRecord, petId: e.target.value, customerId: selected?.ownerId || 'customer-1'});
                  }}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  {pets.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.breed})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Peso (kg)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    required
                    value={newRecord.weight}
                    onChange={e => setNewRecord({...newRecord, weight: Number(e.target.value)})}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Temp (°C)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    required
                    value={newRecord.temperature}
                    onChange={e => setNewRecord({...newRecord, temperature: Number(e.target.value)})}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">H.Rate (bpm)</label>
                  <input 
                    type="number" 
                    required
                    value={newRecord.heartRate}
                    onChange={e => setNewRecord({...newRecord, heartRate: Number(e.target.value)})}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Sintomas Observados</label>
                <input 
                  type="text" 
                  required
                  value={newRecord.symptoms}
                  onChange={e => setNewRecord({...newRecord, symptoms: e.target.value})}
                  placeholder="Coceira, febre, letargia..."
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Diagnóstico Final</label>
                <input 
                  type="text" 
                  required
                  value={newRecord.diagnosis}
                  onChange={e => setNewRecord({...newRecord, diagnosis: e.target.value})}
                  placeholder="ex. Dermatite Atópica leve"
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide block">Prescrição de Tratamento</span>
                <input 
                  type="text" 
                  value={newRecord.treatmentName}
                  onChange={e => setNewRecord({...newRecord, treatmentName: e.target.value})}
                  placeholder="Medicamento ou Shampoo"
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-md text-slate-200 focus:outline-none focus:border-emerald-500 text-xs"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    value={newRecord.treatmentDosage}
                    onChange={e => setNewRecord({...newRecord, treatmentDosage: e.target.value})}
                    placeholder="Dosagem ex: 5 gotas"
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-md text-slate-200 focus:outline-none focus:border-emerald-500 text-xs"
                  />
                  <input 
                    type="text" 
                    value={newRecord.treatmentNotes}
                    onChange={e => setNewRecord({...newRecord, treatmentNotes: e.target.value})}
                    placeholder="Frequência ex: 2x ao dia"
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-md text-slate-200 focus:outline-none focus:border-emerald-500 text-xs"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-lg transition-colors"
              >
                Salvar Prontuário Clínico
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: COLLISION CREATOR FOR BOOKING */}
      {activeTab === 'add_booking' && (
        <div className="max-w-xl mx-auto bg-slate-950 border border-slate-800 rounded-xl p-5">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4 pb-2 border-b border-slate-800 flex items-center gap-2">
            <span>📅</span>
            <span>Cadastro Manual de Agendamento (Admin ERP)</span>
          </h4>

          {bookingError && (
            <div className="p-3 mb-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex gap-2 items-start font-mono">
              <AlertTriangle size={15} className="shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">CONFLITO DETECTADO (Regra de Negócio):</span>
                <p className="mt-1 leading-relaxed text-[11px]">{bookingError}</p>
              </div>
            </div>
          )}

          {bookingSuccess && (
            <div className="p-3 mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex gap-2 items-start">
              <Check size={15} className="shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Sucesso no Cadastro!</span>
                <p className="mt-1 leading-relaxed text-[11px]">{bookingSuccess}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs text-slate-300">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Selecione o Cliente</label>
                <select
                  value={newBooking.customerId}
                  onChange={e => setNewBooking({...newBooking, customerId: e.target.value})}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  {users.filter(u => u.role === 'customer').map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Selecione o Pet</label>
                <select
                  value={newBooking.petId}
                  onChange={e => setNewBooking({...newBooking, petId: e.target.value})}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  {pets.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.breed})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tipo de Serviço</label>
                <select
                  value={newBooking.serviceType}
                  onChange={e => {
                    const priceMap: Record<string, number> = {
                      banho: 60,
                      tosa: 80,
                      banho_e_tosa: 120,
                      consulta_vet: 200,
                      outros: 50
                    };
                    setNewBooking({
                      ...newBooking, 
                      serviceType: e.target.value,
                      price: priceMap[e.target.value] || 50
                    });
                  }}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="banho">Banho (R$ 60)</option>
                  <option value="tosa">Tosa (R$ 80)</option>
                  <option value="banho_e_tosa">Banho e Tosa Completo (R$ 120)</option>
                  <option value="consulta_vet">Consulta Vet (R$ 200)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Preço Cobrado (R$)</label>
                <input
                  type="number"
                  required
                  value={newBooking.price}
                  onChange={e => setNewBooking({...newBooking, price: Number(e.target.value)})}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Profissional Especialista</label>
                <select
                  value={newBooking.employeeId}
                  onChange={e => setNewBooking({...newBooking, employeeId: e.target.value})}
                  required
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Selecione o profissional...</option>
                  {users.filter(u => u.role === 'employee').map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.specialties?.join(', ')})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Duração (Minutos)</label>
                <input
                  type="number"
                  required
                  value={newBooking.durationMinutes}
                  onChange={e => setNewBooking({...newBooking, durationMinutes: Number(e.target.value)})}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Data e Hora do Início</label>
              <input
                type="datetime-local"
                required
                value={newBooking.dateTime}
                onChange={e => setNewBooking({...newBooking, dateTime: e.target.value})}
                className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Observações de Prontuário/Instruções</label>
              <textarea
                rows={2}
                value={newBooking.notes}
                onChange={e => setNewBooking({...newBooking, notes: e.target.value})}
                placeholder="Instruções de secagem, alergias..."
                className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-lg transition-colors shadow-sm"
            >
              Criar Agendamento ERP
            </button>
          </form>
        </div>
      )}

      {/* TAB CONTENT 5: CODE EXPLORER */}
      {activeTab === 'code_explorer' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-850 pb-3">
            <div>
              <h4 className="text-sm font-black uppercase tracking-wider text-slate-200">Estrutura de Código Base (Monorepo)</h4>
              <p className="text-xs text-slate-400 mt-0.5">Explore e copie os códigos reais solicitados das regras de negócio do CodeCanyon integrados no PetSphere.</p>
            </div>
            <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-1 rounded font-bold font-mono">
              PetSphere Ultimate v1.0.0
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar: File Tree Navigation */}
            <div className="lg:col-span-1 bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2.5">
                  Arquivos Disponíveis
                </h5>
                <div className="space-y-1.5">
                  {codecanyonFiles.map((file, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedFileIdx(idx)}
                      className={`w-full text-left p-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 border ${
                        selectedFileIdx === idx
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'text-slate-400 hover:text-slate-200 bg-slate-900/40 border-transparent hover:bg-slate-900/80'
                      }`}
                    >
                      {file.path.endsWith('.txt') ? (
                        <Folder size={14} className="shrink-0 text-slate-400" />
                      ) : (
                        <FileText size={14} className="shrink-0 text-emerald-500" />
                      )}
                      <span className="truncate">{file.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-850 space-y-2">
                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3">
                  <h6 className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Terminal size={11} />
                    <span>Conexão Segura</span>
                  </h6>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Estes arquivos contêm a modelagem de dados real do MongoDB via Mongoose, lógica anti-conflito no controller e o app mobile em React Native Expo.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Panel: Code Viewer */}
            <div className="lg:col-span-3 bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-850 pb-3 mb-4">
                  <div>
                    <h5 className="text-xs font-black text-slate-200">
                      {codecanyonFiles[selectedFileIdx].name}
                    </h5>
                    <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                      {codecanyonFiles[selectedFileIdx].path}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopyCode(codecanyonFiles[selectedFileIdx].content, selectedFileIdx)}
                    className="self-start sm:self-center px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    {copiedFileIdx === selectedFileIdx ? (
                      <>
                        <Check size={13} className="text-emerald-400" />
                        <span className="text-emerald-400">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Copiar Código</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="relative">
                  <pre className="overflow-x-auto text-[11px] p-4 bg-slate-900 border border-slate-850 rounded-lg text-slate-300 font-mono select-text whitespace-pre max-h-[500px]">
                    <code>{codecanyonFiles[selectedFileIdx].content}</code>
                  </pre>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-850 text-[10px] text-slate-500 flex justify-between">
                <span>Linguagem: {codecanyonFiles[selectedFileIdx].language.toUpperCase()}</span>
                <span>Copie e cole em seu projeto local</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER BLOCK */}
    </div>
  );
}
