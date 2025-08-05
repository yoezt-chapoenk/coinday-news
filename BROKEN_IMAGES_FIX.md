# Perbaikan Gambar Artikel yang Rusak

## Masalah
Terdapat 53 artikel dengan gambar yang rusak dari domain `replicate.delivery`. Gambar-gambar ini mengembalikan error 404 dan tidak dapat ditampilkan.

## Penyebab
- URL gambar dari `replicate.delivery` sudah tidak valid atau expired
- Gambar-gambar ini kemungkinan dihasilkan oleh AI image generator yang memiliki masa berlaku terbatas

## Solusi

### Opsi 1: Manual via Supabase Dashboard (Direkomendasikan)
1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda
3. Navigasi ke **SQL Editor**
4. Jalankan script SQL berikut:

```sql
-- Lihat jumlah gambar rusak
SELECT COUNT(*) as total_broken_images
FROM news_articles 
WHERE image_url LIKE '%replicate.delivery%';

-- Update gambar Bitcoin
UPDATE news_articles 
SET image_url = 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&h=400&fit=crop&auto=format'
WHERE image_url LIKE '%replicate.delivery%'
AND (categories::text ILIKE '%bitcoin%' OR categories::text ILIKE '%btc%');

-- Update gambar Ethereum
UPDATE news_articles 
SET image_url = 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=400&fit=crop&auto=format'
WHERE image_url LIKE '%replicate.delivery%'
AND (categories::text ILIKE '%ethereum%' OR categories::text ILIKE '%eth%');

-- Update gambar DeFi
UPDATE news_articles 
SET image_url = 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop&auto=format'
WHERE image_url LIKE '%replicate.delivery%'
AND (categories::text ILIKE '%defi%' OR categories::text ILIKE '%decentralized%');

-- Update gambar NFT
UPDATE news_articles 
SET image_url = 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=800&h=400&fit=crop&auto=format'
WHERE image_url LIKE '%replicate.delivery%'
AND (categories::text ILIKE '%nft%' OR categories::text ILIKE '%token%');

-- Update gambar Crypto
UPDATE news_articles 
SET image_url = 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=800&h=400&fit=crop&auto=format'
WHERE image_url LIKE '%replicate.delivery%'
AND (categories::text ILIKE '%crypto%' OR categories::text ILIKE '%currency%');

-- Update gambar Blockchain
UPDATE news_articles 
SET image_url = 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&h=400&fit=crop&auto=format'
WHERE image_url LIKE '%replicate.delivery%'
AND (categories::text ILIKE '%blockchain%' OR categories::text ILIKE '%chain%');

-- Update sisanya dengan gambar default
UPDATE news_articles 
SET image_url = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop&auto=format'
WHERE image_url LIKE '%replicate.delivery%';

-- Verifikasi perbaikan
SELECT COUNT(*) as remaining_broken_images
FROM news_articles 
WHERE image_url LIKE '%replicate.delivery%';
```

### Opsi 2: Menggunakan Script (Memerlukan Service Role Key)
Jika Anda memiliki service role key:

1. Tambahkan service role key ke `.env.local`:
```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

2. Jalankan script:
```bash
node scripts/fix-broken-images-admin.js
```

## Gambar Pengganti
Script akan mengganti gambar rusak dengan gambar yang sesuai berdasarkan kategori:

- **Bitcoin**: Gambar Bitcoin dari Unsplash
- **Ethereum**: Gambar Ethereum dari Unsplash  
- **DeFi**: Gambar DeFi dari Unsplash
- **NFT**: Gambar NFT dari Unsplash
- **Crypto**: Gambar cryptocurrency umum
- **Blockchain**: Gambar blockchain technology
- **Default**: Gambar cryptocurrency umum untuk kategori lainnya

## Pencegahan di Masa Depan

1. **Validasi URL**: Implementasikan validasi URL gambar sebelum menyimpan ke database
2. **Backup Images**: Simpan salinan gambar di Supabase Storage atau CDN yang reliable
3. **Monitoring**: Buat sistem monitoring untuk mendeteksi gambar rusak secara otomatis
4. **Fallback Mechanism**: Pastikan komponen `ArticleImage` memiliki fallback yang baik

## Status Saat Ini
- ✅ Teridentifikasi 53 artikel dengan gambar rusak
- ✅ Script perbaikan telah dibuat
- ⏳ Menunggu eksekusi manual via Supabase Dashboard
- ⏳ Verifikasi hasil perbaikan

## File Terkait
- `scripts/fix-broken-images.sql` - Script SQL untuk perbaikan manual
- `scripts/fix-broken-images-admin.js` - Script Node.js (memerlukan service role)
- `scripts/fix-images-direct.js` - Script alternatif
- `src/components/ArticleImage.tsx` - Komponen dengan fallback mechanism
- `src/lib/types.ts` - Fungsi `buildSupabaseImageUrl` dengan logging

## Kontak
Jika mengalami kesulitan, silakan hubungi tim development untuk bantuan lebih lanjut.