# DateRangeWrapper

Primitive for setting up two Datepickers to assemble a date range structure. Dates outside of the range (before the start date or after the end date) are excluded. Makes use of render props and prop getters to allow for variable layouts of the components within.

## With Final-Form Fields
While it can certainly be used with vanilla Datepickers, a common use-case of FOLIO forms will be final-form.
Used with Final-Form, we need to apply a custom value getter. Here's what that code looks like.
```
  import { DateRangeWrapper, Datepicker } from '@folio/stripes/components'

    // with final-form, form values are stored in `values` object
    const startGetter = (values) => {
      return values.rangeStartDate;
    };

    const endGetter = (values) => {
      return values.rangeEndDate;
    };

    return (
      <form>
        <DateRangeWrapper
          startValueGetter={startGetter}
          endValueGetter={endGetter}
        >
          {({
            endDateExclude,
            startDateExclude,
          }) => (
            <div>
              <Field
                name="rangeStartDate"
                label="Start date"
                component={Datepicker}
                exclude={startDateExclude}
              />
              <Field
                name="rangeEndDate"
                label="End date"
                component={Datepicker}
                exclude={endDateExclude}
              />
            </div>
            )
          }
        </DateRangeWrapper>
```

## Common Props
Name | type | description | default | required
--- | --- | --- | --- | ---
`children` | function | should be set up to accept render props passed in from the wrapper |  |

## Behavior override props
Name | type | description | default | required
--- | --- | --- | --- | ---
`endValueGetter` | function(<...any>) | Used in the internal `startDateExclude` method to get a date value from the form state. | `(value) => value` |
`startValueGetter` | function(param <...any>) | Similar to `endValueGetter`. Applied to the start date field. | `(value) => value` |
`endExcluder` | function(day <any>) | Used to substitute default excluder logic. Internally, `<DateRangeWrapper>` uses `moment.isBefore()` to exclude dates that come before its internal `startDate` so these will not be available in the picker. | |
`startExcluder` | function(day <any>) | Similar to `startExcluder`. Uses `moment.isAfter()` for its test. | |

## Child function

The child function allows for its returned JSX to be of any shape to suite the requirements of the use-case. Perhaps you'd want labels to be rendered in a horizontal/inline orientation or even the inputs themselves to be arranged horizontally in a single row. This pattern allows for those aspects to be kept declarative, allowing you to insert the passed render-props wherever they need to go.
```
// AAC = Any Applicable Component
<Component>{({rProp}) => <AAC foo={rProp} ></AAC> }</Component>
```

### Render-props for the child function
Name | type | description
--- | --- | ---
`endDateExclude` | function(day) | function for determining whether a day rendered by the calendar should be excluded or not. If the function returns `true`, the day will be excluded from picking (un-clickable, with appropriate styles assigned). This uses a default function, but can be overridden by using the `endExcluder` prop
`startDateExclude` | function(day) | similar to `endDateExclude`, but applied to the start date DatePicker.

## Behavior overrides
If the start and end date field names shouldn't be `startEnd` or `endDate`, you should supply your own `startValueGetter` and `endValueGetter` functions to select correct values from final form's state. This helps the component be flexible for any scenario.
```
// our value-getter to suite our needs:
const startDateGetter = (values) => values.customStartDateName;
const endDateGetter = (values) => values.customEndDateName;

// in render...
<DateRangeWrapper
  startValueGetter={startDateGetter}
  endValueGetter={endDateGetter}
>
// ...jsx continued
```

## Reference
For more information/examples of the patterns used in this component, see the following:

[Prop-Getters](https://blog.kentcdodds.com/how-to-give-rendering-control-to-users-with-prop-getters-549eaef76acf)
