import { args, BaseCommand, flags } from '@adonisjs/core/ace'
import { CommandOptions } from '@adonisjs/core/types/ace'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Make a new service class
 */
export default class MMakeService extends BaseCommand {
  static commandName = 'mmake:service'
  static description = 'Create a new service class for a module'

  static options: CommandOptions = {
    allowUnknownFlags: true,
  }

  @args.string({ description: 'Name of the service' })
  declare name: string

  @flags.string({ description: 'Name of the module' })
  declare module: string

  /**
   * The stub to use for generating the service class
   */
  protected stubPath: string = 'make/service/main.stub'

  async run() {
    // TODO: Clean this
    const stubsRoot = path.join(fileURLToPath(import.meta.url), '..', '..', '..', 'stubs')
    const codemods = await this.createCodemods()
    await codemods.makeUsingStub(stubsRoot, this.stubPath, {
      flags: this.parsed.flags,
      entity: this.app.generators.createEntity(this.name),
    })
  }
}
