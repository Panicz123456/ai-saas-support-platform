import { widgetSettingsSchema } from '@/modules/customization/schema';
import { z } from 'zod';

export type FormSchema = z.infer<typeof widgetSettingsSchema>;
