import { stubsRoot } from '../../stubs/main.js'
import { flags } from '@adonisjs/core/ace'
import MakeTest from '@adonisjs/core/commands/make/test'
import { COMMAND_PREFIX, MODULE_FLAG } from '../../src/constants.js'
import { checkModule } from '../../src/utils.js'

/**
 * Make a new test file
 */
export default class MMakeTest extends MakeTest {
  @flags.string(MODULE_FLAG)
  declare module: string

  /**
   * Returns the suite name for creating the test file
   */
  async #getSuite(): Promise<string> {
    if (this.suite) {
      return this.suite
    }

    /**
     * Use the first suite from the rcFile when there is only
     * one suite
     */
    const rcFileSuites = this.app.rcFile.tests.suites
    if (rcFileSuites.length === 1) {
      return rcFileSuites[0].name
    }

    /**
     * Prompt the user to select a suite manually
     */
    return this.prompt.choice(
      'Select the suite for the test file',
      this.app.rcFile.tests.suites.map((suite) => {
        return suite.name
      }),
      {
        validate(choice) {
          return choice ? true : 'Please select a suite'
        },
      }
    )
  }

  /**
   * Returns the directory path for the selected suite.
   */
  async #getSuiteDirectory(directories: string[]): Promise<string> {
    if (directories.length === 1) {
      return directories[0]
    }

    return this.prompt.choice('Select directory for the test file', directories, {
      validate(choice) {
        return choice ? true : 'Please select a directory'
      },
    })
  }

  /**
   * Find suite info from the rcFile file
   */
  #findSuite(suiteName: string) {
    return this.app.rcFile.tests.suites.find((suite) => {
      return suite.name === suiteName
    })
  }

  /**
   * Executed by ace
   */
  override async run() {
    if (!this.module) {
      return super.run()
    }

    if (!checkModule(this.app, this.module)) {
      this.kernel.exec(`${COMMAND_PREFIX}:module`, [this.module])
    }

    const suite = this.#findSuite(await this.#getSuite())

    /**
     * Show error when mentioned/selected suite does not exist
     */
    if (!suite) {
      this.logger.error(`The "${this.suite}" suite is not configured inside the "adonisrc.js" file`)
      this.exitCode = 1
      return
    }

    /**
     * Generate entity
     */
    const codemods = await this.createCodemods()
    await codemods.makeUsingStub(stubsRoot, this.stubPath, {
      flags: this.parsed.flags,
      entity: this.app.generators.createEntity(this.name),
      suite: {
        directory: await this.#getSuiteDirectory(suite.directories),
      },
    })
  }
}
