"use client";

import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export default function Background({ className }: Props) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      {/* soft gradient blobs */}
      <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-500/25 via-indigo-500/20 to-cyan-400/20 blur-3xl" />
      <div className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-gradient-to-tr from-blue-500/15 via-sky-400/15 to-violet-500/15 blur-3xl" />

      {/* subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] opacity-40 [background-size:28px_28px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
    </div>
  );
}
