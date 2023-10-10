import { Success } from '@/core/either'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repo'
import { ReadNotificationUseCase } from './read-notification'
import { makeNotification } from 'test/factories/make-notification'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { notificationsRepository, sut } from './read-notification.spec'

describe('Create Notification', () => {
  beforeEach(() => {
    notificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(notificationsRepository)
  })

  it('should be able to read a notification', async () => {
    const newNotification = makeNotification(
      {},
      new UniqueEntityId('notification-001'),
    )
    await notificationsRepository.create(newNotification)

    const result = await sut.exec({
      recipientId: newNotification.recipientId.toString(),
      notificationId: newNotification.id.toString(),
    })
    console.log(result)
    expect(result).toBeInstanceOf(Success)
    expect(notificationsRepository.items[0].id).toEqual(
      result.value?.notification.id,
    )
    expect(notificationsRepository.items[0].readAt).toEqual(expect.any(Date))
  })
})
