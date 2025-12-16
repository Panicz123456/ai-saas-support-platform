import { ConvexError, v } from "convex/values";

import { SESSION_DURATION_MS } from "../constants";
import { internalMutation, internalQuery } from "../_generated/server";

const AUTO_REFRESH_THRESHOLD_MS = 24 * 60 * 60 * 1000; // 24 hours

export const refresh = internalMutation({ 
	args: { 
		contactSessionId: v.id("contactSessions")
	},
	handler: async (ctx, args) => { 
		const contactSession = await ctx.db.get(args.contactSessionId)

		if (!contactSession) { 
			throw new ConvexError({ 
				code: "NOT_FOUND",
				message: "Contact Session not found"
			})
		}

		if (contactSession.expiresAt < Date.now()) { 
			throw new ConvexError({
				code: 'BAD_REQUEST',
				message: 'Contact Session expired',
			});
		}

		const timeRemaining = contactSession.expiresAt - Date.now()

		if (timeRemaining < AUTO_REFRESH_THRESHOLD_MS) { 
			const newExpiredAt = Date.now() + SESSION_DURATION_MS;

			await ctx.db.patch(args.contactSessionId, { 
				expiresAt: newExpiredAt
			})
			return {
				...contactSession,
				expiresAt: newExpiredAt,
			};
		}
		return contactSession
	}
})

export const getOne = internalQuery({
	args: {
		contactSessionId: v.id('contactSessions'),
	},
	handler: async (ctx, args) => {
		return await ctx.db.get(args.contactSessionId);
	},
});
