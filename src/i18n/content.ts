// Redação do site, nos dois idiomas. Português é a versão principal (/);
// inglês (/en/) existe porque metade do público da Diana é estrangeiro.
//
// Convenções da copy: "para", nunca "pra"; imperativo formal ("Conte", "Role").
// Itens com [CONFIRMAR] dependem de validação da Diana — ver README.

export type Lang = "pt" | "en";

type Service = { title: string; text: string; meta: string };
type Step = { title: string; text: string };
type Fact = { value: string; label: string };

export type Content = {
  lang: Lang;
  htmlLang: string;
  path: string;
  alt: { lang: Lang; path: string; label: string; aria: string };
  meta: { title: string; description: string; ogAlt: string };
  skip: string;
  nav: { services: string; method: string; about: string; contact: string; menu: string; close: string };
  hero: {
    eyebrow: string;
    titleBefore: string;
    titleEm: string;
    titleAfter: string;
    lead: string;
    ctaPrimary: string;
    ctaSecondary: string;
    scroll: string;
    words: string[];
  };
  marquee: string[];
  manifesto: { eyebrow: string; before: string; em: string; after: string };
  services: { eyebrow: string; title: string; items: Service[] };
  method: {
    eyebrow: string;
    title: string;
    steps: Step[];
    formatsTitle: string;
    formats: Step[];
  };
  about: {
    eyebrow: string;
    name: string;
    role: string;
    paragraphs: string[];
    principle: string;
    facts: Fact[];
    card: { label: string; rows: { k: string; v: string }[] };
  };
  bridge: { htmlLang: string; kicker: string; title: string; text: string; link: string; href: string };
  contact: {
    eyebrow: string;
    titleBefore: string;
    titleEm: string;
    titleAfter: string;
    text: string;
    whatsapp: string;
    whatsappMessage: string;
    email: string;
    emailSubject: string;
    note: string;
    facebook: string;
  };
  footer: { tagline: string; rights: string; top: string };
};

