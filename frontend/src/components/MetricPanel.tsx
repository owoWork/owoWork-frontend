import React from 'react';

interface MetricPanelProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
  loud?: boolean;
  iconVariant?: 'ink' | 'warn';
}

export const MetricPanel: React.FC<MetricPanelProps> = ({ 
  icon, 
  title, 
  value, 
  subtitle, 
  loud = false, 
  iconVariant 
}) => {
  return (
    <article className={`metric-panel ${loud ? 'loud' : ''}`} role="article" aria-label={title}>
      <span className={`metric-icon ${iconVariant || ''}`}>
        {icon}
      </span>
      <p>{title}</p>
      <strong>{value}</strong>
      <small>{subtitle}</small>
    </article>
  );
};
