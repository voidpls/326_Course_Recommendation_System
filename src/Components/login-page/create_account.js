document
    .getElementById('signup-form')
    .addEventListener('submit', async e => {
        e.preventDefault();
        const username = document.getElementById('create_account_username').value.trim();
        const password = document.getElementById('create_account_password').value;

        try {
            const res = await fetch('/users/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            if (res.status === 201) {
                alert('Account created! Please log in.');
                window.location.href = 'login.html';
            } else {
                const err = await res.json();
                alert('Error: ' + err.error);
            }
        } catch (e) {
            console.error(e);
            alert('Network error.');
        }
    });

const backBtn = document.querySelector('.back-login-button');

if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.location.href = '../../../login.html';
    });
}
