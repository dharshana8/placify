-- Fix existing users with NULL isActive values
UPDATE users SET is_active = true WHERE is_active IS NULL;
