import {
  BriefcaseBusiness,
  Building2,
  CarFront,
  Plus,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatMoney } from '../../../components/formatters';
import { FieldLabel } from '../../../components/forms';
import { Notice } from '../../../components/patterns';
import { Button, SectionHeading, Status } from '../../../components/ui';
import type {
  BusinessActivity,
  CapitalGainTransaction,
  GoodsCarriage,
  HouseProperty,
  PresumptiveBusinessIncome,
  ReturnDraft,
  SpecifiedProfession,
  ValidationIssue,
} from '../../../types/tax';

const inputClass =
  'h-12 w-full rounded-[9px] border border-border bg-surface px-3.5 [font-variant-numeric:tabular-nums]';
const panelClass =
  'mb-4 rounded-[var(--radius-sheet)] border border-border bg-surface p-4.5 shadow-[0_10px_30px_rgba(30,45,35,0.05)]';

function newProperty(): HouseProperty {
  return {
    id: `property-${crypto.randomUUID()}`,
    address: '',
    ownershipPercentage: 100,
    coOwned: false,
    use: 'SELF_OCCUPIED',
    annualRent: 0,
    unrealisedRent: 0,
    municipalTaxesPaid: 0,
    homeLoanInterest: 0,
    reviewed: false,
  };
}

function newCapitalGain(): CapitalGainTransaction {
  return {
    id: `capital-${crypto.randomUUID()}`,
    assetType: 'LISTED_EQUITY',
    description: '',
    purchaseDate: '2024-01-01',
    saleDate: '2025-08-01',
    saleConsideration: 0,
    acquisitionCost: 0,
    transferExpenses: 0,
    sttPaid: true,
    source: 'USER_ENTERED',
    reviewed: false,
  };
}

function newBusiness(): PresumptiveBusinessIncome {
  return {
    id: `business-${crypto.randomUUID()}`,
    activity: 'SPECIFIED_PROFESSION',
    profession: 'TECHNICAL_CONSULTANCY',
    description: '',
    digitalReceipts: 0,
    cashReceipts: 0,
    otherReceipts: 0,
    declaredProfit: 0,
    wantsLowerProfit: false,
    goodsCarriages: [],
    form10IEAStatus: 'NOT_FILED',
    reviewed: false,
  };
}

function newVehicle(): GoodsCarriage {
  return {
    id: `vehicle-${crypto.randomUUID()}`,
    registrationNumber: '',
    heavyGoodsVehicle: false,
    tonnageCapacity: 0,
    monthsOwned: 12,
  };
}

function MoneyField(props: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <FieldLabel htmlFor={props.id}>{props.label}</FieldLabel>
      <input
        id={props.id}
        className={inputClass}
        type="number"
        min={0}
        value={props.value}
        onChange={(event) => props.onChange(Number(event.target.value))}
      />
    </div>
  );
}

