
import os
import subprocess
import sys

dirs = [
    'src/components',
    'src/screens',
    'src/data',
    'src/hooks',
    'src/navigation'
]

for d in dirs:
    try:
        os.makedirs(d, exist_ok=True)
        print(f"Created {d}")
    except Exception as e:
        print(f"Error creating {d}: {e}")

print("Directory setup complete.")
