import { AnswerQuestionUseCase } from './answer-question'
import { AnswersRepository } from '../repositories/answer-repo'
import { Answer } from '../entities/answer'

const fakeAnswersRepository: AnswersRepository = {
  create: async (answer: Answer) => {
    return Promise.resolve()
  },
}

it('creates an answer', async () => {
  const answerQuestionUseCase = new AnswerQuestionUseCase(fakeAnswersRepository)

  const answer = await answerQuestionUseCase.exec({
    instructorId: '1',
    questionId: '10',
    content: 'New answer!',
  })

  // console.log(answer);

  expect(answer.content).toEqual('New answer!')
})
