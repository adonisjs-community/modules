import { stubsRoot } from '../../stubs/main.js'
import { flags } from '@adonisjs/core/ace'
import MakeListener from '@adonisjs/core/commands/make/listener'
import { COMMAND_PREFIX, MODULE_FLAG } from '../../src/constants.js'
import { checkModule } from '../../src/utils.js'

/**
 * The make listener command to create a class based event
 * listener
 */
export default class MMakeListener extends MakeListener {
  @flags.string(MODULE_FLAG)
  declare module: string

  override async run() {
    if (!checkModule(this.app, this.module)) {
      this.kernel.exec(`${COMMAND_PREFIX}:module`, [this.module])
    }

    const codemods = await this.createCodemods()

    if (this.event) {
      const { exitCode } = await this.kernel.exec('make:event', [this.event])

      /**
       * Create listener only when make:event is completed successfully
       */
      if (exitCode === 0) {
        const eventEntity = this.app.generators.createEntity(this.event)
        await codemods.makeUsingStub(stubsRoot, this.stubPath, {
          event: eventEntity,
          flags: this.parsed.flags,
          entity: this.app.generators.createEntity(this.name),
        })
      }

      return
    }

    await codemods.makeUsingStub(stubsRoot, this.stubPath, {
      flags: this.parsed.flags,
      entity: this.app.generators.createEntity(this.name),
    })
  }
}
