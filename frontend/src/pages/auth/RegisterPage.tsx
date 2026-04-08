import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";

import { signUpWithPassword } from "@/modules/auth/api";
import { AuthForm } from "@/modules/auth/components/AuthForm";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";

export function RegisterPage() {
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: signUpWithPassword,
    onSuccess: (data) => {
      if (data.session) {
        navigate("/dashboard", { replace: true });
        return;
      }
      setMessage("Account created. Check your email to confirm registration.");
    },
  });

  return (
    <AuthLayout
      title="Register"
      description="Create an account with Supabase Authentication."
      footer={
        <>
          Already have an account?{" "}
          <Link className="font-medium text-slate-900 underline" to="/login">
            Sign in
          </Link>
        </>
      }
    >
      <AuthForm
        title="Create a new account"
        description="Enter your email and password."
        cta="Create account"
        pending={mutation.isPending}
        errorMessage={
          mutation.error instanceof Error ? mutation.error.message : null
        }
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
