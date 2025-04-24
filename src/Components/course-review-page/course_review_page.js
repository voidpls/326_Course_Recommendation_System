export function loadCourseReviewPage() {
    loadCourses()
}

async function loadCourses(){
    let courseListElement = document.getElementById("course-list")
    console.log(courseListElement)
    let resoonse = await fetch("Services/course-details-page/complete_course_list.json")
    let courseList = await resoonse.json()
    console.log(courseList)
    for(let i = 0; i < courseList.length; i++){
        let course = courseList[i]
        let course_item = document.createElement("li")
        course_item.className = "course-item"
        course_item.innerHTML = `<div class="rating-box"><h1 class="rating-text">3.1</h1></div><div class="name-box"><h2 class="name-text">${course.code}: ${course.title}</h2></div>`
        //course_item.onclick = courseClick
        course_item.addEventListener("click", function (e) {courseClick(course)}, false)
        course_item.params = course
        courseListElement.appendChild(course_item)
    }
}

function courseClick(course){
    changeSelected(course)
    initAddReview()
    removeReviews()
    loadReviews()
}

function initAddReview(){
    let dropdown = document.getElementById("insert-dropdown")
    dropdown.innerHTML = `
    <div class="dropdown">
        <input
        hidden=""
        class="sr-only"
        name="state-dropdown"
        id="state-dropdown"
        type="checkbox"
        />
        <label
        aria-label="dropdown scrollbar"
        for="state-dropdown"
        class="trigger"
        ></label>
    
        <div class="list webkit-scrollbar" role="list" dir="auto">
            <label for="proffesor" class="info-label">Proffesor: </label>
            <input type="text" class="info" name="proffesor" id="proffesor">
            <label for="attendance" class="info-label">Attendance Required: </label>
            <input type="text" class="info" name="attendance" id="attendance"><br>
            <label for="grade" class="info-label">Grade: </label>
            <input type="text" class="info" name="grade" id="grade">
            <label for="textbook" class="info-label">Textbook: </label>
            <input type="text" class="info" name="textbook" id="textbook"><br>
            <label for="desc" class="info-label">Description: </label><br>
            <textarea type="text" class="desc" name="desc" id="desc"></textarea><br>
            <button class="add" id="add">Add</button>
        </div>
    </div>
    `
    let add_btn = document.getElementById("add")
    add_btn.addEventListener("click", addReview)
}

function changeSelected(course){
    console.log(course)
    let selectedTitle = document.getElementById("course-item-selected")
    let prerequisites = document.getElementById("prerequisites")
    let instructors = document.getElementById("instructors")
    let credits = document.getElementById("credits")
    selectedTitle.innerHTML = `
        <div class="rating-box">
            <h1 class="rating-text">3.1</h1>
        </div>
        <div class="name-box">
            <h1 class="name-text">${course.code}: ${course.title}</h1>
        </div>`
    prerequisites.innerHTML = `Prerequisites: ${course.prerequisites}`
    credits.innerHTML = `Credits: ${course.credits}`
    instructors.innerHTML = `Instructors: ${course.instructors}`
}

function removeReviews(){
    console.log('reviews removed')
}

function loadReviews(){
    console.log('reviews loaded')
}

function addReview(){
    let proffesor = document.getElementById("proffesor").value
    let attendance = document.getElementById("attendance").value
    let grade = document.getElementById("grade").value
    let textbook = document.getElementById("textbook").value
    let desc = document.getElementById("desc").value
    let reviewList = document.getElementById("review-list")
    console.log(reviewList)
    let item = document.createElement('li')
    item.classList.add("review-item")
    item.innerHTML = `
        <div class="line">
            <div class="rating-box">
                <h2 class="rating-text">3.1</h2>
            </div>
            <div class="review-title-box">
                <h2 class="review-title-text">Review title</h2>
            </div>
        </div>
        <div class="line">
            <h4 class="additional-info">Professor Name: ${proffesor}, Mandatory Attendance: ${attendance}, Grade: ${grade}, Textbook: ${textbook}</h4>
        </div>
        <div class="line">
            <p class="paragraph">${desc}</p>
        </div>
    `
    reviewList.insertAdjacentElement("afterbegin", item)
    console.log( proffesor, attendance, grade, textbook, desc)
}