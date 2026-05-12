import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Check, X, ArrowRight, Zap, CreditCard, Wallet, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="px-6 h-16 flex items-center justify-between border-b sticky top-0 z-50 bg-white/80 backdrop-blur-md">
        <Link href="/" className="text-2xl font-bold text-[#6366f1]">
          PageOne
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-[#6366f1] transition-colors">
            로그인
          </Link>
          <Link href="/register" className={cn(buttonVariants({ variant: "default" }), "bg-[#6366f1] hover:bg-[#6366f1]/90")}>
            무료로 시작하기
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 px-6 text-center max-w-5xl mx-auto">
          <Badge className="mb-4 bg-[#6366f1]/10 text-[#6366f1] hover:bg-[#6366f1]/20 border-none px-4 py-1">
            한국의 Gumroad, PageOne 베타 오픈 🚀
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight leading-[1.1]">
            크몽 수수료 갖다 바치지 말고,
            <br />
            <span className="text-[#6366f1]">내 페이지에서 팔아라</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            5분 만에 전자책, 템플릿, 강의를 판매 페이지로 만드세요.<br className="hidden md:block" />
            카카오페이, 토스 결제가 즉시 연동됩니다.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "h-14 px-8 text-lg font-bold bg-[#6366f1] hover:bg-[#6366f1]/90 w-full sm:w-auto")}>
              무료로 시작하기 <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <p className="text-sm text-gray-400">신용카드 없이 30초면 가입 완료</p>
          </div>
        </section>

        {/* Competition Comparison Section */}
        <section className="py-20 bg-gray-50 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">왜 PageOne인가요?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-400">크몽 / 탈잉</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-500">
                  <div className="flex items-center gap-2"><X className="h-5 w-5 text-red-500" /> 수수료 20%+</div>
                  <div className="flex items-center gap-2"><X className="h-5 w-5 text-red-500" /> 내 브랜드/URL 없음</div>
                  <div className="flex items-center gap-2"><X className="h-5 w-5 text-red-500" /> 까다로운 입점 심사</div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-400">Gumroad</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-500">
                  <div className="flex items-center gap-2"><X className="h-5 w-5 text-red-500" /> 해외 결제만 가능</div>
                  <div className="flex items-center gap-2"><X className="h-5 w-5 text-red-500" /> 달러 정산 (수수료 발생)</div>
                  <div className="flex items-center gap-2"><X className="h-5 w-5 text-red-500" /> 영어 기반 UI</div>
                </CardContent>
              </Card>
              <Card className="border-2 border-[#6366f1] ring-4 ring-[#6366f1]/5 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#6366f1] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">추천</div>
                <CardHeader>
                  <CardTitle className="text-[#6366f1]">PageOne</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 font-medium">
                  <div className="flex items-center gap-2"><Check className="h-5 w-5 text-[#6366f1]" /> 수수료 5% (최저 0%)</div>
                  <div className="flex items-center gap-2"><Check className="h-5 w-5 text-[#6366f1]" /> 카카오페이 / 토스 연동</div>
                  <div className="flex items-center gap-2"><Check className="h-5 w-5 text-[#6366f1]" /> 내 URL (@username)</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center space-y-4">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#6366f1]/10 text-[#6366f1]">
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">5분 셋업</h3>
                <p className="text-gray-600 leading-relaxed">회원가입 후 파일만 올리면<br />바로 판매 준비 끝</p>
              </div>
              <div className="text-center space-y-4">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#6366f1]/10 text-[#6366f1]">
                  <CreditCard className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">카카오페이·토스 결제</h3>
                <p className="text-gray-600 leading-relaxed">한국인이 가장 선호하는 결제를<br />별도 심사 없이 즉시 사용</p>
              </div>
              <div className="text-center space-y-4">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#6366f1]/10 text-[#6366f1]">
                  <Wallet className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">원화 즉시 정산</h3>
                <p className="text-gray-600 leading-relaxed">달러 환전 없이 국내 계좌로<br />깔끔하게 입금 받으세요</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Plan Table */}
        <section className="py-24 bg-gray-50 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">심플한 요금제</h2>
              <p className="text-gray-500">숨은 비용 없이, 성장 단계에 맞춰 선택하세요.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-white border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">FREE</CardTitle>
                  <div className="text-3xl font-bold">0원<span className="text-sm font-normal text-gray-400">/월</span></div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-[#6366f1]" /> 판매 수수료 5%</div>
                  <div className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-[#6366f1]" /> 상품 등록 최대 5개</div>
                  <div className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-[#6366f1]" /> 파일 용량 1GB</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-none shadow-md ring-2 ring-[#6366f1] relative">
                <div className="absolute top-0 right-0 bg-[#6366f1] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase">Best</div>
                <CardHeader>
                  <CardTitle className="text-xl">PRO</CardTitle>
                  <div className="text-3xl font-bold text-[#6366f1]">9,900원<span className="text-sm font-normal text-gray-400">/월</span></div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="flex items-center gap-2 text-sm font-bold"><Check className="h-4 w-4 text-[#6366f1]" /> 판매 수수료 3%</div>
                  <div className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-[#6366f1]" /> 상품 등록 무제한</div>
                  <div className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-[#6366f1]" /> 파일 용량 10GB</div>
                  <div className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-[#6366f1]" /> 구매자 이메일 수출</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">BIZ</CardTitle>
                  <div className="text-3xl font-bold">29,900원<span className="text-sm font-normal text-gray-400">/월</span></div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="flex items-center gap-2 text-sm font-bold"><Check className="h-4 w-4 text-[#6366f1]" /> 판매 수수료 0%</div>
                  <div className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-[#6366f1]" /> 커스텀 도메인 연결</div>
                  <div className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-[#6366f1]" /> 파일 용량 50GB</div>
                  <div className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-[#6366f1]" /> VIP 기술 지원</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-24 px-6 text-center bg-[#6366f1]">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            지금 바로 첫 상품을 올려보세요
          </h2>
          <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "h-16 px-12 text-xl font-bold bg-white text-[#6366f1] hover:bg-white/90")}>
            무료로 시작하기
          </Link>
        </section>
      </main>

      <footer className="py-12 px-6 border-t text-center text-gray-500 text-sm bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xl font-bold text-[#6366f1]">PageOne</div>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-gray-900">이용약관</Link>
            <Link href="#" className="hover:text-gray-900">개인정보처리방침</Link>
            <Link href="#" className="hover:text-gray-900">문의하기</Link>
          </div>
          <p>&copy; 2026 PageOne. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  );
}
