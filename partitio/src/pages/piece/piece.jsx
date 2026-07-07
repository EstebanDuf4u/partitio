import "./piece.scss";

import LeftPanel from "../../components/leftPanel/leftPanel";
import Card from "../../components/card/card";

import { useState } from "react";
import { Input } from '@mantine/core';
import { PlusIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';

function Piece() {
    const pieces = [
        {
            title: "Hallelujah",
            author: "Leonard Cohen",
            coverSrc: "/cover/hallelujah.jpg",
            modifDate: "02/07/2026",
            voices: ["soprano", "alto", "tenor", "basse"]
        },
        {
            title: "Hier Encore",
            author: "Charles Aznavour",
            coverSrc: "/cover/hier-encore.jpg",
            modifDate: "02/07/2026",
            voices: ["alto", "tenor"]
        },
        {
            title: "I'm Done",
            author: "Rutra",
            coverSrc: "/cover/im-done.jpg",
            modifDate: "02/07/2026",
            voices: ["soprano"]
        },
        {
            title: "Freestyle du sale",
            author: "Lorenzo",
            coverSrc: "/cover/freestyle-du-sale.jpg",
            modifDate: "02/07/2026",
            voices: ["tenor", "basse"]
        },
        {
            title: "Parisienne",
            author: "Gims",
            coverSrc: "/cover/parisienne.jpg",
            modifDate: "02/07/2026",
            voices: ["soprano", "alto", "basse"]
        },
        {
            title: "Hier Encore",
            author: "Charles Aznavour",
            coverSrc: "/cover/hier-encore.jpg",
            modifDate: "02/07/2026",
            voices: ["alto", "tenor"]
        },
        {
            title: "I'm Done",
            author: "Rutra",
            coverSrc: "/cover/im-done.jpg",
            modifDate: "02/07/2026",
            voices: ["soprano"]
        },
        {
            title: "Freestyle du sale",
            author: "Lorenzo",
            coverSrc: "/cover/freestyle-du-sale.jpg",
            modifDate: "02/07/2026",
            voices: ["tenor", "basse"]
        },
    ];

    const [search, setSearch] = useState("");

    // updateSearch = (search) => {
    //     setSearch(search);
    // };

    return (
        <div className="all">
            <LeftPanel />
            <div className="rightPanel">
                <div className="top">
                    <div className="text">
                        <p id="title">Morceaux</p>
                        <p> Retrouvez tous les morceaux enregistrés dans la bibliothèque.</p>
                    </div>
                </div>
                <div className="researchPiece">
                    <div className="recherche">
                        <Input placeholder="Rechercher un morceau" leftSection={<MagnifyingGlassIcon size={32} />} />
                        {/* <input type="text" placeholder="Rechercher un morceau" value={search} onChange={(e) => setSearch(e.target.value)} /> */}
                    </div>
                    <div className="addPiece">
                        <PlusIcon />
                        <p>Ajouter un morceau</p>
                    </div>
                </div>
                <div className="cards">
                    {/* {...pieces} permet de ne pas écrire :
                    <Card coverSrc={morceau.coverSrc} title={morceau.title} author={morceau.author} voices={morceau.voices} modifDate={morceau.modifDate} /> */}
                    {pieces.map((piece) => <Card key={`${piece.title}-${piece.author}`} {...piece} />)}
                </div>
            </div>
        </div>
    )
}

export default Piece;
