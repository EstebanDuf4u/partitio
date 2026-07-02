ALTER TABLE users
ADD COLUMN email_verified BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN email_verification_token TEXT,
ADD COLUMN email_verification_expires_at TIMESTAMPTZ;

UPDATE users SET email_verified = true;
