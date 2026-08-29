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
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const [loadedSources, existing] = await Promise.all([
          getTaxSources(),
          getExistingReturnDraft(),
        ]);
        if (!active) return;
        setSources(loadedSources);
        if (existing) {
          setDraft(existing);
          return;
        }
        const rules = await getTaxRules(ASSESSMENT_YEAR);
        if (active) {
          setDraft(createDraftFromSources(loadedSources, rules));
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'UNKNOWN_ERROR');
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [getExistingReturnDraft, getTaxSources, getTaxRules, attempt]);

  async function save(next: ReturnDraft) {
    setDraft(next);
    await saveTaxDraft(next);
  }

  function retry() {
    setAttempt((value) => value + 1);
  }

  return { draft, sources, loading, error, retry, save, setDraft };
}
