import { ChooseBestAnswerUseCase } from './choose-best-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repo'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repo'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed'
import { Failure } from '@/core/either'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repo'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repo'

let answersRepository: InMemoryAnswersRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let questionsRepository: InMemoryQuestionsRepository
let questionAttachmentssRepository: InMemoryQuestionAttachmentsRepository

let sut: ChooseBestAnswerUseCase // <-- System Under Test

describe('ChooseBestAnswer Answer', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    questionAttachmentssRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentssRepository,
    )
    sut = new ChooseBestAnswerUseCase(answersRepository, questionsRepository)
  })

  it("should be able to choose a question's best answer", async () => {
    const newQuestion = makeQuestion()
    await questionsRepository.create(newQuestion)

    const newAnswer = makeAnswer({ questionId: newQuestion.id })
    await answersRepository.create(newAnswer)

    await sut.exec({
      requesterId: newQuestion.authorId.toString(),
      answerId: newAnswer.id.toString(),
    })

    expect(questionsRepository.items[0].bestAnswerId).toEqual(newAnswer.id)
  })

  it('should not be able to choose a best answer for a question from another user', async () => {
    const newQuestion = makeQuestion()
    await questionsRepository.create(newQuestion)

    const newAnswer = makeAnswer({ questionId: newQuestion.id })
    await answersRepository.create(newAnswer)

    const result = await sut.exec({
      requesterId: 'a-different-id-from-questions-author',
      answerId: newAnswer.id.toString(),
    })
    expect(result).toBeInstanceOf(Failure)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
