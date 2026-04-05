'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
    } else if (data?.user?.id) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        username: name,
      });
      router.push('/objectives');
    }
    setLoading(false);
  };

  const inputClasses = "w-full bg-surface-lighter border border-surface-lighter rounded-lg px-3 py-2.5 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all";

  return (
    <main className="flex items-center justify-center h-screen bg-surface">
      <div className="bg-surface-card border border-surface-lighter p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap size={28} className="text-violet-500" />
          <h1 className="text-2xl font-bold font-display bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">TimeSkip</h1>
        </div>
        <p className="text-gray-500 text-center mb-6">Crie sua conta</p>
        {error && (
          <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm mb-4 border border-red-500/20">{error}</div>
        )}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClasses}
              placeholder="Seu nome"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClasses}
              placeholder="voce@exemplo.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClasses}
              placeholder="No mínimo 6 caracteres"
              required
              minLength={6}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar conta'}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Já tem uma conta?{' '}
          <Link href="/auth/login" className="text-violet-400 hover:text-violet-300 transition-colors">Entrar</Link>
        </p>
      </div>
    </main>
  );
}
