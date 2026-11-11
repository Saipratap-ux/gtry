# StudentHub

A responsive student productivity dashboard built with HTML, CSS and vanilla JavaScript. It is designed to deploy directly to **GitHub Pages** with no backend or build step.

## Features

- Dashboard with task totals, completion rate and upcoming deadlines
- Task manager: create, edit, delete, complete, search and filter
- Study planner for sessions, assignments, exams and revision deadlines
- Pomodoro timer with focus, short break and long break modes
- Notes: create, edit, search and delete
- Productivity analytics
- Light and dark themes
- Responsive desktop, tablet and mobile layout
- LocalStorage persistence

## Run locally

1. Download or clone this repository.
2. Open the `studenthub` folder.
3. Open `index.html` in a modern browser.

For a more consistent local development experience, use the VS Code **Live Server** extension and click **Go Live**.

## Deploy to GitHub Pages

1. Sign in to GitHub and create a new **public** repository named `studenthub`.
2. Upload the contents of this folder to the repository root. Make sure `index.html` is at the root, not inside another nested folder.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`, then click **Save**.
6. Wait for the Pages deployment to finish. Your site will be published at:

   `https://YOUR-USERNAME.github.io/studenthub/`

Replace `YOUR-USERNAME` with your GitHub username. It can take a few minutes for the first deployment.

## Push updates with Git

```bash
git init
git add .
git commit -m "Build StudentHub productivity dashboard"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/studenthub.git
git push -u origin main
```

For later updates:

```bash
git add .
git commit -m "Update StudentHub"
git push
```

## Data and privacy

StudentHub stores tasks, plans, notes, theme preference and completed focus sessions in the browser's LocalStorage. Data stays in that browser on that device. It is not an account system and does not sync between devices. Clearing browser site data may remove saved information. Export or backup important notes separately.

## Project structure

```text
studenthub/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── tasks.js
│   ├── planner.js
│   ├── timer.js
│   ├── notes.js
│   └── analytics.js
├── assets/
└── README.md
```

## Notes

- No API keys or secrets are required.
- Google Fonts are loaded from Google Fonts; the site falls back to system fonts if unavailable.
- Timer notifications are optional and require browser permission.
- GitHub Pages serves static files only. Features that need multi-device sync, user accounts or shared data would require a backend.
