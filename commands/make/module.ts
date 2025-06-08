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

    const tasks = this.ui.tasks()

    await tasks
      .add(`creating module: ${moduleName}`, async (task) => {
        if (fs.existsSync(newDirectory)) {
          return task.error(`Module already exists (at : ${this.colors.grey(newDirectory)})`)
        }
        fs.mkdirSync(newDirectory, { recursive: true })

        return 'Completed'
      })
      .add('update package.json', async (task) => {
        if (checkModule(this.app, moduleName)) {
          return task.error(
            `Module already registered in package.json (at: ${this.colors.grey('package.json')})`
          )
        }

        registerModule(this.app, moduleName)

        return 'Completed'
      })
      .run()
  }
}
