import "./pieceDetails.scss";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FETCH_BASE_URL from '../../fetch_url';

function PieceDetails() {
    const { id } = useParams();

    const [piece, setPiece] = useState(null);

    useEffect(() => {
        fetch(FETCH_BASE_URL + `/api/pieces/${id}`, {
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                setPiece(data);
            })
            .catch(error => {
                console.error(error);
            });
    }, [id]);

    if (!piece) {
        return <p>Morceau introuvable.</p>;
    }

    return (
        <div className="piece-details">

            <div className="piece-details__header">

                <img
                    src={`http://localhost:3000${piece.coverUrl}`}
                    alt={piece.title}
                    className="piece-details__cover"
                />

                <div className="piece-details__info">
                    <span className="piece-details__category">
                        {piece.category}
                    </span>

                    <h1>{piece.title}</h1>

                    <h2>{piece.artist}</h2>

                    <p>{piece.description}</p>
                </div>

            </div>

            <div className="piece-details__metadata">

                <div>
                    <span>Langue</span>
                    <strong>{piece.language}</strong>
                </div>

                <div>
                    <span>Catégorie</span>
                    <strong>{piece.category}</strong>
                </div>

                <div>
                    <span>Ajouté le</span>
                    <strong>{new Date(piece.dateAdded).toLocaleDateString("fr-FR")}</strong>
                </div>

            </div>

            <div className="piece-details__files">
                <h2>Fichiers</h2>

                {piece.documentDto?.length === 0 ? (
                    <p className="piece-details__files-empty">
                        Aucun fichier disponible pour ce morceau.
                    </p>
                ) : (
                    <div className="piece-details__file-list">

                        {piece.documentDto
                            ?.filter(document => document.documentType === "partition")
                            .map(document => (
                                <div
                                    className="piece-details__file"
                                    key={document.id}
                                >
                                    <div className="piece-details__file-info">
                                        <div className="piece-details__file-icon">
                                            📄
                                        </div>

                                        <div>
                                            <strong>{document.name}</strong>

                                            <span>
                                                {document.voiceType === "tout"
                                                    ? "Toutes les voix"
                                                    : document.voiceType.charAt(0).toUpperCase() +
                                                    document.voiceType.slice(1)
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        className="piece-details__file-button"
                                        disabled={!document.documentUrl}
                                    >
                                        {document.documentUrl ? "Ouvrir" : "Indisponible"}
                                    </button>
                                </div>
                            ))
                        }

                        {piece.documentDto
                            ?.filter(document => document.documentType === "paroles")
                            .map(document => (
                                <div
                                    className="piece-details__file"
                                    key={document.id}
                                >
                                    <div className="piece-details__file-info">
                                        <div className="piece-details__file-icon">
                                            📝
                                        </div>

                                        <div>
                                            <strong>{document.name}</strong>

                                            <span>Paroles</span>
                                        </div>
                                    </div>

                                    <button
                                        className="piece-details__file-button"
                                        disabled={!document.documentUrl}
                                    >
                                        {document.documentUrl ? "Ouvrir" : "Indisponible"}
                                    </button>
                                </div>
                            ))
                        }

                    </div>
                )}
            </div>

        </div>
    );
}

export default PieceDetails;