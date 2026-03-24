export type ModelFormat = 'RVT' | 'FBX' | 'OBJ' | 'SKP' | '3DS' | 'DWG';

export interface StudioModel {
  id: string;
  name: string;
  description: string;
  price?: number;
  format?: ModelFormat;
  category: string;
  image: string;
  featured?: boolean;
  pdfUrl?: string;
}

export const STUDIO_MODELS: StudioModel[] = [
  { id: 'sm-1', name: 'Modern Villa Exterior', description: 'High-detail architectural villa model with clean geometry.', price: 89, format: 'RVT', category: 'Architectural', image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/f579f73a-3c76-43af-9367-4cbdb65814c1/hero-interior-2e0b088a-1773311416938.webp', featured: true, pdfUrl: '/3D-descriptions/1761161024950_1.3-Real-World-Applications-of-Machine-Learning.pdf' },
  { id: 'sm-2', name: 'Minimalist Lounge Set', description: 'Sofa, armchair and side table. Clean topology, PBR-ready materials.', price: 45, format: 'FBX', category: 'Product', image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/f579f73a-3c76-43af-9367-4cbdb65814c1/modern-sofa-product-486d0e4b-1773311416830.webp' },
  { id: 'sm-3', name: 'Brutalist Concrete Block', description: 'Modular concrete block system for Revit. Parametric family with LOD levels.', price: 120, format: 'RVT', category: 'Architectural', image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/f579f73a-3c76-43af-9367-4cbdb65814c1/concrete-table-product-9b155b2f-1773311416427.webp', featured: true },
  { id: 'sm-4', name: 'Bauhaus Lamp Collection', description: 'Desk and floor lamp set. OBJ with separate material IDs.', price: 32, format: 'OBJ', category: 'Product', image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/f579f73a-3c76-43af-9367-4cbdb65814c1/bauhaus-lamp-1a3865cb-1773311415753.webp' },
  { id: 'sm-5', name: 'Wireframe Stool', description: 'Lightweight stool model. Available in SketchUp and FBX.', price: 28, format: 'SKP', category: 'Product', image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/f579f73a-3c76-43af-9367-4cbdb65814c1/architectural-stools-21cd874c-1773311415213.webp' },
  { id: 'sm-6', name: 'Residential Floor Plan Kit', description: '2D/3D floor plan elements and furniture in DWG.', price: 65, format: 'DWG', category: 'Architectural', image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/f579f73a-3c76-43af-9367-4cbdb65814c1/modular-bookshelf-a2836606-1773311415557.webp' },
  { id: 'sm-7', name: 'Ceramic Vase Set', description: 'Three vases with sculptural forms. 3DS Max format with V-Ray materials.', price: 22, format: '3DS', category: 'Branding', image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/f579f73a-3c76-43af-9367-4cbdb65814c1/ceramic-vases-9752db5d-1773311416973.webp' },
];
