import React, { useState } from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { Input } from '../../components/Input';
import type { SignupFormValues } from './SignupForm';

interface SignupFormFieldsProps {
  register: UseFormRegister<SignupFormValues>;
  errors: FieldErrors<SignupFormValues>;
}

export const SignupFormFields: React.FC<SignupFormFieldsProps> = ({ register, errors }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input id="firstName" label="First Name" placeholder="John" leftIcon={User} error={errors.firstName?.message} {...register('firstName')} />
        <Input id="lastName" label="Last Name" placeholder="Doe" leftIcon={User} error={errors.lastName?.message} {...register('lastName')} />
      </div>

      <Input id="email" type="email" label="Email Address" placeholder="name@example.com" autoComplete="email" leftIcon={Mail} error={errors.email?.message} {...register('email')} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input id="password" type={showPassword ? 'text' : 'password'} label="Password" placeholder="••••••••" leftIcon={Lock} error={errors.password?.message} rightElement={<button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-white" tabIndex={-1}>{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>} {...register('password')} />
        <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} label="Confirm Password" placeholder="••••••••" leftIcon={Lock} error={errors.confirmPassword?.message} rightElement={<button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-gray-400 hover:text-white" tabIndex={-1}>{showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>} {...register('confirmPassword')} />
      </div>
    </div>
  );
};
