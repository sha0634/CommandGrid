import { useState, useEffect } from 'react';
import {
    Plus,
    Bell,
    Clock,
    AlertCircle,
    Trash2,
    Edit2,
    X,
    Search,
    ArrowRight,
    AlertTriangle,
    CheckCircle2
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type EscalationAction = 'Notify Supervisor' | 'Mark as Critical' | 'Auto-Assign Tech' | 'Block Vehicle';
type AlertType = 'Vehicle Speed' | 'Engine Temp' | 'Harsh Braking' | 'Geofence' | 'Fatigue';

interface Rule {
    id: string;
    name: string;
    alertType: AlertType;
    action: EscalationAction;
    thresholdCount: number;
    timeWindow: number; // in minutes
    timeUnit: 'Minutes' | 'Hours';
    enabled: boolean;
}

import { rules as initialRules } from '../dataRepository';

const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={cn(
            "fixed bottom-8 right-8 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-10 duration-300 z-[100]",
            type === 'success' ? "bg-green-600 text-white" : "bg-red-600 text-white"
        )}>
            {type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
            <span className="text-sm font-bold">{message}</span>
            <button onClick={onClose} className="ml-4 opacity-50 hover:opacity-100"><X size={16} /></button>
        </div>
    );
};

const Toggle = ({ enabled, onChange }: { enabled: boolean, onChange: (val: boolean) => void }) => (
    <button
        onClick={(e) => { e.stopPropagation(); onChange(!enabled); }}
        className={cn(
            "w-11 h-6 rounded-full transition-all duration-300 relative focus:outline-none focus:ring-2 focus:ring-blue-200",
            enabled ? "bg-green-500 shadow-inner" : "bg-gray-200"
        )}
    >
        <div className={cn(
            "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm",
            enabled ? "translate-x-5" : "translate-x-0"
        )} />
    </button>
);

const RuleCard = ({ rule, onEdit, onDelete, onToggle }: {
    rule: Rule,
    onEdit: () => void,
    onDelete: () => void,
    onToggle: (val: boolean) => void
}) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all group relative overflow-hidden">
        {!rule.enabled && <div className="absolute inset-0 bg-gray-50/40 z-10 pointer-events-none" />}
        <div className="flex justify-between items-start mb-6">
            <div>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">
                    {rule.alertType}
                </span>
                <h3 className="text-lg font-black text-gray-900 mt-2 tracking-tight group-hover:text-blue-600 transition-colors">
                    {rule.name}
                </h3>
            </div>
            <div className="flex items-center gap-4 relative z-20">
                <Toggle enabled={rule.enabled} onChange={onToggle} />
                <div className="flex items-center gap-1">
                    <button onClick={onEdit} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit2 size={18} />
                    </button>
                    <button onClick={onDelete} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>

        <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-500">
                <div className="p-2 bg-gray-50 rounded-lg">
                    <Clock size={16} />
                </div>
                <p className="text-sm font-medium">
                    Escalate if count <span className="text-gray-900 font-bold">&ge; {rule.thresholdCount}</span> within <span className="text-gray-900 font-bold">{rule.timeWindow} {rule.timeUnit}</span>
                </p>
            </div>
            <div className="flex items-center gap-3 text-gray-500">
                <div className="p-2 bg-gray-50 rounded-lg">
                    <Bell size={16} />
                </div>
                <p className="text-sm font-medium">
                    Action: <span className="text-blue-600 font-black tracking-tight">{rule.action}</span>
                </p>
            </div>
        </div>
    </div>
);

