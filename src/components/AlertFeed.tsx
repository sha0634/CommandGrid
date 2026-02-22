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

import { alerts as initialAlerts, type Alert } from '../dataRepository';

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
    const [alerts] = useState<Alert[]>(initialAlerts);

    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRowClick = (alert: Alert) => {
        setSelectedAlert(alert);
        setIsModalOpen(true);
    };

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
                            className="bg-white border border-gray-200 rounded-lg py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-64"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
                        <Filter size={16} />
                        Filters
                        <ChevronDown size={14} />
                    </button>
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
                            {alerts.map((alert) => (
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
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 bg-white border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xs font-medium text-gray-500">Showing <span className="text-gray-900">6</span> of <span className="text-gray-900">1,289</span> results</p>
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
