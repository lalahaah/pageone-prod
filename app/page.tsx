import Link from "next/link";

const products = [
  { id: 1, type: "전자책", typeColor: "ebook", emoji: "📘", bg: "#E6F1FB", title: "퍼스널 브랜딩 완전정복 가이드", author: "@laha", price: "19,000원", ratio: "4/3" },
  { id: 2, type: "강의", typeColor: "course", emoji: "🎬", bg: "#EAF3DE", title: "파이널컷 프로 기초부터 실전까지", author: "@videomaker", price: "45,000원", ratio: "4/5" },
  { id: 3, type: "프리셋", typeColor: "preset", emoji: "🎨", bg: "#FAEEDA", title: "라이트룸 무드 프리셋 30종 패키지", author: "@photographer", price: "12,000원", ratio: "4/3" },
  { id: 4, type: "전자책", typeColor: "ebook", emoji: "📝", bg: "#FBEAF0", title: "월 100만원 블로그 수익화 전략", author: "@blogger", price: "9,900원", ratio: "1/1" },
  { id: 5, type: "강의", typeColor: "course", emoji: "🎤", bg: "#EAF3DE", title: "유튜브 알고리즘 완전 분석 강의", author: "@ytcreator", price: "38,000원", ratio: "3/4" },
  { id: 6, type: "프리셋", typeColor: "preset", emoji: "🌅", bg: "#FAEEDA", title: "인스타 감성 필름 프리셋 20종", author: "@instagrammer", price: "8,000원", ratio: "4/3" },
  { id: 7, type: "전자책", typeColor: "ebook", emoji: "💡", bg: "#E6F1FB", title: "ChatGPT로 콘텐츠 10배 빠르게 만들기", author: "@aiwriter", price: "14,900원", ratio: "4/5" },
  { id: 8, type: "강의", typeColor: "course", emoji: "🏋️", bg: "#EAF3DE", title: "홈트 12주 완성 프로그램", author: "@fitcoach", price: "29,000원", ratio: "4/3" },
  { id: 9, type: "프리셋", typeColor: "preset", emoji: "🎵", bg: "#FAEEDA", title: "로파이 샘플팩 Vol.1 — 100개 루프", author: "@beatmaker", price: "22,000원", ratio: "3/4" },
];

const badgeStyle: Record<string, string> = {
  ebook: "background:#E6F1FB;color:#185FA5",
  course: "background:#EAF3DE;color:#3B6D11",
  preset: "background:#FAEEDA;color:#854F0B",
};

export default function LandingPage() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "sans-serif" }}>
      {/* 사이드바 */}
      <aside style={{
        width: "240px", minWidth: "240px",
        borderRight: "1px solid #e5e7eb",
        padding: "48px 24px",
        display: "flex", flexDirection: "column", gap: "28px",
        position: "fixed", top: 0, left: 0, height: "100vh", overflowY: "auto",
        background: "#fff"
      }}>
        <div style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.5px", color: "#64748b" }}>PageOne</div>

        <div style={{ fontSize: "26px", fontWeight: 800, lineHeight: 1.3, letterSpacing: "-1px", color: "#0f172a" }}>
          만들었으면<br />팔아라
        </div>

        <Link href="/register" style={{
          background: "#000", color: "#fff",
          padding: "12px 16px", borderRadius: "8px",
          fontSize: "14px", fontWeight: 500,
          textDecoration: "none", textAlign: "center", display: "block"
        }}>
          판매 시작하기 →
        </Link>

        <hr style={{ border: "none", borderTop: "1px solid #e5e7eb" }} />

        <div>
          <p style={{ fontSize: "11px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "10px" }}>카테고리</p>
          {["전체", "전자책", "강의", "프리셋", "템플릿", "소스코드"].map((cat) => (
            <div key={cat} style={{
              fontSize: "13px", color: "#374151",
              padding: "6px 10px", borderRadius: "6px", cursor: "pointer"
            }}>{cat}</div>
          ))}
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #e5e7eb" }} />

        <div>
          <p style={{ fontSize: "11px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "14px" }}>이용 방법</p>
          {[
            { num: 1, title: "가입", desc: "30초 만에 계정 생성" },
            { num: 2, title: "상품 등록", desc: "파일 올리고 가격 설정" },
            { num: 3, title: "링크 공유", desc: "카카오페이로 즉시 결제" },
            { num: 4, title: "수익 정산", desc: "원화로 바로 정산" },
          ].map((step) => (
            <div key={step.num} style={{ display: "flex", gap: "10px", marginBottom: "14px" }}>
              <div style={{
                width: "22px", height: "22px", borderRadius: "50%",
                background: "#f3f4f6", border: "1px solid #e5e7eb",
                fontSize: "11px", fontWeight: 600, color: "#6b7280",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, marginTop: "2px"
              }}>{step.num}</div>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827", marginBottom: "2px" }}>{step.title}</p>
                <p style={{ fontSize: "12px", color: "#6b7280" }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #e5e7eb" }} />

        <Link href="/login" style={{ fontSize: "13px", color: "#6b7280", textDecoration: "none" }}>
          로그인
        </Link>
      </aside>

      {/* 메인 그리드 */}
      <main style={{ flex: 1, background: "#f9fafb", marginLeft: "240px", padding: "24px", overflowY: "auto" }}>
        <div style={{ columns: "3 200px", columnGap: "12px" }}>
          {products.map((p) => (
            <div key={p.id} style={{
              breakInside: "avoid", marginBottom: "12px",
              background: "#fff", border: "1px solid #e5e7eb",
              borderRadius: "12px", overflow: "hidden", cursor: "pointer"
            }}>
              <div style={{
                background: p.bg,
                aspectRatio: p.ratio,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "36px"
              }}>
                {p.emoji}
              </div>
              <div style={{ padding: "10px 14px 14px" }}>
                <span style={{
                  fontSize: "10px", fontWeight: 600,
                  padding: "2px 8px", borderRadius: "20px",
                  display: "inline-block", marginBottom: "6px",
                  ...Object.fromEntries(badgeStyle[p.typeColor].split(";").map(s => {
                    const [k, v] = s.split(":");
                    return [k.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase()), v?.trim()];
                  }))
                }}>{p.type}</span>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827", lineHeight: 1.4, marginBottom: "8px" }}>{p.title}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: "#9ca3af" }}>{p.author}</span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}>{p.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}






