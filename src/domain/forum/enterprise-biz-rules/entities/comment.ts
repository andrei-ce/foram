import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface CommentProps {
  authorId: UniqueEntityId
  content: string
  createdAt: Date
  updatedAt?: Date
}
// the Entity<GenericProps> equals the code below, hence the below is useless :)
//
// constructor(props: AnswerProps, id?: string) {
//   super(props, id);
// }
//
export abstract class Comment<
  Props extends CommentProps, // CommentProps is mandatory but there might be more fields
> extends Entity<Props> {
  get content() {
    return this.props.content
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  get authorId() {
    return this.props.authorId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }
}
