// src/app/deploy/[userId]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function DeployPage() {
    const params = useParams();
    const userId = params.userId;
    const [loading, setLoading] = useState(false);
    const [downloadComplete, setDownloadComplete] = useState(false);
    const [error, setError] = useState('');

    const downloadInstaller = async () => {
        setLoading(true);
        setError('');
        try {
            // Fetch the installer script from your deploy repository
            const response = await fetch('https://raw.githubusercontent.com/daley21233/rmm-deploy/main/install-rmm-agent.bat');
            
            if (!response.ok) {
                throw new Error('Failed to download installer');
            }
            
            const content = await response.text();
            
            // Replace the agent-id placeholder with the actual user ID
            const modifiedContent = content.replace(
                '--agent-id %COMPUTERNAME%',
                `--agent-id ${userId}`
            );
            
            // Create a blob and download it
            const blob = new Blob([modifiedContent], { type: 'application/bat' });
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
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <div className="text-4xl mb-4">🚀</div>
                <h1 className="text-2xl font-bold mb-2">RMM Agent Installer</h1>
                <p className="text-gray-600 mb-6">
                    {userId ? (
                        <>Installing for: <strong className="text-blue-600">{userId}</strong></>
                    ) : (
                        <>Preparing your custom installer...</>
                    )}
                </p>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {downloadComplete ? (
                    <div className="space-y-4">
                        <div className="p-4 bg-green-100 text-green-700 rounded-lg">
                            ✅ Download complete!
                        </div>
                        <p className="text-sm text-gray-600">
                            Run the downloaded file to install the agent.
                        </p>
                        <button
                            onClick={downloadInstaller}
                            className="w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition-colors"
                        >
                            🔄 Download Again
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={downloadInstaller}
                        disabled={loading}
                        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                    >
                        {loading ? '⏳ Generating...' : '📥 Download Installer'}
                    </button>
                )}

                <div className="mt-6 text-xs text-gray-400">
                    <p>Agent will connect to: <br />
                    <span className="text-blue-500">rmm-agent-system.onrender.com</span></p>
                    <p className="mt-2">Need help? Contact your system administrator.</p>
                </div>
            </div>
        </div>
    );
}
