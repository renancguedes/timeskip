'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useGroups } from '@/hooks/useObjectives';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function JoinPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;
  const { joinGroup } = useGroups();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleJoin = async () => {
      setLoading(true);
      const { error: joinError } = await joinGroup(code);
      if (joinError) {
        setError(typeof joinError === 'string' ? joinError : (joinError as any).message || 'Falha ao entrar no grupo');
      } else {
        setSuccess(true);
      }
      setLoading(false);
    };
    handleJoin();
  }, [code, joinGroup]);

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        {loading && (
          <>
            <Loader2 size={48} className="mx-auto text-purple-600 animate-spin mb-4" />
            <h2 className="text-xl font-semibold">Entrando no grupo...</h2>
            <p className="text-gray-500 mt-2">Aguarde enquanto processamos seu convite.</p>
          </>
        )}
        {error && (
          <>
            <XCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-red-600">Falha ao entrar</h2>
            <p className="text-gray-500 mt-2">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => router.push('/groups')}>
              Ir para Grupos
            </Button>
          </>
        )}
        {success && (
          <>
            <CheckCircle2 size={48} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-xl font-semibold text-green-600">Entrou com sucesso!</h2>
            <p className="text-gray-500 mt-2">Você agora faz parte do grupo.</p>
            <Button className="mt-4" onClick={() => router.push('/groups')}>
              Ir para Grupos
            </Button>
          </>
        )}
      </div>
    </main>
  );
}
