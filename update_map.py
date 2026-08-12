import os
import glob

map_dir = r"d:\Hackathons\Geospatial\geospatial-app\app\map\_components"
map_dir2 = r"d:\Hackathons\Geospatial\geospatial-app\components\ui"

replacements = {
    '#4FD1A5': '#D98B52',
    'bg-teal': 'bg-copper',
    'text-teal': 'text-copper',
    'border-teal': 'border-copper',
    'ring-teal': 'ring-copper',
    'variant="teal"': 'variant="copper"',
    'background: "#4FD1A5"': 'background: "#D98B52"',
    'rgba(79,209,165,0.2)': 'rgba(217,139,82,0.2)',
    '#070B14': '#0D0D0C',
    'bg-navy': 'bg-background',
    'rgba(15,23,38,0.95)': 'rgba(33,29,25,0.95)',
    'rgba(15,23,38,0.85)': 'rgba(33,29,25,0.85)',
    'rgba(148,163,184,0.08)': 'rgba(64,57,50,0.4)',
    'rgba(148,163,184,0.12)': 'rgba(64,57,50,0.6)',
    'background: "#0F1726"': 'background: "#191715"',
    'bg-slate-800/80': 'bg-surface/80',
    'border-slate-700': 'border-border',
    'text-amber': 'text-warning',
    'bg-amber': 'bg-warning',
    'bg-red-400': 'bg-danger',
    'bg-danger': 'bg-danger',
    'text-slate-400': 'text-text-muted',
    'text-slate-300': 'text-text-secondary',
    'text-slate-200': 'text-text-primary',
    'text-slate-100': 'text-cream',
    'bg-slate-800': 'bg-surface',
    'hover:bg-slate-800': 'hover:bg-surface-raised',
    'border-slate-600': 'border-border-strong',
    '#0B1220': '#121110', # Navy -> Charcoal
    'hover:bg-teal-light': 'hover:bg-copper-light',
    '#14B8A6': '#D98B52', # Teal hex
    'text-red-400': 'text-danger',
}

def update_dir(directory):
    for file_path in glob.glob(os.path.join(directory, "*.tsx")):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original_content = content

        for old, new in replacements.items():
            content = content.replace(old, new)
            
        # Revert some possible wrong replacements in imports
        content = content.replace('text-warning-500', 'text-amber-500')
            
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)

update_dir(map_dir)
update_dir(map_dir2)
print("Updated map components and UI components")
