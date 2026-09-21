export interface EntityFieldConfig {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'select' | 'checkbox';
  options?: { value: string; label: string }[];
}

export interface EntityConfig {
  title: string;
  apiPath: string;
  idField: string;
  columns: { key: string; label: string }[];
  fields: EntityFieldConfig[];
}
