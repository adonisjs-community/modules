import { stubsRoot } from '../../stubs/main.js'
import { flags } from '@adonisjs/core/ace'
import MakeValidator from '@adonisjs/core/commands/make/validator'

/**
 * Make a new VineJS validator
 */
export default class MMakeValidator extends MakeValidator {
  static override commandName = 'mmake:validator'
  static override description = 'Create a new file to define VineJS validators for a module'

  @flags.string({ description: 'Name of the module' })
  declare module: string

  //TODO: Check if module exists

  /**
   * The stub to use for generating the validator
   */
  protected override stubPath: string = 'make/validator/main.stub'

  /**
   * Preparing the command state
   */
  async prepare() {
    /**
     * Use resource stub
     */
    if (this.resource) {
      this.stubPath = 'make/validator/resource.stub'
    }
  }

  override async run() {
    const codemods = await this.createCodemods()
    await codemods.makeUsingStub(stubsRoot, this.stubPath, {
      flags: this.parsed.flags,
      entity: this.app.generators.createEntity(this.name),
    })
  }
}
