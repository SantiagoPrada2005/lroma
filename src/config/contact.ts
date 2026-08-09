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
    defaultMessage: "Hola L'Roma! Quiero información",
    orderMessage: "Hola! Quiero hacer un pedido",
    reservationMessage: "Hola L'Roma! Quiero reservar una mesa",
  },
  address: {
    street: "Av. Siempre Viva 742",
    city: "Rosario",
    state: "Santa Fe",
    country: "AR",
    fullAddress: "Av. Siempre Viva 742, Rosario, Santa Fe",
    mapsQuery: "L'Roma+Pizza+Grill+Rosario",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=L'Roma+Pizza+Grill+Rosario",
  },
  hours: [
    { day: "Lunes – Jueves", time: "19:00 – 00:00" },
    { day: "Viernes – Sábado", time: "19:00 – 01:30" },
    { day: "Domingo", time: "19:00 – 00:00" },
  ],
  social: {
    instagram: "https://instagram.com/lromapizza",
    facebook: "https://facebook.com/lromapizza",
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
