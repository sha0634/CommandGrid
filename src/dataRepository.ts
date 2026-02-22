export interface Alert {
    id: string;
    asset: string;
    sourceType: string;
    severity: 'Critical' | 'Warning' | 'Info';
    status: 'OPEN' | 'ESCALATED' | 'AUTO-CLOSED' | 'RESOLVED';
    timestamp: string;
    driverName: string;
    vehicleId: string;
}

export interface Driver {
    id: string;
    name: string;
    employeeId: string;
    vehicleId: string;
    totalAlerts: number;
    riskLevel: 'Low' | 'Medium' | 'High';
    safetyScore: number;
    status: 'Active' | 'On-Duty' | 'Inactive';
    activeAlerts: number;
    recentAlertType: string;
    recentLogs: { type: string; timestamp: string; severity: 'Critical' | 'Warning' | 'Info' }[];
}

export interface Rule {
    id: string;
    name: string;
    alertType: string;
    action: string;
    enabled: boolean;
}

export const alerts: Alert[] = [
    { id: '#A-001', asset: 'Vehicle', sourceType: 'Critical', severity: 'Critical', status: 'OPEN', timestamp: '2024-10-26 09:30', driverName: 'John Smith', vehicleId: 'V-101' },
    { id: '#A-003', asset: 'Vehicle', sourceType: 'ESCALATED', severity: 'Critical', status: 'ESCALATED', timestamp: '2024-10-26 09:25', driverName: 'Maria Rodriguez', vehicleId: 'V-2015' },
    { id: '#A-004', asset: 'Asset Tracker', sourceType: 'Critical', severity: 'Info', status: 'AUTO-CLOSED', timestamp: '2024-10-26 09:20', driverName: 'Ahmed Khan', vehicleId: 'V-305' },
    { id: '#A-005', asset: 'Sensor', sourceType: 'Tire Pressure Low', severity: 'Warning', status: 'RESOLVED', timestamp: '2024-10-26 09:15', driverName: 'David Green', vehicleId: 'V-205' },
    { id: '#A-006', asset: 'Vehicle', sourceType: 'Tire Pressure Low', severity: 'Critical', status: 'OPEN', timestamp: '2024-10-26 09:10', driverName: 'John Smith', vehicleId: 'V-101' },
    { id: '#A-007', asset: 'Asset Tracker', sourceType: 'Critical', severity: 'Info', status: 'OPEN', timestamp: '2024-10-26 09:05', driverName: 'Maria Rodriguez', vehicleId: 'V-2015' },
];

export const drivers: Driver[] = [
    {
        id: 'D-001',
        name: 'Maria Rodriguez',
        employeeId: 'EMP-1204',
        vehicleId: 'V-101',
        totalAlerts: 142,
        riskLevel: 'High',
        safetyScore: 68,
        status: 'On-Duty',
        activeAlerts: 4,
        recentAlertType: 'Overspeeding',
        recentLogs: [
            { type: 'Overspeeding (78/55 mph)', timestamp: '10 mins ago', severity: 'Critical' },
            { type: 'Harsh Braking', timestamp: '1 hour ago', severity: 'Warning' },
            { type: 'Lane Departure', timestamp: '2 hours ago', severity: 'Info' }
        ]
    },
    {
        id: 'D-002',
        name: 'James Wilson',
        employeeId: 'EMP-1192',
        vehicleId: 'V-204',
        totalAlerts: 24,
        riskLevel: 'Low',
        safetyScore: 96,
        status: 'Active',
        activeAlerts: 0,
        recentAlertType: 'None',
        recentLogs: [
            { type: 'System Audit', timestamp: '1 day ago', severity: 'Info' }
        ]
    },
    {
        id: 'D-003',
        name: 'Sarah Chen',
        employeeId: 'EMP-1255',
        vehicleId: 'V-108',
        totalAlerts: 89,
        riskLevel: 'Medium',
        safetyScore: 82,
        status: 'On-Duty',
        activeAlerts: 2,
        recentAlertType: 'Fatigue Warning',
        recentLogs: [
            { type: 'Fatigue Warning', timestamp: '30 mins ago', severity: 'Warning' },
            { type: 'Seatbelt Unbuckled', timestamp: '4 hours ago', severity: 'Warning' }
        ]
    },
    {
        id: 'D-004',
        name: 'Robert Taylor',
        employeeId: 'EMP-1088',
        vehicleId: 'V-098',
        totalAlerts: 112,
        riskLevel: 'High',
        safetyScore: 71,
        status: 'Active',
        activeAlerts: 5,
        recentAlertType: 'Route Deviation',
        recentLogs: [
            { type: 'Route Deviation', timestamp: '1 hour ago', severity: 'Critical' },
            { type: 'Geofence Breach', timestamp: '1 hour ago', severity: 'Critical' }
        ]
    },
    {
        id: 'D-005',
        name: 'Samuel Oak',
        employeeId: 'EMP-9001',
        vehicleId: 'V-505',
        totalAlerts: 15,
        riskLevel: 'Low',
        safetyScore: 98,
        status: 'Active',
        activeAlerts: 0,
        recentAlertType: 'None',
        recentLogs: []
    },
];

export const rules: Rule[] = [
    { id: 'R-001', name: 'Overspeeding Multi-Event Escalation', alertType: 'Vehicle Speed', action: 'Notify Supervisor', enabled: true },
    { id: 'R-002', name: 'Critical Engine Overheat Response', alertType: 'Engine Temp', action: 'Mark as Critical', enabled: true },
    { id: 'R-003', name: 'Repeated Geofence Breach', alertType: 'Geofence', action: 'Block Vehicle', enabled: false },
];
