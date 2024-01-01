//********  Firebase imports, refs and config ********//
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, getDoc, setDoc, doc} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { downloadLatexFile } from '/assets/js/templates.js'; // Adjust the path as necessary



const firebaseConfig = {
  apiKey: "AIzaSyD5JD6v_R14vchD1TgfgSBKlNDE0PYPDoE",
  authDomain: "cvgen-906e8.firebaseapp.com",
  projectId: "cvgen-906e8",
  storageBucket: "cvgen-906e8.appspot.com",
  messagingSenderId: "741022182788",
  appId: "1:741022182788:web:7885b82ae8126fd59841d1"
};
 
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//****************//
window.saveChanges = saveChanges;
window.deleteChip = deleteChip;
window.addEducationEntry = addEducationEntry
window.addWorkExperienceEntry = addWorkExperienceEntry
window.manageResumeSkillsEntry = manageResumeSkillsEntry
window.addProjectEntry = addProjectEntry;
window.deleteEntry = deleteEntry 
window.closePopup = closePopup
window.generateUserId = generateUserId;
window.generateAdminId = generateAdminId;
window.addChipFromInput = addChipFromInput
window.clearAll = clearAll;
window.downloadLatexFile = downloadLatexFile;

function saveChanges() {
    generateResume();
    closePopup();
}

// Manage chip creation :
function addChipFromInput(inputId, containerId) {
  console.log(inputId);
  console.log(containerId);
  const inputElement = document.getElementById(inputId);
  const content = inputElement.value.trim();
  if (content) {
      const container = document.getElementById(containerId);
      const chipHtml = `<div class='commonNameChip'>${content}<div class='commonNameChipButton' onclick='deleteChip(this)'><i class='material-symbols-rounded' style='font-size: 15px'>close</i></div></div>`;
      container.innerHTML += chipHtml;
      inputElement.value = ''; // Clear the input field after adding the chip

      // Additional logic for resumeSkillsContainer
      if (containerId.includes('skillChipContainer')) {
          // Disable the userTextInput when a chip is added
          const entry = container.closest('.dynamicEntry');
          entry.querySelector('input.userTextInput').disabled = true;
      }
  }
}

function deleteChip(element) {
  console.log("pressedd");
  try {
    // Identify the container by checking both potential parent types
    let container = element.closest('.dynamicEntry');
    let containerId = container ? container.parentNode.id : null;

    // If the container is not found in dynamicEntry, check in gridLanguageContainer
    if (!container) {
        container = element.closest('.gridLanguageContainer');
        containerId = container ? container.id : null;
    }
      element.closest('.commonNameChip').remove();

      // Additional logic for resumeSkillsContainer
      if (containerId === 'resumeSkillsContainer') {
          const chips = container.querySelectorAll('.commonNameChip');
          if (chips.length === 0) {
              // Enable the userTextInput if there are no chips left
              container.querySelector('input.userTextInput').disabled = false;
          }
      }
  } catch {} 
}


function initLanguageInput() {
  const languageInputId = 'newLanguage'; // The ID of your language input field
  const languageContainerId = 'languageChipContainer'; // The ID of the container where chips are added
  const languageInput = document.getElementById(languageInputId);
  const languageButton = document.getElementById('languageButton'); // The ID of your language button
  if (languageInput && languageButton) {
      languageInput.addEventListener("keyup", function(event) {
          if (event.key === "Enter") {
              addChipFromInput(languageInputId, languageContainerId);
          }
      });
      languageButton.addEventListener("click", function() {
          addChipFromInput(languageInputId, languageContainerId);
      });
  } else {
      console.error('Language input or button not found');
  }
}
function initSkillInputListener() {
  const resumeSkillsContainer = document.getElementById('resumeSkillsContainer');

  // Handle Enter key press in skill input field
  resumeSkillsContainer.addEventListener('keyup', function(event) {
      if (event.target && event.target.matches('.userTextInput') && event.key === "Enter") {
          const skillInput = event.target;
          const dynamicEntry = skillInput.closest('.dynamicEntry');
          const skillChipContainer = dynamicEntry.querySelector('.commonNameChipContainer');
          if (skillChipContainer) {
              addChipFromInput(skillInput.id, skillChipContainer.id);
          }
      }
  });

  // Handle click on add skill button
  resumeSkillsContainer.addEventListener('click', function(event) {
      if (event.target && event.target.closest('.userAddPropertyButton')) {
          const addButton = event.target.closest('.userAddPropertyButton');
          const dynamicEntry = addButton.closest('.dynamicEntry');
          const skillInput = dynamicEntry.querySelector('.userFieldBox[id="addSkillField"] input');
          const skillChipContainer = dynamicEntry.querySelector('.commonNameChipContainer');
          if (skillInput && skillChipContainer) {
              addChipFromInput(skillInput.id, skillChipContainer.id);
          }
      }
  });
}


