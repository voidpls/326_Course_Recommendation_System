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
        if (upperCode.startsWith("COMPSCI") || upperCode.startsWith("CICS")) {
            codes.add(upperCode);
        }
    });
    return codes;
}

function matchesCourseLevel(courseCode, selectedLevels) {
    const numberMatch = courseCode.match(/\b(\d{3})\b/);
    if (!numberMatch) return false;
    const courseNum = parseInt(numberMatch[1]);
    const courseLevel = Math.floor(courseNum / 100) * 100;
    return selectedLevels.includes(courseLevel.toString());
}

const courseCodesSet = new Set();
document.addEventListener("DOMContentLoaded", () => {
    if (typeof courses !== "undefined" && Array.isArray(courses)) {
        extractAllCourseCodes().forEach(code => courseCodesSet.add(code));
        displayCourses();
        setupFilters();
    } else {
        const interval = setInterval(() => {
            if (typeof courses !== "undefined" && Array.isArray(courses)) {
                extractAllCourseCodes().forEach(code => courseCodesSet.add(code));
                displayCourses();
                setupFilters();
                clearInterval(interval);
            }
        }, 100);
    }
});

let lastScrollPosition = 0;

function displayCourses(list = courses, addBackButton = false, isFromFilter = false) {
    const courseList = document.getElementById("course-details-courseList");
    if (!courseList) return;
    courseList.innerHTML = "";

    if (addBackButton && !isFromFilter) {
        const backBtn = document.createElement("button");
        backBtn.textContent = "⬅️ Back";
        backBtn.id = "back-button";

        backBtn.addEventListener("click", () => {
            displayCourses(courses);

            // ✨ After rendering, restore scroll position
            window.scrollTo({
                top: lastScrollPosition,
                behavior: "instant" // or "smooth" if you prefer
            });
        });

        courseList.appendChild(backBtn);
    }

    if (list.length === 0) {
        courseList.innerHTML += "<p>No matching courses found.</p>";
        return;
    }

    list.forEach(course => {
        const div = document.createElement("div");
        div.classList.add("course-details-course-item");

        const instructors = Array.isArray(course.instructors) ? course.instructors.join(", ") : course.instructors || "N/A";
        const prerequisites = Array.isArray(course.prerequisites) ? course.prerequisites.join(", ") : course.prerequisites || "None";

        const prereqButtons = prerequisites.replace(/\b(COMPSCI\s*\d+|CICS\s*\d+|\d{3})\b/gi, (match, _, offset, string) => {
            const clean = match.trim().replace(/\s+/g, ' ');
            const upper = clean.toUpperCase();

            if (!upper.startsWith("COMPSCI") && !upper.startsWith("CICS")) {
                const nearby = string.slice(Math.max(0, offset - 30), offset + 30).toUpperCase();
                const grouped = /(COMPSCI|CICS)\s*\d+.*(OR|AND).*\b\d{3}\b/.test(nearby);
                if (!grouped) return match;
            }

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

        courseList.appendChild(div);
    });

    attachPrereqHandlers();
}

function attachPrereqHandlers() {
    document.querySelectorAll(".prereq-button").forEach(btn => {
        btn.addEventListener("click", () => {
            document.getElementById("course-details-searchBox").value = btn.getAttribute("data-code").toLowerCase();
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
        lastScrollPosition = window.scrollY || document.documentElement.scrollTop;
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

function setupFilters() {
    const sidebar = document.getElementById("course-details-filters");
    if (!sidebar) return;

    const levelFilters = [100, 200, 300, 400, 500];
    const semesterFilters = ["Fall", "Spring"];

    const filterSection = document.createElement("div");
    filterSection.innerHTML = `
      <h4>Filter by Course Level</h4>
      ${levelFilters.map(level => `
        <label><input type="checkbox" class="filter-level" value="${level}"> ${level}</label><br>
      `).join('')}
      <h4>Filter by Semester</h4>
      ${semesterFilters.map(sem => `
        <label><input type="checkbox" class="filter-semester" value="${sem}"> ${sem}</label><br>
      `).join('')}
    `;
    sidebar.appendChild(filterSection);

    sidebar.addEventListener("change", () => {
        const selectedLevels = Array.from(document.querySelectorAll(".filter-level:checked")).map(cb => cb.value);
        const selectedSemesters = Array.from(document.querySelectorAll(".filter-semester:checked")).map(cb => cb.value);

        const filtered = courses.filter(course => {
            const levelMatch = selectedLevels.length === 0 || matchesCourseLevel(course.code, selectedLevels);
            const semesterMatch = selectedSemesters.length === 0 || selectedSemesters.some(sem => course.frequency?.includes(sem));
            return levelMatch && semesterMatch;
        });

        displayCourses(filtered, false, true);
    });
}
