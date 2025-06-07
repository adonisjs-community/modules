import { getDirname } from '@adonisjs/core/helpers'
import path from 'node:path'

/**
 * Path to the root directory where the stubs are stored. We use
 * this path within commands and the configure hook
 */
export const stubsRoot = path.join(getDirname(import.meta.url), 'stubs')
