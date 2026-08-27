import type {
  ButtonHTMLAttributes,
  ComponentPropsWithoutRef,
  ReactNode,
} from 'react';
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
import { cn } from './cn';

type ButtonVariant = 'primary' | 'secondary' | 'text' | 'danger';
type ButtonSize = 'default' | 'compact' | 'icon';

const buttonBase =
  'inline-flex cursor-pointer items-center justify-center border border-transparent font-bold no-underline transition-[transform,background,border] duration-200 hover:not-disabled:-translate-y-px disabled:cursor-not-allowed disabled:opacity-50';

const buttonSizes: Record<ButtonSize, string> = {
  default: 'min-h-11.5 gap-2.25 rounded-[9px] px-4.5 py-2.5',
  compact: 'gap-1.5 rounded-[9px] px-0 py-1.25 [&_svg]:size-4.25',
  icon: 'size-10.5 rounded-full p-0 [&_svg]:size-5',
};

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:not-disabled:bg-primary-strong',
  secondary: 'border-border bg-surface text-ink',
  text: 'bg-transparent text-primary',
  danger: 'bg-transparent text-danger',
};

function buttonClassName(
  variant: ButtonVariant,
  size: ButtonSize,
  wide: boolean,
  className?: string,
) {
  return cn(
    buttonBase,
    buttonSizes[size],
    buttonVariants[variant],
    wide && 'w-full',
    className,
  );
}

export function Button({
  variant = 'primary',
  size = 'default',
  wide = false,
  className,
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  wide?: boolean;
}) {
  return (
    <button
      data-slot="button"
      type={type}
      className={buttonClassName(variant, size, wide, className)}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = 'primary',
  size = 'default',
  wide = false,
  className,
  ...props
}: LinkProps & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  wide?: boolean;
}) {
  return (
    <Link
      data-slot="button"
      className={buttonClassName(variant, size, wide, className)}
      {...props}
    />
  );
}

const backActionClass =
  'mb-5.5 inline-flex cursor-pointer items-center gap-1.75 border-0 bg-transparent py-1.75 text-ink-muted no-underline max-[599px]:mb-3.75';

export function BackLink({
  to,
  children = 'Back',
  className,
}: {
  to: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={cn(backActionClass, className)}
    >
      <ArrowLeft size={18} />
      {children}
    </Link>
  );
}

export function BackButton({
  onClick,
  children = 'Back',
  className,
}: {
  onClick: () => void;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(backActionClass, className)}
    >
      <ArrowLeft size={18} />
      {children}
    </button>
  );
}

type Tone = 'default' | 'inverse';

const eyebrowTone: Record<Tone, string> = {
  default: 'text-primary',
  inverse: 'text-[#efc979]',
};

export function Eyebrow({
  tone = 'default',
  className,
  ...props
}: ComponentPropsWithoutRef<'p'> & { tone?: Tone }) {
  return (
    <p
      className={cn(
        'mb-2.5 text-[0.78rem] font-bold tracking-[0.12em] uppercase',
        eyebrowTone[tone],
        className,
      )}
      {...props}
    />
  );
}

type PageWidth = 'default' | 'narrow' | 'wide';
type PageMode = 'default' | 'dashboard' | 'journey' | 'completion';

const pageModeClass: Record<PageMode, string> = {
  default: '',
  dashboard: '',
  journey: '',
  completion: 'text-center',
};

type PageProps = {
  width?: PageWidth;
  mode?: PageMode;
  className?: string;
  children: ReactNode;
};

export function Page({ mode = 'default', className, children }: PageProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-300 px-[clamp(32px,4vw,64px)] pt-12 pb-24 [animation:page-in_0.38s_ease_both] max-[899px]:px-[clamp(24px,5vw,40px)] max-[899px]:pt-9.5 max-[899px]:pb-25 max-[599px]:px-4.5 max-[599px]:pt-7 max-[599px]:pb-27',
        pageModeClass[mode],
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  back,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  subtitle: ReactNode;
  back?: string;
}) {
  return (
    <header className="mb-8 text-left max-[599px]:mb-6.5">
      {back && <BackLink to={back} />}
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1>{title}</h1>
      <p className="m-0 max-w-175 text-[1.06rem] text-ink-muted max-[599px]:text-[1rem]">
        {subtitle}
      </p>
    </header>
  );
}

export function SectionKicker({
  icon,
  children,
  className,
}: {
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'mb-2.5 flex items-center gap-2 text-[0.78rem] font-bold tracking-[0.12em] text-primary uppercase',
        className,
      )}
    >
      {icon}
      <span>{children}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'mb-2 flex items-end justify-between max-[599px]:items-center',
        className,
      )}
    >
      <div>
        {eyebrow && <Eyebrow className="mb-0">{eyebrow}</Eyebrow>}
        <h2 className="m-0">{title}</h2>
        {subtitle}
      </div>
      {action}
    </div>
  );
}

const brandMarkTone: Record<Tone, string> = {
  default: 'bg-primary text-surface',
  inverse: 'bg-accent text-primary-strong',
};

export function BrandMark({
  tone = 'default',
  className,
}: {
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-grid size-8.5 place-items-center rounded-[50%_50%_50%_12%] font-bold max-[599px]:size-7.75',
        brandMarkTone[tone],
        className,
      )}
    >
      न
    </span>
  );
}

export function PrototypeTag({
  tone = 'default',
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        'rounded-[3px] border px-1.5 py-0.5 text-[0.62rem] tracking-[0.1em] uppercase max-[599px]:hidden',
        tone === 'inverse'
          ? 'border-white/55 text-white'
          : 'border-primary text-primary',
      )}
    >
      {children}
    </span>
  );
}

export function Wordmark({
  tone = 'default',
  tag,
  className,
}: {
  tone?: Tone;
  tag?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2.5 text-[1.23rem] font-[750] tracking-[-0.02em] no-underline max-[599px]:text-[1.06rem]',
        tone === 'inverse' && 'relative z-1 text-white',
        className,
      )}
    >
      <BrandMark tone={tone} />
      <span>Nagrik</span>
      {tag}
    </span>
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
  const kindClass = {
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
    info: 'text-info',
  }[kind];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-[0.79rem] leading-[1.2] font-bold',
        kindClass,
      )}
    >
      <Icon size={16} />
      {children}
    </span>
  );
}

export function SourceMarker({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.25 rounded-[3px] border border-border bg-surface px-1.75 py-0.75 text-[0.72rem] font-[650] tracking-[0.015em] text-ink-muted">
      <Database size={14} />
      {children}
    </span>
  );
}

export function ArrowLink({
  to,
  children,
  className,
}: {
  to: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      className={cn(
        'inline-flex items-center gap-2 font-bold text-primary no-underline',
        className,
      )}
      to={to}
    >
      {children}
      <ArrowRight size={18} />
    </Link>
  );
}

export function LargeGlyph({
  icon,
  className,
}: {
  icon: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'grid size-14.5 place-items-center rounded-full bg-primary text-white',
        className,
      )}
    >
      {icon}
    </span>
  );
}

export function VisuallyHidden({ children }: { children: ReactNode }) {
  return (
    <span className="absolute -m-px h-px w-px overflow-hidden border-0 p-0 whitespace-nowrap [clip:rect(0,_0,_0,_0)]">
      {children}
    </span>
  );
}
