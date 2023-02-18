import { z } from 'zod'

export const novelTypeSchema = z.union([
  z.object({ type: z.enum(['BOOK_TITLE', 'BOOK_INTRO', 'VOLUME_INTRO', 'CHAPTER_CONTENT', 'UNRECOGNIZED']) }),
  z.object({
    type: z.enum(['VOLUME_TITLE', 'CHAPTER_TITLE']),
    index: z.coerce.number().int(),
    tag: z.string().optional(),
  }),
])

export type NovelType = z.infer<typeof novelTypeSchema>

export const novelDataSchema = z.intersection(
  novelTypeSchema,
  z.object({
    /**
     * If the type is not a title, then the content will be the matcher's input. If a title is matched, then
     * content will be the title name.
     */
    content: z.string(),
    lineNum: z.coerce.number().int().optional(),
    /** Source file for this novel data. */
    source: z.string().optional(),
    rawContent: z.string().optional(),
    /** If there is an error during processing, this field will be populated with the error message. */
    errors: z.array(z.string()).optional(),
  }),
)

/** Represents an intermediate object of the worker. */
export type NovelData = z.infer<typeof novelDataSchema>
