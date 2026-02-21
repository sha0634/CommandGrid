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
    XCircle
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type SystemStatus = 'operational' | 'degraded' | 'outage';

const mockLatencyData = Array.from({ length: 20 }, (_, _i) => ({
    value: 30 + Math.random() * 25
}));

const SystemHealth = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [status] = useState<SystemStatus>('operational');
    const [lastSync, setLastSync] = useState(new Date());
    const [isDisconnected, setIsDisconnected] = useState(false);
    const [showMaintenance] = useState(true);
    const [latencyData, setLatencyData] = useState(mockLatencyData);

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
