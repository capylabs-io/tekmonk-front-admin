import { Bell } from 'lucide-react'
import React from 'react'

export const UserInfoContainer = () => {
    return (
        <div className='flex gap-x-3'>
            <div className='border-2 p-2 border-gray-300 rounded-lg h-max flex items-center justify-center'>
                <Bell size={24} className='text-primary-600' />
            </div>
            <div className='border-2 border-gray-300 rounded-lg'>
                <div className="h-10 w-10 flex flex-col rounded-lg bg-[url('/image/home/profile-pic.png')] bg-yellow-100 items-center justify-center" />
            </div>
        </div>
    )
}
