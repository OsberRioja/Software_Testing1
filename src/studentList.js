import Student from "./estudiante.js";
import { combineDicts } from "./predefinedStudents.js";

let studentPassword = "123"

let studentName = ""

let studentDict = {}


function getStudentsFromJson()
{
    let neoDict = combineDicts()

    for (let course of neoDict) {
        for (let studentData of course.students) {
            let student = new Student(studentData)
            if (!studentDict[student.getName()]) {
                studentDict[student.getName()] = student
            }
            studentDict[student.getName()].addCoursesToStudent(course.course)
        }
    }
}

function getStudents()
{
    return studentDict
}

function studentLogIn(name, password) {
    return (name in studentDict && password == studentPassword);
}


function seeIfStudentExist(name)
{
    if(name in studentDict)
    {
        return studentDict[name]
    }
    return null

}

function setStudentName(name)
{
    studentName = name
}

function getStudentName()
{
    return studentName
}

function getCoursesFromAllStudents()
{
    let courses = new Set();
    for(let key in studentDict)
    {
        let student = studentDict[key].getCoursesStudent()
        for(let course of student)
        {
            courses.add(course)
        }
    }
    return courses
}

function getCoursesFromAllStudentsWithinACourse(courseToCheck)
{
    let courses = new Set();
    for (const key in studentDict) {

        let studentCourses = studentDict[key].getCoursesStudent()
        if(studentCourses.has(courseToCheck))
        {
            for(let course of studentCourses)
            {
                if(courseToCheck!=course)
                    courses.add(course)
            }
        } 
    }
    return courses
}

function getStudentsInCourse(courseToCheck) {
    let students = {};
    for (const key in studentDict) {
        let courses = studentDict[key].getCoursesStudent();
        updateStudentCount(students, courses, courseToCheck);
    }
    return students;
}
// function getStudentsInCourse(courseToCheck) {
//     let students = {};
    
//     function incrementCourseCount(course) {
//         students[course] = (students[course] || 0) + 1;
//     }

//     for (const student of Object.values(studentDict)) {
//         let courses = student.getCoursesStudent();
//         if (courses.has(courseToCheck)) {
//             incrementCourseCount(courseToCheck);
//             courses.forEach(course => {
//                 if (course !== courseToCheck) {
//                     incrementCourseCount(course);
//                 }
//             });
//         }
//     }

//     return students;
// }

function updateStudentCount(students, courses, courseToCheck) {
    if (courses.has(courseToCheck)) {
        incrementStudentCount(students, courseToCheck);

        for (let course of courses) {
            if (course !== courseToCheck) {
                incrementStudentCount(students, course);
            }
        }
    }
}

function incrementStudentCount(students, course) {
    if (!students[course]) {
        students[course] = 0;
    }
    students[course]++;
}

export {updateStudentCount, incrementStudentCount, getCoursesFromAllStudents, getCoursesFromAllStudentsWithinACourse, getStudentName, getStudents, getStudentsFromJson, getStudentsInCourse, seeIfStudentExist, setStudentName, studentLogIn };
