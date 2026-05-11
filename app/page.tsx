import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 h-16 flex items-center justify-between border-b sticky top-0 z-50 bg-white">
        <Link href="/" className="text-2xl font-bold">
          PageOne
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium">
            로그인
          </Link>
          <Link href="/register" className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium">
            무료로 시작하기
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="py-24 px-6 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold mb-6">
            크몽 수수료 갖다 바치지 말고,
            <br />
            내 페이지에서 팔아라
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            5분 만에 전자책, 템플릿, 강의를 판매 페이지로.
            카카오페이 결제 즉시 연동.
          </p>
          <Link href="/register" className="bg-black text-white px-8 py-4 rounded-full text-lg font-medium">
            지금 무료로 시작하기
          </Link>
        </section>
      </main>

      <footer className="py-8 px-6 border-t text-center text-gray-500 text-sm">
        <p>2026 PageOne. All rights reserved.</p>
      </footer>
    </div>
  );
}
