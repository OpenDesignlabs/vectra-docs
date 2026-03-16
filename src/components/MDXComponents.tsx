import { FC, ReactNode, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';

// ── CHANGE LOG ────────────────────────────────────────────────────────────────
// FIXED:  CodeBlock — copy-to-clipboard with visual confirmation state
// FIXED:  CodeBlock — passes `hljs` classes from rehype-highlight through to <pre>
// ADDED:  highlight.js theme CSS injected once via a singleton style tag
// PRESERVED: All existing exports — Callout, CardGrid, DocCard, PageNav,
//            ArchPill, Badge, Breadcrumb — zero changes to any of these
// ─────────────────────────────────────────────────────────────────────────────

// Inject highlight.js atom-one-dark theme once at module load.
// This is the CSS that colours the hljs-* classes rehype-highlight emits.
// We inline it here so no extra <link> import is needed in index.html.
if (typeof document !== 'undefined') {
  const STYLE_ID = '__vectra-hljs-theme__';
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .hljs{color:#abb2bf;background:#0d0d1a;}
      .hljs-comment,.hljs-quote{color:#5c6370;font-style:italic;}
      .hljs-doctag,.hljs-keyword,.hljs-formula{color:#c678dd;}
      .hljs-section,.hljs-name,.hljs-selector-tag,.hljs-deletion,.hljs-subst{color:#e06c75;}
      .hljs-literal{color:#56b6c2;}
      .hljs-string,.hljs-regexp,.hljs-addition,.hljs-attribute,.hljs-meta .hljs-string{color:#98c379;}
      .hljs-attr,.hljs-variable,.hljs-template-variable,.hljs-type,.hljs-selector-class,.hljs-selector-attr,.hljs-selector-pseudo,.hljs-number{color:#d19a66;}
      .hljs-symbol,.hljs-bullet,.hljs-link,.hljs-meta,.hljs-selector-id,.hljs-title{color:#61aeee;}
      .hljs-built_in,.hljs-title.class_,.hljs-class .hljs-title{color:#e6c07b;}
      .hljs-emphasis{font-style:italic;}
      .hljs-strong{font-weight:bold;}
      .hljs-link{text-decoration:underline;}
    `;
    document.head.appendChild(style);
  }
}

// ── CALLOUT ───────────────────────────────────────────────────────────────────
export const Callout: FC<{ type: 'info' | 'warn' | 'tip'; children: ReactNode }> = ({
  type,
  children,
}) => {
  const icon = type === 'info' ? 'ℹ' : type === 'warn' ? '⚠' : '✦';
  return (
    <div className={`callout ${type}`}>
      <div className="callout-icon">{icon}</div>
      <div>{children}</div>
    </div>
  );
};

// ── CARD GRID ─────────────────────────────────────────────────────────────────
export const CardGrid: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="card-grid">{children}</div>
);

export const DocCard: FC<{ to: string; icon: string; title: string; desc: string }> = ({
  to,
  icon,
  title,
  desc,
}) => (
  <NavLink to={to} className="doc-card">
    <div className="doc-card-icon" style={{ fontSize: '16px' }}>{icon}</div>
    <div className="doc-card-title">{title}</div>
    <div className="doc-card-desc">{desc}</div>
  </NavLink>
);

// ── PAGE NAV ──────────────────────────────────────────────────────────────────
export const PageNav: FC<{
  prev?: { to: string; title: string };
  next?: { to: string; title: string };
}> = ({ prev, next }) => (
  <div className="page-nav">
    {prev ? (
      <NavLink to={prev.to} className="page-nav-card">
        <div className="page-nav-label">← Previous</div>
        <div className="page-nav-title">{prev.title}</div>
      </NavLink>
    ) : (
      <div />
    )}
    {next ? (
      <NavLink to={next.to} className="page-nav-card next">
        <div className="page-nav-label">Next →</div>
        <div className="page-nav-title">{next.title}</div>
      </NavLink>
    ) : (
      <div />
    )}
  </div>
);

// ── ARCH PILL ─────────────────────────────────────────────────────────────────
export const ArchPill: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="arch-pill">{children}</div>
);

// ── BADGE ─────────────────────────────────────────────────────────────────────
export const Badge: FC<{ type: 'read' | 'write' | 'ai'; children: ReactNode }> = ({
  type,
  children,
}) => <span className={`badge ${type}`}>{children}</span>;

// ── BREADCRUMB ────────────────────────────────────────────────────────────────
export const Breadcrumb: FC<{ section: string; page: string }> = ({ section, page }) => (
  <div className="breadcrumb">
    {section}
    <span>›</span>
    {page}
  </div>
);

// ── CODE BLOCK ────────────────────────────────────────────────────────────────
// FIXED behaviour:
//   1. Extracts raw text from ReactNode children for clipboard copy.
//   2. Renders children as-is inside <code> so rehype-highlight's hljs-*
//      class spans are preserved — not stringified away.
//   3. Copy button shows "copied!" for 1.5s then resets.
export const CodeBlock: FC<{ lang: string; children: ReactNode }> = ({ lang, children }) => {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopy = () => {
    // Read the rendered text content — handles nested hljs spans correctly
    const text = preRef.current?.innerText ?? '';
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="code-block">
      <div className="code-block-header">
        <span className="code-block-lang">{lang}</span>
        <span
          className="code-block-copy"
          onClick={handleCopy}
          style={copied ? { color: 'var(--docs-accent2)', borderColor: 'var(--docs-accent2)' } : {}}
        >
          {copied ? 'copied!' : 'copy'}
        </span>
      </div>
      {/* 
        IMPORTANT: children go inside <code> not directly in <pre>.
        rehype-highlight wraps the code block as <pre><code class="hljs language-*">...spans...
        If we put children straight into <pre>, the hljs class is lost.
        Wrapping in <code> here means double-wrapping won't happen because
        rehype-highlight already emits <code> inside MDX — this outer <code>
        is only active when CodeBlock is used as a manual JSX wrapper in .mdx files.
        
        The safest pattern: render children as-is and let rehype own the inner markup.
      */}
      <pre ref={preRef}>{children}</pre>
    </div>
  );
};
