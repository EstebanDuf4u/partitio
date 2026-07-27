import "./addPieceButton.scss";
import { Modal, Input, Select, Textarea, FileInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { PlusIcon, ImageBrokenIcon } from '@phosphor-icons/react';
import { useEffect, useState } from "react";

function AddPieceButton() {
    const [opened, { open, close }] = useDisclosure(false);
    const [file, setFile] = useState(null);
    const [path, setPath] = useState(null);

    useEffect(() => {
        if (!file) {
            setPath(null);
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setPath(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [file]);

    const handleSubmit = ((event) => {
        console.log("test");
        
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());
        console.log(data);
    })

    return (
        <>
            <Modal opened={opened} onClose={close} title="Ajouter un morceau" size="50%">
                <div className="modalAddPiece">
                    <form onSubmit={handleSubmit} method="post">
                        <div className="top">
                            <p>Informations Générales</p>
                            <div className="infoGrid">
                                <div className="pieceTitle">
                                    <p>Titre du morceau</p>
                                    <Input type="text" placeholder="Ex: Hallelujah" />
                                </div>
                                <div className="artiste">
                                    <p>Compositeur / Artiste</p>
                                    <Input type="text" placeholder="Ex: Leonard Cohen" />
                                </div>
                                <div className="category">
                                    <p>Catégorie</p>
                                    <Select placeholder="Selectionner une catégorie" data={["Pop", "Rock", "Techno", "Classique", "Autre"]} />
                                </div>
                                <div className="language">
                                    <p>Langue</p>
                                    <Select placeholder="Selectioner une langue" data={["Français", "Anglais"]} />
                                </div>
                            </div>
                        </div>
                        <div className="desc">
                            <p>Description</p>
                            <Textarea
                                minRows={4}
                                autosize
                                resize="vertical"
                                placeholder="Ajoutez une description, des notes ou des informations utiles..."
                            />
                        </div>
                        <div className="cover">
                            <p>Image de couverture</p>
                            {path == null ? (
                                <ImageBrokenIcon />
                            ) : (
                                <img src={path} alt="Aperçu de l'image" className="imagePreview" />
                            )}
                            <FileInput
                                placeholder="Parcourir vos fichiers"
                                accept="image/png,image/jpeg,image/webp"
                                value={file}
                                onChange={setFile}
                            />
                        </div>
                        <hr />
                        <div className="bottomButtons">
                            <div className="annulerBtn" onClick={close}>
                                <p>Annuler</p>
                            </div>
                            <button className="terminerBtn" type="submit">
                                <p>Terminer</p>
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            <div className="addPiece" onClick={open}>
                <PlusIcon />
                <p>Ajouter un morceau</p>
            </div>
        </>
    );
}

export default AddPieceButton;
