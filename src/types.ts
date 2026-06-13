export type PropertyStatus = "For Sale" | "For Rent" | "Pre-Launch" | "Handover";
export type PropertyType = "Residential" | "Commercial" | "Land";
export type PropertyCategory = "Apartment" | "Villa" | "Independent House" | "Duplex" | "Office" | "Retail Shop" | "Warehouse" | "Residential Plot" | "Commercial Plot" | "Farm Land";

export interface Property {
  id: string; // Dynamic SEO Friendly slug like "luxury-villa-hyderabad"
  title: string;
  type: PropertyType;
  category: PropertyCategory;
  price: number;
  location: string;
  address: string;
  area: number; // in sq ft
  bedrooms: number;
  bathrooms: number;
  parking: number;
  description: string;
  images: string[];
  videos: string[];
  floorPlanUrl: string;
  status: PropertyStatus;
  featured: boolean;
  amenities: string[];
  nearbyPlaces: {
    name: string;
    type: "School" | "Hospital" | "Metro" | "Shopping";
    distance: string;
  }[];
  seoTitle?: string;
  seoDescription?: string;
  views: number;
  clicks?: number;
  publishStatus?: "Draft" | "Published" | "Archived";
}

export interface Project {
  id: string;
  name: string;
  location: string;
  status: "Under Construction" | "Ready to Move" | "New Launch";
  description: string;
  image: string;
  completionDate: string;
  constructionProgress?: number; // 0 to 100
  timeline?: {
    date: string;
    title: string;
    description: string;
    completed: boolean;
  }[];
  masterPlans?: string[];
  documents?: {
    name: string;
    url: string;
  }[];
  amenities?: string[];
  gallery?: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: "Property" | "Project" | "Event";
  imageUrl: string;
  album?: string;
}

export interface BlogComment {
  id: string;
  authorName: string;
  content: string;
  date: string;
  replies?: BlogComment[];
}

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  category: "Real Estate News" | "Investment Tips" | "Property Guides" | "Market Trends";
  image: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  comments?: BlogComment[];
  readingTime?: string;
  status?: "Draft" | "Published";
}

export type LeadStatus = "New" | "Contacted" | "Qualified" | "Interested" | "Site Visit" | "Negotiation" | "Closed Won" | "Closed Lost" | "In Progress" | "Closed" | "Lost";

export interface Lead {
  id: string;
  propertyId?: string; // Optional if inquiry is general
  propertyName?: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: LeadStatus;
  source: "Web Inquiry" | "WhatsApp" | "Call" | "Direct Site Visit" | "Exit Intent Popup";
  assignedTo?: string; // Agent name
  notes?: string;
  createdAt: string;
  timeline?: {
    date: string;
    action: string;
    note?: string;
  }[];
  reminders?: {
    id: string;
    date: string;
    note: string;
    completed: boolean;
  }[];
}

export interface Appointment {
  id: string;
  propertyId: string;
  propertyName: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  status: "Scheduled" | "Completed" | "Cancelled" | "No Show";
  notes?: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  role: string;
  photo: string;
  review: string;
  rating: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Agent" | "Editor" | "Client";
  phone?: string;
  wishlist?: string[]; // property IDs
  savedSearches?: {
    id: string;
    query: string;
    filters: any;
    date: string;
  }[];
}

export interface AnalyticsSummary {
  totalProperties: number;
  totalLeads: number;
  totalClicks: number;
  totalAppointments: number;
  conversionRate: number;
  viewsByProperty: { title: string; views: number }[];
  leadsBySource: { name: string; value: number }[];
  leadsByStatus: { name: string; value: number }[];
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  userEmail: string;
  userRole: string;
  action: string;
  details: string;
}

