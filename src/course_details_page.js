document.addEventListener("DOMContentLoaded", function () {
    fetchCourses();
});

function fetchCourses() {
    fetch("course_description.json")
        .then(response => response.json())
        .then(data => displayCourses(data))
        .catch(error => console.error("Error loading courses:", error));
}

function displayCourses(courses) {
    let courseList = document.getElementById("courseList");
    courseList.innerHTML = ""; // Clear previous content

    courses.forEach(course => {
        let courseDiv = document.createElement("div");
        courseDiv.classList.add("course-item");

        courseDiv.innerHTML = `
            <h3>${course.course_code}: ${course.title}</h3>
            <p><strong>Instructor(s):</strong> ${course.instructors.join(", ")}</p>
            <p><strong>Description:</strong> ${course.description}</p>
            <p><strong>Prerequisites:</strong> ${course.prerequisites ? course.prerequisites.join(", ") : "None"}</p>
            <p><strong>Credits:</strong> ${course.credits}</p>
        `;

        courseList.appendChild(courseDiv);
    });
}

function searchCourse() {
    let input = document.getElementById("searchBox").value.toLowerCase();
    fetch("course_description.json")
        .then(response => response.json())
        .then(data => {
            let filteredCourses = data.filter(course =>
                course.title.toLowerCase().includes(input) ||
                course.course_code.toLowerCase().includes(input)
            );
            displayCourses(filteredCourses);
        })
        .catch(error => console.error("Error searching courses:", error));
}
