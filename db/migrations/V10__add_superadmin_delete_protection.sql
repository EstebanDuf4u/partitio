CREATE OR REPLACE FUNCTION superadmin_delete_protection()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF OLD.is_admin IS TRUE THEN
        RAISE EXCEPTION 'Impossible de supprimer un super admin.';
    END IF;

    RETURN OLD;
END;
$$;

CREATE TRIGGER superadmin_delete_protection
BEFORE DELETE ON users
FOR EACH ROW
EXECUTE FUNCTION trigger_superadmin_delete_protection();