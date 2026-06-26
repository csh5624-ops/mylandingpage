"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { GUEST_COUNT_LABELS, type GuestCount } from "@/lib/funeral-estimate";

type FuneralMethod = "cremation" | "burial";
type Region = "busan" | "ulsan" | "gyeongnam" | "etc";

const FUNERAL_METHOD_OPTIONS: { value: FuneralMethod; label: string }[] = [
  { value: "cremation", label: "화장" },
  { value: "burial", label: "매장" },
];

const GUEST_COUNT_OPTIONS = (
  Object.keys(GUEST_COUNT_LABELS) as GuestCount[]
).map((value) => ({ value, label: GUEST_COUNT_LABELS[value] }));

const REGION_OPTIONS: { value: Region; label: string }[] = [
  { value: "busan", label: "부산" },
  { value: "ulsan", label: "울산" },
  { value: "gyeongnam", label: "경남" },
  { value: "etc", label: "기타" },
];

export default function ConsultationPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [funeralMethod, setFuneralMethod] = useState<FuneralMethod | null>(
    null,
  );
  const [expectedGuests, setExpectedGuests] = useState<GuestCount | null>(
    null,
  );
  const [region, setRegion] = useState<Region | null>(null);
  const [additionalNotes, setAdditionalNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isFormValid =
    name.trim() !== "" &&
    phone.trim() !== "" &&
    funeralMethod !== null &&
    expectedGuests !== null &&
    region !== null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormValid || !funeralMethod || !expectedGuests || !region) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const { error } = await supabase.from("consultations").insert({
      name: name.trim(),
      phone: phone.trim(),
      funeral_method: funeralMethod,
      expected_guests: expectedGuests,
      region,
      additional_notes: additionalNotes.trim() || null,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage("접수에 실패했습니다. 잠시 후 다시 시도해 주세요");
      return;
    }

    setIsSubmitted(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-50 border-b border-brand-50 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4 sm:px-8">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-brand-500"
          >
            바른장례 <span className="text-brand-200">솔루션</span>
          </Link>
          <span className="text-sm font-medium text-brand-300">
            맞춤 상담 신청
          </span>
        </div>
      </header>

      <main className="flex-1 bg-brand-50">
        <div className="mx-auto max-w-3xl px-6 py-12 sm:px-8 sm:py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-brand-500 sm:text-3xl">
              맞춤형 장례 견적 상담 신청
            </h1>
            <p className="mt-3 text-sm text-brand-300 sm:text-base">
              간단한 정보를 남겨주시면 부울경 지역 장례 전문가가 직접
              연락드립니다
            </p>
          </div>

          {isSubmitted ? (
            <section className="mt-10 rounded-2xl border border-brand-50 bg-white p-8 text-center">
              <h2 className="text-xl font-semibold text-brand-500 sm:text-2xl">
                성공적으로 접수되었습니다. 곧 연락드리겠습니다
              </h2>
              <p className="mt-3 text-sm text-brand-300">
                남겨주신 연락처로 부울경 지역 장례 전문가가 안내해 드립니다
              </p>
              <Link
                href="/"
                className="mt-8 inline-block rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-400"
              >
                메인으로 돌아가기
              </Link>
            </section>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-10 rounded-2xl border border-brand-50 bg-white p-6 sm:p-8"
            >
              <div className="flex flex-col gap-8">
                {/* 고객명 / 연락처 */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-brand-500">
                      고객명
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="이름"
                      maxLength={30}
                      required
                      className="rounded-xl border border-brand-50 px-4 py-3 text-sm text-brand-500 outline-none focus:border-brand-200"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-brand-500">
                      연락처
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="010-1234-5678"
                      maxLength={20}
                      required
                      className="rounded-xl border border-brand-50 px-4 py-3 text-sm text-brand-500 outline-none focus:border-brand-200"
                    />
                  </div>
                </div>

                {/* 장례 방식 */}
                <div className="flex flex-col gap-3">
                  <span className="text-sm font-semibold text-brand-500">
                    장례 방식
                  </span>
                  <div className="grid grid-cols-2 gap-4">
                    {FUNERAL_METHOD_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFuneralMethod(option.value)}
                        className={`flex min-h-16 items-center justify-center rounded-2xl border-2 px-4 py-4 text-sm font-semibold transition-colors sm:text-base ${
                          funeralMethod === option.value
                            ? "border-brand-200 bg-brand-50 text-brand-500"
                            : "border-brand-50 bg-white text-brand-400 hover:border-brand-100"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 예상 조문객 수 */}
                <div className="flex flex-col gap-3">
                  <span className="text-sm font-semibold text-brand-500">
                    예상 조문객 수
                  </span>
                  <div className="grid grid-cols-2 gap-4">
                    {GUEST_COUNT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setExpectedGuests(option.value)}
                        className={`flex min-h-16 items-center justify-center rounded-2xl border-2 px-4 py-4 text-sm font-semibold transition-colors sm:text-base ${
                          expectedGuests === option.value
                            ? "border-brand-200 bg-brand-50 text-brand-500"
                            : "border-brand-50 bg-white text-brand-400 hover:border-brand-100"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 희망 장례 지역 */}
                <div className="flex flex-col gap-3">
                  <span className="text-sm font-semibold text-brand-500">
                    희망 장례 지역
                  </span>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {REGION_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setRegion(option.value)}
                        className={`flex min-h-16 items-center justify-center rounded-2xl border-2 px-4 py-4 text-sm font-semibold transition-colors sm:text-base ${
                          region === option.value
                            ? "border-brand-200 bg-brand-50 text-brand-500"
                            : "border-brand-50 bg-white text-brand-400 hover:border-brand-100"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 추가 문의사항 */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-brand-500">
                    추가 문의사항{" "}
                    <span className="font-normal text-brand-300">
                      (선택)
                    </span>
                  </label>
                  <textarea
                    value={additionalNotes}
                    onChange={(event) => setAdditionalNotes(event.target.value)}
                    placeholder="궁금하신 점이나 요청 사항을 자유롭게 남겨주세요"
                    maxLength={500}
                    rows={4}
                    className="resize-none rounded-xl border border-brand-50 px-4 py-3 text-sm text-brand-500 outline-none focus:border-brand-200"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="rounded-full bg-brand-100 px-6 py-4 text-base font-semibold text-brand-500 transition-colors hover:bg-brand-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "접수 중..." : "상담 신청하기"}
                </button>
                {errorMessage && (
                  <p className="text-sm text-red-500">{errorMessage}</p>
                )}
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
