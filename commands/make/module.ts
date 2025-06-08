import { args, BaseCommand } from '@adonisjs/core/ace'
import stringHelpers from '@adonisjs/core/helpers/string'
import * as fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { COMMAND_PREFIX } from '../../src/constants.js'
import { checkModule, registerModule } from '../../src/utils.js'

/**
 * The make module command to create a new module with proper structure and files.
 */
export default class MakeModule extends BaseCommand {
  static commandName = `${COMMAND_PREFIX}:module`
  static description = 'Create a new module with proper structure and files'

  @args.string({ description: 'The name of the module' })
  declare name: string

  async run() {
    const moduleName = stringHelpers.snakeCase(this.name)
    const newDirectory = path.join(fileURLToPath(this.app.appRoot), 'app', moduleName)

    const createDirectory = this.logger.action(`create module: ${moduleName}`)

    if (!fs.existsSync(newDirectory)) {
      fs.mkdirSync(newDirectory, { recursive: true })
      createDirectory.succeeded()
    } else {
      createDirectory.skipped(`Module already exists (at : ${this.colors.grey(newDirectory)})`)
    }

    const updatePackageJson = this.logger.action('update package.json')
    if (!checkModule(this.app, moduleName)) {
      registerModule(this.app, moduleName)
      updatePackageJson.succeeded()
    } else {
      updatePackageJson.skipped(`Module already exists (at : ${this.colors.grey(newDirectory)})`)
    }
  }
}
