import "./ensembles.scss";

import { useCallback, useEffect, useMemo, useState } from "react";
import LeftPanel from "../../components/leftPanel/leftPanel";
import { useLocation, useNavigate } from "react-router-dom";
import FETCH_BASE_URL from '../../fetch_url';
import { Input } from '@mantine/core';
import {
    CalendarDotsIcon,
    CheckCircleIcon,
    MagnifyingGlassIcon,
    MusicNoteIcon,
    PlusIcon,
    UserPlusIcon,
    UsersIcon
} from '@phosphor-icons/react';

const defaultCreateForm = {
    name: "",
    type: "",
    role: "",
    nextDate: "",
    rehearsalLocation: "",
    color: "green"
};

const defaultJoinForm = {
    inviteCode: "",
    role: "",
    ensembleRole: "PARTICIPANT"
};

const defaultInviteForm = {
    email: "",
    role: "",
    ensembleRole: "PARTICIPANT"
};

const ensembleRoleOptions = [
    { value: "PARTICIPANT", label: "Participant" },
    { value: "ADMIN", label: "Admin" }
];

async function requestJson(path, options = {}) {
    const response = await fetch(FETCH_BASE_URL + path, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers ?? {})
        },
        ...options
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.error ?? "Une erreur est survenue.");
    }

    return data;
}

function initialsFromMember(member) {
    const firstInitial = member.firstName?.trim().charAt(0) ?? "";
    const lastInitial = member.lastName?.trim().charAt(0) ?? "";
    const initials = `${firstInitial}${lastInitial}`.trim();

    return initials ? initials.toUpperCase() : "??";
}

