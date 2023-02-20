import { regexValidator, directoryValidator, fileValidator } from '../src/validators'
import fs from 'fs'

describe('validators', () => {
  it('regex', () => {
    const chapterTitle = regexValidator().parse('^Chapter (\\d+) (.+)$')
    const match = chapterTitle.exec('Chapter 3 Some Title')
    expect(match).not.toBeNull()
    if (match !== null) {
      expect(match[1]).toBe('3')
      expect(match[2]).toBe('Some Title')
    }
  })

  it('directory', () => {
    //@ts-expect-error Only need one method
    vi.spyOn(fs, 'statSync').mockImplementation((path) => ({
      isDirectory: () => path === 'dir',
    }))
    expect(directoryValidator().parse('dir')).toBe('dir')
    expect(() => directoryValidator().parse('file')).toThrow()
  })

  it('file', () => {
    //@ts-expect-error Only need one method
    vi.spyOn(fs, 'statSync').mockImplementation((path) => ({
      isFile: () => path === 'file',
    }))
    expect(fileValidator().parse('file')).toBe('file')
    expect(() => fileValidator().parse('dir')).toThrow()
  })
})
