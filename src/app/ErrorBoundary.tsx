import { tw } from '../styles/recipes';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '../components/ui';

export class ErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info);
  }
  render() {
    if (this.state.failed)
      return (
        <main className={tw('error-page')}>
          <p className={tw('eyebrow')}>Something went wrong</p>
          <h1>Your saved demo data is safe.</h1>
          <p>Reload the page to restore the last compatible state.</p>
          <Button onClick={() => location.reload()}>Reload safely</Button>
        </main>
      );
    return this.props.children;
  }
}
