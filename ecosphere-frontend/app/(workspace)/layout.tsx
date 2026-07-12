"use client";

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { canAccessPath } from '../../lib/permissions';
import { AppShell } from '../../components/layout/AppShell'
export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, isLoggedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/login');
    } else if (!canAccessPath(role, pathname)) {
      router.replace('/dashboard');
    }
  }, [isLoggedIn, role, pathname, router]);

  if (!isLoggedIn || !canAccessPath(role, pathname)) {
    return null; // Return nothing while redirecting
  }

  return <AppShell>{children}</AppShell>;
}