import React, { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { ProfileFormFields } from './ProfileFormFields';
import type { ProfileData } from './ProfileHeader';

export interface ProfileSaveData extends Partial<ProfileData> {
  profilePictureFile?: File | null;
}

interface ProfileInfoFormProps {
  initialData: ProfileData;
  onSave?: (updatedData: ProfileSaveData) => Promise<void>;
}

export const ProfileInfoForm: React.FC<ProfileInfoFormProps> = ({ initialData, onSave }) => {
  const [firstName, setFirstName] = useState(initialData.firstName);
  const [lastName, setLastName] = useState(initialData.lastName);
  const [phone, setPhone] = useState(initialData.phone);
  const [location, setLocation] = useState(initialData.location);
  const [role, setRole] = useState(initialData.role);
  const [jobTitle, setJobTitle] = useState(initialData.jobTitle);
  const [startDate, setStartDate] = useState(initialData.startDate);
  const [hobbies, setHobbies] = useState(initialData.hobbies || '');
  const [quote, setQuote] = useState(initialData.favouriteQuote || '');
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  React.useEffect(() => {
    setFirstName(initialData.firstName);
    setLastName(initialData.lastName);
    setPhone(initialData.phone);
    setLocation(initialData.location);
    setRole(initialData.role);
    setJobTitle(initialData.jobTitle);
    setStartDate(initialData.startDate);
    setHobbies(initialData.hobbies || '');
    setQuote(initialData.favouriteQuote || '');
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);
    setErrorMessage(null);
    try {
      if (onSave) {
        await onSave({
          firstName,
          lastName,
          phone,
          location,
          role,
          jobTitle,
          startDate,
          hobbies,
          favouriteQuote: quote,
          profilePictureFile,
        });
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section id="profile-edit" className="bg-[#262626] p-6 sm:p-8 rounded-2xl border border-[#333333] hover:border-red-500/30 transition-colors shadow-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-red-500">Profile Information</h3>
        {savedSuccess && (
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
            Profile saved successfully!
          </span>
        )}
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-950/40 border border-red-500/50 rounded-xl text-red-300 text-xs">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <ProfileFormFields
          firstName={firstName} setFirstName={setFirstName}
          lastName={lastName} setLastName={setLastName}
          phone={phone} setPhone={setPhone}
          location={location} setLocation={setLocation}
          role={role} setRole={setRole}
          jobTitle={jobTitle} setJobTitle={setJobTitle}
          startDate={startDate} setStartDate={setStartDate}
          hobbies={hobbies} setHobbies={setHobbies}
          quote={quote} setQuote={setQuote}
          email={initialData.email}
          profilePictureFile={profilePictureFile}
          setProfilePictureFile={setProfilePictureFile}
        />

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-8 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-red-600/25 disabled:opacity-60 cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSaving ? 'Saving…' : 'Save Profile'}</span>
          </button>
        </div>
      </form>
    </section>
  );
};
