import { Slug } from './slug'

it('creates a new slug from text', () => {
  const text = 'Example question title 01_33'
  const slug = Slug.createFromText(text)

  expect(slug.value).toEqual('example-question-title-01-33')
})
