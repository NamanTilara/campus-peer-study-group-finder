# Project Notes

## Problem
Students often study alone before exams and do not know who else is preparing for the same subject. StudyCircle lets them find or start a group on campus.

## Technologies
- **HTML:** page structure and forms
- **CSS:** layout (flexbox, grid), responsive design, dark mode, CSS-only subject filter using `:has()`
- **JavaScript:** creating circles, joining, seat counting, chat

## Rules in the project
- A host must give name, 8-digit registration no. and B.Tech year.
- A joining student must give an 8-digit registration no.
- The same registration no. cannot join a circle twice.
- A full circle does not accept new members.
- Only members (host and joined students) can see the circle chat.

## Limitations
- There is no database, so circles, joins and chat messages reset when the page is refreshed.
- Chat works inside one browser only. Messages are not shared between different devices.
- The search form on the home page is a visual element only.

## Future improvements
- Store data in a database (Firebase or Node.js) so chat works across devices.
- Student login with registration number and password.
- Working search by subject and time.

## Possible viva questions
1. Why is JavaScript needed for the chat? HTML and CSS cannot create or send new content.
2. How does the subject filter work without JavaScript? Hidden radio buttons and the CSS `:has()` selector.
3. How would you make chat work between students? Use a shared database such as Firebase.
