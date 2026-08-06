ALTER TABLE ensemble_members
ADD COLUMN ensemble_role TEXT NOT NULL DEFAULT 'PARTICIPANT';

ALTER TABLE ensemble_invitations
ADD COLUMN ensemble_role TEXT NOT NULL DEFAULT 'PARTICIPANT';

UPDATE ensemble_members member
SET ensemble_role = 'ADMIN'
FROM ensembles ensemble
WHERE member.ensemble_id = ensemble.id
  AND ensemble.created_by_user_id IS NOT NULL
  AND member.user_id = ensemble.created_by_user_id;

ALTER TABLE ensemble_members
ADD CONSTRAINT ensemble_members_role_check
CHECK (ensemble_role IN ('ADMIN', 'PARTICIPANT'));

ALTER TABLE ensemble_invitations
ADD CONSTRAINT ensemble_invitations_role_check
CHECK (ensemble_role IN ('ADMIN', 'PARTICIPANT'));
