/**
 * Caden — all UI translations (Turkish default, German alternate).
 * Access via  t('section.key', lang)
 * Arrays and nested objects are supported — t() returns the raw value at any depth.
 */

// ─── Turkish (default) ────────────────────────────────────────────────────────
const tr = {
  today: {
    title: 'Caden',
    remaining: 'kalan',
    done: 'tamamlandı',
  },

  tasks: {
    empty: 'Henüz görev yok. Yukarıdan ekle.',
    done_heading: 'Tamamlandı',
    add_placeholder: 'Görev ekle…',
    add_button: 'Ekle',
    aria_complete: 'Tamamlandı olarak işaretle',
    aria_incomplete: 'Tamamlanmadı olarak işaretle',
    aria_delete: 'Görevi sil',
  },

  calendar: {
    title: 'Takvim',
    today: 'Bugün',
    upcoming_heading: 'Yaklaşan · 7 gün',
    upcoming_empty: 'Önümüzdeki 7 günde etkinlik yok.',
    aria_delete: 'Etkinliği sil',
    aria_prev: 'Önceki ay',
    aria_next: 'Sonraki ay',
    type_task: 'görev',
    type_event: 'etkinlik',
    // Short column headers: Sun Mon Tue Wed Thu Fri Sat
    day_headers: ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'],
    // Full day names keyed by English name (used in DraftPlanView)
    days: {
      Monday: 'Pazartesi',
      Tuesday: 'Salı',
      Wednesday: 'Çarşamba',
      Thursday: 'Perşembe',
      Friday: 'Cuma',
      Saturday: 'Cumartesi',
      Sunday: 'Pazar',
    },
  },

  event_form: {
    title: 'Yeni Etkinlik',
    field_title: 'Başlık',
    field_title_placeholder: 'Etkinlik başlığı…',
    field_date: 'Tarih',
    field_time: 'Saat',
    optional: '(isteğe bağlı)',
    field_type: 'Tür',
    type_event: 'Etkinlik',
    type_task: 'Görev',
    field_notes: 'Notlar',
    field_notes_placeholder: 'Ek detaylar…',
    cancel: 'İptal',
    save: 'Kaydet',
  },

  notifications: {
    banner_text: 'Görev hatırlatmaları almak için bildirimleri etkinleştirin.',
    banner_cta: 'Etkinleştir',
  },

  nav: {
    today: 'Bugün',
    calendar: 'Takvim',
    plan: 'Plan',
    settings: 'Ayarlar',
  },

  ai: {
    title: 'Haftalık Plan',
    placeholder: 'Bu hafta yapılacaklar listeni yaz — her satıra bir görev veya serbest metin...',
    button_plan: 'Haftamı Planla',
    button_planning: 'Planlanıyor…',
    no_key_heading: 'API Anahtarı Gerekli',
    no_key_body: 'Yapay zeka özelliğini kullanmak için Gemini API anahtarınızı Ayarlar sayfasına girin.',
    no_key_cta: 'Ayarlara Git',
    draft_heading: 'Taslak Plan',
    draft_week: 'Hafta',
    approve: 'Onayla ve Ekle',
    reset: 'Sıfırla',
    approved_toast: 'Görevler eklendi!',
    difficulty_label: 'Zorluk',
    empty_day: 'Bu gün için görev yok',
    day_total: 'Toplam zorluk',
    error_network: 'Ağ hatası. İnternet bağlantınızı kontrol edin.',
    error_auth: 'API anahtarı geçersiz. Lütfen Ayarlar sayfasından kontrol edin.',
    error_rate_limit: 'İstek sınırı aşıldı. Lütfen birkaç dakika bekleyin.',
    error_parse: 'Yapay zeka geçersiz bir yanıt döndürdü. Lütfen tekrar deneyin.',
    error_generic: 'Bir hata oluştu. Lütfen tekrar deneyin.',
  },

  settings: {
    title: 'Ayarlar',
    language_label: 'Dil',
    language_tr: 'Türkçe',
    language_de: 'Deutsch',
    api_key_label: 'Gemini API Anahtarı',
    api_key_placeholder: 'AIza...',
    api_key_hint: 'Anahtarınız yalnızca bu cihazda saklanır, hiçbir yere gönderilmez.',
    save: 'Kaydet',
    saved: 'Kaydedildi ✓',
    show: 'Göster',
    hide: 'Gizle',
  },
}

