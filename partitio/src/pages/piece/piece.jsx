import "./piece.scss";

import LeftPanel from "../../components/leftPanel/leftPanel";
import Card from "../../components/card/card";
import AddPieceButton from "../../components/addPieceButton/addPieceButton";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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

    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        fetch('/api/me', {
            credentials: 'same-origin'
        })
            .then(response => {
                if (!response.ok) throw new Error()
                return response.json()
            })
            .then(({ user }) => {
                setUser(user)
            })
            .catch(() => navigate('/login', { 
                replace: true, 
                state: {from: location.pathname}}))
    }, [navigate])

    if (!user) return null

    return (
        <div className="all">
            <LeftPanel user={user} />
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
                    </div>
                    <AddPieceButton />
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
