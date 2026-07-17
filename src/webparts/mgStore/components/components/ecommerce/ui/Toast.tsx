import * as React from "react";
import { Toaster, toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X, ShoppingCart } from "lucide-react";

// Toast provider component
export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      gutter={12}
      containerStyle={{
        top: 80,
      }}
      toastOptions={{
        duration: 4000,
        style: {
          background: "var(--card)",
          color: "var(--card-foreground)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0 10px 40px -10px rgba(0,0,0,0.2)",
        },
      }}
    />
  );
}

// Custom toast components
interface ToastContentProps {
  id: string;
  type: "success" | "error" | "warning" | "info" | "cart";
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

function ToastContent({ id, type, title, description, action }: ToastContentProps) {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <XCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertCircle className="h-5 w-5 text-amber-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
    cart: <ShoppingCart className="h-5 w-5 text-primary" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      className="flex items-start gap-3 max-w-sm rounded-xl p-4 shadow-xl"
      style={{
        background: "#fff", // or "var(--card)"
        color: "#000",      // or "var(--card-foreground)"
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
        {action && (
          <button
            onClick={() => {
              action.onClick();
              toast.dismiss(id);
            }}
            className="mt-2 text-sm font-medium text-primary hover:underline"
          >
            {action.label}
          </button>
        )}
      </div>
      <button
        onClick={() => toast.dismiss(id)}
        className="flex-shrink-0 p-1 rounded-full hover:bg-secondary transition-colors"
      >
        <X className="h-4 w-4 text-muted-foreground" />
      </button>
    </motion.div>
  );
}

// Toast helper functions
export const showToast = {
  success: (title: string, description?: string) => {
    toast.custom(
      (t) => (
        <AnimatePresence>
          {t.visible && (
            <ToastContent
              id={t.id}
              type="success"
              title={title}
              description={description}
            />
          )}
        </AnimatePresence>
      ),
      { duration: 3000,
        style: {
          background: "#fff",
          color: "#000",
          borderRadius: "12px",
          padding: "0",
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 30px rgba(0,0,0,.15)",
        },
      }
    );
  },

  error: (title: string, description?: string) => {
    toast.custom(
      (t) => (
        <AnimatePresence>
          {t.visible && (
            <ToastContent
              id={t.id}
              type="error"
              title={title}
              description={description}
            />
          )}
        </AnimatePresence>
      ),
      { duration: 5000,
        style: {
          background: "#fff",
          color: "#000",
          borderRadius: "12px",
          padding: "0",
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 30px rgba(0,0,0,.15)",
        },
      }
    );
  },

  warning: (title: string, description?: string) => {
    toast.custom(
      (t) => (
        <AnimatePresence>
          {t.visible && (
            <ToastContent
              id={t.id}
              type="warning"
              title={title}
              description={description}
            />
          )}
        </AnimatePresence>
      ),
      { duration: 4000,
        style: {
          background: "#fff",
          color: "#000",
          borderRadius: "12px",
          padding: "0",
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 30px rgba(0,0,0,.15)",
        },
      }
    );
  },

  info: (title: string, description?: string) => {
    toast.custom(
      (t) => (
        <AnimatePresence>
          {t.visible && (
            <ToastContent
              id={t.id}
              type="info"
              title={title}
              description={description}
            />
          )}
        </AnimatePresence>
      ),
      { duration: 4000,
        style: {
          background: "#fff",
          color: "#000",
          borderRadius: "12px",
          padding: "0",
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 30px rgba(0,0,0,.15)",
        },
      }
    );
  },

  addedToCart: (productName: string, onViewCart?: () => void) => {
    toast.custom(
      (t) => (
        <AnimatePresence>
          {t.visible && (
            <ToastContent
              id={t.id}
              type="cart"
              title="Added to cart"
              description={productName}
              action={
                onViewCart
                  ? { label: "View Cart", onClick: onViewCart }
                  : undefined
              }
            />
          )}
        </AnimatePresence>
      ),
      { duration: 3000,
        style: {
          background: "#fff",
          color: "#000",
          borderRadius: "12px",
          padding: "0",
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 30px rgba(0,0,0,.15)",
        },
      }
    );
  },

  addedToWishlist: (productName: string) => {
    toast.custom(
      (t) => (
        <AnimatePresence>
          {t.visible && (
            <ToastContent
              id={t.id}
              type="success"
              title="Added to wishlist"
              description={productName}
            />
          )}
        </AnimatePresence>
      ),
      { duration: 3000,
        style: {
          background: "#fff",
          color: "#000",
          borderRadius: "12px",
          padding: "0",
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 30px rgba(0,0,0,.15)",
        },
      }
    );
  },

  removedFromCart: (productName: string) => {
    toast.custom(
      (t) => (
        <AnimatePresence>
          {t.visible && (
            <ToastContent
              id={t.id}
              type="info"
              title="Removed from cart"
              description={productName}
            />
          )}
        </AnimatePresence>
      ),
      { duration: 3000,
        style: {
          background: "#fff",
          color: "#000",
          borderRadius: "12px",
          padding: "0",
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 30px rgba(0,0,0,.15)",
        },
      }
    );
  },
};

export { toast };
