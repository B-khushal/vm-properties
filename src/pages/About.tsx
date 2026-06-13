import { JSX } from "react";
import { Link } from "../components/Router";
import { ShieldCheck, Award, Eye, Compass, CheckCircle } from "lucide-react";

export default function About(): JSX.Element {
  const milestones = [
    {
      icon: <ShieldCheck className="h-7 w-7 text-[#C9A24B]" />,
      title: "RERA Verified Security",
      desc: "Each asset, land plot, or sky apartment listed undergoes a complete multi-step documentation verification by our board of counsel."
    },
    {
      icon: <Award className="h-7 w-7 text-[#C9A24B]" />,
      title: "Bespoke Architecture",
      desc: "We exclusively recommend developments incorporating tier-1 elements, sustainable engineering, and hand-selected marble."
    },
    {
      icon: <Eye className="h-7 w-7 text-[#C9A24B]" />,
      title: "Client Confidences",
      desc: "Providing high-discretion transaction advisory to international NRIs, industrial magnates, and luxury buyers globally."
    },
    {
      icon: <Compass className="h-7 w-7 text-[#C9A24B]" />,
      title: "Prime Locational Spanning",
      desc: "Exclusive catalogs covering the gold zones of Hyderabad (Jubilee Hills, Financial District, Mokila acreage grids) and Chennai."
    }
  ];

  return (
    <div className="pt-24 min-h-screen bg-slate-50 text-slate-800">
      {/* Editorial Title Banner */}
      <div className="bg-[#081B3A] text-white py-16 text-center border-b border-[#C9A24B]/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,162,75,0.08)_0%,transparent_70%)] animate-luxury-glow"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-4">
          <p className="font-display text-xs tracking-[0.4em] text-[#C9A24B] uppercase font-semibold">
            ABOUT VM PROPERTIES
          </p>
          <h1 className="font-display font-bold text-3xl md:text-5xl tracking-normal text-slate-100">
            A Legacy of Architectural Excellence
          </h1>
          <div className="h-[2px] w-24 bg-[#C9A24B] mx-auto mt-4"></div>
        </div>
      </div>

      {/* Editorial Two Column Story */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <h2 className="font-display text-2xl md:text-3.5xl font-semibold tracking-normal text-[#081B3A] leading-tight">
            Curating India's Premier Sovereign Estate Assets
          </h2>
          <p className="text-slate-600 leading-relaxed text-base font-sans">
            Founded with the singular purpose of simplifying and refining the luxury real estate experience, VM PROPERTIES has established itself as the trusted estate advisor for global HNIs. We do not operate as standard volume transaction brokers. We are boutique real estate collectors.
          </p>
          <p className="text-slate-600 leading-relaxed text-base font-sans">
            Under the executive management of Vidhya Murthy and our specialist land-acquisition teams, VM PROPERTIES offers deep, unclouded visibility into asset titles, appreciation projections, structural soundness index ratings, and premium architectural materials.
          </p>
          <div className="pt-4 flex flex-wrap gap-6 text-[#081B3A] font-display text-sm tracking-wider font-bold">
            <span className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-[#C9A24B]" /> 100% Legal Clear Titles
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-[#C9A24B]" /> Private High-End Cataloging
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-tr from-[#C9A24B] to-[#081B3A] opacity-20 blur-md"></div>
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
            alt="VM Properties Signature Architecture"
            className="rounded shadow-2xl border border-white relative z-10 w-full object-cover h-[450px]"
          />
        </div>
      </div>

      {/* Corporate Milestones */}
      <div className="bg-[#081B3A] text-white py-16 my-8 border-y border-[#C9A24B]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
          <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-wider text-[#C9A24B]">
            WHAT WE GUARANTEE
          </h2>
          <div className="h-[1.5px] w-12 bg-white mx-auto mt-2.5"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {milestones.map((m, i) => (
            <div
              key={i}
              className="bg-black/20 border border-[#C9A24B]/10 rounded p-6 hover:border-[#C9A24B]/40 transition-all duration-300 relative group"
            >
              <div className="mb-4 bg-white/5 p-3 rounded-full w-fit group-hover:scale-105 transition-transform">
                {m.icon}
              </div>
              <h3 className="font-display font-semibold text-lg text-slate-100 mb-2 truncate">
                {m.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Advisory Call To Action */}
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6 font-sans">
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-[#081B3A]">
          Ready to Consult with our Chief Advisory Officers?
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Schedule a private executive zoom consultation or an arranged physical site survey. Your data is handled with maximum absolute non-disclosure security.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            href="/contact"
            className="px-8 py-3 rounded bg-[#C9A24B] hover:bg-[#E5C07B] text-[#081B3A] font-display text-xs tracking-widest font-bold uppercase shadow-lg transition-transform hover:-translate-y-0.5"
          >
            Arrange Consultation
          </Link>
          <Link
            href="/properties"
            className="px-8 py-3 rounded bg-[#081B3A] hover:bg-[#1a3861] text-[#C9A24B] font-display text-xs tracking-widest font-bold uppercase border border-[#C9A24B]/40 transition-transform hover:-translate-y-0.5"
          >
            See Our Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
