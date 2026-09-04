import React from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { Check } from 'lucide-react';

interface CustomerCheckboxProps {
  isChecked: boolean;
  register: UseFormRegisterReturn;
}

export const CustomerCheckbox: React.FC<CustomerCheckboxProps> = ({
  isChecked,
  register,
}) => {
  return (
    <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
      <label className="flex items-start gap-3 cursor-pointer select-none">
        <input type="checkbox" className="sr-only" {...register} />
        <div
          className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 mt-0.5 ${
            isChecked
              ? 'bg-red-600 border-red-600 text-white'
              : 'bg-black/50 border-gray-700 text-transparent'
          }`}
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </div>
        <div>
          <span className="text-sm font-semibold text-white">Customer Account</span>
          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
            Check this box if you are booking or requesting quotes for moving services.
          </p>
        </div>
      </label>
    </div>
  );
};
