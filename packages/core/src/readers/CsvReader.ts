import fs from 'fs'
import { z } from 'zod'
import { parse } from 'csv/sync'
import iconv from 'iconv-lite'
import { novelDataSchema, NovelData, Reader, validators } from '@novel-tools/shared'

export const validator = z.object({
  filename: validators
    .fileValidator()
    .optional()
    .default('list.csv')
    .describe(
      'Filename of the csv list file. This file should be generated from `CsvWriter`, i.e., it must contain at least type, index and content.',
    ),
  encoding: z.string().optional().describe('Encoding of the csv file.'),
})

/**
 * Recovers the novel structure from the csv list.
 */
export class CsvReader implements Reader {
  list: Record<string, string>[]

  constructor(options: object) {
    const { filename, encoding } = validator.parse(options)
    const buffer = fs.readFileSync(filename)
    const contents = encoding === undefined ? buffer.toString('utf-8') : iconv.decode(buffer, encoding)
    this.list = parse(contents, { columns: true, skip_empty_lines: true }) as Record<string, string>[]
  }

  *read(): Generator<NovelData> {
    for (const line of this.list) {
      try {
        yield novelDataSchema.parse(line)
      } catch (e) {
        if (e instanceof Error) {
          console.error(`Error parsing CSV Line (${JSON.stringify(line)}): ${e.message}`)
        } else {
          console.error(`Unknown error parsing CSV Line (${JSON.stringify(line)}): ${e}`)
        }
        throw e
      }
    }
  }
}
