import { useState, JSX } from "react";
import { Link, useRouter } from "./Router";
import BrandLogo from "./BrandLogo";
import { Menu, X, ShieldAlert, Cpu, LogOut, User } from "lucide-react";

interface NavbarProps {
  user: { name: string; email: string; role: string } | null;
  onLogout: () => void;
  onOpenLogin: () => void;
  onOpenAI: () => void;
}

export default function Navbar({ user, onLogout, onOpenLogin, onOpenAI }: NavbarProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const { currentPath } = useRouter();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Properties", href: "/properties" },
    { name: "Projects", href: "/projects" },
    { name: "Gallery", href: "/gallery" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#081B3A] border-b border-[#C9A24B]/20 text-white shadow-xl backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3 py-1 group">
            <BrandLogo size="sm" hideText={true} lightLogo={true} className="transition-transform duration-300 group-hover:scale-105" />
            <div className="flex flex-col text-left">
              <span className="font-display font-semibold text-lg tracking-[0.18em] text-[#C9A24B]">
                VM PROPERTIES
              </span>
              <span className="text-[9px] tracking-[0.3em] text-[#E5C07B] uppercase -mt-1 font-sans">
                Imperial Estates
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 xl:px-4 py-2 font-display text-sm tracking-widest font-medium uppercase transition-all duration-300 border-b-2 border-transparent hover:text-[#C9A24B] hover:border-[#C9A24B]/30"
                activeClassName="text-[#C9A24B] border-b-2 !border-[#C9A24B] font-semibold"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA / Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Elegant AI Advisor Launch button */}
            <button
              id="navbar-ai-advisor-btn"
              onClick={onOpenAI}
              className="flex items-center gap-2 px-4 py-2.5 rounded bg-gradient-to-r from-[#081B3A] to-[#1a3861] border border-[#C9A24B]/40 hover:border-[#C9A24B] text-[#C9A24B] font-display text-xs tracking-widest font-bold uppercase transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-[#C9A24B]/10 active:scale-95"
            >
              <Cpu className="h-3.5 w-3.5 animate-pulse" />
              AI MATCH
            </button>

            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                <Link
                  href="/admin"
                  className="flex items-center gap-2 text-xs font-display tracking-widest font-bold uppercase text-[#E5C07B] hover:text-white transition-colors"
                >
                  <ShieldAlert className="h-4 w-4" />
                  DASHBOARD
                </Link>
                <div className="flex items-center gap-1.5 bg-black/20 py-1.5 px-3 rounded text-xs text-slate-300">
                  <User className="h-3 w-3 text-[#C9A24B]" />
                  <span className="max-w-[80px] truncate">{user.name}</span>
                </div>
                <button
                  onClick={onLogout}
                  title="Logout"
                  className="p-2 text-slate-300 hover:text-rose-400 hover:bg-white/5 rounded transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                id="navbar-login-btn"
                onClick={onOpenLogin}
                className="px-5 py-2.5 rounded bg-[#C9A24B] hover:bg-[#E5C07B] text-[#081B3A] font-display text-xs tracking-widest font-bold uppercase shadow-md transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                Portal Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden gap-2">
            <button
              onClick={onOpenAI}
              className="p-2 text-[#C9A24B] hover:bg-white/5 rounded cursor-pointer"
              title="AI Recommend"
            >
              <Cpu className="h-5 w-5 animate-pulse" />
            </button>
            <button
              id="mobile-nav-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md hover:text-[#C9A24B] hover:bg-white/5 focus:outline-none cursor-pointer"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-[#C9A24B]/10 bg-[#081B3A] px-4 pt-2 pb-6 space-y-2 animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2.5 rounded-md text-base font-display tracking-wider uppercase font-medium hover:text-[#C9A24B] hover:bg-white/5 ${
                currentPath === link.href ? "text-[#C9A24B] bg-white/5" : "text-white"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-4 border-t border-white/5 space-y-3">
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenAI();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded bg-[#C9A24B]/10 border border-[#C9A24B]/30 text-[#C9A24B] font-display text-xs tracking-widest font-bold uppercase transition-all duration-300"
            >
              <Cpu className="h-4 w-4" />
              AI MATCH ADVISOR
            </button>

            {user ? (
              <div className="space-y-2">
                <Link
                  href="/admin"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded bg-blue-600/10 border border-blue-500/20 text-[#E5C07B] font-display text-xs tracking-widest font-bold uppercase"
                  onClick={() => setIsOpen(false)}
                >
                  <ShieldAlert className="h-4 w-4" />
                  ADMIN PANEL
                </Link>
                <div className="flex items-center justify-between px-3 text-sm text-slate-300">
                  <span>Logged in as: {user.name}</span>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onLogout();
                    }}
                    className="flex items-center gap-1.5 text-rose-400 font-bold"
                  >
                    Logout <LogOut className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenLogin();
                }}
                className="w-full py-3 rounded bg-[#C9A24B] text-[#081B3A] font-display text-xs tracking-widest font-bold uppercase shadow-md transition-all duration-300"
              >
                PORTAL LOGIN
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
