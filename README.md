# Timezone Me

A ultra simple app to compare your local time with other timezones.

Open `index.html` in a browser. No build or server required.

- First row is always your browser timezone
- Search to add cities or regions; remove extras with ×
- Drag the vertical bar to scrub time in 30-minute steps
- Working hours (07:00–18:00) are highlighted on each row
- Lunch (12:00–13:30) is hatched on each row; the 13:00 cell is only half lunch
- Extra timezones live in the URL, so you can share a view. People names are stored in `n` (one slot per row, first slot is whoever opens the link’s local row; use `%0A` for line breaks):

```
index.html?tz=Europe/London,America/New_York,Asia/Tokyo&n=Fellipe,Alice,Bob
```

The first row stays local to whoever opens the link.