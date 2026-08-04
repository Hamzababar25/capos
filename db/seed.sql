-- Seed Capos articles catalog (idempotent upsert)
insert into public.articles (
  id, slug, title, subtitle, excerpt, body,
  event_type, event_label, price_cents, currency,
  cover_image, gallery, pages, format, featured, published_at, active
) values
(
  'art_wedding_morning',
  'wedding-morning-ritual',
  'The Wedding Morning Ritual',
  'How Capo''s turns the quietest hour into the most memorable.',
  'A field guide to pouring for bridal parties — timing, menu pairing, and the rose saffron latte that guests still talk about.',
  array[
    'Weddings ask for more than coffee. They ask for presence — a station that feels like a gift, not a vendor table.',
    'In this guide we walk through the Capo''s wedding morning flow: load-in windows, guest-facing rituals, and the drinks that photograph as beautifully as they taste.',
    'You''ll get our sample run-of-show, pairing notes for South Asian and Italian menus, and the small details hosts always thank us for.'
  ],
  'Wedding', 'Long Island · May 2026', 1800, 'usd',
  '/capos1.PNG', array['/capos1.PNG', '/capos4.jpg', '/capos-3.PNG'],
  28, 'Digital PDF', true, '2026-05-12', true
),
(
  'art_corporate_playbook',
  'corporate-activation-playbook',
  'Corporate Activation Playbook',
  'From lobby pours to loft launches — a cart that works the room.',
  'Layouts, staffing ratios, and brand-safe menus for product launches and conferences across Manhattan and Jersey City.',
  array[
    'Corporate events move fast. The coffee has to keep up — without looking rushed.',
    'This playbook covers floor plans for 50–500 guests, white-glove vs. high-volume service modes, and how we brand a cart without drowning the espresso.',
    'Includes checklists for AV teams, catering captains, and the “one more latte” moment every founder requests.'
  ],
  'Corporate', 'Studio 47 · April 2026', 2400, 'usd',
  '/capos-2.PNG', array['/capos-2.PNG', '/capos3.PNG', '/cup.PNG'],
  36, 'Digital Guide', true, '2026-04-18', true
),
(
  'art_popup_notes',
  'popup-cart-field-notes',
  'Pop-up Cart Field Notes',
  'Cars N'' Coffee, collabs, and the art of a morning crowd.',
  'Lessons from the Namkeen collab — line flow, weather contingencies, and drinks built for outdoor mornings.',
  array[
    'A pop-up is a living organism. Weather shifts, lines swell, and the playlist matters more than you''d think.',
    'These field notes capture what we learned pouring beside Namkeen — from cold-foam logistics to keeping the cart beautiful under a Jersey sun.',
    'Use it for markets, openings, and any morning where hospitality has to feel effortless.'
  ],
  'Pop-up', 'Lake Hiawatha · May 2026', 1400, 'usd',
  '/collab.jpeg', array['/collab.jpeg', '/capos2.PNG', '/nigge.jpg'],
  18, 'Digital PDF', false, '2026-05-10', true
),
(
  'art_cultures_essay',
  'marriage-of-cultures',
  'A Marriage of Cultures',
  'Yemeni, Italian, South Asian — the essay behind the cup.',
  'An editorial piece on heritage, flavour, and why Capo''s refuses to pick a single origin story.',
  array[
    'Capo''s was never meant to be one culture in a cup. It was meant to be a conversation.',
    'This essay traces the flavours we carry — Yemeni coffee tradition, Italian espresso craft, and the bold sweetness of South Asian hospitality — and how they meet on a cart in New Jersey.',
    'Part manifesto, part tasting journal. For hosts, collaborators, and anyone who asks where the rose comes from.'
  ],
  'Essay', 'Editorial · Est. 2025', 1200, 'usd',
  '/capos.PNG', array['/capos.PNG', '/capos-3.PNG', '/logo.png'],
  22, 'Digital PDF', false, '2026-03-01', true
)
on conflict (id) do update set
  slug = excluded.slug,
  title = excluded.title,
  subtitle = excluded.subtitle,
  excerpt = excluded.excerpt,
  body = excluded.body,
  event_type = excluded.event_type,
  event_label = excluded.event_label,
  price_cents = excluded.price_cents,
  currency = excluded.currency,
  cover_image = excluded.cover_image,
  gallery = excluded.gallery,
  pages = excluded.pages,
  format = excluded.format,
  featured = excluded.featured,
  published_at = excluded.published_at,
  active = excluded.active,
  updated_at = now();
