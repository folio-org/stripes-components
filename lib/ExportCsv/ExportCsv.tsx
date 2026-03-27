// @ts-nocheck
import React from "react";
import { FormattedMessage } from "react-intl";
import exportToCsv from "./exportToCsv";
import Button from "../Button";
type ExportCsvProps = {
  data?: Record<string, any>[];
  onlyFields?: string[] | Record<string, any>[];
};

class ExportCsv extends React.Component<ExportCsvProps> {
  render() {
    const { data, onlyFields } = this.props;
    const options = { onlyFields };
    return (
      <Button
        data-test-export-csv
        onClick={() => {
          exportToCsv(data, options);
        }}
      >
        <FormattedMessage id="stripes-components.exportToCsv" />
      </Button>
    );
  }
}

export default ExportCsv;
