import { redirect } from 'next/navigation';

export default function HomePage() {
  // Pengalihan otomatis dari root domain ke Executive Dashboard
  redirect('/executive');
}