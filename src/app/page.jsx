import { redirect } from 'next/navigation';

export default function HomePage() {
  // Langsung arahkan pengunjung dari root domain (/) ke Executive Dashboard
  redirect('/executive');
}