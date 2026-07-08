import React, { useState, useEffect } from 'react';
import { Pet, User } from '../types';
import { 
  Heart, Search, Sparkles, CheckCircle, AlertTriangle, 
  RefreshCw, ShoppingBag, MapPin, Calendar, Clock, User as UserIcon
} from 'lucide-react';

interface MarketplaceProps {
  onBookingSuccess: () => void;
  pets: Pet[];
  employees: User[];
  onAddPet: (newPet: any) => void;
}

export default function Marketplace({ onBookingSuccess, pets, employees, onAddPet }: MarketplaceProps) {
  // App States
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cartCount, setCartCount] = useState<number>(0);
  const [favorites, setFavorites] = useState<string[]>(['pet-1']);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Booking Form State
  const [selectedPet, setSelectedPet] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('banho_e_tosa');
  const [bookingDate, setBookingDate] = useState<string>('');
  const [bookingTime, setBookingTime] = useState<string>('14:00');
  const [price, setPrice] = useState<number>(120);
  const [bookingNotes, setBookingNotes] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Set default date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setBookingDate(today);
  }, []);

  // Dynamic price depending on service selected
  useEffect(() => {
    switch (selectedService) {
      case 'banho':
        setPrice(60);
        break;
      case 'tosa':
        setPrice(80);
        break;
      case 'banho_e_tosa':
        setPrice(120);
        break;
      case 'consulta_vet':
        setPrice(200);
        break;
      default:
        setPrice(50);
    }
  }, [selectedService]);

  const toggleFavorite = (petId: string) => {
    setFavorites(prev => 
      prev.includes(petId) ? prev.filter(id => id !== petId) : [...prev, petId]
    );
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!selectedPet || !selectedEmployee || !bookingDate || !bookingTime) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);

    const petObj = pets.find(p => p.id === selectedPet);
    const dateTimeString = `${bookingDate}T${bookingTime}:00`;

    const bookingPayload = {
      customerId: 'customer-1',
      customerName: 'Mariana Costa', // simulated user
      petId: selectedPet,
      petName: petObj?.name || 'Pet',
      employeeId: selectedEmployee,
      serviceType: selectedService,
      dateTime: dateTimeString,
      durationMinutes: selectedService === 'banho_e_tosa' ? 75 : 45,
      price: price,
      notes: bookingNotes
    };

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Houve um erro ao realizar o agendamento.');
      }

      setSuccessMsg('Agendamento realizado com sucesso!');
      onBookingSuccess();
      
      // Reset form fields elegantly
      setTimeout(() => {
        setSuccessMsg(null);
        setSelectedPet('');
        setSelectedEmployee('');
        setBookingNotes('');
      }, 2000);

    } catch (err: any) {
      setErrorMsg(err.message || 'Houve um erro de rede.');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'Todos os Pets', icon: '🐾' },
    { id: 'dog', label: 'Cães', icon: '🐶' },
    { id: 'cat', label: 'Gatos', icon: '🐱' },
    { id: 'bird', label: 'Aves', icon: '🦜' },
    { id: 'fish', label: 'Peixes', icon: '🐠' }
  ];

  // Filter based on category and search query
  const filteredPets = pets.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      {/* LEFT COLUMN: FILTERS & NAVIGATION */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-blue-100/95 border border-blue-200/60 rounded-2xl p-5 shadow-xs">
          <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-4">Filtrar por Categoria</h3>
          <div className="space-y-1.5">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat.id 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'text-blue-800 hover:bg-blue-200/50 hover:text-blue-950'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-sm">{cat.icon}</span>
                  <span>{cat.label}</span>
                </span>
                {selectedCategory === cat.id && <span className="text-xs">●</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Info card for users */}
        <div className="bg-blue-200/50 border border-blue-350 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-blue-900">
            <Sparkles size={16} />
            <h4 className="text-xs font-bold uppercase tracking-wider">Cuidado Profissional</h4>
          </div>
          <p className="text-xs text-blue-800/90 leading-relaxed">
            Nossos serviços de Banho, Tosa e Consultas Veterinárias são acompanhados por especialistas experientes. Escolha o profissional e agende com confirmação de horário garantida.
          </p>
        </div>
      </div>

      {/* CENTER COLUMNS: PET CATALOG */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Promotional Hero Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-6 text-white relative overflow-hidden shadow-xs">
          <div className="z-10 relative max-w-md">
            <span className="bg-blue-950 text-blue-300 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
              Adote ou Compre
            </span>
            <h4 className="text-2xl font-black mt-3 leading-tight tracking-tight">O companheiro ideal para sua vida está aqui!</h4>
            <p className="text-xs text-blue-50/90 mt-2">
              Encontre cães, gatos, aves e peixes saudáveis de criadores verificados, ou agende os cuidados do seu pet atual online.
            </p>
          </div>
          <div 
            className="absolute right-0 bottom-0 top-0 w-44 bg-contain bg-no-repeat bg-right opacity-30 sm:opacity-40 pointer-events-none select-none" 
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300')` }}
          ></div>
        </div>

        {/* Catalog list header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-blue-950 tracking-tight">Pets em Destaque</h2>
            <p className="text-xs text-blue-800/80">Animais saudáveis disponíveis para adoção ou compra</p>
          </div>
          
          {/* Search bar */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="Pesquisar raça, nome..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-blue-50 border border-blue-250 rounded-full text-xs text-blue-950 w-full sm:w-56 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            <Search className="absolute left-3.5 top-3 text-blue-500" size={13} />
          </div>
        </div>

        {/* Grid of Pets */}
        {filteredPets.length === 0 ? (
          <div className="bg-blue-100/90 border border-blue-200 rounded-2xl p-12 text-center text-blue-750">
            <span className="text-3xl">🐾</span>
            <p className="text-xs font-semibold mt-2">Nenhum pet encontrado com os critérios de busca.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filteredPets.map(pet => (
              <div key={pet.id} className="bg-blue-100/90 border border-blue-200 rounded-2xl overflow-hidden hover:border-blue-500/30 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[340px] group">
                {/* Pet Image Header */}
                <div className="relative h-44 bg-blue-50 overflow-hidden">
                  <img 
                    src={pet.photos[0]} 
                    alt={pet.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <span className={`absolute top-3 left-3 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full text-white shadow-xs ${
                    pet.listingType === 'sale' ? 'bg-orange-500' : 'bg-blue-600'
                  }`}>
                    {pet.listingType === 'sale' ? 'Compra' : 'Adoção'}
                  </span>
                  
                  <button 
                    onClick={() => toggleFavorite(pet.id)}
                    className="absolute top-3 right-3 p-2 bg-blue-50/95 backdrop-blur-xs rounded-full text-rose-500 hover:scale-110 shadow-sm transition-all"
                  >
                    <Heart 
                      size={13} 
                      fill={favorites.includes(pet.id) ? "currentColor" : "none"} 
                    />
                  </button>
                </div>

                {/* Pet Details body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-blue-950">{pet.name}</h4>
                      <span className="text-[10px] text-blue-900 font-semibold bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                        {pet.age} meses
                      </span>
                    </div>
                    <p className="text-xs text-blue-800/80 mt-0.5">{pet.breed}</p>
                    <p className="text-xs text-blue-900/80 mt-2 line-clamp-2 leading-relaxed">{pet.description}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {pet.vaccinated && <span className="text-[8px] font-extrabold uppercase tracking-wide text-blue-700 bg-blue-100 border border-blue-200 px-1.5 py-0.5 rounded">Vacinado</span>}
                      {pet.dewormed && <span className="text-[8px] font-extrabold uppercase tracking-wide text-blue-700 bg-blue-100 border border-blue-200 px-1.5 py-0.5 rounded">Vermifugado</span>}
                      {pet.pedigree && <span className="text-[8px] font-extrabold uppercase tracking-wide text-amber-700 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded font-mono">Pedigree</span>}
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-blue-200/50 mt-3">
                    <div>
                      <p className="text-[9px] text-blue-600 font-bold uppercase tracking-wider">Valor</p>
                      <span className="text-sm font-black text-blue-950">
                        {pet.listingType === 'sale' ? `R$ ${pet.price?.toLocaleString('pt-BR')}` : 'Grátis'}
                      </span>
                    </div>
                    <button 
                      onClick={() => {
                        setCartCount(c => c + 1);
                        alert(`Você registrou interesse em ${pet.name}! O proprietário/lojista foi notificado.`);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold px-4 py-2 transition-all shadow-xs"
                    >
                      Tenho Interesse
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* RIGHT COLUMN: INTEGRATED BOOKING FORM (ERP-SYNCED) */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-blue-100/95 border border-blue-200 rounded-2xl p-5 shadow-xs">
          
          <div className="border-b border-blue-200 pb-3 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-blue-600 text-lg">📅</span>
              <h3 className="text-xs font-black uppercase text-blue-950">Agendar Serviço</h3>
            </div>
          </div>

          <p className="text-xs text-blue-800/80 mb-4 leading-relaxed">
            Escolha o serviço de cuidado e reserve o melhor horário disponível para seu pet em poucos cliques.
          </p>

          <form onSubmit={handleCreateBooking} className="space-y-4">
            {/* Error & Success Feedback alerts */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 flex gap-2 text-xs items-start">
                <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Aviso:</span>
                  <p className="mt-0.5 text-[10px] leading-relaxed font-mono">{errorMsg}</p>
                </div>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-blue-200 border border-blue-350 rounded-xl text-blue-950 flex gap-2 text-xs items-start">
                <CheckCircle size={15} className="shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Agendado com Sucesso!</span>
                  <p className="mt-0.5 text-[10px] leading-relaxed">Seu horário foi reservado e confirmado pela equipe.</p>
                </div>
              </div>
            )}

            {/* Pet Selection */}
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider mb-1 text-blue-800/80">Qual pet receberá o cuidado? *</label>
              <select 
                value={selectedPet}
                onChange={(e) => setSelectedPet(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl text-xs bg-blue-50 border border-blue-250 text-blue-950 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              >
                <option value="" className="text-blue-400">Selecione o Pet...</option>
                {pets.map(p => (
                  <option key={p.id} value={p.id} className="text-blue-950">{p.name} ({p.breed})</option>
                ))}
              </select>
            </div>

            {/* Service Selection */}
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider mb-1 text-blue-800/80">Tipo de Serviço *</label>
              <select 
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl text-xs bg-blue-50 border border-blue-250 text-blue-950 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              >
                <option value="banho" className="text-blue-950">Somente Banho (R$ 60)</option>
                <option value="tosa" className="text-blue-950">Somente Tosa (R$ 80)</option>
                <option value="banho_e_tosa" className="text-blue-950">Banho e Tosa Completo (R$ 120)</option>
                <option value="consulta_vet" className="text-blue-950">Consulta Veterinária (R$ 200)</option>
              </select>
            </div>

            {/* Employee Selection */}
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider mb-1 text-blue-800/80">Profissional / Especialista *</label>
              <select 
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl text-xs bg-blue-50 border border-blue-250 text-blue-950 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              >
                <option value="" className="text-blue-400">Selecione o profissional...</option>
                {employees.filter(emp => emp.role === 'employee').map(emp => (
                  <option key={emp.id} value={emp.id} className="text-blue-950">
                    {emp.name} ({(emp as any).specialties?.join(', ')})
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider mb-1 text-blue-800/80">Data *</label>
                <input 
                  type="date" 
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                  className="w-full p-2 rounded-xl text-xs bg-blue-50 border border-blue-250 text-blue-950 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider mb-1 text-blue-800/80">Horário *</label>
                <input 
                  type="time" 
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  required
                  className="w-full p-2 rounded-xl text-xs bg-blue-50 border border-blue-250 text-blue-950 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider mb-1 text-blue-800/80">Observações</label>
              <textarea 
                rows={2}
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
                placeholder="Ex: Alergias, comportamento, etc."
                className="w-full p-2.5 rounded-xl text-xs bg-blue-50 border border-blue-250 text-blue-950 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
              ></textarea>
            </div>

            {/* Cost Summary & Confirm */}
            <div className="pt-3 border-t border-blue-200">
              <div className="flex items-center justify-between text-xs font-bold p-3 bg-blue-200 rounded-xl mb-3 text-blue-950">
                <span>Valor Total</span>
                <span className="text-blue-700 font-extrabold text-sm">R$ {price.toFixed(2)}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer ${
                  loading ? 'opacity-80 cursor-wait' : ''
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin" size={13} />
                    <span>Confirmando...</span>
                  </>
                ) : (
                  <span>Confirmar Agendamento</span>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>

    </div>
  );
}
