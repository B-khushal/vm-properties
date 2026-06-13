import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { Property, Lead, Appointment, Blog, BlogComment, Project, GalleryItem, Testimonial, User, ActivityLog } from "./src/types";
import {
  SEED_PROPERTIES,
  SEED_PROJECTS,
  SEED_GALLERY,
  SEED_BLOGS,
  SEED_TESTIMONIALS,
  SEED_LEADS,
  SEED_APPOINTMENTS,
  SEED_USERS
} from "./src/data";

const app = express();
const PORT = 3000;

app.use(express.json());

// Persistent File DB Path
const DB_FILE = path.join(process.cwd(), "db_storage.json");

interface LocalDatabase {
  properties: Property[];
  projects: Project[];
  gallery: GalleryItem[];
  blogs: Blog[];
  testimonials: Testimonial[];
  leads: Lead[];
  appointments: Appointment[];
  users: User[];
  activityLogs: ActivityLog[];
  communicationLogs: {
    id: string;
    timestamp: string;
    type: "Email" | "WhatsApp" | "SMS";
    recipient: string;
    template: string;
    content: string;
    status: string;
  }[];
}

function initializeDB(): LocalDatabase {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(content);
      
      // Ensure new database columns exist
      return {
        properties: parsed.properties || SEED_PROPERTIES,
        projects: parsed.projects || SEED_PROJECTS,
        gallery: parsed.gallery || SEED_GALLERY,
        blogs: parsed.blogs || SEED_BLOGS,
        testimonials: parsed.testimonials || SEED_TESTIMONIALS,
        leads: parsed.leads || SEED_LEADS,
        appointments: parsed.appointments || SEED_APPOINTMENTS,
        users: parsed.users || SEED_USERS,
        activityLogs: parsed.activityLogs || [],
        communicationLogs: parsed.communicationLogs || []
      };
    }
  } catch (err) {
    console.error("Local database read failed, restoring seeds...", err);
  }

  const initialData: LocalDatabase = {
    properties: SEED_PROPERTIES,
    projects: SEED_PROJECTS,
    gallery: SEED_GALLERY,
    blogs: SEED_BLOGS,
    testimonials: SEED_TESTIMONIALS,
    leads: SEED_LEADS,
    appointments: SEED_APPOINTMENTS,
    users: SEED_USERS,
    activityLogs: [],
    communicationLogs: []
  };

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
  } catch (err) {
    console.error("Local database seed write failed", err);
  }

  return initialData;
}

const db = initializeDB();

function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Critical: Failed to persist database changes to db_storage.json", err);
  }
}

// Helper to log audit trail activities
function logActivity(userEmail: string, userRole: string, action: string, details: string) {
  const newLog: ActivityLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    userEmail: userEmail || "anonymous@vmproperties.com",
    userRole: userRole || "Client",
    action,
    details
  };
  if (!db.activityLogs) db.activityLogs = [];
  db.activityLogs.unshift(newLog);
  db.activityLogs = db.activityLogs.slice(0, 150); // limit to 150 logs
  saveDB();
}

