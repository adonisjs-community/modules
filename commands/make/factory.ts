import { flags } from '@adonisjs/core/ace'
import { stubsRoot } from '../../stubs/main.js'
import MakeFactory from '@adonisjs/lucid/commands/make_factory'
import { COMMAND_PREFIX, MODULE_FLAG } from '../../src/constants.js'
import { checkModule } from '../../src/utils.js'

/**
 * Command to make a new Factory
 */
export default class MMakeFactory extends MakeFactory {
  @flags.string(MODULE_FLAG)
  declare module: string

  override async run() {
    if (!this.model) {
      return super.run()
    }

    if (!checkModule(this.app, this.module)) {
      this.kernel.exec(`${COMMAND_PREFIX}:module`, [this.module])
    }

    const codemods = await this.createCodemods()
    await codemods.makeUsingStub(stubsRoot, 'make/factory/main.stub', {
      flags: this.parsed.flags,
      entity: this.app.generators.createEntity(this.model),
      model: this.app.generators.createEntity(this.model),
      pathAlias: `#${this.module}/models`,
    })
  }
}
