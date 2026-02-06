'use client';

import { useParams, useRouter } from 'next/navigation';
import { MOCK_EVENTS } from '../components/eventsService/mockData';
import Image from 'next/image';
import { Calendar, MapPin, X as XIcon, Flag, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar } from '@/src/shared/components/Avatar';

const getTagColor = (tag: string) => {
  switch (tag) {
    case 'hackathon':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'bootcamp':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'meetups':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'builder house':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'stellar ecosystem':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'university':
      return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;
  
  const event = MOCK_EVENTS.find((e) => e.id === eventId);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Event Not Found</h1>
          <button
            onClick={() => router.push('/src/events')}
            className="text-[#1A1A1A] hover:underline"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const isSoldOut = event.status === 'Sold Out';
  const isRegistrationOpen = !isSoldOut && new Date() < startDate;

  return (
    <div className="min-h-screen bg-[#FCFCFC]">
      {/* Header with back button */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push('/src/events')}
            className="flex items-center gap-2 text-[#4D4D4D] hover:bg-black/40 transition-colors text-white bg-black px-3 py-1 rounded-xl cursor-pointer "
          >
           Back
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column - Image, Hosted By, Attendees, Tags */}
          <div className="lg:col-span-5 space-y-6">
            {/* Event Banner */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-[#E6FF80]/20 to-blue-500/20">
              {event.coverImage ? (
                <Image
                  src={event.coverImage}
                  alt={event.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-[#1A1A1A]/20">{event.title}</span>
                </div>
              )}
            </div>

            {/* Hosted By Section */}
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
              <h3 className="text-sm font-semibold text-[#4D4D4D] mb-4">Hosted By</h3>
              
              {/* Main Organizer */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  <Avatar
                    src={event.organizer.avatar}
                    alt={event.organizer.name}
                    seed={event.organizer.name}
                    className="object-cover"
                    size={48}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#1A1A1A]">{event.organizer.name}</p>
                  {event.organizer.twitter && (
                    <a
                      href={`https://twitter.com/${event.organizer.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#4D4D4D] hover:text-[#1A1A1A] flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      @{event.organizer.twitter}
                    </a>
                  )}
                </div>
              </div>

              {/* Additional Hosts */}
              {event.hostedBy && event.hostedBy.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-[#E5E5E5]">
                  {event.hostedBy.map((host, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                        <Avatar
                          src={host.avatar}
                          alt={host.name}
                          seed={host.name}
                          className="object-cover"
                          size={32}
                        />
                      </div>
                      <span className="text-xs text-[#4D4D4D]">{host.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Attendees Section */}
            {event.attendees && event.attendees.length > 0 && (
              <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                <h3 className="text-sm font-semibold text-[#1A1A1A] mb-4">
                  {event.attendees.length} Going
                </h3>
                
                {/* Attendee Avatars */}
                <div className="flex -space-x-2 mb-4">
                  {event.attendees.slice(0, 10).map((attendee, index) => (
                    <div
                      key={index}
                      className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white bg-gray-200"
                      title={attendee.name}
                    >
                      <Avatar
                        src={attendee.avatar}
                        alt={attendee.name}
                        seed={attendee.name}
                        className="object-cover"
                        size={40}
                      />
                    </div>
                  ))}
                  {event.attendees.length > 10 && (
                    <div className="relative w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                      <span className="text-xs font-semibold text-[#4D4D4D]">
                        +{event.attendees.length - 10}
                      </span>
                    </div>
                  )}
                </div>

                {/* Attendee Names */}
                <div className="text-xs text-[#4D4D4D] space-y-1">
                  {event.attendees.slice(0, 5).map((attendee, index) => (
                    <p key={index}>{attendee.name}</p>
                  ))}
                  {event.attendees.length > 5 && (
                    <p className="font-medium">and {event.attendees.length - 5} others</p>
                  )}
                </div>
              </div>
            )}

            {/* Tags and Actions */}
            <div className="space-y-4">
              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getTagColor(tag)}`}
                    >
                      #{tag.replace(' ', '')}
                    </span>
                  ))}
                </div>
              )}

              {/* Contact and Report Links */}
              <div className="flex items-center gap-4 text-xs text-[#4D4D4D]">
                <button className="hover:text-[#1A1A1A] transition-colors">
                  Contact the Host
                </button>
                <button className="hover:text-[#1A1A1A] transition-colors flex items-center gap-1">
                  <Flag className="w-3 h-3" />
                  Report Event
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Event Details */}
          <div className="lg:col-span-7 space-y-8">
            {/* Event Title and Status */}
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#1A1A1A] mb-4 -tracking-tight leading-tight">
                {event.title}
              </h1>

              {/* Registration Status Badge */}
              {isSoldOut ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-sm font-semibold text-red-700">Sold Out</span>
                </div>
              ) : isRegistrationOpen ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm font-semibold text-green-700">Open Registration</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-sm font-semibold text-blue-700">Registration Closed</span>
                </div>
              )}
            </div>

            {/* Date and Time */}
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Calendar className="w-6 h-6 text-[#4D4D4D]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A] mb-1">
                    {format(startDate, 'EEEE, d MMMM yyyy')}
                  </p>
                  <p className="text-sm text-[#4D4D4D]">
                    {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')} {event.timezone || 'GMT+3'}
                  </p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#4D4D4D]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A] mb-1">
                    {event.venue || 'Register to See Address'}
                  </p>
                  <p className="text-sm text-[#4D4D4D]">{event.location}</p>
                </div>
              </div>
            </div>

            {/* Register Button */}
            <button
              disabled={isSoldOut}
              className={`w-full py-4 px-6 rounded-xl text-base font-semibold transition-all ${
                isSoldOut
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#8B4513] text-white hover:bg-[#6F3410] shadow-sm hover:shadow-md'
              }`}
            >
              {isSoldOut ? 'Sold Out' : 'Register'}
            </button>

            {/* About Event */}
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-8">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">About Event</h2>
              <div className="prose prose-sm max-w-none text-[#4D4D4D] leading-relaxed">
                {event.longDescription ? (
                  <div dangerouslySetInnerHTML={{ __html: event.longDescription.replace(/\n/g, '<br />') }} />
                ) : (
                  <p>{event.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
