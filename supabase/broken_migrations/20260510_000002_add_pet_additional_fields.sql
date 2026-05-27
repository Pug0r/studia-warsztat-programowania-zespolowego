-- Add additional fields to pets table for personality, ideal home, special needs, and image gallery
ALTER TABLE pets ADD COLUMN IF NOT EXISTS personality text;
ALTER TABLE pets ADD COLUMN IF NOT EXISTS ideal_home text;
ALTER TABLE pets ADD COLUMN IF NOT EXISTS special_needs text;
ALTER TABLE pets ADD COLUMN IF NOT EXISTS image_urls text[];