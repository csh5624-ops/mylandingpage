import Link from "next/link";
import {
  FUNERAL_TYPE_LABELS,
  GUEST_COUNT_LABELS,
  RELIGION_LABELS,
  calculateEstimate,
  isFuneralType,
  isGuestCount,
  isReligion,
} from "@/lib/funeral-estimate";

type QuoteResultPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function QuoteResultPage({
  searchParams,
}: QuoteResultPageProps) {
  const params = await searchParams;
  const funeralTypeParam =
    typeof params.funeralType === "string" ? params.funeralType : undefined;
  const guestCountParam =
    typeof params.guestCount === "string" ? params.guestCount : undefined;
  const religionParam =
    typeof params.religion === "string" ? params.religion : undefined;

  const isValid =
    isFuneralType(funeralTypeParam) &&
    isGuestCount(guestCountParam) &&
    isReligion(religionParam);

  if (!isValid) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-6 text-center">
        <h1 className="text-xl font-semibold text-brand-500">
          견적 정보를 확인할 수 없습니다
        </h1>
        <p className="text-sm text-brand-300">처음부터 다시 입력해 주세요</p>
        <Link
          href="/quote"
          className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-400"
        >
          견적 다시 입력하기
        </Link>
      </div>
    );
  }

  const funeralType = funeralTypeParam;
  const guestCount = guestCountParam;
  const religion = religionParam;
  const totalCost = calculateEstimate(funeralType, guestCount);

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
          <Link
            href="/quote"
            className="text-sm font-medium text-brand-300 hover:text-brand-500"
          >
            다시 견적내기
          </Link>
        </div>
      </header>

      <main className="flex-1 bg-brand-50">
        <div className="mx-auto max-w-3xl px-6 py-12 sm:px-8 sm:py-16">
          {/* 총 예상 비용 */}
          <section className="rounded-3xl bg-brand-500 px-6 py-12 text-center sm:px-10">
            <p className="text-sm font-medium text-brand-100">
              부울경 정찰 견적 결과
            </p>
            <p className="mt-8 text-3xl font-bold tracking-tight text-white sm:text-5xl">
              총 예상 비용: {totalCost.toLocaleString("ko-KR")}원
            </p>
            <p className="mt-4 text-sm text-brand-50">
              숨겨진 수수료 없이, 위 금액이 실제 청구되는 정찰 가격입니다
            </p>
          </section>

          {/* 항목별 요약 */}
          <section className="mt-10 rounded-2xl border border-brand-50 bg-white p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-brand-500">
              선택하신 조건
            </h2>
            <dl className="mt-6 space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-brand-50 px-5 py-3">
                <dt className="text-sm text-brand-300">장례 형태</dt>
                <dd className="text-sm font-semibold text-brand-500">
                  {FUNERAL_TYPE_LABELS[funeralType]}
                </dd>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-brand-50 px-5 py-3">
                <dt className="text-sm text-brand-300">예상 조문객</dt>
                <dd className="text-sm font-semibold text-brand-500">
                  {GUEST_COUNT_LABELS[guestCount]}
                </dd>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-brand-50 px-5 py-3">
                <dt className="text-sm text-brand-300">종교 스타일</dt>
                <dd className="text-sm font-semibold text-brand-500">
                  {RELIGION_LABELS[religion]}
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-sm text-brand-300">
              대여 용품 및 진행에 {RELIGION_LABELS[religion]} 양식 적용 완료
            </p>
          </section>

          {/* 마케팅 CTA */}
          <section className="mt-10 text-center">
            <Link
              href="/consultation"
              className="inline-block w-full rounded-full bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300 px-8 py-5 text-base font-bold text-white shadow-[0_0_40px_rgba(164,119,78,0.45)] transition-transform hover:scale-[1.02] sm:w-auto sm:text-lg"
            >
              부울경 장례식장 빈소 할인 및 실시간 상세 견적 카톡으로 받기
            </Link>
            <p className="mt-3 text-xs text-brand-300">
              지금 신청하시면 담당 장례지도사가 24시간 내 카카오톡으로 안내드립니다
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
