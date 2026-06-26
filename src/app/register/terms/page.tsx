"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Toast from "@/components/Toast";

export default function RegisterTermsPage() {
  const router = useRouter();
  const [isAgreed, setIsAgreed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleContinue = () => {
    if (!isAgreed) {
      setToastMessage("필수 약관 동의가 필요합니다.");
      return;
    }
    sessionStorage.setItem("termsAgreed", "true");
    router.push("/register/form");
  };

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
          <span className="text-sm font-medium text-brand-300">
            약관 동의
          </span>
        </div>
      </header>

      <main className="flex-1 bg-brand-50">
        <div className="mx-auto max-w-md px-6 py-12 sm:px-8 sm:py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-brand-500 sm:text-3xl">
              회원가입을 시작합니다
            </h1>
            <p className="mt-3 text-sm text-brand-300">
              가입 전 아래 약관에 동의해 주세요
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-brand-50 bg-white p-6 sm:p-8">
            <div className="h-40 overflow-y-auto rounded-xl border border-brand-50 bg-brand-50 p-4 text-xs leading-relaxed text-brand-300">
              바른장례 솔루션은 회원가입 시 입력하신 이름, 연락처, 이메일 정보를
              상담 및 서비스 제공 목적으로만 수집·이용합니다. 수집된
              정보는 목적 달성 후 지체 없이 파기하며, 동의 없이 제3자에게
              제공하지 않습니다. (교육용 데모 페이지의 예시 약관 문구입니다)
            </div>

            <label className="mt-6 flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={isAgreed}
                onChange={(event) => setIsAgreed(event.target.checked)}
                className="h-5 w-5 rounded border-brand-100 text-brand-200 focus:ring-brand-200"
              />
              <span className="text-sm font-semibold text-brand-500">
                [필수] 개인정보 수집 및 이용에 동의합니다
              </span>
            </label>

            <button
              type="button"
              onClick={handleContinue}
              className="mt-8 w-full rounded-full bg-brand-100 px-6 py-4 text-base font-semibold text-brand-500 transition-colors hover:bg-brand-200"
            >
              동의하고 계속하기
            </button>
          </div>
        </div>
      </main>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}
