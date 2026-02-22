import { useState } from 'react';
import { ExternalLink, MoreVertical, RefreshCw, User } from 'lucide-react';

const DriverCard = ({
    name,
    vehicleId,
    alertCount,
    recentAlert,
    image,
    onViewAll
}: {
    name: string,
    vehicleId: string,
    alertCount: number,
    recentAlert: string,
    image?: string,
    onViewAll: () => void
}) => {
    const [imgError, setImgError] = useState(!image);

    return (
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative">
            <div className="absolute top-4 right-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical size={16} />
            </div>

            <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                    {imgError ? (
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border-2 border-white shadow-sm">
                            <User size={24} />
                        </div>
                    ) : (
                        <img
                            src={image}
                            alt={name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                            onError={() => setImgError(true)}
                        />
                    )}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center">
                        <span className="text-[8px] text-white font-bold">!</span>
                    </div>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 leading-tight">{name}</h4>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{vehicleId}</p>
                </div>
            </div>

            <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Alerts:</span>
                    <span className="font-bold text-red-600">{alertCount} <span className="text-xs text-gray-400 font-normal ml-0.5">Critical</span></span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 text-xs">Recent:</span>
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded-md text-[10px] font-bold uppercase tracking-wide">
                        {recentAlert}
                    </span>
                </div>
            </div>

            <button
                onClick={onViewAll}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
                View All Alerts
                <ExternalLink size={14} />
            </button>
        </div>
    );
};

const Leaderboard = ({
    onNavigateToHistory,
    onViewTrends
}: {
    onNavigateToHistory: (filter: string) => void,
    onViewTrends: () => void
}) => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [drivers] = useState([
        { name: "John Smith", vehicleId: "V-101 (ID: V-101)", alertCount: 5, recentAlert: "Speeding", image: "https://api.uifaces.co/our-content/donated/x4_8_B9y.jpg" },
        { name: "Maria Rodriguez", vehicleId: "V-2015", alertCount: 12, recentAlert: "Speeding", image: "https://api.uifaces.co/our-content/donated/v_8_B9y.jpg" },
        { name: "Ahmed Khan", vehicleId: "V-305", alertCount: 3, recentAlert: "Speeding", image: "https://api.uifaces.co/our-content/donated/6f_8_B9y.jpg" },
        { name: "David Green", vehicleId: "V-205 28", alertCount: 8, recentAlert: "Speeding", image: "https://api.uifaces.co/our-content/donated/g_8_B9y.jpg" },
        { name: "Samuel Oak", vehicleId: "V-509", alertCount: 2, recentAlert: "Speeding" },
    ]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        // We just toggle the animation briefly to provide visual feedback
        // Data stays the same as per user request (no randomization/delay)
        setTimeout(() => setIsRefreshing(false), 600);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-900">Top Offenders Leaderboard</h2>
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className={`p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all ${isRefreshing ? 'animate-spin text-blue-600 bg-blue-50' : ''}`}
                    >
                        <RefreshCw size={14} />
                    </button>
                </div>
                <button
                    onClick={onViewTrends}
                    className="text-sm font-bold text-blue-600 hover:underline"
                >
                    View All Trends
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {drivers.map((driver, idx) => (
                    <DriverCard
                        key={idx}
                        {...driver}
                        onViewAll={() => onNavigateToHistory(driver.name)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;
