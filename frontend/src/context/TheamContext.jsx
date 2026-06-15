import { createContext } from 'react';

export const THEAM_STORAGE_KEY = 'arenax-theam-mode';
export const THEAM_MODES = ['default', 'light', 'dark'];

export const TheamContext = createContext(null);
