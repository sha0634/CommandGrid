import { Search, Bell, MessageSquare, ChevronDown } from 'lucide-react';

const TopBar = () => {
    return (
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-10 px-8 flex items-center justify-between">
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search by driver, alert ID, or vehicle..."
                        className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 rounded-lg py-2 pl-10 pr-4 text-sm transition-all outline-none border"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4 ml-8">
                <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg relative">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                </button>
                <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg">
                    <MessageSquare size={20} />
                </button>

                <div className="h-8 w-px bg-gray-200 mx-2"></div>

                <div className="flex items-center gap-3 pl-2 cursor-pointer group">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Admin User</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Fleet Manager</span>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 border-2 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold">
                        AU
                    </div>
                    <ChevronDown size={16} className="text-gray-400 group-hover:text-gray-600" />
                </div>
            </div>
        </header>
    );
};

export default TopBar;
