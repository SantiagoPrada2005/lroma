const BASE_URL =
  typeof import.meta !== "undefined" && import.meta.env?.BASE_URL
    ? import.meta.env.BASE_URL.replace(/\/$/, "")
    : "/lroma";

export const TOTAL_LROMA_IMAGES = 96;

export interface ImageAsset {
  src: string;
  avif?: string;
  alt: string;
  label?: string;
}

export interface GridImageItem extends ImageAsset {
  id: number;
  span?: string;
  aspect?: string;
}

export interface CircularGalleryItem {
  common: string;
  binomial: string;
  photo: {
    url: string;
    text: string;
    pos: string;
    by: string;
  };
}

export interface StoryBeatItem {
  id: string;
  heading: string;
  body: string;
  bodyShort: string;
  image: string;
  imageAlt: string;
  imageOrder: string;
  textOrder: string;
}

export interface FeaturedDish {
  name: string;
  description: string;
  price: string;
  image: string;
  whatsappMsg: string;
  featured: boolean;
}

/**
 * Complete collection of all 96 local images from /public/img/lroma-images/
 */
export const LROMA_ALL_IMAGES: GridImageItem[] = Array.from(
  { length: TOTAL_LROMA_IMAGES },
  (_, idx) => {
    const num = idx + 1;
    let span = "";
    let aspect = "aspect-square";

    if (num % 7 === 1) {
      span = "md:row-span-2 md:col-span-2";
      aspect = "aspect-[4/5] md:aspect-auto";
    } else if (num % 7 === 4) {
      span = "md:col-span-2";
      aspect = "aspect-[16/10]";
    } else if (num % 7 === 0) {
      span = "md:row-span-2";
      aspect = "aspect-[4/5] md:aspect-auto";
    }

    return {
      id: num,
      src: `${BASE_URL}/img/lroma-images/${num}.webp`,
      avif: `${BASE_URL}/img/lroma-images/${num}.avif`,
      alt: `L'Roma Pizza & Grill — Imagen artesanal #${num}`,
      label: `Plato L'Roma #${num}`,
      span,
      aspect,
    };
  },
);

