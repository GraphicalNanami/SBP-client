'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft,
  Calendar,
  Eye,
  Users,
  Globe,
  Github,
  Twitter,
  ExternalLink,
  Play,
  Sparkles,
} from 'lucide-react';
import { getPublicBuild } from '../components/buildService/buildsApi';
import type { BuildCardData } from '../components/buildUI/BuildCard';
import { getProxiedImageUrl } from '@/src/shared/utils/image-proxy';
import Footer from '@/src/landingPage/components/Footer';

export default function BuildDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [build, setBuild] = useState<BuildCardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBuild() {
      try {
        setIsLoading(true);
        const data = await getPublicBuild(slug);
        setBuild(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load build');
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      fetchBuild();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-foreground border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading build...</p>
        </div>
      </div>
    );
  }

  if (error || !build) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Build Not Found</h1>
          <p className="text-muted-foreground mb-8">{error || 'The build you\'re looking for doesn\'t exist'}</p>
          <button
            onClick={() => router.push('/builds')}
            className="px-6 py-3 bg-foreground text-background rounded-xl hover:bg-foreground/90 transition-colors"
          >
            Back to Builds
          </button>
        </div>
      </div>
    );
  }

  const logoGradients = [
    'from-violet-600 to-indigo-700',
    'from-sky-600 to-cyan-700',
    'from-emerald-600 to-teal-700',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
    'from-fuchsia-600 to-purple-700',
  ];
  const gradient = logoGradients[build.name.charCodeAt(0) % logoGradients.length];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-accent/10 via-background to-accent/5 pt-24 pb-16 px-6">
        {/* Decorative Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-20 right-20 w-64 h-64 bg-gradient-to-br ${gradient} opacity-20 rounded-full blur-3xl`} />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Back Button */}
          <button
            onClick={() => router.push('/builds')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Builds</span>
          </button>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Build Info */}
            <div>
              <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">{build.category}</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
                {build.name}
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {build.tagline}
              </p>

              {/* Stats Row */}
              <div className="flex gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-accent-foreground" />
                  <span className="text-foreground font-semibold">
                    {new Date(build.publishedAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
                {build.viewCount > 0 && (
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-accent-foreground" />
                    <span className="text-foreground font-semibold">{build.viewCount} views</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-accent-foreground" />
                  <span className="text-foreground font-semibold">
                    {build.teamSize} {build.teamSize === 1 ? 'member' : 'members'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {build.website && (
                  <a
                    href={build.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-xl font-semibold hover:bg-foreground/90 transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                    Visit Website
                  </a>
                )}
                {build.liveDemo && (
                  <a
                    href={build.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground border border-accent/30 rounded-xl font-semibold hover:bg-accent/80 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    Live Demo
                  </a>
                )}
              </div>
            </div>

            {/* Right: Logo/Image Card */}
            <div className="relative aspect-square rounded-3xl overflow-hidden border border-border shadow-lg hover:shadow-xl transition-shadow">
              {build.logo ? (
                <Image
                  src={getProxiedImageUrl(build.logo)}
                  alt={`${build.name} logo`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                  <span className="text-white text-6xl font-bold">{build.name.charAt(0)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      {build.techStack && build.techStack.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Tech Stack</h2>
          <div className="flex flex-wrap gap-3">
            {build.techStack.map((tech, idx) => (
              <span
                key={idx}
                className="px-4 py-2 rounded-xl border border-border bg-card text-foreground font-medium hover:border-accent transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* About Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-foreground mb-8">About This Build</h2>
        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground leading-relaxed">
            {build.tagline}
          </p>
        </div>
      </div>

      {/* Links Section */}
      <div className="bg-accent/5 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8">Links & Resources</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {build.website && (
              <a
                href={build.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-6 bg-card border border-border rounded-2xl hover:border-accent transition-all hover:shadow-lg group"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Globe className="w-6 h-6 text-accent-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">Website</h3>
                  <p className="text-sm text-muted-foreground truncate">{build.website}</p>
                </div>
                <ExternalLink className="w-5 h-5 text-muted-foreground" />
              </a>
            )}

            {build.liveDemo && (
              <a
                href={build.liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-6 bg-card border border-border rounded-2xl hover:border-accent transition-all hover:shadow-lg group"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-accent-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">Live Demo</h3>
                  <p className="text-sm text-muted-foreground truncate">{build.liveDemo}</p>
                </div>
                <ExternalLink className="w-5 h-5 text-muted-foreground" />
              </a>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
