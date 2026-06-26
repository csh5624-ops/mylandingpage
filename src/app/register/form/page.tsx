"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";

type UsernameStatus = "idle" | "checking" | "available" | "taken";

const PASSWORD_RULES: { label: string; test: (value: string) => boolean }[] = [
  { label: "8자 이상", test: (value) => value.length >= 8 },
  { label: "대문자 포함", test: (value) => /[A-Z]/.test(value) },
  { label: "소문자 포함", test: (value) => /[a-z]/.test(value) },
  { label: "숫자 포함", test: (value) => /\d/.test(value) },
  { label: "특수문자 포함 (!@#$%^&*)", test: (value) => /[!@#$%^&*]/.test(value) },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^01[0-9]{8,9}$/;

function fieldBorderClass(status: boolean | null) {
  if (status === null) return "border-brand-50 focus:border-brand-200";
  return status ? "border-green-500" : "border-red-500";
}

function EyeIcon({ visible }: { visible: boolean }) {
  if (visible) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="M9.9 5.2A10.4 10.4 0 0 1 12 5c6.5 0 10 7 10 7a16.7 16.7 0 0 1-3.1 4.1M6.6 6.6C4 8.3 2 12 2 12s3.5 7 10 7a10.4 10.4 0 0 0 3.4-.6" />
    </svg>
  );
}

export default function RegisterFormPage() {
  const router = useRouter();
  const [isTermsChecked, setIsTermsChecked] = useState<boolean | null>(null);

  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 약관 동의 게이트: 동의 없이 들어오면 /register/terms로 되돌림
  useEffect(() => {
    const agreed = sessionStorage.getItem("termsAgreed") === "true";
    if (!agreed) {
      router.replace("/register/terms");
      return;
    }
    setIsTermsChecked(true);
  }, [router]);

  // 더미 아이디 50개 시딩 (교육용: insert 동작 확인)
  useEffect(() => {
    if (!isTermsChecked) return;
    const seedDummyUsernames = async () => {
      const dummyRows = Array.from({ length: 50 }, () => ({
        username: `user${Math.random().toString(36).slice(2, 8)}`,
      }));
      await supabase.from("usernames").insert(dummyRows);
    };
    seedDummyUsernames();
  }, [isTermsChecked]);

  const isPhoneTouched = phone.length > 0;
  const isPhoneValid = isPhoneTouched && PHONE_PATTERN.test(phone);

  const isEmailTouched = email.length > 0;
  const isEmailValid = isEmailTouched && EMAIL_PATTERN.test(email);

  const passwordRuleResults = PASSWORD_RULES.map((rule) => rule.test(password));
  const isPasswordValid = passwordRuleResults.every(Boolean);

  const isPasswordConfirmTouched = passwordConfirm.length > 0;
  const isPasswordMatch = isPasswordConfirmTouched && password === passwordConfirm;

  const isFormValid =
    usernameStatus === "available" &&
    isPhoneValid &&
    isEmailValid &&
    isPasswordValid &&
    isPasswordMatch;

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    setUsernameStatus("idle");
  };

  const handleCheckUsername = async () => {
    if (!username.trim()) return;
    setUsernameStatus("checking");
    const { data, error } = await supabase
      .from("usernames")
      .select("username")
      .eq("username", username.trim());

    if (error) {
      setUsernameStatus("idle");
      setErrorMessage("중복 확인에 실패했습니다. 다시 시도해 주세요");
      return;
    }
    setUsernameStatus(data && data.length > 0 ? "taken" : "available");
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value.replace(/\D/g, ""));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username, phone } },
    });

    if (error) {
      setErrorMessage(`회원가입에 실패했습니다: ${error.message}`);
      setIsSubmitting(false);
      return;
    }

    await supabase
      .from("usernames")
      .insert({ username, email, auth_user_id: data.user?.id ?? null });

    setIsSubmitting(false);
    sessionStorage.removeItem("termsAgreed");
    sessionStorage.setItem("welcomeMessage", `환영합니다, ${username}님!`);
    router.push("/mypage");
  };

  if (!isTermsChecked) return null;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-50 border-b border-brand-50 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4 sm:px-8">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-brand-500"
          >
            바른장례 <span className="text-brand-200">솔루션</span>
          </Link>
          <span className="text-sm font-medium text-brand-300">회원가입</span>
        </div>
      </header>

      <main className="flex-1 bg-brand-50">
        <div className="mx-auto max-w-2xl px-6 py-12 sm:px-8 sm:py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-brand-500 sm:text-3xl">
              회원가입
            </h1>
            <p className="mt-3 text-sm text-brand-300 sm:text-base">
              DB 통신 및 폼 검증 로직 학습용 페이지입니다
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-2xl border border-brand-50 bg-white p-6 sm:p-8"
          >
            <div className="flex flex-col gap-6">
              {/* 아이디 */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-brand-500">
                  아이디
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={username}
                    onChange={(event) => handleUsernameChange(event.target.value)}
                    placeholder="아이디 입력"
                    maxLength={20}
                    required
                    className={`flex-1 rounded-xl border px-4 py-3 text-sm text-brand-500 outline-none ${fieldBorderClass(
                      usernameStatus === "idle" || usernameStatus === "checking"
                        ? null
                        : usernameStatus === "available",
                    )}`}
                  />
                  <button
                    type="button"
                    onClick={handleCheckUsername}
                    disabled={!username.trim() || usernameStatus === "checking"}
                    className="shrink-0 rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {usernameStatus === "checking" ? "확인 중..." : "중복확인"}
                  </button>
                </div>
                {usernameStatus === "available" && (
                  <p className="text-xs font-medium text-green-600">
                    사용 가능한 아이디입니다
                  </p>
                )}
                {usernameStatus === "taken" && (
                  <p className="text-xs font-medium text-red-500">
                    이미 사용 중인 아이디입니다
                  </p>
                )}
              </div>

              {/* 연락처 */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-brand-500">
                  연락처
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => handlePhoneChange(event.target.value)}
                  placeholder="01012345678 (숫자만 입력)"
                  maxLength={11}
                  required
                  className={`rounded-xl border px-4 py-3 text-sm text-brand-500 outline-none ${fieldBorderClass(
                    isPhoneTouched ? isPhoneValid : null,
                  )}`}
                />
                {isPhoneTouched && !isPhoneValid && (
                  <p className="text-xs font-medium text-red-500">
                    010으로 시작하는 10~11자리 숫자를 입력해 주세요
                  </p>
                )}
              </div>

              {/* 이메일 */}
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
                  className={`rounded-xl border px-4 py-3 text-sm text-brand-500 outline-none ${fieldBorderClass(
                    isEmailTouched ? isEmailValid : null,
                  )}`}
                />
                {isEmailTouched && !isEmailValid && (
                  <p className="text-xs font-medium text-red-500">
                    올바른 이메일 형식이 아닙니다
                  </p>
                )}
              </div>

              {/* 비밀번호 */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-brand-500">
                  비밀번호
                </label>
                <div
                  className={`flex items-center rounded-xl border px-4 ${fieldBorderClass(
                    password.length > 0 ? isPasswordValid : null,
                  )}`}
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="비밀번호 입력"
                    required
                    className="flex-1 py-3 text-sm text-brand-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                    className="text-brand-300 hover:text-brand-500"
                  >
                    <EyeIcon visible={showPassword} />
                  </button>
                </div>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {PASSWORD_RULES.map((rule, index) => (
                    <li
                      key={rule.label}
                      className={`text-xs font-medium ${
                        passwordRuleResults[index]
                          ? "text-green-600"
                          : "text-brand-300"
                      }`}
                    >
                      {passwordRuleResults[index] ? "✓" : "・"} {rule.label}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 비밀번호 확인 */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-brand-500">
                  비밀번호 확인
                </label>
                <div
                  className={`flex items-center rounded-xl border px-4 ${fieldBorderClass(
                    isPasswordConfirmTouched ? isPasswordMatch : null,
                  )}`}
                >
                  <input
                    type={showPasswordConfirm ? "text" : "password"}
                    value={passwordConfirm}
                    onChange={(event) => setPasswordConfirm(event.target.value)}
                    placeholder="비밀번호 다시 입력"
                    required
                    className="flex-1 py-3 text-sm text-brand-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm((prev) => !prev)}
                    aria-label={
                      showPasswordConfirm ? "비밀번호 숨기기" : "비밀번호 보기"
                    }
                    className="text-brand-300 hover:text-brand-500"
                  >
                    <EyeIcon visible={showPasswordConfirm} />
                  </button>
                </div>
                {isPasswordConfirmTouched && (
                  <p
                    className={`text-xs font-medium ${
                      isPasswordMatch ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {isPasswordMatch
                      ? "비밀번호가 일치합니다"
                      : "비밀번호가 일치하지 않습니다"}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="rounded-full bg-brand-100 px-6 py-4 text-base font-semibold text-brand-500 transition-colors hover:bg-brand-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "가입 중..." : "회원가입"}
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
