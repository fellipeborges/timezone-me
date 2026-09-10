# Timezone Me

A ultra simple app to compare time across timezones.

Open `index.html` in a browser. No build or server required.

- Search to add cities or regions; remove any row with ×
- Drag the vertical bar to scrub time in 30-minute steps
- Working hours (07:00–18:00) are highlighted on each row
- Lunch (12:00–13:30) is hatched on each row; the 13:00 cell is only half lunch
- The hour grid is aligned to the first timezone in the list
- Timezones live in the URL, so you can share a view. People names are stored in `n` (one slot per row; use `%0A` for line breaks):

```
index.html?tz=Europe/London,America/New_York,Asia/Tokyo&n=Fellipe,Alice,Bob
```
