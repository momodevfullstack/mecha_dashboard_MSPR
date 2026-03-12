import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-slate-500 bg-white p-8 rounded-xl shadow-sm border border-slate-100">
          <AlertTriangle className="w-12 h-12 text-rose-500 mb-4" />
          <h2 className="text-xl font-semibold text-slate-800">Une erreur est survenue</h2>
          <p className="mt-2 text-sm text-center max-w-md">
            {this.state.error?.message || "Erreur inattendue."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