function manageResumeSkillsEntry(skillsData = null) {
  const container = document.getElementById('resumeSkillsContainer');
  // Generate a more unique ID using Date.now() and a random number
  const uniqueId = Date.now() + "-" + Math.floor(Math.random() * 10000);
  let skillContainerHtml = '';
  let skillTypeValue = '';
  let disabledAttribute = '';

  // If skillsData is provided, use it to populate the fields
  if (skillsData) {
    skillContainerHtml = skillsData.skills.map(skill => 
        `<div class='commonNameChip'>${skill}<div class='commonNameChipButton' onclick='deleteChip(this)'><i class='material-symbols-rounded' style='font-size: 15px'>close</i></div></div>`
    ).join('');
    
      skillTypeValue = `value="${skillsData.type}"`;
      disabledAttribute = skillsData.skills.length > 0 ? 'disabled' : '';
  }

  const htmlContent = `
  <div class="entryDeleteButton" onclick="deleteEntry(this)">
      <i class="material-symbols-rounded" style="font-size: 15px">close</i>
  </div><div class=fieldBoxes>
  <div class="userFieldBox" id="skillTypeField">
      <input class="userTextInput" placeholder="Skill Type" ${skillTypeValue} ${disabledAttribute}/>
  </div>
  <div class="userFieldBox" id="addSkillField">
      <input class="userTextInput" id="newSkillInput-${uniqueId}" placeholder="Add a skill" />
      <div class="userAddPropertyButton">
          <i class="material-symbols-rounded">add</i>
  </div></div>
  </div>
  <div class="commonNameChipContainer" id="skillChipContainer-${uniqueId}">${skillContainerHtml}</div>
  <div class="addButton" onclick="manageResumeSkillsEntry()"><i class="material-symbols-rounded" style="font-size: 15px">add</i></div>
  `;
  addField('resumeSkillsContainer', htmlContent);

  // Optionally, update the visibility of the add button here
  updateAddButtonVisibility('resumeSkillsContainer');
}

function addEducationEntry(eduData = {}) {
  const degree = eduData.degree || '';
  const field = eduData.field || '';
  const institution = eduData.institution || '';
  const year = eduData.year || '';
  const details = eduData.details || '';

  const htmlContent = `
      <div class="entryDeleteButton" onclick="deleteEntry(this)">
          <i class="material-symbols-rounded" style="font-size: 15px">close</i>
      </div>
      <div class="fieldRow2">
          <div class="userFieldBox"><input class="userTextInput" placeholder="Degree (e.g., M.Sc.)" value="${degree}" /></div>
          <div class="userFieldBox"><input class="userTextInput" placeholder="Field of Study" value="${field}" /></div>
      </div>
      <div class="fieldRow2">
          <div class="userFieldBox"><input class="userTextInput" placeholder="Institution" value="${institution}" /></div>
          <div class="userFieldBox"><input class="userTextInput" placeholder="Year (e.g., 2018 - 2020)" value="${year}" /></div>
      </div>
      <div class="userFieldBox"><textarea class="userTextArea" placeholder="Details">${details}</textarea></div>
      <div class="addButton" onclick="addEducationEntry()"><i class="material-symbols-rounded" style="font-size: 15px">add</i></div>
  `;

  addField('educationContainer', htmlContent);
  initializeTextAreas();
}

