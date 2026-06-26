"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  REGION_LABELS,
  ROOM_SIZE_LABELS,
  ROOM_SIZE_DESCRIPTIONS,
  GUEST_COUNT_LABELS,
  URGENCY_LABELS,
  getFacilitiesByRegion,
  getFacilityById,
  getAvailableSizes,
  type Region,
  type RoomSize,
  type GuestCount,
  type Urgency,
} from "@/lib/funeral-estimate";

type Answers = {
  region: Region | null;
  facilityId: string | null;
  roomSize: RoomSize | null;
  guestCount: GuestCount | null;
  urgency: Urgency | null;
};

const TOTAL_STEPS = 5;

const STEP_TITLES = [
  "어디서 장례를 치르고자 하시나요?",
  "장례식장을 선택해 주세요",
  "빈소 규모를 선택해 주세요",
  "예상 조문객 수를 선택해 주세요",
  "장례 준비 상황을 알려주세요",
];

const STEP_SUBTITLES = [
  "지역을 선택하시면 해당 지역 장례식장을 안내해 드립니다",
  "선택하신 지역의 장례식장 목록입니다",
  "빈소 규모에 따라 비용이 달라집니다 (3일 기준 계산)",
  "조문객 수에 따라 접객료가 산정됩니다 (인당 3만원)",
  "상황에 맞게 안내해 드리겠습니다",
];

type Option = { value: string; label: string; description?: string };

export default function QuotePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    region: null,
    facilityId: null,
    roomSize: null,
    guestCount: null,
    urgency: null,
  });

  const progressPercent = (step / TOTAL_STEPS) * 100;

  const getOptions = (): Option[] => {
    switch (step) {
      case 0:
        return (Object.keys(REGION_LABELS) as Region[]).map((r) => ({
          value: r,
          label: REGION_LABELS[r],
        }));
      case 1: {
        const facilities = answers.region
          ? getFacilitiesByRegion(answers.region)
          : [];
        return facilities.map((f) => ({ value: f.id, label: f.name }));
      }
      case 2: {
        const facility = answers.facilityId
          ? getFacilityById(answers.facilityId)
          : null;
        const sizes = facility
          ? getAvailableSizes(facility)
          : (["small", "medium"] as RoomSize[]);
        return sizes.map((s) => ({
          value: s,
          label: ROOM_SIZE_LABELS[s],
          description: ROOM_SIZE_DESCRIPTIONS[s],
        }));
      }
      case 3:
        return (Object.keys(GUEST_COUNT_LABELS) as GuestCount[]).map((g) => ({
          value: g,
          label: GUEST_COUNT_LABELS[g],
        }));
      case 4:
        return (Object.keys(URGENCY_LABELS) as Urgency[]).map((u) => ({
          value: u,
          label: URGENCY_LABELS[u],
        }));
      default:
        return [];
    }
  };

  const ANSWER_KEYS: (keyof Answers)[] = [
    "region",
    "facilityId",
    "roomSize",
    "guestCount",
    "urgency",
  ];

  const currentKey = ANSWER_KEYS[step];
  const currentAnswer = answers[currentKey];

  const handleSelect = (value: string) => {
    const updated: Answers = { ...answers, [currentKey]: value };
    setAnswers(updated);

    if (step < TOTAL_STEPS - 1) {
      setStep((prev) => prev + 1);
    } else {
      const params = new URLSearchParams({
        facilityId: updated.facilityId ?? "",
        roomSize: updated.roomSize ?? "",
        guestCount: updated.guestCount ?? "",
        urgency: updated.urgency ?? "",
      });
      router.push(`/quote/result?${params.toString()}`);
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const options = getOptions();

  const gridClass =
    step === 0
      ? "grid-cols-3 sm:grid-cols-5"
      : step === 1
        ? "grid-cols-1 sm:grid-cols-2"
        : step === 2
          ? "grid-cols-1 sm:grid-cols-3"
          : "grid-cols-1 sm:grid-cols-2";

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
        <div className="mx-auto max-w-3xl px-6 py-10 sm:px-8 sm:py-14">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-brand-500 sm:text-3xl">
              장례 비용 알아보기
            </h1>
            <p className="mt-2 text-sm text-brand-300">
              {TOTAL_STEPS}가지 질문으로 투명한 3일장 견적을 바로 확인하세요
            </p>
          </div>

          {/* 진행바 */}
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

          {/* 선택 경로 요약 */}
          {step > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {answers.region && (
                <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-white">
                  {REGION_LABELS[answers.region]}
                </span>
              )}
              {answers.facilityId && step > 1 && (
                <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-white">
                  {getFacilityById(answers.facilityId)?.name}
                </span>
              )}
              {answers.roomSize && step > 2 && (
                <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-white">
                  {ROOM_SIZE_LABELS[answers.roomSize]} 빈소
                </span>
              )}
            </div>
          )}

          {/* 질문 + 선택지 */}
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-brand-500 sm:text-2xl">
              {STEP_TITLES[step]}
            </h2>
            <p className="mt-2 text-sm text-brand-300 sm:text-base">
              {STEP_SUBTITLES[step]}
            </p>

            <div className={`mt-8 grid gap-3 ${gridClass}`}>
              {options.map((option) => {
                const isSelected = currentAnswer === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`flex min-h-16 flex-col items-start justify-center gap-1 rounded-2xl border-2 px-5 py-4 text-left transition-colors ${
                      isSelected
                        ? "border-brand-300 bg-brand-500 text-white"
                        : "border-brand-50 bg-white hover:border-brand-100 hover:bg-brand-50"
                    }`}
                  >
                    <span
                      className={`text-base font-semibold ${isSelected ? "text-white" : "text-brand-500"}`}
                    >
                      {option.label}
                    </span>
                    {option.description && (
                      <span
                        className={`text-xs ${isSelected ? "text-brand-100" : "text-brand-300"}`}
                      >
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
