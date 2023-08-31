import { WatchedList } from '@/core/entities/wathced-list'
import { AnswerAttachment } from './answer-attachment'

export class AnswerAttachmentList extends WatchedList<AnswerAttachment> {
  compareItems(a: AnswerAttachment, b: AnswerAttachment): boolean {
    return a.attachmentId === b.attachmentId
  }
}
