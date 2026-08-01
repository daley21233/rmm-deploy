// pages/index.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
    const [userId, setUserId] = useState('');
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userId.trim()) {
            router.push(`/${userId}`);
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
                    RMM Agent Deployment
                </h1>
                <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                    Enter your device ID to get your custom installer
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '16px' }}>
                        <input
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="e.g., john-pc"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '16px',
                                boxSizing: 'border-box'
                            }}
                            required
                        />
                        <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                            This ID will identify your device in the dashboard.
                        </p>
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            padding: '12px',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '16px',
                            fontWeight: '500',
                            cursor: 'pointer'
                        }}
                    >
                        Generate Installer Link →
                    </button>
                </form>

                <div style={{
                    marginTop: '24px',
                    paddingTop: '24px',
                    borderTop: '1px solid #e5e7eb'
                }}>
                    <p style={{ fontSize: '12px', color: '#9ca3af' }}>
                        Need help? Contact your system administrator.
                    </p>
                </div>
            </div>
        </div>
    );
}