import { useEffect, useState, JSX } from "react";
import { Project } from "../types";
import { Hammer, CalendarCheck, Home } from "lucide-react";

export default function Projects(): JSX.Element {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch projects, using seeds...", err);
        setLoading(false);
      });
  }, []);

  const getStatusStyle = (status: Project["status"]) => {
    switch (status) {
      case "Under Construction":
        return "bg-amber-600/10 text-amber-500 border border-amber-500/20";
      case "Ready to Move":
        return "bg-emerald-600/10 text-emerald-500 border border-emerald-500/20";
      case "New Launch":
      default:
        return "bg-blue-600/10 text-blue-500 border border-blue-500/20";
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Title */}
      <div className="bg-[#081B3A] text-white py-16 text-center border-b border-[#C9A24B]/30">
        <div className="max-w-4xl mx-auto px-4 space-y-3">
          <p className="font-display text-xs tracking-[0.4em] text-[#C9A24B] uppercase font-bold">
            VM DEVELOPMENTS & COMMISSIONS
          </p>
          <h1 className="font-display font-medium text-3xl md:text-5xl tracking-tight text-slate-100">
            Shaping Urban Landscape Landmarks
          </h1>
          <div className="h-[2px] w-24 bg-[#C9A24B] mx-auto mt-4"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#C9A24B]"></div>
          </div>
        ) : (
          <div className="space-y-16">
            {projects.map((proj, idx) => (
              <div
                key={proj.id}
                className={`flex flex-col lg:flex-row gap-12 items-center bg-white border border-slate-200 p-6 md:p-8 rounded shadow-sm hover:shadow-md transition-shadow relative ${
                  idx % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Image Section */}
                <div className="w-full lg:w-1/2 relative group overflow-hidden rounded">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors z-10"></div>
                  <img
                    src={proj.image}
                    alt={proj.name}
                    className="w-full object-cover h-[350px] rounded transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <span className={`px-4 py-1.5 rounded-full text-xs tracking-widest uppercase font-bold font-display ${getStatusStyle(proj.status)}`}>
                      {proj.status}
                    </span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="w-full lg:w-1/2 space-y-5">
                  <div className="space-y-2">
                    <p className="font-display text-xs tracking-widest text-[#C9A24B] font-bold uppercase">
                      {proj.location}
                    </p>
                    <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-[#081B3A]">
                      {proj.name}
                    </h2>
                  </div>

                  <p className="text-slate-600 leading-relaxed font-sans text-base">
                    {proj.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#081B3A]/5 rounded-full text-[#C9A24B]">
                        <CalendarCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-display uppercase tracking-wider font-bold">Planned Handover</p>
                        <p className="text-sm text-[#081B3A] font-bold">{proj.completionDate}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#081B3A]/5 rounded-full text-[#C9A24B]">
                        <Hammer className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-display uppercase tracking-wider font-bold">Structure Index</p>
                        <p className="text-sm text-[#081B3A] font-bold">Grade-A Steel Frame</p>
                      </div>
                    </div>
                  </div>

                  {/* Aesthetic action button */}
                  <div className="pt-4">
                    <a
                      href="/contact"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded bg-[#081B3A] hover:bg-[#1a3861] text-[#C9A24B] font-display text-xs tracking-widest font-bold uppercase border border-[#C9A24B]/30 transition-transform active:scale-95"
                    >
                      <Home className="h-3.5 w-3.5" /> REQUEST VIP BROCHURE
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
