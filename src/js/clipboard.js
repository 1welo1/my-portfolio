/**
 * Email Clipboard Copy Module with Animated Toast Feedback
 */

export function initClipboard() {
  const copyButtons = document.querySelectorAll('[data-clipboard-target]');
  const toast = document.getElementById('toast');
  let toastTimeout = null;

  function showToast(message) {
    if (!toast) return;

    if (message) {
      const textNode = toast.querySelector('.toast-text');
      if (textNode) textNode.textContent = message;
    }

    toast.classList.add('is-visible');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2500);
  }

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-clipboard-target');
      if (!textToCopy) return;

      function fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
        } catch (_) {}
        document.body.removeChild(textArea);
      }

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          fallbackCopy(textToCopy);
        }
        showToast('Email copied to clipboard!');
      } catch (_) {
        fallbackCopy(textToCopy);
        showToast('Email copied to clipboard!');
      }
    });
  });
}
