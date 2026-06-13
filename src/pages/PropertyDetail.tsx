import React, { useEffect, useState, JSX } from "react";
import { Property } from "../types";
import { useRouter } from "../components/Router";
import {
  MapPin, BedDouble, Bath, Car, Maximize2, FileText, Send, Calendar, Clock, Check, Play, Eye,
  School, Hospital, Milestone, ShoppingBag, MessageSquare, Phone, Share2, Compass, ShieldCheck, TrendingUp, Sparkles
} from "lucide-react";

export default function PropertyDetail(): JSX.Element {
  const { getParams, navigate } = useRouter();
  const params = getParams();
  
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  // similar properties state
  const [similarProps, setSimilarProps] = useState<Property[]>([]);

  // lightbox modal state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // EMI calculator states
  const [loanTerm, setLoanTerm] = useState(20); // default 20 years
  const [interestRate, setInterestRate] = useState(8.5); // default 8.5%
  const [downPaymentPercent, setDownPaymentPercent] = useState(20); // default 20% down payment

  // Inquiries Inbound
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquirySent, setInquirySent] = useState(false);

  // Site surveys scheduling Inbound
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");
  const [visitBooked, setVisitBooked] = useState(false);

  useEffect(() => {
    if (params.id) {
      setLoading(true);
      fetch(`/api/properties/${params.id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Asset details lookup failed");
          return res.json();
        })
        .then((data) => {
          setProperty(data);
          setLoading(false);

          // Save to Recently Viewed locally
          try {
            const stored = localStorage.getItem("vm_recently_viewed_ids");
            let viewedList: string[] = stored ? JSON.parse(stored) : [];
            viewedList = viewedList.filter(id => id !== data.id); // remove duplicates
            viewedList.unshift(data.id); // push to front
            localStorage.setItem("vm_recently_viewed_ids", JSON.stringify(viewedList.slice(0, 5)));
          } catch (e) {
            console.error("Failed to append recently viewed list", e);
          }

          // Get similar properties list
          fetch("/api/properties")
            .then((r) => r.json())
            .then((all) => {
              const matched = all.filter(
                (p: Property) =>
                  p.id !== data.id &&
                  (p.type === data.type || p.category === data.category)
              );
              setSimilarProps(matched.slice(0, 3));
            })
            .catch((e) => console.error("Similarity fetch error", e));
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [params.id]);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propertyId: property.id,
        propertyName: property.title,
        name: inquiryName,
        phone: inquiryPhone,
        email: inquiryEmail,
        message: inquiryMessage,
        source: "Web Inquiry"
      })
    })
      .then((res) => res.json())
      .then(() => {
        setInquirySent(true);
        setInquiryName("");
        setInquiryPhone("");
        setInquiryEmail("");
        setInquiryMessage("");
      })
      .catch((err) => console.error(err));
  };

  const handleVisitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!property || !visitDate || !visitTime) return;

    fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propertyId: property.id,
        propertyName: property.title,
        name: inquiryName || "Anonymous Prospect",
        phone: inquiryPhone || "Unspecified Phone",
        email: inquiryEmail || "Unspecified Email",
        date: visitDate,
        time: visitTime
      })
    })
      .then((res) => res.json())
      .then(() => {
        setVisitBooked(true);
        setVisitDate("");
        setVisitTime("");
      })
      .catch((err) => console.error(err));
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Crores`;
    return `₹${(price / 100000).toFixed(1)} Lakhs`;
  };

  const getNearbyIcon = (type: string) => {
    switch (type) {
      case "School": return <School className="h-4 w-4 text-[#C9A24B]" />;
      case "Hospital": return <Hospital className="h-4 w-4 text-[#C9A24B]" />;
      case "Metro": return <Milestone className="h-4 w-4 text-[#C9A24B]" />;
      case "Shopping": return <ShoppingBag className="h-4 w-4 text-[#C9A24B]" />;
      default: return <MapPin className="h-4 w-4 text-[#C9A24B]" />;
    }
  };

  if (loading) {
    return (
      <div className="pt-32 min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#C9A24B]"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="pt-32 min-h-screen bg-slate-50 text-center max-w-lg mx-auto space-y-4">
        <h2 className="font-display text-2xl font-bold text-slate-800">Asset File Not Loaded</h2>
        <p className="text-slate-500 font-sans">The dynamic asset slug does not map to any listed properties in our registry.</p>
        <button
          onClick={() => navigate("/properties")}
          className="px-6 py-2.5 rounded bg-[#081B3A] text-[#C9A24B] uppercase tracking-wider font-display font-bold"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Title Hero */}
      <div className="bg-[#081B3A] text-white py-12 border-b border-[#C9A24B]/30 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 bg-[#C9A24B] text-[#081B3A] font-display text-[10px] tracking-widest font-bold uppercase rounded">
              {property.status} • {property.category}
            </span>
            <h1 className="font-display font-medium text-2xl md:text-3.5xl tracking-tight text-white mt-1">
              {property.title}
            </h1>
            <p className="text-xs text-[#E5C07B] flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {property.address}
            </p>
          </div>

          <div className="text-left md:text-right space-y-1">
            <p className="text-xs text-slate-400 font-display uppercase tracking-widest font-bold">Inscribed Valuation</p>
            <p className="font-display text-2xl md:text-3xl text-[#C9A24B] font-bold">
              {formatPrice(property.price)}
            </p>
            {property.status === "For Rent" && <span className="text-xs text-slate-300 capitalize">per calendar month</span>}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        
        {/* LEFT COLUMN: MULTIMEDIA AND STRUCTURAL INFO */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main Stage Media Gallery with Switch Controls */}
          <div className="bg-white border rounded overflow-hidden shadow-sm border-slate-200">
            <div className="aspect-video relative bg-slate-900 flex items-center justify-center">
              {showVideo && property.videos && property.videos.length > 0 ? (
                <video src={property.videos[0]} controls autoPlay className="w-full h-full object-cover" />
              ) : (
                <img
                  src={property.images[activeImageIndex]}
                  alt={property.title}
                  onClick={() => {
                    setIsLightboxOpen(true);
                    setLightboxIndex(activeImageIndex);
                  }}
                  className="w-full h-full object-cover cursor-zoom-in transition-transform duration-300 hover:scale-[1.02]"
                  title="Click to view full screen"
                />
              )}

              {/* Float buttons toggles */}
              <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                <button
                  onClick={() => setShowVideo(false)}
                  className={`px-4 py-1.5 rounded text-[10px] tracking-widest font-display font-bold uppercase flex items-center gap-1 bg-[#081B3A]/90 border text-white ${!showVideo ? "border-[#C9A24B] bg-[#0c2752]" : "border-slate-600"}`}
                >
                  <Eye className="h-3.5 w-3.5" /> IMAGES ({property.images.length})
                </button>
                {property.videos && property.videos.length > 0 && (
                  <button
                    onClick={() => setShowVideo(true)}
                    className={`px-4 py-1.5 rounded text-[10px] tracking-widest font-display font-bold uppercase flex items-center gap-1 bg-[#081B3A]/90 border text-white ${showVideo ? "border-[#C9A24B] bg-[#0c2752]" : "border-slate-600"}`}
                  >
                    <Play className="h-3.5 w-3.5 text-[#C9A24B]" /> WALKTHROUGH
                  </button>
                )}
              </div>
            </div>

            {/* Thumbnail grids if not reading video */}
            {!showVideo && (
              <div className="p-3 bg-slate-100 border-t flex gap-2 overflow-x-auto">
                {property.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`h-16 w-24 shrink-0 rounded overflow-hidden border-2 transition-all ${
                      activeImageIndex === i ? "border-[#C9A24B] scale-95" : "border-transparent opacity-80"
                    }`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Metrics Ribbons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-5 border rounded shadow-sm border-slate-200 text-center font-display">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Built up Area</p>
              <p className="text-base font-bold text-[#081B3A] mt-1 flex items-center justify-center gap-1">
                <Maximize2 className="h-4 w-4 text-[#C9A24B]" /> {property.area} Sq Ft
              </p>
            </div>
            {property.bedrooms > 0 && (
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bedrooms</p>
                <p className="text-base font-bold text-[#081B3A] mt-1 flex items-center justify-center gap-1">
                  <BedDouble className="h-4 w-4 text-[#C9A24B]" /> {property.bedrooms} BHK
                </p>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bathrooms</p>
                <p className="text-base font-bold text-[#081B3A] mt-1 flex items-center justify-center gap-1">
                  <Bath className="h-4 w-4 text-[#C9A24B]" /> {property.bathrooms} Baths
                </p>
              </div>
            )}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Parking Slots</p>
              <p className="text-base font-bold text-[#081B3A] mt-1 flex items-center justify-center gap-1">
                <Car className="h-4 w-4 text-[#C9A24B]" /> {property.parking || "2"} Covered
              </p>
            </div>
          </div>

          {/* Luxury Property Specification Highlights Section */}
          <div className="bg-white border rounded p-6 shadow-sm border-slate-200 space-y-6">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-[#C9A24B]" />
              <h3 className="font-display font-medium text-lg text-[#081B3A] tracking-tight">
                Architectural Specification Highlights
              </h3>
            </div>
            <div className="h-[1.5px] w-12 bg-[#C9A24B] -mt-4"></div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm font-sans">
              <div className="space-y-1 p-3 bg-slate-50 rounded border border-slate-100 transition-hover duration-250 hover:bg-white hover:border-[#C9A24B]/35">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-display block select-none">Furnishing State</span>
                <span className="font-semibold text-slate-700 flex items-center gap-1.5 text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C9A24B]" /> {property.type === "Land" ? "Unfurnished (Plot)" : "Fully Furnished / Designer"}
                </span>
              </div>

              <div className="space-y-1 p-3 bg-slate-50 rounded border border-slate-100 transition-hover duration-250 hover:bg-white hover:border-[#C9A24B]/35">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-display block select-none">Vastu Direction</span>
                <span className="font-semibold text-slate-700 flex items-center gap-1.2 text-xs">
                  <Compass className="h-3.5 w-3.5 text-[#C9A24B]" /> East Facing
                </span>
              </div>

              <div className="space-y-1 p-3 bg-slate-50 rounded border border-slate-100 transition-hover duration-250 hover:bg-white hover:border-[#C9A24B]/35">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-display block select-none">Construction Age</span>
                <span className="font-semibold text-slate-700 flex items-center gap-1.5 text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C9A24B]" /> Newly Built (2024)
                </span>
              </div>

              <div className="space-y-1 p-3 bg-slate-50 rounded border border-slate-100 transition-hover duration-250 hover:bg-white hover:border-[#C9A24B]/35">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-display block select-none">Property Tenure</span>
                <span className="font-semibold text-slate-700 flex items-center gap-1.5 text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C9A24B]" /> Freehold Title Deed
                </span>
              </div>

              <div className="space-y-1 p-3 bg-slate-50 rounded border border-slate-100 transition-hover duration-250 hover:bg-white hover:border-[#C9A24B]/35 col-span-1 md:col-span-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-display block select-none">Regulatory Authority</span>
                <span className="font-semibold text-[#081B3A] flex items-center gap-1.2 text-xs">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" /> Registered (RERA ID: PRM/KA/RERA/{property.id.substring(0, 4).toUpperCase()}/S-2401)
                </span>
              </div>
            </div>
          </div>

          {/* Description Block */}
          <div className="bg-white border rounded p-6 shadow-sm border-slate-200 space-y-4">
            <h3 className="font-display font-bold text-lg text-[#081B3A] uppercase tracking-wide">
              Property Overview & Highlights
            </h3>
            <div className="h-[1.5px] w-12 bg-[#C9A24B]"></div>
            <p className="text-slate-600 text-sm leading-relaxed font-sans text-justify">
              {property.description}
            </p>
          </div>

          {/* Amenities Grids */}
          <div className="bg-white border rounded p-6 shadow-sm border-slate-200">
            <h3 className="font-display font-bold text-lg text-[#081B3A] uppercase tracking-wide mb-4">
              Premium Infrastructure Amenities
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2">
              {property.amenities.map((am) => (
                <div key={am} className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="p-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 shrink-0">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span>{am}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive virtual tour canvas placeholder */}
          <div className="bg-gradient-to-r from-[#081B3A] to-[#142f56] text-white rounded p-6 border border-[#C9A24B]/35 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <span className="text-[9px] tracking-widest uppercase text-[#C9A24B] font-bold">VIRTUAL 3D IMMERSION</span>
              <h4 className="font-display text-lg font-light">Interactive Virtual Twin Preview</h4>
              <p className="text-xs text-slate-300 max-w-sm">Experience interactive spatial views of the entire estate building layout without traveling.</p>
            </div>
            <button
              onClick={() => alert("Simulating 3D Virtual Drone Immersion. In production, this mounts our Matterport SDK frame.")}
              className="px-6 py-2.5 bg-[#C9A24B] hover:bg-[#E5C07B] text-[#081B3A] font-display text-xs tracking-widest font-bold uppercase rounded cursor-pointer transition-transform duration-300"
            >
              LAUNCH CONCIERGE 3D TOUR
            </button>
          </div>

          {/* Floor Plans Download sector */}
          {property.floorPlanUrl && (
            <div className="bg-white border border-slate-200 p-6 rounded shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex gap-4 items-center">
                <div className="p-3 bg-[#081B3A]/5 text-[#C9A24B] rounded shrink-0">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-base text-[#081B3A]">Vector Floor Plans (PDF)</h4>
                  <p className="text-xs text-slate-400">Includes meticulous elevation measurements, ventilation maps, and structural dimensions.</p>
                </div>
              </div>
              <a
                href={property.floorPlanUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="px-6 py-2.5 bg-black/10 hover:bg-[#081B3A] hover:text-[#C9A24B] font-display text-xs tracking-widest font-bold uppercase rounded transition-all border border-[#081B3A]/20"
              >
                DOWNLOAD SPECIFICATIONS
              </a>
            </div>
          )}

          {/* Investment Analysis Section */}
          <div className="bg-white border rounded p-6 shadow-sm border-slate-200 space-y-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-[#C9A24B]" />
              <h3 className="font-display font-medium text-lg text-[#081B3A] tracking-tight">
                Advisory Portfolio Investment Analysis
              </h3>
            </div>
            <div className="h-[1.5px] w-12 bg-[#C9A24B] -mt-4"></div>
            
            <p className="text-xs text-slate-500 font-sans leading-relaxed">
              Our bespoke database projects steady risk-adjusted appreciation ratios for this high-density urban corridor, backed by municipal master plans and infrastructure investments.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
              <div className="p-4 rounded border border-slate-100 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-display">Est. Compounded Appreciation</span>
                  <p className="font-display text-lg font-bold text-[#081B3A] mt-0.5">8.9% - 11.2% <span className="text-[10px] text-slate-400 font-normal">/ yr</span></p>
                </div>
              </div>

              <div className="p-4 rounded border border-slate-100 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-display">Bespoke Net Rental Yield</span>
                  <p className="font-display text-lg font-bold text-emerald-600 mt-0.5">3.8% - 4.5% <span className="text-[10px] text-slate-400 font-normal">p.a.</span></p>
                </div>
              </div>

              <div className="p-4 rounded border border-slate-100 bg-slate-50 flex items-center justify-between col-span-1">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-display">Growth Corridor Tag</span>
                  <p className="text-xs font-semibold text-[#081B3A] mt-1 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-[#C9A24B]" /> High Hotspot Node
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50/50 p-3 rounded border border-amber-100 text-[11px] text-slate-600 font-sans leading-relaxed">
              <strong>Corridor Catalyst:</strong> Located less than 1.5 km from the upcoming peripheral ring expressway connector and grade-separated bypass transit junction.
            </div>
          </div>

          {/* Social Sharing Component */}
          <div className="bg-white border rounded p-6 shadow-sm border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <h4 className="font-display font-medium text-sm text-[#081B3A] uppercase tracking-wider flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-[#C9A24B]" /> Share This Masterpiece
                </h4>
                <p className="text-xs text-slate-400 font-sans">Distribute this luxury registry listing card with partners or counsel.</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => window.open(`https://api.whatsapp.com/send?text=Check out this stunning property: ${encodeURIComponent(window.location.href)}`)}
                  className="px-3.5 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-display text-[10px] tracking-widest font-bold uppercase transition-colors shrink-0 cursor-pointer"
                >
                  WhatsApp Share
                </button>
                <button
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`)}
                  className="px-3.5 py-2 rounded bg-blue-800 hover:bg-blue-900 text-white font-display text-[10px] tracking-widest font-bold uppercase transition-colors shrink-0 cursor-pointer"
                >
                  Facebook
                </button>
                <button
                  onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`)}
                  className="px-3.5 py-2 rounded bg-cyan-700 hover:bg-cyan-800 text-white font-display text-[10px] tracking-widest font-bold uppercase transition-colors shrink-0 cursor-pointer"
                >
                  LinkedIn
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Exclusive property profile permalink copied into clipboard!");
                  }}
                  className="px-3.5 py-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-display text-[10px] tracking-widest font-bold uppercase transition-colors shrink-0 cursor-pointer"
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>

          {/* Proximity landmarks */}
          <div className="bg-white border rounded p-6 shadow-sm border-slate-200">
            <h3 className="font-display font-bold text-lg text-[#081B3A] uppercase tracking-wide mb-4">
              Micro-Market Locational Proximity
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {property.nearbyPlaces.map((pl, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded border-slate-100 bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-full border shadow-sm shrink-0">
                      {getNearbyIcon(pl.type)}
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-[#081B3A]">{pl.name}</h5>
                      <span className="text-[10px] text-slate-400 uppercase font-bold font-display">{pl.type}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#C9A24B]">{pl.distance}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Luxury Google Maps Location Frame */}
          <div className="bg-white border rounded p-6 shadow-sm border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-display font-bold text-lg text-[#081B3A] uppercase tracking-wide">
                Interactive Site Map Location
              </h3>
              <span className="text-[10px] bg-[#C9A24B]/10 text-[#C9A24B] px-2.5 py-1 rounded font-display font-semibold uppercase">
                {property.location}
              </span>
            </div>
            <div className="h-80 w-full overflow-hidden rounded border border-slate-150">
              <iframe
                title={`Interactive map location for ${property.title}`}
                src={((loc: string) => {
                  const lLower = loc.toLowerCase();
                  if (lLower.includes("jubilee hills")) {
                    return "https://maps.google.com/maps?q=Jubilee%20Hills,%20Hyderabad&t=&z=15&ie=UTF8&iwloc=&output=embed";
                  }
                  if (lLower.includes("gachibowli") || lLower.includes("financial district")) {
                    return "https://maps.google.com/maps?q=Gachibowli%20Financial%20District,%20Hyderabad&t=&z=15&ie=UTF8&iwloc=&output=embed";
                  }
                  if (lLower.includes("hitech city")) {
                    return "https://maps.google.com/maps?q=Hitech%20City,%20Hyderabad&t=&z=15&ie=UTF8&iwloc=&output=embed";
                  }
                  if (lLower.includes("mokila")) {
                    return "https://maps.google.com/maps?q=Mokila,%20Hyderabad&t=&z=14&ie=UTF8&iwloc=&output=embed";
                  }
                  if (lLower.includes("medchal")) {
                    return "https://maps.google.com/maps?q=Medchal,%20Hyderabad&t=&z=14&ie=UTF8&iwloc=&output=embed";
                  }
                  return `https://maps.google.com/maps?q=${encodeURIComponent(loc)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
                })(property.location)}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Premium Mortgage & EMI Estimator Tool */}
          <div className="bg-white border rounded p-6 shadow-sm border-slate-200 space-y-6">
            <div className="space-y-1.5 border-b pb-4">
              <span className="text-[10px] uppercase font-bold text-[#C9A24B] tracking-[0.2em] font-display">Financial Planner</span>
              <h3 className="font-display font-bold text-lg text-[#081B3A] uppercase tracking-wide">
                Bespoke Mortgage & ROI Calculator
              </h3>
              <p className="text-xs text-slate-400">Calculate carrying costs, gross rents, and compounding investment ratios.</p>
            </div>

            {(() => {
              const totalCost = property.price;
              const dpAmount = Math.round((totalCost * downPaymentPercent) / 100);
              const principalAmount = totalCost - dpAmount;
              const ratePerMonth = interestRate / (12 * 100);
              const months = loanTerm * 12;

              let emiValue = 0;
              if (ratePerMonth > 0) {
                emiValue = Math.round(
                  principalAmount *
                    ratePerMonth *
                    (Math.pow(1 + ratePerMonth, months) /
                      (Math.pow(1 + ratePerMonth, months) - 1))
                );
              } else {
                emiValue = Math.round(principalAmount / months);
              }

              const totalPayableValue = emiValue * months;
              const totalInterestValue = totalPayableValue - principalAmount;

              const principalPercent = totalPayableValue > 0 ? Math.round((principalAmount / totalPayableValue) * 100) : 50;
              const interestPercent = 100 - principalPercent;

              // Expanded carrying costs & ROI parameters
              const annualPropertyTax = Math.round(totalCost * 0.008); // 0.8% tax p.a.
              const annualMaintenance = Math.round(totalCost * 0.0012); // 0.12% maintenance p.a.
              const annualInsurance = Math.round(totalCost * 0.0004); // 0.04% insurance p.a.

              const monthlyTax = Math.round(annualPropertyTax / 12);
              const monthlyMaintenance = Math.round(annualMaintenance / 12);
              const monthlyInsurance = Math.round(annualInsurance / 12);

              const totalMonthlyCarryingCost = emiValue + monthlyTax + monthlyMaintenance + monthlyInsurance;

              // Net ROI estimation
              const annualGrossRent = Math.round(totalCost * (property.type === "Commercial" ? 0.065 : 0.042)); // 6.5% commercial, 4.2% residential yield
              const monthlyRent = Math.round(annualGrossRent / 12);
              const netAnnualAdvisoryIncome = annualGrossRent - (annualPropertyTax + annualMaintenance + annualInsurance);
              const netROI = ((netAnnualAdvisoryIncome / totalCost) * 100).toFixed(2);

              return (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
                    {/* Sliders Form Controls */}
                    <div className="space-y-4 text-xs">
                      {/* Down Payment */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-medium">
                          <span className="text-slate-500 uppercase tracking-wider font-semibold text-[9px]">
                            Down Payment: {downPaymentPercent}%
                          </span>
                          <span className="font-mono text-[#081B3A] font-bold">
                            {formatPrice(dpAmount)}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="50"
                          step="5"
                          value={downPaymentPercent}
                          onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#C9A24B]"
                        />
                      </div>

                      {/* Interest Rate */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-medium">
                          <span className="text-slate-500 uppercase tracking-wider font-semibold text-[9px]">
                            Interest Rate: {interestRate}% APR
                          </span>
                        </div>
                        <input
                          type="range"
                          min="6"
                          max="14"
                          step="0.25"
                          value={interestRate}
                          onChange={(e) => setInterestRate(Number(e.target.value))}
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#C9A24B]"
                        />
                      </div>

                      {/* Amortization Term */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-medium">
                          <span className="text-slate-500 uppercase tracking-wider font-semibold text-[9px]">
                            Amortization Term: {loanTerm} Years
                          </span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="30"
                          step="5"
                          value={loanTerm}
                          onChange={(e) => setLoanTerm(Number(e.target.value))}
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#C9A24B]"
                        />
                      </div>
                    </div>

                    {/* Monthly Carrying Cost details */}
                    <div className="bg-slate-50 p-4 border rounded space-y-2 border-slate-200 text-xs">
                      <span className="text-[9px] uppercase tracking-widest font-semibold text-slate-400 font-display block border-b pb-1">
                        MONTHLY CARRYING COSTS
                      </span>
                      <div className="space-y-1.5 text-slate-500 font-sans">
                        <div className="flex justify-between"><span>Base Loan EMI:</span> <strong className="text-slate-700">{formatPrice(emiValue)}</strong></div>
                        <div className="flex justify-between"><span>Property Tax (0.8%):</span> <strong className="text-slate-700">{formatPrice(monthlyTax)}</strong></div>
                        <div className="flex justify-between"><span>Maintenance (0.12%):</span> <strong className="text-slate-700">{formatPrice(monthlyMaintenance)}</strong></div>
                        <div className="flex justify-between"><span>Insurance (0.04%):</span> <strong className="text-slate-700">{formatPrice(monthlyInsurance)}</strong></div>
                        <div className="flex justify-between border-t pt-1.5 text-[#081B3A] font-bold">
                          <span>Total Monthly carry:</span>
                          <span className="font-mono">{formatPrice(totalMonthlyCarryingCost)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Net ROI analysis box */}
                    <div className="bg-[#081B3A] text-white p-4 rounded border border-[#C9A24B]/35 flex flex-col justify-between text-xs">
                      <div className="space-y-2">
                        <span className="text-[9px] uppercase tracking-widest font-semibold text-[#C9A24B] font-display block border-b border-white/5 pb-1">
                          PORTFOLIO ADVISORY ROI
                        </span>
                        <div className="space-y-1.5 text-slate-300">
                          <div className="flex justify-between"><span>Est. Rent Yield:</span> <strong>{formatPrice(monthlyRent)}/mo</strong></div>
                          <div className="flex justify-between"><span>Annual Carry Fee:</span> <strong>{formatPrice(annualPropertyTax + annualMaintenance + annualInsurance)}</strong></div>
                        </div>
                      </div>
                      
                      <div className="border-t border-white/5 pt-2.5 mt-4 text-center">
                        <span className="text-[9px] uppercase tracking-widest text-[#E5C07B] block font-display">Net Annualized Return</span>
                        <p className="text-2xl font-bold font-display text-[#C9A24B] mt-0.5">{netROI}% <span className="text-xs font-sans text-slate-300 font-medium">p.a.</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Split Progress bar showing loan ratio */}
                  <div className="space-y-2">
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                      <div
                        style={{ width: `${principalPercent}%` }}
                        className="bg-[#081B3A]"
                        title="Principal Debt"
                      ></div>
                      <div
                        style={{ width: `${interestPercent}%` }}
                        className="bg-[#C9A24B]"
                        title="Total Interest Cost"
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-sans text-slate-400 tracking-wider">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[#081B3A]"></span>
                        <span>
                          Principal: {formatPrice(principalAmount)} ({principalPercent}%)
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[#C9A24B]"></span>
                        <span>
                          Interest: {formatPrice(totalInterestValue)} ({interestPercent}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* RIGHT COLUMN: LEAD SUBMISSION AND SITE VISIT APPOINTMENT BOOKING */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Main lead catalog forms */}
          <div className="bg-white border text-slate-800 border-slate-200 rounded p-6 shadow-sm sticky top-24 space-y-6">
            
            <div className="border-b pb-4 space-y-1">
              <h3 className="font-display font-bold text-base tracking-wide text-[#081B3A] uppercase">
                VIP Portfolio Inquiry
              </h3>
              <p className="text-xs text-slate-400">Directly contact our certified acquisitions counselors.</p>
            </div>

            {/* General Lead Form */}
            {!inquirySent ? (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <input
                  type="text"
                  required
                  placeholder="Full Legal Name"
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border rounded text-xs bg-slate-50 outline-none focus:bg-white focus:ring-1 focus:ring-[#C9A24B] focus:border-[#C9A24B]"
                />
                <input
                  type="tel"
                  required
                  placeholder="Call Phone Number"
                  value={inquiryPhone}
                  onChange={(e) => setInquiryPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 border rounded text-xs bg-slate-50 outline-none focus:bg-white focus:ring-1 focus:ring-[#C9A24B] focus:border-[#C9A24B]"
                />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 border rounded text-xs bg-slate-50 outline-none focus:bg-white focus:ring-1 focus:ring-[#C9A24B] focus:border-[#C9A24B]"
                />
                <textarea
                  rows={3}
                  placeholder={`Hi, I'm interested in viewing "${property.title}"...`}
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  className="w-full p-3 border rounded text-xs bg-slate-50 outline-none focus:bg-white focus:ring-1 focus:ring-[#C9A24B] focus:border-[#C9A24B]"
                ></textarea>

                <button
                  id="property-detail-lead-submit-btn"
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#081B3A] text-[#C9A24B] hover:text-white font-display text-[10px] tracking-widest font-bold uppercase rounded cursor-pointer hover:shadow-md transition-all active:scale-95"
                >
                  <Send className="h-3.5 w-3.5" /> TRANSMIT CONCIERGE INTEREST
                </button>
              </form>
            ) : (
              <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs text-center space-y-1">
                <p className="font-bold">Inquiry Transmitted Successfully</p>
                <p className="text-slate-500 font-sans">Our manager Vikram has received your lead card.</p>
              </div>
            )}

            {/* Scheduled physical site visit segment with Date Picker */}
            <div className="border-t pt-5 space-y-4">
              <div>
                <h4 className="font-display font-bold text-xs tracking-widest text-[#081B3A] uppercase">Schedule ESCORTED site visit</h4>
                <p className="text-[10px] text-slate-400">Lock in your physical surveying time.</p>
              </div>

              {!visitBooked ? (
                <form onSubmit={handleVisitSubmit} className="space-y-3 font-sans">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-bold text-slate-400 font-display">Target Date</span>
                      <div className="relative">
                        <input
                          type="date"
                          required
                          value={visitDate}
                          onChange={(e) => setVisitDate(e.target.value)}
                          className="w-full px-2 py-2 border rounded text-xs bg-slate-50 focus:bg-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-bold text-slate-400 font-display">Target Time</span>
                      <select
                        required
                        value={visitTime}
                        onChange={(e) => setVisitTime(e.target.value)}
                        className="w-full px-2 py-2 border rounded text-xs bg-slate-50 focus:bg-white outline-none"
                      >
                        <option value="">Select hour</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:30 AM">11:30 AM</option>
                        <option value="02:00 PM">02:00 PM</option>
                        <option value="04:30 PM">04:30 PM</option>
                      </select>
                    </div>
                  </div>

                  <button
                    id="property-detail-site-visit-btn"
                    type="submit"
                    className="w-full py-3 bg-[#C9A24B] hover:bg-[#E5C07B] text-[#081B3A] font-display text-[10px] tracking-widest font-bold uppercase rounded cursor-pointer transition-transform active:scale-95 shadow"
                  >
                    CONFIRM RESERVATION TIME
                  </button>
                </form>
              ) : (
                <div className="p-4 bg-blue-50 text-blue-800 border border-blue-200 rounded text-xs text-center space-y-1">
                  <p className="font-bold">Survey Reservation Approved</p>
                  <p className="text-slate-500">Your site visit appointment is catalogued inside the admin backoffice.</p>
                </div>
              )}
            </div>

            {/* Quick Actions Footer */}
            <div className="border-t pt-4 grid grid-cols-2 gap-3 text-center">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-display text-[9px] font-bold tracking-widest uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageSquare className="h-3.5 w-3.5" /> WHATSAPP
              </a>
              <a
                href="tel:+919876543210"
                className="py-2 rounded bg-[#081B3A] text-white border border-[#C9A24B]/30 font-display text-[9px] font-bold tracking-widest uppercase flex items-center justify-center gap-1.5 transition-colors hover:bg-slate-900 cursor-pointer"
              >
                <Phone className="h-3.5 w-3.5 text-[#C9A24B]" /> CALL NOW
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Properties Showcase */}
      {similarProps.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 border-t border-slate-200 pt-16">
          <div className="space-y-2 mb-10 text-center md:text-left">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#C9A24B] font-bold font-display">
              Curated Alternatives
            </span>
            <h3 className="font-display text-2xl font-light text-[#081B3A]">
              Similar Exclusive Estates
            </h3>
            <p className="text-xs text-slate-400">Hand-selected luxury properties matches of matching classification.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {similarProps.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  navigate(`/properties?id=${p.id}`);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="bg-white border border-slate-200 rounded overflow-hidden shadow-sm hover:shadow-lg hover:border-[#C9A24B]/40 group cursor-pointer transition-all duration-300 flex flex-col h-full"
              >
                {/* Image Stage */}
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 bg-[#081B3A] text-white text-[9px] font-bold font-display uppercase tracking-widest rounded border border-[#C9A24B]/30">
                    {p.status}
                  </div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-white/95 text-[#081B3A] text-xs font-bold font-mono rounded shadow">
                    {formatPrice(p.price)}
                  </div>
                </div>

                {/* Info block */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold font-display text-[#C9A24B] uppercase tracking-wider">
                      {p.category} • {p.location}
                    </span>
                    <h4 className="font-display font-medium text-sm text-[#081B3A] tracking-tight group-hover:text-[#C9A24B] transition-colors line-clamp-1">
                      {p.title}
                    </h4>
                  </div>

                  <div className="flex justify-between items-center text-slate-500 text-xs font-display pt-3 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <BedDouble className="h-3.5 w-3.5 text-[#C9A24B]" /> {p.bedrooms} BHK
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="h-3.5 w-3.5 text-[#C9A24B]" /> {p.bathrooms} Baths
                    </span>
                    <span className="flex items-center gap-1">
                      <Maximize2 className="h-3.5 w-3.5 text-[#C9A24B]" /> {p.area} Sq Ft
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Immersive Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 select-none">
          {/* Top Bar controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white text-xs z-10 font-display">
            <span className="tracking-widest font-light font-sans">
              {property.title} — IMAGE {lightboxIndex + 1} OF {property.images.length}
            </span>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="px-4 py-2 hover:bg-white/10 rounded border border-white/20 uppercase tracking-widest text-xs font-bold cursor-pointer transition-all"
            >
              Close ✕
            </button>
          </div>

          {/* Main big image */}
          <div className="relative max-w-5xl w-full aspect-video flex items-center justify-center">
            {/* Left Button */}
            <button
              onClick={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : property.images.length - 1))}
              className="absolute left-4 z-20 h-10 w-10 text-white hover:text-[#C9A24B] bg-black/50 border border-white/20 select-none cursor-pointer flex items-center justify-center rounded-full text-base"
            >
              ◀
            </button>

            <img
              src={property.images[lightboxIndex]}
              alt={`Lightbox ${lightboxIndex + 1}`}
              className="max-h-[80vh] max-w-full object-contain rounded shadow-2xl transition-all duration-300"
            />

            {/* Right Button */}
            <button
              onClick={() => setLightboxIndex((prev) => (prev < property.images.length - 1 ? prev + 1 : 0))}
              className="absolute right-4 z-20 h-10 w-10 text-white hover:text-[#C9A24B] bg-black/50 border border-white/20 select-none cursor-pointer flex items-center justify-center rounded-full text-base"
            >
              ▶
            </button>
          </div>

          {/* Thumbnail preview strips at bottom */}
          <div className="absolute bottom-6 flex gap-2 overflow-x-auto max-w-xl p-2 bg-white/5 rounded-lg border border-white/10 scrollbar-thin">
            {property.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setLightboxIndex(idx)}
                className={`h-11 w-16 rounded overflow-hidden border transition-all shrink-0 ${
                  lightboxIndex === idx ? "border-[#C9A24B] scale-105" : "border-transparent opacity-50 hover:opacity-85"
                }`}
              >
                <img src={img} alt="Strip" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Sticky Bottom Mobile CTA bar with WhatsApp, Call, and Schedule Visit triggers */}
      <div className="md:hidden fixed bottom-1.5 left-1.5 right-1.5 z-40 bg-[#081B3A]/95 text-white border border-[#C9A24B]/35 p-3 rounded-lg flex items-center justify-between gap-3 shadow-2xl backdrop-blur-md animate-bounce-short">
        <div>
          <p className="text-[9px] uppercase tracking-widest text-[#C9A24B] font-display font-bold">Inscribed Valuation</p>
          <span className="text-xs font-semibold font-sans">{formatPrice(property.price)}</span>
        </div>
        <div className="flex gap-2 font-display">
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] uppercase font-bold flex items-center justify-center cursor-pointer"
            title="WhatsApp Counselor"
          >
            <MessageSquare className="h-4 w-4" />
          </a>
          <a
            href="tel:+919876543210"
            className="p-2.5 rounded bg-black/30 border border-[#C9A24B]/35 text-[#C9A24B] text-[10px] uppercase font-bold flex items-center justify-center cursor-pointer"
            title="Call Adviser"
          >
            <Phone className="h-4 w-4" />
          </a>
          <button
            onClick={() => {
              const element = document.getElementById("property-detail-site-visit-btn");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              } else {
                window.scrollTo({ top: document.body.scrollHeight / 1.5, behavior: "smooth" });
              }
            }}
            className="px-3.5 py-2.5 rounded bg-[#C9A24B] text-[#081B3A] text-[9px] font-bold tracking-widest uppercase flex items-center justify-center cursor-pointer transition-transform active:scale-95 shadow"
          >
            BOOK VIEWING
          </button>
        </div>
      </div>
    </div>
  );
}
