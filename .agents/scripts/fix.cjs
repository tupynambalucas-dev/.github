const fs = require('fs');
const path = require('path');

const pkgPath = path.resolve(process.cwd(), 'package.json');
if (fs.existsSync(pkgPath)) {
  let content = fs.readFileSync(pkgPath, 'utf8');
  content = content.replace('"version": "1.0.0"', '"version": "12.6.0"');
  content = content.replace(/("name"\s*:\s*"[^"]+",)/, '$1\n  "version": "1.0.0",');
  fs.writeFileSync(pkgPath, content);
}
