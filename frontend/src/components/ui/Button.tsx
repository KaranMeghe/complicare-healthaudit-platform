/** @format */

import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

const Button = ({ isLoading, children, ...props }: ButtonProps) => {
  return (
    <button {...props} disabled={isLoading || props.disabled}>
      {isLoading ? 'Loading....' : children}
    </button>
  );
};

export default Button;
