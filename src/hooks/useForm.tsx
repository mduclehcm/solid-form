import { createState, $RAW } from 'solid-js';
import {
  IFormOptions,
  IFormState,
  TFormInputEvent,
  IFormContext,
  TFormErrorState,
  FormError,
  IFormHelper,
} from '../interface';
import { parseFormInputValue } from '../helpers/parseFormInputValue';

export function useForm<T>(options: IFormOptions<T>): IFormContext<T> {
  const [state, setState] = createState<IFormState<T>>({
    isSubmiting: false,
    isValid: true,
    isValidating: false,
    errors: options.initErrors || {},
    touched: options.initTouched || {},
    values: options.initValues,
  });

  async function validateForm() {
    setState({
      isValidating: true,
    });
    var { isValid, errors } = await runValidate(state[$RAW].values);
    setState({
      isValid,
      errors,
      isValidating: false,
    });
    return { isValid, errors };
  }

  async function runValidate(values: T) {
    let errors: TFormErrorState<T> = {};
    try {
      let validateResult = await options.validate(values);
      if (typeof validateResult === 'string') {
        errors[FormError] = validateResult;
      } else {
        errors = validateResult;
      }
    } catch (reason) {
      errors[FormError] = reason.message;
    }
    const isValid = !errors || Object.keys(errors).length === 0;
    return { isValid, errors };
  }

  const helpers: IFormHelper<T> = {
    setFormError: (error) => {
      // @ts-ignore
      setState('errors', FormError, error);
    },
    setFieldError: (field, error) => {
      // @ts-ignore
      setState('errors', field, error);
    },
    setSubmitting: (isSubmitting) => {
      setState('isSubmiting', isSubmitting);
    },
  };
  async function submitForm() {
    const values = state.values[$RAW] as T;
    setState({
      isSubmiting: true,
    });
    const isValid = !!options.validate ? (await validateForm()).isValid : true;
    setState('touched', (touched) => {
      Object.keys(state.values).forEach((key) => {
        touched[key] = true;
      });
    });

    if (!isValid) {
      setState({
        isSubmiting: false,
      });
      return;
    }
    options.handleSubmit(values, helpers);
  }

  function handleSubmit(e: Event) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    submitForm();
  }

  function handleReset() {}

  function handleChange(e: TFormInputEvent) {
    const target = e.target;
    const field = target.name ? target.name : target.id;
    const values = state[$RAW].values;

    if (!values.hasOwnProperty(field)) {
      return;
    }
    const currentValue = values[field];
    const parsedValue = parseFormInputValue(currentValue, target);

    // @ts-ignore
    setState('values', field, parsedValue);
    if (options.validateOnChange) {
      validateForm();
    }
  }

  function handleBlur(e: TFormInputEvent) {
    const target = e.target;
    const field = target.name ? target.name : target.id;
    if (!state.values.hasOwnProperty(field)) {
      return;
    }
    // @ts-ignore
    setState('touched', (touched) => {
      touched[field] = true;
    });
    if (options.validateOnBlur) {
      validateForm();
    }
  }

  return {
    state,
    handleSubmit,
    handleReset,
    handleChange,
    handleBlur,
  };
}
