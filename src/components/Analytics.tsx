import { useState, useEffect } from 'react';
import {
    Calendar,
    RefreshCcw,
    Download
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    LabelList
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const trendDataDaily = [
    { name: 'Mon', Total: 120, Escalated: 24, AutoClosed: 45, Resolved: 35 },
    { name: 'Tue', Total: 150, Escalated: 32, AutoClosed: 52, Resolved: 48 },
    { name: 'Wed', Total: 180, Escalated: 41, AutoClosed: 89, Resolved: 22 },
    { name: 'Thu', Total: 140, Escalated: 18, AutoClosed: 34, Resolved: 76 },
    { name: 'Fri', Total: 210, Escalated: 55, AutoClosed: 67, Resolved: 68 },
    { name: 'Sat', Total: 90, Escalated: 12, AutoClosed: 40, Resolved: 31 },
    { name: 'Sun', Total: 110, Escalated: 15, AutoClosed: 38, Resolved: 45 },
];

const trendDataWeekly = [
    { name: 'Week 1', Total: 850, Escalated: 210, AutoClosed: 340, Resolved: 250 },
    { name: 'Week 2', Total: 1100, Escalated: 320, AutoClosed: 420, Resolved: 310 },
    { name: 'Week 3', Total: 980, Escalated: 180, AutoClosed: 510, Resolved: 220 },
    { name: 'Week 4', Total: 1250, Escalated: 410, AutoClosed: 390, Resolved: 400 },
];

const severityData = [
    { name: 'Critical', value: 420, color: '#EF4444' },
    { name: 'Warning', value: 310, color: '#F59E0B' },
    { name: 'Info', value: 520, color: '#3B82F6' },
];

const sourceData = [
    { name: 'Telematics', value: 850 },
    { name: 'Compliance', value: 540 },
    { name: 'Engine Diag', value: 420 },
    { name: 'Sensors', value: 310 },
    { name: 'Safety', value: 180 },
].sort((a, b) => b.value - a.value);

const ChartCard = ({
    title,
    children,
    loading = false,
    className
}: {
    title: string;
    children: React.ReactNode;
    loading?: boolean;
    className?: string;
}) => (
    <div className={cn("bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative flex flex-col", className)}>
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">{title}</h3>
            <button className="text-gray-400 hover:text-blue-600 transition-colors">
                <Download size={16} />
            </button>
        </div>
        <div className="flex-1 min-h-[300px]">
            {loading ? (
                <div className="h-full flex flex-col items-center justify-center gap-3">
                    <RefreshCcw size={32} className="text-blue-600 animate-spin" />
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Syncing Reality...</p>
                </div>
            ) : children}
        </div>
    </div>
);

const Analytics = () => {
    const [dateRange, setDateRange] = useState('Last 7 Days');
    const [viewType, setViewType] = useState<'Daily' | 'Weekly'>('Daily');
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Move statistics to state for real-time updates
    const [dailyData, setDailyData] = useState(trendDataDaily);
    const [weeklyData, setWeeklyData] = useState(trendDataWeekly);

    // Randomization Engine
    const randomizeData = () => {
        setDailyData(prev => prev.map(item => ({
            ...item,
            Total: Math.floor(100 + Math.random() * 150),
            Escalated: Math.floor(10 + Math.random() * 50),
            Resolved: Math.floor(20 + Math.random() * 80),
            AutoClosed: Math.floor(15 + Math.random() * 60)
        })));

        setWeeklyData(prev => prev.map(item => ({
            ...item,
            Total: Math.floor(800 + Math.random() * 500),
            Escalated: Math.floor(150 + Math.random() * 300),
            Resolved: Math.floor(200 + Math.random() * 400),
            AutoClosed: Math.floor(180 + Math.random() * 350)
        })));
    };

    const handleRefresh = () => {
        setRefreshing(true);
        setLoading(true);
        setTimeout(() => {
            randomizeData(); // Update with new random values
            setLoading(false);
            setRefreshing(false);
        }, 1200);
    };

    // Simulated real-time trickle
    useEffect(() => {
        const interval = setInterval(() => {
            if (!loading && !refreshing) {
                // Periodically update the last couple of data points to simulate "arriving" data
                setDailyData(prev => {
                    const newData = [...prev];
                    const lastIdx = newData.length - 1;
                    newData[lastIdx] = {
                        ...newData[lastIdx],
                        Total: newData[lastIdx].Total + (Math.random() > 0.5 ? 2 : -1)
                    };
                    return newData;
                });
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [loading, refreshing]);

    useEffect(() => {
        // Reduced delay for better UX
        const timer = setTimeout(() => setLoading(false), 100);
        return () => clearTimeout(timer);
    }, [dateRange, viewType]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Toolbar */}
            <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Intelligence & Analytics</h2>
                    <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest px-1 border-l-4 border-blue-600">
                        Operational Performance Dashboard
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 px-3 py-2 border-r border-gray-100">
                        <Calendar size={18} className="text-gray-400" />
                        <select
                            className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer"
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                        >
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>Custom Range</option>
                        </select>
                    </div>
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 group active:scale-95"
                    >
                        <RefreshCcw size={16} className={cn("transition-transform duration-700", refreshing && "rotate-180")} />
                        Refresh Data
                    </button>
                </div>
            </div>

            {/* Primary Analysis: Trend Over Time */}
            <ChartCard title="Alert Activity Trends" loading={loading} className="w-full">
                <div className="absolute top-6 right-16 flex items-center gap-3">
                    <div className="bg-gray-100 p-1 rounded-lg flex">
                        <button
                            onClick={() => setViewType('Daily')}
                            className={cn("px-4 py-1.5 text-[10px] font-black rounded-md transition-all", viewType === 'Daily' ? "bg-white text-gray-900 shadow-md scale-105" : "text-gray-400 hover:text-gray-600")}
                        >
                            DAILY
                        </button>
                        <button
                            onClick={() => setViewType('Weekly')}
                            className={cn("px-4 py-1.5 text-[10px] font-black rounded-md transition-all", viewType === 'Weekly' ? "bg-white text-gray-900 shadow-md scale-105" : "text-gray-400 hover:text-gray-600")}
                        >
                            WEEKLY
                        </button>
                    </div>
                </div>

                <div className="w-full h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={viewType === 'Daily' ? dailyData : weeklyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#FFFFFF',
                                    border: 'none',
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}
                            />
                            <Legend
                                verticalAlign="top"
                                align="left"
                                iconType="circle"
                                wrapperStyle={{ top: -10, left: 0, paddingBottom: 20 }}
                                formatter={(value) => <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{value}</span>}
                            />
                            <Area type="monotone" dataKey="Total" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                            <Area type="monotone" dataKey="Escalated" stroke="#EF4444" strokeWidth={2} fillOpacity={0} />
                            <Area type="monotone" dataKey="AutoClosed" stroke="#94A3B8" strokeWidth={2} fillOpacity={0} />
                            <Area type="monotone" dataKey="Resolved" stroke="#10B981" strokeWidth={2} fillOpacity={0} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </ChartCard>

            {/* Sub-Visuals: Distribution Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Column 1: Severity Pie */}
                <ChartCard title="Alerts by Severity" loading={loading}>
                    <div className="w-full h-[300px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={severityData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {severityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend
                                    verticalAlign="middle"
                                    align="right"
                                    layout="vertical"
                                    formatter={(value) => <span className="text-[10px] font-bold text-gray-500 uppercase">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-14">
                            <span className="text-2xl font-black text-gray-900">1,250</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Alerts</span>
                        </div>
                    </div>
                </ChartCard>

                {/* Column 2: Source Bar */}
                <ChartCard title="Alerts by Source Module" loading={loading}>
                    <div className="w-full h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={sourceData}
                                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                            >
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#475569' }}
                                />
                                <Tooltip cursor={{ fill: '#F8FAFC' }} />
                                <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20}>
                                    <LabelList
                                        dataKey="value"
                                        position="right"
                                        style={{ fontSize: 10, fontWeight: 900, fill: '#3B82F6' }}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>
            </div>
        </div>
    );
};

export default Analytics;
