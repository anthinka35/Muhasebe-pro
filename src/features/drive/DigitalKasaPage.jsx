import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { getGoogleConfig, simulateGoogleOAuth, uploadToDrive } from '../../services/googleDriveService';
import { useMusavirStore } from '../../store/useMusavirStore';

export function DigitalKasaPage() {
  const mukellefler = useMusavirStore((s) => s.mukellefler);
  const connectDrive = useMusavirStore((s) => s.connectDrive);
  const addDocument = useMusavirStore((s) => s.addDocumentToMukellef);
  const [token, setToken] = useState('');

  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        addDocument(mukellefler[0].id, {
          id: crypto.randomUUID(),
          isim: file.name,
          url: URL.createObjectURL(file),
          tip: file.type,
        });
      });
    },
    [addDocument, mukellefler]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const onGoogleConnect = async () => {
    const _cfg = getGoogleConfig();
    const auth = await simulateGoogleOAuth();
    setToken(auth.accessToken);
    connectDrive();
  };

  const createPetition = async () => {
    const content = 'Müşavir OS 2026 Dilekçe\nKonu: İşlem Talebi';
    const blob = new Blob([content], { type: 'application/msword' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'dilekce.doc';
    a.click();

    if (token) {
      await uploadToDrive({ accessToken: token, fileName: 'dilekce.doc', mimeType: 'application/msword', content });
    }
  };

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-cyan-500/40 bg-surface p-4 shadow-sharp">
        <button onClick={onGoogleConnect} className="rounded-lg border border-cyan-400 bg-cyan-500/10 px-4 py-2 text-cyan-200">
          Google Drive'ı Bağla
        </button>
      </div>

      <div {...getRootProps()} className="cursor-pointer rounded-2xl border-2 border-dashed border-cyan-500/60 bg-slate-900/80 p-8 text-center">
        <input {...getInputProps()} />
        Vergi levhası / kimlik / sözleşme dosyalarını sürükle-bırak yükle
      </div>

      <button onClick={createPetition} className="rounded-lg border border-emerald-500 bg-emerald-500/10 px-4 py-2 text-emerald-200">
        Dilekçe Oluştur & Drive'a Kaydet
      </button>
    </section>
  );
}
