import re
import random
import os

IMG_MAP = {
    "Pothole": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
    "Water Clogging": "https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&q=80&w=800",
    "Crack": "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800",
    "Road Damage": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
    "Other": "https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&q=80&w=800"
}

def update_file(filepath):
    if not os.path.exists(filepath):
        print(f"Skipping {filepath}, does not exist.")
        return
        
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # If this is mockData.ts or mockProfileData.ts, inject the dynamic date helper at the top
    if 'getPastDate' not in content and 'export const MOCK_ISSUES' in content:
        helper = """
// Helper to generate realistic recent dates
const now = Date.now();
const getPastDate = (daysAgo: number, hoursAgo: number) => {
  return new Date(now - (daysAgo * 24 * 60 * 60 * 1000) - (hoursAgo * 60 * 60 * 1000)).toISOString();
};
"""
        content = content.replace("export const MOCK_ISSUES", helper + "\nexport const MOCK_ISSUES")
    elif 'getPastDate' not in content and 'export const MY_REPORTS' in content:
        helper = """
// Helper to generate realistic recent dates
const now = Date.now();
const getPastDate = (daysAgo: number, hoursAgo: number) => {
  return new Date(now - (daysAgo * 24 * 60 * 60 * 1000) - (hoursAgo * 60 * 60 * 1000)).toISOString();
};
"""
        content = content.replace("export const MY_REPORTS", helper + "\nexport const MY_REPORTS")

    # Match block of issue to find category
    def replacer(match):
        block = match.group(0)
        
        # Determine category
        cat_match = re.search(r'category:\s*"([^"]+)"', block)
        cat = cat_match.group(1) if cat_match else "Other"
        img = IMG_MAP.get(cat, IMG_MAP["Other"])

        # Generate a random past time (e.g. 0-3 days, 0-23 hours ago)
        # Or we can parse the status to make it logical.
        # "In Progress" -> maybe 1 day ago.
        # "critical" -> maybe 2 days ago.
        days = random.randint(0, 3)
        hours = random.randint(1, 23)

        # Replace reportedAt with getPastDate(...)
        block = re.sub(r'reportedAt:\s*"[^"]+"', f'reportedAt: getPastDate({days}, {hours})', block)
        
        # Replace photoSeed: xx with photoUrl: "..."
        block = re.sub(r'photoSeed:\s*\d+,?', f'photoUrl: "{img}",', block)

        return block

    # We can match everything from '{' to '}' if it has 'id:' inside the MOCK_ISSUES / MY_REPORTS arrays.
    new_content = re.sub(r'\{[^{}]*id:\s*"[^"]+"[^{}]*\}', replacer, content)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)
    
    print(f"Updated {filepath}")

update_file("app/map/_components/mockData.ts")
update_file("app/profile/_components/mockProfileData.ts")
