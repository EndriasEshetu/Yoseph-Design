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
  DialogFooter
} from '../ui/dialog';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select';
import { Product } from '../../data/products';
import { useAdminStore } from '../../store/adminStore';
import { useAdminAuthStore } from '../../store/adminAuthStore';
import { toast } from 'sonner';
import { Upload, Link, X, Loader2, ImageIcon } from 'lucide-react';
import { API_URL } from '../../config';

const MAX_ADDITIONAL_IMAGES = 4;

const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  category: z.string().min(1, 'Please select a category'),
  image: z.string().url('Please enter a valid image URL'),
  images: z.array(z.string().url()).max(MAX_ADDITIONAL_IMAGES).optional(),
  featured: z.boolean().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
}

export const ProductForm: React.FC<ProductFormProps> = ({ isOpen, onClose, product }) => {
  const { addProduct, updateProduct } = useAdminStore();
  const { getToken } = useAdminAuthStore();
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [additionalImageUrl, setAdditionalImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const additionalFileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      image: '',
      images: [],
      featured: false,
    },
  });

  const imageUrl = form.watch('image');
  const additionalImages = form.watch('images') ?? [];

  useEffect(() => {
    if (isOpen) {
      if (product) {
        form.reset({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          image: product.image,
          images: product.images ?? [],
          featured: product.featured || false,
        });
        setPreviewUrl(product.image);
      } else {
        form.reset({
          name: '',
          description: '',
          price: 0,
          category: '',
          image: '',
          images: [],
          featured: false,
        });
        setPreviewUrl('');
      }
      setImageMode('url');
    }
  }, [isOpen, product, form]);

  useEffect(() => {
    if (imageMode === 'url' && imageUrl) {
      setPreviewUrl(imageUrl);
    }
  }, [imageUrl, imageMode]);

  const handleFileUpload = async (file: File, forAdditional: boolean = false) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    const token = getToken();
    if (!token) {
      toast.error('Please log in to upload images');
      return;
    }

    setIsUploading(true);
    const localPreview = URL.createObjectURL(file);
    if (!forAdditional) setPreviewUrl(localPreview);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Session expired. Please log out and log in again.');
          return;
        }
        throw new Error(data.message || data.error || 'Upload failed');
      }

      if (forAdditional) {
        const current = form.getValues('images') ?? [];
        if (current.length >= MAX_ADDITIONAL_IMAGES) {
          toast.error(`Maximum ${MAX_ADDITIONAL_IMAGES} additional images allowed`);
          return;
        }
        form.setValue('images', [...current, data.url], { shouldValidate: true });
        toast.success('Additional image added');
      } else {
        form.setValue('image', data.url, { shouldValidate: true });
        setPreviewUrl(data.url);
        toast.success('Image uploaded successfully');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload image');
      if (!forAdditional) setPreviewUrl('');
    } finally {
      setIsUploading(false);
      URL.revokeObjectURL(localPreview);
    }
  };

  const handleDrop = (e: React.DragEvent, forAdditional?: boolean) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file, forAdditional);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, forAdditional?: boolean) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file, forAdditional);
    e.target.value = '';
  };

  const addAdditionalImageByUrl = (url: string) => {
    const current = form.getValues('images') ?? [];
    if (current.length >= MAX_ADDITIONAL_IMAGES) {
      toast.error(`Maximum ${MAX_ADDITIONAL_IMAGES} additional images allowed`);
      return;
    }
    try {
      new URL(url);
      form.setValue('images', [...current, url], { shouldValidate: true });
      toast.success('Additional image added');
    } catch {
      toast.error('Please enter a valid image URL');
    }
  };

  const removeAdditionalImage = (index: number) => {
    const current = form.getValues('images') ?? [];
    form.setValue('images', current.filter((_, i) => i !== index), { shouldValidate: true });
  };

  const clearImage = () => {
    form.setValue('image', '');
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (values: ProductFormValues) => {
    try {
      if (product) {
        await updateProduct({ 
          id: product.id,
          name: values.name,
          description: values.description,
          price: values.price,
          category: values.category,
          image: values.image,
          images: values.images,
          featured: values.featured,
        });
        toast.success('Product updated successfully');
      } else {
        await addProduct({
          name: values.name,
          description: values.description,
          price: values.price,
          category: values.category,
          image: values.image,
          images: values.images,
          featured: values.featured,
        });
        toast.success('Product created successfully');
      }
      onClose();
    } catch (error) {
      toast.error('Failed to save product. Make sure the server is running.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {product ? 'Modify the product details below.' : 'Fill in the details for the new architectural item.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control as any}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Modernist Chair" {...field} />
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
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="LIVING">LIVING</SelectItem>
                        <SelectItem value="BEDROOM">BEDROOM</SelectItem>
                        <SelectItem value="DINING">DINING</SelectItem>
                        <SelectItem value="OFFICE">OFFICE</SelectItem>
                        <SelectItem value="OUTDOOR">OUTDOOR</SelectItem>
                        <SelectItem value="DECOR">DECOR</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control as any}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the architectural significance..." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Section */}
            <FormField
              control={form.control as any}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Image</FormLabel>
                  
                  {/* Mode Toggle */}
                  <div className="flex gap-2 mb-3">
                    <Button
                      type="button"
                      variant={imageMode === 'upload' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setImageMode('upload')}
                      className="flex items-center gap-2"
                    >
                      <Upload size={14} />
                      Upload
                    </Button>
                    <Button
                      type="button"
                      variant={imageMode === 'url' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setImageMode('url')}
                      className="flex items-center gap-2"
                    >
                      <Link size={14} />
                      URL
                    </Button>
                  </div>

                  {imageMode === 'upload' ? (
                    <div className="space-y-3">
                      {/* Drop Zone */}
                      <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
                          ${isDragging 
                            ? 'border-amber-500 bg-amber-50' 
                            : 'border-neutral-300 hover:border-amber-400 hover:bg-neutral-50'
                          }
                          ${isUploading ? 'pointer-events-none opacity-60' : ''}
                        `}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        
                        {isUploading ? (
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                            <p className="text-sm text-neutral-600">Uploading...</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <Upload className="w-8 h-8 text-neutral-400" />
                            <p className="text-sm text-neutral-600">
                              <span className="font-medium text-amber-600">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-neutral-400">PNG, JPG, WEBP up to 10MB</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/image.jpg" 
                        {...field} 
                      />
                    </FormControl>
                  )}

                  {/* Image Preview */}
                  {previewUrl && (
                    <div className="relative mt-3">
                      <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-neutral-100">
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                          onError={() => setPreviewUrl('')}
                        />
                        <button
                          type="button"
                          onClick={clearImage}
                          className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  )}

                  {!previewUrl && !isUploading && (
                    <div className="mt-3 aspect-video w-full rounded-lg bg-neutral-100 flex items-center justify-center">
                      <div className="text-center text-neutral-400">
                        <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-xs">No image selected</p>
                      </div>
                    </div>
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Additional images (max 4) */}
            <div className="space-y-3">
              <FormLabel>Additional images (max {MAX_ADDITIONAL_IMAGES})</FormLabel>
              <p className="text-xs text-muted-foreground">These appear as extra thumbnails on the product page. New images are added to the list.</p>
              <div className="flex flex-wrap gap-2">
                {additionalImages.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-neutral-200 bg-neutral-50">
                      <img src={url} alt={`Additional ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAdditionalImage(index)}
                      className="absolute -top-1 -right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {additionalImages.length < MAX_ADDITIONAL_IMAGES && (
                  <>
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-1">
                        <Input
                          placeholder="Image URL"
                          value={additionalImageUrl}
                          onChange={(e) => setAdditionalImageUrl(e.target.value)}
                          className="w-36 h-9 text-sm"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-9"
                          onClick={() => {
                            if (additionalImageUrl.trim()) {
                              addAdditionalImageByUrl(additionalImageUrl.trim());
                              setAdditionalImageUrl('');
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>
                      <input
                        ref={additionalFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileSelect(e, true)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 w-full flex items-center justify-center gap-1"
                        onClick={() => additionalFileInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        <Upload size={14} />
                        Upload
                      </Button>
                    </div>
                  </>
                )}
              </div>
              <FormField
                control={form.control as any}
                name="images"
                render={() => <FormMessage />}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isUploading}>
                {product ? 'Save Changes' : 'Create Product'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
