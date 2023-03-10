import { z } from 'zod'

export const unIndexedTypeEnum = [
  'BOOK_TITLE',
  'BOOK_INTRO',
  'VOLUME_INTRO',
  'CHAPTER_CONTENT',
  'UNRECOGNIZED',
] as const
export type UnindexedType = (typeof unIndexedTypeEnum)[number]
export const indexedTypeEnum = ['VOLUME_TITLE', 'CHAPTER_TITLE'] as const
export type IndexedType = (typeof indexedTypeEnum)[number]
export const dataTypeEnum = [...unIndexedTypeEnum, ...indexedTypeEnum] as const
export type DataType = (typeof dataTypeEnum)[number]

export function isUnindexedType(t: DataType): t is UnindexedType {
  return (unIndexedTypeEnum as readonly string[]).includes(t)
}

export function isindexedType(t: DataType): t is IndexedType {
  return (indexedTypeEnum as readonly string[]).includes(t)
}

export const novelTypeSchema = z.union([
  z.object({ type: z.enum(unIndexedTypeEnum) }),
  z.object({
    type: z.enum(dataTypeEnum),
    index: z.coerce.number().int(),
    tag: z.string().optional(),
  }),
])

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
