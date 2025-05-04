#!/bin/bash

# Output file
output_file="all_code_combined.txt"
> "$output_file"  # Empty the file if it already exists

# Function to check if a file is a code file (exclude binaries and large blobs)
is_binary() {
    file --mime-encoding "$1" | grep -q "binary"
}


# Iterate through all files in the current directory and subdirectories
find . \
  -type f \
  ! -path "./$output_file" \
  ! -path "*/.venv/*" \
  ! -path "*/node_modules/*" \
 | while read -r file; do
    if ! is_binary "$file"; then
        echo "----- FILE: $file -----" >> "$output_file"
        cat "$file" >> "$output_file"
        echo -e "\n\n" >> "$output_file"
    fi
done

echo "✅ Code concatenated into: $output_file"