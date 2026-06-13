import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface RouterContextProps {
  currentPath: string;
  navigate: (to: string) => void;
  getParams: () => { [key: string]: string };
}

const RouterContext = createContext<RouterContextProps | undefined>(undefined);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const navigate = (to: string) => {
    if (to === window.location.pathname) return;
    window.history.pushState({}, "", to);
    setCurrentPath(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getParams = (): { [key: string]: string } => {
    // Parse dynamic routes like /property/:id or /blog/:id
    const params: { [key: string]: string } = {};
    const parts = currentPath.split("/").filter(Boolean);

    if (parts[0] === "property" && parts[1]) {
      params.id = parts[1];
    } else if (parts[0] === "blog" && parts[1]) {
      params.id = parts[1];
    }
    return params;
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate, getParams }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within a RouterProvider");
  }
  return context;
}

export function Link({
  href,
  children,
  className,
  id,
  activeClassName,
  onClick,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  id?: string;
  activeClassName?: string;
  onClick?: (e: any) => void;
  key?: any;
}) {
  const { currentPath, navigate } = useRouter();
  const isActive = currentPath === href;

  const handleClick = (e: any) => {
    e.preventDefault();
    if (onClick) {
      onClick(e);
    }
    navigate(href);
  };

  return (
    <a
      id={id}
      href={href}
      onClick={handleClick}
      className={`${className} ${isActive && activeClassName ? activeClassName : ""}`}
    >
      {children}
    </a>
  );
}
