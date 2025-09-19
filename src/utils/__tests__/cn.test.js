import { describe, expect, it } from 'vitest';
import { cn } from '../cn';

describe('cn utility', () => {
  it('merges class names intelligently', () => {
    const result = cn('btn', false && 'hidden', 'mt-2', ['text-sm', null], { active: true });
    expect(result).toContain('btn');
    expect(result).toContain('mt-2');
    expect(result).toContain('text-sm');
    expect(result).toContain('active');
    expect(result).not.toContain('hidden');
  });
});
