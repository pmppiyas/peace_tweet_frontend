'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PlusCircle, Heart } from 'lucide-react';
import {
  BloodLayout,
  BloodActiveTab,
  BloodFilters,
  BloodRequestList,
  BloodDonorList,
  BloodRequestDetailModal,
  BloodGroup,
  BloodRequestItem,
  useBloodRequests,
  useDonors,
} from '@/features/blood';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';

function BloodContent() {
  const { locale } = useLanguage();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as BloodActiveTab | null;
  const { user, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState<BloodActiveTab>('all');
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | undefined>(
    undefined
  );
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [selectedRequest, setSelectedRequest] =
    useState<BloodRequestItem | null>(null);

  useEffect(() => {
    if (
      tabParam === 'donors' ||
      tabParam === 'my-requests' ||
      tabParam === 'my-donations'
    ) {
      setActiveTab(tabParam);
    } else {
      setActiveTab('all');
    }
  }, [tabParam]);

  const requestParams = {
    bloodGroup: selectedGroup,
    search: search.trim() || undefined,
    location: location.trim() || undefined,
    requesterId: activeTab === 'my-requests' ? user?.id : undefined,
    donorId: activeTab === 'my-donations' ? user?.id : undefined,
  };

  const { data: requestsData, isLoading: isLoadingRequests } = useBloodRequests(
    activeTab !== 'donors' ? requestParams : undefined
  );

  const { data: donorsData, isLoading: isLoadingDonors } = useDonors(
    activeTab === 'donors'
      ? {
          bloodGroup: selectedGroup,
          search: search.trim() || undefined,
          location: location.trim() || undefined,
        }
      : undefined
  );

  const requests = requestsData?.items || [];
  const donors = donorsData?.items || [];

  const handleResetFilters = () => {
    setSelectedGroup(undefined);
    setSearch('');
    setLocation('');
  };

  return (
    <BloodLayout activeTab={activeTab} onSelectTab={setActiveTab}>
      <div className="space-y-4">
        {/* Filters & Search */}
        <div className="bg-white dark:bg-[#242526] p-3.5 sm:p-4 rounded-2xl border border-[#e4e6eb] dark:border-[#393a3b] shadow-2xs">
          <BloodFilters
            selectedGroup={selectedGroup}
            onSelectGroup={setSelectedGroup}
            search={search}
            onSearchChange={setSearch}
            location={location}
            onLocationChange={setLocation}
            placeholder={
              activeTab === 'donors'
                ? locale === 'bn'
                  ? 'নাম, ইউজারনেম বা এলাকা দিয়ে রক্তদাতা খুঁজুন...'
                  : 'Search donors by name, username or location...'
                : undefined
            }
          />
        </div>

        {/* Content based on Active Tab */}
        {activeTab === 'donors' ? (
          <BloodDonorList
            donors={donors}
            isLoading={isLoadingDonors}
            onResetFilters={handleResetFilters}
          />
        ) : (
          <BloodRequestList
            requests={requests}
            isLoading={isLoadingRequests}
            emptyType={
              search || selectedGroup || location
                ? 'search'
                : activeTab === 'my-requests'
                  ? 'my-requests'
                  : activeTab === 'my-donations'
                    ? 'my-donations'
                    : 'requests'
            }
            onResetFilters={handleResetFilters}
            onSelectDetail={(req) => setSelectedRequest(req)}
          />
        )}

        {/* Detail Modal */}
        {selectedRequest && (
          <BloodRequestDetailModal
            request={selectedRequest}
            isOpen={Boolean(selectedRequest)}
            onClose={() => setSelectedRequest(null)}
          />
        )}
      </div>
    </BloodLayout>
  );
}

export default function BloodPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-rose-500/30 border-t-rose-500" />
        </div>
      }
    >
      <BloodContent />
    </Suspense>
  );
}
