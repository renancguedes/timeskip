'use client';

import { useRouter } from 'next/navigation';
import { useState, usEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

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
      router.push('/dashboard');
    }
    setLoading(false);
  };

  return (
    <main className="flex items-center justify-center h-screen bg-gray-50">
              