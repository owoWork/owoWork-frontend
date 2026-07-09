import React from "react";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

type Health = "healthy" | "warning" | "critical";

export const HealthBadge: React.FC<{ status: Health }> = ({ status }) => {
  const config = {
    healthy: {
      icon: <CheckCircle size={14} />,
      label: "Healthy",
      className: "health-badge health-badge--healthy",
    },
    warning: {
      icon: <AlertTriangle size={14} />,
      label: "Warning",
      className: "health-badge health-badge--warning",
    },
    critical: {
      icon: <XCircle size={14} />,
      label: "Critical",
      className: "health-badge health-badge--critical",
    },
  };

  const { icon, label, className } = config[status];

  return (
    <span className={className} role="status" aria-label={`Marketplace health: ${label}`}>
      {icon}
      {label}
    </span>
  );
};
