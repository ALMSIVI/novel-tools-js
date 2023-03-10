import { z } from 'zod'
import fs from 'fs'

export const regex = () => z.string().transform((arg) => new RegExp(arg))
export const existentDirectory = () =>
  z.string().refine((arg) => fs.statSync(arg, { throwIfNoEntry: false })?.isDirectory(), {
    message: 'Value does not point to an existent directory',
  })
export const existentFile = () =>
  z.string().refine((arg) => fs.statSync(arg, { throwIfNoEntry: false })?.isFile(), {
    message: 'Value does not point to an existent file',
  })
