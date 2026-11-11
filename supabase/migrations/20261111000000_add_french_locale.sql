-- Permite guardar el francés en las tablas de traducciones del CMS.
alter table public.ui_translation_overrides
  drop constraint if exists ui_translation_overrides_locale_check;
alter table public.ui_translation_overrides
  add constraint ui_translation_overrides_locale_check
  check (locale in ('es', 'en', 'de', 'fr'));

alter table public.content_translations
  drop constraint if exists content_translations_locale_check;
alter table public.content_translations
  add constraint content_translations_locale_check
  check (locale in ('en', 'de', 'fr'));
