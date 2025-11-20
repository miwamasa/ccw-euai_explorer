#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
EU AI Act JSON更新スクリプト
euact/*.txtファイルからarticle_text、summary、related_recitalsを抽出してJSONを更新
"""

import json
import re
from pathlib import Path

def extract_article_info(txt_path):
    """txtファイルから情報を抽出"""
    with open(txt_path, 'r', encoding='utf-8') as f:
        content = f.read()

    lines = content.split('\n')

    # Article番号とタイトルを抽出
    article_line = lines[0] if lines else ""
    match = re.match(r'Article (\d+):\s*(.+)', article_line)
    if not match:
        return None

    article_num = match.group(1)
    title_en = match.group(2).strip()

    # Summaryを抽出（最大3行に要約）
    summary_start = None
    summary_lines = []
    for i, line in enumerate(lines):
        if line.strip() == "Summary":
            summary_start = i + 1
            break

    if summary_start:
        # Summaryセクションを取得（次の空行または番号付きリストまで）
        for i in range(summary_start, len(lines)):
            line = lines[i].strip()
            if not line or re.match(r'^\d+\.', line):
                break
            if line:
                summary_lines.append(line)

    summary_en = ' '.join(summary_lines)

    # Summaryを3行程度に要約（文で分割して最初の2-3文を取る）
    sentences = re.split(r'(?<=[.!?])\s+', summary_en)
    summary_en_short = ' '.join(sentences[:2]) if len(sentences) >= 2 else summary_en
    if len(summary_en_short) > 300:
        summary_en_short = summary_en_short[:297] + "..."

    # Relevant recitalsを抽出
    recitals = []
    for i, line in enumerate(lines):
        if line.strip() == "Relevant recitals":
            recital_line = lines[i + 1] if i + 1 < len(lines) else ""
            # "Recital 1 Recital 2" 形式を解析
            recital_matches = re.findall(r'Recital (\d+)', recital_line)
            recitals = [f"前文{num}" for num in recital_matches]
            break

    # Article本文の最初の段落を取得（3行要約）
    article_text_lines = []
    for i, line in enumerate(lines):
        if re.match(r'^\d+\.', line.strip()):
            # 番号付きリストの最初の項目から内容を取得
            # "1." の後ろのテキストを取得
            first_line = line.strip()
            # "1." の後のテキストを抽出
            text_after_number = re.sub(r'^\d+\.\s*', '', first_line)
            if text_after_number:
                article_text_lines.append(text_after_number)

            # 続きの行を取得（次の番号付き項目または空行まで）
            for j in range(i + 1, min(i + 10, len(lines))):
                text = lines[j].strip()
                # 次の番号項目または空行で終了
                if not text or re.match(r'^\d+\.', text) or re.match(r'^\([a-z]\)', text):
                    break
                article_text_lines.append(text)
                if len(' '.join(article_text_lines)) > 250:
                    break
            break

    article_text_en = ' '.join(article_text_lines)
    # 最大300文字、最初の1-2文に限定
    if article_text_en:
        sentences = re.split(r'(?<=[.!?])\s+', article_text_en)
        article_text_en = ' '.join(sentences[:2]) if len(sentences) >= 2 else sentences[0] if sentences else article_text_en
        if len(article_text_en) > 300:
            article_text_en = article_text_en[:297] + "..."
    else:
        # フォールバック: Summaryの内容を使用
        article_text_en = summary_en_short

    return {
        'article_number': f"{article_num}条",
        'article_num': article_num,
        'title_en': title_en,
        'summary_en': summary_en_short,
        'article_text_en': article_text_en,
        'recitals': recitals
    }

def update_json_with_txt_data(json_path, txt_dir, output_path):
    """JSONファイルをtxtファイルのデータで更新"""

    # JSONを読み込み
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # euact/*.txtファイルを解析
    txt_files = Path(txt_dir).glob('article*.txt')
    txt_data = {}

    for txt_file in txt_files:
        info = extract_article_info(txt_file)
        if info:
            txt_data[info['article_number']] = info
            print(f"Extracted: {info['article_number']} - {info['title_en']}")

    # JSONの各条文を更新
    updated_count = 0
    for article in data['articles']:
        article_num = article['article_number']

        if article_num in txt_data:
            txt_info = txt_data[article_num]

            # 1. article_textを更新（英語部分を3行要約に）
            if 'article_text' not in article:
                article['article_text'] = {'ja': '', 'en': ''}

            # 既存の日本語を保持、英語を更新
            if txt_info['article_text_en']:
                article['article_text']['en'] = txt_info['article_text_en']

            # 2. summaryフィールドを追加
            article['summary'] = {
                'ja': '',  # 日本語は後で手動追加または機械翻訳
                'en': txt_info['summary_en']
            }

            # 3. related_recitalsを更新
            existing_recitals = {r['recital_number'] for r in article.get('related_recitals', [])}

            for recital_num in txt_info['recitals']:
                if recital_num not in existing_recitals:
                    # 新しい前文を追加
                    article['related_recitals'].append({
                        'recital_number': recital_num,
                        'summary_ja': f'{recital_num}の内容（要約）',
                        'summary_en': f'Content of {recital_num}',
                        'relevance': f'{article_num}に関連'
                    })

            updated_count += 1
            print(f"Updated: {article_num}")

    # 結果を保存
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\n✅ 更新完了: {updated_count}条を更新しました")
    print(f"📄 出力ファイル: {output_path}")

if __name__ == '__main__':
    json_path = 'data/eu_ai_act_articles_2025-11-20 (7).json'
    txt_dir = 'euact'
    output_path = 'data/eu_ai_act_articles_updated.json'

    update_json_with_txt_data(json_path, txt_dir, output_path)
