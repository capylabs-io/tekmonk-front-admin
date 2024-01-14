import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/common/Select"
import { Input } from '../common/Input'
import classNames from 'classnames'
import { Textarea } from '../common/TextArea'

type Props = {
    customClassname?: string
}

export const ClassesModalForm = ({ customClassname }: Props) => {
    return (
        <div className={classNames('flex flex-col gap-y-4', customClassname)}>
            <div className='grid grid-cols-5'>
                <div className='col-span-2 my-auto'>Cơ sở</div>
                <div className='col-span-3'>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Chọn cơ sở" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">HÀNG BÚN</SelectItem>
                            <SelectItem value="2">HOÀNG HOA THÁM</SelectItem>
                            <SelectItem value="3">NGUYỄN CHÍ THANH</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className='grid grid-cols-5'>
                <div className='col-span-2 my-auto'>Khoá học</div>
                <div className='col-span-3'>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Chọn khoá học" />
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
            <div className='grid grid-cols-5'>
                <div className='col-span-2 my-auto'>GV phụ trách</div>
                <div className='col-span-3'>
                    <Input
                        type="text"
                        placeholder="VD: Lớp học UI/UX tại Tekmonk"
                        customInputClassNames="text-sm"
                    />
                </div>
            </div>
            <div className='grid grid-cols-5'>
                <div className='col-span-2 my-auto'>Trạng thái</div>
                <div className='col-span-3'>
                    <Select>
                        <SelectTrigger>
                            <SelectValue defaultValue="1" placeholder='Chọn Trạng Thái'/>
                        </SelectTrigger>
                        <SelectContent> 
                            <SelectItem value="1" className='text-green-500'>Đang hoạt động</SelectItem>
                            <SelectItem value="2" className='text-red-500'>Không hoạt động</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className='grid grid-cols-5'>
                <div className='col-span-2'>Mô tả</div>
                <div className='col-span-3'>
                  <Textarea className='resize-none'/>
                </div>
            </div>
        </div>
    )
}
