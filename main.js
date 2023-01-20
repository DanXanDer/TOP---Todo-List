"use strict";

const project = (title) => {
    return { title };
};

const task = (taskComplete, taskName, taskDate, taskPriority) => {
    return {
        taskName,
        taskDate,
        taskPriority,
        taskComplete
    }
}

const projectsAllTasks = (() => {
    const allTasks = [];

    const addProjectTasksSpot = () => allTasks.push([]);

    const getProjectTasks = () => allTasks[DOMstuff.getSelectedProjectIndex()];

    const getAllTasks = () => allTasks;

    return {
        addProjectTasksSpot,
        getAllTasks,
        getProjectTasks,
    }

})();


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

    const addTask = (taskComplete, taskName, taskDate, taskPriority) => {
        const newTask = task(taskComplete, taskName, taskDate, taskPriority);
        projectsAllTasks.getAllTasks()[DOMstuff.getSelectedProjectIndex()].push(newTask);
    }

    const deleteProjectTasks = () => projectsAllTasks.getAllTasks().splice(DOMstuff.getProjectDeleteId(), 1);

    return {
        addProject,
        deleteProject,
        createDefaultProject,
        addTask,
        deleteProjectTasks,
    }
})();
projectsOperations.createDefaultProject();

const DOMstuff = (() => {
    const taskTable = document.querySelector("table");
    const tituloProjecto = document.querySelector(".tasks h1");
    const inputProject = document.querySelector(".input-project");
    const projectImg = document.querySelector(".project-img");
    const projectsContainer = document.querySelector(".projects-container");
    let projectsListDOM = Array.from(document.querySelector(".projects-container .project"));
    const projectsNameListDOM = Array.from(document.querySelector(".projects .project-name"));
    const tasksContainer = document.querySelector(".project-tasks");
    let inputProjectValue;
    let projectIndex = 1;
    let projectDeleteId;
    let selectedProjectIndex;

    const addTask = () => {
        const taskName = document.querySelector("#task-name").value;
        const taskDate = document.querySelector("#task-date").value;
        const taskPriority = document.querySelector("#task-priority").value;
        projectsOperations.addTask(false, taskName, taskDate, taskPriority);
        addTaskToTable(projectsAllTasks.getProjectTasks()[projectsAllTasks.getProjectTasks().length - 1]);
    }

    const getSelectedProjectIndex = () => selectedProjectIndex;

    const getInputProjectValue = () => inputProjectValue;

    const getProjectDeleteId = () => projectDeleteId;

    const getProjectIndex = () => projectIndex;

    const addTaskToTable = (task) => {
        const taskFile = document.createElement("tr");
        const taskCompleteColumn = document.createElement("td");
        const taskNameColumn = document.createElement("td");
        const taskDateColumn = document.createElement("td");
        const taskPriorityColumn = document.createElement("td");
        const taskComplete = document.createElement("input");
        taskComplete.type = "checkbox";

        taskCompleteColumn.append(taskComplete);
        taskNameColumn.append(task.taskName);
        taskDateColumn.append(task.taskDate);
        taskPriorityColumn.append(task.taskPriority);

        taskFile.appendChild(taskCompleteColumn);
        taskFile.appendChild(taskNameColumn);
        taskFile.appendChild(taskDateColumn);
        taskFile.append(taskPriorityColumn);

        taskTable.append(taskFile);
    }

    const selectProject = (projectName) => {
        projectName.addEventListener("click", (e) => {
            projectsNameListDOM.forEach(projectNameDOM => {
                projectNameDOM.classList.remove("project-name-selected");
            })
            const projectNameSelectedIndex = projectName.getAttribute("index-project-name");
            tituloProjecto.textContent = `Project - ${projectName.textContent}`;
            selectedProjectIndex = parseInt(projectNameSelectedIndex);
            projectName.classList.add("project-name-selected");
            tasksContainer.setAttribute("index-task", projectNameSelectedIndex);

            for (let i = 1; i < taskTable.rows.length; i += 0) {
                taskTable.deleteRow(i);
            }


            if (projectsAllTasks.getProjectTasks().length > 0) {
                projectsAllTasks.getProjectTasks().forEach(task => {
                    addTaskToTable(task);
                });
            }
        });
    }

    const addDefaultProject = () => {
        projectsAllTasks.addProjectTasksSpot();
        const defaultProject = document.querySelector(".project-default");
        const projectDefaultName = document.querySelector(".project-name-default");
        const projectDefaultText = document.querySelector(".project-text-default");
        projectDefaultText.textContent = projectsList.getDefaultProject().title;
        const projectDefaultDelete = document.querySelector(".project-delete-default");
        projectsListDOM.push(defaultProject);
        projectsNameListDOM.push(projectDefaultName);
        selectedProjectIndex = 0;
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

        projectsAllTasks.addProjectTasksSpot();

        //Agregando projecto al array
        projectsOperations.addProject();

        //Creando elementos del DOM
        const projectImgCopy = projectImg.cloneNode(true);
        const projectContainer = document.createElement("div");
        const projectNameContainer = document.createElement("div");
        const projectTextContainer = document.createElement("div");
        const projectDeleteBtn = document.createElement("div");

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
            let existSelected = false;
            let id = e.target.parentNode.getAttribute("id");
            projectDeleteId = parseInt(id);
            const selectedProject = document.querySelector(".project-name-selected");
            if (selectedProject.getAttribute("index-project-name") !== id) {
                existSelected = true;
            }
            projectsListDOM.forEach(project => {
                if (project.getAttribute("id") === id) {
                    projectsOperations.deleteProject();
                    projectsListDOM.splice(projectDeleteId, 1);
                    projectsNameListDOM.splice(projectDeleteId, 1);
                    if (existSelected === false) {
                        if (projectsNameListDOM[projectDeleteId] !== undefined) {
                            projectsNameListDOM[projectDeleteId].classList.add("project-name-selected");
                            selectedProjectIndex = parseInt(document.querySelector(".project-name-selected").getAttribute("index-project-name"));
                        }
                        else if(projectDeleteId === projectsListDOM.length){
                            projectsNameListDOM[projectDeleteId-1].classList.add("project-name-selected");
                            selectedProjectIndex = parseInt(document.querySelector(".project-name-selected").getAttribute("index-project-name"));
                        }
                    }


                    projectsOperations.deleteProjectTasks();
                    for (let i = projectDeleteId; i < projectsListDOM.length; i++) {
                        projectsListDOM[i].setAttribute("id", projectsListDOM.indexOf(projectsListDOM[i]));
                        projectsNameListDOM[i].setAttribute("index-project-name", projectsNameListDOM.indexOf(projectsNameListDOM[i]));

                    }
                }
            })
            refreshProjects();

            for (let i = 1; i < taskTable.rows.length; i += 0) {
                taskTable.deleteRow(i);
            }
            console.log(projectsAllTasks.getProjectTasks());
            if (projectsAllTasks.getProjectTasks().length > 0) {
                projectsAllTasks.getProjectTasks().forEach(task => {
                    addTaskToTable(task);
                });
            }
        });
    }

    return {
        addProject,
        activateListeners,
        getInputProjectValue,
        getProjectDeleteId,
        getProjectIndex,
        addDefaultProject,
        getSelectedProjectIndex,
    };
})();

DOMstuff.addDefaultProject();
DOMstuff.activateListeners();


