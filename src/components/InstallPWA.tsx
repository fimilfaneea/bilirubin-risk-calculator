'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface CustomWindow extends Window {
  MSStream?: unknown;
}

export default function InstallPWA() {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as CustomWindow).MSStream;
    setIsIOS(isIOSDevice);

    if (isIOSDevice) {
      setShowInstallPrompt(true);
      return;
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      const e = event as BeforeInstallPromptEvent;
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      alert(
        'To install this app:\n1. Tap the share button\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add"'
      );
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallPrompt(false);
      }
    }
  };

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white p-4 flex justify-between items-center z-50">
      <div>
        <p className="font-semibold">Install Bilirubin Calculator</p>
        <p className="text-sm">Install this app on your device for quick access</p>
      </div>
      <button
        onClick={handleInstallClick}
        className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-blue-50 transition-colors"
      >
        Install
      </button>
    </div>
  );
}
