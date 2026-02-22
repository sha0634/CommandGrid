import { useState, useMemo } from 'react';
import {
    Search,
    Download,
    FileText,
    CheckSquare,
    Archive,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
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

const mockLogs = [
    { id: 1, alertId: '#A-1024', timestamp: '2024-10-26 10:15:22', action: 'Status Changed', actor: 'System (Auto-Rule)', description: 'Escalated due to 3 overspeeding incidents within 60 mins.', severity: 'Critical', status: 'ESCALATED' },
    { id: 2, alertId: '#A-1025', timestamp: '2024-10-26 10:12:05', action: 'Alert Created', actor: 'Telematics Module', description: 'Overspeeding detected: 85mph in 65mph zone.', severity: 'Critical', status: 'OPEN' },
    { id: 3, alertId: '#A-1020', timestamp: '2024-10-26 09:45:11', action: 'Resolved', actor: 'Admin (Sarah Chen)', description: 'Driver confirmed technical glitch; false positive.', severity: 'Info', status: 'RESOLVED' },
    { id: 4, alertId: '#A-1018', timestamp: '2024-10-26 09:30:00', action: 'Auto-Closed', actor: 'System (Auto-Rule)', description: 'Document renewed in compliance module.', severity: 'Warning', status: 'AUTO-CLOSED' },
    { id: 5, alertId: '#A-0995', timestamp: '2024-10-25 18:22:45', action: 'Comment Added', actor: 'Ops Manager', description: 'Investigating engine diagnostic alert.', severity: 'Warning', status: 'OPEN' },
    { id: 6, alertId: '#A-0990', timestamp: '2024-10-25 16:10:12', action: 'Status Changed', actor: 'System (Auto-Rule)', description: 'Escalated: multiple harsh braking events.', severity: 'Critical', status: 'ESCALATED' },
];

const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        'OPEN': 'bg-blue-50 text-blue-600 border-blue-100',
        'ESCALATED': 'bg-red-50 text-red-600 border-red-100',
        'AUTO-CLOSED': 'bg-gray-100 text-gray-500 border-gray-200',
        'RESOLVED': 'bg-green-50 text-green-600 border-green-100',
        'Critical': 'bg-red-600 text-white border-red-700',
        'Warning': 'bg-amber-50 text-amber-600 border-amber-100',
        'Info': 'bg-blue-50 text-blue-600 border-blue-100'
    };
    return (
        <span className={cn("px-2 py-0.5 rounded text-[10px] font-black border uppercase tracking-widest", styles[status] || 'bg-gray-50 text-gray-500')}>
            {status}
        </span>
    );
};

