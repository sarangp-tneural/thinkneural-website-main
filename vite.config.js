import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

const COMPONENTS = path.resolve(import.meta.dirname, 'src/components');

// Replaces <!-- @include path/to/file.html --> with the file's contents
// (paths relative to src/components). Includes can be nested.
function htmlInclude() {
  const render = (html, seen = []) =>
    html.replace(/^([ \t]*)<!--\s*@include\s+(\S+)\s*-->/gm, (_, indent, file) => {
      const full = path.join(COMPONENTS, file);
      if (seen.includes(full)) throw new Error(`Circular include: ${file}`);
      const body = render(fs.readFileSync(full, 'utf8').replace(/\n$/, ''), [...seen, full]);
      return body.split('\n').map((l, i) => (i && l ? indent + l : l)).join('\n').replace(/^/, indent);
    });
  return {
    name: 'html-include',
    transformIndexHtml: { order: 'pre', handler: (html) => render(html) },
    configureServer(server) {
      server.watcher.add(COMPONENTS);
      server.watcher.on('change', (f) => {
        if (f.startsWith(COMPONENTS)) server.ws.send({ type: 'full-reload' });
      });
    },
  };
}

export default defineConfig({ plugins: [htmlInclude()] });
