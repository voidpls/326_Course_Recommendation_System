class User {
  constructor(user_id, name, email, gradYear, completed_courses, interests, preferContact) {
    this.user_id = user_id;
    this.name = name;
    this.email = email;
    this.gradYear = gradYear;
    this.completed_courses = completed_courses;
    this.interests = interests;
    this.preferContact = preferContact;
  }
  
  updateUserId(newUserId) {
    this.user_id = newUserId;
  }

  getUserId() {
    return this.user_id;
  }

  updateName(newName) {
    this.name = newName;
  }

  getName() {
    return this.name;
  }

  updateEmail(newEmail) {
    this.email = newEmail;
  }

  getEmail() {
    return this.email;
  }

  updateGradYear(newGradYear) {
    this.gradYear = newGradYear;
  } 

  getGradYear() {
    return this.gradYear;
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

  updatePreferContact(newPreferContact) {
    this.preferContact = newPreferContact;
  }

  getPreferContact() {
    return this.preferContact;
  }

  getUserInfo() {
    return {
      user_id: this.user_id,
      name: this.name,
      email: this.email,
      gradYear: this.gradYear,
      completed_courses: this.completed_courses,
      interests: this.interests,
      preferContact: this.preferContact
    };
  }
}
module.exports.User = User;