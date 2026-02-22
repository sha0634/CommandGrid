import {
    BarChart2,
    LayoutDashboard,
    ShieldAlert,
    Activity,
    Settings,
    History,
    Users,
    X
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import SystemHealth from './SystemHealth';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const SidebarItem = ({
    icon: Icon,
    label,
    active = false,
    badge,
    onClick
}: {
    icon: any,
    label: string,
    active?: boolean,
    badge?: string,
    onClick?: () => void
}) => (
    <div
        onClick={onClick}
        className={cn(
            "flex items-center justify-between px-4 py-3 cursor-pointer transition-colors group",
            active ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
        )}
    >
        <div className="flex items-center gap-3">
            <Icon size={20} strokeWidth={1.5} />
            <span className="font-medium">{label}</span>
        </div>
        {badge && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {badge}
            </span>
        )}
    </div>
);

const Sidebar = ({
    currentView,
    onViewChange,
    isOpen,
    onClose
}: {
    currentView: string,
    onViewChange: (view: string) => void,
    isOpen: boolean,
    onClose: () => void
}) => {
    return (
        <div className={cn(
            "w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 shadow-2xl lg:shadow-none",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            <div className="p-6 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                        <ShieldAlert size={24} />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">Alert Dashboard</h1>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg lg:hidden text-gray-400 trasition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <nav className="flex-1 mt-4">
                <div className="mb-4">
                    <SidebarItem
                        icon={LayoutDashboard}
                        label="Overview"
                        active={currentView === 'overview'}
                        onClick={() => onViewChange('overview')}
                    />
                </div>

                <div className="px-4 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Main Menu
                </div>
                <SidebarItem
                    icon={History}
                    label="Alert History & Logs"
                    active={currentView === 'history'}
                    onClick={() => onViewChange('history')}
                />
                <SidebarItem
                    icon={BarChart2}
                    label="Analytics"
                    active={currentView === 'analytics'}
                    onClick={() => onViewChange('analytics')}
                />
                <SidebarItem
                    icon={Users}
                    label="Drivers"
                    active={currentView === 'drivers'}
                    onClick={() => onViewChange('drivers')}
                />
                <SidebarItem
                    icon={Activity}
                    label="System Health"
                    active={currentView === 'health'}
                    onClick={() => onViewChange('health')}
                />

                <div className="px-4 py-2 mt-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Admin
                </div>
                <SidebarItem
                    icon={ShieldAlert}
                    label="Escalation Rules"
                    active={currentView === 'escalation'}
                    onClick={() => onViewChange('escalation')}
                />
                <SidebarItem
                    icon={Settings}
                    label="Settings"
                    active={currentView === 'settings'}
                    onClick={() => onViewChange('settings')}
                />
            </nav>

            <div className="mt-auto">
                <SystemHealth isFullPage={false} />
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            JS
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">John Smith</p>
                            <p className="text-xs text-gray-500 truncate">Admin Account</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
