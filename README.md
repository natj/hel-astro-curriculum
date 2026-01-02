# Experimental Astrophysics Course Curriculum 

Welcome to an experimental University of Helsinki astrophysics course curriculum rendered as a digital garden of notes.


## Course data 

- `courseinfo.py` stores the course information as python dictionary entries
- `teacherinfo.py` stores information about teachers as python dictionary entries
- `write_markdowns.py` reads these datasets and generates the markdown files into `content/`

If you want to change data, modify `courseinfo.py` and `teacherinfo.py` and rerun `python3 write_markdowns.py`. Then re-generate the page.


## Generate page locally

Install prerequisites

```bash
npm install
```

Generate page

```bash
npm run build
```
Outputu will be located at `public/` and can be copied to a html-serving disk space.

Optionally, serve the page (for local debugging):
```bash
npm run serve
```
and access at http://localhost:9000/home/jnattila/astro-curriculum/ (note the prefix set at `gatsby-config.js`).
