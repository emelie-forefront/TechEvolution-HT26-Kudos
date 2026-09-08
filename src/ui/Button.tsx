import type { ButtonHTMLAttributes } from 'react'
import './Button.css'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'quiet'
  size?: 'small' | 'medium'
  isLoading?: boolean
}

export function Button({
  children,
  className = '',
  disabled,
  isLoading = false,
  size = 'medium',
  variant = 'primary',
  ...props
}: ButtonProps) {
  const classes = `button button--${variant} button--${size} ${className}`.trim()

  return (
    <button
      {...props}
      className={classes}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
    >
      <span className={isLoading ? 'button__content button__content--hidden' : 'button__content'}>
        {children}
      </span>
      {isLoading && <span className="button__loading">Sending...</span>}
    </button>
  )
}