// Not following the pattern Left/Right: Failure/Success instead

// this is a Functional Error Handling pattern. It generally returns a tuple, but as we have defined classes, the first tuple position is not needed

export class Failure<F> {
  readonly value: F
  constructor(value: F) {
    this.value = value
  }

  isSuccess() {
    return false
  }

  isFailure() {
    return true
  }
}

export class Success<S> {
  readonly value: S
  constructor(value: S) {
    this.value = value
  }

  isSuccess() {
    return true
  }

  isFailure() {
    return false
  }
}

// Here I am defining that a service will return either a Failure or Success class
export type Either<F, S> = Failure<F> | Success<S>

// if I call fail it will return a Failure
export const fail = <F, S>(value: F): Either<F, S> => {
  return new Failure(value)
}

// if I call success it will return a Success
export const succeed = <F, S>(value: S): Either<F, S> => {
  return new Success(value)
}
