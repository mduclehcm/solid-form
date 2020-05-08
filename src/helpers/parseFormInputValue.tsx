import { TInputValue } from '../interface';
import { getSelectedValues } from './getSelectedValues';
import { getValueForCheckbox } from './getValueForCheckbox';

export function parseFormInputValue(
  current: TInputValue,
  target: HTMLInputElement,
) {
  let parsedValue: TInputValue = target.value;
  if (/number|range/.test(target.type)) {
    parsedValue = parseFloat(target.value);
    if (isNaN(parsedValue)) {
      parsedValue = '';
    }
  } else if (/checkbox/.test(target.type)) {
    parsedValue = getValueForCheckbox(current, target.checked, target.value);
  } else if (!!target.multiple) {
    // @ts-ignore
    parsedValue = getSelectedValues(target.options);
  }
  return parsedValue;
}
