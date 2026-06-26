export type Region = "busan" | "yangsan" | "ulsan" | "gimhae" | "changwon";
export type RoomSize = "small" | "medium" | "large";
export type GuestCount = "none" | "under50" | "around100" | "around200" | "unknown";
export type Urgency = "planning" | "within_month" | "imminent" | "passed";

export const REGION_LABELS: Record<Region, string> = {
  busan: "부산",
  yangsan: "양산",
  ulsan: "울산",
  gimhae: "김해",
  changwon: "창원",
};

export const ROOM_SIZE_LABELS: Record<RoomSize, string> = {
  small: "소형",
  medium: "중형",
  large: "대형",
};

export const ROOM_SIZE_DESCRIPTIONS: Record<RoomSize, string> = {
  small: "30~45평 · 소규모 가족장에 적합",
  medium: "50~70평 · 일반 규모 장례",
  large: "80평 이상 · 대규모 조문객",
};

export const GUEST_COUNT_LABELS: Record<GuestCount, string> = {
  none: "무빈소 (0명)",
  under50: "50명 이내",
  around100: "100명 이내",
  around200: "200명 이상",
  unknown: "잘 모르겠어요",
};

export const GUEST_COUNT_PERSONS: Record<GuestCount, number> = {
  none: 0,
  under50: 50,
  around100: 100,
  around200: 200,
  unknown: 100,
};

export const URGENCY_LABELS: Record<Urgency, string> = {
  planning: "급하지 않고 미리 알아보고 있어요",
  within_month: "1주에서 한 달 정도 기간이 남은 것 같아요",
  imminent: "임종이 며칠 남지 않았어요",
  passed: "임종하신 상태입니다",
};

export type FuneralFacility = {
  id: string;
  name: string;
  region: Region;
  prices: {
    small: number;
    medium: number;
    large: number | null;
  };
  storageFee: number;
};

export const CREMATION_FEE: Record<Region, number> = {
  busan: 120_000,
  yangsan: 120_000,
  ulsan: 140_000,
  gimhae: 100_000,
  changwon: 100_000,
};

export const CREMATION_FACILITY: Record<Region, string> = {
  busan: "부산영락공원",
  yangsan: "부산영락공원",
  ulsan: "울산하늘공원",
  gimhae: "김해추모의공원",
  changwon: "창원상복공원",
};

export const FUNERAL_FACILITIES: FuneralFacility[] = [
  // 부산
  {
    id: "busan-donga",
    name: "동아대학교병원장례식장",
    region: "busan",
    prices: { small: 300_000, medium: 600_000, large: 850_000 },
    storageFee: 100_000,
  },
  {
    id: "busan-yeongdo",
    name: "영도구민장례식장",
    region: "busan",
    prices: { small: 300_000, medium: 500_000, large: 700_000 },
    storageFee: 100_000,
  },
  {
    id: "busan-saha",
    name: "사하구민장례식장",
    region: "busan",
    prices: { small: 200_000, medium: 350_000, large: 500_000 },
    storageFee: 100_000,
  },
  {
    id: "busan-dongrae",
    name: "동래봉생병원장례식장",
    region: "busan",
    prices: { small: 350_000, medium: 500_000, large: 700_000 },
    storageFee: 100_000,
  },
  {
    id: "busan-samsin",
    name: "삼신전문장례식장",
    region: "busan",
    prices: { small: 350_000, medium: 500_000, large: 750_000 },
    storageFee: 120_000,
  },
  {
    id: "busan-chungsipja",
    name: "청십자병원장례식장",
    region: "busan",
    prices: { small: 200_000, medium: 350_000, large: null },
    storageFee: 80_000,
  },

  // 양산
  {
    id: "yangsan-citizen",
    name: "양산시민장례식장",
    region: "yangsan",
    prices: { small: 450_000, medium: 650_000, large: 900_000 },
    storageFee: 120_000,
  },
  {
    id: "yangsan-nonghyup",
    name: "양산농협장례식장",
    region: "yangsan",
    prices: { small: 300_000, medium: 450_000, large: 600_000 },
    storageFee: 100_000,
  },

  // 울산
  {
    id: "ulsan-sky",
    name: "울산하늘공원장례식장",
    region: "ulsan",
    prices: { small: 140_000, medium: 200_000, large: null },
    storageFee: 0,
  },

  // 김해
  {
    id: "gimhae-citizen",
    name: "김해시민장례식장",
    region: "gimhae",
    prices: { small: 620_000, medium: 1_140_000, large: 1_400_000 },
    storageFee: 0,
  },
  {
    id: "gimhae-kyowon",
    name: "교원예움 김해장례식장",
    region: "gimhae",
    prices: { small: 348_000, medium: 648_000, large: 1_296_000 },
    storageFee: 96_000,
  },

  // 창원
  {
    id: "changwon-kyungsang",
    name: "창원경상대병원장례식장",
    region: "changwon",
    prices: { small: 450_000, medium: 600_000, large: 800_000 },
    storageFee: 120_000,
  },
  {
    id: "changwon-sangbok",
    name: "창원상복공원장례식장",
    region: "changwon",
    prices: { small: 150_000, medium: 200_000, large: null },
    storageFee: 0,
  },
  {
    id: "changwon-fatima",
    name: "창원파티마장례식장",
    region: "changwon",
    prices: { small: 300_000, medium: 450_000, large: 650_000 },
    storageFee: 100_000,
  },
];

export function getFacilitiesByRegion(region: Region): FuneralFacility[] {
  return FUNERAL_FACILITIES.filter((f) => f.region === region);
}

export function getFacilityById(id: string): FuneralFacility | undefined {
  return FUNERAL_FACILITIES.find((f) => f.id === id);
}

export function getAvailableSizes(facility: FuneralFacility): RoomSize[] {
  const sizes: RoomSize[] = ["small", "medium"];
  if (facility.prices.large !== null) sizes.push("large");
  return sizes;
}

export type EstimateBreakdown = {
  roomCost: number;
  storageCost: number;
  guestCost: number;
  cremationCost: number;
  total: number;
};

export function calculateEstimate(
  facility: FuneralFacility,
  roomSize: RoomSize,
  guestCount: GuestCount,
): EstimateBreakdown {
  const DAYS = 3;
  const GUEST_FEE = 30_000;

  const dayPrice =
    roomSize === "large" && facility.prices.large !== null
      ? facility.prices.large
      : roomSize === "medium"
        ? facility.prices.medium
        : facility.prices.small;

  const roomCost = dayPrice * DAYS;
  const storageCost = facility.storageFee * DAYS;
  const guestCost = GUEST_COUNT_PERSONS[guestCount] * GUEST_FEE;
  const cremationCost = CREMATION_FEE[facility.region];

  return {
    roomCost,
    storageCost,
    guestCost,
    cremationCost,
    total: roomCost + storageCost + guestCost + cremationCost,
  };
}

export function isRegion(value: string | undefined): value is Region {
  return ["busan", "yangsan", "ulsan", "gimhae", "changwon"].includes(
    value ?? "",
  );
}

export function isRoomSize(value: string | undefined): value is RoomSize {
  return ["small", "medium", "large"].includes(value ?? "");
}

export function isGuestCount(value: string | undefined): value is GuestCount {
  return ["none", "under50", "around100", "around200", "unknown"].includes(
    value ?? "",
  );
}

export function isUrgency(value: string | undefined): value is Urgency {
  return ["planning", "within_month", "imminent", "passed"].includes(
    value ?? "",
  );
}
