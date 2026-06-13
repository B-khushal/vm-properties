import React, { useState, useEffect, JSX } from "react";
import { Link, useRouter } from "../components/Router";
import { Property, Project, Testimonial } from "../types";
import {
  Search, Shield, Layers, Award, Star, Phone, MessageCircle, CalendarDays, ArrowRight,
  TrendingUp, HardHat, FileCheck2, UserCheck, BarChart3, HelpCircle, MapPin
} from "lucide-react";

export default function Home(): JSX.Element {
  const { navigate } = useRouter();
  const [featured, setFeatured] = useState<Property[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // Discovery tabs state
  const [activeDiscoveryTab, setActiveDiscoveryTab] = useState<"all" | "trending" | "luxury" | "recent">("all");

  // Home Search Widget states
  const [searchLoc, setSearchLoc] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchBudget, setSearchBudget] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  // Testimonial slider index
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Animated counters simulator (increases on load)
  const [yearsCount, setYearsCount] = useState(0);
  const [verifiedCount, setVerifiedCount] = useState(0);
  const [billionTransacted, setBillionTransacted] = useState(0);

  useEffect(() => {
    // Parallel fetching
    Promise.all([
      fetch("/api/properties/featured").then(res => res.json()),
      fetch("/api/projects").then(res => res.json()),
      fetch("/api/testimonials").then(res => res.json())
    ]).then(([featuredData, projectsData, testData]) => {
      setFeatured(featuredData);
      setProjects(projectsData);
      setTestimonials(testData);
      setLoading(false);
    }).catch(err => {
      console.error("Home data seed load failed, using local standards", err);
      setLoading(false);
    });

    // Simple ticker animations
    const interval = setInterval(() => {
      setYearsCount(p => (p < 15 ? p + 1 : 15));
      setVerifiedCount(p => (p < 380 ? p + 10 : 380));
      setBillionTransacted(p => (p < 42 ? p + 2 : p));
    }, 45);

    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate transferring criteria to listings via local storage or parameters
    // We navigate to /properties and let the listings capture the values.
    // For a highly robust implementation, pass search settings in sessionStorage!
    sessionStorage.setItem("home_search_query", searchLoc);
    if (searchType) sessionStorage.setItem("home_search_type", searchType);
    if (searchStatus) sessionStorage.setItem("home_search_status", searchStatus);
    if (searchBudget) sessionStorage.setItem("home_search_budget", searchBudget);

    navigate("/properties");
  };

  const categories = [
    { name: "Residential Villas", count: "Apartments & Duplexes", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80", type: "Residential" },
    { name: "Executive Corporate", count: "HQ Suites & Offices", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80", type: "Commercial" },
    { name: "Sovereign Land Estates", count: "Verified Plots & Acreage", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80", type: "Land" }
  ];

  const valueProps = [
    { icon: <HardHat className="h-6 w-6 text-[#C9A24B]" />, title: "15+ Years Mastery", text: "Curating luxury properties across regional high-streets with premium development standards." },
    { icon: <FileCheck2 className="h-6 w-6 text-[#C9A24B]" />, title: "100% RERA Verified", text: "Our custom legal advisory board meticulously audits every title report and stamp parameter." },
    { icon: <UserCheck className="h-6 w-6 text-[#C9A24B]" />, title: "Trusted Advisors", text: "Providing confidential portfolio advisory and capital management to top NRI client columns." },
    { icon: <MapPin className="h-6 w-6 text-[#C9A24B]" />, title: "Premium Corridors", text: "Exclusive land listings catalogued in Hyderabad Financial District, Kokapet, and Mokila." },
    { icon: <TrendingUp className="h-6 w-6 text-[#C9A24B]" />, title: "Appreciating Portfolios", text: "Focusing on assets with tested capital appreciation scales above 12% annually." },
    { icon: <Star className="h-6 w-6 text-[#C9A24B]" />, title: "Private Concierge Desk", text: "Always-on personal assistance, virtualMatterport walk-throughs, and site surveyors." }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* HERO BANNER SECTION */}
      <div className="relative h-[110vh] max-h-[1000px] flex items-center justify-center text-white overflow-hidden text-center">
        {/* Cinematic Backdrop Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#081B3A]/85 z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80"
            alt="VM Properties Luxury Estate Cover"
            className="w-full h-full object-cover select-none scale-102 filter brightness-[0.8]"
          />
        </div>

        {/* Hero Interactive Texts */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-24">
          <div className="space-y-4">
            <span className="inline-block px-4 py-1.5 rounded-full border border-[#C9A24B]/35 bg-[#081B3A]/60 text-xs tracking-[0.4em] text-[#C9A24B] uppercase font-bold font-display animate-fadeIn">
              ESTABLISHED ROYAL STANDARDS
            </span>
            <h1 className="font-display font-medium text-4xl sm:text-5.5xl md:text-6.5xl tracking-tight leading-none text-slate-100">
              Find Your Dream Property With <span className="font-semibold text-[#C9A24B]">VM PROPERTIES</span>
            </h1>
            <p className="font-sans text-sm sm:text-base md:text-lg tracking-normal text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Premium Residential, Commercial & Land Properties with RERA Stamp Certification.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/properties"
              className="px-8 py-3 rounded bg-[#C9A24B] hover:bg-[#E5C07B] text-[#081B3A] font-display text-xs tracking-widest font-bold uppercase shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              Browse Estates Catalog
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 rounded bg-transparent text-white border border-[#C9A24B]/40 hover:border-[#C9A24B] font-display text-xs tracking-widest font-bold uppercase transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              Consult Advisory Desk
            </Link>
          </div>

          {/* DYNAMIC SEARCH ENGINE WIDGET */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-[#081B3A]/95 text-slate-800 border-t-4 border-[#C9A24B] p-5 sm:p-6 rounded-lg shadow-2xl max-w-4xl mx-auto mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-left font-sans backdrop-blur-md"
          >
            {/* Loc query */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-display font-bold text-[#E5C07B] tracking-widest uppercase">Location Corridor</label>
              <input
                type="text"
                placeholder="e.g. Jubilee Hills, Mokila"
                value={searchLoc}
                onChange={(e) => setSearchLoc(e.target.value)}
                className="w-full px-3 py-2 border rounded border-slate-200/40 text-xs bg-slate-50 outline-none focus:bg-white"
              />
            </div>

            {/* Type */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-display font-bold text-[#E5C07B] tracking-widest uppercase">Asset Type</label>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-full px-3 py-2 border rounded border-slate-200/40 text-xs bg-slate-50 outline-none focus:bg-white"
              >
                <option value="">All Categories</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Land">Vacant Lands</option>
              </select>
            </div>

            {/* Price limits */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-display font-bold text-[#E5C07B] tracking-widest uppercase">Budget limit</label>
              <select
                value={searchBudget}
                onChange={(e) => setSearchBudget(e.target.value)}
                className="w-full px-3 py-2 border rounded border-slate-200/40 text-xs bg-slate-50 outline-none focus:bg-white"
              >
                <option value="">Any Range</option>
                <option value="30000000">Up to ₹3.0 Cr</option>
                <option value="50000000">Up to ₹5.0 Cr</option>
                <option value="90000000">Up to ₹9.0 Cr</option>
                <option value="150000000">Up to ₹15.0 Cr</option>
              </select>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-display font-bold text-[#E5C07B] tracking-widest uppercase">RERA Availability</label>
              <select
                value={searchStatus}
                onChange={(e) => setSearchStatus(e.target.value)}
                className="w-full px-3 py-2 border rounded border-slate-200/40 text-xs bg-slate-50 outline-none focus:bg-white"
              >
                <option value="">All Statuses</option>
                <option value="For Sale">For Sale</option>
                <option value="For Rent">For Rent</option>
                <option value="Pre-Launch">Pre-Launch</option>
              </select>
            </div>

            {/* Submit icon button */}
            <div className="flex items-end">
              <button
                id="hero-search-submit-btn"
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2 bg-[#C9A24B] hover:bg-[#E5C07B] text-[#081B3A] font-display text-xs tracking-widest font-bold uppercase rounded cursor-pointer transition-transform duration-300"
              >
                <Search className="h-4 w-4" /> DISCOVER
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* LUXURY METRIC TICKERS - WHY CHOOSE US */}
      <div className="bg-white border-y border-slate-200 py-12 shadow-sm font-display relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="space-y-1">
            <p className="text-3xl md:text-5xl font-bold text-[#081B3A]">{yearsCount}+</p>
            <p className="text-xs font-bold text-[#C9A24B] uppercase tracking-wider">Years Active Mastery</p>
          </div>
          <div className="space-y-1 border-y sm:border-y-0 sm:border-x border-slate-100 py-6 sm:py-0">
            <p className="text-3xl md:text-5xl font-bold text-[#081B3A]">{verifiedCount}+</p>
            <p className="text-xs font-bold text-[#C9A24B] uppercase tracking-wider">Verified High-End Estates</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl md:text-5xl font-bold text-[#081B3A]">₹{billionTransacted}0+ Crores</p>
            <p className="text-xs font-bold text-[#C9A24B] uppercase tracking-wider">Asset Transactions Secured</p>
          </div>
        </div>
      </div>

      {/* BRAND TRUST SIGNALS REGISTRY */}
      <div className="bg-slate-50 border-b border-slate-200 py-8 font-sans select-none relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white border border-slate-150 rounded flex items-center gap-3.5 shadow-sm hover:shadow transition-shadow">
              <div className="p-2.5 bg-[#081B3A]/5 text-[#C9A24B] rounded shrink-0 border border-[#C9A24B]/10">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold font-display uppercase tracking-widest text-[#081B3A]">RERA Stamp Certified</p>
                <p className="text-[11px] text-slate-500 font-sans">100% regulatory safe files</p>
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-150 rounded flex items-center gap-3.5 shadow-sm hover:shadow transition-shadow">
              <div className="p-2.5 bg-[#081B3A]/5 text-[#C9A24B] rounded shrink-0 border border-[#C9A24B]/10">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold font-display uppercase tracking-widest text-[#081B3A]">Legal Title Clear</p>
                <p className="text-[11px] text-slate-500 font-sans">Audited ownership & encumbrance</p>
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-150 rounded flex items-center gap-3.5 shadow-sm hover:shadow transition-shadow">
              <div className="p-2.5 bg-[#081B3A]/5 text-[#C9A24B] rounded shrink-0 border border-[#C9A24B]/10">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold font-display uppercase tracking-widest text-[#081B3A]">Verified Advisor Seal</p>
                <p className="text-[11px] text-slate-500 font-sans">Strict physical site inspections</p>
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-150 rounded flex items-center gap-3.5 shadow-sm hover:shadow transition-shadow">
              <div className="p-2.5 bg-[#081B3A]/5 text-[#C9A24B] rounded shrink-0 border border-[#C9A24B]/10">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold font-display uppercase tracking-widest text-[#081B3A]">Secure Transactions</p>
                <p className="text-[11px] text-slate-500 font-sans">Escrow security channels</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURED PROPERTIES LIST SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs tracking-widest text-[#C9A24B] uppercase font-bold font-display">HAND-SELECTED MASTERPIECES</span>
          <h2 className="font-display font-medium text-2xl md:text-4.5xl tracking-tight text-[#081B3A]">Featured Properties Portfolio</h2>
          <div className="h-[2px] w-12 bg-[#C9A24B] mx-auto mt-3"></div>
        </div>

        {/* Dynamic Property Discovery Experience Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto border-b border-slate-150 pb-3 font-display">
          <button
            onClick={() => setActiveDiscoveryTab("all")}
            className={`px-4 py-2 text-xs tracking-widest uppercase font-bold rounded cursor-pointer transition-colors ${activeDiscoveryTab === "all" ? "bg-[#081B3A] text-[#C9A24B] border border-[#C9A24B]/30 shadow" : "bg-white text-slate-500 hover:text-[#081B3A]"}`}
          >
            All Collections
          </button>
          <button
            onClick={() => setActiveDiscoveryTab("trending")}
            className={`px-4 py-2 text-xs tracking-widest uppercase font-bold rounded cursor-pointer transition-colors ${activeDiscoveryTab === "trending" ? "bg-[#081B3A] text-[#C9A24B] border border-[#C9A24B]/30 shadow" : "bg-white text-slate-500 hover:text-[#081B3A]"}`}
          >
            Trending Properties
          </button>
          <button
            onClick={() => setActiveDiscoveryTab("luxury")}
            className={`px-4 py-2 text-xs tracking-widest uppercase font-bold rounded cursor-pointer transition-colors ${activeDiscoveryTab === "luxury" ? "bg-[#081B3A] text-[#C9A24B] border border-[#C9A24B]/30 shadow" : "bg-white text-slate-500 hover:text-[#081B3A]"}`}
          >
            Luxury Collection
          </button>
          <button
            onClick={() => setActiveDiscoveryTab("recent")}
            className={`px-4 py-2 text-xs tracking-widest uppercase font-bold rounded cursor-pointer transition-colors ${activeDiscoveryTab === "recent" ? "bg-[#081B3A] text-[#C9A24B] border border-[#C9A24B]/30 shadow" : "bg-white text-slate-500 hover:text-[#081B3A]"}`}
          >
            Recently Added
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#C9A24B]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(() => {
              let list = featured.filter((p) => {
                if (activeDiscoveryTab === "trending") return p.views && p.views > 40;
                if (activeDiscoveryTab === "luxury") return p.price >= 60000000;
                if (activeDiscoveryTab === "recent") return p.status === "For Sale" || p.status === "Pre-Launch";
                return true;
              });
              if (list.length === 0) list = featured; // safety fallback
              return list.slice(0, 3);
            })().map((p) => (
              <div
                key={p.id}
                className="bg-white border rounded shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 duration-300 overflow-hidden flex flex-col justify-between"
              >
                {/* Visual */}
                <div className="aspect-[1.5] relative overflow-hidden group">
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-[#081B3A] text-white text-[9px] tracking-widest font-display font-bold uppercase rounded border border-[#C9A24B]/30">
                    {p.status}
                  </span>
                  <span className="absolute bottom-4 right-4 px-3 py-1 bg-[#C9A24B] text-[#081B3A] text-[9px] tracking-widest font-display font-bold uppercase rounded">
                    {p.category}
                  </span>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <p className="text-xs text-[#C9A24B] font-display font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" /> {p.location}
                    </p>
                    <h3 className="font-display font-bold text-lg text-[#081B3A] line-clamp-1">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-sans line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <span className="font-display font-bold text-base text-[#081B3A]">
                      {p.price >= 10000000 ? `₹${(p.price / 10000000).toFixed(2)} Cr` : `₹${(p.price / 100000).toFixed(1)} L`}
                    </span>
                    <button
                      onClick={() => navigate(`/property/${p.id}`)}
                      className="px-4 py-2 bg-[#081B3A] text-white border border-[#C9A24B]/10 hover:border-[#C9A24B] font-display text-[10px] tracking-widest font-bold uppercase rounded transition-colors cursor-pointer"
                    >
                      VIEW ARCHITECTURE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PORTFOLIO CATEGORIES */}
      <div className="bg-[#081B3A] text-white py-20 border-y border-[#C9A24B]/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#081B3A] z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,162,75,0.08)_0%,transparent_70%)] animate-luxury-glow"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs tracking-widest text-[#C9A24B] uppercase font-bold font-display">PRECISE CLASSIFICATION</span>
            <h2 className="font-display font-medium text-2xl md:text-3.5xl tracking-tight text-slate-100">Browse Sovereign Categories</h2>
            <div className="h-[2.5px] w-12 bg-[#C9A24B] mx-auto mt-3"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat, i) => (
              <div
                key={i}
                onClick={() => {
                  sessionStorage.setItem("home_search_type", cat.type);
                  navigate("/properties");
                }}
                className="group relative h-[320px] rounded overflow-hidden shadow-xl border border-white/5 hover:border-[#C9A24B]/50 transition-all duration-300 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#081B3A] to-transparent bg-opacity-70 z-10 group-hover:bg-opacity-40 transition-all"></div>
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                
                <div className="absolute bottom-6 left-6 z-20 space-y-1">
                  <h3 className="font-display font-bold text-lg text-[#E5C07B] tracking-wide text-shadow-md">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-300 flex items-center gap-1">
                    {cat.count} <ArrowRight className="h-3 w-3 group-hover:translate-x-1.5 transition-transform text-[#C9A24B]" />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WHY CHOOSE US - CORPORATE EXCELLENCE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs tracking-widest text-[#C9A24B] uppercase font-bold font-display font-sans">SOVEREIGN TRUST STANDARDS</span>
          <h2 className="font-display font-medium text-2xl md:text-3.5xl tracking-tight text-[#081B3A]">Corporate Value Pillars</h2>
          <div className="h-[2px] w-12 bg-[#C9A24B] mx-auto mt-3"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {valueProps.map((p, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200/80 p-6 rounded shadow-sm hover:border-[#C9A24B]/40 transition-colors duration-300 space-y-3"
            >
              <div className="p-3 bg-[#081B3A]/5 rounded-full w-fit">
                {p.icon}
              </div>
              <h3 className="font-display font-semibold text-lg text-[#081B3A]">{p.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">{p.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* BENCHMARK REGIONAL INVESTMENT HOTSPOTS */}
      <div className="bg-white py-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs tracking-widest text-[#C9A24B] uppercase font-bold font-display uppercase">Bespose Portfolio Advisory</span>
            <h2 className="font-display font-medium text-2xl md:text-3.5xl tracking-tight text-[#081B3A]">Regional Capital Investment Hotspots</h2>
            <div className="h-[2px] w-12 bg-[#C9A24B] mx-auto mt-3"></div>
            <p className="text-xs text-slate-400 font-sans max-w-lg mx-auto">Meticulously tracking compounded appreciation Catalysts across high-growth economic corridors.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-sans">
            <div className="p-5 border border-slate-150 rounded bg-slate-50 space-y-4 hover:border-[#C9A24B]/40 transition-colors">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-wider font-bold text-[#C9A24B] font-display">HIGH-GROWTH EXCLUSIVE</span>
                <h4 className="font-display font-bold text-base text-[#081B3A]">Kokapet Golden Hour</h4>
              </div>
              <div className="space-y-2 text-xs border-y py-3 text-slate-600">
                <div className="flex justify-between"><span>Est. ROI Potential:</span> <strong className="text-emerald-600 font-bold font-sans">14.2% / yr</strong></div>
                <div className="flex justify-between"><span>Holding Period:</span> <strong className="text-slate-700">3 - 5 Years</strong></div>
                <div className="flex justify-between"><span>Density Tier:</span> <strong className="text-slate-700">Ultra High</strong></div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">Catalyzed by Gachibowli Outer Ring Express Hub & Golden Mile high-tech commercial towers.</p>
            </div>

            <div className="p-5 border border-slate-150 rounded bg-slate-50 space-y-4 hover:border-[#C9A24B]/40 transition-colors">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-wider font-bold text-[#C9A24B] font-display">SUB-URBAN HOTSPOT</span>
                <h4 className="font-display font-bold text-base text-[#081B3A]">Mokila Corridor</h4>
              </div>
              <div className="space-y-2 text-xs border-y py-3 text-slate-600">
                <div className="flex justify-between"><span>Est. ROI Potential:</span> <strong className="text-emerald-600 font-bold font-sans">18.5% / yr</strong></div>
                <div className="flex justify-between"><span>Holding Period:</span> <strong className="text-slate-700">2 - 4 Years</strong></div>
                <div className="flex justify-between"><span>Density Tier:</span> <strong className="text-slate-700">Low (Greenbelt)</strong></div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">Driven by high-net villa approvals, luxury resort infrastructure, and signal-free ring road accessibility.</p>
            </div>

            <div className="p-5 border border-slate-150 rounded bg-slate-50 space-y-4 hover:border-[#C9A24B]/40 transition-colors">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-wider font-bold text-[#C9A24B] font-display">CENTRAL COMMERCIAL</span>
                <h4 className="font-display font-bold text-base text-[#081B3A]">Financial District</h4>
              </div>
              <div className="space-y-2 text-xs border-y py-3 text-slate-600">
                <div className="flex justify-between"><span>Est. ROI Potential:</span> <strong className="text-emerald-600 font-bold font-sans">12.8% / yr</strong></div>
                <div className="flex justify-between"><span>Holding Period:</span> <strong className="text-slate-700">5+ Years</strong></div>
                <div className="flex justify-between"><span>Density Tier:</span> <strong className="text-slate-700">Commercial Grade</strong></div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">Backed by blue-chip global IT workspaces, multi-specialty medical centers, & premium tech corridors.</p>
            </div>

            <div className="p-5 border border-slate-150 rounded bg-slate-50 space-y-4 hover:border-[#C9A24B]/40 transition-colors">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-wider font-bold text-[#C9A24B] font-display">SOVEREIGN VILLA GROUND</span>
                <h4 className="font-display font-bold text-base text-[#081B3A]">Tellapur Corridor</h4>
              </div>
              <div className="space-y-2 text-xs border-y py-3 text-slate-600">
                <div className="flex justify-between"><span>Est. ROI Potential:</span> <strong className="text-emerald-600 font-bold font-sans">15.4% / yr</strong></div>
                <div className="flex justify-between"><span>Holding Period:</span> <strong className="text-slate-700">3 - 5 Years</strong></div>
                <div className="flex justify-between"><span>Density Tier:</span> <strong className="text-slate-700">Medium density</strong></div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">Catalyzed by upcoming Metrolite transit lines and extensive grade-A gated villa commissions.</p>
            </div>
          </div>
        </div>
      </div>

      {/* SIGNATURE DEVELOPMENTS SHOWCASE */}
      <div className="bg-slate-100 py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs tracking-widest text-[#C9A24B] uppercase font-bold font-display">ARCHITECTURAL SKYLINES</span>
            <h2 className="font-display font-medium text-2xl md:text-3.5xl tracking-tight text-[#081B3A]">Latest Commissions & Projects</h2>
            <div className="h-[2px] w-12 bg-[#C9A24B] mx-auto mt-3"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.slice(0, 3).map((proj) => (
              <div
                key={proj.id}
                className="bg-white border border-slate-200 overflow-hidden rounded shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="aspect-video relative overflow-hidden group">
                  <img src={proj.image} alt={proj.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-4 left-4 bg-orange-600/90 border text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded">
                    {proj.status}
                  </span>
                </div>

                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <p className="text-xs text-[#C9A24B] font-display font-bold tracking-widest uppercase">{proj.location}</p>
                    <h3 className="font-display font-bold text-[#081B3A] text-lg leading-tight">{proj.name}</h3>
                    <p className="text-xs text-slate-500 font-sans line-clamp-2 leading-relaxed">{proj.description}</p>
                  </div>

                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-1.5 text-xs font-display font-bold tracking-widest text-[#C9A24B] uppercase hover:text-[#081B3A] transition-colors pt-2"
                  >
                    INVESTIGATE DETAILS <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LUXURY TESTIMONIAL SLIDER */}
      {testimonials.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-8 font-sans">
          <div className="space-y-2">
            <span className="text-[10px] tracking-widest text-[#C9A24B] font-display uppercase font-bold">CLIENT SATISFACTIONS INDEX</span>
            <h2 className="font-display font-medium text-2xl md:text-3.5xl text-[#081B3A]">Advisory Commendations</h2>
            <div className="h-[2px] w-12 bg-[#C9A24B] mx-auto mt-2"></div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded p-8 md:p-12 shadow-sm space-y-6 relative overflow-hidden">
            <span className="absolute top-4 right-4 text-slate-100 font-serif text-8xl font-black select-none pointer-events-none">“</span>
            
            <p className="leading-relaxed text-slate-600 italic text-sm md:text-base max-w-3xl mx-auto relative z-10">
              "{testimonials[activeTestimonial].review}"
            </p>

            <div className="flex items-center justify-center gap-1.5 text-[#C9A24B]">
              {Array.from({ length: testimonials[activeTestimonial].rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>

            <div className="flex flex-col items-center gap-2">
              <img
                src={testimonials[activeTestimonial].photo}
                alt={testimonials[activeTestimonial].clientName}
                className="h-14 w-14 rounded-full border-2 border-[#C9A24B] object-cover"
              />
              <div>
                <h4 className="font-display font-bold text-[#081B3A] text-sm tracking-wide">
                  {testimonials[activeTestimonial].clientName}
                </h4>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-0.5">
                  {testimonials[activeTestimonial].role}
                </p>
              </div>
            </div>

            {/* Pagination Sliders indicator dots */}
            <div className="flex justify-center gap-2 mt-4 relative z-10">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`h-2.5 w-2.5 rounded-full transition-all cursor-pointer ${activeTestimonial === idx ? "bg-[#C9A24B] w-6" : "bg-slate-200 hover:bg-slate-300"}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LUXURY CONTACT CTA SECTION */}
      <div className="bg-[#081B3A] text-white py-16 border-t-2 border-[#C9A24B]/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,162,75,0.06)_0%,transparent_70%)] animate-luxury-glow"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center space-y-6">
          <h2 className="font-display text-2xl md:text-3.5xl font-light tracking-wide">
            Coordinate Your Next Asset Placement
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Our luxury advisory team is online to secure private virtual walkthrough registrations and physical escorted surveyors.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a
              href="tel:+919876543210"
              className="px-6 py-3 rounded bg-transparent hover:bg-white/5 border border-[#C9A24B]/30 text-white font-display text-xs tracking-widest font-bold uppercase flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Phone className="h-4 w-4 text-[#C9A24B]" /> CALL RECEPTION
            </a>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-display text-xs tracking-widest font-bold uppercase flex items-center gap-2 transition-colors cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" /> WHATSAPP SECURE
            </a>
            <Link
              href="/contact"
              className="px-6 py-3 rounded bg-[#C9A24B] hover:bg-[#E5C07B] text-[#081B3A] font-display text-xs tracking-widest font-bold uppercase flex items-center gap-2 transition-colors shadow-lg cursor-pointer"
            >
              <CalendarDays className="h-4 w-4" /> RESERVATION Visit
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
