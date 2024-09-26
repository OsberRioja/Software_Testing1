import Student from "./estudiante.js";
import { combineDicts } from "./predefinedStudents.js";

let studentPassword = "123"

let studentName = ""

let studentDict = {}


function getStudentsFromJson()
{
    let neoDict = combineDicts()

    for(let pos=0;pos < neoDict.length; pos++)
    {
        for(let studentPos=0; studentPos < neoDict[pos]["students"].length; studentPos++)
        {
            let student = new Student(neoDict[pos]["students"][studentPos])
            if (!studentDict[student.getName()]) {
                studentDict[student.getName()] = [];
                studentDict[student.getName()] = student
            }
            studentDict[student.getName()].addCoursesToStudent(neoDict[pos]["course"])
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
        if (courses.has(courseToCheck)) {
            if (!students[courseToCheck]) {
                students[courseToCheck] = 0;
            }
            students[courseToCheck]++;
            
            for (let course of courses) {
                if (course !== courseToCheck) {
                    if (!students[course]) {
                        students[course] = 0;
                    }
                    students[course]++;
                }
            }
        }
    }
    return students;
}

export { getCoursesFromAllStudents, getCoursesFromAllStudentsWithinACourse, getStudentName, getStudents, getStudentsFromJson, getStudentsInCourse, seeIfStudentExist, setStudentName, studentLogIn };
