'use client';

import React, { useState, useEffect } from 'react';
import { InteractiveMap } from '@/components/InteractiveMap';
import { getComplaints } from '@/lib/storage';
import { Complaint } from '@/types';

export default function AdminMapPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    setComplaints(getComplaints());
    const handleStorage = () => setComplaints(getComplaints());
    window.addEventListener('urjasetu_storage_update', handleStorage);
    return () => window.removeEventListener('urjasetu_storage_update', handleStorage);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          GIS Map View & Spatial Grid
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Interactive map simulation of reported electrical issues across municipal wards.
        </p>
      </div>

      <InteractiveMap complaints={complaints} />
    </div>
  );
}
