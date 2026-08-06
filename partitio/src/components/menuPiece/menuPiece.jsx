import "./menuPiece.scss";

import { Menu, ActionIcon } from "@mantine/core";
import { DotsThreeIcon, PencilIcon, FileTextIcon, ShareFatIcon, StarIcon, TrashIcon } from "@phosphor-icons/react";
import { useState } from "react";

import FETCH_BASE_URL from '../../fetch_url';

function MenuPiece({ id }) {
    const [value, setValue] = useState(0);
    const handleClick = () => {
        fetch(FETCH_BASE_URL + '/api/pieces/' + id, {
            method: "DELETE",
            credentials: "include"
        }).then(response => {
            if (!response.ok) throw new Error();
            return response.json();
        }).then(res => console.log(res))
            .catch(() => setValue(0));
        window.location.reload();
    }

    return (
        <Menu shadow="md" width={220}>
            <Menu.Target>
                <ActionIcon variant="default" className="dots">
                    <DotsThreeIcon />
                </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Item leftSection={<PencilIcon />} >
                    Modifier
                </Menu.Item>

                <Menu.Item leftSection={<FileTextIcon />}>
                    Gérer les documents
                </Menu.Item>

                <Menu.Item leftSection={<ShareFatIcon />}>
                    Partager
                </Menu.Item>

                <Menu.Item leftSection={<StarIcon />}>
                    Ajouter aux favoris
                </Menu.Item>

                <Menu.Divider />

                <Menu.Item color="red" leftSection={<TrashIcon />} onClick={handleClick}>
                    Supprimer
                </Menu.Item>

            </Menu.Dropdown>
        </Menu>
    )
}

export default MenuPiece;
