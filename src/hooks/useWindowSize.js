import { useState, useEffect } from 'react';

function useWindowSize() {
  // Inizializza con dimensioni predefinite
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    // Funzione per aggiornare lo stato
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    // Aggiungi event listener
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      
      // Chiama handleResize immediatamente per aggiornare i valori all'inizio
      handleResize();
      
      // Rimuovi event listener al cleanup
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []); // Array di dipendenze vuoto = esegui solo al mount e unmount
  
  return windowSize;
}

export default useWindowSize;
