import Link from "next/link";

export default function FloatingConsultButton() {
  return (
    <Link
      href="/consultation"
      className="fixed bottom-6 right-6 z-40 rounded-full bg-brand-100 px-5 py-3 text-sm font-semibold text-brand-500 shadow-lg shadow-brand-200/30 transition-transform hover:scale-105 sm:hidden"
    >
      견적 상담
    </Link>
  );
}
