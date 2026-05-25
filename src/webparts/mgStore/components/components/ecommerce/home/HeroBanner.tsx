import * as React from "react";
import { useMemo } from "react";
import {
  motion,
  useReducedMotion,
  useViewportScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  ShoppingBag,
  Truck,
  Shield,
  Headphones,
} from "lucide-react";
import { Link } from "react-router-dom";

interface IStat {
  label: string;
  value: number;
  suffix?: string;
}

interface IFeature {
  icon: React.ElementType;
  label: string;
  desc: string;
}

interface IHeroBannerProps {
  bannerImage?: string;
}

const stats: IStat[] = [
  {
    label: "Products",
    value: 500,
    suffix: "+",
  },
  {
    label: "Happy Customers",
    value: 10,
    suffix: "K+",
  },
  {
    label: "Satisfaction",
    value: 99,
    suffix: "%",
  },
];

const features: IFeature[] = [
  {
    icon: Truck,
    label: "Free Shipping",
    desc: "On orders over Rs. 999",
  },
  {
    icon: Shield,
    label: "Secure Payment",
    desc: "100% protected",
  },
  {
    icon: Headphones,
    label: "24/7 Support",
    desc: "Dedicated support",
  },
  {
    icon: ShoppingBag,
    label: "Easy Returns",
    desc: "30 day returns",
  },
];

interface IAnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

const AnimatedCounter: React.FC<IAnimatedCounterProps> = ({
  value,
  suffix = "",
  duration = 2000,
}) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let start = 0;

    const increment = value / (duration / 16);

    const timer = window.setInterval(() => {
      start += increment;

      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

export const HeroBanner: React.FC<IHeroBannerProps> = ({
  bannerImage,
}) => {
  const shouldReduceMotion = useReducedMotion();

  const { scrollY } = useViewportScroll();

  const y = useTransform(scrollY, [0, 500], [0, 120]);

  const heroImage = useMemo(() => {
    return (
      bannerImage ||
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80"
    );
  }, [bannerImage]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/30">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:20px_20px]" />
      </div>

      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary/10 blur-3xl rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">
                New Collection 2026
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight"
            >
              Discover Premium
              <span className="block text-primary mt-2">
                SharePoint Commerce
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl"
            >
              Experience seamless shopping powered by SPFx, React,
              PnPjs, and modern frontend architecture built for
              enterprise-scale commerce.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="flex flex-wrap gap-4 mt-10"
            >
              <Link
                to="/products"
                className="group inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-lg hover:shadow-primary/20 hover:scale-[1.02] transition-all duration-300"
              >
                <ShoppingBag className="w-5 h-5" />

                <span>Shop Now</span>

                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl border border-border bg-card hover:bg-secondary transition-all duration-300 font-semibold text-foreground"
              >
                Browse Categories
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-6 mt-14"
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-5"
                >
                  <div className="text-3xl lg:text-4xl font-bold text-foreground">
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                    />
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            style={shouldReduceMotion ? {} : { y }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-square max-w-2xl mx-auto">
              {/* Background Gradient Card */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[2rem] rotate-6 blur-sm" />

              {/* Main Image */}
              <motion.img
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : {
                        scale: 1.02,
                      }
                }
                transition={{ duration: 0.4 }}
                src={heroImage}
                alt="Premium commerce experience"
                className="relative z-10 w-full h-full object-cover rounded-[2rem] shadow-2xl border border-border"
              />

              {/* Floating Shipping Card */}
              <motion.div
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        y: [0, -10, 0],
                      }
                }
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-5 -right-5 z-20 bg-card/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-border will-change-transform"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-emerald-600" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Free Shipping
                    </p>

                    <p className="text-xs text-muted-foreground">
                      On orders above Rs. 999
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Secure Card */}
              <motion.div
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        y: [0, 10, 0],
                      }
                }
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -bottom-5 -left-5 z-20 bg-card/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-border will-change-transform"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Secure Payment
                    </p>

                    <p className="text-xs text-muted-foreground">
                      100% Protected
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Features */}
      <div className="border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.7 + index * 0.1,
                }}
                className="flex items-center gap-4 rounded-2xl border border-border bg-background/70 p-4 hover:bg-secondary/40 transition-colors duration-300"
              >
                <div className="flex-shrink-0 p-3 rounded-xl bg-primary/10">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {feature.label}
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
