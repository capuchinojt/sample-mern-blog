import { Avatar, Button, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, Navbar, TextInput } from "flowbite-react"
import { Link, useLocation } from "react-router-dom"
import { AiOutlineSearch } from 'react-icons/ai'
import { FaMoon, FaSun } from 'react-icons/fa'

import { Logo } from "@/components/Logo"
import { themeTypes } from "@/constant/style.constants"
import { userInfoStore } from "@/services/zustandStore/userStore"
import { commonStore } from "@/services/zustandStore/commonStore"

export default function Header() {
  const path = useLocation().pathname
  const theme = commonStore(state => state.theme)
  const toggleTheme = commonStore(state => state.toggleTheme)
  const userInfo = userInfoStore(state => state.userInfo)

  return (
    <Navbar className="border-b-2" fluid rounded>
      <Logo />
      <form>
        <TextInput id="search" type="text" placeholder="Search..." rightIcon={AiOutlineSearch} className="hidden lg:inline"/>
      </form>
      <Button className="lg:hidden w-12 h-10" color="gray" pill>
        <AiOutlineSearch className=""/>
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button className="w-12 h-10 hidden sm:inline" color="gray" pill onClick={() => toggleTheme()}>
          {theme === themeTypes.LIGHT ? <FaMoon /> : <FaSun />}
        </Button>
        {/* <DarkThemeToggle className="hidden sm:inline mr-2"/> */}
        {userInfo ? (
          <Dropdown arrowIcon={false} inline label={<Avatar alt='user' img={userInfo.profilePicture} rounded />}>
            <DropdownHeader>
              <span className="block text-sm">@{userInfo.username}</span>
              <span className="block text-sm font-medium truncate">{userInfo.email}</span>
            </DropdownHeader>
            <Link to="/dashboard?tab=profile">
                <DropdownItem>Profile</DropdownItem>
            </Link>
            <DropdownDivider />
            <DropdownItem>Sign Out</DropdownItem>
          </Dropdown>
        ) : <Link to='/sign-in'>
          <Button gradientDuoTone="purpleToBlue" outline>
            Sign In
          </Button>
        </Link>}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link href="/" active={path === "/"} as={"div"}>
          <Link to='/'>
            Home
          </Link>          
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to='/about'>
            About
          </Link>          
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to='/projects'>
            Projects
          </Link>          
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  )
}
