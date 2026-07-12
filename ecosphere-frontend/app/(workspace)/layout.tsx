"use client";

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { canAccessPath } from '@/lib/permissions';
import { AppShell } from '@/app/components/layouts/AppShell';

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, isLoggedIn, isInitialized } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isInitialized) return;
    
    if (!isLoggedIn) {
      router.replace('/login');
    } else if (!canAccessPath(role, pathname)) {
      router.replace(role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } else if (role === 'admin' && !pathname.startsWith('/admin')) {
      router.replace(`/admin${pathname}`);
    } else if (role !== 'admin' && pathname.startsWith('/admin')) {
      router.replace(pathname.replace(/^\/admin/, ''));
    }
  }, [isInitialized, isLoggedIn, role, pathname, router]);

  if (!isInitialized || !isLoggedIn || !canAccessPath(role, pathname) || (role === 'admin' && !pathname.startsWith('/admin')) || (role !== 'admin' && pathname.startsWith('/admin'))) {
    return null; // Return nothing while redirecting or initializing
  }

  return <AppShell>{children}</AppShell>;
}
