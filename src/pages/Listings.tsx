import React, { useEffect, useState, JSX } from "react";
import { Property, PropertyType, PropertyCategory, PropertyStatus } from "../types";
import { useRouter, Link } from "../components/Router";
import { 
  Search, Grid, List, MapPin, BedDouble, Bath, Maximize2, Trash, 
  SlidersHorizontal, ChevronRight, HelpCircle, Heart, Save, Clock, Sparkles 
} from "lucide-react";

export default function Listings(): JSX.Element {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Wishlist & Saved Search States
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<{
    id: string;
    query: string;
    filters: {
      searchQuery: string;
      typeFilter: string;
      categoryFilter: string;
      locationFilter: string;
      statusFilter: string;
      bedsFilter: string;
      maxPrice: number;
    };
    date: string;
  }[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Property[]>([]);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Advanced Filters States
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"All" | PropertyType>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"All" | PropertyStatus>("All");
  const [bedsFilter, setBedsFilter] = useState<number | "All">("All");
  const [maxPrice, setMaxPrice] = useState<number>(150000000); // 15 Crores default
  
  // Sorting & Pagination States
  const [sortBy, setSortBy] = useState<"new" | "price-asc" | "price-desc">("new");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { navigate } = useRouter();

  useEffect(() => {
    // Load local storage states
    try {
      const storedWishlist = localStorage.getItem("vm_wishlist");
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));

      const storedSearches = localStorage.getItem("vm_saved_searches");
      if (storedSearches) setSavedSearches(JSON.parse(storedSearches));

      const storedRecentIds = localStorage.getItem("vm_recently_viewed_ids");
      const recentIds: string[] = storedRecentIds ? JSON.parse(storedRecentIds) : [];
      
      fetch("/api/properties")
        .then((res) => res.json())
        .then((data: Property[]) => {
          setProperties(data);
          
          // Match recently viewed
          if (recentIds.length > 0) {
            const matched = recentIds
              .map(id => data.find(p => p.id === id))
              .filter((p): p is Property => !!p);
            setRecentlyViewed(matched.slice(0, 4));
          }

          // Capture Home Page Redirection parameters
          const homeQuery = sessionStorage.getItem("home_search_query");
          const homeType = sessionStorage.getItem("home_search_type");
          const homeStatus = sessionStorage.getItem("home_search_status");
          const homeBudget = sessionStorage.getItem("home_search_budget");

          if (homeQuery !== null) {
            setSearchQuery(homeQuery);
            sessionStorage.removeItem("home_search_query");
          }
          if (homeType) {
            setTypeFilter(homeType as any);
            sessionStorage.removeItem("home_search_type");
          }
          if (homeStatus) {
            setStatusFilter(homeStatus as any);
            sessionStorage.removeItem("home_search_status");
          }
          if (homeBudget) {
            setMaxPrice(Number(homeBudget));
            sessionStorage.removeItem("home_search_budget");
          }

          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load properties list", err);
          setLoading(false);
        });
    } catch (e) {
      console.error("Failed to parse premium local states", e);
      setLoading(false);
    }
  }, []);

  // Handle wishlist heart toggles
  const toggleWishlist = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = wishlist.includes(id) 
      ? wishlist.filter(x => x !== id) 
      : [...wishlist, id];
    setWishlist(updated);
    localStorage.setItem("vm_wishlist", JSON.stringify(updated));
  };

  // Saved Searches
  const handleSaveSearch = () => {
    if (!searchQuery && typeFilter === "All" && categoryFilter === "All" && locationFilter === "All" && statusFilter === "All" && bedsFilter === "All") {
      alert("Please select some search criteria first.");
      return;
    }
    const criterionTitle = [
      searchQuery && `"${searchQuery}"`,
      typeFilter !== "All" && typeFilter,
      categoryFilter !== "All" && categoryFilter,
      locationFilter !== "All" && locationFilter,
      statusFilter !== "All" && statusFilter,
      bedsFilter !== "All" && `${bedsFilter} BHK`
    ].filter(Boolean).join(" + ") || `Budget ₹${(maxPrice/10000000).toFixed(1)} Cr`;

    const newSearch = {
      id: `search-${Date.now()}`,
      query: criterionTitle,
      filters: {
        searchQuery,
        typeFilter,
        categoryFilter,
        locationFilter,
        statusFilter,
        bedsFilter: String(bedsFilter),
        maxPrice
      },
      date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
    };

    const updated = [newSearch, ...savedSearches].slice(0, 5); // caps at 5 records
    setSavedSearches(updated);
    localStorage.setItem("vm_saved_searches", JSON.stringify(updated));
  };

  const applySavedSearch = (filters: any) => {
    setSearchQuery(filters.searchQuery);
    setTypeFilter(filters.typeFilter);
    setCategoryFilter(filters.categoryFilter);
    setLocationFilter(filters.locationFilter);
    setStatusFilter(filters.statusFilter);
    setBedsFilter(filters.bedsFilter === "All" ? "All" : Number(filters.bedsFilter));
    setMaxPrice(filters.maxPrice);
    setCurrentPage(1);
  };

  const deleteSavedSearch = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedSearches.filter(x => x.id !== id);
    setSavedSearches(updated);
    localStorage.setItem("vm_saved_searches", JSON.stringify(updated));
  };

  // Keyboard autocomplete suggestions
  const handleKeywordChange = (val: string) => {
    setSearchQuery(val);
    if (!val) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    // Match titles or locations or categories
    const results: string[] = [];
    properties.forEach(p => {
      if (p.title.toLowerCase().includes(val.toLowerCase()) && !results.includes(p.title)) {
        results.push(p.title);
      }
      const corridor = p.location.split(",")[0];
      if (corridor.toLowerCase().includes(val.toLowerCase()) && !results.includes(corridor)) {
        results.push(corridor);
      }
    });
    setSearchSuggestions(results.slice(0, 5));
    setShowSuggestions(true);
  };

  // Format currency nicely in INR Crores/Lakhs
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(price / 100000).toFixed(1)} L`;
  };

  // Extract unique locations from catalog dynamically for the filter dropdown
  const uniqueLocations = Array.from(new Set(properties.map(p => p.location.split(",")[1]?.trim() || p.location)));

  // Filter Logic
  const filteredProperties = properties.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "All" || p.type === typeFilter;
    const matchesCat = categoryFilter === "All" || p.category === categoryFilter;
    const matchesLoc = locationFilter === "All" || p.location.includes(locationFilter);
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    const matchesBeds = bedsFilter === "All" || p.bedrooms === Number(bedsFilter);
    const matchesPrice = p.price <= maxPrice;
    const matchesWishlist = !showWishlistOnly || wishlist.includes(p.id);

    return matchesSearch && matchesType && matchesCat && matchesLoc && matchesStatus && matchesBeds && matchesPrice && matchesWishlist;
  });

  // Sorting Logic
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    // Default newest (views / count)
    return (b.views || 0) - (a.views || 0);
  });

  // Pagination Logic
  const totalPages = Math.ceil(sortedProperties.length / itemsPerPage);
  const paginatedProperties = sortedProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setSearchQuery("");
    setTypeFilter("All");
    setCategoryFilter("All");
    setLocationFilter("All");
    setStatusFilter("All");
    setBedsFilter("All");
    setMaxPrice(150000000);
    setSortBy("new");
    setCurrentPage(1);
  };

  // Get relevant categories list depending on type selection
  const getRelevantCategories = () => {
    if (typeFilter === "Residential") return ["Apartment", "Villa", "Independent House", "Duplex"];
    if (typeFilter === "Commercial") return ["Office", "Retail Shop", "Warehouse"];
    if (typeFilter === "Land") return ["Residential Plot", "Commercial Plot", "Farm Land"];
    return ["Apartment", "Villa", "Independent House", "Duplex", "Office", "Retail Shop", "Warehouse", "Residential Plot", "Commercial Plot", "Farm Land"];
  };

  return (
    <div className="pt-24 min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Title */}
      <div className="bg-[#081B3A] text-white py-16 text-center border-b border-[#C9A24B]/30 mb-8">
        <div className="max-w-4xl mx-auto px-4 space-y-3">
          <p className="font-display text-xs tracking-[0.4em] text-[#C9A24B] uppercase font-bold">
            VM TRUSTED ADVISORY PORTFOLIO
          </p>
          <h1 className="font-display font-medium text-3xl md:text-5xl tracking-tight text-slate-100">
            Exclusive Luxury Listings
          </h1>
          <div className="h-[2px] w-24 bg-[#C9A24B] mx-auto mt-4"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT SIDEBAR: ADVANCED SEARCH FILTERS PANEL */}
          <div className="lg:col-span-1 bg-white border border-slate-200 p-6 rounded shadow-sm h-fit space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="font-display font-bold text-sm tracking-wider uppercase text-[#081B3A] flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-[#C9A24B]" /> Filters Panel
              </h3>
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-rose-500 hover:underline cursor-pointer"
              >
                Clear All
              </button>
            </div>

            {/* Keyword Box with Suggestions & Autocomplete */}
            <div className="space-y-1.5 relative">
              <label className="text-xs font-display tracking-widest uppercase font-bold text-slate-400 flex items-center justify-between">
                <span>Keyword search</span>
                {searchQuery && (
                  <button onClick={() => handleKeywordChange("")} className="text-[10px] text-slate-400 hover:text-rose-500 font-sans cursor-pointer">Clear</button>
                )}
              </label>
              <div className="flex items-center gap-2 px-3 py-2 border rounded bg-slate-50 border-slate-200 focus-within:bg-white focus-within:border-[#C9A24B] transition-all">
                <Search className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="e.g. pool, penthouse, plot"
                  value={searchQuery}
                  onChange={(e) => handleKeywordChange(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  className="bg-transparent text-sm w-full outline-none text-slate-700"
                />
              </div>

              {/* Suggestions dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-[100%] z-20 mt-1 bg-white border border-slate-200 rounded shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                  {searchSuggestions.map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setSearchQuery(sug);
                        setSearchSuggestions([]);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-600 hover:bg-[#081B3A]/5 hover:text-[#081B3A] transition-colors border-b last:border-0 font-sans flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="h-3 w-3 text-[#C9A24B]" /> {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Save Search Button */}
            <div className="pt-1 select-none">
              <button
                type="button"
                onClick={handleSaveSearch}
                className="w-full py-2 bg-slate-100 hover:bg-[#081B3A]/5 text-[#081B3A] border border-slate-200 text-[10px] tracking-wider uppercase font-display font-bold rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Save className="h-3.5 w-3.5 text-[#C9A24B]" /> Save Filter Criteria
              </button>
            </div>

            {/* List of Saved Searches */}
            {savedSearches.length > 0 && (
              <div className="space-y-2 border-t pt-4">
                <span className="text-[10px] tracking-widest uppercase font-bold text-slate-400 font-display block">Saved Search Queries</span>
                <div className="space-y-1.5">
                  {savedSearches.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => applySavedSearch(s.filters)}
                      className="group p-2 bg-slate-50 hover:bg-slate-100/80 border rounded border-slate-150 flex items-center justify-between text-xs text-slate-600 cursor-pointer transition-all hover:border-[#C9A24B]/30"
                    >
                      <div className="space-y-0.5 max-w-[85%]">
                        <p className="font-semibold text-slate-700 truncate text-[10px] font-sans">{s.query}</p>
                        <p className="text-[9px] text-slate-400 font-sans">{s.date}</p>
                      </div>
                      <button
                        onClick={(e) => deleteSavedSearch(s.id, e)}
                        className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-700 text-xs p-1 rounded font-bold cursor-pointer transition-opacity"
                        title="Delete query"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wishlist only Toggle Switch */}
            <div className="border-t pt-4 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer group text-xs text-slate-600 font-sans py-1">
                <input
                  type="checkbox"
                  checked={showWishlistOnly}
                  onChange={(e) => setShowWishlistOnly(e.target.checked)}
                  className="rounded border-slate-300 text-[#C9A24B] focus:ring-[#C9A24B] h-4 w-4 cursor-pointer"
                />
                <span className="flex items-center gap-1 font-medium font-display tracking-wide uppercase text-[10px] text-slate-500 group-hover:text-[#081B3A] transition-colors">
                  <Heart className={`h-3.5 w-3.5 transition-colors ${showWishlistOnly ? "fill-rose-500 text-rose-500" : "text-rose-400"}`} /> Show Wishlist Only ({wishlist.length})
                </span>
              </label>
            </div>

            {/* Type */}
            <div className="space-y-1.5 border-t pt-4">
              <label className="text-xs font-display tracking-widest uppercase font-bold text-slate-400">Property Type</label>
              <select
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value as any); setCategoryFilter("All"); }}
                className="w-full px-3 py-2 border rounded border-slate-200 text-sm outline-none bg-slate-50 focus:bg-white focus:border-[#C9A24B]"
              >
                <option value="All">All Types</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Land">Land</option>
              </select>
            </div>

            {/* Categories */}
            <div className="space-y-1.5">
              <label className="text-xs font-display tracking-widest uppercase font-bold text-slate-400">Category Tag</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded border-slate-200 text-sm outline-none bg-slate-50 focus:bg-white focus:border-[#C9A24B]"
              >
                <option value="All">All Categories</option>
                {getRelevantCategories().map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-display tracking-widest uppercase font-bold text-slate-400">Micro-Market Corridor</label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded border-slate-200 text-sm outline-none bg-slate-50 focus:bg-white focus:border-[#C9A24B]"
              >
                <option value="All">All Locations</option>
                {uniqueLocations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Bed rooms */}
            <div className="space-y-1.5">
              <label className="text-xs font-display tracking-widest uppercase font-bold text-slate-400">Beds count</label>
              <select
                value={bedsFilter}
                onChange={(e) => setBedsFilter(e.target.value as any)}
                className="w-full px-3 py-2 border rounded border-slate-200 text-sm outline-none bg-slate-50 focus:bg-white focus:border-[#C9A24B]"
              >
                <option value="All">Any bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4 Bedrooms</option>
                <option value="5">5+ Bedrooms</option>
              </select>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-display tracking-widest uppercase font-bold text-slate-400">Availability Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-3 py-2 border rounded border-slate-200 text-sm outline-none bg-slate-50 focus:bg-white focus:border-[#C9A24B]"
              >
                <option value="All">All Statuses</option>
                <option value="For Sale">For Sale</option>
                <option value="For Rent">For Rent</option>
                <option value="Pre-Launch">Pre-Launch</option>
                <option value="Handover">Ready Handover</option>
              </select>
            </div>

            {/* Price Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-display tracking-widest uppercase font-bold text-slate-400">
                <span>Cap Budget Limit</span>
                <span className="text-[#C9A24B] font-bold font-sans tracking-tight">{formatPrice(maxPrice)}</span>
              </div>
              <input
                type="range"
                min={10000000}
                max={150000000}
                step={5000000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#C9A24B]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>₹1.0 Cr</span>
                <span>₹15.0 Cr</span>
              </div>
            </div>

            {/* Recently Viewed Panel */}
            {recentlyViewed.length > 0 && (
              <div className="space-y-2 border-t pt-4">
                <span className="text-[10px] tracking-widest uppercase font-bold text-slate-400 font-display block">Recently Viewed Assets</span>
                <div className="space-y-1.5">
                  {recentlyViewed.map((rv) => (
                    <div
                      key={rv.id}
                      onClick={() => navigate(`/property/${rv.id}`)}
                      className="flex items-center gap-2 p-1 rounded bg-slate-50 hover:bg-slate-100 border border-slate-100 cursor-pointer transition-colors"
                    >
                      <img
                        src={rv.images[0]}
                        alt={rv.title}
                        className="h-8 w-11 rounded object-cover shrink-0 border"
                      />
                      <div className="min-w-0 font-sans">
                        <p className="font-semibold text-[10px] text-slate-700 truncate">{rv.title}</p>
                        <p className="text-[9px] text-[#C9A24B] font-bold font-mono">{formatPrice(rv.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SEGMENT: PROPERTIES RESULTS INDEX */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Header controls: count details, sorting mechanisms, and layout switches */}
            <div className="bg-white border border-slate-200 p-4 rounded shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm font-sans text-slate-500">
                Found <span className="font-bold text-[#081B3A]">{filteredProperties.length}</span> luxury assets matching criteria
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                {/* Sorting options dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-display font-bold uppercase shrink-0">Sort By</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-2.5 py-1.5 border border-slate-200 rounded text-xs bg-slate-50 outline-none focus:bg-white"
                  >
                    <option value="new">Advisory Popularity</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>

                {/* View switches */}
                <div className="flex border border-slate-200 rounded overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 transition-colors cursor-pointer ${viewMode === "grid" ? "bg-[#081B3A] text-[#C9A24B]" : "bg-slate-50 text-slate-400 hover:text-[#081B3A]"}`}
                    title="Grid View"
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 transition-colors cursor-pointer ${viewMode === "list" ? "bg-[#081B3A] text-[#C9A24B]" : "bg-slate-50 text-slate-400 hover:text-[#081B3A]"}`}
                    title="List View"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Loading Indicator */}
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#C9A24B]"></div>
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"}>
                
                {paginatedProperties.map((p) => (
                  <div
                    key={p.id}
                    className={`bg-white border rounded shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col ${
                      viewMode === "list" ? "md:flex-row md:h-[260px]" : ""
                    }`}
                  >
                    {/* Cover Photo */}
                    <div className={`relative overflow-hidden group ${viewMode === "list" ? "md:w-[280px] shrink-0" : "aspect-[1.5]"}`}>
                      <img
                        src={p.images[0] || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80"}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-[#081B3A] border border-[#C9A24B]/35 text-white text-[10px] tracking-widest font-display font-bold uppercase px-3 py-1 rounded">
                        {p.status}
                      </span>
                      <span className="absolute bottom-3 right-3 bg-[#C9A24B] text-[#081B3A] text-[10px] tracking-widest font-display font-medium uppercase px-2.5 py-0.5 rounded">
                        {p.category}
                      </span>
                      
                      {/* Interactive Heart Wishlist overlay button */}
                      <button
                        onClick={(e) => toggleWishlist(p.id, e)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-rose-500 hover:scale-110 transition-all shadow-md z-10 cursor-pointer"
                        title={wishlist.includes(p.id) ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <Heart className={`h-4 w-4 transition-all ${wishlist.includes(p.id) ? "fill-rose-500 text-rose-500" : "text-slate-500"}`} />
                      </button>
                    </div>

                    {/* Meta Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-start">
                          <p className="text-xs text-[#C9A24B] font-display font-bold uppercase tracking-wider flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" /> {p.location.split(",")[0]}
                          </p>
                          <span className="text-xs text-slate-300 font-mono">ID: {p.id.substring(0, 10)}</span>
                        </div>
                        <h3 className="font-display font-bold text-lg text-[#081B3A] tracking-normal mt-1 leading-snug line-clamp-1">
                          {p.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 font-sans leading-relaxed">
                          {p.description}
                        </p>
                      </div>

                      {/* Amenities Row */}
                      {p.type !== "Land" && (
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 py-1.5 border-y border-slate-100">
                          {p.bedrooms > 0 && (
                            <span className="flex items-center gap-1.5">
                              <BedDouble className="h-3.5 w-3.5 text-[#C9A24B]" /> {p.bedrooms} Beds
                            </span>
                          )}
                          {p.bathrooms > 0 && (
                            <span className="flex items-center gap-1.5">
                              <Bath className="h-3.5 w-3.5 text-[#C9A24B]" /> {p.bathrooms} Baths
                            </span>
                          )}
                          <span className="flex items-center gap-1.5">
                            <Maximize2 className="h-3.5 w-3.5 text-[#C9A24B]" /> {p.area} Sq Ft
                          </span>
                        </div>
                      )}

                      {/* Footer Actions Row */}
                      <div className="flex justify-between items-center pt-2">
                        <div className="font-display font-bold text-base text-[#081B3A]">
                          {formatPrice(p.price)}
                        </div>
                        <button
                          onClick={() => navigate(`/property/${p.id}`)}
                          className="px-4 py-2 bg-[#081B3A] hover:bg-[#122e58] text-[#C9A24B] font-display text-[10px] tracking-widest font-bold uppercase rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          VIEW DETAILS <ChevronRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty States */}
            {filteredProperties.length === 0 && !loading && (
              <div className="text-center py-24 bg-white border rounded border-slate-200 shadow-sm space-y-4">
                <p className="text-slate-400 font-sans">No properties matched your custom filters selection.</p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 rounded bg-[#081B3A] text-[#C9A24B] uppercase tracking-widest text-xs font-display font-bold"
                >
                  RESET PORTFOLIO VIEW
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-6">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setCurrentPage(idx + 1); window.scrollTo({ top: 300, behavior: "smooth" }); }}
                    className={`h-9 w-9 rounded font-display text-xs font-bold ${
                      currentPage === idx + 1
                        ? "bg-[#C9A24B] text-[#081B3A]"
                        : "bg-white text-slate-600 border border-slate-200 hover:border-[#C9A24B]/50"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
