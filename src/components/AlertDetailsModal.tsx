import { useState } from 'react';
import {
    X,
    User,
    Bot,
    AlertTriangle,
    Download,
    Check
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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

interface AlertDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    alert: Alert | null;
}

const TimelineStep = ({
    state,
    timestamp,
    reason,
    isSystem = true,
    color,
    isLast = false
}: {
    state: string;
    timestamp: string;
    reason?: string;
    isSystem?: boolean;
    color: string;
    isLast?: boolean;
}) => (
    <div className="flex gap-4">
        <div className="flex flex-col items-center">
            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2", color)}>
                {isLast ? <Check size={12} className="text-white fill-current" /> : <div className="w-2 h-2 rounded-full bg-current" />}
            </div>
            {!isLast && <div className="w-0.5 h-16 bg-gray-200" />}
        </div>
        <div className="flex-1 pb-4">
            <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">{state}</h4>
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-400">
                    {isSystem ? <Bot size={12} /> : <User size={12} />}
                    {timestamp}
                </div>
            </div>
            {reason && <p className="text-xs text-gray-500 italic bg-gray-50 p-2 rounded border border-gray-100">{reason}</p>}
        </div>
    </div>
);

const AlertDetailsModal = ({ isOpen, onClose, alert }: AlertDetailsModalProps) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [closedFilter, setClosedFilter] = useState<'24h' | '7d'>('24h');

    if (!isOpen || !alert) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-6xl h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-extrabold text-gray-900">Alert Deep-Dive</h2>
                        <div className="h-6 w-px bg-gray-200" />
                        <span className="text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full text-xs">
                            Ref ID: {alert.id}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">

                        {/* Column 1: Metadata & Actions */}
                        <div className="space-y-6">
                            <section>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Alert Metadata</h3>
                                <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-4 shadow-inner">
                                    <div className="grid grid-cols-2 gap-y-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Alert ID</p>
                                            <p className="text-sm font-bold text-gray-900">{alert.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Severity</p>
                                            <div className="flex items-center gap-1">
                                                <div className={cn("w-2 h-2 rounded-full", alert.severity === 'Critical' ? 'bg-red-500' : alert.severity === 'Warning' ? 'bg-amber-500' : 'bg-blue-500')} />
                                                <span className="text-sm font-bold">{alert.severity}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Driver Name</p>
                                            <p className="text-sm font-bold text-gray-900">{alert.driverName || 'Maria Rodriguez'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Vehicle ID</p>
                                            <p className="text-sm font-bold text-gray-900">{alert.vehicleId || 'V-2015'}</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Associated Data</h3>
                                <div className="bg-blue-600 rounded-xl p-5 text-white shadow-lg shadow-blue-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <AlertTriangle size={20} className="text-blue-100" />
                                        <p className="text-xs font-bold uppercase tracking-wider opacity-80">Telemetry Insight</p>
                                    </div>
                                    <div className="text-2xl font-black">78 mph</div>
                                    <p className="text-xs font-medium opacity-90 mt-1">
                                        Route Limit: <span className="underline decoration-wavy">55 mph</span> (+23 over)
                                    </p>
                                </div>
                            </section>

                            <div className="pt-4 relative">
                                <button
                                    onClick={() => setShowConfirm(true)}
                                    className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-100 transition-all active:scale-[0.98]"
                                >
                                    Resolve Manually
                                </button>

                                {showConfirm && (
                                    <div className="absolute bottom-full left-0 right-0 mb-2 p-4 bg-white border border-gray-200 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-2 z-20">
                                        <p className="text-sm font-bold text-gray-900 mb-3">Are you sure you want to manually resolve this alert?</p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setShowConfirm(false);
                                                    // Handle resolution logic
                                                }}
                                                className="flex-1 py-2 bg-red-600 text-white text-xs font-bold rounded-lg"
                                            >
                                                Yes, Resolve
                                            </button>
                                            <button
                                                onClick={() => setShowConfirm(false)}
                                                className="flex-1 py-2 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Column 2: State Transition Timeline */}
                        <div className="border-x border-gray-100 px-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">State Transition Timeline</h3>
                            <div className="space-y-0">
                                <TimelineStep
                                    state="CREATED"
                                    timestamp="10:15 AM"
                                    color="border-gray-400 bg-white text-gray-400"
                                    isSystem
                                />
                                <TimelineStep
                                    state="OPEN (Auto-opened)"
                                    timestamp="10:16 AM"
                                    color="border-amber-500 bg-white text-amber-500"
                                    isSystem
                                />
                                <TimelineStep
                                    state="ESCALATED"
                                    timestamp="10:45 AM"
                                    reason="Reason: 3 overspeeds in 60 min"
                                    color="border-red-600 bg-white text-red-600"
                                    isSystem
                                />
                                <TimelineStep
                                    state="RESOLVED"
                                    timestamp="Pending"
                                    color="border-green-500 bg-green-500 text-white"
                                    isSystem={false}
                                    isLast
                                />
                            </div>
                        </div>

                        {/* Column 3: Auto-Closed Alerts Transparency Panel */}
                        <div className="space-y-6 flex flex-col h-full">
                            <div className="flex-1 min-h-0 flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Auto-Closed Alerts</h3>
                                    <div className="bg-gray-100 p-1 rounded-lg flex gap-1">
                                        <button
                                            onClick={() => setClosedFilter('24h')}
                                            className={cn("px-3 py-1 text-[10px] font-bold rounded-md transition-all", closedFilter === '24h' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500")}
                                        >
                                            24h
                                        </button>
                                        <button
                                            onClick={() => setClosedFilter('7d')}
                                            className={cn("px-3 py-1 text-[10px] font-bold rounded-md transition-all", closedFilter === '7d' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500")}
                                        >
                                            7d
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="p-3 bg-white border border-gray-100 rounded-xl hover:border-gray-300 transition-colors shadow-sm group">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[10px] font-black text-blue-600">ID #AC-{(100 + i)}</span>
                                                <span className="text-[10px] text-gray-400 font-medium">10:{(20 + i)} AM</span>
                                            </div>
                                            <p className="text-xs font-bold text-gray-900">Document Renewed</p>
                                            <div className="flex items-center gap-2 mt-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <span className="text-[10px] font-bold text-gray-400">Orig:</span>
                                                <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter bg-red-50 px-1.5 rounded">Compliance</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 mt-auto">
                                <button className="w-full py-3 border-2 border-dashed border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-500 hover:text-blue-600 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 group">
                                    <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
                                    Export as CSV (Compliance)
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlertDetailsModal;
