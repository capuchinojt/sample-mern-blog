import { useSignOut } from "@/services/hooks/useSignOut.hook"
import { userInfoStore } from "@/services/zustandStore/userStore"
import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react"
import { useEffect, useState } from "react"
import { HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiUser } from 'react-icons/hi'
import { Link, useLocation, useNavigate } from "react-router-dom"

export const DashSidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [tab, setTab] = useState('')
  const currentUser = userInfoStore(state => state.userInfo)
  const setUserInfo = userInfoStore(state => state.setUserInfo)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    setTab(tabFromUrl || '')
  }, [location.search])
  const { signOutMutation } = useSignOut(
    () => {
      setUserInfo(null)
      navigate('/sign-in')
    }
  )

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
          {
            currentUser?.isAdmin && (
              <Link to='/dashboard?tab=users'>
                <SidebarItem active={tab === 'users'} icon={HiOutlineUserGroup} labelColor='dark' as='div'>
                  Users
                </SidebarItem>
              </Link>
            )
          }
          <SidebarItem icon={HiArrowSmRight} labelColor='dark' className='cursor-pointer w-full text-left' as="button" onClick={() => signOutMutation.mutate()}>
            Sign Out
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  )
}
