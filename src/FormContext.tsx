import { createContext } from 'solid-js';
import { IFormContext } from './interface';

export const formContext = createContext<IFormContext<any>>();
