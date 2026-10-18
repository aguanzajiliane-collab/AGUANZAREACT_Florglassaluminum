import { useRef, useState } from 'react';
import { requestError, submissionLock, validationErrors } from '../utils/formValidation';

export function useFormFeedback() {
  const [fields, setFields] = useState({});
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(false);
  const lock = useRef(submissionLock());
  const fail = exception => setError(requestError(exception));
  const run = async (action, errors = {}, success = '') => {
    if (!lock.current.acquire()) return false;
    setFields(errors); setError(''); setMessage('');
    if (Object.keys(errors).length) {
      setError('Please correct the highlighted fields.'); lock.current.release();
      requestAnimationFrame(() => document.querySelector('[aria-invalid="true"]')?.focus());
      return false;
    }
    setPending(true);
    try { await action(); setMessage(success); return true; }
    catch (exception) {
      setFields(validationErrors(exception)); setError(requestError(exception));
      requestAnimationFrame(() => document.querySelector('[aria-invalid="true"]')?.focus());
      return false;
    } finally { setPending(false); lock.current.release(); }
  };
  return { fields, error, message, pending, run, fail, setMessage };
}
