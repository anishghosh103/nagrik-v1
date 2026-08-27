import { useEffect, useState } from 'react';
import { useAppStore } from '../../app/store';
import { createDraftFromSources } from './taxDraft';
import type { ReturnDraft, TaxSourceSnapshot } from '../../types/tax';

const ASSESSMENT_YEAR = '2026-27';

export function useReturnDraft() {
  const getExistingReturnDraft = useAppStore(
    (state) => state.getExistingReturnDraft,
  );
  const getTaxSources = useAppStore((state) => state.getTaxSources);
  const getTaxRules = useAppStore((state) => state.getTaxRules);
  const saveTaxDraft = useAppStore((state) => state.saveTaxDraft);
  const [draft, setDraft] = useState<ReturnDraft | null>(null);
  const [sources, setSources] = useState<TaxSourceSnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void (async () => {
      const [loadedSources, existing] = await Promise.all([
        getTaxSources(),
        getExistingReturnDraft(),
      ]);
      if (!active) return;
      setSources(loadedSources);
      if (existing) {
        setDraft(existing);
        setLoading(false);
        return;
      }
      const rules = await getTaxRules(ASSESSMENT_YEAR);
      if (active) {
        setDraft(createDraftFromSources(loadedSources, rules));
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [getExistingReturnDraft, getTaxSources, getTaxRules]);

  async function save(next: ReturnDraft) {
    setDraft(next);
    await saveTaxDraft(next);
  }

  return { draft, sources, loading, save, setDraft };
}
