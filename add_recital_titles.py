#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Add recital titles from euact/recitals.txt to JSON
"""

import json
import re
from datetime import datetime

def parse_recitals(txt_path):
    """Parse recitals.txt to create mapping of recital number to title"""
    recital_map = {}

    with open(txt_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    i = 0
    while i < len(lines):
        line = lines[i].strip()

        # Look for recital number pattern: (1), (2), etc.
        match = re.match(r'^\((\d+)\)$', line)
        if match:
            recital_num = match.group(1)
            # Next line should be the title
            if i + 1 < len(lines):
                title = lines[i + 1].strip()
                if title:  # Make sure title is not empty
                    recital_map[recital_num] = title
                    i += 2  # Skip to next recital
                    continue
        i += 1

    print(f"✅ Parsed {len(recital_map)} recital titles")
    return recital_map

def update_json_with_recital_titles(json_path, recital_map, output_path):
    """Update JSON with recital titles"""

    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    updated_count = 0

    # Update each article
    for article in data['articles']:
        if 'related_recitals' in article and article['related_recitals']:
            for recital in article['related_recitals']:
                # Extract recital number from "前文X" format
                recital_num_match = re.search(r'前文(\d+)', recital['recital_number'])
                if recital_num_match:
                    recital_num = recital_num_match.group(1)

                    # Add title if found in map
                    if recital_num in recital_map:
                        recital['title_en'] = recital_map[recital_num]
                        recital['title_ja'] = ''  # Empty for manual translation

                        # Update summary_en to use the title
                        recital['summary_en'] = recital_map[recital_num]
                        recital['summary_ja'] = ''  # Empty for manual translation

                        updated_count += 1

    # Update metadata
    data['updated_at'] = datetime.now().isoformat()

    # Save updated JSON
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"✅ Updated {updated_count} recital entries")
    print(f"📄 Output: {output_path}")

    return data

def main():
    # Parse recitals
    recital_map = parse_recitals('euact/recitals.txt')

    # Update JSON
    input_json = 'data/eu_ai_act_articles_complete.json'
    output_json = 'data/eu_ai_act_articles_complete.json'

    update_json_with_recital_titles(input_json, recital_map, output_json)

    # Also update the updated.json
    input_json2 = 'data/eu_ai_act_articles_updated.json'
    output_json2 = 'data/eu_ai_act_articles_updated.json'
    update_json_with_recital_titles(input_json2, recital_map, output_json2)

    print("\n✅ 完了: 前文のタイトルをJSONに追加しました")

if __name__ == '__main__':
    main()
