"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

type RecoveryMode = "none" | "findId" | "resetPassword";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.4H12v4.5h6.5c-.3 1.5-1.2 2.8-2.5 3.6v3h4C22.2 19 23.5 16 23.5 12.3Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 6-1.1 7.9-2.9l-4-3c-1.1.7-2.5 1.2-3.9 1.2-3 0-5.6-2-6.5-4.8H1.4v3.1C3.3 21.3 7.3 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.5 14.5c-.2-.7-.4-1.5-.4-2.5s.1-1.7.4-2.5V6.4H1.4C.5 8.1 0 10 0 12s.5 3.9 1.4 5.6l4.1-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.8c1.7 0 3.3.6 4.5 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.3 0 3.3 2.7 1.4 6.4l4.1 3.1c.9-2.8 3.5-4.7 6.5-4.7Z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [recoveryMode, setRecoveryMode] = useState<RecoveryMode>("none");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryResult, setRecoveryResult] = useState<string | null>(null);
  const [isRecoverySubmitting, setIsRecoverySubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/mypage");
    }
  }, [isLoading, user, router]);

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(`로그인에 실패했습니다: ${error.message}`);
      return;
    }

    router.push("/mypage");
  };

  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/login` },
    });
    if (error) {
      setErrorMessage(`Google 로그인에 실패했습니다: ${error.message}`);
    }
  };

  const openRecovery = (mode: RecoveryMode) => {
    setRecoveryMode((prev) => (prev === mode ? "none" : mode));
    setRecoveryEmail("");
    setRecoveryResult(null);
  };

  const handleFindId = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!recoveryEmail.trim()) return;

    setIsRecoverySubmitting(true);
    setRecoveryResult(null);

    const { data, error } = await supabase
      .from("usernames")
      .select("username")
      .eq("email", recoveryEmail.trim());

    setIsRecoverySubmitting(false);

    if (error || !data || data.length === 0) {
      setRecoveryResult("일치하는 정보가 없습니다");
      return;
    }
    setRecoveryResult(`회원님의 아이디는 ${data[0].username}입니다`);
  };

  const handleResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!recoveryEmail.trim()) return;

    setIsRecoverySubmitting(true);
    await supabase.auth.resetPasswordForEmail(recoveryEmail.trim(), {
      redirectTo: `${window.location.origin}/login`,
    });
    setIsRecoverySubmitting(false);
    // 계정 존재 여부를 추측할 수 없도록 항상 동일한 안내 문구를 보여준다
    setRecoveryResult("입력하신 이메일로 재설정 링크를 보내드렸습니다");
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
          <span className="text-sm font-medium text-brand-300">로그인</span>
        </div>
      </header>

      <main className="flex-1 bg-brand-50">
        <div className="mx-auto max-w-md px-6 py-12 sm:px-8 sm:py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-brand-500 sm:text-3xl">
              로그인
            </h1>
            <p className="mt-3 text-sm text-brand-300">
              아직 회원이 아니신가요?{" "}
              <Link
                href="/register/terms"
                className="font-semibold text-brand-200 hover:underline"
              >
                회원가입
              </Link>
            </p>
          </div>

          <form
            onSubmit={handleLoginSubmit}
            className="mt-8 rounded-2xl border border-brand-50 bg-white p-6 sm:p-8"
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-brand-500">
                  이메일
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="example@domain.com"
                  required
                  className="rounded-xl border border-brand-50 px-4 py-3 text-sm text-brand-500 outline-none focus:border-brand-200"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-brand-500">
                  비밀번호
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="비밀번호 입력"
                  required
                  className="rounded-xl border border-brand-50 px-4 py-3 text-sm text-brand-500 outline-none focus:border-brand-200"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-brand-100 px-6 py-4 text-base font-semibold text-brand-500 transition-colors hover:bg-brand-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "로그인 중..." : "로그인"}
              </button>

              <div className="flex items-center justify-center gap-4 text-xs">
                <button
                  type="button"
                  onClick={() => openRecovery("findId")}
                  className="font-medium text-brand-300 hover:text-brand-500"
                >
                  아이디 찾기
                </button>
                <span className="text-brand-100">|</span>
                <button
                  type="button"
                  onClick={() => openRecovery("resetPassword")}
                  className="font-medium text-brand-300 hover:text-brand-500"
                >
                  비밀번호 찾기
                </button>
              </div>

              {recoveryMode !== "none" && (
                <form
                  onSubmit={
                    recoveryMode === "findId" ? handleFindId : handleResetPassword
                  }
                  className="flex flex-col gap-3 rounded-xl bg-brand-50 p-4"
                >
                  <label className="text-xs font-semibold text-brand-400">
                    {recoveryMode === "findId"
                      ? "가입 시 등록한 이메일을 입력해 주세요"
                      : "가입 시 등록한 이메일로 재설정 링크를 보내드립니다"}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={recoveryEmail}
                      onChange={(event) => setRecoveryEmail(event.target.value)}
                      placeholder="example@domain.com"
                      required
                      className="flex-1 rounded-xl border border-brand-50 px-3 py-2 text-sm text-brand-500 outline-none focus:border-brand-200"
                    />
                    <button
                      type="submit"
                      disabled={isRecoverySubmitting}
                      className="shrink-0 rounded-xl bg-brand-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      확인
                    </button>
                  </div>
                  {recoveryResult && (
                    <p className="text-xs font-medium text-brand-400">
                      {recoveryResult}
                    </p>
                  )}
                </form>
              )}

              <div className="flex items-center gap-3 text-xs text-brand-300">
                <div className="h-px flex-1 bg-brand-50" />
                또는
                <div className="h-px flex-1 bg-brand-50" />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-3 rounded-full border border-brand-50 px-6 py-3 text-sm font-semibold text-brand-400 transition-colors hover:border-brand-100"
              >
                <GoogleIcon />
                Google 계정으로 로그인
              </button>

              {errorMessage && (
                <p className="text-sm text-red-500">{errorMessage}</p>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
