import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Package, Settings, LogOut } from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Sidebar */}
      <aside className="hidden w-64 border-r bg-white md:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-bottom px-6">
            <Link href="/" className="text-xl font-bold tracking-tight">
              PageOne
            </Link>
          </div>
          <nav className="flex-1 space-y-1 px-4 py-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              대시보드
            </Link>
            <Link
              href="/dashboard/products"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              <Package className="h-4 w-4" />
              상품 관리
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              <Settings className="h-4 w-4" />
              설정
            </Link>
          </nav>
          <div className="border-t p-4">
            <form action="/api/auth/signout" method="post">
              <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:bg-red-50 hover:text-red-600">
                <LogOut className="h-4 w-4" />
                로그아웃
              </Button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <header className="flex h-16 items-center justify-between border-b bg-white px-8 md:hidden">
          <Link href="/" className="text-xl font-bold tracking-tight">
            PageOne
          </Link>
          {/* Mobile menu could go here */}
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
