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
  
      switch(colorTheme) {
        case 'Blue':
          // Set variables for Blue theme
          root.style.setProperty('--primaryButtonColor', '#2666ab');
          root.style.setProperty('--secondaryButtonColor', '#E0E0E0');
          root.style.setProperty('--primaryButtonHoverColor', '#2775c9'); 
          root.style.setProperty('--secondaryButtonHoverColor', '#cccccc');
          root.style.setProperty('--linearGradient1', '#006d8c'); 
          root.style.setProperty('--linearGradient2', '#1cb4c6'); 
          break;
        case 'Red':
          // Set variables for Red theme
          root.style.setProperty('--primaryButtonColor', '#6c0909');
          root.style.setProperty('--secondaryButtonColor', '#FFC0CB'); 
          root.style.setProperty('--primaryButtonHoverColor', '#9b1128'); 
          root.style.setProperty('--secondaryButtonHoverColor', '#ffb3b3'); 
          root.style.setProperty('--linearGradient1', '#800000');
          root.style.setProperty('--linearGradient2', '#ff3333'); 
          break;
        case 'Purple':
          // Set variables for Purple theme
          root.style.setProperty('--primaryButtonColor', '#800080');
          root.style.setProperty('--secondaryButtonColor', '#D8BFD8');
          root.style.setProperty('--primaryButtonHoverColor', '#660066');
          root.style.setProperty('--secondaryButtonHoverColor', '#e6cce6');
          root.style.setProperty('--linearGradient1', '#4d004d'); 
          root.style.setProperty('--linearGradient2', '#b300b3'); 
          break;
          case 'Green':
            // Set variables for Purple theme
            root.style.setProperty('--primaryButtonColor', '#324E2E');
            root.style.setProperty('--secondaryButtonColor', '#F1F1F1');
            root.style.setProperty('--primaryButtonHoverColor', '#4A7344');
            root.style.setProperty('--secondaryButtonHoverColor', '#CFE2CE');
            root.style.setProperty('--linearGradient1', '#006400'); 
            root.style.setProperty('--linearGradient2', '#60c060'); 
            break;
        case 'Black':
            root.style.setProperty('--primaryButtonColor', '#515151');
            root.style.setProperty('--secondaryButtonColor', '#F1F1F1'); 
            root.style.setProperty('--primaryButtonHoverColor', '#867d7d'); 
            root.style.setProperty('--secondaryButtonHoverColor', '#cccccc'); 
            root.style.setProperty('--linearGradient1', '#006d8c'); 
            root.style.setProperty('--linearGradient2', '#ff3333'); 
          break;
        // Add more cases as needed
      }
    }
    // Attach an event listener to your color spinner
    colorSpinnerContainer.addEventListener('click', updateThemeColors);
    // Update theme colors on initial load
    updateThemeColors();

    /////////////////////
    
    // Arrays of styles and colors to cycle through
    const styles = ['Style A', 'Style B', 'Style C'];
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
      // Check if the selected style is 'Style C'
      if (valueContainerStyle.textContent === 'Style C') {
        // Set color to Black and disable color spinner buttons
        valueContainerColor.textContent = 'Black';
        leftButtonColor.disabled = true;
        rightButtonColor.disabled = true;
      } else {
        // Enable color spinner buttons
        leftButtonColor.disabled = false;
        rightButtonColor.disabled = false;
      }
      updateThemeColors();
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
  });