function addWorkExperienceEntry(workData = {}) {
  const position = workData.position || '';
  const company = workData.company || '';
  const years = workData.years || '';
  const location = workData.location || '';
  const details = workData.details || '';

  const htmlContent = `
      <div class="entryDeleteButton" onclick="deleteEntry(this)">
          <i class="material-symbols-rounded" style="font-size: 15px">close</i>
      </div>
      <div class="fieldRow2">
          <div class="userFieldBox"><input class="userTextInput" placeholder="Position" value="${position}" /></div>
          <div class="userFieldBox"><input class="userTextInput" placeholder="Company" value="${company}" /></div>
      </div>
      <div class="fieldRow2">
          <div class="userFieldBox"><input class="userTextInput" placeholder="Years (e.g., 2021 - Present)" value="${years}" /></div>
          <div class="userFieldBox"><input class="userTextInput" placeholder="Location (e.g., Montreal, QC)" value="${location}" /></div>
      </div>
      <div class="userFieldBox"><textarea class="userTextArea" placeholder="Details">${details}</textarea></div>
      <div class="addButton" onclick="addWorkExperienceEntry()"><i class="material-symbols-rounded" style="font-size: 15px">add</i></div>
  `;

  addField('workExperienceContainer', htmlContent);
  initializeTextAreas();
}

function addProjectEntry(projectData = {}) {
  const name = projectData.name || '';
  const description = projectData.description || '';

  const htmlContent = `
      <div class="entryDeleteButton" onclick="deleteEntry(this)">
          <i class="material-symbols-rounded" style="font-size: 15px">close</i>
      </div>
      <div class="userFieldBox"><input class="userTextInput" placeholder="Project Name" value="${name}" /></div>
      <div class="userFieldBox"><textarea class="userTextArea" placeholder="Project Description">${description}</textarea></div>
      <div class="addButton" onclick="addProjectEntry()"><i class="material-symbols-rounded" style="font-size: 15px">add</i></div>
  `;

  addField('projectContainer', htmlContent);
  initializeTextAreas();
}


function deleteEntry(element) {
  const containerId = element.parentNode.parentNode.id;
  const container = document.getElementById(containerId);
  element.parentNode.remove();

  // Show the 'Add' button if no dynamic entries are left
  if (container.getElementsByClassName('dynamicEntry').length === 0) {
    const addButton = document.querySelector(`#${containerId} + .userAddButton`);
    if (addButton) addButton.style.display = '';
  }

  updateAddButtonVisibility(containerId);
  initializeTextAreas();
}

// manage the buttons visibility
function updateAddButtonVisibility(containerId) {
  const container = document.getElementById(containerId);
  const addButtons = container.getElementsByClassName('addButton');
  Array.from(addButtons).forEach((button, index) => {
      button.style.display = (index === addButtons.length - 1) ? '' : 'none';
  });
  initializeTextAreas();
}

// Add fields for Education, Work, Project and Resume Skills
function addField(containerId, htmlContent) {
  const container = document.getElementById(containerId);
  const entry = document.createElement('div');
  entry.className = 'dynamicEntry';
  entry.innerHTML = htmlContent;
  container.appendChild(entry);

  // Hide the corresponding 'Add' button if at least one dynamic entry exists
  if (container.getElementsByClassName('dynamicEntry').length > 0) {
    const addButton = document.querySelector(`#${containerId} + .userAddButton`);
    if (addButton) addButton.style.display = 'none';
  }

  updateAddButtonVisibility(containerId);
}

// Manage the popups : 
function closePopup() {
  document.getElementById('cvPopup').style.display = 'none';
}
document.getElementById('startCvButton').addEventListener('click', function() {
    document.getElementById('cvPopup').style.display = 'block';
});
document.addEventListener('keydown', function(event) {
  if (event.key === "Escape") {
      closePopup();
  }
});

