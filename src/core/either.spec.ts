import { succeed, fail, Success, Failure, Either } from './either'

function doSomething(shouldSucceed: boolean): Either<string, string> {
  if (shouldSucceed) {
    return succeed('This is a success')
  } else {
    return fail('This is a failure')
  }
}

describe('Test success and fail return types', () => {
  it('should be able to generate a Success class', async () => {
    const result = doSomething(true)
    expect(result).toBeInstanceOf(Success)
    expect(result.value).toEqual('This is a success')
  })

  it('should be able to generate a Fail class', async () => {
    const result = doSomething(false)
    expect(result).toBeInstanceOf(Failure)
    expect(result.value).toEqual('This is a failure')
  })
})
