import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/common/Select"
import { Input } from '../common/Input'

export const ClassesModalForm = () => {
    return (
        <div className='flex flex-col gap-y-3 px-8 mt-4'>
            <div className='grid grid-cols-5'>
                <div className='col-span-2 my-auto'>Cơ sở</div>
                <div className='col-span-3'>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">CSS</SelectItem>
                            <SelectItem value="2">JS</SelectItem>
                            <SelectItem value="3">Python</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className='grid grid-cols-5'>
                <div className='col-span-2 my-auto'>Tên lớp</div>
                <div className='col-span-3'>
                    <Input
                        type="text"
                        placeholder="VD: Lớp học UI/UX tại Tekmonk"
                        customInputClassNames="text-sm"
                    />
                </div>
            </div>
        </div>
    )
}
