import { Slug } from './slug'

describe('Slug Entity', () => {
  it('should be able to create a new slug from text', async () => {
    const slug = Slug.createFromText('Create question title')

    expect(slug.value).toBe('create-question-title')
  })
})
