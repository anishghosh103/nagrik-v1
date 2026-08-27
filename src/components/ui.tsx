import type { ReactNode } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Database,
  XCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  back,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  back?: string;
}) {
  return (
    <header className="page-header">
      {back && (
        <Link
          className="back-button"
          to={back}
        >
          <ArrowLeft size={18} />
          Back
        </Link>
      )}
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="page-subtitle">{subtitle}</p>
    </header>
  );
}

export function Status({
  kind,
  children,
}: {
  kind: 'success' | 'warning' | 'danger' | 'info';
  children: ReactNode;
}) {
  const Icon =
    kind === 'success'
      ? Check
      : kind === 'danger'
        ? XCircle
        : kind === 'warning'
          ? AlertTriangle
          : Clock3;
  return (
    <span className={`status ${kind}`}>
      <Icon size={16} />
      {children}
    </span>
  );
}

export function SourceMarker({ children }: { children: ReactNode }) {
  return (
    <span className="source-marker">
      <Database size={14} />
      {children}
    </span>
  );
}

export function ArrowLink({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}) {
  return (
    <Link
      className="arrow-link"
      to={to}
    >
      {children}
      <ArrowRight size={18} />
    </Link>
  );
}
