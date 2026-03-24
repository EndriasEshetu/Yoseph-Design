import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v3';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import type { StudioModel } from '../../store/adminStore';
import { useAdminStore } from '../../store/adminStore';
import { useAdminAuthStore } from '../../store/adminAuthStore';
import { toast } from 'sonner';
import { Upload, Link, X, Loader2, FileText } from 'lucide-react';
import { API_URL } from '../../config';

const CATEGORIES = ['Logo Design', 'Branding', 'Architectural', 'Product'];

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Select a category'),
  image: z.string().url('Enter a valid image URL'),
  featured: z.boolean().optional(),
  pdfUrl: z.string().url('Enter a valid PDF URL').or(z.literal('')).optional(),
});

type FormValues = z.infer<typeof schema>;

interface StudioModelFormProps {
  isOpen: boolean;
  onClose: () => void;
  model?: StudioModel;
}

export const StudioModelForm = ({ isOpen, onClose, model }: StudioModelFormProps) => {
  const { addStudioModel, updateStudioModel } = useAdminStore();
  const { getToken } = useAdminAuthStore();

  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [pdfMode, setPdfMode] = useState<'url' | 'upload'>('url');
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [pdfFileName, setPdfFileName] = useState('');
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      image: '',
      featured: false,
      pdfUrl: '',
    },
  });

  const imageUrl = form.watch('image');
  const pdfUrl = form.watch('pdfUrl');

  useEffect(() => {
    if (isOpen) {
      if (model) {
        form.reset({
          name: model.name,
          description: model.description,
          category: model.category,
          image: model.image,
          featured: model.featured ?? false,
          pdfUrl: model.pdfUrl ?? '',
        });
        setPreviewUrl(model.image);
        setPdfFileName(model.pdfUrl ? extractFileName(model.pdfUrl) : '');
      } else {
        form.reset({
          name: '',
          description: '',
          category: '',
          image: '',
          featured: false,
          pdfUrl: '',
        });
        setPreviewUrl('');
        setPdfFileName('');
      }
      setImageMode('url');
      setPdfMode('url');
    }
  }, [isOpen, model, form]);

  useEffect(() => {
    if (imageMode === 'url' && imageUrl) setPreviewUrl(imageUrl);
  }, [imageUrl, imageMode]);

  function extractFileName(url: string) {
    try {
      const parts = url.split('/');
      const name = parts[parts.length - 1];
      return decodeURIComponent(name).substring(0, 40);
    } catch {
      return 'PDF file';
    }
  }

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    setIsUploadingImage(true);
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const token = getToken();
      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Upload failed');
      form.setValue('image', data.url, { shouldValidate: true });
      setPreviewUrl(data.url);
      toast.success('Image uploaded');
    } catch (e: any) {
      toast.error(e.message || 'Upload failed');
      setPreviewUrl('');
    } finally {
      setIsUploadingImage(false);
      URL.revokeObjectURL(localPreview);
    }
  };

  const handlePdfUpload = async (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file');
      return;
    }
    setIsUploadingPdf(true);
    setPdfFileName(file.name);
    try {
      const formData = new FormData();
      formData.append('pdf', file);
      const token = getToken();
      const res = await fetch(`${API_URL}/api/upload-pdf`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Upload failed');
      form.setValue('pdfUrl', data.url, { shouldValidate: true });
      setPdfFileName(file.name);
      toast.success('PDF uploaded');
    } catch (e: any) {
      toast.error(e.message || 'PDF upload failed');
      setPdfFileName('');
    } finally {
      setIsUploadingPdf(false);
    }
  };

  const clearImage = () => {
    form.setValue('image', '');
    setPreviewUrl('');
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const clearPdf = () => {
    form.setValue('pdfUrl', '');
    setPdfFileName('');
    if (pdfInputRef.current) pdfInputRef.current.value = '';
  };

  const isUploading = isUploadingImage || isUploadingPdf;

  const onSubmit = async (values: FormValues) => {
    const payload = {
      name: values.name,
      description: values.description,
      category: values.category,
      image: values.image,
      featured: values.featured,
      pdfUrl: values.pdfUrl || undefined,
    };
    try {
      if (model) {
        await updateStudioModel({ id: model.id, ...payload });
        toast.success('Studio post updated');
      } else {
        await addStudioModel(payload);
        toast.success('Studio post created');
      }
      onClose();
    } catch {
      toast.error('Failed to save. Is the server running?');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{model ? 'Edit Studio Post' : 'Add Studio Post'}</DialogTitle>
          <DialogDescription>
            {model ? 'Update the studio post details.' : 'Add a new post for the Studio page.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            {/* Category — prominent at top */}
            <FormField
              control={form.control as any}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Modern Villa Exterior" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the work..." className="min-h-[80px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Thumbnail Image */}
            <FormField
              control={form.control as any}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail Image</FormLabel>
                  <div className="flex gap-2 mb-2">
                    <Button type="button" variant={imageMode === 'upload' ? 'default' : 'outline'} size="sm" onClick={() => setImageMode('upload')}>
                      <Upload size={14} className="mr-1" /> Upload
                    </Button>
                    <Button type="button" variant={imageMode === 'url' ? 'default' : 'outline'} size="sm" onClick={() => setImageMode('url')}>
                      <Link size={14} className="mr-1" /> URL
                    </Button>
                  </div>
                  {imageMode === 'upload' ? (
                    <div
                      className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-amber-400 transition-colors"
                      onClick={() => imageInputRef.current?.click()}
                    >
                      <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                      {isUploadingImage ? <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-500" /> : <Upload className="w-6 h-6 mx-auto text-neutral-400" />}
                      <p className="text-xs text-neutral-500 mt-1">Click to upload image</p>
                    </div>
                  ) : (
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                  )}
                  {previewUrl && (
                    <div className="relative mt-2 aspect-video rounded-lg overflow-hidden bg-neutral-100">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" onError={() => setPreviewUrl('')} />
                      <button type="button" onClick={clearImage} className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors"><X size={14} /></button>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PDF Document */}
            <FormField
              control={form.control as any}
              name="pdfUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <FileText size={14} /> PDF Document
                  </FormLabel>
                  <div className="flex gap-2 mb-2">
                    <Button type="button" variant={pdfMode === 'upload' ? 'default' : 'outline'} size="sm" onClick={() => setPdfMode('upload')}>
                      <Upload size={14} className="mr-1" /> Upload
                    </Button>
                    <Button type="button" variant={pdfMode === 'url' ? 'default' : 'outline'} size="sm" onClick={() => setPdfMode('url')}>
                      <Link size={14} className="mr-1" /> URL
                    </Button>
                  </div>
                  {pdfMode === 'upload' ? (
                    <div
                      className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-amber-400 transition-colors"
                      onClick={() => pdfInputRef.current?.click()}
                    >
                      <input ref={pdfInputRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => e.target.files?.[0] && handlePdfUpload(e.target.files[0])} />
                      {isUploadingPdf ? <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-500" /> : <FileText className="w-6 h-6 mx-auto text-neutral-400" />}
                      <p className="text-xs text-neutral-500 mt-1">Click to upload PDF</p>
                    </div>
                  ) : (
                    <FormControl>
                      <Input placeholder="https://example.com/document.pdf" {...field} />
                    </FormControl>
                  )}
                  {(pdfUrl || pdfFileName) && (
                    <div className="flex items-center gap-2 mt-2 p-2.5 bg-neutral-50 rounded-lg border border-neutral-100">
                      <FileText size={16} className="text-amber-500 shrink-0" />
                      <span className="text-xs text-neutral-600 truncate flex-1">
                        {pdfFileName || extractFileName(pdfUrl || '')}
                      </span>
                      <button type="button" onClick={clearPdf} className="p-1 hover:bg-neutral-200 rounded-full transition-colors shrink-0">
                        <X size={12} />
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-neutral-500">
                    PDF shown in "View Details" on the Studio page.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="!mt-0">Featured on Studio</FormLabel>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isUploading}>{model ? 'Save' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
