import { stubsRoot } from '../../stubs/main.js'
import MakeEvent from '@adonisjs/core/commands/make/event'
import { flags } from '@adonisjs/core/ace'
import { COMMAND_PREFIX, MODULE_FLAG } from '../../src/constants.js'
import { checkModule } from '../../src/utils.js'

/**
 * The make event command to create a class based event
 */
export default class MMakeEvent extends MakeEvent {
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
      entity: this.app.generators.createEntity(this.name),
      pathAlias: `#${this.module}/events`,
    })
  }
}
