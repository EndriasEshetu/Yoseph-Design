import * as Dialog from "@radix-ui/react-dialog";
import { X, ShoppingBag, Minus, Plus } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import {
  FaInstagram,
  FaWhatsapp,
  FaFacebookF,
  FaLinkedinIn,
  FaTelegramPlane,
} from "react-icons/fa";
import { Product } from "../data/products";
import { useCart } from "../context/CartContext";
import { SITE_URL } from "../config";
import { toast } from "sonner";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductDetailProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetail = ({
  product,
  isOpen,
  onClose,
}: ProductDetailProps) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  // Main image first, then additional images; main section shows selected, thumbnails show all
  const allImages = product ? [product.image, ...(product.images ?? [])] : [];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const mainImage = allImages[selectedImageIndex] ?? "";

  if (!product) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    toast.success(`${quantity} × ${product.name} added to cart`);
    setQuantity(1);
    onClose();
  };

  const incrementQuantity = () => setQuantity((prev) => Math.min(prev + 1, 10));
  const decrementQuantity = () => setQuantity((prev) => Math.max(prev - 1, 1));

  const productShareUrl =
    typeof window !== "undefined"
      ? `${(SITE_URL || window.location.origin).replace(/\/$/, "")}/api/share?product=${encodeURIComponent(product.id)}`
      : "";
  const productShareText = `Check out ${product.name} - Br ${product.price.toLocaleString()}`;

  const shareLinks = [
    { type: "tiktok", name: "TikTok", icon: SiTiktok },
    { type: "instagram", name: "Instagram", icon: FaInstagram },
    { type: "whatsapp", name: "WhatsApp", icon: FaWhatsapp },
    { type: "facebook", name: "Facebook", icon: FaFacebookF },
    { type: "linkedin", name: "LinkedIn", icon: FaLinkedinIn },
    { type: "telegram", name: "Telegram", icon: FaTelegramPlane },
  ] as const;

  const handleShare = async (type: (typeof shareLinks)[number]["type"]) => {
    const encodedUrl = encodeURIComponent(productShareUrl);
    const encodedText = encodeURIComponent(productShareText);

    const shareUrlMap = {
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    } as const;

    if (type in shareUrlMap) {
      window.open(
        shareUrlMap[type as keyof typeof shareUrlMap],
        "_blank",
        "noopener,noreferrer",
      );
      return;
    }

    if (type === "tiktok" || type === "instagram") {
      const shareData = {
        title: product.name,
        text: productShareText,
        url: productShareUrl,
      };

      if (typeof navigator !== "undefined" && navigator.share) {
        try {
          await navigator.share(shareData);
          return;
        } catch (error) {
          if ((error as DOMException)?.name !== "AbortError") {
            console.error("Native share failed:", error);
          }
        }
      }

      try {
        await navigator.clipboard.writeText(productShareUrl);
        toast.success(
          `${type === "tiktok" ? "TikTok" : "Instagram"} share link copied. Open the app and paste it to post the product.`,
        );
      } catch (error) {
        console.error("Failed to copy product link:", error);
        toast.error(
          `Unable to share to ${type === "tiktok" ? "TikTok" : "Instagram"} automatically. Please copy the link manually.`,
        );
      }
      return;
    }

    const shareData = {
      title: product.name,
      text: productShareText,
      url: productShareUrl,
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if ((error as DOMException)?.name !== "AbortError") {
          console.error("Native share failed:", error);
        }
      }
    }

    try {
      await navigator.clipboard.writeText(productShareUrl);
      toast.success("Product link copied to clipboard");
    } catch (error) {
      console.error("Failed to copy product link:", error);
      toast.error(
        "Unable to share automatically. Please copy the link manually.",
      );
    }
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setQuantity(1);
          setSelectedImageIndex(0);
          onClose();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[120]" />
        <AnimatePresence>
          {isOpen && (
            <Dialog.Content asChild forceMount>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-3 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[calc(100%-2rem)] sm:max-w-md md:max-w-2xl lg:max-w-4xl sm:max-h-[85vh] bg-white z-[121] shadow-2xl focus:outline-none rounded-xl overflow-hidden"
              >
                {/* Mobile Close Button - Fixed at top */}
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg md:hidden"
                >
                  <X size={20} />
                </button>

                <div className="flex flex-col md:flex-row h-full sm:h-auto sm:max-h-[85vh]">
                  {/* Image Section */}
                  <div className="relative w-full md:flex-1 h-44 sm:h-52 md:h-auto md:min-h-[420px] lg:min-h-[500px] bg-neutral-100 shrink-0">
                    <img
                      src={mainImage}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Category Badge on Image - Mobile */}
                    <span className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest rounded-full md:hidden">
                      {product.category}
                    </span>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 flex flex-col overflow-y-auto">
                    <div className="p-4 sm:p-5 md:p-8 lg:p-10 flex flex-col h-full">
                      {/* Header */}
                      <div className="flex justify-between items-start mb-3 sm:mb-4 md:mb-6">
                        <div>
                          <span className="hidden md:block text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-1">
                            {product.category}
                          </span>
                          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight">
                            {product.name}
                          </h2>
                          <p className="text-lg sm:text-xl md:text-2xl font-light mt-0.5">
                            Br {product.price.toLocaleString()}
                          </p>
                        </div>
                        {/* Desktop Close Button */}
                        <Dialog.Close className="hidden md:flex p-2 hover:bg-neutral-100 rounded-full transition-colors">
                          <X size={20} />
                        </Dialog.Close>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm md:text-base text-neutral-600 leading-relaxed mb-4 md:mb-6">
                        {product.description}
                      </p>

                      {/* Main image + Additional images thumbnails */}
                      <div className="mb-4 md:mb-6">
                        <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-3">
                          Additional images
                        </p>
                        <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                          {allImages.map((img, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => setSelectedImageIndex(index)}
                              className={`w-11 h-11 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                                selectedImageIndex === index
                                  ? "border-amber-500 ring-2 ring-amber-200"
                                  : "border-neutral-200 hover:border-neutral-300"
                              }`}
                            >
                              <img
                                src={img}
                                alt={
                                  index === 0
                                    ? product.name
                                    : `${product.name} view ${index}`
                                }
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Quantity Selector */}
                      <div className="mb-4 md:mb-6">
                        <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-3">
                          Quantity
                        </p>
                        <div className="inline-flex items-center border border-neutral-200 rounded-lg">
                          <button
                            onClick={decrementQuantity}
                            className="p-3 hover:bg-neutral-100 transition-colors disabled:opacity-50"
                            disabled={quantity <= 1}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-12 text-center font-medium">
                            {quantity}
                          </span>
                          <button
                            onClick={incrementQuantity}
                            className="p-3 hover:bg-neutral-100 transition-colors disabled:opacity-50"
                            disabled={quantity >= 10}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Spacer */}
                      <div className="flex-1 min-h-4" />

                      {/* Add to Cart Button */}
                      <button
                        onClick={handleAddToCart}
                        className="w-full bg-amber-500 text-white py-3 md:py-4 text-xs sm:text-sm font-semibold uppercase tracking-wider hover:bg-amber-600 transition-all flex items-center justify-center gap-2 sm:gap-3 rounded-lg shadow-lg hover:shadow-xl"
                      >
                        <ShoppingBag size={16} className="sm:hidden" />
                        <ShoppingBag size={18} className="hidden sm:block" />
                        Add to Bag — Br{" "}
                        {(product.price * quantity).toLocaleString()}
                      </button>

                      {/* Share with friends */}
                      <div className="my-4 pt-4 md:mt-6 md:pt-6 border-t border-neutral-100">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2 sm:mb-3">
                          Share with friends
                        </p>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                          {shareLinks.map((social) => (
                            <a
                              key={social.type}
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handleShare(social.type);
                              }}
                              aria-label={`Share on ${social.name}`}
                              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors"
                            >
                              <social.icon size={14} className="sm:hidden" />
                              <social.icon
                                size={18}
                                className="hidden sm:block"
                              />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
