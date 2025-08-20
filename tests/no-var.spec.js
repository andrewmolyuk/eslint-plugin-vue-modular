import { describe, it, expect } from 'vitest';
import { RuleTester } from 'eslint';
import plugin from '../src/index.js';

describe('vue-modular/no-var rule', () => {
  it('should report usage of var', () => {
    const ruleTester = new RuleTester({
      languageOptions: {
        ecmaVersion: 2015,
      },
      plugins: {
        'vue-modular': plugin,
      },
    });

    ruleTester.run('vue-modular/no-var', plugin.rules['no-var'], {
      valid: ['let x = 1;', 'const y = 2;'],
      invalid: [
        {
          code: 'var z = 3;',
          errors: [{ messageId: 'unexpected' }],
        },
      ],
    });
    expect(true).toBe(true); // Dummy assertion for Vitest
  });
});
