// JSON Schema draft 2020-12 subset used by this repository, not a general implementation.
// Unknown validation keywords fail closed, including when nested in an unused schema branch.
const supported = new Set(['$schema', '$id', 'title', 'description', 'type', 'const', 'enum', 'properties',
  'required', 'additionalProperties', 'items', 'minItems', 'maxItems', 'uniqueItems', 'minLength',
  'pattern', 'format', 'minimum', 'maximum']);
export function checkSchema(schema, at = '$schema', errors = []) {
  if (!schema || typeof schema !== 'object' || Array.isArray(schema)) return [...errors, `${at}: schema non oggetto`];
  for (const key of Object.keys(schema)) if (!supported.has(key)) errors.push(`${at}: keyword non supportata ${key}`);
  if (schema.type && !['object', 'array', 'string', 'integer', 'number', 'boolean', 'null'].includes(schema.type)) errors.push(`${at}: type non supportato`);
  if (schema.format && schema.format !== 'date') errors.push(`${at}: format non supportato`);
  if (schema.required && (!Array.isArray(schema.required) || schema.required.some(k => !(k in (schema.properties ?? {}))))) errors.push(`${at}: required incoerente`);
  if (schema.pattern) { try { new RegExp(schema.pattern); } catch { errors.push(`${at}: pattern invalido`); } }
  for (const [key, child] of Object.entries(schema.properties ?? {})) checkSchema(child, `${at}.${key}`, errors);
  if (schema.items) checkSchema(schema.items, `${at}[]`, errors);
  return errors;
}
export function validateSchema(value, schema, at = '$', errors = []) {
  if ('const' in schema && JSON.stringify(value) !== JSON.stringify(schema.const)) errors.push(`${at}: const attesa ${JSON.stringify(schema.const)}`);
  if (schema.enum && !schema.enum.includes(value)) errors.push(`${at}: enum invalida ${JSON.stringify(value)}`);
  const kind = schema.type;
  const good = !kind || (kind === 'null' ? value === null : kind === 'array' ? Array.isArray(value)
    : kind === 'object' ? value !== null && typeof value === 'object' && !Array.isArray(value)
      : kind === 'integer' ? Number.isInteger(value) : kind === 'number' ? typeof value === 'number' && Number.isFinite(value) : typeof value === kind);
  if (!good) { errors.push(`${at}: tipo atteso ${kind}`); return errors; }
  if (kind === 'object') {
    for (const key of schema.required ?? []) if (!Object.hasOwn(value, key)) errors.push(`${at}.${key}: required`);
    for (const [key, item] of Object.entries(value)) {
      if (schema.properties?.[key]) validateSchema(item, schema.properties[key], `${at}.${key}`, errors);
      else if (schema.additionalProperties === false) errors.push(`${at}.${key}: proprietà non consentita`);
    }
  }
  if (kind === 'array') {
    if (value.length < (schema.minItems ?? 0)) errors.push(`${at}: minItems ${schema.minItems}`);
    if (value.length > (schema.maxItems ?? Infinity)) errors.push(`${at}: maxItems ${schema.maxItems}`);
    if (schema.uniqueItems && new Set(value.map(v => JSON.stringify(v))).size !== value.length) errors.push(`${at}: item duplicati`);
    value.forEach((v, i) => validateSchema(v, schema.items, `${at}[${i}]`, errors));
  }
  if (kind === 'string') {
    if (value.trim().length < (schema.minLength ?? 0)) errors.push(`${at}: stringa vuota/corta`);
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) errors.push(`${at}: pattern invalido`);
    if (schema.format === 'date' && (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value)) errors.push(`${at}: data invalida`);
  }
  if (kind === 'integer' || kind === 'number') {
    if (value < (schema.minimum ?? -Infinity)) errors.push(`${at}: minimum ${schema.minimum}`);
    if (value > (schema.maximum ?? Infinity)) errors.push(`${at}: maximum ${schema.maximum}`);
  }
  return errors;
}
