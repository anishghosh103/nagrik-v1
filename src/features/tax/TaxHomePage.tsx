import { ArrowRight, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../app/store';
import {
  ButtonLink,
  Page,
  PageHeader,
  SectionHeading,
  Status,
} from '../../components/ui';
import { Notice } from '../../components/patterns';

export function TaxHomePage() {
  const { t } = useTranslation();
  const persona = useAppStore((state) => state.persona);
  if (!persona) return null;
  const tax = persona.tax;
  const filed = tax?.filedReturns[0];
  return (
    <Page>
      <PageHeader
        eyebrow={t('tax.home.eyebrow')}
        title={t('tax.home.title')}
        subtitle={t('tax.home.subtitle')}
      />
      <Notice
        tone="warning"
        icon={<Info />}
        title={t('tax.home.disclosureTitle')}
      >
        {t('tax.home.disclosureBody')}
      </Notice>
      {filed ? (
        <section className="mt-7">
          <SectionHeading title={t('tax.home.filedTitle')} />
          <p className="text-ink-muted">{t('tax.home.filedSubtitle')}</p>
          <div className="mb-5">
            <Status
              kind={
                filed.verification.status === 'VERIFIED' ? 'success' : 'warning'
              }
            >
              {filed.verification.status === 'VERIFIED'
                ? t('tax.home.verified')
                : t('tax.home.verificationPending')}
            </Status>
          </div>
          <ButtonLink to="/tax/file/status">
            {t('tax.home.viewReturn')}
            <ArrowRight />
          </ButtonLink>
        </section>
      ) : (
        <section className="mt-7">
          <SectionHeading
            title={
              tax?.draft
                ? t('tax.home.continueTitle')
                : t('tax.home.startTitle')
            }
          />
          <p className="text-ink-muted">{t('tax.home.startSubtitle')}</p>
          <ButtonLink to="/tax/file">
            {tax?.draft
              ? t('tax.home.continueAction')
              : t('tax.home.startAction')}
            <ArrowRight />
          </ButtonLink>
        </section>
      )}
    </Page>
  );
}
