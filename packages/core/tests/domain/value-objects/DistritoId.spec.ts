import { describe, it, expect } from 'vitest';
import { DistritoId } from '../../../src/domain/value-objects/DistritoId';

describe('DistritoId', () => {
  it('creates a valid id trimming surrounding whitespace', () => {
    const id = DistritoId.create('  D001  ');

    expect(id.getValue()).toBe('D001');
  });

  it('throws when the value is empty', () => {
    expect(() => DistritoId.create('')).toThrow('DistritoId cannot be empty');
  });

  it('throws when the value exceeds 10 characters', () => {
    expect(() => DistritoId.create('D0000000001')).toThrow('DistritoId cannot exceed 10 characters');
  });
});
