// pages/[userId].tsx
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function DeployPage() {
    const router = useRouter();
    const { userId } = router.query;
    const [loading, setLoading] = useState(false);
    const [downloadComplete, setDownloadComplete] = useState(false);
    const [error, setError] = useState('');

    const downloadInstaller = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/installer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });

            if (!response.ok) {
                throw new Error('Failed to generate installer');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `install-rmm-agent-${userId}.bat`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            setDownloadComplete(true);
        } catch (err) {
            setError('Failed to download installer. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f3f4f6',
            padding: '16px'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '32px',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                maxWidth: '400px',
                width: '100%',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚀</div>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
                    RMM Agent Installer
                </h1>
                <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                    {userId ? (
                        <>Installing for: <strong>{userId}</strong></>
                    ) : (
                        <>Preparing your custom installer...</>
                    )}
                </p>

                {error && (
                    <div style={{
                        padding: '12px',
                        backgroundColor: '#fee2e2',
                        color: '#991b1b',
                        borderRadius: '8px',
                        marginBottom: '16px'
                    }}>
                        {error}
                    </div>
                )}

                {downloadComplete ? (
                    <div>
                        <div style={{
                            padding: '12px',
                            backgroundColor: '#dcfce7',
                            color: '#166534',
                            borderRadius: '8px',
                            marginBottom: '16px'
                        }}>
                            ✅ Download complete!
                        </div>
                        <button
                            onClick={downloadInstaller}
                            style={{
                                width: '100%',
                                backgroundColor: '#6b7280',
                                color: 'white',
                                padding: '12px',
                                borderRadius: '8px',
                                border: 'none',
                                fontSize: '16px',
                                cursor: 'pointer'
                            }}
                        >
                            🔄 Download Again
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={downloadInstaller}
                        disabled={loading}
                        style={{
                            width: '100%',
                            backgroundColor: loading ? '#9ca3af' : '#3b82f6',
                            color: 'white',
                            padding: '12px',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '16px',
                            fontWeight: '500',
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? '⏳ Generating...' : '📥 Download Installer'}
                    </button>
                )}
            </div>
        </div>
    );
}