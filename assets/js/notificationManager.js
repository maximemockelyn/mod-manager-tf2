const showNotification = (message, type = 'success', duration = 5000) => {
    const notificationContainer = document.getElementById('notification-container');

    if (!notificationContainer) {
        console.error('Notification container not found. Please add <div id="notification-container"> in your HTML.');
        return;
    }

    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.role = 'alert';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    notificationContainer.appendChild(alert);

    // Supprimer l'alerte après un certain délai
    setTimeout(() => {
        alert.classList.remove('show');
        alert.classList.add('fade');
        alert.addEventListener('transitionend', () => alert.remove());
    }, duration);
};

// Exporter la fonction pour utilisation globale
module.exports = {
    showNotification
};
