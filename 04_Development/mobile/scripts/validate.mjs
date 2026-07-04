import { execSync } from 'node:child_process';

const commands = [
  ['TypeScript', 'npx tsc --noEmit'],
  ['ESLint', 'npx eslint .'],
  ['Prettier', 'npx prettier --check .'],
];

let hasFailure = false;

for (const [label, command] of commands) {
  process.stdout.write(`Running ${label}...\n`);

  try {
    execSync(command, { stdio: 'inherit' });
    process.stdout.write(`${label} passed.\n`);
  } catch {
    hasFailure = true;
    process.stderr.write(`${label} failed.\n`);
  }
}

if (hasFailure) {
  process.exit(1);
}

process.stdout.write('All validation checks passed.\n');
