import { FieldMetadata, getInputProps } from "@conform-to/react"
import { VariantProps } from "class-variance-authority"
import { FC, HTMLProps } from "react"
import { useTranslation } from "react-i18next"

import { styleMerge } from "~/utils/styleUtils"

import { inputVariants } from "./input-variants"

interface InputProps extends Omit<HTMLProps<HTMLInputElement>, 'action'>,
  VariantProps<typeof inputVariants> {
  inputType: 'email' | 'password' | 'text'
  action: FieldMetadata<unknown>
  actionData?: {
    errors?: { [key: string]: string }
  }
}

const Input: FC<InputProps> = ({
  inputType,
  className,
  ref,
  defaultValue,
  actionData,
  action,
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
        htmlFor={inputType}
        className="block text-sm font-medium text-gray-700"
      >
        {t(`global.formLabels.${inputType}`)}
      </label>
      <div className="mt-1">
        <input
          ref={ref}
          required
          defaultValue={defaultValue ? defaultValue : ''}
          aria-invalid={actionData?.errors?.action ? true : undefined}
          aria-describedby={`${inputType}-error`}
          className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
          {...getInputProps(action, { ariaAttributes: true, type: inputType })}
        />
        {actionData?.errors?.action ? (
          <div className="pt-1 text-red-700" id={`${inputType}-error`}>
            {actionData.errors.action}
          </div>
        ) : null}
      </div>
    </div>
  )
}
export default Input


