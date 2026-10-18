export function validationErrors(error) {
  const fields = error.response?.status === 422 ? error.response.data?.errors || {} : {};
  return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, Array.isArray(value) ? value.join(' ') : String(value)]));
}
export function requestError(error) {
  if (!error.response) return 'Unable to connect. Check your connection and try again.';
  return error.response.data?.message || 'The request failed. Please try again.';
}
export function validateForm(kind, form) {
  const errors = {};
  const text = (key, label, max, required = true) => {
    const value = String(form[key] ?? '');
    if (required && !value.trim()) errors[key] = `${label} is required.`;
    else if (max && [...value].length > max) errors[key] = `${label} must not exceed ${max} characters.`;
  };
  const number = (key, label, required = false) => {
    const value = form[key];
    if (value == null || value === '') { if (required) errors[key] = `${label} is required.`; }
    else if (!Number.isFinite(Number(value)) || Number(value) < 0) errors[key] = `${label} must be a non-negative number.`;
  };
  if (kind === 'login' || kind === 'register') {
    text('email', 'Email', kind === 'register' ? 255 : null);
    if (!errors.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address.';
    text('password', 'Password');
    if (kind === 'register') {
      text('name', 'Full name', 100);
      if (!errors.password && [...form.password].length < 8) errors.password = 'Password must contain at least 8 characters.';
      if (form.password !== form.password_confirmation || !form.password_confirmation) errors.password_confirmation = 'Passwords must match.';
    }
  }
  if (kind === 'category') { text('name', 'Category name', 100); text('description', 'Description', 2000, false); }
  if (kind === 'product') {
    text('category_id', 'Category'); text('name', 'Service name', 150); text('description', 'Description', 5000); text('type', 'Type', 100);
    text('image', 'Image path', 2048, false); number('estimated_price', 'Estimated starting price');
  }
  if (kind === 'quotation') {
    text('project_title', 'Project title', 150); text('project_location', 'Project location', 255); text('project_description', 'Project description', 5000);
    number('estimated_budget', 'Budget');
    if (form.preferred_date) {
      const now = new Date(); const today = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
      const date = new Date(form.preferred_date+'T12:00:00');
      if (!/^\d{4}-\d{2}-\d{2}$/.test(form.preferred_date) || Number.isNaN(date.getTime()) || form.preferred_date < today) errors.preferred_date = 'Choose today or a future date.';
    }
    if (!form.items?.length) errors.items = 'Select at least one service.';
    const seen = new Map();
    (form.items || []).forEach((item, index) => {
      const key = `items.${index}.`;
      if (!item.product_id) errors[key+'product_id'] = 'Select a service.';
      else if (seen.has(String(item.product_id))) {
        errors[key+'product_id'] = 'Select each service only once.';
        errors[`items.${seen.get(String(item.product_id))}.product_id`] = 'Select each service only once.';
      } else seen.set(String(item.product_id), index);
      if (!item.quantity || !Number.isInteger(Number(item.quantity)) || Number(item.quantity) < 1 || Number(item.quantity) > 1000) errors[key+'quantity'] = 'Quantity must be a whole number from 1 to 1000.';
      if ([...(item.specifications || '')].length > 2000) errors[key+'specifications'] = 'Specifications must not exceed 2000 characters.';
    });
  }
  if (kind === 'status' && form.status === 'quoted') number('quotation_amount', 'Quotation amount', true);
  return errors;
}
export function submissionLock() {
  let busy = false;
  return { acquire() { if (busy) return false; busy = true; return true; }, release() { busy = false; } };
}
