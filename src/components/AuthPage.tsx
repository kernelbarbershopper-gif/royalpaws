import React, { useState } from 'react';
import { Mail, User as UserIcon, Store, Phone, ArrowRight, CheckCircle, AlertCircle, Sparkles, ShieldCheck, Lock, PawPrint, Crown } from 'lucide-react';
import { User } from '../types';

interface AuthPageProps {
  onAuthSuccess: (user: User, token: string) => void;
}

const AnimatedDog = ({ coverEyes }: { coverEyes: boolean }) => {
  return (
    <div className="relative w-32 h-32 mx-auto mb-4 flex items-center justify-center">
      <style>{`
        .dog-tail {
          animation: dog-wag 1.2s ease-in-out infinite alternate;
          transform-origin: 36px 75px;
        }
        .dog-ear-left {
          animation: dog-ear-wiggle-left 3s ease-in-out infinite;
          transform-origin: 42px 34px;
        }
        .dog-ear-right {
          animation: dog-ear-wiggle-right 3s ease-in-out infinite;
          transform-origin: 78px 34px;
        }
        .dog-eye {
          animation: dog-blink 4s ease-in-out infinite;
          transform-origin: center;
        }
        .dog-head {
          animation: dog-bob 4s ease-in-out infinite;
          transform-origin: 60px 65px;
        }
        .dog-tongue {
          animation: dog-tongue-panting 0.6s ease-in-out infinite alternate;
          transform-origin: 60px 60px;
        }
        .dog-paw-left {
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-origin: 52px 94px;
        }
        .dog-paw-right {
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-origin: 68px 94px;
        }
        
        @keyframes dog-wag {
          0% { transform: rotate(-8deg); }
          100% { transform: rotate(12deg); }
        }
        @keyframes dog-ear-wiggle-left {
          0%, 90%, 100% { transform: rotate(0deg); }
          93% { transform: rotate(-6deg); }
          96% { transform: rotate(2deg); }
        }
        @keyframes dog-ear-wiggle-right {
          0%, 90%, 100% { transform: rotate(0deg); }
          93% { transform: rotate(6deg); }
          96% { transform: rotate(-2deg); }
        }
        @keyframes dog-blink {
          0%, 95%, 100% { transform: scaleY(1); }
          97.5% { transform: scaleY(0.1); }
        }
        @keyframes dog-bob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(2px) rotate(1deg); }
        }
        @keyframes dog-tongue-panting {
          0% { transform: scaleY(0.9); }
          100% { transform: scaleY(1.1); }
        }
      `}</style>
      
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Curly Pug Tail */}
        <path
          className="dog-tail"
          d="M 36,75 Q 22,70 22,58 C 22,46 36,46 36,54 C 36,59 32,59 32,55"
          stroke="#C29F82"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Back Legs / Sitting Chubby Body */}
        <ellipse cx="60" cy="85" rx="32" ry="18" fill="#EAD5C3" />
        <circle cx="38" cy="88" r="10" fill="#D2B48C" opacity="0.6" />
        <circle cx="82" cy="88" r="10" fill="#D2B48C" opacity="0.6" />

        {/* Body Neck area */}
        <path d="M 44,65 L 76,65 L 70,82 L 50,82 Z" fill="#EAD5C3" />

        {/* Collar (Classy Emerald Green or Rich Red) */}
        <path d="M 45,67 Q 60,73 75,67" stroke="#EF4444" strokeWidth="5" strokeLinecap="round" />
        {/* Gold Medal */}
        <circle cx="60" cy="73" r="4.5" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />

        {/* Head and Face Group (bobbing) */}
        <g className="dog-head">
          {/* Main Chubby Head Base */}
          <ellipse cx="60" cy="48" rx="23" ry="19" fill="#EAD5C3" />
          
          {/* Left Folded Ear (Dark Charcoal) */}
          <path
            className="dog-ear-left"
            d="M 42,34 C 32,30 24,42 26,54 C 27,60 35,56 38,44"
            fill="#2D251E"
          />
          
          {/* Right Folded Ear (Dark Charcoal) */}
          <path
            className="dog-ear-right"
            d="M 78,34 C 88,30 96,42 94,54 C 93,60 85,56 82,44"
            fill="#2D251E"
          />

          {/* Forehead Wrinkles (Characteristic of Pugs) */}
          <path d="M 50,36 Q 60,40 70,36" stroke="#A88970" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M 53,32 Q 60,35 67,32" stroke="#A88970" strokeWidth="1.8" strokeLinecap="round" fill="none" />

          {/* Black Mask under eyes and snout */}
          <ellipse cx="60" cy="54" rx="14" ry="10" fill="#2D251E" />
          
          {/* Snout/Muzzle Inner */}
          <ellipse cx="60" cy="55" rx="10" ry="7" fill="#1F1914" />
          
          {/* Flat Pug Nose */}
          <path d="M 56,51 Q 60,49 64,51 Q 64,53 60,55 Q 56,53 56,51 Z" fill="#0C0A09" />
          
          {/* Cute pink tongue */}
          <path
            className="dog-tongue"
            d="M 58,57 C 58,63 62,63 62,57 Z"
            fill="#F43F5E"
          />
          
          {/* Mouth lines */}
          <path d="M 55,55 Q 60,58 65,55" stroke="#0C0A09" strokeWidth="1.5" strokeLinecap="round" />

          {coverEyes ? (
            <>
              {/* Happy closed/squinting eyes */}
              <path d="M 41,46 Q 46,41 51,46" stroke="#1F1914" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 69,46 Q 74,41 79,46" stroke="#1F1914" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </>
          ) : (
            <>
              {/* Big Round Expressive Eyes */}
              <circle className="dog-eye" cx="46" cy="44" r="4.5" fill="#1F1914" />
              <circle className="dog-eye" cx="74" cy="44" r="4.5" fill="#1F1914" />
              
              {/* Glossy Eye Highlights */}
              <circle className="dog-eye" cx="44.5" cy="42.5" r="1.5" fill="#FFF" />
              <circle className="dog-eye" cx="72.5" cy="42.5" r="1.5" fill="#FFF" />
              <circle className="dog-eye" cx="47.5" cy="45.5" r="0.6" fill="#FFF" />
              <circle className="dog-eye" cx="75.5" cy="45.5" r="0.6" fill="#FFF" />
            </>
          )}

          {/* Subtle blush */}
          <circle cx="41" cy="51" r="2.5" fill="#FDA4AF" opacity="0.4" />
          <circle cx="79" cy="51" r="2.5" fill="#FDA4AF" opacity="0.4" />
        </g>

        {/* Front Legs & Paws (Drawn last/on top so they can cover the face) */}
        <g className="dog-paw-left" style={coverEyes ? { transform: 'translate(-6px, -50px) rotate(180deg)' } : undefined}>
          <rect x="47" y="72" width="10" height="22" rx="5" fill="#F5EBE0" />
          <circle cx="52" cy="94" r="6" fill="#EAD5C3" />
          <circle cx="52" cy="94" r="3" fill="#FDA4AF" />
          <circle cx="47" cy="98" r="1.5" fill="#FDA4AF" />
          <circle cx="52" cy="100" r="1.5" fill="#FDA4AF" />
          <circle cx="57" cy="98" r="1.5" fill="#FDA4AF" />
        </g>
        <g className="dog-paw-right" style={coverEyes ? { transform: 'translate(6px, -50px) rotate(180deg)' } : undefined}>
          <rect x="63" y="72" width="10" height="22" rx="5" fill="#F5EBE0" />
          <circle cx="68" cy="94" r="6" fill="#EAD5C3" />
          <circle cx="68" cy="94" r="3" fill="#FDA4AF" />
          <circle cx="63" cy="98" r="1.5" fill="#FDA4AF" />
          <circle cx="68" cy="100" r="1.5" fill="#FDA4AF" />
          <circle cx="73" cy="98" r="1.5" fill="#FDA4AF" />
        </g>
      </svg>
    </div>
  );
};

