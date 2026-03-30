'use client';

import { useRouter } from 'next/navigation';
import { useState, usEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

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

    const { data, error: signUpError } = await supabase.auth.signUpWithPassword({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
    } else if (data?.user?.id) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        email,
        name,
      });
      router.push('/dashboard');
    }
    setLoading(false);
  };

  return (
    <main className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md">
              