import re

def update_landing_page_part2(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Recognition wall
    content = content.replace('color:   "amber"', 'color:   "warning"')
    content = content.replace('color:   "teal"', 'color:   "success"')
    content = content.replace('card.color === "amber" ? "text-warning" : "text-teal"', 'card.color === "warning" ? "text-warning" : "text-success"')
    content = content.replace('rgba(20,184,166,0.04)', 'rgba(217,139,82,0.04)')
    
    # CTA Section
    content = content.replace('background: "#0F1726"', 'background: "#191715"')
    content = content.replace('rgba(79,209,165,0.15)', 'rgba(217,139,82,0.15)')
    content = content.replace('via-teal/50', 'via-copper/50')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Updated part 2 successfully")

update_landing_page_part2(r"d:\Hackathons\Geospatial\geospatial-app\app\_components\LandingPage.tsx")
