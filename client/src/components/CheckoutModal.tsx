import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Truck } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useShop } from "../context/ShopContext";
import { toast } from "sonner";

export const CheckoutModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { items, total, clearCart } = useCart();
  const { createOrder } = useShop();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedPhone = formData.phone.trim();
    const phoneRegex = /^(09|07)\d{8}$/;

    if (!phoneRegex.test(normalizedPhone)) {
      toast.error(
        "Phone number must start with 09 or 07 and be exactly 10 digits.",
      );
      return;
    }

    try {
      await createOrder({
        customerName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: normalizedPhone,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: total,
      });

      toast.success("Order Placed Successfully!", {
        description: "A confirmation email has been sent to you.",
      });

      clearCart();
      onClose();
      setFormData({ firstName: "", lastName: "", email: "", phone: "" });
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white z-[111] shadow-2xl focus:outline-none flex flex-col md:flex-row max-h-[90vh] overflow-hidden">
          {/* Left Side: Form */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <Dialog.Title className="text-2xl font-light tracking-tight">
                Checkout
              </Dialog.Title>
              <Dialog.Close className="p-1 hover:bg-neutral-100 rounded-full md:hidden">
                <X size={20} />
              </Dialog.Close>
            </div>

            <form onSubmit={handleComplete} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                  Shipping Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-neutral-600">
                      First Name
                    </label>
                    <input
                      required
                      className="w-full border-b border-neutral-200 py-2 focus:border-black outline-none text-sm"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-neutral-600">
                      Last Name
                    </label>
                    <input
                      required
                      className="w-full border-b border-neutral-200 py-2 focus:border-black outline-none text-sm"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-600">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    className="w-full border-b border-neutral-200 py-2 focus:border-black outline-none text-sm"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-600">
                    Phone Number
                  </label>
                  <input
                    required
                    type="tel"
                    className="w-full border-b border-neutral-200 py-2 focus:border-black outline-none text-sm"
                    placeholder="09XXXXXXXX"
                    value={formData.phone}
                    pattern="^(09|07)\d{8}$"
                    title="Phone number must start with 09 or 07 and be exactly 10 digits"
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 text-white py-4 mt-8 text-xs font-bold uppercase tracking-widest hover:bg-amber-600 transition-colors"
              >
                Complete Purchase Br {total.toLocaleString()}
              </button>
            </form>
          </div>

          {/* Right Side: Summary (Desktop Only) */}
          <div className="w-72 bg-neutral-50 p-8 hidden md:block border-l border-neutral-100">
            <div className="flex justify-between mb-8">
              <h3 className="text-sm font-bold uppercase tracking-widest">
                Order Summary
              </h3>
              <Dialog.Close className="p-1 hover:bg-neutral-200 rounded-full">
                <X size={16} />
              </Dialog.Close>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500 uppercase tracking-wider">
                  Subtotal
                </span>
                <span>Br {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500 uppercase tracking-wider">
                  Shipping
                </span>
                <span className="text-green-600 font-bold uppercase tracking-tighter text-[10px]">
                  Free
                </span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold">
                <span className="text-xs uppercase tracking-widest">Total</span>
                <span className="text-lg">Br {total.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 text-neutral-500">
                <Truck size={16} />
                <span className="text-[10px] uppercase tracking-widest">
                  2-Day White Glove Delivery
                </span>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
