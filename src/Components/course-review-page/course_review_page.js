window.loadCourseReviewPage = function(){
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
            <label for="title" class="info-label">Title: </label>
            <input type="text" class="info" name="title" id="title">
            <label for="rating" class="info-label">Rating: </label>
            <input type="number" class="info" name="rating" id="rating"><br>
            <label for="proffesor" class="info-label">Proffesor: </label>
            <input type="text" class="info" name="proffesor" id="proffesor">
            <label for="attendance" class="info-label">Attendance Required: </label>
            <input type="text" class="info" name="attendance" id="attendance"><br>
            <label for="grade" class="info-label">Grade: </label>
            <input type="number" class="info" name="grade" id="grade">
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
    let reviewList = document.getElementById("review-list")
    reviewList.innerHTML = ""
}

async function deleteReview(courseID) {
    let rawRes = await fetch('/course-reviews/review/1', { //1 is dummy val
        method: 'DELETE'
    })
    let res = await rawRes.json()
    console.log(res)
}

async function loadReviews(){
    let rawRes = await fetch('/course-reviews/reviews/1', { //1 is dummy val
        method: "GET",
        headers: {
            'Accept': 'application/json'
        }
    })
    let res = await rawRes.json()
    console.log(res)
    for(let review of res){
        addReviewElement(review.title, review.professor, review.mand_attendance, review.grade, review.rating, review.desc)
    }
}

function addReviewElement(title, professor, attendance, grade, rating, desc){
    let reviewList = document.getElementById("review-list")
    let item = document.createElement('li')
    item.classList.add("review-item")
    item.innerHTML = `
        <div class="line">
            <div class="rating-box">
                <h2 class="rating-text">${rating}</h2>
            </div>
            <div class="review-title-box">
                <h2 class="review-title-text">${title}</h2>
            </div>
        </div>
        <div class="line">
            <h4 class="additional-info">Professor Name: ${professor}, Mandatory Attendance: ${attendance}, Grade: ${grade}</h4>
        </div>
        <div class="line">
            <p class="paragraph">${desc}</p>
        </div>
    `
    reviewList.insertAdjacentElement("afterbegin", item)
}

async function addReview(){
    let title = document.getElementById("title").value
    let proffesor = document.getElementById("proffesor").value
    let attendance = document.getElementById("attendance").value
    let grade = document.getElementById("grade").value
    let rating = document.getElementById("rating").value
    let desc = document.getElementById("desc").value
    addReviewElement(title, proffesor, attendance, grade, rating, desc)
    // let reviewList = document.getElementById("review-list")
    // let item = document.createElement('li')
    // item.classList.add("review-item")
    // item.innerHTML = `
    //     <div class="line">
    //         <div class="rating-box">
    //             <h2 class="rating-text">${rating}</h2>
    //         </div>
    //         <div class="review-title-box">
    //             <h2 class="review-title-text">${title}</h2>
    //         </div>
    //     </div>
    //     <div class="line">
    //         <h4 class="additional-info">Professor Name: ${proffesor}, Mandatory Attendance: ${attendance}, Grade: ${grade}</h4>
    //     </div>
    //     <div class="line">
    //         <p class="paragraph">${desc}</p>
    //     </div>
    // `
    // reviewList.insertAdjacentElement("afterbegin", item)
    
    let rawRes = await fetch('/course-reviews/review', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title,
            professor: proffesor,
            attendance: attendance,
            grade: grade,
            rating: rating,
            desc: desc
        })
    })
    let res = await rawRes.json()
    console.log(res)
    console.log(title, proffesor, attendance, grade, rating, desc)
}