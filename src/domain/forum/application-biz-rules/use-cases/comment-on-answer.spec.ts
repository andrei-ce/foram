import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repo'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repo'
import { CommentOnAnswerUseCase } from './comment-on-answer'
import { Success } from '@/core/either'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repo'

let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: CommentOnAnswerUseCase // <-- System Under Test

describe('Comment on a answer', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new CommentOnAnswerUseCase(
      answersRepository,
      answerCommentsRepository,
    )
  })

  it('should be able to let a user comment on a answer', async () => {
    const newAnswer = makeAnswer()
    await answersRepository.create(newAnswer)

    const result = await sut.exec({
      answerId: newAnswer.id.toString(),
      authorId: newAnswer.authorId.toString(),
      content: 'Test comment',
    })

    expect(result).toBeInstanceOf(Success)
    expect(answerCommentsRepository.items[0].content).toEqual('Test comment')
  })
})
