import { toast } from 'sonner';
import { useAction } from 'convex/react';
import { useEffect, useState } from 'react';

import { api } from '@workspace/backend/_generated/api';

type PhoneNumbers = typeof api.private.vapi.getPhoneNumbers._returnType;
type Assistant = typeof api.private.vapi.getAssistants._returnType;

export const useVapiAssistant = (): {
	data: Assistant;
	isLoading: boolean;
	error: Error | null;
} => {
	const [data, setData] = useState<Assistant>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const getAssistant = useAction(api.private.vapi.getAssistants);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(false);
				const result = await getAssistant();
				setData(result);
				setError(null);
			} catch (error) {
				setError(error as Error);
				toast.error('Failed to fetch assistants');
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [getAssistant]);

	return {
		data,
		isLoading,
		error,
	};
};

export const useVapiPhoneNumbers = (): { 
  data: PhoneNumbers;
  isLoading: boolean;
  error: Error | null
} => {
	const [data, setData] = useState<PhoneNumbers>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const getPhoneNumbers = useAction(api.private.vapi.getPhoneNumbers);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(false);
				const result = await getPhoneNumbers();
				setData(result);
				setError(null);
			} catch (error) {
				setError(error as Error);
				toast.error('Failed to fetch phone numbers');
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [getPhoneNumbers]);

	return {
		data,
		isLoading,
		error,
	};
};