// ─── German ───────────────────────────────────────────────────────────────────
const de = {
  today: {
    title: 'Caden',
    remaining: 'verbleibend',
    done: 'erledigt',
  },

  tasks: {
    empty: 'Noch keine Aufgaben. Oben hinzufügen.',
    done_heading: 'Erledigt',
    add_placeholder: 'Aufgabe hinzufügen…',
    add_button: 'Hinzufügen',
    aria_complete: 'Als erledigt markieren',
    aria_incomplete: 'Als unerledigt markieren',
    aria_delete: 'Aufgabe löschen',
  },

  calendar: {
    title: 'Kalender',
    today: 'Heute',
    upcoming_heading: 'Kommend · 7 Tage',
    upcoming_empty: 'Keine Veranstaltungen in den nächsten 7 Tagen.',
    aria_delete: 'Veranstaltung löschen',
    aria_prev: 'Vorheriger Monat',
    aria_next: 'Nächster Monat',
    type_task: 'Aufgabe',
    type_event: 'Termin',
    day_headers: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    days: {
      Monday: 'Montag',
      Tuesday: 'Dienstag',
      Wednesday: 'Mittwoch',
      Thursday: 'Donnerstag',
      Friday: 'Freitag',
      Saturday: 'Samstag',
      Sunday: 'Sonntag',
    },
  },

  event_form: {
    title: 'Neuer Termin',
    field_title: 'Titel',
    field_title_placeholder: 'Terminbezeichnung…',
    field_date: 'Datum',
    field_time: 'Uhrzeit',
    optional: '(optional)',
    field_type: 'Typ',
    type_event: 'Termin',
    type_task: 'Aufgabe',
    field_notes: 'Notizen',
    field_notes_placeholder: 'Weitere Details…',
    cancel: 'Abbrechen',
    save: 'Speichern',
  },

  notifications: {
    banner_text: 'Benachrichtigungen aktivieren für Aufgabenerinnerungen.',
    banner_cta: 'Aktivieren',
  },

  nav: {
    today: 'Heute',
    calendar: 'Kalender',
    plan: 'Plan',
    settings: 'Einstellungen',
  },

  ai: {
    title: 'Wochenplan',
    placeholder: 'Schreibe deine Aufgaben für diese Woche — eine pro Zeile oder als Fließtext...',
    button_plan: 'Woche planen',
    button_planning: 'Wird geplant…',
    no_key_heading: 'API-Schlüssel erforderlich',
    no_key_body: 'Gib deinen Gemini API-Schlüssel in den Einstellungen ein, um die KI-Funktion zu nutzen.',
    no_key_cta: 'Zu den Einstellungen',
    draft_heading: 'Planungsentwurf',
    draft_week: 'Woche',
    approve: 'Bestätigen & Hinzufügen',
    reset: 'Zurücksetzen',
    approved_toast: 'Aufgaben hinzugefügt!',
    difficulty_label: 'Schwierigkeit',
    empty_day: 'Keine Aufgaben für diesen Tag',
    day_total: 'Gesamtschwierigkeit',
    error_network: 'Netzwerkfehler. Bitte Internetverbindung prüfen.',
    error_auth: 'Ungültiger API-Schlüssel. Bitte in den Einstellungen prüfen.',
    error_rate_limit: 'Anfragelimit überschritten. Bitte einige Minuten warten.',
    error_parse: 'KI hat eine ungültige Antwort zurückgegeben. Bitte erneut versuchen.',
    error_generic: 'Ein Fehler ist aufgetreten. Bitte erneut versuchen.',
  },

  settings: {
    title: 'Einstellungen',
    language_label: 'Sprache',
    language_tr: 'Türkçe',
    language_de: 'Deutsch',
    api_key_label: 'Gemini API-Schlüssel',
    api_key_placeholder: 'AIza...',
    api_key_hint: 'Dein Schlüssel wird nur auf diesem Gerät gespeichert und nirgendwo gesendet.',
    save: 'Speichern',
    saved: 'Gespeichert ✓',
    show: 'Anzeigen',
    hide: 'Verbergen',
  },
}

// ─── Exports ──────────────────────────────────────────────────────────────────
export const translations = { tr, de }

/**
 * Maps language code to BCP-47 locale string for toLocaleDateString() etc.
 */
export const LOCALE_MAP = { tr: 'tr-TR', de: 'de-DE' }

/**
 * Look up a dot-separated key. Returns the value at any depth — string, array, or object.
 * Falls back to Turkish if the key is missing in the requested language.
 * Falls back to the key string itself if missing in both languages.
 *
 * Examples:
 *   t('tasks.add_button', 'de')            → 'Hinzufügen'
 *   t('calendar.day_headers', 'tr')        → ['Pz','Pt','Sa','Ça','Pe','Cu','Ct']
 *   t('calendar.days.Monday', 'de')        → 'Montag'
 */
export function t(key, lang = 'tr') {
  const parts = key.split('.')
  const primary   = translations[lang]   ?? translations.tr
  const fallback  = translations.tr

  const fromPrimary  = parts.reduce((o, p) => o?.[p], primary)
  if (fromPrimary !== undefined && fromPrimary !== null) return fromPrimary

  const fromFallback = parts.reduce((o, p) => o?.[p], fallback)
  if (fromFallback !== undefined && fromFallback !== null) return fromFallback

  return key   // last resort: return the key itself
}
