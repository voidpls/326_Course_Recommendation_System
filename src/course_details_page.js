// Handle course details loading from URL parameters
document.addEventListener("DOMContentLoaded", function () {
    loadCourseDetails();
});

function loadCourseDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');

    // Example course data (this would come from a database or API in a real app)
    const courses = {
        "1": {
            title: "Introduction to Machine Learning",
            description: "This course covers fundamental machine learning algorithms...",
            prerequisites: "Linear Algebra, Probability, and Python.",
            schedule: "MWF 10:00 AM - 11:30 AM, Room 101"
        },
        "2": {
            title: "Web Development Fundamentals",
            description: "Learn the basics of HTML, CSS, JavaScript, and responsive design.",
            prerequisites: "None",
            schedule: "TTh 2:00 PM - 3:30 PM, Room 202"
        }
    };

    if (courseId && courses[courseId]) {
        document.getElementById("course-title").textContent = courses[courseId].title;
        document.getElementById("course-description").textContent = courses[courseId].description;
        document.getElementById("course-prerequisites").textContent = courses[courseId].prerequisites;
        document.getElementById("course-schedule").textContent = courses[courseId].schedule;
    } else {
        document.querySelector("main").innerHTML = "<p>Course not found.</p>";
    }
}

// Search Functionality
function searchCourse() {
    let input = document.getElementById("searchBox").value.toLowerCase();
    let courses = {
        "1": {
            title: "Introduction to Machine Learning",
            description: "This course covers fundamental machine learning algorithms...",
            prerequisites: "Linear Algebra, Probability, and Python.",
            schedule: "MWF 10:00 AM - 11:30 AM, Room 101"
        },
        "2": {
            title: "Web Development Fundamentals",
            description: "Learn the basics of HTML, CSS, JavaScript, and responsive design.",
            prerequisites: "None",
            schedule: "TTh 2:00 PM - 3:30 PM, Room 202"
        }
    };

    let found = false;
    for (let id in courses) {
        if (courses[id].title.toLowerCase().includes(input)) {
            document.getElementById("course-title").textContent = courses[id].title;
            document.getElementById("course-description").textContent = courses[id].description;
            document.getElementById("course-prerequisites").textContent = courses[id].prerequisites;
            document.getElementById("course-schedule").textContent = courses[id].schedule;
            found = true;
            break;
        }
    }

    if (!found) {
        document.getElementById("course-title").textContent = "No Course Found";
        document.getElementById("course-description").textContent = "";
        document.getElementById("course-prerequisites").textContent = "";
        document.getElementById("course-schedule").textContent = "";
    }
}
