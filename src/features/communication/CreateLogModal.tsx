import React, { useState } from "react";
import { X, FileText, Paperclip } from "lucide-react";
import type { LogCategory, LogEntry, LogUrgency } from "./types";
import { Button } from "../../components/Button";

interface CreateLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateLog: (log: Omit<LogEntry, "id" | "dateCreated">) => void;
}

export const CreateLogModal: React.FC<CreateLogModalProps> = ({
  isOpen,
  onClose,
  onCreateLog,
}) => {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<LogCategory>("Operations Note");
  const [urgency, setUrgency] = useState<LogUrgency>("Low");
  const [involvedStaff, setInvolvedStaff] = useState("");
  const [jobOrTruckNumber, setJobOrTruckNumber] = useState("");
  const [content, setContent] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !content) return;

    onCreateLog({
      subject,
      category,
      urgency,
      status: "In Review",
      authorName: "Marcus Vance",
      authorRole: "Crew Lead",
      authorAvatar: "/images/chris.jpg",
      involvedStaff: involvedStaff || undefined,
      jobOrTruckNumber: jobOrTruckNumber || undefined,
      content,
      attachmentsCount: 0,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1a1a1a] border border-neutral-800 rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Create Incident / Operational Log</h2>
              <p className="text-xs text-gray-400">Record a safety event, shift note, or commendation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
              Log Subject / Title *
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Hydraulic ramp inspection on Truck #104"
              className="w-full bg-[#262626] border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as LogCategory)}
                className="w-full bg-[#262626] border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
              >
                <option value="Operations Note">Operations Note</option>
                <option value="Safety Incident">Safety Incident</option>
                <option value="Vehicle & Equipment">Vehicle & Equipment</option>
                <option value="Customer Feedback">Customer Feedback</option>
                <option value="Disciplinary / Conduct">Disciplinary / Conduct</option>
                <option value="Commendation">Commendation</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
                Urgency Level
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as LogUrgency)}
                className="w-full bg-[#262626] border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
              >
                <option value="Low">Low (Informational)</option>
                <option value="Medium">Medium (Attention needed)</option>
                <option value="High">High (Urgent review)</option>
                <option value="Critical">Critical (Immediate safety action)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
                Job or Truck # (Optional)
              </label>
              <input
                type="text"
                value={jobOrTruckNumber}
                onChange={(e) => setJobOrTruckNumber(e.target.value)}
                placeholder="e.g. Job #JOB-8821 or Truck #104"
                className="w-full bg-[#262626] border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
                Staff Involved (Optional)
              </label>
              <input
                type="text"
                value={involvedStaff}
                onChange={(e) => setInvolvedStaff(e.target.value)}
                placeholder="e.g. David Miller, Carlos R."
                className="w-full bg-[#262626] border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
              Log Details & Findings *
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide specific notes, actions taken, observations, and recommendations..."
              className="w-full bg-[#262626] border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 resize-none"
            />
          </div>

          <div className="p-4 rounded-lg border border-dashed border-neutral-700 bg-[#262626]/30 text-center text-xs text-gray-400 flex flex-col items-center gap-1.5 cursor-pointer hover:border-red-500/50 transition-colors">
            <Paperclip className="w-4 h-4 text-gray-500" />
            <span>Click or drag photos / accident reports to attach</span>
            <span className="text-[10px] text-gray-500">PNG, JPG, PDF up to 10MB</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <Button variant="primary" type="submit">
              Submit Log Entry
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
