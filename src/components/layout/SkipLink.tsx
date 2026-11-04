export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only z-[100] rounded-btn bg-blue-600 px-4 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
    >
      Skip to main content
    </a>
  );
}
