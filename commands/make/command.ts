import { stubsRoot } from '../../stubs/main.js'
import MakeCommand from '@adonisjs/core/commands/make/command'
import { flags } from '@adonisjs/core/ace'
import { COMMAND_PREFIX, MODULE_FLAG } from '../../src/constants.js'
import { checkModule } from '../../src/utils.js'

/**
 * Make a new ace command
 */
export default class MMakeCommand extends MakeCommand {
  @flags.string(MODULE_FLAG)
  declare module: string

  override async run() {
    if (!checkModule(this.app, this.module)) {
      this.kernel.exec(`${COMMAND_PREFIX}:module`, [this.module])
    }

    const codemods = await this.createCodemods()
    await codemods.makeUsingStub(stubsRoot, this.stubPath, {
      flags: this.parsed.flags,
      entity: this.app.generators.createEntity(this.name),
    })
  }
}
