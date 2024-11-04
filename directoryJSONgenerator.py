import os
import random

class Node:
    def __init__(self, name, size=None, path=""):
        self.name = name
        self.size = size
        self.path = path
        self.children = []
        self.type = 'directory' if size is None else 'file'

    def to_html(self, level=0):
        indent = ' ' * (level * 4)
        log_indent = f'Indent level {level}: {self.name}'
        print(log_indent)
        if self.type == 'file':
            return f'{indent}<li><a href="{self.path}">{self.name}</a> ({self.size} bytes)</li>\n'
        else:
            children_html = ''.join([child.to_html(level + 1) for child in self.children])
            return f'{indent}<li><span>{self.name}</span>\n{indent}<ul>\n{children_html}{indent}</ul>\n{indent}</li>\n'

def collect_info(path):
    root = Node(os.path.basename(path), path=path)
    stack = [(root, path)]
    total_size = 0
    while stack:
        current_node, current_path = stack.pop()
        if os.path.isdir(current_path):
            current_node.size = 0
            for item in os.listdir(current_path):
                if item.startswith('.'):
                    continue
                item_path = os.path.join(current_path, item)
                if os.path.isdir(item_path):
                    new_node = Node(item, path=item_path)
                    stack.append((new_node, item_path))
                else:
                    size = os.path.getsize(item_path)
                    new_node = Node(item, size=size, path=item_path)
                    current_node.size += size
                    total_size += size
                current_node.children.append(new_node)
        else:
            current_node.size = os.path.getsize(current_path)
            total_size += current_node.size
    return root, total_size

def main(directory):
    root_node, total_size = collect_info(directory)
    total_space = 391680654347
    free_space = total_space - total_size
    random_serial = f"{random.randint(1000, 9999):04X}-{random.randint(1000, 9999):04X}"
    with open('directory_listing.html', 'w') as f:
        f.write('<html>\n<head>\n<title>Directory Listing</title>\n</head>\n<body>\n')
        f.write('<h2>Directory Listing</h2>\n')
        f.write(f'<p>Volume in drive C has no label. Volume Serial Number is {random_serial}</p>\n')
        f.write('<ul>\n')
        f.write(root_node.to_html())
        f.write('</ul>\n')
        f.write(f'<p>{total_size} bytes used, {free_space} bytes free</p>\n')
        f.write('</body>\n</html>\n')
    print("HTML file 'directory_listing.html' generated successfully!")

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 2:
        print("Usage: python script.py <directory>")
        sys.exit(1)
    main(sys.argv[1])
