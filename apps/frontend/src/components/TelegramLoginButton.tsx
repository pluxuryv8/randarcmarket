import React, { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name?: string;
            last_name?: string;
            username?: string;
            photo_url?: string;
          };
        };
        ready: () => void;
        expand: () => void;
        close: () => void;
      };
    };
  }
}

const TelegramLoginButton: React.FC = () => {
  const { login } = useAuth();
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    // Load Telegram Login Widget script
    if (!document.getElementById('telegram-login-script')) {
      const script = document.createElement('script');
      script.id = 'telegram-login-script';
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.setAttribute('data-telegram-login', 'RandarMarketBot');
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-auth-url', window.location.origin);
      script.setAttribute('data-request-access', 'write');
      script.setAttribute('data-lang', 'ru');
      script.async = true;
      
      script.onload = () => {
        console.log('Telegram Login Widget loaded');
      };
      
      document.head.appendChild(script);
      scriptRef.current = script;
    }

    // Check if we're in Telegram WebApp
    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.ready();
      webApp.expand();
      
      // If we have initData, try to authenticate
      if (webApp.initData) {
        handleTelegramAuth(webApp.initData);
      }
    }

    return () => {
      // Cleanup script on unmount
      if (scriptRef.current) {
        document.head.removeChild(scriptRef.current);
      }
    };
  }, []);

  const handleTelegramAuth = async (initData: string) => {
    try {
      // Parse initData string to object
      const params = new URLSearchParams(initData);
      const initDataObj: Record<string, string> = {};
      params.forEach((value, key) => {
        initDataObj[key] = value;
      });

      const response = await fetch('/api/auth/telegram/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(initDataObj),
      });

      const data = await response.json();
      
      if (data.success && data.token) {
        await login(data.token);
      } else {
        console.error('Telegram auth failed:', data.error);
      }
    } catch (error) {
      console.error('Error during Telegram authentication:', error);
    }
  };

  const handleTelegramLogin = (user: any) => {
    // This will be called by the Telegram Login Widget
    console.log('Telegram user:', user);
    
    // Send user data to backend for verification
    handleTelegramAuth(JSON.stringify(user));
  };

  return (
    <div className="telegram-login-container">
      {/* Telegram Login Widget will be inserted here */}
      <div id="telegram-login-widget"></div>
      
      {/* Fallback button for non-Telegram environments */}
      {!window.Telegram?.WebApp && (
        <button
          onClick={() => {
            // Show message that Telegram is required
            alert('Для входа требуется Telegram WebApp');
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Войти через Telegram
        </button>
      )}
    </div>
  );
};

export default TelegramLoginButton;
