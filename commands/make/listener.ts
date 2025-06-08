import { stubsRoot } from '../../stubs/main.js'
import { flags } from '@adonisjs/core/ace'
import MakeListener from '@adonisjs/core/commands/make/listener'

/**
 * The make listener command to create a class based event
 * listener
 */
export default class MMakeListener extends MakeListener {
  static override description = 'Create a new event listener class for a module'

  @flags.string({ description: 'Name of the module' })
  declare module: string

  //TODO: Check if module exists

  override async run() {
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
