"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FUNERAL_TYPE_LABELS,
  GUEST_COUNT_LABELS,
  RELIGION_LABELS,
  type FuneralType,
  type GuestCount,
  type Religion,
} from "@/lib/funeral-estimate";

type StepKey = "funeralType" | "guestCount" | "religion";

type StepOption = {
  value: string;
  label: string;
  description?: string;
};

type StepConfig = {
  key: StepKey;
  title: string;
  subtitle: string;
  options: StepOption[];
};

const FUNERAL_TYPE_DESCRIPTIONS: Record<FuneralType, string> = {
  "3day": "빈소를 마련하는 전통적인 3일 장례",
  family: "가까운 가족·지인 중심의 소규모 장례",
  direct: "빈소 없이 진행하는 간소화된 장례",
};

const STEPS: StepConfig[] = [
  {
    key: "funeralType",
    title: "장례 형태를 선택해 주세요",
    subtitle: "희망하시는 장례 규모에 맞춰 비용을 비교해 드립니다",
    options: (Object.keys(FUNERAL_TYPE_LABELS) as FuneralType[]).map(
      (value) => ({
        value,
        label: FUNERAL_TYPE_LABELS[value],
        description: FUNERAL_TYPE_DESCRIPTIONS[value],
      }),
    ),
  },
  {
    key: "guestCount",
    title: "예상 조문객 수는 어느 정도인가요?",
    subtitle: "조문객 규모에 따라 음식, 공간 비용이 달라집니다",
    options: (Object.keys(GUEST_COUNT_LABELS) as GuestCount[]).map(
      (value) => ({
        value,
        label: GUEST_COUNT_LABELS[value],
      }),
    ),
  },
  {
    key: "religion",
    title: "종교 스타일을 선택해 주세요",
    subtitle: "종교에 따라 의식 절차와 비용 구성이 달라집니다",
    options: (Object.keys(RELIGION_LABELS) as Religion[]).map((value) => ({
      value,
      label: RELIGION_LABELS[value],
    })),
  },
];

const TOTAL_STEPS = STEPS.length;

export default function QuotePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<StepKey, string | null>>({
    funeralType: null,
    guestCount: null,
    religion: null,
  });

  const progressPercent = (step / TOTAL_STEPS) * 100;
  const currentStep = STEPS[step];

  const handleSelect = (key: StepKey, value: string) => {
    const updatedAnswers = { ...answers, [key]: value };
    setAnswers(updatedAnswers);

    const isLastStep = step + 1 >= TOTAL_STEPS;
    if (isLastStep) {
      const params = new URLSearchParams({
        funeralType: updatedAnswers.funeralType ?? "",
        guestCount: updatedAnswers.guestCount ?? "",
        religion: updatedAnswers.religion ?? "",
      });
      router.push(`/quote/result?${params.toString()}`);
      return;
    }

    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
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
            {step + 1} / {TOTAL_STEPS} 단계
          </span>
        </div>
      </header>

      <main className="flex-1 bg-brand-50">
        <div className="mx-auto max-w-3xl px-6 py-12 sm:px-8 sm:py-16">
          {/* 타이틀 */}
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-brand-500 sm:text-3xl">
              1분 만에 끝나는 투명한 부울경 장례비 견적
            </h1>
            <p className="mt-3 text-sm text-brand-300 sm:text-base">
              간단한 질문 {TOTAL_STEPS}가지에 답하면 정찰 견적을 비교해 드립니다
            </p>
          </div>

          {/* 진행률 바 + 상단 이전 버튼 */}
          <div className="mt-8 flex items-center gap-4">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 0}
              className={`flex-shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                step === 0
                  ? "cursor-not-allowed border-brand-50 text-brand-100"
                  : "border-brand-100 text-brand-300 hover:border-brand-200 hover:text-brand-500"
              }`}
            >
              ← 이전
            </button>
            <div className="h-2 w-full overflow-hidden rounded-full bg-brand-50">
              <div
                className="h-full rounded-full bg-brand-200 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* 질문 / 선택지 */}
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-brand-500 sm:text-2xl">
              {currentStep.title}
            </h2>
            <p className="mt-2 text-sm text-brand-300 sm:text-base">
              {currentStep.subtitle}
            </p>

            <div
              className={`mt-8 grid gap-4 ${
                currentStep.options.length === 3
                  ? "sm:grid-cols-3"
                  : "sm:grid-cols-2"
              }`}
            >
              {currentStep.options.map((option) => {
                const isSelected = answers[currentStep.key] === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(currentStep.key, option.value)}
                    className={`flex min-h-24 flex-col items-start justify-center gap-1 rounded-2xl border-2 px-6 py-5 text-left transition-colors ${
                      isSelected
                        ? "border-brand-200 bg-brand-50"
                        : "border-brand-50 bg-white hover:border-brand-100"
                    }`}
                  >
                    <span className="text-base font-semibold text-brand-500 sm:text-lg">
                      {option.label}
                    </span>
                    {option.description && (
                      <span className="text-sm text-brand-300">
                        {option.description}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
