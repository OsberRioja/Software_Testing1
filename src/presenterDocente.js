import { CoursesControllerSingleton } from "./coursesController";
import * as errorCode from './errorCodes';
import { getCoursesFromAllStudentsWithinACourse, getStudentsInCourse } from "./studentList.js";
import { getProfessorName } from "./TeacherLoginManager";

let coursesController=CoursesControllerSingleton.getInstance()

let alertMessages={[errorCode.OK]:"Se creo correctamente",
  [errorCode.CourseNotFound]:"No existe el curso",
  [errorCode.HomeworkNotFound]:"No existe la tarea",
  [errorCode.DeadlineAlreadyPassed]:"La fecha final ya paso",
  [errorCode.DeadlineCantBeLowerThanInit]:"La fecha inicial no puede ser mayor a la final"}
  

const createHmwkForm=document.querySelector("#HomeworkCreation-form");
const createCourseForm=document.querySelector("#CourseCreation-form");
const HomeworkMoficationForm=document.querySelector("#HomeworkMofication-form");
const BtnToCreateHmwk=document.querySelector("#BtnToCreateHmwk");
const BtnToCreateCourse=document.querySelector("#BtnToCreateCourse");
const selectedHomeworkStats=document.querySelector("#selectedHomeworkStats");
const docentesPage = document.querySelector("#docentesPage");

//Form Objects
const HomeworkName = document.querySelector("#HomeworkName");
const CourseName = document.querySelector("#courseName");
const DateInit = document.querySelector("#dateInit");
const DateFin = document.querySelector("#dateFin");
const CourseNameCreation = document.querySelector("#CourseNameCreation");
const courseInitials = document.querySelector("#courseInitials");
const TeachersName = document.querySelector("#TeachersName");
const HomeworkNameModif = document.querySelector("#HomeworkNameModif");
const dateInitModif = document.querySelector("#dateInitModif");
const dateFinModif = document.querySelector("#dateFinModif");
const IDModif = document.querySelector("#IDModif");
const CourseNameModif = document.querySelector("#CourseNameModif");
const homeworkList =  document.querySelector("#homeworkList");
const selectedHomework = document.querySelector("#selectedHomework");
const HoursNeededHmwk=document.querySelector("#HoursNeededHmwk");

let noNumberFields=document.querySelectorAll(".noNumbersInput")

let studentsInCourse


docentesPage.addEventListener("click", (event) => {
  event.preventDefault();
  loadTeacherViewBaseStatus()

});

function loadTeacherViewBaseStatus()
{
  selectedHomeworkStats.innerHTML=""
  selectedHomework.innerHTML=""
  loadListByDates()
}


createHmwkForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const hmwkName = HomeworkName.value;
  const courseName = CourseName.value;
  const dateInit = DateInit.value;
  const dateFin = DateFin.value;
  const hoursNeeded = HoursNeededHmwk.value;
  
  let result = coursesController.tryToCreateHomework(hmwkName, dateInit, dateFin, courseName, hoursNeeded);
  
  console.log("Resultado de tryToCreateHomework:", result);
  
  if (result.status === errorCode.OK) {
    alert(alertMessages[result.status]);
    console.log("Tarea creada con ID:", result.homeworkId);
    loadListByDates();
  } else {
    alert(alertMessages[result.status] || "Error desconocido al crear la tarea");
  }
});
HomeworkMoficationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const hmwkName = HomeworkNameModif.value;
  const dateInit = dateInitModif.value;
  const dateFin = dateFinModif.value;
  const idModif = IDModif.value;
  const courseNameModif = CourseNameModif.value;
  let status=coursesController.tryToModifyHomework(idModif,hmwkName,dateInit,dateFin,courseNameModif)
  alert(alertMessages[status]);
  loadListByDates()
  showItemsOnClick(idModif)

  return status;
});
createCourseForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const CourseName = CourseNameCreation.value;
  const CourseInitials = courseInitials.value;
  const Teacher = TeachersName.value;
  coursesController.tryToCreateCourse(CourseInitials,CourseName,Teacher);
  alert("Curso creado con exito");
});
BtnToCreateHmwk.addEventListener("click", (event) => {
  event.preventDefault();
  createHmwkForm.style.display="block"
  createCourseForm.style.display="none"
  HomeworkMoficationForm.style.display="none"
});
BtnToCreateCourse.addEventListener("click", (event) => {
  event.preventDefault();
  createCourseForm.style.display="block"
  createHmwkForm.style.display="none"
  HomeworkMoficationForm.style.display="none"

});

noNumberFields.forEach(noNumberField=>
    {
      noNumberField.addEventListener("input", (event) => {
        event.preventDefault();
        let currentLength=String(noNumberField.value).length-1
        if (!isNaN(noNumberField.value[currentLength]) && noNumberField.value[currentLength] != " ")
        {
          noNumberField.value = noNumberField.value.slice(0,currentLength)
        }
      });
    })

function getCourseHomeworksFromAllStudents()
{
  let answerSet=new Set()
  let courseName = coursesController.getCourseByName(getProfessorName())
  answerSet.add(courseName)

  studentsInCourse = getStudentsInCourse(courseName)

  let OtherCourses=getCoursesFromAllStudentsWithinACourse(courseName)
  return new Set([...answerSet, ...OtherCourses])
}
  
