import Link from "next/link";
import {
  ROOM_SIZE_LABELS,
  GUEST_COUNT_LABELS,
  GUEST_COUNT_PERSONS,
  URGENCY_LABELS,
  CREMATION_FACILITY,
  calculateEstimate,
  getFacilityById,
  isRoomSize,
  isGuestCount,
  isUrgency,
  type Urgency,
} from "@/lib/funeral-estimate";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function QuoteResultPage({ searchParams }: Props) {
  const params = await searchParams;

  const facilityIdParam =
    typeof params.facilityId === "string" ? params.facilityId : undefined;
  const roomSizeParam =
    typeof params.roomSize === "string" ? params.roomSize : undefined;
  const guestCountParam =
    typeof params.guestCount === "string" ? params.guestCount : undefined;
  const urgencyParam =
    typeof params.urgency === "string" ? params.urgency : undefined;

  const facility = facilityIdParam ? getFacilityById(facilityIdParam) : undefined;

  if (
    !facility ||
    !isRoomSize(roomSizeParam) ||
    !isGuestCount(guestCountParam) ||
    !isUrgency(urgencyParam)
  ) {
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

  const roomSize = roomSizeParam;
  const guestCount = guestCountParam;
  const urgency = urgencyParam as Urgency;

  const breakdown = calculateEstimate(facility, roomSize, guestCount);
  const isUrgent = urgency === "imminent" || urgency === "passed";
  const cremationName = CREMATION_FACILITY[facility.region];
  const guestPersons = GUEST_COUNT_PERSONS[guestCount];

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

          {/* 긴급 배너 */}
          {isUrgent && (
            <div className="mb-6 rounded-2xl bg-brand-500 px-6 py-5 text-center">
              <p className="text-sm font-medium text-brand-100">
                지금 바로 연결해 드립니다 · 24시간 장례지도사 대기 중
              </p>
              <a
                href="tel:01055295620"
                className="mt-2 block text-2xl font-bold text-white tracking-wide"
              >
                📞 010-5529-5620
              </a>
            </div>
          )}

          {/* 총 예상 비용 */}
          <section className="rounded-3xl bg-brand-500 px-6 py-10 text-center sm:px-10">
            <p className="text-sm font-medium text-brand-100">
              부울경 3일장 정찰 견적 — {facility.name}
            </p>
            <p className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {breakdown.total.toLocaleString("ko-KR")}원
            </p>
            <p className="mt-3 text-xs text-brand-100">
              숨겨진 수수료 없이 위 금액이 실제 청구되는 정찰 가격입니다
            </p>
          </section>

          {/* 비용 내역 */}
          <section className="mt-8 rounded-2xl border border-brand-50 bg-white p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-brand-500">
              비용 내역 (3일 기준)
            </h2>

            <dl className="mt-5 space-y-3">
              {/* 빈소 */}
              <div className="flex items-center justify-between rounded-xl bg-brand-50 px-5 py-3">
                <dt className="text-sm text-brand-300">
                  빈소 사용료 ({ROOM_SIZE_LABELS[roomSize]} · 3일)
                </dt>
                <dd className="text-sm font-semibold text-brand-500">
                  {breakdown.roomCost.toLocaleString("ko-KR")}원
                </dd>
              </div>

              {/* 안치비 (데이터 있는 시설만) */}
              {breakdown.storageCost > 0 && (
                <div className="flex items-center justify-between rounded-xl bg-brand-50 px-5 py-3">
                  <dt className="text-sm text-brand-300">안치비 (3일)</dt>
                  <dd className="text-sm font-semibold text-brand-500">
                    {breakdown.storageCost.toLocaleString("ko-KR")}원
                  </dd>
                </div>
              )}

              {/* 접객료 */}
              <div className="flex items-center justify-between rounded-xl bg-brand-50 px-5 py-3">
                <dt className="text-sm text-brand-300">
                  접객료{" "}
                  {guestPersons > 0
                    ? `(${guestPersons.toLocaleString()}명 × 3만원)`
                    : "(무빈소)"}
                </dt>
                <dd className="text-sm font-semibold text-brand-500">
                  {breakdown.guestCost.toLocaleString("ko-KR")}원
                </dd>
              </div>

              {/* 화장비 */}
              <div className="flex items-center justify-between rounded-xl bg-brand-50 px-5 py-3">
                <dt className="text-sm text-brand-300">
                  화장비 ({cremationName})
                </dt>
                <dd className="text-sm font-semibold text-brand-500">
                  {breakdown.cremationCost.toLocaleString("ko-KR")}원
                </dd>
              </div>
            </dl>

            {/* 합계 */}
            <div className="mt-5 flex items-center justify-between border-t border-brand-50 pt-4">
              <span className="text-base font-bold text-brand-500">
                총 예상 비용
              </span>
              <span className="text-xl font-bold text-brand-500">
                {breakdown.total.toLocaleString("ko-KR")}원
              </span>
            </div>

            {guestCount === "unknown" && (
              <p className="mt-3 text-xs text-brand-300">
                * 조문객 수를 100명으로 가정하여 계산한 예상 금액입니다
              </p>
            )}
          </section>

          {/* 선택 조건 요약 */}
          <section className="mt-6 rounded-2xl border border-brand-50 bg-white p-6">
            <h2 className="text-base font-semibold text-brand-500">
              선택하신 조건
            </h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-brand-300">장례식장</dt>
                <dd className="font-medium text-brand-500">{facility.name}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-brand-300">빈소 규모</dt>
                <dd className="font-medium text-brand-500">
                  {ROOM_SIZE_LABELS[roomSize]}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-brand-300">예상 조문객</dt>
                <dd className="font-medium text-brand-500">
                  {GUEST_COUNT_LABELS[guestCount]}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-brand-300">준비 상황</dt>
                <dd className="font-medium text-brand-500">
                  {URGENCY_LABELS[urgency]}
                </dd>
              </div>
            </dl>
          </section>

          {/* CTA */}
          <section className="mt-8 grid gap-3 sm:grid-cols-2">
            <a
              href="tel:01055295620"
              className="flex items-center justify-center gap-2 rounded-full bg-brand-500 px-6 py-4 text-base font-bold text-white transition-colors hover:bg-brand-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
                  clipRule="evenodd"
                />
              </svg>
              전화 상담 · 010-5529-5620
            </a>
            <a
              href="#kakao"
              onClick={(e) => e.preventDefault()}
              className="flex items-center justify-center gap-2 rounded-full border-2 border-brand-200 bg-white px-6 py-4 text-base font-bold text-brand-500 transition-colors hover:bg-brand-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.567 1.522 4.827 3.84 6.18L4.5 21l4.863-2.693A11.26 11.26 0 0 0 12 18c5.523 0 10-3.477 10-7.5S17.523 3 12 3Z" />
              </svg>
              카카오톡 상담
            </a>
          </section>

          <p className="mt-4 text-center text-xs text-brand-300">
            실제 비용은 장례식장 계약 조건에 따라 다소 달라질 수 있습니다 ·
            24시간 상담 가능
          </p>
        </div>
      </main>
    </div>
  );
}
