'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Upload, File as FileIcon, Link as LinkIcon, X } from 'lucide-react';

const productSchema = z.object({
  title: z.string().min(1, '상품명을 입력해주세요.').max(100, '상품명은 최대 100자까지 가능합니다.'),
  description: z.string().max(50000, '설명은 최대 50,000자까지 가능합니다.'),
  price: z.coerce.number().min(0, '가격은 0원 이상이어야 합니다.'),
  payWhatYouWant: z.boolean().default(false),
  minPrice: z.coerce.number().min(0).optional(),
  fileType: z.enum(['file', 'external_url']).default('file'),
  externalUrl: z.string().url('유효한 URL을 입력해주세요.').optional().or(z.literal('')),
  slug: z.string().min(1, '슬러그를 입력해주세요.').regex(/^[a-z0-9-]+$/, '슬러그는 영문 소문자, 숫자, 하이픈(-)만 가능합니다.'),
  isPublished: z.boolean().default(false),
});

type ProductFormValues = {
  title: string;
  description: string;
  price: number;
  payWhatYouWant: boolean;
  minPrice?: number;
  fileType: "file" | "external_url";
  externalUrl?: string;
  slug: string;
  isPublished: boolean;
};

export function ProductForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const supabase = createClient();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      price: 0,
      payWhatYouWant: false,
      fileType: 'file',
      isPublished: false,
    },
  });

  const title = watch('title');
  const fileType = watch('fileType', 'file');
  const payWhatYouWant = watch('payWhatYouWant', false);

  // 슬러그 자동 생성
  useEffect(() => {
    if (title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9가-힣\s]/g, '')
        .replace(/\s+/g, '-')
        .slice(0, 50);
      setValue('slug', generatedSlug);
    }
  }, [title, setValue]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setThumbnail(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const onSubmit = async (values: ProductFormValues) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('인증이 필요합니다.');

      let filePath = '';
      let fileName = '';
      let fileSize = 0;
      let thumbnailUrl = '';

      // 1. 썸네일 업로드
      if (thumbnail) {
        const fileExt = thumbnail.name.split('.').pop();
        const thumbPath = `${user.id}/${Date.now()}_thumbnail.${fileExt}`;
        const { error: thumbError } = await supabase.storage
          .from('thumbnails')
          .upload(thumbPath, thumbnail);
        
        if (thumbError) throw thumbError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('thumbnails')
          .getPublicUrl(thumbPath);
        thumbnailUrl = publicUrl;
      }

      // 2. 상품 파일 업로드
      if (values.fileType === 'file' && file) {
        setUploading(true);
        const fileExt = file.name.split('.').pop();
        const path = `${user.id}/${Date.now()}_${file.name}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('products')
          .upload(path, file);

        if (uploadError) throw uploadError;
        filePath = uploadData.path;
        fileName = file.name;
        fileSize = file.size;
        setUploading(false);
      }

      // 3. DB 저장
      const { error: dbError } = await supabase.from('products').insert({
        user_id: user.id,
        title: values.title,
        description: values.description,
        price: values.price,
        pay_what_you_want: values.payWhatYouWant,
        min_price: values.minPrice || 0,
        file_path: filePath,
        file_name: fileName,
        file_size: fileSize,
        file_type: values.fileType === 'file' ? (fileName.split('.').pop() || 'file') : 'external_url',
        external_url: values.externalUrl,
        thumbnail_url: thumbnailUrl,
        slug: values.slug,
        is_published: values.isPublished,
      });

      if (dbError) throw dbError;

      router.push('/dashboard/products');
      router.refresh();
    } catch (err: any) {
      alert(err.message || '저장 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">새 상품 등록</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="is_published"
              checked={watch('isPublished', false)}
              onCheckedChange={(checked) => setValue('isPublished', checked)}
            />
            <Label htmlFor="is_published">공개하기</Label>
          </div>
          <Button type="submit" disabled={loading || uploading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            상품 저장
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 왼쪽 섹션: 기본 정보 */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">상품명</Label>
                <div className="relative">
                  <Input
                    id="title"
                    placeholder="예: 업무 효율을 높여주는 노션 템플릿"
                    {...register('title')}
                    maxLength={100}
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">
                    {title?.length || 0}/100
                  </span>
                </div>
                {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">상품 설명</Label>
                <Textarea
                  id="description"
                  placeholder="상품에 대해 자세히 설명해주세요."
                  className="min-h-[200px]"
                  {...register('description')}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL 슬러그 (pageone.kr/@user/<b>slug</b>)</Label>
                <Input id="slug" {...register('slug')} />
                {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>파일 및 링크</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={fileType} onValueChange={(val) => setValue('fileType', val as 'file' | 'external_url')}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="file">파일 업로드</TabsTrigger>
                  <TabsTrigger value="external_url">외부 링크</TabsTrigger>
                </TabsList>
                <TabsContent value="file" className="space-y-4">
                  <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4 hover:bg-muted/50 transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <div className="flex justify-center">
                      <Upload className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{file ? file.name : '파일을 선택하거나 드래그하여 업로드하세요'}</p>
                      <p className="text-sm text-muted-foreground">PDF, ZIP, MP4 등 (최대 1GB)</p>
                    </div>
                  </div>
                  {uploading && (
                    <div className="space-y-2">
                      <Progress value={progress} />
                      <p className="text-xs text-center text-muted-foreground">업로드 중... {progress}%</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="external_url" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="externalUrl">외부 링크 URL</Label>
                    <div className="flex gap-2">
                      <LinkIcon className="h-10 w-10 p-2 border rounded" />
                      <Input
                        id="externalUrl"
                        placeholder="https://notion.so/..."
                        {...register('externalUrl')}
                      />
                    </div>
                    {errors.externalUrl && <p className="text-sm text-red-500">{errors.externalUrl.message}</p>}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* 오른쪽 섹션: 가격 및 썸네일 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>가격 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="pwyw">원하는 만큼 후원 (PWYW)</Label>
                <Switch
                  id="pwyw"
                  checked={payWhatYouWant}
                  onCheckedChange={(checked) => setValue('payWhatYouWant', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">{payWhatYouWant ? '최소 금액' : '판매 가격'}</Label>
                <div className="relative">
                  <Input
                    id="price"
                    type="number"
                    {...register(payWhatYouWant ? 'minPrice' : 'price')}
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">원</span>
                </div>
                {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>썸네일</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {thumbnailPreview ? (
                <div className="relative aspect-video rounded-lg overflow-hidden border">
                  <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => {
                      setThumbnail(null);
                      setThumbnailPreview(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg aspect-video flex flex-col items-center justify-center space-y-2 hover:bg-muted/50 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleThumbnailChange}
                  />
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">권장: 1200x630 (PNG, JPG)</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}

