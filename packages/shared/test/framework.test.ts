import { describe, it, expect } from 'vitest'
import { NovelData, transform } from '../src'

describe('framework', () => {
    it('transform', () => {
        const readers = [
            {
                *read(): Generator<NovelData> {
                    yield { type: 'BOOK_TITLE', content: 'Hello', lineNum: 1, rawContent: '  Hello  \n' }
                    yield {
                        type: 'VOLUME_TITLE',
                        index: 1,
                        content: 'World',
                        lineNum: 2,
                        rawContent: 'Volume 1: World\n',
                    }
                },
            },
            {
                *read(): Generator<NovelData> {
                    yield { type: 'VOLUME_INTRO', content: 'Foo', lineNum: 3, rawContent: 'Foo  \n' }
                },
            },
        ]

        const processors = [
            {
                process(novelData: NovelData): NovelData {
                    novelData.rawContent = novelData.content
                    return novelData
                },
            },
        ]

        let lineNum = ''
        let rawContent = ''

        const writers = [
            {
                data: [] as string[],
                write(data: NovelData) {
                    if (data.lineNum !== undefined) {
                        lineNum += `lineNum=${data.lineNum}\n`
                    }
                },
            },
            {
                data: [] as string[],
                write(data: NovelData) {
                    if (data.rawContent !== undefined) {
                        rawContent += `rawContent=${data.rawContent}\n`
                    }
                },
            },
        ]

        transform(readers, processors, writers)
        expect(lineNum).toBe('lineNum=1\nlineNum=2\nlineNum=3\n')
        expect(rawContent).toBe('rawContent=Hello\nrawContent=World\nrawContent=Foo\n')
    })
})
