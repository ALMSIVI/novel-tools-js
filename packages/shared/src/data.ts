import { parseNumber } from './utils'

const plainTypes = ['BOOK_TITLE', 'BOOK_INTRO', 'VOLUME_INTRO', 'CHAPTER_CONTENT', 'UNRECOGNIZED'] as const
const indexedTypes = ['VOLUME_TITLE', 'CHAPTER_TITLE'] as const

export type NovelType =
    | { type: (typeof plainTypes)[number] }
    | { type: (typeof indexedTypes)[number]; index: number; tag?: string }

export function parseType(type: string, index?: string, tag?: string): NovelType {
    type = type.toUpperCase()
    if (isType(type, plainTypes)) {
        return { type }
    }

    if (isType(type, indexedTypes)) {
        if (index === undefined) {
            throw new TypeError(`index is not specified for type ${type}.`)
        }
        return { type, index: parseNumber(index), tag }
    }

    throw new TypeError(`${type} is not a valid novel type.`)
}

function isType<T extends string>(value: string, array: readonly T[]): value is T {
    return (array as ReadonlyArray<string>).includes(value)
}

/** Represents an intermediate object of the worker. */
export type NovelData = NovelType & {
    /**
     * If the type is not a title, then the content will be the matcher's input. If a title is matched, then
     * content will be the title name.
     */
    content: string
    lineNum?: number
    /** Source file for this novel data. */
    source?: string
    rawContent?: string
    /** If there is an error during processing, this field will be populated with the error message. */
    errors?: string[]
}
