import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from './cn';

export function FieldLabel({
  htmlFor,
  children,
  hint,
  className,
}: {
  htmlFor: string;
  children: ReactNode;
  hint?: ReactNode;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'mt-4.5 mb-1.75 flex justify-between font-bold [@media(min-width:900px)_and_(max-height:1100px)]:mt-3.5',
        className,
      )}
    >
      {children}
      {hint && <small className="font-medium text-ink-muted">{hint}</small>}
    </label>
  );
}

export function OtpInput({
  id,
  value,
  onChange,
  autoFocus,
  placeholder,
  className,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      id={id}
      className={cn(
        'h-14 w-full rounded-[9px] border border-border bg-surface px-3.75 py-2.25 text-[1.5rem] tracking-[0.38em] [font-variant-numeric:tabular-nums] focus:border-primary',
        className,
      )}
      inputMode="numeric"
      autoComplete="one-time-code"
      maxLength={6}
      value={value}
      onChange={(event) => onChange(event.target.value.replace(/\D/g, ''))}
      placeholder={placeholder}
      autoFocus={autoFocus}
    />
  );
}

export const ValidationAlert = forwardRef<
  HTMLDivElement,
  { children: ReactNode; actions?: ReactNode; className?: string }
>(function ValidationAlert({ children, actions, className }, ref) {
  return (
    <div
      ref={ref}
      role="alert"
      tabIndex={-1}
      className={cn(
        'my-3.5 border-l-4 border-danger bg-[#fff3ef] px-3.5 py-3 font-semibold text-danger',
        className,
      )}
    >
      {children}
      {actions}
    </div>
  );
});

export type FieldIssue = { id: string; message: ReactNode };

export const ErrorSummary = forwardRef<
  HTMLDivElement,
  { issues: FieldIssue[]; title?: ReactNode; className?: string }
>(function ErrorSummary({ issues, title, className }, ref) {
  const { t } = useTranslation();
  if (!issues.length) return null;
  return (
    <div
      ref={ref}
      role="alert"
      tabIndex={-1}
      className={cn(
        'my-3.5 border-l-4 border-danger bg-[#fff3ef] px-3.5 py-3 text-danger',
        className,
      )}
    >
      <p className="m-0 mb-1.5 font-bold">{title ?? t('common.fixIssues')}</p>
      <ul className="m-0 grid gap-1 pl-4.5">
        {issues.map((issue) => (
          <li key={issue.id}>
            <a
              href={`#${issue.id}`}
              className="font-semibold text-danger underline underline-offset-2"
              onClick={(event) => {
                const field = document.getElementById(issue.id);
                if (!field) return;
                event.preventDefault();
                field.focus();
                field.scrollIntoView({ block: 'center' });
              }}
            >
              {issue.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
});

export function ChoiceGroup({
  legend,
  children,
  className,
}: {
  legend: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <fieldset className={cn('m-0 mb-7.5 border-0 p-0', className)}>
      <legend className="mb-3 font-bold">{legend}</legend>
      {children}
    </fieldset>
  );
}

export function ChoiceCard({
  selected,
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<'label'> & { selected?: boolean }) {
  return (
    <label
      className={cn(
        'mb-2 grid min-h-18 cursor-pointer grid-cols-[24px_1fr_22px] items-center gap-3 rounded-[9px] border border-border bg-surface px-4 py-3 [&_input]:size-4.5 [&_input]:accent-primary [&_small]:text-ink-muted [&_span]:grid [&>svg]:text-primary [&>svg]:opacity-0',
        selected &&
          'border-primary shadow-[inset_4px_0_var(--color-primary)] [&>svg]:opacity-100',
        className,
      )}
      {...props}
    >
      {children}
    </label>
  );
}

export function DeclarationCheck({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label className="grid cursor-pointer grid-cols-[22px_1fr] gap-3 rounded-lg bg-surface-muted p-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.75 size-4.75 accent-primary"
      />
      <span>{children}</span>
    </label>
  );
}
