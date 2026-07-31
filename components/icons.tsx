// Единый набор inline-иконок (stroke, 24×24)
export function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: string;
  className?: string;
}) {
  const paths: Record<string, React.ReactNode> = {
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    layers: (
      <>
        <path d="M12 3l9 5-9 5-9-5 9-5z" />
        <path d="M3 13l9 5 9-5" />
      </>
    ),
    sliders: (
      <>
        <path d="M4 8h10M18 8h2M4 16h4M12 16h8" />
        <circle cx="16" cy="8" r="2" />
        <circle cx="10" cy="16" r="2" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        <path d="M16 4.5a3.5 3.5 0 010 7M17.5 14.5c2.1.8 3.5 2.9 3.5 5.5" />
      </>
    ),
    zap: <path d="M13 2L4.5 13.5H11L9.5 22 19 10.5h-6.5L13 2z" />,
    refresh: (
      <>
        <path d="M20 8a8 8 0 00-14.5-2M4 16a8 8 0 0014.5 2" />
        <path d="M20 3v5h-5M4 21v-5h5" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v11M7.5 10.5L12 15l4.5-4.5" />
        <path d="M4 18.5V20h16v-1.5" />
      </>
    ),
    star: <path d="M12 3l2.7 5.8 6.3.8-4.7 4.3 1.2 6.1L12 17l-5.5 3 1.2-6.1L3 9.6l6.3-.8L12 3z" />,
    infinity: (
      <path d="M8 15.5c-2 0-3.5-1.6-3.5-3.5S6 8.5 8 8.5c3.5 0 4.5 7 8 7 2 0 3.5-1.6 3.5-3.5S18 8.5 16 8.5c-3.5 0-4.5 7-8 7z" />
    ),
    lock: (
      <>
        <rect x="5" y="11" width="14" height="9" rx="2.5" />
        <path d="M8 11V8a4 4 0 018 0v3" />
      </>
    ),
    check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
    search: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="M20 20l-4.2-4.2" />
      </>
    ),
    heart: (
      <path d="M12 20s-7.5-4.7-9-9.2C2.1 8 3.9 5 7 5c2 0 3.5 1 5 3 1.5-2 3-3 5-3 3.1 0 4.9 3 4 5.8-1.5 4.5-9 9.2-9 9.2z" />
    ),
    calendar: (
      <>
        <rect x="4" y="5" width="16" height="16" rx="2.5" />
        <path d="M4 10h16M8 3v4M16 3v4" />
      </>
    ),
    cart: (
      <>
        <path d="M3 4h2.5l2.2 11.5A2 2 0 009.7 17H17a2 2 0 002-1.6L20.5 8H6" />
        <circle cx="10" cy="20.5" r="1.4" />
        <circle cx="17" cy="20.5" r="1.4" />
      </>
    ),
    arrowRight: <path d="M4 12h16m-6-6l6 6-6 6" />,
    badge: (
      <>
        <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" />
      </>
    ),
    file: (
      <>
        <path d="M7 3h7l4 4v14H7V3z" />
        <path d="M14 3v4h4" />
      </>
    ),
    trash: (
      <>
        <path d="M4 7h16M9 7V5h6v2M6.5 7l1 13h9l1-13" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {paths[name] ?? <circle cx="12" cy="12" r="9" />}
    </svg>
  );
}
