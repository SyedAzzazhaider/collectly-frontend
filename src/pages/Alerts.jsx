import AppLayout from '@/components/layout/AppLayout';
import Header from '@/components/layout/Header';

export default function Alerts() {
  return (
    <AppLayout>
      <Header title="Alerts" subtitle="System alerts and notifications." />
      <main className="p-6">
        <p className="text-muted-foreground">Alerts module coming soon.</p>
      </main>
    </AppLayout>
  );
}
