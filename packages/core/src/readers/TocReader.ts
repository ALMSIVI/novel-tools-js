import { z } from 'zod'
import { IndexedType, NovelData, Reader, utils, validators } from '@novel-tools/shared'

export const validator = z.object({
  filename: validators
    .existentFile()
    .default('toc.txt')
    .describe('Filename of the toc file. This file should be generated from `TocWriter`.'),
  encoding: z.string().optional().describe('Encoding of the TOC file'),
  hasVolume: z.boolean().describe('Specifies whether the toc contains volumes.'),
  discardChapters: z.boolean().describe('If set to true, will start from chapter 1 again when entering a new volume.'),
})

/** Reads from a table of contents (toc) file. */
export class TocReader implements Reader {
  private readonly contents: string
  private readonly hasVolume: boolean
  private readonly discardChapters: boolean

  constructor(options: object) {
    const { filename, encoding, hasVolume, discardChapters } = validator.parse(options)
    this.contents = utils.readFile(filename, encoding)
    this.hasVolume = hasVolume
    this.discardChapters = discardChapters
  }

  *read(): Generator<NovelData> {
    const indices = new Map<IndexedType, number>([
      ['VOLUME_TITLE', 0],
      ['CHAPTER_TITLE', 0],
    ])

    let dataType: IndexedType
    let lineNum: number | undefined = undefined
    let content: string
    for (const line of utils.getLines(this.contents)) {
      const parts = line.split('\t')
      if (parts[0] === '') {
        // Must be chapter
        content = parts[1]
        dataType = 'CHAPTER_TITLE'
        if (parts.length > 2) {
          lineNum = parseInt(parts[2])
        }
      } else {
        // Could be volume or chapter depending on hasVolume
        content = parts[0]
        dataType = this.hasVolume ? 'VOLUME_TITLE' : 'CHAPTER_TITLE'
        if (parts.length > 1) {
          lineNum = parseInt(parts[1])
        }

        if (dataType === 'VOLUME_TITLE' && this.discardChapters) {
          indices.set('CHAPTER_TITLE', 0)
        }
      }

      indices.set(dataType, indices.get(dataType)! + 1)
      yield {
        type: dataType,
        index: indices.get(dataType)!,
        content,
        lineNum,
      }
    }
  }
}
