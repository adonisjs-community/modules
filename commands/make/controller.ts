import stringHelpers from '@adonisjs/core/helpers/string'
import { stubsRoot } from '../../stubs/main.js'
import MakeController from '@adonisjs/core/commands/make/controller'
import { flags } from '@adonisjs/core/ace'
import { checkModule } from '../../src/utils.js'
import { COMMAND_PREFIX, MODULE_FLAG } from '../../src/constants.js'

/**
 * The make controller command to create an HTTP controller
 */
export default class MMakeController extends MakeController {
  @flags.string(MODULE_FLAG)
  declare module: string

  override async run() {
    if (!this.module) {
      return super.run()
    }

    if (!checkModule(this.app, this.module)) {
      this.kernel.exec(`${COMMAND_PREFIX}:module`, [this.module])
    }

    const codemods = await this.createCodemods()
    await codemods.makeUsingStub(stubsRoot, this.stubPath, {
      flags: this.parsed.flags,
      actions: this.actions?.map((action) => stringHelpers.camelCase(action)),
      entity: this.app.generators.createEntity(this.name),
      singular: this.singular,
    })
  }
}
