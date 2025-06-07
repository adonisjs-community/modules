import { stubsRoot } from '../stubs/main.js'
import { flags } from '@adonisjs/core/ace'
import MakeService from '@adonisjs/core/commands/make/service'

/**
 * Make a new service class
 */
export default class MMakeService extends MakeService {
  static override commandName = 'mmake:service'
  static override description = 'Create a new service class for a module'

  @flags.string({ description: 'Name of the module' })
  declare module: string

  /**
   * The stub to use for generating the service class
   */
  protected override stubPath: string = 'make/service/main.stub'

  async run() {
    const codemods = await this.createCodemods()
    await codemods.makeUsingStub(stubsRoot, this.stubPath, {
      flags: this.parsed.flags,
      entity: this.app.generators.createEntity(this.name),
    })
  }
}
