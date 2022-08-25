import { Component, ReactNode } from 'react';

export interface ErrorBoundaryProps {
  /** The children to catch errors from */
  children: ReactNode;
  /** Force production display even in development */
  forceProductionError?: boolean;
  /** Callback for when an error occurs */
  onError?: Component['componentDidCatch'];
  /** Callback when a user clicks the refresh/primary button */
  onReset?: () => void;
  /** A custom label for the refresh/primary button */
  resetButtonLabel?: ReactNode;
  /** The subtitle of the error message */
  subTitle?: ReactNode;
  /** The main title of the error message */
  title?: ReactNode;
}

/**
 * Renders a component that will catch errors of interior components
 * @example
 * <ErrorBoundary
 *   onReset={redirectToAnotherPage}
 *   resetButtonLabel="Go back"
 *   title="Whoops. Something happened."
 *   subTitle="Please try refreshing the page or navigating to the home page."
 * >
 *   <MyComponent />
 * </ErrorBoundary>
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps> {}
