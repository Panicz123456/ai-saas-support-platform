import { atom } from 'jotai';
import { atomFamily, atomWithStorage } from 'jotai/utils';

import { WidgetScreen } from '@/modules/widget/types';
import { CONTACT_SESSION_KEY } from '@/modules/widget/constants';

import { Id } from '@workspace/backend/_generated/dataModel';

// Basic widget state atoms
export const screenAtom = atom<WidgetScreen>('loading');
export const organizationIdAtom = atom<string | null>(null);
export const contactSessionIdAtomFamily = atomFamily(
	(organizationId: string) => {
		return atomWithStorage<Id<'contactSession'> | null>(
			`${CONTACT_SESSION_KEY}_${organizationId}`,
			null
		);
	}
);
export const errorMessageAtom = atom<string | null>(null);
export const LoadingMessageAtom = atom<string | null>(null);
export const conversationIdAtom = atom<Id<'conversation'> | null>(null)
