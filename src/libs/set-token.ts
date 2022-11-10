import inquirer from 'inquirer';
import { createEmptyJsonWhenNeeds, writeToken } from './../utils/index'

export const setToken = () => {
	return inquirer
		.prompt([
			{
				type: 'input',
				name: 'token',
				message: '请输入 token',
			},
		])
		.then((answers: {
			token: string
		}) => {
			createEmptyJsonWhenNeeds()
			writeToken(answers.token)
		})
}
