const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'GOOGLE_CLIENT_ID_PLACEHOLDER';
const GOOGLE_SCOPE = 'https://www.googleapis.com/auth/drive.file';

export const getGoogleConfig = () => ({ clientId: GOOGLE_CLIENT_ID, scope: GOOGLE_SCOPE });

export const simulateGoogleOAuth = async () => {
  await new Promise((resolve) => setTimeout(resolve, 900));
  return {
    accessToken: 'mock_access_token_replace_after_real_oauth',
    expiresIn: 3599,
  };
};

export const uploadToDrive = async ({ accessToken, fileName, mimeType, content }) => {
  const metadata = { name: fileName, mimeType };
  const boundary = 'musavirosboundary';
  const body =
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n` +
    `--${boundary}\r\nContent-Type: ${mimeType}\r\n\r\n${content}\r\n` +
    `--${boundary}--`;

  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body,
  });

  if (!response.ok) {
    throw new Error('Drive yükleme başarısız');
  }

  return response.json();
};
