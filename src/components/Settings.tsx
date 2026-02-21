import { useState } from 'react';
import {
    User,
    Bell,
    Globe,
    Shield,
    Moon,
    Sun,
    Monitor,
    Smartphone,
    Lock,
    Camera,
    Check,
    AlertCircle,
    History,
    LayoutDashboard,
    LogOut,
    AlertTriangle,
    CheckCircle2
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type SettingsTab = 'profile' | 'notifications' | 'regional' | 'security';

interface UserSettings {
    name: string;
    email: string;
    role: string;
    theme: 'light' | 'dark' | 'system';
    density: 'compact' | 'comfortable';
    landingPage: 'overview' | 'history';
    notifications: {
        critical: { toast: boolean; email: boolean; push: boolean };
        warning: { toast: boolean; email: boolean; push: boolean };
        info: { toast: boolean; email: boolean; push: boolean };
    };
    quietHours: { enabled: boolean; start: string; end: string };
    timezone: string;
    language: string;
    units: 'metric' | 'imperial';
}

const initialSettings: UserSettings = {
    name: 'John Smith',
    email: 'john.smith@fleet-corp.com',
    role: 'Senior Dispatcher (Admin)',
    theme: 'system',
    density: 'comfortable',
    landingPage: 'overview',
    notifications: {
        critical: { toast: true, email: true, push: true },
        warning: { toast: true, email: true, push: false },
        info: { toast: false, email: false, push: false },
    },
    quietHours: { enabled: false, start: '22:00', end: '06:00' },
    timezone: 'UTC+5:30 (Mumbai)',
    language: 'English (US)',
    units: 'metric',
};

const Settings = () => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
    const [settings, setSettings] = useState<UserSettings>(initialSettings);
    const [isDirty, setIsDirty] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const handleUpdate = (updates: Partial<UserSettings>) => {
        setSettings(prev => ({ ...prev, ...updates }));
        setIsDirty(true);
    };

    const handleSave = () => {
        setIsDirty(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleCancel = () => {
        setSettings(initialSettings);
        setIsDirty(false);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-24">
            <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Account Settings</h2>
                    <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest px-1 border-l-4 border-blue-600">
                        Preferences & Platform Configuration
                    </p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-64 shrink-0 space-y-1">
                    <NavBtn active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={User} label="Profile & Theme" />
                    <NavBtn active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} icon={Bell} label="Notifications" />
                    <NavBtn active={activeTab === 'regional'} onClick={() => setActiveTab('regional')} icon={Globe} label="Regional & Units" />
                    <NavBtn active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={Shield} label="Security" />
                </div>

                {/* Content Area */}
                <div className="flex-1 space-y-8">
                    {activeTab === 'profile' && <ProfileSection settings={settings} onUpdate={handleUpdate} />}
                    {activeTab === 'notifications' && <NotificationsSection settings={settings} onUpdate={handleUpdate} />}
                    {activeTab === 'regional' && <RegionalSection settings={settings} onUpdate={handleUpdate} />}
                    {activeTab === 'security' && <SecuritySection />}
                </div>
            </div>

            {/* Sticky Footer */}
            {isDirty && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 animate-in slide-in-from-bottom-8 duration-500 z-50">
                    <div className="bg-white border border-gray-100 shadow-2xl rounded-3xl p-4 flex items-center justify-between backdrop-blur-md bg-white/90">
                        <div className="flex items-center gap-4 ml-4">
                            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
                                <AlertCircle size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Awaiting Approval</p>
                                <p className="text-sm font-bold text-gray-900">You have unsaved changes</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleCancel}
                                className="px-6 py-2.5 text-sm font-black text-gray-500 hover:text-gray-700 transition-colors uppercase tracking-widest"
                            >
                                Reset
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-8 py-3 bg-blue-600 text-white text-sm font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all uppercase tracking-widest"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Toast */}
            {showToast && (
                <div className="fixed top-8 right-8 animate-in slide-in-from-right-10 duration-300 z-[100]">
                    <div className="bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
                        <Check size={20} />
                        <span className="text-sm font-black uppercase tracking-widest">Settings updated successfully</span>
                    </div>
                </div>
            )}
        </div>
    );
};

const NavBtn = ({ active, onClick, icon: Icon, label }: any) => (
    <button
        onClick={onClick}
        className={cn(
            "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm",
            active
                ? "bg-blue-600 text-white shadow-xl shadow-blue-100 translate-x-1"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
        )}
    >
        <Icon size={18} strokeWidth={active ? 2.5 : 2} />
        {label}
    </button>
);

const SectionHeader = ({ title, sub }: { title: string, sub: string }) => (
    <div className="mb-6">
        <h3 className="text-xl font-black text-gray-900 tracking-tight">{title}</h3>
        <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">{sub}</p>
    </div>
);

const ProfileSection = ({ settings, onUpdate }: { settings: UserSettings, onUpdate: any }) => (
    <div className="space-y-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <SectionHeader title="Profile Core" sub="Basic Account Information" />
            <div className="flex flex-col md:flex-row gap-10 items-start">
                <div className="relative group shrink-0">
                    <div className="w-24 h-24 rounded-3xl bg-blue-50 border-2 border-blue-100 flex items-center justify-center text-blue-600 font-black text-3xl shadow-inner group-hover:scale-105 transition-transform duration-300">
                        JS
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-gray-100 text-gray-400 hover:text-blue-600 transition-colors">
                        <Camera size={16} />
                    </button>
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Display Name</label>
                        <input
                            type="text"
                            value={settings.name}
                            onChange={e => onUpdate({ name: e.target.value })}
                            className="w-full px-5 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none font-bold text-gray-900"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                        <input
                            type="email"
                            value={settings.email}
                            onChange={e => onUpdate({ email: e.target.value })}
                            className="w-full px-5 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none font-bold text-gray-900"
                        />
                    </div>
                    <div className="space-y-2 col-span-full">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">System Role</label>
                        <div className="px-5 py-3 bg-gray-100 border border-gray-200 rounded-2xl font-black text-gray-500 text-sm cursor-not-allowed">
                            {settings.role}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
                <SectionHeader title="Interface Theme" sub="Visual platform mode" />
                <div className="flex gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                    {[
                        { id: 'light', icon: Sun, label: 'Light' },
                        { id: 'dark', icon: Moon, label: 'Dark' },
                        { id: 'system', icon: Monitor, label: 'Auto' }
                    ].map(t => (
                        <button
                            key={t.id}
                            onClick={() => onUpdate({ theme: t.id as any })}
                            className={cn(
                                "flex-1 flex flex-col items-center gap-2 py-3 rounded-xl transition-all",
                                settings.theme === t.id ? "bg-white text-blue-600 shadow-xl shadow-blue-50 font-black" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            <t.icon size={20} />
                            <span className="text-[10px] uppercase tracking-widest">{t.label}</span>
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <SectionHeader title="View Density" sub="Interface scaling" />
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <button
                            onClick={() => onUpdate({ density: 'compact' })}
                            className={cn(
                                "flex-1 px-4 py-3 rounded-2xl border transition-all text-xs font-black uppercase tracking-widest",
                                settings.density === 'compact' ? "bg-blue-50 border-blue-600 text-blue-600" : "bg-white border-gray-100 text-gray-400"
                            )}
                        >
                            Compact
                        </button>
                        <button
                            onClick={() => onUpdate({ density: 'comfortable' })}
                            className={cn(
                                "flex-1 px-4 py-3 rounded-2xl border transition-all text-xs font-black uppercase tracking-widest",
                                settings.density === 'comfortable' ? "bg-blue-50 border-blue-600 text-blue-600" : "bg-white border-gray-100 text-gray-400"
                            )}
                        >
                            Comfortable
                        </button>
                    </div>
                    <p className="text-[10px] text-gray-400 italic">Reduces vertical spacing in tables and feed logs.</p>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <SectionHeader title="Entry Point" sub="Default Post-Login Route" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    onClick={() => onUpdate({ landingPage: 'overview' })}
                    className={cn(
                        "flex items-center justify-between p-4 rounded-2xl border transition-all group",
                        settings.landingPage === 'overview' ? "bg-blue-50/50 border-blue-600 ring-4 ring-blue-50" : "bg-white border-gray-100 hover:border-gray-200"
                    )}
                >
                    <div className="flex items-center gap-4 text-left">
                        <div className={cn("p-2.5 rounded-xl transition-colors", settings.landingPage === 'overview' ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-400 group-hover:bg-gray-100")}>
                            <LayoutDashboard size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Command Center</p>
                            <p className="text-[11px] font-medium text-gray-400">Live fleet summary and telemetry</p>
                        </div>
                    </div>
                    <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center", settings.landingPage === 'overview' ? "bg-blue-600 border-blue-600" : "border-gray-200")}>
                        {settings.landingPage === 'overview' && <Check size={12} className="text-white" />}
                    </div>
                </button>
                <button
                    onClick={() => onUpdate({ landingPage: 'history' })}
                    className={cn(
                        "flex items-center justify-between p-4 rounded-2xl border transition-all group",
                        settings.landingPage === 'history' ? "bg-blue-50/50 border-blue-600 ring-4 ring-blue-50" : "bg-white border-gray-100 hover:border-gray-200"
                    )}
                >
                    <div className="flex items-center gap-4 text-left">
                        <div className={cn("p-2.5 rounded-xl transition-colors", settings.landingPage === 'history' ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-400 group-hover:bg-gray-100")}>
                            <History size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Alert History</p>
                            <p className="text-[11px] font-medium text-gray-400">Archived audit logs and lookup</p>
                        </div>
                    </div>
                    <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center", settings.landingPage === 'history' ? "bg-blue-600 border-blue-600" : "border-gray-200")}>
                        {settings.landingPage === 'history' && <Check size={12} className="text-white" />}
                    </div>
                </button>
            </div>
        </div>
    </div>
);

const NotificationsSection = ({ settings, onUpdate }: { settings: UserSettings, onUpdate: any }) => (
    <div className="space-y-6">
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="p-8 pb-0">
                <SectionHeader title="Routing Matrix" sub="Channel Dispatch Logic" />
            </div>
            <table className="w-full text-left border-collapse mt-4">
                <thead>
                    <tr className="bg-gray-50 border-y border-gray-100">
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Severity Level</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">In-App Toast</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Email</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">SMS/Push</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {['critical', 'warning', 'info'].map((lvl: any) => (
                        <tr key={lvl} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-8 py-6">
                                <span className={cn(
                                    "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
                                    lvl === 'critical' ? "bg-red-50 text-red-600 border-red-100" :
                                        lvl === 'warning' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                            "bg-blue-50 text-blue-600 border-blue-100"
                                )}>
                                    {lvl}
                                </span>
                            </td>
                            {['toast', 'email', 'push'].map((chan: any) => (
                                <td key={chan} className="px-8 py-6 text-center">
                                    <button
                                        onClick={() => onUpdate({
                                            notifications: {
                                                ...settings.notifications,
                                                [lvl]: { ...settings.notifications[lvl as keyof typeof settings.notifications], [chan]: !settings.notifications[lvl as keyof typeof settings.notifications][chan as 'toast' | 'email' | 'push'] }
                                            }
                                        })}
                                        className={cn(
                                            "w-10 h-5 rounded-full transition-all duration-300 relative mx-auto",
                                            (settings.notifications[lvl as keyof typeof settings.notifications] as any)[chan] ? "bg-blue-600" : "bg-gray-200"
                                        )}
                                    >
                                        <div className={cn(
                                            "absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-300",
                                            (settings.notifications[lvl as keyof typeof settings.notifications] as any)[chan] ? "translate-x-5" : "translate-x-0"
                                        )} />
                                    </button>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <SectionHeader title="Protocol Silencing" sub="Managed quiet hours" />
                <button
                    onClick={() => onUpdate({ quietHours: { ...settings.quietHours, enabled: !settings.quietHours.enabled } })}
                    className={cn(
                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        settings.quietHours.enabled ? "bg-blue-600 text-white shadow-lg" : "bg-gray-100 text-gray-400"
                    )}
                >
                    {settings.quietHours.enabled ? 'Enabled' : 'Disabled'}
                </button>
            </div>
            <div className={cn("grid grid-cols-2 gap-10 transition-opacity duration-300", !settings.quietHours.enabled && "opacity-30 pointer-events-none")}>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Begin Silence</label>
                    <input
                        type="time"
                        value={settings.quietHours.start}
                        onChange={e => onUpdate({ quietHours: { ...settings.quietHours, start: e.target.value } })}
                        className="w-full px-5 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none font-bold text-gray-900"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Resume Protocol</label>
                    <input
                        type="time"
                        value={settings.quietHours.end}
                        onChange={e => onUpdate({ quietHours: { ...settings.quietHours, end: e.target.value } })}
                        className="w-full px-5 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none font-bold text-gray-900"
                    />
                </div>
                <p className="col-span-full text-[10px] text-amber-600 font-bold uppercase tracking-tight flex items-center gap-2">
                    <AlertTriangle size={14} /> Critical escalations bypass quiet hour restrictions by default.
                </p>
            </div>
        </div>
    </div>
);

const RegionalSection = ({ settings, onUpdate }: { settings: UserSettings, onUpdate: any }) => (
    <div className="space-y-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
                <SectionHeader title="Geography" sub="Regional preferences" />
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">System Timezone</label>
                        <select
                            value={settings.timezone}
                            onChange={e => onUpdate({ timezone: e.target.value })}
                            className="w-full px-5 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none font-bold text-gray-900 appearance-none"
                        >
                            <option>UTC-5:00 (New York)</option>
                            <option>UTC+0:00 (London)</option>
                            <option>UTC+5:30 (Mumbai)</option>
                            <option>UTC+8:00 (Singapore)</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Display Language</label>
                        <select
                            value={settings.language}
                            onChange={e => onUpdate({ language: e.target.value })}
                            className="w-full px-5 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none font-bold text-gray-900 appearance-none"
                        >
                            <option>English (US)</option>
                            <option>Spanish (ES)</option>
                            <option>German (DE)</option>
                            <option>Japanese (JP)</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="space-y-6">
                <SectionHeader title="Telemetry Units" sub="Measurement systems" />
                <div className="space-y-6">
                    <div className="flex gap-4 p-2 bg-gray-50 rounded-2xl border border-gray-100">
                        <button
                            onClick={() => onUpdate({ units: 'metric' })}
                            className={cn(
                                "flex-1 py-3 rounded-xl transition-all text-[11px] font-black uppercase tracking-widest",
                                settings.units === 'metric' ? "bg-white text-blue-600 shadow-xl shadow-blue-50" : "text-gray-400"
                            )}
                        >
                            Metric (km/h)
                        </button>
                        <button
                            onClick={() => onUpdate({ units: 'imperial' })}
                            className={cn(
                                "flex-1 py-3 rounded-xl transition-all text-[11px] font-black uppercase tracking-widest",
                                settings.units === 'imperial' ? "bg-white text-blue-600 shadow-xl shadow-blue-50" : "text-gray-400"
                            )}
                        >
                            Imperial (mph)
                        </button>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                        <p className="text-[11px] font-bold text-blue-600 leading-relaxed">
                            Measurement updates will propagate to the Alert Drill-Down Modal and Driver Performance rankings immediately.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const SecuritySection = () => (
    <div className="space-y-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <SectionHeader title="Credential Management" sub="Secure password rotation" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-5 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none font-bold text-gray-900" />
                </div>
                <div className="space-y-2 col-start-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                    <input type="password" placeholder="Min 12 characters" className="w-full px-5 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none font-bold text-gray-900" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-5 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none font-bold text-gray-900" />
                </div>
                <div className="absolute right-0 top-0 w-1/3 h-full hidden md:flex items-center justify-center p-6 border-l border-gray-50">
                    <div className="text-center">
                        <Lock size={32} className="text-gray-200 mx-auto mb-3" />
                        <p className="text-[11px] font-black text-gray-300 uppercase tracking-tighter shrink-0">Security Grade: Strong</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <SectionHeader title="Active Sessions" sub="Live device monitoring" />
                <button className="px-5 py-2.5 bg-red-50 text-red-600 text-[10px] font-black rounded-xl hover:bg-red-100 transition-all uppercase tracking-widest">
                    Terminate All Others
                </button>
            </div>
            <div className="space-y-3">
                {[
                    { device: 'MacBook Pro (Chrome)', loc: 'Mumbai, India', active: true, icon: Monitor },
                    { device: 'iPhone 15 (Mobile App)', loc: 'Mumbai, India', active: false, icon: Smartphone }
                ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-white rounded-xl text-gray-400 shadow-sm">
                                <s.icon size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-gray-900 tracking-tight">{s.device}</p>
                                <p className="text-[11px] font-medium text-gray-400">{s.loc} • {s.active ? 'Active Now' : '2 hours ago'}</p>
                            </div>
                        </div>
                        {s.active ? (
                            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest px-3 py-1 bg-green-50 rounded-lg">Current</span>
                        ) : (
                            <button className="text-gray-400 hover:text-red-500 transition-colors p-2">
                                <LogOut size={16} />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 shadow-2xl overflow-hidden relative group">
            <Shield size={120} className="absolute -right-8 -bottom-8 text-white/10 rotate-12 transition-transform duration-700 group-hover:rotate-0" />
            <div className="relative z-10 max-w-lg">
                <h3 className="text-2xl font-black text-white tracking-tight mb-2">Two-Factor Auth (2FA)</h3>
                <p className="text-blue-100 font-medium leading-relaxed mb-6">
                    Add an extra layer of security to your dispatcher credentials. We'll ask for a secondary code when you log in from a new command terminal.
                </p>
                <div className="flex items-center gap-4">
                    <button className="px-8 py-3 bg-white text-blue-600 font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
                        Configure 2FA
                    </button>
                    <div className="flex items-center gap-2 text-blue-100/60 font-bold text-[11px] uppercase tracking-tighter">
                        <CheckCircle2 size={14} /> Multi-device Supported
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default Settings;
