import "./menuPiece.scss";

import { Menu, ActionIcon } from "@mantine/core";
import { DotsThreeIcon, PencilIcon, FileTextIcon, ShareFatIcon, StarIcon, TrashIcon } from "@phosphor-icons/react";
import { useState } from "react";


function MenuPiece({ id, onPieceDeleted }) {
    const [value, setValue] = useState(0);
    const handleClick = () => {
        fetch('api/pieces/' + id, {
            method: "DELETE",
            credentials: "same-origin"
        }).then(response => {
            if (!response.ok) throw new Error();
            onPieceDeleted();
        }).catch(() => setValue(0));
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