import {
    PieChart, Pie, Cell, Tooltip as ReTooltip,
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    LineChart, Line, Legend,
} from 'recharts';

export const HMIF_COLORS = {
    green: '#4D5B37', greenL: '#9dab56',
    blue: '#17579F', blueL: '#5e9dd9',
    yellow: '#CBCF1A', yellowL: '#e9ed5a',
    muted: '#cdd4bc',
};

export const CHART_PALETTE = [
    HMIF_COLORS.green, HMIF_COLORS.blue, HMIF_COLORS.yellow,
    HMIF_COLORS.greenL, HMIF_COLORS.blueL, HMIF_COLORS.yellowL,
];

function ChartTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl border border-border bg-white px-3 py-2 shadow-lg">
            {label && <p className="text-xs font-semibold text-foreground mb-1">{label}</p>}
            {payload.map((p: any, i: number) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="h-2 w-2 rounded-full" style={{ background: p.color || p.fill }} />
                    <span className="text-muted-foreground">{p.name}:</span>
                    <span className="font-semibold text-foreground">{p.value}</span>
                </div>
            ))}
        </div>
    );
}

export function ParticipationDonut({ registered, present, voted }: { registered: number; present: number; voted: number }) {
    const onlyRegistered = Math.max(0, registered - present - voted);
    const onlyPresent = Math.max(0, present - voted);
    const data = [
        { name: 'Sudah Vote', value: voted, color: HMIF_COLORS.green },
        { name: 'Hadir', value: onlyPresent, color: HMIF_COLORS.blue },
        { name: 'Terdaftar', value: onlyRegistered, color: HMIF_COLORS.yellow },
    ].filter(d => d.value > 0);
    const total = voted + onlyPresent + onlyRegistered;
    if (total === 0) return <div className="flex items-center justify-center h-[220px] text-muted-foreground text-sm">Belum ada data</div>;
    return (
        <div className="relative">
            <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                    <Pie data={data} innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" stroke="#fff" strokeWidth={3}>
                        {data.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <ReTooltip content={<ChartTooltip />} />
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-3xl font-bold text-hmif-green-700">{voted}</p>
                <p className="text-xs text-muted-foreground">dari {total}</p>
            </div>
        </div>
    );
}

export function CandidateBarChart({ data }: { data: { name: string; votes: number }[] }) {
    if (data.length === 0) return <div className="flex items-center justify-center h-[240px] text-muted-foreground text-sm">Belum ada data</div>;
    return (
        <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data} margin={{ top: 8, right: 16, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e6d3" vertical={false} />
                <XAxis dataKey="name" stroke="#64705a" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64705a" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <ReTooltip content={<ChartTooltip />} cursor={{ fill: '#f1f3e8' }} />
                <Bar dataKey="votes" name="Suara" fill="#4D5B37" radius={[8, 8, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}

export function SessionTrendChart({ data }: { data: { name: string; voters: number; votes: number }[] }) {
    return (
        <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data} margin={{ top: 8, right: 16, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e6d3" vertical={false} />
                <XAxis dataKey="name" stroke="#64705a" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64705a" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <ReTooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="voters" name="Pemilih" stroke={HMIF_COLORS.blue} strokeWidth={2.5} dot={{ r: 3, fill: HMIF_COLORS.blue }} />
                <Line type="monotone" dataKey="votes" name="Suara" stroke={HMIF_COLORS.green} strokeWidth={2.5} dot={{ r: 3, fill: HMIF_COLORS.green }} />
            </LineChart>
        </ResponsiveContainer>
    );
}

export function CandidatePieChart({ data }: { data: { name: string; votes: number }[] }) {
    const total = data.reduce((s, d) => s + d.votes, 0);
    if (total === 0) return <div className="flex items-center justify-center h-[260px] text-muted-foreground text-sm">Belum ada data</div>;
    return (
        <ResponsiveContainer width="100%" height={260}>
            <PieChart>
                <Pie data={data} innerRadius={55} outerRadius={100} paddingAngle={2} dataKey="votes" nameKey="name" stroke="#fff" strokeWidth={3}
                    label={({ percent }) => percent && percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''}>
                    {data.map((_, i) => <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />)}
                </Pie>
                <ReTooltip content={<ChartTooltip />} />
            </PieChart>
        </ResponsiveContainer>
    );
}
