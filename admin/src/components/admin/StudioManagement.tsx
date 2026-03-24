import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus, Search, Edit3, Trash2, MoreVertical, ImageIcon, Loader2, FileText } from 'lucide-react';
import { useAdminStore, type StudioModel } from '../../store/adminStore';
import { StudioModelForm } from './StudioModelForm';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

const CATEGORIES = ['All', 'Logo Design', 'Branding', 'Architectural', 'Product'] as const;
type CategoryFilter = (typeof CATEGORIES)[number];

export const StudioManagement: React.FC = () => {
  const { studioModels, loading, fetchStudioModels, deleteStudioModel } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<StudioModel | undefined>(undefined);

  useEffect(() => {
    fetchStudioModels();
  }, [fetchStudioModels]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: studioModels.length };
    for (const m of studioModels) {
      counts[m.category] = (counts[m.category] || 0) + 1;
    }
    return counts;
  }, [studioModels]);

  const filtered = useMemo(() => {
    let result = studioModels;
    if (activeCategory !== 'All') {
      result = result.filter((m) => m.category === activeCategory);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q) ||
          (m.description || '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [studioModels, activeCategory, searchTerm]);

  const handleEdit = (model: StudioModel) => {
    setEditingModel(model);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this studio post?')) return;
    try {
      await deleteStudioModel(id);
      toast.success('Studio post deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingModel(undefined);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input
            placeholder="Search by name, category..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="gap-2" onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Studio Post
        </Button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => {
          const count = categoryCounts[cat] || 0;
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                isActive
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              {cat}
              <span className={`ml-2 text-xs ${isActive ? 'text-neutral-400' : 'text-neutral-400'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50 hover:bg-neutral-50 border-b border-neutral-100">
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>PDF</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-neutral-500">
                    {activeCategory !== 'All'
                      ? `No posts in "${activeCategory}" yet. Click "Add Studio Post" to create one.`
                      : 'No studio posts. Click "Add Studio Post" to create one.'}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((model) => (
                  <TableRow key={model.id} className="hover:bg-neutral-50/50 border-b border-neutral-100">
                    <TableCell>
                      <div className="w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden">
                        {model.image ? (
                          <img src={model.image} alt={model.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {model.name}
                      {model.featured && (
                        <Badge className="ml-2 bg-amber-100 text-amber-800 border-0 text-[10px]">Featured</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{model.category}</Badge>
                    </TableCell>
                    <TableCell>
                      {model.pdfUrl ? (
                        <a href={model.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700">
                          <FileText className="w-4 h-4" />
                          <span className="text-xs">View</span>
                        </a>
                      ) : (
                        <span className="text-xs text-neutral-400">None</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(model)} className="gap-2">
                            <Edit3 className="w-4 h-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(model.id)} className="gap-2 text-red-600">
                            <Trash2 className="w-4 h-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <StudioModelForm isOpen={isFormOpen} onClose={handleCloseForm} model={editingModel} />
    </div>
  );
};
