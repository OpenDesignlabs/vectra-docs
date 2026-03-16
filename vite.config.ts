import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import rehypeHighlight from 'rehype-highlight';

export default defineConfig({
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        rehypePlugins: [rehypeHighlight],
        providerImportSource: '@mdx-js/react',
      }),
    },
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
  ],
});
