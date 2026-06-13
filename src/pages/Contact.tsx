import React, { useState, JSX } from "react";
import { Phone, Mail, MapPin, Send, MessageSquare, Clock, Landmark, Gift } from "lucide-react";

export default function Contact(): JSX.Element {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccess(false);

    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        source: "Web Inquiry"
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error("Inquiry transit failed.");
        return res.json();
      })
      .then(() => {
        setSuccess(true);
        setFormData({ name: "", email: "", phone: "", message: "" });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setErrorMsg("Failed to transfer details. Please ensure phone/email are correct.");
        setLoading(false);
      });
  };

  return (
    <div className="pt-24 min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Page Title */}
      <div className="bg-[#081B3A] text-white py-16 text-center border-b border-[#C9A24B]/30 mb-12">
        <div className="max-w-4xl mx-auto px-4 space-y-3">
          <p className="font-display text-xs tracking-[0.4em] text-[#C9A24B] uppercase font-bold">
            ACQUISITIONS & COUNSEL
          </p>
          <h1 className="font-display font-medium text-3xl md:text-5xl tracking-tight text-slate-100">
            Connect With VM Properties
          </h1>
          <div className="h-[2px] w-24 bg-[#C9A24B] mx-auto mt-4"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        
        {/* Contact info panel */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold tracking-tight text-[#081B3A]">
              Advisory Headquarters
            </h2>
            <div className="h-[1.5px] w-12 bg-[#C9A24B]"></div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Arrange a private zoom catalog tour, or request an escorted physical site surveyor convoy. Our team coordinates completely structured transfers for credentialed buyers.
            </p>
          </div>

          <div className="space-y-5 bg-white p-6 border border-slate-200 shadow-sm rounded">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#081B3A]/5 text-[#C9A24B] rounded-full shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-display font-semibold text-xs tracking-wider uppercase text-slate-400">Head Office Location</h4>
                <p className="text-sm text-[#081B3A] font-medium font-sans mt-0.5">
                  Tower II, Level 12, Financial District, Gachibowli, Hyderabad, Telangana 500032
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#081B3A]/5 text-[#C9A24B] rounded-full shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-display font-semibold text-xs tracking-wider uppercase text-slate-400">Click to Call Hotline</h4>
                <a href="tel:+919876543210" className="text-sm text-[#081B3A] font-bold mt-0.5 hover:text-[#C9A24B] block transition-colors">
                  +91 98765 43210
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#081B3A]/5 text-[#C9A24B] rounded-full shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-display font-semibold text-xs tracking-wider uppercase text-slate-400">Official Electronic Inbound</h4>
                <a href="mailto:concierge@vmproperties.com" className="text-sm text-[#081B3A] font-bold mt-0.5 hover:text-[#C9A24B] block transition-colors">
                  concierge@vmproperties.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#081B3A]/5 text-[#C9A24B] rounded-full shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-display font-semibold text-xs tracking-wider uppercase text-slate-400">Advisory Timings</h4>
                <p className="text-sm text-[#081B3A] font-medium font-sans mt-0.5">
                  Mon - Sat: 09:00 AM - 07:00 PM IST (GMT+5:30)
                </p>
              </div>
            </div>
          </div>

          {/* Special legal markers card */}
          <div className="p-6 bg-gradient-to-r from-[#081B3A] to-[#122e58] text-white rounded border border-[#C9A24B]/30 space-y-4">
            <h3 className="font-display text-[#C9A24B] text-sm font-bold tracking-widest uppercase flex items-center gap-2">
              <Landmark className="h-4 w-4" /> COMPLIANCE REGISTRATION
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              VM PROPERTIES holds sovereign registration tags under national RERA standards. Every lead transaction is fully backed by escrow protection standards.
            </p>
            <div className="text-[10px] text-[#E5C07B] tracking-wider font-mono font-bold">
              REGISTRATION ID: RERA-AP-HYD-C122
            </div>
          </div>
        </div>

        {/* Dynamic Submission Inbound Form */}
        <div className="lg:col-span-7 bg-white border border-slate-200 p-8 rounded shadow-sm">
          <div className="space-y-2 mb-6">
            <h3 className="font-display text-xl font-bold text-[#081B3A] uppercase tracking-wide">
              Submit Private Portfolio Inquiry
            </h3>
            <p className="text-xs text-slate-400">
              Provide your details below. A designated luxury desk manager will response within 60 minutes.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-display tracking-wider uppercase font-semibold text-slate-500">Full Legal Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Madhavan Srinivasan"
                  className="w-full px-4 py-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#C9A24B] focus:border-[#C9A24B] outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-display tracking-wider uppercase font-semibold text-slate-500">Secure Call Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="e.g. +91 97654 32110"
                  className="w-full px-4 py-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#C9A24B] focus:border-[#C9A24B] outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-display tracking-wider uppercase font-semibold text-slate-500">Business Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="e.g. sri@siliconvalley.io"
                className="w-full px-4 py-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#C9A24B] focus:border-[#C9A24B] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-display tracking-wider uppercase font-semibold text-slate-500 font-sans">Aesthetic Requirements / Asset Notes</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Detail preferred location matching, structural layouts, and investment thresholds..."
                className="w-full px-4 py-3 border border-slate-200 rounded text-sm bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#C9A24B] focus:border-[#C9A24B] outline-none"
              ></textarea>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-500 font-bold bg-rose-50 p-3 rounded">
                {errorMsg}
              </p>
            )}

            {success && (
              <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded space-y-1">
                <p className="font-bold text-sm">Thank You for Connecting</p>
                <p className="text-xs">Your core advisory lead card has been created in our database. We will make immediate contact shortly.</p>
              </div>
            )}

            <button
              id="submit-contact-inquiry-btn"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#C9A24B] hover:bg-[#E5C07B] text-[#081B3A] font-display text-xs tracking-widest font-bold uppercase rounded shadow-lg transition-all duration-300 cursor-pointer disabled:opacity-50 hover:-translate-y-0.5"
            >
              <Send className="h-4 w-4" /> {loading ? "PROCESSING..." : "TRANSMIT INQUIRY TO VIP TEAM"}
            </button>
          </form>
        </div>
      </div>

      {/* Structured Google Maps Container Simulator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center mb-8 space-y-2">
          <h3 className="font-display text-xl font-bold text-[#081B3A]">Interactive Proximity Coordinates</h3>
          <p className="text-xs text-slate-400">Simulating interactive Google Map interface centered on Gachibowli headquarters corridor RERA ID C122</p>
        </div>

        <div className="bg-[#081B3A] text-white rounded overflow-hidden border border-[#C9A24B]/30 relative aspect-video max-h-[450px]">
          {/* Interactive Map Visual Elements */}
          <div className="absolute inset-0 bg-slate-900 overflow-hidden flex items-center justify-center">
            {/* Grid Coordinates Background representation */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(201,162,75,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(201,162,75,0.06)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            
            {/* Pulsing HQ Pin */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="absolute -top-14 bg-white text-[#081B3A] p-2.5 rounded shadow-lg border border-[#C9A24B] text-[10px] whitespace-nowrap uppercase tracking-wider font-bold">
                VM Headquarters (Financial Dist.)
              </div>
              <div className="h-6 w-6 rounded-full bg-[#C9A24B] flex items-center justify-center text-white font-bold text-xs ring-4 ring-[#C9A24B]/40 animate-ping"></div>
              <div className="h-4 w-4 rounded-full bg-[#C9A24B] absolute"></div>
            </div>
          </div>

          {/* Sidebar Overlay */}
          <div className="absolute top-4 left-4 z-20 max-w-sm bg-[#081B3A]/95 text-white p-6 border border-[#C9A24B]/20 backdrop-blur-md rounded shadow-2xl hidden md:block">
            <h4 className="font-display font-bold text-xs tracking-widest text-[#C9A24B] uppercase">LOCATION OVERVIEWS</h4>
            <div className="h-[1px] w-8 bg-[#C9A24B] mt-1 mb-4"></div>
            <ul className="space-y-3.5 text-xs">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C9A24B]"></span>
                <span>Jubilee Hills Luxury Enclave — 12 mins</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C9A24B]"></span>
                <span>Hyderabad International Airport — 25 mins</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C9A24B]"></span>
                <span>Raidurg Metro Interchange — 5 mins</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C9A24B]"></span>
                <span>Oakridge & Indus Academies — 15 mins</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
