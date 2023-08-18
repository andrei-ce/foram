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
    const { answer } = await sut.exec({
      instructorId: '1',
      questionId: '10',
      content: 'New answer!',
    })

    expect(answer.content).toEqual('New answer!')
    expect(answersRepository.items[0].id).toEqual(answer.id)
  })
})
