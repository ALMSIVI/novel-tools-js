import { utils } from '@novel-tools/shared'
import { CsvReader } from '../../src/readers/CsvReader'
import { mockFile } from '../utils'

describe('CsvReader', () => {
  it('read valid', () => {
    const content = utils.formatText(`
    type,content,index,rawContent,lineNum
    BOOK_TITLE,Test Book,,Test,1
    CHAPTER_TITLE,Test Chapter,1,Test,2
    `)
    mockFile(content)
    const reader = new CsvReader({ filename: 'test' })
    const read = reader.read()
    expect(read.next().value).toEqual({
      type: 'BOOK_TITLE',
      content: 'Test Book',
      rawContent: 'Test',
      lineNum: 1,
    })
    expect(read.next().value).toEqual({
      type: 'CHAPTER_TITLE',
      content: 'Test Chapter',
      index: 1,
      rawContent: 'Test',
      lineNum: 2,
    })
    expect(read.next().done).toBeTruthy()
  })

  it('read invalid', () => {
    const content = utils.formatText(`
    type
    VOLUME_TITLE
    `)
    mockFile(content)
    const reader = new CsvReader({ filename: 'test' })
    const read = reader.read()
    expect(() => read.next()).toThrow()
  })
})
