import { basename, extname, relative } from 'node:path'

import { stubsRoot } from '../../stubs/main.js'
import { flags } from '@adonisjs/core/ace'
import MakeMiddleware from '@adonisjs/core/commands/make/middleware'
import stringHelpers from '@adonisjs/core/helpers/string'
import { slash } from '@adonisjs/core/helpers'
import { COMMAND_PREFIX, MODULE_FLAG } from '../../src/constants.js'
import { checkModule } from '../../src/utils.js'

/**
 * The make middleware command to create a new middleware
 * class.
 */
export default class MMakeMiddleware extends MakeMiddleware {
  @flags.string(MODULE_FLAG)
  declare module: string

  override async run() {
    if (!checkModule(this.app, this.module)) {
      this.kernel.exec(`${COMMAND_PREFIX}:module`, [this.module])
    }

    const stackChoices = ['server', 'router', 'named']

    /**
     * Prompt to select the stack under which to register
     * the middleware
     */
    if (!this.stack) {
      this.stack = await this.prompt.choice(
        'Under which stack you want to register the middleware?',
        stackChoices
      )
    }

    /**
     * Error out when mentioned stack is invalid
     */
    if (!stackChoices.includes(this.stack)) {
      this.exitCode = 1
      this.logger.error(
        `Invalid middleware stack "${this.stack}". Select from "${stackChoices.join(', ')}"`
      )
      return
    }

    /**
     * Create middleware
     */
    const codemods = await this.createCodemods()
    const { destination } = await codemods.makeUsingStub(stubsRoot, this.stubPath, {
      flags: this.parsed.flags,
      entity: this.app.generators.createEntity(this.name),
    })

    /**
     * Creative relative path for the middleware file from
     * the "./app/middleware" directory
     */
    const middlewareRelativePath = slash(
      relative(this.app.middlewarePath(), destination).replace(extname(destination), '')
    )

    /**
     * Take the middleware relative path, remove `_middleware` prefix from it
     * and convert everything to camelcase
     */
    const name = stringHelpers.camelCase(
      basename(middlewareRelativePath).replace(/_middleware$/, '')
    )

    /**
     * Register middleware
     */
    await codemods.registerMiddleware(this.stack, [
      {
        name: name,
        path: `#middleware/${middlewareRelativePath}`,
      },
    ])
  }
}
