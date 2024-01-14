import React from 'react'
import { InputWithIcon } from '../common/InputWithIcon'
import { Search } from 'lucide-react'

export const AddStudentModalForm = () => {
  const listStudent = ['Nguyễn Văn A', 'Nguyễn Văn B', 'Nguyễn Văn C', 'Nguyễn Văn D']
  return (
    <div className='px-6'>
      <InputWithIcon
        type="text"
        value=""
        customClassNames="h-[40px]"
        customInputClassNames="text-sm"
        placeHolder="Tìm kiếm từ khoá"
        iconElement={<Search size={16} />}
      />
      <div></div>
    </div>
  )
}
