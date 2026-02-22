import { useState, useMemo } from 'react';
import {
    Search,
    ChevronDown,
    ArrowUpDown,
    Download,
    ExternalLink,
    XCircle,
    User,
    Truck,
    Shield,
    AlertTriangle
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type RiskLevel = 'Low' | 'Medium' | 'High';
type DriverStatus = 'Active' | 'On-Duty' | 'Inactive' | 'Top Performers' | 'Open Alerts';

interface Driver {
    id: string;
    name: string;
    vehicleId: string;
    status: 'Active' | 'On-Duty' | 'Inactive';
    safetyScore: number;
    activeAlerts: number;
    totalDistance: string;
    lastActive: string;
    riskLevel: RiskLevel;
}

const RiskBadge = ({ level }: { level: RiskLevel }) => {
    const colors = {
        Low: 'bg-green-50 text-green-700 border-green-100',
        Medium: 'bg-amber-50 text-amber-700 border-amber-100',
        High: 'bg-red-50 text-red-700 border-red-100',
    };
    return (
        <span className={cn("px-2 py-0.5 rounded text-[10px] font-black border uppercase tracking-widest", colors[level])}>
            {level} Risk
        </span>
    );
};

const Drivers = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<DriverStatus | 'All'>('All');

    const [drivers] = useState<Driver[]>([
        { id: 'EMP-1201', name: 'John Smith', vehicleId: 'V-101', status: 'Active', safetyScore: 94, activeAlerts: 0, totalDistance: '12,402 km', lastActive: '2 mins ago', riskLevel: 'Low' },
        { id: 'EMP-1205', name: 'Maria Rodriguez', vehicleId: 'V-2015', status: 'On-Duty', safetyScore: 82, activeAlerts: 3, totalDistance: '8,122 km', lastActive: 'Just now', riskLevel: 'Medium' },
        { id: 'EMP-1208', name: 'Ahmed Khan', vehicleId: 'V-305', status: 'Active', safetyScore: 68, activeAlerts: 7, totalDistance: '15,002 km', lastActive: '15 mins ago', riskLevel: 'High' },
        { id: 'EMP-1212', name: 'Sarah Chen', vehicleId: 'V-112', status: 'Active', safetyScore: 98, activeAlerts: 0, totalDistance: '4,102 km', lastActive: '1 hour ago', riskLevel: 'Low' },
        { id: 'EMP-1215', name: 'David Green', vehicleId: 'V-205', status: 'Inactive', safetyScore: 75, activeAlerts: 1, totalDistance: '22,402 km', lastActive: '2 days ago', riskLevel: 'Medium' },
    ]);

    const filteredDrivers = useMemo(() => {
        return drivers.filter(driver => {
            const matchesSearch =
                driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                driver.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                driver.vehicleId.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus =
                statusFilter === 'All' ||
                driver.status === statusFilter ||
                (statusFilter === 'Open Alerts' && driver.activeAlerts > 0) ||
                (statusFilter === 'Top Performers' && driver.safetyScore >= 90);

            return matchesSearch && matchesStatus;
        });
    }, [drivers, searchQuery, statusFilter]);

    const clearFilters = () => {
        setSearchQuery('');
        setStatusFilter('All');
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Fleet Command</h2>
                    <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest px-1 border-l-4 border-blue-500">
                        Human performance & safety metrics
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-black text-gray-600 hover:bg-gray-50 transition-all shadow-sm" aria-label="Export fleet data">
                        <Download size={16} />
                        Fleet Sync
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 transition-all shadow-md active:scale-95" aria-label="Register new asset">
                        <ExternalLink size={16} />
                        Deploy Asset
                    </button>
                </div>
            </div>

            {/* View & Search Controls */}
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xl flex flex-wrap items-center gap-6">
                <div className="flex flex-1 min-w-[300px] relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} aria-hidden="true" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Name, ID, or Vehicle..."
                        className="w-full pl-12 pr-10 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl text-sm font-medium transition-all outline-none"
                        aria-label="Search drivers"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                            aria-label="Clear search"
                        >
                            <XCircle size={16} />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-xl border border-gray-100">
                    {['All', 'Active', 'On-Duty', 'Inactive', 'Top Performers', 'Open Alerts'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s as DriverStatus | 'All')}
                            className={cn(
                                "px-4 py-2 text-[10px] font-black rounded-lg transition-all whitespace-nowrap",
                                statusFilter === s
                                    ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-100"
                                    : "text-gray-400 hover:text-gray-600"
                            )}
                            aria-pressed={statusFilter === s}
                        >
                            {s.toUpperCase()}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={cn("p-2.5 rounded-xl transition-all", viewMode === 'grid' ? "bg-gray-900 text-white shadow-lg" : "bg-gray-50 text-gray-400 hover:text-gray-600")}
                        aria-label="Grid view"
                    >
                        <ChevronDown size={18} className={cn(viewMode === 'grid' && "rotate-180")} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={cn("p-2.5 rounded-xl transition-all", viewMode === 'list' ? "bg-gray-900 text-white shadow-lg" : "bg-gray-50 text-gray-400 hover:text-gray-600")}
                        aria-label="List view"
                    >
                        <ArrowUpDown size={18} className={cn(viewMode === 'list' && "rotate-180")} />
                    </button>
                </div>
            </div>

            {/* Drivers Grid/List */}
            {
                filteredDrivers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-20 text-center bg-white rounded-3xl border border-dashed border-gray-200 animate-in fade-in duration-500">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6 font-black text-2xl animate-pulse">?</div>
                        <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">Ghost Fleet</h3>
                        <p className="text-gray-400 font-bold max-w-xs text-sm">No drivers found for this sector. Reset your sensors to see the full fleet.</p>
                        <button
                            onClick={clearFilters}
                            className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 uppercase tracking-widest"
                        >
                            Restore Radar
                        </button>
                    </div>
                ) : (
                    <div className={cn(
                        viewMode === 'grid'
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            : "flex flex-col gap-4"
                    )}>
                        {filteredDrivers.map(driver => (
                            <div
                                key={driver.id}
                                className={cn(
                                    "bg-white border border-gray-100 hover:border-blue-200 transition-all overflow-hidden group shadow-sm hover:shadow-xl",
                                    viewMode === 'grid' ? "rounded-3xl" : "rounded-2xl flex items-center p-4"
                                )}
                            >
                                {/* Card Content ... */}
                                <div className={cn(viewMode === 'grid' ? "p-6" : "flex-1 flex items-center gap-6")}>
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-blue-600 font-black border border-gray-100">
                                                {driver.name.charAt(0)}
                                            </div>
                                            <div className={cn(
                                                "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white",
                                                driver.status === 'Active' ? "bg-green-500" : driver.status === 'On-Duty' ? "bg-blue-500" : "bg-gray-300"
                                            )} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{driver.name}</h3>
                                            <p className="text-[11px] font-bold text-gray-400 tracking-widest">{driver.id}</p>
                                        </div>
                                    </div>

                                    <div className={cn("grid gap-4 mt-6", viewMode === 'grid' ? "grid-cols-2" : "grid-cols-4 flex-1")}>
                                        <div className="p-3 bg-gray-50 rounded-2xl border border-transparent group-hover:bg-white group-hover:border-gray-100 transition-all">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Shield size={12} className="text-gray-400" />
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Safety</span>
                                            </div>
                                            <p className={cn("text-lg font-black", driver.safetyScore >= 90 ? "text-green-600" : "text-amber-600")}>{driver.safetyScore}%</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-2xl border border-transparent group-hover:bg-white group-hover:border-gray-100 transition-all">
                                            <div className="flex items-center gap-2 mb-1">
                                                <AlertTriangle size={12} className="text-gray-400" />
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Alerts</span>
                                            </div>
                                            <p className={cn("text-lg font-black", driver.activeAlerts > 0 ? "text-red-500" : "text-gray-400")}>{driver.activeAlerts}</p>
                                        </div>
                                        {!viewMode || viewMode === 'list' ? (
                                            <>
                                                <div className="p-3 bg-gray-50 rounded-2xl border border-transparent group-hover:bg-white group-hover:border-gray-100 transition-all">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Truck size={12} className="text-gray-400" />
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Vehicle</span>
                                                    </div>
                                                    <p className="text-sm font-black text-gray-700">{driver.vehicleId}</p>
                                                </div>
                                                <div className="p-3 bg-gray-50 rounded-2xl border border-transparent group-hover:bg-white group-hover:border-gray-100 transition-all">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <User size={12} className="text-gray-400" />
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Risk</span>
                                                    </div>
                                                    <RiskBadge level={driver.riskLevel} />
                                                </div>
                                            </>
                                        ) : null}
                                    </div>

                                    {viewMode === 'grid' && (
                                        <div className="mt-6 flex flex-wrap gap-2 pt-6 border-t border-gray-50">
                                            <RiskBadge level={driver.riskLevel} />
                                            <span className="text-[10px] font-black text-gray-400 px-3 py-1 bg-gray-50 rounded-md flex items-center gap-1 uppercase">
                                                {driver.status}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
        </div >
    );
};

export default Drivers;
