import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Entity } from '@/core/entities/entity'

export interface AnswerAttachmentProps {
  answerId: UniqueEntityId
  attachmentId: UniqueEntityId
}

export class AnswerAttachment extends Entity<AnswerAttachmentProps> {
  get answerId() {
    return this.props.answerId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: AnswerAttachmentProps, id?: UniqueEntityId) {
    const attachment = new AnswerAttachment(props, id)
    return attachment
  }
}
