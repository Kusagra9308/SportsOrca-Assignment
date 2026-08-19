import React, { useState } from 'react';
import { X, Key, Shield, Info, Check } from 'lucide-react';
import { ApiCredentials } from '../services/redditApi';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  credentials: ApiCredentials;
  onSaveCredentials: (creds: ApiCredentials) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  credentials,
  onSaveCredentials
}) => {
  const [clientId, setClientId] = useState(credentials.clientId || '');
  const [clientSecret, setClientSecret] = useState(credentials.clientSecret || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCredentials({
      clientId: clientId.trim(),
      clientSecret: clientSecret.trim()
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-reddit-card border border-reddit-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6 relative">
        <div className="flex items-center justify-between border-b border-reddit-border pb-4">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <Key className="w-5 h-5 text-reddit-orange" />
            Reddit API Credentials
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-reddit-hover transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="bg-reddit-dark p-3.5 rounded-xl border border-reddit-border text-xs text-gray-300 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-reddit-orange">
              <Info className="w-4 h-4" /> About Reddit API Access
            </div>
            <p>
              Reddit enforces CORS &amp; HTTP 403 blocks on unauthenticated browser requests. Enter your Reddit Developer App credentials below for direct authenticated OAuth access.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Reddit Client ID</label>
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="e.g. aB1cD2e3F4g5Hi"
              className="w-full px-3.5 py-2.5 bg-reddit-dark border border-reddit-border rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-reddit-orange"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Reddit Client Secret</label>
            <input
              type="password"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              placeholder="e.g. xYz987654321..."
              className="w-full px-3.5 py-2.5 bg-reddit-dark border border-reddit-border rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-reddit-orange"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-reddit-orange hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-lg shadow-reddit-orange/20 flex items-center gap-1.5 transition-all"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" /> Saved!
                </>
              ) : (
                'Save Credentials'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
