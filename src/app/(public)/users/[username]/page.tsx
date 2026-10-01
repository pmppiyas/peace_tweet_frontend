import { redirect } from 'next/navigation';

export default async function LegacyUserProfileRedirectPage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = await params;
  const username = resolvedParams.username;
  const sp = await searchParams;

  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(sp || {})) {
    if (typeof value === 'string') {
      qs.set(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((v) => qs.append(key, v));
    }
  }

  const queryString = qs.toString();
  redirect(`/${username}${queryString ? `?${queryString}` : ''}`);
}