const RuleFormModal = ({ rule, onClose, onSave }: { rule: Rule | null, onClose: () => void, onSave: (rule: Rule) => void }) => {
    const [formData, setFormData] = useState<Partial<Rule>>(rule || {
        name: '',
        alertType: 'Vehicle Speed',
        action: 'Notify Supervisor',
        thresholdCount: 3,
        timeWindow: 60,
        timeUnit: 'Minutes',
        enabled: true
    });
    const [error, setError] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) {
            setError('Rule name is required');
            return;
        }
        if ((formData.thresholdCount || 0) < 1) {
            setError('Threshold must be at least 1');
            return;
        }
        setShowPreview(true);
    };

    const confirmSave = () => {
        onSave({ ...formData, id: rule?.id || `R-${Math.random().toString(36).substr(2, 9)}` } as Rule);
    };

    return (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">
                        {rule ? 'Edit Escalation Rule' : 'Create New Rule'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                <div className="px-8 py-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600">
                            <AlertCircle size={18} />
                            <p className="text-sm font-black">{error}</p>
                        </div>
                    )}

                    {!showPreview ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Rule Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-gray-900"
                                    placeholder="e.g. Excessive Speeding Warning"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Alert Type</label>
                                    <select
                                        value={formData.alertType}
                                        onChange={e => setFormData({ ...formData, alertType: e.target.value as AlertType })}
                                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-gray-900 appearance-none"
                                    >
                                        <option>Vehicle Speed</option>
                                        <option>Engine Temp</option>
                                        <option>Harsh Braking</option>
                                        <option>Geofence</option>
                                        <option>Fatigue</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Action</label>
                                    <select
                                        value={formData.action}
                                        onChange={e => setFormData({ ...formData, action: e.target.value as EscalationAction })}
                                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-gray-900 appearance-none"
                                    >
                                        <option>Notify Supervisor</option>
                                        <option>Mark as Critical</option>
                                        <option>Auto-Assign Tech</option>
                                        <option>Block Vehicle</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 p-6 bg-blue-50/50 rounded-2xl border border-blue-50">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-blue-600 uppercase tracking-widest ml-1">Count Threshold</label>
                                    <input
                                        type="number"
                                        value={formData.thresholdCount}
                                        onChange={e => setFormData({ ...formData, thresholdCount: parseInt(e.target.value) })}
                                        className="w-full px-5 py-3 bg-white border border-blue-100 rounded-xl focus:border-blue-500 outline-none transition-all font-black text-blue-600"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-blue-600 uppercase tracking-widest ml-1">Time Window</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={formData.timeWindow}
                                            onChange={e => setFormData({ ...formData, timeWindow: parseInt(e.target.value) })}
                                            className="flex-1 px-5 py-3 bg-white border border-blue-100 rounded-xl focus:border-blue-500 outline-none transition-all font-black text-blue-600"
                                        />
                                        <select
                                            value={formData.timeUnit}
                                            onChange={e => setFormData({ ...formData, timeUnit: e.target.value as any })}
                                            className="w-32 px-4 py-3 bg-white border border-blue-100 rounded-xl font-bold text-blue-500 outline-none"
                                        >
                                            <option>Minutes</option>
                                            <option>Hours</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button type="button" onClick={onClose} className="flex-1 py-4 bg-gray-50 text-gray-600 font-black rounded-2xl hover:bg-gray-100 transition-all uppercase tracking-widest text-xs">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 uppercase tracking-widest text-xs">
                                    Preview Changes
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 opacity-60">
                                    <p className="text-[10px] font-black text-gray-400 uppercase mb-3">CURRENT LOGIC</p>
                                    {rule ? (
                                        <div className="text-sm font-bold text-gray-600">
                                            &ge; {rule.thresholdCount} events / {rule.timeWindow} {rule.timeUnit}
                                        </div>
                                    ) : (
                                        <div className="text-sm font-bold text-gray-400 italic">No existing rule</div>
                                    )}
                                </div>
                                <div className="p-4 bg-blue-50 border-2 border-blue-500/20 rounded-2xl relative">
                                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white p-1 rounded-full shadow-lg">
                                        <ArrowRight size={12} />
                                    </div>
                                    <p className="text-[10px] font-black text-blue-600 uppercase mb-3">NEW LOGIC</p>
                                    <div className="text-sm font-black text-blue-600">
                                        &ge; {formData.thresholdCount} events / {formData.timeWindow} {formData.timeUnit}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex gap-4">
                                <AlertTriangle className="text-amber-500 shrink-0" />
                                <div>
                                    <h4 className="text-sm font-black text-amber-900 tracking-tight">Confirm Rule Propagation</h4>
                                    <p className="text-[13px] text-amber-800 font-medium leading-relaxed mt-1">
                                        Changes will affect live telemetry immediately. Are you sure you want to update the fleet escalation parameters?
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => setShowPreview(false)} className="flex-1 py-4 bg-gray-50 text-gray-600 font-black rounded-2xl transition-all uppercase tracking-widest text-xs">
                                    Back to Edit
                                </button>
                                <button onClick={confirmSave} className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-100 uppercase tracking-widest text-xs">
                                    Confirm & Save
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const EscalationRules = () => {
    const [rules, setRules] = useState<Rule[]>(initialRules);
    const [editingRule, setEditingRule] = useState<Rule | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleToggle = (id: string, enabled: boolean) => {
        setRules(rules.map(r => r.id === id ? { ...r, enabled } : r));
        setToast({
            message: `Rule ${enabled ? 'enabled' : 'disabled'} successfully`,
            type: 'success'
        });
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this rule?')) {
            setRules(rules.filter(r => r.id !== id));
            setToast({ message: 'Rule deleted successfully', type: 'success' });
        }
    };

    const handleSave = (rule: Rule) => {
        if (rules.find(r => r.id === rule.id)) {
            setRules(rules.map(r => r.id === rule.id ? rule : r));
            setToast({ message: `Rule '${rule.name}' updated successfully`, type: 'success' });
        } else {
            setRules([rule, ...rules]);
            setToast({ message: `Rule '${rule.name}' created successfully`, type: 'success' });
        }
        setShowModal(false);
        setEditingRule(null);
    };

    const filteredRules = rules.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.alertType.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Fleet Escalation Policy</h2>
                    <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest px-1 border-l-4 border-blue-600">
                        Admin Protocol Designer
                    </p>
                </div>

                <button
                    onClick={() => { setEditingRule(null); setShowModal(true); }}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 group"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    CREATE NEW RULE
                </button>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="flex-1 relative group max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search rules by name or source..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl text-sm font-medium transition-all outline-none"
                    />
                </div>
                <div className="ml-auto flex items-center gap-4">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
                                <div className="w-full h-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">AD</div>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                        Active Admins: <span className="text-blue-600">3</span>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredRules.map(rule => (
                    <RuleCard
                        key={rule.id}
                        rule={rule}
                        onEdit={() => { setEditingRule(rule); setShowModal(true); }}
                        onDelete={() => handleDelete(rule.id)}
                        onToggle={(enabled) => handleToggle(rule.id, enabled)}
                    />
                ))}
            </div>

            {showModal && (
                <RuleFormModal
                    rule={editingRule}
                    onClose={() => setShowModal(false)}
                    onSave={handleSave}
                />
            )}

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default EscalationRules;
