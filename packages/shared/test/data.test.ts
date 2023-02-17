import { describe, it, expect } from 'vitest'
import { parseType } from '../src'

describe('data', () => {
    it('parseType', () => {
        expect(parseType('book_title')).toEqual({ type: 'BOOK_TITLE' })
        expect(() => parseType('volume_title')).toThrow(new TypeError('index is not specified for type VOLUME_TITLE.'))
        expect(parseType('volume_title', '2')).toEqual({ type: 'VOLUME_TITLE', index: 2 })
        expect(() => parseType('volume_title', 'a')).toThrow(new SyntaxError("Cannot parse 'a' to a number."))
        expect(() => parseType('unknown')).toThrow(new TypeError('UNKNOWN is not a valid novel type.'))
    })
})
