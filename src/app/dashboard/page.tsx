import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { SignOutButton } from '@/components/SignOutButton';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  // Récupérer les infos complètes de l'utilisateur
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email! },
    select: {
      id: true,
      name: true,
      age: true,
      email: true,
      image: true,
      createdAt: true,
    },
  });

  const memberSince = user?.createdAt.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-black">
      {/* Navigation Bar - Apple Style */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-black/50 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Poklin
              </h1>
              <div className="hidden md:flex space-x-6">
                <a href="#" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Dashboard
                </a>
                <a href="#" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Profile
                </a>
                <a href="#" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Settings
                </a>
              </div>
            </div>
            <SignOutButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20 opacity-50" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center space-y-6">
            {/* Avatar with Gradient Border */}
            <div className="relative inline-block">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-2xl opacity-30 animate-pulse" />
              <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-2xl">
                <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                  <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Welcome Text */}
            <div className="space-y-3">
              <h2 className="text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                  Welcome back,
                </span>
              </h2>
              <p className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {user?.name}
              </p>
            </div>

            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Your personal space to manage everything in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 rounded-3xl p-8 border border-gray-200/50 dark:border-gray-800/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Profile</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Age</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{user?.age} years</span>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Email Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 rounded-3xl p-8 border border-gray-200/50 dark:border-gray-800/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Contact</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">Email</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600 dark:text-gray-400 mb-2">Primary Email</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white break-all">{user?.email}</span>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Verified</span>
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Membership Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-orange-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 rounded-3xl p-8 border border-gray-200/50 dark:border-gray-800/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Member Since</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">{memberSince}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Account Type</span>
                  <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-600">Premium</span>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Days Active</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {Math.floor((Date.now() - new Date(user?.createdAt!).getTime()) / (1000 * 60 * 60 * 24))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '⚙️', label: 'Settings', color: 'from-blue-500 to-cyan-500' },
            { icon: '📊', label: 'Analytics', color: 'from-purple-500 to-pink-500' },
            { icon: '🔔', label: 'Notifications', color: 'from-orange-500 to-red-500' },
            { icon: '💼', label: 'Projects', color: 'from-green-500 to-emerald-500' },
          ].map((action, index) => (
            <button
              key={index}
              className="group relative backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/50 hover:border-gray-300/50 dark:hover:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-2xl mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {action.icon}
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{action.label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}