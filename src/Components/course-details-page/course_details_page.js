

function displayCourses(list) {
    const courseList = document.getElementById("course-details-courseList");
    courseList.innerHTML = "";

    if (list.length === 0) {
        courseList.innerHTML = "<p>No matching courses found.</p>";
        return;
    }

    list.forEach(course => {
        const div = document.createElement("div");
        div.classList.add("course-details-course-item");

        // Normalize instructors
        const instructors = Array.isArray(course.instructors)
            ? course.instructors.join(", ")
            : course.instructors || "N/A";

        // Normalize prerequisites
        const prerequisites = Array.isArray(course.prerequisites)
            ? course.prerequisites.join(", ")
            : course.prerequisites || "None";

        div.innerHTML = `
      <h3>${course.code || "Unknown Code"}: ${course.title || "Untitled Course"}</h3>
      <p><strong>Instructors:</strong> ${instructors}</p>
      <p><strong>Description:</strong> ${course.description || "No description available."}</p>
      <p><strong>Prerequisites:</strong> ${prerequisites}</p>
      <p><strong>Credits:</strong> ${course.credits ?? "N/A"}</p>
      <p><strong>Offered Semester:</strong> ${course.frequency ?? "N/A"}</p>
    `;

        courseList.appendChild(div);
    });
}

function setupSearch() {
    const searchBox = document.getElementById("course-details-searchBox");
    const searchBtn = document.getElementById("course-details-searchBtn");

    if (!searchBox || !searchBtn) {
        console.error("Search input or button not found!");
        return;
    }

    searchBtn.addEventListener("click", ()=>{
        const searchBox = document.getElementById("course-details-searchBox");
        const query = searchBox.value.trim().toLowerCase();
        displayCourses(query === "" ? courses : courses.filter(course => {
            const code = course.code.toLowerCase();
            const number = code.match(/\d+/)?.[0] || "";
            const title = course.title?.toLowerCase() || "";

            return (
                code.includes(query) ||
                number === query ||
                title.includes(query)
            );
        }));
    });
}