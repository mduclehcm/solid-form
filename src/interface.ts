import { State } from 'solid-js';

export type TFormInputEvent = Event & {
  currentTarget: HTMLInputElement;
  target: HTMLInputElement;
};
type _InputValue = string | number | boolean;
export type TInputValue = _InputValue | _InputValue[];

type TFormFieldMap<T, V> = Partial<
  {
    [key in keyof T]: V;
  }
>;

export const FormError = Symbol('FormError');

export type TFormErrorState<T> = TFormFieldMap<T, string> & {
  [FormError]?: string;
};
export type TFieldsTouchedState<T> = TFormFieldMap<T, boolean>;

export interface IFormOptions<T> {
  initValues: T;
  initTouched?: TFieldsTouchedState<T>;
  initErrors?: TFormErrorState<T>;

  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validate?: (values: T) => TFormErrorState<T>;

  handleSubmit?: (values: T, helpers: IFormHelper<T>) => void;
  handleReset?: () => void;
}

export interface IFormState<T> {
  isSubmiting: boolean;
  isValid: boolean;
  isValidating: boolean;
  errors: TFormErrorState<T>;
  touched: TFieldsTouchedState<T>;
  values: T;
}

export interface IFormHelper<T> {
  setFormError: (error: string) => void;
  setFieldError: (field: keyof T, error: string) => void;
  setSubmitting: (value: boolean) => void;
}

export interface IFormContext<T> {
  state: State<IFormState<T>>;
  handleSubmit?: (e: Event) => void;
  handleReset?: (e: Event) => void;
  handleChange?: (e: TFormInputEvent) => void;
  handleBlur?: (e: TFormInputEvent) => void;
}
