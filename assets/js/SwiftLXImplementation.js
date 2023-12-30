const compileBtn = document.getElementById("compilebtn");
const pdfbox = document.getElementById("pdfbox");
const globalEn = new XeTeXEngine();
const dvipdfmxEn = new DvipdfmxEngine();

function escapeLatexCharacters(str) {
  return str.replace(/\\/g, '\\textbackslash')
            .replace(/~/g, '\\textasciitilde')
            .replace(/\$/g, '\\$')
            .replace(/%/g, '\\%')
            .replace(/&/g, '\\&')
            .replace(/#/g, '\\#')
            .replace(/\^/g, '\\textasciicircum')
            .replace(/_/g, '\\_')
            .replace(/{/g, '\\{')
            .replace(/}/g, '\\}')
            .replace(/"/g, "''");
}

function cleanLatexInputs(personalInfo, socialLinks, about, education, workExperience, projects, resumeSkills) {
  // Nettoyer les entrées personnelles
  const cleanedPersonalInfo = {
      ...personalInfo,
      surname: escapeLatexCharacters(personalInfo.surname),
      lastname: escapeLatexCharacters(personalInfo.lastname),
      languages: personalInfo.languages.map(escapeLatexCharacters),
      contact: {
          ...personalInfo.contact,
          email: escapeLatexCharacters(personalInfo.contact.email),
          phone: escapeLatexCharacters(personalInfo.contact.phone),
          address: escapeLatexCharacters(personalInfo.contact.address)
      }
  };
    // Nettoyer les liens sociaux
    const cleanedSocialLinks = {
      linkedin: escapeLatexCharacters(socialLinks.linkedin),
      github: escapeLatexCharacters(socialLinks.github)
  };

  // Nettoyer la section "About"
  const cleanedAbout = { ...about, description: escapeLatexCharacters(about.description) };

  // Nettoyer la section "Education"
  const cleanedEducation = education.map(edu => ({
      ...edu,
      degree: escapeLatexCharacters(edu.degree),
      field: escapeLatexCharacters(edu.field),
      institution: escapeLatexCharacters(edu.institution),
      year: escapeLatexCharacters(edu.year),
      details: escapeLatexCharacters(edu.details)
  }));

  // Nettoyer la section "Work Experience"
  const cleanedWorkExperience = workExperience.map(exp => ({
      ...exp,
      position: escapeLatexCharacters(exp.position),
      company: escapeLatexCharacters(exp.company),
      years: escapeLatexCharacters(exp.years),
      details: escapeLatexCharacters(exp.details)
  }));
    // Nettoyer la section "Projects"
    const cleanedProjects = projects.map(proj => ({
      ...proj,
      name: escapeLatexCharacters(proj.name),
      description: escapeLatexCharacters(proj.description)
  }));

  // Nettoyer la section "Resume Skills"
  const cleanedResumeSkills = resumeSkills.map(skill => ({
      ...skill,
      type: escapeLatexCharacters(skill.type),
      skills: skill.skills.map(escapeLatexCharacters)
  }));

  return {
      personalInfo: cleanedPersonalInfo,
      socialLinks: cleanedSocialLinks,
      about: cleanedAbout,
      education: cleanedEducation,
      workExperience: cleanedWorkExperience,
      projects: cleanedProjects,
      resumeSkills: cleanedResumeSkills
  };
}

function formatDetailsAsItemList(details) {
  const items = details.split("\n"); // Assuming each point is separated by a newline
  if (items.length <= 0) {
    return details;
  }
  return `{
    \\begin{itemize}
      ${items.map(item => `\\item ${item}`).join('\n')}
    \\end{itemize}
  }`;
}

function constructLatexDocument(personalInfo, socialLinks, about, education, workExperience, projects, resumeSkills) {
  
    // LaTeX document preamble
    let latexDocument = `
  \\documentclass[11pt,a4paper,roman]{moderncv}
    \\moderncvstyle{banking}
    \\moderncvcolor{blue}
    \\nopagenumbers{}
    \\usepackage[scale=0.9]{geometry}
    \\usepackage{color}
    \\newcommand*{\\customcventry}[7][.25em]{
      \\begin{tabular}{@{}l} 
        {\\bfseries #4}
      \\end{tabular}
      \\hfill
      \\begin{tabular}{l@{}}
         {\\bfseries #5}
      \\end{tabular}\\\\
      \\begin{tabular}{@{}l} 
        {\\itshape #3}
      \\end{tabular}
      \\hfill
      \\begin{tabular}{l@{}}
         {\\itshape #2}
      \\end{tabular}
      \\ifx&#7&
      \\else{
        \\begin{minipage}{\\maincolumnwidth}
          \\footnotesize #7
        \\end{minipage}}\\fi
      \\par\\addvspace{#1}
    }
    \\newcommand*{\\customcvproject}[4][.25em]{
      \\begin{tabular}{@{}l} 
        {\\small\\bfseries #2} 
      \\end{tabular}
      \\hfill
      \\begin{tabular}{l@{}}
         {\\footnotesize\\itshape #3}
      \\end{tabular}
      \\ifx&#4&
      \\else{\\
        \\begin{minipage}{\\maincolumnwidth}%
          \\footnotesize #4
        \\end{minipage}}\\fi
      \\par\\addvspace{#1}
    }
    \\setlength{\\tabcolsep}{12pt}
    `;
        

    // Personal information and contact line
    latexDocument += `
    \\name{${personalInfo.surname}}{${personalInfo.lastname}}
    \\address{${personalInfo.contact.address}}
    \\begin{document}
    \\makecvtitle
    \\vspace*{-23mm}

    \\begin{center}
    \\begin{tabular}{ c c `;

    // Add LinkedIn if provided
    if (socialLinks.linkedin && socialLinks.linkedin.trim() !== '') {
        latexDocument += `c `;
    }

    // Add GitHub if provided
    if (socialLinks.github && socialLinks.github.trim() !== '') {
        latexDocument += `c `;
    }

    latexDocument += `c }
    \\faLanguage\\enspace ${personalInfo.languages.join(', ')} & \\faEnvelopeO\\enspace ${personalInfo.contact.email} `;

    // Conditionally add LinkedIn
    if (socialLinks.linkedin && socialLinks.linkedin.trim() !== '') {
        latexDocument += `& \\href{${socialLinks.linkedin}}{\\faLinkedinSquare} `;
    }

    // Conditionally add GitHub
    if (socialLinks.github && socialLinks.github.trim() !== '') {
        latexDocument += `& \\href{${socialLinks.github}}{\\faGithub} `;
    }

    latexDocument += `& \\faMobile\\enspace ${personalInfo.contact.phone} \\\\
    \\end{tabular}
    \\end{center}
    `;

  // About section
  if (about.description && about.description.trim() !== '') {
    latexDocument += `
  \\section{ABOUT}
  ${about.description}
  `;
  }

  // Skills section
  if (resumeSkills.length > 0) {
    latexDocument += `\\section{SKILLS}\n`;

    resumeSkills.forEach((skill, index) => {
        if (skill.type && skill.skills.length > 0) {
            latexDocument += `\\textbf{${skill.type}:} ${skill.skills.join(', ')}`;
            if (index < resumeSkills.length - 1) {
                latexDocument += '\\\\';
            }
            latexDocument += '\n';
        }
    });
  }

  // Education section
  if (education.length > 0) {
    latexDocument += `\\section{EDUCATION}\n`;

    education.forEach(edu => {
      latexDocument += `\\customcventry{${edu.year}}{${edu.degree} in ${edu.field}}{${edu.institution}}{}{}{${edu.details}}\n`;
    });
  }

  // Work Experience section
  if (workExperience.length > 0) {
    latexDocument += `\\section{WORK EXPERIENCE}\n`;
    workExperience.forEach(exp => {
      latexDocument += `\\customcventry{${exp.years}}{${exp.position}}{${exp.company}}{${exp.location}}{}{${formatDetailsAsItemList(exp.details)}}\n`;
    });
  }

  // Projects section
  if (projects.length > 0) {
    latexDocument += `\\section{PROJECTS}\n`;

    projects.forEach(proj => {
      latexDocument += `\\customcvproject{${proj.name}}{}{${formatDetailsAsItemList(proj.description)}}\n`;
    });
  }


  // Closing the document
  latexDocument += `
      \\end{document}
      `;

  return latexDocument;
}

function exportLatex() { 
    let personalInfo = {
      surname: document.getElementById("surname").value || "EmptyEntry",
      lastname: document.getElementById("name").value || "EmptyEntry",
      languages: Array.from(document.querySelectorAll("#languageChipContainer .commonNameChip"))
                      .map(chip => chip.textContent.trim().replace(/close/, ''))
                      .length > 0 
                      ? Array.from(document.querySelectorAll("#languageChipContainer .commonNameChip"))
                              .map(chip => chip.textContent.trim().replace(/close/, '')) 
                      : ["EmptyEntry"],
      contact: {
          phone: document.getElementById("phone").value || "EmptyEntry",
          email: document.getElementById("email").value || "EmptyEntry",
          address: (document.getElementById("address").value) 
                  + (document.getElementById("address").value ? ", " : "") 
                  + (document.getElementById("location").value || "EmptyEntry")
      }
    };
    let socialLinks = {
        linkedin: document.getElementById("linkedin").value,
        github: document.getElementById("github").value
    };
    let about = {
        description: document.getElementById("description").value
    };
    let education = Array.from(document.querySelectorAll("#educationContainer .dynamicEntry")).map(entry => {
        return {
            degree: entry.querySelectorAll("input")[0].value,
            field: entry.querySelectorAll("input")[1].value,
            institution: entry.querySelectorAll("input")[2].value,
            year: entry.querySelectorAll("input")[3].value,
            details: entry.querySelector("textarea").value
        };
    });
    let workExperience = Array.from(document.querySelectorAll("#workExperienceContainer .dynamicEntry")).map(entry => {
      const row1 = entry.querySelectorAll(".fieldRow2")[0]; // First set of inputs
      const row2 = entry.querySelectorAll(".fieldRow2")[1]; // Second set of inputs
      return {
          position: row1.querySelectorAll("input")[0].value, // Position from the first set
          company: row1.querySelectorAll("input")[1].value,  // Company from the first set
          years: row2.querySelectorAll("input")[0].value,    // Years from the second set
          location: row2.querySelectorAll("input")[1].value, // Location from the second set (if needed)
          details: entry.querySelector("textarea").value     // Details from textarea
      };
    });
    let projects = Array.from(document.querySelectorAll("#projectContainer .dynamicEntry")).map(entry => {
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
    // Construct LaTeX document based on the above data
    const cleanedData = cleanLatexInputs(personalInfo, socialLinks, about, education, workExperience, projects, resumeSkills);
    const latexDocument = constructLatexDocument(cleanedData.personalInfo, cleanedData.socialLinks, cleanedData.about, cleanedData.education, cleanedData.workExperience, cleanedData.projects, cleanedData.resumeSkills);
    
    return latexDocument
}

function downloadLatexFile() {
  const latexContent = exportLatex();
  const blob = new Blob([latexContent], { type: 'text/plain' });
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = 'main.tex';

  // Append link to body temporarily
  document.body.appendChild(downloadLink);
  downloadLink.click();

  // Remove the link after a short delay
  setTimeout(() => {
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadLink.href);
  }, 100);
}



    async function init() {
    await globalEn.loadEngine();
    await dvipdfmxEn.loadEngine();
    compileBtn.innerHTML = "Compile";
    compileBtn.className = "primaryButton";
    compileBtn.disabled = false;
    }

    async function compile() {
    if (!globalEn.isReady() || !dvipdfmxEn.isReady()) {
        console.log("Engine not ready yet");
        return;
    }
    compileBtn.disabled = true;
    compileBtn.innerHTML = "Compiling...";
    compileBtn.className = "secondaryButton";
    const latexSource =  exportLatex();
    console.log(latexSource); // Log the LaTeX document
    globalEn.writeMemFSFile("main.tex", latexSource);
    globalEn.setEngineMainFile("main.tex");
    let r = await globalEn.compileLaTeX();
    compileBtn.innerHTML = "Compile";
    compileBtn.className = "primaryButton";
    compileBtn.disabled = false;

  if (r.status === 0) {
    dvipdfmxEn.writeMemFSFile("main.xdv", r.pdf);
    dvipdfmxEn.setEngineMainFile("main.xdv");
    let r1 = await dvipdfmxEn.compilePDF();
    const pdfblob = new Blob([r1.pdf], {type: 'application/pdf'});
    const objectURL = URL.createObjectURL(pdfblob);
    setTimeout(() => {
      URL.revokeObjectURL(objectURL);
    }, 30000);
    // Hide the carousel when the viewer is active
    const carouselElement = document.getElementById("carousel");
    if (carouselElement) {
        carouselElement.style.display = "none";
    }    
    const pdfViewer = document.getElementById("pdf-viewer");
    pdfViewer.src = `assets/js/pdfjs/web/viewer.html?file=${encodeURIComponent(objectURL)}`;
  }
}

init();

document.addEventListener('DOMContentLoaded', function() {
  const editorInkElement = document.getElementById("editorInk");

  // Check if the element exists
  if (editorInkElement) {
      editorInkElement.addEventListener('click', function() {
          downloadLatexFile();
          console.log("Downloaded latex")
      });
  }
});
