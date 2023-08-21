import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repo'

let questionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase // <-- System Under Test

describe('Delete Question', () => {
  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new DeleteQuestionCommentUseCase(questionCommentsRepository)
  })

  it('should be able to delete a comment from a question', async () => {
    const newQuestionComment = makeQuestionComment(
      { authorId: new UniqueEntityId('author-001') },
      new UniqueEntityId('question-comment-001'),
    )
    await questionCommentsRepository.create(newQuestionComment)
    await sut.exec({
      requesterId: 'author-001',
      questionCommentId: 'question-comment-001',
    })

    expect(questionCommentsRepository.items.length).toEqual(0)
  })

  it('should not be able to delete a question from another user', async () => {
    const newQuestionComment = makeQuestionComment(
      { authorId: new UniqueEntityId('author-001') },
      new UniqueEntityId('question-comment-001'),
    )
    await questionCommentsRepository.create(newQuestionComment)

    expect(async () => {
      await sut.exec({
        requesterId: 'author-002',
        questionCommentId: 'question-001',
      })
    }).rejects.toThrowError()
    expect(questionCommentsRepository.items.length).toEqual(1)
  })
})
