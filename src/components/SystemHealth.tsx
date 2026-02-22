import { useState, useEffect, useMemo } from 'react';
import {
    Activity,
    Database,
    Wifi,
    Server,
    Clock,
    AlertTriangle,
    RefreshCcw,
    ChevronUp,
    CheckCircle2,
    XCircle,
    ShieldAlert
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type SystemStatus = 'operational' | 'degraded' | 'outage';

const mockLatencyData = Array.from({ length: 20 }, () => ({
    value: 30 + Math.random() * 25
}));

const SystemHealth = ({ isFullPage = false }: { isFullPage?: boolean }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [status] = useState<SystemStatus>('operational');
    const [lastSync, setLastSync] = useState(new Date());
    const [isDisconnected, setIsDisconnected] = useState(false);
    const [showMaintenance] = useState(true);
    const [latencyData, setLatencyData] = useState(mockLatencyData);

    const [resourceStats] = useState({
        cpu: 42,
        memory: 68,
        storage: 24,
        dbConnections: 124
    });

    // Simulated real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setLastSync(new Date());
            setLatencyData(prev => [...prev.slice(1), { value: 30 + Math.random() * 25 }]);
        }, 12000);
        return () => clearInterval(interval);
    }, []);

    const timeAgo = useMemo(() => {
        const seconds = Math.floor((new Date().getTime() - lastSync.getTime()) / 1000);
        return seconds < 5 ? 'Just now' : `${seconds}s ago`;
    }, [lastSync]);

    const avgLatency = useMemo(() => {
        const sum = latencyData.reduce((acc, curr) => acc + curr.value, 0);
        return Math.round(sum / latencyData.length);
    }, [latencyData]);

    if (isFullPage) {
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Infrastructure</h1>
                        <p className="text-gray-500 font-medium">Real-time performance and service availability</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                        <div className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-black uppercase tracking-widest border border-green-100 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            Systems Operational
                        </div>
                        <div className="w-px h-6 bg-gray-100" />
                        <div className="flex items-center gap-2 px-2">
                            <Clock size={14} className="text-gray-400" />
                            <span className="text-xs font-bold text-gray-500">Updated {timeAgo}</span>
                        </div>
                    </div>
                </div>

                {/* Performance Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'CPU Usage', value: `${resourceStats.cpu}%`, trend: '+2%', color: 'text-blue-600', bg: 'bg-blue-50', icon: Activity },
                        { label: 'Memory', value: `${resourceStats.memory}%`, trend: '-5%', color: 'text-purple-600', bg: 'bg-purple-50', icon: Server },
                        { label: 'Latency', value: `${avgLatency}ms`, trend: 'Stable', color: 'text-green-600', bg: 'bg-green-50', icon: Wifi },
                        { label: 'DB Load', value: resourceStats.dbConnections, trend: '+12', color: 'text-amber-600', bg: 'bg-amber-50', icon: Database }
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className={cn("p-2 rounded-xl", stat.bg)}>
                                    <stat.icon size={20} className={stat.color} />
                                </div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.trend}</span>
                            </div>
                            <p className="text-sm font-bold text-gray-500 mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tighter">{stat.value}</h3>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Service Registry */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                                <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs">Registry Status</h3>
                                <button className="text-xs font-bold text-blue-600 hover:underline">Full Audit Log</button>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {[
                                    { name: 'Core Alert Engine', version: 'v2.4.1', region: 'US-EAST-1', uptime: '99.99%', status: 'ok' },
                                    { name: 'PostgreSQL Primary', version: '15.4', region: 'US-EAST-1', uptime: '100%', status: 'ok' },
                                    { name: 'WebSocket Gateway', version: 'v1.0.8', region: 'EU-WEST-1', uptime: '99.95%', status: 'ok' },
                                    { name: 'Geofencing Service', version: 'v3.2.0', region: 'US-WEST-2', uptime: '98.54%', status: 'degraded' },
                                    { name: 'Auth Node', version: 'v0.9.4', region: 'Global', uptime: '99.99%', status: 'ok' }
                                ].map((service) => (
                                    <div key={service.name} className="p-6 flex items-center justify-between group hover:bg-gray-50/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                service.status === 'ok' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                                            )} />
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{service.name}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{service.version} • {service.region}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-black text-gray-900 font-mono">{service.uptime}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Uptime</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Latency History */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs">Latency Performance (ms)</h3>
                                <div className="flex gap-2">
                                    {['1H', '24H', '7D'].map((t) => (
                                        <button key={t} className={cn("px-2 py-1 rounded text-[10px] font-black transition-all", t === '1H' ? 'bg-slate-900 text-white' : 'text-gray-400 hover:bg-gray-50')}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={latencyData}>
                                        <defs>
                                            <linearGradient id="mainLatencyGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#3B82F6"
                                            strokeWidth={3}
                                            fill="url(#mainLatencyGradient)"
                                            isAnimationActive={true}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
                            <h3 className="font-black uppercase tracking-widest text-[10px] text-slate-400 mb-6">Upcoming Maintenance</h3>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                                        <Clock size={18} className="text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-100">Primary Database Upgrade</p>
                                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">Oct 28, 02:00 AM UTC • Standard maintenance window. Some read delays expected.</p>
                                    </div>
                                </div>
                                <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-black rounded-lg transition-colors uppercase tracking-widest">
                                    Notify Clients
                                </button>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <ShieldAlert size={16} className="text-red-500" />
                                <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs">Recent Incidents</h3>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { title: 'EU-WEST-1 API Slowdown', date: 'Yesterday', duration: '12m' },
                                    { title: 'Auth Service Latency', date: '2 days ago', duration: '4m' }
                                ].map((incident) => (
                                    <div key={incident.title} className="pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                        <p className="text-sm font-bold text-gray-900">{incident.title}</p>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-[10px] text-gray-400 font-bold uppercase">{incident.date}</span>
                                            <span className="text-[10px] font-black text-gray-500 bg-gray-50 px-2 py-0.5 rounded uppercase tracking-tighter">Fixed in {incident.duration}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isDisconnected) {
        return (
            <div className="mx-4 mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center justify-between gap-3 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center gap-2">
                    <XCircle size={16} className="text-red-500" />
                    <span className="text-[11px] font-black text-red-600 uppercase tracking-tight">Disconnected</span>
                </div>
                <button
                    onClick={() => setIsDisconnected(false)}
                    className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    <RefreshCcw size={14} className="animate-spin-slow" />
                </button>
            </div>
        );
    }

    return (
        <div className="relative mx-4 mb-4">
            {/* Main Widget */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full p-3 rounded-xl border transition-all flex items-center justify-between group",
                    isOpen ? "bg-slate-900 border-slate-800 shadow-2xl" : "bg-white border-gray-100 hover:border-gray-200 shadow-sm"
                )}
            >
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className={cn(
                            "w-2.5 h-2.5 rounded-full",
                            status === 'operational' && "bg-green-500 animate-pulse",
                            status === 'degraded' && "bg-amber-500",
                            status === 'outage' && "bg-red-500 animate-ping"
                        )} />
                        <div className={cn(
                            "absolute inset-0 w-2.5 h-2.5 rounded-full scale-150 opacity-20",
                            status === 'operational' && "bg-green-500",
                            status === 'degraded' && "bg-amber-500",
                            status === 'outage' && "bg-red-500"
                        )} />
                    </div>
                    <div className="text-left">
                        <p className={cn(
                            "text-[10px] font-black uppercase tracking-widest",
                            isOpen ? "text-slate-400" : "text-gray-400"
                        )}>Systems</p>
                        <p className={cn(
                            "text-xs font-black tracking-tight",
                            isOpen ? "text-white" : "text-gray-900"
                        )}>99.98% Uptime</p>
                    </div>
                </div>
                <ChevronUp size={16} className={cn(
                    "transition-transform duration-300",
                    isOpen ? "rotate-0 text-slate-500" : "rotate-180 text-gray-300 group-hover:text-gray-400"
                )} />
            </button>

            {/* Detailed Popover */}
            {isOpen && (
                <div className="absolute bottom-full left-0 w-full mb-3 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-2 duration-300 z-50">
                    <div className="p-5 space-y-6">
                        {/* Maintenance Banner */}
                        {showMaintenance && (
                            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-3">
                                <AlertTriangle className="text-amber-500 shrink-0" size={16} />
                                <p className="text-[11px] font-bold text-amber-200 leading-tight">
                                    Scheduled maintenance in 2 hours. Expected downtime: 5m.
                                </p>
                            </div>
                        )}

                        {/* Services List */}
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Technical Registry</h4>
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { name: 'Alert Engine', icon: Activity, status: 'ok' },
                                    { name: 'Database Cltr', icon: Database, status: 'ok' },
                                    { name: 'WS Gateway', icon: Wifi, status: 'ok' },
                                    { name: 'Geofencing API', icon: Server, status: 'degraded' }
                                ].map(service => (
                                    <div key={service.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/50 transition-colors">
                                        <div className="flex items-center gap-2">
                                            <service.icon size={14} className="text-slate-400" />
                                            <span className="text-xs font-bold text-slate-300 font-mono">{service.name}</span>
                                        </div>
                                        {service.status === 'ok' ? (
                                            <CheckCircle2 size={14} className="text-green-500" />
                                        ) : (
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Latency Graph */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Latency</h4>
                                <span className="text-xs font-black text-green-400 font-mono">{avgLatency}ms</span>
                            </div>
                            <div className="h-12 bg-slate-800/30 rounded-lg p-1">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={latencyData}>
                                        <defs>
                                            <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#22C55E"
                                            strokeWidth={2}
                                            fill="url(#latencyGradient)"
                                            isAnimationActive={false}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Footer Meta */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                            <div className="flex items-center gap-1.5">
                                <Clock size={12} className="text-slate-500" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Last Sync: {timeAgo}</span>
                            </div>
                            <button
                                onClick={() => setIsDisconnected(true)}
                                className="text-[10px] font-black text-slate-600 hover:text-red-400 uppercase tracking-widest transition-colors"
                            >
                                Simulated Drop
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SystemHealth;
