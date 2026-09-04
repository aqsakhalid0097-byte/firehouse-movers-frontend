import React from 'react';
import { User, Phone, MapPin, Briefcase, Calendar, Heart, Lock, Camera, Image as ImageIcon } from 'lucide-react';
import { Input } from '../../components/Input';

interface ProfileFormFieldsProps {
  firstName: string; setFirstName: (v: string) => void;
  lastName: string; setLastName: (v: string) => void;
  phone: string; setPhone: (v: string) => void;
  location: string; setLocation: (v: string) => void;
  role: string; setRole: (v: string) => void;
  jobTitle: string; setJobTitle: (v: string) => void;
  startDate: string; setStartDate: (v: string) => void;
  hobbies: string; setHobbies: (v: string) => void;
  quote: string; setQuote: (v: string) => void;
  email: string;
  profilePictureFile?: File | null;
  setProfilePictureFile?: (file: File | null) => void;
}

export const ProfileFormFields: React.FC<ProfileFormFieldsProps> = (props) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-red-400 uppercase tracking-wider flex items-center gap-2"><User className="w-4 h-4" /> Basic Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input id="firstName" label="First Name" value={props.firstName} onChange={(e) => props.setFirstName(e.target.value)} leftIcon={User} />
          <Input id="lastName" label="Last Name" value={props.lastName} onChange={(e) => props.setLastName(e.target.value)} leftIcon={User} />
          <div className="md:col-span-2">
            <Input id="email" label="Email Address" value={props.email} readOnly leftIcon={Lock} className="opacity-60 cursor-not-allowed" />
            <p className="text-xs text-gray-400 mt-1">Contact your admin to change email address</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-800">
        <h4 className="text-sm font-bold text-red-400 uppercase tracking-wider flex items-center gap-2"><Phone className="w-4 h-4" /> Contact Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input id="phone" label="Phone Number" value={props.phone} onChange={(e) => props.setPhone(e.target.value)} leftIcon={Phone} placeholder="(972) 992-1969" />
          <Input id="location" label="Location" value={props.location} onChange={(e) => props.setLocation(e.target.value)} leftIcon={MapPin} placeholder="Lewisville, TX" />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-800">
        <h4 className="text-sm font-bold text-red-400 uppercase tracking-wider flex items-center gap-2"><Briefcase className="w-4 h-4" /> Professional Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input id="role" label="Role" value={props.role} onChange={(e) => props.setRole(e.target.value)} leftIcon={User} />
          <Input id="jobTitle" label="Job Title" value={props.jobTitle} onChange={(e) => props.setJobTitle(e.target.value)} leftIcon={Briefcase} />
          <Input id="startDate" label="Start Date" value={props.startDate} onChange={(e) => props.setStartDate(e.target.value)} leftIcon={Calendar} />
        </div>
      </div>

      {/* Profile Picture Upload Section */}
      <div className="space-y-3 pt-4 border-t border-gray-800">
        <h4 className="text-sm font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
          <Camera className="w-4 h-4 text-red-400" /> Profile Picture
        </h4>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-white flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-gray-400" /> Upload New Picture
          </label>
          <div className="relative">
            <input
              type="file"
              id="profile_picture_upload"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  props.setProfilePictureFile?.(e.target.files[0]);
                }
              }}
            />
            <label
              htmlFor="profile_picture_upload"
              className="w-full flex items-center gap-3 px-4 py-3 bg-[#1a1a1a] border border-[#333333] hover:border-gray-700 rounded-xl cursor-pointer transition-colors"
            >
              <span className="px-3 py-1 bg-[#262626] border border-gray-700 text-white text-xs font-semibold rounded-lg hover:bg-gray-700 transition-colors">
                Choose file
              </span>
              <span className="text-sm text-gray-300 truncate">
                {props.profilePictureFile ? props.profilePictureFile.name : 'No file chosen'}
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-800">
        <h4 className="text-sm font-bold text-red-400 uppercase tracking-wider flex items-center gap-2"><Heart className="w-4 h-4" /> Personal</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input id="hobbies" label="Hobbies" value={props.hobbies} onChange={(e) => props.setHobbies(e.target.value)} placeholder="Fitness, Photography" />
          <Input id="quote" label="Favourite Quote" value={props.quote} onChange={(e) => props.setQuote(e.target.value)} placeholder="Move with purpose." />
        </div>
      </div>
    </div>
  );
};
