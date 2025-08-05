-- SQL Script to fix broken replicate.delivery images
-- Run this in Supabase SQL Editor with admin privileges

-- First, let's see how many broken images we have
SELECT 
    COUNT(*) as total_broken_images,
    COUNT(DISTINCT categories) as unique_categories
FROM news_articles 
WHERE image_url LIKE '%replicate.delivery%';

-- Show some examples of broken images
SELECT 
    id,
    rewritten_title,
    image_url,
    categories
FROM news_articles 
WHERE image_url LIKE '%replicate.delivery%'
ORDER BY created_at DESC
LIMIT 10;

-- Update broken images with appropriate fallback images based on categories
-- Bitcoin related articles
UPDATE news_articles 
SET image_url = 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&h=400&fit=crop&auto=format'
WHERE image_url LIKE '%replicate.delivery%'
AND (categories::text ILIKE '%bitcoin%' OR categories::text ILIKE '%btc%');

-- Ethereum related articles
UPDATE news_articles 
SET image_url = 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=400&fit=crop&auto=format'
WHERE image_url LIKE '%replicate.delivery%'
AND (categories::text ILIKE '%ethereum%' OR categories::text ILIKE '%eth%');

-- DeFi related articles
UPDATE news_articles 
SET image_url = 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop&auto=format'
WHERE image_url LIKE '%replicate.delivery%'
AND (categories::text ILIKE '%defi%' OR categories::text ILIKE '%decentralized%');

-- NFT related articles
UPDATE news_articles 
SET image_url = 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=800&h=400&fit=crop&auto=format'
WHERE image_url LIKE '%replicate.delivery%'
AND (categories::text ILIKE '%nft%' OR categories::text ILIKE '%token%');

-- Crypto related articles
UPDATE news_articles 
SET image_url = 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=800&h=400&fit=crop&auto=format'
WHERE image_url LIKE '%replicate.delivery%'
AND (categories::text ILIKE '%crypto%' OR categories::text ILIKE '%currency%');

-- Blockchain related articles
UPDATE news_articles 
SET image_url = 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&h=400&fit=crop&auto=format'
WHERE image_url LIKE '%replicate.delivery%'
AND (categories::text ILIKE '%blockchain%' OR categories::text ILIKE '%chain%');

-- Update remaining articles with default fallback image
UPDATE news_articles 
SET image_url = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop&auto=format'
WHERE image_url LIKE '%replicate.delivery%';

-- Verify the fix
SELECT 
    COUNT(*) as remaining_broken_images
FROM news_articles 
WHERE image_url LIKE '%replicate.delivery%';

-- Show updated articles
SELECT 
    id,
    rewritten_title,
    image_url,
    categories,
    updated_at
FROM news_articles 
WHERE image_url LIKE '%images.unsplash.com%'
ORDER BY updated_at DESC
LIMIT 10;