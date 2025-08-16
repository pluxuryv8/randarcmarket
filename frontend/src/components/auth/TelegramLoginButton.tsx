import React, { useEffect } from 'react';

export interface TelegramAuthData {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface TelegramLoginButtonProps {
  botName: string; // @username бота без @, например: RandarNFTAuthBot
  onAuth: (data: TelegramAuthData) => void;
  size?: 'large' | 'medium' | 'small';
  cornerRadius?: number;
  requestAccess?: 'write' | 'read';
}

declare global {
  interface Window {
    handleTelegramAuth?: (data: TelegramAuthData) => void;
  }
}

const TelegramLoginButton: React.FC<TelegramLoginButtonProps> = ({
  botName,
  onAuth,
  size = 'large',
  cornerRadius = 16,
  requestAccess = 'write'
}) => {
  useEffect(() => {
    window.handleTelegramAuth = (data: TelegramAuthData) => {
      onAuth(data);
    };

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', botName);
    script.setAttribute('data-size', size);
    script.setAttribute('data-onauth', 'handleTelegramAuth');
    script.setAttribute('data-request-access', requestAccess);
    script.setAttribute('data-userpic', 'false');
    script.setAttribute('data-radius', String(cornerRadius));
    const container = document.getElementById('tg-login-container');
    if (container) {
      container.innerHTML = '';
      container.appendChild(script);
    }

    return () => {
      if (container) container.innerHTML = '';
    };
  }, [botName, onAuth, size, cornerRadius, requestAccess]);

  return <div id="tg-login-container" style={{ display: 'inline-flex' }} />;
};

export default TelegramLoginButton;


