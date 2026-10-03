/* ==================================================
   ELEMENTS
================================================== */

const modal = document.getElementById("project-modal");

const modalView = document.getElementById("modal-view");
const modalEdit = document.getElementById("modal-edit");
const modalCreate = document.getElementById("modal-create");

const closeButton = document.getElementById("modal-close");

const projectGrid = document.getElementById("project-grid");
const projectCount = document.getElementById("project-count");

const openCreateButton = document.getElementById("open-create-modal");
const openCreateCard = document.getElementById("open-create-card");


/* ==================================================
   VIEW MODE ELEMENTS
================================================== */

const projectName = document.getElementById("modal-project-name");
const projectDescription = document.getElementById("modal-project-description");
const projectStatus = document.getElementById("modal-project-status");
const projectProgress = document.getElementById("modal-project-progress");
const projectIcon = document.getElementById("modal-project-icon");

const editButton = document.getElementById("modal-edit-button");
const deleteForm = document.getElementById("modal-delete-form");


/* ==================================================
   EDIT MODE ELEMENTS
================================================== */

const editForm = document.getElementById("modal-edit-form");

const editName = document.getElementById("edit-name");
const editDescription = document.getElementById("edit-description");
const editStatus = document.getElementById("edit-status");
const editProgress = document.getElementById("edit-progress");

const cancelEditButton = document.getElementById("modal-cancel-edit");


/* ==================================================
   CREATE MODE ELEMENTS
================================================== */

const createForm = document.getElementById("modal-create-form");

const createName = document.getElementById("create-name");
const createDescription = document.getElementById("create-description");
const createStatus = document.getElementById("create-status");
const createProgress = document.getElementById("create-progress");

const cancelCreateButton = document.getElementById("modal-cancel-create");


/* ==================================================
   STATE
================================================== */

let activeCard = null;


/* ==================================================
   MODAL MODES
================================================== */

function hideModalModes() {

    modalView.hidden = true;
    modalEdit.hidden = true;
    modalCreate.hidden = true;
}


function showModal() {

    modal.hidden = false;

    document.body.classList.add("modal-open");
}


function closeModal() {

    modal.hidden = true;

    hideModalModes();

    document.body.classList.remove("modal-open");

    activeCard = null;
}


/* ==================================================
   PROJECT VIEW
================================================== */

function openProject(card) {

    activeCard = card;

    updateModalView();

    hideModalModes();

    modalView.hidden = false;

    showModal();
}


function updateModalView() {

    if (!activeCard) {
        return;
    }

    const name = activeCard.dataset.name;
    const description = activeCard.dataset.description;
    const status = activeCard.dataset.status;
    const progress = activeCard.dataset.progress;

    projectName.textContent = name;
    projectDescription.textContent = description;
    projectStatus.textContent = status;
    projectProgress.textContent = `${progress}%`;

    projectStatus.className = `status ${status}`;

    if (status === "growing") {
        projectIcon.textContent = "🌷";
    } else {
        projectIcon.textContent = "🌱";
    }

    deleteForm.action = activeCard.dataset.deleteUrl;
}


/* ==================================================
   EDIT MODE
================================================== */

function openEditMode() {

    if (!activeCard) {
        return;
    }

    editName.value = activeCard.dataset.name;
    editDescription.value = activeCard.dataset.description;
    editStatus.value = activeCard.dataset.status;
    editProgress.value = activeCard.dataset.progress;

    hideModalModes();

    modalEdit.hidden = false;

    editName.focus();
}


function cancelEdit() {

    hideModalModes();

    modalView.hidden = false;
}


/* ==================================================
   CREATE MODE
================================================== */

function openCreateMode() {

    activeCard = null;

    createForm.reset();

    createStatus.value = "seedling";
    createProgress.value = 0;

    hideModalModes();

    modalCreate.hidden = false;

    showModal();

    createName.focus();
}


/* ==================================================
   UPDATE EXISTING CARD
================================================== */

function updateCard(project) {

    if (!activeCard) {
        return;
    }

    activeCard.dataset.name = project.name;
    activeCard.dataset.description = project.description;
    activeCard.dataset.status = project.status;
    activeCard.dataset.progress = project.progress;

    const cardName = activeCard.querySelector(".card-project-name");

    const cardDescription = activeCard.querySelector(
        ".card-project-description"
    );

    const cardStatus = activeCard.querySelector(
        ".card-project-status"
    );

    const cardProgress = activeCard.querySelector(
        ".card-project-progress"
    );

    const cardIcon = activeCard.querySelector(
        ".card-project-icon"
    );

    cardName.textContent = project.name;
    cardDescription.textContent = project.description;

    cardStatus.textContent = project.status;
    cardStatus.className =
        `status card-project-status ${project.status}`;

    cardProgress.textContent = `${project.progress}%`;

    if (project.status === "growing") {
        cardIcon.textContent = "🌷";
    } else {
        cardIcon.textContent = "🌱";
    }
}


/* ==================================================
   CREATE NEW CARD
================================================== */