const pt: Content = {
  lang: "pt",
  htmlLang: "pt-BR",
  path: "/",
  alt: { lang: "en", path: "/en/", label: "EN", aria: "Read this site in English" },
  meta: {
    title: "Professora Diana · Inglês e português sob medida | Diana Zollinger",
    description:
      "Inglês para executivos e empresas, português para estrangeiros, preparação para TOEFL, TOEIC e Cambridge e tradução. Online ou presencial em São Paulo, com Diana Zollinger.",
    ogAlt: "Professora Diana — Diga exatamente o que você quer dizer.",
  },
  skip: "Pular para o conteúdo",
  nav: { services: "Aulas", method: "Método", about: "Sobre", contact: "Contato", menu: "Menu", close: "Fechar" },
  hero: {
    eyebrow: "Diana Zollinger · Consultoria de idiomas",
    titleBefore: "Diga",
    titleEm: "exatamente",
    titleAfter: "o que você quer dizer.",
    lead:
      "Inglês para profissionais e empresas. Português para estrangeiros que escolheram o Brasil. Aulas sob medida com quem ensina idiomas há mais de 30 anos.",
    ctaPrimary: "Conversar com a Diana",
    ctaSecondary: "Conhecer as aulas",
    scroll: "Role",
    words: ["Olá", "Hello", "Fluência", "Fluency"],
  },
  marquee: [
    "Inglês para executivos",
    "Português para estrangeiros",
    "Inglês in company",
    "TOEFL",
    "TOEIC",
    "Cambridge",
    "Tradução e revisão",
  ],
  manifesto: {
    eyebrow: "Fluência, na prática",
    before: "Fluência não é sotaque perfeito nem palavra difícil. É",
    em: "ser entendido na primeira vez",
    after:
      ": na reunião, no e-mail, na negociação, na conversa com o vizinho. É isso que eu treino com cada aluno.",
  },
  services: {
    eyebrow: "Aulas",
    title: "Cinco frentes. O mesmo cuidado em todas.",
    items: [
      {
        title: "Inglês para executivos",
        text: "Para quem já domina o próprio trabalho e quer o mesmo domínio em inglês. Reuniões, apresentações, negociações e e-mails, treinados com situações reais da sua rotina.",
        meta: "Aulas individuais · Online ou presencial",
      },
      {
        title: "Inglês in company",
        text: "Aulas dentro da empresa, em turma ou individuais, com nivelamento no início e acompanhamento da evolução de cada participante.",
        meta: "Empresas · Turmas e individuais",
      },
      {
        title: "Português para estrangeiros",
        text: "Para quem chegou ao Brasil a trabalho ou para ficar. Do primeiro “tudo bem?” à reunião em português, com a cultura que não está no livro.",
        meta: "Expatriados e famílias · Online ou presencial",
      },
      {
        title: "Preparação para exames",
        text: "TOEFL, TOEIC e exames de Cambridge: o inglês que cada prova cobra, estratégia de tempo e simulados com correção detalhada.",
        meta: "Intercâmbio · Carreira · Certificação",
      },
      {
        title: "Tradução e revisão",
        text: "Textos profissionais entre inglês e português, traduzidos e revisados por quem é formada em tradução.",
        meta: "Documentos · Apresentações · Sites",
      },
    ],
  },
  method: {
    eyebrow: "Método",
    title: "Aula boa começa antes da primeira aula.",
    steps: [
      { title: "Conversa inicial", text: "Um primeiro encontro, sem compromisso, para entender o seu nível, o seu objetivo e a sua agenda." },
      { title: "Plano sob medida", text: "O programa nasce do seu dia a dia: as reuniões, os textos e as situações que você vai enfrentar de verdade." },
      { title: "Aulas no seu ritmo", text: "Online, de onde você estiver, ou presenciais em São Paulo, com a frequência que cabe na sua rotina." },
      { title: "Evolução que se vê", text: "Correção clara, revisão constante e metas definidas, para você perceber o próprio progresso." },
    ],
    formatsTitle: "Formatos",
    formats: [
      { title: "Online", text: "Para alunos em qualquer cidade ou país." },
      { title: "Presencial", text: "Aulas em São Paulo." },
      { title: "In company", text: "Na sua empresa, para uma pessoa ou para a equipe." },
    ],
  },
  about: {
    eyebrow: "Quem ensina",
    name: "Diana Zollinger",
    role: "Consultora de idiomas",
    paragraphs: [
      "Formada em Letras pela PUC-SP e em Língua Inglesa — Licenciatura e Tradução, com o certificado CELTA, da Universidade de Cambridge.",
      "Diana começou como professora particular de inglês e de português para estrangeiros e nunca saiu da sala de aula. Ao longo de mais de três décadas, ensinou executivos, equipes de empresas e famílias recém-chegadas ao Brasil, e desenvolveu cursos preparatórios para TOEIC, TOEFL e Cambridge.",
    ],
    principle: "Ninguém deveria se sentir menor por estar falando outra língua.",
    facts: [
      { value: "30+", label: "anos ensinando idiomas" },
      { value: "2", label: "línguas: inglês e português" },
      { value: "CELTA", label: "certificação de Cambridge" },
    ],
    card: {
      label: "Ficha da professora",
      rows: [
        { k: "Formação", v: "Letras — PUC-SP" },
        { k: "", v: "Língua Inglesa — Licenciatura e Tradução" },
        { k: "Certificação", v: "CELTA — University of Cambridge" },
        { k: "Ensina", v: "Inglês · Português para estrangeiros" },
        { k: "Atende", v: "Profissionais, empresas e famílias" },
        { k: "Base", v: "São Paulo · online" },
      ],
    },
  },
  bridge: {
    htmlLang: "en",
    kicker: "For foreigners",
    title: "New to Brazil?",
    text: "Learn Portuguese with a teacher who has spent decades helping people build a life, and a career, in a new language.",
    link: "Read in English",
    href: "/en/",
  },
  contact: {
    eyebrow: "Contato",
    titleBefore: "Vamos",
    titleEm: "conversar",
    titleAfter: "?",
    text: "Conte o que você precisa: aulas para você, para a sua equipe ou para quem acabou de chegar ao Brasil. A primeira conversa é sem compromisso.",
    whatsapp: "Chamar no WhatsApp",
    whatsappMessage: "Olá, Diana! Vim pelo site e gostaria de saber mais sobre as aulas.",
    email: "Escrever um e-mail",
    emailSubject: "Aulas — contato pelo site",
    note: "Online para qualquer lugar · Presencial em São Paulo",
    facebook: "Facebook",
  },
  footer: {
    tagline: "Inglês e português, sob medida.",
    rights: "Todos os direitos reservados.",
    top: "Voltar ao topo",
  },
};

