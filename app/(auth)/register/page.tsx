'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const registerSchema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요.'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
  username: z.string()
    .min(3, '닉네임은 최소 3자 이상이어야 합니다.')
    .max(20, '닉네임은 최대 20자 이하이어야 합니다.')
    .regex(/^[a-zA-Z0-9_]+$/, '닉네임은 영문, 숫자, 언더바(_)만 사용 가능합니다.'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const supabase = createClient();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const username = watch('username');

  // Username 중복 체크 (실시간)
  useEffect(() => {
    const checkUsername = async () => {
      if (!username || username.length < 3) {
        setUsernameStatus('idle');
        return;
      }

      setUsernameStatus('checking');
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      if (error) {
        console.error(error);
        return;
      }

      setUsernameStatus(data ? 'taken' : 'available');
    };

    const timer = setTimeout(checkUsername, 500);
    return () => clearTimeout(timer);
  }, [username, supabase]);

  const onSubmit = async (values: RegisterFormValues) => {
    if (usernameStatus !== 'available') return;

    setLoading(true);
    setError(null);

    // 1. Auth 회원가입
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          username: values.username,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      // 2. Profile 테이블 INSERT (Trigger가 없을 경우를 대비해 수동 삽입)
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            username: values.username,
            display_name: values.username,
            plan: 'free',
          },
        ]);

      if (profileError) {
        setError('프로필 생성 중 오류가 발생했습니다: ' + profileError.message);
        setLoading(false);
        return;
      }

      alert('회원가입이 완료되었습니다. 이메일을 확인하여 인증을 완료해주세요.');
      router.push('/login');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">PageOne 시작하기</CardTitle>
          <CardDescription>
            크리에이터 계정을 생성하고 디지털 상품 판매를 시작하세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">닉네임 (URL로 사용됨)</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">@</span>
                <Input
                  id="username"
                  placeholder="nickname"
                  className="pl-7"
                  {...register('username')}
                  disabled={loading}
                />
              </div>
              {usernameStatus === 'checking' && <p className="text-xs text-gray-500">중복 확인 중...</p>}
              {usernameStatus === 'available' && <p className="text-xs text-green-500">사용 가능한 닉네임입니다.</p>}
              {usernameStatus === 'taken' && <p className="text-xs text-red-500">이미 사용 중인 닉네임입니다.</p>}
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register('email')}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                disabled={loading}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            {error && (
              <p className="text-sm font-medium text-red-500">{error}</p>
            )}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || usernameStatus !== 'available'}
            >
              {loading ? '가입 중...' : '회원가입'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center text-sm">
          <div className="text-gray-500">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">
              로그인
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
