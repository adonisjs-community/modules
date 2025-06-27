import { flags } from '@adonisjs/core/ace'
import { stubsRoot } from '../../stubs/main.js'
import MakeService from '@adonisjs/core/commands/make/service'
import { COMMAND_PREFIX, MODULE_FLAG } from '../../src/constants.js'
import { checkModule } from '../../src/utils.js'

/**
 * Make a new service class
 */
export default class MMakeService extends MakeService {
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
    })
  }
}
