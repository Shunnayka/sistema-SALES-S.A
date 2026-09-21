import { describe, it, expect } from 'vitest';
import { Distrito } from '../../../src/domain/entities/Distrito';
import { DistritoId } from '../../../src/domain/value-objects/DistritoId';

describe('Distrito', () => {
  it('creates a valid distrito', () => {
    const distrito = Distrito.create({
      id: DistritoId.create('D001'),
      descripcion: 'Centro Historico',
    });

    expect(distrito.getDescripcion()).toBe('Centro Historico');
  });

  it('throws when descripcion is empty', () => {
    expect(() =>
      Distrito.create({
        id: DistritoId.create('D001'),
        descripcion: '  ',
      }),
    ).toThrow('Distrito descripcion cannot be empty');
  });
});
