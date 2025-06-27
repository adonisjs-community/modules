import { flags } from '@adonisjs/core/ace'
import { stubsRoot } from '../../stubs/main.js'
import MakeModel from '@adonisjs/lucid/commands/make_model'
import { COMMAND_PREFIX, MODULE_FLAG } from '../../src/constants.js'
import { checkModule } from '../../src/utils.js'

export default class MMakeModel extends MakeModel {
  @flags.string(MODULE_FLAG)
  declare module: string

  /**
   * Execute command
   */
  override async run(): Promise<void> {
    if (!this.module) {
      return super.run()
    }

    if (!checkModule(this.app, this.module)) {
      this.kernel.exec(`${COMMAND_PREFIX}:module`, [this.module])
    }

    const codemods = await this.createCodemods()
    await codemods.makeUsingStub(stubsRoot, 'make/model/main.stub', {
      flags: this.parsed.flags,
      entity: this.app.generators.createEntity(this.name),
    })
  }
}
