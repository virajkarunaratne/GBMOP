import React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, icon, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-900 mb-2">
          {label}
          {props.required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-2 border border-neutral-300 rounded-lg',
            'focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent',
            'placeholder:text-neutral-500 text-neutral-900',
            'disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed',
            error && 'border-danger focus:ring-danger',
            icon && 'pl-10',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-danger mt-1">{error}</p>}
      {hint && !error && <p className="text-sm text-neutral-600 mt-1">{hint}</p>}
    </div>
  )
)

Input.displayName = 'Input'

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, error, hint, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-900 mb-2">
          {label}
          {props.required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        className={cn(
          'w-full px-4 py-2 border border-neutral-300 rounded-lg',
          'focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent',
          'placeholder:text-neutral-500 text-neutral-900',
          'disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed',
          'resize-vertical min-h-24',
          error && 'border-danger focus:ring-danger',
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-danger mt-1">{error}</p>}
      {hint && !error && <p className="text-sm text-neutral-600 mt-1">{hint}</p>}
    </div>
  )
)

TextArea.displayName = 'TextArea'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: Array<{ value: string; label: string }>
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, options, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-900 mb-2">
          {label}
          {props.required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          'w-full px-4 py-2 border border-neutral-300 rounded-lg',
          'focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent',
          'placeholder:text-neutral-500 text-neutral-900',
          'disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed',
          'appearance-none bg-white',
          error && 'border-danger focus:ring-danger',
          className
        )}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-danger mt-1">{error}</p>}
      {hint && !error && <p className="text-sm text-neutral-600 mt-1">{hint}</p>}
    </div>
  )
)

Select.displayName = 'Select'

interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => (
    <div className="flex items-center gap-3">
      <input
        ref={ref}
        type="checkbox"
        className={cn(
          'w-4 h-4 border border-neutral-300 rounded',
          'focus:outline-none focus:ring-2 focus:ring-primary-600',
          'text-primary-600 cursor-pointer',
          'disabled:bg-neutral-100 disabled:cursor-not-allowed',
          className
        )}
        {...props}
      />
      {label && (
        <label className="text-sm text-neutral-900 cursor-pointer">
          {label}
        </label>
      )}
    </div>
  )
)

Checkbox.displayName = 'Checkbox'

interface FormFieldProps {
  error?: string
  children: React.ReactNode
}

export const FormField: React.FC<FormFieldProps> = ({ error, children }) => (
  <div className="mb-4">{children}</div>
)

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  title?: string
  subtitle?: string
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
}

export const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, title, subtitle, children, onSubmit, ...props }, ref) => (
    <form
      ref={ref}
      onSubmit={onSubmit}
      className={cn('space-y-4', className)}
      {...props}
    >
      {title && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">{title}</h2>
          {subtitle && (
            <p className="text-neutral-600 mt-1">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </form>
  )
)

Form.displayName = 'Form'
