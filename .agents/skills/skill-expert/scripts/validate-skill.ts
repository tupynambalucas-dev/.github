import * as fs from 'fs';
import * as path from 'path';

interface ValidationResult {
  filePath: string;
  errors: string[];
}

const MAX_SKILL_NAME_LENGTH = 64;
const MAX_DESCRIPTION_LENGTH = 1024;
const MAX_COMPATIBILITY_LENGTH = 500;
const MAX_SKILL_MD_LINES = 500;

const ALLOWED_FIELDS = new Set([
  'name',
  'description',
  'license',
  'allowed-tools',
  'metadata',
  'compatibility',
]);

function printUsage(): void {
  console.log(
    'Usage: pnpm dlx tsx .agents/skills/skill-expert/scripts/validate-skill.ts --path <skill-directory>',
  );
}

function findMdFiles(dir: string): string[] {
  const results: string[] = [];
  if (fs.existsSync(dir) === false) {
    return results;
  }
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat !== undefined && stat.isDirectory() === true) {
      if (file !== 'node_modules' && file !== '.git') {
        results.push(...findMdFiles(filePath));
      }
    } else if (file.endsWith('.md') === true || file.endsWith('.mdx') === true) {
      results.push(filePath);
    }
  }
  return results;
}

interface ParsedFrontmatter {
  data: Record<string, unknown>;
  rawErrors: string[];
}

function parseYamlFrontmatter(rawYaml: string): ParsedFrontmatter {
  const data: Record<string, unknown> = {};
  const rawErrors: string[] = [];
  const lines = rawYaml.split(/\r?\n/);

  let currentKey: string | null = null;
  let multilineType: 'folded' | 'literal' | null = null;
  let multilineBuffer: string[] = [];
  let inMetadataMap = false;
  const metadataMap: Record<string, string> = {};

  function flushMultiline(): void {
    if (currentKey !== null) {
      if (multilineType === 'folded') {
        data[currentKey] = multilineBuffer.join(' ').trim();
      } else if (multilineType === 'literal') {
        data[currentKey] = multilineBuffer.join('\n').trim();
      }
    }
    currentKey = null;
    multilineType = null;
    multilineBuffer = [];
  }

  function flushMetadata(): void {
    if (inMetadataMap === true) {
      data['metadata'] = { ...metadataMap };
      inMetadataMap = false;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === '' || trimmed.startsWith('#')) {
      continue;
    }

    // Check if indented under multiline scalar
    if (multilineType !== null && (line.startsWith('  ') || line.startsWith('\t'))) {
      multilineBuffer.push(trimmed);
      continue;
    } else if (multilineType !== null) {
      flushMultiline();
    }

    // Check if indented under metadata map
    if (inMetadataMap === true && (line.startsWith('  ') || line.startsWith('\t'))) {
      const sep = trimmed.indexOf(':');
      if (sep !== -1) {
        const subKey = trimmed.slice(0, sep).trim();
        let subVal = trimmed.slice(sep + 1).trim();
        if (
          (subVal.startsWith('"') && subVal.endsWith('"')) ||
          (subVal.startsWith("'") && subVal.endsWith("'"))
        ) {
          subVal = subVal.slice(1, -1);
        }
        metadataMap[subKey] = subVal;
      }
      continue;
    } else if (inMetadataMap === true) {
      flushMetadata();
    }

    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) {
      continue;
    }

    const key = line.slice(0, colonIndex).trim();
    let val = line.slice(colonIndex + 1).trim();

    if (key === 'metadata') {
      if (val === '' || val === '{}') {
        inMetadataMap = true;
      }
      continue;
    }

    if (val === '>' || val === '>-') {
      currentKey = key;
      multilineType = 'folded';
      multilineBuffer = [];
      continue;
    }

    if (val === '|' || val === '|-') {
      currentKey = key;
      multilineType = 'literal';
      multilineBuffer = [];
      continue;
    }

    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }

    data[key] = val;
  }

  flushMultiline();
  flushMetadata();

  return { data, rawErrors };
}

