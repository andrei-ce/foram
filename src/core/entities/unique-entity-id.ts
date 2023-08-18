import { randomUUID } from 'node:crypto'

export class UniqueEntityId {
  private value: string

  toString() {
    return String(this.value)
  }

  toValue() {
    return this.value
  }

  constructor(value?: string) {
    // id optional because we might just want to create an instance referring to an existing Entity
    this.value = value ?? randomUUID()
  }
}
