// Database configuration
const DB_NAME = 'CourseRecommenderDB';
const DB_VERSION = 1;
const STORE_NAME = 'userProfile';

// Check for IndexedDB support
if (!window.indexedDB) {
    console.warn("IndexedDB is not supported in this browser. Profile data won't be saved.");
}

// Open or create the database
function openDatabase() {
    if (!window.indexedDB) {
        return Promise.reject("IndexedDB not supported");
    }

    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = (event) => {
            console.error('Database error:', event.target.error);
            reject(event.target.error);
        };
        
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
    });
}

// Save profile data using POST request and IndexedDB
function saveProfileData(data) {
    return fetch('/course-profile', { // Updated endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (!response.ok) {
            throw new Error('Failed to save profile.');
        }
        return response.json();
    }).then(savedData => {
        // Save to IndexedDB after successful server response
        return openDatabase().then(db => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(STORE_NAME, 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.put({ id: 1, ...data }); // Use fixed ID for simplicity

                request.onerror = (event) => {
                    console.error('IndexedDB save error:', event.target.error);
                    reject(event.target.error);
                };

                request.onsuccess = () => {
                    console.log('Profile saved to IndexedDB successfully.');
                    resolve(savedData);
                };
            });
        });
    });
}

// Update profile data using PUT request
function updateProfileData(data) {
    return fetch('/course-profile/1', { // Updated endpoint
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (!response.ok) {
            throw new Error('Failed to update profile.');
        }
        return response.json();
    });
}

// Delete profile data using DELETE request
function deleteProfileData() {
    return fetch('/course-profile/1', { // Updated endpoint
        method: 'DELETE'
    }).then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete profile.');
        }
    });
}

// Load profile data from IndexedDB
function loadProfileData() {
    return openDatabase().then(db => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(1); // Get the profile with ID 1
            
            request.onerror = (event) => {
                console.error('Load error:', event.target.error);
                reject(event.target.error);
            };
            
            request.onsuccess = (event) => {
                resolve(event.target.result || {});
            };
        });
    });
}

