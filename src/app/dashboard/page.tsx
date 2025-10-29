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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to your Dashboard!
            </h1>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="mt-1 text-lg text-gray-900 dark:text-white">
                  {user?.name}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Age</p>
                <p className="mt-1 text-lg text-gray-900 dark:text-white">
                  {user?.age} years old
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="mt-1 text-lg text-gray-900 dark:text-white">
                  {user?.email}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Member since</p>
                <p className="mt-1 text-lg text-gray-900 dark:text-white">
                  {user?.createdAt.toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <SignOutButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}