export function PropertyInvestmentsBusinessSection({
  draft,
  setDraft,
  issues,
}: {
  draft: ReturnDraft;
  setDraft: (next: ReturnDraft) => void;
  issues: ValidationIssue[] | null;
}) {
  const { t, i18n } = useTranslation();

  function patchDraft(patch: Partial<ReturnDraft>) {
    setDraft({ ...draft, ...patch, computation: null });
  }

  function updateProperty(id: string, patch: Partial<HouseProperty>) {
    patchDraft({
      properties: draft.properties.map((item) =>
        item.id === id ? { ...item, ...patch, reviewed: false } : item,
      ),
    });
  }

  function updateGain(id: string, patch: Partial<CapitalGainTransaction>) {
    patchDraft({
      capitalGains: draft.capitalGains.map((item) =>
        item.id === id ? { ...item, ...patch, reviewed: false } : item,
      ),
    });
  }

  function updateBusiness(patch: Partial<PresumptiveBusinessIncome>) {
    if (!draft.business) return;
    patchDraft({ business: { ...draft.business, ...patch, reviewed: false } });
  }

  const businessUnsupported = (issues ?? []).some(
    (issue) => issue.code === 'FILING_ROUTE_NOT_SUPPORTED',
  );

  return (
    <section
      id="extras"
      tabIndex={-1}
    >
      <SectionHeading title={t('tax.propertyInvestmentsBusiness.title')} />
      <p className="text-ink-muted">
        {t('tax.propertyInvestmentsBusiness.subtitle')}
      </p>

      <details
        className="my-5 rounded-lg border border-border bg-surface-muted p-4 space-y-2"
        open={draft.properties.length > 0}
      >
        <summary className="cursor-pointer font-bold">
          <Building2 className="mr-1.5 inline size-4.5 text-primary" />
          {t('tax.propertyInvestmentsBusiness.property.toggleQuestion')}
        </summary>
        <p className="text-ink-muted">
          {t('tax.propertyInvestmentsBusiness.property.toggleHelp')}
        </p>
        {draft.properties.map((property, index) => (
          <article
            key={property.id}
            id={property.id}
            className={panelClass}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="m-0">
                {t('tax.propertyInvestmentsBusiness.property.propertyNumber', {
                  number: index + 1,
                })}
              </h3>
              <Button
                variant="danger"
                size="compact"
                onClick={() =>
                  patchDraft({
                    properties: draft.properties.filter(
                      (item) => item.id !== property.id,
                    ),
                  })
                }
              >
                <Trash2 /> {t('common.remove')}
              </Button>
            </div>
            <FieldLabel htmlFor={`${property.id}-address`}>
              {t('tax.propertyInvestmentsBusiness.property.address')}
            </FieldLabel>
            <input
              id={`${property.id}-address`}
              className={inputClass}
              value={property.address}
              onChange={(event) =>
                updateProperty(property.id, { address: event.target.value })
              }
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <MoneyField
                id={`${property.id}-share`}
                label={t('tax.propertyInvestmentsBusiness.property.ownership')}
                value={property.ownershipPercentage}
                onChange={(value) =>
                  updateProperty(property.id, {
                    ownershipPercentage: Math.min(100, value),
                  })
                }
              />
              <div>
                <FieldLabel htmlFor={`${property.id}-use`}>
                  {t('tax.propertyInvestmentsBusiness.property.use')}
                </FieldLabel>
                <select
                  id={`${property.id}-use`}
                  className={inputClass}
                  value={property.use}
                  onChange={(event) =>
                    updateProperty(property.id, {
                      use: event.target.value as HouseProperty['use'],
                    })
                  }
                >
                  <option value="SELF_OCCUPIED">
                    {t('tax.propertyInvestmentsBusiness.property.selfOccupied')}
                  </option>
                  <option value="LET_OUT">
                    {t('tax.propertyInvestmentsBusiness.property.letOut')}
                  </option>
                </select>
              </div>
            </div>
            {property.use === 'LET_OUT' && (
              <div className="grid gap-3 sm:grid-cols-2">
                <MoneyField
                  id={`${property.id}-rent`}
                  label={t(
                    'tax.propertyInvestmentsBusiness.property.annualRent',
                  )}
                  value={property.annualRent}
                  onChange={(value) =>
                    updateProperty(property.id, { annualRent: value })
                  }
                />
                <MoneyField
                  id={`${property.id}-unrealised`}
                  label={t(
                    'tax.propertyInvestmentsBusiness.property.unrealisedRent',
                  )}
                  value={property.unrealisedRent}
                  onChange={(value) =>
                    updateProperty(property.id, { unrealisedRent: value })
                  }
                />
                <MoneyField
                  id={`${property.id}-municipal`}
                  label={t(
                    'tax.propertyInvestmentsBusiness.property.municipalTaxes',
                  )}
                  value={property.municipalTaxesPaid}
                  onChange={(value) =>
                    updateProperty(property.id, { municipalTaxesPaid: value })
                  }
                />
              </div>
            )}
            <MoneyField
              id={`${property.id}-interest`}
              label={t('tax.propertyInvestmentsBusiness.property.loanInterest')}
              value={property.homeLoanInterest}
              onChange={(value) =>
                updateProperty(property.id, { homeLoanInterest: value })
              }
            />
            {property.homeLoanInterest > 0 && (
              <details
                className="mt-3 rounded-lg bg-surface p-3.5"
                open
              >
                <summary>
                  {t('tax.propertyInvestmentsBusiness.property.loanDetails')}
                </summary>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <FieldLabel htmlFor={`${property.id}-lender`}>
                      {t('tax.propertyInvestmentsBusiness.property.lenderName')}
                    </FieldLabel>
                    <input
                      id={`${property.id}-lender`}
                      className={inputClass}
                      value={property.lenderName ?? ''}
                      onChange={(event) =>
                        updateProperty(property.id, {
                          lenderName: event.target.value,
                          lenderType: 'BANK',
                        })
                      }
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor={`${property.id}-loan-account`}>
                      {t(
                        'tax.propertyInvestmentsBusiness.property.loanAccount',
                      )}
                    </FieldLabel>
                    <input
                      id={`${property.id}-loan-account`}
                      className={inputClass}
                      value={property.loanAccountNumber ?? ''}
                      onChange={(event) =>
                        updateProperty(property.id, {
                          loanAccountNumber: event.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </details>
            )}
            <div className="mt-4">
              {property.reviewed ? (
                <Status kind="success">{t('common.confirmed')}</Status>
              ) : (
                <Button
                  disabled={
                    !property.address.trim() ||
                    (property.homeLoanInterest > 0 &&
                      (!property.lenderName?.trim() ||
                        !property.loanAccountNumber?.trim()))
                  }
                  onClick={() =>
                    patchDraft({
                      properties: draft.properties.map((item) =>
                        item.id === property.id
                          ? { ...item, reviewed: true }
                          : item,
                      ),
                    })
                  }
                >
                  {t('tax.income.looksRight')}
                </Button>
              )}
            </div>
          </article>
        ))}
        <Button
          variant="secondary"
          disabled={draft.properties.length >= 4}
          onClick={() =>
            patchDraft({ properties: [...draft.properties, newProperty()] })
          }
        >
          <Plus /> {t('tax.propertyInvestmentsBusiness.property.addButton')}
        </Button>
        <Notice
          tone="info"
          title={t('tax.propertyInvestmentsBusiness.property.lossTitle')}
        >
          {t('tax.propertyInvestmentsBusiness.property.lossHelp')}
        </Notice>
      </details>

      <details
        className="my-5 rounded-lg border border-border bg-surface-muted p-4 space-y-2"
        open={draft.capitalGains.length > 0}
      >
        <summary className="cursor-pointer font-bold">
          <TrendingUp className="mr-1.5 inline size-4.5 text-primary" />
          {t('tax.propertyInvestmentsBusiness.capital.toggleQuestion')}
        </summary>
        <p className="text-ink-muted">
          {t('tax.propertyInvestmentsBusiness.capital.toggleHelp')}
        </p>
        {draft.capitalGains.map((gain, index) => {
          const enteredGain =
            gain.saleConsideration -
            gain.acquisitionCost -
            gain.transferExpenses;
          return (
            <article
              key={gain.id}
              id={gain.id}
              className={panelClass}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="m-0">
                  {t('tax.propertyInvestmentsBusiness.capital.saleNumber', {
                    number: index + 1,
                  })}
                </h3>
                <Button
                  variant="danger"
                  size="compact"
                  onClick={() =>
                    patchDraft({
                      capitalGains: draft.capitalGains.filter(
                        (item) => item.id !== gain.id,
                      ),
                    })
                  }
                >
                  <Trash2 /> {t('common.remove')}
                </Button>
              </div>
              <div>
                <FieldLabel htmlFor={`${gain.id}-asset`}>
                  {t('tax.propertyInvestmentsBusiness.capital.assetType')}
                </FieldLabel>
                <select
                  id={`${gain.id}-asset`}
                  className={inputClass}
                  value={gain.assetType}
                  onChange={(event) =>
                    updateGain(gain.id, {
                      assetType: event.target
                        .value as CapitalGainTransaction['assetType'],
                    })
                  }
                >
                  <option value="LISTED_EQUITY">
                    {t('tax.propertyInvestmentsBusiness.capital.listedEquity')}
                  </option>
                  <option value="EQUITY_MUTUAL_FUND">
                    {t('tax.propertyInvestmentsBusiness.capital.equityFund')}
                  </option>
                  <option value="UNSUPPORTED">
                    {t('tax.propertyInvestmentsBusiness.capital.otherAsset')}
                  </option>
                </select>
              </div>
              {gain.assetType === 'UNSUPPORTED' ? (
                <Notice
                  tone="warning"
                  title={t(
                    'tax.propertyInvestmentsBusiness.capital.advancedTitle',
                  )}
                >
                  {t('tax.propertyInvestmentsBusiness.capital.advancedHelp')}
                </Notice>
              ) : (
                <>
                  <FieldLabel htmlFor={`${gain.id}-description`}>
                    {t('tax.propertyInvestmentsBusiness.capital.description')}
                  </FieldLabel>
                  <input
                    id={`${gain.id}-description`}
                    className={inputClass}
                    value={gain.description}
                    onChange={(event) =>
                      updateGain(gain.id, { description: event.target.value })
                    }
                  />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <FieldLabel htmlFor={`${gain.id}-purchase-date`}>
                        {t(
                          'tax.propertyInvestmentsBusiness.capital.purchaseDate',
                        )}
                      </FieldLabel>
                      <input
                        id={`${gain.id}-purchase-date`}
                        className={inputClass}
                        type="date"
                        value={gain.purchaseDate}
                        onChange={(event) =>
                          updateGain(gain.id, {
                            purchaseDate: event.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <FieldLabel htmlFor={`${gain.id}-sale-date`}>
                        {t('tax.propertyInvestmentsBusiness.capital.saleDate')}
                      </FieldLabel>
                      <input
                        id={`${gain.id}-sale-date`}
                        className={inputClass}
                        type="date"
                        value={gain.saleDate}
                        onChange={(event) =>
                          updateGain(gain.id, { saleDate: event.target.value })
                        }
                      />
                    </div>
                    <MoneyField
                      id={`${gain.id}-sale-value`}
                      label={t(
                        'tax.propertyInvestmentsBusiness.capital.saleValue',
                      )}
                      value={gain.saleConsideration}
                      onChange={(value) =>
                        updateGain(gain.id, { saleConsideration: value })
                      }
                    />
                    <MoneyField
                      id={`${gain.id}-cost`}
                      label={t('tax.propertyInvestmentsBusiness.capital.cost')}
                      value={gain.acquisitionCost}
                      onChange={(value) =>
                        updateGain(gain.id, { acquisitionCost: value })
                      }
                    />
                    <MoneyField
                      id={`${gain.id}-expenses`}
                      label={t(
                        'tax.propertyInvestmentsBusiness.capital.expenses',
                      )}
                      value={gain.transferExpenses}
                      onChange={(value) =>
                        updateGain(gain.id, { transferExpenses: value })
                      }
                    />
                  </div>
                  <p className="mt-4 rounded-lg bg-surface p-3 font-bold [font-variant-numeric:tabular-nums]">
                    {t('tax.propertyInvestmentsBusiness.capital.enteredGain')}:{' '}
                    {formatMoney(enteredGain, i18n.language)}
                  </p>
                </>
              )}
              <div className="mt-4">
                {gain.reviewed ? (
                  <Status kind="success">{t('common.confirmed')}</Status>
                ) : (
                  <Button
                    disabled={
                      gain.assetType !== 'UNSUPPORTED' &&
                      (!gain.description.trim() ||
                        !gain.purchaseDate ||
                        !gain.saleDate)
                    }
                    onClick={() =>
                      patchDraft({
                        capitalGains: draft.capitalGains.map((item) =>
                          item.id === gain.id
                            ? { ...item, reviewed: true }
                            : item,
                        ),
                      })
                    }
                  >
                    {t('tax.income.looksRight')}
                  </Button>
                )}
              </div>
            </article>
          );
        })}
        <Button
          variant="secondary"
          onClick={() =>
            patchDraft({
              capitalGains: [...draft.capitalGains, newCapitalGain()],
            })
          }
        >
          <Plus /> {t('tax.propertyInvestmentsBusiness.capital.addButton')}
        </Button>
      </details>

      <details
        className="my-5 rounded-lg border border-border bg-surface-muted p-4 space-y-2"
        open={Boolean(draft.business)}
      >
        <summary className="cursor-pointer font-bold">
          <BriefcaseBusiness className="mr-1.5 inline size-4.5 text-primary" />
          {t('tax.propertyInvestmentsBusiness.business.toggleQuestion')}
        </summary>
        <p className="text-ink-muted">
          {t('tax.propertyInvestmentsBusiness.business.toggleHelp')}
        </p>
        {!draft.business ? (
          <Button
            variant="secondary"
            onClick={() => patchDraft({ business: newBusiness() })}
          >
            <Plus /> {t('tax.propertyInvestmentsBusiness.business.addButton')}
          </Button>
        ) : (
          <article
            id={draft.business.id}
            className={panelClass}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="m-0">
                {t('tax.propertyInvestmentsBusiness.business.activityType')}
              </h3>
              <Button
                variant="danger"
                size="compact"
                onClick={() => patchDraft({ business: null })}
              >
                <Trash2 /> {t('common.remove')}
              </Button>
            </div>
            <select
              aria-label={t(
                'tax.propertyInvestmentsBusiness.business.activityType',
              )}
              className={inputClass}
              value={draft.business.activity}
              onChange={(event) =>
                updateBusiness({
                  activity: event.target.value as BusinessActivity,
                  goodsCarriages:
                    event.target.value === 'GOODS_CARRIAGE'
                      ? (draft.business?.goodsCarriages ?? [])
                      : [],
                })
              }
            >
              <option value="SPECIFIED_PROFESSION">
                {t('tax.propertyInvestmentsBusiness.business.professional')}
              </option>
              <option value="SMALL_BUSINESS">
                {t('tax.propertyInvestmentsBusiness.business.smallBusiness')}
              </option>
              <option value="GOODS_CARRIAGE">
                {t('tax.propertyInvestmentsBusiness.business.goodsCarriage')}
              </option>
              <option value="COMMISSION_AGENCY">
                {t('tax.propertyInvestmentsBusiness.business.commission')}
              </option>
              <option value="OTHER">
                {t('tax.propertyInvestmentsBusiness.business.other')}
              </option>
            </select>
            {draft.business.activity === 'SPECIFIED_PROFESSION' && (
              <div>
                <FieldLabel htmlFor="profession-type">
                  {t('tax.propertyInvestmentsBusiness.business.professionType')}
                </FieldLabel>
                <select
                  id="profession-type"
                  className={inputClass}
                  value={draft.business.profession}
                  onChange={(event) =>
                    updateBusiness({
                      profession: event.target.value as SpecifiedProfession,
                    })
                  }
                >
                  <option value="LEGAL">
                    {t('tax.propertyInvestmentsBusiness.business.legal')}
                  </option>
                  <option value="MEDICAL">
                    {t('tax.propertyInvestmentsBusiness.business.medical')}
                  </option>
                  <option value="ENGINEERING_ARCHITECTURE">
                    {t('tax.propertyInvestmentsBusiness.business.engineering')}
                  </option>
                  <option value="ACCOUNTANCY">
                    {t('tax.propertyInvestmentsBusiness.business.accountancy')}
                  </option>
                  <option value="TECHNICAL_CONSULTANCY">
                    {t('tax.propertyInvestmentsBusiness.business.technical')}
                  </option>
                  <option value="INTERIOR_DECORATION">
                    {t('tax.propertyInvestmentsBusiness.business.interior')}
                  </option>
                </select>
              </div>
            )}
            <FieldLabel htmlFor="business-description">
              {t('tax.propertyInvestmentsBusiness.business.description')}
            </FieldLabel>
            <input
              id="business-description"
              className={inputClass}
              value={draft.business.description}
              onChange={(event) =>
                updateBusiness({ description: event.target.value })
              }
            />
            {draft.business.activity === 'GOODS_CARRIAGE' ? (
              <div className="mt-4">
                {draft.business.goodsCarriages.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="mb-3 rounded-lg bg-surface p-3.5"
                  >
                    <div className="flex items-center gap-2 font-bold">
                      <CarFront className="size-5 text-primary" />
                      {t('tax.propertyInvestmentsBusiness.business.vehicle')}
                    </div>
                    <FieldLabel htmlFor={`${vehicle.id}-registration`}>
                      {t(
                        'tax.propertyInvestmentsBusiness.business.registration',
                      )}
                    </FieldLabel>
                    <input
                      id={`${vehicle.id}-registration`}
                      className={inputClass}
                      value={vehicle.registrationNumber}
                      onChange={(event) =>
                        updateBusiness({
                          goodsCarriages: draft.business!.goodsCarriages.map(
                            (item) =>
                              item.id === vehicle.id
                                ? {
                                    ...item,
                                    registrationNumber: event.target.value,
                                  }
                                : item,
                          ),
                        })
                      }
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <MoneyField
                        id={`${vehicle.id}-months`}
                        label={t(
                          'tax.propertyInvestmentsBusiness.business.monthsOwned',
                        )}
                        value={vehicle.monthsOwned}
                        onChange={(value) =>
                          updateBusiness({
                            goodsCarriages: draft.business!.goodsCarriages.map(
                              (item) =>
                                item.id === vehicle.id
                                  ? {
                                      ...item,
                                      monthsOwned: Math.min(12, value),
                                    }
                                  : item,
                            ),
                          })
                        }
                      />
                      <MoneyField
                        id={`${vehicle.id}-tonnage`}
                        label={t(
                          'tax.propertyInvestmentsBusiness.business.tonnage',
                        )}
                        value={vehicle.tonnageCapacity}
                        onChange={(value) =>
                          updateBusiness({
                            goodsCarriages: draft.business!.goodsCarriages.map(
                              (item) =>
                                item.id === vehicle.id
                                  ? {
                                      ...item,
                                      tonnageCapacity: value,
                                      heavyGoodsVehicle: value > 12,
                                    }
                                  : item,
                            ),
                          })
                        }
                      />
                    </div>
                  </div>
                ))}
                <Button
                  variant="secondary"
                  disabled={draft.business.goodsCarriages.length >= 10}
                  onClick={() =>
                    updateBusiness({
                      goodsCarriages: [
                        ...draft.business!.goodsCarriages,
                        newVehicle(),
                      ],
                    })
                  }
                >
                  <Plus />{' '}
                  {t('tax.propertyInvestmentsBusiness.business.addVehicle')}
                </Button>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                <MoneyField
                  id="business-digital"
                  label={t(
                    'tax.propertyInvestmentsBusiness.business.digitalReceipts',
                  )}
                  value={draft.business.digitalReceipts}
                  onChange={(value) =>
                    updateBusiness({ digitalReceipts: value })
                  }
                />
                <MoneyField
                  id="business-cash"
                  label={t(
                    'tax.propertyInvestmentsBusiness.business.cashReceipts',
                  )}
                  value={draft.business.cashReceipts}
                  onChange={(value) => updateBusiness({ cashReceipts: value })}
                />
                <MoneyField
                  id="business-other"
                  label={t(
                    'tax.propertyInvestmentsBusiness.business.otherReceipts',
                  )}
                  value={draft.business.otherReceipts}
                  onChange={(value) => updateBusiness({ otherReceipts: value })}
                />
                <MoneyField
                  id="business-profit"
                  label={t(
                    'tax.propertyInvestmentsBusiness.business.declaredProfit',
                  )}
                  value={draft.business.declaredProfit}
                  onChange={(value) =>
                    updateBusiness({ declaredProfit: value })
                  }
                />
              </div>
            )}
            <label className="mt-4 grid cursor-pointer grid-cols-[22px_1fr] gap-3 rounded-lg bg-surface p-3.5">
              <input
                type="checkbox"
                checked={draft.business.wantsLowerProfit}
                onChange={(event) =>
                  updateBusiness({ wantsLowerProfit: event.target.checked })
                }
              />
              <span>
                {t('tax.propertyInvestmentsBusiness.business.lowerProfit')}
              </span>
            </label>
            {draft.business.wantsLowerProfit && (
              <Notice
                tone="warning"
                title={t('tax.propertyInvestmentsBusiness.business.lowerTitle')}
              >
                {t('tax.propertyInvestmentsBusiness.business.lowerHelp')}
              </Notice>
            )}
            <FieldLabel htmlFor="form-10iea">
              {t('tax.propertyInvestmentsBusiness.business.form10IEA')}
            </FieldLabel>
            <select
              id="form-10iea"
              className={inputClass}
              value={draft.business.form10IEAStatus}
              onChange={(event) =>
                updateBusiness({
                  form10IEAStatus: event.target
                    .value as PresumptiveBusinessIncome['form10IEAStatus'],
                })
              }
            >
              <option value="NOT_FILED">
                {t('tax.propertyInvestmentsBusiness.business.notFiled')}
              </option>
              <option value="FILED_TO_OPT_OUT">
                {t('tax.propertyInvestmentsBusiness.business.filedCurrent')}
              </option>
              <option value="PREVIOUSLY_OPTED_OLD">
                {t('tax.propertyInvestmentsBusiness.business.previouslyOld')}
              </option>
              <option value="REENTERED_NEW">
                {t('tax.propertyInvestmentsBusiness.business.reenteredNew')}
              </option>
            </select>
            <Notice
              tone="neutral"
              title={t(
                'tax.propertyInvestmentsBusiness.business.presumptiveTitle',
              )}
              className="mt-2"
            >
              {t('tax.propertyInvestmentsBusiness.business.presumptiveHelp')}
            </Notice>
            {businessUnsupported && (
              <Notice
                tone="warning"
                title={t('tax.validation.routeUnsupportedTitle')}
              >
                {t('tax.validation.routeUnsupportedMessage')}
              </Notice>
            )}
            <div className="mt-4">
              {draft.business.reviewed ? (
                <Status kind="success">{t('common.confirmed')}</Status>
              ) : (
                <Button
                  disabled={
                    !draft.business.description.trim() ||
                    (draft.business.activity === 'GOODS_CARRIAGE' &&
                      (draft.business.goodsCarriages.length === 0 ||
                        draft.business.goodsCarriages.some(
                          (item) => !item.registrationNumber.trim(),
                        )))
                  }
                  onClick={() =>
                    patchDraft({
                      business: { ...draft.business!, reviewed: true },
                    })
                  }
                >
                  {t('tax.income.looksRight')}
                </Button>
              )}
            </div>
          </article>
        )}
      </details>
    </section>
  );
}
