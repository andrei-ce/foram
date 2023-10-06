import { Notification } from '../../enterprise-biz-rules/entities/notification'

export interface NotificationsRepository {
  create(notification: Notification): Promise<void>
}
