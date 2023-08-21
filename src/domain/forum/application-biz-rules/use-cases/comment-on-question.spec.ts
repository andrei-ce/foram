import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repo'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repo'
import { CommentOnQuestionUseCase } from './comment-on-question'

let questionsRepository: InMemoryQuestionsRepository
let questionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: CommentOnQuestionUseCase // <-- System Under Test

describe('Comment on a question', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new CommentOnQuestionUseCase(
      questionsRepository,
      questionCommentsRepository,
    )
  })

  it('should be able to let a user comment on a question', async () => {
    const newQuestion = makeQuestion()
    await questionsRepository.create(newQuestion)

    await sut.exec({
      questionId: newQuestion.id.toString(),
      authorId: newQuestion.authorId.toString(),
      content: 'Test comment',
    })

    expect(questionCommentsRepository.items[0].content).toEqual('Test comment')
  })
})
