import { useState, useMemo } from 'react';
import {
    Search,
    Filter,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    ArrowUpDown,
    Circle,
    X
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import AlertDetailsModal from './AlertDetailsModal';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type AlertStatus = 'OPEN' | 'ESCALATED' | 'AUTO-CLOSED' | 'RESOLVED';
type Severity = 'Critical' | 'Warning' | 'Info';

interface Alert {
    id: string;
    asset: string;
    sourceType: string;
    severity: Severity;
    status: AlertStatus;
    timestamp: string;
    driverName: string;
    vehicleId: string;
}

const StatusBadge = ({ status }: { status: AlertStatus }) => {
    const styles = {
        'OPEN': 'bg-blue-50 text-blue-600 border-blue-100',
        'ESCALATED': 'bg-red-600 text-white border-red-700 font-bold',
        'AUTO-CLOSED': 'bg-gray-100 text-gray-500 border-gray-200',
        'RESOLVED': 'bg-green-50 text-green-600 border-green-100'
    };

    return (
        <span className={cn("px-2.5 py-1 rounded-md text-[10px] border shadow-sm", styles[status])}>
            {status}
        </span>
    );
};

const SeverityIndicator = ({ severity }: { severity: Severity }) => {
    const colors = {
        'Critical': 'text-red-500',
        'Warning': 'text-amber-500',
        'Info': 'text-blue-500'
    };

    return (
        <div className="flex items-center gap-2">
            <Circle size={8} className={`fill-current ${colors[severity]}`} />
            <span className="text-gray-700 font-medium text-xs">{severity}</span>
        </div>
    );
};

const AlertFeed = () => {
    const [alerts] = useState<Alert[]>([
        { id: '#A-001', asset: 'Vehicle', sourceType: 'Overspeeding', severity: 'Critical', status: 'OPEN', timestamp: '2024-10-26 09:30', driverName: 'John Smith', vehicleId: 'V-101' },
        { id: '#A-003', asset: 'Vehicle', sourceType: 'Harsh Braking', severity: 'Critical', status: 'ESCALATED', timestamp: '2024-10-26 09:25', driverName: 'Maria Rodriguez', vehicleId: 'V-2015' },
        { id: '#A-004', asset: 'Asset Tracker', sourceType: 'Geofence Breach', severity: 'Info', status: 'AUTO-CLOSED', timestamp: '2024-10-26 09:20', driverName: 'Ahmed Khan', vehicleId: 'V-305' },
        { id: '#A-005', asset: 'Sensor', sourceType: 'Tire Pressure Low', severity: 'Warning', status: 'RESOLVED', timestamp: '2024-10-26 09:15', driverName: 'David Green', vehicleId: 'V-205' },
        { id: '#A-006', asset: 'Vehicle', sourceType: 'Lane Departure', severity: 'Critical', status: 'OPEN', timestamp: '2024-10-26 09:10', driverName: 'John Smith', vehicleId: 'V-101' },
        { id: '#A-007', asset: 'Asset Tracker', sourceType: 'Battery Low', severity: 'Info', status: 'OPEN', timestamp: '2024-10-26 09:05', driverName: 'Maria Rodriguez', vehicleId: 'V-2015' },
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState<AlertStatus | 'ALL'>('ALL');
    const [filterSeverity, setFilterSeverity] = useState<Severity | 'ALL'>('ALL');

    const handleRowClick = (alert: Alert) => {
        setSelectedAlert(alert);
        setIsModalOpen(true);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setFilterStatus('ALL');
        setFilterSeverity('ALL');
    };

    const filteredAlerts = useMemo(() => {
        return alerts.filter(alert => {
            const matchesSearch =
                alert.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                alert.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                alert.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
                alert.sourceType.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = filterStatus === 'ALL' || alert.status === filterStatus;
            const matchesSeverity = filterSeverity === 'ALL' || alert.severity === filterSeverity;

            return matchesSearch && matchesStatus && matchesSeverity;
        });
    }, [alerts, searchQuery, filterStatus, filterSeverity]);

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest">Alert Feed</h2>

                <div className="flex flex-1 min-w-[300px] items-center gap-3">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} aria-hidden="true" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by Driver, ID, Asset, or Source..."
                            className="w-full pl-12 pr-10 py-3 bg-white border border-gray-100 focus:border-blue-500 rounded-xl text-sm font-medium transition-all outline-none shadow-sm"
                            aria-label="Search alerts"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                                aria-label="Clear search"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-3 bg-white border border-gray-100 hover:border-gray-300 rounded-xl text-sm font-bold transition-all shadow-sm",
                                (filterStatus !== 'ALL' || filterSeverity !== 'ALL') && "border-blue-200 bg-blue-50 text-blue-600"
                            )}
                            aria-label="Filter options"
                            aria-expanded={isFilterOpen}
                        >
                            <Filter size={18} />
                            <span>Filters</span>
                            {(filterStatus !== 'ALL' || filterSeverity !== 'ALL') && (
                                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                            )}
                            <ChevronDown size={14} className={cn("transition-transform", isFilterOpen && "rotate-180")} />
                        </button>

                        {isFilterOpen && (
                            <div className="absolute right-0 mt-3 w-72 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 p-5 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Advanced Filters</h3>
                                        <button
                                            onClick={clearFilters}
                                            className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase"
                                        >
                                            Reset All
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase">Alert Status</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['ALL', 'OPEN', 'ESCALATED', 'RESOLVED', 'AUTO-CLOSED'].map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => setFilterStatus(s as AlertStatus | 'ALL')}
                                                    className={cn(
                                                        "px-3 py-1.5 rounded-lg text-[10px] font-black transition-all border",
                                                        filterStatus === s
                                                            ? "bg-blue-600 border-blue-600 text-white"
                                                            : "bg-gray-50 border-transparent text-gray-500 hover:border-gray-200"
                                                    )}
                                                    aria-pressed={filterStatus === s}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase">Severity Level</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['ALL', 'Critical', 'Warning', 'Info'].map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => setFilterSeverity(s as Severity | 'ALL')}
                                                    className={cn(
                                                        "px-3 py-1.5 rounded-lg text-[10px] font-black transition-all border",
                                                        filterSeverity === s
                                                            ? "bg-amber-500 border-amber-500 text-white"
                                                            : "bg-gray-50 border-transparent text-gray-500 hover:border-gray-200"
                                                    )}
                                                    aria-pressed={filterSeverity === s}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setIsFilterOpen(false)}
                                        className="w-full py-3 bg-gray-900 text-white text-[10px] font-black rounded-xl hover:bg-black transition-all shadow-lg active:scale-95 uppercase tracking-widest"
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden min-h-[450px] flex flex-col">
                {filteredAlerts.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6 font-black text-2xl animate-pulse">!</div>
                        <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">System Silenced</h3>
                        <p className="text-gray-400 font-bold max-w-xs text-sm">No alerts found matching your specific filters. Try expanding your search scope.</p>
                        <button
                            onClick={clearFilters}
                            className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 uppercase tracking-widest"
                        >
                            Reset System View
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse" aria-label="Real-time alert data">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="px-6 py-5 font-black text-[10px] text-gray-400 uppercase tracking-widest">
                                            <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors">
                                                ID
                                                <ArrowUpDown size={12} />
                                            </div>
                                        </th>
                                        <th className="px-6 py-5 font-black text-[10px] text-gray-400 uppercase tracking-widest">Module / Asset</th>
                                        <th className="px-6 py-5 font-black text-[10px] text-gray-400 uppercase tracking-widest">Severity</th>
                                        <th className="px-6 py-5 font-black text-[10px] text-gray-400 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-5 font-black text-[10px] text-gray-400 uppercase tracking-widest">Entity</th>
                                        <th className="px-6 py-5 font-black text-[10px] text-gray-400 uppercase tracking-widest">Time</th>
                                        <th className="px-6 py-5"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredAlerts.map(alert => (
                                        <tr
                                            key={alert.id}
                                            className="group hover:bg-blue-50/30 transition-all cursor-pointer"
                                            onClick={() => handleRowClick(alert)}
                                            role="button"
                                            aria-label={`Alert ${alert.id} details`}
                                        >
                                            <td className="px-6 py-4">
                                                <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                    {alert.id}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col leading-tight">
                                                    <span className="text-xs font-black text-gray-900">{alert.sourceType}</span>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{alert.asset}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <SeverityIndicator severity={alert.severity} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={alert.status} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[8px] font-black text-gray-400 border border-gray-200">
                                                        {alert.driverName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-gray-700">{alert.driverName}</p>
                                                        <p className="text-[10px] font-bold text-gray-400">{alert.vehicleId}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[11px] font-bold text-gray-500">{alert.timestamp}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-2 text-gray-300 hover:text-blue-600 transition-colors" aria-label="Actions">
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-auto px-6 py-4 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between">
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                Displaying <span className="text-gray-900">{filteredAlerts.length}</span> active traces
                            </p>
                            <div className="flex items-center gap-1">
                                <button disabled className="p-2 text-gray-300 cursor-not-allowed"><ChevronLeft size={16} /></button>
                                <button className="w-8 h-8 rounded-lg bg-white border border-blue-600 text-blue-600 text-xs font-black shadow-sm">1</button>
                                <button disabled className="p-2 text-gray-300 cursor-not-allowed"><ChevronRight size={16} /></button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <AlertDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                alert={selectedAlert}
            />
        </div>
    );
};

export default AlertFeed;
