import { useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { StudioSidebar } from './StudioSidebar';
import { StudioCategoryProvider } from '../context/StudioCategoryContext';
import { LightWaves } from './LightWaves';
import { CartDrawer } from './CartDrawer';
import { CheckoutModal } from './CheckoutModal';
import { ProductDetail } from './ProductDetail';
import { CartProvider } from '../context/CartContext';
import { Outlet, useLocation } from 'react-router-dom';
import { Product } from '../data/products';
import { ProductShareMeta } from './ProductShareMeta';

export const MainLayout = () => {
  const location = useLocation();
  const isStudio = location.pathname === '/studio';
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchSelectedProduct, setSearchSelectedProduct] = useState<Product | null>(null);

  const handleOpenCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <CartProvider>
      <StudioCategoryProvider>
        <div className="min-h-screen bg-white font-sans selection:bg-black selection:text-white">
          <ProductShareMeta />
          <LightWaves />
          <Header 
            onOpenCart={() => setIsCartOpen(true)} 
            onSelectProduct={setSearchSelectedProduct}
          />
          
          <div className="flex">
            {isStudio ? (
              <>
                <StudioSidebar />
                <main className="flex-1">
                  <Outlet />
                </main>
              </>
            ) : (
              <>
                <Sidebar />
                <main className="flex-1">
                  <Outlet />
                </main>
              </>
            )}
          </div>

          <Footer />

          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            onCheckout={handleOpenCheckout}
          />

          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
          />

          <ProductDetail
            product={searchSelectedProduct}
            isOpen={!!searchSelectedProduct}
            onClose={() => setSearchSelectedProduct(null)}
          />
        </div>
      </StudioCategoryProvider>
    </CartProvider>
  );
};