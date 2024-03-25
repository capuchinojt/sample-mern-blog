import { Avatar, Button, DarkThemeToggle, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, Navbar, TextInput } from "flowbite-react"
import { Link, useLocation } from "react-router-dom"
import { AiOutlineSearch } from 'react-icons/ai'

import { Logo } from "@/components/Logo"
import { useUserInfo } from "@/services/redux/signIn/signInSelector"

export default function Header() {
  const path = useLocation().pathname
  const userInfo = useUserInfo()

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
        {/* <Button className="w-12 h-10 hidden sm:inline" color="gray" pill>
          <FaMoon />
        </Button> */}
        <DarkThemeToggle className="w-12 h-10 hidden sm:inline" />
        {userInfo ? (
          <Dropdown arrowIcon={false} inline label={<Avatar alt='user' img={userInfo.profilePicture} rounded />}>
            <DropdownHeader>
              <span className="block text-sm">@{userInfo.username}</span>
              <span className="block text-sm font-medium truncate">@{userInfo.email}</span>
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
