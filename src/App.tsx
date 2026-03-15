import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';
import Layout from './Layout';
import Welcome from './pages/welcome.mdx';
import Intro from './pages/intro.mdx';
import Quickstart from './pages/quickstart.mdx';
import MCP from './pages/mcp.mdx';
import MCPTools from './pages/mcp-tools.mdx';
import Constraints from './pages/constraints.mdx';
import * as CustomComponents from './components/MDXComponents';

const components = {
  ...CustomComponents,
  // You can also override standard elements here if you want
};

function Stub({ title }: { title: string }) {
  return (
    <>
      <div className="page-eyebrow">Stub Page</div>
      <h1 className="page-title">{title}</h1>
      <CustomComponents.Callout type="tip">
        ✦ Coming soon.
      </CustomComponents.Callout>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <MDXProvider components={components}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Welcome />} />
            <Route path="intro" element={<Intro />} />
            <Route path="quickstart" element={<Quickstart />} />
            <Route path="mcp" element={<MCP />} />
            <Route path="mcp-tools" element={<MCPTools />} />
            <Route path="constraints" element={<Constraints />} />
            
            {/* Stubs */}
            <Route path="canvas" element={<Stub title="Canvas Overview" />} />
            <Route path="nodes" element={<Stub title="Node System" />} />
            <Route path="pages" element={<Stub title="Multi-Page Architecture" />} />
            <Route path="layers" element={<Stub title="Layers Panel" />} />
            <Route path="mcp-mutations" element={<Stub title="Mutation Protocol" />} />
            <Route path="vfs" element={<Stub title="VFS Lifecycle" />} />
            <Route path="ports" element={<Stub title="Port Architecture" />} />
            <Route path="rust" element={<Stub title="WASM Engine Overview" />} />
            <Route path="history" element={<Stub title="History Manager" />} />
            <Route path="figma" element={<Stub title="Figma Proxy" />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </MDXProvider>
    </BrowserRouter>
  );
}

export default App;
