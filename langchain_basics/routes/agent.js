import { Router } from 'express'
import { OpenAI } from 'langchain/llms/openai'
import { SerpAPI } from 'langchain/tools'
import { Calculator } from 'langchain/tools/calculator'
import { initializeAgentExecutorWithOptions } from 'langchain/agents'

const agentRouter = Router()

agentRouter.get('/:location', async (req, res) => {
	const { location } = req.params

	const model = new OpenAI({
		temperature: 0,
	})

	const tools = [
		new SerpAPI(process.env.SERPAPI_API_KEY, {
			hl: 'en',
			gl: 'us',
		}),
		new Calculator(),
	]

	const executor = await initializeAgentExecutorWithOptions(tools, model, {
		agentType: 'zero-shot-react-description',
	})

	const response = await executor.call({
		input: `Describe the most beautiful location in ${location}`,
	})

	res.json(response.output)
})

export { agentRouter }
