'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  Link2,
  Edit,
  Users,
  Zap,
  Check,
  Upload,
  Plus,
  X,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/src/shared/components/ui/button';
import { ChipInput } from '@/src/shared/components/factories/ChipInput';
import ImageUpload from '../buildUI/ImageUpload';
import type { BuildDashboardTab, BuildCategory, NetworkType, BuildSubmission } from '@/src/builds/types/build.types';

// Shared UI Components
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-2xl border border-[#E5E5E5] shadow-sm ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">{children}</h3>
);

const Label = ({ children, required = false }: { children: React.ReactNode; required?: boolean }) => (
  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

// CSS Classes
const inputClass = "w-full px-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent transition-all duration-200 text-sm md:text-base";
const textareaClass = `${inputClass} resize-none min-h-[120px]`;
const selectClass = inputClass;

// Build categories and tech stack suggestions
const BUILD_CATEGORIES: BuildCategory[] = [
  'DeFi', 'NFT & Gaming', 'Payments', 'Infrastructure', 'Developer Tools', 'Social Impact', 'Other'
];

const TECH_STACK_SUGGESTIONS = [
  'Stellar', 'Soroban', 'React', 'TypeScript', 'Next.js', 'Node.js', 'Python',
  'Rust', 'JavaScript', 'Go', 'Java', 'Swift', 'Kotlin', 'Flutter', 'Vue.js',
  'Angular', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes'
];

const SOCIAL_PLATFORMS = [
  'Twitter', 'Github', 'LinkedIn', 'Discord', 'Telegram', 'Medium', 'YouTube', 'Website'
];

interface SubmissionDashboardProps {
  build: BuildSubmission;
  activeTab: BuildDashboardTab;
  isSaving: boolean;
  saveSuccess: boolean;
  canPublish: boolean;
  isInitializing: boolean;
  error: string | null;
  setActiveTab: (tab: BuildDashboardTab) => void;
  updateDetails: (details: Partial<BuildSubmission['details']>) => void;
  updateLinks: (links: Partial<BuildSubmission['links']>) => void;
  updateTeam: (team: Partial<BuildSubmission['team']>) => void;
  updateStellar: (stellar: Partial<BuildSubmission['stellar']>) => void;
  addTechStack: (tech: string) => void;
  removeTechStack: (index: number) => void;
  addSocialLink: (platform: string, url: string, type: 'links' | 'team') => void;
  removeSocialLink: (index: number, type: 'links' | 'team') => void;
  handleSave: () => void;
  handlePublish: () => void;
}

export default function SubmissionDashboard(props: SubmissionDashboardProps) {
  // Show loading state while initializing
  if (props.isInitializing) {
    return (
      <div className="min-h-screen bg-[#FCFCFC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#E5E5E5] border-t-[#1A1A1A] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#4D4D4D]">Creating your build...</p>
        </div>
      </div>
    );
  }

  // Show error state if initialization failed
  if (props.error && !props.build.id) {
    return (
      <div className="min-h-screen bg-[#FCFCFC] flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">Failed to Initialize Build</h2>
          <p className="text-[#4D4D4D] mb-6">{props.error}</p>
          <Link
            href="/builds"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] text-white rounded-xl hover:bg-[#333] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Builds
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFCFC]">
      {/* Error Banner */}
      {props.error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-800">{props.error}</p>
          </div>
        </div>
      )}

      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <Link href="/builds" className="flex items-center gap-2 text-[#4D4D4D] hover:text-[#1A1A1A] transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:block">Back to Builds</span>
              </Link>
              
              <div>
                <h1 className="text-xl font-semibold text-[#1A1A1A]">
                  {props.build.details.name || 'Untitled Build'}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    props.build.status === 'Draft' 
                      ? 'bg-yellow-100 text-yellow-800'
                      : props.build.status === 'Published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {props.build.status}
                  </span>
                  {props.saveSuccess && (
                    <span className="text-sm text-green-600 flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      Saved
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={props.handleSave}
                disabled={props.isSaving}
                className="rounded-xl"
              >
                {props.isSaving ? 'Saving...' : 'Save Draft'}
              </Button>
              <Button
                onClick={props.handlePublish}
                disabled={!props.canPublish || props.isSaving}
                className="bg-[#1A1A1A] text-white hover:bg-[#333] rounded-xl"
              >
                {props.isSaving ? 'Publishing...' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Tab Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <nav className="space-y-1">
                {[
                  { id: 'details', label: 'Build Details', icon: FileText },
                  { id: 'links', label: 'Links & Media', icon: Link2 },
                  { id: 'description', label: 'Description', icon: Edit },
                  { id: 'team', label: 'Team & Contact', icon: Users },
                  { id: 'stellar', label: 'Stellar Integration', icon: Zap },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => props.setActiveTab(id as BuildDashboardTab)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      props.activeTab === id
                        ? 'bg-[#1A1A1A] text-white'
                        : 'text-[#1A1A1A] hover:bg-[#F5F5F5]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Tab Content */}
              <div className="lg:col-span-2">
                {props.activeTab === 'details' && (
                  <DetailsTab {...props} />
                )}
                {props.activeTab === 'links' && (
                  <LinksTab {...props} />
                )}
                {props.activeTab === 'description' && (
                  <DescriptionTab {...props} />
                )}
                {props.activeTab === 'team' && (
                  <TeamTab {...props} />
                )}
                {props.activeTab === 'stellar' && (
                  <StellarTab {...props} />
                )}
              </div>

              {/* Sidebar (only show on details tab for desktop) */}
              {props.activeTab === 'details' && (
                <div className="lg:col-span-1 hidden lg:block">
                  <PublishChecklist {...props} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tab Components
function DetailsTab(props: SubmissionDashboardProps) {
  return (
    <Card className="p-6">
      <SectionTitle>Build Details</SectionTitle>
      
      <div className="space-y-6">
        {/* Build Name */}
        <div>
          <Label required>Build Name</Label>
          <input
            type="text"
            value={props.build.details.name}
            onChange={(e) => props.updateDetails({ name: e.target.value })}
            className={inputClass}
            placeholder="Enter your build name"
          />
        </div>

        {/* Logo */}
        <ImageUpload
          value={props.build.details.logo}
          onChange={(logo) => props.updateDetails({ logo })}
          label="Logo"
          className=""
        />

        {/* Tagline */}
        <div>
          <Label required>Tagline</Label>
          <input
            type="text"
            value={props.build.details.tagline}
            onChange={(e) => props.updateDetails({ tagline: e.target.value })}
            className={inputClass}
            placeholder="Brief description of your build (max 120 characters)"
            maxLength={120}
          />
          <p className="text-xs text-[#4D4D4D] mt-1">
            {props.build.details.tagline.length}/120 characters
          </p>
        </div>

        {/* Category */}
        <div>
          <Label required>Category</Label>
          <select
            value={props.build.details.category}
            onChange={(e) => props.updateDetails({ category: e.target.value as BuildCategory })}
            className={selectClass}
          >
            <option value="">Select a category</option>
            {BUILD_CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Tech Stack */}
        <div>
          <ChipInput
            chips={props.build.details.techStack}
            onAdd={props.addTechStack}
            onRemove={(chip) => {
              const index = props.build.details.techStack.indexOf(chip);
              props.removeTechStack(index);
            }}
            suggestions={TECH_STACK_SUGGESTIONS}
            placeholder="Add technology..."
            label="Tech Stack *"
            maxChips={20}
          />
        </div>

        {/* Short Description */}
        <div>
          <Label required>Short Description</Label>
          <textarea
            value={props.build.details.description}
            onChange={(e) => props.updateDetails({ description: e.target.value })}
            className={textareaClass}
            placeholder="Provide a brief overview of what your build does..."
          />
        </div>
      </div>
    </Card>
  );
}

function LinksTab(props: SubmissionDashboardProps) {
  const [socialPlatform, setSocialPlatform] = useState('');
  const [socialUrl, setSocialUrl] = useState('');

  const addSocial = () => {
    if (socialPlatform && socialUrl) {
      props.addSocialLink(socialPlatform, socialUrl, 'links');
      setSocialPlatform('');
      setSocialUrl('');
    }
  };

  return (
    <Card className="p-6">
      <SectionTitle>Links & Media</SectionTitle>
      
      <div className="space-y-6">
        {/* GitHub */}
        <div>
          <Label>GitHub Repository</Label>
          <input
            type="url"
            value={props.build.links.github}
            onChange={(e) => props.updateLinks({ github: e.target.value })}
            className={inputClass}
            placeholder="https://github.com/username/repo"
          />
        </div>

        {/* Website */}
        <div>
          <Label>Website</Label>
          <input
            type="url"
            value={props.build.links.website}
            onChange={(e) => props.updateLinks({ website: e.target.value })}
            className={inputClass}
            placeholder="https://yourproject.com"
          />
        </div>

        {/* Live Demo */}
        <div>
          <Label>Live Demo</Label>
          <input
            type="url"
            value={props.build.links.liveDemo}
            onChange={(e) => props.updateLinks({ liveDemo: e.target.value })}
            className={inputClass}
            placeholder="https://app.yourproject.com"
          />
        </div>

        {/* Demo Video */}
        <div>
          <Label>Demo Video</Label>
          <input
            type="url"
            value={props.build.links.demoVideo}
            onChange={(e) => props.updateLinks({ demoVideo: e.target.value })}
            className={inputClass}
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>

        {/* Social Links */}
        <div>
          <Label>Social Links</Label>
          
          {/* Existing social links */}
          <div className="space-y-2 mb-4">
            {props.build.links.socialLinks.map((link: { platform: string; url: string }, index: number) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-[#F5F5F5] rounded-xl">
                <span className="font-medium text-sm">{link.platform}:</span>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-sm text-blue-600 hover:underline truncate"
                >
                  {link.url}
                </a>
                <ExternalLink className="w-4 h-4 text-[#4D4D4D]" />
                <button
                  onClick={() => props.removeSocialLink(index, 'links')}
                  className="p-1 hover:text-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add new social link */}
          <div className="flex gap-2">
            <select
              value={socialPlatform}
              onChange={(e) => setSocialPlatform(e.target.value)}
              className={`${selectClass} flex-1`}
            >
              <option value="">Select platform</option>
              {SOCIAL_PLATFORMS.map((platform) => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
            <input
              type="url"
              value={socialUrl}
              onChange={(e) => setSocialUrl(e.target.value)}
              placeholder="URL"
              className={`${inputClass} flex-2`}
            />
            <Button
              onClick={addSocial}
              disabled={!socialPlatform || !socialUrl}
              variant="outline"
              size="icon"
              className="rounded-xl"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function DescriptionTab(props: SubmissionDashboardProps) {
  return (
    <Card className="p-6">
      <SectionTitle>Project Description</SectionTitle>
      
      <div className="space-y-6">
        <div>
          <Label>Detailed Description</Label>
          <textarea
            value={props.build.details.description}
            onChange={(e) => props.updateDetails({ description: e.target.value })}
            className={`${textareaClass} min-h-[300px]`}
            placeholder="Provide a comprehensive description of your build. Include:&#10;&#10;• What problem it solves&#10;• How it works&#10;• Key features&#10;• Technical architecture&#10;• Future roadmap"
          />
        </div>
      </div>
    </Card>
  );
}

function TeamTab(props: SubmissionDashboardProps) {
  const [socialPlatform, setSocialPlatform] = useState('');
  const [socialUrl, setSocialUrl] = useState('');

  const addTeamSocial = () => {
    if (socialPlatform && socialUrl) {
      props.addSocialLink(socialPlatform, socialUrl, 'team');
      setSocialPlatform('');
      setSocialUrl('');
    }
  };

  return (
    <Card className="p-6">
      <SectionTitle>Team & Contact</SectionTitle>
      
      <div className="space-y-6">
        {/* Contact Email */}
        <div>
          <Label required>Contact Email</Label>
          <input
            type="email"
            value={props.build.team.contactEmail}
            onChange={(e) => props.updateTeam({ contactEmail: e.target.value })}
            className={inputClass}
            placeholder="team@yourproject.com"
          />
        </div>

        {/* Team Description */}
        <div>
          <Label>Team Description</Label>
          <textarea
            value={props.build.team.description}
            onChange={(e) => props.updateTeam({ description: e.target.value })}
            className={textareaClass}
            placeholder="Tell us about your team: backgrounds, experience, roles..."
          />
        </div>

        {/* Team Social Links */}
        <div>
          <Label>Team Social Links</Label>
          
          {/* Existing team social links */}
          <div className="space-y-2 mb-4">
            {props.build.team.teamSocials.map((link: { platform: string; url: string }, index: number) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-[#F5F5F5] rounded-xl">
                <span className="font-medium text-sm">{link.platform}:</span>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-sm text-blue-600 hover:underline truncate"
                >
                  {link.url}
                </a>
                <ExternalLink className="w-4 h-4 text-[#4D4D4D]" />
                <button
                  onClick={() => props.removeSocialLink(index, 'team')}
                  className="p-1 hover:text-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add new team social link */}
          <div className="flex gap-2">
            <select
              value={socialPlatform}
              onChange={(e) => setSocialPlatform(e.target.value)}
              className={`${selectClass} flex-1`}
            >
              <option value="">Select platform</option>
              {SOCIAL_PLATFORMS.map((platform) => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
            <input
              type="url"
              value={socialUrl}
              onChange={(e) => setSocialUrl(e.target.value)}
              placeholder="URL"
              className={`${inputClass} flex-2`}
            />
            <Button
              onClick={addTeamSocial}
              disabled={!socialPlatform || !socialUrl}
              variant="outline"
              size="icon"
              className="rounded-xl"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function StellarTab(props: SubmissionDashboardProps) {
  return (
    <Card className="p-6">
      <SectionTitle>Stellar Integration</SectionTitle>
      
      <div className="space-y-6">
        {/* Network Type */}
        <div>
          <Label required>Network</Label>
          <div className="flex gap-4">
            {(['Testnet', 'Mainnet'] as NetworkType[]).map((network) => (
              <label
                key={network}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="networkType"
                  value={network}
                  checked={props.build.stellar.networkType === network}
                  onChange={(e) => props.updateStellar({ networkType: e.target.value as NetworkType })}
                  className="text-[#1A1A1A] focus:ring-[#1A1A1A]"
                />
                <span className="text-sm font-medium text-[#1A1A1A]">{network}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Contract Address */}
        <div>
          <Label>Smart Contract Address</Label>
          <input
            type="text"
            value={props.build.stellar.contractAddress}
            onChange={(e) => props.updateStellar({ contractAddress: e.target.value })}
            className={inputClass}
            placeholder="CBQHNAXSI55GX2GN6D67GK7BHVPSLJUGZQEU7WJ5LKR5PNUCGLIMAO4K"
          />
          <p className="text-xs text-[#4D4D4D] mt-1">
            Enter your Soroban smart contract address if applicable
          </p>
        </div>

        {/* Stellar Address */}
        <div>
          <Label>Stellar Account Address</Label>
          <input
            type="text"
            value={props.build.stellar.stellarAddress}
            onChange={(e) => props.updateStellar({ stellarAddress: e.target.value })}
            className={inputClass}
            placeholder="GBJCHUKZMTFSLOMNC7P4TS4VJJBTCYL3XKSOLXAUJSD56C4LHND5TWUC"
          />
          <p className="text-xs text-[#4D4D4D] mt-1">
            Your project's Stellar account address
          </p>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> At least one of the above addresses is required to publish your build.
            This helps us verify your integration with the Stellar network.
          </p>
        </div>
      </div>
    </Card>
  );
}

function PublishChecklist(props: SubmissionDashboardProps) {
  const checklistItems = [
    { label: 'Build name', completed: props.build.details.name.trim() !== '' },
    { label: 'Tagline', completed: props.build.details.tagline.trim() !== '' },
    { label: 'Description', completed: props.build.details.description.trim() !== '' },
    { label: 'Category', completed: props.build.details.category !== '' },
    { label: 'Tech stack', completed: props.build.details.techStack.length > 0 },
    { label: 'Contact email', completed: props.build.team.contactEmail.trim() !== '' },
    { label: 'Stellar integration', completed: props.build.stellar.contractAddress.trim() !== '' || props.build.stellar.stellarAddress.trim() !== '' },
    { label: 'Network type', completed: props.build.stellar.networkType !== '' },
  ];

  const completedCount = checklistItems.filter(item => item.completed).length;

  return (
    <Card className="p-6">
      <SectionTitle>Publish Checklist</SectionTitle>
      
      <div className="space-y-3 mb-6">
        {checklistItems.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              item.completed 
                ? 'bg-green-500 border-green-500' 
                : 'border-[#E5E5E5]'
            }`}>
              {item.completed && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className={`text-sm ${
              item.completed ? 'text-[#1A1A1A]' : 'text-[#4D4D4D]'
            }`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <div className="text-sm text-[#4D4D4D] mb-4">
        {completedCount}/{checklistItems.length} requirements completed
      </div>

      <div className="w-full bg-[#E5E5E5] rounded-full h-2">
        <div 
          className="bg-green-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(completedCount / checklistItems.length) * 100}%` }}
        />
      </div>
    </Card>
  );
}