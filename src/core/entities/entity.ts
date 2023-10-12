import { UniqueEntityId } from './unique-entity-id'

// abstract: blueprint for other classes
export abstract class Entity<Props> {
  // don't want to change this id (hence private & no setters)
  private _id: UniqueEntityId
  // protected: allows parent and extended classes (sub classes) to access this variable
  protected props: Props

  get id() {
    return this._id
  }

  protected constructor(props: Props, id?: UniqueEntityId) {
    // id is optional because we might just want to create a reference
    this._id = id ?? new UniqueEntityId()
    this.props = props
  }

  public equals(entity: Entity<Props>) {
    if (entity === this) {
      return true
    }

    if (entity.id === this._id) {
      return true
    }

    return false
  }
}
