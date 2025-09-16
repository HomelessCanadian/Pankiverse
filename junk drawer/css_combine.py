import os
import re
import sys
from collections import defaultdict
import webcolors

def parse_css(css_text):
    rules = defaultdict(dict)
    blocks = re.findall(r'([^{]+)\{([^}]+)\}', css_text, re.MULTILINE)
    for selector, props in blocks:
        selector = selector.strip()
        for prop in props.strip().split(';'):
            if ':' in prop:
                key, value = prop.split(':', 1)
                rules[selector][key.strip()] = value.strip()
    return rules

def load_css(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()

def describe_color(value):
    try:
        rgb = webcolors.name_to_rgb(value)
        return f"{value} (named color, RGB: {rgb})"
    except ValueError:
        try:
            rgb = webcolors.hex_to_rgb(value)
            return f"{value} (hex, RGB: {rgb})"
        except ValueError:
            return f"{value} (unrecognized color format)"

def get_closest_color_name(requested_rgb):
    min_distance = float('inf')
    closest_name = None
    for hex_code, name in webcolors.CSS3_HEX_TO_NAMES.items():
        r_c, g_c, b_c = webcolors.hex_to_rgb(hex_code)
        distance = (r_c - requested_rgb[0])**2 + (g_c - requested_rgb[1])**2 + (b_c - requested_rgb[2])**2
        if distance < min_distance:
            min_distance = distance
            closest_name = name
    return closest_name



def merge_css_interactive(folder_path):
    merged = defaultdict(dict)
    sources = defaultdict(lambda: defaultdict(dict))

    for filename in os.listdir(folder_path):
        if filename.endswith('.css'):
            full_path = os.path.join(folder_path, filename)
            css_text = load_css(full_path)
            rules = parse_css(css_text)
            for selector, props in rules.items():
                for prop, value in props.items():
                    sources[selector][prop][filename] = value

    for selector, props in sources.items():
        for prop, versions in props.items():
            unique_values = set(versions.values())
            if len(unique_values) == 1:
                # All values are the same—just pick one silently
                merged[selector][prop] = unique_values.pop()
            else:
                print(f"\n⚠️ Conflict for `{selector}` → `{prop}`:")
                for i, (file, value) in enumerate(versions.items(), 1):
                    desc = describe_color(value) if 'color' in prop else value
                    print(f"  [{i}] {value} from {file} → {desc}")
                choice = input("Select version to keep (number): ")
                try:
                    idx = int(choice) - 1
                    selected_file = list(versions.keys())[idx]
                    merged[selector][prop] = versions[selected_file]
                except (ValueError, IndexError):
                    print("❌ Invalid choice. Skipping this property.")


    return merged

def write_merged_css(merged, output_file):
    with open(output_file, 'w', encoding='utf-8') as f:
        for selector, props in merged.items():
            f.write(f'{selector} {{\n')
            for prop, value in props.items():
                f.write(f'  {prop}: {value};\n')
            f.write('}\n\n')

# Entry point
if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python combine_css.py <folder_path>')
        sys.exit(1)

    folder_path = sys.argv[1]
    if not os.path.isdir(folder_path):
        print(f'❌ Folder not found: {folder_path}')
        sys.exit(1)

    merged = merge_css_interactive(folder_path)
    write_merged_css(merged, 'master.css')
    print('\n✅ CSS merged successfully into combined.css')
