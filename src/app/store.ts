import { create } from 'zustand'
import { apiService } from '../services/LocalAPIService'
import type { ClaimSubmission, ClaimValidation, MockSession, PersonaId, PersonaSeed, PropagationResult } from '../types/domain'

interface AppState {
  status: 'hydrating' | 'ready' | 'error'
  session: MockSession | null
  persona: PersonaSeed | null
  online: boolean
  busy: boolean
  error: string | null
  hydrate: () => Promise<void>
  authenticate: (session: MockSession) => Promise<void>
  refresh: () => Promise<void>
  resolveMismatch: (mismatchId: string, value: string) => Promise<PropagationResult>
  validateClaim: () => Promise<ClaimValidation>
  submitClaim: (amount: number, otp: string) => Promise<ClaimSubmission>
  switchPersona: (id: PersonaId) => Promise<void>
  reset: () => Promise<void>
  signOut: () => Promise<void>
  setOnline: (online: boolean) => void
  clearError: () => void
}

export const useAppStore = create<AppState>((set, get) => ({
  status: 'hydrating', session: null, persona: null, online: navigator.onLine, busy: false, error: null,
  hydrate: async () => {
    try {
      const session = await apiService.getSession()
      const persona = session?.verified ? await apiService.getPersona(session.personaId) : null
      set({ session, persona, status: 'ready' })
    } catch { set({ status: 'error', error: 'We could not restore this demo safely.' }) }
  },
  authenticate: async (session) => {
    set({ busy: true, error: null })
    try { set({ session, persona: await apiService.getPersona(session.personaId), status: 'ready', busy: false }) }
    catch { set({ busy: false, error: 'Your profile could not be loaded. Try again.' }) }
  },
  refresh: async () => {
    const id = get().session?.personaId
    if (!id) return
    try { set({ persona: await apiService.getPersona(id), error: null }) }
    catch { set({ error: 'Fresh data is unavailable. Your last saved information is still shown.' }) }
  },
  resolveMismatch: async (mismatchId, canonicalValue) => {
    const id = get().session?.personaId
    if (!id) throw new Error('NO_SESSION')
    set({ busy: true, error: null })
    try {
      const result = await apiService.resolveMismatch({ personaId: id, mismatchId, canonicalValue })
      set({ persona: await apiService.getPersona(id), busy: false })
      return result
    } catch (error) { set({ busy: false, error: error instanceof Error && error.message === 'OFFLINE' ? 'You are offline. Reconnect before propagating a correction.' : 'The correction could not be completed. Your original records are unchanged.' }); throw error }
  },
  validateClaim: async () => {
    const id = get().session?.personaId
    if (!id) throw new Error('NO_SESSION')
    return apiService.validateClaim(id, 'FINAL_SETTLEMENT')
  },
  submitClaim: async (amount, otp) => {
    const id = get().session?.personaId
    if (!id) throw new Error('NO_SESSION')
    set({ busy: true, error: null })
    try {
      const result = await apiService.submitClaim(id, { type: 'FINAL_SETTLEMENT', amount, bankConfirmed: true, declarationAccepted: true, otp })
      set({ persona: await apiService.getPersona(id), busy: false })
      return result
    } catch (error) { set({ busy: false, error: 'The claim was not sent. Check the declaration and mock OTP, then retry safely.' }); throw error }
  },
  switchPersona: async (id) => {
    set({ busy: true, error: null })
    const pending = await apiService.login(id)
    const session = await apiService.verifyOtp(pending.id, '123456')
    set({ session, persona: await apiService.getPersona(id), busy: false })
  },
  reset: async () => {
    const id = get().session?.personaId
    if (!id) return
    set({ busy: true })
    set({ persona: await apiService.resetPersona(id), busy: false, error: null })
  },
  signOut: async () => { await apiService.clearSession(); set({ session: null, persona: null }) },
  setOnline: (online) => set({ online }), clearError: () => set({ error: null }),
}))
