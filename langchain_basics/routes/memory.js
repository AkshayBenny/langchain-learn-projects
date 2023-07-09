import { Router } from 'express'
import { OpenAI } from 'langchain/llms/openai'
import { BufferMemory } from 'langchain/memory'
import { ConversationChain } from 'langchain/chains'

const memoryRouter = Router()

memoryRouter.get('/chat', async (req, res) => {
	const model = new OpenAI({})
	const memory = new BufferMemory()
	const chain = new ConversationChain({
		llm: model,
		memory: memory,
	})

	const res1 = await chain.call({
		input: 'My name is Akshay.',
	})
	console.log(res1)

	const res2 = await chain.call({
		input: 'What is my name?',
	})
	console.log(res2)

	res.json({ res1, res2 })
})

memoryRouter.get('/stream', async (req, res) => {
	const model = new OpenAI({
		streaming: true,
		callbacks: [
			{
				handleLLMNewToken(token) {
					process.stdout.write(token)
				},
			},
		],
	})

	const streamRes = await model.call('Write me a poem about bananas')
	console.log(streamRes)

	res.send(streamRes)
})

export { memoryRouter }
