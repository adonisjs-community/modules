import { args, BaseCommand } from '@adonisjs/core/ace'
import stringHelpers from '@adonisjs/core/helpers/string'
import * as fs from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * The mmake module command to create a new module with proper structure and files.
 */
export default class MakeModule extends BaseCommand {
  static commandName = 'mmake:module'
  static description = 'Create a new module with proper structure and files'

  @args.string({ description: 'The name of the module' })
  declare name: string

  /**
   * The stub to use for generating the controller
   */
  /**
   * Preparing the command state
   */
  async prepare() {}

  async run() {
    const moduleName = stringHelpers.snakeCase(this.name)
    const newDirectory = path.join(fileURLToPath(this.app.appRoot), 'app', moduleName)

    if (!fs.existsSync(newDirectory)) {
      fs.mkdirSync(newDirectory, { recursive: true })
    }

    const packageJson = await JSON.parse(
      await readFile(path.join(fileURLToPath(this.app.appRoot), 'package.json'), 'utf-8')
    )

    console.log(this.app.appRoot)

    console.log(packageJson)
  }
}
