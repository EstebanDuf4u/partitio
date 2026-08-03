import "./piece.scss";

import LeftPanel from "../../components/leftPanel/leftPanel";
import Card from "../../components/card/card";
import AddPieceButton from "../../components/addPieceButton/addPieceButton";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Input } from '@mantine/core';
import { PlusIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';

function Piece() {
    const [search, setSearch] = useState("");
    const [pieces, setPieces] = useState([]);
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/me', {
            credentials: 'same-origin'
        })
            .then(response => {
                if (!response.ok) throw new Error()
                return response.json()
            })
            .then(({ user }) => {
                setUser(user);
            })
            .catch(() => navigate('/login', { 
                replace: true, 
                state: {from: location.pathname}}))
    }, [navigate])

    useEffect(() => {
        fetch('api/pieces', {
            credentials: "same-origin"
        }).then(response => {
            if (!response.ok) throw new Error();
            return response.json();
        }).then((data) => {
            setPieces(data);
        }).catch(() => setPieces([]));
    }, [])

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
                    <Card coverSrc={morceau.coverSrc} title={morceau.title} artist={morceau.artist} voices={morceau.voices} modifDate={morceau.modifDate} /> */}
                    {pieces.map((piece) => <Card key={`${piece.title}-${piece.artist}`} {...piece} />)}
                </div>
            </div>
        </div>
    )
}

export default Piece;
