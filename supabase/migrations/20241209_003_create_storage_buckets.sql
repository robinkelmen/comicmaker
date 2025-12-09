-- Create storage bucket for character images
INSERT INTO storage.buckets (id, name, public)
VALUES ('character-images', 'character-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for generated panel images
INSERT INTO storage.buckets (id, name, public)
VALUES ('panel-images', 'panel-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy for character-images bucket
CREATE POLICY "Allow public read access to character images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'character-images');

CREATE POLICY "Allow public insert access to character images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'character-images');

CREATE POLICY "Allow public update access to character images"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'character-images')
  WITH CHECK (bucket_id = 'character-images');

CREATE POLICY "Allow public delete access to character images"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'character-images');

-- Create policy for panel-images bucket
CREATE POLICY "Allow public read access to panel images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'panel-images');

CREATE POLICY "Allow public insert access to panel images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'panel-images');

CREATE POLICY "Allow public update access to panel images"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'panel-images')
  WITH CHECK (bucket_id = 'panel-images');

CREATE POLICY "Allow public delete access to panel images"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'panel-images');
