import os

files_to_fix = [
    r"d:\Hackathons\Geospatial\geospatial-app\app\_components\LandingPage.tsx",
    r"d:\Hackathons\Geospatial\geospatial-app\app\gov-dashboard\_components\BeforeAfterSlider.tsx",
    r"d:\Hackathons\Geospatial\geospatial-app\app\gov-dashboard\_components\WardPerformanceTable.tsx",
    r"d:\Hackathons\Geospatial\geospatial-app\app\map\_components\ReportModal.tsx",
    r"d:\Hackathons\Geospatial\geospatial-app\app\profile\_components\MyReportsGrid.tsx",
    r"d:\Hackathons\Geospatial\geospatial-app\app\profile\_components\ProfileHeader.tsx",
    r"d:\Hackathons\Geospatial\geospatial-app\components\ui\Badge.tsx",
    r"d:\Hackathons\Geospatial\geospatial-app\components\ui\IssueSidePanel.tsx",
]

for filepath in files_to_fix:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Re-map default to neutral
    content = content.replace('variant="default"', 'variant="neutral"')
    content = content.replace('color:   "default"', 'color:   "neutral"')
    content = content.replace('variant="slate"', 'variant="neutral"')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Fixed TS errors part 2")
