import * as path from 'path'
import * as fs from 'fs'
import fetch from 'node-fetch'
import pc from 'picocolors'
import { getToken } from './../utils'
import { setToken } from './set-token'

interface Options {
	environment: 'local' | 'dev' | 'test' | 'beta' | 'prod'
}

export const use = async (appName: string, options: Options) => {

	const token = getToken()
	if (!token) {
		console.log(pc.red('缺少 token，请先配置，文档请查看 https://github.com/lexmin0412/env-config-manager/blob/main/README.md'))
		await setToken()
	}

	const cwd = process.cwd()
	const { environment: environment } = options

	const ref = 'master'
	const gitlabDomain = 'https://gitlab.com/'
	const projectId = '12345'
	const filePathBase = `${gitlabDomain}/api/v4/projects/${projectId}/repository/files`

	if (!['local', 'dev', 'test', 'beta', 'prod'].includes(environment)) {
		console.error('environment must be one of local, dev, test, beta, prod')
		process.exit(1)
	}

	const originalFilePath = `conf/${appName}/.env.${environment}`
	const filePath = encodeURIComponent(originalFilePath)
	const newToken = getToken()
	const remoteEnvPath = `${filePathBase}/${filePath}?ref=${ref}&access_token=${newToken}`
	const localEnvPath = path.resolve(cwd, '.env')

	console.log(pc.green('请求配置'), remoteEnvPath);

	fetch(remoteEnvPath).then((response: any) => {
		response.buffer().then((res: any) => {
			try {
				const result = JSON.parse(res.toString())

				if (result.message) {
					console.log(pc.red('请求失败'), result.message)
					console.log();
					process.exit(1)
				}

				const envContent = decodeURI(Buffer.from(result.content, 'base64').toString())
				fs.writeFileSync(localEnvPath, envContent)
				console.log();
				console.log(pc.green('写入成功'), '文件路径:', localEnvPath)
				console.log();
			} catch (error) {
				console.log('write error', error)
			}
		})
	})
}
