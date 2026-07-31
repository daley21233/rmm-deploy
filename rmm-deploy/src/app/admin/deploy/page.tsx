// src/app/admin/deploy/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Agent {
    id: number;
    hostname: string;
    status: string;
    os: string;
    ip_address: string;
    last_seen: string;
}

export default function AdminDeployPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState('');
    const [deployLink, setDeployLink] = useState('');
    const [agents, setAgents] = useState<Agent[]>([]);
    const [agentsLoading, setAgentsLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

    // Check if user is logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        } else {
            setIsAuthenticated(true);
            fetchAgents();
        }
        setLoading(false);
    }, [router]);

    // Fetch connected agents
    const fetchAgents = async () => {
        setAgentsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/agents', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setAgents(data.agents || []);
            }
        } catch (error) {
            console.error('Failed to fetch agents:', error);
        } finally {
            setAgentsLoading(false);
        }
    };

    // Generate deployment link
    const generateLink = () => {
        if (!userId.trim()) {
            setError('Please enter a User ID');
            return;
        }
        setError('');
        const link = `${window.location.origin}/deploy/${encodeURIComponent(userId.trim())}`;
        setDeployLink(link);
        setCopied(false);
    };

    // Copy link to clipboard
    const copyToClipboard = () => {
        if (deployLink) {
            navigator.clipboard.writeText(deployLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        }
    };

    // Handle Enter key
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            generateLink();
        }
    };

    // Get status badge color
    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'online':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'offline':
                return 'bg-red-100 text-red-800 border-red-300';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                    <p className="mt-2 text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Will redirect to login
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">🔗 Deployment Link Generator</h1>
                        <p className="text-gray-600 mt-1">Generate custom installation links for your users</p>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="text-sm bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition-colors"
                    >
                        ← Dashboard
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Generator Card */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">📝 Generate Link</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    User / Device ID
                                </label>
                                <input
                                    type="text"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="e.g., john-doe-123"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    This ID will identify the system in your dashboard.
                                    Use letters, numbers, and hyphens only.
                                </p>
                                {error && (
                                    <p className="text-sm text-red-600 mt-1">{error}</p>
                                )}
                            </div>

                            <button
                                onClick={generateLink}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors font-medium"
                            >
                                Generate Deployment Link
                            </button>
                        </div>

                        {deployLink && (
                            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                                <p className="font-medium text-green-800 mb-2">✅ Link Generated!</p>
                                <div className="flex flex-col gap-2">
                                    <div className="bg-white p-2 rounded border border-green-200 break-all text-sm">
                                        {deployLink}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={copyToClipboard}
                                            className={`flex-1 py-1.5 rounded-lg transition-colors text-sm ${
                                                copied 
                                                    ? 'bg-green-500 text-white' 
                                                    : 'bg-gray-200 hover:bg-gray-300'
                                            }`}
                                        >
                                            {copied ? '✅ Copied!' : '📋 Copy Link'}
                                        </button>
                                        <button
                                            onClick={() => window.open(deployLink, '_blank')}
                                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-1.5 rounded-lg transition-colors text-sm"
                                        >
                                            🔗 Open
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Agents List Card */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">📊 Connected Agents</h2>
                            <button
                                onClick={fetchAgents}
                                className="text-sm text-blue-500 hover:text-blue-700"
                                disabled={agentsLoading}
                            >
                                {agentsLoading ? '🔄 Refreshing...' : '🔄 Refresh'}
                            </button>
                        </div>

                        {agentsLoading ? (
                            <div className="text-center py-8 text-gray-500">
                                <div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-blue-500 border-t-transparent"></div>
                                <p className="mt-2 text-sm">Loading agents...</p>
                            </div>
                        ) : agents.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <div className="text-4xl mb-2">🤖</div>
                                <p>No agents connected yet</p>
                                <p className="text-sm">Share a deployment link to get started</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-2 px-3 font-medium text-gray-600">Hostname</th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-600">Status</th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-600">OS</th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-600">ID</th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-600">Last Seen</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {agents.map((agent) => (
                                            <tr key={agent.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-2 px-3 font-medium">{agent.hostname}</td>
                                                <td className="py-2 px-3">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs border ${getStatusColor(agent.status)}`}>
                                                        {agent.status || 'unknown'}
                                                    </span>
                                                </td>
                                                <td className="py-2 px-3 text-gray-600 text-xs">{agent.os || 'N/A'}</td>
                                                <td className="py-2 px-3 text-gray-500 text-xs">{agent.id}</td>
                                                <td className="py-2 px-3 text-gray-500 text-xs">
                                                    {agent.last_seen ? new Date(agent.last_seen).toLocaleString() : 'Never'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        
                        <div className="mt-4 text-xs text-gray-400">
                            {agents.length} agent{agents.length !== 1 ? 's' : ''} connected
                        </div>
                    </div>
                </div>

                {/* Quick Tips Card */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">💡 Quick Tips</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• <strong>User IDs</strong> should be unique and descriptive (e.g., `john-office-pc`)</li>
                        <li>• <strong>Share links</strong> via email or messaging apps</li>
                        <li>• <strong>Agents</strong> will appear here within 30 seconds of installation</li>
                        <li>• <strong>Links</strong> are reusable - send the same link to multiple users</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}