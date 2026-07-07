import "./menuDashboard.scss";

import { Menu } from "@mantine/core";
import { PlusCircleIcon, UsersIcon } from "@phosphor-icons/react";
import JoinCreateButton from "../joinCreateButton/joinCreateButton";

function MenuDashboard() {
    return (
        <Menu shadow="md" width={220}>
            <Menu.Target>
                <JoinCreateButton />
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Item leftSection={<PlusCircleIcon />} >
                    Créer un ensemble
                </Menu.Item>

                <Menu.Item leftSection={<UsersIcon  />}>
                    Rejoindre un ensemble
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}

export default MenuDashboard;