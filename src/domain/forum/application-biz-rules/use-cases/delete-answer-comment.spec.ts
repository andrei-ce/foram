import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repo'
import { NotAllowedError } from './errors/not-allowed'
import { Failure } from '@/core/either'

let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase // <-- System Under Test

describe('Delete Question', () => {
  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new DeleteAnswerCommentUseCase(answerCommentsRepository)
  })

  it('should be able to delete a comment from a question', async () => {
    const newAnswerComment = makeAnswerComment(
      { authorId: new UniqueEntityId('author-001') },
      new UniqueEntityId('question-comment-001'),
    )
    await answerCommentsRepository.create(newAnswerComment)
    await sut.exec({
      requesterId: 'author-001',
      answerCommentId: 'question-comment-001',
    })

    expect(answerCommentsRepository.items.length).toEqual(0)
  })

  it('should not be able to delete a question from another user', async () => {
    const newAnswerComment = makeAnswerComment(
      { authorId: new UniqueEntityId('author-001') },
      new UniqueEntityId('question-comment-001'),
    )
    await answerCommentsRepository.create(newAnswerComment)

    const result = await sut.exec({
      requesterId: 'author-002',
      answerCommentId: 'question-comment-001',
    })

    expect(result).toBeInstanceOf(Failure)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(answerCommentsRepository.items.length).toEqual(1)
  })
})
