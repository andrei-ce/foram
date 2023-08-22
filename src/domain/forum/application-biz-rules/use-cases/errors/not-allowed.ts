import { UseCaseError } from '@/core/errors/use-case-error'

// 'implements UseCaseError' is only to mark that this error happened in the use-cases layer

export class NotAllowedError extends Error implements UseCaseError {
  constructor() {
    super('Not allowed')
  }
}
