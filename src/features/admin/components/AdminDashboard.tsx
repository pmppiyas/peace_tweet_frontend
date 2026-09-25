'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BookOpen, Layers, Library, Shield } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export function AdminDashboard() {
  const adminModules = [
    {
      title: 'Manage Duas',
      description: 'Create new Duas, edit content, assign audio, and manage publication status.',
      href: ROUTES.ADMIN_DUAS,
      icon: BookOpen,
      color: 'bg-emerald-600',
    },
    {
      title: 'Dua Categories',
      description: 'Organize, create, and sort thematic categories and slugs.',
      href: ROUTES.ADMIN_CATEGORIES,
      icon: Layers,
      color: 'bg-blue-600',
    },
    {
      title: 'Hadith & Quran Sources',
      description: 'Manage verified Islamic book sources and citations.',
      href: ROUTES.ADMIN_SOURCES,
      icon: Library,
      color: 'bg-amber-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-emerald-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Content management and database administration center for PeaceTweet
          </p>
        </div>
        <Badge variant="gold">ADMIN ONLY</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {adminModules.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.title} href={item.href} className="group">
              <Card className="h-full border border-gray-100 p-6 hover:border-emerald-500 hover:shadow-sm transition-all rounded-2xl dark:border-gray-800">
                <div className="flex items-center gap-3.5">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-white ${item.color} shadow-xs`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-emerald-700 transition-colors dark:text-white">
                      {item.title}
                    </h3>
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
