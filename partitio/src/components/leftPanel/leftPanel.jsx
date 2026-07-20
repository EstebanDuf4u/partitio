import "./leftPanel.scss"

import Button from "../button/button";
import { NavLink } from "react-router-dom";
import { HouseIcon, MusicNoteIcon, UsersIcon, FileTextIcon, UserListIcon, UserPlusIcon } from "@phosphor-icons/react";

function LeftPanel({ user }) {
    return (
        <div className="panneauGauche">
            <div className="group">
                <NavLink className="texteLogo" to="/dashboard">
                    <div className="logo">
                        <img src="/logo.png" alt="logoPartitio" />
                        <p>Partitio</p>
                    </div>
                    <p>Gérer vos partitions en toute harmonie</p>
                </NavLink>

                {user && (
                    <>
                        <div className="btnDiv">
                            <Button name="Tableau de bord" image={<HouseIcon />} path="/dashboard" />
                            <Button name="Morceaux" image={<MusicNoteIcon />} path="/piece" />
                            <Button name="Documents" image={<FileTextIcon />} path="/documents" />
                            <Button name="Ensembles" image={<UsersIcon />} path="/ensembles" />
                        </div>

                        {user.is_admin && (
                            <>
                                <div className="texteAdminDiv">
                                    <div className="texteAdmin">
                                        <p>Administration</p>
                                    </div>
                                    <div className="divider"></div>
                                </div>

                                <div className="btnDiv">
                                    <Button name="Utilisateurs" image={<UserListIcon />} path="/users" />
                                    <Button name="Rôles" image={<UserPlusIcon />} path="/roles" />
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>

            {user && (
                <NavLink to="/profilpage" className="btnProfil">
                    <img src="/avatar.svg" alt="avatar" />
                    <div className="profilText">
                        <p className="prenomNom">{user.firstName} {user.lastName}</p>
                        <p className="typeVoix">Type de voix</p>
                    </div>
                </NavLink>
            )}
        </div>
    );
}

export default LeftPanel;
