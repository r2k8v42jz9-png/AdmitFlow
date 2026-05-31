export type Locale = "en" | "ru";

type Dict = Record<string, string>;

const en: Dict = {
  // language switcher
  "lang.label": "Language",
  "lang.en": "EN",
  "lang.ru": "RU",

  // common
  "common.signIn": "Sign in",
  "common.getStarted": "Get started",
  "common.continue": "Continue",
  "common.signOut": "Sign out",

  // marketing nav
  "nav.product": "Product",
  "nav.universities": "Universities",
  "nav.pricing": "Pricing",
  "nav.stories": "Stories",
  "nav.faq": "FAQ",

  // app nav / sidebar
  "app.dashboard": "Dashboard",
  "app.mentor": "AI Mentor",
  "app.universities": "Universities",
  "app.roadmap": "Roadmap",
  "app.profile": "Profile",
  "app.settings": "Settings",

  // hero
  "hero.rated": "Trusted by 128,000+ students worldwide",
  "hero.titleLead": "Your AI mentor to the ",
  "hero.titleAccent": "world's best",
  "hero.titleTrail": " universities",
  "hero.subtitle":
    "AdmitFlow estimates your admission chances, builds a personalized roadmap, finds scholarships and reviews your essays — so you apply with total confidence.",
  "hero.ctaPrimary": "Build my admission plan",
  "hero.ctaSecondary": "See plans",
  "hero.trust1": "2-minute setup",
  "hero.trust2": "Cancel anytime",
  "hero.trust3": "3.2× better outcomes",
  "hero.admittedTo": "Students admitted to",

  // auth
  "auth.signupTitle": "Create your account",
  "auth.loginTitle": "Welcome back",
  "auth.signupSubtitle": "Start your journey to a top university in just two minutes.",
  "auth.loginSubtitle": "Sign in to continue building your admission plan.",
  "auth.orEmail": "or continue with email",
  "auth.fullName": "Full name",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.createPassword": "Create a password",
  "auth.enterPassword": "Enter your password",
  "auth.rememberMe": "Remember me",
  "auth.forgot": "Forgot password?",
  "auth.createAccount": "Create account",
  "auth.haveAccount": "Already have an account?",
  "auth.noAccount": "New to AdmitFlow?",
  "auth.createOne": "Create one",
  "auth.backHome": "Back home",
  "auth.googleUnavailable": "Google sign-in isn't available yet. Please continue with email.",
  "auth.appleUnavailable": "Apple sign-in isn't available yet. Please continue with email.",

  // verify email
  "verify.title": "Verify your email",
  "verify.continue": "I've verified — continue",
  "verify.resend": "Resend verification email",
  "verify.sent": "Verification email sent",
  "verify.backToSignIn": "Back to sign in",

  // pricing
  "pricing.eyebrow": "Simple, transparent pricing",
  "pricing.heading": "Invest in your future, not in stress",
  "pricing.description":
    "Pick the plan that matches your timeline. Upgrade or cancel anytime — every plan pays for itself with one scholarship.",
  "pricing.monthly": "Monthly",
  "pricing.yearly": "Yearly",
  "pricing.save": "Save 20%",
  "pricing.perMonth": "/ month",
  "pricing.billedAnnually": "billed annually",
  "pricing.billedMonthly": "billed monthly",
  "pricing.popular": "Most popular",
  "plan.starter.cta": "Start with Starter",
  "plan.pro.cta": "Upgrade to Pro",
  "plan.premium.cta": "Talk to admissions",

  // app topbar
  "topbar.search": "Search…",
  "topbar.notifications": "Notifications",
  "topbar.profile": "Profile",
  "topbar.settings": "Settings",
  "topbar.upgrade": "Upgrade to Premium",
  "topbar.signOut": "Sign out",

  // dashboard
  "dash.welcome": "Welcome back, {name}",
  "dash.subtitle": "Here's where your applications stand and what to focus on next.",
  "dash.explore": "Explore",
  "dash.askMentor": "Ask AI Mentor",
  "dash.stat.admission": "Admission score",
  "dash.stat.applications": "Active applications",
  "dash.stat.fit": "Avg. fit score",
  "dash.stat.streak": "Day streak",
  "dash.completion": "Profile completion",
  "dash.completeProfile": "Complete profile",

  // profile
  "profile.title": "Profile",
  "profile.description":
    "Your academic snapshot powers every AI recommendation, fit score and admission estimate.",
  "profile.edit": "Edit academic profile",

  // roadmap
  "roadmap.title": "Roadmap",
  "roadmap.description": "Your month-by-month admission plan, generated from your profile.",
  "roadmap.regenerate": "Regenerate",
  "roadmap.targetIntake": "Target intake",
  "roadmap.currentPhase": "Current phase",
  "roadmap.overall": "Overall progress",

  // mentor
  "mentor.title": "AdmitFlow Mentor",
  "mentor.online": "Online",
  "mentor.personalized": "Personalized to your profile",
  "mentor.new": "New",
  "mentor.newConversation": "New conversation",
  "mentor.recent": "Recent",
  "mentor.tryAsking": "Try asking",
  "mentor.placeholder": "Ask your mentor anything…",
  "mentor.disclaimer": "AdmitFlow Mentor can make mistakes. Verify important deadlines and requirements.",
};

