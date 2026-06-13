import React, { useEffect, useState, JSX } from "react";
import { Property, Lead, Appointment, Blog, Project, GalleryItem, AnalyticsSummary, ActivityLog, LeadStatus } from "../types";
import { useRouter } from "../components/Router";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from "recharts";
import {
  Users, Building, FileText, CalendarCheck, TrendingUp, Search, Download, Trash, Edit, Check, CheckCircle2,
  Lock, RefreshCw, Eye, Plus, CheckSquare, Settings, Tag, MessageSquare, ShieldCheck, LogOut,
  FolderKanban, KanbanSquare, Clock, AlertCircle, PlusCircle, CheckCircle, Share2, Upload, FileCheck, CheckSquare as CheckIcon
} from "lucide-react";

interface AdminProps {
  user: { name: string; email: string; role: string } | null;
  onLogout: () => void;
}

export default function Admin({ user, onLogout }: AdminProps): JSX.Element {
  const { navigate } = useRouter();

  // Redirect to Home if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  // Tab State
  const [activeTab, setActiveTab] = useState<"overview" | "properties" | "leads" | "projects" | "cms" | "seo" | "logs">("overview");
  
  // Leads Sub-view: "list" or "kanban"
  const [leadsViewMode, setLeadsViewMode] = useState<"list" | "kanban">("kanban");

  // Dynamic Data Lists
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter states
  const [leadsSearch, setLeadsSearch] = useState("");
  const [propsSearch, setPropsSearch] = useState("");

  // CRUD property modal state
  const [showPropModal, setShowPropModal] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [propForm, setPropForm] = useState({
    title: "",
    type: "Residential" as Property["type"],
    category: "Apartment" as Property["category"],
    price: 35000000,
    location: "Jubilee Hills, Hyderabad",
    address: "",
    area: 2500,
    bedrooms: 3,
    bathrooms: 3,
    parking: 2,
    description: "",
    images: [] as string[],
    videos: [] as string[],
    floorPlanUrl: "",
    status: "For Sale" as Property["status"],
    featured: false,
    amenities: ["Security", "Power Backup"] as string[],
    seoTitle: "",
    seoDescription: ""
  });
  const [newImgUrl, setNewImgUrl] = useState("");

  // Bulk import property state
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkJsonText, setBulkJsonText] = useState("");

  // CRUD Project state
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState({
    name: "",
    location: "Financial District, Hyderabad",
    status: "Under Construction" as Project["status"],
    description: "",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    completionDate: "December 2028",
    constructionProgress: 45,
    timeline: [] as { date: string; title: string; description: string; completed: boolean }[],
    amenities: [] as string[]
  });
  const [newTimelineDate, setNewTimelineDate] = useState("");
  const [newTimelineTitle, setNewTimelineTitle] = useState("");
  const [newTimelineDesc, setNewTimelineDesc] = useState("");
  const [newProjAmenity, setNewProjAmenity] = useState("");

  // Lead details / timeline / reminders modal state
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadNoteText, setLeadNoteText] = useState("");
  const [leadStatusVal, setLeadStatusVal] = useState<Lead["status"]>("New");
  const [leadAssignedAgent, setLeadAssignedAgent] = useState("");
  const [newReminderDate, setNewReminderDate] = useState("");
  const [newReminderNote, setNewReminderNote] = useState("");

  // CMS Blog Add state
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogExcerpt, setNewBlogExcerpt] = useState("");
  const [newBlogCategory, setNewBlogCategory] = useState<Blog["category"]>("Real Estate News");
  const [newBlogContent, setNewBlogContent] = useState("");

  // CMS Gallery Add state
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const [newGalleryTitle, setNewGalleryTitle] = useState("");
  const [newGalleryCat, setNewGalleryCat] = useState<GalleryItem["category"]>("Property");

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/properties").then(res => res.json()),
      fetch("/api/leads/list").then(res => res.json()),
      fetch("/api/appointments/list").then(res => res.json()),
      fetch("/api/blogs").then(res => res.json()),
      fetch("/api/projects").then(res => res.json()),
      fetch("/api/gallery").then(res => res.json()),
      fetch("/api/activity-logs").then(res => res.json()),
      fetch("/api/analytics/summary").then(res => res.json())
    ]).then(([props, leds, appts, blgs, projs, gal, logs, anlyt]) => {
      setProperties(props);
      setLeads(leds);
      setAppointments(appts);
      setBlogs(blgs);
      setProjects(projs);
      setGallery(gal);
      setActivityLogs(logs);
      setAnalytics(anlyt);
      setLoading(false);
    }).catch(err => {
      console.error("Dashboard fetch chain failed", err);
      setLoading(false);
    });
  };

  if (!user) return <div className="min-h-screen bg-slate-50"></div>;

  const COLORS = ["#081B3A", "#C9A24B", "#E5C07B", "#5C7599", "#8E1E1E"];

  // Kanban Stage configuration
  const CRM_STAGES: LeadStatus[] = [
    "New", "Contacted", "Qualified", "Interested", "Site Visit", "Negotiation", "Closed Won", "Closed Lost"
  ];

  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
    setLeadNoteText(lead.notes || "");
    setLeadStatusVal(lead.status);
    setLeadAssignedAgent(lead.assignedTo || "");
  };

  // Update Lead Status from Kanban panel directly
  const handleUpdateLeadStatus = (leadId: string, nextStatus: LeadStatus) => {
    fetch(`/api/leads/${leadId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus, operatorEmail: user.email })
    })
      .then(res => res.json())
      .then(() => {
        loadDashboardData();
      })
      .catch(err => console.error(err));
  };

  // Add notes & reminders to Lead inside details panel
  const handleSaveLeadProgress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;

    fetch(`/api/leads/${selectedLead.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notes: leadNoteText,
        status: leadStatusVal,
        assignedTo: leadAssignedAgent,
        operatorEmail: user.email
      })
    })
      .then(res => res.json())
      .then(() => {
        setSelectedLead(null);
        loadDashboardData();
      })
      .catch((err) => console.error(err));
  };

  const handleAddLeadReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newReminderDate || !newReminderNote.trim()) return;

    const newReminders = [
      ...(selectedLead.reminders || []),
      {
        id: `rem-${Date.now()}`,
        date: newReminderDate,
        note: newReminderNote.trim(),
        completed: false
      }
    ];

    fetch(`/api/leads/${selectedLead.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reminders: newReminders, operatorEmail: user.email })
    })
      .then(res => res.json())
      .then(data => {
        setSelectedLead(data);
        setNewReminderDate("");
        setNewReminderNote("");
        loadDashboardData();
      })
      .catch(err => console.error(err));
  };

  const handleToggleReminderCompleted = (reminderId: string, checked: boolean) => {
    if (!selectedLead) return;
    const updated = selectedLead.reminders?.map(r => r.id === reminderId ? { ...r, completed: checked } : r) || [];

    fetch(`/api/leads/${selectedLead.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reminders: updated, operatorEmail: user.email })
    })
      .then(res => res.json())
      .then(data => {
        setSelectedLead(data);
        loadDashboardData();
      })
      .catch(err => console.error(err));
  };

  // Export Leads dataset to CSV
  const handleExportLeads = () => {
    const headers = ["ID", "Name", "Email", "Phone", "Status", "Source", "Property", "Assigned Agent", "Notes", "Created At\n"];
    const rows = leads.map(l => (
      `"${l.id}","${l.name}","${l.email}","${l.phone}","${l.status}","${l.source}","${l.propertyName || 'General'}","${l.assignedTo || 'Unassigned'}","${(l.notes || '').replace(/"/g, '""')}","${l.createdAt}"\n`
    ));
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + rows.join("");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `VM_LEADS_REPORT_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Bulk Property Import handler
  const handleBulkImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(bulkJsonText);
      const items = Array.isArray(parsed) ? parsed : [parsed];

      const imports = items.map(item => {
        return fetch("/api/properties/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...item, adminEmail: user.email })
        });
      });

      Promise.all(imports).then(() => {
        alert(`Successfully imported ${items.length} properties.`);
        setShowBulkModal(false);
        setBulkJsonText("");
        loadDashboardData();
      });
    } catch (err) {
      alert("Invalid JSON format. Check payload syntax details.");
    }
  };

  // Bulk Properties Export handler
  const handleBulkExportProperties = () => {
    const jsonContent = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(properties, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", jsonContent);
    link.setAttribute("download", `VM_PROPERTIES_EXPORT_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Project modal handlers
  const handleStartProjectEdit = (proj: Project) => {
    setEditingProjectId(proj.id);
    setProjectForm({
      name: proj.name,
      location: proj.location,
      status: proj.status,
      description: proj.description,
      image: proj.image,
      completionDate: proj.completionDate,
      constructionProgress: proj.constructionProgress || 0,
      timeline: proj.timeline || [],
      amenities: proj.amenities || []
    });
    setShowProjectModal(true);
  };

  const handleClearProjectForm = () => {
    setEditingProjectId(null);
    setProjectForm({
      name: "",
      location: "Financial District, Hyderabad",
      status: "Under Construction",
      description: "",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
      completionDate: "December 2028",
      constructionProgress: 0,
      timeline: [],
      amenities: []
    });
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = editingProjectId !== null;
    const url = isEdit ? `/api/projects/${editingProjectId}` : "/api/projects/create";
    const method = isEdit ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...projectForm, operatorEmail: user.email })
    })
      .then(res => res.json())
      .then(() => {
        alert(isEdit ? "Project records synchronized!" : "New project added successfully!");
        setShowProjectModal(false);
        setEditingProjectId(null);
        loadDashboardData();
      })
      .catch(err => console.error(err));
  };

  const handleDeleteProject = (id: string) => {
    if (confirm("Erase project permanently?")) {
      fetch(`/api/projects/${id}`, { method: "DELETE" })
        .then(() => {
          alert("Project deleted from database.");
          loadDashboardData();
        });
    }
  };

  const handleAddTimelineStep = () => {
    if (newTimelineTitle && newTimelineDate) {
      setProjectForm({
        ...projectForm,
        timeline: [...projectForm.timeline, { date: newTimelineDate, title: newTimelineTitle, description: newTimelineDesc, completed: false }]
      });
      setNewTimelineDate("");
      setNewTimelineTitle("");
      setNewTimelineDesc("");
    }
  };

  const handleClearForm = () => {
    setEditingPropertyId(null);
    setPropForm({
      title: "",
      type: "Residential" as Property["type"],
      category: "Apartment" as Property["category"],
      price: 35000000,
      location: "Jubilee Hills, Hyderabad",
      address: "",
      area: 2500,
      bedrooms: 3,
      bathrooms: 3,
      parking: 2,
      description: "",
      images: [] as string[],
      videos: [] as string[],
      floorPlanUrl: "",
      status: "For Sale" as Property["status"],
      featured: false,
      amenities: ["Security", "Power Backup"] as string[],
      seoTitle: "",
      seoDescription: ""
    });
    setNewImgUrl("");
  };

  // Property Modal handlers
  const handleStartEdit = (p: Property) => {
    setEditingPropertyId(p.id);
    setPropForm({
      title: p.title,
      type: p.type,
      category: p.category,
      price: p.price,
      location: p.location,
      address: p.address,
      area: p.area,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      parking: p.parking,
      description: p.description,
      images: p.images,
      videos: p.videos || [],
      floorPlanUrl: p.floorPlanUrl || "",
      status: p.status,
      featured: p.featured,
      amenities: p.amenities,
      seoTitle: p.seoTitle || "",
      seoDescription: p.seoDescription || ""
    });
    setShowPropModal(true);
  };

  const handleSaveProperty = (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = editingPropertyId !== null;
    const url = isEdit ? `/api/properties/${editingPropertyId}` : "/api/properties/create";
    const method = isEdit ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...propForm,
        adminEmail: user.email,
        seoTitle: propForm.seoTitle || `${propForm.title} in ${propForm.location} | VM Properties`,
        seoDescription: propForm.seoDescription || `Exclusive catalog offering ${propForm.title} details in ${propForm.location}.`
      })
    })
      .then(res => res.json())
      .then(() => {
        alert(isEdit ? "Property records updated!" : "New Property registered!");
        setShowPropModal(false);
        setEditingPropertyId(null);
        loadDashboardData();
      })
      .catch(err => console.error(err));
  };

  const handleDeleteProp = (id: string) => {
    if (confirm("Delete property?")) {
      fetch(`/api/properties/${id}?adminEmail=${user.email}`, { method: "DELETE" })
        .then(() => {
          alert("Property deleted.");
          loadDashboardData();
        });
    }
  };

  // CMS add items
  const handleAddBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogTitle.trim() || !newBlogContent.trim()) return;

    fetch("/api/blogs/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newBlogTitle,
        excerpt: newBlogExcerpt || "Premium Market briefing updates",
        content: newBlogContent,
        category: newBlogCategory,
        author: user.name,
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
        tags: ["Market", "Appreciation", "Intelligence"],
        adminEmail: user.email
      })
    })
      .then(res => res.json())
      .then(() => {
        alert("Blog published!");
        setNewBlogTitle("");
        setNewBlogExcerpt("");
        setNewBlogContent("");
        loadDashboardData();
      })
      .catch(err => console.error(err));
  };

  const handleAddGallerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryUrl.trim()) return;

    fetch("/api/gallery/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newGalleryTitle || "Luxury Spatial Layout",
        category: newGalleryCat,
        imageUrl: newGalleryUrl
      })
    })
      .then(res => res.json())
      .then(() => {
        alert("Gallery image added!");
        setNewGalleryTitle("");
        setNewGalleryUrl("");
        loadDashboardData();
      })
      .catch(err => console.error(err));
  };

  // Search filter matching
  const filteredProps = properties.filter((p) => (
    p.title.toLowerCase().includes(propsSearch.toLowerCase()) ||
    p.location.toLowerCase().includes(propsSearch.toLowerCase())
  ));

  const filteredLeads = leads.filter((l) => (
    l.name.toLowerCase().includes(leadsSearch.toLowerCase()) ||
    l.phone.includes(leadsSearch) ||
    l.email.toLowerCase().includes(leadsSearch.toLowerCase()) ||
    (l.propertyName || "").toLowerCase().includes(leadsSearch.toLowerCase())
  ));

  return (
    <div className="pt-24 min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col">
      {/* Brand Dashboard header */}
      <div className="bg-[#081B3A] text-white px-6 py-5 border-b border-[#C9A24B]/30 flex flex-col md:flex-row justify-between items-center gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-[#C9A24B]" />
          <div>
            <h1 className="font-display font-bold text-lg tracking-wider text-[#C9A24B] uppercase">VM CONGRUENT ADMIN PANEL</h1>
            <p className="text-[10px] text-slate-300">Authorized Operator: {user.name} ({user.role})</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold">
          <button
            onClick={loadDashboardData}
            title="Reload Data"
            className="p-2 rounded bg-white/5 hover:bg-white/10 text-[#C9A24B] border border-[#C9A24B]/25 transition cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded text-white tracking-wider uppercase font-display flex items-center gap-2 transition cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" /> EXIT CONSOLE
          </button>
        </div>
      </div>

      {/* Tabs list */}
      <div className="bg-white border-b flex overflow-x-auto text-xs font-display tracking-widest font-bold uppercase shrink-0">
        {(["overview", "properties", "leads", "projects", "cms", "seo", "logs"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 border-b-2 text-center shrink-0 transition-colors cursor-pointer ${
              activeTab === tab
                ? "border-[#C9A24B] text-[#C9A24B] font-extrabold bg-[#081B3A]/5"
                : "border-transparent text-slate-600 hover:text-[#081B3A] hover:bg-slate-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-4 sm:p-6 flex-1 max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#C9A24B]"></div>
          </div>
        ) : (
          <div>
            {/* TAB: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-8 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border p-5 rounded shadow-sm flex items-center gap-4">
                    <div className="p-3.5 rounded bg-blue-100 text-[#081B3A]"><Building className="h-6 w-6" /></div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Properties Listed</p>
                      <p className="text-2xl font-bold mt-0.5">{properties.length}</p>
                    </div>
                  </div>
                  <div className="bg-white border p-5 rounded shadow-sm flex items-center gap-4">
                    <div className="p-3.5 rounded bg-[#C9A24B]/10 text-[#C9A24B]"><Users className="h-6 w-6" /></div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Client Leads</p>
                      <p className="text-2xl font-bold mt-0.5">{leads.length}</p>
                    </div>
                  </div>
                  <div className="bg-white border p-5 rounded shadow-sm flex items-center gap-4">
                    <div className="p-3.5 rounded bg-emerald-100 text-emerald-800"><CalendarCheck className="h-6 w-6" /></div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Site Visits Schedule</p>
                      <p className="text-2xl font-bold mt-0.5">{appointments.length}</p>
                    </div>
                  </div>
                  <div className="bg-white border p-5 rounded shadow-sm flex items-center gap-4">
                    <div className="p-3.5 rounded bg-purple-100 text-purple-800"><TrendingUp className="h-6 w-6" /></div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Site Tour Conversion</p>
                      <p className="text-2xl font-bold mt-0.5">{analytics?.conversionRate || 18}%</p>
                    </div>
                  </div>
                </div>

                {/* Recharts Analytics Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Traffic vs Views */}
                  <div className="lg:col-span-8 bg-white border rounded p-5 shadow-sm space-y-4">
                    <h3 className="font-display font-semibold text-sm tracking-wider uppercase text-[#081B3A] border-b pb-2">
                      Weekly Visitor & Views Analytics
                    </h3>
                    <div className="h-64 mt-4">
                      {analytics?.visitorTrend && (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={analytics.visitorTrend}>
                            <defs>
                              <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#081B3A" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#081B3A" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#C9A24B" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#C9A24B" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip contentStyle={{ fontSize: 11 }} />
                            <Area type="monotone" dataKey="visitors" stroke="#081B3A" fillOpacity={1} fill="url(#colorVis)" />
                            <Area type="monotone" dataKey="views" stroke="#C9A24B" fillOpacity={1} fill="url(#colorViews)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>

                  {/* Device splits */}
                  <div className="lg:col-span-4 bg-white border rounded p-5 shadow-sm flex flex-col justify-between">
                    <div>
                      <h3 className="font-display font-semibold text-sm tracking-wider uppercase text-[#081B3A] border-b pb-2 mb-4">
                        Access Device Splits
                      </h3>
                      <div className="h-40 flex items-center justify-center">
                        {analytics?.deviceAnalytics && (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={analytics.deviceAnalytics}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={60}
                                fill="#8884d8"
                                paddingAngle={3}
                                dataKey="value"
                              >
                                {analytics.deviceAnalytics.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip contentStyle={{ fontSize: 11 }} />
                            </PieChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1.5 text-[10px] mt-4 font-sans">
                      {analytics?.deviceAnalytics?.map((entry, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-50 p-1.5 rounded">
                          <span className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                            {entry.name}
                          </span>
                          <span className="font-bold">{entry.value} clicks</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Second Row Analytics: Traffic sources & Pipeline conversions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Traffic Channels */}
                  <div className="bg-white border rounded p-5 shadow-sm space-y-4">
                    <h3 className="font-display font-semibold text-sm tracking-wider uppercase text-[#081B3A] border-b pb-2">
                      HNI Traffic Acquisition Channels
                    </h3>
                    <div className="h-60 mt-2">
                      {analytics?.trafficSources && (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={analytics.trafficSources} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis type="number" tick={{ fontSize: 10 }} />
                            <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={110} />
                            <Tooltip contentStyle={{ fontSize: 11 }} />
                            <Bar dataKey="value" fill="#C9A24B" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>

                  {/* Monthly Pipeline */}
                  <div className="bg-white border rounded p-5 shadow-sm space-y-4">
                    <h3 className="font-display font-semibold text-sm tracking-wider uppercase text-[#081B3A] border-b pb-2">
                      Monthly CRM Leads vs Visits Conversion
                    </h3>
                    <div className="h-60 mt-2">
                      {analytics?.monthlyConversions && (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={analytics.monthlyConversions}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip contentStyle={{ fontSize: 11 }} />
                            <Legend wrapperStyle={{ fontSize: 10 }} />
                            <Line type="monotone" dataKey="leads" stroke="#081B3A" strokeWidth={2.5} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="visits" stroke="#C9A24B" strokeWidth={2.5} />
                          </LineChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: PROPERTIES */}
            {activeTab === "properties" && (
              <div className="space-y-6 animate-fadeIn font-sans">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border p-4 rounded shadow-sm">
                  <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-50 border rounded w-full sm:max-w-xs text-xs">
                    <Search className="h-4 w-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search listed assets title..."
                      value={propsSearch}
                      onChange={(e) => setPropsSearch(e.target.value)}
                      className="bg-transparent outline-none text-slate-700 w-full"
                    />
                  </div>

                  <div className="flex gap-2 flex-wrap w-full sm:w-auto justify-end">
                    <button
                      onClick={() => setShowBulkModal(true)}
                      className="px-4 py-2 rounded bg-slate-100 hover:bg-slate-200 text-[#081B3A] font-display text-xs font-bold uppercase border flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="h-3.5 w-3.5 text-[#C9A24B]" /> Bulk Import
                    </button>
                    <button
                      onClick={handleBulkExportProperties}
                      className="px-4 py-2 rounded bg-slate-100 hover:bg-slate-200 text-[#081B3A] font-display text-xs font-bold uppercase border flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5 text-[#C9A24B]" /> Bulk Export
                    </button>
                    <button
                      onClick={() => { handleClearForm(); setShowPropModal(true); }}
                      className="px-5 py-2 rounded bg-[#081B3A] text-white hover:bg-slate-900 font-display text-xs tracking-widest font-bold uppercase flex items-center gap-2 cursor-pointer border border-[#C9A24B]/30"
                    >
                      <Plus className="h-4 w-4 text-[#C9A24B]" /> REGISTER ASSET
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="bg-white border rounded shadow-sm overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b text-slate-400 font-display font-bold uppercase tracking-wider">
                        <th className="p-3.5">Asset description</th>
                        <th className="p-3.5">Location</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5">Valuation price</th>
                        <th className="p-3.5 text-right">Controls</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-slate-600">
                      {filteredProps.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <img src={p.images[0]} alt="p" className="h-10 w-14 rounded object-cover border shrink-0" />
                              <div>
                                <div className="font-bold text-[#081B3A] text-sm">{p.title}</div>
                                <div className="text-slate-400 font-sans mt-0.5">{p.area} Sq Ft • {p.bedrooms} BHK</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5 text-slate-500">{p.location}</td>
                          <td className="p-3.5"><span className="p-1 px-2.5 rounded bg-slate-100 text-[#081B3A] font-bold">{p.status}</span></td>
                          <td className="p-3.5 font-semibold text-[#081B3A]">{p.category}</td>
                          <td className="p-3.5 font-bold">
                            {p.price >= 10000000 ? `₹${(p.price / 10000000).toFixed(2)} Cr` : `₹${(p.price / 100000).toFixed(1)} L`}
                          </td>
                          <td className="p-3.5 text-right space-x-1">
                            <button onClick={() => handleStartEdit(p)} className="p-2 text-blue-600 hover:bg-slate-100 rounded cursor-pointer transition">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDeleteProp(p.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded cursor-pointer transition">
                              <Trash className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: LEADS (KANBAN / LIST VIEW) */}
            {activeTab === "leads" && (
              <div className="space-y-6 animate-fadeIn font-sans">
                {/* Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border p-4 rounded shadow-sm">
                  <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-50 border rounded w-full sm:max-w-xs text-xs">
                    <Search className="h-4 w-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search secure leads records..."
                      value={leadsSearch}
                      onChange={(e) => setLeadsSearch(e.target.value)}
                      className="bg-transparent outline-none text-slate-700 w-full"
                    />
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <div className="flex border rounded overflow-hidden text-xs font-display font-bold">
                      <button
                        onClick={() => setLeadsViewMode("kanban")}
                        className={`px-4 py-2 transition ${leadsViewMode === "kanban" ? "bg-[#081B3A] text-[#C9A24B]" : "bg-slate-50 text-slate-500"}`}
                      >
                        Kanban Board
                      </button>
                      <button
                        onClick={() => setLeadsViewMode("list")}
                        className={`px-4 py-2 transition ${leadsViewMode === "list" ? "bg-[#081B3A] text-[#C9A24B]" : "bg-slate-50 text-slate-500"}`}
                      >
                        List Table
                      </button>
                    </div>
                    <button
                      onClick={handleExportLeads}
                      className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-display text-xs tracking-wider font-bold uppercase flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <Download className="h-4 w-4" /> Export CSV
                    </button>
                  </div>
                </div>

                {/* VIEW: KANBAN BOARD */}
                {leadsViewMode === "kanban" ? (
                  <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4 overflow-x-auto pb-4">
                    {CRM_STAGES.map((stage) => {
                      const stageLeads = filteredLeads.filter(l => l.status === stage);
                      return (
                        <div key={stage} className="bg-slate-50 border border-slate-200/80 rounded p-3 shrink-0 w-64 min-h-[500px] flex flex-col justify-between">
                          <div className="space-y-3 flex-1">
                            <div className="border-b pb-2 flex justify-between items-center font-display font-bold">
                              <span className="text-slate-700 text-[10px] uppercase tracking-wider">{stage}</span>
                              <span className="bg-[#081B3A]/5 text-[#081B3A] text-[9px] px-2 py-0.5 rounded-full">{stageLeads.length}</span>
                            </div>

                            <div className="space-y-2.5">
                              {stageLeads.map((l) => (
                                <div
                                  key={l.id}
                                  onClick={() => handleSelectLead(l)}
                                  className="bg-white border border-slate-150 p-3 rounded shadow-sm hover:border-[#C9A24B]/40 cursor-pointer transition-all space-y-2 text-[11px]"
                                >
                                  <div>
                                    <p className="font-bold text-[#081B3A] text-xs leading-tight line-clamp-1">{l.name}</p>
                                    <p className="text-slate-400 font-mono text-[9px] mt-0.5">{l.phone}</p>
                                  </div>
                                  <p className="text-[10px] text-slate-500 font-sans line-clamp-2 leading-tight bg-slate-50 p-1.5 rounded">{l.message}</p>
                                  <div className="flex justify-between items-center text-[9px] pt-1.5 border-t border-slate-100 text-slate-400 font-display font-bold">
                                    <span className="uppercase text-[#C9A24B]">{l.source}</span>
                                    <span>{new Date(l.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</span>
                                  </div>

                                  {/* Shift controls */}
                                  <div className="flex justify-between gap-1 pt-1.5 border-t border-slate-50" onClick={e => e.stopPropagation()}>
                                    {CRM_STAGES.indexOf(stage) > 0 && (
                                      <button
                                        onClick={() => handleUpdateLeadStatus(l.id, CRM_STAGES[CRM_STAGES.indexOf(stage) - 1])}
                                        className="p-1 px-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold"
                                        title="Move Left"
                                      >
                                        ◀
                                      </button>
                                    )}
                                    <span className="text-[8px] text-slate-400 font-medium py-1">Shift stage</span>
                                    {CRM_STAGES.indexOf(stage) < CRM_STAGES.length - 1 && (
                                      <button
                                        onClick={() => handleUpdateLeadStatus(l.id, CRM_STAGES[CRM_STAGES.indexOf(stage) + 1])}
                                        className="p-1 px-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold"
                                        title="Move Right"
                                      >
                                        ▶
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* VIEW: LIST VIEW */
                  <div className="bg-white border rounded shadow-sm overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b text-slate-400 font-display font-bold uppercase tracking-wider">
                          <th className="p-3">Prospect name</th>
                          <th className="p-3">Contact</th>
                          <th className="p-3">Property</th>
                          <th className="p-3">Source</th>
                          <th className="p-3">Agent Assigned</th>
                          <th className="p-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y text-slate-600">
                        {filteredLeads.map((l) => (
                          <tr key={l.id} className="hover:bg-slate-50/50 cursor-pointer" onClick={() => handleSelectLead(l)}>
                            <td className="p-3 font-semibold text-[#081B3A]">{l.name}</td>
                            <td className="p-3 font-mono">{l.phone} • {l.email}</td>
                            <td className="p-3 max-w-[200px] truncate">{l.propertyName || "General Inquiry"}</td>
                            <td className="p-3"><span className="p-1 px-2 rounded bg-slate-100 font-bold font-display uppercase tracking-wider text-[9px]">{l.source}</span></td>
                            <td className="p-3 text-[#C9A24B] font-medium">{l.assignedTo || "Unassigned"}</td>
                            <td className="p-3 text-right">
                              <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                                l.status === "New" ? "bg-blue-100 text-blue-700" :
                                l.status === "Contacted" ? "bg-amber-100 text-amber-700" :
                                l.status === "Closed Won" ? "bg-emerald-100 text-emerald-700" :
                                "bg-purple-100 text-purple-700"
                              }`}>{l.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB: PROJECTS MANAGEMENT */}
            {activeTab === "projects" && (
              <div className="space-y-6 animate-fadeIn font-sans">
                <div className="flex justify-between items-center bg-white border p-4 rounded shadow-sm">
                  <h3 className="font-display font-semibold text-sm tracking-wider uppercase text-[#081B3A]">
                    Sovereign Developments commissions
                  </h3>
                  <button
                    onClick={() => { handleClearProjectForm(); setShowProjectModal(true); }}
                    className="px-5 py-2 rounded bg-[#081B3A] text-white hover:bg-slate-900 font-display text-xs tracking-widest font-bold uppercase flex items-center gap-2 cursor-pointer border border-[#C9A24B]/30"
                  >
                    <Plus className="h-4 w-4 text-[#C9A24B]" /> REGISTER DEVELOPMENT
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((proj) => (
                    <div key={proj.id} className="bg-white border rounded shadow-sm overflow-hidden flex flex-col justify-between">
                      <div className="aspect-video relative overflow-hidden bg-slate-900">
                        <img src={proj.image} alt={proj.name} className="w-full h-full object-cover" />
                        <span className="absolute top-3 left-3 bg-[#081B3A] border border-[#C9A24B]/30 text-white text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded font-display font-bold">
                          {proj.status}
                        </span>
                      </div>
                      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <span className="text-[9px] font-display font-bold uppercase text-[#C9A24B] tracking-wider">{proj.location}</span>
                          <h4 className="font-display font-bold text-[#081B3A] text-base leading-tight">{proj.name}</h4>
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{proj.description}</p>
                          
                          {/* Progress bar */}
                          <div className="space-y-1.5 pt-2 font-sans">
                            <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                              <span>Construction Progress</span>
                              <span>{proj.constructionProgress || 45}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div style={{ width: `${proj.constructionProgress || 45}%` }} className="h-full bg-[#C9A24B]"></div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 mt-4">
                          <button onClick={() => handleStartProjectEdit(proj)} className="p-2 text-blue-600 hover:bg-slate-50 rounded cursor-pointer">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDeleteProject(proj.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded cursor-pointer">
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: CMS CONTROLS FOR BLOGS & GALLERY */}
            {activeTab === "cms" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn font-sans">
                {/* CMS: Blog Publisher */}
                <div className="bg-white border p-6 rounded shadow-sm space-y-4">
                  <div className="border-b pb-2 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#C9A24B]" />
                    <h3 className="font-display font-bold text-[#081B3A] text-sm tracking-wider uppercase">CMS: Blog Brief Publisher</h3>
                  </div>

                  <form onSubmit={handleAddBlogSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs uppercase font-bold text-slate-400 font-display">Blog Title</label>
                      <input
                        type="text"
                        required
                        value={newBlogTitle}
                        onChange={(e) => setNewBlogTitle(e.target.value)}
                        placeholder="Why Hyderabad remains India's Top Luxury Destination..."
                        className="w-full px-3.5 py-2.5 border rounded text-xs bg-slate-50 focus:bg-white outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs uppercase font-bold text-slate-400 font-display">Outline Synopsis Excerpt</label>
                      <input
                        type="text"
                        required
                        value={newBlogExcerpt}
                        onChange={(e) => setNewBlogExcerpt(e.target.value)}
                        placeholder="A short tagline briefing..."
                        className="w-full px-3.5 py-2.5 border rounded text-xs bg-slate-50 focus:bg-white outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs uppercase font-bold text-slate-400 font-display">Target Category</label>
                      <select
                        value={newBlogCategory}
                        onChange={(e) => setNewBlogCategory(e.target.value as any)}
                        className="w-full px-3 py-2 border rounded text-xs bg-slate-50 outline-none"
                      >
                        <option value="Real Estate News">Real Estate News</option>
                        <option value="Investment Tips">Investment Tips</option>
                        <option value="Property Guides">Property Guides</option>
                        <option value="Market Trends">Market Trends</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs uppercase font-bold text-slate-400 font-display">Content Body (supports markdown ## headings)</label>
                      <textarea
                        rows={6}
                        required
                        value={newBlogContent}
                        onChange={(e) => setNewBlogContent(e.target.value)}
                        placeholder="## Section Title..."
                        className="w-full p-2.5 border rounded text-xs outline-none bg-slate-50 focus:bg-white"
                      ></textarea>
                    </div>

                    <button
                      id="cms-publish-blog-btn"
                      type="submit"
                      className="w-full py-3 bg-[#081B3A] hover:bg-slate-900 border border-[#C9A24B]/30 text-[#C9A24B] font-display text-xs tracking-widest font-bold uppercase rounded cursor-pointer transition shadow"
                    >
                      PUBLISH ADVISORY BLOG
                    </button>
                  </form>
                </div>

                {/* CMS: Gallery Asset Adder */}
                <div className="bg-white border p-6 rounded shadow-sm space-y-4 h-fit">
                  <div className="border-b pb-2 flex items-center gap-2">
                    <Tag className="h-5 w-5 text-[#C9A24B]" />
                    <h3 className="font-display font-bold text-[#081B3A] text-sm tracking-wider uppercase">CMS: Media Gallery Asset Adder</h3>
                  </div>

                  <form onSubmit={handleAddGallerySubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs uppercase font-bold text-slate-400 font-display">Asset Image URL</label>
                      <input
                        type="text"
                        required
                        value={newGalleryUrl}
                        onChange={(e) => setNewGalleryUrl(e.target.value)}
                        placeholder="Enter direct Unsplash / CDN image URL..."
                        className="w-full px-3.5 py-2.5 border rounded text-xs bg-slate-50 focus:bg-white outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase font-bold text-slate-400 font-display">Asset Title label</label>
                        <input
                          type="text"
                          required
                          value={newGalleryTitle}
                          onChange={(e) => setNewGalleryTitle(e.target.value)}
                          placeholder="e.g. Master Bedroom layout"
                          className="w-full px-3.5 py-2.5 border rounded text-xs bg-slate-50 focus:bg-white outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs uppercase font-bold text-slate-400 font-display">Classification</label>
                        <select
                          value={newGalleryCat}
                          onChange={(e) => setNewGalleryCat(e.target.value as any)}
                          className="w-full px-2.5 py-2.5 border rounded text-xs bg-slate-50 outline-none"
                        >
                          <option value="Property">Property</option>
                          <option value="Project">Project</option>
                          <option value="Event">Event</option>
                        </select>
                      </div>
                    </div>

                    <button
                      id="cms-publish-gallery-btn"
                      type="submit"
                      className="w-full py-3 bg-[#C9A24B] hover:bg-[#E5C07B] text-[#081B3A] font-display text-xs tracking-widest font-bold uppercase rounded cursor-pointer transition shadow"
                    >
                      ADD VISUAL ASSET IMAGERY
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB: SEO & METADATA MANAGEMENT */}
            {activeTab === "/admin" || activeTab === "seo" && (
              <div className="bg-white border rounded p-6 shadow-sm space-y-6 animate-fadeIn font-sans">
                <div className="border-b pb-3 flex justify-between items-center text-[#081B3A]">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-6 w-6 text-[#C9A24B]" />
                    <h3 className="font-display font-bold text-sm tracking-wider uppercase">Sovereign SEO & Metadata Monitors</h3>
                  </div>
                  <span className="p-1.5 px-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded">SEO Health Score: 98/100</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
                  {/* Sitemap preview */}
                  <div className="bg-slate-50 border rounded p-4 space-y-3">
                    <h4 className="font-display font-bold text-xs tracking-wide text-[#081B3A] border-b pb-1">XML SITEMAP INDEX</h4>
                    <pre className="text-[9px] text-slate-500 select-all leading-relaxed whitespace-pre-wrap font-mono max-h-40 overflow-y-auto p-2 bg-white rounded border">
{`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://vmproperties.com/</loc><priority>1.0</priority></url>
  <url><loc>https://vmproperties.com/properties</loc><priority>0.9</priority></url>
  <url><loc>https://vmproperties.com/projects</loc><priority>0.8</priority></url>
  <url><loc>https://vmproperties.com/blog</loc><priority>0.7</priority></url>
</urlset>`}
                    </pre>
                  </div>

                  {/* Robots preview */}
                  <div className="bg-slate-50 border rounded p-4 space-y-3">
                    <h4 className="font-display font-bold text-xs tracking-wide text-[#081B3A] border-b pb-1">ROBOTS.TXT TARGET</h4>
                    <pre className="text-[9px] text-slate-500 select-all leading-relaxed whitespace-pre-wrap font-mono max-h-40 overflow-y-auto p-2 bg-white rounded border">
{`User-agent: *
Allow: /
Disallow: /admin
Disallow: /client

Sitemap: https://vmproperties.com/sitemap.xml`}
                    </pre>
                  </div>

                  {/* OpenGraph mockup preview */}
                  <div className="bg-slate-50 border rounded p-4 space-y-3 font-sans text-xs">
                    <h4 className="font-display font-bold text-xs tracking-wide text-[#081B3A] border-b pb-1">OPENGRAPH CARD PREVIEW</h4>
                    <div className="bg-white border rounded shadow overflow-hidden font-sans">
                      <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80" alt="card" className="aspect-video object-cover w-full" />
                      <div className="p-3 space-y-1">
                        <p className="font-bold text-[#081B3A] text-[11px] truncate">VM Properties | Ultra Luxury Real Estate</p>
                        <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">Prestige villas, premium commercial complexes, and appreciating gated residential plots in Jubilee Hills.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: AUDIT LOGS SECURITY LIST */}
            {activeTab === "logs" && (
              <div className="bg-white border rounded p-6 shadow-sm space-y-4 animate-fadeIn font-sans">
                <div className="border-b pb-2 flex items-center gap-2 text-[#081B3A]">
                  <Lock className="h-5 w-5 text-[#C9A24B]" />
                  <h3 className="font-display font-bold text-sm tracking-wider uppercase">Activity Logs Audit Trail (Security Audit)</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="bg-slate-50 border-b text-slate-400 font-display font-bold uppercase tracking-wider">
                        <th className="p-3">Timestamp</th>
                        <th className="p-3">User Email</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Action Signature</th>
                        <th className="p-3 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-slate-600 text-[11px]">
                      {activityLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/70">
                          <td className="p-3 text-slate-400 whitespace-nowrap">{new Date(log.timestamp).toLocaleString("en-IN")}</td>
                          <td className="p-3 font-semibold text-slate-700">{log.userEmail}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded font-bold text-[9px] ${
                              log.userRole === "Admin" ? "bg-[#C9A24B]/15 text-[#C9A24B]" :
                              log.userRole === "Agent" ? "bg-blue-50 text-blue-700 border" :
                              "bg-slate-100 text-slate-500"
                            }`}>{log.userRole}</span>
                          </td>
                          <td className="p-3 text-[#081B3A] font-bold">{log.action}</td>
                          <td className="p-3 text-right text-slate-500 font-sans">{log.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* PROPERTIES MODAL */}
      {showPropModal && (
        <div className="fixed inset-0 z-50 bg-[#081B3A]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border rounded shadow-2xl max-w-3xl w-full p-6 text-slate-800 space-y-5 my-10 max-h-[90vh] overflow-y-auto font-sans">
            <div className="border-b pb-3 flex justify-between items-center text-[#081B3A]">
              <h3 className="font-display font-bold text-lg tracking-wider uppercase">
                {editingPropertyId ? "EDIT PROPERTY SPECIFICATIONS" : "REGISTER PORTFOLIO PROPERTY"}
              </h3>
              <button onClick={() => { setShowPropModal(false); setEditingPropertyId(null); }} className="text-slate-400 hover:text-rose-500 font-bold">Close ✕</button>
            </div>

            <form onSubmit={handleSaveProperty} className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div className="space-y-1.5">
                <label className="font-display uppercase font-bold text-slate-400">Display Title</label>
                <input
                  type="text"
                  required
                  value={propForm.title}
                  onChange={(e) => setPropForm({ ...propForm, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded bg-slate-50 focus:bg-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-display uppercase font-bold text-slate-400">Valuation Price (INR)</label>
                <input
                  type="number"
                  required
                  value={propForm.price}
                  onChange={(e) => setPropForm({ ...propForm, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded bg-slate-50 focus:bg-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-display uppercase font-bold text-slate-400">Asset Type</label>
                <select
                  value={propForm.type}
                  onChange={(e) => setPropForm({ ...propForm, type: e.target.value as any })}
                  className="w-full px-2.5 py-2 border rounded bg-slate-50 outline-none"
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Land">Land</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-display uppercase font-bold text-slate-400">Category Classification</label>
                <select
                  value={propForm.category}
                  onChange={(e) => setPropForm({ ...propForm, category: e.target.value as any })}
                  className="w-full px-2.5 py-2 border rounded bg-slate-50 outline-none"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Independent House">Independent House</option>
                  <option value="Duplex">Duplex</option>
                  <option value="Office">Office</option>
                  <option value="Retail Shop">Retail Shop</option>
                  <option value="Warehouse">Warehouse</option>
                  <option value="Residential Plot">Residential Plot</option>
                  <option value="Commercial Plot">Commercial Plot</option>
                  <option value="Farm Land">Farm Land</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-display uppercase font-bold text-slate-400 font-sans">Built Up Area (Sq Ft)</label>
                <input
                  type="number"
                  required
                  value={propForm.area}
                  onChange={(e) => setPropForm({ ...propForm, area: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded bg-slate-50 focus:bg-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-display uppercase font-bold text-slate-400 font-sans">Bedrooms BHK</label>
                <input
                  type="number"
                  value={propForm.bedrooms}
                  onChange={(e) => setPropForm({ ...propForm, bedrooms: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded bg-slate-50 focus:bg-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-display uppercase font-bold text-slate-400 font-sans">Bathrooms count</label>
                <input
                  type="number"
                  value={propForm.bathrooms}
                  onChange={(e) => setPropForm({ ...propForm, bathrooms: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded bg-slate-50 focus:bg-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-display uppercase font-bold text-slate-400">RERA Status tag</label>
                <select
                  value={propForm.status}
                  onChange={(e) => setPropForm({ ...propForm, status: e.target.value as any })}
                  className="w-full px-2.5 py-2 border rounded bg-slate-50 outline-none"
                >
                  <option value="For Sale">For Sale</option>
                  <option value="For Rent">For Rent</option>
                  <option value="Pre-Launch">Pre-Launch</option>
                  <option value="Handover">Ready Handover</option>
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-display uppercase font-bold text-slate-400">Corridor Zone Line</label>
                <input
                  type="text"
                  required
                  value={propForm.location}
                  onChange={(e) => setPropForm({ ...propForm, location: e.target.value })}
                  className="w-full px-3 py-2 border rounded bg-slate-50 focus:bg-white outline-none"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-display uppercase font-bold text-slate-400">Descriptive address</label>
                <input
                  type="text"
                  required
                  value={propForm.address}
                  onChange={(e) => setPropForm({ ...propForm, address: e.target.value })}
                  className="w-full px-3 py-2 border rounded bg-slate-50 focus:bg-white outline-none"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-display uppercase font-bold text-slate-400">Add Image URL (CDN links)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newImgUrl}
                    onChange={(e) => setNewImgUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 border rounded bg-slate-50 text-xs outline-none focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newImgUrl.trim()) {
                        setPropForm({ ...propForm, images: [...propForm.images, newImgUrl.trim()] });
                        setNewImgUrl("");
                      }
                    }}
                    className="px-4 py-2 bg-[#081B3A] text-white rounded font-bold uppercase text-[10px]"
                  >
                    Assign
                  </button>
                </div>
                {propForm.images.length > 0 && (
                  <div className="flex gap-2 mt-2 py-2 overflow-x-auto bg-slate-100 p-2 rounded">
                    {propForm.images.map((img, i) => (
                      <div key={i} className="h-10 w-16 relative rounded overflow-hidden shrink-0 border">
                        <img src={img} alt="prev" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setPropForm({ ...propForm, images: propForm.images.filter((_, idx) => idx !== i) })}
                          className="absolute text-white bg-rose-600 top-0 right-0 py-0.5 px-1 text-[8px]"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-display uppercase font-bold text-slate-400">Marketing description</label>
                <textarea
                  rows={4}
                  required
                  value={propForm.description}
                  onChange={(e) => setPropForm({ ...propForm, description: e.target.value })}
                  className="w-full p-3 border rounded text-xs outline-none bg-slate-50 focus:bg-white"
                ></textarea>
              </div>

              <div className="space-y-1.5">
                <label className="font-display uppercase font-bold text-[#C9A24B]">SEO: Meta Title</label>
                <input
                  type="text"
                  value={propForm.seoTitle}
                  onChange={(e) => setPropForm({ ...propForm, seoTitle: e.target.value })}
                  placeholder="Defaults to title..."
                  className="w-full px-3 py-2 border rounded bg-slate-50 focus:bg-white outline-none font-mono text-[10px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-display uppercase font-bold text-[#C9A24B]">SEO: Meta Description</label>
                <input
                  type="text"
                  value={propForm.seoDescription}
                  onChange={(e) => setPropForm({ ...propForm, seoDescription: e.target.value })}
                  placeholder="Defaults to excerpt..."
                  className="w-full px-3 py-2 border rounded bg-slate-50 focus:bg-white outline-none font-mono text-[10px]"
                />
              </div>

              <div className="sm:col-span-2 flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => { setShowPropModal(false); setEditingPropertyId(null); }}
                  className="px-6 py-2.5 rounded bg-slate-100 hover:bg-slate-200 text-[#081B3A] font-bold font-display text-[10px] uppercase cursor-pointer"
                >
                  DISCARD
                </button>
                <button
                  id="admin-submit-property-form-btn"
                  type="submit"
                  className="px-6 py-2.5 rounded bg-[#C9A24B] hover:bg-[#E5C07B] text-[#081B3A] font-bold font-display text-[10px] uppercase cursor-pointer shadow"
                >
                  SAVE SPECIFICATIONS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROJECTS MODAL */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 bg-[#081B3A]/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border rounded shadow-2xl max-w-2xl w-full p-6 text-slate-800 space-y-5 my-10 max-h-[90vh] overflow-y-auto font-sans text-xs">
            <div className="border-b pb-3 flex justify-between items-center text-[#081B3A]">
              <h3 className="font-display font-bold text-lg tracking-wider uppercase">
                {editingProjectId ? "EDIT DEVELOPMENT SPECIFICATIONS" : "REGISTER COMMISSION DEVELOPMENT"}
              </h3>
              <button onClick={() => { setShowProjectModal(false); setEditingProjectId(null); }} className="text-slate-400 hover:text-rose-500 font-bold">Close ✕</button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-display uppercase font-bold text-slate-400">Project Title</label>
                  <input
                    type="text"
                    required
                    value={projectForm.name}
                    onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                    className="w-full px-3 py-2.5 border rounded bg-slate-50 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-display uppercase font-bold text-slate-400">Valuation Location</label>
                  <input
                    type="text"
                    required
                    value={projectForm.location}
                    onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                    className="w-full px-3 py-2.5 border rounded bg-slate-50 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-display uppercase font-bold text-slate-400">Project status</label>
                  <select
                    value={projectForm.status}
                    onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value as any })}
                    className="w-full px-2 py-2 border rounded bg-slate-50 outline-none"
                  >
                    <option value="Under Construction">Under Construction</option>
                    <option value="Ready to Move">Ready to Move</option>
                    <option value="New Launch">New Launch</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-display uppercase font-bold text-slate-400">Planned handover date</label>
                  <input
                    type="text"
                    required
                    value={projectForm.completionDate}
                    onChange={(e) => setProjectForm({ ...projectForm, completionDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded bg-slate-50 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-display uppercase font-bold text-slate-400">Progress: {projectForm.constructionProgress}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={projectForm.constructionProgress}
                    onChange={(e) => setProjectForm({ ...projectForm, constructionProgress: Number(e.target.value) })}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#C9A24B] mt-3"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-display uppercase font-bold text-slate-400">Image Cover link</label>
                <input
                  type="text"
                  required
                  value={projectForm.image}
                  onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                  className="w-full px-3 py-2 border rounded bg-slate-50 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-display uppercase font-bold text-slate-400">Project Marketing details</label>
                <textarea
                  rows={3}
                  required
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full p-2.5 border rounded outline-none bg-slate-50 focus:bg-white"
                ></textarea>
              </div>

              {/* TIMELINE ADDITION IN-LINE FORM */}
              <div className="border-t pt-4 space-y-3">
                <span className="font-display uppercase font-bold text-[#C9A24B] tracking-widest text-[10px]">Construction Timeline Milestones ({projectForm.timeline.length})</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="e.g. Q3 2026"
                    value={newTimelineDate}
                    onChange={e => setNewTimelineDate(e.target.value)}
                    className="px-2 py-1.5 border rounded bg-slate-50"
                  />
                  <input
                    type="text"
                    placeholder="e.g. Foundation Handover"
                    value={newTimelineTitle}
                    onChange={e => setNewTimelineTitle(e.target.value)}
                    className="px-2 py-1.5 border rounded bg-slate-50 sm:col-span-2"
                  />
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Concise outline details description..."
                    value={newTimelineDesc}
                    onChange={e => setNewTimelineDesc(e.target.value)}
                    className="w-full px-2 py-1.5 border rounded bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={handleAddTimelineStep}
                    className="px-4 bg-[#081B3A] text-white rounded text-[10px] uppercase font-bold"
                  >
                    Add Timeline
                  </button>
                </div>

                {projectForm.timeline.length > 0 && (
                  <div className="bg-slate-50 p-2.5 rounded border space-y-1.5 max-h-32 overflow-y-auto">
                    {projectForm.timeline.map((step, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[10px] leading-tight border-b pb-1 last:border-0">
                        <div>
                          <strong>{step.date}: {step.title}</strong>
                          <p className="text-slate-400 font-sans">{step.description}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setProjectForm({ ...projectForm, timeline: projectForm.timeline.filter((_, i) => i !== idx) })}
                          className="text-rose-500 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => { setShowProjectModal(false); setEditingProjectId(null); }}
                  className="px-5 py-2 rounded bg-slate-100 font-display text-[10px] uppercase font-bold"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#C9A24B] text-[#081B3A] font-display text-[10px] uppercase font-bold rounded shadow"
                >
                  SYNCHRONIZE COMMISSION
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LEAD DETAILS / TIMELINE MODAL */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-[#081B3A]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border rounded shadow-2xl max-w-2xl w-full p-6 text-slate-800 space-y-5 my-10 max-h-[90vh] overflow-y-auto font-sans text-xs">
            
            <div className="border-b pb-2 flex justify-between items-center text-[#081B3A]">
              <h3 className="font-display font-bold text-sm tracking-wider uppercase">CRM LEAD PROCESS CONCIERGE</h3>
              <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-rose-500 font-bold">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
              
              {/* Form Updates */}
              <form onSubmit={handleSaveLeadProgress} className="space-y-4">
                <div className="bg-slate-50 p-3.5 rounded border space-y-2">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-display font-bold">Contact Card</span>
                    <h4 className="font-bold text-sm text-[#081B3A]">{selectedLead.name}</h4>
                    <p className="text-slate-500">{selectedLead.email} • {selectedLead.phone}</p>
                  </div>
                  <p className="text-slate-600 bg-white p-2 rounded border leading-relaxed text-[11px]">{selectedLead.message}</p>
                </div>

                <div className="space-y-1">
                  <label className="font-display font-bold uppercase text-slate-400 text-[9px] tracking-wider">Update status</label>
                  <select
                    value={leadStatusVal}
                    onChange={(e) => setLeadStatusVal(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded bg-slate-50 outline-none text-xs"
                  >
                    {CRM_STAGES.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-display font-bold uppercase text-slate-400 text-[9px] tracking-wider">Assign lead to agent</label>
                  <select
                    value={leadAssignedAgent}
                    onChange={(e) => setLeadAssignedAgent(e.target.value)}
                    className="w-full px-3 py-2 border rounded bg-slate-50 outline-none text-xs"
                  >
                    <option value="">Unassigned</option>
                    <option value="Agent Vikram">Agent Vikram</option>
                    <option value="Vidhya Murthy">Vidhya Murthy</option>
                    <option value="Rohan Khanna">Rohan Khanna</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-display font-bold uppercase text-slate-400 text-[9px] tracking-wider">Internal Advisory Notes</label>
                  <textarea
                    rows={3}
                    value={leadNoteText}
                    onChange={(e) => setLeadNoteText(e.target.value)}
                    placeholder="Add notes explaining customer interactions..."
                    className="w-full p-2.5 border rounded text-xs outline-none bg-slate-50 focus:bg-white"
                  ></textarea>
                </div>

                <button
                  id="lead-save-progress-btn"
                  type="submit"
                  className="w-full py-3 bg-[#081B3A] text-[#C9A24B] hover:bg-slate-900 border border-[#C9A24B]/35 hover:text-white font-display text-[10px] tracking-widest font-bold uppercase rounded cursor-pointer transition shadow"
                >
                  SAVE PROCESS SIGNATURE
                </button>
              </form>

              {/* TIMELINES & REMINDERS SIDEBAR */}
              <div className="space-y-6">
                
                {/* Reminders list */}
                <div className="space-y-3 bg-slate-50 p-4 border rounded">
                  <h4 className="font-display font-bold text-[10px] text-[#081B3A] uppercase tracking-wider flex items-center gap-1.5">
                    <CheckSquare className="h-4 w-4 text-[#C9A24B]" /> Lead Reminders & Tasks
                  </h4>

                  <form onSubmit={handleAddLeadReminder} className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="date"
                        required
                        value={newReminderDate}
                        onChange={e => setNewReminderDate(e.target.value)}
                        className="px-2 py-1.5 border rounded text-[10px]"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Task details..."
                        value={newReminderNote}
                        onChange={e => setNewReminderNote(e.target.value)}
                        className="w-full px-2 py-1.5 border rounded text-[10px]"
                      />
                      <button
                        type="submit"
                        className="px-3 bg-[#081B3A] text-white rounded font-bold uppercase text-[9px]"
                      >
                        Add
                      </button>
                    </div>
                  </form>

                  {selectedLead.reminders && selectedLead.reminders.length > 0 ? (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {selectedLead.reminders.map((rem) => (
                        <label key={rem.id} className="flex items-start gap-2 text-[10px] text-slate-600 bg-white p-2 rounded border border-slate-100 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rem.completed}
                            onChange={e => handleToggleReminderCompleted(rem.id, e.target.checked)}
                            className="rounded border-slate-300 text-[#C9A24B] focus:ring-[#C9A24B] h-3.5 w-3.5 cursor-pointer mt-0.5"
                          />
                          <div className={rem.completed ? "line-through text-slate-400" : ""}>
                            <p className="font-bold">{rem.date}</p>
                            <p>{rem.note}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 italic text-center py-2">No active follow-up tasks defined.</p>
                  )}
                </div>

                {/* Timeline display */}
                <div className="space-y-3 font-sans">
                  <h4 className="font-display font-bold text-[10px] text-[#081B3A] uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-[#C9A24B]" /> Lead History Timeline
                  </h4>

                  {selectedLead.timeline && selectedLead.timeline.length > 0 ? (
                    <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-slate-200">
                      {selectedLead.timeline.map((event, idx) => (
                        <div key={idx} className="relative pl-6 text-[10px] leading-tight space-y-0.5">
                          <div className="absolute left-1 top-1.5 h-2.5 w-2.5 rounded-full bg-[#C9A24B] border-2 border-white shadow-sm"></div>
                          <div className="flex justify-between items-center text-slate-400 text-[9px] font-mono">
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                            <span>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="font-bold text-slate-700">{event.action}</p>
                          <p className="text-slate-500 font-sans">{event.note}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 italic">No historical changes logged.</p>
                  )}
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

      {/* BULK PROPERTIES IMPORT MODAL */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 bg-[#081B3A]/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border rounded shadow-2xl max-w-lg w-full p-6 text-slate-800 space-y-4 font-sans text-xs">
            <div className="border-b pb-2 flex justify-between items-center text-[#081B3A]">
              <h4 className="font-display font-bold text-xs uppercase">BULK PROPERTIES IMPORT PORTAL</h4>
              <button onClick={() => setShowBulkModal(false)} className="text-slate-400 hover:text-rose-500 font-bold">✕</button>
            </div>
            
            <p className="text-slate-400 leading-relaxed">Paste your valid JSON array containing properties data below. Click import to sync with database storage.</p>

            <form onSubmit={handleBulkImportSubmit} className="space-y-4">
              <textarea
                rows={10}
                required
                value={bulkJsonText}
                onChange={e => setBulkJsonText(e.target.value)}
                placeholder={`[\n  {\n    "title": "Bespoke Penthouse",\n    "type": "Residential",\n    "category": "Apartment",\n    "price": 45000000,\n    "location": "Gachibowli, Hyderabad",\n    "address": "Floor 12 Tower C",\n    "area": 4800,\n    "bedrooms": 4,\n    "bathrooms": 4,\n    "parking": 3,\n    "description": "Exclusive unlisted twins penthouses...",\n    "images": ["https://images.unsplash.com/..."],\n    "amenities": ["Security", "Pool"],\n    "nearbyPlaces": []\n  }\n]`}
                className="w-full p-2.5 border rounded font-mono text-[10px] bg-slate-50 focus:bg-white outline-none"
              ></textarea>

              <button
                type="submit"
                className="w-full py-3 bg-[#081B3A] text-[#C9A24B] hover:text-white border border-[#C9A24B]/35 font-display text-[10px] tracking-widest font-bold uppercase rounded cursor-pointer transition shadow"
              >
                EXECUTE BULK IMPORT BATCH
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
