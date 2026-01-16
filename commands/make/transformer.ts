import { stubsRoot } from '../../stubs/main.ts'
import MakeTransformer from '@adonisjs/core/commands/make/transformer'
import { flags } from '@adonisjs/core/ace'
import { COMMAND_PREFIX, MODULE_FLAG } from '../../src/constants.ts'
import { checkModule } from '../../src/utils.ts'

export default class MMakeTransformer extends MakeTransformer {
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
      model: this.app.generators.createEntity(this.name),
    })
  }
}