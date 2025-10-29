'use client';

import { signOut } from 'next-auth/react';

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/auth/login' })}
      className="group relative px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
    >
      <span className="relative z-10">Sign Out</span>
      <div className="absolute inset-0 rounded-lg bg-gray-100 dark:bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

