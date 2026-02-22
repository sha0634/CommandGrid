import { useState } from 'react';
import {
    Search,
    Filter,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    ArrowUpDown,
    Circle
} from 'lucide-react';
import AlertDetailsModal from './AlertDetailsModal';

type AlertStatus = 'OPEN' | 'ESCALATED' | 'AUTO-CLOSED' | 'RESOLVED';
type Severity = 'Critical' | 'Warning' | 'Info';

interface Alert {
    id: string;
    asset: string;
    sourceType: string;
    severity: Severity;
    status: AlertStatus;
    timestamp: string;
    driverName?: string;
    vehicleId?: string;
}

const StatusBadge = ({ status }: { status: AlertStatus }) => {
    const styles = {
        'OPEN': 'bg-blue-50 text-blue-600 border-blue-100',
        'ESCALATED': 'bg-red-600 text-white border-red-700 font-bold',
        'AUTO-CLOSED': 'bg-gray-100 text-gray-500 border-gray-200',
        'RESOLVED': 'bg-green-50 text-green-600 border-green-100'
    };

    return (
        <span className={`px-2.5 py-1 rounded-md text-[10px] border shadow-sm ${styles[status]}`}>
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
            <span className="text-gray-700 font-medium">{severity}</span>
        </div>
    );
};

const AlertFeed = () => {
    const [alerts] = useState<Alert[]>([
        { id: '#A-001', asset: 'Vehicle', sourceType: 'Critical', severity: 'Critical', status: 'OPEN', timestamp: '2024-10-26 09:30', driverName: 'John Smith', vehicleId: 'V-101' },
        { id: '#A-003', asset: 'Vehicle', sourceType: 'ESCALATED', severity: 'Critical', status: 'ESCALATED', timestamp: '2024-10-26 09:25', driverName: 'Maria Rodriguez', vehicleId: 'V-2015' },
        { id: '#A-004', asset: 'Asset Tracker', sourceType: 'Critical', severity: 'Info', status: 'AUTO-CLOSED', timestamp: '2024-10-26 09:20', driverName: 'Ahmed Khan', vehicleId: 'V-305' },
        { id: '#A-005', asset: 'Sensor', sourceType: 'Tire Pressure Low', severity: 'Warning', status: 'RESOLVED', timestamp: '2024-10-26 09:15', driverName: 'David Green', vehicleId: 'V-205' },
        { id: '#A-006', asset: 'Vehicle', sourceType: 'Tire Pressure Low', severity: 'Critical', status: 'OPEN', timestamp: '2024-10-26 09:10', driverName: 'John Smith', vehicleId: 'V-101' },
        { id: '#A-007', asset: 'Asset Tracker', sourceType: 'Critical', severity: 'Info', status: 'OPEN', timestamp: '2024-10-26 09:05', driverName: 'Maria Rodriguez', vehicleId: 'V-2015' },
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

    const filteredAlerts = alerts.filter(alert => {
        const matchesSearch =
            (alert.driverName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            alert.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            alert.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
            alert.sourceType.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = filterStatus === 'ALL' || alert.status === filterStatus;
        const matchesSeverity = filterSeverity === 'ALL' || alert.severity === filterSeverity;

        return matchesSearch && matchesStatus && matchesSeverity;
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Alert Feed</h2>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Driver name or Alert ID"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border border-gray-200 rounded-lg py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-64"
                        />
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all shadow-sm border ${isFilterOpen || filterStatus !== 'ALL' || filterSeverity !== 'ALL'
                                ? 'bg-blue-50 border-blue-200 text-blue-600'
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <Filter size={16} />
                            Filters
                            {(filterStatus !== 'ALL' || filterSeverity !== 'ALL') && (
                                <span className="w-2 h-2 rounded-full bg-blue-600" />
                            )}
                            <ChevronDown size={14} className={`transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isFilterOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Filter Options</h3>
                                        {(filterStatus !== 'ALL' || filterSeverity !== 'ALL' || searchQuery !== '') && (
                                            <button
                                                onClick={clearFilters}
                                                className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase"
                                            >
                                                Reset
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">Status</label>
                                        <div className="flex flex-wrap gap-1">
                                            {['ALL', 'OPEN', 'ESCALATED', 'RESOLVED', 'AUTO-CLOSED'].map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => setFilterStatus(s as any)}
                                                    className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${filterStatus === s
                                                        ? 'bg-blue-600 border-blue-600 text-white'
                                                        : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                                                        }`}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">Severity</label>
                                        <div className="flex flex-wrap gap-1">
                                            {['ALL', 'Critical', 'Warning', 'Info'].map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => setFilterSeverity(s as any)}
                                                    className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${filterSeverity === s
                                                        ? 'bg-amber-500 border-amber-500 text-white'
                                                        : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                                                        }`}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setIsFilterOpen(false)}
                                        className="w-full py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-black transition-colors"
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    <div className="flex items-center gap-2 cursor-pointer hover:text-gray-900">Alert ID <ArrowUpDown size={12} /></div>
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Asset Tracker</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Source Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Severity</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    <div className="flex items-center gap-2 cursor-pointer hover:text-gray-900">Timestamp <ArrowUpDown size={12} /></div>
                                </th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredAlerts.length > 0 ? (
                                filteredAlerts.map((alert) => (
                                    <tr
                                        key={alert.id}
                                        className="hover:bg-gray-50 transition-colors group cursor-pointer"
                                        onClick={() => handleRowClick(alert)}
                                    >
                                        <td className="px-6 py-4 text-sm font-bold text-gray-400">{alert.id}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-700">{alert.asset}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{alert.sourceType}</td>
                                        <td className="px-6 py-4 text-sm"><SeverityIndicator severity={alert.severity} /></td>
                                        <td className="px-6 py-4 text-sm"><StatusBadge status={alert.status} /></td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{alert.timestamp}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-all">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                                        No alerts found for "<span className="font-bold">{searchQuery}</span>"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 bg-white border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xs font-medium text-gray-500">
                        Showing <span className="text-gray-900">{filteredAlerts.length}</span> of <span className="text-gray-900">{alerts.length}</span> results
                    </p>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-400 font-medium">Page 1 of 50</span>
                        <div className="flex items-center gap-1">
                            <button disabled className="p-1.5 text-gray-300 cursor-not-allowed"><ChevronLeft size={18} /></button>
                            {[1, 2, 3].map((p) => (
                                <button key={p} className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${p === 1 ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-gray-500 hover:bg-gray-50'}`}>
                                    {p}
                                </button>
                            ))}
                            <span className="text-gray-300">...</span>
                            <button className="p-1.5 text-gray-500 hover:bg-gray-50 rounded-lg"><ChevronRight size={18} /></button>
                        </div>
                    </div>
                </div>
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
