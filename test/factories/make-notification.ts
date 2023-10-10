import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise-biz-rules/entities/notification'
import { faker } from '@faker-js/faker'

export function makeNotification(
  override: Partial<NotificationProps> = {},
  id?: UniqueEntityId,
) {
  const newNotification = Notification.create(
    {
      recipientId: new UniqueEntityId(),
      title: faker.lorem.sentence(4),
      content: faker.lorem.sentence(10),
      createdAt: new Date(),
      ...override,
    },
    id,
  )

  return newNotification
}
