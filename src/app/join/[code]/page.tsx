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
        setError(typeof joinError === 'string' ? joinError : (joinError as any).message || 'Failed to join group');
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
            <h2 className="text-xl font-semibold">Joining group...</h2>
            <p className="text-gray-500 mt-2">Please wait while we process your invite.</p>
          </>
        )}
        {error && (
          <>
            <XCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-red-600">Failed to join</h2>
            <p className="text-gray-500 mt-2">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => router.push('/groups')}>
              Go to Groups
            </Button>
          </>
        )}
        {success && (
          <>
            <CheckCircle2 size={48} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-xl font-semibold text-green-600">Joined successfully!</h2>
            <p className="text-gray-500 mt-2">You&apos;re now part of the group.</p>
            <Button className="mt-4" onClick={() => router.push('/groups')}>
              Go to Groups
            </Button>
          </>
        )}
      </div>
    </main>
  );
}
