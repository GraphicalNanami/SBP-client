'use client';

import { useState } from 'react';
import { Check, ExternalLink } from 'lucide-react';
import SettingsLayout from '@/src/userProfile/components/userProfileUI/SettingsLayout';

const SocialAccountsSettings = () => {
  const [connections, setConnections] = useState({
    github: true,
    twitter: false,
  });

  const handleConnect = (platform: 'github' | 'twitter') => {
    console.log(`Connecting to ${platform}...`);
    // TODO: Implement OAuth flow
  };

  const handleDisconnect = (platform: 'github' | 'twitter') => {
    console.log(`Disconnecting from ${platform}...`);
    setConnections({
      ...connections,
      [platform]: false,
    });
  };

  return (
    <SettingsLayout>
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2" style={{ fontFamily: 'var(--font-onest)' }}>
          Social Accounts
        </h1>
        <p className="text-muted-foreground mb-8">
          Connect your social accounts to showcase your online presence
        </p>

        <div className="space-y-6">
          {/* GitHub */}
          <div className="flex items-center justify-between p-6 bg-[#F5F3EE] border border-border rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#24292e] rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  GitHub
                  {connections.github && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      <Check className="w-3 h-3" />
                      Connected
                    </span>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Connect your GitHub account to showcase your repositories
                </p>
              </div>
            </div>
            {connections.github ? (
              <button
                onClick={() => handleDisconnect('github')}
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-red-600 transition-colors"
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={() => handleConnect('github')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-xl hover:bg-foreground/90 transition-all duration-200 font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Connect
              </button>
            )}
          </div>

          {/* Twitter */}
          <div className="flex items-center justify-between p-6 bg-[#F5F3EE] border border-border rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#1DA1F2] rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  Twitter
                  {connections.twitter && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      <Check className="w-3 h-3" />
                      Connected
                    </span>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Connect your Twitter account to share your social presence
                </p>
              </div>
            </div>
            {connections.twitter ? (
              <button
                onClick={() => handleDisconnect('twitter')}
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-red-600 transition-colors"
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={() => handleConnect('twitter')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-xl hover:bg-foreground/90 transition-all duration-200 font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Connect
              </button>
            )}
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
};

export default SocialAccountsSettings;
