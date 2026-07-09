import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { StatusCount, TrendPoint, EarningsSlice } from "../../data/mockDashboard";

// ─── Jobs By Status Pie ───────────────────────────────────────────────────────

type JobsByStatusProps = {
  data: StatusCount[];
};

export const JobsByStatusChart: React.FC<JobsByStatusProps> = ({ data }) => {
  const hasData = data.some((d) => d.count > 0);

  if (!hasData) {
    return (
      <div className="chart-empty" role="img" aria-label="No job status data">
        <p>No jobs to display</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          dataKey="count"
          nameKey="status"
          aria-label="Jobs by status"
        >
          {data.map((entry) => (
            <Cell key={entry.status} fill={entry.fill} stroke="#17211d" strokeWidth={1.5} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: unknown, name: unknown) => [value, name]}
          contentStyle={{
            background: "#fff8e7",
            border: "2px solid #17211d",
            borderRadius: "8px",
            fontFamily: "inherit",
            fontWeight: 700,
          }}
        />
        <Legend
          iconType="circle"
          iconSize={10}
          formatter={(value) => (
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#17211d" }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

// ─── Completion Rate Trend Line ───────────────────────────────────────────────

type TrendProps = {
  data: TrendPoint[];
};

export const CompletionTrendChart: React.FC<TrendProps> = ({ data }) => {
  if (!data.length) {
    return (
      <div className="chart-empty" role="img" aria-label="No trend data">
        <p>No trend data yet</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(23,33,29,0.12)" />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 12, fontWeight: 700, fill: "#667069" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 11, fill: "#667069" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
          width={36}
        />
        <Tooltip
          formatter={(value: unknown) => [`${value}%`, "Completion Rate"]}
          contentStyle={{
            background: "#fff8e7",
            border: "2px solid #17211d",
            borderRadius: "8px",
            fontFamily: "inherit",
            fontWeight: 700,
          }}
        />
        <Line
          type="monotone"
          dataKey="rate"
          stroke="#0f8f5f"
          strokeWidth={2.5}
          dot={{ fill: "#0f8f5f", strokeWidth: 2, r: 4, stroke: "#17211d" }}
          activeDot={{ r: 6, stroke: "#17211d", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

// ─── Artisan Earnings Bar ─────────────────────────────────────────────────────

type EarningsProps = {
  data: EarningsSlice[];
};

export const ArtisanEarningsChart: React.FC<EarningsProps> = ({ data }) => {
  if (!data.length) {
    return (
      <div className="chart-empty" role="img" aria-label="No earnings data">
        <p>No completed jobs yet</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(23,33,29,0.12)" vertical={false} />
        <XAxis
          dataKey="trade"
          tick={{ fontSize: 11, fontWeight: 700, fill: "#667069" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#667069" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}`}
          width={44}
        />
        <Tooltip
          formatter={(value: unknown) => [
            `${typeof value === "number" ? value.toLocaleString() : value} XLM`,
            "Earnings",
          ]}
          contentStyle={{
            background: "#fff8e7",
            border: "2px solid #17211d",
            borderRadius: "8px",
            fontFamily: "inherit",
            fontWeight: 700,
          }}
        />
        <Bar dataKey="earnings" radius={[4, 4, 0, 0]} stroke="#17211d" strokeWidth={1}>
          {data.map((entry) => (
            <Cell key={entry.trade} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