// Add the resume data to database
function generateResume() {
  // Personal information
  const personalInfo = {
      surname: document.getElementById("surname").value,
      lastname: document.getElementById("name").value,
      languages: Array.from(document.querySelectorAll("#languageChipContainer .commonNameChip")).map(chip => chip.textContent.trim().replace(/close/, '')),
      contact: {
          phone: document.getElementById("phone").value,
          email: document.getElementById("email").value,
          location: document.getElementById("location").value,
          address: document.getElementById("address").value
      }
  };

  // Social links
  const socialLinks = {
      linkedin: document.getElementById("linkedin").value,
      github: document.getElementById("github").value
  };

  // About description
  const about = {
      description: document.getElementById("description").value
  };

  // Education
  const education = Array.from(document.querySelectorAll("#educationContainer .dynamicEntry")).map(entry => {
      return {
          degree: entry.querySelectorAll("input")[0].value,
          field: entry.querySelectorAll("input")[1].value,
          institution: entry.querySelectorAll("input")[2].value,
          year: entry.querySelectorAll("input")[3].value,
          details: entry.querySelector("textarea").value
      };
  });

  const workExperience = Array.from(document.querySelectorAll("#workExperienceContainer .dynamicEntry")).map(entry => {
      const row1 = entry.querySelectorAll(".fieldRow2")[0]; // First row of inputs
      const row2 = entry.querySelectorAll(".fieldRow2")[1]; // Second row of inputs
      return {
          position: row1.querySelectorAll("input")[0].value,  // Position from the first row
          company: row1.querySelectorAll("input")[1].value,   // Company from the first row
          years: row2.querySelectorAll("input")[0].value,     // Years from the second row
          location: row2.querySelectorAll("input")[1].value,  // Location from the second row
          details: entry.querySelector("textarea").value      // Details from the textarea
      };
  });


  // Projects
  const projects = Array.from(document.querySelectorAll("#projectContainer .dynamicEntry")).map(entry => {
      return {
          name: entry.querySelector("input").value,
          description: entry.querySelector("textarea").value
      };
  });


  // Resume skills
  const resumeSkills = Array.from(document.querySelectorAll("#resumeSkillsContainer .dynamicEntry")).map(entry => {
      return {
          type: entry.querySelector("input.userTextInput").value,
          skills: Array.from(entry.querySelectorAll(".commonNameChipContainer .commonNameChip")).map(chip => chip.textContent.trim().replace(/close/, ''))
      };
  });

  // Construct the resume object
  const resume = {
      personalInfo,
      socialLinks,
      about,
      education,
      workExperience,
      projects,
      resumeSkills
  };

  // Send the resume object to Firebase or console log for testing
  dbEntryResume(resume); // Uncomment this to send to Firebase
}

async function dbEntryResume(resume) {
  const userId = getUserId(); // Make sure this gets the current session ID
  const resumeDocRef = doc(db, "resumes", userId); // Using the session ID as the document ID

  try {
      // This will create a new document or overwrite an existing document with the same ID
      await setDoc(resumeDocRef, resume);
      console.log("Document written/updated with ID: ", userId);
  } catch (e) {
      console.error("Error writing document: ", e);
  }
}

// Manage the session token : 
function generateUserId() {
  const userId = 'id-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
  console.log("UserId generated : " + userId)
  localStorage.setItem('userId', userId);
  clearAll();
  return userId
}

function generateAdminId() {
    const userId = 'id-admin-4828222800000';
    console.log("UserId generated : " + userId)
    localStorage.setItem('userId', userId);
    return userId
  }

function getUserId() {
  const storedId = localStorage.getItem('userId');
  if (storedId) {
      const [userId, timestamp] = storedId.split('-').slice(1);
      const currentTime = Date.now();
      
      // Check if the stored timestamp is older than 12 hours
      if (currentTime - parseInt(timestamp, 10) < 12 * 60 * 60 * 1000) {
        console.log("id generated less than 12h ago : " + storedId)
          return 'id-' + userId + '-' + timestamp; // Return existing ID
      }
  }

  // Generate a new ID if none exists or it's older than 48 hours
  const newUserId = generateUserId();
  console.log("Old id detected, generating new one : " + newUserId)
  return newUserId;
}

