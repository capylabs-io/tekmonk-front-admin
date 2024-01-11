import classNames from 'classnames';
import React, { ReactNode } from 'react';

type Props = {
  value: string;
  type: string;
  customInputClassNames?: string;
  customClassNames?: string;
  error?: string;
  placeHolder?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  iconElement?: ReactNode;
};
const BASE_CLASS =
  'flex w-full items-center rounded-lg border border-grey-300 px-4 py-3 bg-grey-50 outline-none';
export const InputWithIcon: React.FC<Props> = ({
  value,
  error,
  type = 'text',
  onChange,
  placeHolder,
  onBlur,
  customInputClassNames,
  iconElement, 
  customClassNames
}) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    onChange!(newVal);
  };
  const handleOnBlur = () => {
    onBlur && onBlur();
  };
  return (
    <>
      <div
        className={classNames(
          BASE_CLASS,
          error && 'border-red-500 focus:border-red-500 text-sm focus:border-2',
          value &&
          !error &&
          'border-green-300 focus:border-green-300 text-sm focus:border-2',
          customClassNames
        )}
      >
        {iconElement && <div className="mr-5 flex gap-2">{iconElement}</div>}
        <div className="flex w-full items-center text-base font-bold">
          <input
            type={type}
            lang="en-US"
            className={classNames("mr-2 w-full text-lg font-normal outline-none bg-grey-50", customInputClassNames)}
            placeholder={placeHolder || ''}
            value={value}
            onChange={handleOnChange}
            onBlur={handleOnBlur}
          />
        </div>
      </div>
      {error && <p className="mt-2 self-start text-sm text-red-600">{error}</p>}
    </>
  );
};
