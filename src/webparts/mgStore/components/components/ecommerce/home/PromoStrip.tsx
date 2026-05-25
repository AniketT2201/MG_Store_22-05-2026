import * as React from "react";
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { Link } from "react-router-dom";

export function PromoStrip() {
  return (
    <section className="py-16 lg:py-20 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,white_1px,transparent_1px)] bg-[length:30px_30px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium uppercase tracking-wider">
                Limited Time Offer
              </span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 leading-tight text-balance">
              Summer Sale
              <span className="block">Up to 50% Off</span>
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-6 max-w-md">
              {"Don't miss out on our biggest sale of the season. Shop now and save big on your favorite products!"}
            </p>
            <Link
              to="/products?sale=true"
              className="inline-flex items-center gap-2 px-8 py-4 bg-background text-foreground rounded-xl font-semibold hover:bg-background/90 transition-colors group"
            >
              Shop the Sale
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="flex gap-4">
              {[
                { value: '05', label: 'Days' },
                { value: '12', label: 'Hours' },
                { value: '34', label: 'Minutes' },
                { value: '56', label: 'Seconds' },
              ].map((item, index) => (
                <div key={item.label} className="text-center">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-background/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-2">
                    <span className="text-3xl lg:text-4xl font-bold">{item.value}</span>
                  </div>
                  <span className="text-sm text-primary-foreground/80">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
