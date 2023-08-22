import { Success } from '@/core/either'
import { AnswerQuestionUseCase } from './answer-question'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repo'

let answersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase // <-- System Under Test

describe('Create Answer', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new AnswerQuestionUseCase(answersRepository)
  })

  it('should be able to create an answer', async () => {
    const result = await sut.exec({
      questionId: '1',
      instructorId: '1',
      content: 'New answer!',
    })

    expect(result).toBeInstanceOf(Success)
    expect(answersRepository.items[0]).toEqual(result.value?.answer)
  })
})
