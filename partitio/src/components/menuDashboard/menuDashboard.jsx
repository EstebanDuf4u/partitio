import "./menuDashboard.scss";

import { Menu } from "@mantine/core";
import { PlusCircleIcon, UsersIcon } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import JoinCreateButton from "../joinCreateButton/joinCreateButton";

function MenuDashboard() {
    const navigate = useNavigate();

    return (
        <Menu shadow="md" width={220}>
            <Menu.Target>
                <JoinCreateButton />
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Item leftSection={<PlusCircleIcon />} onClick={() => navigate("/ensembles?mode=create")}>
                    Créer un ensemble
                </Menu.Item>

                <Menu.Item leftSection={<UsersIcon />} onClick={() => navigate("/ensembles?mode=join")}>
                    Rejoindre un ensemble
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}

export default MenuDashboard;
