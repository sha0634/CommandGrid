import { useState } from 'react';
import {
    Search,
    LayoutGrid,
    List,
    User,
    Car,
    AlertTriangle,
    MessageSquare,
    GraduationCap,
    ChevronDown,
    ChevronUp,
    Download,
    ExternalLink
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type RiskLevel = 'Low' | 'Medium' | 'High';
type DriverStatus = 'Active' | 'On-Duty' | 'Inactive' | 'Top Performer' | 'Open Alerts';

interface Driver {
    id: string;
    name: string;
    avatar?: string;
    employeeId: string;
    vehicleId: string;
    totalAlerts: number;
    riskLevel: RiskLevel;
    activeAlerts: number;
    recentAlertType: string;
    safetyScore: number;
    status: 'Active' | 'On-Duty' | 'Inactive';
    recentLogs: { type: string; timestamp: string; severity: 'Critical' | 'Warning' | 'Info' }[];
}

import { drivers as mockDrivers } from '../dataRepository';

const RiskBadge = ({ level }: { level: RiskLevel }) => {
    const variants = {
        Low: "bg-green-50 text-green-600 border-green-100",
        Medium: "bg-amber-50 text-amber-600 border-amber-100",
        High: "bg-red-50 text-red-600 border-red-100"
    };
    return (
        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-widest", variants[level])}>
            {level} Risk
        </span>
    );
};

const DriverCard = ({ driver }: { driver: Driver }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all group border-b-4 border-b-transparent hover:border-b-blue-600">
        <div className="flex justify-between items-start mb-4">
            <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                    <User size={24} />
                </div>
                <div>
                    <h3 className="font-black text-gray-900 tracking-tight">{driver.name}</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{driver.employeeId}</p>
                </div>
            </div>
            <RiskBadge level={driver.riskLevel} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Car size={10} /> Asset
                </p>
                <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-gray-900">{driver.vehicleId}</span>
                    <ExternalLink size={10} className="text-blue-500" />
                </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 relative">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Score</p>
                <span className={cn(
                    "text-xs font-black",
                    driver.safetyScore > 90 ? "text-green-600" : driver.safetyScore > 75 ? "text-amber-600" : "text-red-600"
                )}>
                    {driver.safetyScore}/100
                </span>
                {driver.activeAlerts > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full shadow-lg border-2 border-white">
                        {driver.activeAlerts}
                    </div>
                )}
            </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Total Alerts</span>
                <span className="text-sm font-black text-gray-900">{driver.totalAlerts}</span>
            </div>
            <button className="px-4 py-2 bg-gray-50 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-black text-gray-600 transition-all active:scale-95">
                View Profile
            </button>
        </div>
    </div>
);

