// Configurações específicas para mobile
import { Capacitor } from '@capacitor/core';

export const isMobile = () => {
  return Capacitor.isNativePlatform();
};

export const getPlatform = () => {
  return Capacitor.getPlatform();
};

// Configurações de viewport para mobile
export const setMobileViewport = () => {
  if (isMobile()) {
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
      );
    }
  }
};

// Configurações de status bar
export const configureStatusBar = async () => {
  if (isMobile()) {
    try {
      const { StatusBar } = await import('@capacitor/status-bar');
      await StatusBar.setStyle({ style: 'DARK' });
      await StatusBar.setBackgroundColor({ color: '#ffffff' });
    } catch (error) {
      console.log('StatusBar plugin not available');
    }
  }
};
