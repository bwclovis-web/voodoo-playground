import { VariantProps } from "class-variance-authority"
import { FC, HTMLProps } from "react"

import { styleMerge } from "~/utils/styleUtils"

import { selectVariants } from "./select-variants"

interface SelectProps extends Omit<HTMLProps<HTMLDivElement>, 'onChange'>,
  VariantProps<typeof selectVariants> {
  options: { value: string, label: string }[]
  label?: string
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
}

const Select: FC<SelectProps> = ({
  className, name, options, label, onChange, ...props }) => (
  <div
    data-cy="Select"
    className="relative"
    {...props}
  >
    {label && <label className="text-gray-600 block pb-2" htmlFor={name}>{label}</label>}
    <select
      name={name}
      onChange={onChange}
      className={
        styleMerge(selectVariants({ className }))
      }>
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>
)
export default Select  
