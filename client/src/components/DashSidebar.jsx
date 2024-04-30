import { userInfoStore } from "@/services/zustandStore/userStore"
import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react"
import { useEffect, useState } from "react"
import { HiArrowSmRight, HiDocumentText, HiUser } from 'react-icons/hi'
import { Link, useLocation } from "react-router-dom"

export const DashSidebar = () => {
  const location = useLocation()
  const [tab, setTab] = useState('')
  const currentUser = userInfoStore(state => state.userInfo)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    setTab(tabFromUrl || '')
  }, [location.search])

  return (
    <Sidebar className="w-full">
      <SidebarItems>
        <SidebarItemGroup>
          <Link to='/dashboard?tab=profile'>
            <SidebarItem active={tab === 'profile'} icon={HiUser} label='User' labelColor='dark' as='span'>
              Profile
            </SidebarItem>
          </Link>
          {
            currentUser?.isAdmin && (
              <Link to='/dashboard?tab=posts'>
                <SidebarItem active={tab === 'posts'} icon={HiDocumentText} labelColor='dark' as='div'>
                  Posts
                </SidebarItem>
              </Link>
            )
          }
          <SidebarItem icon={HiArrowSmRight} labelColor='dark' className='cursor-pointer'>
            Sign Out
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  )
}
