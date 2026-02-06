'use client';

import { useState } from 'react';
import { X, Save } from 'lucide-react';
import SettingsLayout from '@/src/userProfile/components/userProfileUI/SettingsLayout';

const ExperienceSettings = () => {
  const [formData, setFormData] = useState({
    roles: ['Developer', 'Designer'],
    codingYears: '3',
    ethereumLevel: 'Intermediate',
    programmingLanguages: ['JavaScript', 'TypeScript', 'Python', 'Solidity'],
    devTools: ['VS Code', 'Git', 'Docker', 'Figma'],
  });

  const [newRole, setNewRole] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newTool, setNewTool] = useState('');

  const handleRemoveTag = (type: 'roles' | 'programmingLanguages' | 'devTools', value: string) => {
    setFormData({
      ...formData,
      [type]: formData[type].filter((item) => item !== value),
    });
  };

  const handleAddTag = (type: 'roles' | 'programmingLanguages' | 'devTools', value: string) => {
    if (value && !formData[type].includes(value)) {
      setFormData({
        ...formData,
        [type]: [...formData[type], value],
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving experience:', formData);
    // TODO: Implement save functionality
  };

  return (
    <SettingsLayout>
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2" style={{ fontFamily: 'var(--font-onest)' }}>
          Experience
        </h1>
        <p className="text-muted-foreground mb-8">
          Share your skills and experience with the community
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Roles */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              I am a
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.roles.map((role) => (
                <span
                  key={role}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-full text-sm font-medium"
                >
                  {role}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag('roles', role)}
                    className="hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag('roles', newRole);
                    setNewRole('');
                  }
                }}
                placeholder="Add a role..."
                className="flex-1 px-4 py-3 bg-[#F5F3EE] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
              />
              <button
                type="button"
                onClick={() => {
                  handleAddTag('roles', newRole);
                  setNewRole('');
                }}
                className="px-6 py-3 bg-foreground text-background rounded-xl hover:bg-foreground/90 transition-all duration-200 font-medium"
              >
                Add
              </button>
            </div>
          </div>

          {/* Coding Years and Ethereum Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                How long have you been coding?
              </label>
              <input
                type="text"
                name="codingYears"
                value={formData.codingYears}
                onChange={(e) => setFormData({ ...formData, codingYears: e.target.value })}
                placeholder="e.g., 3 years"
                className="w-full px-4 py-3 bg-[#F5F3EE] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Ethereum Level
              </label>
              <select
                name="ethereumLevel"
                value={formData.ethereumLevel}
                onChange={(e) => setFormData({ ...formData, ethereumLevel: e.target.value })}
                className="w-full px-4 py-3 bg-[#F5F3EE] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all appearance-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>

          {/* Programming Languages */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Programming Languages
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.programmingLanguages.map((lang) => (
                <span
                  key={lang}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/10 text-foreground border border-border rounded-full text-sm font-medium"
                >
                  {lang}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag('programmingLanguages', lang)}
                    className="hover:text-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag('programmingLanguages', newLanguage);
                    setNewLanguage('');
                  }
                }}
                placeholder="Add a language..."
                className="flex-1 px-4 py-3 bg-[#F5F3EE] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
              />
              <button
                type="button"
                onClick={() => {
                  handleAddTag('programmingLanguages', newLanguage);
                  setNewLanguage('');
                }}
                className="px-6 py-3 bg-foreground text-background rounded-xl hover:bg-foreground/90 transition-all duration-200 font-medium"
              >
                Add
              </button>
            </div>
          </div>

          {/* Development Tools */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Development Tools
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.devTools.map((tool) => (
                <span
                  key={tool}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/10 text-foreground border border-border rounded-full text-sm font-medium"
                >
                  {tool}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag('devTools', tool)}
                    className="hover:text-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTool}
                onChange={(e) => setNewTool(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag('devTools', newTool);
                    setNewTool('');
                  }
                }}
                placeholder="Add a tool..."
                className="flex-1 px-4 py-3 bg-[#F5F3EE] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
              />
              <button
                type="button"
                onClick={() => {
                  handleAddTag('devTools', newTool);
                  setNewTool('');
                }}
                className="px-6 py-3 bg-foreground text-background rounded-xl hover:bg-foreground/90 transition-all duration-200 font-medium"
              >
                Add
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t border-border">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-xl hover:bg-foreground/90 transition-all duration-200 font-medium"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </SettingsLayout>
  );
};

export default ExperienceSettings;
