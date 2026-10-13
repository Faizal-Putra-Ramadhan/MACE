import api from '../api/axios';

// Upload a file to the backend (stored on local disk under public/uploads)
// and return its public URL. Same signature as the previous Supabase helper.
export async function uploadDokumen(file, bucket = 'dokumen-pendaftaran') {
  const base64 = await fileToBase64(file);

  const { data } = await api.post('/upload', {
    file: base64,
    filename: file.name,
    bucket,
  });

  return data.url;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