///// Restore the session :

// Function to fetch and populate resume data
function populateFormFields() {
  const userId = getUserId();
  const resumeDocRef = doc(db, "resumes", userId);

  getDoc(resumeDocRef).then(docSnapshot => {
      if (docSnapshot.exists()) {
          console.log("Resume data retrieved:", docSnapshot.data());
          const resume = docSnapshot.data();

          // Populate personal info
          document.getElementById("surname").value = resume.personalInfo.surname;
          document.getElementById("name").value = resume.personalInfo.lastname;
          document.getElementById("phone").value = resume.personalInfo.contact.phone;
          document.getElementById("email").value = resume.personalInfo.contact.email;
          document.getElementById("location").value = resume.personalInfo.contact.location;
          document.getElementById("address").value = resume.personalInfo.contact.address;

          // Populate about description
          document.getElementById("description").value = resume.about.description;

          // Populate social links
          document.getElementById("linkedin").value = resume.socialLinks.linkedin;
          document.getElementById("github").value = resume.socialLinks.github;

          // Populate languages
          const languageContainer = document.getElementById('languageChipContainer');
          resume.personalInfo.languages.forEach(language => {
              const chipHtml = `<div class='commonNameChip'>${language}<div class='commonNameChipButton' onclick='deleteChip(this)'><i class='material-symbols-rounded' style='font-size: 15px'>close</i></div></div>`;
              languageContainer.innerHTML += chipHtml;
          });

          // Populate education
          resume.education.forEach(edu => addEducationEntry(edu));

          // Populate work experience
          resume.workExperience.forEach(work => addWorkExperienceEntry(work));

          // Populate projects
          resume.projects.forEach(project => addProjectEntry(project));

          // Populate resume skills
          resume.resumeSkills.forEach(skillEntry => manageResumeSkillsEntry(skillEntry));
      } else {
          console.log("No resume data found for user:", userId);
      }
  }).catch(error => {
      console.error("Error fetching resume: ", error);
  });
  
}


///// Helper functions to clear all 
function clearAll() {
  // Clear all input fields
  document.getElementById("surname").value = '';
  document.getElementById("name").value = '';
  document.getElementById("phone").value = '';
  document.getElementById("email").value = '';
  document.getElementById("location").value = '';
  document.getElementById("address").value = '';
  document.getElementById("description").value = '';
  document.getElementById("linkedin").value = '';
  document.getElementById("github").value = '';

  // Clear language chips
  document.getElementById('languageChipContainer').innerHTML = '';

  // Remove all dynamic entries
  removeDynamicContent('educationContainer');
  removeDynamicContent('workExperienceContainer');
  removeDynamicContent('projectContainer');
  removeDynamicContent('resumeSkillsContainer');
}

// Helper function to remove dynamic content from a container
function removeDynamicContent(containerId) {
  const container = document.getElementById(containerId);
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

function initializeTextAreas() {
  document.querySelectorAll('.userTextArea').forEach(textarea => {
      adjustTextareaHeight(textarea); // Set initial height
      textarea.removeEventListener('input', adjustTextareaHeight);
      textarea.addEventListener('input', () => adjustTextareaHeight(textarea));
  });
}

function adjustTextareaHeight(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = (textarea.scrollHeight-40) + "px";
}

// Event listener for page load
document.addEventListener('DOMContentLoaded', function() { 
  populateFormFields(); // Call without parameters
  initLanguageInput();
  initSkillInputListener();
  initializeTextAreas();
}); // Enable listeners

document.addEventListener('DOMContentLoaded', function () {
  console.log("ParticleGround Loaded")
  particleground(document.getElementById('particleground'), {
    dotColor: '#5cbdaa',
    lineColor: '#5cbdaa'
  });
}, false);