function loadListByDates() {  
  homeworkList.innerHTML = "";

  let HomeworkDatesObj = coursesController.getAllHomeworksByDate(getCourseHomeworksFromAllStudents());
  let dates = Object.keys(HomeworkDatesObj);
  dates.sort((a, b) => a.localeCompare(b));

  for (const date of dates) {
    addElementsToFather(homeworkList, loadDateContainer(HomeworkDatesObj[date], date));
  }
}

function loadDateContainer(homeworksArray, date) {
  let dateContainer = document.createElement('div');
  let dateTittleDiv = document.createElement('h3');
  addPropsToElement(dateContainer, {"id": "divFechaDocente" + date});
  addPropsToElement(dateTittleDiv, {"class": "divFecha" + date}, date + "==>");
  addElementsToFather(dateContainer, dateTittleDiv);
  for (const homework of homeworksArray) {
    addElementsToFather(dateContainer, createHomeworkItem(homework));
  }
  return dateContainer;
}

function createHomeworkItem(homework)
{
  let idList = homework.getId().toString();
  //Name Div
  const homeworkNameDiv = document.createElement('div');
  //console.log(homework.courseName)
  //console.log(studentsInCourse[homework.courseName])
  let name = homework.name + "("+studentsInCourse[homework.courseName]+")"
  addPropsToElement(homeworkNameDiv,{"class":"HomeworkText","id":"divName" + idList},name)
  //delete button
  const deleteButton = document.createElement('button');
  addPropsToElement(deleteButton,{"class":"HomeworkBtn","id":idList+"dlt"},"Eliminar")
  //ModifyButton
  const modifyButton = document.createElement('button');
  addPropsToElement(modifyButton,{"class":"HomeworkBtn","id":idList+"mdf"},"Modificar")
  //Container
  const HmwkContainer=document.createElement('div');
  addPropsToElement(HmwkContainer,{"class":"HomeworkContainer","id":"div" + idList})
  addElementsToFather(HmwkContainer,homeworkNameDiv,modifyButton,deleteButton)
  //event listeners
  addListenerForNewItem(homeworkNameDiv,idList);
  addListenerToModifyButton(modifyButton,homework);
  addListenerToDeleteButton(deleteButton,homework)
  return HmwkContainer
}

function addElementsToFather(Father, ...children) {
  for (const child of children) {
    Father.appendChild(child);
  }
}

function addPropsToElement(element,props,...innerHTML)
{
  if(innerHTML[0]!=undefined)
    element.innerHTML=innerHTML[0];
  for (let property in props) {
    element.setAttribute(`${property}`,`${props[property]}`);
  }
}
function addListenerToDeleteButton(deleteButton,homework){
  deleteButton.addEventListener('click', (event=>{
    HomeworkMoficationForm.style.display="none";
    createHmwkForm.style.display="block";
    createCourseForm.style.display="none";
    deleteHomeworkFromHTML(homework.id)
  console.log(homework);
    coursesController.deleteHomework(homework.courseName,homework.id);
    showItemsOnClick(homework.id)
    alert("La Tarea fue eliminada exitosamente");
  }))
  
}
function addListenerToModifyButton(modifyButton,homework)
{
  modifyButton.addEventListener('click', (event=>{
    HomeworkMoficationForm.style.display="block"
    createHmwkForm.style.display="none"
    createCourseForm.style.display="none"
    loadModificationFormWithHmwkInfo(homework)
  })) 
}

function loadModificationFormWithHmwkInfo(homework)
{
  IDModif.value=homework.id
  CourseNameModif.value=homework.courseName
  HomeworkNameModif.value=homework.name
  dateInitModif.value=homework.dateInit
  dateFinModif.value=homework.dateFin
} 
function addListenerForNewItem(newHomeworkDiv,id)
{
    newHomeworkDiv.addEventListener('click', function handleClick(event) {
      showItemsOnClick(id);
      loadHomeworkStats(id);
    });
}

function showItemsOnClick(divID)
{
  const homework = coursesController.getHomeworkBasedOnId(parseInt(divID))
  console.log("desde show");
  console.log(homework);
  if(homework != 2)
  {
    console.log(homework.homeworkFeedbacks)
    selectedHomework.innerHTML = "nombre: " + homework.name + " , fecha inicio: " + homework.dateInit + " , fecha fin: " + 
    homework.dateFin + " , materia: " + homework.courseName+", Horas necesarias:  "+homework.hoursNeeded+", Horas por dia:  "+homework.getHoursPerDay()
    + ", feedback de horas:  " + homework.sumFeedback();
  }
  else{
    selectedHomework.innerHTML = ""
  }
  
}
function loadHomeworkStats(id)
{
  const homework = coursesController.getHomeworkBasedOnId(parseInt(id))
  selectedHomeworkStats.innerHTML="Completa "+homework.timesCompleted+" veces";
}

function deleteHomeworkFromHTML(divID)
{
  let ObjectId = "#div" + divID.toString()
  console.log(ObjectId);
  let homeworkToModify = document.querySelector(ObjectId)
  homeworkToModify.remove()
  selectedHomeworkStats.innerHTML=""
}

export { loadTeacherViewBaseStatus };
