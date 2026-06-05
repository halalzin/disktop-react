const fs = require('fs');
const path = require('path');

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(js|jsx|css)$/.test(full)) {
      let text = fs.readFileSync(full, 'utf8');
      text = text.replace(/\/\*\s*@__PURE__\s*\*\//g, '');
      text = text.replace(/\/\*#__PURE__\*\//g, '');
      fs.writeFileSync(full, text);
    }
  }
}

walk(path.join(process.cwd(), 'src'));
console.log('PURE comments removed.');
