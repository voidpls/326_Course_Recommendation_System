class User {
  #user_id;
  #completed_courses;
  #interests;
  #major;

  constructor() {
    this.user_id = '0000';
    this.completed_courses = [];
    this.interests = '';
    this.major = 'None';
  }

  constructor(user_id, completed_courses, interests, major) {
    this.user_id = user_id;
    this.completed_courses = completed_courses;
    this.interests = interests;
    this.major = major;
  }
  
  addCompletedCourse(course_name) {
    this.completed_courses.push(course_name);
  }

  getCompletedCourses() {
    return this.completed_courses;
  }
  
  updateInterests(newInterests) {
    this.interests = newInterests;
  }

  getInterests() {
    return this.interests;
  }

  changeMajor(newMajor) {
    this.major = newMajor;
  }

  getMajor() {
    return this.major;
  }
}
export default User;