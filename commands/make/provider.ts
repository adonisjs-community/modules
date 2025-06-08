import { extname, relative } from 'node:path'

import { stubsRoot } from '../../stubs/main.js'
import type { AppEnvironments } from '@adonisjs/core/types/app'
import { flags } from '@adonisjs/core/ace'
import MakeProvider from '@adonisjs/core/commands/make/provider'
import { slash } from '@adonisjs/core/helpers'
import { COMMAND_PREFIX, MODULE_FLAG } from '../../src/constants.js'
import { checkModule } from '../../src/utils.js'

const ALLOWED_ENVIRONMENTS = ['web', 'console', 'test', 'repl'] satisfies AppEnvironments[]

/**
 * Make a new provider class
 */
export default class MMakeProvider extends MakeProvider {
  @flags.string(MODULE_FLAG)
  declare module: string

  /**
   * Validate the environments flag passed by the user
   */
  #isEnvironmentsFlagValid() {
    if (!this.environments || !this.environments.length) {
      return true
    }
    return this.environments.every((one) => ALLOWED_ENVIRONMENTS.includes(one))
  }

  override async run() {
    if (!checkModule(this.app, this.module)) {
      this.kernel.exec(`${COMMAND_PREFIX}:module`, [this.module])
    }

    /**
     * Ensure the environments are valid when provided via flag
     */
    if (!this.#isEnvironmentsFlagValid()) {
      this.logger.error(
        `Invalid environment(s) "${this.environments}". Only "${ALLOWED_ENVIRONMENTS}" are allowed`
      )
      return
    }

    /**
     * Display prompt to know if we should register the provider
     * file inside the ".adonisrc.ts" file.
     */
    if (this.register === undefined) {
      this.register = await this.prompt.confirm(
        'Do you want to register the provider in .adonisrc.ts file?'
      )
    }

    const codemods = await this.createCodemods()
    const { destination } = await codemods.makeUsingStub(stubsRoot, this.stubPath, {
      flags: this.parsed.flags,
      entity: this.app.generators.createEntity(this.name),
    })

    /**
     * Do not register when prompt has been denied or "--no-register"
     * flag was used
     */
    if (!this.register) {
      return
    }

    /**
     * Creative relative path for the provider file from
     * the "./start" directory
     */
    const providerRelativePath = slash(
      relative(this.app.providersPath(), destination).replace(extname(destination), '')
    )

    await codemods.updateRcFile((rcFile) => {
      rcFile.addProvider(`#providers/${providerRelativePath}`, this.environments)
    })
  }
}
