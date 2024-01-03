document.addEventListener('DOMContentLoaded', function () {
    // Reference the spinner buttons and value container
    // Style Spinner
    const styleSpinnerContainer = document.getElementById('styleSpinner');
    const leftButtonStyle = styleSpinnerContainer.querySelector('.spinner-button-left');
    const rightButtonStyle = styleSpinnerContainer.querySelector('.spinner-button-right');
    const valueContainerStyle = styleSpinnerContainer.querySelector('.spinner-value');
    // Color Spinner
    const colorSpinnerContainer = document.getElementById('colorSpinner');
    const leftButtonColor = colorSpinnerContainer.querySelector('.spinner-button-left');
    const rightButtonColor = colorSpinnerContainer.querySelector('.spinner-button-right');
    const valueContainerColor = colorSpinnerContainer.querySelector('.spinner-value');
    
    /////////////////////
    function updateThemeColors() {
      const colorTheme = valueContainerColor.textContent;
      const root = document.documentElement;
      let dotColor, lineColor;
      switch(colorTheme) {
        case 'Blue':
          // Set variables for Blue theme
          root.style.setProperty('--primaryButtonColor', '#2666ab');
          root.style.setProperty('--secondaryButtonColor', '#E0E0E0');
          root.style.setProperty('--primaryButtonHoverColor', '#2775c9'); 
          root.style.setProperty('--secondaryButtonHoverColor', '#cccccc');
          root.style.setProperty('--linearGradient1', '#006d8c'); 
          root.style.setProperty('--linearGradient2', '#1cb4c6'); 
          dotColor = '#5cbdaa';
          lineColor = '#5cbdaa';
          break;
        case 'Red':
          // Set variables for Red theme
          root.style.setProperty('--primaryButtonColor', '#6c0909');
          root.style.setProperty('--secondaryButtonColor', '#E0E0E0'); 
          root.style.setProperty('--primaryButtonHoverColor', '#9b1128'); 
          root.style.setProperty('--secondaryButtonHoverColor', '#cccccc'); 
          root.style.setProperty('--linearGradient1', '#800000');
          root.style.setProperty('--linearGradient2', '#ff3333');
          dotColor = '#6c0909';
          lineColor = '#6c0909'; 
          break;
        case 'Purple':
          // Set variables for Purple theme
          root.style.setProperty('--primaryButtonColor', '#800080');
          root.style.setProperty('--secondaryButtonColor', '#E0E0E0');
          root.style.setProperty('--primaryButtonHoverColor', '#660066');
          root.style.setProperty('--secondaryButtonHoverColor', '#cccccc');
          root.style.setProperty('--linearGradient1', '#4d004d'); 
          root.style.setProperty('--linearGradient2', '#b300b3');
          dotColor = '#800080';
          lineColor = '#800080'
          break;
        case 'Green':
          // Set variables for Purple theme
          root.style.setProperty('--primaryButtonColor', '#324E2E');
          root.style.setProperty('--secondaryButtonColor', '#E0E0E0');
          root.style.setProperty('--primaryButtonHoverColor', '#4A7344');
          root.style.setProperty('--secondaryButtonHoverColor', '#cccccc');
          root.style.setProperty('--linearGradient1', '#006400'); 
          root.style.setProperty('--linearGradient2', '#60c060');
          dotColor = '#324E2E';
          lineColor = '#324E2E';
          break;
        case 'Black':
          root.style.setProperty('--primaryButtonColor', '#515151');
          root.style.setProperty('--secondaryButtonColor', '#E0E0E0'); 
          root.style.setProperty('--primaryButtonHoverColor', '#867d7d'); 
          root.style.setProperty('--secondaryButtonHoverColor', '#cccccc'); 
          root.style.setProperty('--linearGradient1', '#006d8c'); 
          root.style.setProperty('--linearGradient2', '#ff3333');
          dotColor = '#3b5373'; 
          lineColor = '#6b3e55';
          break;
        // Add more cases as needed
      }
      particleground(document.getElementById('particleground'), {
        dotColor: dotColor,
        lineColor: lineColor
      });
    }
    // Attach an event listener to your color spinner
    colorSpinnerContainer.addEventListener('click', updateThemeColors);
    // Update theme colors on initial load
    updateThemeColors();
    updateCarouselImages(valueContainerStyle.textContent);

    /////////////////////
    
    // Arrays of styles and colors to cycle through
    const styles = ['ModernCV', 'Jake\'s Resume', 'Omar\'s Resume'];
    const colors = ['Blue', 'Red', 'Purple', 'Green', 'Black'];
    // Function to change the style in a given direction
    function changeStyle(direction) {
      let currentStyleIndex = styles.indexOf(valueContainerStyle.textContent);
      if (direction === 'next') {
        currentStyleIndex = (currentStyleIndex + 1) % styles.length;
      } else {
        currentStyleIndex = (currentStyleIndex - 1 + styles.length) % styles.length;
      }
      valueContainerStyle.textContent = styles[currentStyleIndex];
      // Check if the selected style is 'Jake's Resume'
      if (valueContainerStyle.textContent === 'Jake\'s Resume') {
        // Set color to Black and disable color spinner buttons
        valueContainerColor.textContent = 'Black';
        leftButtonColor.disabled = true;
        rightButtonColor.disabled = true;
        updateThemeColors();
      } else {
        // Enable color spinner buttons
        leftButtonColor.disabled = false;
        rightButtonColor.disabled = false;
      }
      updateCarouselImages(valueContainerStyle.textContent);
    }

    // Function to change the color in a given direction
    function changeColor(direction) {
      let currentColorIndex = colors.indexOf(valueContainerColor.textContent);
      if (direction === 'next') {
        currentColorIndex = (currentColorIndex + 1) % colors.length;
      } else {
        currentColorIndex = (currentColorIndex - 1 + colors.length) % colors.length;
      }
      valueContainerColor.textContent = colors[currentColorIndex];
    }
    // Event listeners for the buttons
    leftButtonStyle.addEventListener('click', function() { changeStyle('prev'); });
    rightButtonStyle.addEventListener('click', function() { changeStyle('next'); });
  
    leftButtonColor.addEventListener('click', function() { changeColor('prev'); });
    rightButtonColor.addEventListener('click', function() { changeColor('next'); });

    function updateCarouselImages(style) {
        let folderName;
        switch (style) {
            case 'ModernCV':
                folderName = 'ModernCV';
                break;
            case 'Jake\'s Resume':
                folderName = 'JakesResume';
                break;
            case 'Omar\'s Resume':
              folderName = 'OmarResume';
                break;
        }
    
        const carousel = document.querySelector('.carousel');
        let newCarouselContent = '';
    
        for (let i = 0; i < 9; i++) {
            let imageNumber = (i % 3) + 1;
            newCarouselContent += `<div class="carousel__item"><img src="assets/img/${folderName}/${imageNumber}.png"></div>`;
        }
        carousel.innerHTML = newCarouselContent;
    }
});
