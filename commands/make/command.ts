import { stubsRoot } from '../../stubs/main.js'
import MakeCommand from '@adonisjs/core/commands/make/command'
import { flags } from '@adonisjs/core/ace'

/**
 * Make a new ace command
 */
export default class MMakeCommand extends MakeCommand {
  static override commandName = 'mmake:command'
  static override description = 'Create a new ace command class for a module'

  @flags.string({ description: 'Name of the module' })
  declare module: string

  //TODO: Check if module exists

  /**
   * The stub to use for generating the command class
   */
  protected override stubPath: string = 'make/command/main.stub'

  override async run() {
    const codemods = await this.createCodemods()
    await codemods.makeUsingStub(stubsRoot, this.stubPath, {
      flags: this.parsed.flags,
      entity: this.app.generators.createEntity(this.name),
    })
  }
}
