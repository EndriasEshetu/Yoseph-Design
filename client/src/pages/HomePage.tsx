import { Hero } from '../components/Hero';
import { ProductGrid } from '../components/ProductGrid';
import yosephImage from '../assets/yoseph.png';

export const HomePage = () => {
  return (
    <>
      <Hero />
      <ProductGrid />
      
      {/* Philosophy Section */}
      <section className="py-24 bg-neutral-50 relative overflow-hidden">
         <div className="container mx-auto px-4 text-center max-w-3xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-400 block mb-8">Our Philosophy</span>
            <blockquote 
              className="text-3xl md:text-4xl lg:text-5xl font-light italic leading-snug text-neutral-800 font-playfair"
            >
              "Great design transforms a house into a home where every piece tells a story and every space inspires living."
            </blockquote>
            <div className="mt-10 flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-200 shrink-0">
                <img src={yosephImage} alt="Yoseph" className="w-full h-full object-cover" />
              </div>
              <p className="text-sm font-medium uppercase tracking-widest text-neutral-600">
                Yoseph Design
              </p>
            </div>
         </div>
      </section>
    </>
  );
};