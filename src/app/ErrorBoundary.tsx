import { Component, type ErrorInfo, type ReactNode } from 'react';
import i18n from 'i18next';
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
          <Eyebrow>{i18n.t('errorBoundary.eyebrow')}</Eyebrow>
          <h1>{i18n.t('errorBoundary.title')}</h1>
          <p>{i18n.t('errorBoundary.body')}</p>
          <Button onClick={() => location.reload()}>
            {i18n.t('errorBoundary.reload')}
          </Button>
        </main>
      );
    return this.props.children;
  }
}
