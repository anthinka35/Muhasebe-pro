import { AlarmClockCheck, Bot, LayoutDashboard, WalletCards } from 'lucide-react';
import { useMusavirStore } from '../../store/useMusavirStore';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'task-engine', label: 'Görev Motoru', icon: AlarmClockCheck },
  { id: 'pusula', label: 'WhatsApp Pusula', icon: Bot },
  { id: 'digital-kasa', label: 'Dijital Kasa', icon: WalletCards },
];

export function AppShell({ children }) {
  const activePage = useMusavirStore((s) => s.activePage);
  const setPage = useMusavirStore((s) => s.setPage);

  return (
    <div className="min-h-screen bg-ink text-slate-100">
      <header className="border-b border-cyan-600/30 bg-surface/90 px-6 py-4 shadow-sharp">
        <h1 className="text-xl font-semibold text-cyan-300">Müşavir OS 2026 · Karar Destek ve Operasyon Sistemi</h1>
      </header>
      <div className="grid grid-cols-12">
        <aside className="col-span-12 border-r border-cyan-500/20 bg-slate-900/80 p-3 md:col-span-3 lg:col-span-2">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = tab.id === activePage;
              return (
                <button
                  key={tab.id}
                  onClick={() => setPage(tab.id)}
                  className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
                    active
                      ? 'border-cyan-400 bg-cyan-500/15 text-cyan-200 shadow-sharp'
                      : 'border-slate-700 bg-slate-800/70 hover:border-cyan-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>
        <main className="col-span-12 p-4 md:col-span-9 lg:col-span-10">{children}</main>
      </div>
    </div>
  );
}
