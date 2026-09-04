import React from 'react';
import { Upload } from 'lucide-react';

interface ProfilePictureInputProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

export const ProfilePictureInput: React.FC<ProfilePictureInputProps> = ({
  file,
  onFileSelect,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-200 mb-2">
        Profile Picture <span className="text-gray-400 font-normal">(Optional)</span>
      </label>
      <div className="relative">
        <input
          id="profile_picture"
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              onFileSelect(e.target.files[0]);
            }
          }}
          className="hidden"
        />
        <label
          htmlFor="profile_picture"
          className="w-full flex items-center justify-between px-4 py-2.5 bg-[#1a1a1a] border border-gray-800 hover:border-gray-700 rounded-lg text-sm text-gray-300 cursor-pointer transition-colors"
        >
          <span className="truncate">{file ? file.name : 'Choose image file...'}</span>
          <span className="px-3 py-1 bg-red-600/80 hover:bg-red-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 shrink-0 ml-2">
            <Upload className="w-3.5 h-3.5" />
            Browse
          </span>
        </label>
      </div>
    </div>
  );
};
