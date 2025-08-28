export default function Skeleton({ className='' }: { className?: string }) {
  return <div className={`animate-pulse bg-[var(--panel)] rounded-xl ${className}`} />;
}
