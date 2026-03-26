import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useMusavirStore } from '../../store/useMusavirStore';

export function TaskEnginePage() {
  const gorevler = useMusavirStore((s) => s.gorevler);
  const mukellefler = useMusavirStore((s) => s.mukellefler);
  const toggleTaskStatus = useMusavirStore((s) => s.toggleTaskStatus);
  const generateMonthlyTasks = useMusavirStore((s) => s.generateMonthlyTasks);

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-cyan-500/40 bg-surface p-4 shadow-sharp">
        <h2 className="text-lg font-semibold text-cyan-300">Görev Motoru (Single Source of Truth)</h2>
        <button
          onClick={() => generateMonthlyTasks(new Date())}
          className="mt-3 rounded-lg border border-cyan-400 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200"
        >
          Bu Ayı Oluştur
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-700 bg-slate-900/70 p-3 shadow-sharp">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-left text-slate-300">
              <th className="p-2">Mükellef</th>
              <th className="p-2">Tip</th>
              <th className="p-2">Alt Tip</th>
              <th className="p-2">Son Tarih</th>
              <th className="p-2">Durum</th>
            </tr>
          </thead>
          <tbody>
            {gorevler.map((g) => (
              <tr key={g.id} className="border-b border-slate-800/80">
                <td className="p-2">{mukellefler.find((m) => m.id === g.mukellefId)?.ad}</td>
                <td className="p-2">{g.tip}</td>
                <td className="p-2">{g.altTip}</td>
                <td className="p-2">{format(parseISO(g.sonTarih), 'dd.MM.yyyy', { locale: tr })}</td>
                <td className="p-2">
                  <button
                    onClick={() => toggleTaskStatus(g.id)}
                    className={`rounded-md px-3 py-1 text-xs font-medium ${
                      g.durum === 'Bekliyor' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {g.durum}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
