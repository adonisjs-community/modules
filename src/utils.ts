import path from 'node:path'
import { fileURLToPath } from 'node:url'
import stringHelpers from '@adonisjs/core/helpers/string'
import { ApplicationService } from '@adonisjs/core/types'
import { readFileSync, writeFileSync } from 'node:fs'

export function checkModule(app: ApplicationService, value: string): boolean {
  const moduleName = stringHelpers.snakeCase(value)
  const packageJson = JSON.parse(
    readFileSync(path.join(fileURLToPath(app.appRoot), 'package.json'), 'utf-8')
  )

  return Boolean(packageJson.imports[`#${moduleName}/*`])
}

export function registerModule(app: ApplicationService, value: string) {
  const moduleName = stringHelpers.snakeCase(value)
  const packageJson = getPackageJson(app)

  packageJson.imports[`#${moduleName}/*`] = `./app/${moduleName}/*.js`

  writeFileSync(
    path.join(fileURLToPath(app.appRoot), 'package.json'),
    JSON.stringify(packageJson, null, 2),
    'utf-8'
  )
}

export function getPackageJson(app: ApplicationService): any {
  const packageJsonPath = path.join(fileURLToPath(app.appRoot), 'package.json')
  return JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
}
