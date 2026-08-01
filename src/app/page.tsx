// src/app/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const [userId, setUserId] = useState('');
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userId.trim()) {
            router.push(`/${userId}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="text-5xl mb-4">🚀</div>
                    <h1 className="text-2xl font-bold text-gray-800">RMM Agent Deployment</h1>
                    <p className="text-gray-600 mt-2">
                        Enter your device ID to get your custom installer
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Device ID
                        </label>
                        <input
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="e.g., john-pc"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            This ID will identify your device in the dashboard.
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-colors font-medium"
                    >
                        Generate Installer Link →
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-400 text-center">
                        Need help? Contact your system administrator.
                    </p>
                </div>
            </div>
        </div>
    );
}
