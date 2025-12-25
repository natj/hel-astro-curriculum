import os
import re
import unicodedata
from courseinfo import astro_courses, additional_courses

# Ensure output directory exists
output_dir = "course_files_physics_math"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# --- Helper Functions ---

def parse_themes(theme_str):
    """
    Parses a string like 'Theory 25% / methods 25%'.
    Returns a dictionary. Returns 0 for all if input is None.
    """
    result = {
        'theory': 0,
        'methods': 0,
        'observations': 0,
        'phenomena': 0
    }
    
    if not theme_str or theme_str == "N/A":
        return result
    
    clean_str = theme_str.lower().replace('%', '')
    pattern = r'(theory|methods|observations|phenomena)\s.*?(\d+)'
    matches = re.findall(pattern, clean_str)
    
    for key, value in matches:
        if 'theory' in key: result['theory'] = int(value)
        elif 'method' in key: result['methods'] = int(value)
        elif 'observ' in key: result['observations'] = int(value)
        elif 'phenom' in key: result['phenomena'] = int(value)
        
    return result

def parse_period_info(period_str):
    """
    Parses 'Period III-IV, BSc year 2-3'.
    Returns empty lists if input is None.
    """
    if not period_str or period_str == "N/A":
        return {'periods': [], 'years': []}
        
    roman_map = {'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5}
    periods = set()
    
    # Handle Roman Numeral Ranges
    roman_ranges = re.findall(r'([IV]+)-([IV]+)', period_str)
    for start, end in roman_ranges:
        if start in roman_map and end in roman_map:
            s, e = roman_map[start], roman_map[end]
            periods.update(range(s, e + 1))
            
    # Handle explicit Arabic ranges "1-2"
    p_clean = period_str.replace("Periods", "Period")
    arabic_ranges = re.findall(r'Period.*?(\d)-(\d)', p_clean)
    for start, end in arabic_ranges:
        periods.update(range(int(start), int(end) + 1))
        
    # Handle single Roman tokens if no range found
    if not periods:
        tokens = re.findall(r'\b(I|II|III|IV|V)\b', period_str)
        for t in tokens:
            if not re.search(r'[IV]+-[IV]+', period_str): # Avoid double counting ranges
                periods.add(roman_map[t])

    # --- Parse Years ---
    years = set()
    year_ranges = re.findall(r'year.*?(\d)\s*[-–]\s*(\d)', period_str.lower())
    for start, end in year_ranges:
        years.update(range(int(start), int(end) + 1))
        
    year_or = re.findall(r'year.*?(\d)\s*or\s*(\d)', period_str.lower())
    for y1, y2 in year_or:
        years.add(int(y1))
        years.add(int(y2))
        
    if not years:
        single_years = re.findall(r'year\s*(\d)', period_str.lower())
        for y in single_years:
            years.add(int(y))

    return {
        'periods': sorted(list(periods)),
        'years': sorted(list(years))
    }

def slugify(value):
    value = str(value)
    value = unicodedata.normalize('NFKD', value).encode('ascii', 'ignore').decode('ascii')
    value = re.sub(r'[^\w\s-]', '', value.lower())
    return re.sub(r'[-\s]+', '-', value).strip('-_')


def create_markdown(course):
    # Parse Metadata
    themes_data = parse_themes(course['themes'])
    period_data = parse_period_info(course['period'])
    
    # Sanitize and format teachers
    teachers = ", ".join([f"[[{t}]]" for t in course['teachers']])
    if not teachers:
        teachers = "None listed"
    
    # Format Prerequisites
    prereqs = "\n".join([f"- {p}" for p in course['prereqs']])
    if not prereqs:
        prereqs = "- None listed"

    # Format Content
    content = "\n".join([f"- {topic}" for topic in course['topics']])
    if not content:
        content = "- No content listed"
    
    period_display = course['period'] if course['period'] else "Not specified"
    
    md = f"""---
title: {course['name']} ({course['code']})
period: {period_data['periods']}
years: {period_data['years']}
theory: {themes_data.get('theory', 0)}
methods: {themes_data.get('methods', 0)}
observations: {themes_data.get('observations', 0)}
phenomena: {themes_data.get('phenomena', 0)}
---

Course covering {course['eng_name']}.

- **Period**: {period_display}
- **Content**: {course['content_meta']}
- **Themes**: {course['themes'] if course['themes'] else 'Not specified'}
- **Teachers**: {teachers}

---
## Content

{content}

---
## Pre-requisites

{prereqs}
"""
    return md


all_courses = [astro_courses, additional_courses]

# Generate Files
for course in additional_courses:
    filename = slugify(course['name']) + ".md"
    filepath = os.path.join(output_dir, filename)
    content = create_markdown(course)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Successfully created {len(additional_courses)} course files in '{output_dir}/'.")
