'use client';

import React from 'react';
import { BasicInfoSettingsCard } from './BasicInfoSettingsCard';
import { PhotosSettingsCard } from './PhotosSettingsCard';
import { LocationSettingsCard } from './LocationSettingsCard';
import { BloodSettingsCard } from './BloodSettingsCard';
import { SecuritySettingsCard } from './SecuritySettingsCard';

export interface ProfileSettingsCardProps {
  section?: 'all' | 'profile' | 'photos' | 'location' | 'blood' | 'security';
}

export function ProfileSettingsCard({
  section = 'all',
}: ProfileSettingsCardProps) {
  if (section === 'profile') {
    return <BasicInfoSettingsCard />;
  }

  if (section === 'photos') {
    return <PhotosSettingsCard />;
  }

  if (section === 'location') {
    return <LocationSettingsCard />;
  }

  if (section === 'blood') {
    return <BloodSettingsCard />;
  }

  if (section === 'security') {
    return <SecuritySettingsCard />;
  }

  return (
    <div className="space-y-6">
      <BasicInfoSettingsCard />
      <PhotosSettingsCard />
      <LocationSettingsCard />
      <BloodSettingsCard />
      <SecuritySettingsCard />
    </div>
  );
}

export {
  BasicInfoSettingsCard,
  PhotosSettingsCard,
  LocationSettingsCard,
  BloodSettingsCard,
  SecuritySettingsCard,
};
