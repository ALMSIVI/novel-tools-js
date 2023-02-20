import { z } from 'zod'
import fs from 'fs'

export const regexValidator = () => z.string().transform((arg) => new RegExp(arg))
export const directoryValidator = () =>
  z.string().refine((arg) => fs.statSync(arg, { throwIfNoEntry: false })?.isDirectory())
export const fileValidator = () => z.string().refine((arg) => fs.statSync(arg, { throwIfNoEntry: false })?.isFile())
