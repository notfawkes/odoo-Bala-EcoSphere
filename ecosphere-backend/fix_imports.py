import os
import glob

def fix_imports(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    replacements = {
        'from database ': 'from environment.database ',
        'from models.': 'from environment.models.',
        'from schemas.': 'from environment.schemas.',
        'from repositories.': 'from environment.repositories.',
        'from services.': 'from environment.services.',
        'from routers.': 'from environment.routers.',
    }

    new_content = content
    for old, new in replacements.items():
        new_content = new_content.replace(old, new)

    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")

for root, _, files in os.walk('environment'):
    for file in files:
        if file.endswith('.py'):
            fix_imports(os.path.join(root, file))
