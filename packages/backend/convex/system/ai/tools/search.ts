import z from 'zod';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createTool } from '@convex-dev/agent';

import { internal } from '../../../_generated/api';
import { supportAgent } from '../agents/supportAgent';
import rag from '../rag';

export const search = createTool({
	description:
		'Search the knowledge base for relevent information to help answer a question.',
	args: z.object({
		query: z.string().describe('The search query to find infomation'),
	}),
	handler: async (ctx, args) => {
		if (!ctx.threadId) {
			return 'Missing thread ID';
		}

		const conversation = await ctx.runQuery(
			internal.system.conversation.getByThreadId,
			{ threadId: ctx.threadId }
		);

		if (!conversation) {
			return 'Conversation not found';
		}

		const orgId = conversation.organizationId;

		const searchResults = await rag.search(ctx, {
			namespace: orgId,
			query: args.query,
			limit: 5,
		});

		const contextText = `Found result in ${searchResults.entries
			.map((e) => e.title || null)
			.filter((t) => t !== null)
      .join(', ')}. Here is the context: \n\n${searchResults.text}`;

    const response = await generateText({ 
      model: openai.chat("gpt-4o-mini"),
      messages: [ 
        {
          role: "system",
          content: "You interprt knowledge base search results and provide a helpful, accurate answer to user's question.",
        },
        { 
          role: "user",
          content: `User question "${args.query}"\n\nSearch resluls: ${contextText}`
        }
      ],
    })

    await supportAgent.saveMessage(ctx, { 
      threadId: ctx.threadId,
      message: { 
        role: 'assistant',
        content: response.text
      }
    })

    return response.text
	},
});
