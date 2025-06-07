import { stubsRoot } from '../../stubs/main.js'
import MakeEvent from '@adonisjs/core/commands/make/event'
import { flags } from '@adonisjs/core/ace'

/**
 * The make event command to create a class based event
 */
export default class MMakeEvent extends MakeEvent {
  static override commandName = 'mmake:event'
  static override description = 'Create a new event class for a module'

  @flags.string({ description: 'Name of the module' })
  declare module: string

  //TODO: Check if module exists

  /**
   * The stub to use for generating the event
   */
  protected override stubPath: string = 'make/event/main.stub'

  override async run() {
    const codemods = await this.createCodemods()
    await codemods.makeUsingStub(stubsRoot, this.stubPath, {
      flags: this.parsed.flags,
      entity: this.app.generators.createEntity(this.name),
    })
  }
}
