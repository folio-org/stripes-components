# DateRangeWrapper

Primitive for setting up two Datepickers to assemble a date range structure. Dates outside of the range (before the start date or after the end date) are excluded. Makes use of render props and prop getters to allow for variable layouts of the components within.

## With Redux-form Fields
While it can certainly be used with vanilla Datepickers, a common use-case of FOLIO forms will be redux-form.
Used with Redux-form, we need to apply a custom value getter. Here's what that code looks like.
```
  import { DateRangeWrapper, Datepicker } from '@folio/stripes/components'

    // with redux-form, best value comes in the 2nd param...
    const getter = (e, value) => {
      return value;
    };

    // bring in redux-form's initialValues to get initial dates, if there are any.
    const {
      initialValues
    } = this.props;

    return (
      <form>
        <DateRangeWrapper
          initialStartDate={initialValues.rangeStartDate}
          initialEndDate={initialValues.rangeEndDate}
          startValueGetter={getter}
          endValueGetter={getter}
        >
          {({
            getStartInputProps,
            getEndInputProps,
            endDateExclude,
            startDateExclude,
          }) => (
            <div>
              <Field
                name="rangeStartDate"
                label="Start date"
                component={Datepicker}
                exclude={startDateExclude}
                {...getStartInputProps()}
              />
              <Field
                name="rangeEndDate"
                label="End date"
                component={Datepicker}
                exclude={endDateExclude}
                {...getEndInputProps()}
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
`endValueGetter` | function(<...any>) | Used in the internal onChange handler to get a date value from the 'end' Datepicker. | `(value) => value` |
`startValueGetter` | function(param <...any>) | Similar to `endValueGetter`. Applied to the start date field. | `(value) => value` |
`endExcluder` | function(day <any>) | Used to substitute default excluder logic. Internally, `<DateRangeWrapper>` uses `moment.isBefore()` to exclude dates that come before its internal `startDate` so these will not be available in the picker. | |
`startExcluder` | function(day <any>) | Similar to `startExcluder`. Uses `moment.isAfter()` for its test. | |

## Child function

The child function allows for its returned JSX to be of any shape to suite the requirements of the use-case. Perhaps you'd want labels to be rendered in a horizontal/inline orientation or even the inputs themselves to be arranged horizontally in a single row. This pattern allows for those aspects to be kept declarative, allowing you to insert the passed render-props wherever they need to go.
```
// AAC = Any Applicable Component
<Component>{({rProp}) => <AAC foo={rProp} ></AAC> }</Component>
```

## Prop-getter function

Prop-getter functions return an object of bundled props that can be easily applied to a component via spread attributes. For example: `<Component {...propGetter()}>`. `<DateRangeWrapper>`'s prop-getters accept a `props` object. The keys of that object are composed in with the internally supplied props/handlers. If you pass an `onChange` handler to the prop-getter function, it will be called **before** the `<DateRangeWrapper>`'s internal onChange handler.

### Render-props for the child function
Name | type | description
--- | --- | ---
`endDateExclude` | function(day) | function for determining whether a day rendered by the calendar should be excluded or not. If the function returns `true`, the day will be excluded from picking (un-clickable, with appropriate styles assigned). This uses a default function, but can be overridden by using the `endExcluder` prop
`startDateExclude` | function(day) | similar to `endDateExclude`, but applied to the start date DatePicker.

## Behavior overrides
If the internal excluder functions or value getters don't work for some reason, you can supply your own function to take care of the task. This helps the component be flexible for any scenario. Internally, the Wrapper simply stores the value parameter from onChange in its state, but this parameter might be an event where you'd want `e.target.value` to be stored instead. So you can use the `end` and `startValueGetter` props like so:
```
// our value-getter to suite our needs:
const getter = (e) => e.target.value;

// in render...
<DateRangeWrapper
  startValueGetter={getter}
  endValueGetter={getter}
>
// ...jsx continued
```

## Reference
For more information/examples of the patterns used in this component, see the following:

[Prop-Getters](https://blog.kentcdodds.com/how-to-give-rendering-control-to-users-with-prop-getters-549eaef76acf)
