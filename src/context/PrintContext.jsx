import { createContext, useContext, useEffect, useState } from 'react';
import PrintReceipt from '../components/PrintReceipt';

const PrintContext = createContext(null);

export function PrintProvider({ children }) {
  const [job, setJob] = useState(null);

  useEffect(() => {
    if (!job) return undefined;
    const timer = setTimeout(() => window.print(), 100);
    const handleAfterPrint = () => setJob(null);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [job]);

  const printPayment = (payment, message) => setJob({ payment, message });

  return (
    <PrintContext.Provider value={{ printPayment }}>
      {children}
      {job && <PrintReceipt payment={job.payment} message={job.message} />}
    </PrintContext.Provider>
  );
}

export function usePrint() {
  const ctx = useContext(PrintContext);
  if (!ctx) throw new Error('usePrint doit être utilisé dans un <PrintProvider>');
  return ctx;
}
