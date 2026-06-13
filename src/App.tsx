import React, { useState, useEffect, JSX } from "react";
import { useRouter } from "./components/Router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Listings from "./pages/Listings";
import PropertyDetail from "./pages/PropertyDetail";
import Projects from "./pages/Projects";
import Gallery from "./pages/Gallery";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import LegalPages from "./pages/LegalPages";
import ClientPortal from "./pages/ClientPortal";

// Lucide Icons
import {
  KeyRound, ShieldAlert, Sparkles, MessageSquare, Bot, X, Send,
  ArrowRight, Mail, Phone, User, ShieldCheck, MailCheck, BellDot
} from "lucide-react";

export default function App(): JSX.Element {
  const { currentPath, navigate } = useRouter();

  // Authentication State
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string; role: string; wishlist: string[] } | null>(null);

  // Login/Register authenticator toggles
  const [authTab, setAuthTab] = useState<"login" | "register" | "forgot">("login");
  
  // Authenticator inputs
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");

  // Client Register inputs
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  // Forgot password inputs
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  // AI Recommendation Drawer state
  const [showAiDrawer, setShowAiDrawer] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Live Communications Logs Drawer State
  const [showCommDrawer, setShowCommDrawer] = useState(false);
  const [commLogs, setCommLogs] = useState<{ id: string; timestamp: string; type: string; recipient: string; template: string; content: string; status: string }[]>([]);

  // Exit Intent Popup States
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [popupName, setPopupName] = useState("");
  const [popupEmail, setPopupEmail] = useState("");
  const [popupPhone, setPopupPhone] = useState("");
  const [popupSent, setPopupSent] = useState(false);

  // Dynamic SEO metadata tags & schema.org injector
  useEffect(() => {
    let title = "VM Properties | Ultra Luxury Real Estate in India";
    let description = "Prestige villas, premium corporate complexes, and appreciating gated residential plots in Jubilee Hills, Kokapet, and Mokila.";
    let canonical = window.location.href;
    let schema: any = null;

    if (currentPath === "/") {
      title = "VM Properties | Ultra Luxury Real Estate Jubilee Hills";
      schema = {
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        "name": "VM Properties",
        "image": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
        "telephone": "+91-98765-43210",
        "email": "concierge@vmproperties.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Financial District, Gachibowli",
          "addressLocality": "Hyderabad",
          "addressRegion": "Telangana",
          "postalCode": "500032",
          "addressCountry": "IN"
        }
      };
    } else if (currentPath === "/properties") {
      title = "Sovereign Listings Portfolio | VM Properties";
      description = "Browse our elite properties. 5 BHK duplex villas, executive offices, and RERA certified lands in prime corridors.";
    } else if (currentPath === "/projects") {
      title = "Landmark Architectural Projects & Skylines | VM Properties";
    } else if (currentPath === "/gallery") {
      title = "Exclusive Visual Media Gallery | VM Properties";
    } else if (currentPath === "/blog") {
      title = "Real Estate Intelligence Briefings | VM Properties";
    } else if (currentPath === "/about") {
      title = "Legacy of Architectural Mastery | VM Properties";
    } else if (currentPath === "/contact") {
      title = "Acquisitions Reception Desk | VM Properties";
    } else if (currentPath === "/admin") {
      title = "Corporate Authenticator Desk | VM Properties";
    } else if (currentPath === "/client") {
      title = "Client Management Dashboard | VM Properties";
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", description);

    // Dynamic OpenGraph / Twitter tags injection
    const setMeta = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    setMeta("og:title", title);
    setMeta("og:description", description);
    setMeta("og:url", canonical);

    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement("link");
      linkCanonical.setAttribute("rel", "canonical");
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute("href", canonical);

    // Schema JSON-LD Script tag injection
    let schemaScript = document.getElementById("jsonld-schema") as HTMLScriptElement;
    if (schemaScript) schemaScript.remove();

    if (schema) {
      schemaScript = document.createElement("script");
      schemaScript.id = "jsonld-schema";
      schemaScript.type = "application/ld+json";
      schemaScript.text = JSON.stringify(schema);
      document.head.appendChild(schemaScript);
    }
  }, [currentPath]);

  // Exit Intent Detector
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 30) {
        const alreadyShown = sessionStorage.getItem("vm_properties_exit_intent_shown");
        if (!alreadyShown) {
          setShowExitPopup(true);
          sessionStorage.setItem("vm_properties_exit_intent_shown", "true");
        }
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Poll server-side automated communications logs for dashboard visual feedback
  useEffect(() => {
    const fetchLogs = () => {
      fetch("/api/communications/logs")
        .then(res => res.json())
        .then(data => setCommLogs(data))
        .catch(err => console.error("Could not fetch communication logs", err));
    };
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000); // refresh logs every 5s
    return () => clearInterval(interval);
  }, []);

  const handleExitPopupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!popupName || !popupEmail || !popupPhone) return;

    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propertyName: "Bespoke VIP Brochure",
        name: popupName,
        phone: popupPhone,
        email: popupEmail,
        message: "Requested luxury brochure download via Exit Intent Briefing",
        source: "Exit Intent Popup"
      })
    })
      .then((res) => res.json())
      .then(() => {
        setPopupSent(true);
        setPopupName("");
        setPopupEmail("");
        setPopupPhone("");
      })
      .catch((err) => console.error(err));
  };

  // Load session auth on startup if any
  useEffect(() => {
    const cached = localStorage.getItem("vm_properties_session");
    if (cached) {
      try {
        setCurrentUser(JSON.parse(cached));
      } catch (e) {
        localStorage.removeItem("vm_properties_session");
      }
    }
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginSuccess("");

    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail, password: loginPassword })
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(d => { throw new Error(d.error || "Credentials mismatch") });
        }
        return res.json();
      })
      .then((data) => {
        setCurrentUser(data.user);
        localStorage.setItem("vm_properties_session", JSON.stringify(data.user));
        
        // Redirect accordingly
        if (data.user.role === "Client") {
          navigate("/client");
        } else {
          navigate("/admin");
        }
      })
      .catch(err => {
        setLoginError(err.message || "Invalid credentials. Double check password details.");
      });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginSuccess("");

    fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: registerName,
        email: registerEmail,
        phone: registerPhone,
        password: registerPassword
      })
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(d => { throw new Error(d.error || "Registration failed") });
        }
        return res.json();
      })
      .then(() => {
        setLoginSuccess("Account registered successfully! You may log in now.");
        setAuthTab("login");
        // Pre-fill email
        setLoginEmail(registerEmail);
        // Clear fields
        setRegisterName("");
        setRegisterEmail("");
        setRegisterPhone("");
        setRegisterPassword("");
      })
      .catch(err => {
        setLoginError(err.message || "Registration parameters incorrect.");
      });
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSent(true);
    setTimeout(() => {
      setForgotSent(false);
      setAuthTab("login");
      alert("Simulated reset link sent to your registered inbox.");
    }, 1500);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("vm_properties_session");
    navigate("/");
  };

  // Trigger Gemini AI recommendations query
  const handleAskRecommender = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setAiLoading(true);
    setAiResponse("");

    fetch("/api/ai/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: aiPrompt })
    })
      .then((res) => {
        if (!res.ok) throw new Error("Recommendation endpoint error");
        return res.json();
      })
      .then((data) => {
        setAiResponse(data.recommendations);
        setAiLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setAiResponse("Apologies, our premium recommendation server is currently under cold boot. Please select one of our curated corridors in Jubilee Hills manually.");
        setAiLoading(false);
      });
  };

  // Route Router matching
  const renderCurrentPage = () => {
    if (currentPath === "/") return <Home />;
    if (currentPath === "/about") return <About />;
    if (currentPath === "/properties") return <Listings />;
    if (currentPath.startsWith("/property/")) return <PropertyDetail />;
    if (currentPath === "/projects") return <Projects />;
    if (currentPath === "/gallery") return <Gallery />;
    if (currentPath === "/blog" || currentPath.startsWith("/blog/")) return <Blog />;
    if (currentPath === "/contact") return <Contact />;
    if (currentPath === "/privacy" || currentPath === "/privacy-policy") return <LegalPages />;
    if (currentPath === "/terms" || currentPath === "/terms-conditions") return <LegalPages />;
    if (currentPath === "/disclaimer") return <LegalPages />;
    if (currentPath === "/cookie-policy") return <LegalPages />;
    if (currentPath === "/sitemap") return <LegalPages />;

    // Client Dashboard Console
    if (currentPath === "/client") {
      if (currentUser && currentUser.role === "Client") {
        return (
          <ClientPortal
            user={currentUser as any}
            onLogout={handleLogout}
            onUpdateProfile={(updatedUser) => {
              setCurrentUser(updatedUser as any);
              localStorage.setItem("vm_properties_session", JSON.stringify(updatedUser));
            }}
          />
        );
      }
      navigate("/admin");
      return null;
    }

    // Admin authorization router
    if (currentPath === "/admin") {
      if (currentUser) {
        if (currentUser.role === "Client") {
          return <ClientPortal user={currentUser as any} onLogout={handleLogout} onUpdateProfile={() => {}} />;
        }
        return <Admin user={currentUser} onLogout={handleLogout} />;
      }

      // Unified Client / Corporate Authenticator Desk Overlay Screen
      return (
        <div className="pt-24 min-h-screen bg-slate-100 flex items-center justify-center p-4 text-slate-800">
          <div className="bg-white border rounded shadow-2xl max-w-md w-full overflow-hidden border-slate-200">
            
            {/* Logo top bar */}
            <div className="bg-[#081B3A] text-center py-6 text-white border-b border-[#C9A24B]/35">
              <span className="text-[10px] tracking-[0.4em] text-[#C9A24B] uppercase font-bold font-display">
                VM PROPERTIES PORTAL
              </span>
              <h2 className="font-display font-medium text-lg text-slate-100 mt-1">Sovereign Authenticator Console</h2>
            </div>

            {/* Selector Tabs */}
            <div className="bg-slate-50 border-b flex text-xs font-display tracking-wider font-bold uppercase shrink-0">
              <button
                onClick={() => { setAuthTab("login"); setLoginError(""); setLoginSuccess(""); }}
                className={`w-1/2 py-3.5 text-center transition-colors cursor-pointer ${authTab === "login" ? "bg-white border-b-2 border-[#C9A24B] text-[#081B3A]" : "text-slate-500 hover:bg-slate-100"}`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setAuthTab("register"); setLoginError(""); setLoginSuccess(""); }}
                className={`w-1/2 py-3.5 text-center transition-colors cursor-pointer ${authTab === "register" ? "bg-white border-b-2 border-[#C9A24B] text-[#081B3A]" : "text-slate-500 hover:bg-slate-100"}`}
              >
                Register
              </button>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Show errors or success */}
              {loginError && <p className="text-xs text-rose-500 font-bold bg-rose-50 p-2.5 rounded text-center">{loginError}</p>}
              {loginSuccess && <p className="text-xs text-emerald-600 font-bold bg-emerald-50 p-2.5 rounded text-center">{loginSuccess}</p>}

              {/* Login Form */}
              {authTab === "login" && (
                <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-sans">
                  <div className="space-y-1">
                    <span className="font-bold uppercase tracking-wider text-slate-400 font-display">Account Email</span>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. admin@vmproperties.com"
                      className="w-full px-3 py-2.5 border rounded bg-slate-50 focus:bg-white outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold uppercase tracking-wider text-slate-400 font-display">Passphrase</span>
                      <button
                        type="button"
                        onClick={() => setAuthTab("forgot")}
                        className="text-[#C9A24B] hover:underline"
                      >
                        Forgot Passphrase?
                      </button>
                    </div>
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter verification password"
                      className="w-full px-3 py-2.5 border rounded bg-slate-50 focus:bg-white outline-none"
                    />
                  </div>

                  <button
                    id="admin-auth-login-submit-btn"
                    type="submit"
                    className="w-full py-3.5 bg-[#081B3A] text-[#C9A24B] hover:bg-slate-900 border border-[#C9A24B]/35 hover:text-white font-display text-[10px] tracking-widest font-bold uppercase rounded cursor-pointer transition shadow"
                  >
                    VALIDATE SIGNATURE ACCESS
                  </button>

                  <div className="bg-slate-50 p-3.5 rounded border text-[10px] space-y-1 leading-relaxed font-sans text-slate-500 mt-2">
                    <p className="font-bold text-[#081B3A]">Preset Access Profiles (RBAC Sandbox):</p>
                    <div className="font-mono text-[9px]">
                      <div><strong>Admin:</strong> admin@vmproperties.com / admin123</div>
                      <div><strong>Agent:</strong> agent@vmproperties.com / agent123</div>
                    </div>
                  </div>
                </form>
              )}

              {/* Register Form */}
              {authTab === "register" && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs font-sans">
                  <div className="space-y-1">
                    <span className="font-bold uppercase tracking-wider text-slate-400 font-display">Full Legal Name</span>
                    <input
                      type="text"
                      required
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      placeholder="e.g. Madhavan Srinivasan"
                      className="w-full px-3 py-2.5 border rounded bg-slate-50 focus:bg-white outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold uppercase tracking-wider text-slate-400 font-display">Private Email</span>
                    <input
                      type="email"
                      required
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      placeholder="e.g. client@siliconvalley.io"
                      className="w-full px-3 py-2.5 border rounded bg-slate-50 focus:bg-white outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold uppercase tracking-wider text-slate-400 font-display">Secure Contact Phone</span>
                    <input
                      type="tel"
                      value={registerPhone}
                      onChange={(e) => setRegisterPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-3 py-2.5 border rounded bg-slate-50 focus:bg-white outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold uppercase tracking-wider text-slate-400 font-display">Access Passphrase</span>
                    <input
                      type="password"
                      required
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      placeholder="Create secure password"
                      className="w-full px-3 py-2.5 border rounded bg-slate-50 focus:bg-white outline-none"
                    />
                  </div>

                  <button
                    id="client-auth-register-submit-btn"
                    type="submit"
                    className="w-full py-3.5 bg-[#C9A24B] text-[#081B3A] hover:bg-[#E5C07B] font-display text-[10px] tracking-widest font-bold uppercase rounded cursor-pointer transition shadow"
                  >
                    CREATE DYNAMIC CLIENT ID
                  </button>
                </form>
              )}

              {/* Forgot Passphrase Form */}
              {authTab === "forgot" && (
                <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs font-sans">
                  <div className="space-y-1">
                    <span className="font-bold uppercase tracking-wider text-slate-400 font-display">Registered Email</span>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="concierge@email.com"
                      className="w-full px-3 py-2.5 border rounded bg-slate-50 focus:bg-white outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#081B3A] text-[#C9A24B] hover:bg-slate-900 border border-[#C9A24B]/35 font-display text-[10px] tracking-widest font-bold uppercase rounded cursor-pointer transition shadow"
                  >
                    {forgotSent ? "DISPATCHING RECOVERY CODES..." : "SEND RECOVERY CODES"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthTab("login")}
                    className="w-full text-center text-slate-500 hover:underline text-[10px] font-bold"
                  >
                    Return to Login
                  </button>
                </form>
              )}

            </div>
          </div>
        </div>
      );
    }

    // Fallback 404
    return (
      <div className="pt-32 text-center max-w-md mx-auto space-y-4">
        <h2 className="font-display text-2xl font-bold text-slate-800">404 - Page Missing</h2>
        <p className="text-slate-500 font-sans">The requested URL route line does not map to any active controller actions.</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2.5 rounded bg-[#081B3A] text-[#C9A24B] font-display text-xs tracking-widest font-bold uppercase"
        >
          Return Home
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-800">

      {/* Dynamic Header navbar */}
      <Navbar
        user={currentUser}
        onLogout={handleLogout}
        onOpenLogin={() => navigate("/admin")}
        onOpenAI={() => setShowAiDrawer(true)}
      />

      {/* Primary views section */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Dynamic footer layer */}
      <Footer />

      {/* LUXURY FLOATING WHATSAPP BUTTON */}
      <a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 h-12 w-12 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-emerald-500 transition-transform hover:scale-105 z-40 cursor-pointer animate-pulse"
        title="Connect directly on WhatsApp Secures"
      >
        <MessageSquare className="h-6 w-6" />
      </a>

      {/* HELPFUL FLOATING AI ASSISTANT TRIGGERS */}
      <button
        onClick={() => setShowAiDrawer(!showAiDrawer)}
        className="fixed bottom-6 left-6 h-12 w-12 bg-[#081B3A] border-2 border-[#C9A24B] text-[#C9A24B] rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-105 z-40 cursor-pointer"
        title="Consult VM AI Property Recommender Guides"
      >
        <Bot className="h-5 w-5" />
      </button>

      {/* LIVE COMMUNICATIONS LOGS WIDGET TRIGGER */}
      <button
        onClick={() => setShowCommDrawer(!showCommDrawer)}
        className="fixed bottom-20 left-6 h-12 w-12 bg-emerald-700 border-2 border-[#C9A24B] text-[#C9A24B] rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform z-40 cursor-pointer"
        title="Communications Logs feed"
      >
        <BellDot className="h-5 w-5 text-white" />
      </button>

      {/* LIVE COMMUNICATIONS LOGS DRAWER */}
      {showCommDrawer && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[450px] bg-slate-900 text-white border-l border-[#C9A24B]/30 shadow-2xl z-50 flex flex-col justify-between font-sans">
          {/* Header */}
          <div className="p-5 bg-[#081B3A] border-b border-[#C9A24B]/35 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <BellDot className="h-5 w-5 text-[#C9A24B]" />
              <div>
                <h4 className="font-display font-bold text-xs tracking-wider uppercase text-[#C9A24B]">COMMUNICATIONS AUTOMATION</h4>
                <p className="text-[9px] text-slate-300">Live logs of triggered corporate emails & WhatsApps</p>
              </div>
            </div>
            <button onClick={() => setShowCommDrawer(false)} className="p-1 text-slate-300 hover:text-white rounded">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* List panel */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-950 font-mono text-[11px] leading-relaxed">
            {commLogs.length > 0 ? (
              commLogs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-900 border border-slate-800 rounded space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-[#C9A24B]">
                    <span className="font-bold">[{log.type}] {log.template}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-slate-400">Recipient: {log.recipient}</div>
                  <pre className="text-xs text-slate-200 mt-1 whitespace-pre-wrap font-sans bg-black/45 p-2 rounded leading-snug">{log.content}</pre>
                  <div className="text-[9px] text-emerald-500 text-right">✓ Status: {log.status}</div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 text-slate-500 font-sans">
                No automatic logs recorded. Submit a contact form or schedule a tour to trigger.
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI RECOMMENDATION CONCIERGE DRAWER BAR */}
      {showAiDrawer && (
        <div className="fixed inset-y-0 left-0 w-full sm:w-[420px] bg-white border-r border-[#C9A24B]/30 shadow-2xl z-50 flex flex-col justify-between font-sans text-slate-800">

          {/* Header */}
          <div className="p-5 bg-[#081B3A] text-white border-b border-[#C9A24B]/35 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#C9A24B]" />
              <div>
                <h4 className="font-display font-bold text-xs tracking-wider uppercase text-[#C9A24B]">VM AI RECOMMENDER</h4>
                <p className="text-[9px] text-slate-300">Confidential acquisitions advisory service</p>
              </div>
            </div>
            <button
              onClick={() => setShowAiDrawer(false)}
              className="p-1 text-slate-300 hover:text-white rounded"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat Board */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50 text-xs">

            <div className="p-3 bg-white border border-slate-150 rounded space-y-2 leading-relaxed">
              <p className="font-bold text-[#081B3A] flex items-center gap-1">
                <Bot className="h-3.5 w-3.5 text-[#C9A24B]" /> Vikram • VM Smart Recommender
              </p>
              <p>Welcome to our exclusive digital briefing. Ask about optimal residential duplexes, agricultural farm lands, or top corporate offices in Jubilee Hills or Gachibowli.</p>
              <div className="flex gap-1.5 flex-wrap">
                <button
                  onClick={() => setAiPrompt("Suggest a luxury 4BHK villa in Jubilee Hills within 12 Crores")}
                  className="p-1 px-2 border rounded bg-slate-50 hover:bg-[#C9A24B]/5 text-slate-500 font-medium cursor-pointer text-[10px]"
                >
                  "4BHK villa Jubilee Hills"
                </button>
                <button
                  onClick={() => setAiPrompt("What are the best high-yield commercial offices available for rent?")}
                  className="p-1 px-2 border rounded bg-slate-50 hover:bg-[#C9A24B]/5 text-slate-500 font-medium cursor-pointer text-[10px]"
                >
                  "High-yield Offices"
                </button>
              </div>
            </div>

            {aiLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-200 p-3.5 rounded max-w-sm space-y-1.5 animate-pulse">
                  <p className="text-[#081B3A] font-bold">Scanning active property columns...</p>
                  <div className="h-1 bg-slate-300 rounded w-24"></div>
                </div>
              </div>
            )}

            {aiResponse && (
              <div className="p-4 bg-[#081B3A] text-white border border-[#C9A24B]/35 rounded space-y-3 leading-relaxed">
                <p className="font-bold text-[#E5C07B] uppercase tracking-wider font-display text-[9px]">Confidential AI Recommendation</p>
                <div className="text-slate-300 prose prose-invert text-xs space-y-2 whitespace-pre-line">
                  {aiResponse}
                </div>

                <button
                  onClick={() => { navigate("/properties"); setShowAiDrawer(false); }}
                  className="text-[9px] font-display font-bold uppercase tracking-widest text-[#C9A24B] hover:underline flex items-center gap-1 text-slate-100 cursor-pointer pt-2 border-t border-white/5"
                >
                  EXPLORE LISTINGS NOW <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleAskRecommender} className="p-3 bg-white border-t flex gap-2 shrink-0">
            <input
              type="text"
              value={aiPrompt}
              required
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ask for customized estate advisor recommendation..."
              className="flex-1 px-3 py-2.5 border rounded text-xs bg-slate-50 focus:bg-white outline-none"
            />
            <button
              id="ai-concierge-prompt-submit-btn"
              type="submit"
              className="p-2.5 bg-[#081B3A] text-[#C9A24B] hover:text-white rounded flex items-center justify-center cursor-pointer"
              title="Submit prompt query"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* EXCLUSIVE EXIT INTENT PORTFOLIO BROCHURE MODAL */}
      {showExitPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="relative bg-white max-w-md w-full rounded border border-[#C9A24B]/30 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            
            <div className="bg-[#081B3A] p-5 text-center relative border-b border-[#C9A24B]/40">
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#C9A24B] font-bold font-display">Bespoke Concierge Briefing</span>
              <h3 className="font-display text-lg text-white mt-1 uppercase font-light">Unlisted VM Assets Catalogue</h3>
              <p className="text-[10px] text-slate-300 mt-1">Unlock unlisted Jubilee Hills architectural elevations & yield ratios.</p>

              <button
                onClick={() => setShowExitPopup(false)}
                className="absolute top-3 right-3 text-slate-400 hover:text-white text-xs p-1 cursor-pointer"
                title="Decline invitation"
              >
                ✕
              </button>
            </div>

            <div className="p-6 text-slate-800">
              {!popupSent ? (
                <form onSubmit={handleExitPopupSubmit} className="space-y-4">
                  <div className="space-y-3">
                    <input
                      type="text"
                      required
                      placeholder="Full Legal Name"
                      value={popupName}
                      onChange={(e) => setPopupName(e.target.value)}
                      className="w-full px-3 py-2.5 border rounded text-xs bg-slate-50 focus:bg-white outline-none focus:ring-1 focus:ring-[#C9A24B] placeholder-slate-400 font-sans"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Secure Email Corridor"
                      value={popupEmail}
                      onChange={(e) => setPopupEmail(e.target.value)}
                      className="w-full px-3 py-2.5 border rounded text-xs bg-slate-50 focus:bg-white outline-none focus:ring-1 focus:ring-[#C9A24B] placeholder-slate-400 font-sans"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Verified Contact Number"
                      value={popupPhone}
                      onChange={(e) => setPopupPhone(e.target.value)}
                      className="w-full px-3 py-2.5 border rounded text-xs bg-slate-50 focus:bg-white outline-none focus:ring-1 focus:ring-[#C9A24B] placeholder-slate-400 font-sans"
                    />
                  </div>

                  <button
                    id="exit-intent-brochure-submit-btn"
                    type="submit"
                    className="w-full py-3 bg-[#081B3A] text-[#C9A24B] hover:text-white border border-[#C9A24B]/35 font-display text-[10px] tracking-widest font-bold uppercase rounded cursor-pointer transition active:scale-95 shadow-md flex items-center justify-center gap-2"
                  >
                    <Send className="h-3.5 w-3.5" /> SECURE EXECUTIVE CATALOGUE
                  </button>

                  <p className="text-[9px] text-slate-400 text-center font-sans">
                    *Your submission remains completely confidential under VM Private Wealth guidance protocols.
                  </p>
                </form>
              ) : (
                <div className="text-center py-6 space-y-3 font-sans">
                  <div className="inline-flex p-3 bg-emerald-50 rounded-full text-emerald-600 border border-emerald-100">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display font-medium text-sm text-[#081B3A]">VIP DEBRIEFING PRE-REGISTERED</h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Vikram has received your portfolio card. Our acquisitions courier is compiling your customized PDF booklet for delivery.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowExitPopup(false)}
                    className="mt-6 px-5 py-2 bg-[#081B3A] text-white hover:text-[#C9A24B] font-display text-[10px] tracking-widest uppercase rounded text-xs cursor-pointer"
                  >
                    Return to Platform
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
