import { redirect } from 'next/navigation';

export default function BloodDonorsPage() {
  redirect('/blood?tab=donors');
}
