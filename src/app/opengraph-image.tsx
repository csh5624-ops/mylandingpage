import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const logoData = readFileSync(
    join(process.cwd(), "public/images/logo-lotus.png"),
  );
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  const fontData = readFileSync(
    join(process.cwd(), "public/fonts/NotoSansKR-Bold.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#5f3d22",
          gap: 28,
        }}
      >
        <img
          src={logoSrc}
          width={160}
          height={160}
          style={{ objectFit: "contain" }}
        />
        <div style={{ display: "flex", fontSize: 72, color: "#f2eae0" }}>
          바른장례 솔루션
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#c09465" }}>
          부울경 투명 장례비 정찰 서비스
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Noto Sans KR",
          data: fontData,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
