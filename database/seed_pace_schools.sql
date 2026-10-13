-- Script untuk menambahkan daftar Sekolah SLB dan SNK ke sistem PACE
-- Password default yang digunakan di bawah ini adalah "Pace123!" yang sudah di-hash (bcrypt).
-- Hash untuk "Pace123!" (10 rounds): $2b$10$1SGPVQi8yHbEbVVJAS1Te.ty4t9BMywKjiEK9ZymnopwnNlNkb4XS

-- 1. Insert ke tabel 'users'
INSERT INTO users (email, password, role, is_approved, created_at) VALUES 
-- SLB
('slbn1_jayapura@pace.go.id', '$2b$10$1SGPVQi8yHbEbVVJAS1Te.ty4t9BMywKjiEK9ZymnopwnNlNkb4XS', 'sekolah_pace', true, NOW()),
('slbn_pembina_jayapura@pace.go.id', '$2b$10$1SGPVQi8yHbEbVVJAS1Te.ty4t9BMywKjiEK9ZymnopwnNlNkb4XS', 'sekolah_pace', true, NOW()),
('slbn_serui@pace.go.id', '$2b$10$1SGPVQi8yHbEbVVJAS1Te.ty4t9BMywKjiEK9ZymnopwnNlNkb4XS', 'sekolah_pace', true, NOW()),
('slbn_uri_waren_waropen@pace.go.id', '$2b$10$1SGPVQi8yHbEbVVJAS1Te.ty4t9BMywKjiEK9ZymnopwnNlNkb4XS', 'sekolah_pace', true, NOW()),
('slbn_saireri_biak@pace.go.id', '$2b$10$1SGPVQi8yHbEbVVJAS1Te.ty4t9BMywKjiEK9ZymnopwnNlNkb4XS', 'sekolah_pace', true, NOW()),
('sdlb_subyaki_fyadi_biak@pace.go.id', '$2b$10$1SGPVQi8yHbEbVVJAS1Te.ty4t9BMywKjiEK9ZymnopwnNlNkb4XS', 'sekolah_pace', true, NOW()),
('slb_abc_tunas_harapan_biak@pace.go.id', '$2b$10$1SGPVQi8yHbEbVVJAS1Te.ty4t9BMywKjiEK9ZymnopwnNlNkb4XS', 'sekolah_pace', true, NOW()),

-- SNK
('snk_sains_bahasa@pace.go.id', '$2b$10$1SGPVQi8yHbEbVVJAS1Te.ty4t9BMywKjiEK9ZymnopwnNlNkb4XS', 'sekolah_pace', true, NOW()),
('snk_olahraga@pace.go.id', '$2b$10$1SGPVQi8yHbEbVVJAS1Te.ty4t9BMywKjiEK9ZymnopwnNlNkb4XS', 'sekolah_pace', true, NOW()),
('snk_pariwisata@pace.go.id', '$2b$10$1SGPVQi8yHbEbVVJAS1Te.ty4t9BMywKjiEK9ZymnopwnNlNkb4XS', 'sekolah_pace', true, NOW()),
('snk_agrobisnis_agroteknologi@pace.go.id', '$2b$10$1SGPVQi8yHbEbVVJAS1Te.ty4t9BMywKjiEK9ZymnopwnNlNkb4XS', 'sekolah_pace', true, NOW()),
('snk_kemaritiman@pace.go.id', '$2b$10$1SGPVQi8yHbEbVVJAS1Te.ty4t9BMywKjiEK9ZymnopwnNlNkb4XS', 'sekolah_pace', true, NOW());


-- 2. Insert profil sekolah ke tabel 'pace_sekolah'
INSERT INTO pace_sekolah (user_id, nama_sekolah, jenis_sekolah, created_at, updated_at) VALUES 
-- SLB
((SELECT id FROM users WHERE email = 'slbn1_jayapura@pace.go.id'), 'SLB N 1 JAYAPURA', 'SLB', NOW(), NOW()),
((SELECT id FROM users WHERE email = 'slbn_pembina_jayapura@pace.go.id'), 'SLB N PEMBINA JAYAPURA', 'SLB', NOW(), NOW()),
((SELECT id FROM users WHERE email = 'slbn_serui@pace.go.id'), 'SLB N SERUI', 'SLB', NOW(), NOW()),
((SELECT id FROM users WHERE email = 'slbn_uri_waren_waropen@pace.go.id'), 'SLB N URI WAREN WAROPEN', 'SLB', NOW(), NOW()),
((SELECT id FROM users WHERE email = 'slbn_saireri_biak@pace.go.id'), 'SLB N SAIRERI BIAK', 'SLB', NOW(), NOW()),
((SELECT id FROM users WHERE email = 'sdlb_subyaki_fyadi_biak@pace.go.id'), 'SDLB SUBYAKI FYADI BIAK', 'SLB', NOW(), NOW()),
((SELECT id FROM users WHERE email = 'slb_abc_tunas_harapan_biak@pace.go.id'), 'SLB ABC TUNAS HARAPAN BIAK', 'SLB', NOW(), NOW()),

-- SNK
((SELECT id FROM users WHERE email = 'snk_sains_bahasa@pace.go.id'), 'SNK SAINS DAN BAHASA', 'SNK', NOW(), NOW()),
((SELECT id FROM users WHERE email = 'snk_olahraga@pace.go.id'), 'SNK OLAHRAGA', 'SNK', NOW(), NOW()),
((SELECT id FROM users WHERE email = 'snk_pariwisata@pace.go.id'), 'SNK PARIWISATA', 'SNK', NOW(), NOW()),
((SELECT id FROM users WHERE email = 'snk_agrobisnis_agroteknologi@pace.go.id'), 'SNK AGROBISNIS DAN AGROTEKNOLOGI', 'SNK', NOW(), NOW()),
((SELECT id FROM users WHERE email = 'snk_kemaritiman@pace.go.id'), 'SNK KEMARITIMAN', 'SNK', NOW(), NOW());
