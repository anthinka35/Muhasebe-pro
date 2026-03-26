import { addDays, getDay, isBefore, parseISO, startOfDay } from 'date-fns';
import { create } from 'zustand';

const toBusinessDay = (date) => {
  const day = getDay(date);
  if (day === 6) return addDays(date, 2);
  if (day === 0) return addDays(date, 1);
  return date;
};

const initialMukellefler = [
  {
    id: 'm1',
    ad: 'Akdeniz Gıda Ltd. Şti.',
    muhTipi: 'Limited',
    bagkur: true,
    tcVergiNo: '1234567890',
    naceKodu: '56.10.19',
    tapdkVarMi: true,
    muhasebeUcreti: 12500,
    acilisTarihi: '2026-01-03',
    kapanisTarihi: null,
    sifreler: { gib: '***', sgk: '***' },
    belgeler: [],
  },
  {
    id: 'm2',
    ad: 'Rota Yazılım Hizmetleri',
    muhTipi: 'Şahıs',
    bagkur: false,
    tcVergiNo: '9888776655',
    naceKodu: '62.01.01',
    tapdkVarMi: false,
    muhasebeUcreti: 9700,
    acilisTarihi: '2026-02-10',
    kapanisTarihi: null,
    sifreler: { gib: '***', sgk: '***' },
    belgeler: [],
  },
];

const initialGorevler = [
  {
    id: 'g1',
    mukellefId: 'm1',
    tip: 'Beyanname',
    altTip: 'KDV',
    baslik: 'Şubat KDV Beyannamesi',
    tutar: 32450,
    sonTarih: '2026-03-28',
    okunmaTarihi: null,
    durum: 'Bekliyor',
  },
  {
    id: 'g2',
    mukellefId: 'm1',
    tip: 'Tebligat',
    altTip: 'e-Tebligat',
    baslik: 'Yoklama tebligatı',
    tutar: 0,
    sonTarih: '2026-03-30',
    okunmaTarihi: '2026-03-16',
    durum: 'Bekliyor',
  },
  {
    id: 'g3',
    mukellefId: 'm2',
    tip: 'Ödeme',
    altTip: 'Muhasebe Ücreti',
    baslik: 'Mart muhasebe hizmet bedeli',
    tutar: 9700,
    sonTarih: '2026-04-05',
    okunmaTarihi: null,
    durum: 'Bekliyor',
  },
];

const createTask = (mukellefId, tip, altTip, baslik, tutar, sonTarih) => ({
  id: crypto.randomUUID(),
  mukellefId,
  tip,
  altTip,
  baslik,
  tutar,
  sonTarih,
  okunmaTarihi: null,
  durum: 'Bekliyor',
});

export const useMusavirStore = create((set, get) => ({
  mukellefler: initialMukellefler,
  gorevler: initialGorevler,
  activePage: 'dashboard',
  whatsappItems: [],
  driveConnected: false,

  setPage: (page) => set({ activePage: page }),
  connectDrive: () => set({ driveConnected: true }),

  toggleTaskStatus: (taskId) =>
    set((state) => ({
      gorevler: state.gorevler.map((g) =>
        g.id === taskId ? { ...g, durum: g.durum === 'Bekliyor' ? 'Tamamlandı' : 'Bekliyor' } : g
      ),
    })),

  addDocumentToMukellef: (mukellefId, belge) =>
    set((state) => ({
      mukellefler: state.mukellefler.map((m) =>
        m.id === mukellefId ? { ...m, belgeler: [...m.belgeler, belge] } : m
      ),
    })),

  addManualTask: (task) => set((state) => ({ gorevler: [...state.gorevler, { ...task, id: crypto.randomUUID() }] })),

  syncTebligat: () => {
    const today = startOfDay(new Date());
    set((state) => ({
      gorevler: state.gorevler.map((g) =>
        g.tip === 'Tebligat' && g.durum === 'Bekliyor' ? { ...g, okunmaTarihi: g.okunmaTarihi ?? today.toISOString().slice(0, 10) } : g
      ),
    }));
  },

  generateMonthlyTasks: (monthDate) => {
    const state = get();
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    const ruleDates = [
      { tip: 'Beyanname', altTip: 'KDV', day: 28, title: 'KDV Beyannamesi' },
      { tip: 'Beyanname', altTip: 'Muhtasar', day: 26, title: 'Muhtasar Beyannamesi' },
      { tip: 'Vergi', altTip: 'Geçici Vergi', day: 17, title: 'Geçici Vergi' },
      { tip: 'Ödeme', altTip: 'Muhasebe Ücreti', day: 5, title: 'Muhasebe Ücreti' },
    ];

    const created = [];

    state.mukellefler.forEach((m) => {
      ruleDates.forEach((rule) => {
        const rawDate = new Date(year, month, rule.day);
        const shifted = toBusinessDay(rawDate);
        const base = rule.altTip === 'Muhasebe Ücreti' ? m.muhasebeUcreti : Math.round(Math.random() * 50000);
        const damga = Math.ceil(base * 0.00759);
        created.push(
          createTask(
            m.id,
            rule.tip,
            rule.altTip,
            `${m.ad} - ${rule.title}`,
            base + damga,
            shifted.toISOString().slice(0, 10)
          )
        );
      });

      if (m.acilisTarihi) {
        const openDate = parseISO(m.acilisTarihi);
        created.push(createTask(m.id, 'SGK', 'Açılış', `${m.ad} SGK Açılış`, 0, addDays(openDate, 15).toISOString().slice(0, 10)));
        created.push(
          createTask(m.id, 'Vergi', 'Daire', `${m.ad} Vergi Dairesi Açılış`, 0, addDays(openDate, 30).toISOString().slice(0, 10))
        );
      }
    });

    set((state2) => ({ gorevler: [...state2.gorevler, ...created] }));
  },

  populateWhatsappItems: (mukellefId, monthDate) => {
    const state = get();
    const month = monthDate.getMonth();
    const year = monthDate.getFullYear();

    const items = state.gorevler
      .filter((g) => {
        const d = parseISO(g.sonTarih);
        return g.mukellefId === mukellefId && d.getMonth() === month && d.getFullYear() === year;
      })
      .map((g) => ({ id: g.id, aciklama: g.baslik, tutar: g.tutar }));

    set({ whatsappItems: items });
  },

  addWhatsappItem: () =>
    set((state) => ({
      whatsappItems: [...state.whatsappItems, { id: crypto.randomUUID(), aciklama: 'Yeni Kalem', tutar: 0 }],
    })),

  updateWhatsappItem: (id, field, value) =>
    set((state) => ({
      whatsappItems: state.whatsappItems.map((it) => (it.id === id ? { ...it, [field]: value } : it)),
    })),

  riskScore: () => {
    const today = startOfDay(new Date());
    const tasks = get().gorevler.filter((g) => g.durum === 'Bekliyor');
    const late = tasks.filter((g) => isBefore(parseISO(g.sonTarih), today)).length;
    const critical = tasks.filter((g) => {
      const diff = Math.ceil((parseISO(g.sonTarih) - today) / (1000 * 60 * 60 * 24));
      return diff >= 0 && diff <= 3;
    }).length;
    return late * 10 + critical * 5;
  },

  hasTebligatAlarm: () => {
    const today = startOfDay(new Date());
    return get().gorevler.some((g) => {
      if (g.tip !== 'Tebligat' || g.durum !== 'Bekliyor' || !g.okunmaTarihi) return false;
      const deadline = addDays(parseISO(g.okunmaTarihi), 15);
      const left = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
      return left <= 3;
    });
  },
}));
