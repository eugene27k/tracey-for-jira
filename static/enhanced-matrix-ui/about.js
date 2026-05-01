(() => {
  const elements = {
    aboutButton: document.getElementById('about-btn'),
    aboutModal: document.getElementById('about-modal'),
    aboutCloseButton: document.getElementById('about-modal-close-btn'),
    helpButton: document.getElementById('help-btn'),
    helpModal: document.getElementById('help-modal'),
    helpCloseButton: document.getElementById('help-modal-close-btn'),
  };

  if (
    !elements.aboutButton ||
    !elements.aboutModal ||
    !elements.aboutCloseButton ||
    !elements.helpButton ||
    !elements.helpModal ||
    !elements.helpCloseButton
  ) {
    return;
  }

  function openModal(modal, closeButton) {
    modal.classList.remove('hidden');
    window.requestAnimationFrame(() => {
      closeButton.focus();
    });
  }

  function closeModal(modal) {
    modal.classList.add('hidden');
  }

  elements.aboutButton.addEventListener('click', () => {
    openModal(elements.aboutModal, elements.aboutCloseButton);
  });
  elements.helpButton.addEventListener('click', () => {
    openModal(elements.helpModal, elements.helpCloseButton);
  });
  elements.aboutCloseButton.addEventListener('click', () => {
    closeModal(elements.aboutModal);
  });
  elements.helpCloseButton.addEventListener('click', () => {
    closeModal(elements.helpModal);
  });
  elements.aboutModal.addEventListener('click', (event) => {
    const closeTarget = event.target.closest('[data-close-about-modal="true"]');
    if (closeTarget) {
      closeModal(elements.aboutModal);
    }
  });
  elements.helpModal.addEventListener('click', (event) => {
    const closeTarget = event.target.closest('[data-close-help-modal="true"]');
    if (closeTarget) {
      closeModal(elements.helpModal);
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') {
      return;
    }
    if (!elements.aboutModal.classList.contains('hidden')) {
      closeModal(elements.aboutModal);
    }
    if (!elements.helpModal.classList.contains('hidden')) {
      closeModal(elements.helpModal);
    }
  });
})();
