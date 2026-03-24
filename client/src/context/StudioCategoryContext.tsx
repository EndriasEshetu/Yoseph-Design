import { createContext, useContext, useState, ReactNode } from 'react';

export const STUDIO_CATEGORY_IDS = ['all', 'logo-design', 'branding', 'architectural', 'product'] as const;
export type StudioCategoryId = (typeof STUDIO_CATEGORY_IDS)[number];

export const STUDIO_CATEGORIES: { id: StudioCategoryId; name: string }[] = [
  { id: 'all', name: 'All' },
  { id: 'logo-design', name: 'Logo Design' },
  { id: 'branding', name: 'Branding' },
  { id: 'architectural', name: 'Architectural' },
  { id: 'product', name: 'Product' },
];

interface StudioCategoryContextType {
  selectedCategory: StudioCategoryId;
  setSelectedCategory: (id: StudioCategoryId) => void;
}

const StudioCategoryContext = createContext<StudioCategoryContextType | undefined>(undefined);

export function StudioCategoryProvider({ children }: { children: ReactNode }) {
  const [selectedCategory, setSelectedCategory] = useState<StudioCategoryId>('all');
  return (
    <StudioCategoryContext.Provider value={{ selectedCategory, setSelectedCategory }}>
      {children}
    </StudioCategoryContext.Provider>
  );
}

export function useStudioCategory() {
  const context = useContext(StudioCategoryContext);
  if (!context) throw new Error('useStudioCategory must be used within StudioCategoryProvider');
  return context;
}
