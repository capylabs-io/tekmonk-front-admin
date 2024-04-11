"use client"
import React from 'react'
import { InputWithIcon } from '../common/InputWithIcon'
import { Search } from 'lucide-react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/common/Button"
import { Checkbox } from "@/components/common/Checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/common/Form"
const items = [
  {
    id: "a",
    label: "Student A",
  },
  {
    id: "b",
    label: "Student B",
  },
  {
    id: "c",
    label: "Student C",
  },
  {
    id: "d",
    label: "Student D",
  },
  {
    id: "e",
    label: "Student E",
  },
  {
    id: "f",
    label: "Student F",
  },
] as const

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
})

export const AddStudentModalForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: ["recents", "home"],
    },
  })
  function onSubmit(data: z.infer<typeof FormSchema>) {
  }
  const listStudent = ['Nguyễn Văn A', 'Nguyễn Văn B', 'Nguyễn Văn C', 'Nguyễn Văn D']
  return (
    <div className='px-6'>
      <InputWithIcon
        type="text"
        value=""
        customClassNames="h-[40px]"
        customInputClassNames="text-sm"
        placeHolder="Tìm tên học viên"
        iconElement={<Search size={16} />}
      />
      <div className='mt-4 rounded-lg border border-grey-300 px-4 py-3'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
            <FormField
              control={form.control}
              name="items"
              render={() => (
                <FormItem>
                  {items.map((item, index) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="items"
                      render={({ field }) => {
                        return (
                          <>
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start justify-between"
                            >
                              <FormLabel>
                                <div className="font-normal text-primary-950 text-sm"> {item.label}</div>
                                <div className="font-normal text-gray-500 text-xs">admin@gmail.com</div>
                              </FormLabel>
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, item.id])
                                      : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      )
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                           {index !== items.length-1 && <hr className="bg-gray-200" />}
                          </>
                        )
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <Button>Submit</Button> */}
          </form>
        </Form>
      </div>
    </div>
  )
}


