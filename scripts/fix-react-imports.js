const fs = require('fs');
const path = require('path');

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.jsx$/.test(full)) {
      const text = fs.readFileSync(full, 'utf8');
      if (!/^import\s+\*\s+as\s+React\s+from\s+['"]react['"];?/m.test(text)) {
        fs.writeFileSync(full, 'import * as React from "react";\n' + text);
      }
    }
  }
}

walk(path.join(process.cwd(), 'src'));
console.log('React import added to JSX files.');
