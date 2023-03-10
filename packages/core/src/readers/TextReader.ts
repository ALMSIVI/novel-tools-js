import { z } from 'zod'
import { NovelData, Reader, validators, utils } from '@novel-tools/shared'

export const validator = z.object({
  filename: validators.existentFile().default('text.txt').describe('The filename of the text file.'),
  encoding: z.string().optional().describe('Encoding of the text file'),
  mergeNewlines: z
    .boolean()
    .default(false)
    .describe(
      'If set to true, will merge multiple newlines into one. Sometimes newlines carry meanings, so we might not always want to merge them.',
    ),
})

/** Reads from a plain text file. */
export class TextReader implements Reader {
  private readonly filename: string
  private readonly contents: string
  private readonly mergeNewlines: boolean

  constructor(options: object) {
    const { filename, encoding, mergeNewlines } = validator.parse(options)
    this.filename = filename
    this.mergeNewlines = mergeNewlines
    this.contents = utils.readFile(filename, encoding)
  }

  *read(): Generator<NovelData> {
    let lineNum = 0
    let prevNewline = false
    for (const line of utils.getLines(this.contents)) {
      lineNum++
      let content = line.trim()
      if (content === '' && this.mergeNewlines) {
        prevNewline = !prevNewline
        if (prevNewline) {
          continue
        }
      } else {
        prevNewline = false
      }

      yield {
        type: 'UNRECOGNIZED',
        content,
        lineNum,
        source: this.filename,
        rawContent: content,
      }
    }
  }
}
