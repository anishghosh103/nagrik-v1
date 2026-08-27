import { create } from 'zustand';
import { apiService } from '../services/LocalAPIService';
import type {
  ClaimSubmission,
  ClaimValidation,
  MockSession,
  Nominee,
  NominationRecord,
  PassbookSnapshot,
  PersonaId,
  PersonaSeed,
  PFClaim,
  PFTransfer,
  PFTransferInput,
  PropagationResult,
  TransferValidation,
} from '../types/domain';

interface AppState {
  status: 'hydrating' | 'ready' | 'error';
  session: MockSession | null;
  persona: PersonaSeed | null;
  online: boolean;
  busy: boolean;
  error: string | null;
  hydrate: () => Promise<void>;
  authenticate: (session: MockSession) => Promise<void>;
  refresh: () => Promise<void>;
  resolveMismatch: (
    mismatchId: string,
    value: string,
  ) => Promise<PropagationResult>;
  retryPropagation: (mismatchId: string) => Promise<PropagationResult>;
  validateClaim: () => Promise<ClaimValidation>;
  submitClaim: (amount: number, otp: string) => Promise<ClaimSubmission>;
  saveClaimDraft: (draft: PFClaim) => Promise<void>;
  refreshPassbook: () => Promise<PassbookSnapshot>;
  updateEmploymentExit: (
    employmentId: string,
    exitedOn: string,
  ) => Promise<void>;
  validateTransfer: (
    sourceEmploymentId: string,
    destinationEmploymentId: string,
  ) => Promise<TransferValidation>;
  saveTransferDraft: (draft: PFTransferInput) => Promise<void>;
  submitTransfer: (draft: PFTransferInput) => Promise<PFTransfer>;
  saveNominationDraft: (nominees: Nominee[]) => Promise<NominationRecord>;
  submitNomination: (
    nominees: Nominee[],
    otp: string,
  ) => Promise<NominationRecord>;
  switchPersona: (id: PersonaId) => Promise<void>;
  reset: () => Promise<void>;
  signOut: () => Promise<void>;
  setOnline: (online: boolean) => void;
  clearError: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  status: 'hydrating',
  session: null,
  persona: null,
  online: navigator.onLine,
  busy: false,
  error: null,
  hydrate: async () => {
    try {
      const session = await apiService.getSession();
      const persona = session?.verified
        ? await apiService.getPersona(session.personaId)
        : null;
      set({ session, persona, status: 'ready' });
    } catch {
      set({ status: 'error', error: 'errors.restore' });
    }
  },
  authenticate: async (session) => {
    set({ busy: true, error: null });
    try {
      set({
        session,
        persona: await apiService.getPersona(session.personaId),
        status: 'ready',
        busy: false,
      });
    } catch {
      set({ busy: false, error: 'errors.profileLoad' });
    }
  },
  refresh: async () => {
    const id = get().session?.personaId;
    if (!id) return;
    try {
      set({ persona: await apiService.getPersona(id), error: null });
    } catch {
      set({ error: 'errors.cachedData' });
    }
  },
  resolveMismatch: async (mismatchId, canonicalValue) => {
    const id = get().session?.personaId;
    if (!id) throw new Error('NO_SESSION');
    set({ busy: true, error: null });
    try {
      const result = await apiService.resolveMismatch({
        personaId: id,
        mismatchId,
        canonicalValue,
      });
      set({ persona: await apiService.getPersona(id), busy: false });
      return result;
    } catch (error) {
      set({
        busy: false,
        error:
          error instanceof Error && error.message === 'OFFLINE'
            ? 'errors.propagationOffline'
            : 'errors.propagationFailed',
      });
      throw error;
    }
  },
  retryPropagation: async (mismatchId) => {
    const id = get().session?.personaId;
    if (!id) throw new Error('NO_SESSION');
    set({ busy: true, error: null });
    try {
      const result = await apiService.retryPropagation({
        personaId: id,
        mismatchId,
      });
      set({ persona: await apiService.getPersona(id), busy: false });
      return result;
    } catch (error) {
      set({
        busy: false,
        error:
          error instanceof Error && error.message === 'OFFLINE'
            ? 'errors.propagationOffline'
            : 'errors.retryFailed',
      });
      throw error;
    }
  },
  validateClaim: async () => {
    const id = get().session?.personaId;
    if (!id) throw new Error('NO_SESSION');
    return apiService.validateClaim(id, 'FINAL_SETTLEMENT');
  },
  submitClaim: async (amount, otp) => {
    const id = get().session?.personaId;
    if (!id) throw new Error('NO_SESSION');
    set({ busy: true, error: null });
    try {
      const result = await apiService.submitClaim(id, {
        type: 'FINAL_SETTLEMENT',
        amount,
        bankConfirmed: true,
        declarationAccepted: true,
        otp,
      });
      set({ persona: await apiService.getPersona(id), busy: false });
      return result;
    } catch (error) {
      set({
        busy: false,
        error:
          error instanceof Error && error.message === 'OFFLINE'
            ? 'errors.claimOffline'
            : 'errors.claimUnavailable',
      });
      throw error;
    }
  },
  saveClaimDraft: async (draft) => {
    const id = get().session?.personaId;
    if (id) await apiService.saveClaimDraft(id, draft);
  },
  refreshPassbook: async () => {
    const id = get().session?.personaId;
    if (!id) throw new Error('NO_SESSION');
    set({ busy: true, error: null });
    try {
      const result = await apiService.refreshPassbook(id);
      set({ persona: await apiService.getPersona(id), busy: false });
      return result;
    } catch (error) {
      set({
        busy: false,
        error:
          error instanceof Error && error.message === 'OFFLINE'
            ? 'errors.passbookOffline'
            : 'errors.passbookUnavailable',
      });
      throw error;
    }
  },
  updateEmploymentExit: async (employmentId, exitedOn) => {
    const id = get().session?.personaId;
    if (!id) throw new Error('NO_SESSION');
    set({ busy: true, error: null });
    try {
      await apiService.updateEmploymentExit(id, employmentId, exitedOn);
      set({ persona: await apiService.getPersona(id), busy: false });
    } catch (error) {
      set({ busy: false, error: 'errors.employmentUpdate' });
      throw error;
    }
  },
  validateTransfer: async (sourceEmploymentId, destinationEmploymentId) => {
    const id = get().session?.personaId;
    if (!id) throw new Error('NO_SESSION');
    return apiService.validateTransfer(
      id,
      sourceEmploymentId,
      destinationEmploymentId,
    );
  },
  saveTransferDraft: async (draft) => {
    const id = get().session?.personaId;
    if (id) await apiService.saveTransferDraft(id, draft);
  },
  submitTransfer: async (draft) => {
    const id = get().session?.personaId;
    if (!id) throw new Error('NO_SESSION');
    set({ busy: true, error: null });
    try {
      const result = await apiService.submitTransfer(id, draft);
      set({ persona: await apiService.getPersona(id), busy: false });
      return result;
    } catch (error) {
      set({ busy: false, error: 'errors.transferUnavailable' });
      throw error;
    }
  },
  saveNominationDraft: async (nominees) => {
    const id = get().session?.personaId;
    if (!id) throw new Error('NO_SESSION');
    const result = await apiService.saveNominationDraft(id, nominees);
    set({ persona: await apiService.getPersona(id) });
    return result;
  },
  submitNomination: async (nominees, otp) => {
    const id = get().session?.personaId;
    if (!id) throw new Error('NO_SESSION');
    set({ busy: true, error: null });
    try {
      const result = await apiService.submitNomination(id, nominees, otp);
      set({ persona: await apiService.getPersona(id), busy: false });
      return result;
    } catch (error) {
      set({ busy: false, error: 'errors.nominationUnavailable' });
      throw error;
    }
  },
  switchPersona: async (id) => {
    set({ busy: true, error: null });
    const pending = await apiService.login(id);
    const session = await apiService.verifyOtp(pending.id, '123456');
    set({ session, persona: await apiService.getPersona(id), busy: false });
  },
  reset: async () => {
    const id = get().session?.personaId;
    if (!id) return;
    set({ busy: true });
    set({
      persona: await apiService.resetPersona(id),
      busy: false,
      error: null,
    });
  },
  signOut: async () => {
    await apiService.clearSession();
    set({ session: null, persona: null });
  },
  setOnline: (online) => set({ online }),
  clearError: () => set({ error: null }),
}));
