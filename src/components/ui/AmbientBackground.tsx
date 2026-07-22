interface AmbientBackgroundProps {
  variant?: "full" | "subtle";
  className?: string;
}

export function AmbientBackground({ variant = "full", className }: AmbientBackgroundProps) {
  return (
    <div className={`ambient-blobs ${className ?? ""}`} aria-hidden="true">
      <div className="ambient-blob ambient-blob--rose" />
      <div className="ambient-blob ambient-blob--gold" />
      {variant === "full" && (
        <>
          <div className="ambient-blob ambient-blob--lavender" />
          <div className="ambient-blob ambient-blob--peach" />
        </>
      )}
    </div>
  );
}
