import fs from 'fs';
import path from 'path';

try {
  const input = fs.readFileSync(0, 'utf-8');
  const payload = JSON.parse(input);

  const toolName = payload.toolCall?.name;
  const args = payload.toolCall?.args || {};
  const workspacePaths = payload.workspacePaths || [];

  if (toolName === 'write_to_file') {
    const targetFile = args.TargetFile;
    if (targetFile && workspacePaths.length > 0) {
      // Check against all known workspace paths
      for (const wp of workspacePaths) {
        const relativePath = path.relative(wp, targetFile);

        // If the file is directly in the workspace root, it won't contain a path separator
        // and won't start with '..'
        const isRootFile =
          !relativePath.includes(path.sep) && !relativePath.startsWith('..') && relativePath !== '';

        const ext = path.extname(relativePath).toLowerCase();
        const scriptExts = ['.js', '.cjs', '.mjs', '.ts', '.py', '.sh', '.ps1', '.bat'];

        if (isRootFile && scriptExts.includes(ext)) {
          // Exclude configuration files that ARE allowed in the root
          const allowedRootScripts = [
            'commitlint.config.js',
            'commitlint.config.cjs',
            'commitlint.config.ts',
            'eslint.config.js',
            'eslint.config.cjs',
            'eslint.config.mjs',
            'eslint.config.ts',
            'prettier.config.js',
            'prettier.config.cjs',
            'prettier.config.mjs',
            'jest.config.js',
            'jest.config.ts',
            'vitest.config.js',
            'vitest.config.ts',
            'webpack.config.js',
            'webpack.config.ts',
            'rollup.config.js',
            'rollup.config.ts',
            'docusaurus.config.ts',
            'docusaurus.config.js',
            'postcss.config.js',
            'postcss.config.cjs',
            'tailwind.config.js',
            'tailwind.config.ts',
            'vite.config.js',
            'vite.config.ts',
            'prettierrc.js',
            'prettierrc.cjs',
          ];

          if (!allowedRootScripts.includes(path.basename(relativePath).toLowerCase())) {
            console.log(
              JSON.stringify({
                decision: 'deny',
                reason:
                  'CRITICAL RULE VIOLATION: Temporary and utility scripts must not be created in the monorepo root. Create them in .agents/scripts/ (if permanent) or in the artifact scratch directory (if temporary).',
              }),
            );
            process.exit(0);
          }
        }
      }
    }
  }

  // Allow by default
  console.log(JSON.stringify({ decision: 'allow' }));
} catch (e) {
  // Fallback to allow if something crashes so we don't break the agent
  console.log(JSON.stringify({ decision: 'allow', reason: 'Hook error: ' + e.message }));
}
