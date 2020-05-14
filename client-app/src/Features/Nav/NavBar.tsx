import React from 'react'
import { Menu } from 'semantic-ui-react'

export const NavBar = () => {
    return (
        <Menu inverted>
        <Menu.Item name='home' />
        <Menu.Item name='messages'/>
        <Menu.Item name='friends'/>
      </Menu>
    )
}
