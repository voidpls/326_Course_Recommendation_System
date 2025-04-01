document.addEventListener("DOMContentLoaded", async () => {
    const cs_bs_2023_flowchart = await fetch('Components/course_progress_chart/cs_bs_2023_flowchart.html')
    const html = await cs_bs_2023_flowchart.text()
    const parent = document.getElementById('course-flowchart-container')

    parent.innerHTML = html

    initFlowchart();
});

function initFlowchart() {
    // load saved state when page loads
    loadFormState();    

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
    

}


function toggleSelection(courseBox) {
    courseBox.classList.toggle('selected');
    saveFormState(); // save form state
}

function saveFormState() {
    // save selected course boxes
    const selectedBoxes = document.querySelectorAll('.course-box.selected');
    const selectedIds = Array.from(selectedBoxes).map(box => box.id);
    localStorage.setItem('selectedCourses', JSON.stringify(selectedIds));
    
    // save input values
    const inputs = document.querySelectorAll('.text-input');
    const inputValues = {};
    inputs.forEach(input => {
        if (input.value.trim() !== '') {
            inputValues[input.id] = input.value;
        }
    });
    localStorage.setItem('courseInputs', JSON.stringify(inputValues));
}

function loadFormState() {
    // load selected courses
    const selectedIds = JSON.parse(localStorage.getItem('selectedCourses') || '[]');
    selectedIds.forEach(id => {
        const courseBox = document.getElementById(id);
        if (courseBox) {
            courseBox.classList.add('selected');
        }
    });
    
    // load input values
    const inputValues = JSON.parse(localStorage.getItem('courseInputs') || '{}');
    Object.keys(inputValues).forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.value = inputValues[inputId];
        }
    });
}
