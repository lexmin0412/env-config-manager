import * as path from 'path'
import * as fs from 'fs'
import * as os from 'os'
import pc from 'picocolors'

interface Config {
	gitlab: {
		token: string
	}
}

const USER_HOME = os.homedir()

export const rootPath = path.resolve(USER_HOME, '.ecm')

if (!fs.existsSync(rootPath)) {
	fs.mkdirSync(rootPath)
}

export const configJsonPath = path.resolve(rootPath, 'config.json')

export const createEmptyJsonWhenNeeds = () => {
	if (!fs.existsSync(configJsonPath)) {
		fs.writeFileSync(configJsonPath, JSON.stringify({
			gitlab: {
				token: ''
			}
		}, null, 2))
	}
}

export const readConfigs = (): Config => {
	createEmptyJsonWhenNeeds()
	const configs = JSON.parse(fs.readFileSync(configJsonPath, 'utf8'))
	return configs
}

export const getToken = () => {
	const config = readConfigs()
	return config.gitlab.token
}

export const writeToken = (token: string) => {
	const config = readConfigs()
	config.gitlab.token = token
	fs.writeFileSync(configJsonPath, JSON.stringify(config, null, 2))
	console.log(pc.green(`token 写入成功: ${token}`));

}
