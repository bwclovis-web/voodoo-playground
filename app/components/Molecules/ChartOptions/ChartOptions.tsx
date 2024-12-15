import { getFormProps, useForm } from "@conform-to/react"
import { getZodConstraint, parseWithZod } from "@conform-to/zod"
import { useActionData, useFetcher } from "@remix-run/react"
import { VariantProps } from "class-variance-authority"
import { FC, HTMLProps, useContext, useRef } from "react"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"
import { HoneypotInputs } from "remix-utils/honeypot/react"

import { Button } from "~/components/Atoms/Button/Button"
import Input from "~/components/Atoms/Input/Input"
import Select from "~/components/Atoms/Select/Select"
import { chartTypeOptions } from "~/data/chartOptions"
import ChartContext from "~/providers/chartCtx"
import { VerifyNoteSchema } from "~/routes/auth+/Forms/validationUtils"
import { styleMerge } from "~/utils/styleUtils"

import { chartOptionsVariants } from "./chartOptions-variants"

interface ChartOptionsProps extends HTMLProps<HTMLDivElement>,
  VariantProps<typeof chartOptionsVariants> { }

const ChartOptions: FC<ChartOptionsProps> = ({ className, ...props }) => {
  const { setChartType } = useContext(ChartContext)
  const fetcher = useFetcher()
  const inputRef = useRef<HTMLInputElement>(null)
  const actionData = useActionData<{ errors?: { [key: string]: string } }>()
  const handleSelect = evt => {
    setChartType(evt.target.value)
  }

  const [chartOptionsForm, { title }] = useForm({
    constraint: getZodConstraint(VerifyNoteSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: VerifyNoteSchema })
    },
    shouldRevalidate: 'onInput',
    shouldValidate: 'onBlur'
  })

  return (
    <div
      className={
        styleMerge(chartOptionsVariants({ className }))
      }
      data-cy="ChartOptions"
      {...props}
    >
      <Select name="chartType" options={chartTypeOptions} label="Chart Type" onChange={handleSelect} />
      <details className="my-2">
        <summary className="cursor-pointer text-gray-600">Chart Options</summary>
        <fetcher.Form method="POST" {...getFormProps(chartOptionsForm)}>
          <AuthenticityTokenInput />
          <HoneypotInputs />
          <Input action={title} inputType={"text"} inputRef={inputRef} inputId="chartTitle" actionData={actionData} />
          <Button type="submit" className="my-4">
            Update
          </Button>
        </fetcher.Form>
      </details>
    </div>
  )
}
export default ChartOptions  
