import { cleanupLab } from './lib/lab.mjs';
if (process.argv[2] !== 'cleanup' || !process.argv[3]) {
  console.error('Uso: node scripts/lab-workspace.mjs cleanup ".lab-runs/lab-ID-esatto"'); process.exitCode = 1;
} else {
  try { cleanupLab(process.argv[3]); console.log('Rimossa soltanto la directory lab indicata.'); }
  catch (e) { console.error(e.message); process.exitCode = 1; }
}
