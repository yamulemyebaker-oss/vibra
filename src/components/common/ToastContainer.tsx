/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNotification();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <Info className="w-4 h-4 text-indigo-400 shrink-0" />;
        let borderClass = 'border-indigo-500/30';
        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
          borderClass = 'border-emerald-500/30';
        } else if (toast.type === 'warning' || toast.type === 'error') {
          icon = <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
          borderClass = 'border-rose-500/30';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl bg-neutral-900/95 backdrop-blur-md border ${borderClass} shadow-xl shadow-black/40 text-neutral-200 text-xs transition-all duration-200`}
          >
            <div className="flex items-center gap-2.5">
              {icon}
              <p className="leading-tight font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-neutral-200 p-1 transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
