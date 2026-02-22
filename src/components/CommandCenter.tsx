import { useState, useEffect } from 'react';
import {
    AlertCircle,
    TrendingUp,
    Clock,
    CheckCircle2,
    ChevronUp,
    ChevronDown
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const mockSparklineData = [
    { value: 40 }, { value: 35 }, { value: 55 }, { value: 45 },
    { value: 60 }, { value: 50 }, { value: 75 }, { value: 65 },
    { value: 80 }, { value: 70 }, { value: 90 }, { value: 85 }
];

const SummaryCard = ({
    title,
    value,
    icon: Icon,
    color,
    description,
    trend,
    sparkData = mockSparklineData
}: {
    title: string,
    value: string | number,
    icon: any,
    color: string,
    description: string,
    trend?: { val: string, positive: boolean },
    sparkData?: { value: number }[]
}) => (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-2">
            <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
                <Icon className={`${color.replace('bg-', 'text-')}`} size={20} />
            </div>
            {trend && (
                <div className={`flex items-center text-xs font-bold ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
                    {trend.positive ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {trend.val}
                </div>
            )}
        </div>
        <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
        <div className="flex items-end justify-between">
            <div>
                <div className="text-2xl font-bold text-gray-900">{value}</div>
                <p className="text-xs text-gray-400 mt-1">{description}</p>
            </div>
            <div className="h-10 w-24">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sparkData}>
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={color.includes('blue') ? '#2563eb' : color.includes('red') ? '#ef4444' : color.includes('green') ? '#22c55e' : '#f59e0b'}
                            fill={color.includes('blue') ? '#dbeafe' : color.includes('red') ? '#fee2e2' : color.includes('green') ? '#dcfce7' : '#fef3c7'}
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
);

const CommandCenter = () => {
    const [stats, setStats] = useState({
        totalOpen: 1289,
        escalated: 78,
        autoClosed: 235,
        pending: 456
    });

    const [sparklines, setSparklines] = useState({
        total: [...mockSparklineData],
        escalated: [...mockSparklineData],
        auto: [...mockSparklineData],
        pending: [...mockSparklineData]
    });

    useEffect(() => {
        const interval = setInterval(() => {
            // Randomize main stats
            setStats(prev => ({
                ...prev,
                totalOpen: prev.totalOpen + Math.floor(Math.random() * 3) - 1,
                escalated: prev.escalated + (Math.random() > 0.8 ? 1 : 0),
                autoClosed: prev.autoClosed + Math.floor(Math.random() * 2),
            }));

            // Randomize sparklines (shift and add new point)
            setSparklines(prev => {
                const update = (data: typeof mockSparklineData) => {
                    const newData = [...data.slice(1)];
                    newData.push({ value: Math.floor(30 + Math.random() * 60) });
                    return newData;
                };
                return {
                    total: update(prev.total),
                    escalated: update(prev.escalated),
                    auto: update(prev.auto),
                    pending: update(prev.pending)
                };
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Command Center Overview</h2>
                    <p className="text-gray-500 text-sm mt-1">Real-time alert monitoring and system health</p>
                </div>
                <div className="flex gap-2">
                    <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        System Live
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard
                    title="Total Open"
                    value={stats.totalOpen.toLocaleString()}
                    icon={AlertCircle}
                    color="bg-blue-600"
                    description="Direct/CS Monitor"
                    trend={{ val: "12%", positive: true }}
                    sparkData={sparklines.total}
                />
                <SummaryCard
                    title="Escalated"
                    value={stats.escalated}
                    icon={TrendingUp}
                    color="bg-red-600"
                    description="Rules Driven"
                    trend={{ val: "5%", positive: false }}
                    sparkData={sparklines.escalated}
                />
                <SummaryCard
                    title="Auto-Closed Today"
                    value={stats.autoClosed}
                    icon={CheckCircle2}
                    color="bg-gray-600"
                    description="Until 11:30 PM"
                    sparkData={sparklines.auto}
                />
                <SummaryCard
                    title="Pending Resolution"
                    value={stats.pending}
                    icon={Clock}
                    color="bg-amber-600"
                    description="Next 12 Hours"
                    sparkData={sparklines.pending}
                />
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Severity Breakdown</h3>
                    <div className="flex gap-4 text-xs font-medium text-gray-500">
                        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Critical (15%)</div>
                        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Warning (35%)</div>
                        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Info (50%)</div>
                    </div>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full flex overflow-hidden">
                    <div className="bg-red-500 h-full transition-all duration-500" style={{ width: '15%' }}></div>
                    <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: '35%' }}></div>
                    <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: '50%' }}></div>
                </div>
            </div>
        </div>
    );
};

export default CommandCenter;