const ru: Dict = {
  // language switcher
  "lang.label": "Язык",
  "lang.en": "EN",
  "lang.ru": "RU",

  // common
  "common.signIn": "Войти",
  "common.getStarted": "Начать",
  "common.continue": "Продолжить",
  "common.signOut": "Выйти",

  // marketing nav
  "nav.product": "Продукт",
  "nav.universities": "Университеты",
  "nav.pricing": "Тарифы",
  "nav.stories": "Истории",
  "nav.faq": "Вопросы",

  // app nav / sidebar
  "app.dashboard": "Панель",
  "app.mentor": "ИИ-наставник",
  "app.universities": "Университеты",
  "app.roadmap": "План",
  "app.profile": "Профиль",
  "app.settings": "Настройки",

  // hero
  "hero.rated": "Нам доверяют 128 000+ студентов по всему миру",
  "hero.titleLead": "ИИ-наставник для поступления в ",
  "hero.titleAccent": "лучшие университеты",
  "hero.titleTrail": " мира",
  "hero.subtitle":
    "AdmitFlow оценивает ваши шансы на поступление, строит персональный план, находит стипендии и проверяет эссе — чтобы вы подавали документы уверенно.",
  "hero.ctaPrimary": "Составить план поступления",
  "hero.ctaSecondary": "Смотреть тарифы",
  "hero.trust1": "Настройка за 2 минуты",
  "hero.trust2": "Отмена в любой момент",
  "hero.trust3": "В 3,2× лучше результаты",
  "hero.admittedTo": "Студенты поступили в",

  // auth
  "auth.signupTitle": "Создайте аккаунт",
  "auth.loginTitle": "С возвращением",
  "auth.signupSubtitle": "Начните путь в топовый университет всего за две минуты.",
  "auth.loginSubtitle": "Войдите, чтобы продолжить работу над планом поступления.",
  "auth.orEmail": "или продолжите через эл. почту",
  "auth.fullName": "Полное имя",
  "auth.email": "Эл. почта",
  "auth.password": "Пароль",
  "auth.createPassword": "Придумайте пароль",
  "auth.enterPassword": "Введите пароль",
  "auth.rememberMe": "Запомнить меня",
  "auth.forgot": "Забыли пароль?",
  "auth.createAccount": "Создать аккаунт",
  "auth.haveAccount": "Уже есть аккаунт?",
  "auth.noAccount": "Впервые в AdmitFlow?",
  "auth.createOne": "Создать",
  "auth.backHome": "На главную",
  "auth.googleUnavailable": "Вход через Google пока недоступен. Продолжите через эл. почту.",
  "auth.appleUnavailable": "Вход через Apple пока недоступен. Продолжите через эл. почту.",

  // verify email
  "verify.title": "Подтвердите эл. почту",
  "verify.continue": "Я подтвердил — продолжить",
  "verify.resend": "Отправить письмо ещё раз",
  "verify.sent": "Письмо отправлено",
  "verify.backToSignIn": "Назад к входу",

  // pricing
  "pricing.eyebrow": "Простые и прозрачные тарифы",
  "pricing.heading": "Инвестируйте в будущее, а не в стресс",
  "pricing.description":
    "Выберите тариф под ваш график. Повышайте или отменяйте в любой момент — каждый тариф окупается одной стипендией.",
  "pricing.monthly": "Помесячно",
  "pricing.yearly": "Ежегодно",
  "pricing.save": "Экономия 20%",
  "pricing.perMonth": "/ мес",
  "pricing.billedAnnually": "оплата раз в год",
  "pricing.billedMonthly": "оплата помесячно",
  "pricing.popular": "Популярный",
  "plan.starter.cta": "Выбрать Starter",
  "plan.pro.cta": "Перейти на Pro",
  "plan.premium.cta": "Связаться с приёмной",

  // app topbar
  "topbar.search": "Поиск…",
  "topbar.notifications": "Уведомления",
  "topbar.profile": "Профиль",
  "topbar.settings": "Настройки",
  "topbar.upgrade": "Перейти на Premium",
  "topbar.signOut": "Выйти",

  // dashboard
  "dash.welcome": "С возвращением, {name}",
  "dash.subtitle": "Вот статус ваших заявок и на чём сосредоточиться дальше.",
  "dash.explore": "Обзор",
  "dash.askMentor": "Спросить ИИ-наставника",
  "dash.stat.admission": "Балл поступления",
  "dash.stat.applications": "Активные заявки",
  "dash.stat.fit": "Средний балл соответствия",
  "dash.stat.streak": "Дней подряд",
  "dash.completion": "Заполнение профиля",
  "dash.completeProfile": "Заполнить профиль",

  // profile
  "profile.title": "Профиль",
  "profile.description":
    "Ваш академический профиль лежит в основе всех рекомендаций ИИ, оценок соответствия и шансов на поступление.",
  "profile.edit": "Редактировать профиль",

  // roadmap
  "roadmap.title": "План поступления",
  "roadmap.description": "Ваш помесячный план поступления, созданный на основе профиля.",
  "roadmap.regenerate": "Пересоздать",
  "roadmap.targetIntake": "Целевой набор",
  "roadmap.currentPhase": "Текущий этап",
  "roadmap.overall": "Общий прогресс",

  // mentor
  "mentor.title": "Наставник AdmitFlow",
  "mentor.online": "В сети",
  "mentor.personalized": "Адаптировано под ваш профиль",
  "mentor.new": "Новый",
  "mentor.newConversation": "Новый чат",
  "mentor.recent": "Недавние",
  "mentor.tryAsking": "Попробуйте спросить",
  "mentor.placeholder": "Спросите наставника о чём угодно…",
  "mentor.disclaimer": "Наставник AdmitFlow может ошибаться. Проверяйте важные сроки и требования.",
};

export const dictionaries: Record<Locale, Dict> = { en, ru };