function validateSkillDir(targetDir: string): boolean {
  const absoluteTargetDir = path.resolve(targetDir);
  if (fs.existsSync(absoluteTargetDir) === false) {
    console.error(`Error: Directory does not exist: ${absoluteTargetDir}`);
    return false;
  }

  let skillMdPath = path.join(absoluteTargetDir, 'SKILL.md');
  if (fs.existsSync(skillMdPath) === false) {
    const lowercasePath = path.join(absoluteTargetDir, 'skill.md');
    if (fs.existsSync(lowercasePath) === true) {
      skillMdPath = lowercasePath;
    } else {
      console.error(`Error: Required file SKILL.md not found in ${absoluteTargetDir}`);
      return false;
    }
  }

  let hasErrors = false;
  const results: ValidationResult[] = [];

  // 1. Validate SKILL.md Frontmatter and Line Count
  const skillMdErrors: string[] = [];
  const skillMdContent = fs.readFileSync(skillMdPath, 'utf-8');
  const lineCount = skillMdContent.split(/\r?\n/).length;

  if (lineCount >= MAX_SKILL_MD_LINES) {
    skillMdErrors.push(
      `SKILL.md has ${lineCount} lines, which exceeds the maximum limit of ${MAX_SKILL_MD_LINES} lines.`,
    );
  }

  // Parse YAML Frontmatter
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
  const frontmatterMatch = skillMdContent.match(frontmatterRegex);

  if (frontmatterMatch === null) {
    skillMdErrors.push(
      "SKILL.md does not contain valid YAML frontmatter block delimited by '---'.",
    );
  } else {
    const rawYaml = frontmatterMatch[1];
    const { data: frontmatter, rawErrors } = parseYamlFrontmatter(rawYaml);
    skillMdErrors.push(...rawErrors);

    // Validate allowed fields only (Spec strictness)
    const presentKeys = Object.keys(frontmatter);
    const extraFields = presentKeys.filter((k) => ALLOWED_FIELDS.has(k) === false);
    if (extraFields.length > 0) {
      const allowedSorted = Array.from(ALLOWED_FIELDS).sort().join(', ');
      skillMdErrors.push(
        `Unexpected fields in frontmatter: ${extraFields.sort().join(', ')}. Only [${allowedSorted}] are allowed.`,
      );
    }

    // Name Validation
    if (frontmatter.name === undefined) {
      skillMdErrors.push("Missing required field in frontmatter: 'name'.");
    } else if (typeof frontmatter.name !== 'string' || frontmatter.name.trim() === '') {
      skillMdErrors.push("Field 'name' must be a non-empty string.");
    } else {
      const name = frontmatter.name.trim();
      const parentDirName = path.basename(absoluteTargetDir);
      if (name !== parentDirName) {
        skillMdErrors.push(`Directory name '${parentDirName}' must match skill name '${name}'.`);
      }

      if (name.length < 1 || name.length > MAX_SKILL_NAME_LENGTH) {
        skillMdErrors.push(
          `Skill name '${name}' exceeds ${MAX_SKILL_NAME_LENGTH} character limit (${name.length} chars).`,
        );
      }

      if (name !== name.toLowerCase()) {
        skillMdErrors.push(`Skill name '${name}' must be lowercase.`);
      }

      if (name.startsWith('-') === true || name.endsWith('-') === true) {
        skillMdErrors.push('Skill name cannot start or end with a hyphen.');
      }

      if (name.includes('--') === true) {
        skillMdErrors.push('Skill name cannot contain consecutive hyphens.');
      }

      const nameRegex = /^[a-z0-9-]+$/;
      if (nameRegex.test(name) === false) {
        skillMdErrors.push(
          `Skill name '${name}' contains invalid characters. Only letters, digits, and hyphens are allowed.`,
        );
      }
    }

    // Description Validation
    if (frontmatter.description === undefined) {
      skillMdErrors.push("Missing required field in frontmatter: 'description'.");
    } else if (
      typeof frontmatter.description !== 'string' ||
      frontmatter.description.trim() === ''
    ) {
      skillMdErrors.push("Field 'description' must be a non-empty string.");
    } else {
      const desc = frontmatter.description.trim();
      if (desc.length > MAX_DESCRIPTION_LENGTH) {
        skillMdErrors.push(
          `Description exceeds ${MAX_DESCRIPTION_LENGTH} character limit (${desc.length} chars).`,
        );
      }
    }

    // Compatibility Validation
    if (frontmatter.compatibility !== undefined) {
      if (typeof frontmatter.compatibility !== 'string') {
        skillMdErrors.push("Field 'compatibility' must be a string.");
      } else if (frontmatter.compatibility.length > MAX_COMPATIBILITY_LENGTH) {
        skillMdErrors.push(
          `Compatibility exceeds ${MAX_COMPATIBILITY_LENGTH} character limit (${frontmatter.compatibility.length} chars).`,
        );
      }
    }

    // Allowed-Tools Validation
    if (frontmatter['allowed-tools'] !== undefined) {
      if (typeof frontmatter['allowed-tools'] !== 'string') {
        skillMdErrors.push("Field 'allowed-tools' must be a space-separated string.");
      }
    }

    // License Validation
    if (frontmatter.license !== undefined && typeof frontmatter.license !== 'string') {
      skillMdErrors.push("Field 'license' must be a string.");
    }

    // Metadata Validation
    if (frontmatter.metadata !== undefined) {
      if (
        typeof frontmatter.metadata !== 'object' ||
        frontmatter.metadata === null ||
        Array.isArray(frontmatter.metadata)
      ) {
        skillMdErrors.push("Field 'metadata' must be a key-value mapping of strings.");
      } else {
        const meta = frontmatter.metadata as Record<string, unknown>;
        for (const [mk, mv] of Object.entries(meta)) {
          if (typeof mv !== 'string') {
            skillMdErrors.push(
              `Metadata entry '${mk}' must have a string value, received ${typeof mv}.`,
            );
          }
        }
      }
    }
  }

  if (skillMdErrors.length > 0) {
    results.push({
      filePath: path.basename(skillMdPath),
      errors: skillMdErrors,
    });
    hasErrors = true;
  }

  // 2. Scan all Markdown files for Emojis and Absolute Links
  const mdFiles = findMdFiles(absoluteTargetDir);
  const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

  for (const filePath of mdFiles) {
    const fileErrors: string[] = [];
    const relativePath = path.relative(absoluteTargetDir, filePath);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Check for Emojis
    emojiRegex.lastIndex = 0;
    const emojiMatches = content.match(emojiRegex);
    if (emojiMatches !== null) {
      const realEmojis = emojiMatches.filter((emoji) => {
        const charCode = emoji.charCodeAt(0);
        if (charCode >= 48 && charCode <= 57) return false;
        if (emoji === '*' || emoji === '#' || emoji === '©' || emoji === '®') return false;
        return true;
      });

      if (realEmojis.length > 0) {
        fileErrors.push(`Found forbidden emojis: ${Array.from(new Set(realEmojis)).join(', ')}`);
      }
    }

    // Scan markdown links for absolute targets and file:/// schemes
    const markdownLinkRegex = /\[.*?\]\((.*?)\)/g;
    let linkMatch;
    while ((linkMatch = markdownLinkRegex.exec(content)) !== null) {
      const url = linkMatch[1].trim();
      if (url.toLowerCase().startsWith('file:///')) {
        fileErrors.push(`Found forbidden 'file:///' link target: "${url}"`);
      }
      if (url.startsWith('/') === true && url.startsWith('//') === false) {
        fileErrors.push(`Found forbidden absolute markdown link target: "${url}"`);
      }
    }

    // Scan for windows drive letter patterns in links or plain text
    const driveLetterRegex = /\b[A-Za-z]:[\\/]/g;
    if (driveLetterRegex.test(content) === true) {
      fileErrors.push('Found absolute Windows file path (e.g. C:\\ or D:\\).');
    }

    if (fileErrors.length > 0) {
      const existingResultIndex = results.findIndex((r) => r.filePath === relativePath);
      if (existingResultIndex !== -1) {
        results[existingResultIndex].errors.push(...fileErrors);
      } else {
        results.push({ filePath: relativePath, errors: fileErrors });
      }
      hasErrors = true;
    }
  }

  // 3. Output results
  if (hasErrors === true) {
    console.error(`\n=== Skill Validation FAILED for: ${absoluteTargetDir} ===`);
    for (const res of results) {
      console.error(`\nFile: ${res.filePath}`);
      for (const err of res.errors) {
        console.error(`  - ${err}`);
      }
    }
    console.error('\n=============================================');
    return false;
  }

  console.log(`\n=== Skill Validation PASSED for: ${absoluteTargetDir} ===`);
  return true;
}

function main(): void {
  const args = process.argv.slice(2);
  let targetPath = '';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--path' && i + 1 < args.length) {
      targetPath = args[i + 1];
      break;
    }
  }

  if (targetPath === '') {
    printUsage();
    process.exit(1);
  }

  const success = validateSkillDir(targetPath);
  if (success === true) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

main();
