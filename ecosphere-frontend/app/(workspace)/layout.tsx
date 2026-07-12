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
      return;
    } 
    
    if (!canAccessPath(role, pathname)) {
      router.replace(role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
      return;
    }

    let baseRoute = pathname;
    if (baseRoute.startsWith('/admin')) {
      baseRoute = baseRoute.replace(/^\/admin/, '');
    } else if (baseRoute.startsWith('/user')) {
      baseRoute = baseRoute.replace(/^\/user/, '');
    }
    
    const expectedPrefix = role === 'admin' ? '/admin' : '/user';
    if (!pathname.startsWith(expectedPrefix)) {
      router.replace(`${expectedPrefix}${baseRoute}`);
    }
  }, [isInitialized, isLoggedIn, role, pathname, router]);

  const expectedPrefix = role === 'admin' ? '/admin' : '/user';
  if (!isInitialized || !isLoggedIn || !canAccessPath(role, pathname) || !pathname.startsWith(expectedPrefix)) {
    return null; // Return nothing while redirecting or initializing
  }

  return <AppShell>{children}</AppShell>;
}
