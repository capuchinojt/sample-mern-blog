import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react"
import { useEffect, useState } from "react"
import { HiArrowSmRight, HiUser } from 'react-icons/hi'
import { Link, useLocation } from "react-router-dom"

export const DashSidebar = () => {
  const location = useLocation()
  const [tab, setTab] = useState('')
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    setTab(tabFromUrl || '')
    console.log(tabFromUrl)
  }, [location.search])

  return (
    <Sidebar className="w-full">
      <SidebarItems>
        <SidebarItemGroup>
          <Link to='/dashboard?tab=profile'>
            <SidebarItem active={tab === 'profile'} icon={HiUser} label='User' labelColor='dark'>
              Profile
            </SidebarItem>
          </Link>
          <SidebarItem icon={HiArrowSmRight} labelColor='dark' className='cursor-pointer'>
            Sign Out
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  )
}
