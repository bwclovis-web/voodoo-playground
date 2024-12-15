import { FieldMetadata, getInputProps } from "@conform-to/react"
import { VariantProps } from "class-variance-authority"
import { FC, HTMLProps } from "react"
import { useTranslation } from "react-i18next"

import { styleMerge } from "~/utils/styleUtils"

import { inputVariants } from "./input-variants"

interface InputProps extends Omit<HTMLProps<HTMLInputElement>, 'action'>,
  VariantProps<typeof inputVariants> {
  inputType: 'email' | 'password' | 'text'
  inputId?: string,
  inputRef: React.RefObject<HTMLInputElement>
  action: FieldMetadata<unknown>
  actionData?: {
    errors?: { [key: string]: string }
  }
}

const Input: FC<InputProps> = ({
  inputType,
  inputId = inputType,
  className,
  inputRef,
  defaultValue,
  actionData,
  action,
  onChange,
  ...props
}) => {
  const { t } = useTranslation()
  return (
    <div
      className={
        styleMerge(inputVariants({ className }))
      }
      data-cy="Input"
      {...props}
    >
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700"
      >
        {t(`global.formLabels.${inputId}`)}
      </label>
      <div className="mt-1">
        <input
          ref={inputRef}
          required
          onChange={onChange}
          defaultValue={defaultValue ? defaultValue : ''}
          aria-invalid={actionData?.errors?.action ? true : undefined}
          aria-describedby={`${inputId}-error`}
          className="w-full rounded-sm border border-gray-500 px-2 py-1 text-lg"
          {...getInputProps(action, { ariaAttributes: true, type: inputType })}
        />
        {action.errors && (
          <span className="mb-2 text-sm text-destructive dark:text-destructive-foreground text-red-600 uppercase font-medium" id={`${inputId}-error`}>
            {action.errors.join(' ')}
          </span>
        )}
      </div>
    </div>
  )
}
export default Input
