import * as path from 'path'
import { program } from 'commander'
import { use } from './libs/use'
import { writeToken } from './utils'
import { setToken } from './libs/set-token'

const pkgJsonPath = path.resolve(process.cwd(), 'package.json')
const pkgJson = require(pkgJsonPath)
const appName = pkgJson.name

program
	.version(pkgJson.version)
	.command('use <environment>')
	.description('fetch environment config from remote')
	.action((environment) => {
		try {
			use(appName, {
				environment: environment
			})
		} catch (error) {
			console.error(error)
			process.exit(1)
		}
	})

program
	.version(pkgJson.version)
	.command('set-token [environment]')
	.description('fetch environment config from remote')
	.action((token) => {
		try {
			if (token) {
				writeToken(token)
			} else {
				setToken()
			}
		} catch (error) {
			console.error(error)
			process.exit(1)
		}
	})

program.parse()
