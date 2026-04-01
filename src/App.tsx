import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';
import Layout from './Layout';
import * as CustomComponents from './components/MDXComponents';

import Welcome from './pages/welcome.mdx';
import WhatIsVectra from './pages/what-is-vectra.mdx';
import Quickstart from './pages/quickstart.mdx';
import Canvas from './pages/canvas.mdx';
import PagesNav from './pages/pages-nav.mdx';
import Styling from './pages/styling.mdx';
import AIGeneration from './pages/ai-generation.mdx';
import FigmaImport from './pages/figma-import.mdx';
import ComponentsSections from './pages/components-sections.mdx';
import ExportDeploy from './pages/export-deploy.mdx';
import Shortcuts from './pages/shortcuts.mdx';
import Constraints from './pages/constraints.mdx';
import IDEConnector from './pages/ide-connector.mdx';
import Marketplace from './pages/marketplace.mdx';
import MCP from './pages/mcp.mdx';
import MCPTools from './pages/mcp-tools.mdx';
import Intro from './pages/intro.mdx';

function App() {
  return (
    <BrowserRouter>
      <MDXProvider components={CustomComponents}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Welcome />} />
            <Route path="what-is-vectra" element={<WhatIsVectra />} />
            <Route path="quickstart" element={<Quickstart />} />
            <Route path="canvas" element={<Canvas />} />
            <Route path="pages-nav" element={<PagesNav />} />
            <Route path="styling" element={<Styling />} />
            <Route path="ai-generation" element={<AIGeneration />} />
            <Route path="figma-import" element={<FigmaImport />} />
            <Route path="components-sections" element={<ComponentsSections />} />
            <Route path="export-deploy" element={<ExportDeploy />} />
            <Route path="shortcuts" element={<Shortcuts />} />
            <Route path="constraints" element={<Constraints />} />
            <Route path="ide-connector" element={<IDEConnector />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="mcp" element={<MCP />} />
            <Route path="mcp-tools" element={<MCPTools />} />
            <Route path="intro" element={<Intro />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </MDXProvider>
    </BrowserRouter>
  );
}

export default App;
