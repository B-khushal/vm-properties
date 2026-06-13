import React, { useEffect, useState, JSX } from "react";
import { Blog, BlogComment } from "../types";
import { useRouter, Link } from "../components/Router";
import { Calendar, User, BookOpen, ArrowLeft, Search, Tag, MessageSquare } from "lucide-react";

export default function BlogPage(): JSX.Element {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const { getParams, navigate } = useRouter();
  const params = getParams();

  // Comments state
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentEmail, setCommentEmail] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [commentSuccess, setCommentSuccess] = useState("");

  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch blogs", err);
        setLoading(false);
      });
  }, []);

  // Prefill comments form with logged-in user if available
  useEffect(() => {
    const cached = localStorage.getItem("vm_properties_session");
    if (cached) {
      try {
        const u = JSON.parse(cached);
        setLoggedInUser(u);
        setCommentAuthor(u.name || "");
        setCommentEmail(u.email || "");
      } catch (e) {
        console.error("Failed to parse cached session", e);
      }
    }
  }, []);

  // Simple Markdown to HTML Parser to avoid extra dependencies and render beautifully
  const parseMarkdown = (text: string) => {
    return text.split("\n").map((line, index) => {
      const lineTrimmed = line.trim();
      if (lineTrimmed.startsWith("## ")) {
        return (
          <h2 key={index} className="font-display font-semibold text-2xl text-[#081B3A] mt-8 mb-4">
            {lineTrimmed.substring(3)}
          </h2>
        );
      }
      if (lineTrimmed.startsWith("### ")) {
        return (
          <h3 key={index} className="font-display font-medium text-lg text-[#081B3A] mt-6 mb-3">
            {lineTrimmed.substring(4)}
          </h3>
        );
      }
      if (lineTrimmed.startsWith("- ") || lineTrimmed.startsWith("* ")) {
        return (
          <li key={index} className="ml-6 list-disc mb-2 leading-relaxed text-slate-600">
            {lineTrimmed.substring(2)}
          </li>
        );
      }
      if (lineTrimmed.match(/^\d+\.\s/)) {
        return (
          <li key={index} className="ml-6 list-decimal mb-2 leading-relaxed text-slate-600">
            {lineTrimmed.replace(/^\d+\.\s/, "")}
          </li>
        );
      }
      if (lineTrimmed === "") {
        return <div key={index} className="h-4"></div>;
      }
      // Bold tags
      let renderedLine: React.ReactNode = lineTrimmed;
      if (lineTrimmed.includes("**")) {
        const parts = lineTrimmed.split("**");
        renderedLine = parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-[#081B3A] font-bold">{part}</strong> : part);
      }
      return <p key={index} className="mb-4 leading-relaxed text-slate-600 text-justify">{renderedLine}</p>;
    });
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!params.id) return;
    setCommentSubmitting(true);
    setCommentError("");
    setCommentSuccess("");

    fetch(`/api/blogs/${params.id}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        authorName: commentAuthor,
        authorEmail: commentEmail,
        content: commentContent
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error("Comment post failed");
        return res.json();
      })
      .then((newComment) => {
        setCommentContent("");
        setCommentSuccess("Your comment has been published!");
        setCommentSubmitting(false);
        // Update local blogs state to display it instantly
        setBlogs((prev) => 
          prev.map((b) => {
            if (b.id === params.id) {
              return {
                ...b,
                comments: [...(b.comments || []), newComment]
              };
            }
            return b;
          })
        );
      })
      .catch((err) => {
        console.error(err);
        setCommentError("Could not submit comment. Please try again.");
        setCommentSubmitting(false);
      });
  };

  // Render detail view if params.id is active
  if (params.id) {
    const blog = blogs.find((b) => b.id === params.id);

    if (loading) {
      return (
        <div className="pt-32 min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#C9A24B]"></div>
        </div>
      );
    }

    if (!blog) {
      return (
        <div className="pt-32 min-h-screen bg-slate-50 text-center max-w-xl mx-auto space-y-4">
          <h2 className="font-display text-2xl font-bold text-slate-800">Topic Profile Not Found</h2>
          <p className="text-slate-500 font-sans">The requested intelligence briefing has been relocated or expired.</p>
          <button
            onClick={() => navigate("/blog")}
            className="px-6 py-2.5 rounded bg-[#081B3A] text-[#C9A24B] uppercase tracking-wider font-display font-bold"
          >
            Go Back to Blog
          </button>
        </div>
      );
    }

    // Related blogs logic
    const relatedBlogs = blogs
      .filter((b) => b.id !== blog.id)
      .map((b) => {
        const commonTags = b.tags.filter((t) => blog.tags.includes(t)).length;
        return { blog: b, commonTags };
      })
      .sort((a, b) => {
        if (b.commonTags !== a.commonTags) {
          return b.commonTags - a.commonTags;
        }
        if (a.blog.category === blog.category && b.blog.category !== blog.category) return -1;
        if (b.blog.category === blog.category && a.blog.category !== blog.category) return 1;
        return 0;
      })
      .map((item) => item.blog)
      .slice(0, 3);

    return (
      <div className="pt-24 min-h-screen bg-slate-50 text-slate-800 font-sans">
        {/* Dynamic SEO Meta Schema tags inject */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back btn */}
          <button
            onClick={() => navigate("/blog")}
            className="flex items-center gap-2 text-sm text-[#081B3A] hover:text-[#C9A24B] transition-colors font-semibold group cursor-pointer mb-6"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> BACK TO REAL ESTATE NEWS
          </button>

          {/* Article Header */}
          <div className="space-y-4 mb-8">
            <span className="px-3.5 py-1 text-xs tracking-widest text-white rounded bg-[#C9A24B] font-display font-bold uppercase">
              {blog.category}
            </span>
            <h1 className="font-display font-medium text-3xl md:text-4.5xl leading-tight text-[#081B3A]">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 border-y border-slate-200 py-3 font-medium">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#C9A24B]" /> {blog.publishDate}
              </span>
              <span className="flex items-center gap-2">
                <User className="h-4 w-4 text-[#C9A24B]" /> By {blog.author}
              </span>
              <span className="flex items-center gap-2 font-display">
                <BookOpen className="h-4 w-4 text-[#C9A24B]" /> VM Intelligence Board
              </span>
            </div>
          </div>

          {/* Hero image */}
          <div className="rounded overflow-hidden shadow-md mb-10 border border-slate-200">
            <img src={blog.image} alt={blog.title} className="w-full object-cover max-h-[480px]" />
          </div>

          {/* Render parsed text */}
          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-sans text-base">
            <div className="markdown-body text-justify">{parseMarkdown(blog.content)}</div>
          </div>

          {/* Tags */}
          <div className="mt-12 pt-6 border-t border-slate-200 flex flex-wrap gap-2.5 items-center">
            <span className="text-xs text-slate-400 font-display font-bold uppercase flex items-center gap-1.5 shrink-0">
              <Tag className="h-4 w-4 text-[#C9A24B]" /> Tags:
            </span>
            {blog.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-slate-200/60 rounded text-xs text-[#081B3A] font-sans font-medium hover:bg-[#C9A24B]/10 hover:text-[#C9A24B] transition-all cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>

          {/* Comments Section */}
          <div className="mt-16 pt-8 border-t border-slate-200 space-y-8">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <MessageSquare className="h-5 w-5 text-[#C9A24B]" />
              <h3 className="font-display font-medium text-lg text-[#081B3A] tracking-tight">
                Client Discussions & Inquiries ({blog.comments?.length || 0})
              </h3>
            </div>

            <div className="space-y-4">
              {blog.comments && blog.comments.length > 0 ? (
                blog.comments.map((comment) => (
                  <div key={comment.id} className="bg-white p-5 rounded border border-slate-200/60 shadow-sm space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-[#081B3A] text-[#C9A24B] border border-[#C9A24B]/30 flex items-center justify-center font-display font-bold uppercase text-xs">
                          {comment.authorName.substring(0, 2)}
                        </div>
                        <span className="font-bold text-[#081B3A]">{comment.authorName}</span>
                      </div>
                      <span className="text-slate-400 font-medium font-mono text-[10px]">{comment.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 pl-10.5 font-sans leading-relaxed text-justify">{comment.content}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-white border border-slate-200/80 rounded text-slate-400 text-xs font-sans">
                  No comments yet. Share your thoughts on this real estate briefing.
                </div>
              )}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="bg-white p-6 rounded border border-slate-200 shadow-sm space-y-4">
              <h4 className="font-display font-bold text-xs text-[#081B3A] uppercase tracking-widest border-b pb-3">
                Post an Advisory Inquiry / Comment
              </h4>
              
              {commentError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-600 font-sans">
                  {commentError}
                </div>
              )}
              {commentSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-600 font-sans font-semibold">
                  {commentSuccess}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 font-display block">Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Sharma"
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    disabled={!!loggedInUser}
                    className="w-full px-3.5 py-2 border rounded text-xs bg-slate-50 outline-none focus:bg-white focus:ring-1 focus:ring-[#C9A24B] focus:border-[#C9A24B] disabled:bg-slate-100 disabled:text-slate-500 font-sans"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 font-display block">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. vikram@domain.com"
                    value={commentEmail}
                    onChange={(e) => setCommentEmail(e.target.value)}
                    disabled={!!loggedInUser}
                    className="w-full px-3.5 py-2 border rounded text-xs bg-slate-50 outline-none focus:bg-white focus:ring-1 focus:ring-[#C9A24B] focus:border-[#C9A24B] disabled:bg-slate-100 disabled:text-slate-500 font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 font-display block">Message Content</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Type your feedback or question regarding this briefing..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  className="w-full p-3.5 border rounded text-xs bg-slate-50 outline-none focus:bg-white focus:ring-1 focus:ring-[#C9A24B] focus:border-[#C9A24B] font-sans"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={commentSubmitting}
                className="px-6 py-3 bg-[#081B3A] text-[#C9A24B] hover:text-white disabled:opacity-50 font-display text-[10px] tracking-widest font-bold uppercase rounded cursor-pointer transition-all active:scale-95 shadow"
              >
                {commentSubmitting ? "TRANSMITTING..." : "POST COMMENT"}
              </button>
            </form>
          </div>

          {/* Related Briefings */}
          {relatedBlogs.length > 0 && (
            <div className="mt-16 pt-8 border-t border-slate-200 space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#C9A24B] font-bold font-display block">
                  Related Intelligence
                </span>
                <h3 className="font-display text-xl font-light text-[#081B3A]">
                  Recommended Advisory Briefings
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogs.map((rBlog) => (
                  <div
                    key={rBlog.id}
                    onClick={() => {
                      navigate(`/blog/${rBlog.id}`);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="bg-white border border-slate-200 rounded overflow-hidden shadow-sm hover:shadow-md hover:border-[#C9A24B]/30 group cursor-pointer transition-all duration-300 flex flex-col h-full"
                  >
                    <div className="aspect-video relative overflow-hidden bg-slate-900">
                      <img
                        src={rBlog.image}
                        alt={rBlog.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold font-display text-[#C9A24B] uppercase tracking-wider">
                          {rBlog.category}
                        </span>
                        <h4 className="font-display font-medium text-xs text-[#081B3A] tracking-tight group-hover:text-[#C9A24B] transition-colors line-clamp-2 leading-snug">
                          {rBlog.title}
                        </h4>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono">{rBlog.publishDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legal RERA warning */}
          <div className="mt-12 p-5 bg-slate-100 rounded border border-slate-200 text-xs text-slate-500 leading-relaxed font-sans">
            <p className="font-bold uppercase tracking-wider text-[#081B3A] mb-1">MARKET KNOWLEDGE NOTICE</p>
            Insights published by the VM PROPERTIES analyst panel represent generic evaluation guidelines. Capital placement calculations, property appreciations index records, and high street legal assessments should be structured via countersigned counselors.
          </div>
        </div>
      </div>
    );
  }

  // --- LISTING VIEW ---
  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === "All" || b.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const categories = ["All", "Real Estate News", "Investment Tips", "Property Guides", "Market Trends"];

  return (
    <div className="pt-24 min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Editorial Banner */}
      <div className="bg-[#081B3A] text-white py-16 text-center border-b border-[#C9A24B]/30 mb-8">
        <div className="max-w-4xl mx-auto px-4 space-y-3">
          <p className="font-display text-xs tracking-[0.4em] text-[#C9A24B] uppercase font-bold">
            VM PROPERTIES INTELLIGENCE
          </p>
          <h1 className="font-display font-medium text-3xl md:text-5xl tracking-tight text-slate-100">
            Real Estate Market Insights
          </h1>
          <div className="h-[2px] w-24 bg-[#C9A24B] mx-auto mt-4"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search and category filters */}
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-12 bg-white p-5 border border-slate-200 rounded shadow-sm">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded text-xs font-display tracking-wider font-bold uppercase transition-all duration-300 border cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#C9A24B] text-[#081B3A] border-[#C9A24B]"
                    : "bg-slate-50 text-slate-600 border-slate-200/80 hover:border-[#C9A24B]/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded w-full lg:max-w-xs">
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search advisory articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-slate-700 outline-none w-full font-sans"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#C9A24B]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white border border-slate-200 rounded overflow-hidden flex flex-col hover:shadow-lg transition-transform hover:-translate-y-1 duration-300 shadow-sm"
              >
                <div className="aspect-video relative overflow-hidden group">
                  <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-[#C9A24B] text-white text-[10px] tracking-widest font-display font-medium uppercase rounded">
                    {blog.category}
                  </span>
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs text-slate-400 flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-[#C9A24B]" /> {blog.publishDate} • By {blog.author}
                    </p>
                    <h2 className="font-display font-bold text-lg text-[#081B3A] line-clamp-2 leading-snug">
                      {blog.title}
                    </h2>
                    <p className="text-slate-500 text-xs font-sans line-clamp-3 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </div>

                  <Link
                    href={`/blog/${blog.id}`}
                    className="inline-flex items-center gap-1.5 text-xs tracking-widest uppercase text-[#C9A24B] font-display font-bold hover:text-[#081B3A] transition-colors pt-2 shrink-0"
                  >
                    READ ARTICLE <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredBlogs.length === 0 && !loading && (
          <div className="text-center py-20 bg-white border rounded border-slate-200">
            <p className="text-slate-400 font-sans">No estate reports or insights matched your selection.</p>
          </div>
        )}
      </div>
    </div>
  );
}
