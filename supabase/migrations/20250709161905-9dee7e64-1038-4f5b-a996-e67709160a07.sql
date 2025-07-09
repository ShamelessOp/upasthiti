-- Create sample sites
INSERT INTO public.sites (id, name, location, description, start_date, end_date, status, supervisor_id) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Sunrise Residential Complex', 'Downtown Mumbai, Maharashtra', 'Luxury residential towers with 200+ apartments', '2024-01-15', '2025-12-31', 'active', '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-446655440002', 'Tech Park Commercial Building', 'Whitefield, Bangalore', 'Modern office complex with co-working spaces', '2024-03-01', '2025-08-30', 'active', '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-446655440003', 'Metro Station Infrastructure', 'Connaught Place, Delhi', 'Underground metro station construction', '2024-02-01', '2025-06-30', 'active', '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-446655440004', 'Green Valley Housing', 'Pune, Maharashtra', 'Eco-friendly residential development', '2024-04-01', '2025-10-31', 'active', '550e8400-e29b-41d4-a716-446655440000');

-- Create sample workers
INSERT INTO public.workers (id, worker_id, name, contact_number, address, skills, daily_wage, joining_date, site_id, status) VALUES
-- Site 1 Workers (Sunrise Residential Complex)
('660e8400-e29b-41d4-a716-446655440001', 'WRK001', 'Rajesh Kumar', '+91-9876543210', 'Andheri East, Mumbai', ARRAY['Masonry', 'Concrete Work'], 800, '2024-01-20', '550e8400-e29b-41d4-a716-446655440001', 'active'),
('660e8400-e29b-41d4-a716-446655440002', 'WRK002', 'Priya Sharma', '+91-9876543211', 'Bandra West, Mumbai', ARRAY['Electrical Work', 'Wiring'], 950, '2024-01-25', '550e8400-e29b-41d4-a716-446655440001', 'active'),
('660e8400-e29b-41d4-a716-446655440003', 'WRK003', 'Mohammed Ali', '+91-9876543212', 'Kurla, Mumbai', ARRAY['Plumbing', 'Pipe Fitting'], 900, '2024-02-01', '550e8400-e29b-41d4-a716-446655440001', 'active'),
('660e8400-e29b-41d4-a716-446655440004', 'WRK004', 'Sunita Devi', '+91-9876543213', 'Thane, Mumbai', ARRAY['Painting', 'Finishing'], 700, '2024-02-10', '550e8400-e29b-41d4-a716-446655440001', 'active'),
('660e8400-e29b-41d4-a716-446655440005', 'WRK005', 'Arjun Singh', '+91-9876543214', 'Goregaon, Mumbai', ARRAY['Carpentry', 'Wood Work'], 850, '2024-02-15', '550e8400-e29b-41d4-a716-446655440001', 'active'),

-- Site 2 Workers (Tech Park Commercial Building)
('660e8400-e29b-41d4-a716-446655440006', 'WRK006', 'Lakshmi Nair', '+91-9876543215', 'Indiranagar, Bangalore', ARRAY['Electrical Work', 'HVAC'], 1000, '2024-03-05', '550e8400-e29b-41d4-a716-446655440002', 'active'),
('660e8400-e29b-41d4-a716-446655440007', 'WRK007', 'Vikash Reddy', '+91-9876543216', 'Koramangala, Bangalore', ARRAY['Steel Work', 'Welding'], 1100, '2024-03-10', '550e8400-e29b-41d4-a716-446655440002', 'active'),
('660e8400-e29b-41d4-a716-446655440008', 'WRK008', 'Deepika Rao', '+91-9876543217', 'Whitefield, Bangalore', ARRAY['Masonry', 'Tile Work'], 800, '2024-03-15', '550e8400-e29b-41d4-a716-446655440002', 'active'),
('660e8400-e29b-41d4-a716-446655440009', 'WRK009', 'Ravi Chandra', '+91-9876543218', 'Electronic City, Bangalore', ARRAY['Plumbing', 'HVAC'], 950, '2024-03-20', '550e8400-e29b-41d4-a716-446655440002', 'active'),

-- Site 3 Workers (Metro Station Infrastructure)
('660e8400-e29b-41d4-a716-446655440010', 'WRK010', 'Sanjay Gupta', '+91-9876543219', 'Karol Bagh, Delhi', ARRAY['Excavation', 'Heavy Machinery'], 1200, '2024-02-05', '550e8400-e29b-41d4-a716-446655440003', 'active'),
('660e8400-e29b-41d4-a716-446655440011', 'WRK011', 'Meera Joshi', '+91-9876543220', 'Lajpat Nagar, Delhi', ARRAY['Concrete Work', 'Structural'], 1000, '2024-02-10', '550e8400-e29b-41d4-a716-446655440003', 'active'),
('660e8400-e29b-41d4-a716-446655440012', 'WRK012', 'Amit Verma', '+91-9876543221', 'Janakpuri, Delhi', ARRAY['Steel Work', 'Reinforcement'], 1150, '2024-02-15', '550e8400-e29b-41d4-a716-446655440003', 'active'),
('660e8400-e29b-41d4-a716-446655440013', 'WRK013', 'Pooja Agarwal', '+91-9876543222', 'Rohini, Delhi', ARRAY['Electrical Work', 'Safety'], 900, '2024-02-20', '550e8400-e29b-41d4-a716-446655440003', 'active'),

-- Site 4 Workers (Green Valley Housing)
('660e8400-e29b-41d4-a716-446655440014', 'WRK014', 'Kiran Patil', '+91-9876543223', 'Kothrud, Pune', ARRAY['Masonry', 'Green Building'], 850, '2024-04-05', '550e8400-e29b-41d4-a716-446655440004', 'active'),
('660e8400-e29b-41d4-a716-446655440015', 'WRK015', 'Anil Deshmukh', '+91-9876543224', 'Hadapsar, Pune', ARRAY['Solar Installation', 'Electrical Work'], 1000, '2024-04-10', '550e8400-e29b-41d4-a716-446655440004', 'active');

-- Create sample attendance records for the past 2 months
INSERT INTO public.attendance (id, worker_id, site_id, date, check_in_time, check_out_time, status, overtime_hours, created_by, updated_by) VALUES
-- Recent attendance (last 30 days) - varied patterns
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '2024-06-01', '08:00', '17:00', 'present', 1, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000'),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '2024-06-02', '08:15', '17:30', 'present', 1.5, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000'),
('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '2024-06-03', NULL, NULL, 'absent', 0, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000'),
('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '2024-06-01', '08:30', '17:15', 'present', 0.5, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000'),
('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '2024-06-01', '08:00', '18:00', 'present', 2, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000'),
-- Add more recent attendance records
('770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', '2024-06-01', '09:00', '18:30', 'present', 1.5, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000'),
('770e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002', '2024-06-01', '08:45', '17:45', 'present', 1, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000'),
('770e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003', '2024-06-01', '07:30', '19:00', 'present', 3, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000');

-- Create demo user profile (we'll create the auth user via application code)
INSERT INTO public.profiles (id, name, role, created_by, site_ids) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Demo Admin User', 'admin', '550e8400-e29b-41d4-a716-446655440000', ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004']);