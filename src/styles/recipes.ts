/**
 * Tailwind utility recipes migrated from the former global stylesheet.
 *
 * Semantic tokens are retained as inert marker classes so parent/sibling
 * arbitrary variants can express relationships without global CSS selectors.
 */
const recipes: Record<string, string> = {
  'activity-event':
    '[border-bottom:1px_solid_var(--color-border)] [padding-bottom:22px] [&_>_div:first-child]:[display:flex] [&_>_div:first-child]:[justify-content:space-between] [&_>_div:first-child]:[gap:12px] [&_time]:[color:var(--color-ink-muted)] [&_time]:[font-size:0.76rem] [&_h2]:[margin:9px_0_4px] [&_p]:[color:var(--color-ink-muted)] [&_p]:[margin:0] [@media(max-width:_599px)]:[&_>_div:first-child]:[display:grid]',
  'activity-node':
    '[width:43px] [height:43px] [border-radius:50%] [display:grid] [place-items:center] [color:var(--color-primary)] [background:var(--color-surface)] [border:1px_solid_var(--color-border)] [z-index:1] [&.complete]:[color:#fff] [&.complete]:[background:var(--color-success)] [&.complete]:[border-color:var(--color-success)] [&.in\\_progress]:[color:var(--color-info)] [&.in\\_progress]:[border-color:var(--color-info)] [&_svg]:[width:20px] [@media(max-width:_599px)]:[width:38px] [@media(max-width:_599px)]:[height:38px]',
  'activity-timeline':
    "[list-style:none] [padding:0] [margin:0] [&_li]:[display:grid] [&_li]:[grid-template-columns:50px_1fr] [&_li]:[gap:15px] [&_li]:[position:relative] [&_li]:[padding-bottom:26px] [&_li::before]:[content:''] [&_li::before]:[position:absolute] [&_li::before]:[left:21px] [&_li::before]:[top:42px] [&_li::before]:[width:1px] [&_li::before]:[height:calc(100%_-_22px)] [&_li::before]:[background:var(--color-border)] [&_li:last-child::before]:[display:none] [@media(max-width:_599px)]:[&_li]:[grid-template-columns:42px_1fr] [@media(max-width:_599px)]:[&_li]:[gap:10px] [@media(max-width:_599px)]:[&_li::before]:[left:18px]",
  'add-nominee': '[margin-top:14px]',
  'allocation-list':
    '[border-top:1px_solid_var(--color-border)] [&_label]:[display:grid] [&_label]:[grid-template-columns:1fr_130px] [&_label]:[gap:15px] [&_label]:[align-items:center] [&_label]:[min-height:82px] [&_label]:[border-bottom:1px_solid_var(--color-border)] [&_label_>_span:first-child]:[display:grid] [&_small]:[color:var(--color-ink-muted)] [@media(max-width:_599px)]:[&_label]:[grid-template-columns:1fr_105px]',
  'allocation-total':
    '[display:grid] [grid-template-columns:1fr_auto_auto] [align-items:center] [gap:16px] [border-block:1px_solid_var(--color-border)] [padding:18px_0] [margin:22px_0] [&_strong]:[font-size:2rem] [&_strong]:[font-variant-numeric:tabular-nums] [@media(max-width:_599px)]:[grid-template-columns:1fr_auto] [@media(max-width:_599px)]:[&_.status]:[grid-column:1/-1] [@media(max-width:_599px)]:[&_.status]:[justify-self:start]',
  'amount-context':
    '[border-block:1px_solid_var(--color-border)] [padding:18px_0] [display:grid] [&_span]:[color:var(--color-ink-muted)] [&_small]:[color:var(--color-ink-muted)] [&_strong]:[font-size:2.2rem] [&_strong]:[font-variant-numeric:tabular-nums]',
  'app-frame': 'min-h-screen w-full bg-canvas/68',
  'arrow-link':
    'inline-flex items-center gap-2 font-bold text-primary no-underline',
  'auth-illustration':
    '[height:160px] [display:grid] [place-items:center] [position:relative] [margin:12px_0] [@media(min-width:_900px)_and_(max-height:_1100px)]:[height:140px] [@media(min-width:_900px)_and_(max-height:_1100px)]:[margin-block:8px] [@media(max-width:_899px)]:[display:none]',
  'auth-lede':
    '[max-width:620px] [font-size:1.08rem] [color:rgba(255,_255,_255,_0.74)] [@media(min-width:_900px)_and_(max-height:_1100px)]:[font-size:1rem] [@media(min-width:_900px)_and_(max-height:_1100px)]:[margin-bottom:0] [@media(max-width:_599px)]:[font-size:1rem]',
  'auth-mast':
    "[padding:clamp(32px,_4.5vw,_72px)] [min-height:100vh] [display:flex] [flex-direction:column] [justify-content:space-between] [background:var(--color-primary-strong)] [color:#fdfaf1] [position:relative] [overflow:hidden] [&::after]:[content:''] [&::after]:[width:420px] [&::after]:[height:420px] [&::after]:[border:1px_solid_rgba(255,_255,_255,_0.08)] [&::after]:[border-radius:50%] [&::after]:[position:absolute] [&::after]:[right:-180px] [&::after]:[top:-130px] [&::after]:[box-shadow:0_0_0_54px_rgba(255,_255,_255,_0.025),_0_0_0_110px_rgba(255,_255,_255,_0.02)] [&_h1]:[font-size:clamp(2.5rem,_4vw,_4rem)] [&_h1]:[max-width:800px] [&_h1]:[color:#fff] [&_.eyebrow]:[color:#efc979] [@media(min-width:_900px)_and_(max-height:_1100px)]:[padding-block:clamp(24px,_4vh,_40px)] [@media(min-width:_900px)_and_(max-height:_1100px)]:[&_h1]:[font-size:clamp(2.35rem,_3.5vw,_3.6rem)] [@media(min-width:_900px)_and_(max-height:_1100px)]:[&_h1]:[margin-bottom:10px] [@media(max-width:_899px)]:[min-height:auto] [@media(max-width:_899px)]:[padding:32px_7vw] [@media(max-width:_899px)]:[gap:34px] [@media(max-width:_899px)]:[&_h1]:[font-size:clamp(2.5rem,_8vw,_4rem)] [@media(max-width:_599px)]:[padding:28px_20px_34px] [@media(max-width:_599px)]:[&_h1]:[font-size:2.45rem]",
  'auth-page':
    '[min-height:100vh] [display:grid] [grid-template-columns:minmax(420px,_1.15fr)_minmax(400px,_0.85fr)] [@media(max-width:_899px)]:[grid-template-columns:1fr]',
  'auth-panel':
    '[max-width:680px] [width:100%] [padding:clamp(28px,_5vw,_72px)] [align-self:center] [justify-self:center] [&_h2]:[font-size:clamp(1.7rem,_2.5vw,_2.15rem)] [&_h2]:[margin-bottom:8px] [&_>_p:not(.panel-number)]:[color:var(--color-ink-muted)] [&_>_p:not(.panel-number)]:[margin-bottom:22px] [@media(min-width:_900px)_and_(max-height:_1100px)]:[padding:clamp(24px,_4vh,_40px)_clamp(72px,_5vw,_80px)] [@media(min-width:_900px)_and_(max-height:_1100px)]:[&_>_p:not(.panel-number)]:[margin-bottom:18px] [@media(max-width:_899px)]:[padding:44px_7vw_70px] [@media(max-width:_899px)]:[max-width:680px] [@media(max-width:_599px)]:[padding:36px_20px_65px]',
  'auth-wordmark':
    '[color:#fff] [position:relative] [z-index:1] [&_.brand-mark]:[color:var(--color-primary-strong)] [&_.brand-mark]:[background:var(--color-accent)] [&_.prototype-tag]:[border-color:rgba(255,_255,_255,_0.55)] [&_.prototype-tag]:[color:#fff]',
  avatar:
    '[width:44px] [height:44px] [display:grid] [place-items:center] [border-radius:50%] [color:var(--color-primary)] [background:var(--color-surface-muted)] [font-weight:750]',
  'back-button':
    'mb-5.5 inline-flex cursor-pointer items-center gap-1.75 border-0 bg-transparent py-1.75 text-ink-muted no-underline [@media(max-width:_599px)]:[margin-bottom:15px]',
  'balance-band':
    '[border-block:1px_solid_var(--color-border)] [padding:24px_0] [display:flex] [align-items:center] [justify-content:space-between] [&_div]:[display:grid] [&_p]:[color:var(--color-ink-muted)] [&_p]:[margin:0] [&_small]:[color:var(--color-ink-muted)] [&_small]:[margin:0] [&_strong]:[font-size:clamp(2.4rem,_5vw,_3.4rem)] [&_strong]:[line-height:1.2] [&_strong]:[font-variant-numeric:tabular-nums] [&_>_svg]:[width:56px] [&_>_svg]:[height:56px] [&_>_svg]:[color:var(--color-primary)] [&_>_svg]:[opacity:0.22] [@media(max-width:_599px)]:[&_strong]:[font-size:2.2rem] [@media(max-width:_599px)]:[&_>_svg]:[display:none]',
  'balance-link':
    '[color:inherit] [text-decoration:none] [transition:color_0.18s] [&:hover]:[color:var(--color-primary)] [&:focus-visible]:[outline:3px_solid_var(--color-accent)] [&:focus-visible]:[outline-offset:6px]',
  'bank-confirm':
    '[display:grid] [grid-template-columns:42px_1fr_auto] [gap:14px] [align-items:center] [border-block:1px_solid_var(--color-border)] [padding:20px_0] [margin-top:28px] [&_>_svg]:[color:var(--color-primary)] [&_>_div]:[display:grid] [&_>_div]:[gap:4px] [&_>_div_>_span]:[color:var(--color-ink-muted)] [&_>_div_>_span]:[font-size:0.82rem] [@media(max-width:_599px)]:[grid-template-columns:36px_1fr] [@media(max-width:_599px)]:[&_>_.status]:[grid-column:2]',
  'bank-record':
    '[display:grid] [grid-template-columns:44px_1fr_auto] [gap:14px] [align-items:center] [border-block:1px_solid_var(--color-border)] [padding:20px_0] [&_>_svg]:[color:var(--color-primary)] [&_>_div]:[display:grid] [&_>_div]:[gap:4px] [&_>_div_>_span]:[color:var(--color-ink-muted)] [@media(max-width:_599px)]:[grid-template-columns:38px_1fr] [@media(max-width:_599px)]:[&_>_.status]:[grid-column:2] [@media(max-width:_599px)]:[&_>_.status]:[justify-self:start]',
  'bottom-nav':
    'hidden [@media(max-width:_899px)]:[position:fixed] [@media(max-width:_899px)]:[z-index:30] [@media(max-width:_899px)]:[bottom:0] [@media(max-width:_899px)]:[left:0] [@media(max-width:_899px)]:[right:0] [@media(max-width:_899px)]:[min-height:66px] [@media(max-width:_899px)]:[padding:6px_max(10px,_env(safe-area-inset-right))_calc(6px_+_env(safe-area-inset-bottom))_max(10px,_env(safe-area-inset-left))] [@media(max-width:_899px)]:[background:rgba(255,_252,_245,_0.97)] [@media(max-width:_899px)]:[border-top:1px_solid_var(--color-border)] [@media(max-width:_899px)]:[display:grid] [@media(max-width:_899px)]:[grid-template-columns:repeat(4,_1fr)] [@media(max-width:_899px)]:[box-shadow:var(--shadow-sheet)] [@media(max-width:_899px)]:[&_a]:[min-height:48px] [@media(max-width:_899px)]:[&_a]:[display:grid] [@media(max-width:_899px)]:[&_a]:[place-items:center] [@media(max-width:_899px)]:[&_a]:[align-content:center] [@media(max-width:_899px)]:[&_a]:[gap:2px] [@media(max-width:_899px)]:[&_a]:[color:var(--color-ink-muted)] [@media(max-width:_899px)]:[&_a]:[text-decoration:none] [@media(max-width:_899px)]:[&_a]:[font-size:0.68rem] [@media(max-width:_899px)]:[&_a.active]:[color:var(--color-primary)] [@media(max-width:_899px)]:[&_a.active]:[font-weight:700]',
  'brand-mark':
    'inline-grid size-8.5 place-items-center bg-primary font-bold text-surface [border-radius:50%_50%_50%_12%] [@media(max-width:_599px)]:[width:31px] [@media(max-width:_599px)]:[height:31px]',
  'cache-notice':
    '[display:grid] [grid-template-columns:30px_1fr_auto] [gap:12px] [align-items:center] [padding:14px_16px] [background:#edf4f7] [border-left:4px_solid_var(--color-info)] [margin-top:16px] [&.warning]:[background:#fff7ef] [&.warning]:[border-color:var(--color-warning)] [&_>_svg]:[color:var(--color-info)] [&.warning_>_svg]:[color:var(--color-warning)] [&_div]:[display:grid] [&_span]:[color:var(--color-ink-muted)] [&_span]:[font-size:0.84rem] [@media(max-width:_599px)]:[grid-template-columns:28px_1fr] [@media(max-width:_599px)]:[&_.text-button]:[grid-column:2] [@media(max-width:_599px)]:[&_.text-button]:[justify-self:start]',
  'card-eyebrow':
    'mb-2.5 text-[0.78rem] font-bold tracking-[0.12em] text-primary uppercase',
  'checking-state':
    '[text-align:center] [padding:30px_0] [&_>_p]:[color:var(--color-ink-muted)]',
  choice:
    '[display:grid] [grid-template-columns:24px_1fr_22px] [gap:12px] [align-items:center] [min-height:72px] [border:1px_solid_var(--color-border)] [background:var(--color-surface)] [padding:12px_16px] [margin-bottom:8px] [border-radius:9px] [cursor:pointer] [&.selected]:[border-color:var(--color-primary)] [&.selected]:[box-shadow:inset_4px_0_var(--color-primary)] [&_input]:[accent-color:var(--color-primary)] [&_input]:[width:18px] [&_input]:[height:18px] [&_span]:[display:grid] [&_small]:[color:var(--color-ink-muted)] [&_>_svg]:[color:var(--color-primary)] [&_>_svg]:[opacity:0] [&.selected_>_svg]:[opacity:1]',
  'choice-list':
    '[border:0] [padding:0] [margin:0_0_30px] [&_legend]:[font-weight:700] [&_legend]:[margin-bottom:12px]',
  'claim-review':
    '[border-top:1px_solid_var(--color-border)] [margin-bottom:26px] [&_>_div]:[display:flex] [&_>_div]:[justify-content:space-between] [&_>_div]:[align-items:center] [&_>_div]:[gap:18px] [&_>_div]:[padding:14px_0] [&_>_div]:[border-bottom:1px_solid_var(--color-border)] [&_>_div_>_span]:[color:var(--color-ink-muted)] [&_strong]:[text-align:right] [@media(max-width:_599px)]:[&_>_div]:[align-items:start]',
  'comparison-desktop':
    '[overflow-x:auto] [border:1px_solid_var(--color-border)] [background:var(--color-surface)] [border-radius:var(--radius-sheet)] [&_table]:[width:100%] [&_table]:[border-collapse:collapse] [&_table]:[min-width:780px] [&_th]:[padding:18px_14px] [&_th]:[text-align:left] [&_th]:[border-bottom:1px_solid_var(--color-border)] [&_th]:[vertical-align:top] [&_td]:[padding:18px_14px] [&_td]:[text-align:left] [&_td]:[border-bottom:1px_solid_var(--color-border)] [&_td]:[vertical-align:top] [&_thead_th]:[background:var(--color-surface-muted)] [&_thead_th]:[font-size:0.78rem] [&_tbody_th]:[width:150px] [&_tbody_th_.status]:[display:flex] [&_tbody_th_.status]:[margin-top:4px] [&_.mismatch-row]:[background:#fff7ef] [&_.mismatch-row_td]:[color:var(--color-danger)] [&_.mismatch-row_td]:[font-weight:650] [@media(max-width:_599px)]:[display:none]',
  'comparison-mobile':
    '[display:none] [@media(max-width:_599px)]:[display:grid] [@media(max-width:_599px)]:[gap:12px]',
  'completion-page':
    '[text-align:center] [&_.page-header]:[text-align:left] [@media(max-width:_599px)]:[&_.outcome-mark]:[margin-top:10px]',
  'connection-line':
    "[min-width:60px] [height:1px] [background:var(--color-border)] [position:relative] [&::after]:[content:''] [&::after]:[width:7px] [&::after]:[height:7px] [&::after]:[background:var(--color-accent)] [&::after]:[border-radius:50%] [&::after]:[position:absolute] [&::after]:[right:45%] [&::after]:[top:-3px]",
  'connection-summary':
    '[display:flex] [align-items:center] [gap:12px] [&_span:not(.connection-line)]:[display:grid] [&_span:not(.connection-line)]:[justify-items:center] [&_span:not(.connection-line)]:[gap:5px] [&_span:not(.connection-line)]:[font-size:0.75rem] [&_svg]:[color:var(--color-primary)] [@media(max-width:_599px)]:[grid-column:1/-1] [@media(max-width:_599px)]:[order:3] [@media(max-width:_599px)]:[justify-content:center] [@media(max-width:_599px)]:[padding-top:14px] [@media(max-width:_599px)]:[border-top:1px_solid_var(--color-border)]',
  'credential-card':
    '[border-block:1px_solid_var(--color-border)] [background:repeating-linear-gradient(_0deg,_var(--color-surface)_0,_var(--color-surface)_43px,_rgba(216,_210,_195,_0.5)_44px_)] [display:grid] [grid-template-columns:1fr_1fr] [gap:18px] [padding:20px_0] [margin:26px_0_15px] [font-variant-numeric:tabular-nums] [&_span]:[color:var(--color-ink-muted)] [&_span]:[font-size:0.83rem] [&_strong]:[text-align:right] [@media(max-width:_599px)]:[font-size:0.9rem]',
  'current-status':
    '[border-block:1px_solid_var(--color-border)] [padding:20px_0] [margin-bottom:32px] [&_p]:[color:var(--color-ink-muted)] [&_p]:[margin-bottom:4px] [&_h2]:[margin-bottom:12px]',
  'danger-text': '[color:var(--color-danger)]',
  'dashboard-grid':
    '[display:grid] [grid-template-columns:0.9fr_1.1fr] [border-block:1px_solid_var(--color-border)] [margin:8px_0_42px] [@media(max-width:_599px)]:[display:block] [@media(max-width:_599px)]:[border:0]',
  declaration:
    '[display:grid] [grid-template-columns:22px_1fr] [gap:12px] [background:var(--color-surface-muted)] [padding:16px] [border-radius:8px] [cursor:pointer] [&_input]:[width:19px] [&_input]:[height:19px] [&_input]:[accent-color:var(--color-primary)] [&_input]:[margin-top:3px]',
  'destination-index':
    '[color:var(--color-primary)] [font-weight:750] [font-variant-numeric:tabular-nums]',
  'destination-list':
    '[border-top:1px_solid_var(--color-border)] [margin:12px_0_20px] [&_>_div]:[min-height:72px] [&_>_div]:[display:grid] [&_>_div]:[grid-template-columns:44px_1fr_auto] [&_>_div]:[align-items:center] [&_>_div]:[gap:12px] [&_>_div]:[border-bottom:1px_solid_var(--color-border)] [&_span:nth-child(2)]:[display:grid] [&_small]:[color:var(--color-ink-muted)] [&.animating]:[text-align:left] [&.animating_>_div]:[opacity:0] [&.animating_>_div]:[animation:row-in_0.4s_ease_forwards] [&.animating_svg]:[animation:spin_1s_linear_infinite] [&.animating_svg]:[width:18px] [@media(max-width:_599px)]:[&_>_div]:[grid-template-columns:34px_1fr] [@media(max-width:_599px)]:[&_>_div]:[padding:10px_0] [@media(max-width:_599px)]:[&_>_div_>_.status]:[grid-column:2]',
  'detail-sheet':
    '[width:min(520px,_100%)] [height:100%] [overflow:auto] [background:var(--color-canvas)] [padding:clamp(30px,_5vw,_58px)] [box-shadow:var(--shadow-sheet)] [position:relative] [animation:sheet-in_0.28s_ease-out] [&_h2]:[margin-bottom:12px] [&_>_p:not(.eyebrow)]:[color:var(--color-ink-muted)] [&_details]:[border-block:1px_solid_var(--color-border)] [&_details]:[padding:14px_0] [&_details]:[margin:24px_0] [@media(max-width:_599px)]:[align-self:end] [@media(max-width:_599px)]:[width:100%] [@media(max-width:_599px)]:[height:min(82vh,_720px)] [@media(max-width:_599px)]:[border-radius:18px_18px_0_0] [@media(max-width:_599px)]:[padding:38px_20px_28px] [@media(max-width:_599px)]:[animation:sheet-up_0.28s_ease-out]',
  'dot-a': '[top:8px] [right:10px]',
  'dot-b': '[left:-5px] [bottom:32px]',
  'dot-c': '[right:-5px] [bottom:28px]',
  'eligibility-card':
    '[&_>_svg]:[width:54px] [&_>_svg]:[height:54px] [&_>_svg]:[color:var(--color-primary)] [&_>_svg]:[margin-bottom:18px] [&_h2]:[margin:9px_0_5px] [&_>_div_>_p]:[color:var(--color-ink-muted)] [&_ul]:[margin:22px_0] [&_ul]:[padding-left:22px] [&_ul]:[display:grid] [&_ul]:[gap:10px]',
  'employer-ledger-head':
    '[display:flex] [align-items:end] [justify-content:space-between] [gap:18px] [margin-bottom:12px] [&_>_div:first-child]:[display:flex] [&_>_div:first-child]:[gap:12px] [&_>_div:first-child]:[align-items:center] [&_>_div:first-child_>_svg]:[color:var(--color-primary)] [&_span]:[display:grid] [&_span]:[gap:3px] [&_>_div:last-child]:[display:grid] [&_>_div:last-child]:[gap:3px] [&_h2]:[margin:0] [&_>_div:last-child]:[text-align:right] [&_small]:[color:var(--color-ink-muted)] [&_strong]:[font-size:1.3rem] [&_strong]:[font-variant-numeric:tabular-nums] [@media(max-width:_599px)]:[align-items:start]',
  'employment-node':
    '[width:44px] [height:44px] [z-index:1] [display:grid] [place-items:center] [border:1px_solid_var(--color-border)] [border-radius:50%] [background:var(--color-canvas)] [color:var(--color-primary)] [@media(max-width:_599px)]:[width:38px] [@media(max-width:_599px)]:[height:38px]',
  'employment-timeline':
    "[list-style:none] [padding:0] [margin:0] [&_li]:[display:grid] [&_li]:[grid-template-columns:48px_1fr] [&_li]:[gap:15px] [&_li]:[position:relative] [&_li]:[padding-bottom:28px] [&_li::after]:[content:''] [&_li::after]:[position:absolute] [&_li::after]:[left:21px] [&_li::after]:[top:45px] [&_li::after]:[bottom:0] [&_li::after]:[width:1px] [&_li::after]:[background:var(--color-border)] [&_li:last-child::after]:[display:none] [&_article]:[border:1px_solid_var(--color-border)] [&_article]:[border-radius:var(--radius-sheet)] [&_article]:[background:var(--color-surface)] [&_article]:[padding:20px] [&_h2]:[margin:0] [&_h2]:[font-size:1.18rem] [&_.section-title-row_small]:[color:var(--color-ink-muted)] [&_dl]:[display:grid] [&_dl]:[grid-template-columns:repeat(3,_1fr)] [&_dl]:[margin:18px_0] [&_dl]:[border-block:1px_solid_var(--color-border)] [&_dl_div]:[display:grid] [&_dl_div]:[gap:4px] [&_dl_div]:[padding:13px_10px_13px_0] [&_dt]:[color:var(--color-ink-muted)] [&_dt]:[font-size:0.78rem] [&_dd]:[margin:0] [&_dd]:[font-weight:700] [@media(max-width:_599px)]:[&_li]:[grid-template-columns:40px_1fr] [@media(max-width:_599px)]:[&_li]:[gap:9px] [@media(max-width:_599px)]:[&_li::after]:[left:18px] [@media(max-width:_599px)]:[&_article]:[padding:15px] [@media(max-width:_599px)]:[&_dl]:[grid-template-columns:1fr]",
  'empty-ledger':
    '[border-block:1px_solid_var(--color-border)] [padding:48px_0] [text-align:center] [&_>_svg]:[color:var(--color-success)] [&_>_svg]:[width:42px] [&_>_svg]:[height:42px]',
  'error-banner':
    'sticky top-18 z-19 flex min-h-10 items-center justify-center gap-2.25 bg-info px-4.5 py-1.75 text-[0.85rem] text-white bg-danger [&_button]:ml-3.5 [&_button]:rounded-[5px] [&_button]:border [&_button]:border-white/50 [&_button]:bg-transparent [&_button]:text-inherit [@media(max-width:_899px)]:[top:64px]',
  'error-page': '[max-width:650px] [margin:15vh_auto] [padding:30px]',
  eyebrow:
    'mb-2.5 text-[0.78rem] font-bold tracking-[0.12em] text-primary uppercase',
  'field-card':
    '[@media(max-width:_599px)]:[border:1px_solid_var(--color-border)] [@media(max-width:_599px)]:[border-radius:var(--radius-sheet)] [@media(max-width:_599px)]:[background:var(--color-surface)] [@media(max-width:_599px)]:[padding:16px] [@media(max-width:_599px)]:[&.mismatch-row]:[border-left:4px_solid_var(--color-danger)] [@media(max-width:_599px)]:[&.mismatch-row]:[background:#fff8f1] [@media(max-width:_599px)]:[&_.arrow-link]:[margin-top:16px]',
  'field-card-head':
    '[@media(max-width:_599px)]:[display:flex] [@media(max-width:_599px)]:[justify-content:space-between] [@media(max-width:_599px)]:[align-items:center] [@media(max-width:_599px)]:[margin-bottom:12px] [@media(max-width:_599px)]:[&_h2]:[margin:0] [@media(max-width:_599px)]:[&_h2]:[font-size:1.1rem]',
  'field-help': '[color:var(--color-ink-muted)]',
  'field-label':
    '[display:flex] [justify-content:space-between] [font-weight:700] [margin:18px_0_7px] [&_small]:[color:var(--color-ink-muted)] [&_small]:[font-weight:500] [@media(min-width:_900px)_and_(max-height:_1100px)]:[margin-top:14px]',
  'field-value':
    '[@media(max-width:_599px)]:[display:flex] [@media(max-width:_599px)]:[justify-content:space-between] [@media(max-width:_599px)]:[gap:12px] [@media(max-width:_599px)]:[padding:9px_0] [@media(max-width:_599px)]:[border-bottom:1px_solid_var(--color-border)]',
  'financial-table':
    '[overflow-x:auto] [border:1px_solid_var(--color-border)] [border-radius:var(--radius-sheet)] [background:var(--color-surface)] [&_table]:[width:100%] [&_table]:[border-collapse:collapse] [&_table]:[min-width:720px] [&_caption]:[text-align:left] [&_caption]:[padding:14px_16px] [&_caption]:[font-weight:700] [&_caption]:[background:var(--color-surface-muted)] [&_th]:[padding:14px_13px] [&_th]:[text-align:right] [&_th]:[border-top:1px_solid_var(--color-border)] [&_th]:[font-variant-numeric:tabular-nums] [&_td]:[padding:14px_13px] [&_td]:[text-align:right] [&_td]:[border-top:1px_solid_var(--color-border)] [&_td]:[font-variant-numeric:tabular-nums] [&_th:first-child]:[text-align:left] [&_thead_th]:[color:var(--color-ink-muted)] [&_thead_th]:[font-size:0.77rem] [&_.missing-row]:[background:#fff8f1] [&_tfoot_td]:[font-weight:700] [@media(max-width:_599px)]:[overflow:visible] [@media(max-width:_599px)]:[border:0] [@media(max-width:_599px)]:[background:transparent] [@media(max-width:_599px)]:[&_table]:[min-width:0] [@media(max-width:_599px)]:[&_thead]:[position:absolute] [@media(max-width:_599px)]:[&_thead]:[width:1px] [@media(max-width:_599px)]:[&_thead]:[height:1px] [@media(max-width:_599px)]:[&_thead]:[overflow:hidden] [@media(max-width:_599px)]:[&_thead]:[clip:rect(0_0_0_0)] [@media(max-width:_599px)]:[&_tbody]:[display:grid] [@media(max-width:_599px)]:[&_tbody]:[gap:10px] [@media(max-width:_599px)]:[&_tbody_tr]:[display:grid] [@media(max-width:_599px)]:[&_tbody_tr]:[grid-template-columns:1fr_1fr] [@media(max-width:_599px)]:[&_tbody_tr]:[border:1px_solid_var(--color-border)] [@media(max-width:_599px)]:[&_tbody_tr]:[border-radius:8px] [@media(max-width:_599px)]:[&_tbody_tr]:[background:var(--color-surface)] [@media(max-width:_599px)]:[&_tbody_tr]:[padding:12px] [@media(max-width:_599px)]:[&_th]:[display:grid] [@media(max-width:_599px)]:[&_th]:[text-align:right] [@media(max-width:_599px)]:[&_th]:[padding:8px_0] [@media(max-width:_599px)]:[&_th]:[border-top:0] [@media(max-width:_599px)]:[&_td]:[display:grid] [@media(max-width:_599px)]:[&_td]:[text-align:right] [@media(max-width:_599px)]:[&_td]:[padding:8px_0] [@media(max-width:_599px)]:[&_td]:[border-top:0] [@media(max-width:_599px)]:[&_tbody_th]:[grid-column:1/-1] [@media(max-width:_599px)]:[&_tbody_th]:[border-bottom:1px_solid_var(--color-border)] [@media(max-width:_599px)]:[&_td::before]:[content:attr(data-label)] [@media(max-width:_599px)]:[&_td::before]:[color:var(--color-ink-muted)] [@media(max-width:_599px)]:[&_td::before]:[font-size:0.73rem] [@media(max-width:_599px)]:[&_td::before]:[font-weight:500] [@media(max-width:_599px)]:[&_tfoot]:[display:block] [@media(max-width:_599px)]:[&_tfoot]:[margin-top:10px] [@media(max-width:_599px)]:[&_tfoot_tr]:[display:flex] [@media(max-width:_599px)]:[&_tfoot_tr]:[justify-content:space-between] [@media(max-width:_599px)]:[&_tfoot_tr]:[border-block:1px_solid_var(--color-border)] [@media(max-width:_599px)]:[&_tfoot_th]:[display:block] [@media(max-width:_599px)]:[&_tfoot_td]:[display:block]',
  'global-header':
    'sticky top-0 z-20 flex h-18 items-center justify-between border-b border-border bg-surface/90 px-6 backdrop-blur-md [@media(max-width:_899px)]:[height:64px] [@media(max-width:_899px)]:[padding-inline:20px] [@media(max-width:_599px)]:[padding-inline:16px]',
  'handoff-panel':
    '[display:grid] [grid-template-columns:42px_1fr] [gap:14px] [padding:20px] [background:var(--color-surface-muted)] [border-radius:var(--radius-sheet)] [margin:25px_0] [&_>_svg]:[color:var(--color-success)] [&_h2]:[margin:0_0_5px] [&_p]:[color:var(--color-ink-muted)] [&_p]:[margin:0]',
  'header-tools': 'flex items-center gap-4.5',
  'history-glyph':
    '[width:40px] [height:40px] [display:grid] [place-items:center] [color:var(--color-primary)] [&_svg]:[width:23px]',
  hydration:
    '[min-height:100vh] [display:grid] [place-content:center] [justify-items:center] [gap:14px] [&_p]:[color:var(--color-ink-muted)]',
  'icon-button':
    '[width:42px] [height:42px] [display:grid] [place-items:center] [border:1px_solid_var(--color-border)] [border-radius:50%] [background:var(--color-surface)] [cursor:pointer] [&_svg]:[width:20px]',
  'identifier-help':
    '[min-height:20px] [margin:6px_0_18px] [color:var(--color-ink-muted)] [font-size:0.78rem] [font-variant-numeric:tabular-nums] [@media(min-width:_900px)_and_(max-height:_1100px)]:[margin-bottom:14px]',
  'identifier-input':
    "[width:100%] [height:56px] [border:1px_solid_var(--color-border)] [border-radius:9px] [background:var(--color-surface)] [padding:9px_15px] [font-size:1.08rem] [font-variant-numeric:tabular-nums] [letter-spacing:0.035em] [transition:border-color_0.18s,_box-shadow_0.18s] [&:focus]:[border-color:var(--color-primary)] [&:focus]:[box-shadow:0_0_0_4px_rgba(38,_91,_67,_0.08)] [&[aria-invalid='true']]:[border-color:var(--color-danger)]",
  'identity-orbit':
    '[width:104px] [height:104px] [border:1px_solid_rgba(255,_255,_255,_0.35)] [border-radius:50%] [display:grid] [place-items:center] [color:var(--color-accent)] [position:relative] [transform:translateY(-14px)] [box-shadow:0_0_0_20px_rgba(255,_255,_255,_0.025)]',
  'identity-score-card':
    '[padding:28px_24px_28px_0] [border-right:1px_solid_var(--color-border)] [display:grid] [grid-template-columns:112px_1fr_auto] [align-items:center] [gap:18px] [text-decoration:none] [&_>_svg]:[color:var(--color-primary)] [&_h2]:[margin:4px_0] [&_h2]:[font-size:1.2rem] [&_p]:[color:var(--color-ink-muted)] [&_p]:[margin:0] [@media(max-width:_599px)]:[grid-template-columns:92px_1fr_auto] [@media(max-width:_599px)]:[border:1px_solid_var(--color-border)] [@media(max-width:_599px)]:[border-radius:var(--radius-sheet)] [@media(max-width:_599px)]:[background:var(--color-surface)] [@media(max-width:_599px)]:[padding:18px_14px] [@media(max-width:_599px)]:[margin-bottom:14px]',
  'identity-summary':
    '[display:grid] [grid-template-columns:140px_1fr_auto] [align-items:center] [gap:24px] [padding:20px_0] [border-block:1px_solid_var(--color-border)] [margin-bottom:28px] [&_p]:[margin:5px_0_0] [&_p]:[color:var(--color-ink-muted)] [@media(max-width:_599px)]:[grid-template-columns:1fr_auto]',
  'inline-edit':
    '[background:var(--color-surface-muted)] [padding:16px] [margin-bottom:16px] [display:grid] [gap:8px] [&_label]:[font-weight:700] [&_input]:[min-height:46px] [&_input]:[border:1px_solid_var(--color-border)] [&_input]:[border-radius:7px] [&_input]:[padding:8px_10px] [&_input]:[background:var(--color-surface)] [&_input]:[color:var(--color-ink)] [&_input]:[font:inherit] [&_>_div]:[display:flex] [&_>_div]:[justify-content:flex-end] [&_>_div]:[gap:8px]',
  'issue-explanation':
    '[border-left:4px_solid_var(--color-danger)] [padding:8px_0_8px_18px] [margin-bottom:28px] [&_h2]:[margin:8px_0_5px] [&_p]:[color:var(--color-ink-muted)] [&_p]:[margin:0]',
  'journey-intro':
    '[&_ul]:[margin:22px_0] [&_ul]:[padding-left:22px] [&_ul]:[display:grid] [&_ul]:[gap:10px] [text-align:left] [&_.large-glyph]:[margin-bottom:20px]',
  'journey-progress':
    '[display:flex] [justify-content:space-between] [align-items:center] [color:var(--color-ink-muted)] [font-size:0.8rem] [margin:-14px_0_30px] [&_>_div]:[display:flex] [&_>_div]:[gap:4px] [&_i]:[width:36px] [&_i]:[height:3px] [&_i]:[background:var(--color-border)] [&_i.on]:[background:var(--color-primary)] [@media(max-width:_599px)]:[&_i]:[width:24px]',
  'kyc-strip':
    '[background:var(--color-surface-muted)] [border-radius:var(--radius-sheet)] [padding:20px] [&_h2]:[margin-bottom:12px] [&_>_div]:[display:flex] [&_>_div]:[gap:20px] [&_>_div]:[flex-wrap:wrap] [&_>_div]:[margin-bottom:14px] [&_>_div_span]:[display:flex] [&_>_div_span]:[align-items:center] [&_>_div_span]:[gap:6px] [&_>_div_span]:[font-weight:650] [&_>_div_span]:[font-size:0.86rem] [&_>_div_svg]:[width:17px] [&_>_div_svg]:[color:var(--color-success)] [@media(max-width:_599px)]:[&_>_div]:[display:grid] [@media(max-width:_599px)]:[&_>_div]:[gap:8px]',
  'language-control':
    'flex items-center gap-1.5 [&_select]:border-0 [&_select]:bg-transparent [&_select]:p-2 [&_select]:font-[650] [&_select]:text-ink [@media(max-width:_599px)]:[&_svg]:[display:none] [@media(max-width:_599px)]:[&_select]:[max-width:88px]',
  'large-glyph':
    '[width:58px] [height:58px] [border-radius:50%] [display:grid] [place-items:center] [background:var(--color-primary)] [color:#fff]',
  'loading-line':
    "[width:220px] [height:3px] [overflow:hidden] [background:var(--color-border)] [&::after]:[content:''] [&::after]:[display:block] [&::after]:[width:45%] [&::after]:[height:100%] [&::after]:[background:var(--color-primary)] [&::after]:[animation:loading_1s_ease-in-out_infinite_alternate]",
  'main-content':
    'min-w-0 aria-busy:cursor-progress [@media(max-width:_899px)]:[padding-bottom:76px]',
  'mini-timeline': '[border-top:1px_solid_var(--color-border)]',
  'mismatch-callout':
    '[display:grid] [grid-template-columns:160px_1fr_auto] [align-items:center] [gap:18px] [border-bottom:1px_solid_var(--color-danger)] [padding:22px_4px] [margin-top:26px] [text-decoration:none] [&_>_span:first-child]:[display:flex] [&_>_span:first-child]:[gap:8px] [&_>_span:first-child]:[align-items:center] [&_>_span:first-child]:[color:var(--color-danger)] [&_p]:[margin:0] [&_p]:[color:var(--color-ink-muted)] [&_.arrow-link]:[white-space:nowrap] [@media(max-width:_599px)]:[grid-template-columns:1fr] [@media(max-width:_599px)]:[gap:9px]',
  'mock-account-icon':
    '[width:34px] [height:34px] [flex:0_0_34px] [display:grid] [place-items:center] [border-radius:7px] [background:var(--color-surface-muted)] [color:var(--color-primary)] [transition:background_0.18s,_color_0.18s]',
  'mock-account-indicator':
    '[width:28px] [height:28px] [flex:0_0_28px] [display:grid] [place-items:center] [border-radius:50%] [background:#e5efe8] [color:var(--color-success)]',
  'mock-account-item':
    '[min-height:62px] [padding:10px_11px_10px_13px] [border-radius:7px] [display:flex] [align-items:center] [justify-content:space-between] [gap:14px] [cursor:default] [outline:none] [user-select:none] [&[data-highlighted]]:[background:var(--color-surface-muted)] [&[data-highlighted]]:[color:var(--color-primary-strong)] [&[data-selected]]:[color:var(--color-primary)]',
  'mock-account-item-copy':
    '[min-width:0] [display:grid] [gap:1px] [&_strong]:[font-weight:700] [&_small]:[color:var(--color-ink-muted)] [&_small]:[font-size:0.84rem] [&_small]:[font-weight:500] [&_small]:[line-height:1.35]',
  'mock-account-list': '[outline:none]',
  'mock-account-popup':
    '[width:var(--anchor-width)] [padding:6px] [border:1px_solid_var(--color-border)] [border-radius:10px] [background:var(--color-surface)] [color:var(--color-ink)] [box-shadow:0_18px_48px_rgba(23,_35,_29,_0.16),_0_3px_10px_rgba(23,_35,_29,_0.08)] [transform-origin:var(--transform-origin)] [transition:opacity_0.16s,_transform_0.16s] [&[data-starting-style]]:[opacity:0] [&[data-starting-style]]:[transform:translateY(-4px)_scale(0.98)] [&[data-ending-style]]:[opacity:0] [&[data-ending-style]]:[transform:translateY(-4px)_scale(0.98)]',
  'mock-account-positioner': '[z-index:60] [outline:none]',
  'mock-account-select':
    '[width:100%] [margin-top:14px] [@media(min-width:_900px)_and_(max-height:_1100px)]:[margin-top:12px]',
  'mock-account-trigger':
    '[width:100%] [height:56px] [border:1px_solid_var(--color-border)] [border-radius:9px] [background:var(--color-surface)] [color:var(--color-ink)] [padding:9px_11px_9px_15px] [display:flex] [align-items:center] [justify-content:space-between] [gap:12px] [text-align:left] [cursor:pointer] [box-shadow:0_5px_18px_rgba(23,_35,_29,_0.045)] [transition:border-color_0.18s,_box-shadow_0.18s] [&:hover]:[border-color:#bdb5a3] [&[data-popup-open]]:[border-color:var(--color-primary)] [&[data-popup-open]]:[box-shadow:0_0_0_4px_rgba(38,_91,_67,_0.08)] [&[data-popup-open]_.mock-account-icon]:[background:var(--color-primary)] [&[data-popup-open]_.mock-account-icon]:[color:#fff]',
  'mock-account-value':
    '[min-width:0] [overflow:hidden] [text-overflow:ellipsis] [white-space:nowrap] [font-size:1rem] [font-weight:650] [&[data-placeholder]]:[color:var(--color-ink-muted)] [&[data-placeholder]]:[font-weight:600]',
  'money-input':
    '[height:60px] [display:grid] [grid-template-columns:48px_1fr] [border:1px_solid_var(--color-border)] [border-radius:9px] [overflow:hidden] [background:var(--color-surface)] [&_span]:[display:grid] [&_span]:[place-items:center] [&_span]:[border-right:1px_solid_var(--color-border)] [&_span]:[font-size:1.3rem] [&_input]:[border:0] [&_input]:[background:transparent] [&_input]:[padding:10px_14px] [&_input]:[font-size:1.35rem] [&_input]:[font-variant-numeric:tabular-nums] [&_input]:[min-width:0]',
  'money-small':
    '[margin:0] [color:var(--color-ink-muted)] [font-variant-numeric:tabular-nums]',
  'nav-item':
    'flex min-h-11.5 w-full cursor-pointer items-center gap-3 rounded-r-lg border-0 border-l-[3px] border-l-transparent bg-transparent px-3 py-2.25 text-left font-[620] text-ink-muted no-underline hover:bg-surface-muted/75 hover:text-ink [&.active]:border-l-primary [&.active]:bg-surface-muted [&.active]:text-primary',
  'next-event':
    '[display:flex] [align-items:center] [gap:7px] [color:var(--color-info)] [font-size:0.82rem] [margin-top:12px]',
  'nomination-status':
    '[&_>_.large-glyph]:[margin-bottom:16px] [&_h2]:[margin:10px_0_5px] [&_>_p]:[color:var(--color-ink-muted)]',
  'nominee-forms':
    '[&_input]:[min-height:46px] [&_input]:[border:1px_solid_var(--color-border)] [&_input]:[border-radius:7px] [&_input]:[padding:8px_10px] [&_input]:[background:var(--color-surface)] [&_input]:[color:var(--color-ink)] [&_input]:[font:inherit] [&_select]:[min-height:46px] [&_select]:[border:1px_solid_var(--color-border)] [&_select]:[border-radius:7px] [&_select]:[padding:8px_10px] [&_select]:[background:var(--color-surface)] [&_select]:[color:var(--color-ink)] [&_select]:[font:inherit] [display:grid] [gap:16px] [&_fieldset]:[display:grid] [&_fieldset]:[grid-template-columns:1fr_1.5fr] [&_fieldset]:[gap:10px_16px] [&_fieldset]:[border:1px_solid_var(--color-border)] [&_fieldset]:[border-radius:var(--radius-sheet)] [&_fieldset]:[padding:18px] [&_fieldset]:[background:var(--color-surface)] [&_legend]:[font-weight:750] [&_legend]:[padding:0_8px] [&_label]:[align-self:center] [&_label]:[font-weight:650] [&_.text-button]:[grid-column:2] [&_.text-button]:[justify-self:start] [@media(max-width:_599px)]:[&_fieldset]:[grid-template-columns:1fr] [@media(max-width:_599px)]:[&_.text-button]:[grid-column:1]',
  'nominee-summary':
    '[border-top:1px_solid_var(--color-border)] [margin:22px_0] [&_>_div]:[display:grid] [&_>_div]:[grid-template-columns:38px_1fr_auto] [&_>_div]:[gap:12px] [&_>_div]:[align-items:center] [&_>_div]:[min-height:76px] [&_>_div]:[border-bottom:1px_solid_var(--color-border)] [&_svg]:[color:var(--color-primary)] [&_span]:[display:grid] [&_small]:[color:var(--color-ink-muted)] [&_b]:[font-size:1.15rem] [&_b]:[font-variant-numeric:tabular-nums]',
  'offline-banner':
    'sticky top-18 z-19 flex min-h-10 items-center justify-center gap-2.25 bg-info px-4.5 py-1.75 text-[0.85rem] text-white [@media(max-width:_899px)]:[top:64px]',
  'orbit-dot':
    '[width:11px] [height:11px] [border-radius:50%] [background:#efc979] [position:absolute] [box-shadow:0_0_0_5px_rgba(239,_201,_121,_0.12)]',
  'otp-helper':
    '[display:flex] [justify-content:space-between] [color:var(--color-ink-muted)] [font-size:0.8rem] [margin:8px_0_20px] [&_span]:[display:flex] [&_span]:[align-items:center] [&_span]:[gap:6px] [@media(max-width:_599px)]:[align-items:start] [@media(max-width:_599px)]:[gap:8px] [@media(max-width:_599px)]:[&_span:last-child]:[white-space:nowrap]',
  'otp-input':
    '[width:100%] [height:56px] [border:1px_solid_var(--color-border)] [border-radius:9px] [background:var(--color-surface)] [padding:9px_15px] [font-size:1.5rem] [letter-spacing:0.38em] [font-variant-numeric:tabular-nums] [&:focus]:[border-color:var(--color-primary)]',
  'outcome-mark':
    '[width:72px] [height:72px] [border-radius:50%] [background:var(--color-success)] [color:white] [display:grid] [place-items:center] [margin:0_auto_18px] [&_svg]:[width:34px] [&_svg]:[height:34px]',
  page: 'mx-auto w-full max-w-300 px-[clamp(32px,4vw,64px)] pt-12 pb-24 [animation:page-in_0.38s_ease_both] [@media(max-width:_899px)]:[padding:38px_clamp(24px,_5vw,_40px)_100px] [@media(max-width:_599px)]:[padding:28px_18px_108px]',
  'page-header': 'mb-8 [@media(max-width:_599px)]:[margin-bottom:26px]',
  'page-subtitle':
    'm-0 max-w-175 text-[1.06rem] text-ink-muted [@media(max-width:_599px)]:[font-size:1rem]',
  'panel-number':
    'mb-2.5 text-[0.78rem] font-bold tracking-[0.12em] text-primary uppercase',
  'passbook-balance':
    "[margin-bottom:0] [&_[data-slot='button']_svg]:[width:18px] [@media(max-width:_599px)]:[align-items:flex-start] [@media(max-width:_599px)]:[gap:15px] [@media(max-width:_599px)]:[&_[data-slot='button']]:[padding-inline:10px]",
  'passbook-employer': '[margin-top:34px]',
  'pending-mark': '[background:var(--color-info)]',
  'percentage-input':
    '[height:48px] [display:grid] [grid-template-columns:1fr_38px] [border:1px_solid_var(--color-border)] [border-radius:8px] [overflow:hidden] [background:var(--color-surface)] [&_input]:[min-width:0] [&_input]:[width:100%] [&_input]:[border:0] [&_input]:[padding:8px] [&_input]:[text-align:right] [&_input]:[font:inherit] [&_input]:[font-size:1.15rem] [&_b]:[display:grid] [&_b]:[place-items:center] [&_b]:[background:var(--color-surface-muted)]',
  'persona-chip':
    'flex items-center gap-1.75 border-l border-border px-2.5 py-1.75 font-[650] no-underline [@media(max-width:_599px)]:[padding-left:8px] [@media(max-width:_599px)]:[&_span]:[display:none]',
  'persona-option':
    '[width:100%] [min-height:92px] [border:1px_solid_var(--color-border)] [background:var(--color-surface)] [border-radius:var(--radius-sheet)] [padding:14px] [display:grid] [grid-template-columns:48px_1fr_22px] [align-items:center] [gap:13px] [text-align:left] [cursor:pointer] [&.selected]:[border-color:var(--color-primary)] [&.selected]:[box-shadow:inset_4px_0_var(--color-primary)] [&.selected]:[background:#f2f7f3] [&_span:nth-child(2)]:[display:grid] [&_small]:[color:var(--color-ink-muted)] [&_small]:[margin-top:3px] [&.selected_.selection-check]:[opacity:1]',
  'persona-options': '[display:grid] [gap:12px] [margin:25px_0]',
  'priority-action':
    '[display:flex] [align-items:center] [gap:8px] [color:var(--color-primary)] [font-weight:700] [white-space:nowrap] [@media(max-width:_599px)]:[grid-column:2]',
  'priority-card':
    '[display:grid] [grid-template-columns:48px_1fr_auto] [gap:18px] [align-items:center] [background:var(--color-surface)] [border:1px_solid_var(--color-border)] [border-left:5px_solid_var(--color-danger)] [border-radius:var(--radius-sheet)] [padding:22px] [color:inherit] [text-decoration:none] [margin-bottom:32px] [transition:border-color_0.18s,_transform_0.18s] [&:hover]:[border-color:var(--color-danger)] [&:hover]:[transform:translateY(-2px)] [&_h2]:[margin:7px_0_5px] [&_p]:[color:var(--color-ink-muted)] [&_p]:[margin-bottom:10px] [@media(max-width:_599px)]:[grid-template-columns:42px_1fr] [@media(max-width:_599px)]:[padding:18px_15px] [@media(max-width:_599px)]:[gap:12px]',
  'priority-icon':
    '[width:46px] [height:46px] [display:grid] [place-items:center] [background:#f7e7e2] [color:var(--color-danger)] [border-radius:50%] [@media(max-width:_599px)]:[width:40px] [@media(max-width:_599px)]:[height:40px]',
  'privacy-panel':
    '[display:flex] [gap:14px] [background:var(--color-surface-muted)] [border-radius:var(--radius-sheet)] [padding:20px] [&_>_svg]:[color:var(--color-primary)] [&_>_svg]:[flex:0_0_auto] [&_h2]:[margin:0_0_5px] [&_p]:[color:var(--color-ink-muted)] [&_p]:[margin:0]',
  'profile-actions':
    "[display:flex] [justify-content:space-between] [margin-top:28px] [&_svg]:[width:18px] [@media(max-width:_599px)]:[display:grid] [@media(max-width:_599px)]:[gap:10px] [@media(max-width:_599px)]:[&_[data-slot='button']]:[width:100%]",
  'profile-avatar':
    '[width:62px] [height:62px] [border-radius:50%] [display:grid] [place-items:center] [color:#fff] [background:var(--color-primary)] [font-size:1.3rem] [font-weight:750]',
  'profile-card':
    '[display:flex] [gap:18px] [align-items:center] [border-block:1px_solid_var(--color-border)] [padding:22px_0] [&_h2]:[margin:0_0_2px] [&_p]:[margin:0_0_6px] [&_p]:[color:var(--color-ink-muted)]',
  'profile-identity-band':
    '[display:grid] [grid-template-columns:62px_1fr_auto] [gap:18px] [align-items:center] [border-block:1px_solid_var(--color-border)] [padding:24px_0] [&_>_div:nth-child(2)]:[display:grid] [&_>_div:nth-child(2)]:[gap:4px] [&_>_div:nth-child(2)_>_span]:[color:var(--color-ink-muted)] [&_strong]:[font-size:1.35rem] [&_strong]:[letter-spacing:0.03em] [@media(max-width:_599px)]:[grid-template-columns:50px_1fr] [@media(max-width:_599px)]:[&_>_.status]:[grid-column:2] [@media(max-width:_599px)]:[&_>_.status]:[justify-self:start]',
  'profile-monogram':
    '[width:58px] [height:58px] [border-radius:50%] [display:grid] [place-items:center] [background:var(--color-primary)] [color:#fff] [@media(max-width:_599px)]:[width:48px] [@media(max-width:_599px)]:[height:48px]',
  'propagation-progress':
    '[text-align:center] [padding:30px_0] [&_>_p]:[color:var(--color-ink-muted)]',
  'prototype-disclosure':
    '[display:flex] [gap:10px] [border-top:1px_solid_rgba(255,_255,_255,_0.16)] [padding-top:16px] [font-size:0.8rem] [color:rgba(255,_255,_255,_0.72)] [&_p]:[margin:0] [&_p]:[max-width:580px] [&_strong]:[color:#fff] [@media(min-width:_900px)_and_(max-height:_1100px)]:[padding-top:12px] [@media(max-width:_599px)]:[padding-top:18px]',
  'prototype-tag':
    'rounded-[3px] border border-primary px-1.5 py-0.5 text-[0.62rem] tracking-[0.1em] text-primary uppercase [@media(max-width:_599px)]:[display:none]',
  'readiness-banner':
    '[display:grid] [grid-template-columns:45px_1fr] [gap:15px] [padding:20px] [border:1px_solid] [border-radius:var(--radius-sheet)] [margin-bottom:28px] [&.ready]:[background:#f2f8f3] [&.ready]:[border-color:#b9d0c1] [&.blocked]:[background:#fff3ef] [&.blocked]:[border-color:#ddb9ad] [&_>_svg]:[width:35px] [&_>_svg]:[height:35px] [&_>_svg]:[color:var(--color-success)] [&.blocked_>_svg]:[color:var(--color-danger)] [&_h2]:[margin:8px_0_5px] [&_p]:[color:var(--color-ink-muted)] [&_p]:[margin:0] [@media(max-width:_599px)]:[grid-template-columns:36px_1fr] [@media(max-width:_599px)]:[padding:16px_13px]',
  receipt:
    '[text-align:left] [border:1px_solid_var(--color-border)] [background:var(--color-surface)] [border-radius:var(--radius-sheet)] [margin:26px_0] [overflow:hidden] [&_dl]:[margin:0] [&_dl]:[padding:4px_18px] [&_dl_>_div]:[display:grid] [&_dl_>_div]:[grid-template-columns:1fr_1.5fr] [&_dl_>_div]:[gap:15px] [&_dl_>_div]:[border-bottom:1px_solid_var(--color-border)] [&_dl_>_div]:[padding:13px_0] [&_dt]:[color:var(--color-ink-muted)] [&_dd]:[margin:0] [&_dd]:[text-align:right] [&_dd]:[font-weight:650] [@media(max-width:_599px)]:[&_dl_>_div]:[grid-template-columns:1fr] [@media(max-width:_599px)]:[&_dl_>_div]:[gap:3px] [@media(max-width:_599px)]:[&_dd]:[text-align:left]',
  'receipt-head':
    '[display:flex] [justify-content:space-between] [padding:15px_18px] [background:var(--color-surface-muted)] [border-bottom:1px_solid_var(--color-border)] [&_span]:[text-transform:uppercase] [&_span]:[font-size:0.75rem] [&_span]:[letter-spacing:0.1em] [&_strong]:[font-size:0.8rem] [&_strong]:[font-variant-numeric:tabular-nums] [@media(max-width:_599px)]:[display:grid] [@media(max-width:_599px)]:[gap:3px]',
  'receipt-row':
    '[display:flex] [justify-content:space-between] [padding:10px_18px] [border-bottom:1px_solid_var(--color-border)]',
  'record-card-grid':
    '[display:grid] [grid-template-columns:repeat(3,_1fr)] [gap:12px] [margin:28px_0] [&_a]:[min-height:160px] [&_a]:[display:grid] [&_a]:[grid-template-columns:1fr_auto] [&_a]:[align-content:space-between] [&_a]:[gap:20px] [&_a]:[padding:20px] [&_a]:[border:1px_solid_var(--color-border)] [&_a]:[background:var(--color-surface)] [&_a]:[border-radius:var(--radius-sheet)] [&_a]:[color:inherit] [&_a]:[text-decoration:none] [&_a_>_svg:first-child]:[color:var(--color-primary)] [&_a_>_svg:first-child]:[width:30px] [&_a_>_svg:first-child]:[height:30px] [&_a_>_svg:last-child]:[grid-column:2] [&_a_>_svg:last-child]:[grid-row:1/3] [&_a_>_svg:last-child]:[align-self:center] [&_a_span]:[display:grid] [&_a_span]:[gap:5px] [&_small]:[color:var(--color-ink-muted)] [@media(max-width:_599px)]:[grid-template-columns:1fr] [@media(max-width:_599px)]:[&_a]:[min-height:105px]',
  'record-icon':
    '[width:42px] [height:42px] [border-radius:50%] [background:var(--color-surface-muted)] [color:var(--color-primary)] [display:grid] [place-items:center] [&_svg]:[width:21px]',
  'record-ledger':
    '[border-top:1px_solid_var(--color-border)] [margin-bottom:28px] [&_article]:[display:grid] [&_article]:[grid-template-columns:46px_1fr_auto] [&_article]:[gap:15px] [&_article]:[align-items:center] [&_article]:[min-height:112px] [&_article]:[border-bottom:1px_solid_var(--color-border)] [&_article_>_div]:[display:grid] [&_article_>_div]:[gap:4px] [&_h2]:[margin:0] [&_h2]:[font-size:1.12rem] [@media(max-width:_599px)]:[&_article]:[grid-template-columns:38px_1fr] [@media(max-width:_599px)]:[&_article_>_.status]:[grid-column:2] [@media(max-width:_599px)]:[&_article_>_.status]:[justify-self:start]',
  'reference-band':
    '[border-block:1px_solid_var(--color-border)] [display:grid] [padding:18px_0] [margin:25px_0] [&_span]:[color:var(--color-ink-muted)] [&_small]:[color:var(--color-ink-muted)] [&_strong]:[font-size:1.5rem] [&_strong]:[font-variant-numeric:tabular-nums] [&_strong]:[letter-spacing:0.03em] [@media(max-width:_599px)]:[&_strong]:[font-size:1.15rem]',
  'rejection-panel':
    '[display:grid] [grid-template-columns:52px_1fr] [gap:18px] [padding:22px] [background:#fff3ef] [border:1px_solid_#ddb9ad] [border-left:5px_solid_var(--color-danger)] [border-radius:var(--radius-sheet)] [&_>_svg]:[color:var(--color-danger)] [&_>_svg]:[width:42px] [&_>_svg]:[height:42px] [&_h2]:[margin:9px_0_5px] [&_p]:[color:var(--color-ink-muted)] [&_p]:[margin:0]',
  'result-panel': '[text-align:center]',
  'review-value':
    "[border-block:1px_solid_var(--color-border)] [padding:14px_0] [display:grid] [grid-template-columns:1fr_auto_auto] [gap:16px] [align-items:center] [margin-bottom:30px] [&_span]:[color:var(--color-ink-muted)] [&_strong]:[font-size:1.25rem] [@media(max-width:_599px)]:[grid-template-columns:1fr_auto] [@media(max-width:_599px)]:[&_[data-slot='button']]:[grid-column:1/-1] [@media(max-width:_599px)]:[&_[data-slot='button']]:[justify-self:start]",
  'rule-button':
    '[width:100%] [border:0] [background:transparent] [text-align:left] [cursor:pointer] [color:inherit] [&:hover]:[background:var(--color-surface-muted)]',
  'rule-copy':
    '[display:grid] [gap:5px] [&_small]:[color:var(--color-primary)] [&_small]:[font-weight:700]',
  'rule-groups':
    '[&_section_+_section]:[margin-top:28px] [&_h3]:[text-transform:uppercase] [&_h3]:[letter-spacing:0.1em] [&_h3]:[font-size:0.78rem] [&_h3]:[color:var(--color-ink-muted)]',
  'rule-icon':
    '[width:34px] [height:34px] [border-radius:50%] [display:grid] [place-items:center] [color:var(--color-success)] [background:#e5efe8] [&_svg]:[width:17px]',
  'rule-row':
    '[min-height:82px] [display:grid] [grid-template-columns:38px_1fr_auto] [align-items:center] [gap:12px] [border-bottom:1px_solid_var(--color-border)] [&:first-of-type]:[border-top:1px_solid_var(--color-border)] [&.failed_.rule-icon]:[color:var(--color-danger)] [&.failed_.rule-icon]:[background:#f7e7e2] [&_>_div]:[display:grid] [&_>_div]:[gap:5px] [&_details]:[font-size:0.73rem] [&_details]:[color:var(--color-ink-muted)] [&_code]:[color:var(--color-ink)] [@media(max-width:_599px)]:[grid-template-columns:34px_1fr] [@media(max-width:_599px)]:[padding:12px_0] [@media(max-width:_599px)]:[&_>_.status]:[grid-column:2]',
  'safety-note':
    '[display:flex] [gap:8px] [align-items:center] [color:var(--color-ink-muted)] [font-size:0.82rem] [margin:15px_0_28px]',
  'scan-icon':
    '[width:90px] [height:90px] [border:1px_solid_var(--color-border)] [border-radius:50%] [display:grid] [place-items:center] [color:var(--color-primary)] [margin:0_auto_22px] [position:relative] [overflow:hidden] [&_span]:[position:absolute] [&_span]:[width:100%] [&_span]:[height:2px] [&_span]:[background:var(--color-accent)] [&_span]:[animation:scan_1.5s_ease-in-out_infinite] [&_svg]:[width:42px] [&_svg]:[height:42px]',
  'score-inline':
    '[display:flex] [align-items:baseline] [gap:3px] [&_strong]:[font-size:2.4rem] [&_strong]:[line-height:1] [&_strong]:[font-variant-numeric:tabular-nums] [&_span]:[color:var(--color-ink-muted)]',
  'score-ring':
    '[--score:0deg] [width:104px] [height:104px] [border-radius:50%] [display:grid] [place-content:center] [text-align:center] [background:radial-gradient(_circle_closest-side,_var(--color-canvas)_76%,_transparent_77%_100%_),_conic-gradient(var(--color-primary)_var(--score),_var(--color-surface-muted)_0)] [&_span]:[font-size:2rem] [&_span]:[line-height:1] [&_span]:[font-weight:720] [&_small]:[color:var(--color-ink-muted)] [@media(max-width:_599px)]:[width:84px] [@media(max-width:_599px)]:[height:84px] [@media(max-width:_599px)]:[&_span]:[font-size:1.6rem]',
  'section-intro': '[color:var(--color-ink-muted)]',
  'section-kicker':
    'mb-2.5 text-[0.78rem] font-bold tracking-[0.12em] text-primary uppercase [display:flex] [align-items:center] [gap:8px] [margin-bottom:10px] [&_.rule]:[height:1px] [&_.rule]:[background:var(--color-border)] [&_.rule]:[flex:1]',
  'section-title-row':
    '[display:flex] [justify-content:space-between] [align-items:end] [margin-bottom:8px] [&_h2]:[margin:0] [&_a]:[color:var(--color-primary)] [&_a]:[text-decoration:none] [&_a]:[display:flex] [&_a]:[align-items:center] [&_a]:[gap:5px] [&_a]:[font-weight:650] [@media(max-width:_599px)]:[align-items:center]',
  'selection-check': '[color:var(--color-primary)] [opacity:0]',
  'service-history-list':
    '[border-top:1px_solid_var(--color-border)] [&_article]:[min-height:112px] [&_article]:[display:grid] [&_article]:[grid-template-columns:44px_1fr_30px] [&_article]:[gap:14px] [&_article]:[align-items:center] [&_article]:[border-bottom:1px_solid_var(--color-border)] [&_>_article_>_svg]:[width:40px] [&_>_article_>_svg]:[height:40px] [&_>_article_>_svg]:[display:grid] [&_>_article_>_svg]:[place-items:center] [&_>_article_>_svg]:[color:var(--color-primary)] [&_h2]:[margin:8px_0_3px] [&_h2]:[font-size:1.1rem] [&_p]:[color:var(--color-ink-muted)] [&_p]:[margin:0] [&_a]:[color:var(--color-primary)]',
  'service-icon':
    '[width:40px] [height:40px] [border-radius:9px] [display:grid] [place-items:center] [&_svg]:[width:21px] [&.tax]:[background:#e6eef1] [&.tax]:[color:var(--color-info)] [&.pf]:[background:#e5efe8] [&.pf]:[color:var(--color-success)]',
  'service-ledger':
    '[padding-left:24px] [@media(max-width:_599px)]:[padding:0_14px] [@media(max-width:_599px)]:[border:1px_solid_var(--color-border)] [@media(max-width:_599px)]:[border-radius:var(--radius-sheet)] [@media(max-width:_599px)]:[background:var(--color-surface)]',
  'service-row':
    '[min-height:122px] [display:grid] [grid-template-columns:42px_1fr_auto] [gap:13px] [align-items:center] [padding:18px_0] [&_+_.service-row]:[border-top:1px_solid_var(--color-border)] [&_h3]:[margin:3px_0_7px] [@media(max-width:_599px)]:[grid-template-columns:38px_1fr] [@media(max-width:_599px)]:[min-height:112px] [@media(max-width:_599px)]:[&_>_.status]:[grid-column:2]',
  'settings-list':
    '[&_select]:border-0 [&_select]:bg-transparent [&_select]:p-2 [&_select]:font-[650] [&_select]:text-ink [margin:28px_0] [&_section]:[min-height:76px] [&_section]:[display:flex] [&_section]:[justify-content:space-between] [&_section]:[align-items:center] [&_section]:[gap:18px] [&_section]:[border-bottom:1px_solid_var(--color-border)] [&_section_>_div]:[display:grid] [&_section_>_div]:[grid-template-columns:32px_1fr] [&_section_>_div]:[gap:10px] [&_section_>_div]:[align-items:center] [&_section_>_div_>_span]:[display:grid] [&_small]:[color:var(--color-ink-muted)] [&_svg]:[color:var(--color-primary)] [@media(max-width:_599px)]:[&_section]:[align-items:start] [@media(max-width:_599px)]:[&_section]:[padding:15px_0] [@media(max-width:_599px)]:[&_section_>_div]:[grid-template-columns:28px_1fr] [@media(max-width:_599px)]:[&_select]:[max-width:120px]',
  'sheet-backdrop':
    '[position:fixed] [inset:0] [z-index:80] [background:rgba(20,_34,_28,_0.48)] [display:flex] [justify-content:flex-end] [padding-left:20px] [@media(max-width:_599px)]:[padding:0] [@media(max-width:_599px)]:[align-items:flex-end]',
  'sheet-close': '[position:absolute] [right:20px] [top:20px]',
  'shell-grid':
    'grid min-h-[calc(100vh-72px)] grid-cols-[236px_minmax(0,1fr)] [@media(max-width:_899px)]:[display:block]',
  sidebar:
    'sticky top-18 flex h-[calc(100vh-72px)] flex-col justify-between border-r border-border px-4 pt-7 pb-5.5 [&_nav]:grid [&_nav]:gap-1.25 [@media(max-width:_899px)]:[display:none]',
  'sidebar-bottom': 'grid gap-0.75 border-t border-border pt-5',
  'simulation-note':
    '[display:flex] [align-items:flex-start] [gap:10px] [background:var(--color-surface-muted)] [padding:14px] [border-radius:8px] [color:var(--color-ink-muted)] [font-size:0.85rem] [&_svg]:[flex:0_0_auto] [&_svg]:[color:var(--color-info)]',
  'skeleton-lines':
    '[display:grid] [gap:10px] [margin:30px_auto_0] [max-width:430px] [&_i]:[height:54px] [&_i]:[background:linear-gradient(_90deg,_var(--color-surface-muted),_var(--color-surface),_var(--color-surface-muted)_)] [&_i]:[background-size:200%_100%] [&_i]:[animation:shimmer_1.2s_linear_infinite] [&_i]:[border-radius:7px]',
  'source-marker':
    'inline-flex items-center gap-1.25 rounded-[3px] border border-border bg-surface px-1.75 py-0.75 text-[0.72rem] font-[650] tracking-[0.015em] text-ink-muted',
  spinner:
    '[animation:spin_1s_linear_infinite] [color:var(--color-primary)] [width:42px] [height:42px]',
  'spinner-small': '[animation:spin_1s_linear_infinite]',
  'sr-only':
    'absolute -m-px h-px w-px overflow-hidden border-0 p-0 whitespace-nowrap [clip:rect(0,_0,_0,_0)]',
  status:
    'inline-flex items-center gap-1.5 text-[0.79rem] leading-[1.2] font-bold [&.success]:text-success [&.warning]:text-warning [&.danger]:text-danger [&.info]:text-info',
  'status-button': '[border:0] [background:transparent] [cursor:pointer]',
  'status-now':
    '[text-align:left] [background:var(--color-surface)] [border:1px_solid_var(--color-border)] [border-left:4px_solid_var(--color-info)] [padding:20px] [border-radius:var(--radius-sheet)] [&_h2]:[margin:8px_0_4px] [&_p]:[color:var(--color-ink-muted)] [&_p]:[margin:0]',
  'status-timeline':
    "[list-style:none] [padding:0] [margin:28px_0] [text-align:left] [&_li]:[display:grid] [&_li]:[grid-template-columns:42px_1fr] [&_li]:[gap:14px] [&_li]:[min-height:76px] [&_li]:[position:relative] [&_li::before]:[content:''] [&_li::before]:[position:absolute] [&_li::before]:[width:1px] [&_li::before]:[height:100%] [&_li::before]:[background:var(--color-border)] [&_li::before]:[left:18px] [&_li::before]:[top:36px] [&_li:last-child::before]:[display:none] [&_li_>_span]:[width:37px] [&_li_>_span]:[height:37px] [&_li_>_span]:[border:1px_solid_var(--color-border)] [&_li_>_span]:[border-radius:50%] [&_li_>_span]:[background:var(--color-canvas)] [&_li_>_span]:[display:grid] [&_li_>_span]:[place-items:center] [&_li_>_span]:[z-index:1] [&_li_>_span]:[color:var(--color-ink-muted)] [&_.complete_>_span]:[background:var(--color-success)] [&_.complete_>_span]:[color:#fff] [&_.complete_>_span]:[border-color:var(--color-success)] [&_.current_>_span]:[color:var(--color-info)] [&_.current_>_span]:[border-color:var(--color-info)] [&_.current_>_span]:[box-shadow:0_0_0_5px_rgba(56,_101,_122,_0.1)] [&_li_div]:[display:grid] [&_li_div]:[align-content:start] [&_small]:[color:var(--color-ink-muted)]",
  'step-dots':
    '[display:grid] [grid-template-columns:repeat(2,_1fr)] [gap:5px] [margin:0_0_28px] [&_i]:[height:3px] [&_i]:[background:var(--color-border)] [&_i.on]:[background:var(--color-primary)] [@media(min-width:_900px)_and_(max-height:_1100px)]:[margin-bottom:20px]',
  'sticky-action':
    "[position:sticky] [bottom:0] [z-index:5] [min-height:76px] [border-top:1px_solid_var(--color-border)] [background:rgba(246,_242,_232,_0.94)] [backdrop-filter:blur(10px)] [display:flex] [align-items:center] [justify-content:space-between] [gap:12px] [margin-top:32px] [&_>_span]:[color:var(--color-ink-muted)] [&_>_span]:[font-size:0.78rem] [@media(max-width:_599px)]:[bottom:66px] [@media(max-width:_599px)]:[margin-inline:-18px] [@media(max-width:_599px)]:[padding:10px_18px] [@media(max-width:_599px)]:[min-height:74px] [@media(max-width:_599px)]:[&_>_span]:[display:none] [@media(max-width:_599px)]:[&_[data-slot='button']]:[flex:1] [@media(max-width:_599px)]:[&_[data-slot='button']]:[padding-inline:10px]",
  'submission-stages':
    '[max-width:440px] [margin:28px_auto] [display:grid] [text-align:left] [&_span]:[display:flex] [&_span]:[align-items:center] [&_span]:[gap:10px] [&_span]:[min-height:52px] [&_span]:[border-bottom:1px_solid_var(--color-border)] [&_span]:[color:var(--color-ink-muted)] [&_.done]:[color:var(--color-success)] [&_.active]:[color:var(--color-info)] [&_.active]:[font-weight:700] [&_.active_svg]:[animation:spin_1s_linear_infinite]',
  'success-border': '[border-left-color:var(--color-success)]',
  'success-callout':
    "[display:grid] [grid-template-columns:44px_1fr_auto] [gap:16px] [align-items:center] [border:1px_solid_#b9d0c1] [background:#f2f8f3] [padding:22px] [border-radius:var(--radius-sheet)] [margin-top:26px] [&_>_svg]:[color:var(--color-success)] [&_>_svg]:[width:36px] [&_>_svg]:[height:36px] [&_h2]:[margin:0_0_4px] [&_p]:[margin:0] [&_p]:[color:var(--color-ink-muted)] [&_small]:[color:var(--color-ink-muted)] [@media(max-width:_599px)]:[grid-template-columns:38px_1fr] [@media(max-width:_599px)]:[&_[data-slot='button']]:[grid-column:1/-1]",
  'success-inline':
    '[display:flex] [gap:9px] [align-items:center] [padding:14px] [margin-bottom:20px] [color:var(--color-success)] [background:#f2f8f3] [border-left:4px_solid_var(--color-success)]',
  'task-list':
    '[display:grid] [margin:28px_0] [&_a]:[min-height:92px] [&_a]:[display:grid] [&_a]:[grid-template-columns:42px_1fr_24px] [&_a]:[gap:15px] [&_a]:[align-items:center] [&_a]:[border:0] [&_a]:[border-bottom:1px_solid_var(--color-border)] [&_a]:[background:transparent] [&_a]:[text-decoration:none] [&_a]:[text-align:left] [&_a]:[padding:10px_0] [&_a]:[cursor:pointer] [&_button]:[min-height:92px] [&_button]:[display:grid] [&_button]:[grid-template-columns:42px_1fr_24px] [&_button]:[gap:15px] [&_button]:[align-items:center] [&_button]:[border:0] [&_button]:[border-bottom:1px_solid_var(--color-border)] [&_button]:[background:transparent] [&_button]:[text-decoration:none] [&_button]:[text-align:left] [&_button]:[padding:10px_0] [&_button]:[cursor:pointer] [&_a:hover]:[color:var(--color-primary)] [&_button:disabled]:[opacity:0.5] [&_button:disabled]:[cursor:not-allowed] [&_span:nth-child(2)]:[display:grid] [&_small]:[color:var(--color-ink-muted)]',
  'task-number':
    '[color:var(--color-primary)] [font-weight:750] [font-variant-numeric:tabular-nums]',
  'text-button':
    '[border:0] [background:transparent] [padding:5px_0] [color:var(--color-primary)] [font-weight:700] [cursor:pointer] [display:inline-flex] [align-items:center] [gap:6px] [&_svg]:[width:17px]',
  'timeline-icon':
    '[width:40px] [height:40px] [border:1px_solid_var(--color-border)] [border-radius:50%] [display:grid] [place-items:center] [color:var(--color-primary)] [background:var(--color-surface)] [&_svg]:[width:19px]',
  'timeline-row':
    '[display:grid] [grid-template-columns:44px_1fr] [gap:16px] [padding:20px_0] [border-bottom:1px_solid_var(--color-border)] [&_h3]:[margin:0_0_2px] [&_p]:[color:var(--color-ink-muted)] [&_p]:[margin:0] [&_time]:[font-size:0.75rem] [&_time]:[color:var(--color-ink-muted)]',
  'trace-line':
    '[height:1px] [width:330px] [background:linear-gradient(_90deg,_transparent,_rgba(255,_255,_255,_0.5),_transparent_)] [position:absolute] [bottom:24px]',
  'trace-services':
    '[display:flex] [gap:88px] [position:absolute] [bottom:-3px] [&_span]:[display:flex] [&_span]:[align-items:center] [&_span]:[gap:7px] [&_span]:[font-size:0.76rem] [&_span]:[color:rgba(255,_255,_255,_0.7)]',
  'transfer-route':
    '[display:grid] [grid-template-columns:1fr_46px_1fr] [gap:12px] [align-items:center] [margin:22px_0] [&_>_svg]:[color:var(--color-primary)] [&_>_svg]:[justify-self:center] [&_article]:[min-height:130px] [&_article]:[border:1px_solid_var(--color-border)] [&_article]:[background:var(--color-surface)] [&_article]:[padding:17px] [&_article]:[border-radius:var(--radius-sheet)] [&_article]:[display:grid] [&_article]:[align-content:center] [&_article]:[gap:7px] [&_span]:[color:var(--color-ink-muted)] [&_small]:[color:var(--color-ink-muted)] [@media(max-width:_599px)]:[grid-template-columns:1fr] [@media(max-width:_599px)]:[&_>_svg]:[transform:rotate(90deg)]',
  'trust-list':
    '[list-style:none] [padding:12px_0_28px] [margin:0] [display:grid] [gap:12px] [&_li]:[display:flex] [&_li]:[gap:10px] [&_li]:[align-items:center] [&_svg]:[width:21px] [&_svg]:[color:var(--color-success)]',
  'unavailable-choice':
    '[display:grid] [gap:3px] [border:1px_dashed_var(--color-border)] [border-radius:9px] [padding:15px_16px] [color:var(--color-ink-muted)] [&_small]:[max-width:620px]',
  'validation-error':
    '[color:var(--color-danger)] [border-left:4px_solid_var(--color-danger)] [background:#fff3ef] [padding:12px_14px] [margin:14px_0] [font-weight:600]',
  wordmark:
    'inline-flex items-center gap-2.5 text-[1.23rem] font-[750] tracking-[-0.02em] no-underline [@media(max-width:_599px)]:[font-size:1.06rem]',
};

type ClassValue = string | false | null | undefined;

export function tw(...values: ClassValue[]) {
  const markers = values
    .filter(
      (value): value is string => typeof value === 'string' && value.length > 0,
    )
    .flatMap((value) => value.split(/\s+/).filter(Boolean));
  const utilities = markers.flatMap((marker) =>
    recipes[marker] ? recipes[marker].split(' ') : [],
  );
  return [...new Set([...markers, ...utilities])].join(' ');
}
