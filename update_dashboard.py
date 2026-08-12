import os
import glob

dashboard_dir = r"d:\Hackathons\Geospatial\geospatial-app\app\gov-dashboard\_components"

replacements = {
    'background: "#0B1220"': 'background: "#121110"',
    'rgba(79,209,165,0.10)': 'rgba(217,139,82,0.10)',
    'rgba(79,209,165,0.18)': 'rgba(217,139,82,0.18)',
    '#4FD1A5': '#D98B52',
    '#14B8A6': '#D98B52', # For charts mainly, wait I will replace chart specific colors manually later
    'rgba(79,209,165,0.15)': 'rgba(217,139,82,0.15)',
    'rgba(79,209,165,0.07)': 'rgba(217,139,82,0.07)',
    'rgba(79,209,165,0.12)': 'rgba(217,139,82,0.12)',
    'rgba(79,209,165,0.05)': 'rgba(217,139,82,0.05)',
    '#0B1120': '#191715',
    '#F59E0B': '#D3A34A',
    '#ef4444': '#D85C52',
    '#dc2626': '#D85C52',
    '#2563eb': '#D3A34A',
    'bg-teal': 'bg-copper',
    'text-teal': 'text-copper',
    'text-amber': 'text-copper', # Or text-warning, let's keep it simple
    'bg-amber': 'bg-warning',
    'bg-red-400': 'bg-danger',
    'bg-blue-500': 'bg-warning',
    'variant="teal"': 'variant="copper"',
    'variant="amber"': 'variant="warning"',
    'background: "#0F1726"': 'background: "#191715"',
    'rgba(15,23,38,0.9)': 'rgba(33,29,25,0.9)',
    'border: "1px solid rgba(148,163,184,0.12)"': 'border: "1px solid rgba(64,57,50,0.6)"'
}

for file_path in glob.glob(os.path.join(dashboard_dir, "*.tsx")):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    for old, new in replacements.items():
        content = content.replace(old, new)

    # Some specific fixes
    content = content.replace("cell-${index}` fill={entry.rate > 80 ? '#D98B52' : entry.rate > 60 ? '#D3A34A' : '#D85C52'}", 
                              "cell-${index}` fill={entry.rate > 80 ? '#829C76' : entry.rate > 60 ? '#D3A34A' : '#D85C52'}")

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updated dashboard components")