const en: Content = {
  lang: "en",
  htmlLang: "en",
  path: "/en/",
  alt: { lang: "pt", path: "/", label: "PT", aria: "Ler o site em português" },
  meta: {
    title: "Professora Diana · Portuguese and English lessons, tailored | Diana Zollinger",
    description:
      "Portuguese for foreigners, business English for executives and companies, TOEFL, TOEIC and Cambridge preparation, and translation. Online or in São Paulo, with Diana Zollinger.",
    ogAlt: "Professora Diana — Say exactly what you mean.",
  },
  skip: "Skip to content",
  nav: { services: "Lessons", method: "Method", about: "About", contact: "Contact", menu: "Menu", close: "Close" },
  hero: {
    eyebrow: "Diana Zollinger · Language consultancy",
    titleBefore: "Say",
    titleEm: "exactly",
    titleAfter: "what you mean.",
    lead:
      "Portuguese for foreigners who chose Brazil. English for professionals and companies. Tailored lessons from a teacher with over 30 years in the classroom.",
    ctaPrimary: "Talk to Diana",
    ctaSecondary: "See the lessons",
    scroll: "Scroll",
    words: ["Hello", "Olá", "Fluency", "Fluência"],
  },
  marquee: [
    "Portuguese for foreigners",
    "Business English",
    "In-company English",
    "TOEFL",
    "TOEIC",
    "Cambridge",
    "Translation & proofreading",
  ],
  manifesto: {
    eyebrow: "Fluency, in practice",
    before: "Fluency isn’t a perfect accent or fancy words. It’s",
    em: "being understood the first time",
    after:
      ": in the meeting, in the email, in the negotiation, in a chat with your neighbor. That’s what I train with every student.",
  },
  services: {
    eyebrow: "Lessons",
    title: "Five areas. The same care in each.",
    items: [
      {
        title: "Portuguese for foreigners",
        text: "For those who came to Brazil for work or to stay. From your first “tudo bem?” to a meeting in Portuguese, with the culture no textbook covers.",
        meta: "Expats and families · Online or in person",
      },
      {
        title: "Business English",
        text: "For professionals who master their work and want the same command in English. Meetings, presentations, negotiations and emails, practiced with real situations from your routine.",
        meta: "One-to-one · Online or in person",
      },
      {
        title: "In-company English",
        text: "Lessons at your company, for groups or individuals, with a level assessment at the start and progress follow-up for every participant.",
        meta: "Companies · Groups and one-to-one",
      },
      {
        title: "Exam preparation",
        text: "TOEFL, TOEIC and Cambridge exams: the English each test demands, time strategy and mock tests with detailed feedback.",
        meta: "Study abroad · Career · Certification",
      },
      {
        title: "Translation & proofreading",
        text: "Professional texts between English and Portuguese, translated and reviewed by a trained translator.",
        meta: "Documents · Presentations · Websites",
      },
    ],
  },
  method: {
    eyebrow: "Method",
    title: "Good lessons start before the first lesson.",
    steps: [
      { title: "First conversation", text: "An initial meeting, with no commitment, to understand your level, your goal and your schedule." },
      { title: "A plan made for you", text: "The program comes from your daily life: the meetings, the texts and the situations you will actually face." },
      { title: "Lessons at your pace", text: "Online, wherever you are, or in person in São Paulo, as often as your routine allows." },
      { title: "Progress you can see", text: "Clear corrections, constant review and defined goals, so you can notice your own progress." },
    ],
    formatsTitle: "Formats",
    formats: [
      { title: "Online", text: "For students in any city or country." },
      { title: "In person", text: "Lessons in São Paulo." },
      { title: "In company", text: "At your company, for one person or the whole team." },
    ],
  },
  about: {
    eyebrow: "Who teaches",
    name: "Diana Zollinger",
    role: "Language consultant",
    paragraphs: [
      "Degree in Languages and Literature from PUC-SP and in English Language — Teaching and Translation, with the CELTA certificate from the University of Cambridge.",
      "Diana started as a private teacher of English and of Portuguese for foreigners, and never left the classroom. Over more than three decades she has taught executives, corporate teams and families who had just arrived in Brazil, and has designed preparation courses for TOEIC, TOEFL and Cambridge.",
    ],
    principle: "No one should feel smaller for speaking another language.",
    facts: [
      { value: "30+", label: "years teaching languages" },
      { value: "2", label: "languages: English and Portuguese" },
      { value: "CELTA", label: "Cambridge certification" },
    ],
    card: {
      label: "Teacher’s record",
      rows: [
        { k: "Education", v: "Languages and Literature — PUC-SP" },
        { k: "", v: "English Language — Teaching and Translation" },
        { k: "Certificate", v: "CELTA — University of Cambridge" },
        { k: "Teaches", v: "Portuguese for foreigners · English" },
        { k: "Works with", v: "Professionals, companies and families" },
        { k: "Based in", v: "São Paulo · online anywhere" },
      ],
    },
  },
  bridge: {
    htmlLang: "pt-BR",
    kicker: "Para brasileiros",
    title: "Precisa de inglês para o trabalho?",
    text: "Aulas para executivos e empresas, com o inglês que a sua rotina pede.",
    link: "Ler em português",
    href: "/",
  },
  contact: {
    eyebrow: "Contact",
    titleBefore: "Shall we",
    titleEm: "talk",
    titleAfter: "?",
    text: "Tell me what you need: lessons for yourself, for your team or for someone who has just arrived in Brazil. The first conversation comes with no commitment.",
    whatsapp: "Message on WhatsApp",
    whatsappMessage: "Hi Diana! I found your website and would like to know more about the lessons.",
    email: "Send an email",
    emailSubject: "Lessons — contact from the website",
    note: "Online anywhere · In person in São Paulo",
    facebook: "Facebook",
  },
  footer: {
    tagline: "Portuguese and English, tailored.",
    rights: "All rights reserved.",
    top: "Back to top",
  },
};

export const content: Record<Lang, Content> = { pt, en };
