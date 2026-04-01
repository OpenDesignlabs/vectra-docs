import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const sectionMap: Record<string, string> = {
  '/': 'General',
  '/what-is-vectra': 'General',
  '/quickstart': 'General',
  '/canvas': 'Building with Vectra',
  '/pages-nav': 'Building with Vectra',
  '/styling': 'Building with Vectra',
  '/ai-generation': 'Features',
  '/figma-import': 'Features',
  '/components-sections': 'Features',
  '/export-deploy': 'Exporting & Deploying',
  '/shortcuts': 'Reference',
  '/constraints': 'Building with Vectra',
  '/ide-connector': 'Integrations',
  '/marketplace': 'Resources',
  '/mcp': 'Integrations',
  '/mcp-tools': 'Integrations',
  '/intro': 'General',
};

interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

function useToc(pathname: string) {
  const [entries, setEntries] = useState<TocEntry[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const t = setTimeout(() => {
      const container = document.querySelector('.docs-content');
      if (!container) return;
      const headings = Array.from(
        container.querySelectorAll<HTMLHeadingElement>('h2, h3')
      );
      const built: TocEntry[] = headings.map((el, i) => {
        if (!el.id) {
          el.id =
            el.textContent
              ?.toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '') ?? `heading-${i}`;
        }
        return { id: el.id, text: el.textContent ?? '', level: el.tagName === 'H2' ? 2 : 3 };
      });
      setEntries(built);
      setActiveId(built[0]?.id ?? '');
    }, 80);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    if (entries.length === 0) return;
    const observer = new IntersectionObserver(
      (obs) => {
        for (const o of obs) {
          if (o.isIntersecting) { setActiveId(o.target.id); break; }
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

function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('vectra-theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('vectra-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return { theme, toggleTheme };
}

const Layout = () => {
  const { pathname } = useLocation();
  const currentSection = sectionMap[pathname] ?? 'Docs';
  const { entries: tocEntries, activeId } = useToc(pathname);
  const { theme, toggleTheme } = useTheme();

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
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '12px' }}>
            <div className="sidebar-badge">DOCS</div>
            <span className="sidebar-version">v1.0</span>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">General</div>
          <NavLink end to="/" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <div className="dot" />Welcome
          </NavLink>
          <NavLink to="/what-is-vectra" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <div className="dot" />What is Vectra?
          </NavLink>
          <NavLink to="/intro" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <div className="dot" />Introduction
          </NavLink>
          <NavLink to="/quickstart" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <div className="dot" />Quickstart
          </NavLink>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">Building with Vectra</div>
          <NavLink to="/canvas" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <div className="dot" />The Canvas
          </NavLink>
          <NavLink to="/pages-nav" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <div className="dot" />Pages & Navigation
          </NavLink>
          <NavLink to="/styling" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <div className="dot" />Styling Elements
          </NavLink>
          <NavLink to="/constraints" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <div className="dot" />Constraints
          </NavLink>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">Features</div>
          <NavLink to="/ai-generation" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <div className="dot" />AI Generation
          </NavLink>
          <NavLink to="/figma-import" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <div className="dot" />Figma Import
          </NavLink>
          <NavLink to="/components-sections" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <div className="dot" />Components & Sections
          </NavLink>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">Integrations</div>
          <NavLink to="/ide-connector" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <div className="dot" />IDE Connector
          </NavLink>
          <NavLink to="/mcp" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <div className="dot" />MCP Overview
          </NavLink>
          <NavLink to="/mcp-tools" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <div className="dot" />MCP Tools
          </NavLink>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">Resources</div>
          <NavLink to="/marketplace" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <div className="dot" />Marketplace
          </NavLink>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">Exporting & Deploying</div>
          <NavLink to="/export-deploy" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <div className="dot" />Export & Deploy
          </NavLink>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">Reference</div>
          <NavLink to="/shortcuts" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <div className="dot" />Keyboard Shortcuts
          </NavLink>
        </div>

        <div style={{ height: '32px' }} />
      </aside>

      <div className="docs-main">
        <div className="docs-topbar">
          <div className="topbar-logo">
            <div className="topbar-logo-mark" style={{ width: '24px', height: '24px', fontSize: '11px' }}>V</div>
            Docs
          </div>
          <div className="topbar-divider" />
          <span className="topbar-label">{currentSection}</span>
          <div className="topbar-search" style={{ marginLeft: 'auto' }}>
            <span>Search docs…</span>
            <kbd>⌘K</kbd>
          </div>
          <div className="topbar-links">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme" title="Toggle Theme">
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <div className="topbar-link">GitHub</div>
            <div className="topbar-link">Forum</div>
            <div className="topbar-link">Studio ↗</div>
          </div>
        </div>

        <div className="docs-content-wrap">
          <main className="docs-content">
            <Outlet />
          </main>

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
