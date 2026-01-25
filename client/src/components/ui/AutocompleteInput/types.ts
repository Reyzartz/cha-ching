export interface AutocompleteOption {
  id: number;
  label: string;
  [key: string]: any;
}

export interface AutocompleteInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSelectOption?: (option: AutocompleteOption) => void;
  options: AutocompleteOption[];
  loading?: boolean;
  error?: string;
  helperText?: string;
  debounceDelay?: number;
  maxVisibleOptions?: number;
}
