"use client"

import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ProfileDropdownProps {
  user: User
}

export function ProfileDropdown({ user }: ProfileDropdownProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <Menu as="div" className="relative inline-block text-left z-[100]">
      <Menu.Button className="flex items-center space-x-2 text-white hover:text-white/90">
        <img
          src={user.photoURL || '/default-avatar.png'}
          alt="Profile"
          className="w-8 h-8 rounded-full"
        />
        <span>{user.displayName || 'User'}</span>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="fixed right-4 top-16 w-56 origin-top-right divide-y divide-gray-600/50 rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-[100]">
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/profile"
                  className={`${
                    active ? 'bg-blue-500 text-white' : 'text-gray-100'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  Edit Profile
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/recommendations/mutual-funds"
                  className={`${
                    active ? 'bg-blue-500 text-white' : 'text-gray-100'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  MF Latest Recommendations
                </Link>
              )}
            </Menu.Item>
          </div>
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleSignOut}
                  className={`${
                    active ? 'bg-blue-500 text-white' : 'text-gray-100'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  Sign Out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
} 