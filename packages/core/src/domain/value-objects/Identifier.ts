export abstract class Identifier<T extends string> {
  protected readonly value: T;

  protected constructor(value: T) {
    this.value = value;
  }

  public getValue(): T {
    return this.value;
  }

  public equals(other?: Identifier<T>): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (!(other instanceof Identifier)) {
      return false;
    }
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}
