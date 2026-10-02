'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import {
  BloodLayout,
  BloodRequestDetailModal,
  BloodRequestCard,
  useBloodRequest,
} from '@/features/blood';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/providers/LanguageProvider';

export default function BloodRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { locale } = useLanguage();
  const id = typeof params?.id === 'string' ? params.id : '';

  const { data: request, isLoading } = useBloodRequest(id);

  return (
    <BloodLayout>
      <div className="space-y-4 max-w-2xl mx-auto">
        <Breadcrumbs
          items={[
            {
              label: locale === 'bn' ? 'রক্তদান' : 'Blood Donation',
              href: ROUTES.BLOOD.HOME,
            },
            {
              label: request?.patientName || (locale === 'bn' ? 'আবেদন বিবরণ' : 'Request Details'),
            },
          ]}
        />

        {isLoading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-rose-500/30 border-t-rose-500" />
          </div>
        ) : request ? (
          <>
            <BloodRequestCard
              request={request}
              onSelectDetail={() => {}}
            />
            <BloodRequestDetailModal
              request={request}
              isOpen={true}
              onClose={() => router.push(ROUTES.BLOOD.HOME)}
            />
          </>
        ) : (
          <div className="text-center p-8 text-sm text-gray-500">
            {locale === 'bn'
              ? 'অনুরোধটি পাওয়া যায়নি।'
              : 'Blood request not found.'}
          </div>
        )}
      </div>
    </BloodLayout>
  );
}
