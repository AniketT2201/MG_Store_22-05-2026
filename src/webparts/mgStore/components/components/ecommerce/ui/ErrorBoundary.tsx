import * as React from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  /**
   * Short label shown in the fallback UI so it's obvious which part of the
   * page failed (e.g. "product details", "reviews"). Defaults to a generic
   * message when omitted.
   */
  section?: string;
  /**
   * Optional custom fallback renderer. Receives the caught error and a
   * reset() function that re-mounts the boundary's children.
   */
  fallback?: (error: Error, reset: () => void) => React.ReactNode;
  /**
   * Called whenever an error is caught, in addition to the default
   * console logging. Use this to wire up centralized logging (e.g.
   * Application Insights) without changing this component.
   */
  onError?: (error: Error, info: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * A React error boundary must be a class component — there is no hook
 * equivalent of getDerivedStateFromError / componentDidCatch.
 *
 * Usage:
 *   <ErrorBoundary section="product reviews">
 *     <ReviewList ... />
 *   </ErrorBoundary>
 *
 * Wrap it around any part of the tree that renders unpredictable data
 * (anything backed by a SharePoint list query) so a single bad response
 * degrades that section gracefully instead of white-screening the whole
 * web part.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  public componentDidCatch(error: Error, info: React.ErrorInfo): void {
    // Always log locally so failures aren't completely silent even if
    // onError isn't wired up yet.
    // eslint-disable-next-line no-console
    console.error(`[ErrorBoundary${this.props.section ? `:${this.props.section}` : ""}]`, error, info);
    this.props.onError?.(error, info);
  }

  private reset = (): void => {
    this.setState({ error: null });
  };

  public render(): React.ReactNode {
    const { error } = this.state;

    if (!error) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback(error, this.reset);
    }

    return (
      <div className="flex flex-col items-center justify-center text-center py-12 px-6 bg-card border border-border rounded-xl">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <AlertTriangle className="w-7 h-7 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">
          {this.props.section ? `We couldn't load ${this.props.section}` : "Something went wrong"}
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          This part of the page hit an unexpected error. The rest of the site is unaffected —
          you can try again or continue browsing.
        </p>
        <button
          onClick={this.reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
          Try again
        </button>
      </div>
    );
  }
}
