import { useContext } from 'solid-js';
import { formContext } from '../FormContext';

export function useField(name: string) {
  const ctx = useContext(formContext);
  return {
    error: ctx.state.errors[name],
    value: ctx.state.values[name],
    touched: ctx.state.touched[name],
    handleChange: ctx.handleChange,
    handleBlur: ctx.handleBlur,
  };
}
