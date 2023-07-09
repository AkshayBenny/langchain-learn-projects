import { Router } from 'express'
import { OpenAI } from 'langchain/llms/openai'
import { PromptTemplate } from 'langchain/prompts'
import { LLMChain } from 'langchain/chains'

const locationRouter = Router()

const template = 'Name 5 beautiful places to travel to in {location}'

locationRouter.get('/:location', async (req, res) => {
	const { location } = req.params
	const promptTemplate = new PromptTemplate({
		template: template,
		inputVariables: ['location'],
	})

	// const formattedPrompt = await promptTemplate.format({
	// 	location: 'London',
	// })

	const model = new OpenAI({
		temperature: 0.9,
	})

	const chain = new LLMChain({
		llm: model,
		prompt: promptTemplate,
	})
	const response = await chain.call({
		location: location,
	})
	res.send({ bot: response })
})

export { locationRouter }
