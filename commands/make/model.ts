import { flags } from '@adonisjs/core/ace'
import { stubsRoot } from '../../stubs/main.js'
import MakeModel from '@adonisjs/lucid/commands/make_model'
import { COMMAND_PREFIX, MODULE_FLAG } from '../../src/constants.js'
import { checkModule } from '../../src/utils.js'

export default class MMakeModel extends MakeModel {
  @flags.string(MODULE_FLAG)
  declare module: string

  /**
   * Run migrations
   */
  private async runMakeMigration() {
    if (!this.migration || this.exitCode) {
      return
    }

    const makeMigration = await this.kernel.exec('make:migration', [this.name])
    this.exitCode = makeMigration.exitCode
    this.error = makeMigration.error
  }

  /**
   * Make controller
   */
  private async runMakeController() {
    if (!this.controller || this.exitCode) {
      return
    }

    const makeController = await this.kernel.exec('make:controller', [this.name])
    this.exitCode = makeController.exitCode
    this.error = makeController.error
  }

  /**
   * Make factory
   */
  private async runMakeFactory() {
    if (!this.factory || this.exitCode) {
      return
    }

    const makeFactory = await this.kernel.exec('make:factory', [this.name])
    this.exitCode = makeFactory.exitCode
    this.error = makeFactory.error
  }

  /**
   * Execute command
   */
  override async run(): Promise<void> {
    if (!checkModule(this.app, this.module)) {
      this.kernel.exec(`${COMMAND_PREFIX}:module`, [this.module])
    }

    const codemods = await this.createCodemods()
    await codemods.makeUsingStub(stubsRoot, 'make/model/main.stub', {
      flags: this.parsed.flags,
      entity: this.app.generators.createEntity(this.name),
    })

    await this.runMakeMigration()
    await this.runMakeController()
    await this.runMakeFactory()
  }
}
