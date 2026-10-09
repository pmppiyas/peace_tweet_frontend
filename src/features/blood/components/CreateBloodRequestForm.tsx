'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Droplet,
  Heart,
  Building2,
  MapPin,
  Phone,
  Calendar,
  AlertCircle,
  Clock,
  Sparkles,
  User,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/hooks/useAuth';
import { useBloodActions } from '../hooks/useBloodActions';
import { BloodGroup, BloodRequestUrgency } from '../types/blood.types';
import { BLOOD_GROUPS } from '../utils/blood-helpers';
import { ROUTES } from '@/constants/routes';
import { LocationSelector, LocationValue } from '@/components/ui/LocationSelector';

export function CreateBloodRequestForm() {
  const { locale } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const { createRequest, isCreating } = useBloodActions();

  const [forMyself, setForMyself] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState<string>('');
  const [problem, setProblem] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('A_POSITIVE');
  const [units, setUnits] = useState<number>(1);
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalAddress, setHospitalAddress] = useState('');
  const [location, setLocation] = useState('');
  const [locationData, setLocationData] = useState<LocationValue>({
    country: 'Bangladesh',
    countryCode: 'BD',
    state: '',
    city: '',
    location: '',
  });
  const [contactNumber, setContactNumber] = useState('');
  const [alternateContact, setAlternateContact] = useState('');
  const [neededDate, setNeededDate] = useState('');
  const [urgency, setUrgency] = useState<BloodRequestUrgency>('REGULAR');
  const [note, setNote] = useState('');

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (forMyself && user?.name) {
      setPatientName(user.name);
    }
  }, [forMyself, user?.name]);

  // Default blood request location to user's saved location, or Bangladesh
  useEffect(() => {
    if (user) {
      const defaultCountry = user.country || 'Bangladesh';
      const defaultCountryCode = user.countryCode || 'BD';
      const defaultState = user.state || '';
      const defaultCity = user.city || '';
      const defaultLocation = user.location || '';

      setLocationData({
        country: defaultCountry,
        countryCode: defaultCountryCode,
        state: defaultState,
        city: defaultCity,
        location: defaultLocation,
      });

      if (defaultLocation) {
        setLocation(defaultLocation);
      }
    }
  }, [user]);

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setNeededDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const nameToUse = forMyself ? user?.name || patientName : patientName;

    if (!nameToUse.trim()) {
      setError(
        locale === 'bn' ? 'রোগীর নাম প্রদান করুন।' : 'Patient name is required.'
      );
      return;
    }

    if (!hospitalName.trim()) {
      setError(
        locale === 'bn'
          ? 'হাসপাতালের নাম প্রদান করুন।'
          : 'Hospital name is required.'
      );
      return;
    }

    const finalLocation = locationData.location.trim() || location.trim();

    if (!finalLocation) {
      setError(
        locale === 'bn'
          ? 'লোকেশন বা জেলা উল্লেখ করুন।'
          : 'Location is required.'
      );
      return;
    }

    if (!contactNumber.trim()) {
      setError(
        locale === 'bn'
          ? 'যোগাযোগের মোবাইল নম্বর প্রদান করুন।'
          : 'Contact number is required.'
      );
      return;
    }

    if (!neededDate) {
      setError(
        locale === 'bn'
          ? 'রক্তের প্রয়োজন হওয়ার তারিখ দিন।'
          : 'Needed date is required.'
      );
      return;
    }

    try {
      const response = await createRequest({
        forMyself,
        patientName: nameToUse.trim(),
        patientAge: patientAge ? parseInt(patientAge, 10) : undefined,
        problem: problem.trim() || undefined,
        bloodGroup,
        units: units || 1,
        hospitalName: hospitalName.trim(),
        hospitalAddress: hospitalAddress.trim() || undefined,
        country: locationData.country || undefined,
        countryCode: locationData.countryCode || undefined,
        state: locationData.state || undefined,
        city: locationData.city || undefined,
        location: finalLocation,
        contactNumber: contactNumber.trim(),
        alternateContact: alternateContact.trim() || undefined,
        neededDate,
        urgency,
        note: note.trim() || undefined,
      });

      router.push(ROUTES.BLOOD.HOME);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          (locale === 'bn'
            ? 'রক্তের আবেদন পোস্ট করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।'
            : 'Failed to create blood request. Please try again.')
      );
    }
  };

  return (
    <Card className="rounded-2xl border border-[#e4e6eb] bg-white p-5 sm:p-7 shadow-sm dark:border-[#393a3b] dark:bg-[#242526]">
      <div className="border-b border-[#f0f2f5] pb-4 mb-6 dark:border-[#3a3b3c]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 shadow-2xs">
            <Droplet className="h-6 w-6 fill-current" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#050505] dark:text-white">
              {locale === 'bn' ? 'জরুরি রক্তের আবেদন' : 'Post Blood Request'}
            </h2>
            <p className="text-xs text-[#65676b] dark:text-[#b0b3b8]">
              {locale === 'bn'
                ? 'সঠিক তথ্য প্রদান করে রক্তদাতাদের সহায়তা নিন'
                : 'Fill in the details to find blood donors in your area'}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-5 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Toggle: For Myself vs Someone Else */}
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-3.5 dark:border-rose-900/50 dark:bg-rose-950/20">
          <label className="flex items-center justify-between cursor-pointer select-none">
            <div className="flex items-center gap-2.5">
              <User className="h-4 w-4 text-rose-600 dark:text-rose-400" />
              <div>
                <p className="text-xs font-bold text-[#050505] dark:text-white">
                  {locale === 'bn'
                    ? 'রক্ত কি আপনার নিজের জন্য প্রয়োজন?'
                    : 'Is the blood needed for yourself?'}
                </p>
                <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8]">
                  {locale === 'bn'
                    ? 'হ্যাঁ সিলেক্ট করলে আপনার প্রোফাইলের নাম ব্যবহৃত হবে।'
                    : 'If yes, your profile name will automatically be used.'}
                </p>
              </div>
            </div>

            <input
              type="checkbox"
              checked={forMyself}
              onChange={(e) => setForMyself(e.target.checked)}
              className="h-4 w-4 rounded text-rose-600 focus:ring-rose-500 border-gray-300"
            />
          </label>
        </div>

        {/* Patient Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#050505] dark:text-[#e4e6eb] mb-1.5">
              {locale === 'bn' ? 'রোগীর নাম *' : 'Patient Name *'}
            </label>
            <Input
              type="text"
              value={forMyself ? user?.name || patientName : patientName}
              onChange={(e) => setPatientName(e.target.value)}
              disabled={forMyself}
              placeholder={locale === 'bn' ? 'রোগীর পুরো নাম' : 'Full name'}
              required
              className="h-10"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#050505] dark:text-[#e4e6eb] mb-1.5">
              {locale === 'bn' ? 'রোগীর বয়স (বছর)' : 'Patient Age (years)'}
            </label>
            <Input
              type="number"
              min={1}
              max={120}
              value={patientAge}
              onChange={(e) => setPatientAge(e.target.value)}
              placeholder="e.g. 28"
              className="h-10"
            />
          </div>
        </div>

        {/* Problem / Reason */}
        <div>
          <label className="block text-xs font-bold text-[#050505] dark:text-[#e4e6eb] mb-1.5">
            {locale === 'bn'
              ? 'রোগীর সমস্যা / রক্তের কারণ *'
              : 'Problem / Medical Condition *'}
          </label>
          <Input
            type="text"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder={
              locale === 'bn'
                ? 'উদা: ডেলিভারি, থ্যালাসেমিয়া, বাইপাস সার্জারি...'
                : 'e.g. Surgery, Thalassemia, Accident, Delivery...'
            }
            className="h-10"
          />
        </div>

        {/* Blood Group & Required Units */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#050505] dark:text-[#e4e6eb] mb-1.5">
              {locale === 'bn' ? 'রক্তের গ্রুপ *' : 'Blood Group *'}
            </label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
              className="w-full h-10 px-3 rounded-xl border border-[#e4e6eb] bg-white text-xs font-bold text-[#050505] dark:border-[#393a3b] dark:bg-[#242526] dark:text-[#e4e6eb] focus:border-rose-500 focus:outline-hidden"
            >
              {BLOOD_GROUPS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label} ({g.value.replace('_', ' ')})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#050505] dark:text-[#e4e6eb] mb-1.5">
              {locale === 'bn'
                ? 'প্রয়োজনীয় ব্যাগ/ইউনিট *'
                : 'Units / Bags Needed *'}
            </label>
            <Input
              type="number"
              min={1}
              max={20}
              value={units}
              onChange={(e) =>
                setUnits(Math.max(1, parseInt(e.target.value, 10) || 1))
              }
              required
              className="h-10"
            />
          </div>
        </div>

        {/* Urgency & Date Needed */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#050505] dark:text-[#e4e6eb] mb-1.5">
              {locale === 'bn' ? 'জরুরিতা (Urgency) *' : 'Urgency Level *'}
            </label>
            <select
              value={urgency}
              onChange={(e) =>
                setUrgency(e.target.value as BloodRequestUrgency)
              }
              className="w-full h-10 px-3 rounded-xl border border-[#e4e6eb] bg-white text-xs font-bold text-[#050505] dark:border-[#393a3b] dark:bg-[#242526] dark:text-[#e4e6eb] focus:border-rose-500 focus:outline-hidden"
            >
              <option value="REGULAR">
                {locale === 'bn' ? 'সাধারণ (Regular)' : 'Regular'}
              </option>
              <option value="URGENT">
                {locale === 'bn' ? 'জরুরি (Urgent)' : 'Urgent'}
              </option>
              <option value="EMERGENCY">
                {locale === 'bn' ? 'অতীব জরুরি (Emergency)' : 'Emergency'}
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#050505] dark:text-[#e4e6eb] mb-1.5">
              {locale === 'bn' ? 'রক্তের তারিখ *' : 'Needed Date *'}
            </label>
            <Input
              type="date"
              value={neededDate}
              onChange={(e) => setNeededDate(e.target.value)}
              required
              className="h-10"
            />
          </div>
        </div>

        {/* Hospital Name & Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#050505] dark:text-[#e4e6eb] mb-1.5">
              {locale === 'bn' ? 'হাসপাতালের নাম *' : 'Hospital Name *'}
            </label>
            <Input
              type="text"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              placeholder={
                locale === 'bn'
                  ? 'উদা: ঢাকা মেডিকেল কলেজ হাসপাতাল'
                  : 'e.g. Dhaka Medical College Hospital'
              }
              required
              className="h-10"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#050505] dark:text-[#e4e6eb] mb-1.5">
              {locale === 'bn'
                ? 'হাসপাতালের বিস্তারিত ঠিকানা / ওয়ার্ড নং'
                : 'Hospital Address / Ward No'}
            </label>
            <Input
              type="text"
              value={hospitalAddress}
              onChange={(e) => setHospitalAddress(e.target.value)}
              placeholder={
                locale === 'bn'
                  ? 'উদা: ৫ম তলা, ওয়ার্ড নং ৮, বেড নং ১২'
                  : 'e.g. 5th Floor, Ward 8, Bed 12'
              }
              className="h-10"
            />
          </div>
        </div>

        {/* Global Cascading Location Selector */}
        <div className="rounded-2xl p-4 bg-[#f0f2f5]/60 dark:bg-[#3a3b3c]/40 border border-[#e4e6eb] dark:border-[#393a3b]">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-rose-500" />
            <span className="text-xs font-bold text-[#050505] dark:text-[#e4e6eb]">
              {locale === 'bn' ? 'রক্তের প্রয়োজনস্থল (দেশ ও এলাকা নির্বাচন) *' : 'Location of Blood Need *'}
            </span>
          </div>
          <LocationSelector
            value={locationData}
            onChange={(val) => {
              setLocationData(val);
              setLocation(val.location);
            }}
            locale={locale}
          />
        </div>

        {/* Contact Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#050505] dark:text-[#e4e6eb] mb-1.5">
              {locale === 'bn' ? 'প্রধান মোবাইল নম্বর *' : 'Primary Phone *'}
            </label>
            <Input
              type="tel"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="01XXXXXXXXX"
              required
              className="h-10"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#050505] dark:text-[#e4e6eb] mb-1.5">
              {locale === 'bn' ? 'বিকল্প মোবাইল নম্বর' : 'Alternate Phone'}
            </label>
            <Input
              type="tel"
              value={alternateContact}
              onChange={(e) => setAlternateContact(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="h-10"
            />
          </div>
        </div>

        {/* Note / Extra details */}
        <div>
          <label className="block text-xs font-bold text-[#050505] dark:text-[#e4e6eb] mb-1.5">
            {locale === 'bn' ? 'অতিরিক্ত বিবরণ / নোট' : 'Additional Notes'}
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder={
              locale === 'bn'
                ? 'যাতায়াত সুবিধা, সময় বা বিশেষ কোনো নির্দেশনা থাকলে লিখুন...'
                : 'Any special instructions or travel arrangements...'
            }
            className="w-full p-3 rounded-xl border border-[#e4e6eb] bg-white text-xs text-[#050505] placeholder-[#65676b] focus:border-rose-500 focus:outline-hidden dark:border-[#393a3b] dark:bg-[#242526] dark:text-[#e4e6eb] dark:placeholder-[#b0b3b8] dark:focus:border-rose-500"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f0f2f5] dark:border-[#3a3b3c]">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(ROUTES.BLOOD.HOME)}
            disabled={isCreating}
            className="text-xs"
          >
            {locale === 'bn' ? 'বাতিল' : 'Cancel'}
          </Button>

          <Button
            type="submit"
            disabled={isCreating}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 shadow-xs"
          >
            {isCreating ? (
              <span className="flex items-center gap-1.5">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>{locale === 'bn' ? 'পোস্ট হচ্ছে...' : 'Posting...'}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Heart className="h-4 w-4 fill-current" />
                <span>
                  {locale === 'bn' ? 'রিকোয়েস্ট পোস্ট করুন' : 'Submit Request'}
                </span>
              </span>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
