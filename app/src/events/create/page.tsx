'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/auth/hooks/useAuth';
import { liveEventsApi } from '../components/eventsService/liveEventsApi';
import type { LiveEventType, LiveEventHost } from '../types/live-events.types';
import { ArrowLeft, Plus, X, Calendar, MapPin, Users, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function CreateEventPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    eventType: 'MEETUP' as LiveEventType,
    country: '',
    location: '',
    bannerUrl: '',
    externalUrl: '',
    tags: [] as string[],
    hosts: [] as LiveEventHost[],
  });

  const [currentTag, setCurrentTag] = useState('');
  const [currentHost, setCurrentHost] = useState({ name: '', role: '', avatar: '' });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FCFCFC] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Sign in Required</h2>
          <p className="text-[#4D4D4D] mb-6">You need to be signed in to create events</p>
          <Link
            href="/auth"
            className="inline-block bg-[#1A1A1A] text-white px-8 py-3 rounded-xl hover:bg-[#333] transition-all"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description || undefined,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        eventType: formData.eventType,
        country: formData.country,
        location: formData.location || undefined,
        hosts: formData.hosts,
        bannerUrl: formData.bannerUrl || undefined,
        externalUrl: formData.externalUrl || undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
      };

      const createdEvent = await liveEventsApi.create(payload);
      router.push(`/src/events/${createdEvent.uuid}`);
    } catch (err) {
      console.error('Failed to create event:', err);
      setError(err instanceof Error ? err.message : 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, currentTag.trim()] });
      setCurrentTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const addHost = () => {
    if (currentHost.name.trim()) {
      setFormData({ ...formData, hosts: [...formData.hosts, { ...currentHost }] });
      setCurrentHost({ name: '', role: '', avatar: '' });
    }
  };

  const removeHost = (index: number) => {
    setFormData({ ...formData, hosts: formData.hosts.filter((_, i) => i !== index) });
  };

  return (
    <div className="min-h-screen bg-[#FCFCFC] py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/src/events"
          className="inline-flex items-center gap-2 text-[#4D4D4D] hover:text-[#1A1A1A] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Events
        </Link>

        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 lg:p-10">
          <h1 className="text-3xl md:text-4xl font-semibold mb-2">Create New Event</h1>
          <p className="text-[#4D4D4D] mb-8">Fill in the details to create your event</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:border-[#1A1A1A] transition-colors"
                placeholder="Enter event title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:border-[#1A1A1A] transition-colors resize-none"
                placeholder="Describe your event"
              />
            </div>

            {/* Event Type */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Event Type <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.eventType}
                onChange={e => setFormData({ ...formData, eventType: e.target.value as LiveEventType })}
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:border-[#1A1A1A] transition-colors"
              >
                <option value="MEETUP">Meetup</option>
                <option value="WORKSHOP_VIRTUAL">Virtual Workshop</option>
                <option value="WORKSHOP_PHYSICAL">Physical Workshop</option>
                <option value="CONFERENCE">Conference</option>
              </select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.startDate}
                  onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:border-[#1A1A1A] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.endDate}
                  onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:border-[#1A1A1A] transition-colors"
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={e => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:border-[#1A1A1A] transition-colors"
                  placeholder="e.g., India, USA"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  City/Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:border-[#1A1A1A] transition-colors"
                  placeholder="e.g., Mumbai, New York"
                />
              </div>
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Banner Image URL</label>
                <input
                  type="url"
                  value={formData.bannerUrl}
                  onChange={e => setFormData({ ...formData, bannerUrl: e.target.value })}
                  className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:border-[#1A1A1A] transition-colors"
                  placeholder="https://example.com/banner.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  <ExternalLink className="w-4 h-4 inline mr-2" />
                  External URL
                </label>
                <input
                  type="url"
                  value={formData.externalUrl}
                  onChange={e => setFormData({ ...formData, externalUrl: e.target.value })}
                  className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:border-[#1A1A1A] transition-colors"
                  placeholder="https://event-website.com"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={currentTag}
                  onChange={e => setCurrentTag(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:border-[#1A1A1A] transition-colors"
                  placeholder="Add tag and press Enter"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-6 py-3 bg-[#1A1A1A] text-white rounded-xl hover:bg-[#333] transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-[#E6FF80] rounded-full text-sm"
                    >
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)}>
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Hosts */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                Event Hosts <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3 mb-4">
                <input
                  type="text"
                  value={currentHost.name}
                  onChange={e => setCurrentHost({ ...currentHost, name: e.target.value })}
                  className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:border-[#1A1A1A] transition-colors"
                  placeholder="Host name"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={currentHost.role}
                    onChange={e => setCurrentHost({ ...currentHost, role: e.target.value })}
                    className="px-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:border-[#1A1A1A] transition-colors"
                    placeholder="Role (optional)"
                  />
                  <input
                    type="url"
                    value={currentHost.avatar}
                    onChange={e => setCurrentHost({ ...currentHost, avatar: e.target.value })}
                    className="px-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:border-[#1A1A1A] transition-colors"
                    placeholder="Avatar URL (optional)"
                  />
                </div>
                <button
                  type="button"
                  onClick={addHost}
                  className="w-full px-6 py-3 border border-[#E5E5E5] rounded-xl hover:border-[#1A1A1A] transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Host
                </button>
              </div>
              {formData.hosts.length > 0 && (
                <div className="space-y-2">
                  {formData.hosts.map((host, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                    >
                      <div>
                        <p className="font-medium">{host.name}</p>
                        {host.role && <p className="text-sm text-[#4D4D4D]">{host.role}</p>}
                      </div>
                      <button type="button" onClick={() => removeHost(index)}>
                        <X className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-4 border border-[#E5E5E5] rounded-xl hover:border-[#1A1A1A] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || formData.hosts.length === 0}
                className="flex-1 px-6 py-4 bg-[#1A1A1A] text-white rounded-xl hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
