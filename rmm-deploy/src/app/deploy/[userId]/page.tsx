// src/app/deploy/[userId]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function DeployPage() {
    const params = useParams();
    const userId = params.userId;
    const [loading, setLoading] = useState(false);

    const downloadInstaller = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/deploy/${userId}`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'install-rmm-agent.bat';
            a.click();
        } catch (error) {
            alert('Failed to download installer');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h1 className="text-2xl font-bold mb-4">🚀 RMM Agent Installer</h1>
                <p className="text-gray-600 mb-6">
                    Click the button below to download your custom installer.
                </p>
                <button
                    onClick={downloadInstaller}
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Generating...' : '📥 Download Installer'}
                </button>
                <p className="text-xs text-gray-400 mt-4">
                    Agent will connect to: https://rmm-agent-system.onrender.com
                </p>
            </div>
        </div>
    );
}