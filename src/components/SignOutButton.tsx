'use client';

import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

export function SignOutButton() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const userName = session?.user?.name || 'User';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 p-1 pr-3 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
          {userInitial}
        </div>
        <svg
          className={`w-4 h-4 text-gray-600 dark:text-gray-300 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-1 z-20">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {userName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {session?.user?.email}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/auth/login' })}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

