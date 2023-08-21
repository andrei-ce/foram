import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repo'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repo'
import { CommentOnAnswerUseCase } from './comment-on-answer'

let answersRepository: InMemoryAnswersRepository
let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: CommentOnAnswerUseCase // <-- System Under Test

describe('Comment on a answer', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new CommentOnAnswerUseCase(
      answersRepository,
      answerCommentsRepository,
    )
  })

  it('should be able to let a user comment on a answer', async () => {
    const newAnswer = makeAnswer()
    await answersRepository.create(newAnswer)

    await sut.exec({
      answerId: newAnswer.id.toString(),
      authorId: newAnswer.authorId.toString(),
      content: 'Test comment',
    })

    expect(answerCommentsRepository.items[0].content).toEqual('Test comment')
  })
})
