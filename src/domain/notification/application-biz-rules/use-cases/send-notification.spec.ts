import { Success } from '@/core/either'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repo'
import { SendNotificationUseCase } from './send-notification'

let notificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase // <-- System Under Test

describe('Create Notification', () => {
  beforeEach(() => {
    notificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(notificationsRepository)
  })

  it('should be able to send a notification', async () => {
    const result = await sut.exec({
      recipientId: '21',
      title: 'New Notification!',
      content: 'Your comment was selected as a top answer.',
    })

    expect(result).toBeInstanceOf(Success)
    expect(notificationsRepository.items[0]).toEqual(result.value?.notification)
  })
})