function Ensembles() {
    const [search, setSearch] = useState("");
    const [user, setUser] = useState(null);
    const [ensembles, setEnsembles] = useState([]);
    const [isLoadingEnsembles, setIsLoadingEnsembles] = useState(true);
    const [ensemblesError, setEnsemblesError] = useState("");
    const [manualDialogMode, setManualDialogMode] = useState(null);
    const [dismissedDialogSearch, setDismissedDialogSearch] = useState("");
    const [createForm, setCreateForm] = useState(defaultCreateForm);
    const [joinForm, setJoinForm] = useState(defaultJoinForm);
    const [inviteForm, setInviteForm] = useState(defaultInviteForm);
    const [selectedEnsemble, setSelectedEnsemble] = useState(null);
    const [ensembleMembers, setEnsembleMembers] = useState([]);
    const [pendingInvitations, setPendingInvitations] = useState([]);
    const [isOpeningEnsemble, setIsOpeningEnsemble] = useState(false);
    const [detailStatus, setDetailStatus] = useState(null);
    const [actionStatus, setActionStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const loadEnsembles = useCallback(() => {
        return requestJson('/api/ensembles')
            .then((data) => {
                setEnsembles(data);
                setEnsemblesError("");
            })
            .catch(() => {
                setEnsembles([]);
                setEnsemblesError("Impossible de charger les ensembles.");
            })
            .finally(() => setIsLoadingEnsembles(false));
    }, []);

    const queryDialogMode = useMemo(() => {
        const mode = new URLSearchParams(location.search).get("mode");
        return mode === "create" || mode === "join" ? mode : null;
    }, [location.search]);

    const dialogMode = manualDialogMode
        ?? (dismissedDialogSearch === location.search ? null : queryDialogMode);

    const filteredEnsembles = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        if (!searchValue) return ensembles;

        return ensembles.filter((ensemble) =>
            `${ensemble.name ?? ""} ${ensemble.type ?? ""} ${ensemble.role ?? ""} ${ensemble.status ?? ""}`
                .toLowerCase()
                .includes(searchValue)
        );
    }, [search, ensembles]);

    const totalMembers = ensembles.reduce((total, ensemble) => total + (ensemble.members ?? 0), 0);
    const totalPieces = ensembles.reduce((total, ensemble) => total + (ensemble.pieces ?? 0), 0);
    const activeEnsembles = ensembles.filter((ensemble) => ensemble.status === "Actif").length;
    const nextRehearsal = ensembles.find((ensemble) => ensemble.status === "Actif" && ensemble.nextDate);
    const pendingInvitation = ensembles.find((ensemble) => ensemble.status === "Invitation");

    useEffect(() => {
        fetch(FETCH_BASE_URL + '/api/me', {
            credentials: 'include'
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
                state: { from: window.location.pathname }
            }))
    }, [navigate]);

    useEffect(() => {
        loadEnsembles();
    }, [loadEnsembles]);

    const openDialog = (mode) => {
        setActionStatus(null);
        setDismissedDialogSearch("");
        setManualDialogMode(mode);
    };

    const closeDialog = () => {
        setManualDialogMode(null);
        setDismissedDialogSearch(location.search);
        setIsSubmitting(false);
    };

    const updateCreateForm = (field, value) => {
        setCreateForm((currentForm) => ({
            ...currentForm,
            [field]: value
        }));
    };

    const updateJoinForm = (field, value) => {
        setJoinForm((currentForm) => ({
            ...currentForm,
            [field]: value
        }));
    };

    const updateInviteForm = (field, value) => {
        setInviteForm((currentForm) => ({
            ...currentForm,
            [field]: value
        }));
    };

    const loadEnsemblePeople = async (ensemble) => {
        setEnsembleMembers([]);
        setPendingInvitations([]);

        if (!ensemble || ensemble.status === "Invitation") {
            return;
        }

        const members = await requestJson(`/api/ensembles/${ensemble.id}/members`);
        setEnsembleMembers(members);

        if (ensemble.ensembleRole === "ADMIN") {
            const invitations = await requestJson(`/api/ensembles/${ensemble.id}/invitations`);
            setPendingInvitations(invitations);
        }
    };

    const openEnsemble = async (ensemble) => {
        setIsOpeningEnsemble(true);
        setDetailStatus(null);
        setInviteForm(defaultInviteForm);
        setEnsembleMembers([]);
        setPendingInvitations([]);

        try {
            const detailedEnsemble = await requestJson(`/api/ensembles/${ensemble.id}`);
            setSelectedEnsemble(detailedEnsemble);
            try {
                await loadEnsemblePeople(detailedEnsemble);
            } catch (detailsError) {
                setDetailStatus({ type: "error", message: detailsError.message });
            }
        } catch (error) {
            if (ensemble.status === "Invitation") {
                setSelectedEnsemble(ensemble);
            }
            setActionStatus({ type: "error", message: error.message });
        } finally {
            setIsOpeningEnsemble(false);
        }
    };

    const closeEnsemble = () => {
        setSelectedEnsemble(null);
        setIsOpeningEnsemble(false);
        setDetailStatus(null);
        setInviteForm(defaultInviteForm);
        setEnsembleMembers([]);
        setPendingInvitations([]);
        setIsSubmitting(false);
    };

    const handleCreateSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setActionStatus(null);

        try {
            const ensemble = await requestJson('/api/ensembles', {
                method: "POST",
                body: JSON.stringify(createForm)
            });
            setCreateForm(defaultCreateForm);
            setManualDialogMode(null);
            setDismissedDialogSearch(location.search);
            setActionStatus({
                type: "success",
                message: `${ensemble.name} a été créé. Code invitation : ${ensemble.inviteCode}.`
            });
            setIsLoadingEnsembles(true);
            await loadEnsembles();
        } catch (error) {
            setActionStatus({ type: "error", message: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleJoinSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setActionStatus(null);

        try {
            const ensemble = await requestJson('/api/ensembles/join', {
                method: "POST",
                body: JSON.stringify(joinForm)
            });
            setJoinForm(defaultJoinForm);
            setManualDialogMode(null);
            setDismissedDialogSearch(location.search);
            setActionStatus({
                type: "success",
                message: `${ensemble.name} a été ajouté à vos ensembles.`
            });
            setIsLoadingEnsembles(true);
            await loadEnsembles();
        } catch (error) {
            setActionStatus({ type: "error", message: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInvitationAction = async (invitationId, action) => {
        if (!invitationId) return;

        setIsSubmitting(true);
        setActionStatus(null);

        try {
            await requestJson(`/api/ensembles/invitations/${invitationId}/${action}`, {
                method: "POST"
            });
            setActionStatus({
                type: "success",
                message: action === "accept" ? "Invitation acceptée." : "Invitation refusée."
            });
            setSelectedEnsemble(null);
            setIsLoadingEnsembles(true);
            await loadEnsembles();
        } catch (error) {
            setActionStatus({ type: "error", message: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInviteSubmit = async (event) => {
        event.preventDefault();
        if (!selectedEnsemble) return;

        setIsSubmitting(true);
        setDetailStatus(null);

        try {
            const response = await requestJson(`/api/ensembles/${selectedEnsemble.id}/invitations`, {
                method: "POST",
                body: JSON.stringify(inviteForm)
            });
            setInviteForm(defaultInviteForm);
            setDetailStatus({
                type: "success",
                message: `Invitation envoyée à ${response.invitation.email}. Code : ${response.invitation.inviteToken}.`
            });
            await loadEnsemblePeople(selectedEnsemble);
        } catch (error) {
            setDetailStatus({ type: "error", message: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLeaveEnsemble = async () => {
        if (!selectedEnsemble) return;

        setIsSubmitting(true);
        setDetailStatus(null);

        try {
            await requestJson(`/api/ensembles/${selectedEnsemble.id}/members/me`, {
                method: "DELETE"
            });
            setActionStatus({
                type: "success",
                message: `${selectedEnsemble.name} a été retiré de vos ensembles.`
            });
            setSelectedEnsemble(null);
            setIsLoadingEnsembles(true);
            await loadEnsembles();
        } catch (error) {
            setDetailStatus({ type: "error", message: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleMemberRoleChange = async (member, ensembleRole) => {
        if (!selectedEnsemble) return;

        setIsSubmitting(true);
        setDetailStatus(null);

        try {
            const updatedMember = await requestJson(`/api/ensembles/${selectedEnsemble.id}/members/${member.id}`, {
                method: "PATCH",
                body: JSON.stringify({ ensembleRole })
            });

            setEnsembleMembers((currentMembers) =>
                currentMembers.map((currentMember) =>
                    currentMember.id === updatedMember.id ? updatedMember : currentMember
                )
            );

            if (updatedMember.currentUser) {
                setSelectedEnsemble((currentEnsemble) => ({
                    ...currentEnsemble,
                    ensembleRole: updatedMember.ensembleRole,
                    ensembleRoleLabel: updatedMember.ensembleRoleLabel
                }));

                if (updatedMember.ensembleRole !== "ADMIN") {
                    setPendingInvitations([]);
                }
            }

            setDetailStatus({ type: "success", message: "Rôle mis à jour." });
        } catch (error) {
            setDetailStatus({ type: "error", message: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveMember = async (member) => {
        if (!selectedEnsemble) return;

        setIsSubmitting(true);
        setDetailStatus(null);

        try {
            await requestJson(`/api/ensembles/${selectedEnsemble.id}/members/${member.id}`, {
                method: "DELETE"
            });

            setEnsembleMembers((currentMembers) =>
                currentMembers.filter((currentMember) => currentMember.id !== member.id)
            );
            setSelectedEnsemble((currentEnsemble) => ({
                ...currentEnsemble,
                members: Math.max((currentEnsemble.members ?? 1) - 1, 0)
            }));
            setDetailStatus({ type: "success", message: "Membre retiré." });
        } catch (error) {
            setDetailStatus({ type: "error", message: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelInvitation = async (invitationId) => {
        if (!selectedEnsemble) return;

        setIsSubmitting(true);
        setDetailStatus(null);

        try {
            await requestJson(`/api/ensembles/${selectedEnsemble.id}/invitations/${invitationId}`, {
                method: "DELETE"
            });
            setPendingInvitations((currentInvitations) =>
                currentInvitations.filter((invitation) => invitation.id !== invitationId)
            );
            setDetailStatus({ type: "success", message: "Invitation annulée." });
        } catch (error) {
            setDetailStatus({ type: "error", message: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) return null;

    return (
        <div className="ensemblesLayout">
            <LeftPanel user={user} />
            <main className="ensemblesPage">
                <header className="ensemblesHeader">
                    <div className="ensemblesHeading">
                        <p className="ensemblesEyebrow">Ensembles</p>
                        <h1>Mes ensembles</h1>
                        <p>Retrouvez vos groupes, leurs morceaux et les prochaines répétitions.</p>
                    </div>
                    <div className="ensemblesActions">
                        <button className="ensemblesAction secondary" type="button" onClick={() => openDialog("join")}>
                            <UserPlusIcon />
                            <span>Rejoindre</span>
                        </button>
                        <button className="ensemblesAction primary" type="button" onClick={() => openDialog("create")}>
                            <PlusIcon />
                            <span>Créer</span>
                        </button>
                    </div>
                </header>

                {actionStatus && (
                    <p className={`ensembleActionStatus ${actionStatus.type}`} role="status">
                        {actionStatus.message}
                    </p>
                )}

                <section className="ensemblesStats" aria-label="Résumé des ensembles">
                    <article className="ensembleStat">
                        <UsersIcon />
                        <div>
                            <p>{ensembles.length}</p>
                            <span>Ensembles</span>
                        </div>
                    </article>
                    <article className="ensembleStat">
                        <CheckCircleIcon />
                        <div>
                            <p>{activeEnsembles}</p>
                            <span>Actifs</span>
                        </div>
                    </article>
                    <article className="ensembleStat">
                        <UsersIcon />
                        <div>
                            <p>{totalMembers}</p>
                            <span>Membres</span>
                        </div>
                    </article>
                    <article className="ensembleStat">
                        <MusicNoteIcon />
                        <div>
                            <p>{totalPieces}</p>
                            <span>Morceaux</span>
                        </div>
                    </article>
                </section>

                <section className="ensemblesToolbar">
                    <Input
                        className="ensemblesSearch"
                        placeholder="Rechercher un ensemble"
                        leftSection={<MagnifyingGlassIcon size={28} />}
                        value={search}
                        onChange={(event) => setSearch(event.currentTarget.value)}
                    />
                    <div className="ensemblesCount">
                        {isLoadingEnsembles
                            ? "Chargement..."
                            : `${filteredEnsembles.length} résultat${filteredEnsembles.length > 1 ? "s" : ""}`}
                    </div>
                </section>

                <section className="ensemblesContent">
                    <div className="ensemblesGrid" aria-label="Liste des ensembles">
                        {isLoadingEnsembles && <p className="ensemblesEmpty">Chargement des ensembles...</p>}
                        {!isLoadingEnsembles && ensemblesError && <p className="ensemblesEmpty">{ensemblesError}</p>}
                        {!isLoadingEnsembles && !ensemblesError && filteredEnsembles.length === 0 && (
                            <p className="ensemblesEmpty">Aucun ensemble trouvé.</p>
                        )}
                        {!isLoadingEnsembles && !ensemblesError && filteredEnsembles.map((ensemble) => (
                            <article className={`ensembleCard ${ensemble.color ?? "green"}`} key={`${ensemble.status}-${ensemble.id}-${ensemble.invitationId ?? "member"}`}>
                                <div className="ensembleCardTop">
                                    <div className="ensembleAvatar">{ensemble.initials}</div>
                                    <span className="ensembleStatus">
                                        {ensemble.status === "Invitation" ? "Invitation" : ensemble.ensembleRoleLabel}
                                    </span>
                                </div>
                                <div className="ensembleCardText">
                                    <h2>{ensemble.name}</h2>
                                    <p>{ensemble.type}</p>
                                </div>
                                <div className="ensembleRole">
                                    {ensemble.status === "Invitation"
                                        ? `Invité ${ensemble.ensembleRoleLabel?.toLowerCase() ?? "participant"}`
                                        : ensemble.ensembleRoleLabel}
                                </div>
                                <div className="ensembleMeta">
                                    <span>
                                        <UsersIcon />
                                        {ensemble.members} membres
                                    </span>
                                    <span>
                                        <MusicNoteIcon />
                                        {ensemble.pieces} morceaux
                                    </span>
                                    <span>
                                        <CalendarDotsIcon />
                                        {ensemble.nextDate}
                                    </span>
                                    {ensemble.inviteCode && ensemble.status !== "Invitation" && (
                                        <span>
                                            <UserPlusIcon />
                                            Code {ensemble.inviteCode}
                                        </span>
                                    )}
                                </div>
                                <button
                                    className="ensembleOpenButton"
                                    type="button"
                                    onClick={() => openEnsemble(ensemble)}
                                    disabled={isOpeningEnsemble}
                                >
                                    {isOpeningEnsemble ? "Ouverture..." : "Ouvrir"}
                                </button>
                            </article>
                        ))}
                    </div>

                    <aside className="ensemblesSide">
                        <section className="ensemblePanel">
                            <div className="ensemblePanelTitle">
                                <h2>Prochaine répétition</h2>
                                <CalendarDotsIcon />
                            </div>
                            <p className="ensemblePanelMain">
                                {nextRehearsal ? nextRehearsal.name : "Aucune répétition"}
                            </p>
                            {nextRehearsal && (
                                <p className="ensemblePanelMuted">
                                    {nextRehearsal.nextDate}
                                    {nextRehearsal.rehearsalLocation ? ` - ${nextRehearsal.rehearsalLocation}` : ""}
                                </p>
                            )}
                        </section>

                        <section className="ensemblePanel">
                            <div className="ensemblePanelTitle">
                                <h2>Invitation en attente</h2>
                                <UserPlusIcon />
                            </div>
                            <p className="ensemblePanelMain">
                                {pendingInvitation ? pendingInvitation.name : "Aucune invitation"}
                            </p>
                            {pendingInvitation && (
                                <div className="ensembleInviteActions">
                                    <button
                                        type="button"
                                        disabled={isSubmitting}
                                        onClick={() => handleInvitationAction(pendingInvitation.invitationId, "accept")}
                                    >
                                        Accepter
                                    </button>
                                    <button
                                        type="button"
                                        disabled={isSubmitting}
                                        onClick={() => handleInvitationAction(pendingInvitation.invitationId, "decline")}
                                    >
                                        Refuser
                                    </button>
                                </div>
                            )}
                        </section>
                    </aside>
                </section>
            </main>

            {dialogMode && (
                <div className="ensembleDialogBackdrop">
                    <section className="ensembleDialog" role="dialog" aria-modal="true" aria-labelledby="ensembleDialogTitle">
                        <div className="ensembleDialogHeader">
                            <h2 id="ensembleDialogTitle">
                                {dialogMode === "create" ? "Créer un ensemble" : "Rejoindre un ensemble"}
                            </h2>
                            <button type="button" onClick={closeDialog}>Fermer</button>
                        </div>

                        {dialogMode === "create" ? (
                            <form className="ensembleDialogForm" onSubmit={handleCreateSubmit}>
                                <label>
                                    Nom
                                    <input
                                        value={createForm.name}
                                        onChange={(event) => updateCreateForm("name", event.target.value)}
                                        required
                                    />
                                </label>
                                <label>
                                    Type
                                    <input
                                        value={createForm.type}
                                        onChange={(event) => updateCreateForm("type", event.target.value)}
                                        placeholder="Chorale mixte"
                                    />
                                </label>
                                <label>
                                    Rôle dans l'ensemble
                                    <select value="ADMIN" disabled>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </label>
                                <label>
                                    Prochaine répétition
                                    <input
                                        value={createForm.nextDate}
                                        onChange={(event) => updateCreateForm("nextDate", event.target.value)}
                                        placeholder="Jeudi 18:30"
                                    />
                                </label>
                                <label>
                                    Lieu
                                    <input
                                        value={createForm.rehearsalLocation}
                                        onChange={(event) => updateCreateForm("rehearsalLocation", event.target.value)}
                                        placeholder="Salle Berlioz"
                                    />
                                </label>
                                <label>
                                    Couleur
                                    <select
                                        value={createForm.color}
                                        onChange={(event) => updateCreateForm("color", event.target.value)}
                                    >
                                        <option value="green">Vert</option>
                                        <option value="orange">Orange</option>
                                        <option value="purple">Violet</option>
                                        <option value="blue">Bleu</option>
                                    </select>
                                </label>
                                <button className="ensembleDialogSubmit" type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Création..." : "Créer"}
                                </button>
                            </form>
                        ) : (
                            <form className="ensembleDialogForm" onSubmit={handleJoinSubmit}>
                                <label>
                                    Code invitation
                                    <input
                                        value={joinForm.inviteCode}
                                        onChange={(event) => updateJoinForm("inviteCode", event.target.value)}
                                        required
                                    />
                                </label>
                                <label>
                                    Rôle dans l'ensemble
                                    <select
                                        value={joinForm.ensembleRole}
                                        onChange={(event) => updateJoinForm("ensembleRole", event.target.value)}
                                        disabled
                                    >
                                        <option value="PARTICIPANT">Participant</option>
                                    </select>
                                </label>
                                <button className="ensembleDialogSubmit" type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Traitement..." : "Rejoindre"}
                                </button>
                            </form>
                        )}
                    </section>
                </div>
            )}

            {selectedEnsemble && (
                <div className="ensembleDialogBackdrop">
                    <section className="ensembleDialog ensembleDetailDialog" role="dialog" aria-modal="true" aria-labelledby="ensembleDetailTitle">
                        <div className="ensembleDialogHeader">
                            <h2 id="ensembleDetailTitle">{selectedEnsemble.name}</h2>
                            <button type="button" onClick={closeEnsemble}>Fermer</button>
                        </div>

                        {detailStatus && (
                            <p className={`ensembleActionStatus ${detailStatus.type}`} role="status">
                                {detailStatus.message}
                            </p>
                        )}

                        <div className="ensembleDetailHero">
                            <div className={`ensembleAvatar ${selectedEnsemble.color ?? "green"}`}>
                                {selectedEnsemble.initials}
                            </div>
                            <div>
                                <p>{selectedEnsemble.type}</p>
                                <span>
                                    {selectedEnsemble.status === "Invitation"
                                        ? `Invitation ${selectedEnsemble.ensembleRoleLabel?.toLowerCase() ?? "participant"}`
                                        : selectedEnsemble.ensembleRoleLabel}
                                </span>
                            </div>
                        </div>

                        <div className="ensembleDetailGrid">
                            <div>
                                <span>Rôle dans l'ensemble</span>
                                <p>{selectedEnsemble.ensembleRoleLabel}</p>
                            </div>
                            <div>
                                <span>Membres</span>
                                <p>{selectedEnsemble.members}</p>
                            </div>
                            <div>
                                <span>Morceaux</span>
                                <p>{selectedEnsemble.pieces}</p>
                            </div>
                            <div>
                                <span>Répétition</span>
                                <p>{selectedEnsemble.nextDate}</p>
                            </div>
                        </div>

                        {selectedEnsemble.rehearsalLocation && (
                            <p className="ensembleDetailMuted">{selectedEnsemble.rehearsalLocation}</p>
                        )}

                        {selectedEnsemble.status === "Invitation" ? (
                            <div className="ensembleDetailActions">
                                <button
                                    className="ensembleDialogSubmit"
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() => handleInvitationAction(selectedEnsemble.invitationId, "accept")}
                                >
                                    Accepter
                                </button>
                                <button
                                    className="ensembleDialogSecondary"
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() => handleInvitationAction(selectedEnsemble.invitationId, "decline")}
                                >
                                    Refuser
                                </button>
                            </div>
                        ) : (
                            <>
                                <section className="ensemblePeopleSection">
                                    <div className="ensembleSectionHeader">
                                        <h3>Membres</h3>
                                        <span>{ensembleMembers.length}</span>
                                    </div>

                                    {ensembleMembers.length === 0 ? (
                                        <p className="ensembleDetailMuted">Aucun membre chargé.</p>
                                    ) : (
                                        <div className="ensemblePeopleList">
                                            {ensembleMembers.map((member) => (
                                                <div className="ensemblePersonRow" key={member.id}>
                                                    <div className="ensemblePersonAvatar">
                                                        {initialsFromMember(member)}
                                                    </div>
                                                    <div className="ensemblePersonInfo">
                                                        <strong>
                                                            {member.firstName} {member.lastName}
                                                            {member.currentUser ? " (vous)" : ""}
                                                        </strong>
                                                        <span>{member.email}</span>
                                                        {member.role && <small>{member.role}</small>}
                                                    </div>
                                                    {selectedEnsemble.ensembleRole === "ADMIN" ? (
                                                        <select
                                                            value={member.ensembleRole}
                                                            onChange={(event) => handleMemberRoleChange(member, event.target.value)}
                                                            disabled={isSubmitting}
                                                            aria-label={`Rôle de ${member.firstName} ${member.lastName}`}
                                                        >
                                                            {ensembleRoleOptions.map((role) => (
                                                                <option value={role.value} key={role.value}>
                                                                    {role.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        <span className="ensemblePersonRole">{member.ensembleRoleLabel}</span>
                                                    )}
                                                    {selectedEnsemble.ensembleRole === "ADMIN" && !member.currentUser && (
                                                        <button
                                                            className="ensembleSmallDanger"
                                                            type="button"
                                                            disabled={isSubmitting}
                                                            onClick={() => handleRemoveMember(member)}
                                                        >
                                                            Retirer
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>

                                {selectedEnsemble.ensembleRole === "ADMIN" && (
                                    <section className="ensemblePeopleSection">
                                        <div className="ensembleSectionHeader">
                                            <h3>Invitations en attente</h3>
                                            <span>{pendingInvitations.length}</span>
                                        </div>

                                        {pendingInvitations.length === 0 ? (
                                            <p className="ensembleDetailMuted">Aucune invitation en attente.</p>
                                        ) : (
                                            <div className="ensemblePeopleList">
                                                {pendingInvitations.map((invitation) => (
                                                    <div className="ensemblePersonRow" key={invitation.id}>
                                                        <div className="ensemblePersonAvatar">
                                                            <UserPlusIcon />
                                                        </div>
                                                        <div className="ensemblePersonInfo">
                                                            <strong>{invitation.email}</strong>
                                                            <span>{invitation.ensembleRoleLabel}</span>
                                                            <small>Code {invitation.inviteToken}</small>
                                                        </div>
                                                        <button
                                                            className="ensembleSmallDanger"
                                                            type="button"
                                                            disabled={isSubmitting}
                                                            onClick={() => handleCancelInvitation(invitation.id)}
                                                        >
                                                            Annuler
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </section>
                                )}

                                {selectedEnsemble.inviteCode && (
                                    <div className="ensembleInviteCodeBox">
                                        <span>Code invitation</span>
                                        <p>{selectedEnsemble.inviteCode}</p>
                                    </div>
                                )}

                                {selectedEnsemble.ensembleRole === "ADMIN" && (
                                    <form className="ensembleDialogForm" onSubmit={handleInviteSubmit}>
                                        <label>
                                            Inviter par email
                                            <input
                                                type="email"
                                                value={inviteForm.email}
                                                onChange={(event) => updateInviteForm("email", event.target.value)}
                                                required
                                            />
                                        </label>
                                        <label>
                                            Rôle dans l'ensemble
                                            <select
                                                value={inviteForm.ensembleRole}
                                                onChange={(event) => updateInviteForm("ensembleRole", event.target.value)}
                                            >
                                                {ensembleRoleOptions.map((role) => (
                                                    <option value={role.value} key={role.value}>
                                                        {role.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                        <button className="ensembleDialogSubmit" type="submit" disabled={isSubmitting}>
                                            {isSubmitting ? "Envoi..." : "Inviter"}
                                        </button>
                                    </form>
                                )}

                                <button
                                    className="ensembleDialogSecondary danger"
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={handleLeaveEnsemble}
                                >
                                    Quitter l'ensemble
                                </button>
                            </>
                        )}
                    </section>
                </div>
            )}
        </div>
    );
}

export default Ensembles;
