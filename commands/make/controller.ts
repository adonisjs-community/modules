import stringHelpers from '@adonisjs/core/helpers/string'
import { stubsRoot } from '../../stubs/main.js'
import MakeController from '@adonisjs/core/commands/make/controller'
import { flags } from '@adonisjs/core/ace'

/**
 * The make controller command to create an HTTP controller
 */
export default class MMakeController extends MakeController {
  static override commandName = 'mmake:controller'
  static override description = 'Create a new HTTP controller class for a module'

  @flags.string({ description: 'Name of the module' })
  declare module: string

  //TODO: Check if module exists

  /**
   * The stub to use for generating the controller
   */
  protected override stubPath: string = 'make/controller/main.stub'

  /**
   * Preparing the command state
   */
  async prepare() {
    /**
     * Use actions stub
     */
    if (this.actions) {
      this.stubPath = 'make/controller/actions.stub'
    }

    /**
     * Use resource stub
     */
    if (this.resource) {
      if (this.actions) {
        this.logger.warning('Cannot use --resource flag with actions. Ignoring --resource')
      } else {
        this.stubPath = 'make/controller/resource.stub'
      }
    }

    /**
     * Use api stub
     */
    if (this.api) {
      if (this.actions) {
        this.logger.warning('Cannot use --api flag with actions. Ignoring --api')
      } else {
        this.stubPath = 'make/controller/api.stub'
      }
    }

    /**
     * Log warning when both flags are used together
     */
    if (this.resource && this.api && !this.actions) {
      this.logger.warning('--api and --resource flags cannot be used together. Ignoring --resource')
    }
  }

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
