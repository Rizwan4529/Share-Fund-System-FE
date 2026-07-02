import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Typography } from "@/components/common/Typography";
import { cn } from "@/lib/utils";

export function AdminSignupChart({
  data,
  className,
}: {
  data: number[];
  className?: string;
}) {
  const chartData = data.map((value, index) => ({ index, value }));

  return (
    <div className={cn("h-[150px] w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="signupFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#cf9f34" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#cf9f34" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#eef1f7" vertical={false} />
          <XAxis dataKey="index" hide />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #e6ebf4",
              fontSize: 12,
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#cf9f34"
            strokeWidth={2}
            fill="url(#signupFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AdminTrafficDonut({
  data,
  className,
}: {
  data: { name: string; value: number; color: string }[];
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-6", className)}>
      <div className="h-[140px] w-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={42}
              outerRadius={68}
              paddingAngle={2}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className="size-2.5 rounded-[3px]"
                style={{ backgroundColor: item.color }}
              />
              <Typography variant="body-sm" className="text-[13px] text-[#33425f]">
                {item.name}
              </Typography>
            </div>
            <Typography variant="label" className="text-[13px] font-semibold text-ink-heading">
              {item.value.toLocaleString()}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminDualAreaChart({
  signups,
  waitlist,
  className,
}: {
  signups: number[];
  waitlist: number[];
  className?: string;
}) {
  const chartData = signups.map((value, index) => ({
    index,
    signups: value,
    waitlist: waitlist[index] ?? 0,
  }));

  return (
    <div className={cn("h-[180px] w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#eef1f7" vertical={false} />
          <XAxis dataKey="index" hide />
          <YAxis hide />
          <Tooltip />
          <Area type="monotone" dataKey="signups" stroke="#cf9f34" fill="#cf9f3420" strokeWidth={2} />
          <Area type="monotone" dataKey="waitlist" stroke="#3f5580" fill="#3f558020" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AdminCategoryBars({
  data,
  className,
}: {
  data: { name: string; value: number; hot?: boolean }[];
  className?: string;
}) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className={cn("space-y-3", className)}>
      {data.map((item) => (
        <div key={item.name}>
          <div className="mb-1 flex justify-between text-[12.5px]">
            <span className="font-semibold text-[#33425f]">{item.name}</span>
            <span className="text-[#8496b7]">{item.value}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-[5px] bg-[#eef1f7]">
            <div
              className={cn(
                "h-full rounded-[5px]",
                item.hot
                  ? "bg-gradient-to-r from-gold-dark to-gold"
                  : "bg-[#2b4c86]",
              )}
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminFunnelChart({
  data,
  className,
}: {
  data: { label: string; value: number; pct: number }[];
  className?: string;
}) {
  const max = data[0]?.value ?? 1;

  return (
    <div className={cn("space-y-3", className)}>
      {data.map((item, index) => (
        <div key={item.label}>
          <div className="mb-1 flex justify-between text-[12.5px]">
            <span className="font-semibold text-[#33425f]">{item.label}</span>
            <span className="text-[#8496b7]">
              {item.value.toLocaleString()} · {item.pct}%
            </span>
          </div>
          <div className="h-[9px] overflow-hidden rounded-[5px] bg-[#eef1f7]">
            <div
              className={cn(
                "h-full rounded-[5px]",
                index === 0 && "bg-[#3f5580]",
                index === data.length - 1 && "bg-gradient-to-r from-gold-dark to-gold",
                index > 0 && index < data.length - 1 && "bg-[#2b4c86]",
              )}
              style={{
                width: `${Math.max(8, (item.value / max) * 100)}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminMiniBarChart({
  data,
  className,
}: {
  data: number[];
  className?: string;
}) {
  const chartData = data.map((value, index) => ({ index, value }));

  return (
    <div className={cn("h-24 w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <Bar dataKey="value" fill="#cf9f34" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
