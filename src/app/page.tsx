import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Navbar } from '@/components/Navbar';
import { LandingPage } from '@/components/LandingPage';

export default async function Home() {
  const session = await getServerSession(authOptions);

  // If user is not logged in, redirect to login
  if (!session) {
    redirect('/auth/login');
  }

  // Get user info from database
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email! },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <>
      <Navbar />
      <LandingPage user={user} />
    </>
  );
}
