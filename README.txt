HABITLY — CODGEN FRONTEND DEVELOPMENT INTERNSHIP, WEEK 2

FILES
- index.html
- css/style.css
- js/app.js

HOW TO RUN
1. Extract the ZIP file.
2. Open the extracted habitly-week2 folder.
3. Double-click index.html to open Habitly in your browser.
4. Internet is required for the Inter Google Font and the daily quote API.
   If the quote API is unavailable, Habitly displays a built-in fallback quote.

WEEK 2 FEATURES
- Habits are stored in a JavaScript array of objects.
- Habit cards are created dynamically by a render function.
- Add habits using the input and Add habit button; Enter also submits.
- Choose an emoji before adding a habit.
- Empty names and duplicate names show friendly inline messages.
- Complete / uncomplete a habit for the current local date.
- Delete habits after a confirmation prompt.
- Done today, total habits, remaining habits and progress bar update automatically.
- Friendly empty state when there are no habits.
- Habits persist after refresh using localStorage, with try/catch error handling.
- Daily quote loads asynchronously from https://dummyjson.com/quotes/random.
- A built-in fallback quote is shown if the API request fails.

STARTER DATA
The first time the app is opened, it starts with the five sample habits from Week 1.
The first three are marked completed for today's date to preserve the original Week 1 preview.
You can change, delete, or add habits. Your changes are saved in this browser.

IMPORTANT
- This is a front-end project using HTML, CSS and vanilla JavaScript; no build tools or installation are required.
- localStorage is browser-specific. Your habits stay in the same browser on the same device, but are not synced between devices.
- If you clear browser site data, saved habits may be removed.
- For GitHub Pages, upload the contents of this folder into the existing habitly repository:
  index.html, css/style.css, and js/app.js.
- Keep the folder structure exactly as shown above.
- After uploading, open Settings > Pages and confirm deployment from main / (root).
- Test the live website in an incognito/private window and verify that adding a habit,
  refreshing the page, and completing/deleting habits work.

