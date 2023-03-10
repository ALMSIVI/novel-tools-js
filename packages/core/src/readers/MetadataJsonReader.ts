import { z } from 'zod'
import { NovelData, Reader, utils, validators } from '@novel-tools/shared'

export const validator = z.object({
  filename: validators
    .existentFile()
    .default('metadata.json')
    .describe("Filename of the metadata json file. The metadata MUST contain a 'title' field."),
  encoding: z.string().optional().describe('Encoding of the metadata file'),
})

/**
 * Reads a json that contains the metadata of the book file. Will only generate a BOOK_TITLE, with the `others` field
 * populated with the other metadata.
 */
export class MetadataJsonReader implements Reader {
  private readonly filename: string
  private readonly content: string
  constructor(options: object) {
    const { filename, encoding } = validator.parse(options)
    this.filename = filename
    this.content = utils.readFile(filename, encoding)
  }

  *read(): Generator<NovelData> {
    const data = JSON.parse(this.content)
    if (!('title' in data)) {
      throw new TypeError("'title' field is not in the json file.")
    }
    yield {
      type: 'BOOK_TITLE',
      content: data.title,
      source: this.filename,
      rawContent: this.content,
    }
  }
}
