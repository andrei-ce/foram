import { Notification } from '../../enterprise-biz-rules/entities/notification'

export interface NotificationsRepository {
  create(notification: Notification): Promise<void>
  findById(id: string): Promise<Notification | null>
  save(notification: Notification): Promise<void>
}
