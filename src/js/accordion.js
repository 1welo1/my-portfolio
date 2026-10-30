/**
 * FAQ Accordion Interaction Module
 * Fully accessible with ARIA expanded/controls synchronization
 */

export function initAccordion() {
  const faqList = document.querySelector('.faq-list');
  if (!faqList) return;

  faqList.addEventListener('click', (e) => {
    const trigger = e.target.closest('.faq-trigger');
    if (!trigger) return;

    const currentItem = trigger.closest('.faq-item');
    if (!currentItem) return;

    const isCurrentlyOpen = currentItem.classList.contains('is-open');

    // Optional: close other items for single-accordion behavior (NESH style)
    const allItems = faqList.querySelectorAll('.faq-item');
    allItems.forEach(item => {
      if (item !== currentItem) {
        item.classList.remove('is-open');
        const itemTrigger = item.querySelector('.faq-trigger');
        if (itemTrigger) itemTrigger.setAttribute('aria-expanded', 'false');
      }
    });

    // Toggle current item
    const nextState = !isCurrentlyOpen;
    currentItem.classList.toggle('is-open', nextState);
    trigger.setAttribute('aria-expanded', String(nextState));
  });
}
