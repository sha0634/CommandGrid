import { useState, useRef, useEffect } from 'react';
import { Search, Bell, MessageSquare, ChevronDown, Menu, User, ShieldAlert, Cpu } from 'lucide-react';
import { drivers, alerts, rules } from '../dataRepository';

const TopBar = ({ onMenuClick, onNavigate }: { onMenuClick: () => void, onNavigate: (view: string) => void }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{ category: string, items: any[] }[]>([]);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (val: string) => {
        setQuery(val);
        if (val.length < 2) {
            setResults([]);
            setShowResults(false);
            return;
        }

        const filteredDrivers = drivers.filter(d =>
            d.name.toLowerCase().includes(val.toLowerCase()) ||
            d.employeeId.toLowerCase().includes(val.toLowerCase()) ||
            d.vehicleId.toLowerCase().includes(val.toLowerCase())
        ).slice(0, 3);

        const filteredAlerts = alerts.filter(a =>
            a.id.toLowerCase().includes(val.toLowerCase()) ||
            a.driverName.toLowerCase().includes(val.toLowerCase()) ||
            a.vehicleId.toLowerCase().includes(val.toLowerCase())
        ).slice(0, 3);

        const filteredRules = rules.filter(r =>
            r.name.toLowerCase().includes(val.toLowerCase())
        ).slice(0, 3);

        const newResults = [];
        if (filteredDrivers.length > 0) newResults.push({ category: 'Drivers', items: filteredDrivers });
        if (filteredAlerts.length > 0) newResults.push({ category: 'Active Alerts', items: filteredAlerts });
        if (filteredRules.length > 0) newResults.push({ category: 'Escalation Rules', items: filteredRules });

        setResults(newResults);
        setShowResults(true);
    };

    const handleResultClick = (category: string) => {
        const viewMap: Record<string, string> = {
            'Drivers': 'drivers',
            'Active Alerts': 'overview',
            'Escalation Rules': 'escalation'
        };
        onNavigate(viewMap[category]);
        setShowResults(false);
        setQuery('');
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 max-w-xl relative" ref={searchRef}>
                <button
                    onClick={onMenuClick}
                    className="p-2 hover:bg-gray-50 rounded-xl text-gray-500 lg:hidden transition-all active:scale-95"
                >
                    <Menu size={24} />
                </button>
                <div className="relative group flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => handleSearch(e.target.value)}
                        onFocus={() => query.length >= 2 && setShowResults(true)}
                        placeholder="Search drivers, alerts, or vehicles..."
                        className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 rounded-lg py-2 pl-10 pr-4 text-sm transition-all outline-none border"
                    />
                </div>

                {/* Search Results Dropdown */}
                {showResults && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200 z-[100]">
                        {results.length > 0 ? (
                            <div className="max-h-[400px] overflow-y-auto">
                                {results.map((res, i) => (
                                    <div key={res.category} className={i !== 0 ? 'border-t border-gray-50' : ''}>
                                        <div className="px-4 py-2 bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            {res.category === 'Drivers' && <User size={12} />}
                                            {res.category === 'Active Alerts' && <ShieldAlert size={12} />}
                                            {res.category === 'Escalation Rules' && <Cpu size={12} />}
                                            {res.category}
                                        </div>
                                        {res.items.map((item: any) => (
                                            <button
                                                key={item.id}
                                                onClick={() => handleResultClick(res.category)}
                                                className="w-full px-4 py-3 flex items-center justify-between hover:bg-blue-50 group transition-colors text-left"
                                            >
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                        {item.name || item.id}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 font-medium">
                                                        {item.employeeId || item.driverName || item.alertType} • {item.vehicleId || 'System'}
                                                    </p>
                                                </div>
                                                <div className="text-[10px] font-black text-blue-500 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Jump to View
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="px-8 py-12 text-center">
                                <Search size={32} className="text-gray-200 mx-auto mb-3" />
                                <p className="text-sm font-bold text-gray-400 tracking-tight">No results found for "{query}"</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 md:gap-4 ml-4">
                <div className="hidden md:flex items-center gap-2">
                    <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg relative">
                        <Bell size={20} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                    </button>
                    <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg">
                        <MessageSquare size={20} />
                    </button>
                </div>

                <div className="hidden sm:block h-8 w-px bg-gray-200 mx-1 md:mx-2 text-transparent">|</div>

                <div className="flex items-center gap-2 md:gap-3 pl-2 cursor-pointer group">
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate max-w-[100px]">John Smith</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Admin</span>
                    </div>
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 border-2 border-white shadow-sm flex items-center justify-center text-white text-[10px] md:text-xs font-bold shrink-0">
                        JS
                    </div>
                    <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 hidden sm:block" />
                </div>
            </div>
        </header>
    );
};

export default TopBar;
