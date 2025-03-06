import * as React from "react";
import {
  Controller,
  useFormContext,
  useController,
  get,
} from "react-hook-form";
export const TextFieldCustom = ({
  name,
  inputField,
  ...props
}: {
  name: string;
  inputField: React.ReactElement;
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      {...props}
      control={control}
      name={name}
      render={({ field }) => inputField}
    />
  );
};
