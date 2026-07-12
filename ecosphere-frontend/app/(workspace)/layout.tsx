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
      router.replace('/dashboard');
    }
  }, [isInitialized, isLoggedIn, role, pathname, router]);

  if (!isInitialized || !isLoggedIn || !canAccessPath(role, pathname)) {
    return null; // Return nothing while redirecting or initializing
  }

  return <AppShell>{children}</AppShell>;
}
