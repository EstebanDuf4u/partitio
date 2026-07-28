UPDATE pieces
SET cover_url = CASE title
    WHEN 'Hallelujah' THEN '/uploads/covers/hallelujah.jpg'
    WHEN 'Hier Encore' THEN '/uploads/covers/hier-encore.jpg'
    WHEN 'I''m Done' THEN '/uploads/covers/im-done.jpg'
    WHEN 'Freestyle du sale' THEN '/uploads/covers/freestyle-du-sale.jpg'
    WHEN 'Je te promets' THEN '/uploads/covers/je-te-promets.jpg'
    WHEN 'La Bohème' THEN '/uploads/covers/la-boheme.jpg'
    WHEN 'Les Champs-Élysées' THEN '/uploads/covers/les-champs-elysees.jpg'
    WHEN 'L''Envie' THEN '/uploads/covers/l-envie.jpg'
    WHEN 'J''irai où tu iras' THEN '/uploads/covers/j-irai-ou-tu-iras.jpg'
END
WHERE title IN (
    'Hallelujah',
    'Hier Encore',
    'I''m Done',
    'Freestyle du sale',
    'Je te promets',
    'La Bohème',
    'Les Champs-Élysées',
    'L''Envie',
    'J''irai où tu iras'
);