// Helper to queue simulated automated communications
function triggerCommunication(type: "Email" | "WhatsApp" | "SMS", recipient: string, template: string, content: string) {
  const newComm = {
    id: `comm-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    type,
    recipient,
    template,
    content,
    status: "Transmitted"
  };
  if (!db.communicationLogs) db.communicationLogs = [];
  db.communicationLogs.unshift(newComm);
  db.communicationLogs = db.communicationLogs.slice(0, 100); // limit to 100 logs
  saveDB();
}

// ----------------------------------------------------
// REST APIs & Models (MongoDB equivalents structured inside server)
// ----------------------------------------------------

// Properties CRUD
app.get("/api/properties", (req, res) => {
  res.json(db.properties);
});

app.get("/api/properties/featured", (req, res) => {
  const featured = db.properties.filter(p => p.featured);
  res.json(featured);
});

app.get("/api/properties/:id", (req, res) => {
  const property = db.properties.find(p => p.id === req.params.id);
  if (!property) {
    return res.status(404).json({ error: "Property not found" });
  }
  // Increment view count dynamically
  property.views = (property.views || 0) + 1;
  saveDB();
  res.json(property);
});

app.post("/api/properties/create", (req, res) => {
  const newProperty: Property = {
    id: req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    views: 0,
    clicks: 0,
    publishStatus: req.body.publishStatus || "Published",
    ...req.body
  };
  db.properties.push(newProperty);
  saveDB();
  logActivity(req.body.adminEmail || "admin@vmproperties.com", "Admin", "PROPERTY_CREATE", `Registered new property "${newProperty.title}"`);
  res.status(201).json(newProperty);
});

app.put("/api/properties/:id", (req, res) => {
  const idx = db.properties.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Property not found" });

  db.properties[idx] = { ...db.properties[idx], ...req.body };
  saveDB();
  logActivity(req.body.adminEmail || "admin@vmproperties.com", "Admin", "PROPERTY_UPDATE", `Updated property details for "${db.properties[idx].title}"`);
  res.json(db.properties[idx]);
});

app.delete("/api/properties/:id", (req, res) => {
  const property = db.properties.find(p => p.id === req.params.id);
  db.properties = db.properties.filter(p => p.id !== req.params.id);
  saveDB();
  if (property) {
    logActivity(req.query.adminEmail as string || "admin@vmproperties.com", "Admin", "PROPERTY_DELETE", `Permanently deleted property "${property.title}"`);
  }
  res.json({ success: true, message: "Property deleted" });
});

// Projects
app.get("/api/projects", (req, res) => {
  res.json(db.projects);
});

app.post("/api/projects/create", (req, res) => {
  const newProject: Project = {
    id: req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    ...req.body
  };
  db.projects.push(newProject);
  saveDB();
  res.status(201).json(newProject);
});

app.delete("/api/projects/:id", (req, res) => {
  db.projects = db.projects.filter(p => p.id !== req.params.id);
  saveDB();
  res.json({ success: true });
});

// Gallery
app.get("/api/gallery", (req, res) => {
  res.json(db.gallery);
});

app.post("/api/gallery/create", (req, res) => {
  const newItem: GalleryItem = {
    id: `g-${Date.now()}`,
    ...req.body
  };
  db.gallery.push(newItem);
  saveDB();
  res.status(201).json(newItem);
});

app.delete("/api/gallery/:id", (req, res) => {
  db.gallery = db.gallery.filter(item => item.id !== req.params.id);
  saveDB();
  res.json({ success: true });
});

// Testimonials
app.get("/api/testimonials", (req, res) => {
  res.json(db.testimonials);
});

app.post("/api/testimonials/create", (req, res) => {
  const newTestimonial: Testimonial = {
    id: `t-${Date.now()}`,
    ...req.body
  };
  db.testimonials.push(newTestimonial);
  saveDB();
  res.status(201).json(newTestimonial);
});

app.delete("/api/testimonials/:id", (req, res) => {
  db.testimonials = db.testimonials.filter(item => item.id !== req.params.id);
  saveDB();
  res.json({ success: true });
});

// Leads
app.get("/api/leads/list", (req, res) => {
  res.json(db.leads);
});

app.post("/api/leads", (req, res) => {
  const { propertyId, propertyName, name, phone, email, message, source } = req.body;
  if (!name || !phone || !email) {
    return res.status(400).json({ error: "Missing required contact details" });
  }

  const newLead: Lead = {
    id: `lead-${Date.now()}`,
    propertyId,
    propertyName,
    name,
    phone,
    email,
    message: message || "No custom message provided",
    status: "New",
    source: source || "Web Inquiry",
    createdAt: new Date().toISOString(),
    timeline: [
      {
        date: new Date().toISOString(),
        action: "Lead Created",
        note: `Initial inquiry captured via ${source || "Web Inquiry"}`
      }
    ],
    reminders: []
  };

  db.leads.push(newLead);
  saveDB();

  // Simulated communications automation
  triggerCommunication(
    "Email",
    email,
    "VM Properties - Inquiry Received",
    `Dear ${name},\n\nThank you for reaching out to VM Properties. We have received your portfolio inquiry for "${propertyName || "General Inquiry"}" and assigned it to our luxury estates team. Our acquisitions director will contact you shortly.\n\nDetails Submitted:\n- Phone: ${phone}\n- Message: ${message || "General Catalog Inquiry"}\n\nWarm regards,\nVM Properties Acquisitions Desk`
  );
  triggerCommunication(
    "WhatsApp",
    phone,
    "Inquiry Confirmation Card",
    `Greetings ${name}, Vidhya Murthy here. Thank you for expressing interest in VM Properties. I'm preparing a detailed brochure package for you. Speak to you soon.`
  );
  logActivity(email, "Client", "LEAD_SUBMIT", `Lead generated by ${name} for "${propertyName || "General Enquiry"}"`);

  res.status(201).json({ success: true, lead: newLead, message: "Lead submitted successfully" });
});

