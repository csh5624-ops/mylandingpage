"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

const NAV_LINKS = [
  { href: "/#philosophy", label: "서비스 소개" },
  { href: "/#process", label: "이용 방법" },
  { href: "/quote", label: "1분 견적 확인" },
  { href: "/consultation", label: "상담 신청" },
];

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const authLink = user
    ? { href: "/mypage", label: "마이페이지" }
    : { href: "/login", label: "로그인" };

  useEffect(() => {
    if (!isMenuOpen) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-50 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo-lotus.png"
            alt="바른장례 솔루션 로고"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="text-lg font-semibold tracking-tight text-brand-500">
            바른장례 <span className="text-brand-200">솔루션</span>
          </span>
        </Link>

        {/* 데스크톱 가로 메뉴 */}
        <nav className="hidden items-center gap-8 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-brand-300 transition-colors hover:text-brand-500"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={authLink.href}
            className="text-sm font-medium text-brand-300 transition-colors hover:text-brand-500"
          >
            {authLink.label}
          </Link>
        </nav>

        <Link
          href="/quote"
          className="hidden rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-400 sm:block"
        >
          장례비 확인하기
        </Link>

        {/* 모바일 햄버거 버튼 */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(true)}
          aria-label="메뉴 열기"
          aria-expanded={isMenuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-full text-brand-500 sm:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            className="h-6 w-6"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* 모바일 백드롭 + 슬라이드 사이드바 */}
      <div
        aria-hidden={!isMenuOpen}
        onClick={() => setIsMenuOpen(false)}
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 sm:hidden ${
          isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="모바일 메뉴"
        className={`fixed right-0 top-0 z-50 h-full w-72 transform bg-white shadow-xl transition-transform duration-300 ease-in-out sm:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-brand-50 px-6 py-4">
          <span className="text-base font-semibold text-brand-500">메뉴</span>
          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            aria-label="메뉴 닫기"
            className="flex h-9 w-9 items-center justify-center rounded-full text-brand-300 hover:text-brand-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              className="h-5 w-5"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-4 py-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="rounded-xl px-3 py-3 text-base font-medium text-brand-400 transition-colors hover:bg-brand-50 hover:text-brand-500"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={authLink.href}
            onClick={() => setIsMenuOpen(false)}
            className="rounded-xl px-3 py-3 text-base font-medium text-brand-400 transition-colors hover:bg-brand-50 hover:text-brand-500"
          >
            {authLink.label}
          </Link>
        </nav>

        <div className="px-4">
          <Link
            href="/quote"
            onClick={() => setIsMenuOpen(false)}
            className="block rounded-full bg-brand-100 px-4 py-3 text-center text-sm font-semibold text-brand-500 transition-colors hover:bg-brand-200"
          >
            1분 만에 장례비 확인하기
          </Link>
        </div>
      </div>
    </header>
  );
}
