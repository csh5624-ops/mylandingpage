"use client";

import { useEffect } from "react";

type ToastProps = {
  message: string;
  onClose: () => void;
};

export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div className="fixed right-6 top-20 z-50 rounded-xl border border-brand-100 bg-brand-500 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-brand-200/20">
      {message}
    </div>
  );
}
