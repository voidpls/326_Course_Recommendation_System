// indexeddb constants
const DB_NAME = 'courseProgressDB';
const STORE_NAME = 'courseData';


// set initialization method to be global via window
window.courseProgressPageSetup = async function() {
    const cs_bs_2023_flowchart = await fetch('Components/course_progress_chart/cs_bs_2023_flowchart.html');
    const html = await cs_bs_2023_flowchart.text();
    const parent = document.getElementById('course-flowchart-container');

    parent.innerHTML = html;

    await initFlowchart();
    await initSelectionButtons();
};

async function initSelectionButtons() {
    const selectionBtns = document.getElementsByClassName('course-progress-chart-button');
    Array.from(selectionBtns)
        .forEach(btn => btn.addEventListener('click', async () => await changeCourse(selectionBtns, btn)));
}

async function changeCourse(btns, btn) {
    if (btn.classList.contains("course-progress-chart-button-selected")) return

    // remove selected from all selection btns
    Array.from(btns).forEach(btn => btn.classList.remove('course-progress-chart-button-selected'));

    // add selected to new btn
    btn.classList.add('course-progress-chart-button-selected');

    const parent = document.getElementById('course-flowchart-container');
    if (btn.id === 'flowchart-2023') {
        const cs_bs_2023_flowchart = await fetch('Components/course_progress_chart/cs_bs_2023_flowchart.html');
        const html = await cs_bs_2023_flowchart.text();
    
        parent.innerHTML = html;
    
    } else if (btn.id === 'flowchart-2016') {
        const cs_bs_2016_flowchart = await fetch('Components/course_progress_chart/cs_bs_2016_flowchart.html');
        const html = await cs_bs_2016_flowchart.text();

        parent.innerHTML = html;
    }

    await initFlowchart();
}

async function initFlowchart() {
    // load saved state when page loads
    await loadFormState();    

    // get all course boxes
    const courseBoxes = document.querySelectorAll('.course-box');
    
    // add click event to each course box
    courseBoxes.forEach(box => {
        box.addEventListener('click', function(e) {
            // check if this box has a text input
            const inputId = this.id + '_input';
            const inputElement = document.getElementById(inputId);
            
            // if it doesn't have an input or the click wasn't on the input
            if (!inputElement) {
                toggleSelection(this);
            }
        });
    });
    
    // add input event listeners to all text inputs
    const textInputs = document.querySelectorAll('.text-input');
    textInputs.forEach(input => {
        input.addEventListener('input', function() {
            const courseId = this.id.replace('_input', '');
            const courseBox = document.getElementById(courseId);
            
            if (this.value.trim() !== '') {
                courseBox.classList.add('selected');
            } else {
                courseBox.classList.remove('selected');
            }
            saveFormState(); // save form state
        });
        
        // prevent clicks on inputs from toggling the course box
        input.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
    
    // submit button
    document.getElementById('course-progress-chart-submitBtn').addEventListener('click', function() {
        submitForm();
    });
}


async function submitForm() {
    await saveFormState();
    /* 
        <SAVE FORM STATE TO BACKEND ALSO HERE>
    */
    const selectedCourses = [];
    const selectedBoxes = document.querySelectorAll('.course-box.selected');

    selectedBoxes.forEach(box => {
        const courseId = box.id;
        let displayText = courseId;
        
        // if the course has an input field, append its value
        const input = document.getElementById(courseId + '_input');
        if (input && input.value.trim() !== '') {
            displayText += ': ' + input.value.trim();
        }
        
        selectedCourses.push(displayText);
    });

    console.log(selectedCourses);

    
    // display results
    const resultsList = document.getElementById('course-progress-chart-results-list');
    resultsList.innerHTML = selectedCourses.join(', ')
    
    document.getElementById('course-progress-chart-results').style.display = 'block';
}

async function toggleSelection(courseBox) {
    courseBox.classList.toggle('selected');
    await saveFormState(); // save form state
}

async function saveFormState() {
    try {
        // init indexeddb
        const db = await openDB();
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        // save selected course boxes
        const selectedBoxes = document.querySelectorAll('.course-box.selected');
        const selectedIds = Array.from(selectedBoxes).map(box => box.id);
        
        // save input values
        const inputs = document.querySelectorAll('.text-input');
        const inputValues = {};
        inputs.forEach(input => {
            if (input.value.trim() !== '') {
                inputValues[input.id] = input.value;
            }
        });

        store.put({ id: 'selectedCourses', data: selectedIds });
        store.put({ id: 'courseInputs', data: inputValues });
        
        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => resolve();
            transaction.onerror = (event) => reject('Transaction error: ' + event.target.error);
        });
    } catch(e) {
        console.log('Error saving form state:', e);
    }
}

async function loadFormState() {
    try {
        const db = await openDB();
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        
        // get selected courses (promise)
        const selectedCourses = new Promise((resolve, reject) => {
            const request = store.get('selectedCourses');
            request.onsuccess = () => resolve(request.result ? request.result.data : []);
            request.onerror = () => reject(request.error);
        });

        // get course inputs (promise)
        const courseInputs = new Promise((resolve, reject) => {
            const request = store.get('courseInputs');
            request.onsuccess = () => resolve(request.result ? request.result.data : {});
            request.onerror = () => reject(request.error);
        });


        // resolve database get promises
        const [selectedIds, inputValues] = await Promise.all([selectedCourses, courseInputs]);

        // mark all selected inputs as selected in DOM
        selectedIds.forEach(id => {
            const courseBox = document.getElementById(id);
            if (courseBox) {
                courseBox.classList.add('selected');
            }
        });

        // fill in any input values in DOM
        Object.keys(inputValues).forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.value = inputValues[inputId];
            }
        });      
    } catch (e) {
        console.log('Error loading form state:', e);
    }
}


// indexeddb helper function
async function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME);
        
        request.onerror = (event) => {
            reject('IndexedDB error: ' + event.target.error);
        };
        
        request.onupgradeneeded = (event) => {
            // if no database exists
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
        
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
    });
}
