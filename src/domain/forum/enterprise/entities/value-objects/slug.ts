export class Slug {
  public value: string

  constructor(value: string) {
    this.value = value
  }

  /**
   * Receives a string and normalizes it to a slug
   * Example: "An example title" => "and-example-title"
   * @param text [string]
   * @returns slug [string]
   */
  static createFromText(text: string) {
    const slugText = text
      .normalize('NFKD')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-+]/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/, '')

    return new Slug(slugText)
  }
}
