// Auto-stamp sw.js with a unique build timestamp so the browser
// always detects a new service worker after each deploy.
const fs = require("fs");
const path = require("path");

const swPath = path.join(__dirname, "..", "public", "sw.js");
let content = fs.readFileSync(swPath, "utf-8");

// Replace the SW_VERSION with current timestamp
const timestamp = Date.now().toString(36);
content = content.replace(
  /const SW_VERSION = "[^"]*";/,
  `const SW_VERSION = "${timestamp}";`
);

fs.writeFileSync(swPath, content);
console.log(`[SW] Version stamped: ${timestamp}`);
