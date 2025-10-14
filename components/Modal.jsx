"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({ open, onClose, children, ariaLabel = "dialog" }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      aria-modal="true"
      role={ariaLabel}
      style={{ position: "fixed", inset: 0, zIndex: 99999 }}
      className="bg-black bg-opacity-50 flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
        style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}


