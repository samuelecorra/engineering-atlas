if (process.env.ATLAS_DEMO_MODE !== 'practice') { console.error('ATLAS_DEMO_MODE non impostata al valore innocuo atteso.'); process.exitCode = 2; }
else console.log('Modalità pratica configurata.');
