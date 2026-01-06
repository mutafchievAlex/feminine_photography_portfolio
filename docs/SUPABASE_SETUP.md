# Supabase Setup Instructions

## Създаване на page_content таблица

Таблицата `page_content` е необходима за динамично редактиране на текстове.

### Стъпки:

1. Отвори Supabase Dashboard: https://supabase.com/dashboard/project/mamblumxbxnnnigexyma

2. Отиди на **SQL Editor** в лявото меню

3. Копирай и изпълни SQL кода от файла:
   `/workspaces/feminine_photography_portfolio/supabase/migrations/20251229_add_page_content.sql`

   ИЛИ използвай кода по-долу:

```sql
-- Create page_content table for dynamic content management
CREATE TABLE IF NOT EXISTS page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  language VARCHAR(5) NOT NULL DEFAULT 'en',
  page_name VARCHAR(50) NOT NULL DEFAULT 'about',
  section_name VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  UNIQUE(key, language, page_name)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_page_content_key ON page_content(key);
CREATE INDEX IF NOT EXISTS idx_page_content_language ON page_content(language);
CREATE INDEX IF NOT EXISTS idx_page_content_page ON page_content(page_name);

-- Enable RLS
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- Policy for viewing content (everyone can view)
CREATE POLICY "Allow viewing page content" ON page_content
  FOR SELECT USING (true);

-- Policy for updating content (only admins)
CREATE POLICY "Allow admins to update page content" ON page_content
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Policy for inserting content (only admins)
CREATE POLICY "Allow admins to insert page content" ON page_content
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_page_content_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update timestamp
CREATE TRIGGER page_content_update_timestamp
  BEFORE UPDATE ON page_content
  FOR EACH ROW
  EXECUTE FUNCTION update_page_content_timestamp();
```

4. Натисни **Run** или **Execute**

5. Провери дали таблицата е създадена:
   - Отиди на **Table Editor** в лявото меню
   - Търси `page_content` в списъка с таблици

6. Рефрешни страницата на приложението и тествай редактирането отново

## Проверка на грешки

Отвори браузърния console (F12) и търси:
- "Fetching page content for:" - показва заявките за зареждане
- "Update result:" - показва резултата от запазване
- Ако има грешка "relation does not exist" - таблицата не е създадена
- Ако има грешка "permission denied" - RLS политиките не са правилни
