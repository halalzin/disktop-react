const fs = require('fs');
const path = require('path');

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.jsx$/.test(full)) {
      let text = fs.readFileSync(full, 'utf8');
      const hasDefault = /import\s+React\s+from\s+['\"]react['\"];?/m.test(text);
      const hasNamespace = /import\s+\*\s+as\s+React\s+from\s+['\"]react['\"];?/m.test(text);

      if (hasNamespace && hasDefault) {
        text = text.replace(/^import\s+\*\s+as\s+React\s+from\s+['\"]react['\"];?\n/m, '');
      } else if (hasNamespace) {
        text = text.replace(/^import\s+\*\s+as\s+React\s+from\s+['\"]react['\"];?\n/m, 'import React from "react";\n');
      }

      fs.writeFileSync(full, text);
    }
  }
}

walk(path.join(process.cwd(), 'src'));
console.log('React imports normalized.');
