import React, { useState, useEffect } from 'react';
import { Booking, Product, MedicalRecord, User, Pet } from './types';
import VendorDashboard from './components/VendorDashboard';
import Marketplace from './components/Marketplace';
import AuthPage from './components/AuthPage';
import { 
  Heart, ShoppingBag, Calendar, Database, ShieldCheck, Sparkles, LogOut, User as UserIcon, Store, PawPrint, Crown
} from 'lucide-react';

export default function App() {
  // Authentication states
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  
  // Navigation states
  const [activeTab, setActiveTab] = useState<'marketplace' | 'erp'>('marketplace');
  
  // App database states
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Read session on startup
  useEffect(() => {
    const savedUser = localStorage.getItem('petsphere_user');
    const savedToken = localStorage.getItem('petsphere_token');
    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setCurrentUser(parsedUser);
        setToken(savedToken);
        // Default vendors to ERP view and customers to Marketplace view
        setActiveTab(parsedUser.role === 'vendor' ? 'erp' : 'marketplace');
      } catch (e) {
        // Clear corrupt storage
        localStorage.removeItem('petsphere_user');
        localStorage.removeItem('petsphere_token');
      }
    }
    fetchAllData();
  }, []);

  // Fetch all databases from backend
  const fetchAllData = async () => {
    try {
      const [bookingsRes, productsRes, recordsRes, usersRes, petsRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/products'),
        fetch('/api/medical-records'),
        fetch('/api/users'),
        fetch('/api/pets')
      ]);

      const [bookingsData, productsData, recordsData, usersData, petsData] = await Promise.all([
        bookingsRes.json(),
        productsRes.json(),
        recordsRes.json(),
        usersRes.json(),
        petsRes.json()
      ]);

      setBookings(bookingsData);
      setProducts(productsData);
      setMedicalRecords(recordsData);
      setUsers(usersData);
      setPets(petsData);
    } catch (err: any) {
      setError('Falha ao sincronizar dados com o servidor local.');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = (user: User, userToken: string) => {
    setCurrentUser(user);
    setToken(userToken);
    localStorage.setItem('petsphere_user', JSON.stringify(user));
    localStorage.setItem('petsphere_token', userToken);
    
    // Auto-set the correct starting tab
    setActiveTab(user.role === 'vendor' ? 'erp' : 'marketplace');
    
    // Refresh database context with new user scope if needed
    fetchAllData();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('petsphere_user');
    localStorage.removeItem('petsphere_token');
    setActiveTab('marketplace');
  };

  const handleAddPet = (newPet: any) => {
    setPets(prev => [...prev, newPet]);
  };

  // If not logged in, force the elegant Authentication screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-blue-50 flex flex-col font-sans">
        <header className="bg-blue-950 border-b border-blue-900 py-4 px-6 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-lg">
              🐾
            </div>
            <span className="text-md font-display font-black text-blue-950 inline-flex items-center pt-1.5 text-outline-white">
              <span>
                <span className="relative inline-block">
                  <Crown size={12} className="absolute -top-[6px] left-[-1px] text-amber-500 fill-amber-400 rotate-[-12deg]" />
                  R
                </span>oyalP
              </span>
              <PawPrint size={14} className="text-amber-500 fill-amber-500 inline-block rotate-12 mx-[1px]" />
              <span>ws</span>
            </span>
          </div>
          <span className="text-[10px] bg-blue-900/40 text-blue-200 font-bold border border-blue-800 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
            🔒 Hospedagem Segura & Monitoramento 24h
          </span>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <AuthPage onAuthSuccess={handleAuthSuccess} />
        </main>
        <footer className="py-4 text-center text-[11px] text-blue-700 font-mono border-t border-blue-200/50">
          RoyalPaws — Sistema de Gestão & Marketplace © 2026
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 text-slate-800 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      
      {/* CLEAN PREMIUM LOGO & NAVIGATION HEADER */}
      <header className="bg-blue-950 border-b border-blue-900 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-2xl">🐾</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-display font-black tracking-tight text-blue-950 inline-flex items-center pt-1.5 text-outline-white">
                  <span>
                    <span className="relative inline-block">
                      <Crown size={14} className="absolute -top-[7px] left-[-1px] text-amber-500 fill-amber-400 rotate-[-12deg]" />
                      R
                    </span>oyalP
                  </span>
                  <PawPrint size={18} className="text-amber-500 fill-amber-500 inline-block rotate-12 mx-[1px]" />
                  <span>ws</span>
                </h1>
                <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  Premium
                </span>
              </div>
              <p className="text-xs text-blue-200/80 font-medium">Hotelaria Pet de Luxo & Monitoramento 24h para seu Cão</p>
            </div>
          </div>

          {/* User Session Info & Action Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto justify-end">
            
            {/* Core Area Switcher (Only visible to Vendors or Admins) */}
            {currentUser.role === 'vendor' && (
              <div className="flex bg-blue-900/40 border border-blue-800/50 p-1 rounded-xl gap-1 w-full sm:w-auto justify-center">
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className={`flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'marketplace'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-blue-200 hover:text-white hover:bg-blue-900/30'
                  }`}
                >
                  <ShoppingBag size={13} />
                  <span>Ver Marketplace</span>
                </button>
                <button
                  onClick={() => setActiveTab('erp')}
                  className={`flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'erp'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-blue-200 hover:text-white hover:bg-blue-900/30'
                  }`}
                >
                  <Database size={13} />
                  <span>Painel ERP</span>
                </button>
              </div>
            )}

            {/* Profile badge & logout button */}
            <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto bg-blue-900/20 border border-blue-800/40 p-1.5 pr-3 rounded-2xl">
              <div className="flex items-center gap-2">
                <img 
                  src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} 
                  alt={currentUser.name} 
                  className="w-8 h-8 rounded-xl object-cover border border-blue-800"
                  referrerPolicy="no-referrer"
                />
                <div className="text-left">
                  <h4 className="text-xs font-bold text-white line-clamp-1">{currentUser.name}</h4>
                  <div className="flex items-center gap-1">
                    {currentUser.role === 'vendor' ? (
                      <span className="text-[8px] bg-indigo-950/80 text-indigo-200 font-black border border-indigo-800/60 px-1 py-0.2 rounded uppercase flex items-center gap-0.5">
                        <Store size={8} />
                        <span>{currentUser.companyName || 'Lojista'}</span>
                      </span>
                    ) : (
                      <span className="text-[8px] bg-blue-950/80 text-blue-200 font-black border border-blue-800/60 px-1 py-0.2 rounded uppercase flex items-center gap-0.5">
                        <UserIcon size={8} />
                        <span>Cliente</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Sair da Conta"
                className="p-1.5 text-blue-300 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer ml-2"
              >
                <LogOut size={14} />
              </button>
            </div>

          </div>

        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        
        {/* VIEWPORT AREA */}
        <section className="flex-1 relative">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-blue-600 p-12">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-sm font-semibold font-mono">Sincronizando dados...</p>
            </div>
          ) : error ? (
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-6 text-center max-w-md mx-auto">
              <span className="text-3xl">⚠️</span>
              <h3 className="text-md font-bold text-rose-700 mt-2">Falha na Conexão</h3>
              <p className="text-xs text-slate-500 mt-1">{error}</p>
              <button 
                onClick={fetchAllData}
                className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-lg text-xs font-bold hover:bg-rose-600 transition-colors cursor-pointer"
              >
                Tentar Novamente
              </button>
            </div>
          ) : (
            <div className="animate-fade-in">
              
              {/* Marketplace & Booking View */}
              {activeTab === 'marketplace' && (
                <Marketplace 
                  pets={pets}
                  employees={users}
                  onBookingSuccess={fetchAllData}
                  onAddPet={handleAddPet}
                />
              )}

              {/* Vendor ERP Dashboard View */}
              {activeTab === 'erp' && currentUser.role === 'vendor' && (
                <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl p-2">
                  <VendorDashboard 
                    bookings={bookings}
                    products={products}
                    medicalRecords={medicalRecords}
                    users={users}
                    pets={pets}
                    onBookingUpdate={fetchAllData}
                    onProductUpdate={fetchAllData}
                    onRecordUpdate={fetchAllData}
                  />
                </div>
              )}

              {/* Security redirect just in case a Customer somehow accesses ERP */}
              {activeTab === 'erp' && currentUser.role !== 'vendor' && (
                <div className="bg-blue-100/90 border border-blue-200 rounded-3xl p-12 text-center max-w-md mx-auto shadow-sm">
                  <span className="text-4xl">🔒</span>
                  <h3 className="text-base font-black text-blue-950 mt-3">Acesso Restrito</h3>
                  <p className="text-xs text-blue-800/80 mt-1.5">
                    O painel ERP do Petshop é de uso exclusivo para proprietários parceiros e funcionários.
                  </p>
                  <button 
                    onClick={() => setActiveTab('marketplace')}
                    className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Voltar para o Marketplace
                  </button>
                </div>
              )}

            </div>
          )}
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-blue-100/80 border-t border-blue-200/60 py-6 text-blue-700 text-xs text-center font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>RoyalPaws Ecosystem © 2026. Todos os direitos reservados.</span>
          <div className="flex items-center gap-2">
            <span>Desenvolvido com carinho para seu melhor amigo</span>
            <Heart size={12} className="text-rose-500 fill-rose-500" />
          </div>
        </div>
      </footer>

    </div>
  );
}
