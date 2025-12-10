import { UseFormReturn } from 'react-hook-form';

import type { widgetSettingsSchemaType } from '@/modules/customization/schema';
import {
	useVapiAssistant,
	useVapiPhoneNumbers,
} from '@/modules/plugins/hooks/use-vapi-data';
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
} from '@workspace/ui/components/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@workspace/ui/components/select';

interface VapiFormFieldsProps {
	form: UseFormReturn<widgetSettingsSchemaType>;
}

export const VapiFormField = ({ form }: VapiFormFieldsProps) => {
	const { data: assistant, isLoading: assistantLoading } = useVapiAssistant();
	const { data: phoneNumbers, isLoading: phoneNumbersLoading } =
		useVapiPhoneNumbers();

	return (
		<>
			<FormField
				control={form.control}
				name="vapiSettings.assistantId"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Voice Assistant</FormLabel>
						<Select
							disabled={assistantLoading || form.formState.isSubmitting}
							onValueChange={field.onChange}
							value={field.value}
						>
							<FormControl>
								<SelectTrigger>
									<SelectValue
										placeholder={
											assistantLoading
												? 'Loading assistants...'
												: 'Select an assistant'
										}
									/>
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value="none">None</SelectItem>
								{assistant.map((assistant) => (
									<SelectItem key={assistant.id} value={assistant.id}>
										{assistant.name || 'Unnamed Assistant'} -{' '}
										{assistant.model?.model || 'Unknown model'}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<FormDescription>
							The Vapi assistant to use for voice calls
						</FormDescription>
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="vapiSettings.phoneNumber"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Display Phone Number</FormLabel>
						<Select
							disabled={phoneNumbersLoading || form.formState.isSubmitting}
							onValueChange={field.onChange}
							value={field.value}
						>
							<FormControl>
								<SelectTrigger>
									<SelectValue
										placeholder={
											assistantLoading
												? 'Loading phones numbers...'
												: 'Select an phone number'
										}
									/>
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value="none">None</SelectItem>
								{phoneNumbers.map((phoneNumber) => (
									<SelectItem key={phoneNumber.id} value={phoneNumber.id}>
										{phoneNumber.name || 'Unnamed Assistant'} -{' '}
										{phoneNumber.number || 'Unknown model'}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
            <FormDescription>
              Phone number to display in widget
						</FormDescription>
					</FormItem>
				)}
			/>
		</>
	);
};
