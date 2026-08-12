import os

filepath = r"d:\Hackathons\Geospatial\geospatial-app\components\ui\Footer.tsx"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    'bg-white': 'bg-background',
    'border-gray-border': 'border-white/[0.06]',
    'text-blue': 'text-copper',
    'text-gray-dark': 'text-white',
    'gradient-text': 'text-copper',
    'text-gray-mid': 'text-text-muted',
    'hover:text-blue': 'hover:text-copper',
    'hover:bg-blue-muted': 'hover:bg-copper/10',
    'hover:text-gray-dark': 'hover:text-white'
}

for old, new in replacements.items():
    content = content.replace(old, new)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Footer styling updated to Charcoal/Copper/Cream")
