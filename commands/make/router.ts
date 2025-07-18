import { args, BaseCommand } from '@adonisjs/core/ace'
import stringHelpers from '@adonisjs/core/helpers/string'
import * as fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { stubsRoot } from '../../stubs/main.js'

/**
 * The make router command to create a new router inside the given module
 */
export default class MakeRouter extends BaseCommand {
    static description = 'Create a router inside the given module'
    static commandName = 'make:router'

    protected stubPath: string = 'make/router/main.stub'

    @args.string({ description: 'Create a router inside the given module', })
    declare module: string

    async run() {
        const moduleName = stringHelpers.snakeCase(this.module)
        const modulePath = path.join(fileURLToPath(this.app.appRoot), 'app', moduleName)

        const createFile = this.logger.action(`create router for module ${moduleName}`)

        if (!fs.existsSync(modulePath)) {
            createFile.skipped(`Module does not exists (at: ${this.colors.grey(modulePath)})`)
            return
        }

        const routerName = `${moduleName}Router`
        const exportPath = this.app.makePath(modulePath, moduleName, 'router.ts')

        const codemods = await this.createCodemods()
        await codemods.makeUsingStub(stubsRoot, this.stubPath, {
            routerName,
            moduleName,
            exportPath
        })
    }
}
