import { tw } from '../styles/recipes';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Database,
  XCircle,
} from 'lucide-react';
import { Link, type LinkProps } from 'react-router-dom';

type ButtonVariant = 'primary' | 'secondary' | 'text';

const buttonBase =
  'inline-flex min-h-11.5 cursor-pointer items-center justify-center gap-2.25 rounded-[9px] border border-transparent px-4.5 py-2.5 font-bold no-underline transition-[transform,background,border] duration-200 hover:not-disabled:-translate-y-px disabled:cursor-not-allowed disabled:opacity-50';

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:not-disabled:bg-primary-strong',
  secondary: 'border-border bg-surface text-ink',
  text: 'bg-transparent text-primary',
};

function buttonClassName(
  variant: ButtonVariant,
  wide: boolean,
  className?: string,
) {
  return [buttonBase, buttonVariants[variant], wide && 'w-full', className]
    .filter(Boolean)
    .join(' ');
}

export function Button({
  variant = 'primary',
  wide = false,
  className,
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  wide?: boolean;
}) {
  return (
    <button
      data-slot="button"
      type={type}
      className={buttonClassName(variant, wide, className)}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = 'primary',
  wide = false,
  className,
  ...props
}: LinkProps & { variant?: ButtonVariant; wide?: boolean }) {
  return (
    <Link
      data-slot="button"
      className={buttonClassName(variant, wide, className)}
      {...props}
    />
  );
}

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
    <header className={tw('page-header')}>
      {back && (
        <Link
          className={tw('back-button')}
          to={back}
        >
          <ArrowLeft size={18} />
          Back
        </Link>
      )}
      <p className={tw('eyebrow')}>{eyebrow}</p>
      <h1>{title}</h1>
      <p className={tw('page-subtitle')}>{subtitle}</p>
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
    <span className={tw('status', kind)}>
      <Icon size={16} />
      {children}
    </span>
  );
}

export function SourceMarker({ children }: { children: ReactNode }) {
  return (
    <span className={tw('source-marker')}>
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
      className={tw('arrow-link')}
      to={to}
    >
      {children}
      <ArrowRight size={18} />
    </Link>
  );
}