function createProjectCard(project) {

    const card = document.createElement("article");

    card.className = "project-card project-selectable";

    card.dataset.name = project.name;
    card.dataset.description = project.description;
    card.dataset.status = project.status;
    card.dataset.progress = project.progress;
    card.dataset.editUrl = project.edit_url;
    card.dataset.deleteUrl = project.delete_url;


    /* ---------- PROJECT TOP ---------- */

    const projectTop = document.createElement("div");

    projectTop.className = "project-top";


    const icon = document.createElement("span");

    icon.className = "project-icon card-project-icon";

    if (project.status === "growing") {
        icon.textContent = "🌷";
    } else {
        icon.textContent = "🌱";
    }


    const status = document.createElement("span");

    status.className =
        `status card-project-status ${project.status}`;

    status.textContent = project.status;


    projectTop.appendChild(icon);
    projectTop.appendChild(status);


    /* ---------- PROJECT NAME ---------- */

    const name = document.createElement("h3");

    name.className = "card-project-name";
    name.textContent = project.name;


    /* ---------- DESCRIPTION ---------- */

    const description = document.createElement("p");

    description.className = "card-project-description";
    description.textContent = project.description;


    /* ---------- PROGRESS ---------- */

    const progress = document.createElement("div");

    progress.className = "progress";


    const progressLabel = document.createElement("span");

    progressLabel.className = "progress-label";
    progressLabel.textContent = "progress";


    const progressValue = document.createElement("span");

    progressValue.className = "card-project-progress";
    progressValue.textContent = `${project.progress}%`;


    progress.appendChild(progressLabel);
    progress.appendChild(progressValue);


    /* ---------- BUILD CARD ---------- */

    card.appendChild(projectTop);
    card.appendChild(name);
    card.appendChild(description);
    card.appendChild(progress);


    /* ---------- CLICK ---------- */

    card.addEventListener("click", () => {
        openProject(card);
    });


    /*
       Keep the "plant something new" card at the end.
    */

    projectGrid.insertBefore(
        card,
        openCreateCard
    );
}


/* ==================================================
   SAVE EDIT
================================================== */

async function saveProject(event) {

    event.preventDefault();

    if (!activeCard) {
        return;
    }


    const projectData = {
        name: editName.value.trim(),
        description: editDescription.value.trim(),
        status: editStatus.value,
        progress: Number(editProgress.value)
    };


    try {

        const response = await fetch(
            activeCard.dataset.editUrl,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(projectData)
            }
        );


        const result = await response.json();


        if (!response.ok) {

            alert(
                result.message ||
                "Something went wrong while saving."
            );

            return;
        }


        updateCard(result.project);

        updateModalView();

        hideModalModes();

        modalView.hidden = false;


    } catch (error) {

        console.error(error);

        alert(
            "Something went wrong while saving the project."
        );
    }
}


/* ==================================================
   CREATE PROJECT
================================================== */

async function createProject(event) {

    event.preventDefault();


    const projectData = {
        name: createName.value.trim(),
        description: createDescription.value.trim(),
        status: createStatus.value,
        progress: Number(createProgress.value)
    };


    try {

        const response = await fetch(
            "/projects/new",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(projectData)
            }
        );


        const result = await response.json();


        if (!response.ok) {

            alert(
                result.message ||
                "Something went wrong while planting."
            );

            return;
        }


        createProjectCard(result.project);


        const currentCount = Number(
            projectCount.textContent
        );

        projectCount.textContent = currentCount + 1;


        createForm.reset();

        closeModal();


    } catch (error) {

        console.error(error);

        alert(
            "Something went wrong while planting the project."
        );
    }
}


/* ==================================================
   EXISTING PROJECT CARDS
================================================== */

document
    .querySelectorAll(".project-selectable")
    .forEach((card) => {

        card.addEventListener("click", () => {
            openProject(card);
        });

    });


/* ==================================================
   CREATE BUTTONS
================================================== */

openCreateButton.addEventListener("click", () => {
    openCreateMode();
});


openCreateCard.addEventListener("click", () => {
    openCreateMode();
});


/* ==================================================
   MODAL BUTTONS
================================================== */

closeButton.addEventListener("click", () => {
    closeModal();
});


editButton.addEventListener("click", () => {
    openEditMode();
});


cancelEditButton.addEventListener("click", () => {
    cancelEdit();
});


cancelCreateButton.addEventListener("click", () => {
    closeModal();
});


/* ==================================================
   FORMS
================================================== */

editForm.addEventListener(
    "submit",
    saveProject
);


createForm.addEventListener(
    "submit",
    createProject
);


/* ==================================================
   CLICK OUTSIDE MODAL
================================================== */

modal.addEventListener("click", (event) => {

    if (event.target === modal) {
        closeModal();
    }

});


/* ==================================================
   ESCAPE KEY
================================================== */

document.addEventListener("keydown", (event) => {

    if (event.key !== "Escape" || modal.hidden) {
        return;
    }


    if (!modalEdit.hidden) {

        cancelEdit();

        return;
    }


    closeModal();
});