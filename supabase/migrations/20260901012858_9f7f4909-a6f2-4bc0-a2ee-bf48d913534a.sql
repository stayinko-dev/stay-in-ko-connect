-- 1. helpers table
CREATE TABLE public.helpers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  avatar_url text,
  district text NOT NULL,
  city text NOT NULL,
  languages text[] NOT NULL DEFAULT '{}',
  services text[] NOT NULL DEFAULT '{}',
  rating numeric NOT NULL DEFAULT 0,
  reviews_count integer NOT NULL DEFAULT 0,
  jobs_done integer NOT NULL DEFAULT 0,
  id_verified boolean NOT NULL DEFAULT false,
  background_checked boolean NOT NULL DEFAULT false,
  hourly_rate integer NOT NULL DEFAULT 0,
  response_min integer NOT NULL DEFAULT 15,
  bio text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.helpers TO anon;
GRANT SELECT ON public.helpers TO authenticated;
GRANT ALL ON public.helpers TO service_role;

ALTER TABLE public.helpers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Helpers are viewable by everyone"
  ON public.helpers FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE TRIGGER update_helpers_updated_at
  BEFORE UPDATE ON public.helpers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. help_requests link columns
ALTER TABLE public.help_requests
  ADD COLUMN IF NOT EXISTS helper_ref uuid REFERENCES public.helpers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS helper_name text,
  ADD COLUMN IF NOT EXISTS estimated_rate integer;

-- 3. messages / replies
CREATE TABLE public.help_request_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.help_requests(id) ON DELETE CASCADE,
  sender_role text NOT NULL CHECK (sender_role IN ('user','helper','system')),
  sender_id uuid,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_help_request_messages_request ON public.help_request_messages(request_id, created_at);

GRANT SELECT, INSERT ON public.help_request_messages TO authenticated;
GRANT ALL ON public.help_request_messages TO service_role;

ALTER TABLE public.help_request_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners view messages of own requests"
  ON public.help_request_messages FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.help_requests r
    WHERE r.id = help_request_messages.request_id AND r.user_id = auth.uid()
  ));

CREATE POLICY "Owners send messages on own requests"
  ON public.help_request_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_role = 'user'
    AND sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.help_requests r
      WHERE r.id = help_request_messages.request_id AND r.user_id = auth.uid()
    )
  );

-- 4. automatic helper acknowledgement on new request
CREATE OR REPLACE FUNCTION public.create_help_request_ack()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  h public.helpers%ROWTYPE;
  reply text;
BEGIN
  IF NEW.details IS NOT NULL AND length(trim(NEW.details)) > 0 THEN
    INSERT INTO public.help_request_messages (request_id, sender_role, sender_id, body)
    VALUES (NEW.id, 'user', NEW.user_id, NEW.details);
  END IF;

  IF NEW.helper_ref IS NOT NULL THEN
    SELECT * INTO h FROM public.helpers WHERE id = NEW.helper_ref;
  END IF;

  IF h.id IS NOT NULL THEN
    reply := format(
      'Hi! This is %s. I got your %s request in %s. I usually reply within %s minutes and my rate is %s KRW/hour. %s Could you share your preferred date and time?',
      h.name, NEW.service, NEW.area, h.response_min, to_char(h.hourly_rate, 'FM999,999'),
      CASE WHEN NEW.urgent THEN 'I saw this is urgent, so I will prioritise it.' ELSE '' END
    );
    INSERT INTO public.help_request_messages (request_id, sender_role, body)
    VALUES (NEW.id, 'helper', reply);
  ELSE
    INSERT INTO public.help_request_messages (request_id, sender_role, body)
    VALUES (NEW.id, 'system', 'Your request was received. We are matching you with a verified helper and will reply shortly.');
  END IF;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.create_help_request_ack() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER trg_help_request_ack
  AFTER INSERT ON public.help_requests
  FOR EACH ROW EXECUTE FUNCTION public.create_help_request_ack();

-- 5. seed helpers
INSERT INTO public.helpers (slug, name, avatar_url, district, city, languages, services, rating, reviews_count, jobs_done, id_verified, background_checked, hourly_rate, response_min, bio) VALUES
('jiwoo-park','Jiwoo Park','https://i.pravatar.cc/240?u=jiwoo','Seongdong-gu','Seoul','{English,Korean,Japanese}','{hospital,gov,translation}',4.9,128,164,true,true,25000,8,'Hanyang Univ. grad. I handle hospital visits and ARC paperwork weekly.'),
('minho-lee','Minho Lee','https://i.pravatar.cc/240?u=minho','Seongdong-gu','Seoul','{English,Korean,Chinese}','{moving,contract,transport}',4.8,84,97,true,true,30000,12,'Move-in specialist around Wangsimni & Seongsu. Lease checks included.'),
('soyeon-kim','Soyeon Kim','https://i.pravatar.cc/240?u=soyeon','Seongdong-gu','Seoul','{English,Korean}','{sim,bank,life}',5.0,56,61,true,false,22000,6,'SIM + bank account in one afternoon. I know which branches speak English.'),
('daniel-cho','Daniel Cho','https://i.pravatar.cc/240?u=daniel','Jongno-gu','Seoul','{English,Korean}','{contract,translation,gov}',4.7,41,52,true,true,35000,15,'Business interpreter, contract and immigration documents.'),
('yuna-han','Yuna Han','https://i.pravatar.cc/240?u=yuna','Seodaemun-gu','Seoul','{English,Korean,Japanese}','{life,moving,sim}',4.9,73,88,true,true,24000,9,'Student-life helper near Yonsei & Ewha. Settling-in checklists.'),
('hyunwoo-seo','Hyunwoo Seo','https://i.pravatar.cc/240?u=hyunwoo','Gwangjin-gu','Seoul','{English,Korean}','{hospital,bank,transport}',4.8,38,44,true,false,20000,11,'Konkuk area. Clinic appointments and bank visits after 6pm too.'),
('eunji-nam','Eunji Nam','https://i.pravatar.cc/240?u=eunji','Gangnam-gu','Seoul','{English,Korean,Chinese}','{bank,gov,contract}',4.9,152,190,true,true,33000,7,'Ex-bank teller. Accounts, cards, and rental contracts.'),
('taeyang-ryu','Taeyang Ryu','https://i.pravatar.cc/240?u=taeyang','Mapo-gu','Seoul','{English,Korean}','{sim,transport,life}',4.6,29,33,true,false,19000,14,'Hongdae local. Phone plans, T-money, and neighborhood tours.'),
('hana-jung','Hana Jung','https://i.pravatar.cc/240?u=hana','Dongdaemun-gu','Seoul','{English,Korean}','{hospital,translation,moving}',4.8,64,79,true,true,26000,10,'Medical interpreting at university hospitals in eastern Seoul.'),
('jaewon-oh','Jaewon Oh','https://i.pravatar.cc/240?u=jaewon','Haeundae-gu','Busan','{English,Korean}','{life,transport,sim}',4.7,47,55,true,true,21000,13,'Busan settling-in help, from SIM cards to beach-side apartments.'),
('mina-seo','Mina Seo','https://i.pravatar.cc/240?u=mina','Yuseong-gu','Daejeon','{English,Korean}','{gov,bank,life}',4.8,35,42,true,true,20000,10,'KAIST/CNU area. Immigration office runs and bank setup for researchers.'),
('junho-baek','Junho Baek','https://i.pravatar.cc/240?u=junho','Buk-gu','Gwangju','{English,Korean}','{moving,transport,translation}',4.6,22,27,true,false,18000,16,'Chonnam Univ. area moving help and on-site interpreting.');