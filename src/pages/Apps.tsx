
import React from 'react';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { AppsOverview } from '@/components/apps/AppsOverview';

export default function Apps() {
  return (
    <SidebarLayout>
      <AppsOverview />
    </SidebarLayout>
  );
}