app.put("/api/leads/:id", (req, res) => {
  const idx = db.leads.findIndex(l => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Lead not found" });

  const oldStatus = db.leads[idx].status;
  db.leads[idx] = { ...db.leads[idx], ...req.body };

  // Append timeline if status changed
  if (req.body.status && req.body.status !== oldStatus) {
    if (!db.leads[idx].timeline) db.leads[idx].timeline = [];
    db.leads[idx].timeline!.push({
      date: new Date().toISOString(),
      action: "Status Updated",
      note: `Lead pipeline transitioned from ${oldStatus} to ${req.body.status}`
    });
  }

  // Append timeline if general note is updated
  if (req.body.notes && req.body.notes !== db.leads[idx].notes) {
    if (!db.leads[idx].timeline) db.leads[idx].timeline = [];
    db.leads[idx].timeline!.push({
      date: new Date().toISOString(),
      action: "Notes Appended",
      note: req.body.notes
    });
  }

  saveDB();
  logActivity(req.body.operatorEmail || "agent@vmproperties.com", "Agent", "LEAD_UPDATE", `Processed pipeline update for lead "${db.leads[idx].name}"`);
  res.json(db.leads[idx]);
});

app.delete("/api/leads/:id", (req, res) => {
  db.leads = db.leads.filter(l => l.id !== req.params.id);
  saveDB();
  res.json({ success: true });
});

// Appointments
app.get("/api/appointments/list", (req, res) => {
  res.json(db.appointments);
});

app.post("/api/appointments", (req, res) => {
  const { propertyId, propertyName, name, phone, email, date, time } = req.body;
  if (!propertyId || !name || !date || !time) {
    return res.status(400).json({ error: "Invalid booking details" });
  }

  const newAppt: Appointment = {
    id: `appt-${Date.now()}`,
    propertyId,
    propertyName,
    name,
    phone,
    email,
    date,
    time,
    status: "Scheduled",
    createdAt: new Date().toISOString()
  };

  db.appointments.push(newAppt);
  saveDB();

  // Simulated communications triggers
  triggerCommunication(
    "Email",
    email,
    "VM Properties - Site Visit Escort Confirmed",
    `Dear ${name},\n\nWe have scheduled your private escorted site survey tour for "${propertyName}" on ${date} at ${time}. Our designated security convoy will meet you at the primary reception desk.\n\nWarm regards,\nVM Properties Concierge Desk`
  );
  triggerCommunication(
    "WhatsApp",
    phone,
    "Site Visit Coordinates Pin",
    `Dear ${name}, your physical visit coordinate pin is set for Gachibowli HQ at ${time} on ${date}. Agent Vikram is your assigned convoy captain.`
  );
  logActivity(email, "Client", "APPOINTMENT_CREATE", `Site survey reservation booked by ${name} for "${propertyName}"`);

  res.status(201).json({ success: true, appointment: newAppt, message: "Site visit scheduled successfully" });
});

app.put("/api/appointments/:id", (req, res) => {
  const idx = db.appointments.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Booking not found" });

  db.appointments[idx] = { ...db.appointments[idx], ...req.body };
  saveDB();
  res.json(db.appointments[idx]);
});

// Projects Edit PUT endpoint
app.put("/api/projects/:id", (req, res) => {
  const idx = db.projects.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Project not found" });

  db.projects[idx] = { ...db.projects[idx], ...req.body };
  saveDB();
  logActivity(req.body.operatorEmail || "admin@vmproperties.com", "Admin", "PROJECT_UPDATE", `Updated construction specs for project "${db.projects[idx].name}"`);
  res.json(db.projects[idx]);
});

// Blogs CRUD/Comments
app.get("/api/blogs", (req, res) => {
  res.json(db.blogs);
});

app.get("/api/blogs/:id", (req, res) => {
  const blog = db.blogs.find(b => b.id === req.params.id);
  if (!blog) return res.status(404).json({ error: "Blog not found" });
  res.json(blog);
});

app.post("/api/blogs/create", (req, res) => {
  const newBlog: Blog = {
    id: req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    publishDate: new Date().toISOString().split("T")[0],
    comments: [],
    readingTime: `${Math.ceil((req.body.content || "").split(/\s+/).length / 200)} min read`,
    ...req.body
  };
  db.blogs.push(newBlog);
  saveDB();
  logActivity(req.body.adminEmail || "admin@vmproperties.com", "Admin", "BLOG_CREATE", `Published news briefing "${newBlog.title}"`);
  res.status(201).json(newBlog);
});

app.put("/api/blogs/:id", (req, res) => {
  const idx = db.blogs.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Blog not found" });

  db.blogs[idx] = { ...db.blogs[idx], ...req.body };
  saveDB();
  res.json(db.blogs[idx]);
});

app.delete("/api/blogs/:id", (req, res) => {
  db.blogs = db.blogs.filter(b => b.id !== req.params.id);
  saveDB();
  res.json({ success: true });
});

app.post("/api/blogs/:id/comment", (req, res) => {
  const idx = db.blogs.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Blog not found" });

  if (!db.blogs[idx].comments) db.blogs[idx].comments = [];
  const newComment: BlogComment = {
    id: `c-${Date.now()}`,
    authorName: req.body.authorName || "Anonymous Prospect",
    content: req.body.content || "",
    date: new Date().toLocaleDateString("en-IN"),
    replies: []
  };

  db.blogs[idx].comments!.push(newComment);
  saveDB();
  logActivity(req.body.authorEmail || "anonymous@vmproperties.com", "Client", "BLOG_COMMENT", `Comment posted on blog "${db.blogs[idx].title}"`);
  res.status(201).json(newComment);
});

// Client Auth endpoints
app.post("/api/auth/register", (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing required registration details" });
  }

  const exists = db.users.find(u => u.email === email);
  if (exists) {
    return res.status(400).json({ error: "Email already registered to an account" });
  }

  const newUser: User = {
    id: `u-${Date.now()}`,
    name,
    email,
    role: "Client",
    phone: phone || "",
    wishlist: [],
    savedSearches: []
  };

  db.users.push(newUser);
  saveDB();

  logActivity(email, "Client", "USER_REGISTER", `Registered Client portal profile for ${name}`);
  triggerCommunication(
    "Email",
    email,
    "VM Properties Account Activated",
    `Dear ${name},\n\nYour client catalog credentials at VM Properties are active. Log in to save wishlist items and track site tours.\n\nWarm regards,\nVM Properties Concierge`
  );

  res.status(201).json({ success: true, user: newUser });
});

