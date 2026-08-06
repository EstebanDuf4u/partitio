CREATE TABLE ensembles (
    id BIGSERIAL primary key,
    name TEXT not null,
    ensemble_type TEXT not null,
    member_role TEXT not null,
    members_count INTEGER not null,
    pieces_count INTEGER not null,
    next_date TEXT not null,
    rehearsal_location TEXT,
    status TEXT not null,
    initials VARCHAR(8) not null,
    color VARCHAR(20) not null,
    date_added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO ensembles (
    name,
    ensemble_type,
    member_role,
    members_count,
    pieces_count,
    next_date,
    rehearsal_location,
    status,
    initials,
    color
) VALUES
('Chorale Saint-Martin', 'Chorale mixte', 'Chef de pupitre', 42, 18, 'Jeudi 18:30', 'Salle Berlioz', 'Actif', 'SM', 'green'),
('Les Voix du Sud', 'Ensemble vocal', 'Soprano', 24, 12, 'Samedi 10:00', 'Auditorium Sud', 'Invitation', 'VS', 'orange'),
('Atelier Gospel', 'Gospel', 'Alto', 31, 9, 'Mardi 19:15', 'Studio Gospel', 'Actif', 'AG', 'purple'),
('Quatuor Horizon', 'Petit ensemble', 'Tenor', 4, 7, 'Vendredi 20:00', 'Salle Horizon', 'Pause', 'QH', 'blue');
