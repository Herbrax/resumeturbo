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
    if (items.length <= 1) {
      return details;
    }
    return `{
      \\begin{itemize}
        ${items.map(item => `\\item ${item}`).join('\n')}
      \\end{itemize}
    }`;
  }
  function ensureHttpPrefix(url) {
    if (!url) {
        return "";
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return 'https://' + url;
    }
    return url;
}
  
  function generateLatex1(personalInfo, socialLinks, about, education, workExperience, projects, resumeSkills, color) {
  console.log("Generating latex document 1 ");
    // LaTeX document preamble
    let latexDocument = 
  `\\documentclass[11pt,a4paper,roman]{moderncv}
  \\moderncvstyle{banking}
  \\moderncvcolor{${color}}
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
  \\begin{tabular}{ `;
  
    // Adding Languages, Mobile, Email, GitHub, and LinkedIn if provided
    if (personalInfo.languages && personalInfo.languages.join('') !== '') {
      latexDocument += `c `;
    }
    if (personalInfo.contact.email && personalInfo.contact.email.trim() !== '') {
      latexDocument += `c `;
    }
    if (socialLinks.linkedin && socialLinks.linkedin.trim() !== '') {
        latexDocument += `c `;
    }
    if (socialLinks.github && socialLinks.github.trim() !== '') {
        latexDocument += `c `;
    }
    if (personalInfo.contact.phone && personalInfo.contact.phone.trim() !== '') {
      latexDocument += `c `;
    }  
  
    latexDocument += `}`
    let firstItemAdded = false;
    if (personalInfo.languages && personalInfo.languages.join('') !== '') {
      if (firstItemAdded) {
        latexDocument += `& `;
        firstItemAdded = true;
      } else { 
        firstItemAdded = true;
      }
      latexDocument += `\\faLanguage\\enspace ${personalInfo.languages.join(', ')}`;
    }
    if (personalInfo.contact.email && personalInfo.contact.email.trim() !== '') {
      if (firstItemAdded) {
        latexDocument += `& `;
        firstItemAdded = true;
      } else { 
        firstItemAdded = true;
      }
      latexDocument += `\\faEnvelopeO\\enspace ${personalInfo.contact.email}`;
    }
    if (socialLinks.linkedin && socialLinks.linkedin.trim() !== '') {
      if (firstItemAdded) {
        latexDocument += `& `;
        firstItemAdded = true;
      } else { 
        firstItemAdded = true;
      }
      latexDocument += `\\href{${socialLinks.linkedin}}{\\faLinkedinSquare} `;
    }
    if (socialLinks.github && socialLinks.github.trim() !== '') { 
      if (firstItemAdded) {
        latexDocument += `& `;
        firstItemAdded = true;
      } else { 
        firstItemAdded = true;
      }
      latexDocument += `\\href{${socialLinks.github}}{\\faGithub} `;
    }
    if (personalInfo.contact.phone && personalInfo.contact.phone.trim() !== '') {
      if (firstItemAdded) {
        latexDocument += `& `;
        firstItemAdded = true;
      } else { 
        firstItemAdded = true;
      }
      latexDocument += `\\faMobile\\enspace ${personalInfo.contact.phone} `;
  }
    latexDocument += `\\\\
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
  
  function generateLatex2(personalInfo, socialLinks, about, education, workExperience, projects, resumeSkills) {
    console.log("Generating latex document 3");
    let latexDocument = `
  \\documentclass[letterpaper,11pt]{article}
  \\usepackage[empty]{fullpage}
  \\usepackage{titlesec}
  \\usepackage[usenames,dvipsnames]{color}
  \\usepackage{enumitem}
  \\usepackage[hidelinks]{hyperref}
  \\usepackage[english]{babel}
  \\usepackage{tabularx}
  \\addtolength{\\oddsidemargin}{-0.5in}
  \\addtolength{\\evensidemargin}{-0.5in}
  \\addtolength{\\textwidth}{1in}
  \\addtolength{\\topmargin}{-.5in}
  \\addtolength{\\textheight}{1.0in}
  \\urlstyle{same}
  \\raggedbottom
  \\raggedright
  \\setlength{\\tabcolsep}{0in}
  \\titleformat{\\section}{
    \\vspace{-4pt}\\scshape\\raggedright\\large
  }{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]
  \\newcommand{\\resumeItem}[1]{
    \\item\\small{
      {#1 \\vspace{-2pt}}
    }
  }
  \\newcommand{\\resumeSubheading}[5]{
    \\vspace{-2pt}\\item
      \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
        \\textbf{#1} & #2 \\\\
        \\textit{\\small#3} & \\textit{\\small #4} \\\\
      \\end{tabular*}
      {#5}\\\\}
  \\newcommand{\\resumeSubheadingBis}[4]{
    \\vspace{-2pt}\\item
      \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
        \\textbf{#1} & #2 \\\\
        \\textit{\\small#3} & \\textit{\\small #4} \\\\
      \\end{tabular*}\\vspace{-7pt}}
  \\newcommand{\\resumeSubSubheading}[2]{
      \\item
      \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
        \\textit{\\small#1} & \\textit{\\small #2} \\
      \\end{tabular*}\\vspace{-7pt}}
  \\newcommand{\\resumeProjectHeading}[2]{
      \\item
      \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
        \\small#1 & #2 \\
      \\end{tabular*}\\vspace{-7pt}}
  \\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}
  \\renewcommand\\labelitemii{\$\\vcenter{\\hbox{\\tiny\$\\bullet\$}}\$}
  \\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
  \\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
  \\newcommand{\\resumeSkillsListStart}{\\begin{itemize}[leftmargin=0.15in, label={}, noitemsep, topsep=0pt, partopsep=0pt]}
  \\newcommand{\\resumeSkillsListEnd}{\\end{itemize}}  
  \\newcommand{\\resumeItemListStart}{\\begin{itemize}}
  \\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}
  \\begin{document}
  
  \\begin{center}
  \\textbf{\\Huge \\scshape ${personalInfo.surname} ${personalInfo.lastname}} \\\\ \\vspace{1pt}`;
      let contactDetails = [];
      if (personalInfo.contact.phone) {
          contactDetails.push(`\\small ${personalInfo.contact.phone}`);
      }
      if (personalInfo.contact.email) {
          contactDetails.push(`\\href{mailto:${personalInfo.contact.email}}{{${personalInfo.contact.email}}}`);
      }
      if (socialLinks.linkedin) {
          contactDetails.push(`\\href{${socialLinks.linkedin}}{{${socialLinks.linkedin}}}`);
      }
      if (socialLinks.github) {
          contactDetails.push(`\\href{${socialLinks.github}}{{${socialLinks.github}}}`);
      }
  
      // Joining the contact details with separator and adding to document
      latexDocument += contactDetails.join(" $|$ ");
      latexDocument += `\\end{center}`;
  
      if (about && about.description.trim() !== '') {
        latexDocument += `
    \\section{About}
    ${about.description}`;
      }
    
      if (resumeSkills && resumeSkills.length > 0) {
        latexDocument += `
    \\section{Skills}
    \\resumeSkillsListStart
        `;
        resumeSkills.forEach((skill, index) => {
          if (skill.type && skill.skills.length > 0) {
            latexDocument += `\\item\\textbf{${skill.type}:} ${skill.skills.join(', ')}`;
            if (index < resumeSkills.length - 1) {
              latexDocument += `\\\\\n`;
            }
          }
        });
        latexDocument += `
    \\resumeSubHeadingListEnd`;
      }
    
      if (education && education.length > 0) {
        latexDocument += `
    \\section{Education}
    \\resumeSubHeadingListStart`;
        education.forEach(edu => {
          latexDocument += `
          \\resumeSubheading
            {${edu.institution}}{}
            {${edu.degree} in ${edu.field}}{${edu.year}}{${edu.details}}`;
        });
        latexDocument += `
    \\resumeSubHeadingListEnd`;
      }
    
      if (workExperience && workExperience.length > 0) {
        latexDocument += `
      \\section{Experience}
      \\resumeSubHeadingListStart`;
        workExperience.forEach(exp => {
          latexDocument += `
          \\resumeSubheadingBis
            {${exp.position}}{${exp.years}}
            {${exp.company}}{${exp.location}}{
            \\resumeItemListStart`;
          // Check if details are multiline
          if (exp.details.includes("\n")) {
            exp.details.split("\n").forEach(item => {
              if (item.trim() !== '') {
                latexDocument += `\\resumeItem{${item}}\n`;
              }
            });
          } else {
            // Single line detail
            latexDocument += `\\resumeItem{${exp.details}}\n`;
          }
          latexDocument += `
            \\resumeItemListEnd}`;
        });
        latexDocument += `
      \\resumeSubHeadingListEnd`;
      }
      
      if (projects && projects.length > 0) {
        latexDocument += `
      \\section{Projects}
      \\resumeSubHeadingListStart`;
        projects.forEach(proj => {
          latexDocument += `
          \\resumeProjectHeading
            {\\textbf{${proj.name}}}{}`;
          // Check if project description is multiline
          if (proj.description.includes("\n")) {
            latexDocument += `\\resumeItemListStart`;
            proj.description.split("\n").forEach(desc => {
              if (desc.trim() !== '') {
                latexDocument += `\\resumeItem{${desc}}\n`;
              }
            });
            latexDocument += `\\resumeItemListEnd`;
          } else {
            // Single line description
            latexDocument += `\\resumeItemListStart`;
            latexDocument += `{\\resumeItem{${proj.description}}}`;
            latexDocument += `\\resumeItemListEnd`;
          }
        });
        latexDocument += `
      \\resumeSubHeadingListEnd`;
      }
  
    
      latexDocument += `
    \\end{document}`;
      return latexDocument;
    }

  function generateLatex3(personalInfo, socialLinks, about, education, workExperience, projects, resumeSkills, color) {
    console.log("Generating latex document 2 ");
    
    // Initialize color variables
    let headerColor;
    let subHeaderColor;
  
    // Determine colors based on input
    switch(color) {
      case 'blue':
        headerColor = '19426e'; // Example color code for blue
        subHeaderColor = '00008b'; // Example sub header color for blue
        break;
      case 'red':
        headerColor = '400305'; // Example color code for red
        subHeaderColor = '831014'; // Example sub header color for red
        break;
      case 'purple':
        headerColor = '542a54'; // Example color code for purple
        subHeaderColor = '673f67'; // Example sub header color for purple
        break;
      case 'green':
          headerColor = '324E2E'; // Example color code for purple
          subHeaderColor = '4A7344'; // Example sub header color for purple
          break;
        case 'black':
          default:
            // Default and black color
            headerColor = '000000'; // Color code for black
            subHeaderColor = '404040'; // Sub header color for black
        }
    // LaTeX document preamble
    let latexDocument = 
  `\\documentclass[a4paper,8pt]{article}
  \\usepackage{parskip}
  \\usepackage{hologo}
  \\usepackage{fontspec}
  \\RequirePackage{color}
  \\RequirePackage{graphicx}
  \\usepackage[usenames,dvipsnames]{xcolor}
  \\usepackage[scale=0.9, top=.4in, bottom=.4in]{geometry}
  \\usepackage{tabularx}
  \\usepackage{enumitem}
  \\newcolumntype{C}{>{\\centering\\arraybackslash}X}
  \\usepackage{supertabular}
  \\usepackage{tabularx}
  \\newlength{\\fullcollw}
  \\setlength{\\fullcollw}{0.42\\textwidth}
  \\usepackage{titlesec}
  \\usepackage{multicol}
  \\usepackage{multirow}
  \\titleformat{\\section}{\\Large\\scshape\\raggedright}{}{0em}{}[\\titlerule]
  \\titlespacing{\\section}{1pt}{2pt}{2pt}
  \\usepackage[style=authoryear,sorting=ynt, maxbibnames=2]{biblatex}
  \\usepackage[unicode, draft=false]{hyperref}
  \\usepackage{fontawesome5}
  \\usepackage[normalem]{ulem}
  \\setmainfont{TeX Gyre Heros}
  \\setlist[itemize]{label={-}, itemsep=0pt, parsep=0pt, topsep=0pt, partopsep=0pt, leftmargin=1em}

  
  % Define colors based on input
  \\definecolor{headerColor}{HTML}{${headerColor}}
  \\definecolor{subHeaderColor}{HTML}{${subHeaderColor}}
  
  % commands for entries
  \\newcommand{\\entryItems}[4]{
    \\noindent\\textbf{\\color{headerColor}#1}\\hfill\\textbf{\\color{subHeaderColor}#2}
    \\ifx&#3&\\else\\\\\\noindent\\textit{\\color{subHeaderColor}#3}\\fi
      #4
    \\vspace{5pt} % Adjust vertical space after each entry
  }
  \\newcommand{\\entry}[4]{
    \\noindent\\textbf{\\color{headerColor}#1}\\hfill\\textbf{\\color{subHeaderColor}#2}
    \\ifx&#3&\\else\\\\\\noindent\\textit{\\color{subHeaderColor}#3}\\fi
      \\\\#4
    \\vspace{5pt} % Adjust vertical space after each entry
  }
  \\begin{document}
  \\pagestyle{empty}
  
  \\begin{tabularx}{\\linewidth}{@{} C @{}}
  `;
    // Personal information and contact line
    latexDocument += `
  \\color{headerColor} \\Huge{${personalInfo.surname} ${personalInfo.lastname}} \\\\[6pt]\\\\
  `;
  
    // Adding Languages, Mobile, Email, GitHub, and LinkedIn if provided
    if (personalInfo.languages && personalInfo.languages.join('') !== '') {
      latexDocument += `\\textcolor{subHeaderColor}{\\raisebox{-0.05\\height}{\\faLanguage} ${personalInfo.languages.join(', ')} }\n`;
    }
    if (personalInfo.contact.phone && personalInfo.contact.phone.trim() !== '') {
      latexDocument += `\\textcolor{subHeaderColor}{\\raisebox{-0.05\\height}{\\faMobile} ${personalInfo.contact.phone} }\n`;
    }
    if (socialLinks.github) {
      latexDocument += `\\textcolor{subHeaderColor}{{\\href{${socialLinks.github}}{\\raisebox{-0.05\\height}{\\faGithub}}} }\n`;
    }
    if (socialLinks.linkedin) {
        latexDocument += `\\textcolor{subHeaderColor}{{\\href{${socialLinks.linkedin}}{\\raisebox{-0.05\\height}{\\faLinkedin}}} }\n`;
    }
    latexDocument += '\\\\'
    latexDocument += `\\textcolor{subHeaderColor}{\\raisebox{-0.05\\height}{\\faMapMarker} ${personalInfo.contact.address} }\n`;
    if (personalInfo.contact.email) {
        latexDocument += `\\textcolor{subHeaderColor}{{\\href{mailto:${personalInfo.contact.email}}{\\raisebox{-0.05\\height}{\\faEnvelope} ${personalInfo.contact.email}}} }\n`;
    }
  
    latexDocument += `\\end{tabularx}\n`;
  // About section
    if (about.description && about.description.trim() !== '') {
      latexDocument += `\\color{headerColor}\\section{About}\\vspace{1ex}\\color{black}{${about.description}}`;
    }
    
  // Skills section
  if (resumeSkills.length > 0) {
    latexDocument += `\\color{headerColor}\\section{Skills}\n\\vspace{1ex}`;
  
    resumeSkills.forEach((skill, index) => {
      if (skill.type && skill.skills.length > 0) {
        latexDocument += `
  \\color{headerColor}\\textbf{${skill.type}:} \\color{black} ${skill.skills.join(', ')}\n`;
        if (index < resumeSkills.length - 1) {
          latexDocument += '\\\\';
        }
      }
    });
    }
    
  // Education section
  if (education && education.length > 0) {
      latexDocument += `
  \\color{headerColor}\\section{Education}\n\\vspace{1ex}`;
      education.forEach(edu => {
          latexDocument += `
  \\entry{${edu.institution}}
      {${edu.year}}
      {${edu.degree} in ${edu.field}}
      {\\textcolor{black}{${edu.details}}}\n`;
      });
  }
  // Work Experience section
  if (workExperience && workExperience.length > 0) {
    latexDocument += `
  \\color{headerColor}\\section{Work Experience}\n\\vspace{1ex}`;
    workExperience.forEach((exp, index) => {
        const isLastItem = index === workExperience.length - 1;
        if (exp.details.split("\n").length <= 1) {
          // Single line description
          latexDocument += `\\entry{${exp.company}}{${exp.years}}{${exp.position}}{\\textcolor{black}{${exp.details}}}`;
          if (!isLastItem) {
            latexDocument += `\n\\\\`;
          }
          latexDocument += `\n`;
        } else {
          // Multiline description
          latexDocument += `\\entryItems{${exp.company}}{${exp.years}}{${exp.position}}{\\textcolor{black}{${formatDetailsAsItemList(exp.details)}}}\n`;
        }
    });
  }
  
  // Projects section
  if (projects && projects.length > 0) {
    latexDocument += `\\color{headerColor}\\section{Projects}\n\\vspace{1ex}`;
    projects.forEach((proj, index) => {
        const isLastItem = index === projects.length - 1;
        if (proj.description.split("\n").length <= 1) {
          // Single line description
          latexDocument += `\\entry{${proj.name}}{}{}{\\textcolor{black}{${proj.description}}}`;
          if (!isLastItem) {
            latexDocument += `\n\\\\`;
          }
          latexDocument += `\n`;
        } else {
          // Multiline description
          latexDocument += `\\entryItems{${proj.name}}{}{}{\\textcolor{black}{${formatDetailsAsItemList(proj.description)}}}\n`;
        }
    });
  }
    // Closing the document
    latexDocument += `
  \\end{document}`;
    return latexDocument;
  }
  

  
  
  function constructLatexDocument(personalInfo, socialLinks, about, education, workExperience, projects, resumeSkills) {
    console.log("Constructing latex document");
  
    // Get the current style from the div
    const styleSpinnerContainer = document.getElementById('styleSpinner');
    const valueContainerStyle = styleSpinnerContainer.querySelector('.spinner-value');
    const currentStyle = valueContainerStyle.textContent;
    // Get the current color from the div
    const colorSpinnerContainer = document.getElementById('colorSpinner');
    const valueContainerColor = colorSpinnerContainer.querySelector('.spinner-value');
    const currentColor = valueContainerColor.textContent.toLowerCase();

    // Call the appropriate function based on the current style
    switch (currentStyle) {
        case 'ModernCV':
            return generateLatex1(personalInfo, socialLinks, about, education, workExperience, projects, resumeSkills, currentColor);
        case 'Jake\'s Resume':
            return generateLatex2(personalInfo, socialLinks, about, education, workExperience, projects, resumeSkills);
        case 'Omar\'s Resume':
            return generateLatex3(personalInfo, socialLinks, about, education, workExperience, projects, resumeSkills, currentColor);  
        default:
            console.error("Invalid style");
            return "";
      }
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
                        : [""],
        contact: {
            phone: document.getElementById("phone").value,
            email: document.getElementById("email").value,
            address: (document.getElementById("address").value) 
                    + (document.getElementById("address").value ? ", " : "") 
                    + (document.getElementById("location").value || "EmptyEntry")
        }
      };
      let socialLinks = {
        linkedin: ensureHttpPrefix(document.getElementById("linkedin").value),
        github: ensureHttpPrefix(document.getElementById("github").value)
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
    }, 10000);
  }

  export { downloadLatexFile };
  export { exportLatex };
