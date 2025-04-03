
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

const data = [
  { date: "Feb 8", requests: 65, previous: 55 },
  { date: "Feb 9", requests: 40, previous: 45 },
  { date: "Feb 10", requests: 55, previous: 52 },
  { date: "Feb 11", requests: 80, previous: 70 },
  { date: "Feb 12", requests: 45, previous: 48 },
  { date: "Feb 13", requests: 70, previous: 65 },
  { date: "Feb 14", requests: 62, previous: 58 },
];

export function OverviewGraph() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data} margin={{ top: 5, right: 15, left: 15, bottom: 5 }}>
        <CartesianGrid stroke="#f6f6f7" strokeDasharray="5 5" vertical={false} />
        <XAxis
          dataKey="date"
          stroke="#8A898C"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          dy={10}
        />
        <YAxis
          stroke="#8A898C"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value} requests`}
          tickMargin={8}
        />
        <Tooltip
          cursor={false}
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #f1f0fb',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            padding: '8px 12px',
          }}
          formatter={(value: number, name: string) => {
            const label = name === 'requests' ? 'Current Period' : 'Previous Period';
            return [`${value} requests`, label];
          }}
          labelFormatter={(label) => `Date: ${label}`}
          wrapperStyle={{
            outline: 'none'
          }}
        />
        <Legend 
          verticalAlign="top" 
          height={36}
          formatter={(value: string) => {
            return value === 'requests' ? 'Current Period' : 'Previous Period';
          }}
        />
        <Line
          type="monotone"
          dataKey="previous"
          name="previous"
          stroke="#E5DEFF"
          strokeWidth={2}
          dot={false}
          strokeOpacity={0.8}
          animationDuration={750}
          animationEasing="ease-out"
        />
        <Line
          type="monotone"
          dataKey="requests"
          name="requests"
          stroke="#8B5CF6"
          strokeWidth={2.5}
          dot={false}
          activeDot={{
            r: 6,
            fill: "#8B5CF6",
            stroke: "#FFFFFF",
            strokeWidth: 3,
          }}
          animationDuration={750}
          animationEasing="ease-out"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
