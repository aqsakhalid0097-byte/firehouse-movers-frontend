import React, { useState } from "react";
import { X, Target } from "lucide-react";
import type { Goal, GoalScope } from "./types";
import { Button } from "../../components/Button";

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGoal: (goal: Omit<Goal, "id">) => void;
}

export const AddGoalModal: React.FC<AddGoalModalProps> = ({
  isOpen,
  onClose,
  onAddGoal,
}) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Operations");
  const [scope, setScope] = useState<GoalScope>("Personal");
  const [targetMetric, setTargetMetric] = useState("");
  const [targetValue, setTargetValue] = useState<number>(100);
  const [unit, setUnit] = useState("%");
  const [deadline, setDeadline] = useState("");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetMetric) return;

    onAddGoal({
      title,
      category,
      scope,
      targetMetric,
      currentValue: 0,
      targetValue: Number(targetValue) || 100,
      unit: unit || "%",
      deadline: deadline || "2026-09-30",
      status: "In Progress",
      notes: notes || undefined,
      milestones: [
        { id: 1, title: "Initial planning & daily tracking setup", completed: false },
        { id: 2, title: "Midway review milestone", completed: false },
        { id: 3, title: "Final target achievement", completed: false },
      ],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Set New KPI / Goal</h2>
              <p className="text-xs text-gray-400">Establish a measurable milestone or team benchmark</p>
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
              Goal Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Complete 40 Move Dispatches"
              className="w-full bg-[#262626] border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#262626] border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
              >
                <option value="Operations">Operations</option>
                <option value="Customer Service">Customer Service</option>
                <option value="Safety & Quality">Safety & Quality</option>
                <option value="Performance">Performance</option>
                <option value="Training">Training</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
                Scope
              </label>
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value as GoalScope)}
                className="w-full bg-[#262626] border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
              >
                <option value="Personal">Personal</option>
                <option value="Team">Team</option>
                <option value="Company">Company Wide</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
              Target Metric Description *
            </label>
            <input
              type="text"
              required
              value={targetMetric}
              onChange={(e) => setTargetMetric(e.target.value)}
              placeholder="e.g. Completed dispatches count"
              className="w-full bg-[#262626] border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
                Target Value
              </label>
              <input
                type="number"
                required
                value={targetValue}
                onChange={(e) => setTargetValue(Number(e.target.value))}
                className="w-full bg-[#262626] border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
                Unit
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Moves, %, Stars"
                className="w-full bg-[#262626] border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
                Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-[#262626] border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
              Action Plan / Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Outline steps needed to hit this benchmark..."
              className="w-full bg-[#262626] border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <Button variant="primary" type="submit">
              Save & Set Goal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
