import { JSX } from "react";
import { Link, useRouter } from "../components/Router";
import { ShieldCheck, Scale, FileText, Cookie, Map } from "lucide-react";

export default function LegalPages(): JSX.Element {
  const { currentPath } = useRouter();

  // Helper to determine active content
  const renderContent = () => {
    switch (currentPath) {
      case "/privacy":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-[#081B3A]">
              <ShieldCheck className="h-8 w-8 text-[#C9A24B]" />
              <h1 className="font-display text-2xl md:text-3.5xl font-semibold">Privacy Policy</h1>
            </div>
            <p className="text-xs text-slate-400">Effective Date: June 12, 2026. Last Updated: June 12, 2026</p>
            <div className="h-[1.5px] w-16 bg-[#C9A24B]"></div>
            
            <p className="leading-relaxed">
              At VM PROPERTIES, we hold your confidential privacy indices in maximum regard. This document details our exact data collection and preservation methodologies for HNI clients navigating our physical site surveyors and digital portfolio catalog systems.
            </p>

            <h3 className="font-display font-bold text-lg text-[#081B3A] mt-8">1. Information We Securely Record</h3>
            <p className="leading-relaxed">
              When submitting contact requests or planning site surveys, we collect your full legal name, private call number, validated electronic email, and specific lifestyle requirements.
            </p>

            <h3 className="font-display font-bold text-lg text-[#081B3A] mt-6">2. Absolute Non-Disclosure Safeguards</h3>
            <p className="leading-relaxed">
              Your registered identity details is strictly restricted to authorized real estate escrows and VM board advisory agents. Under no parameters is user lead metadata sold or exchanged with third-party tracking conglomerates.
            </p>

            <h3 className="font-display font-bold text-lg text-[#081B3A] mt-6">3. Dynamic Rights</h3>
            <p className="leading-relaxed">
              You maintain the absolute sovereign right to request complete details extraction and erasure of your data entries by contacting us directly at <span className="font-bold underline text-[#C9A24B]">concierge@vmproperties.com</span>.
            </p>
          </div>
        );

      case "/terms":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-[#081B3A]">
              <Scale className="h-8 w-8 text-[#C9A24B]" />
              <h1 className="font-display text-2xl md:text-3.5xl font-semibold">Terms of Service</h1>
            </div>
            <p className="text-xs text-slate-400 font-mono">Last Updated: June 12, 2026</p>
            <div className="h-[1.5px] w-16 bg-[#C9A24B]"></div>

            <p className="leading-relaxed">
              Acceptance of terms is a mandatory prerequisite for accessing VM Properties digital platforms. These regulations form a legally binding contract between yourself and VM Properties group corporations.
            </p>

            <h3 className="font-display font-bold text-lg text-[#081B3A] mt-8">1. Accuracy of Listings Portfolio</h3>
            <p className="leading-relaxed">
              While our counselors actively audit land listings, plot values, coordinates, and handover projections daily, all digital catalog assets should be treated as informational references. Capital allocations must be verified physically.
            </p>

            <h3 className="font-display font-bold text-lg text-[#081B3A] mt-6">2. Restricted Site Surveys Scheduling</h3>
            <p className="leading-relaxed">
              Booking physical surveys requires biometric validation of contact details. Cancellations must be flagged 24 hours prior via our hotline channels.
            </p>
          </div>
        );

      case "/disclaimer":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-[#081B3A]">
              <FileText className="h-8 w-8 text-[#C9A24B]" />
              <h1 className="font-display text-2xl md:text-3.5xl font-semibold">Legal Disclaimer</h1>
            </div>
            <p className="text-xs text-slate-400">RERA Regulatory Compliant Disclosure</p>
            <div className="h-[1.5px] w-16 bg-[#C9A24B]"></div>

            <p className="leading-relaxed">
              All architectural outlines, duplex rendering drawings, amenity listings, views, video tours, and area calculations shown on this portal correspond to conceptual developer specifications.
            </p>
            <p className="leading-relaxed">
              In accordance with local Real Estate Regulatory Authority standards, final registered purchase coordinates are governed exclusively by physical stamp documentation countersigned during direct land registry handovers. No liability is assumed for computational variations.
            </p>
          </div>
        );

      case "/cookie-policy":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-[#081B3A]">
              <Cookie className="h-8 w-8 text-[#C9A24B]" />
              <h1 className="font-display text-2xl md:text-3.5xl font-semibold">Cookie Policy</h1>
            </div>
            <p className="text-xs text-slate-400">Cookies & Tracking Protocols</p>
            <div className="h-[1.5px] w-16 bg-[#C9A24B]"></div>

            <p className="leading-relaxed">
              VM PROPERTIES utilizes simple, high-security localized tracking session tokens to preserve search filter states, listings layouts preferences, and secure administrator portal tokens.
            </p>
            <p className="leading-relaxed">
              By continued interaction with our premium portal, you authorize the dynamic deployment of these state helpers. You may opt to dismiss cookie storage inside your terminal settings menus.
            </p>
          </div>
        );

      case "/sitemap":
      default:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-[#081B3A]">
              <Map className="h-8 w-8 text-[#C9A24B]" />
              <h1 className="font-display text-2xl md:text-3.5xl font-semibold">Core Sitemap</h1>
            </div>
            <p className="text-xs text-slate-400">Dynamic Index for SEO Search Crawlers</p>
            <div className="h-[1.5px] w-16 bg-[#C9A24B]"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
              <div className="space-y-3">
                <h3 className="font-display font-semibold text-base text-[#081B3A] border-b pb-2">Public Enclaves</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/" className="text-[#C9A24B] hover:underline font-medium">Home Page Portal</Link></li>
                  <li><Link href="/properties" className="text-[#C9A24B] hover:underline font-medium">Premium Listings Index</Link></li>
                  <li><Link href="/projects" className="text-[#C9A24B] hover:underline font-medium">Active Structural Projects</Link></li>
                  <li><Link href="/gallery" className="text-[#C9A24B] hover:underline font-medium">Visual Gallery & Masonry</Link></li>
                  <li><Link href="/blog" className="text-[#C9A24B] hover:underline font-medium">Market Trends Blog</Link></li>
                  <li><Link href="/about" className="text-[#C9A24B] hover:underline font-medium">About Our Brand</Link></li>
                  <li><Link href="/contact" className="text-[#C9A24B] hover:underline font-medium">Headquarters Contact Office</Link></li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-display font-semibold text-base text-[#081B3A] border-b pb-2">Compliance Nodes</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/privacy" className="text-[#C9A24B] hover:underline font-medium">Privacy & Security Policies</Link></li>
                  <li><Link href="/terms" className="text-[#C9A24B] hover:underline font-medium">Terms & Rules agreement</Link></li>
                  <li><Link href="/disclaimer" className="text-[#C9A24B] hover:underline font-medium font-sans">Sovereign Land Disclaimers</Link></li>
                  <li><Link href="/cookie-policy" className="text-[#C9A24B] hover:underline font-medium">Tracking Cookies Policy</Link></li>
                  <li><Link href="/admin" className="text-emerald-700 font-bold hover:underline">Secure Administrator Gateway</Link></li>
                </ul>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-slate-50 text-slate-800 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white border border-slate-200 rounded p-8 md:p-12 shadow-sm leading-relaxed text-sm text-slate-600 font-sans space-y-4">
          
          {renderContent()}

          {/* Home Link */}
          <div className="pt-12 border-t mt-12 flex justify-between items-center text-xs">
            <Link href="/" className="px-5 py-2.5 bg-[#081B3A] text-[#C9A24B] uppercase tracking-wider font-display font-bold hover:bg-[#122e58] transition-colors rounded">
              Return Home Portal
            </Link>
            <span className="text-slate-400 font-mono">ID: RERA-AP-HYD-C122</span>
          </div>

        </div>
      </div>
    </div>
  );
}
