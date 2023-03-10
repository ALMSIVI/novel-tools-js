import { regex, existentDirectory, existentFile } from '../src/validators'
import fs from 'fs'

describe('validators', () => {
  it('regex', () => {
    const chapterTitle = regex().parse('^Chapter (\\d+) (.+)$')
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
    expect(existentDirectory().parse('dir')).toBe('dir')
    expect(() => existentDirectory().parse('file')).toThrow()
  })

  it('file', () => {
    //@ts-expect-error Only need one method
    vi.spyOn(fs, 'statSync').mockImplementation((path) => ({
      isFile: () => path === 'file',
    }))
    expect(existentFile().parse('file')).toBe('file')
    expect(() => existentFile().parse('dir')).toThrow()
  })
})
