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
import { Upload, Link, X, Loader2, ImageIcon } from 'lucide-react';
import { API_URL } from '../../config';

const FORMATS = ['RVT', 'FBX', 'OBJ', 'SKP', '3DS', 'DWG'] as const;
const CATEGORIES = ['Architectural', 'Furniture', 'Lighting', 'Decor'];

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  format: z.enum(FORMATS),
  category: z.string().min(1, 'Select a category'),
  image: z.string().url('Enter a valid image URL'),
  featured: z.boolean().optional(),
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
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      format: 'FBX',
      category: '',
      image: '',
      featured: false,
    },
  });

  const imageUrl = form.watch('image');

  useEffect(() => {
    if (isOpen) {
      if (model) {
        form.reset({
          name: model.name,
          description: model.description,
          price: model.price,
          format: model.format,
          category: model.category,
          image: model.image,
          featured: model.featured ?? false,
        });
        setPreviewUrl(model.image);
      } else {
        form.reset({
          name: '',
          description: '',
          price: 0,
          format: 'FBX',
          category: '',
          image: '',
          featured: false,
        });
        setPreviewUrl('');
      }
      setImageMode('url');
    }
  }, [isOpen, model, form]);

  useEffect(() => {
    if (imageMode === 'url' && imageUrl) setPreviewUrl(imageUrl);
  }, [imageUrl, imageMode]);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    setIsUploading(true);
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
      setIsUploading(false);
      URL.revokeObjectURL(localPreview);
    }
  };

  const clearImage = () => {
    form.setValue('image', '');
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = async (values: FormValues) => {
    const payload = {
      name: values.name,
      description: values.description,
      price: values.price,
      format: values.format,
      category: values.category,
      image: values.image,
      featured: values.featured,
    };
    try {
      if (model) {
        await updateStudioModel({ id: model.id, ...payload });
        toast.success('Studio model updated');
      } else {
        await addStudioModel(payload);
        toast.success('Studio model created');
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
          <DialogTitle>{model ? 'Edit 3D Model' : 'Add 3D Model'}</DialogTitle>
          <DialogDescription>
            {model ? 'Update the studio model.' : 'Add a new 3D model for the Studio page.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control as any}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="format"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Format</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {FORMATS.map((f) => (
                          <SelectItem key={f} value={f}>{f}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the 3D model..." className="min-h-[80px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-amber-400"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
                      {isUploading ? <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-500" /> : <Upload className="w-6 h-6 mx-auto text-neutral-400" />}
                      <p className="text-xs text-neutral-500 mt-1">Click to upload</p>
                    </div>
                  ) : (
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                  )}
                  {previewUrl && (
                    <div className="relative mt-2 aspect-video rounded-lg overflow-hidden bg-neutral-100">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" onError={() => setPreviewUrl('')} />
                      <button type="button" onClick={clearImage} className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white"><X size={14} /></button>
                    </div>
                  )}
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
