-- Create submissions table for client questionnaire
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Step 1: Basic Information
  full_name TEXT NOT NULL,
  company_name TEXT,
  role_position TEXT,
  work_email TEXT NOT NULL,
  phone TEXT,
  website_links TEXT,
  
  -- Step 2: Services Required
  services TEXT[] NOT NULL,
  services_other TEXT,
  
  -- Step 3: Video/Motion Graphics (conditional)
  video_count_option TEXT,
  video_custom_requirement TEXT,
  video_usage_platforms TEXT[],
  has_raw_footage TEXT,
  
  -- Step 4: Web/Software Development (conditional)
  web_services TEXT[],
  chatbot_platform TEXT,
  has_existing_website TEXT,
  existing_website_link TEXT,
  website_purpose TEXT,
  
  -- Step 5: Brand Identity (conditional)
  brand_services TEXT[],
  brand_name TEXT,
  brand_files_link TEXT,
  
  -- Step 6: Meta Ads (conditional)
  ad_goal TEXT,
  ad_budget TEXT,
  ad_target_locations TEXT,
  
  -- Step 7: Creative Direction
  favorite_colors TEXT,
  business_model TEXT,
  future_vision TEXT,
  inspiration_brands TEXT,
  how_heard TEXT
);

-- Enable RLS
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert submissions (public form)
CREATE POLICY "Anyone can submit form"
  ON public.submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only service role can select (for admin dashboard via backend)
CREATE POLICY "Service role can view all submissions"
  ON public.submissions
  FOR SELECT
  TO service_role
  USING (true);