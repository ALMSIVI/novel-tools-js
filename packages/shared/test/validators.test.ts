import { regex, path } from '../src/validators'
import fs from 'fs'

describe('validators', () => {
  it('regex', () => {
    const chapterTitle = regex().parse('^Chapter (\\d+) (.+)$');
    const match = chapterTitle.exec('Chapter 3 Some Title')
    expect(match).not.toBeNull()
    if (match !== null) {
      expect(match[1]).toBe('3')
      expect(match[2]).toBe('Some Title')
    }
  })

  it('path', () => {
    vi.spyOn(fs, 'existsSync').mockImplementation(arg => arg === 'file1')
    expect(path().parse('file1')).toBe('file1')
    expect(() => path().parse('file2')).toThrow()
  })
})