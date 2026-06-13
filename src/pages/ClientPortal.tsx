import React, { useState, useEffect, JSX } from "react";
import { Property, Appointment, User } from "../types";
import { Link, useRouter } from "../components/Router";
import {
  Heart, Save, Calendar, User as UserIcon, LogOut, ArrowRight,
  TrendingUp, Compass, MessageSquare, Phone, Lock, Edit2, CheckCircle2, ShieldCheck, Mail
} from "lucide-react";

interface ClientPortalProps {
  user: User;
  onLogout: () => void;
  onUpdateProfile: (updatedUser: User) => void;
}

export default function ClientPortal({ user, onLogout, onUpdateProfile }: ClientPortalProps): JSX.Element {
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState<"dashboard" | "wishlist" | "searches" | "visits" | "profile">("dashboard");
  
  // Dashboard & listings state
  const [properties, setProperties] = useState<Property[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile forms
  const [profileName, setProfileName] = useState(user.name);
  const [profilePhone, setProfilePhone] = useState(user.phone || "");
  const [profileMsg, setProfileMsg] = useState("");
  const [profileError, setProfileError] = useState("");

  // Forgot password simulator states
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState(user.email);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/properties").then(res => res.json()),
      fetch("/api/appointments/list").then(res => res.json())
    ]).then(([props, appts]) => {
      setProperties(props);
      // Filter appointments associated to this user email
      const matchedAppts = appts.filter((a: Appointment) => a.email.toLowerCase() === user.email.toLowerCase());
      setAppointments(matchedAppts);
      setLoading(false);
    }).catch(err => {
      console.error("Failed to load client portal statistics", err);
      setLoading(false);
    });
  }, [user.email]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg("");
    setProfileError("");

    fetch("/api/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, name: profileName, phone: profilePhone })
    })
      .then(res => {
        if (!res.ok) throw new Error("Profile update failed");
        return res.json();
      })
      .then((data) => {
        setProfileMsg("Corporate profile records synchronized successfully.");
        onUpdateProfile(data.user);
      })
      .catch(err => {
        console.error(err);
        setProfileError("Could not update profile coordinates. Try again.");
      });
  };

  const handleTriggerReset = (e: React.FormEvent) => {
    e.preventDefault();
    setResetSent(true);
    setTimeout(() => {
      setResetSent(false);
      setShowResetForm(false);
      alert("Simulated Secure password recovery key dispatched. Verify your private email inbox.");
    }, 1500);
  };

  // Format currency in INR Crores/Lakhs
  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    return `₹${(price / 100000).toFixed(1)} L`;
  };

  // Filter wishlist properties
  const wishlistProperties = properties.filter(p => user.wishlist?.includes(p.id));

  return (
    <div className="pt-24 min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 bg-[#081B3A] text-white shrink-0 border-r border-[#C9A24B]/30 flex flex-col justify-between">
        <div className="p-6 space-y-8">
          <div className="space-y-1.5 border-b border-white/10 pb-4">
            <span className="text-[10px] tracking-[0.25em] text-[#C9A24B] uppercase font-bold font-display">Client Console</span>
            <h2 className="font-display font-medium text-lg text-slate-100 truncate">{user.name}</h2>
            <div className="text-[10px] font-mono text-slate-400 select-all">{user.email}</div>
          </div>

          <div className="flex flex-col gap-1.5 font-display text-xs tracking-wider uppercase font-bold">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full text-left px-4 py-3 rounded transition-all flex items-center gap-3 cursor-pointer ${activeTab === "dashboard" ? "bg-[#C9A24B] text-[#081B3A] font-bold" : "hover:bg-white/5 text-slate-300"}`}
            >
              <Compass className="h-4 w-4" /> Console Summary
            </button>
            <button
              onClick={() => setActiveTab("wishlist")}
              className={`w-full text-left px-4 py-3 rounded transition-all flex items-center gap-3 cursor-pointer ${activeTab === "wishlist" ? "bg-[#C9A24B] text-[#081B3A] font-bold" : "hover:bg-white/5 text-slate-300"}`}
            >
              <Heart className="h-4 w-4" /> Saved Estates ({user.wishlist?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("searches")}
              className={`w-full text-left px-4 py-3 rounded transition-all flex items-center gap-3 cursor-pointer ${activeTab === "searches" ? "bg-[#C9A24B] text-[#081B3A] font-bold" : "hover:bg-white/5 text-slate-300"}`}
            >
              <Save className="h-4 w-4" /> Saved Searches ({user.savedSearches?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("visits")}
              className={`w-full text-left px-4 py-3 rounded transition-all flex items-center gap-3 cursor-pointer ${activeTab === "visits" ? "bg-[#C9A24B] text-[#081B3A] font-bold" : "hover:bg-white/5 text-slate-300"}`}
            >
              <Calendar className="h-4 w-4" /> Site Convoy Tours ({appointments.length})
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full text-left px-4 py-3 rounded transition-all flex items-center gap-3 cursor-pointer ${activeTab === "profile" ? "bg-[#C9A24B] text-[#081B3A] font-bold" : "hover:bg-white/5 text-slate-300"}`}
            >
              <UserIcon className="h-4 w-4" /> Portal Settings
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-white/5">
          <button
            onClick={onLogout}
            className="w-full py-2.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-display text-xs tracking-widest font-bold uppercase transition flex items-center justify-center gap-2 cursor-pointer shadow"
          >
            <LogOut className="h-4 w-4" /> Disconnect
          </button>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 p-6 sm:p-8 max-w-5xl">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#C9A24B]"></div>
          </div>
        ) : (
          <div>
            {/* TAB: DASHBOARD */}
            {activeTab === "dashboard" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-white border border-slate-200 p-6 rounded shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-[#C9A24B] font-bold font-display">Sovereign Portal active</span>
                    <h2 className="font-display font-light text-2xl text-[#081B3A]">Welcome back, {user.name}</h2>
                    <p className="text-xs text-slate-500 font-sans">Manage your unlisted catalog walk-throughs and site convoy reservations.</p>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5 shrink-0">
                    <ShieldCheck className="h-4 w-4" /> Credentials Verified Client
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-display">
                  <div className="bg-white border p-5 rounded shadow-sm flex items-center gap-4">
                    <div className="p-3.5 bg-rose-50 text-rose-500 rounded">
                      <Heart className="h-6 w-6 fill-current" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Wishlist Assets</p>
                      <p className="text-xl font-bold mt-0.5">{user.wishlist?.length || 0}</p>
                    </div>
                  </div>

                  <div className="bg-white border p-5 rounded shadow-sm flex items-center gap-4">
                    <div className="p-3.5 bg-blue-50 text-blue-500 rounded">
                      <Save className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Searches Preserved</p>
                      <p className="text-xl font-bold mt-0.5">{user.savedSearches?.length || 0}</p>
                    </div>
                  </div>

                  <div className="bg-white border p-5 rounded shadow-sm flex items-center gap-4">
                    <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Convoy Tours</p>
                      <p className="text-xl font-bold mt-0.5">{appointments.length}</p>
                    </div>
                  </div>
                </div>

                {/* Site visits dashboard card */}
                <div className="bg-white border rounded p-6 shadow-sm space-y-4">
                  <h3 className="font-display font-semibold text-sm tracking-wider uppercase text-[#081B3A] border-b pb-2">
                    Active Tour Convoy Schedule
                  </h3>
                  {appointments.length > 0 ? (
                    <div className="divide-y text-xs font-sans text-slate-600">
                      {appointments.slice(0, 3).map((appt) => (
                        <div key={appt.id} className="py-3 flex justify-between items-center gap-4">
                          <div className="space-y-1">
                            <p className="font-bold text-[#081B3A] text-sm">{appt.propertyName}</p>
                            <p className="text-slate-400">{appt.date} at {appt.time}</p>
                          </div>
                          <span className="p-1 px-2.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold uppercase tracking-wider text-[9px]">
                            {appt.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-400 text-xs">
                      No physical site convoy schedules logged. Explore listings to request a tour.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: WISHLIST */}
            {activeTab === "wishlist" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <h3 className="font-display font-semibold text-base tracking-wider uppercase text-[#081B3A] border-b pb-3">
                  Saved Portfolio Estates
                </h3>
                {wishlistProperties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {wishlistProperties.map((p) => (
                      <div key={p.id} className="bg-white border rounded shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div className="aspect-video relative overflow-hidden bg-slate-900">
                          <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                          <span className="absolute top-3 left-3 bg-[#081B3A] border border-[#C9A24B]/30 text-white text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded font-display font-bold">
                            {p.status}
                          </span>
                          <span className="absolute bottom-3 right-3 bg-[#C9A24B] text-[#081B3A] text-xs font-mono font-bold px-2 py-0.5 rounded">
                            {formatPrice(p.price)}
                          </span>
                        </div>
                        <div className="p-5 space-y-4">
                          <div>
                            <span className="text-[9px] font-display font-bold uppercase text-[#C9A24B] tracking-wider">{p.category} • {p.location}</span>
                            <h4 className="font-display font-bold text-[#081B3A] text-sm mt-0.5 truncate">{p.title}</h4>
                          </div>
                          <button
                            onClick={() => navigate(`/property/${p.id}`)}
                            className="w-full py-2 bg-[#081B3A] text-white hover:bg-slate-900 border border-[#C9A24B]/10 hover:border-[#C9A24B] font-display text-[9px] tracking-widest font-bold uppercase rounded transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            Explore Architecture <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white border rounded shadow-sm text-slate-400 space-y-4">
                    <p className="text-sm">Your unlisted properties wishlist portfolio is currently empty.</p>
                    <button
                      onClick={() => navigate("/properties")}
                      className="px-6 py-2.5 bg-[#081B3A] text-[#C9A24B] font-display text-xs tracking-widest font-bold uppercase rounded"
                    >
                      BROWSE LISTINGS
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB: SAVED SEARCHES */}
            {activeTab === "searches" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <h3 className="font-display font-semibold text-base tracking-wider uppercase text-[#081B3A] border-b pb-3">
                  Preserved Search Filters
                </h3>
                {user.savedSearches && user.savedSearches.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {user.savedSearches.map((s) => (
                      <div key={s.id} className="bg-white border rounded p-5 shadow-sm space-y-4 hover:border-[#C9A24B]/40 transition-colors">
                        <div className="space-y-1">
                          <p className="text-[10px] text-slate-400 font-mono">Date Saved: {s.date}</p>
                          <h4 className="font-display font-bold text-sm text-[#081B3A] leading-tight line-clamp-1">{s.query}</h4>
                        </div>
                        <button
                          onClick={() => {
                            // Set criteria to sessionStorage and run search redirection
                            Object.entries(s.filters).forEach(([k, v]) => {
                              sessionStorage.setItem(`home_search_${k.replace("Filter", "").replace("Query", "query").replace("maxPrice", "budget")}`, String(v));
                            });
                            navigate("/properties");
                          }}
                          className="w-full py-2 bg-slate-100 hover:bg-[#081B3A]/5 text-[#081B3A] font-display text-[9px] tracking-widest font-bold uppercase rounded border border-slate-200 cursor-pointer text-center"
                        >
                          RUN PRESERVED SEARCH
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white border rounded shadow-sm text-slate-400">
                    <p className="text-sm">No search filter configurations preserved in client settings.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB: SITE VISITS */}
            {activeTab === "visits" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <h3 className="font-display font-semibold text-base tracking-wider uppercase text-[#081B3A] border-b pb-3">
                  Physical Site Escorted Survey Tours
                </h3>
                {appointments.length > 0 ? (
                  <div className="bg-white border rounded shadow-sm overflow-hidden font-sans">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b text-slate-400 font-display font-bold uppercase tracking-wider">
                            <th className="p-4">Convoy Target Property</th>
                            <th className="p-4">Schedule Date & Time</th>
                            <th className="p-4">Representative Captain</th>
                            <th className="p-4 text-right">Escort Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y text-slate-600">
                          {appointments.map((a) => (
                            <tr key={a.id} className="hover:bg-slate-50/50">
                              <td className="p-4 font-semibold text-[#081B3A]">{a.propertyName}</td>
                              <td className="p-4">{a.date} at {a.time}</td>
                              <td className="p-4">Agent Vikram (Escort Group)</td>
                              <td className="p-4 text-right">
                                <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px] ${
                                  a.status === "Scheduled" ? "bg-blue-100 text-blue-700 border border-blue-200/30" :
                                  a.status === "Completed" ? "bg-emerald-100 text-emerald-700" :
                                  "bg-rose-100 text-rose-700"
                                }`}>{a.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white border rounded shadow-sm text-slate-400">
                    <p className="text-sm">No tour convoy schedule entries catalogued.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB: PROFILE */}
            {activeTab === "profile" && (
              <div className="bg-white border rounded p-6 shadow-sm max-w-xl space-y-6 animate-in fade-in duration-200 font-sans">
                <div className="border-b pb-3">
                  <h3 className="font-display font-semibold text-base tracking-wider uppercase text-[#081B3A]">
                    Portal Settings & Security
                  </h3>
                  <p className="text-xs text-slate-400">Configure your unlisted registry accounts metadata.</p>
                </div>

                {profileMsg && <p className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs text-center font-semibold">{profileMsg}</p>}
                {profileError && <p className="p-3 bg-rose-50 text-rose-500 rounded text-xs text-center font-bold">{profileError}</p>}

                <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs font-sans">
                  <div className="space-y-1.5">
                    <label className="font-display uppercase font-bold text-slate-400">Account Email (Static Identifier)</label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full px-3 py-2 border rounded bg-slate-50 text-slate-400 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-display uppercase font-bold text-slate-400">Full Legal Name</label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-3 py-2 border rounded bg-slate-50 focus:bg-white outline-none focus:ring-1 focus:ring-[#C9A24B]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-display uppercase font-bold text-slate-400">Secure Contact Number</label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full px-3 py-2 border rounded bg-slate-50 focus:bg-white outline-none focus:ring-1 focus:ring-[#C9A24B]"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setShowResetForm(true)}
                      className="text-[#C9A24B] hover:text-[#E5C07B] hover:underline font-bold uppercase tracking-wider font-display text-[10px] flex items-center gap-1 cursor-pointer"
                    >
                      <Lock className="h-3.5 w-3.5" /> Modify Passphrase
                    </button>
                    
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded bg-[#081B3A] text-white hover:text-[#C9A24B] border border-[#C9A24B]/30 hover:border-[#C9A24B] font-display text-[10px] tracking-widest font-bold uppercase cursor-pointer transition shadow"
                    >
                      SYNCHRONIZE SETTINGS
                    </button>
                  </div>
                </form>

                {/* Password reset modal overlay inside profile settings */}
                {showResetForm && (
                  <div className="fixed inset-0 z-50 bg-[#081B3A]/85 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white border p-6 rounded shadow-2xl max-w-sm w-full space-y-4">
                      <div className="border-b pb-2 flex justify-between items-center text-[#081B3A]">
                        <h4 className="font-display font-bold text-xs tracking-wider uppercase">RESET SECURE PASSPHRASE</h4>
                        <button onClick={() => setShowResetForm(false)} className="text-slate-400 hover:text-rose-500 font-bold">✕</button>
                      </div>
                      
                      <p className="text-xs text-slate-400 leading-relaxed font-sans">Enter your validated electronic email below. We will dispatch a customized recovery passphrase key instantly.</p>

                      <form onSubmit={handleTriggerReset} className="space-y-4 text-xs font-sans">
                        <div className="space-y-1">
                          <input
                            type="email"
                            required
                            placeholder="concierge@email.com"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded bg-slate-50 focus:bg-white outline-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={resetSent}
                          className="w-full py-2.5 bg-[#081B3A] text-[#C9A24B] hover:text-white border border-[#C9A24B]/30 text-[10px] tracking-widest font-display font-bold uppercase rounded cursor-pointer transition"
                        >
                          {resetSent ? "DISPATCHING RECOVERY SIGNALS..." : "TRANSMIT PASSPHRASE RESET KEY"}
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
