"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import Toast from "@/components/Toast";

export default function MyPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    const welcomeMessage = sessionStorage.getItem("welcomeMessage");
    if (welcomeMessage) {
      setToastMessage(welcomeMessage);
      sessionStorage.removeItem("welcomeMessage");
    }
  }, []);

  const handleLogout = async () => {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    setIsSigningOut(false);
    router.push("/");
  };

  if (isLoading || !user) return null;

  const username = (user.user_metadata?.username as string | undefined) ?? "회원";
  const phone = (user.user_metadata?.phone as string | undefined) ?? "-";

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-50 border-b border-brand-50 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-between px-6 py-4 sm:px-8">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-brand-500"
          >
            바른장례 <span className="text-brand-200">솔루션</span>
          </Link>
          <span className="text-sm font-medium text-brand-300">마이페이지</span>
        </div>
      </header>

      <main className="flex-1 bg-brand-50">
        <div className="mx-auto max-w-md px-6 py-12 sm:px-8 sm:py-16">
          <section className="rounded-2xl border border-brand-50 bg-white p-8 text-center">
            <h1 className="text-xl font-semibold text-brand-500 sm:text-2xl">
              안녕하세요, {username}님
            </h1>

            <dl className="mt-8 space-y-3 text-left">
              <div className="flex items-center justify-between rounded-xl bg-brand-50 px-5 py-3">
                <dt className="text-sm text-brand-300">아이디</dt>
                <dd className="text-sm font-semibold text-brand-500">
                  {username}
                </dd>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-brand-50 px-5 py-3">
                <dt className="text-sm text-brand-300">이메일</dt>
                <dd className="text-sm font-semibold text-brand-500">
                  {user.email}
                </dd>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-brand-50 px-5 py-3">
                <dt className="text-sm text-brand-300">연락처</dt>
                <dd className="text-sm font-semibold text-brand-500">
                  {phone}
                </dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isSigningOut}
              className="mt-8 w-full rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSigningOut ? "로그아웃 중..." : "로그아웃"}
            </button>
          </section>
        </div>
      </main>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}
