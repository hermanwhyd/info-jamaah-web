import { AdditionalField } from './additional-field.interface';
import { Subscription } from './subscription.interface';

export interface Notifier {
  id: number;
  name: string;
  description: string;
  isRepetition: boolean;
  reminderDays: string[];
  referable?: AdditionalField[];
  lastFiredAt?: Date;
  lastFiredStatus?: string;
  lastFiredError?: string;
  subscriptions: Subscription[];
}
