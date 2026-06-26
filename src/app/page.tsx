import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import FloatingConsultButton from "@/components/FloatingConsultButton";

const philosophyPoints = [
  {
    title: "정가 정찰제",
    description:
      "지역, 상품, 인력비까지 모든 항목의 가격을 사전에 고정합니다. 상담 중 가격이 바뀌는 일은 없습니다.",
  },
  {
    title: "숨겨진 수수료 없음",
    description:
      "관행처럼 붙던 알선 수수료와 불필요한 옵션 강매를 걷어내고, 실제 비용만 청구합니다.",
  },
  {
    title: "부울경 현장 데이터",
    description:
      "부산·울산·경남 지역 장례식장과 상조 업체의 실제 견적을 기반으로 가격을 비교해 보여드립니다.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "간단한 정보 입력",
    description: "지역, 장례 일정, 희망 규모 등 기본 정보만 1분 내로 입력합니다.",
  },
  {
    step: "02",
    title: "투명 견적 비교",
    description: "항목별로 분리된 정찰 가격표로 여러 업체의 견적을 한눈에 비교합니다.",
  },
  {
    step: "03",
    title: "안심 상담 연결",
    description: "원하시는 견적을 선택하면 검증된 지역 장례 전문가와 바로 연결됩니다.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-brand-500">
          <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-20 text-center sm:px-8 sm:py-28">
            <span className="rounded-full border border-brand-100/40 bg-brand-100/10 px-4 py-1 text-xs font-medium tracking-wide text-brand-100 sm:text-sm">
              부산 · 울산 · 경남 지역 특화
            </span>

            <h1 className="mt-6 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl sm:leading-tight">
              거품 없는 부울경 장례의 시작,
              <br />
              투명한 가격 정찰제
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-brand-50 sm:text-lg">
              슬픔 앞에서 가격으로 두 번 놀라지 않도록. 부울경 지역 장례 비용을
              숨김없이 공개하고, 정직한 견적만 비교해 드립니다.
            </p>

            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
              <Link
                href="/quote"
                className="w-full rounded-full bg-brand-100 px-8 py-4 text-base font-semibold text-brand-500 shadow-lg shadow-brand-200/20 transition-colors hover:bg-brand-200 sm:w-auto sm:text-lg"
              >
                1분 만에 장례비 확인하기
              </Link>
              <span className="text-sm text-brand-100">
                별도 회원가입 없이 바로 확인 가능합니다
              </span>
            </div>
          </div>
        </section>

        {/* Brand philosophy */}
        <section id="philosophy" className="bg-white">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight text-brand-500 sm:text-3xl">
                기존 상조 시장의 거품을 걷어냈습니다
              </h2>
              <p className="mt-4 text-base leading-relaxed text-brand-300 sm:text-lg">
                불투명한 견적과 현장 추가 비용 대신, 처음부터 끝까지 같은
                가격을 약속하는 것이 저희의 원칙입니다.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-3">
              {philosophyPoints.map((point) => (
                <div
                  key={point.title}
                  className="rounded-2xl border border-brand-50 bg-brand-50 p-6"
                >
                  <h3 className="text-lg font-semibold text-brand-500">
                    {point.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-brand-300">
                    {point.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section id="process" className="bg-brand-50">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight text-brand-500 sm:text-3xl">
                이용 방법은 간단합니다
              </h2>
              <p className="mt-4 text-base leading-relaxed text-brand-300 sm:text-lg">
                복잡한 절차 없이, 단 세 단계로 투명한 장례비를 확인하세요.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-3">
              {processSteps.map((item) => (
                <div
                  key={item.step}
                  className="rounded-2xl border border-brand-50 bg-white p-6"
                >
                  <span className="text-sm font-semibold text-brand-200">
                    {item.step}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-brand-500">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-brand-300">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-brand-500">
          <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-16 text-center sm:px-8 sm:py-20">
            <h2 className="max-w-xl text-2xl font-bold leading-snug text-white sm:text-3xl">
              지금, 가장 정직한 부울경 장례비를 확인해 보세요
            </h2>
            <Link
              href="/quote"
              className="mt-8 w-full rounded-full bg-brand-100 px-8 py-4 text-base font-semibold text-brand-500 shadow-lg shadow-brand-200/20 transition-colors hover:bg-brand-200 sm:w-auto sm:text-lg"
            >
              1분 만에 장례비 확인하기
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-brand-50 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8 text-center text-sm text-brand-300 sm:px-8">
          <p>바른장례 솔루션 · 부산 · 울산 · 경남 투명 장례비 견적 서비스</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} BarunJangrye Solution. All rights reserved.</p>
        </div>
      </footer>

      <FloatingConsultButton />
    </div>
  );
}
