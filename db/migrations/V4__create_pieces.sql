create table pieces (
	id BIGSERIAL primary key,
	title TEXT not null,
	artist TEXT not null,
	category TEXT not null,
	language TEXT not null,
	description TEXT not null,
	cover_url varchar(500)
);

INSERT INTO pieces (title, artist, category, language, description) VALUES
('Hallelujah', 'Leonard Cohen', 'Chorale', 'Anglais', 'Version originale du célèbre morceau de Leonard Cohen.'),
('Hier Encore', 'Charles Aznavour', 'Variété', 'Français', 'Classique de la chanson française.'),
('I''m Done', 'Rutra', 'Rap', 'Français', 'Morceau de rap contemporain.'),
('Freestyle du sale', 'Lorenzo', 'Rap', 'Français', 'Freestyle humoristique et énergique.'),
('Je te promets', 'Johnny Hallyday', 'Variété', 'Français', 'Grand classique de Johnny Hallyday.'),
('La Bohème', 'Charles Aznavour', 'Variété', 'Français', 'L''un des plus grands succès d''Aznavour.'),
('Les Champs-Élysées', 'Joe Dassin', 'Variété', 'Français', 'Chanson populaire française.'),
('L''Envie', 'Johnny Hallyday', 'Rock', 'Français', 'Titre rock incontournable.'),
('J''irai où tu iras', 'Céline Dion', 'Variété', 'Français', 'Duo célèbre de Céline Dion.');