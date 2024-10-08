import { Courses } from './Courses';
import * as errorCode from './errorCodes';
import { getCoursesFromAllStudents } from './studentList.js';

class CoursesController extends Courses {
    constructor() {
        super();
        this.homeworkId = 0;
    }

    tryToModifyHomework(idModif, hmwkName, dateInit, dateFin, courseNameModif) {
        let status = this.#validateHomeworksInput(dateFin, dateInit);
        if (status == errorCode.OK) {
            this.modifyHomework(idModif, hmwkName, dateInit, dateFin, courseNameModif);
        }
        return status;
    }

    tryToCreateCourse(CourseInitials, CourseName, Teacher) {
        this.createCourse(CourseInitials, CourseName, Teacher);
    }

    tryToCreateHomework(hmwkName, dateInit, dateFin, courseName, hoursNeeded) {
        let status = this.#validateHomeworksInput(dateFin, dateInit);
        if (status !== errorCode.OK) {
            return { status };
        }
    
        hoursNeeded = parseInt(hoursNeeded);
        let result = this.createHomework(hmwkName, dateInit, dateFin, courseName, hoursNeeded, this.homeworkId);
    
        if (result.status === errorCode.OK) {
            this.homeworkId++;
            return { 
                status: errorCode.OK, 
                homeworkId: this.homeworkId - 1,
                homework: result.homework 
            };
        } else {
            return { status: result.status };
        }
    }
    

    getAllHomeworksByDate(coursesThatStudentsPasses) {
        let CourseNames = this.getCourseNames();
        let HomeworksArray = [];
        CourseNames.forEach((CourseName) => {
            if (coursesThatStudentsPasses.has(CourseName)) {
                HomeworksArray = HomeworksArray.concat(this.getCourseHomeworks(CourseName));
            }
        });
        return this.getdaysWithHomework(HomeworksArray);
    }

    getStudentHomeworksByDate(coursesEnlisted) {
        let CourseNames = getCoursesFromAllStudents();
        let HomeworksArray = [];
        CourseNames.forEach((CourseName) => {
            if (coursesEnlisted.has(CourseName)) {
                HomeworksArray = HomeworksArray.concat(this.getCourseHomeworks(CourseName));
            }
        });
        return this.getdaysWithHomework(HomeworksArray);
    }

    getStudentHomeworkByClass(course) {
        let assigmentArray = [];
        assigmentArray = assigmentArray.concat(this.getCourseHomeworks(course));
        return this.getdaysWithHomework(assigmentArray);
    }

    getdaysWithHomework(homeworks) {
        let daysWithHomework = {};
        for (const homework of homeworks) {
            if (daysWithHomework[homework.getDateFin()] == undefined) {
                daysWithHomework[homework.getDateFin()] = [homework];
            } else {
                daysWithHomework[homework.getDateFin()].push(homework);
            }
        }
        return daysWithHomework;
    }
    

    #validateHomeworksInput(dateFin, dateInit) {
        let status = 0;
        let today = new Date();
        if (!this.#checkIfDate1IsLowerThan2(today, dateFin)) {
            status = errorCode.DeadlineAlreadyPassed;
        }
        if (!this.#checkIfDate1IsLowerThan2(dateInit, dateFin)) {
            status = errorCode.DeadlineCantBeLowerThanInit;
        }
        return status;
    }

    #checkIfDate1IsLowerThan2(date1, date2) {
        date1 = new Date(date1);
        date2 = new Date(date2);
        return date1 - date2 <= 0;
    }
}

const CoursesControllerSingleton = (function () {
    let instance;
    function createInstance() {
        let object = new CoursesController();
        return object;
    }
    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

export { CoursesControllerSingleton };

