import React, { ReactNode } from "react";

type Variant = "default" | "accent" | "warn" | "danger";

type MetricCardProps = {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  variant?: Variant;
  badge?: ReactNode;
};

const variantMap: Record<Variant, string> = {
  default: "metric-card",
  accent: "metric-card metric-card--accent",
  warn: "metric-card metric-card--warn",
  danger: "metric-card metric-card--danger",
};

export const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  label,
  value,
  subtext,
  variant = "default",
  badge,
}) => {
  return (
    <article className={variantMap[variant]} aria-label={label}>
      <div className="metric-card__header">
        <span className="metric-card__icon" aria-hidden="true">
          {icon}
        </span>
        {badge && <span className="metric-card__badge">{badge}</span>}
      </div>
      <p className="metric-card__label">{label}</p>
      <strong className="metric-card__value">{value}</strong>
      {subtext && <small className="metric-card__sub">{subtext}</small>}
    </article>
  );
};
