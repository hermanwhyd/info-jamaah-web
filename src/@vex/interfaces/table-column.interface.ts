export interface TableColumn<T> {
  label: string;
  property: keyof T | string;
  type: 'icon' | 'text' | 'image' | 'badge' | 'progress' | 'checkbox' | 'button' | 'date' | 'status' | 'currency' | 'number' | 'label' | 'object' | 'summary' | 'other';
  visible?: boolean;
  cssClasses?: string[];
}
