#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Translate English summaries and recital titles to Japanese
"""

import json
import re
from datetime import datetime

# AI Act専門用語の翻訳辞書
TRANSLATION_DICT = {
    # 基本用語
    'AI': 'AI',
    'artificial intelligence': '人工知能',
    'AI system': 'AIシステム',
    'AI systems': 'AIシステム',
    'AI model': 'AIモデル',
    'AI models': 'AIモデル',
    'AI Office': 'AI局',
    'AI Act': 'AI法',
    'AI Regulation': 'AI規制',
    'AI value chain': 'AIバリューチェーン',
    'AI content': 'AIコンテンツ',
    'AI solutions': 'AIソリューション',

    # リスク関連
    'high-risk': '高リスク',
    'high-risk AI system': '高リスクAIシステム',
    'high-risk AI systems': '高リスクAIシステム',
    'systemic risk': 'システミックリスク',
    'systemic risks': 'システミックリスク',
    'risk management': 'リスク管理',
    'risk management system': 'リスク管理システム',
    'risk assessment': 'リスク評価',
    'risk minimisation': 'リスク最小化',
    'risk-based approach': 'リスクベースアプローチ',

    # 汎用AI関連
    'general-purpose AI': '汎用AI',
    'general-purpose AI model': '汎用AIモデル',
    'general-purpose AI models': '汎用AIモデル',
    'GPAI': '汎用AI',

    # 主体
    'provider': '提供者',
    'providers': '提供者',
    'deployer': '配備者',
    'deployers': '配備者',
    'operator': '事業者',
    'operators': '事業者',
    'distributor': '流通業者',
    'distributors': '流通業者',
    'importer': '輸入業者',
    'importers': '輸入業者',
    'user': '利用者',
    'users': '利用者',
    'natural person': '自然人',
    'natural persons': '自然人',
    'legal person': '法人',
    'legal persons': '法人',

    # 義務・権利
    'obligation': '義務',
    'obligations': '義務',
    'requirement': '要件',
    'requirements': '要件',
    'responsibility': '責任',
    'responsibilities': '責任',
    'fundamental right': '基本的権利',
    'fundamental rights': '基本的権利',
    'protection of personal data': '個人データの保護',
    'personal data': '個人データ',

    # 評価・適合性
    'conformity assessment': '適合性評価',
    'conformity': '適合性',
    'compliance': 'コンプライアンス',
    'quality management': '品質管理',
    'quality management system': '品質管理システム',

    # 透明性・文書化
    'transparency': '透明性',
    'transparency obligation': '透明性義務',
    'transparency obligations': '透明性義務',
    'documentation': '文書化',
    'technical documentation': '技術文書',
    'record-keeping': '記録保持',

    # バイオメトリクス
    'biometric': 'バイオメトリック',
    'biometric data': 'バイオメトリックデータ',
    'biometric identification': 'バイオメトリック識別',
    'biometric categorisation': 'バイオメトリック分類',
    'biometric categorization': 'バイオメトリック分類',
    'remote biometric identification': '遠隔バイオメトリック識別',
    'facial recognition': '顔認識',
    'emotion recognition': '感情認識',

    # 禁止・制限
    'prohibited': '禁止',
    'prohibited practice': '禁止される慣行',
    'prohibited practices': '禁止される慣行',
    'prohibition': '禁止',
    'ban': '禁止',
    'banning': '禁止',

    # 規制・ガバナンス
    'regulation': '規制',
    'Board': '理事会',
    'Commission': '欧州委員会',
    'European Commission': '欧州委員会',
    'EU Commission': '欧州委員会',
    'Member State': '加盟国',
    'Member States': '加盟国',
    'Union': '欧州連合',
    'European Union': '欧州連合',
    'Union law': '欧州連合法',
    'EU law': 'EU法',
    'EU database': 'EUデータベース',

    # コード・標準
    'code of practice': '実践規範',
    'codes of practice': '実践規範',
    'code of conduct': '行動規範',
    'codes of conduct': '行動規範',
    'harmonised standard': '調和規格',
    'harmonised standards': '調和規格',
    'harmonized standard': '調和規格',
    'harmonized standards': '調和規格',

    # テスト・監視
    'testing': 'テスト',
    'monitoring': 'モニタリング',
    'market surveillance': '市場監視',
    'post-market monitoring': '市販後モニタリング',
    'sandbox': 'サンドボックス',
    'regulatory sandbox': '規制サンドボックス',
    'AI regulatory sandbox': 'AI規制サンドボックス',
    'regulatory sandboxes': '規制サンドボックス',

    # 教育・訓練
    'training': 'トレーニング',
    'training data': 'トレーニングデータ',
    'AI literacy': 'AIリテラシー',
    'education': '教育',

    # 人的監視
    'human oversight': '人的監視',
    'human-centric': '人間中心',
    'human-centric technology': '人間中心の技術',

    # その他技術用語
    'cybersecurity': 'サイバーセキュリティ',
    'safety': '安全性',
    'security': 'セキュリティ',
    'accuracy': '精度',
    'robustness': '堅牢性',
    'resilience': 'レジリエンス',
    'performance': 'パフォーマンス',
    'lifecycle': 'ライフサイクル',
    'deployment': '配備',
    'implementation': '実装',
    'infrastructure': 'インフラストラクチャ',
    'critical infrastructure': '重要インフラ',

    # 法執行・司法
    'law enforcement': '法執行',
    'administration of justice': '司法運営',
    'migration': '移民',
    'asylum': '難民',
    'creditworthiness': '信用力',
    'employment': '雇用',
    'human resources': '人事',
    'social scoring': '社会的スコアリング',

    # アセスメント
    'impact assessment': '影響評価',
    'fundamental rights impact assessment': '基本的権利影響評価',
    'conformity assessment': '適合性評価',

    # その他
    'protected content': '保護されたコンテンツ',
    'open-source': 'オープンソース',
    'open-source license': 'オープンソースライセンス',
    'intermediary service': '仲介サービス',
    'intermediary services': '仲介サービス',
    'platform': 'プラットフォーム',
    'platforms': 'プラットフォーム',
    'search engine': '検索エンジン',
    'search engines': '検索エンジン',
    'Digital Services Act': 'デジタルサービス法',
    'whistleblower': '内部告発者',
    'whistleblowers': '内部告発者',
    'SME': '中小企業',
    'SMEs': '中小企業',
    'microenterprise': '零細企業',
    'microenterprises': '零細企業',
    'innovation': 'イノベーション',
    'real-time': 'リアルタイム',
    'real world': '実世界',
    'real-world condition': '実世界条件',
    'real world conditions': '実世界条件',

    # 動詞・形容詞
    'ensure': '確保する',
    'establish': '確立する',
    'implement': '実装する',
    'require': '要求する',
    'requires': '要求する',
    'mandatory': '必須の',
    'voluntary': '任意の',
    'appropriate': '適切な',
    'adequate': '適切な',
    'necessary': '必要な',
    'effective': '効果的な',
}

def translate_text(text_en):
    """英語テキストを日本語に翻訳（主要な専門用語のみ）"""
    if not text_en:
        return ''

    # 既に日本語が含まれている場合はそのまま返す
    if re.search(r'[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]', text_en):
        return text_en

    result = text_en

    # 翻訳辞書を適用（長い表現から順に）
    sorted_terms = sorted(TRANSLATION_DICT.items(), key=lambda x: len(x[0]), reverse=True)

    for en_term, ja_term in sorted_terms:
        # 大文字小文字を区別しない置換
        result = re.sub(r'\b' + re.escape(en_term) + r'\b', ja_term, result, flags=re.IGNORECASE)

    # 冠詞を削除
    result = re.sub(r'\bthe\b\s+', '', result, flags=re.IGNORECASE)
    result = re.sub(r'\ba\b\s+', '', result, flags=re.IGNORECASE)
    result = re.sub(r'\ban\b\s+', '', result, flags=re.IGNORECASE)

    # 複数スペースを1つに
    result = re.sub(r'\s+', ' ', result)
    result = result.strip()

    return result

def translate_summaries_and_recitals(json_path, output_path):
    """JSONファイルのsummaryと前文タイトルを日本語に翻訳"""

    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    article_count = 0
    recital_count = 0

    # 各条文を処理
    for article in data['articles']:
        # Article summaryを翻訳（強制的に上書き）
        if 'summary' in article and article['summary'].get('en'):
            article['summary']['ja'] = translate_text(article['summary']['en'])
            article_count += 1

        # Related recitalsのタイトルを翻訳（強制的に上書き）
        if 'related_recitals' in article:
            for recital in article['related_recitals']:
                # title_enを翻訳
                if recital.get('title_en'):
                    recital['title_ja'] = translate_text(recital['title_en'])
                    recital_count += 1

                # summary_enを翻訳
                if recital.get('summary_en'):
                    recital['summary_ja'] = translate_text(recital['summary_en'])

    # 更新日時を記録
    data['updated_at'] = datetime.now().isoformat()

    # 保存
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"✅ 翻訳完了:")
    print(f"  - Article summaries: {article_count}件")
    print(f"  - Recital titles: {recital_count}件")
    print(f"📄 出力: {output_path}")

def main():
    # complete.jsonを翻訳
    print("🔄 complete.json を翻訳中...")
    translate_summaries_and_recitals(
        'data/eu_ai_act_articles_complete.json',
        'data/eu_ai_act_articles_complete.json'
    )

    # updated.jsonを翻訳
    print("\n🔄 updated.json を翻訳中...")
    translate_summaries_and_recitals(
        'data/eu_ai_act_articles_updated.json',
        'data/eu_ai_act_articles_updated.json'
    )

    print("\n✅ すべての翻訳が完了しました")

if __name__ == '__main__':
    main()
