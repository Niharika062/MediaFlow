import { useState, useRef } from 'react';
import api from '../api/axios';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setStatus('Uploading...');
    setDownloadUrl('');

    const formData = new FormData();
    formData.append('video', file);

    try {
      const { data } = await api.post('/jobs/upload', formData);
      const jobId = data.jobId;
      setStatus('Converting...');
      pollStatus(jobId);
    } catch (err) {
      setStatus('Upload failed');
      setLoading(false);
    }
  };

  const pollStatus = (jobId) => {
    intervalRef.current = setInterval(async () => {
      try {
        const { data } = await api.get(`/jobs/${jobId}/status`);
        if (data.job.status === 'done') {
          clearInterval(intervalRef.current);
          const { data: dlData } = await api.get(`/jobs/${jobId}/download`);
          setDownloadUrl(dlData.downloadUrl);
          setStatus('Done!');
          setLoading(false);
        } else if (data.job.status === 'failed') {
          clearInterval(intervalRef.current);
          setStatus('Conversion failed');
          setLoading(false);
        }
      } catch (err) {
        clearInterval(intervalRef.current);
        setStatus('Something went wrong');
        setLoading(false);
      }
    }, 3000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>MediaFlow</h2>
        <p style={{ color: '#888' }}>Upload a video to convert to MP3</p>
        <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} style={{ margin: '1rem 0' }} />
        <button style={styles.button} onClick={handleUpload} disabled={loading || !file}>
          {loading ? 'Processing...' : 'Convert to MP3'}
        </button>
        {status && <p style={{ marginTop: '1rem', color: '#444' }}>{status}</p>}
        {downloadUrl && (
          <a href={downloadUrl} download style={styles.downloadBtn}>
            Download MP3
          </a>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f5f5f5' },
  card: { background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '360px' },
  button: { width: '100%', padding: '0.75rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer' },
  downloadBtn: { display: 'block', marginTop: '1rem', padding: '0.75rem', background: '#22c55e', color: '#fff', borderRadius: '6px', textAlign: 'center', textDecoration: 'none' }
};