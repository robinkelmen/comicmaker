import { parse } from './parser/parse.js';
import { validate } from './parser/validate.js';

const tests = [
  {
    name: 'minimal comic',
    input: `---
title: Test
---

# Page 1

A simple scene

HERO
Hello!`,
    expectValid: true
  },
  {
    name: 'missing title',
    input: `# Page 1

A scene`,
    expectValid: false
  },
  {
    name: 'full featured comic',
    input: `---
title: Action Comic
author: Writer
style: superhero
---

# Page 1

[2x2]

A hero standing on rooftop at sunset

HERO (excited)
The city needs me!

---

Close-up of hero's determined face

*WHOOSH*

> And so the adventure began...

---

# Page 2

[splash]

Epic battle scene with explosions

HERO
Take this!

VILLAIN (angry)
You'll never stop me!

*KABOOM*`,
    expectValid: true
  }
];

let passed = 0;
let failed = 0;

for (const test of tests) {
  const parseResult = parse(test.input);

  if (!parseResult.ok) {
    if (test.expectValid) {
      console.error(`FAIL: ${test.name} - Parse error:`, parseResult.errors);
      failed++;
    } else {
      console.log(`PASS: ${test.name} (expected parse failure)`);
      passed++;
    }
    continue;
  }

  const validationResult = validate(parseResult.comic);

  if (validationResult.valid === test.expectValid) {
    console.log(`PASS: ${test.name}`);
    passed++;
  } else {
    console.error(`FAIL: ${test.name}`);
    console.error('  Expected valid:', test.expectValid);
    console.error('  Got:', validationResult.valid);
    if (validationResult.errors) {
      console.error('  Errors:', validationResult.errors);
    }
    failed++;
  }
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
