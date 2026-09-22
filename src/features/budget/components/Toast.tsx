"use client";

export function Toast({ message }: { message: string | null }) {
  return (
    <div
      className={`fixed left-1/2 bottom-6 -translate-x-1/2 rounded-md bg-ink px-4 py-2 font-mono text-xs text-paper shadow-lg transition-all duration-200 ${
        message ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-2"
      }`}
    >
      {message ?? ""}
    </div>
  );
}
