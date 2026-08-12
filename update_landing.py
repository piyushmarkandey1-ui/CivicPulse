import re

def update_landing_page(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # MapIllustration Map Card
    content = content.replace('background: "#0B1220"', 'background: "#121110"')
    # MapIllustration radar sweep
    content = content.replace('rgba(79,209,165,0.04)', 'rgba(217,139,82,0.04)')
    # MapIllustration SVG defs glow
    content = content.replace('stopColor="#4FD1A5"', 'stopColor="#D98B52"')
    content = content.replace('stopColor="#070B14"', 'stopColor="#0D0D0C"')
    # MapIllustration City blocks
    content = content.replace('fill="#0F1726"', 'fill="#191715"')
    # MapIllustration Water block
    content = content.replace('fill="#0B1A2E"', 'fill="#121110"')
    # MapIllustration Road grid lines
    content = content.replace('stroke="#1e3a5f"', 'stroke="#302C28"')
    # MapIllustration Animated road
    content = content.replace('stroke="#4FD1A5" strokeWidth={1}', 'stroke="#D98B52" strokeWidth={1}')
    # MapIllustration Connection lines
    content = content.replace('stroke="#14B8A6"', 'stroke="#A49D95"')
    
    # PulsingPins colors
    content = content.replace('color="#F05252" glowColor="#F05252"', 'color="#D85C52" glowColor="#D85C52"')
    content = content.replace('color="#F2B84B" glowColor="#F2B84B"', 'color="#D3A34A" glowColor="#D3A34A"')
    content = content.replace('color="#4FD1A5" glowColor="#4FD1A5"', 'color="#829C76" glowColor="#829C76"')
    
    # Legend
    content = content.replace('color: "bg-red-400"', 'color: "bg-danger"')
    content = content.replace('color: "bg-amber"', 'color: "bg-warning"')
    content = content.replace('color: "bg-teal"', 'color: "bg-success"')
    
    # Badges variant
    content = content.replace('variant="teal"', 'variant="copper"')
    
    # Status popup
    content = content.replace('background: "rgba(15,23,38,0.9)"', 'background: "rgba(33,29,25,0.9)"')
    content = content.replace('border: "1px solid rgba(148,163,184,0.10)"', 'border: "1px solid rgba(64,57,50,0.6)"')
    
    # HeroSection
    content = content.replace('rgba(20,184,166,0.08)', 'rgba(217,139,82,0.08)')
    content = content.replace('className="relative inline-block text-teal"', 'className="relative inline-block text-copper"')
    content = content.replace('className="text-caption text-slate-600"', 'className="text-caption text-text-subtle"')
    content = content.replace('bg-teal/60', 'bg-copper/60')
    
    # Icons inside HOW_STEPS
    content = content.replace('stroke="#4FD1A5"', 'stroke="#D98B52"')
    content = content.replace('fill="#4FD1A5"', 'fill="#D98B52"')
    content = content.replace('fill="rgba(79,209,165,0.15)"', 'fill="rgba(217, 139, 82, 0.15)"')
    content = content.replace('fill="rgba(79,209,165,0.1)"', 'fill="rgba(217, 139, 82, 0.1)"')
    
    # HowItWorksSection Background accent
    content = content.replace('rgba(245,158,11,0.05)', 'rgba(217,139,82,0.05)')
    content = content.replace('className="text-caption text-teal mb-3"', 'className="text-caption text-copper mb-3"')
    content = content.replace('className="text-teal"', 'className="text-copper"')
    
    # Connectors
    content = content.replace('stroke="rgba(20,184,166,0.4)"', 'stroke="rgba(217, 139, 82, 0.4)"')
    content = content.replace('stroke="rgba(79,209,165,0.4)"', 'stroke="rgba(217, 139, 82, 0.4)"')
    
    content = content.replace('group-hover:text-teal-light', 'group-hover:text-copper-light')
    content = content.replace('rgba(79,209,165,0.5)', 'rgba(217,139,82,0.5)')
    
    # StatsSection
    content = content.replace('bg-teal', 'bg-copper')
    content = content.replace('rgba(79,209,165,0.06)', 'rgba(217,139,82,0.06)')
    
    # LeaderboardSection
    content = content.replace('text-amber', 'text-copper')
    content = content.replace('glow="teal"', 'glow="copper"')
    # Ranks Emojis
    content = content.replace('i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`', '`#${i + 1}`')
    content = content.replace('ward.trend.startsWith("+") ? "text-teal" : "text-danger"', 'ward.trend.startsWith("+") ? "text-success" : "text-danger"')
    content = content.replace('background: "#4FD1A5"', 'background: "#D98B52"')
    content = content.replace('text-teal-dark', 'text-copper')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Updated successfully")

update_landing_page(r"d:\Hackathons\Geospatial\geospatial-app\app\_components\LandingPage.tsx")
