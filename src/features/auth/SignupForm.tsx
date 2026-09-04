'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, Loader2 } from 'lucide-react';
import { SignupFormFields } from './SignupFormFields';
import { ProfilePictureInput } from './ProfilePictureInput';
import { CustomerCheckbox } from './CustomerCheckbox';
import { authApiClient } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import type { SignupResponse } from '../../api/types';

const signupSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    isCustomer: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;

export const SignupForm: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      isCustomer: true,
    },
  });

  const isCustomer = watch('isCustomer');

  const onSubmit = async (data: SignupFormValues) => {
    setServerError(null);
    try {
      const formData = new FormData();
      formData.append('first_name', data.firstName);
      formData.append('last_name', data.lastName);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('password_confirm', data.confirmPassword);
      formData.append('is_customer', data.isCustomer ? 'true' : 'false');
      if (profilePicture) {
        formData.append('profile_picture', profilePicture);
      }

      const response = await authApiClient.post<SignupResponse>('/signup/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
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
      if (err && typeof err === 'object' && 'data' in err) {
        const apiErr = err as { data?: { message?: string; detail?: string; fields?: Record<string, string[]> } };
        let msg = apiErr.data?.message || apiErr.data?.detail || 'Registration failed.';
        if (apiErr.data?.fields) {
          const fieldMsgs = Object.entries(apiErr.data.fields)
            .map(([field, errs]) => `${field}: ${Array.isArray(errs) ? errs.join(', ') : errs}`)
            .join(' | ');
          if (fieldMsgs) msg = fieldMsgs;
        }
        setServerError(msg);
      } else if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError('Registration failed. Please check your information and try again.');
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-auto p-8 sm:p-10 rounded-xl bg-[#1a1a1a] border border-neutral-800/80 shadow-2xl hover:border-red-500/30 transition-all duration-300">
      <div className="mb-6">
        <h2 className="animate-heading text-3xl sm:text-4xl font-extrabold text-red-500 mb-2 tracking-tight">
          Create Your Account
        </h2>
        <p className="text-gray-300 text-sm leading-relaxed">
          Join the team that moves with purpose. Fast, strong, and trusted.
        </p>
      </div>

      {serverError && (
        <div className="mb-5 p-4 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-sm flex items-start gap-3 animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1 leading-snug">{serverError}</div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <SignupFormFields register={register} errors={errors} />
        <ProfilePictureInput file={profilePicture} onFileSelect={setProfilePicture} />
        <CustomerCheckbox isChecked={isCustomer} register={register('isCustomer')} />

        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-red-500 hover:underline font-semibold">
              Log in
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
                <span>Creating Account…</span>
              </>
            ) : (
              <span>Sign Up</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
