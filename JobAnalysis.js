let jobs = [];
let filteredJobs = [];

const fileInput = document.getElementById("file-input");
fileInput.addEventListener("change", handleFileUpload);

const filterLevel = document.getElementById("filter-level");
const filterType = document.getElementById("filter-type");
const filterSkill = document.getElementById("filter-skill");
const sortOptions = document.getElementById("sort-options");

filterLevel.addEventListener("change", applyFilters);
filterType.addEventListener("change", applyFilters);
filterSkill.addEventListener("change", applyFilters);
sortOptions.addEventListener("change", sortJobs);

function handleFileUpload(event) {
    const file = event.target.files[0];
    const errorElement = document.getElementById("upload-error");
    errorElement.textContent = "";

    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const data = JSON.parse(reader.result);
                jobs = data.map(job => ({
                    title: job["Title"],
                    postedTime: job["Posted"],
                    type: job["Type"],
                    level: job["Level"],
                    skill: job["Skill"],
                    detail: job["Detail"]
                }));
                filteredJobs = [...jobs];
                updateDropdowns();
                displayJobs(filteredJobs);
            } catch (error) {
                errorElement.textContent = "Invalid JSON file.";
            }
        };
        reader.readAsText(file);
    }
}

function updateDropdowns() {
    const levels = new Set(jobs.map(job => job.level));
    const types = new Set(jobs.map(job => job.type));
    const skills = new Set(jobs.map(job => job.skill));

    populateDropdown(filterLevel, levels);
    populateDropdown(filterType, types);
    populateDropdown(filterSkill, skills);
}

function populateDropdown(dropdown, options) {
    dropdown.innerHTML = "<option value=''>All</option>";
    options.forEach(option => {
        const opt = document.createElement("option");
        opt.value = option;
        opt.textContent = option;
        dropdown.appendChild(opt);
    });
}

function applyFilters() {
    const level = filterLevel.value;
    const type = filterType.value;
    const skill = filterSkill.value;

    filteredJobs = jobs.filter(
        job => (level === "" || job.level === level) &&
               (type === "" || job.type === type) &&
               (skill === "" || job.skill === skill)
    );
    displayJobs(filteredJobs);
}

function sortJobs() {
    const sortBy = sortOptions.value;
    if (sortBy === "title-asc") {
        filteredJobs.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "title-desc") {
        filteredJobs.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === "time-newest") {
        filteredJobs.sort((a, b) => new Date(b.postedTime) - new Date(a.postedTime));
    } else if (sortBy === "time-oldest") {
        filteredJobs.sort((a, b) => new Date(a.postedTime) - new Date(b.postedTime));
    }
    displayJobs(filteredJobs);
}

function displayJobs(jobsToDisplay) {
    const jobList = document.getElementById("job-list");
    jobList.innerHTML = "";
    jobsToDisplay.forEach((job, index) => {
        const jobBox = document.createElement("div");
        jobBox.className = "job-box";

        const title = document.createElement("h3");
        title.textContent = job.title;
        jobBox.appendChild(title);

        const type = document.createElement("p");
        type.textContent = `Type: ${job.type}`;
        jobBox.appendChild(type);

        const level = document.createElement("p");
        level.textContent = `Level: ${job.level}`;
        jobBox.appendChild(level);

        const posted = document.createElement("p");
        posted.textContent = `Posted: ${job.postedTime}`;
        jobBox.appendChild(posted);

        jobBox.addEventListener("click", () => displayJobDetails(index));
        jobList.appendChild(jobBox);
    });
}

function displayJobDetails(index) {
    const jobDetailsContent = document.getElementById("job-details-content");
    const job = filteredJobs[index];
    jobDetailsContent.innerHTML = "";

    for (const [key, value] of Object.entries(job)) {
        const p = document.createElement("p");
        p.textContent = `${key}: ${value}`;
        jobDetailsContent.appendChild(p);
    }
}