import { Component, type ErrorInfo, type ReactNode } from 'react'

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error(error, info) }
  render() {
    if (this.state.failed) return <main className="error-page"><p className="eyebrow">Something went wrong</p><h1>Your saved demo data is safe.</h1><p>Reload the page to restore the last compatible state.</p><button className="button primary" onClick={() => location.reload()}>Reload safely</button></main>
    return this.props.children
  }
}
