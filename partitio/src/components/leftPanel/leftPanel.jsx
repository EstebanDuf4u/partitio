import "./leftPanel.scss"
import Button from "../button/button";
import { useState } from "react";

function LeftPanel() {
    return (
        <div className="panneauGauche">
            <div className="group">
                <div className="texte">
                    <div className="logo">
                        <img src="/logo.png" alt="logoPartitio" />
                        <p>Partitio</p>
                    </div>
                    <p>Gérer vos partitions en toute harmonie</p>
                </div>
                <div className="btnDiv">
                    <Button name="Tableau de bord" imageSrc={"/house.svg"} />
                    <Button name="Morceaux" imageSrc={"/music.svg"} />
                    <Button name="Ensembles" imageSrc={"/group.svg"} />
                    <Button name="Documents" imageSrc={"/doc.svg"} />
                </div>
                <div className="texteAdminDiv">
                    <div className="texteAdmin">
                        <p>Administration</p>
                    </div>
                    <div class="divider"></div>
                </div>
                <div className="btnDiv">
                    <Button name="Utilisateurs" imageSrc={"/group.svg"} />
                    <Button name="Rôles" imageSrc={"/add-user.svg"} />
                </div>
            </div>
            <div className="btnProfil">
                <img src="/avatar.svg" alt="avatar" />
                <div className="profilText">
                    <p className="prenomNom">Prenom Nom</p>
                    <p className="typeVoix">Type de voix</p>
                </div>
            </div>
        </div>
    )
}

export default LeftPanel;
