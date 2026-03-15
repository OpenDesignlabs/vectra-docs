import { FC, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

export const Callout: FC<{ type: 'info' | 'warn' | 'tip', children: ReactNode }> = ({ type, children }) => {
  const icon = type === 'info' ? 'ℹ' : type === 'warn' ? '⚠' : '✦';
  return (
    <div className={`callout ${type}`}>
      <div className="callout-icon">{icon}</div>
      <div>{children}</div>
    </div>
  );
};

export const CardGrid: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="card-grid">{children}</div>
);

export const DocCard: FC<{ to: string, icon: string, title: string, desc: string }> = ({ to, icon, title, desc }) => (
  <NavLink to={to} className="doc-card">
    <div className="doc-card-icon" style={{ fontSize: '16px' }}>{icon}</div>
    <div className="doc-card-title">{title}</div>
    <div className="doc-card-desc">{desc}</div>
  </NavLink>
);

export const PageNav: FC<{ prev?: { to: string, title: string }, next?: { to: string, title: string } }> = ({ prev, next }) => (
  <div className="page-nav">
    {prev ? (
      <NavLink to={prev.to} className="page-nav-card">
        <div className="page-nav-label">← Previous</div>
        <div className="page-nav-title">{prev.title}</div>
      </NavLink>
    ) : <div />}
    {next ? (
      <NavLink to={next.to} className="page-nav-card next">
        <div className="page-nav-label">Next →</div>
        <div className="page-nav-title">{next.title}</div>
      </NavLink>
    ) : <div />}
  </div>
);

export const ArchPill: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="arch-pill">{children}</div>
);

export const Badge: FC<{ type: 'read' | 'write' | 'ai', children: ReactNode }> = ({ type, children }) => (
  <span className={`badge ${type}`}>{children}</span>
);

export const Breadcrumb: FC<{ section: string, page: string }> = ({ section, page }) => (
  <div className="breadcrumb">{section}<span>›</span>{page}</div>
);

export const CodeBlock: FC<{ lang: string, children: ReactNode }> = ({ lang, children }) => {
  return (
    <div className="code-block">
      <div className="code-block-header">
        <span className="code-block-lang">{lang}</span>
        <span className="code-block-copy">copy</span>
      </div>
      <pre>{children}</pre>
    </div>
  );
};
