import { getSanityClient, isSanityConfigured } from './sanity';

export interface MenuDrink {
  name: string;
  desc: string;
  origin?: string;
  ingredients?: string;
  tag?: string | null;
  image?: string;
  featured?: boolean;
  category: 'signature' | 'refresher';
}

export interface CateringMenu {
  signatures: MenuDrink[];
  refreshers: MenuDrink[];
  essentialFlavors: string[];
  addOns: string[];
  featured: MenuDrink | null;
}

/** Fallback = current hardcoded site menu */
export const FALLBACK_MENU: CateringMenu = {
  signatures: [
    {
      name: 'Crème Brûlée Latte',
      desc: 'Rich espresso blended with velvety milk, layered with a cloud of golden caramel custard, tucked under a decadent hard-top of candied caramelised sugar.',
      origin: 'French pâtisserie meets Italian espresso',
      ingredients: 'Espresso · Milk · Caramel custard · Torched sugar',
      image: '/creme-blu.jpg',
      category: 'signature',
    },
    {
      name: 'Rose Saffron Latte',
      desc: 'A luxurious floral blend of fragrant rose syrup and warm cardamom, finished with a cloud of sweet cold foam and topped with rose petals and saffron threads.',
      origin: 'A quiet nod to Persian tearooms',
      ingredients: 'Espresso · Rose syrup · Cardamom · Cold foam · Saffron',
      image: '/rose-saf.jpg',
      category: 'signature',
      featured: true,
    },
    {
      name: 'Latte España',
      desc: 'A creamy Spanish latte made with bold espresso and silky oat milk, subtly sweetened with condensed milk and cold foam for a smooth indulgence.',
      origin: "Inspired by Madrid's café con leche",
      ingredients: 'Espresso · Oat milk · Condensed milk · Cold foam',
      image: '/esp.png',
      category: 'signature',
    },
    {
      name: 'Tiramisu Latte',
      desc: 'A dessert-style latte featuring bold espresso, soft vanilla notes, and a luxurious mascarpone cold foam. Topped with cocoa powder and Swiss chocolate.',
      origin: 'Inspired by the classic Italian dessert of the same name',
      ingredients:
        'Espresso · Vanilla · Mascarpone cold foam · Cocoa powder · Swiss chocolate',
      image: '/tira.png',
      category: 'signature',
    },
    {
      name: 'La Dolce Latte',
      desc: 'A silky iced latte crafted with golden espresso and a blend of brown sugar and honey/caramel for rich sweetness. Finished with smooth cold foam for a creamy, luxurious sip that lives up to its name, "The Sweet Latte."',
      origin: 'A nod to "la dolce vita"  the sweet life',
      ingredients: 'Espresso · Brown sugar · Honey caramel · Cold foam',
      image: '/ladoche.png',
      category: 'signature',
    },
  ],
  refreshers: [
    {
      name: "Tony's Cup",
      desc: 'Dark cherry and vanilla Italian soda topped with a swirl of cream. Bold & unapologetic refreshment',
      origin:
        'Inspired by classic Italian soda shops, with a bold cherry-vanilla twist.',
      ingredients: 'Dark Cherry Syrup · Vanilla Syrup · Soda Water · Cream ',
      image: '/tonycup.png',
      category: 'refresher',
    },
    {
      name: 'Elvira',
      desc: 'A mysterious mix of blueberry and lavender syrups with sparkling soda, optionally swirled with cream for a dreamy purple haze',
      origin:
        'A moody blueberry-lavender blend for those who like a little mystery in their cup.',
      ingredients: 'Blueberry Syrup · Lavender Syrup · Soda Water · Cream',
      image: '/elvira.png',
      category: 'refresher',
    },
  ],
  essentialFlavors: ['Vanilla', 'Caramel', 'Hazelnut', 'Mocha', 'White Chocolate'],
  addOns: [
    'Extra shot of espresso',
    'Oat milk',
    'Almond milk',
    'Rose petals / Drizzle',
    'Extra syrup pump',
  ],
  featured: null,
};

FALLBACK_MENU.featured =
  FALLBACK_MENU.signatures.find((d) => d.featured) ?? FALLBACK_MENU.signatures[1] ?? null;

type SanityDrink = {
  name: string;
  desc: string;
  origin?: string;
  ingredients?: string;
  image?: string;
  featured?: boolean;
  category: 'signature' | 'refresher';
};

export async function getCateringMenu(): Promise<CateringMenu> {
  if (!isSanityConfigured()) return FALLBACK_MENU;

  const client = getSanityClient();
  if (!client) return FALLBACK_MENU;

  try {
    const [drinks, settings] = await Promise.all([
      client.fetch<SanityDrink[]>(
        `*[_type == "menuDrink" && active != false] | order(sortOrder asc) {
          name, desc, origin, ingredients, image, featured, category
        }`
      ),
      client.fetch<{
        essentialFlavors?: string[];
        addOns?: string[];
      } | null>(
        `*[_type == "siteSettings" && _id == "siteSettings"][0]{
          essentialFlavors, addOns
        }`
      ),
    ]);

    if (!drinks?.length) return FALLBACK_MENU;

    const signatures = drinks.filter((d) => d.category === 'signature');
    const refreshers = drinks.filter((d) => d.category === 'refresher');
    const featured =
      drinks.find((d) => d.featured) ?? signatures[0] ?? null;

    return {
      signatures: signatures.length ? signatures : FALLBACK_MENU.signatures,
      refreshers: refreshers.length ? refreshers : FALLBACK_MENU.refreshers,
      essentialFlavors:
        settings?.essentialFlavors?.length
          ? settings.essentialFlavors
          : FALLBACK_MENU.essentialFlavors,
      addOns: settings?.addOns?.length ? settings.addOns : FALLBACK_MENU.addOns,
      featured,
    };
  } catch (err) {
    console.warn('[menu] sanity fetch failed', err);
    return FALLBACK_MENU;
  }
}
