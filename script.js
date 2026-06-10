const WHATSAPP_PHONE = '5514996954298';

const buildWhatsAppUrl = (message) =>
  `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message.trim())}`;

const yearElement = document.getElementById('year');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

document.querySelectorAll('[data-whatsapp-message]').forEach((link) => {
  link.href = buildWhatsAppUrl(link.dataset.whatsappMessage);
  link.target = '_blank';
  link.rel = 'noopener';
});

const progressBar = document.querySelector('.reading-progress span');
const updateReadingProgress = () => {
  if (!progressBar) return;

  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  progressBar.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
};

window.addEventListener('scroll', updateReadingProgress, { passive: true });
window.addEventListener('resize', updateReadingProgress);
updateReadingProgress();

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

if (menuToggle && nav) {
  const closeMenu = () => {
    nav.classList.remove('is-open');
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
    document.body.classList.remove('nav-open');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuToggle.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('nav-open', isOpen);
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

const historyCards = document.querySelectorAll('.history-card');
const activateHistoryCard = (activeCard) => {
  historyCards.forEach((card) => {
    card.classList.toggle('is-active', card === activeCard);
  });
};

historyCards.forEach((card) => {
  card.addEventListener('click', () => activateHistoryCard(card));
  card.addEventListener('mouseenter', () => activateHistoryCard(card));
  card.addEventListener('focus', () => activateHistoryCard(card));
});

const faqItems = document.querySelectorAll('.faq-item');

const setFaqPanelHeight = (item) => {
  const panel = item.querySelector('.faq-panel');
  if (!panel) return;
  panel.style.maxHeight = item.classList.contains('is-open') ? `${panel.scrollHeight}px` : '0px';
};

faqItems.forEach((item) => {
  const button = item.querySelector('.faq-question');
  if (!button) return;

  setFaqPanelHeight(item);

  button.addEventListener('click', () => {
    const isOpen = item.classList.toggle('is-open');
    button.setAttribute('aria-expanded', String(isOpen));
    setFaqPanelHeight(item);
  });
});

window.addEventListener('resize', () => {
  faqItems.forEach(setFaqPanelHeight);
});

const creditInput = document.querySelector('input[name="credit"]');
if (creditInput) {
  creditInput.addEventListener('input', () => {
    const digits = creditInput.value.replace(/\D/g, '');
    if (!digits) {
      creditInput.value = '';
      return;
    }

    const amount = Number(digits);
    creditInput.value = amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    });
  });
}

const leadForm = document.getElementById('lead-form');
if (leadForm) {
  leadForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!leadForm.reportValidity()) return;

    const formData = new FormData(leadForm);
    const name = String(formData.get('name') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const objective = String(formData.get('objective') || '').trim();
    const credit = String(formData.get('credit') || '').trim();
    const moment = String(formData.get('moment') || '').trim();

    const message = `
Olá, Felipe. Vim pelo site e gostaria de uma simulação.

Meu nome é ${name}.
Meu WhatsApp é ${phone}.
Meu objetivo é ${objective}, penso em um crédito de aproximadamente ${credit} e gostaria de conversar ${moment}.

Gostaria de entender a melhor estratégia.
    `;

    window.location.href = buildWhatsAppUrl(message);
  });
}
