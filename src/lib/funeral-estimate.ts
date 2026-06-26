export type FuneralType = "3day" | "family" | "direct";
export type GuestCount = "under50" | "around100" | "around200" | "over300";
export type Religion = "none" | "buddhism" | "christianity" | "catholic";

export const FUNERAL_TYPE_LABELS: Record<FuneralType, string> = {
  "3day": "일반 3일장",
  family: "가족장",
  direct: "직장(빈소 없는 장례)",
};

export const GUEST_COUNT_LABELS: Record<GuestCount, string> = {
  under50: "50명 미만",
  around100: "100명 내외",
  around200: "200명 내외",
  over300: "300명 이상",
};

export const RELIGION_LABELS: Record<Religion, string> = {
  none: "일반(무교)",
  buddhism: "불교",
  christianity: "기독교",
  catholic: "천주교",
};

const BASE_COST: Record<FuneralType, number> = {
  "3day": 2_500_000,
  family: 1_800_000,
  direct: 1_200_000,
};

const GUEST_HELPER_COST: Record<GuestCount, number> = {
  under50: 0,
  around100: 300_000,
  around200: 600_000,
  over300: 900_000,
};

export function calculateEstimate(
  funeralType: FuneralType,
  guestCount: GuestCount,
): number {
  const base = BASE_COST[funeralType];

  // 직장(빈소 없는 장례)은 조문객 규모와 무관하게 고정 비용
  if (funeralType === "direct") {
    return base;
  }

  return base + GUEST_HELPER_COST[guestCount];
}

export function isFuneralType(value: string | undefined): value is FuneralType {
  return value === "3day" || value === "family" || value === "direct";
}

export function isGuestCount(value: string | undefined): value is GuestCount {
  return (
    value === "under50" ||
    value === "around100" ||
    value === "around200" ||
    value === "over300"
  );
}

export function isReligion(value: string | undefined): value is Religion {
  return (
    value === "none" ||
    value === "buddhism" ||
    value === "christianity" ||
    value === "catholic"
  );
}
