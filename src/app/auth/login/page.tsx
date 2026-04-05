'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [supabaseClient] = useState(createClient());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { data, error: signInError } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) {
      setError(signInError.message);
    } else if (data?.user?.id) {
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
        <p className="text-gray-500 text-center mb-6">Entre na sua conta</p>
        {error && (
          <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm mb-4 border border-red-500/20">{error}</div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
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
              placeholder="Sua senha"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Ainda não tem uma conta?{' '}
          <Link href="/auth/register" className="text-violet-400 hover:text-violet-300 transition-colors">Cadastre-se</Link>
        </p>
      </div>
    </main>
  );
}
