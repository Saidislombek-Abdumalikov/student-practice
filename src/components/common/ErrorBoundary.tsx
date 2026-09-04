import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
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
    console.error('Uncaught React Error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetSession = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // Ignored
    }
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-full max-w-md bg-slate-900/90 border-2 border-rose-500/40 rounded-3xl p-8 shadow-2xl space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center text-3xl">
              ⚠️
            </div>

            <h1 className="text-2xl font-black text-white">Something Went Wrong</h1>
            
            <p className="text-sm text-slate-400 leading-relaxed">
              An unexpected display issue occurred. Don't worry, your learning progress is safely backed up.
            </p>

            {this.state.error?.message && (
              <div className="p-3 bg-slate-950 rounded-xl text-left border border-slate-800 text-xs font-mono text-rose-300 break-words overflow-auto max-h-32">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
              >
                Reload App
              </button>
              <button
                onClick={this.handleResetSession}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm border border-slate-700 transition-all active:scale-95"
              >
                Reset Session
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
