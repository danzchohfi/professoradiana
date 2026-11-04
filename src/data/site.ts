// Contato e links: o ÚNICO lugar com esses dados. Os botões do site leem daqui.
//
// PENDENTE (confirmar com a Diana antes de apontar o domínio):
// - whatsapp: número com DDI e DDD, só dígitos (ex.: "5511999999999").
//   Vazio = o botão de WhatsApp não aparece (melhor que mandar o aluno para um número errado).
// - email: o domínio é dela, mas a caixa exata não foi confirmada.
export const site = {
  url: "https://professoradiana.com",
  name: "Professora Diana",
  person: "Diana Zollinger",
  whatsapp: "",
  email: "contato@professoradiana.com",
  facebook: "https://www.facebook.com/dianazollingeridiomas/",
  city: "São Paulo",
} as const;

export function whatsappHref(message: string): string | null {
  if (!site.whatsapp) return null;
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function emailHref(subject: string): string | null {
  if (!site.email) return null;
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;
}
