import { AppShell } from '../components/layout/AppShell';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { DigitalKasaPage } from '../features/drive/DigitalKasaPage';
import { CanvasPusulaPage } from '../features/pusula/CanvasPusulaPage';
import { TaskEnginePage } from '../features/task-engine/TaskEnginePage';
import { useMusavirStore } from '../store/useMusavirStore';

export function App() {
  const page = useMusavirStore((s) => s.activePage);

  return (
    <AppShell>
      {page === 'dashboard' && <DashboardPage />}
      {page === 'task-engine' && <TaskEnginePage />}
      {page === 'pusula' && <CanvasPusulaPage />}
      {page === 'digital-kasa' && <DigitalKasaPage />}
    </AppShell>
  );
}
