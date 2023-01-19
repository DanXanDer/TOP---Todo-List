"use strict";

const project = (title) => {
    return { title };
};

const projectTask = (taskName, taskDate, taskPriority) => {
    return { taskName, taskDate, taskPriority }
}


const projectsList = (() => {
    let projects = [];
    const getProjectsList = () => projects;

    const setProjectsList = (newProjects) => projects = newProjects;

    const getDefaultProject = () => projects[0];

    return {
        getProjectsList,
        getDefaultProject,
        setProjectsList
    }
})();


const projectsOperations = (() => {

    const createDefaultProject = () => {
        const defaultProject = project("Default project");
        projectsList.getProjectsList().push(defaultProject)
    }

    const addProject = () => {
        const newProject = project(DOMstuff.getInputProjectValue());
        projectsList.getProjectsList().push(newProject);
    }

    const deleteProject = () => {
        const newProjectList = projectsList.getProjectsList();
        newProjectList.splice(DOMstuff.getProjectDeleteId(), 1);
        projectsList.setProjectsList(newProjectList);
    }

    const addTask = () => {

    }

    return {
        addProject,
        deleteProject,
        createDefaultProject
    }
})();
projectsOperations.createDefaultProject();

const DOMstuff = (() => {
    const inputProject = document.querySelector(".input-project");
    const projectImg = document.querySelector(".project-img");
    const projectsContainer = document.querySelector(".projects-container");
    let projectsListDOM = Array.from(document.querySelector(".projects-container .project"));
    const projectsNameListDOM = Array.from(document.querySelector(".projects .project-name"));
    const tasksListDOM = [];
    const tasksContainer = document.querySelector(".tasks");
    let inputProjectValue;
    let projectIndex = 1;
    let projectDeleteId;

    const addTask = () => {
        const taskName = document.querySelector("#task-name").value;
        const taskDate = document.querySelector("#task-date").value;
        const taskPriority = document.querySelector("#task-priority").value;
        const newProjectTask = projectTask(taskName, taskDate, taskPriority);

    }

    const getInputProjectValue = () => inputProjectValue;

    const getProjectDeleteId = () => projectDeleteId;

    const getProjectIndex = () => projectIndex;

    const selectProject = (projectName) => {
        projectName.addEventListener("click", (e) => {
            //console.log(projectName);
            projectsNameListDOM.forEach(projectNameDOM => {
                projectNameDOM.classList.remove("project-name-selected");

                /*if (projectNameDOM.getAttribute("index-project-name") === projectName.getAttribute("index-project-name")) {
                    projectName.classList.add("project-name-selected");
                    tasksListDOM.forEach(tasks => {
                        if (tasks.getAttribute("index-task") === projectNameDOM.getAttribute("index-project-name")) {
                            tasksContainer.removeChild(tasksContainer.childNodes[2]);
                            tasksContainer.appendChild(tasks);
                            tasks.textContent = tasks.getAttribute("index-task");
                            console.log(tasksContainer);
                        }
                    })
                }*/
            })
            const projectNameSelectedIndex = projectName.getAttribute("index-project-name");
            const projectNameSelected = document.querySelector(`[index-project-name = "${projectNameSelectedIndex}"]`);
            projectNameSelected.classList.add("project-name-selected");

            console.log(tasksContainer.childNodes[2]);
            tasksContainer.removeChild(tasksContainer.childNodes[2]);
            
           // taskShowed.textContent = taskShowed.getAttribute("index-task");
            //tasksContainer.appendChild(taskShowed);  
            //console.log(projectNameSelected);
            //projectNameSelected.classList.add("project-name-selected");
            
        });
    }

    const addDefaultProject = () => {
        const defaultProject = document.querySelector(".project-default");
        const projectDefaultName = document.querySelector(".project-name-default");
        const projectDefaultText = document.querySelector(".project-text-default");
        projectDefaultText.textContent = projectsList.getDefaultProject().title;
        const projectDefaultDelete = document.querySelector(".project-delete-default");
        const projectTasksContainer = document.createElement("div");
        projectTasksContainer.setAttribute("index-task", 0);
        projectTasksContainer.classList.add("project-tasks");
        tasksListDOM.push(projectTasksContainer);
        projectsListDOM.push(defaultProject);
        projectsNameListDOM.push(projectDefaultName);
        deleteProject(projectDefaultDelete);
        selectProject(projectDefaultName);
    }

    const activateListeners = () => {
        const projectBtnAdd = document.querySelector(".add-project-btn");
        projectBtnAdd.addEventListener("click", addProject);
        inputProject.addEventListener("keyup", (e) => {
            inputProjectValue = inputProject.value;
        })
        const addTaskBtn = document.querySelector(".add-task-btn");
        addTaskBtn.addEventListener("click", (e) => {
            addTask();
        })
    }

    const addProject = () => {
        //Asignando index
        projectIndex = projectsListDOM.length;

        //Agregando projecto al array
        projectsOperations.addProject();

        //Creando elementos del DOM
        const projectImgCopy = projectImg.cloneNode(true);
        const projectContainer = document.createElement("div");
        const projectNameContainer = document.createElement("div");
        const projectTextContainer = document.createElement("div");
        const projectDeleteBtn = document.createElement("div");
        const projectTasksContainer = document.createElement("div");

        //Asignando contenido al cotnenedor del nombre del projecto.
        projectTextContainer.textContent = projectsList.getProjectsList()[projectIndex].title;

        //Agregando imagen y texto al projecto. Asignandole sus clases. Agregando el contenedor del nombre del projecto al array
        projectNameContainer.append(projectImgCopy);
        projectNameContainer.append(projectTextContainer);
        projectNameContainer.classList.add("project-name");
        projectNameContainer.setAttribute("index-project-name", projectIndex);
        projectsNameListDOM.push(projectNameContainer);

        //Agregando el contenido del boton para eliminar. Asignandole sus clases
        projectDeleteBtn.textContent = "X";
        projectDeleteBtn.classList.add("project-delete");

        //Asignando los contenedores al contenedor del projecto. Asignando sus clases y el id
        projectContainer.append(projectNameContainer);
        projectContainer.append(projectDeleteBtn);
        projectContainer.classList.add("project");
        projectContainer.setAttribute("id", projectIndex);


        //Agregando el projecto al DOM
        projectsListDOM.push(projectContainer);
        refreshProjects();

        //Asignando un contenedor de tareas al projecto
        projectTasksContainer.setAttribute("index-task", projectIndex);
        projectTasksContainer.classList.add("project-tasks");
        tasksListDOM.push(projectTasksContainer);

        //Agregando funciones para seleccionar y eliminar projecto
        deleteProject(projectDeleteBtn);
        selectProject(projectNameContainer);

        //Vaciando el valor de la entrada
        inputProject.value = '';
        inputProjectValue = '';
    }

    const refreshProjects = () => {
        projectsContainer.innerHTML = '';
        projectsListDOM.forEach(project => {
            projectsContainer.append(project);
        })
    }


    const deleteProject = (projectDeleteBtn) => {
        projectDeleteBtn.addEventListener("click", (e) => {
            let id = e.target.parentNode.getAttribute("id");
            projectDeleteId = parseInt(id);
            projectsListDOM.forEach(project => {
                if (project.getAttribute("id") === id) {
                    projectsOperations.deleteProject();
                    projectsListDOM.splice(projectDeleteId, 1);
                    projectsNameListDOM.splice(projectDeleteId, 1);
                    tasksListDOM.splice(projectDeleteId, 1);
                    for (let i = projectDeleteId; i < projectsListDOM.length; i++) {
                        projectsListDOM[i].setAttribute("id", projectsListDOM.indexOf(projectsListDOM[i]));
                        projectsNameListDOM[i].setAttribute("index-project-name", projectsNameListDOM.indexOf(projectsNameListDOM[i]));
                        tasksListDOM[i].setAttribute("index-task", tasksListDOM.indexOf(tasksListDOM[i]));
                    }
                }
            })
            refreshProjects();
        });

    }

    return {
        addProject,
        activateListeners,
        getInputProjectValue,
        getProjectDeleteId,
        getProjectIndex,
        addDefaultProject
    };
})();

DOMstuff.addDefaultProject();
DOMstuff.activateListeners();


