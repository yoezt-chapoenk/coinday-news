'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface TabNavigationProps {
  currentTab: 'pending' | 'approved'
}

export default function TabNavigation({ currentTab }: TabNavigationProps) {
  const pathname = usePathname()
  
  const tabs = [
    {
      id: 'pending',
      label: 'Pending Articles',
      href: '/admin',
      active: currentTab === 'pending'
    },
    {
      id: 'approved',
      label: 'Approved Articles', 
      href: '/admin/approved',
      active: currentTab === 'approved'
    }
  ]

  return (
    <div className="border-b border-gray-800">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              tab.active
                ? 'border-white text-white'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}