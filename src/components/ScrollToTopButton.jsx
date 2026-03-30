import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // optional: hide/reset on route change
    setVisible(false);
  }, [location.pathname]);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-6 z-50 rounded-full bg-indigo-600 text-white px-4 py-3 shadow-lg transition ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-label="Scroll to top"
    >
      ↑ Top
    </button>
  );
}