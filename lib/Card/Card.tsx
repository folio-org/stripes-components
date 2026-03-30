// @ts-nocheck
import React from "react";
import className from "classnames";

import omitProps from "../../util/omitProps";

import css from "./Card.css";
import DefaultCardHeader from "./headers/DefaultCardHeader";
import StripesOverlayWrapper from "../../util/StripesOverlayWrapper";
type CardProps = {
  bodyClass?: string;
  cardClass?: string;
  cardStyle?: "default" | "negative" | "positive";
  children: React.ReactNode | React.ReactNode[];
  headerClass?: string;
  headerComponent?: React.ReactNode | string | ((...args: any[]) => any);
  headerEnd?: React.ReactNode | React.ReactNode[];
  headerProps?: Record<string, any>;
  headerStart: React.ReactNode | React.ReactNode[];
  marginBottom0?: boolean;
  roundedBorder?: boolean;
};

export default class Card extends React.Component<CardProps> {
  static defaultProps = {
    cardStyle: "default",
    headerComponent: DefaultCardHeader,
  };

  getCardStyle = () => {
    return className(
      css.card,
      css[this.props.cardStyle],
      { [`${css.marginBottom0}`]: this.props.marginBottom0 },
      { [`${css.roundedBorder}`]: this.props.roundedBorder },
      this.props.cardClass,
    );
  };

  render() {
    const {
      bodyClass,
      headerComponent: HeaderComponent,
      children,
    } = this.props;

    const customProps = omitProps(this.props, [
      "bodyClass",
      "cardClass",
      "cardStyle",
      "children",
      "headerClass",
      "headerComponent",
      "headerEnd",
      "headerProps",
      "headerStart",
      "marginBottom0",
      "roundedBorder",
    ]);

    return (
      <StripesOverlayWrapper>
        <div className={this.getCardStyle()} {...customProps}>
          <HeaderComponent {...this.props} />
          <div data-test-card-body className={`${css.body} ${bodyClass || ""}`}>
            {children}
          </div>
        </div>
      </StripesOverlayWrapper>
    );
  }
}