const AlertHistory = ({ initialFilter = '' }: { initialFilter?: string }) => {
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(initialFilter || '');
    const [filterStatus, setFilterStatus] = useState<AlertStatus | 'ALL'>('ALL');
    const [filterSeverity, setFilterSeverity] = useState<Severity | 'ALL'>('ALL');

    const filteredLogs = useMemo(() => {
        return mockLogs.filter(log => {
            const matchesSearch =
                log.alertId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = filterStatus === 'ALL' || log.status === filterStatus;
            const matchesSeverity = filterSeverity === 'ALL' || log.severity === filterSeverity;

            return matchesSearch && matchesStatus && matchesSeverity;
        });
    }, [searchQuery, filterStatus, filterSeverity]);

    const handleRowClick = (log: typeof mockLogs[0]) => {
        setSelectedAlert({
            id: log.alertId,
            sourceType: log.actor as string,
            severity: log.severity as Severity,
            status: log.status as AlertStatus,
            timestamp: log.timestamp,
            asset: 'Manual Investigation'
        });
        setIsModalOpen(true);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setFilterStatus('ALL');
        setFilterSeverity('ALL');
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Toolbar */}
            <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Audit Logs & History</h2>
                    <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest px-1 border-l-4 border-amber-500">
                        System-wide event traceability
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                        aria-label="Export logs as CSV"
                    >
                        <Download size={16} className="text-gray-400" />
                        Export CSV
                    </button>
                    <button
                        className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all shadow-md active:scale-95"
                        aria-label="Generate formal report"
                    >
                        <FileText size={16} />
                        Formal Report
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Events', val: '12,402', color: 'text-blue-600', icon: CheckSquare },
                    { label: 'Auto-Resolved', val: '8,122', color: 'text-green-600', icon: RefreshCcw },
                    { label: 'Manual Overrides', val: '412', color: 'text-amber-600', icon: Archive }
                ].map((s, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-blue-100 transition-colors">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
                            <p className={cn("text-2xl font-black", s.color)}>{s.val}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                            <s.icon size={20} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Advanced Filters Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[300px] relative group flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} aria-hidden="true" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search Alert IDs, Drivers, or Error Codes..."
                            className="w-full pl-12 pr-10 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 rounded-xl text-sm font-medium transition-all outline-none"
                            aria-label="Search logs"
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
                </div>

                {/* Severity Dropdown */}
                <div className="relative">
                    <select
                        value={filterSeverity}
                        onChange={(e) => setFilterSeverity(e.target.value as Severity | 'ALL')}
                        className={cn(
                            "appearance-none pl-4 pr-10 py-3 bg-gray-50 border-transparent hover:border-gray-200 rounded-xl text-sm font-bold text-gray-700 outline-none transition-all cursor-pointer",
                            filterSeverity !== 'ALL' && "bg-blue-50 border-blue-100 text-blue-600"
                        )}
                        aria-label="Filter by severity"
                    >
                        <option value="ALL">All Severities</option>
                        <option value="Critical">Critical Only</option>
                        <option value="Warning">Warning Only</option>
                        <option value="Info">Info Only</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                {/* Status Dropdown */}
                <div className="relative">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as AlertStatus | 'ALL')}
                        className={cn(
                            "appearance-none pl-4 pr-10 py-3 bg-gray-50 border-transparent hover:border-gray-200 rounded-xl text-sm font-bold text-gray-700 outline-none transition-all cursor-pointer",
                            filterStatus !== 'ALL' && "bg-blue-50 border-blue-100 text-blue-600"
                        )}
                        aria-label="Filter by status"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="OPEN">Open</option>
                        <option value="ESCALATED">Escalated</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="AUTO-CLOSED">Auto-Closed</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                <div className="h-8 w-px bg-gray-100 mx-2 hidden lg:block" />

                <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-transparent hover:border-gray-200 rounded-xl text-sm font-bold text-gray-500 transition-all active:scale-95"
                    aria-label="Reset all filters"
                >
                    <RefreshCcw size={14} className={cn(filteredLogs.length === mockLogs.length && "opacity-50")} />
                    Reset
                </button>
            </div>

            {/* Audit Logs Content */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden min-h-[500px] flex flex-col">
                {filteredLogs.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 text-center animate-in zoom-in-95 duration-500">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-8">
                            <Archive size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Archives Empty</h3>
                        <p className="text-gray-400 font-bold max-w-sm mb-8">
                            No logs found matching your criteria. Try adjusting the severity or status filters.
                        </p>
                        <button
                            onClick={clearFilters}
                            className="px-10 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all active:scale-95"
                        >
                            Back to Zero-Filter
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-separate border-spacing-0" aria-label="System audit logs">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-6 py-5 font-black text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-100 italic">Timeline</th>
                                        <th className="px-6 py-5 font-black text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-100">Identity</th>
                                        <th className="px-6 py-5 font-black text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-100">Process State</th>
                                        <th className="px-6 py-5 font-black text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-100">Action Integrity</th>
                                        <th className="px-6 py-5 font-black text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredLogs.map(log => (
                                        <tr
                                            key={log.id}
                                            className="group hover:bg-gray-50/50 transition-colors cursor-pointer"
                                            onClick={() => handleRowClick(log)}
                                            role="button"
                                            aria-label={`Log for alert ${log.alertId}: ${log.description}`}
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-black text-gray-900">{log.timestamp.split(' ')[1]}</span>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{log.timestamp.split(' ')[0]}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-blue-600 font-black text-[10px] border border-gray-100 shadow-sm">
                                                        {log.alertId.split('-')[1]}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-black text-blue-600">{log.alertId}</span>
                                                        <span className="text-[10px] font-bold text-gray-400">{log.actor}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <StatusBadge status={log.severity} />
                                                    <ChevronRight size={14} className="text-gray-300" />
                                                    <StatusBadge status={log.status} />
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-gray-700">{log.action}</span>
                                                    <span className="text-[10px] font-bold text-gray-400 truncate max-w-[200px]">{log.description}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-100">
                                                        <ExternalLink size={14} />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer */}
                        <div className="mt-auto px-8 py-5 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                Tracing <span className="text-gray-900">{filteredLogs.length}</span> / {mockLogs.length} verified operations
                            </p>
                            <div className="flex items-center gap-2">
                                <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 transition-all shadow-sm disabled:opacity-50" aria-label="Previous page">
                                    <ChevronLeft size={16} />
                                </button>
                                <div className="flex items-center gap-1">
                                    <button className="w-8 h-8 rounded-lg bg-gray-900 text-white text-[10px] font-black shadow-lg">1</button>
                                    <button className="w-8 h-8 rounded-lg bg-white border border-gray-100 text-gray-500 text-[10px] font-black hover:border-gray-300 transition-all">2</button>
                                    <button className="w-8 h-8 rounded-lg bg-white border border-gray-100 text-gray-500 text-[10px] font-black hover:border-gray-300 transition-all">3</button>
                                </div>
                                <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 transition-all shadow-sm" aria-label="Next page">
                                    <ChevronRight size={16} />
                                </button>
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

export default AlertHistory;
