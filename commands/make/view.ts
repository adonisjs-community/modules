import { stubsRoot } from '../../stubs/main.js'
import MakeView from '@adonisjs/core/commands/make/view'
import { flags } from '@adonisjs/core/ace'

/**
 * Make a new EdgeJS template file
 */
export default class MMakeView extends MakeView {
  static override description = 'Create a new Edge.js template file for a module'

  @flags.string({ description: 'Name of the module' })
  declare module: string

  //TODO: Check if module exists

  override async run() {
    const codemods = await this.createCodemods()
    await codemods.makeUsingStub(stubsRoot, this.stubPath, {
      flags: this.parsed.flags,
      entity: this.app.generators.createEntity(this.name),
    })
  }
}
