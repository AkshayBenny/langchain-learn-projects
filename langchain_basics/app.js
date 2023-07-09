import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import { OpenAI } from 'langchain/llms/openai'
import { PromptTemplate } from 'langchain/prompts'
import { LLMChain } from 'langchain/chains'

const PORT = 4000

const app = express()
dotenv.config()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('combined'))

const template = 'Name 5 beautiful places to travel to in {location}'
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

app.get('/langchain/:location', async (req, res) => {
	const { location } = req.params
	const response = await chain.call({
		location: location,
	})
	res.send({ bot: response })
})

app.listen(PORT, () => {
	console.log(`Server running on port `, PORT)
})
