import { useState } from 'react';
import {
    Search,
    Filter,
    Download,
    FileText,
    CheckSquare,
    Archive,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    ExternalLink,
    XCircle,
    RefreshCcw
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import AlertDetailsModal from './AlertDetailsModal';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type AlertStatus = 'OPEN' | 'ESCALATED' | 'AUTO-CLOSED' | 'RESOLVED';
type Severity = 'Critical' | 'Warning' | 'Info';
type SourceType = 'Vehicle' | 'Asset Tracker' | 'Sensor';

interface LogEntry {
    id: string;
    timestamp: string;
    alertId: string;
    description: string;
    actor: string;
    actionTaken: string;
    severity: Severity;
    status: AlertStatus;
    source: SourceType;
}

const mockLogs: LogEntry[] = [
    {
        id: 'L-001',
        timestamp: '2024-10-26 10:45:00',
        alertId: '#A-003',
        description: 'System auto-escalated due to repeated overspeeding',
        actor: 'System/AI',
        actionTaken: 'Open → Escalated',
        severity: 'Critical',
        status: 'ESCALATED',
        source: 'Vehicle'
    },
    {
        id: 'L-002',
        timestamp: '2024-10-26 10:42:15',
        alertId: '#A-005',
        description: 'Manual resolution applied after inspection',
        actor: 'Admin: Matthew Sanchez',
        actionTaken: 'Open → Resolved',
        severity: 'Warning',
        status: 'RESOLVED',
        source: 'Sensor'
    },
    {
        id: 'L-003',
        timestamp: '2024-10-26 10:30:10',
        alertId: '#A-004',
        description: 'Document renewal confirmed by system parser',
        actor: 'System/AI',
        actionTaken: 'Open → Auto-Closed',
        severity: 'Info',
        status: 'AUTO-CLOSED',
        source: 'Asset Tracker'
    },
    {
        id: 'L-004',
        timestamp: '2024-10-26 10:15:45',
        alertId: '#A-006',
        description: 'Harsh braking detected - alert created',
        actor: 'Driver: John Smith',
        actionTaken: 'None → Open',
        severity: 'Critical',
        status: 'ESCALATED',
        source: 'Vehicle'
    },
    // Adding more mock data for density
    ...Array.from({ length: 21 }, (_, i) => ({
        id: `L-00${i + 5}`,
        timestamp: `2024-10-26 09:${(50 - i).toString().padStart(2, '0')}:00`,
        alertId: `#A-0${(100 + i)}`,
        description: i % 2 === 0 ? 'Connectivity lost for > 5 minutes' : 'Low battery warning triggered',
        actor: i % 3 === 0 ? 'System/AI' : 'Admin: Sarah Chen',
        actionTaken: 'Open → Resolved',
        severity: (i % 4 === 0 ? 'Critical' : i % 3 === 0 ? 'Warning' : 'Info') as Severity,
        status: (i % 2 === 0 ? 'RESOLVED' : 'AUTO-CLOSED') as AlertStatus,
        source: (i % 3 === 0 ? 'Sensor' : 'Vehicle') as SourceType
    }))
];

const AlertHistory = ({ initialFilter }: { initialFilter?: string }) => {
    const [selectedLogs, setSelectedLogs] = useState<string[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [selectedAlert, setSelectedAlert] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(initialFilter || '');
    const [filterStatus, setFilterStatus] = useState<AlertStatus | 'ALL'>('ALL');
    const [filterSeverity, setFilterSeverity] = useState<Severity | 'ALL'>('ALL');
    const [activeDropdown, setActiveDropdown] = useState<'severity' | 'status' | null>(null);

    const clearFilters = () => {
        setSearchQuery('');
        setFilterStatus('ALL');
        setFilterSeverity('ALL');
        setSelectedLogs([]);
    };

    const filteredLogs = mockLogs.filter(log => {
        const matchesSearch =
            log.alertId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.actionTaken.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = filterStatus === 'ALL' || log.status === filterStatus;
        const matchesSeverity = filterSeverity === 'ALL' || log.severity === filterSeverity;

        return matchesSearch && matchesStatus && matchesSeverity;
    });

    const toggleSelectAll = () => {
        if (selectedLogs.length === filteredLogs.length) {
            setSelectedLogs([]);
        } else {
            setSelectedLogs(filteredLogs.map(log => log.id));
        }
    };

    const toggleSelectRow = (id: string) => {
        if (selectedLogs.includes(id)) {
            setSelectedLogs(selectedLogs.filter(item => item !== id));
        } else {
            setSelectedLogs([...selectedLogs, id]);
        }
    };

    const handleAlertClick = (log: LogEntry) => {
        // Map LogEntry to Alert interface expected by the modal
        const alertForModal = {
            id: log.alertId,
            asset: log.source,
            sourceType: 'System Audit',
            severity: log.severity,
            status: log.status,
            timestamp: log.timestamp,
            driverName: log.actor.includes('Driver') ? log.actor.split(': ')[1] : undefined,
            vehicleId: log.source === 'Vehicle' ? 'V-AUTO' : undefined
        };
        setSelectedAlert(alertForModal);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Alert History & Logs</h2>
                    <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest px-1 border-l-4 border-blue-600">
                        Audit Logs Found: <span className="text-blue-600">{filteredLogs.length.toLocaleString()}</span>
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                        <Download size={16} className="text-gray-400" />
                        Download CSV
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
                        <FileText size={16} />
                        Export to PDF
                    </button>
                </div>
            </div>

            {/* Advanced Filters Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[300px] relative group flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search Alert IDs, Drivers, or Error Codes..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 rounded-xl text-sm font-medium transition-all outline-none border"
                        />
                    </div>
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
                        >
                            <XCircle size={18} />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {/* Severity Filter */}
                    <div className="relative">
                        <button
                            onClick={() => setActiveDropdown(activeDropdown === 'severity' ? null : 'severity')}
                            className={cn(
                                "flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all border",
                                filterSeverity !== 'ALL' || activeDropdown === 'severity'
                                    ? "bg-blue-50 border-blue-200 text-blue-600"
                                    : "bg-gray-50 border-transparent text-gray-600 hover:bg-white hover:border-gray-200"
                            )}
                        >
                            <Filter size={18} className={filterSeverity !== 'ALL' ? "text-blue-600" : "text-gray-400"} />
                            Severity
                            {filterSeverity !== 'ALL' && (
                                <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">1</span>
                            )}
                            <ChevronDown size={14} className={cn("transition-transform duration-200", activeDropdown === 'severity' && "rotate-180")} />
                        </button>

                        {activeDropdown === 'severity' && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                {['ALL', 'Critical', 'Warning', 'Info'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => {
                                            setFilterSeverity(s as any);
                                            setActiveDropdown(null);
                                        }}
                                        className={cn(
                                            "w-full text-left px-4 py-2 rounded-lg text-xs font-bold transition-colors",
                                            filterSeverity === s ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"
                                        )}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <button
                            onClick={() => setActiveDropdown(activeDropdown === 'status' ? null : 'status')}
                            className={cn(
                                "flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all border",
                                filterStatus !== 'ALL' || activeDropdown === 'status'
                                    ? "bg-blue-50 border-blue-200 text-blue-600"
                                    : "bg-gray-50 border-transparent text-gray-600 hover:bg-white hover:border-gray-200"
                            )}
                        >
                            Status
                            {filterStatus !== 'ALL' && (
                                <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">1</span>
                            )}
                            <ChevronDown size={14} className={cn("transition-transform duration-200", activeDropdown === 'status' && "rotate-180")} />
                        </button>

                        {activeDropdown === 'status' && (
                            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                {['ALL', 'OPEN', 'ESCALATED', 'RESOLVED', 'AUTO-CLOSED'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => {
                                            setFilterStatus(s as any);
                                            setActiveDropdown(null);
                                        }}
                                        className={cn(
                                            "w-full text-left px-4 py-2 rounded-lg text-xs font-bold transition-colors",
                                            filterStatus === s ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"
                                        )}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {(filterStatus !== 'ALL' || filterSeverity !== 'ALL' || searchQuery !== '') && (
                        <button
                            onClick={clearFilters}
                            className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            title="Clear all filters"
                        >
                            <RefreshCcw size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Bulk Actions Bar (Visible when rows selected) */}
            <div className={cn(
                "overflow-hidden transition-all duration-300",
                selectedLogs.length > 0 ? "h-16 opacity-100 mb-4" : "h-0 opacity-0"
            )}>
                <div className="bg-blue-600 rounded-xl p-3 flex items-center justify-between shadow-lg shadow-blue-100">
                    <div className="flex items-center gap-4 px-3">
                        <span className="text-white font-bold text-sm">{selectedLogs.length} logs selected</span>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-bold transition-all border border-white/20">
                            <CheckSquare size={14} />
                            Bulk Resolve
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-50 transition-all shadow-md">
                            <Archive size={14} />
                            Archive Selection
                        </button>
                    </div>
                </div>
            </div>

            {/* High Density Logs Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-5 w-12">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        checked={filteredLogs.length > 0 && selectedLogs.length === filteredLogs.length}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="px-4 py-5 font-black text-[10px] text-gray-400 uppercase tracking-widest">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900 transition-colors">
                                        Timestamp <ArrowUpDown size={12} />
                                    </div>
                                </th>
                                <th className="px-4 py-5 font-black text-[10px] text-gray-400 uppercase tracking-widest text-center">Alert ID</th>
                                <th className="px-4 py-5 font-black text-[10px] text-gray-400 uppercase tracking-widest">Event Description</th>
                                <th className="px-4 py-5 font-black text-[10px] text-gray-400 uppercase tracking-widest">Actor</th>
                                <th className="px-4 py-5 font-black text-[10px] text-gray-400 uppercase tracking-widest">Action Taken</th>
                                <th className="px-6 py-5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredLogs.map((log) => (
                                <tr
                                    key={log.id}
                                    className={cn(
                                        "group hover:bg-gray-50/80 transition-all duration-200",
                                        log.severity === 'Critical' && "border-l-4 border-l-red-500",
                                        log.severity === 'Warning' && "border-l-4 border-l-amber-500",
                                        log.severity === 'Info' && "border-l-4 border-l-blue-500",
                                        selectedLogs.includes(log.id) && "bg-blue-50/30"
                                    )}
                                >
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 shadow-sm transition-all"
                                            checked={selectedLogs.includes(log.id)}
                                            onChange={() => toggleSelectRow(log.id)}
                                        />
                                    </td>
                                    <td className="px-4 py-4 text-[11px] font-bold text-gray-500 whitespace-nowrap tabular-nums">
                                        {log.timestamp}
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <button
                                            onClick={() => handleAlertClick(log)}
                                            className="inline-flex items-center gap-1 text-[11px] font-black text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded-md transition-all group"
                                        >
                                            {log.alertId}
                                            <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                    </td>
                                    <td className="px-4 py-4 max-w-md">
                                        <p className="text-xs font-bold text-gray-900 leading-relaxed truncate group-hover:whitespace-normal group-hover:overflow-visible transition-all">
                                            {log.description}
                                        </p>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="p-1 bg-gray-100 rounded text-gray-400 font-bold text-[9px]">
                                                {log.actor.split(':')[0]}
                                            </span>
                                            <span className="text-xs font-bold text-gray-700">{log.actor.split(':')[1] || log.actor}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="text-[10px] font-black px-2 py-1 bg-gray-100 text-gray-500 rounded-full border border-gray-200 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                                            {log.actionTaken}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-1.5 text-gray-300 hover:text-gray-900 hover:bg-white hover:shadow-sm rounded-lg transition-all">
                                            <ChevronRight size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Fixed Pagination Footer */}
                <div className="px-8 py-5 bg-white border-t border-gray-100 flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rows per page:</span>
                            <div className="relative">
                                <select
                                    className="appearance-none bg-gray-50 border border-transparent hover:border-gray-200 px-4 py-2 pr-10 rounded-xl text-xs font-black text-gray-900 outline-none transition-all cursor-pointer"
                                    value={rowsPerPage}
                                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                                >
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Showing <span className="text-gray-900">{filteredLogs.length}</span> of <span className="text-gray-900">{mockLogs.length}</span> results
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button disabled className="w-10 h-10 flex items-center justify-center text-gray-300 cursor-not-allowed hover:bg-gray-50 rounded-xl transition-all">
                            <ChevronLeft size={20} />
                        </button>
                        {[1, 2, 3, 4, 5].map(p => (
                            <button
                                key={p}
                                className={cn(
                                    "w-10 h-10 flex items-center justify-center text-xs font-black rounded-xl transition-all",
                                    p === 1 ? "bg-blue-600 text-white shadow-lg shadow-blue-100 scale-110" : "text-gray-500 hover:bg-gray-50"
                                )}
                            >
                                {p}
                            </button>
                        ))}
                        <div className="px-1 text-gray-300 font-bold">...</div>
                        <button className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-xl transition-all hover:translate-x-0.5">
                            <ChevronRight size={20} />
                        </button>
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

export default AlertHistory;
