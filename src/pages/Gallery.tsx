import { useEffect, useState, JSX } from "react";
import { GalleryItem } from "../types";
import { Search, Eye, X, ZoomIn, ZoomOut } from "lucide-react";

export default function Gallery(): JSX.Element {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeTab, setActiveTab] = useState<"All" | "Property" | "Project" | "Event">("All");
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [zoomScale, setZoomScale] = useState(1);

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load gallery items", err);
        setLoading(false);
      });
  }, []);

  const filteredItems = activeTab === "All" ? items : items.filter(item => item.category === activeTab);

  const handleOpenLightbox = (item: GalleryItem) => {
    setSelectedItem(item);
    setZoomScale(1);
  };

  const handleZoomIn = () => setZoomScale(p => Math.min(p + 0.25, 2.5));
  const handleZoomOut = () => setZoomScale(p => Math.max(p - 0.25, 0.75));

  return (
    <div className="pt-24 min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Title */}
      <div className="bg-[#081B3A] text-white py-16 text-center border-b border-[#C9A24B]/30 mb-8">
        <div className="max-w-4xl mx-auto px-4 space-y-3">
          <p className="font-display text-xs tracking-[0.4em] text-[#C9A24B] uppercase font-bold">
            CURATED VISUAL ASSETS
          </p>
          <h1 className="font-display font-medium text-3xl md:text-5xl tracking-tight text-slate-100">
            Portfolio Media Gallery
          </h1>
          <div className="h-[2px] w-24 bg-[#C9A24B] mx-auto mt-4"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Gallery Segment Filter Tabs */}
        <div className="flex flex-wrap justify-center items-center gap-3 mb-12">
          {(["All", "Property", "Project", "Event"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded font-display text-xs font-bold tracking-widest uppercase transition-all duration-300 border cursor-pointer ${
                activeTab === tab
                  ? "bg-[#C9A24B] text-[#081B3A] border-[#C9A24B] shadow-md"
                  : "bg-white text-[#081B3A] border-slate-200 hover:border-[#C9A24B]/60"
              }`}
            >
              {tab}s
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#C9A24B]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpenLightbox(item)}
                className="group relative cursor-pointer overflow-hidden rounded bg-white shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200/60"
              >
                {/* Media Image Content */}
                <div className="overflow-hidden aspect-video relative">
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 flex items-center justify-center">
                    <div className="bg-white/10 p-4 border border-white/20 backdrop-blur-md rounded-full text-[#C9A24B] scale-75 group-hover:scale-100 transition-transform">
                      <Eye className="h-6 w-6" />
                    </div>
                  </div>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Info Overlay Panel */}
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] tracking-widest text-[#C9A24B] font-display uppercase font-bold">
                      {item.category}
                    </span>
                    <h3 className="font-display font-medium text-sm text-[#081B3A] mt-0.5 truncate max-w-[200px]">
                      {item.title}
                    </h3>
                  </div>
                  <span className="text-slate-300 group-hover:text-[#C9A24B] transition-colors">
                    <Search className="h-4 w-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredItems.length === 0 && !loading && (
          <div className="text-center py-16">
            <p className="text-slate-400">No media gallery entries are loaded in this category.</p>
          </div>
        )}
      </div>

      {/* Luxury Immersive Lightbox Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-[#081B3A]/98 backdrop-blur-md flex items-center justify-center p-4">
          <div className="absolute top-4 right-4 flex items-center gap-3">
            {/* Zoom Controls */}
            <button
              onClick={handleZoomIn}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded cursor-pointer transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded cursor-pointer transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <button
              onClick={() => setSelectedItem(null)}
              className="p-3 bg-[#C9A24B] hover:bg-[#E5C07B] text-[#081B3A] rounded cursor-pointer transition-all duration-300"
              title="Close View"
            >
              <X className="h-5 w-5 font-bold" />
            </button>
          </div>

          <div className="max-w-4xl w-full flex flex-col items-center gap-4">
            <div className="overflow-hidden rounded max-h-[70vh] flex items-center justify-center border border-[#C9A24B]/20">
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.title}
                className="object-contain max-h-[70vh] rounded transition-transform duration-200"
                style={{ transform: `scale(${zoomScale})` }}
              />
            </div>

            <div className="text-center space-y-1">
              <span className="text-xs text-[#C9A24B] font-display uppercase tracking-widest font-bold">
                {selectedItem.category} Asset
              </span>
              <h2 className="text-white font-display text-xl md:text-2xl font-light">
                {selectedItem.title}
              </h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
