import { z } from 'zod'
import fs from 'fs'

export const regex = () => z.string().transform(arg => new RegExp(arg))
export const path = () => z.string().refine(fs.existsSync)