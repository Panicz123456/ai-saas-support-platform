import { components } from '../../../_generated/api'
import { openai } from '@ai-sdk/openai'
import { Agent } from '@convex-dev/agent'

export const supportAgent = new Agent(components.agent, { 
  name: "Support Agent",
  languageModel: openai.chat("gpt-4.1-mini"),
  instructions: "You are a customer support agent."
})