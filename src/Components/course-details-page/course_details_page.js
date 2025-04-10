// Rate My Professors linkifier
function linkifyInstructorNames(instructors) {
    return instructors.split(', ').map(name => {
        const urlName = name.trim().replace(/\s+/g, '+');
        const rmpURL = `https://www.ratemyprofessors.com/search/professors/1513?q=${urlName}`;
        return `<a href="${rmpURL}" target="_blank" rel="noopener noreferrer" class="rmp-link">${name}</a>`;
    }).join(', ');
}

function extractAllCourseCodes() {
    const codes = new Set();
    courses.forEach(course => {
        const upperCode = course.code.toUpperCase();
        if ((upperCode.startsWith("COMPSCI") || upperCode.startsWith("CICS")) && !upperCode.startsWith("MATH") && !upperCode.startsWith("INFO")) {
            codes.add(upperCode);
        }
    });
    return codes;
}

const courseCodesSet = new Set();
document.addEventListener("DOMContentLoaded", () => {
    if (typeof courses !== "undefined" && Array.isArray(courses)) {
        extractAllCourseCodes().forEach(code => courseCodesSet.add(code));
        displayCourses();
    } else {
        const interval = setInterval(() => {
            if (typeof courses !== "undefined" && Array.isArray(courses)) {
                extractAllCourseCodes().forEach(code => courseCodesSet.add(code));
                displayCourses();
                clearInterval(interval);
            }
        }, 100);
    }
});

function displayCourses(list = courses, addBackButton = false) {
    const courseList = document.getElementById("course-details-courseList");
    if (!courseList) return;
    courseList.innerHTML = "";

    if (list.length === 0) {
        courseList.innerHTML = "<p>No matching courses found.</p>";
        return;
    }

    list.forEach(course => {
        const div = document.createElement("div");
        div.classList.add("course-details-course-item");

        const instructors = Array.isArray(course.instructors) ? course.instructors.join(", ") : course.instructors || "N/A";
        const prerequisites = Array.isArray(course.prerequisites) ? course.prerequisites.join(", ") : course.prerequisites || "None";

        const prereqButtons = prerequisites.replace(/\b(COMPSCI\s*\d+|CICS\s*\d+)\b/gi, match => {
            const clean = match.trim().replace(/\s+/g, ' ');
            const upper = clean.toUpperCase();
            return courseCodesSet.has(upper) ? `<button class=\"prereq-button\" data-code=\"${clean}\">${clean}</button>` : match;
        });

        div.innerHTML = `
      <h3>${course.code || "Unknown Code"}: ${course.title || "Untitled Course"}</h3>
      <p><strong>Instructors:</strong> ${linkifyInstructorNames(instructors)}</p>
      <p><strong>Description:</strong> ${course.description || "No description available."}</p>
      <p><strong>Prerequisites:</strong> ${prereqButtons}</p>
      <p><strong>Credits:</strong> ${course.credits ?? "N/A"}</p>
      <p><strong>Offered Semester:</strong> ${course.frequency ?? "N/A"}</p>
    `;

        if (addBackButton) {
            const backBtn = document.createElement("button");
            backBtn.textContent = "⬅️ Back";
            backBtn.id = "back-button";
            backBtn.addEventListener("click", () => {
                displayCourses(courses);
            });
            div.appendChild(backBtn);
        }

        courseList.appendChild(div);
    });

    attachPrereqHandlers();
}

function attachPrereqHandlers() {
    document.querySelectorAll(".prereq-button").forEach(btn => {
        btn.addEventListener("click", () => {
            const courseCode = btn.getAttribute("data-code").toLowerCase();
            document.getElementById("course-details-searchBox").value = courseCode;
            document.getElementById("course-details-searchBtn").click();
        });
    });
}

function setupSearch() {
    const searchBox = document.getElementById("course-details-searchBox");
    const searchBtn = document.getElementById("course-details-searchBtn");

    if (!searchBox || !searchBtn) {
        console.error("Search input or button not found!");
        return;
    }

    searchBtn.addEventListener("click", () => {
        const query = searchBox.value.trim().toLowerCase();
        displayCourses(
            query === "" ? courses : courses.filter(course => {
                const code = course.code.toLowerCase();
                const number = code.match(/\d+/)?.[0] || "";
                const title = course.title?.toLowerCase() || "";
                return code.includes(query) || number === query || title.includes(query);
            }),
            query !== "" // add back button only for filtered results
        );
    });
}
