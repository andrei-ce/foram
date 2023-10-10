import { Failure, Success } from '@/core/either'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repo'
import { ReadNotificationUseCase } from './read-notification'
import { makeNotification } from 'test/factories/make-notification'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed'

let notificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase // <-- System Under Test

describe('Create Notification', () => {
  beforeEach(() => {
    notificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(notificationsRepository)
  })

  it('should be able to read a notification', async () => {
    const notification = makeNotification(
      {},
      new UniqueEntityId('notification-001'),
    )
    await notificationsRepository.create(notification)

    const result = await sut.exec({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    })

    expect(result).toBeInstanceOf(Success)
    expect(notificationsRepository.items[0].readAt).toEqual(expect.any(Date))
    if ('notification' in result.value) {
      expect(notificationsRepository.items[0]).toEqual(
        result.value.notification,
      )
    }
  })

  it('should not be able to read a notification from another user', async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityId('recipient-001'),
    })
    await notificationsRepository.create(notification)

    const result = await sut.exec({
      notificationId: notification.id.toString(),
      recipientId: 'recipient-901',
    })

    expect(result).toBeInstanceOf(Failure)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
