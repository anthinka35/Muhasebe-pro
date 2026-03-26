import { useEffect, useRef, useState } from 'react';
import { useMusavirStore } from '../../store/useMusavirStore';

const themes = {
  klasik: { bg: '#b91c1c', fg: '#ffffff', accent: '#1d4ed8' },
  dark: { bg: '#0f172a', fg: '#e2e8f0', accent: '#22d3ee' },
  clean: { bg: '#f8fafc', fg: '#0f172a', accent: '#0ea5e9' },
};

export function CanvasPusulaPage() {
  const canvasRef = useRef(null);
  const [theme, setTheme] = useState('klasik');
  const [selectedMukellef, setSelectedMukellef] = useState('m1');
  const mukellefler = useMusavirStore((s) => s.mukellefler);
  const items = useMusavirStore((s) => s.whatsappItems);
  const populate = useMusavirStore((s) => s.populateWhatsappItems);
  const addItem = useMusavirStore((s) => s.addWhatsappItem);
  const updateItem = useMusavirStore((s) => s.updateWhatsappItem);

  useEffect(() => {
    populate(selectedMukellef, new Date());
  }, [selectedMukellef, populate]);

  const drawCanvas = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const style = themes[theme];

    ctx.fillStyle = style.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (theme === 'klasik') {
      ctx.fillStyle = style.accent;
      ctx.fillRect(0, 0, 80, canvas.height);
      ctx.save();
      ctx.translate(30, 370);
      ctx.rotate(-Math.PI / 2);
      ctx.font = 'bold 40px sans-serif';
      ctx.fillStyle = '#93c5fd';
      ctx.fillText(new Date().toLocaleString('tr-TR', { month: 'long' }).toUpperCase(), 0, 0);
      ctx.restore();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(100, 24, 580, 72);
      ctx.fillStyle = '#1d4ed8';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText(mukellefler.find((m) => m.id === selectedMukellef)?.ad ?? '', 120, 70);
    }

    ctx.fillStyle = style.fg;
    ctx.font = '24px sans-serif';

    let y = 160;
    items.forEach((item) => {
      ctx.fillText(`${item.aciklama} - ${Number(item.tutar).toLocaleString('tr-TR')}₺`, 110, y);
      y += 44;
    });

    const blob = await new Promise((resolve) => canvas.toBlob(resolve));
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
  };

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-3 rounded-2xl border border-cyan-500/30 bg-surface p-4 shadow-sharp">
        <h2 className="text-lg font-semibold text-cyan-300">WhatsApp Pusula Motoru</h2>
        <select
          value={selectedMukellef}
          onChange={(e) => setSelectedMukellef(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2"
        >
          {mukellefler.map((m) => (
            <option key={m.id} value={m.id}>
              {m.ad}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          {Object.keys(themes).map((key) => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className={`rounded-md px-3 py-1 text-xs ${theme === key ? 'bg-cyan-500/20 text-cyan-200' : 'bg-slate-800'}`}
            >
              {key}
            </button>
          ))}
        </div>

        {items.map((it) => (
          <div key={it.id} className="grid grid-cols-3 gap-2">
            <input
              value={it.aciklama}
              onChange={(e) => updateItem(it.id, 'aciklama', e.target.value)}
              className="col-span-2 rounded-lg border border-slate-700 bg-slate-900 p-2"
            />
            <input
              type="number"
              value={it.tutar}
              onChange={(e) => updateItem(it.id, 'tutar', Number(e.target.value))}
              className="rounded-lg border border-slate-700 bg-slate-900 p-2"
            />
          </div>
        ))}
        <div className="flex gap-2">
          <button onClick={addItem} className="rounded-lg border border-cyan-500 px-3 py-2 text-sm text-cyan-200">
            + Yeni Kalem
          </button>
          <button onClick={drawCanvas} className="rounded-lg border border-emerald-500 px-3 py-2 text-sm text-emerald-200">
            Çiz ve Kopyala
          </button>
        </div>
      </div>
      <canvas ref={canvasRef} width={700} height={900} className="w-full rounded-2xl border border-slate-700 bg-slate-900" />
    </section>
  );
}
