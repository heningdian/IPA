import re, shutil, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = os.path.join(ROOT, 'node_modules', '@fontsource')
OUT_FONTS = os.path.join(ROOT, 'assets', 'fonts')
OUT_CSS = os.path.join(ROOT, 'assets', 'fonts.css')

os.makedirs(OUT_FONTS, exist_ok=True)

PLAN = [
    {'pkg': 'noto-sans', 'weights': [400, 700], 'subsets': {'latin', 'latin-ext', 'greek'}},
    {'pkg': 'inter', 'weights': [300, 400, 500, 600, 700], 'subsets': {'latin', 'latin-ext'}},
]

block_re = re.compile(
    r"/\*\s*([\w-]+)\s*\*/\s*@font-face\s*\{(.*?)\}",
    re.DOTALL
)

out_blocks = []

for plan in PLAN:
    pkg = plan['pkg']
    for weight in plan['weights']:
        css_path = f"{BASE}/{pkg}/{weight}.css"
        with open(css_path, encoding='utf-8') as f:
            content = f.read()
        for m in block_re.finditer(content):
            label, body = m.group(1), m.group(2)
            # label looks like "noto-sans-latin-ext-400-normal"
            parts = label.rsplit('-', 2)  # [..., weight, style]
            subset = label[len(pkg) + 1: -(len(parts[-2]) + len(parts[-1]) + 2)]
            if subset not in plan['subsets']:
                continue
            # find woff2 file reference
            woff2_match = re.search(r"url\(\./files/([\w.-]+\.woff2)\)", body)
            if not woff2_match:
                continue
            fname = woff2_match.group(1)
            shutil.copy(f"{BASE}/{pkg}/files/{fname}", f"{OUT_FONTS}/{fname}")
            new_body = re.sub(
                r"src:.*?;",
                f"src: url('fonts/{fname}') format('woff2');",
                body, flags=re.DOTALL
            )
            out_blocks.append("@font-face {" + new_body + "}")

with open(OUT_CSS, 'w', encoding='utf-8') as f:
    f.write("/* Self-hosted webfonts (Noto Sans for IPA glyph coverage, Inter for UI text).\n")
    f.write("   Generated from @fontsource packages - see package.json. No external CDN. */\n\n")
    f.write("\n".join(out_blocks))
    f.write("\n")

print("Wrote", len(out_blocks), "font-face rules")
