'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react';
import { Input } from '../../components/Input';
import { authApiClient } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import type { LoginResponse } from '../../api/types';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    try {
      const response = await authApiClient.post<LoginResponse>('/login/', {
        email: data.email,
        password: data.password,
      });

      if (response.data && response.data.user) {
        login(response.data.user);
      }

      let redirectTo = response.data?.redirect_to || '/';
      if (redirectTo === '/customer/' || redirectTo === '/customer') {
        redirectTo = '/customer';
      } else if (redirectTo === '/home' || redirectTo === '/dashboard') {
        redirectTo = '/';
      }

      if (redirectTo.startsWith('http://') || redirectTo.startsWith('https://')) {
        window.location.href = redirectTo;
      } else {
        router.push(redirectTo);
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object') {
        const apiErr = err as {
          status?: number;
          message?: string;
          data?: { message?: string; detail?: string; error?: string };
        };
        const msg =
          apiErr.data?.error ||
          apiErr.data?.message ||
          apiErr.data?.detail ||
          apiErr.message;

        if (apiErr.status === 401 || (msg && msg.toLowerCase().includes('credential'))) {
          setServerError('Invalid email or password. Please check your credentials and try again.');
        } else {
          setServerError(msg || 'Invalid email or password. Please check your credentials.');
        }
      } else if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError('Login failed. Please check your credentials and try again.');
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-auto p-8 sm:p-10 rounded-xl bg-[#1a1a1a] border border-neutral-800/80 shadow-2xl hover:border-red-500/30 transition-all duration-300">
      <div className="mb-6">
        <h2 className="animate-heading text-3xl sm:text-4xl font-extrabold text-red-500 mb-2.5 tracking-tight">
          Welcome Back
        </h2>
        <p className="text-gray-300 text-sm leading-relaxed">
          Sign in to continue your journey with the team that moves with purpose.
        </p>
      </div>

      {serverError && (
        <div className="mb-5 p-4 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-sm flex items-start gap-3 animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1 leading-snug">{serverError}</div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          id="email"
          type="email"
          label="Email Address"
          placeholder="name@example.com"
          autoComplete="email"
          leftIcon={Mail}
          error={errors.email?.message}
          {...register('email')}
        />

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
            Password
          </label>
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="current-password"
            leftIcon={Lock}
            error={errors.password?.message}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-white transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            {...register('password')}
          />
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <Link href="/signup" className="text-red-500 hover:underline font-semibold">
              Sign up
            </Link>
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-7 py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold text-sm rounded-lg shadow-lg shadow-red-600/25 transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in…</span>
              </>
            ) : (
              <span>Log In</span>
            )}
          </button>
        </div>
      </form>

      <p className="text-sm text-center mt-6">
        <a href="#forgot" className="text-red-500 hover:underline">
          Forgot your password?
        </a>
      </p>
    </div>
  );
};

export default LoginForm;