app.put("/api/auth/profile", (req, res) => {
  const { email, name, phone } = req.body;
  const idx = db.users.findIndex(u => u.email === email);
  if (idx === -1) return res.status(404).json({ error: "User profile not found" });

  db.users[idx] = { ...db.users[idx], name, phone };
  saveDB();
  logActivity(email, db.users[idx].role, "USER_PROFILE_UPDATE", `Updated client registry data for ${name}`);
  res.json({ success: true, user: db.users[idx] });
});

app.put("/api/users/:email/wishlist", (req, res) => {
  const idx = db.users.findIndex(u => u.email === req.params.email);
  if (idx === -1) return res.status(404).json({ error: "User profile not found" });

  db.users[idx].wishlist = req.body.wishlist || [];
  saveDB();
  res.json({ success: true, wishlist: db.users[idx].wishlist });
});

app.post("/api/users/:email/searches", (req, res) => {
  const idx = db.users.findIndex(u => u.email === req.params.email);
  if (idx === -1) return res.status(404).json({ error: "User profile not found" });

  if (!db.users[idx].savedSearches) db.users[idx].savedSearches = [];
  const newSearch = {
    id: `search-${Date.now()}`,
    query: req.body.query,
    filters: req.body.filters,
    date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
  };

  db.users[idx].savedSearches!.push(newSearch);
  saveDB();
  res.json({ success: true, savedSearches: db.users[idx].savedSearches });
});

