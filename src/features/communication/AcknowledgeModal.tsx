import React, { useState } from 'react';
import { CheckCircle2, StickyNote, X, Loader2, PenTool, Type, AlertCircle } from 'lucide-react';
import { SignaturePad } from './SignaturePad';
import type { AcknowledgeLogPayload } from '../../api/types';

interface AcknowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: AcknowledgeLogPayload) => Promise<void>;
  isLoading?: boolean;
  defaultSignerName?: string;
}

type ModalStep = 'choice' | 'with_notes' | 'simple';
type SignatureMode = 'draw' | 'type';

export const AcknowledgeModal: React.FC<AcknowledgeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  defaultSignerName = '',
}) => {
  const [step, setStep] = useState<ModalStep>('choice');
  const [note, setNote] = useState('');
  const [drawnSignature, setDrawnSignature] = useState<string | null>(null);
  const [typedSignature, setTypedSignature] = useState(defaultSignerName);
  const [sigMode, setSigMode] = useState<SignatureMode>('draw');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setStep('choice');
    setNote('');
    setDrawnSignature(null);
    setTypedSignature(defaultSignerName);
    setErrorMessage(null);
    onClose();
  };

  const getSignatureValue = (): string | undefined => {
    if (sigMode === 'draw') {
      return drawnSignature || typedSignature.trim() || undefined;
    }
    return typedSignature.trim() || undefined;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const signature = getSignatureValue();

    try {
      await onConfirm({
        note: step === 'with_notes' && note.trim() ? note.trim() : undefined,
        responder_signature: signature,
      });
      handleClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        err?.message ||
        'Failed to acknowledge communication. Please try again.';
      setErrorMessage(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      {/* Choice Modal */}
      {step === 'choice' && (
        <div className="bg-[#1a1a1a] border border-neutral-800 rounded-xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
              <span>Acknowledge Communication</span>
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed">
            Do you want to add notes or feedback when acknowledging this communication?
          </p>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => {
                setErrorMessage(null);
                setStep('with_notes');
              }}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm shadow-lg shadow-blue-900/30"
            >
              <StickyNote className="w-4 h-4" />
              <span>Yes, Add Notes & Response</span>
            </button>

            <button
              onClick={() => {
                setErrorMessage(null);
                setStep('simple');
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm shadow-lg shadow-emerald-900/30"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>No, Just Acknowledge</span>
            </button>

            <button
              onClick={handleClose}
              className="w-full bg-[#262626] hover:bg-[#333333] text-gray-300 font-semibold py-2.5 px-5 rounded-lg transition-colors cursor-pointer text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* With Notes Modal */}
      {step === 'with_notes' && (
        <div className="bg-[#1a1a1a] border border-neutral-800 rounded-xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <StickyNote className="w-5 h-5 text-blue-400" />
              <span>Add Notes & Acknowledge</span>
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {errorMessage && (
            <div className="bg-red-950/50 border border-red-800 text-red-300 text-xs p-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
                Response Note / Remarks
              </label>
              <textarea
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Enter your response, confirmation notes, or questions..."
                className="w-full bg-[#262626] border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 resize-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-gray-300 uppercase">
                  Digital Signature (Optional)
                </label>
                <div className="flex items-center gap-1 bg-[#262626] p-0.5 rounded-md border border-neutral-700">
                  <button
                    type="button"
                    onClick={() => setSigMode('draw')}
                    className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                      sigMode === 'draw' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <PenTool className="w-3 h-3" /> Draw
                  </button>
                  <button
                    type="button"
                    onClick={() => setSigMode('type')}
                    className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                      sigMode === 'type' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Type className="w-3 h-3" /> Type
                  </button>
                </div>
              </div>

              {sigMode === 'draw' ? (
                <SignaturePad onSignatureChange={setDrawnSignature} />
              ) : (
                <input
                  type="text"
                  value={typedSignature}
                  onChange={(e) => setTypedSignature(e.target.value)}
                  placeholder="Type your full name as signature"
                  className="w-full bg-[#262626] border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white font-serif italic placeholder-gray-500 focus:outline-none focus:border-red-500"
                />
              )}
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm shadow-md"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Submit & Acknowledge</span>
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="bg-[#262626] hover:bg-[#333333] text-gray-300 font-semibold py-2.5 px-5 rounded-lg transition-colors cursor-pointer text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Simple Signature Modal */}
      {step === 'simple' && (
        <div className="bg-[#1a1a1a] border border-neutral-800 rounded-xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Confirm Acknowledgment</span>
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed">
            By acknowledging, you confirm that you have read, understood, and agreed to this communication record.
          </p>

          {errorMessage && (
            <div className="bg-red-950/50 border border-red-800 text-red-300 text-xs p-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-gray-300 uppercase">
                  Digital Signature (Optional)
                </label>
                <div className="flex items-center gap-1 bg-[#262626] p-0.5 rounded-md border border-neutral-700">
                  <button
                    type="button"
                    onClick={() => setSigMode('draw')}
                    className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                      sigMode === 'draw' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <PenTool className="w-3 h-3" /> Draw
                  </button>
                  <button
                    type="button"
                    onClick={() => setSigMode('type')}
                    className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                      sigMode === 'type' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Type className="w-3 h-3" /> Type
                  </button>
                </div>
              </div>

              {sigMode === 'draw' ? (
                <SignaturePad onSignatureChange={setDrawnSignature} />
              ) : (
                <input
                  type="text"
                  value={typedSignature}
                  onChange={(e) => setTypedSignature(e.target.value)}
                  placeholder="Type your full name as signature"
                  className="w-full bg-[#262626] border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white font-serif italic placeholder-gray-500 focus:outline-none focus:border-red-500"
                />
              )}
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm shadow-md"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Confirm Acknowledgment</span>
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="bg-[#262626] hover:bg-[#333333] text-gray-300 font-semibold py-2.5 px-5 rounded-lg transition-colors cursor-pointer text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
