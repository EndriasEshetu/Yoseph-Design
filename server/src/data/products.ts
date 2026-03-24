export interface ModelFile {
  format: string;
  url?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  /** Additional images (max 4). Shown in product detail alongside main image. */
  images?: string[];
  featured?: boolean;
  /** 3D model files available for this product */
  modelFiles?: ModelFile[];
}

export const PRODUCTS: Product[] = [
  { id: "1", name: "Iconic Lounge Chair", description: "A timeless architectural masterpiece combining premium leather and molded plywood.", price: 4500, category: "LIVING", image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/f579f73a-3c76-43af-9367-4cbdb65814c1/designer-chair-787ad4f8-1773311416522.webp", featured: true },
  { id: "2", name: "Bauhaus Desk Lamp", description: "Minimalist geometric desk lamp with chrome finish.", price: 320, category: "OFFICE", image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/f579f73a-3c76-43af-9367-4cbdb65814c1/bauhaus-lamp-1a3865cb-1773311415753.webp" },
  { id: "3", name: "Brutalist Concrete Table", description: "Solid concrete coffee table with clean, bold edges.", price: 1200, category: "LIVING", image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/f579f73a-3c76-43af-9367-4cbdb65814c1/concrete-table-product-9b155b2f-1773311416427.webp", featured: true },
  { id: "4", name: "Modular Oak Bookshelf", description: "Customizable shelving unit made from premium oak.", price: 2100, category: "BEDROOM", image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/f579f73a-3c76-43af-9367-4cbdb65814c1/modular-bookshelf-a2836606-1773311415557.webp" },
  { id: "5", name: "Deep Green Velvet Sofa", description: "Luxurious architectural sofa with clean lines.", price: 3800, category: "LIVING", image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/f579f73a-3c76-43af-9367-4cbdb65814c1/modern-sofa-product-486d0e4b-1773311416830.webp" },
  { id: "6", name: "Wireframe Stools (Set of 2)", description: "Lightweight yet strong architectural stools.", price: 580, category: "DINING", image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/f579f73a-3c76-43af-9367-4cbdb65814c1/architectural-stools-21cd874c-1773311415213.webp" },
  { id: "7", name: "Geometric Vase Collection", description: "A set of three ceramic vases with architectural shapes.", price: 240, category: "DECOR", image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/f579f73a-3c76-43af-9367-4cbdb65814c1/ceramic-vases-9752db5d-1773311416973.webp" }
];
