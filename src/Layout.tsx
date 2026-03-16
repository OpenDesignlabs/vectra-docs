import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

// ── CHANGE LOG ────────────────────────────────────────────────────────────────
// FIXED:  NavLink to="/" now has `end` prop — was matching active on all routes
// ADDED:  Live TOC via IntersectionObserver — scrapes h2/h3 from rendered content
// PRESERVED: All sectionMap entries, all NavLink structure, sidebar layout
// ─────────────────────────────────────────────────────────────────────────────

const sectionMap: Record<string, string> = {
  '/': 'General resources',
  '/intro': 'General resources',
  '/quickstart': 'General resources',
  '/canvas': 'Canvas & Editor',
  '/nodes': 'Canvas & Editor',
  '/pages': 'Canvas & Editor',
  '/layers': 'Canvas & Editor',
  '/mcp': 'MCP Protocol',
  '/mcp-tools': 'MCP Protocol',
  '/mcp-mutations': 'MCP Protocol',
  '/vfs': 'VFS & WebContainer',
  '/ports': 'VFS & WebContainer',
  '/rust': 'Rust Engine',
  '/history': 'Rust Engine',
  '/figma': 'Figma Import',
  '/constraints': 'Architecture Constraints',
};

interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

// Scrapes rendered h2/h3 from the .docs-content div and builds the TOC list.
// Runs after each route change via pathname dep. Assigns IDs if missing.
function useToc(pathname: string) {
  const [entries, setEntries] = useState<TocEntry[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Small delay — wait for MDX content to mount into the DOM
    const t = setTimeout(() => {
      const container = document.querySelector('.docs-content');
      if (!container) return;

      const headings = Array.from(
        container.querySelectorAll<HTMLHeadingElement>('h2, h3')
      );

      const built: TocEntry[] = headings.map((el, i) => {
        if (!el.id) {
          // Auto-assign stable id from text content
          el.id = el.textContent
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') ?? `heading-${i}`;
        }
        return {
          id: el.id,
          text: el.textContent ?? '',
          level: el.tagName === 'H2' ? 2 : 3,
        };
      });

      setEntries(built);
      setActiveId(built[0]?.id ?? '');
    }, 80);

    return () => clearTimeout(t);
  }, [pathname]);

  // IntersectionObserver — highlights the TOC entry whose heading is in view
  useEffect(() => {
    if (entries.length === 0) return;

    const observer = new IntersectionObserver(
      (observations) => {
        for (const obs of observations) {
          if (obs.isIntersecting) {
            setActiveId(obs.target.id);
            break;
          }
        }
      },
      { rootMargin: '0px 0px -60% 0px', threshold: 0 }
    );

    entries.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [entries]);

  return { entries, activeId };
}

const Layout = () => {
  const { pathname } = useLocation();
  const currentSection = sectionMap[pathname] ?? 'Docs';
  const { entries: tocEntries, activeId } = useToc(pathname);
  const contentRef = useRef<HTMLElement>(null);

  const scrollToId = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="docs-shell">
      <aside className="docs-sidebar">
        <div className="sidebar-header">
          <div className="topbar-logo">
            <div className="topbar-logo-mark">V</div>
            <span>Vectra</span>
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '8px' }}>
            <div className="sidebar-badge">● DOCS</div>
            <span className="sidebar-version">v1.0 alpha</span>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">General</div>
          {/* FIX: `end` prevents "/" from matching as active on all routes */}
          <NavLink end to="/" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <div className="dot" />Welcome to Vectra<div className="sidebar-badge-new">NEW</div>
          </NavLink>
          <NavLink to="/intro" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <div className="dot" />Introduction
          </NavLink>
          <NavLink to="/quickstart" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <div className="dot" />Quickstart
          </NavLink>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">Canvas & Editor</div>
          <NavLink to="/canvas" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <div className="dot" />Canvas Overview
          </NavLink>
          <NavLink to="/nodes" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <div className="dot" />Node System
          </NavLink>
          <NavLink to="/pages" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <div className="dot" />Multi-Page Architecture
          </NavLink>
          <NavLink to="/layers" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <div className="dot" />Layers Panel
          </NavLink>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">MCP Protocol</div>
          <NavLink to="/mcp" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <div className="dot" />MCP Server Overview<div className="sidebar-badge-new">NEW</div>
          </NavLink>
          <NavLink to="/mcp-tools" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <div className="dot" />Tool Reference
          </NavLink>
          <NavLink to="/mcp-mutations" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <div className="dot" />Mutation Protocol
          </NavLink>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">VFS & WebContainer</div>
          <NavLink to="/vfs" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <div className="dot" />VFS Lifecycle
          </NavLink>
          <NavLink to="/ports" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <div className="dot" />Port Architecture
          </NavLink>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">Rust Engine</div>
          <NavLink to="/rust" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <div className="dot" />WASM Engine Overview
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <div className="dot" />History Manager
          </NavLink>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">Figma Import</div>
          <NavLink to="/figma" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <div className="dot" />Figma Proxy
          </NavLink>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">Architecture Constraints</div>
          <NavLink to="/constraints" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <div className="dot" />Permanent Guardrails
          </NavLink>
        </div>

        <div style={{ height: '32px' }} />
      </aside>

      <div className="docs-main">
        <div className="docs-topbar">
          <div className="topbar-logo" style={{ fontSize: '13px' }}>
            <div className="topbar-logo-mark" style={{ width: '22px', height: '22px', fontSize: '10px' }}>V</div>
            Docs
          </div>
          <div className="topbar-divider" />
          <span className="topbar-label">{currentSection}</span>
          <div className="topbar-search" style={{ marginLeft: 'auto' }}>
            <span>Search docs…</span>
            <kbd>⌘K</kbd>
          </div>
          <div className="topbar-links">
            <div className="topbar-link">GitHub</div>
            <div className="topbar-link">Forum</div>
            <div className="topbar-link">Studio ↗</div>
          </div>
        </div>

        <div className="docs-content-wrap">
          <main className="docs-content" ref={contentRef}>
            <Outlet />
          </main>

          {/* FIXED: Live TOC — populated from IntersectionObserver scrape */}
          <nav className="docs-toc">
            {tocEntries.length > 0 && (
              <>
                <div className="toc-label">On this page</div>
                {tocEntries.map((entry) => (
                  <span
                    key={entry.id}
                    className={`toc-item ${entry.id === activeId ? 'active' : ''}`}
                    style={{ paddingLeft: entry.level === 3 ? '24px' : '12px' }}
                    onClick={() => scrollToId(entry.id)}
                  >
                    {entry.text}
                  </span>
                ))}
              </>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Layout;
