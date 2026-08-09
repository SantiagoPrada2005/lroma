export interface ContactSchedule {
  day: string;
  time: string;
}

export interface SocialLinks {
  instagram: string;
  facebook: string;
  [key: string]: string;
}

export interface AddressInfo {
  street: string;
  city: string;
  state: string;
  country: string;
  fullAddress: string;
  mapsQuery: string;
  mapsUrl: string;
}

export interface ContactConfig {
  brand: {
    name: string;
    tagline: string;
    subtitle: string;
  };
  phone: {
    raw: string;
    display: string;
    telHref: string;
  };
  whatsapp: {
    number: string;
    defaultMessage: string;
    orderMessage: string;
    reservationMessage: string;
  };
  address: AddressInfo;
  hours: ContactSchedule[];
  social: SocialLinks;
}

export const CONTACT_INFO: ContactConfig = {
  brand: {
    name: "L'ROMA",
    tagline: "Pizza & Grill",
    subtitle: "Hecho con pasión en L'Roma",
  },
  phone: {
    raw: "+573107361540",
    display: "+57 310 736-1540",
    telHref: "tel:+573107361540",
  },
  whatsapp: {
    number: "+573107361540",
    defaultMessage: "Hola! Quiero ver el menú",
    orderMessage: "Hola! Quiero hacer un pedido",
    reservationMessage: "Hola! Quiero reservar una mesa",
  },
  address: {
    street: "carrera 7 No. 12-28, asunción",
    city: "Roldanillo, Valle del Cauca",
    state: "Valle del Cauca",
    country: "Colombia",
    fullAddress: "Carrera 7 No. 12-28, asunción, Roldanillo, Valle del Cauca",
    mapsQuery: "L'Roma+Pizza+Grill+Roldanillo+Valle+del+Cauca",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=L'Roma+Pizza+Grill+Roldanillo+Valle+del+Cauca",
  },
  hours: [
    { day: "Lunes – Miércoles", time: "3:30 PM – 10:30 PM" },
    { day: "Jueves – Sábado", time: "3:30 PM – 11:00 PM" },
    { day: "Domingo", time: "3:30 PM – 10:30 PM" },
  ],
  social: {
    instagram: "https://www.instagram.com/lroma_pizza/",
    facebook: "https://www.facebook.com/lroma.roldanillo",
  },
};

/**
 * Generates a WhatsApp URL with an optional pre-filled message.
 */
export function getWhatsAppUrl(
  message: string = CONTACT_INFO.whatsapp.defaultMessage,
  phone: string = CONTACT_INFO.whatsapp.number
): string {
  const sanitizedPhone = phone.replace(/[^\d+]/g, "");
  return `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(message)}`;
}
