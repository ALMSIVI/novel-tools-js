import { novelDataSchema, novelTypeSchema } from '../src'

describe('data', () => {
  it('parses novel type', () => {
    expect(() => novelTypeSchema.parse({})).toThrow()
    expect(novelTypeSchema.parse({ type: 'BOOK_TITLE' })).toEqual({ type: 'BOOK_TITLE' })
    expect(() => novelTypeSchema.parse({ type: 'VOLUME_TITLE' })).toThrow()
    expect(novelTypeSchema.parse({ type: 'VOLUME_TITLE', index: 2 })).toEqual({ type: 'VOLUME_TITLE', index: 2 })
    expect(() => novelTypeSchema.parse({ type: 'VOLUME_TITLE', index: 'a' })).toThrow()
    expect(novelTypeSchema.parse({ type: 'VOLUME_TITLE', index: 1, tag: 'Tag' })).toEqual({
      type: 'VOLUME_TITLE',
      index: 1,
      tag: 'Tag',
    })
    expect(() => novelTypeSchema.parse({ type: 'VOLUME_TITLE', index: 1, tag: 42 })).toThrow()
    expect(() => novelTypeSchema.parse({ type: 'UNKNOWN' })).toThrow()
  })

  it('parses novel data', () => {
    expect(() => novelDataSchema.parse({})).toThrow()
    expect(() => novelDataSchema.parse({ type: 'BOOK_TITLE' })).toThrow()
    expect(() => novelDataSchema.parse({ content: 'title' })).toThrow()
    expect(novelDataSchema.parse({ type: 'BOOK_TITLE', content: 'title' })).toEqual({
      type: 'BOOK_TITLE',
      content: 'title',
    })
    expect(() => novelDataSchema.parse({ type: 'BOOK_TITLE', content: 'title', lineNum: 'a' })).toThrow()
    expect(novelDataSchema.parse({ type: 'BOOK_TITLE', content: 'title', lineNum: 2 })).toEqual({
      type: 'BOOK_TITLE',
      content: 'title',
      lineNum: 2,
    })
    expect(novelDataSchema.parse({ type: 'BOOK_TITLE', content: 'title', lineNum: '2' })).toEqual({
      type: 'BOOK_TITLE',
      content: 'title',
      lineNum: 2,
    })
    expect(() => novelDataSchema.parse({ type: 'BOOK_TITLE', content: 'title', source: 2 })).toThrow()
    expect(novelDataSchema.parse({ type: 'BOOK_TITLE', content: 'title', source: 'source' })).toEqual({
      type: 'BOOK_TITLE',
      content: 'title',
      source: 'source',
    })
    expect(() => novelDataSchema.parse({ type: 'BOOK_TITLE', content: 'title', rawContent: true })).toThrow()
    expect(novelDataSchema.parse({ type: 'BOOK_TITLE', content: 'title', rawContent: 'content' })).toEqual({
      type: 'BOOK_TITLE',
      content: 'title',
      rawContent: 'content',
    })
    expect(() => novelDataSchema.parse({ type: 'BOOK_TITLE', content: 'title', errors: [1, 2, 3] })).toThrow()
    expect(novelDataSchema.parse({ type: 'BOOK_TITLE', content: 'title', errors: ['error'] })).toEqual({
      type: 'BOOK_TITLE',
      content: 'title',
      errors: ['error'],
    })
  })
})
