import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button, Eyebrow } from '../components/ui';

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
        <main className="mx-auto my-[15vh] max-w-[650px] p-7.5">
          <Eyebrow>Something went wrong</Eyebrow>
          <h1>Your saved demo data is safe.</h1>
          <p>Reload the page to restore the last compatible state.</p>
          <Button onClick={() => location.reload()}>Reload safely</Button>
        </main>
      );
    return this.props.children;
  }
}
