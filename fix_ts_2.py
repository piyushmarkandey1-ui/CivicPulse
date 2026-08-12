import re
import os

def fix_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

replacements = {
    '"teal" | "green"': '"copper" | "success"',
    '"green" | "red" | "amber"': '"success" | "critical" | "warning"',
    '"green" | "red" | "teal" | "amber" | "slate"': '"success" | "critical" | "copper" | "warning" | "neutral"',
    'status === "Resolved" ? "green" : status === "In Progress" ? "teal" : "neutral"': 'status === "Resolved" ? "success" : status === "In Progress" ? "copper" : "neutral"',
    'status === "Resolved" ? "green" : status === "Critical" ? "red" : "amber"': 'status === "Resolved" ? "success" : status === "Critical" ? "critical" : "warning"',
    'urgency === "High" ? "red" : urgency === "Medium" ? "amber" : "teal"': 'urgency === "High" ? "critical" : urgency === "Medium" ? "warning" : "copper"',
    'status === "Resolved" ? "success" : status === "In Progress" ? "teal" : "neutral"': 'status === "Resolved" ? "success" : status === "In Progress" ? "copper" : "neutral"',
}

# Regex replacements for MyReportsGrid.tsx
filepath = r"d:\Hackathons\Geospatial\geospatial-app\app\profile\_components\MyReportsGrid.tsx"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'status === "Resolved"\s*\?\s*"green"\s*:\s*status === "In Progress"\s*\?\s*"teal"', 'status === "Resolved" ? "success" : status === "In Progress" ? "copper"', content)
content = re.sub(r'status === "Resolved"\s*\?\s*"green"\s*:\s*status === "Critical"\s*\?\s*"red"\s*:\s*"amber"', 'status === "Resolved" ? "success" : status === "Critical" ? "critical" : "warning"', content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)


# Regex replacements for IssueSidePanel.tsx
filepath = r"d:\Hackathons\Geospatial\geospatial-app\components\ui\IssueSidePanel.tsx"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()
    
content = re.sub(r'status === "Resolved"\s*\?\s*"green"\s*:\s*status === "Critical"\s*\?\s*"red"\s*:\s*"amber"', 'status === "Resolved" ? "success" : status === "Critical" ? "critical" : "warning"', content)
content = re.sub(r'urgency === "High"\s*\?\s*"red"\s*:\s*urgency === "Medium"\s*\?\s*"amber"\s*:\s*"teal"', 'urgency === "High" ? "critical" : urgency === "Medium" ? "warning" : "copper"', content)
content = content.replace('variant="slate"', 'variant="neutral"')
content = content.replace('variant="green"', 'variant="success"')
content = content.replace('variant="red"', 'variant="critical"')
content = content.replace('variant="amber"', 'variant="warning"')
content = content.replace('variant="teal"', 'variant="copper"')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
    
print("Fixed TS errors part 3")
