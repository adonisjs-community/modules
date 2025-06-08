import stringHelpers from '@adonisjs/core/helpers/string'
import { stubsRoot } from '../../stubs/main.js'
import MakeController from '@adonisjs/core/commands/make/controller'
import { flags } from '@adonisjs/core/ace'

/**
 * The make controller command to create an HTTP controller
 */
export default class MMakeController extends MakeController {
  static override description = 'Create a new HTTP controller class for a module'

  @flags.string({ description: 'Name of the module' })
  declare module: string

  //TODO: Check if module exists

  override async run() {
    const codemods = await this.createCodemods()
    await codemods.makeUsingStub(stubsRoot, this.stubPath, {
      flags: this.parsed.flags,
      actions: this.actions?.map((action) => stringHelpers.camelCase(action)),
      entity: this.app.generators.createEntity(this.name),
      singular: this.singular,
    })
  }
}
