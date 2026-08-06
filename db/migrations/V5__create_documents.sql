CREATE TYPE voice_type AS ENUM ('soprano', 'alto', 'tenor', 'basse', 'tout');

CREATE TABLE documents(
    id BIGSERIAL primary key,
	name TEXT not null,
	date_added date not null,
    date_modified date not null,
    document_type TEXT not null,
    voice_type voice_type not null,
	document_url varchar(500),
    piece_id BIGSERIAL not null,
    FOREIGN KEY (piece_id) REFERENCES pieces(id)
);

INSERT INTO documents (piece_id, name, date_added, date_modified, document_type, voice_type) VALUES
-- 1. Hallelujah (Leonard Cohen)
(1, 'Hallelujah - Partition complète', '2026-07-01', '2026-07-01', 'partition', 'tout'),
(1, 'Hallelujah - Voix soprano', '2026-07-01', '2026-07-01', 'partition', 'soprano'),
(1, 'Hallelujah - Paroles', '2026-07-01', '2026-07-01', 'paroles', 'tout'),

-- 2. Hier Encore (Charles Aznavour)
(2, 'Hier Encore - Partition alto', '2026-07-02', '2026-07-15', 'partition', 'alto'),
(2, 'Hier Encore - Partition tenor', '2026-07-02', '2026-07-15', 'partition', 'tenor'),

-- 3. I'm Done (Rutra)
(3, 'I''m Done - Paroles', '2026-07-03', '2026-07-03', 'paroles', 'soprano'),

-- 4. Freestyle du sale (Lorenzo)
(4, 'Freestyle du sale - Partition tenor', '2026-07-04', '2026-07-04', 'partition', 'tenor'),
(4, 'Freestyle du sale - Partition basse', '2026-07-04', '2026-07-10', 'partition', 'basse'),

-- 5. Je te promets (Johnny Hallyday)
(5, 'Je te promets - Partition complète', '2026-07-05', '2026-07-05', 'partition', 'tout'),

-- 6. La Bohème (Charles Aznavour)
(6, 'La Bohème - Partition soprano', '2026-07-06', '2026-07-06', 'partition', 'soprano'),
(6, 'La Bohème - Partition alto', '2026-07-06', '2026-07-06', 'partition', 'alto'),
(6, 'La Bohème - Paroles', '2026-07-06', '2026-07-20', 'paroles', 'tout'),

-- 7. Les Champs-Élysées (Joe Dassin)
(7, 'Les Champs-Élysées - Partition complète', '2026-07-07', '2026-07-07', 'partition', 'tout'),

-- 8. L'Envie (Johnny Hallyday)
(8, 'L''Envie - Partition tenor', '2026-07-08', '2026-07-08', 'partition', 'tenor'),
(8, 'L''Envie - Partition basse', '2026-07-08', '2026-07-08', 'partition', 'basse'),

-- 9. J'irai où tu iras (Céline Dion)
(9, 'J''irai où tu iras - Partition soprano', '2026-07-09', '2026-07-09', 'partition', 'soprano'),
(9, 'J''irai où tu iras - Partition alto', '2026-07-09', '2026-07-18', 'partition', 'alto');