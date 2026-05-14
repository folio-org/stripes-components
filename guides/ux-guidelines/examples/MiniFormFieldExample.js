import React, { forwardRef } from 'react';
import TextField from '../../../lib/TextField';
import formField from '../../../lib/FormField';

const FieldInput = forwardRef(({ warning, ...props }, ref) => {
  return (
    <div>
      <TextField
        {...props}
        ref={ref}
      />
      {warning ? <div>{warning}</div> : null}
    </div>
  );
});

const WrappedFieldInput = formField(
  FieldInput,
  ({ meta }) => ({
    warning: meta?.touched ? meta?.error : '',
  }),
);

export default function MiniFormFieldExample() {
  return (
    <WrappedFieldInput
      label="Loan period"
      input={{
        name: 'loanPeriod',
        value: '14 days',
        onChange: () => { },
      }}
      meta={{ touched: true, error: 'Use a numeric duration when possible.' }}
    />
  );
}
