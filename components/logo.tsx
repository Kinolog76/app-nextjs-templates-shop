export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden>
      <rect x="2" y="2" width="32" height="32" rx="9" fill="url(#lg)" />
      <path d="M18 9l6.5 6.5L18 27l-6.5-11.5L18 9z" fill="#fff" opacity="0.95" />
      <defs>
        <linearGradient id="lg" x1="2" y1="2" x2="34" y2="34">
          <stop stopColor="#5B3FFF" />
          <stop offset="1" stopColor="#7C5CFF" />
        </linearGradient>
      </defs>
    </svg>
  );
}