const DriverRow = ({ driver }: { driver: Driver }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <>
            <tr className={cn(
                "group cursor-pointer transition-colors",
                expanded ? "bg-blue-50/30" : "hover:bg-gray-50/80"
            )} onClick={() => setExpanded(!expanded)}>
                <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                            <User size={16} />
                        </div>
                        <div>
                            <p className="text-xs font-black text-gray-900">{driver.name}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{driver.employeeId}</p>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <span className="text-xs font-black text-gray-700">{driver.vehicleId}</span>
                </td>
                <td className="px-6 py-4">
                    <span className="text-xs font-bold text-gray-500">{driver.recentAlertType}</span>
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    "h-full transition-all duration-1000",
                                    driver.safetyScore > 90 ? "bg-green-500" : driver.safetyScore > 75 ? "bg-amber-500" : "bg-red-500"
                                )}
                                style={{ width: `${driver.safetyScore}%` }}
                            />
                        </div>
                        <span className="text-[11px] font-black text-gray-900">{driver.safetyScore}</span>
                    </div>
                </td>
                <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                        <RiskBadge level={driver.riskLevel} />
                    </div>
                </td>
                <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                </td>
            </tr>
            {expanded && (
                <tr className="bg-gray-50/50 border-t border-gray-100">
                    <td colSpan={6} className="px-8 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-2 duration-300">
                            <div className="col-span-2 space-y-4">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <AlertTriangle size={12} className="text-amber-500" />
                                    Recent Incident Log
                                </h4>
                                <div className="space-y-2">
                                    {driver.recentLogs.length > 0 ? driver.recentLogs.map((log, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-2 h-2 rounded-full",
                                                    log.severity === 'Critical' ? "bg-red-500 shadow-lg shadow-red-200" :
                                                        log.severity === 'Warning' ? "bg-amber-500" : "bg-blue-500"
                                                )} />
                                                <span className="text-xs font-black text-gray-700">{log.type}</span>
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">{log.timestamp}</span>
                                        </div>
                                    )) : (
                                        <p className="text-xs text-gray-400 font-bold italic py-2">No recent incidents recorded.</p>
                                    )}
                                </div>
                            </div>
                            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Priority Actions</h4>
                                <div className="space-y-2">
                                    <button className="w-full flex items-center gap-3 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95">
                                        <MessageSquare size={14} />
                                        Contact Driver
                                    </button>
                                    <button className="w-full flex items-center gap-3 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all shadow-md active:scale-95">
                                        <GraduationCap size={14} />
                                        Assign Training
                                    </button>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

const Drivers = () => {
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [statusFilter, setStatusFilter] = useState<DriverStatus | 'All'>('All');

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Content */}
            <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Drivers & Performance</h2>
                    <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest px-1 border-l-4 border-blue-600">
                        Fleet Personal Management
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                        <Download size={16} className="text-gray-400" />
                        Compliance Report
                    </button>
                    <div className="bg-gray-100 p-1 rounded-xl flex items-center shadow-inner">
                        <button
                            onClick={() => setView('grid')}
                            className={cn("p-2 rounded-lg transition-all", view === 'grid' ? "bg-white text-blue-600 shadow-md scale-105" : "text-gray-400 hover:text-gray-600")}
                        >
                            <LayoutGrid size={20} />
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={cn("p-2 rounded-lg transition-all", view === 'list' ? "bg-white text-blue-600 shadow-md scale-105" : "text-gray-400 hover:text-gray-600")}
                        >
                            <List size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter Hub */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[300px] relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Driver Name, ID, or Vehicle..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 rounded-xl text-sm font-medium transition-all outline-none"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {['All', 'Active', 'On-Duty', 'Open Alerts', 'Top Performers'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setStatusFilter(f as any)}
                            className={cn(
                                "px-4 py-2.5 rounded-xl text-xs font-black transition-all border",
                                statusFilter === f
                                    ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100"
                                    : "bg-gray-50 text-gray-500 border-transparent hover:border-gray-200"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="h-8 w-px bg-gray-200 mx-2 hidden lg:block" />

                <button className="flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 rounded-xl text-sm font-bold text-gray-600 transition-all ml-auto">
                    Sort: High Alerts
                    <ChevronDown size={14} />
                </button>
            </div>

            {/* Content Display */}
            {view === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {mockDrivers.map(driver => (
                        <DriverCard key={driver.id} driver={driver} />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-5 font-black text-[10px] text-gray-400 uppercase tracking-widest">Driver</th>
                                <th className="px-6 py-5 font-black text-[10px] text-gray-400 uppercase tracking-widest text-center">Vehicle</th>
                                <th className="px-6 py-5 font-black text-[10px] text-gray-400 uppercase tracking-widest text-center">Recent Activity</th>
                                <th className="px-6 py-5 font-black text-[10px] text-gray-400 uppercase tracking-widest text-center">Safety Score</th>
                                <th className="px-6 py-5 font-black text-[10px] text-gray-400 uppercase tracking-widest text-center">Risk Status</th>
                                <th className="px-6 py-5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {mockDrivers.map(driver => (
                                <DriverRow key={driver.id} driver={driver} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Drivers;
