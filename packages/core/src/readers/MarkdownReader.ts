import { z } from 'zod'
import {
  DataType,
  IndexedType,
  NovelData,
  Reader,
  dataTypeEnum,
  isUnindexedType,
  utils,
  validators,
} from '@novel-tools/shared'

export const validator = z.object({
  filename: validators.existentFile().default('text.txt').describe('The filename of the Markdown file.'),
  encoding: z.string().optional().describe('Encoding of the Markdown file'),
  levels: z
    .record(z.enum(dataTypeEnum), z.number().int())
    .default({
      BOOK_TITLE: 1,
      VOLUME_TITLE: 2,
      CHAPTER_TITLE: 3,
    })
    .refine(
      (arg) => {
        const values = Object.values(arg)
        return new Set(values).size === values.length
      },
      {
        message: 'Values must be unique',
      },
    )
    .transform((arg) => {
      const keys = Object.keys(arg)
      const dataTypes = dataTypeEnum.filter((dt) => keys.includes(dt))
      return new Map(dataTypes.map((dt) => [arg[dt]!, dt]))
    })
    .describe('Specifies what level the header should be for each type.'),
})

/**
 * Reads from a Markdown file. Only a strict subset of Markdown is supported. Namely, only titles (lines starting with
 * `#`'s) will be recognized. Also, if a paragraph is split on several lines (separated by a single newline character),
 * they will be treated as several paragraphs instead of one.
 */
export class MarkdownReader implements Reader {
  private readonly filename: string
  private readonly contents: string
  private readonly levels: Map<number, DataType>

  constructor(options: object) {
    const { filename, encoding, levels } = validator.parse(options)
    this.filename = filename
    this.levels = levels
    this.contents = utils.readFile(filename, encoding)
  }

  *read(): Generator<NovelData> {
    const indices = new Map<IndexedType, number>([
      ['VOLUME_TITLE', 0],
      ['CHAPTER_TITLE', 0],
    ])
    let lineNum = 0
    let prevNewline = false
    for (const line of utils.getLines(this.contents)) {
      lineNum++
      let content = line.trim()

      // In Markdown, double newlines represent a new paragraph
      if (content === '') {
        prevNewline = !prevNewline
        if (prevNewline) {
          continue
        }
      } else {
        prevNewline = false
      }

      let data: NovelData = {
        type: 'UNRECOGNIZED',
        content,
        lineNum,
        source: this.filename,
        rawContent: line.trim(),
      }

      if (content.startsWith('#')) {
        const index = content.indexOf(' ')
        if (this.levels.has(index)) {
          const dataType = this.levels.get(index)!
          content = content.substring(index + 1)

          if (isUnindexedType(dataType)) {
            data = {
              ...data,
              type: dataType,
            }
          } else {
            const index = indices.get(dataType)! + 1
            indices.set(dataType, index)

            data = {
              ...data,
              type: dataType,
              index: index,
            }
          }
        }
      }

      yield data
    }
  }
}
