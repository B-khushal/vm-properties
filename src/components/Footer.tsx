import React, { JSX, useState } from "react";
import { Link } from "./Router";
import BrandLogo from "./BrandLogo";
import { Phone, Mail, MapPin, Send, MessageCircle } from "lucide-react";

export default function Footer(): JSX.Element {
  const [emailSub, setEmailSub] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailSub.trim()) {
      setSubscribed(true);
      setEmailSub("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-[#081B3A] border-t-2 border-[#C9A24B]/30 text-white pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        
        {/* Brand Information */}
        <div className="flex flex-col items-start gap-4">
          <Link href="/" className="flex items-center gap-3">
            <BrandLogo size="sm" hideText={true} lightLogo={true} />
            <div className="flex flex-col text-left">
              <span className="font-display font-semibold text-base tracking-[0.18em] text-[#C9A24B]">
                VM PROPERTIES
              </span>
              <span className="text-[8px] tracking-[0.3em] text-[#E5C07B] uppercase -mt-1">
                Imperial Estates
              </span>
            </div>
          </Link>
          <p className="text-sm text-slate-300 leading-relaxed max-w-xs mt-2">
            The standard of signature luxury real estate in India. Curating bespoke villas, premium corporate developments, and high appreciation developments.
          </p>
          <div className="flex gap-3 mt-2">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded bg-emerald-600 hover:bg-emerald-500 transition-colors cursor-pointer"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-display text-sm tracking-widest font-bold uppercase text-[#C9A24B]" id="footer-head-quicklinks">
            QUICK EXPLORE
          </h3>
          <span className="block h-[1.5px] w-12 bg-[#C9A24B] mt-1.5 mb-6"></span>
          <ul className="space-y-3.5 text-sm text-slate-300">
            <li>
              <Link href="/" className="hover:text-[#C9A24B] transition-colors">Home Page</Link>
            </li>
            <li>
              <Link href="/properties" className="hover:text-[#C9A24B] transition-colors">Premium Properties</Link>
            </li>
            <li>
              <Link href="/projects" className="hover:text-[#C9A24B] transition-colors">Bespoke Projects</Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-[#C9A24B] transition-colors">Exclusive Gallery</Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-[#C9A24B] transition-colors">Market Blog</Link>
            </li>
          </ul>
        </div>

        {/* Contact Coordinates */}
        <div>
          <h3 className="font-display text-sm tracking-widest font-bold uppercase text-[#C9A24B]" id="footer-head-contact">
            HEADQUARTERS
          </h3>
          <span className="block h-[1.5px] w-12 bg-[#C9A24B] mt-1.5 mb-6"></span>
          <ul className="space-y-4 text-sm text-slate-300">
            <li className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-[#C9A24B] shrink-0 mt-0.5" />
              <span>Tower II, Level 12, Financial District, Gachibowli, Hyderabad, TS 500032</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-[#C9A24B] shrink-0" />
              <a href="tel:+919876543210" className="hover:text-[#C9A24B] transition-colors">+91 98765 43210</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-[#C9A24B] shrink-0" />
              <a href="mailto:concierge@vmproperties.com" className="hover:text-[#C9A24B] transition-colors">concierge@vmproperties.com</a>
            </li>
          </ul>
        </div>

        {/* VIP Newsletter Registration */}
        <div>
          <h3 className="font-display text-sm tracking-widest font-bold uppercase text-[#C9A24B]" id="footer-head-newsletter">
            VIP PORTFOLIO WATCH
          </h3>
          <span className="block h-[1.5px] w-12 bg-[#C9A24B] mt-1.5 mb-6"></span>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            Register below to receive pre-launch invitations and private market transaction reports.
          </p>
          <form onSubmit={handleSub} className="flex flex-col gap-2">
            <div className="flex rounded border border-[#C9A24B]/30 bg-black/25">
              <input
                type="email"
                placeholder="Private Email Address"
                value={emailSub}
                onChange={(e) => setEmailSub(e.target.value)}
                required
                className="px-3.5 py-2 w-full text-sm placeholder-slate-400 bg-transparent text-white border-0 outline-none focus:ring-0"
              />
              <button
                type="submit"
                className="px-4 text-[#C9A24B] hover:text-[#E5C07B] transition-colors cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            {subscribed && (
              <p className="text-xs text-[#E5C07B] font-display">
                Welcome to VM Inner Circle.
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Regulatory Disclosures & Sitemap Footer Segment */}
      <div className="border-t border-[#C9A24B]/10 pt-8 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-center md:text-left">
              &copy; {new Date().getFullYear()} VM PROPERTIES. All sovereign rights reserved. Real Estate Regulatory Authority Registration No: RERA-AP-HYD-C122.
            </p>
          </div>
          {/* Legal Navigation */}
          <div className="flex flex-wrap justify-center gap-4 text-[11px] tracking-wider uppercase font-display">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link href="/disclaimer" className="hover:text-white transition-colors">Legal Disclaimer</Link>
            <span>•</span>
            <Link href="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link>
            <span>•</span>
            <Link href="/sitemap" className="hover:text-white transition-colors">Core Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
