import { AlertTriangle, RefreshCcw, Siren } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useMusavirStore } from '../../store/useMusavirStore';

export function DashboardPage() {
  const gorevler = useMusavirStore((s) => s.gorevler);
  const mukellefler = useMusavirStore((s) => s.mukellefler);
  const syncTebligat = useMusavirStore((s) => s.syncTebligat);
  const riskScore = useMusavirStore((s) => s.riskScore());
  const hasAlarm = useMusavirStore((s) => s.hasTebligatAlarm());

  const waiting = gorevler.filter((g) => g.durum === 'Bekliyor');

  return (
    <section className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-cyan-500/40 bg-surface p-4 shadow-sharp">
          <p className="text-sm text-slate-300">Risk Skoru</p>
          <p className="mt-2 text-4xl font-bold text-cyan-300">{riskScore}</p>
        </div>
        <div className="rounded-2xl border border-orange-500/40 bg-surface p-4 shadow-sharp">
          <p className="text-sm text-slate-300">Bekleyen Görev</p>
          <p className="mt-2 text-4xl font-bold text-orange-300">{waiting.length}</p>
        </div>
        <button
          onClick={syncTebligat}
          className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/50 bg-emerald-500/10 p-4 text-emerald-200 shadow-sharp"
        >
          <RefreshCcw className="h-4 w-4" />
          🔄 GİB E-Tebligat Senkronize Et
        </button>
      </div>

      {hasAlarm && (
        <div className="animate-pulsefast rounded-2xl border-2 border-red-400 bg-red-500/20 p-6 text-center shadow-sharp">
          <p className="text-2xl font-black tracking-wide text-red-100">🚨 KIRMIZI ALARM · E-TEBLİGAT SÜRESİ DOLUYOR</p>
        </div>
      )}

      <div className="rounded-2xl border border-red-400/40 bg-surface p-5 shadow-sharp">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-red-300">
          <Siren className="h-5 w-5" /> 🔥 YANAN İŞLER
        </h2>
        <div className="space-y-2">
          {waiting.map((task) => {
            const mukellef = mukellefler.find((m) => m.id === task.mukellefId);
            return (
              <div key={task.id} className="rounded-xl border border-slate-700 bg-slate-800/80 p-3">
                <div className="flex items-center justify-between text-sm">
                  <p className="font-semibold text-slate-100">{task.baslik}</p>
                  <span className="text-cyan-300">{format(parseISO(task.sonTarih), 'dd MMM yyyy', { locale: tr })}</span>
                </div>
                <p className="mt-1 text-xs text-slate-300">{mukellef?.ad}</p>
              </div>
            );
          })}
          {waiting.length === 0 && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-emerald-200">
              <AlertTriangle className="h-4 w-4" /> Ofis modu temiz, acil görev yok.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
