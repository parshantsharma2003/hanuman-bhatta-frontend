'use client';

import React from 'react';
import { AnalyticsMetricType, trackMetric } from '@/lib/analytics';

type BaseProps = {
  metricType: AnalyticsMetricType;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
};

type AnchorProps = BaseProps & {
  as?: 'a';
  href: string;
  target?: string;
  rel?: string;
};

type ButtonProps = BaseProps & {
  as: 'button';
  href?: never;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
};

type TrackableButtonProps = AnchorProps | ButtonProps;

export default function TrackableButton(props: TrackableButtonProps) {
  const {
    metricType,
    children,
    className,
    ariaLabel,
    onClick,
  } = props;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    trackMetric(metricType);
    onClick?.(event);
  };

  if (props.as === 'button') {
    return (
      <button
        type={props.type || 'button'}
        disabled={props.disabled}
        onClick={handleClick}
        className={className}
        aria-label={ariaLabel}
      >
        {children}
      </button>
    );
  }

  return (
    <a
      href={props.href}
      target={props.target}
      rel={props.rel}
      onClick={handleClick}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
