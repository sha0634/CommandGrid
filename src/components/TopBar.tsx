import { Search, Bell, MessageSquare, ChevronDown, Menu } from 'lucide-react';

const TopBar = ({ onMenuClick }: { onMenuClick: () => void }) => {
    return (
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 max-w-xl">
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
                        placeholder="Search..."
                        className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 rounded-lg py-2 pl-10 pr-4 text-sm transition-all outline-none border"
                    />
                </div>
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
