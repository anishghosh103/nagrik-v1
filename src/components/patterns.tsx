import { AlertTriangle, CheckCircle2, LoaderCircle, X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { cn } from './cn';
import { Eyebrow } from './ui';

// ---------------------------------------------------------------------------
// Step progress
// ---------------------------------------------------------------------------

export function StepProgress({
  current,
  total,
  label,
  variant = 'journey',
}: {
  current: number;
  total: number;
  label?: string;
  variant?: 'journey' | 'compact';
}) {
  const { t } = useTranslation();
  const steps = Array.from({ length: total }, (_, index) => index + 1);
  if (variant === 'compact') {
    return (
      <div
        aria-label={label}
        className="mb-7 grid grid-cols-2 gap-1.25 [@media(min-width:900px)_and_(max-height:1100px)]:mb-5"
      >
        {steps.map((step) => (
          <i
            key={step}
            className={cn('h-0.75 bg-border', step <= current && 'bg-primary')}
          />
        ))}
      </div>
    );
  }
  return (
    <div className="-mt-3.5 mb-7.5 flex items-center justify-between text-[0.8rem] text-ink-muted">
      <span>{label ?? t('common.stepOf', { current, total })}</span>
      <div className="flex gap-1">
        {steps.map((step) => (
          <i
            key={step}
            className={cn(
              'h-0.75 w-9 bg-border max-[599px]:w-6',
              step <= current && 'bg-primary',
            )}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sticky actions
// ---------------------------------------------------------------------------

export function StickyActions({
  status,
  children,
}: {
  status?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="sticky bottom-0 z-5 mt-8 flex min-h-19 items-center justify-between gap-3 border-t border-border bg-[rgba(246,242,232,0.94)] backdrop-blur-[10px] max-[599px]:-mx-4.5 max-[599px]:bottom-16.5 max-[599px]:min-h-18.5 max-[599px]:px-4.5 max-[599px]:py-2.5 max-[599px]:[&>span]:hidden max-[599px]:[&_[data-slot='button']]:flex-1 max-[599px]:[&_[data-slot='button']]:px-2.5">
      {status && (
        <span className="text-[0.78rem] text-ink-muted">{status}</span>
      )}
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Readiness banner
// ---------------------------------------------------------------------------

export function ReadinessBanner({
  state,
  icon,
  status,
  title,
  description,
}: {
  state: 'ready' | 'blocked';
  icon?: ReactNode;
  status: ReactNode;
  title: ReactNode;
  description?: ReactNode;
}) {
  return (
    <div
      className={cn(
        'mb-7 grid grid-cols-[45px_1fr] gap-3.75 rounded-[var(--radius-sheet)] border p-5 max-[599px]:grid-cols-[36px_1fr] max-[599px]:px-3.25 max-[599px]:py-4 [&>svg]:size-8.75',
        state === 'ready'
          ? 'border-[#b9d0c1] bg-[#f2f8f3] [&>svg]:text-success'
          : 'border-[#ddb9ad] bg-[#fff3ef] [&>svg]:text-danger',
      )}
    >
      {icon ?? (state === 'ready' ? <CheckCircle2 /> : <AlertTriangle />)}
      <div>
        {status}
        <h2 className="mt-2 mb-1.25">{title}</h2>
        {description && <p className="m-0 text-ink-muted">{description}</p>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Progress state
// ---------------------------------------------------------------------------

export function ProgressState({
  variant = 'spinner',
  icon,
  title,
  description,
  children,
  className,
}: {
  variant?: 'spinner' | 'scan';
  icon?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section
      aria-live="polite"
      className={cn('py-7.5 text-center', className)}
    >
      {variant === 'scan' ? (
        <div className="relative mx-auto mb-5.5 grid size-22.5 place-items-center overflow-hidden rounded-full border border-border text-primary">
          {icon}
          <span className="absolute h-0.5 w-full animate-[scan_1.5s_ease-in-out_infinite] bg-accent" />
        </div>
      ) : (
        <LoaderCircle className="mx-auto size-10.5 animate-spin text-primary" />
      )}
      {title && <h2>{title}</h2>}
      {description && <p className="text-ink-muted">{description}</p>}
      {children}
    </section>
  );
}

export function SkeletonLines({ count = 3 }: { count?: number }) {
  return (
    <div className="mx-auto mt-7.5 grid max-w-107.5 gap-2.5">
      {Array.from({ length: count }, (_, index) => (
        <i
          key={index}
          className="h-13.5 animate-[shimmer_1.2s_linear_infinite] rounded-[7px] bg-[linear-gradient(90deg,var(--color-surface-muted),var(--color-surface),var(--color-surface-muted))] bg-[length:200%_100%]"
        />
      ))}
    </div>
  );
}

export function SubmissionStages({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto my-7 grid max-w-110 text-left">{children}</div>
  );
}

export function SubmissionStage({
  status,
  icon,
  children,
}: {
  status?: 'done' | 'active' | 'pending';
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        'flex min-h-13 items-center gap-2.5 border-b border-border text-ink-muted [&>svg]:size-4',
        status === 'done' && 'text-success',
        status === 'active' && 'font-bold text-info [&>svg]:animate-spin',
      )}
    >
      {icon}
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Amount context
// ---------------------------------------------------------------------------

export function AmountContext({
  label,
  amount,
  meta,
}: {
  label: ReactNode;
  amount: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <div className="grid border-t border-border py-4.5">
      <span className="text-ink-muted">{label}</span>
      <strong className="text-[2.2rem] [font-variant-numeric:tabular-nums]">
        {amount}
      </strong>
      {meta && <small className="text-ink-muted">{meta}</small>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Review ledgers
// ---------------------------------------------------------------------------

export function ReviewList({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mb-6.5 border-t border-border', className)}>
      {children}
    </div>
  );
}

export function ReviewRow({
  label,
  value,
  action,
}: {
  label: ReactNode;
  value: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4.5 not-last:border-b border-border py-3.5 max-[599px]:items-start">
      <span className="text-ink-muted">{label}</span>
      <strong className="text-right">{value}</strong>
      {action}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Rule checklists
// ---------------------------------------------------------------------------

export function RuleList({ children }: { children: ReactNode }) {
  return <div className="[&>section+section]:mt-7">{children}</div>;
}

export function RuleGroup({
  title,
  children,
}: {
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <section>
      <h3 className="text-[0.78rem] tracking-[0.1em] text-ink-muted uppercase mb-2">
        {title}
      </h3>
      {children}
    </section>
  );
}

export function RuleRow({
  passed,
  icon,
  status,
  children,
  onClick,
}: {
  passed: boolean;
  icon: ReactNode;
  status: ReactNode;
  children: ReactNode;
  onClick?: () => void;
}) {
  const content = (
    <>
      <span
        className={cn(
          'grid size-8.5 place-items-center rounded-full bg-[#e5efe8] text-success [&>svg]:size-4.25',
          !passed && 'bg-[#f7e7e2] text-danger',
        )}
      >
        {icon}
      </span>
      <div className="grid gap-1.25 py-4">{children}</div>
      {status}
    </>
  );
  const rowClass =
    'grid min-h-20.5 grid-cols-[38px_1fr_auto] items-center gap-3 not-last:border-b border-border first-of-type:border-t max-[599px]:grid-cols-[34px_1fr] max-[599px]:py-3';
  if (onClick)
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          rowClass,
          'w-full cursor-pointer border-0 bg-transparent text-left text-inherit hover:bg-surface-muted',
        )}
      >
        {content}
      </button>
    );
  return <div className={rowClass}>{content}</div>;
}

// ---------------------------------------------------------------------------
// Issue explanation
// ---------------------------------------------------------------------------

export function IssueExplanation({
  tone = 'danger',
  status,
  title,
  children,
}: {
  tone?: 'danger' | 'warning';
  status: ReactNode;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        'mb-7 border-l-4 py-2 pl-4.5',
        tone === 'danger' ? 'border-danger' : 'border-warning',
      )}
    >
      {status}
      <h2 className="my-2">{title}</h2>
      <p className="m-0 text-ink-muted">{children}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Notice
// ---------------------------------------------------------------------------

type NoticeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

const noticeCardTone: Record<NoticeTone, string> = {
  neutral: 'bg-surface-muted',
  info: 'bg-[#edf4f7]',
  success: 'bg-[#f2f8f3]',
  warning: 'bg-[#fff7ef]',
  danger: 'bg-[#fff3ef]',
};

const noticeIconTone: Record<NoticeTone, string> = {
  neutral: 'text-primary',
  info: 'text-info',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
};

const noticeInlineBorderTone: Record<NoticeTone, string> = {
  neutral: 'border-transparent',
  info: 'border-info',
  success: 'border-success',
  warning: 'border-warning',
  danger: 'border-danger',
};

export function Notice({
  tone = 'neutral',
  variant = 'card',
  icon,
  title,
  children,
  actions,
  className,
}: {
  tone?: NoticeTone;
  variant?: 'card' | 'inline';
  icon?: ReactNode;
  title?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  if (variant === 'inline')
    return (
      <div
        className={cn(
          'flex items-center gap-2.5 rounded-lg border-l-4 p-3.5 text-[0.85rem]',
          noticeCardTone[tone],
          noticeInlineBorderTone[tone],
          className,
        )}
      >
        {icon && (
          <span className={cn('shrink-0', noticeIconTone[tone])}>{icon}</span>
        )}
        <div className="grid flex-1 gap-0.5">
          {title && <strong className={noticeIconTone[tone]}>{title}</strong>}
          {children}
        </div>
        {actions}
      </div>
    );
  return (
    <div
      className={cn(
        'flex items-start gap-3.5 rounded-[var(--radius-sheet)] border p-5',
        noticeCardTone[tone],
        noticeInlineBorderTone[tone],
        className,
      )}
    >
      {icon && (
        <span className={cn('shrink-0 [&>svg]:size-9', noticeIconTone[tone])}>
          {icon}
        </span>
      )}
      <div className="flex-1">
        {title && <h2 className="mt-0 mb-1.25">{title}</h2>}
        {children && <div className="text-ink-muted">{children}</div>}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Detail sheet
// ---------------------------------------------------------------------------

export function DetailSheet({
  onClose,
  labelledBy,
  eyebrow,
  title,
  children,
  closeLabel,
}: {
  onClose: () => void;
  labelledBy: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  children: ReactNode;
  closeLabel?: string;
}) {
  const { t } = useTranslation();
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
  }, []);
  return (
    <div
      role="presentation"
      className="fixed inset-0 z-80 flex justify-end bg-[rgba(20,34,28,0.48)] pl-5 max-[599px]:p-0 max-[599px]:items-end"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="relative h-full w-[min(520px,100%)] overflow-auto bg-canvas p-[clamp(30px,5vw,58px)] shadow-[var(--shadow-sheet)] [animation:sheet-in_0.28s_ease-out] max-[599px]:h-[min(82vh,720px)] max-[599px]:w-full max-[599px]:animate-[sheet-up_0.28s_ease-out] max-[599px]:self-end max-[599px]:rounded-t-[18px] max-[599px]:px-5 max-[599px]:pt-9.5 max-[599px]:pb-7"
      >
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label={closeLabel ?? t('common.close')}
          className="absolute top-5 right-5 grid size-10.5 place-items-center rounded-full border border-border bg-surface [&_svg]:size-5"
        >
          <X />
        </button>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2
          id={labelledBy}
          className="mb-3"
        >
          {title}
        </h2>
        {children}
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Outcome + reference + status
// ---------------------------------------------------------------------------

export function OutcomeMark({
  variant = 'success',
  icon,
  className,
}: {
  variant?: 'success' | 'pending';
  icon: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'mx-auto mb-4.5 grid size-18 place-items-center rounded-full text-white [&>svg]:size-8.5',
        variant === 'success' ? 'bg-success' : 'bg-info',
        className,
      )}
    >
      {icon}
    </div>
  );
}

export function ReferenceBand({
  label,
  reference,
  meta,
}: {
  label: ReactNode;
  reference: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <div className="my-6.25 grid border-y border-border py-4.5">
      <span className="text-ink-muted">{label}</span>
      <strong className="text-[1.5rem] tracking-[0.03em] [font-variant-numeric:tabular-nums] max-[599px]:text-[1.15rem]">
        {reference}
      </strong>
      {meta && <small className="text-ink-muted">{meta}</small>}
    </div>
  );
}

export function StatusCard({
  tone = 'info',
  status,
  title,
  children,
}: {
  tone?: 'info' | 'success';
  status: ReactNode;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section
      className={cn(
        'rounded-[var(--radius-sheet)] border border-border border-l-4 bg-surface p-5 text-left',
        tone === 'success' ? 'border-l-success' : 'border-l-info',
      )}
    >
      {status}
      <h2 className="mt-2 mb-1">{title}</h2>
      {children && <p className="m-0 text-ink-muted">{children}</p>}
    </section>
  );
}

export function StatusTimeline({ children }: { children: ReactNode }) {
  return <ol className="my-7 list-none p-0 text-left">{children}</ol>;
}

export function StatusTimelineItem({
  state = 'upcoming',
  icon,
  title,
  meta,
}: {
  state?: 'complete' | 'current' | 'upcoming';
  icon: ReactNode;
  title: ReactNode;
  meta: ReactNode;
}) {
  return (
    <li className="relative grid min-h-19 grid-cols-[42px_1fr] gap-3.5 before:absolute before:top-9 before:left-4.5 before:h-full before:w-px before:bg-border last:before:hidden">
      <span
        className={cn(
          'relative z-1 grid size-9.25 place-items-center rounded-full border border-border bg-canvas text-ink-muted',
          state === 'complete' && 'border-success bg-success text-white',
          state === 'current' &&
            'border-info text-info shadow-[0_0_0_5px_rgba(56,101,122,0.1)]',
        )}
      >
        {icon}
      </span>
      <div className="grid content-start">
        <strong>{title}</strong>
        <small className="text-ink-muted">{meta}</small>
      </div>
    </li>
  );
}

// ---------------------------------------------------------------------------
// Balance summary
// ---------------------------------------------------------------------------

export function BalanceSummary({
  to,
  label,
  amount,
  meta,
  icon,
  action,
  className,
}: {
  to?: string;
  label: ReactNode;
  amount: ReactNode;
  meta?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  const content = (
    <>
      <div>
        <p className="m-0 text-ink-muted">{label}</p>
        <strong className="text-[clamp(2.4rem,5vw,3.4rem)] leading-[1.2] [font-variant-numeric:tabular-nums] max-[599px]:text-[2.2rem]">
          {amount}
        </strong>
        {meta && <small className="m-0 text-ink-muted">{meta}</small>}
      </div>
      {icon && (
        <span className="text-primary opacity-[0.22] max-[599px]:hidden [&>svg]:size-14">
          {icon}
        </span>
      )}
      {action}
    </>
  );
  const rowClass = cn(
    'flex items-center justify-between gap-3 border-y border-border py-6 max-[599px]:items-start max-[599px]:gap-3.75',
    className,
  );
  if (to)
    return (
      <Link
        to={to}
        className={cn(
          rowClass,
          'text-inherit no-underline transition-colors duration-180 hover:text-primary focus-visible:outline-3 focus-visible:outline-accent focus-visible:outline-offset-6',
        )}
      >
        {content}
      </Link>
    );
  return <div className={rowClass}>{content}</div>;
}
