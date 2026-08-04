import "./addPieceButton.scss";
import { Modal, TextInput, Select, Textarea, FileInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { PlusIcon, ImageBrokenIcon } from '@phosphor-icons/react';
import { useEffect, useState } from "react";

import FETCH_BASE_URL from '../../fetch_url.js';

function AddPieceButton() {
    const [opened, { open, close }] = useDisclosure(false);
    const [file, setFile] = useState(null);
    const [path, setPath] = useState(null);
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [category, setCategory] = useState("");
    const [language, setLanguage] = useState("");
    const [description, setDescription] = useState("");

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) return;

        const ImageformData = new FormData();
        ImageformData.append("file", file);
        ImageformData.append("title", title);

        const responseImage = await fetch(FETCH_BASE_URL + "/api/uploads/covers", {
            method: "POST",
            body: ImageformData,
        });

        const imagePath = await responseImage.text();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("artist", artist);
        formData.append("category", category);
        formData.append("language", language);
        formData.append("description", description);
        formData.append("coverUrl", imagePath)

        const responseFormData = await fetch(FETCH_BASE_URL + "/api/pieces", {
            method: "POST",
            body: formData,
        });
        const form = await responseFormData.text();

        console.log(imagePath);
        console.log(form);
        close();
        window.location.reload();
    };

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
                                    <TextInput placeholder="Ex: Hallelujah" value={title} onChange={(event) => setTitle(event.currentTarget.value)} required withAsterisk />
                                </div>
                                <div className="artiste">
                                    <p>Compositeur / Artiste</p>
                                    <TextInput placeholder="Ex: Leonard Cohen" value={artist} onChange={(event) => setArtist(event.currentTarget.value)} required />
                                </div>
                                <div className="category">
                                    <p>Catégorie</p>
                                    <Select placeholder="Selectionner une catégorie" data={["Pop", "Rock", "Techno", "Classique", "Autre"]} value={category} onChange={setCategory} required />
                                </div>
                                <div className="language">
                                    <p>Langue</p>
                                    <Select placeholder="Selectioner une langue" data={["Français", "Anglais"]} value={language} onChange={setLanguage} required />
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
                                value={description}
                                onChange={(event) => setDescription(event.currentTarget.value)}
                                required
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
