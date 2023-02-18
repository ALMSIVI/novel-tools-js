import { formatText, parseNumber, purifyName } from '../src/utils'

describe('utils', () => {
  it('parseNumber', () => {
    expect(parseNumber('一')).toBe(1)
    expect(parseNumber('十二')).toBe(12)
    expect(parseNumber('两百三十五')).toBe(235)
    expect(parseNumber('123')).toBe(123)
  })

  it('purifyName', () => {
    expect(purifyName('abc')).toBe('abc')
    expect(purifyName('Hello/world.txt')).toBe('Helloworld.txt')
  })

  it('formatText', () => {
    expect(
      formatText(`
            Hello world
                Foo bar
        `),
    ).toBe('Hello world\n    Foo bar')
  })
})