// Main profile page setup function
function setupProfilePage() {
    const selectBox = document.getElementById('my-profile-page-interestsSelect');
    const optionsContainer = document.getElementById('my-profile-page-interestsOptions');
    if (!selectBox || !optionsContainer) return;

    const options = document.querySelectorAll('.my-profile-page-option');
    const selectedTagsContainer = document.getElementById('my-profile-page-selectedTags');
    const hiddenInput = document.getElementById('my-profile-page-interests');
    const saveButton = document.querySelector('button[type="submit"]');

    let selectedInterests = [];

    // Toggle dropdown visibility
    selectBox.addEventListener('click', function() {
        optionsContainer.classList.toggle('show');
    });

    // Handle option selection
    options.forEach(option => {
        option.addEventListener('click', function() {
            const value = this.getAttribute('data-value');

            if (selectedInterests.includes(value)) {
                // Remove if already selected
                selectedInterests = selectedInterests.filter(item => item !== value);
                this.classList.remove('selected');
            } else {
                // Add if not selected
                selectedInterests.push(value);
                this.classList.add('selected');
            }

            updateSelectedTags();
            updateHiddenInput();
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!selectBox.contains(e.target) && !optionsContainer.contains(e.target)) {
            optionsContainer.classList.remove('show');
        }
    });

    // Update displayed tags
    function updateSelectedTags() {
        selectedTagsContainer.innerHTML = '';

        if (selectedInterests.length === 0) {
            selectedTagsContainer.innerHTML = '<span style="color: #999;">Select interests...</span>';
            return;
        }

        selectedInterests.forEach(interest => {
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.innerHTML = `${interest}<span class="tag-remove" data-value="${interest}">×</span>`;
            selectedTagsContainer.appendChild(tag);
        });

        // Add remove tag functionality
        document.querySelectorAll('.tag-remove').forEach(removeBtn => {
            removeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const value = this.getAttribute('data-value');
                selectedInterests = selectedInterests.filter(item => item !== value);

                // Update option states
                options.forEach(option => {
                    if (option.getAttribute('data-value') === value) {
                        option.classList.remove('selected');
                    }
                });

                updateSelectedTags();
                updateHiddenInput();
            });
        });
    }

    // Update hidden input with selected interests
    function updateHiddenInput() {
        hiddenInput.value = selectedInterests.join(',');
    }

    // Input validation
    const nameInput = document.getElementById('my-profile-page-name');
    const emailInput = document.getElementById('my-profile-page-email');
    const phoneInput = document.getElementById('my-profile-page-phone');
    const gradYearInput = document.getElementById('my-profile-page-grad_year');

    // Validate name (only letters and spaces allowed)
    nameInput.addEventListener('blur', function () {
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(this.value.trim())) {
            alert('Invalid name. Please enter only letters and spaces.');
            this.focus();
        }
    });

    // Validate email
    emailInput.addEventListener('blur', function () {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.value.trim())) {
            alert('Invalid email format. Please enter a valid email.');
            this.focus();
        }
    });

    // Validate phone (only digits allowed)
    phoneInput.addEventListener('blur', function () {
        const phoneRegex = /^\d+$/;
        if (!phoneRegex.test(this.value.trim())) {
            alert('Invalid phone number. Please enter only digits.');
            this.focus();
        }
    });

    // Validate graduation year (within the next 10 years)
    gradYearInput.addEventListener('blur', function () {
        const currentYear = new Date().getFullYear();
        const gradYear = parseInt(this.value.trim(), 10);
        if (isNaN(gradYear) || gradYear < currentYear || gradYear > currentYear + 10) {
            alert(`Invalid graduation year. Please enter a year between ${currentYear} and ${currentYear + 10}.`);
            this.focus();
        }
    });

    // Load saved profile data when page loads
    loadProfileData().then(savedData => {
        if (savedData) {
            // Fill form fields with saved data
            if (savedData.name) document.getElementById('my-profile-page-name').value = savedData.name;
            if (savedData.email) document.getElementById('my-profile-page-email').value = savedData.email;
            if (savedData.phone) document.getElementById('my-profile-page-phone').value = savedData.phone;
            if (savedData.gradYear) document.getElementById('my-profile-page-grad_year').value = savedData.gradYear;
            if (savedData.contact) document.getElementById('my-profile-page-contact').value = savedData.contact;
            
            // Handle interests
            if (savedData.interests) {
                selectedInterests = savedData.interests.split(',');
                // Mark options as selected
                options.forEach(option => {
                    const value = option.getAttribute('data-value');
                    if (selectedInterests.includes(value)) {
                        option.classList.add('selected');
                    }
                });
                updateSelectedTags();
                updateHiddenInput();
            }
            
            // Update summary with saved data
            updateProfileSummary(savedData);
        }
    }).catch(error => {
        console.error('Failed to load profile data:', error);
    });

    // Update profile summary display
    function updateProfileSummary(data) {
        document.getElementById('summary-name').textContent = data.name || 'X';
        document.getElementById('summary-email').textContent = data.email || 'X@example.com';
        document.getElementById('summary-phone').textContent = data.phone || '123';
        document.getElementById('summary-grad-year').textContent = data.gradYear || '202X';
        document.getElementById('summary-interests').textContent = 
            (data.interests && data.interests.split(',').join(', ')) || 'None';
        document.getElementById('summary-contact').textContent = data.contact || 'None';
    }

    // Save button click handler
    saveButton.addEventListener('click', function(e) {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('my-profile-page-name').value.trim();
        const email = document.getElementById('my-profile-page-email').value.trim();
        const phone = document.getElementById('my-profile-page-phone').value.trim();
        const gradYear = document.getElementById('my-profile-page-grad_year').value.trim();
        const contact = document.getElementById('my-profile-page-contact').value.trim();
        const interests = hiddenInput.value;

        // Input validation
        const nameRegex = /^[a-zA-Z\s]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d+$/;
        const currentYear = new Date().getFullYear();
        const gradYearInt = parseInt(gradYear, 10);

        let errors = [];

        if (!nameRegex.test(name)) {
            errors.push('Invalid name: Please enter only letters and spaces.');
        }

        if (!emailRegex.test(email)) {
            errors.push('Invalid email: Please enter a valid email format.');
        }

        if (!phoneRegex.test(phone)) {
            errors.push('Invalid phone number: Please enter only digits.');
        }

        if (isNaN(gradYearInt) || gradYearInt < currentYear || gradYearInt > currentYear + 10) {
            errors.push(`Invalid graduation year: Please enter a year between ${currentYear} and ${currentYear + 10}.`);
        }

        if (!contact) {
            errors.push('Preferred contact method cannot be empty.');
        }

        // If there are errors, show them in an alert
        if (errors.length > 0) {
            alert('Please fix the following errors:\n\n' + errors.join('\n'));
            return;
        }

        // Prepare data to save
        const profileData = {
            name,
            email,
            phone,
            gradYear,
            contact,
            interests
        };

        // Save data to server and IndexedDB
        saveProfileData(profileData)
            .then(() => {
                alert('Profile saved successfully!');
                // Update the profile summary on the page
                updateProfileSummary(profileData);
            })
            .catch(error => {
                console.error('Error saving profile:', error);
                alert('Failed to save profile.');
            });
    });

    // Initialize
    updateSelectedTags();

    // 🛠 Attach logout functionality

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            if (confirm("Are you sure you want to log out?")) {
                // Clear stored login info
                localStorage.removeItem("user-username");
                localStorage.removeItem("user-password");
                localStorage.removeItem("guest-id");

                // Redirect to login page
                window.location.href = "login.html";
            }
        });
    }
}

