'use client';

import { LoaderIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useAction, useMutation } from 'convex/react';

import { api } from '@workspace/backend/_generated/api';
import { WidgetHeader } from '@/modules/widget/ui/components/widget-header';
import {
	contactSessionIdAtomFamily,
	errorMessageAtom,
	LoadingMessageAtom,
	organizationIdAtom,
	screenAtom,
} from '@/modules/widget/atoms/widget-atoms';

type InitStep = 'storage' | 'org' | 'session' | 'settings' | 'vapi' | 'done';

export const WidgetLoadingScreen = ({
	organizationId,
}: {
	organizationId: string | null;
}) => {
	const [step, setStep] = useState<InitStep>('org');
	const [sessionValid, setSessionValid] = useState(false);

	const loadingMessage = useAtomValue(LoadingMessageAtom);
	const setOrganizationId = useSetAtom(organizationIdAtom);
	const setLoadingMessage = useSetAtom(LoadingMessageAtom);
	const setErrorMessage = useSetAtom(errorMessageAtom);
	const setScreen = useSetAtom(screenAtom);

	const contactSessionId = useAtomValue(
		contactSessionIdAtomFamily(organizationId || '')
	);

	const validateOrganization = useAction(api.public.organization.validate);

	// Step 1: Validate organization
	useEffect(() => {
		if (step !== 'org') {
			return;
		}

		setLoadingMessage('Loading organization...');

		if (!organizationId) {
			setErrorMessage('Oraganization ID is required');
			setScreen('error');
			return;
		}

		setLoadingMessage('Verifying organization...');

		validateOrganization({ organizationId })
			.then((result) => {
				if (result.valid) {
					setOrganizationId(organizationId);
					setStep('session');
				} else {
					setErrorMessage(result.reason || 'Invalid configuration');
					setScreen('error');
				}
			})
			.catch(() => {
				setErrorMessage('Unable to verify organization');
				setScreen('error');
			});
	}, [
		step,
		organizationId,
		setScreen,
		setErrorMessage,
		setLoadingMessage,
		setOrganizationId,
		validateOrganization,
	]);

	// Step 2: Validate session (if its exist)
	const validateContactSession = useMutation(
		api.public.contactSessions.validate
	);
	useEffect(() => {
		if (step !== 'session') {
			return;
		}

		setLoadingMessage('Finding contact session ID...');

		if (!contactSessionId) {
			setSessionValid(false);
			setStep('done');
			return;
		}

		setLoadingMessage('Validationg Session...');

		validateContactSession({
			contactSessionId: contactSessionId
		})
			.then((result) => {
				setSessionValid(result.valid);
				setStep('done');
			})
			.catch(() => {
				setSessionValid(false);
				setStep('done');
			});
	}, [step, contactSessionId, setLoadingMessage, validateContactSession]);

	useEffect(() => { 
		if (step !== "done") { 
			return;
		}

		const hasValidSession = sessionValid && contactSessionId
		setScreen(hasValidSession ? "selection" : "auth")
	}, [step, setScreen, sessionValid, contactSessionId])
	
	return (
		<>
			<WidgetHeader>
				<div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
					<p className="text-3xl">Hi there! 👋</p>
					<p className="text-lg">Let&apos;s get you started</p>
				</div>
			</WidgetHeader>
			<div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4 text-muted-foreground">
				<LoaderIcon className="animate-spin" />
				<p className="text-sm">{loadingMessage || 'Loading...'}</p>
			</div>
		</>
	);
};
