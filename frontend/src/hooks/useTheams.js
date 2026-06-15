import { useContext } from 'react';
import { TheamContext } from '../context/TheamContext';

export const useTheams = () => {
  const context = useContext(TheamContext);

  if (!context) {
    throw new Error('useTheams must be used inside TheamProvider');
  }

  return context;
};
