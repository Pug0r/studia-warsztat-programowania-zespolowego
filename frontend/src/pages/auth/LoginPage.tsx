import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';

import { signInWithPassword } from '@/modules/auth/api';
import { AuthForm } from '@/modules/auth/components/AuthForm';
import { AuthLayout } from '@/modules/auth/components/AuthLayout';

export function LoginPage() {
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: signInWithPassword,
    onSuccess: () => {
      setMessage('Logged in successfully.');
      navigate('/dashboard', { replace: true });
    },
  });

  return (
    <AuthLayout
      title="Login"
      description="Sign in with your Supabase account."
      footer={
        <>
          Do not have an account?{' '}
          <Link className="font-medium text-slate-900 underline" to="/register">
            Register
          </Link>
        </>
      }
    >
      <AuthForm
        title="Welcome back"
        description="Enter your email and password."
        cta="Sign in"
        pending={mutation.isPending}
        errorMessage={mutation.error instanceof Error ? mutation.error.message : null}
        successMessage={message}
        onSubmit={async (values) => {
          setMessage(null);
          mutation.reset();
          await mutation.mutateAsync(values);
        }}
      />
    </AuthLayout>
  );
}