app.delete("/api/users/:email/searches/:searchId", (req, res) => {
  const idx = db.users.findIndex(u => u.email === req.params.email);
  if (idx === -1) return res.status(404).json({ error: "User profile not found" });

  if (db.users[idx].savedSearches) {
    db.users[idx].savedSearches = db.users[idx].savedSearches!.filter(s => s.id !== req.params.searchId);
    saveDB();
  }
  res.json({ success: true, savedSearches: db.users[idx].savedSearches || [] });
});

// Logs APIs
app.get("/api/activity-logs", (req, res) => {
  res.json(db.activityLogs || []);
});

app.get("/api/communications/logs", (req, res) => {
  res.json(db.communicationLogs || []);
});

// Auth Simulator (Admin & Client)
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  // Preset accounts
  if ((email === "admin@vmproperties.com" || email === "khushalprasad242@gmail.com") && password === "admin123") {
    const user = { id: "u1", name: "Vidhya Murthy", email: email, role: "Admin", wishlist: [], savedSearches: [] };
    logActivity(email, "Admin", "USER_LOGIN", `Administrator logged in`);
    return res.json({ token: "simulated-luxury-jwt-token-xyz", user });
  } else if (email === "agent@vmproperties.com" && password === "agent123") {
    const user = { id: "u2", name: "Agent Vikram", email: email, role: "Agent", wishlist: [], savedSearches: [] };
    logActivity(email, "Agent", "USER_LOGIN", `Acquisitions Agent logged in`);
    return res.json({ token: "simulated-luxury-jwt-token-abc", user });
  } else if (email === "editor@vmproperties.com" && password === "editor123") {
    const user = { id: "u3", name: "Editor Roy", email: email, role: "Editor", wishlist: [], savedSearches: [] };
    logActivity(email, "Editor", "USER_LOGIN", `Content Editor logged in`);
    return res.json({ token: "simulated-luxury-jwt-token-def", user });
  }

  // Dynamic registers lookup
  const user = db.users.find(u => u.email === email);
  if (user) {
    logActivity(email, user.role, "USER_LOGIN", `Registered User logged in`);
    return res.json({
      token: `simulated-jwt-client-${user.id}`,
      user
    });
  }

  return res.status(401).json({ error: "Invalid premium credentials. Register a client account first." });
});

// ----------------------------------------------------
// Server-Side Lazy Gemini AI Property Recommendation Engine
// ----------------------------------------------------
let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      try {
        aiClient = new GoogleGenAI({ apiKey: key });
      } catch (err) {
        console.error("Gemini initialization failed", err);
      }
    }
  }
  return aiClient;
}