export const SITE_IMAGES = {
  // Brand & Shell Assets
  brand: {
    logo: {
      ico: `/img/logo.ico`,
      webp: `/img/logo.webp`,
      avif: `/img/logo.avif`,
      jpg: `/img/logo.jpg`,
      alt: "L'Roma Pizza & Grill Logo",
    },
    facade: {
      webp: `/img/lroma-front.webp`,
      avif: `/img/lroma-front.avif`,
      jpg: `/img/lroma-front.jpg`,
      alt: "Fachada de L'Roma Pizza & Grill",
    },
  },

  // All 96 local images
  all: LROMA_ALL_IMAGES,

  // Menu individual dishes mapped to local images
  dishes: {
    pizzaMargherita: {
      src: `${BASE_URL}/img/lroma-images/1.webp`,
      alt: "Pizza Margherita artesanal con albahaca fresca y mozzarella",
      label: "Pizza Margherita",
    },
    pizzaNapolitana: {
      src: `${BASE_URL}/img/lroma-images/2.webp`,
      alt: "Pizza Napolitana con alcaparras, orégano y mozzarella",
      label: "Pizza Napolitana",
    },
    pizzaLroma: {
      src: `${BASE_URL}/img/lroma-images/3.webp`,
      alt: "Pizza especial L'Roma con pepperoni y champiñones",
      label: "Pizza L'Roma",
    },
    clasicaBurger: {
      src: `${BASE_URL}/img/lroma-images/4.webp`,
      alt: "Hamburguesa clásica con cheddar y cebolla caramelizada",
      label: "Hamburguesa Clásica",
    },
    lromaBurger: {
      src: `${BASE_URL}/img/lroma-images/5.webp`,
      alt: "Hamburguesa especial L'Roma en pan negro brioche",
      label: "Hamburguesa L'Roma",
    },
    babyBeef: {
      src: `${BASE_URL}/img/lroma-images/6.webp`,
      alt: "Baby beef premium a la parrilla con papas rústicas",
      label: "Baby Beef",
    },
    costillasBbq: {
      src: `${BASE_URL}/img/lroma-images/7.webp`,
      alt: "Costillas BBQ laqueadas a fuego lento",
      label: "Costillas BBQ",
    },
    carbonara: {
      src: `${BASE_URL}/img/lroma-images/8.webp`,
      alt: "Fettuccine a la Carbonara con panceta crocante y yema",
      label: "Carbonara",
    },
    lasagna: {
      src: `${BASE_URL}/img/lroma-images/9.webp`,
      alt: "Lasaña boloñesa al horno con parmesano gratinado",
      label: "Lasaña",
    },
    limonada: {
      src: `${BASE_URL}/img/lroma-images/10.webp`,
      alt: "Limonada artesanal con menta y jengibre",
      label: "Limonada Artesanal",
    },
    cerveza: {
      src: `${BASE_URL}/img/lroma-images/11.webp`,
      alt: "Cerveza artesanal tirada",
      label: "Cerveza Artesanal",
    },
    hatsuTe: {
      src: `${BASE_URL}/img/lroma-images/12.webp`,
      alt: "Té frío artesanal en botella",
      label: "Hatsu Té",
    },
    picada: {
      src: `${BASE_URL}/img/lroma-images/13.webp`,
      alt: "Picada artesanal con variedad de quesos y fiambres",
      label: "Picada L'Roma",
    },
    alitasBbq: {
      src: `${BASE_URL}/img/lroma-images/14.webp`,
      alt: "Alitas de pollo BBQ crujientes",
      label: "Alitas BBQ",
    },
    pulledPork: {
      src: `${BASE_URL}/img/lroma-images/15.webp`,
      alt: "Sándwich de Pulled Pork con ensalada coleslaw",
      label: "Pulled Pork Sandwich",
    },
  },

  // Home Featured Bento Dishes
  featuredDishes: [
    {
      name: "Pizza Margherita",
      description:
        "Mozzarella fresca, albahaca, tomate San Marzano y aceite de oliva extra virgen.",
      price: "$12.000",
      image: `${BASE_URL}/img/lroma-images/1.webp`,
      whatsappMsg: "Hola L'Roma! Quiero pedir una Pizza Margherita",
      featured: true,
    },
    {
      name: "Baby Beef",
      description:
        "Corte premium de 400g, papas rústicas y chimichurri de la casa.",
      price: "$18.500",
      image: `${BASE_URL}/img/lroma-images/6.webp`,
      whatsappMsg: "Hola L'Roma! Quiero pedir un Baby Beef",
      featured: false,
    },
    {
      name: "Pasta Carbonara",
      description:
        "Fettuccine al huevo, panceta crocante, yema, pecorino y pimienta negra.",
      price: "$14.000",
      image: `${BASE_URL}/img/lroma-images/8.webp`,
      whatsappMsg: "Hola L'Roma! Quiero pedir una Pasta Carbonara",
      featured: false,
    },
    {
      name: "Hamburguesa L'Roma",
      description:
        "Blend de carne 200g, cheddar ahumado, panceta, cebolla caramelizada y pan brioche.",
      price: "$13.500",
      image: `${BASE_URL}/img/lroma-images/5.webp`,
      whatsappMsg: "Hola L'Roma! Quiero pedir una Hamburguesa L'Roma",
      featured: false,
    },
  ] as FeaturedDish[],

  // Home 3D Circular Gallery (8 items)
  circularGallery: [
    {
      common: "Pizza Margherita",
      binomial: "Salsa de tomate, mozzarella, albahaca fresca",
      photo: {
        url: `${BASE_URL}/img/lroma-images/1.webp`,
        text: "Pizza Margherita artesanal",
        pos: "50% 40%",
        by: "$12.000",
      },
    },
    {
      common: "Baby Beef",
      binomial: "400g con guarnición a elección",
      photo: {
        url: `${BASE_URL}/img/lroma-images/6.webp`,
        text: "Baby Beef jugoso a la parrilla",
        pos: "50% 55%",
        by: "$18.500",
      },
    },
    {
      common: "Carbonara",
      binomial: "Panceta, huevo, parmesano, pimienta negra",
      photo: {
        url: `${BASE_URL}/img/lroma-images/8.webp`,
        text: "Pasta Carbonara cremosa",
        pos: "50% 45%",
        by: "$13.000",
      },
    },
    {
      common: "Hamburguesa L'Roma",
      binomial: "Angus, panceta, cheddar, huevo, pan negro",
      photo: {
        url: `${BASE_URL}/img/lroma-images/5.webp`,
        text: "Hamburguesa premium",
        pos: "50% 50%",
        by: "$14.000",
      },
    },
    {
      common: "Costillas BBQ",
      binomial: "Cerdo laqueado, salsa barbacoa casera",
      photo: {
        url: `${BASE_URL}/img/lroma-images/7.webp`,
        text: "Costillas BBQ glaseadas",
        pos: "50% 50%",
        by: "$22.000",
      },
    },
    {
      common: "Lasaña",
      binomial: "Bolognesa, bechamel, parmesano gratinado",
      photo: {
        url: `${BASE_URL}/img/lroma-images/9.webp`,
        text: "Lasaña al horno",
        pos: "50% 55%",
        by: "$15.000",
      },
    },
    {
      common: "Picada L'Roma",
      binomial: "Quesos, fiambres, aceitunas, pan casero",
      photo: {
        url: `${BASE_URL}/img/lroma-images/13.webp`,
        text: "Picada artesanal",
        pos: "50% 50%",
        by: "$25.000",
      },
    },
    {
      common: "Limonada Artesanal",
      binomial: "Refrescante, con hierbas frescas",
      photo: {
        url: `${BASE_URL}/img/lroma-images/10.webp`,
        text: "Limonada natural",
        pos: "50% 50%",
        by: "$5.500",
      },
    },
  ] as CircularGalleryItem[],

  // Full Gallery (ALL 96 local images)
  gallery: LROMA_ALL_IMAGES,

  // 3D Infinite WebGL Gallery (ALL 96 images)
  infiniteGallery: LROMA_ALL_IMAGES.map((img) => ({
    src: img.src,
    alt: img.alt,
  })),

  // Scroll Choreography Quad Images
  scrollChoreography: {
    topLeft: `${BASE_URL}/img/lroma-images/1.webp`,
    topRight: `${BASE_URL}/img/lroma-images/2.webp`,
    bottomLeft: `${BASE_URL}/img/lroma-images/6.webp`,
    bottomRight: `${BASE_URL}/img/lroma-images/8.webp`,
  },

  // About Story Beats
  storyBeats: [
    {
      id: "origen",
      heading: "Cómo empezó todo",
      body: "L'Roma nació de un sueño compartido: crear un espacio donde la pizza artesanal italiana, la parrilla argentina y la cocina de autor convivan en un solo lugar. Cada plato cuenta una historia de pasión por los ingredientes frescos, las recetas de familia y el fuego que transforma lo simple en extraordinario.",
      bodyShort:
        "Pizza artesanal italiana, parrilla argentina y cocina de autor unidas por la pasión del fuego real.",
      image: `${BASE_URL}/img/lroma-images/16.webp`,
      imageAlt: "Chef preparando pizza en horno de leña en L'Roma",
      imageOrder: "md:order-last",
      textOrder: "",
    },
    {
      id: "cocina",
      heading: "Nuestra cocina",
      body: "En L'Roma la cocina no tiene fronteras. Fusionamos la tradición italiana con cortes argentinos a la parrilla y el espíritu audaz del BBQ americano. Masa madre de 48 horas de fermentación, carnes seleccionadas, vegetales de estación y el toque ahumado que solo el fuego real puede dar. No hacemos atajos — hacemos comida que se siente.",
      bodyShort:
        "Masa madre de 48h, carnes seleccionadas y el toque ahumado que solo el fuego real puede dar.",
      image: `${BASE_URL}/img/lroma-images/17.webp`,
      imageAlt: "Carnes a la parrilla con chimichurri y papas rústicas",
      imageOrder: "",
      textOrder: "md:order-last",
    },
    {
      id: "experiencia",
      heading: "La experiencia L'Roma",
      body: "Más que un restaurante, L'Roma es un punto de encuentro. Iluminación cálida, diseño industrial con acentos de bronce, música que acompaña sin invadir, y un equipo que te recibe como en casa. Acá cada cena se convierte en un recuerdo — ya sea una salida entre amigos, una cita especial o una celebración familiar.",
      bodyShort:
        "Un espacio cálido e industrial donde cada cena se transforma en un recuerdo inolvidable.",
      image: `${BASE_URL}/img/lroma-images/18.webp`,
      imageAlt: "Ambiente cálido de L'Roma con mesas elegantemente preparadas",
      imageOrder: "md:order-last",
      textOrder: "",
    },
  ] as StoryBeatItem[],

  // Scroll Morph Hero (First 20 local images)
  heroMorph: LROMA_ALL_IMAGES.slice(0, 20).map((img, i) => {
    const labels = [
      "Pizza",
      "Grill",
      "Pasta",
      "Burger",
      "Pizza",
      "Picada",
      "Lasaña",
      "Cocina",
      "Plato",
      "Carne",
      "Pasta",
      "Comida",
      "Resto",
      "Chef",
      "Grill",
      "Ensalada",
      "Waffle",
      "Postre",
      "Burger",
      "Cocina",
    ];
    return {
      src: img.src,
      label: labels[i] || `Plato #${i + 1}`,
      alt: img.alt,
    };
  }),
};

/**
 * Returns the local asset or optimized image URL
 */
export function getOptimizedImage(url: string, _width?: number): string {
  return url;
}
