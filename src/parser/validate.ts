import Ajv from 'ajv';
import type { Comic } from '../schema/types';
import schema from '../schema/comic.schema.json' with { type: 'json' };

const ajv = new Ajv({ allErrors: true });
const validateSchema = ajv.compile(schema);

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

export function validate(comic: Comic): ValidationResult {
  const valid = validateSchema(comic);

  if (valid) {
    return { valid: true };
  }

  const errors = validateSchema.errors?.map(e =>
    `${e.instancePath || 'root'}: ${e.message}`
  ) || [];

  return { valid: false, errors };
}

// CLI entry point
if (typeof process !== 'undefined' && process.argv[1]?.endsWith('validate.ts')) {
  const fs = await import('fs');
  const { parse } = await import('./parse.js');

  const file = process.argv[2];
  if (!file) {
    console.error('Usage: npx tsx src/parser/validate.ts <file.md>');
    process.exit(1);
  }

  const content = fs.readFileSync(file, 'utf-8');
  const parseResult = parse(content);

  if (!parseResult.ok) {
    console.error('Parse errors:', parseResult.errors);
    process.exit(1);
  }

  const validationResult = validate(parseResult.comic);
  if (validationResult.valid) {
    console.log('Valid comic!');
    console.log(JSON.stringify(parseResult.comic, null, 2));
  } else {
    console.error('Validation errors:', validationResult.errors);
    process.exit(1);
  }
}
