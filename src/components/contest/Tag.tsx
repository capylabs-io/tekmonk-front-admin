"use client";

import classNames from "classnames";

type Props = {
  text: string;
  onClick?: () => void;
  className?: string;
  type: "primary" | "secondary";
  size: "x-small" | "small" | "medium";
};

const BASE_CLASS =
  "font-bold rounded-2xl px-2 py-1 uppercase inline-block w-fit";
// Tag component for displaying tags with primary is green and secondary is red
export default function Tag({ text, onClick, className, size, type }: Props) {
  const handleOnClick = () => {
    onClick && onClick();
  };

  const typeTag = (() => {
    switch (type) {
      case "primary":
        return "bg-green-300";
      case "secondary":
        return "bg-primary-100";
    }
  })();

  const sizeTag = (() => {
    switch (size) {
      case "x-small":
        return "text-bodyXs";
      case "small":
        return "text-bodySm";
      case "medium":
        return "text-sm";
    }
  })();

  const classes = classNames([BASE_CLASS, typeTag, sizeTag, className]);

  return (
    <span className={classes} onClick={handleOnClick}>
      {text}
    </span>
  );
}