const AnimatedCat = ({ coverEyes }: { coverEyes: boolean }) => {
  return (
    <div className="relative w-32 h-32 mx-auto mb-4 flex items-center justify-center">
      <style>{`
        .cat-tail {
          animation: cat-tail-wag 1.6s ease-in-out infinite alternate;
          transform-origin: 76px 82px;
        }
        .cat-ear-left {
          animation: cat-ear-twitch-left 4s ease-in-out infinite;
          transform-origin: 44px 36px;
        }
        .cat-ear-right {
          animation: cat-ear-twitch-right 4s ease-in-out infinite;
          transform-origin: 76px 36px;
        }
        .cat-eye {
          animation: cat-blink 4.5s ease-in-out infinite;
          transform-origin: center;
        }
        .cat-head {
          animation: cat-bob 4s ease-in-out infinite;
          transform-origin: 60px 65px;
        }
        .cat-paw-left {
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-origin: 52px 94px;
        }
        .cat-paw-right {
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-origin: 68px 94px;
        }
        
        @keyframes cat-tail-wag {
          0% { transform: rotate(-5deg); }
          100% { transform: rotate(8deg); }
        }
        @keyframes cat-ear-twitch-left {
          0%, 90%, 100% { transform: rotate(0deg); }
          92% { transform: rotate(-6deg); }
          94% { transform: rotate(2deg); }
        }
        @keyframes cat-ear-twitch-right {
          0%, 85%, 100% { transform: rotate(0deg); }
          87% { transform: rotate(6deg); }
          89% { transform: rotate(-2deg); }
        }
        @keyframes cat-blink {
          0%, 95%, 100% { transform: scaleY(1); }
          97.5% { transform: scaleY(0.1); }
        }
        @keyframes cat-bob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(2px) rotate(-0.5deg); }
        }
      `}</style>
      
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Tail - Whip-like thin hairless tail */}
        <path
          className="cat-tail"
          d="M 76,82 C 90,84 96,72 94,56 Q 92,44 84,48"
          stroke="#ECC0B8"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Back legs / Slender Sitting Body */}
        <ellipse cx="60" cy="86" rx="24" ry="12" fill="#ECC0B8" />
        <circle cx="44" cy="86" r="8" fill="#DB9A90" opacity="0.6" />
        <circle cx="76" cy="86" r="8" fill="#DB9A90" opacity="0.6" />

        {/* Slender Chest highlight */}
        <path d="M 52,66 Q 60,74 68,66" stroke="#FFF" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4" />

        {/* Collar (Charming Royal Blue) */}
        <path d="M 48,67 Q 60,71 72,67" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
        {/* Little Golden Bell */}
        <circle cx="60" cy="71" r="3.5" fill="#FBBF24" stroke="#D97706" strokeWidth="0.8" />

        {/* Head and Face (bobbing) */}
        <g className="cat-head">
          {/* Left Huge Triangular Ear */}
          <path
            className="cat-ear-left"
            d="M 44,36 L 20,10 C 24,24 32,46 48,40 Z"
            fill="#ECC0B8"
          />
          <path
            className="cat-ear-left"
            d="M 42,34 L 24,14 C 27,24 34,42 45,38 Z"
            fill="#FDA4AF"
          />
          
          {/* Right Huge Triangular Ear */}
          <path
            className="cat-ear-right"
            d="M 76,36 L 100,10 C 96,24 88,46 72,40 Z"
            fill="#ECC0B8"
          />
          <path
            className="cat-ear-right"
            d="M 78,34 L 96,14 C 93,24 86,42 75,38 Z"
            fill="#FDA4AF"
          />

          {/* Wedge-shaped Head Base (characteristic of Sphynx) */}
          <path d="M 39,40 C 39,32 81,32 81,40 C 81,50 72,62 60,62 C 48,62 39,50 39,40 Z" fill="#ECC0B8" />

          {/* Forehead Wrinkles (signature hairless look) */}
          <path d="M 52,36 Q 60,40 68,36" stroke="#DB9A90" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M 54,32 Q 60,35 66,32" stroke="#DB9A90" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M 56,28 Q 60,30 64,28" stroke="#DB9A90" strokeWidth="1.5" strokeLinecap="round" fill="none" />

          {/* Squint/Wrinkle lines around eyes */}
          <path d="M 36,44 Q 40,42 42,45" stroke="#DB9A90" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M 84,44 Q 80,42 78,45" stroke="#DB9A90" strokeWidth="1.2" strokeLinecap="round" fill="none" />

          {/* Cheek Wrinkles */}
          <path d="M 43,53 Q 46,55 45,58" stroke="#DB9A90" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M 77,53 Q 74,55 75,58" stroke="#DB9A90" strokeWidth="1.2" strokeLinecap="round" fill="none" />

          {coverEyes ? (
            <>
              {/* Happy closed/squinting eyes */}
              <path d="M 41,45 Q 47.5,40 54,45" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 66,45 Q 72.5,40 79,45" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </>
          ) : (
            <>
              {/* Slanted Almond-shaped Eyes */}
              <path className="cat-eye" d="M 41,44 Q 48,37 54,44 Q 48,47 41,44 Z" fill="#2DD4BF" stroke="#1E293B" strokeWidth="1.5" strokeLinejoin="round" />
              <path className="cat-eye" d="M 66,44 Q 72,37 79,44 Q 72,47 66,44 Z" fill="#2DD4BF" stroke="#1E293B" strokeWidth="1.5" strokeLinejoin="round" />
              
              {/* Vertical Cat Pupils */}
              <ellipse className="cat-eye" cx="47.5" cy="43.5" rx="1" ry="3.5" fill="#1E293B" />
              <ellipse className="cat-eye" cx="72.5" cy="43.5" rx="1" ry="3.5" fill="#1E293B" />
              
              {/* Eye highlights */}
              <circle className="cat-eye" cx="46.5" cy="41.5" r="0.8" fill="#FFF" />
              <circle className="cat-eye" cx="71.5" cy="41.5" r="0.8" fill="#FFF" />
            </>
          )}

          {/* Muzzle */}
          <ellipse cx="60" cy="53" rx="7" ry="4.5" fill="#FFF" opacity="0.15" />
          
          {/* Little pink nose */}
          <path d="M 58,51 L 62,51 L 60,53.5 Z" fill="#FDA4AF" />
          
          {/* Mouth lines */}
          <path d="M 57,54 Q 60,56 60,54 Q 60,56 63,54" stroke="#1E293B" strokeWidth="1" strokeLinecap="round" fill="none" />

          {/* Whisker pads details (dots instead of actual long whiskers) */}
          <circle cx="53" cy="53" r="0.6" fill="#DB9A90" />
          <circle cx="55" cy="54" r="0.6" fill="#DB9A90" />
          <circle cx="54" cy="52" r="0.6" fill="#DB9A90" />
          <circle cx="67" cy="53" r="0.6" fill="#DB9A90" />
          <circle cx="65" cy="54" r="0.6" fill="#DB9A90" />
          <circle cx="66" cy="52" r="0.6" fill="#DB9A90" />

          {/* Cute cheeks blush */}
          <circle cx="45" cy="51" r="2.5" fill="#FDA4AF" opacity="0.4" />
          <circle cx="75" cy="51" r="2.5" fill="#FDA4AF" opacity="0.4" />
        </g>

        {/* Front Legs & Paws (Drawn last so they can cover the face) */}
        <g className="cat-paw-left" style={coverEyes ? { transform: 'translate(-4.5px, -50.5px) rotate(180deg)' } : undefined}>
          <rect x="48" y="72" width="8" height="22" rx="4" fill="#F4D3CA" />
          <ellipse cx="52" cy="94" rx="5" ry="4" fill="#ECC0B8" />
          <ellipse cx="52" cy="94" rx="2.5" ry="2" fill="#FDA4AF" />
          <circle cx="48" cy="98" r="1.2" fill="#FDA4AF" />
          <circle cx="52" cy="99.5" r="1.2" fill="#FDA4AF" />
          <circle cx="56" cy="98" r="1.2" fill="#FDA4AF" />
        </g>
        <g className="cat-paw-right" style={coverEyes ? { transform: 'translate(4.5px, -50.5px) rotate(180deg)' } : undefined}>
          <rect x="64" y="72" width="8" height="22" rx="4" fill="#F4D3CA" />
          <ellipse cx="68" cy="94" rx="5" ry="4" fill="#ECC0B8" />
          <ellipse cx="68" cy="94" rx="2.5" ry="2" fill="#FDA4AF" />
          <circle cx="64" cy="98" r="1.2" fill="#FDA4AF" />
          <circle cx="68" cy="99.5" r="1.2" fill="#FDA4AF" />
          <circle cx="72" cy="98" r="1.2" fill="#FDA4AF" />
        </g>
      </svg>
    </div>
  );
};

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<'vendor' | 'customer'>('customer');
  const [coverEyes, setCoverEyes] = useState<boolean>(false);
  
  // Registration States
  const [name, setName] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  
  // Feedback states
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Quick Login Assist
  const handleQuickLogin = (quickEmail: string, quickRole: 'vendor' | 'customer') => {
    setEmail(quickEmail);
    setRole(quickRole);
    setIsLogin(true);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin 
        ? { email }
        : { name, email, role, companyName: role === 'vendor' ? companyName : undefined, phone };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao processar solicitação de autenticação.');
      }

      setSuccessMsg(isLogin ? 'Login efetuado com sucesso!' : 'Conta criada e ativada com sucesso!');
      
      setTimeout(() => {
        onAuthSuccess(data.user, data.token);
      }, 1200);

    } catch (err: any) {
      setErrorMsg(err.message || 'Erro de rede ou servidor indisponível.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-blue-50/50">
      <div className="w-full max-w-lg bg-blue-100/80 border border-blue-200 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-blue-200/50 flex flex-col justify-between relative overflow-hidden transition-all duration-300">
        
        {/* Top Decorative bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

        <div>
          {/* Header Area with Brand Identity */}
          <div className="flex flex-col items-center mb-8 text-center">
            {isLogin ? <AnimatedDog coverEyes={coverEyes} /> : <AnimatedCat coverEyes={coverEyes} />}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-200 text-blue-900 text-[10px] font-bold uppercase tracking-wider rounded-full mb-2">
              <Sparkles size={10} />
              <span className="inline-flex items-center pt-1 font-display">
                Hospedagem Segura 
                <span className="ml-1 text-blue-950 font-black text-outline-white inline-flex items-center">
                  <span className="relative inline-block">
                    <Crown size={8} className="absolute -top-[4px] left-0 text-amber-500 fill-amber-400 rotate-[-12deg]" />
                    R
                  </span>oyalP
                </span>
                <PawPrint size={10} className="text-amber-500 fill-amber-500 inline-block rotate-12 mx-[1px]" />
                <span className="text-blue-950 font-black text-outline-white">ws</span>
              </span>
            </div>
            <h2 className="text-2xl font-black text-blue-950 tracking-tight">
              {isLogin ? 'Bem-vindo de volta' : 'Hospedagem de Realeza para seu Pet'}
            </h2>
            <p className="text-xs text-blue-850/80 mt-1 max-w-sm">
              {isLogin 
                ? 'Acesse o painel do hotel para monitorar as hospedagens em tempo real com total segurança.' 
                : 'Cadastre-se para agendar uma estadia ultra-segura com monitoramento 24h e suporte veterinário.'}
            </p>
          </div>

          {/* Elegant Custom Tab Switcher */}
          <div className="grid grid-cols-2 bg-blue-200/40 p-1.5 rounded-2xl mb-8 border border-blue-200/60">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                isLogin 
                  ? 'bg-blue-600 text-white shadow-sm font-extrabold' 
                  : 'text-blue-800 hover:text-blue-950 hover:bg-blue-200/20'
              }`}
            >
              <Lock size={12} className={isLogin ? 'text-white' : 'text-blue-400'} />
              Entrar na Conta
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setRole('customer');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                !isLogin 
                  ? 'bg-blue-600 text-white shadow-sm font-extrabold' 
                  : 'text-blue-800 hover:text-blue-950 hover:bg-blue-200/20'
              }`}
            >
              <Sparkles size={12} className={!isLogin ? 'text-white' : 'text-blue-400'} />
              Nova Conta
            </button>
          </div>

          {/* Feedback alerts */}
          {errorMsg && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-800 flex gap-3 text-xs items-start animate-fade-in">
              <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Aviso de Autenticação</span>
                <p className="mt-0.5 text-[11px] leading-relaxed text-rose-700 font-medium">{errorMsg}</p>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 bg-blue-200 border border-blue-300 rounded-2xl text-blue-950 flex gap-3 text-xs items-start animate-fade-in">
              <CheckCircle size={16} className="text-blue-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Sucesso!</span>
                <p className="mt-0.5 text-[11px] leading-relaxed text-blue-900 font-medium">{successMsg}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Account Role Selector - Elegant visual cards for registration */}
            {!isLogin && (
              <div className="mb-4 animate-fade-in">
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 text-blue-800/80 inline-flex items-center pt-1 font-display">
                  Qual é o seu objetivo na 
                  <span className="ml-1 text-blue-950 font-black text-outline-white inline-flex items-center">
                    <span className="relative inline-block">
                      <Crown size={8} className="absolute -top-[4px] left-0 text-amber-500 fill-amber-400 rotate-[-12deg]" />
                      R
                    </span>oyalP
                  </span>
                  <PawPrint size={10} className="text-amber-500 fill-amber-500 inline-block rotate-12 mx-[1px]" />
                  <span className="text-blue-950 font-black text-outline-white">ws?</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                      role === 'customer'
                        ? 'border-blue-500 bg-blue-50/60 shadow-sm'
                        : 'border-blue-200 hover:border-blue-300 bg-blue-100 hover:bg-blue-200/50'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center gap-1.5 text-blue-950">
                      <UserIcon size={14} className={role === 'customer' ? 'text-blue-600' : 'text-blue-400'} />
                      <span>Tutor / Cliente</span>
                    </div>
                    <p className="text-[10px] text-blue-800/80 mt-1 leading-normal">Agende banhos, veterinários e explore produtos.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('vendor')}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                      role === 'vendor'
                        ? 'border-blue-500 bg-blue-50/60 shadow-sm'
                        : 'border-blue-200 hover:border-blue-300 bg-blue-100 hover:bg-blue-200/50'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center gap-1.5 text-blue-950">
                      <Store size={14} className={role === 'vendor' ? 'text-blue-600' : 'text-blue-400'} />
                      <span>Dono de Petshop</span>
                    </div>
                    <p className="text-[10px] text-blue-800/80 mt-1 leading-normal">Gerencie equipe, serviços, estoque e faturamento.</p>
                  </button>
                </div>
              </div>
            )}

            {/* Dynamic Registration Fields */}
            {!isLogin && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-blue-800/85">Nome Completo *</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setCoverEyes(true)}
                      onBlur={() => setCoverEyes(false)}
                      placeholder="Ex: Carlos Albuquerque"
                      className="w-full pl-10 pr-4 py-3 bg-blue-50 border border-blue-250 rounded-xl text-xs text-slate-800 placeholder-blue-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all duration-200 font-medium"
                    />
                    <UserIcon className="absolute left-3.5 top-3.5 text-blue-400" size={14} />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-blue-800/85">Telefone Celular</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onFocus={() => setCoverEyes(true)}
                      onBlur={() => setCoverEyes(false)}
                      placeholder="Ex: (11) 99999-9999"
                      className="w-full pl-10 pr-4 py-3 bg-blue-50 border border-blue-250 rounded-xl text-xs text-slate-800 placeholder-blue-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all duration-200 font-medium"
                    />
                    <Phone className="absolute left-3.5 top-3.5 text-blue-400" size={14} />
                  </div>
                </div>
              </div>
            )}

            {/* Company field (only if Vendor and Registering) */}
            {!isLogin && role === 'vendor' && (
              <div className="animate-fade-in">
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-blue-800/85">Nome do Estabelecimento / Petshop *</label>
                <div className="relative">
                  <input 
                    type="text" 
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    onFocus={() => setCoverEyes(true)}
                    onBlur={() => setCoverEyes(false)}
                    placeholder="Ex: Petlove Express, Clínica VetVibe"
                    className="w-full pl-10 pr-4 py-3 bg-blue-50 border border-blue-250 rounded-xl text-xs text-slate-800 placeholder-blue-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all duration-200 font-medium"
                  />
                  <Store className="absolute left-3.5 top-3.5 text-blue-400" size={14} />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-blue-800/85">E-mail de Acesso *</label>
              <div className="relative">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setCoverEyes(true)}
                  onBlur={() => setCoverEyes(false)}
                  placeholder="Ex: seu@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-blue-50 border border-blue-250 rounded-xl text-xs text-slate-800 placeholder-blue-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all duration-200 font-medium"
                />
                <Mail className="absolute left-3.5 top-3.5 text-blue-400" size={14} />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 transition-all duration-200 shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-6"
            >
              <span>{loading ? 'Processando dados...' : isLogin ? 'Acessar a Plataforma' : 'Finalizar Cadastro Integrado'}</span>
              {!loading && <ArrowRight size={14} />}
              {loading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
            </button>

          </form>
        </div>



      </div>
    </div>
  );
}
