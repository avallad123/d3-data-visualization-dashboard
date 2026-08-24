# D3.js Data Visualization Dashboard

An interactive dashboard built with D3.js that explores a 920-record clinical dataset (Kaggle's Cleveland Heart Disease database), letting users filter and cross-reference patient attributes across two linked, dynamically-updating visualizations.

## Overview

This project was originally built as a capstone for a data visualization course at Arizona State University. It goes beyond a static chart: the dashboard supports live filtering, dynamic legends, hover tooltips, and was iterated on based on real usability testing with multiple users.

## Features

- Dynamic bar chart showing patient counts by gender, which updates live based on filters
- - Scatter plot comparing cholesterol level against resting blood pressure, color-coded by heart disease diagnosis
  - - Filters for gender and chest pain type that drive both visualizations simultaneously
    - - Toggleable legend and hover tooltips showing per-patient detail
      - - Built entirely with vanilla D3.js (v7), no charting library shortcuts
       
        - ## Design process
       
        - The dashboard went through a full design-test-revise cycle:
       
        - 1. Initial build focused on two core visualizations (gender bar chart, cholesterol/blood pressure scatter plot) tied to filter controls
          2. 2. Usability testing was conducted with real users completing exploratory tasks
             3. 3. Based on that feedback, the design was revised to fix issues including a legend that was being obscured by data points, and a duplicate filter option
               
                4. ## Data insights
               
                5. Some patterns surfaced through exploring the dashboard:
               
                6. - Substantially more men than women were represented in the dataset
                   - - Asymptomatic patients (no chest pain) were more likely to have a heart disease diagnosis than those with atypical angina
                     - - Women in the dataset were less likely to have a heart disease diagnosis than men
                      
                       - ## Project structure
                      
                       - - `index.html` - Dashboard markup and filter controls
                         - - `script.js` - Data loading/cleaning, chart rendering, filtering logic, and tooltip behavior
                           - - `style.css` - Dashboard layout and styling
                             - - `heart_disease_uci.csv` - Dataset (Kaggle, Cleveland Heart Disease database)
                              
                               - ## Skills demonstrated
                              
                               - D3.js, data cleaning and transformation, interactive visualization design, usability testing and iterative design, and translating a dataset into a clear analytical narrative.
                               - 