app.post("/api/ai/recommend", async (req, res) => {
  const { budget, location, type, lifestyle } = req.body;
  const client = getAIClient();

  // Safe fallback if key is missing or unconfigured
  if (!client) {
    // Generate high quality simulated matching analysis based on properties
    const sampleProperties = db.properties.filter(p => !type || p.type.toLowerCase() === type.toLowerCase());
    const matchesList = sampleProperties.slice(0, 2).map(p => p.title).join(" & ");

    return res.json({
      recommendations: `### VM PROPERTIES: Luxury AI Recommendation Analysis\n\n*Note: Dynamic AI recommendation is currently running in smart fallback mode. To enable real-time Gemini generation, configure your \`GEMINI_API_KEY\` in your environment settings.*\n\nBased on your selected profile:\n- **Estate Location Criteria**: ${location || "Any Luxury Corridor"}\n- **Financial Bandwidth**: Up to ₹${(Number(budget) / 10000000).toFixed(1) || "15"} Cores\n- **Target Category**: ${type || "All Residential/Commercial Options"}\n- **Lifestyle Drivers**: ${lifestyle || "Bespoke Grandeur & High Appreciation"}\n\nOur portfolio match indicates **${matchesList || "our premium Jubilee Hills and Gachibowli listings"}** perfectly accommodate your aesthetic preferences. \n\n### Why This Match Works:\n1. **Financial Alignment**: Fits within your optimized asset allocation curves.\n2. **High Security Standards**: Fully DTCP verified properties offering bespoke private security columns.\n3. **Access Control**: Proximity to international airports, executive commercial nodes, and premier recreation high streets is under 15 minutes.`,
      suggestedIds: sampleProperties.slice(0, 2).map(p => p.id),
      apiConfigured: false
    });
  }

  try {
    // Prepare catalog string for AI
    const catalog = db.properties.map(p => (
      `ID: "${p.id}", Name: "${p.title}", Type: "${p.type}", Category: "${p.category}", Price: ₹${p.price}, Location: "${p.location}", Rooms: "${p.bedrooms} BHK", Area: "${p.area} sqft", Highlights: "${p.description.substring(0, 150)}..."`
    )).join("\n");

    const prompt = `You are the chief concierge advisor at VM PROPERTIES, a high-end ultra-luxury real estate brand. A client is requesting personalized portfolio matches.
    
CLIENT REQUIREMENT:
- Location Preferences: "${location || 'Any Prime Hub'}"
- Budget Limit: ₹"${budget || 'Unlimited'}"
- Property Type: "${type || 'Residential/Commercial'}"
- Lifestyle Profiles & Habits: "${lifestyle || 'Luxury living, security, high appreciation'}"

ESTATE PORTFOLIO CATALOG:
${catalog}

Analyze the user's requirements against the catalog. 
1. Select the top 1 or 2 matching properties by ID.
2. Draft a highly professional, elegant, and personal recommendation report in beautiful MarkDown format under 300 words. Address the client in an elite concierge tone. Explain precisely why the selected properties fit their lifestyle and capital allocation guidelines.
3. Return your response in JSON format matching this exact schema:
{
  "recommendations": "MarkDown formatted concierge message...",
  "suggestedIds": ["list-of-selected-property-ids"]
}`;

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const aiText = response.text || "{}";
    const dataResponse = JSON.parse(aiText);
    res.json({
      recommendations: dataResponse.recommendations,
      suggestedIds: dataResponse.suggestedIds || [],
      apiConfigured: true
    });
  } catch (error) {
    console.error("Gemini API call failed, restoring elegant fallback context", error);
    res.json({
      recommendations: `### Premium Advisory Match\nOur automated matching metrics advise that "The Golden Crest Villa" (Jubilee Hills) and "Regent Heights Penthouse" (Gachibowli) represent the ultimate residential opportunities in the region, boasting superb capital appreciation thresholds of over 12% annually.`,
      suggestedIds: ["luxury-villa-hyderabad", "regent-heights-penthouse"],
      apiConfigured: false
    });
  }
});

