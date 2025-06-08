import { stubsRoot } from '../../stubs/main.js'
import { flags } from '@adonisjs/core/ace'
import MakeValidator from '@adonisjs/core/commands/make/validator'

/**
 * Make a new VineJS validator
 */
export default class MMakeValidator extends MakeValidator {
  static override description = 'Create a new file to define VineJS validators for a module'

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
