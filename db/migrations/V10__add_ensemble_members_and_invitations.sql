ALTER TABLE ensembles
ADD COLUMN invite_code VARCHAR(24),
ADD COLUMN created_by_user_id BIGINT;

UPDATE ensembles
SET invite_code = CASE id
    WHEN 1 THEN 'SAINTM01'
    WHEN 2 THEN 'VOIXSUD2'
    WHEN 3 THEN 'GOSPEL03'
    WHEN 4 THEN 'HORIZON4'
    ELSE UPPER(SUBSTRING(MD5(id::TEXT || name) FROM 1 FOR 8))
END
WHERE invite_code IS NULL;

ALTER TABLE ensembles
ALTER COLUMN invite_code SET NOT NULL;

ALTER TABLE ensembles
ADD CONSTRAINT ensembles_invite_code_unique UNIQUE (invite_code),
ADD CONSTRAINT ensembles_created_by_user_fk
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL;

CREATE TABLE ensemble_members (
    id BIGSERIAL primary key,
    ensemble_id BIGINT not null,
    user_id BIGINT not null,
    member_role TEXT not null,
    status TEXT not null DEFAULT 'active',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT ensemble_members_ensemble_fk
        FOREIGN KEY (ensemble_id) REFERENCES ensembles(id) ON DELETE CASCADE,
    CONSTRAINT ensemble_members_user_fk
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT ensemble_members_ensemble_user_unique UNIQUE (ensemble_id, user_id)
);

CREATE TABLE ensemble_invitations (
    id BIGSERIAL primary key,
    ensemble_id BIGINT not null,
    email TEXT not null,
    member_role TEXT not null DEFAULT 'Choriste',
    invite_token VARCHAR(64) not null,
    status TEXT not null DEFAULT 'pending',
    invited_by_user_id BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    responded_at TIMESTAMPTZ,
    CONSTRAINT ensemble_invitations_ensemble_fk
        FOREIGN KEY (ensemble_id) REFERENCES ensembles(id) ON DELETE CASCADE,
    CONSTRAINT ensemble_invitations_invited_by_user_fk
        FOREIGN KEY (invited_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT ensemble_invitations_token_unique UNIQUE (invite_token)
);

CREATE INDEX ensemble_members_user_idx ON ensemble_members(user_id);
CREATE INDEX ensemble_invitations_email_status_idx ON ensemble_invitations(LOWER(email), status);

INSERT INTO ensemble_members (ensemble_id, user_id, member_role, status)
SELECT e.id,
       u.id,
       e.member_role,
       CASE WHEN e.status = 'Pause' THEN 'paused' ELSE 'active' END
FROM ensembles e
CROSS JOIN users u
WHERE e.status <> 'Invitation'
ON CONFLICT (ensemble_id, user_id) DO NOTHING;

INSERT INTO ensemble_invitations (ensemble_id, email, member_role, invite_token, status)
SELECT e.id,
       u.email,
       e.member_role,
       CONCAT('INV', e.id, 'USER', u.id),
       'pending'
FROM ensembles e
CROSS JOIN users u
WHERE e.status = 'Invitation';
