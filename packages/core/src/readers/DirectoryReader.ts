import { z } from 'zod'
import path from 'path'
import { Reader, NovelData, validators } from '@novel-tools/shared'
import { orderBy } from 'natural-orderby'
import fs from 'fs'
import { TextReader } from './TextReader'

const supportedExtensions = ['.txt', '.md']

export const validator = z.object({
  dir: validators.existentDirectory().describe('The working directory.'),
  readContents: z.boolean().describe('If set to true, will open the files to read the contents.'),
  discardChapters: z.boolean().describe('If set to true, will start from chapter 1 again when entering a new volume.'),
  defaultVolume: z
    .string()
    .optional()
    .describe(
      'If the novel does not have volumes but all chapters are stored in a directory, then the variable would store the directory name.',
    ),
  introFilename: z.string().default('_intro.txt').describe('The filename of the book/volume introduction file(s).'),
  encoding: z.string().optional().describe('Encoding of the chapter file(s).'),
  mergeNewlines: z
    .boolean()
    .default(false)
    .describe(
      'If set to true, will merge two newline characters into one. Sometimes newline characters carry meanings, so we might not always want to merge them.',
    ),
})

/**
 * Reads from a directory structure. This directory should be generated from FileWriter, as it will follow certain
 * conventions, such as the first line of the chapter file being the title.
 */
export class DirectoryReader implements Reader {
  private readonly dir: string
  private readonly readContents: boolean
  private readonly discardChapters: boolean
  private readonly defaultVolume?: string
  private readonly encoding?: string
  private readonly introFilename: string
  private readonly mergeNewlines: boolean

  constructor(options: object) {
    const { dir, readContents, discardChapters, defaultVolume, encoding, introFilename, mergeNewlines } =
      validator.parse(options)

    this.dir = dir
    this.readContents = readContents
    this.discardChapters = discardChapters
    this.defaultVolume = defaultVolume ? path.resolve(dir, defaultVolume) : undefined
    this.encoding = encoding
    this.introFilename = introFilename
    this.mergeNewlines = mergeNewlines
  }

  *read(): Generator<NovelData> {
    // Read book intro file
    const introFile = path.resolve(this.dir, this.introFilename)
    if (this.readContents && fs.statSync(introFile).isFile()) {
      const textReader = this.getTextReader(introFile)
      for (const data of textReader.read()) {
        data.type = 'BOOK_INTRO'
        yield data
      }
    }

    const volumes = this.defaultVolume
      ? [this.defaultVolume]
      : orderBy(
          fs
            .readdirSync(this.dir, { withFileTypes: true })
            .filter((entry) => entry.isDirectory())
            .map((entry) => entry.name),
        )
    let volumeIndex = 0
    let chapterIndex = 0
    for (const volume of volumes) {
      volumeIndex++
      if (this.discardChapters) {
        chapterIndex = 0
      }

      if (volume !== this.defaultVolume) {
        yield { content: volume, type: 'VOLUME_TITLE', index: volumeIndex }
      }

      const chapters = orderBy(
        fs
          .readdirSync(path.resolve(this.dir, volume), { withFileTypes: true })
          .filter((entry) => entry.isFile() && supportedExtensions.includes(path.extname(entry.name)))
          .map((entry) => entry.name),
      )

      // Read volume intro file
      // Notice we remove the intro file from chapters first before checking readContents
      if (chapters.splice(chapters.indexOf(this.introFilename)).length > 0 && this.readContents) {
        const introFile = path.resolve(this.dir, volume, this.introFilename)
        const textReader = this.getTextReader(introFile)
        for (const introData of textReader.read()) {
          yield { ...introData, type: 'VOLUME_INTRO' }
        }
      }

      for (const chapter of chapters) {
        chapterIndex++
        const textReader = this.getTextReader(path.resolve(this.dir, volume, chapter))
        const read = textReader.read()
        const next = read.next()
        if (!next.done) {
          const titleData = next.value
          yield { ...titleData, type: 'CHAPTER_TITLE', index: chapterIndex }

          if (this.readContents) {
            for (const contentData of read) {
              yield { ...contentData, type: 'CHAPTER_CONTENT' }
            }
          }
        }
      }
    }
  }

  private getTextReader(filename: string): TextReader {
    return new TextReader({ filename, encoding: this.encoding, verbose: true, mergeNewlines: this.mergeNewlines })
  }
}
