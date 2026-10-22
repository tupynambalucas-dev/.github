const fs = require('fs');
const path = require('path');

const srcMcp = process.env.SRC_MCP || process.argv[2];
const destMcpDir = process.env.DEST_MCP_DIR || process.argv[3];
const srcMemory = process.env.SRC_MEMORY || process.argv[4];
const destMemoryDir = process.env.DEST_MEMORY_DIR || process.argv[5];

if (!srcMcp || !destMcpDir || !srcMemory || !destMemoryDir) {
  console.log('Usage: node split-yamls.cjs <srcMcp> <destMcpDir> <srcMemory> <destMemoryDir>');
  process.exit(0);
}

// Ensure directories exist
fs.mkdirSync(destMcpDir, { recursive: true });
fs.mkdirSync(destMemoryDir, { recursive: true });

function splitMcp() {
  const content = fs.readFileSync(srcMcp, 'utf8');
  const blocks = content.split(/^---\r?\n/m);
  
  const files = {};
  
  let currentFile = null;
  let currentContent = [];

  for (const block of blocks) {
    if (!block.trim()) continue;
    
    // Check for comment headers
    const match = block.match(/^# (MCP .* Service)/m);
    if (match) {
      if (currentFile) {
        files[currentFile] = currentContent.join('\n---\n');
      }
      const name = match[1].toLowerCase().replace(/ mcp /g, '-').replace(/ service/g, '').replace(/mcp /g, 'mcp-');
      currentFile = name + '.yaml';
      currentContent = [block.trim()];
    } else {
      if (currentFile) {
        currentContent.push(block.trim());
      }
    }
  }
  
  if (currentFile) {
    files[currentFile] = currentContent.join('\n---\n');
  }

  for (const [filename, fileContent] of Object.entries(files)) {
    fs.writeFileSync(path.join(destMcpDir, filename), fileContent + '\n');
    console.log(`Wrote ${filename}`);
  }
}

function splitMemory() {
  const content = fs.readFileSync(srcMemory, 'utf8');
  const blocks = content.split(/^---\r?\n/m);
  
  let mongodb = [];
  let api = [];
  let web = [];
  let ingress = [];
  
  for (const block of blocks) {
    if (!block.trim()) continue;
    if (block.includes('name: mongodb-db') || block.includes('name: mongodb-pvc')) {
      mongodb.push(block.trim());
    } else if (block.includes('name: memory-api') && !block.includes('name: memory-ingress')) {
      api.push(block.trim());
    } else if (block.includes('name: memory-web') && !block.includes('name: memory-ingress')) {
      web.push(block.trim());
    } else if (block.includes('kind: Ingress') || block.includes('name: memory-ingress')) {
      ingress.push(block.trim());
    }
  }
  
  fs.writeFileSync(path.join(destMemoryDir, 'mongodb.yaml'), mongodb.join('\n---\n') + '\n');
  console.log(`Wrote mongodb.yaml`);
  
  fs.writeFileSync(path.join(destMemoryDir, 'memory-api.yaml'), api.join('\n---\n') + '\n');
  console.log(`Wrote memory-api.yaml`);
  
  fs.writeFileSync(path.join(destMemoryDir, 'memory-web.yaml'), web.join('\n---\n') + '\n');
  console.log(`Wrote memory-web.yaml`);
  
  if (ingress.length > 0) {
      // It says split memory into mongodb, memory-api, and memory-web. I should put ingress in memory-web or memory-api?
      // Wait, let's just create memory-ingress.yaml or append to memory-web or memory-api.
      // Usually, ingress is separate or with the web component. Let's put ingress in memory-ingress.yaml.
      fs.writeFileSync(path.join(destMemoryDir, 'memory-ingress.yaml'), ingress.join('\n---\n') + '\n');
      console.log(`Wrote memory-ingress.yaml`);
  }
}

splitMcp();
splitMemory();