// Summary Endpoint for Dashboard
app.get("/api/analytics/summary", (req, res) => {
  const totalProperties = db.properties.length;
  const totalLeads = db.leads.length;
  const totalAppointments = db.appointments.length;
  const totalClicks = db.properties.reduce((acc, p) => acc + (p.views || 0) + (p.clicks || 0), 0);

  // Leads distribution by source
  const sourcesMap: Record<string, number> = {};
  db.leads.forEach(l => {
    sourcesMap[l.source] = (sourcesMap[l.source] || 0) + 1;
  });
  const leadsBySource = Object.entries(sourcesMap).map(([name, value]) => ({ name, value }));

  // Leads distribution by status
  const statusMap: Record<string, number> = {};
  db.leads.forEach(l => {
    statusMap[l.status] = (statusMap[l.status] || 0) + 1;
  });
  const leadsByStatus = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

  // Top properties by view count
  const viewsByProperty = [...db.properties]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5)
    .map(p => ({ title: p.title, views: p.views || 0 }));

  // Conversion rates (leads to properties ratio or simple performance percentage)
  const conversionRate = totalLeads > 0 ? Math.round((totalAppointments / totalLeads) * 100) : 15;

  // Additional rich mock analytics details for SaaS CRM
  const deviceAnalytics = [
    { name: "Mobile App", value: Math.round(totalClicks * 0.55) + 10 },
    { name: "Desktop Web", value: Math.round(totalClicks * 0.35) + 5 },
    { name: "Tablet Screen", value: Math.round(totalClicks * 0.10) + 1 }
  ];

  const trafficSources = [
    { name: "Organic SEO Search", value: Math.round(totalClicks * 0.40) + 15 },
    { name: "Direct Client Referrals", value: Math.round(totalClicks * 0.30) + 10 },
    { name: "Social/HNIs Private Networks", value: Math.round(totalClicks * 0.20) + 5 },
    { name: "Google Tag Manager Ads", value: Math.round(totalClicks * 0.10) + 2 }
  ];

  const monthlyConversions = [
    { month: "Jan", leads: 4, visits: 2 },
    { month: "Feb", leads: 6, visits: 3 },
    { month: "Mar", leads: 9, visits: 5 },
    { month: "Apr", leads: 12, visits: 7 },
    { month: "May", leads: 15, visits: 10 },
    { month: "Jun", leads: totalLeads || 18, visits: totalAppointments || 12 }
  ];

  const visitorTrend = [
    { day: "Mon", visitors: 42, views: 85 },
    { day: "Tue", visitors: 58, views: 120 },
    { day: "Wed", visitors: 64, views: 145 },
    { day: "Thu", visitors: 72, views: 160 },
    { day: "Fri", visitors: 89, views: 210 },
    { day: "Sat", visitors: 110, views: 270 },
    { day: "Sun", visitors: 95, views: 220 }
  ];

  const summary = {
    totalProperties,
    totalLeads,
    totalClicks,
    totalAppointments,
    conversionRate,
    viewsByProperty,
    leadsBySource: leadsBySource.length ? leadsBySource : [{ name: "Web Inquiry", value: totalLeads || 1 }],
    leadsByStatus: leadsByStatus.length ? leadsByStatus : [{ name: "New", value: totalLeads || 1 }],
    deviceAnalytics,
    trafficSources,
    monthlyConversions,
    visitorTrend
  };

  res.json(summary);
});

// ----------------------------------------------------
// Front-end Server Routing & Development Setup
// ----------------------------------------------------
async function start() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up development container with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`VM Properties Full-Stack Server active on http://localhost:${PORT}`);
  });
}

start();
