'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useGroups } from 'A/hooks/useAuth';
import { Button } from '@/components/ui/button';

export default function JoinPage() {
  const params = useParams();
  const code = params.code as string;
  const { joinGroup } = useGroups();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleJoin = async () => {
      setLoading(true);
      const { error: joinError } = await joinGroup(code);
      if (joinError) {
        setError(joinError.message);
      }
      setLoading(false);
    };
    handleJoin();
  }, [code, joinGroup]);

  if (error) {
    return (
      <main className="flex flex-col items-center justify-center h-screen">
        <div className="text-center">
              