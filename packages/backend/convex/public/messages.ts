import { ConvexError, v } from 'convex/values';
import { saveMessage } from '@convex-dev/agent';
import { paginationOptsValidator } from 'convex/server';

import { searchTool } from '../system/ai/tools/search';
import { action, query } from '../_generated/server';
import { components, internal } from '../_generated/api';
import { supportAgent } from '../system/ai/agents/supportAgent';
import { resolveConversationTool } from '../system/ai/tools/resolveConversation';
import { escalateConversationTool } from '../system/ai/tools/escalateConversation';

export const create = action({
	args: {
		prompt: v.string(),
		threadId: v.string(),
		contactSessionId: v.id('contactSession'),
	},
	handler: async (ctx, args) => {
		const contactSession = await ctx.runQuery(
			internal.system.contactSession.getOne,
			{
				contactSessionId: args.contactSessionId,
			}
		);

		if (!contactSession || contactSession.expairedAt < Date.now()) {
			throw new ConvexError({
				code: 'UNAUTHORIZED',
				message: 'Contact session not found or expired',
			});
		}

		const conversation = await ctx.runQuery(
			internal.system.conversation.getByThreadId,
			{
				threadId: args.threadId,
			}
		);

		if (!conversation) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'conversation not found',
			});
		}

		if (conversation.status === 'resolved') {
			throw new ConvexError({
				code: 'BAD_REQUEST',
				message: 'Conversation is already resolved',
			});
		}

		// TODO: Implement subscription check
		const shouldTriggerAgent = conversation.status === 'unresolved';

		if (shouldTriggerAgent) {
			await supportAgent.generateText(
				ctx,
				{
					threadId: args.threadId,
				},
				{
					prompt: args.prompt,
					tools: {
						searchTool,
						resolveConversationTool,
						escalateConversationTool,
					},
				}
			);
		} else {
			await saveMessage(ctx, components.agent, {
				threadId: args.threadId,
				prompt: args.prompt,
			});
		}
	},
});

export const getMany = query({
	args: {
		threadId: v.string(),
		paginationOpts: paginationOptsValidator,
		contactSessionId: v.id('contactSession'),
	},
	handler: async (ctx, args) => {
		const contactSession = await ctx.db.get(args.contactSessionId);

		if (!contactSession || contactSession.expairedAt < Date.now()) {
			throw new ConvexError({
				code: 'UNAUTHORIZED',
				message: 'Contact session not found or expired',
			});
		}

		const paginated = await supportAgent.listMessages(ctx, {
			threadId: args.threadId,
			paginationOpts: args.paginationOpts,
		});

		return paginated;
	},
});
