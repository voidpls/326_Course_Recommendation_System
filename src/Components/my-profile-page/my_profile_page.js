// my_profile_page.js

// ——————————————————————————————————————————————————————————————
//  IndexedDB setup (unchanged)
// ——————————————————————————————————————————————————————————————

const DB_NAME    = 'CourseRecommenderDB';
const DB_VERSION = 1;
const STORE_NAME = 'userProfile';

function openDatabase() {
    if (!window.indexedDB) return Promise.reject("IndexedDB not supported");
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onerror = e    => reject(e.target.error);
        req.onsuccess = e  => resolve(e.target.result);
        req.onupgradeneeded = e => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
    });
}

function saveProfileData(data) {
    const token = localStorage.getItem('token');
    return fetch('/api/course_profile', {
        method:      'PUT',
        credentials: 'include',
        headers: {
            'Content-Type':  'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(data)
    })
        .then(res => {
            if (!res.ok) throw new Error('Failed to save profile.');
            return res.json();
        })
        .then(saved => {
            return openDatabase().then(db => new Promise((resolve, reject) => {
                const tx    = db.transaction(STORE_NAME, 'readwrite');
                const store = tx.objectStore(STORE_NAME);
                const req   = store.put({ id: 1, ...data });
                req.onerror   = e => reject(e.target.error);
                req.onsuccess = () => resolve(saved);
            }));
        });
}

function loadProfileData() {
    return fetch('/api/course_profile', { credentials: 'include' })
        .then(res => {
            if (!res.ok) throw new Error();
            return res.json();
        })
        .then(({ user, taken }) => ({
            name:     user.name,
            email:    user.email,
            phone:    user.phone,
            gradYear: user.graduation_year,
            interests:user.interests,
            contact:  user.preferred_contact,
            taken
        }))
        .catch(() =>
            openDatabase().then(db => new Promise((resolve, reject) => {
                const tx    = db.transaction(STORE_NAME, 'readonly');
                const store = tx.objectStore(STORE_NAME);
                const req   = store.get(1);
                req.onerror   = () => reject(req.error);
                req.onsuccess = () => resolve(req.result || {});
            }))
        );
}

// ——————————————————————————————————————————————————————————————
//  Main UI wiring (inject interests → then wire everything else)
// ——————————————————————————————————————————————————————————————

document.addEventListener('DOMContentLoaded', () => {
    const selectBox        = document.getElementById('my-profile-page-interestsSelect');
    const optionsContainer = document.getElementById('my-profile-page-interestsOptions');
    if (!selectBox || !optionsContainer) return;

    fetch('/Services/course-details-page/sorted_full_course_list.json')
        .then(r => r.json())
        .then(courses => {
            optionsContainer.innerHTML = courses
                .map(c => `<div class="my-profile-page-option" data-value="${c.code}">${c.title}</div>`)
                .join('');
            setupProfilePage();
        })
        .catch(err => {
            console.error('Could not load interest list:', err);
            setupProfilePage();
        });
});

function setupProfilePage() {
    const selectBox        = document.getElementById('my-profile-page-interestsSelect');
    const optionsContainer = document.getElementById('my-profile-page-interestsOptions');
    const options          = optionsContainer.querySelectorAll('.my-profile-page-option');
    const selectedTags     = document.getElementById('my-profile-page-selectedTags');
    const hiddenInput      = document.getElementById('my-profile-page-interests');
    const saveButton       = document.querySelector('button[type="submit"]');

    let selectedInterests = [];

    // helper to refresh sidebar
    function updateProfileSummary(data) {
        document.getElementById('summary-name').textContent      = data.name    || 'X';
        document.getElementById('summary-email').textContent     = data.email   || 'X@example.com';
        document.getElementById('summary-phone').textContent     = data.phone   || '123';
        document.getElementById('summary-grad-year').textContent = data.gradYear|| '202X';
        document.getElementById('summary-interests').textContent =
            data.interests
                ? data.interests.split(',').join(', ')
                : 'None';
        document.getElementById('summary-contact').textContent   = data.contact || 'None';
    }

    // toggle dropdown
    selectBox.addEventListener('click', () => {
        optionsContainer.classList.toggle('show');
    });

    // option click
    options.forEach(opt => opt.addEventListener('click', function() {
        const v = this.dataset.value;
        if (selectedInterests.includes(v)) {
            selectedInterests = selectedInterests.filter(x => x !== v);
            this.classList.remove('selected');
        } else {
            selectedInterests.push(v);
            this.classList.add('selected');
        }
        renderTags();
    }));

    // close if outside
    document.addEventListener('click', e => {
        if (!selectBox.contains(e.target) && !optionsContainer.contains(e.target)) {
            optionsContainer.classList.remove('show');
        }
    });

    function renderTags() {
        selectedTags.innerHTML = '';
        if (selectedInterests.length === 0) {
            selectedTags.innerHTML = '<span style="color:#999">Select interests...</span>';
            hiddenInput.value = '';
            return;
        }
        selectedInterests.forEach(val => {
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.innerHTML = `
        ${val}
        <span class="tag-remove" data-value="${val}">×</span>
      `;
            selectedTags.appendChild(tag);
        });
        hiddenInput.value = selectedInterests.join(',');
        // wire up removers
        selectedTags.querySelectorAll('.tag-remove').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                const v = btn.dataset.value;
                selectedInterests = selectedInterests.filter(x => x !== v);
                options.forEach(o => {
                    if (o.dataset.value === v) o.classList.remove('selected');
                });
                renderTags();
            });
        });
    }

    // load saved
    loadProfileData()
        .then(data => {
            // form fields
            document.getElementById('my-profile-page-name').value      = data.name    || '';
            document.getElementById('my-profile-page-email').value     = data.email   || '';
            document.getElementById('my-profile-page-phone').value     = data.phone   || '';
            document.getElementById('my-profile-page-grad_year').value = data.gradYear|| '';
            document.getElementById('my-profile-page-contact').value   = data.contact || '';

            // interests
            if (data.interests) {
                selectedInterests = Array.isArray(data.interests)
                    ? data.interests
                    : data.interests.split(',');
                options.forEach(o => {
                    if (selectedInterests.includes(o.dataset.value)) {
                        o.classList.add('selected');
                    }
                });
            }
            renderTags();
            // sidebar
            updateProfileSummary(data);
        })
        .catch(err => console.error('Load profile error:', err));

    // save handler
    saveButton.addEventListener('click', e => {
        e.preventDefault();
        // You already have your validation… then:
        const payload = {
            name:      document.getElementById('my-profile-page-name').value.trim(),
            email:     document.getElementById('my-profile-page-email').value.trim(),
            phone:     document.getElementById('my-profile-page-phone').value.trim(),
            gradYear:  document.getElementById('my-profile-page-grad_year').value.trim(),
            contact:   document.getElementById('my-profile-page-contact').value.trim(),
            interests: hiddenInput.value
        };

        saveProfileData(payload)
            .then(() => {
                alert('Profile saved successfully!');
                // ← new: update sidebar immediately
                updateProfileSummary(payload);
            })
            .catch(err => {
                console.error('Error saving profile:', err);
                alert('Failed to save profile.');
            });
    });

    // logout (unchanged)
    const logoutBtn = document.getElementById('logout-button');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to log out?")) {
                localStorage.removeItem('token');
                fetch('/api/logout', { method:'POST', credentials:'include' })
                    .finally(() => window.location.href = '/login.html');
            }
        });
    }

    // init empty tags state
    renderTags();
}
