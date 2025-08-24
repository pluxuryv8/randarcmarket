import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import { useAuth } from '../context/AuthContext';
import { FaTelegram, FaRocket, FaGift, FaSearch } from 'react-icons/fa';
import TelegramLoginButton from './TelegramLoginButton';

const Header: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const wallet = useTonWallet();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent-red rounded-lg flex items-center justify-center">
              <FaRocket className="text-white text-sm" />
            </div>
            <span className="text-xl font-bold text-text-100">Randar Market</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/market"
              className={`text-sm font-medium transition-colors ${
                isActive('/market') ? 'text-accent-red-2' : 'text-text-300 hover:text-text-100'
              }`}
            >
              Market
            </Link>
            {/* <Link
              to="/drops"
              className={`text-sm font-medium transition-colors ${
                isActive('/drops') ? 'text-accent-red-2' : 'text-text-300 hover:text-text-100'
              }`}
            >
              <FaGift className="inline mr-1" />
              Drops
            </Link> */}
            <Link
              to="/radar"
              className={`text-sm font-medium transition-colors ${
                isActive('/radar') ? 'text-accent-red-2' : 'text-text-300 hover:text-text-100'
              }`}
            >
              <FaSearch className="inline mr-1" />
              Radar
            </Link>
            <Link
              to="/pricing"
              className={`text-sm font-medium transition-colors ${
                isActive('/pricing') ? 'text-accent-red-2' : 'text-text-300 hover:text-text-100'
              }`}
            >
              Pricing
            </Link>
          </nav>

          {/* Auth & Wallet */}
          <div className="flex items-center space-x-4">
            {/* Telegram Login */}
            {!user && <TelegramLoginButton />}

            {/* User Info */}
            {user && (
              <div className="flex items-center space-x-3">
                {user.photo_url && (
                  <img
                    src={user.photo_url}
                    alt={user.first_name || user.username || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-text-100">
                    {user.first_name || user.username || 'User'}
                  </div>
                  {wallet && (
                    <div className="text-xs text-text-300">
                      {wallet.account.address.slice(0, 6)}...{wallet.account.address.slice(-4)}
                    </div>
                  )}
                </div>
                <button
                  onClick={logout}
                  className="text-text-300 hover:text-text-100 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}

            {/* TonConnect Button */}
            <TonConnectButton className="tc-btn" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
