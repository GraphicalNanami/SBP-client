/**
 * ChipInput Component
 * Reusable component for managing tags/chips with suggestions
 */

'use client';

import { useState, KeyboardEvent, ChangeEvent } from 'react';
import { X } from 'lucide-react';

interface ChipInputProps {
  chips: string[];
  onAdd: (chip: string) => void;
  onRemove: (chip: string) => void;
  suggestions?: readonly string[];
  placeholder?: string;
  maxChips?: number;
  label?: string;
}

export const ChipInput = ({
  chips,
  onAdd,
  onRemove,
  suggestions = [],
  placeholder = 'Add...',
  maxChips = 50,
  label,
}: ChipInputProps) => {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter suggestions based on input and exclude already selected chips
  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      suggestion.toLowerCase().includes(input.toLowerCase()) &&
      !chips.includes(suggestion)
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setShowSuggestions(true);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      addChip(input.trim());
    } else if (e.key === 'Backspace' && !input && chips.length > 0) {
      onRemove(chips[chips.length - 1]);
    }
  };

  const addChip = (value: string) => {
    if (chips.length >= maxChips) {
      return;
    }
    if (!chips.includes(value)) {
      onAdd(value);
    }
    setInput('');
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    addChip(suggestion);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-[#1A1A1A]">
          {label}
        </label>
      )}

      {/* Chips container */}
      <div className="flex flex-wrap gap-2 mb-2">
        {chips.map((chip) => (
          <div
            key={chip}
            className="inline-flex items-center gap-1 px-3 py-1 bg-[#F5F5F5] border border-[#E5E5E5] rounded-full text-sm text-[#1A1A1A] transition-all duration-200 hover:border-[#1A1A1A]"
          >
            <span>{chip}</span>
            <button
              type="button"
              onClick={() => onRemove(chip)}
              className="hover:text-red-600 transition-colors"
              aria-label={`Remove ${chip}`}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Input field */}
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={
            chips.length >= maxChips
              ? `Maximum ${maxChips} items reached`
              : placeholder
          }
          disabled={chips.length >= maxChips}
          className="w-full px-4 py-2 border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm md:text-base"
        />

        {/* Suggestions dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-[#E5E5E5] rounded-xl shadow-lg max-h-48 overflow-y-auto">
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-[#F5F5F5] transition-colors first:rounded-t-xl last:rounded-b-xl"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Helper text */}
      <p className="text-xs text-[#4D4D4D]">
        {chips.length}/{maxChips} items • Press Enter to add
      </p>
    </div>
  );
};
