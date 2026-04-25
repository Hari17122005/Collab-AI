import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/src/lib/utils";
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {" "}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />{" "}
      <div
        className={cn(
          "relative w-full max-w-lg rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200",
          className,
        )}
      >
        {" "}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 px-6 py-4">
          {" "}
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h2>{" "}
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          >
            {" "}
            <X className="h-5 w-5" />{" "}
          </button>{" "}
        </div>{" "}
        <div className="p-6"> {children} </div>{" "}
      </div>{" "}
    </div>
  );
}
