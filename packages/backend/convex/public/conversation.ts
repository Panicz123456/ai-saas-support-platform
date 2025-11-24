import { mutation, query } from '../_generated/server';
import { ConvexError, v } from 'convex/values';

export const getOne = query({
	args: {
		conversationId: v.id("conversation"),
		contactSessionId: v.id('contactSession'),
	},
	handler: async (ctx, args) => {
		const session = await ctx.db.get(args.contactSessionId)
		if (!session || session.expairedAt < Date.now()) { 
			throw new ConvexError({ 
				code: "UNAUTHORIZED",
				message: "Invalid session"
			})
		}

		const conversation = await ctx.db.get(args.conversationId);

		if (!conversation) { 
			return null
		}

		return {  
			_id: conversation._id,
			status: conversation.status,
			threadId: conversation.threadId
		}
	},
});

export const create = mutation({
	args: {
		organizationId: v.string(),
		contactSessionId: v.id('contactSession'),
	},
	handler: async (ctx, args) => {
		const session = await ctx.db.get(args.contactSessionId);
		if (!session || session.expairedAt < Date.now()) {
			throw new ConvexError({
				code: 'UNAUTHORIZED',
				message: 'Invalid session',
			});
    }

    // TODO: Change later after convex agent to realt threadId
    const threadId = "123"
    
    const conversationId = await ctx.db.insert("conversation", { 
      contactSessionId: session._id,
      status: "unresolved",
      organizationId: args.organizationId,
      threadId: threadId,
    })

    return conversationId
	},
});
