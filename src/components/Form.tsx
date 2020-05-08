import { IFormOptions, IFormContext } from '../interface';
import { useForm } from '../hooks/useForm';
import { formContext } from '../FormContext';

type FormProps<T> = IFormOptions<T> & {
  children?: (IFormContext) => any;
};

export function Form<T>({ children, ...formOptions }: FormProps<T>) {
  const sform = useForm(formOptions);

  return (
    <formContext.Provider value={sform}>{children(sform)}</formContext.Provider>
  );
}
