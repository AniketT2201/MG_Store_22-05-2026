import * as React from "react";
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { Link } from "react-router-dom";

export function PromoStrip() {
  return (
    <section className="py-8 lg:py-12 bg-card border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-6 items-center rounded-lg border border-border bg-secondary/45 p-5 md:p-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">
                Limited Time Offer
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-semibold mb-3 leading-tight text-foreground">
              Summer Sale
              <span className="block">Up to 50% Off</span>
            </h2>
            <p className="text-muted-foreground text-sm mb-4 max-w-md">
              {"Don't miss out on our biggest sale of the season. Shop now and save big on your favorite products!"}
            </p>
            <Link
              to="/products?sale=true"
              className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors group text-sm"
            >
              Shop the Sale
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
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
            <div className="flex gap-3">
              {[
                { value: '05', label: 'Days' },
                { value: '12', label: 'Hours' },
                { value: '34', label: 'Minutes' },
                { value: '56', label: 'Seconds' },
              ].map((item, index) => (
                <div key={item.label} className="text-center">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-card border border-border rounded-lg flex items-center justify-center mb-1">
                    <span className="text-2xl lg:text-3xl font-semibold text-foreground">{item.value}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
