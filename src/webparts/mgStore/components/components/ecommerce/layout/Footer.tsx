import * as React from "react";
import {
  ShoppingCart,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";

interface FooterProps {
  goToHome: () => void;
  goToProducts: (categoryId?: number) => void;
}

export function Footer({ goToHome, goToProducts }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <style>
        {`
          .CanvasComponent.LCS .grid {
            display: grid !important;
          }

          .CanvasComponent.LCS .grid::before,
          .CanvasComponent.LCS .grid::after {
            content: none !important;
            display: none !important;
          }

          .footer-links {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .footer-links li {
            display: block !important;
            margin-bottom: 12px !important;
          }
        `}
      </style>
      <footer className="bg-foreground text-background mt-auto">
        {/* Main Footer */}
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <button onClick={goToHome} className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-foreground" />
                </div>
                <span className="text-xl font-bold">MG Store</span>
              </button>
              <p className="text-background/70 text-sm leading-relaxed mb-6">
                A production-grade MG Store e-commerce site.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="#"
                  className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                Quick Links
              </h3>
              <ul className="footer-links">
                <li>
                  <button
                    onClick={goToHome}
                    className="text-background/70 hover:text-background transition-colors text-sm"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => goToProducts()}
                    className="text-background/70 hover:text-background transition-colors text-sm"
                  >
                    All Products
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => goToProducts(1)}
                    className="text-background/70 hover:text-background transition-colors text-sm"
                  >
                    Electronics
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => goToProducts(2)}
                    className="text-background/70 hover:text-background transition-colors text-sm"
                  >
                    Fashion
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => goToProducts(3)}
                    className="text-background/70 hover:text-background transition-colors text-sm"
                  >
                    Home & Living
                  </button>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                Customer Service
              </h3>
              <ul className="footer-links">
                {[
                  "FAQ",
                  "Shipping Info",
                  "Returns & Exchanges",
                  "Size Guide",
                  "Track Order",
                ].map((link) => (
                  <li key={link}>
                    <button className="text-background/70 hover:text-background transition-colors text-sm">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                Contact Us
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-background/50 flex-shrink-0 mt-0.5" />
                  <span className="text-background/70 text-sm">
                    123 SharePoint Drive
                    <br />
                    Microsoft City, WA 98052
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-background/50 flex-shrink-0" />
                  <span className="text-background/70 text-sm">
                    +1 (555) 123-4567
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-background/50 flex-shrink-0" />
                  <span className="text-background/70 text-sm">
                    support@spfxstore.com
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-background/50 text-sm">
                {currentYear} SPFx Store. Built with SharePoint Framework, React &
                PnP.js
              </p>
              <div className="flex items-center gap-6">
                <button className="text-background/50 hover:text-background text-sm transition-colors">
                  Privacy Policy
                </button>
                <button className="text-background/50 hover:text-background text-sm transition-colors">
                  Terms of Service
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
