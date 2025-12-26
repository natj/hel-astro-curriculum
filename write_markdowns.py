import os
import re
import unicodedata
from courseinfo import astro_courses, additional_courses


output_dir = "courses"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

def slugify(value):
    """
    Normalizes string to create a safe filename.
    """
    value = str(value)
    value = unicodedata.normalize('NFKD', value).encode('ascii', 'ignore').decode('ascii')
    value = re.sub(r'[^\w\s-]', '', value.lower())
    return re.sub(r'[-\s]+', '-', value).strip('-_')

def format_content_string(c):
    """
    Reconstructs the content metadata string from the unified fields.
    """
    parts = []
    if c.get('content_lectures'):
        parts.append(f"{c['content_lectures']} lectures")
    if c.get('content_exercises'):
        parts.append(f"{c['content_exercises']} exercises")
    if c.get('content_other'):
        parts.extend(c['content_other'])
    
    return ", ".join(parts) if parts else "Not specified"

def create_markdown(course):
    # 1. Handle Lists (remove None values for clean YAML/Display)
    periods = [p for p in course['period'] if p is not None]
    years = [y for y in course['year'] if y is not None]
    
    # 2. Handle Themes (Float 0.25 -> Int 25)
    # Use 'or 0' to handle None values safely
    t = int((course['themes_theory'] or 0) * 100)
    m = int((course['themes_methods'] or 0) * 100)
    o = int((course['themes_observations'] or 0) * 100)
    p = int((course['themes_phenomena'] or 0) * 100)
    
    # Create display string for body
    if t + m + o + p == 0:
        themes_display = "Not specified"
    else:
        themes_display = f"Theory {t}%, Methods {m}%, Observations {o}%, Phenomena {p}%"

    # 3. Format Teachers (Wiki-link style)
    if course['teachers']:
        teachers_display = ", ".join([f"[[{t}]]" for t in course['teachers']])
    else:
        teachers_display = "None listed"

    # 4. Format Lists (Topics & Prereqs)
    topics_list = "\n".join([f"- {t}" for t in course['topics']]) if course['topics'] else "- No content listed"

    prereqs_list = "\n".join([f"- [[{p}]]" for p in course['prereqs']]) if course['prereqs'] else "- None listed"
    prereqs_list_other = "\n".join([f"- {p}" for p in course['prereqs_other']]) if course['prereqs_other'] else ""
    
    # 5. Period Display
    period_display = ", ".join(map(str, periods)) if periods else "Not specified"

    md = f"""---
title: {course['name']} ({course['code']})
---

{course['description']}

- **Period**: {period_display}
- **Content**: {format_content_string(course)}
- **Themes**: {themes_display}
- **Teachers**: {teachers_display}

---
## Content

{topics_list}

---
## Pre-requisites

{prereqs_list}
{prereqs_list_other}
"""
    return md




# --- Main Loop ---
all_courses = astro_courses + additional_courses

print(f"Processing {len(all_courses)} courses...")

for course in all_courses:
    filename = slugify(course['name']) + ".md"
    filepath = os.path.join(output_dir, filename)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(create_markdown(course))

print(f"Successfully created files in '{output_dir}/'.")
