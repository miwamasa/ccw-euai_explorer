# 欧州AI法 全条文データ (JSON)

## 📄 ファイル情報

- **ファイル名**: `eu_ai_act_articles_complete.json`
- **ファイルサイズ**: 79.8 KB
- **作成日**: 2025年11月4日
- **スキーマバージョン**: 1.0
- **対象範囲**: P23～P70（３章：「欧州AI法」の詳細）

## 📊 データ統計

### 基本情報
- **総条文数**: 23条
- **総要件数**: 61件
- **総スライド数**: 41ページ
- **平均要件数/条文**: 2.7件

### カテゴリ別分布

| カテゴリ | 条文数 |
|---------|--------|
| 提供者の義務 (obligation_provider) | 8条 |
| 汎用AI (gpai) | 3条 |
| 範囲 (scope) | 2条 |
| 透明性 (transparency) | 2条 |
| 定義 (definition) | 1条 |
| 禁止 (prohibition) | 1条 |
| 分類 (classification) | 1条 |
| 品質管理 (quality_management) | 1条 |
| 配備者の義務 (obligation_deployer) | 1条 |
| 適合性評価 (conformity_assessment) | 1条 |
| テスト (testing) | 1条 |
| モニタリング (monitoring) | 1条 |

### リスクレベル別分布

| リスクレベル | 条文数 |
|------------|--------|
| 高リスク (high-risk) | 14条 |
| 一般 (general) | 4条 |
| システミックリスクGPAI (gpai_systemic) | 2条 |
| 禁止 (prohibited) | 1条 |
| 限定的リスク (limited-risk) | 1条 |
| 汎用AI (gpai) | 1条 |

### 関連情報統計
- **関連条文の参照**: 36件
- **関連前文の参照**: 10件
- **関連付属書の参照**: 6件

## 📋 収録条文リスト

### 基本規定
1. **1条** - 目的と範囲 (Article 1)
2. **2条** - 適用範囲 (Article 2)
3. **3条** - 定義 (Article 3)
4. **4条** - AIリテラシー (Article 4)

### 禁止・分類
5. **5条** - 禁止されるAI (Article 5)
6. **6条** - 高リスクAIシステムの分類 (Article 6)

### 高リスクAIの要件（提供者の義務）
7. **9条** - リスク管理システム (Article 9)
8. **10条** - データガバナンス (Article 10)
9. **11条** - 技術文書 (Article 11)
10. **12条** - 記録保持 (Article 12)
11. **13条** - 配備者に対する透明性と情報提供 (Article 13)
12. **14条** - 人間によるオーバーサイト (Article 14)
13. **15条** - 正確性・頑健性・セキュリティ (Article 15)
14. **16条** - 高リスクシステムの提供者に対する義務 (Article 16)
15. **17条** - 品質管理システム (Article 17)

### 配備者・その他の義務
16. **26条** - 高リスクシステムの配置者に対する義務 (Article 26)
17. **43条** - 適合性アセスメント (Article 43)

### 透明性・汎用AI
18. **50条** - 「ある種のAI」およびGPAIに対する透明性義務 (Article 50)
19. **51条** - GPAIの分類 (Article 51)
20. **53条** - GPAIの提供者に対する義務 (Article 53)
21. **55条** - システミックリスクをもつGPAIモデルの提供者への義務 (Article 55)

### テスト・モニタリング
22. **60条** - リアルワールド条件でのテスト (Article 60)
23. **72条** - 上梓後モニタリング (Article 72)

## 🔧 使用方法

### 1. データの読み込み

#### Python
```python
import json

# JSONファイルを読み込む
with open('eu_ai_act_articles_complete.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 条文リストを取得
articles = data['articles']

# 特定の条文を取得
article_9 = next(a for a in articles if a['article_id'] == 'article_9')
print(article_9['title_ja'])  # "リスク管理システム"
```

#### JavaScript/TypeScript
```typescript
import articlesData from './eu_ai_act_articles_complete.json';

// 条文リストを取得
const articles = articlesData.articles;

// 特定の条文を検索
const article9 = articles.find(a => a.article_id === 'article_9');
console.log(article9?.title_ja); // "リスク管理システム"
```

### 2. フィルタリング

#### 高リスクAI関連の条文を抽出
```python
high_risk_articles = [
    a for a in articles 
    if a['risk_level'] == 'high-risk'
]
```

#### 提供者の義務に関する条文を抽出
```python
provider_obligations = [
    a for a in articles 
    if a['category'] == 'obligation_provider'
]
```

#### GPAI関連の条文を抽出
```python
gpai_articles = [
    a for a in articles 
    if 'gpai' in a['risk_level'] or a['category'] == 'gpai'
]
```

### 3. 検索

#### キーワード検索
```python
def search_articles(keyword: str):
    results = []
    for article in articles:
        # タイトルで検索
        if keyword in article['title_ja'] or keyword in article['title_en']:
            results.append(article)
            continue
        
        # 要件で検索
        for req in article['requirements']:
            if keyword in req['description_ja']:
                results.append(article)
                break
    
    return results

# 使用例
risk_management_articles = search_articles('リスク管理')
```

### 4. 関連条文の取得

```python
def get_related_articles(article_id: str, depth: int = 1):
    """指定した条文の関連条文を取得"""
    article = next((a for a in articles if a['article_id'] == article_id), None)
    if not article or depth == 0:
        return []
    
    related = []
    for rel in article['related_articles']:
        rel_article = next((a for a in articles if a['article_id'] == rel['article_id']), None)
        if rel_article:
            related.append(rel_article)
            if depth > 1:
                related.extend(get_related_articles(rel['article_id'], depth - 1))
    
    # 重複除去
    return list({a['article_id']: a for a in related}.values())
```

### 5. 統計分析

```python
from collections import Counter

# カテゴリ別の要件数を集計
category_requirements = {}
for article in articles:
    category = article['category']
    req_count = len(article['requirements'])
    category_requirements[category] = category_requirements.get(category, 0) + req_count

print(category_requirements)
```

## 📁 データ構造

### トップレベル
```json
{
  "schema_version": "1.0",
  "description": "欧州AI法 P23～P70の全条文データ",
  "created_at": "2025-11-04T13:59:51.597357",
  "articles": [...]
}
```

### 条文オブジェクト
各条文は以下の構造を持ちます：

```json
{
  "article_id": "article_9",
  "article_number": "9条",
  "section_id": "3-4",
  "title_ja": "リスク管理システム",
  "title_en": "Risk Management System",
  "slide_pages": [42, 43],
  "category": "obligation_provider",
  "risk_level": "high-risk",
  "article_text": {
    "ja": "条文本文（日本語）",
    "en": "Article text (English)"
  },
  "requirements": [...],
  "related_articles": [...],
  "related_recitals": [...],
  "related_annexes": [...],
  "notes": [...],
  "visual_elements": {...},
  "metadata": {...}
}
```

### 要件オブジェクト
```json
{
  "req_id": "9-1",
  "type": "mandatory",
  "description_ja": "要件の説明（日本語）",
  "description_en": "Requirement description (English)",
  "sub_items": [...],
  "conditions": "適用条件",
  "verification_method": "検証方法",
  "responsible_party": "provider"
}
```

## 🏷️ カテゴリとタイプの定義

### カテゴリ (category)
- `definition` - 定義
- `scope` - 範囲・目的
- `prohibition` - 禁止事項
- `classification` - 分類
- `obligation_provider` - 提供者の義務
- `obligation_deployer` - 配備者の義務
- `quality_management` - 品質管理
- `conformity_assessment` - 適合性評価
- `transparency` - 透明性
- `testing` - テスト
- `monitoring` - モニタリング
- `gpai` - 汎用AI関連

### リスクレベル (risk_level)
- `prohibited` - 禁止
- `high-risk` - 高リスク
- `gpai` - 汎用AI
- `gpai_systemic` - システミックリスクを持つ汎用AI
- `limited-risk` - 限定的リスク
- `minimal-risk` - 最小リスク
- `general` - 一般

### 要件タイプ (requirement.type)
- `mandatory` - 必須
- `conditional` - 条件付き
- `recommendation` - 推奨
- `prohibition` - 禁止
- `definition` - 定義
- `scope_definition` - 範囲定義
- `consideration` - 考慮事項

## 💡 活用例

### 1. コンプライアンスチェックリスト作成
```python
def generate_compliance_checklist(risk_level='high-risk'):
    checklist = []
    for article in articles:
        if article['risk_level'] == risk_level:
            for req in article['requirements']:
                if req['type'] == 'mandatory':
                    checklist.append({
                        'article': article['article_number'],
                        'requirement': req['description_ja'],
                        'verification': req['verification_method']
                    })
    return checklist
```

### 2. 条文間の関係図を生成
```python
import networkx as nx
import matplotlib.pyplot as plt

G = nx.DiGraph()

# ノードを追加
for article in articles:
    G.add_node(article['article_number'])

# エッジを追加（関連条文）
for article in articles:
    for rel in article['related_articles']:
        target = next((a for a in articles if a['article_id'] == rel['article_id']), None)
        if target:
            G.add_edge(article['article_number'], target['article_number'])

# 可視化
plt.figure(figsize=(12, 12))
nx.draw(G, with_labels=True, node_color='lightblue', 
        node_size=1500, font_size=8, arrows=True)
plt.savefig('article_relationships.png')
```

### 3. 担当者別タスク抽出
```python
def get_tasks_by_responsible_party(party='provider'):
    tasks = []
    for article in articles:
        for req in article['requirements']:
            if party in req['responsible_party']:
                tasks.append({
                    'article': article['article_number'],
                    'task': req['description_ja'],
                    'verification': req['verification_method']
                })
    return tasks
```

## 🔄 更新履歴

- **v1.0** (2025-11-04): 初版リリース
  - P23～P70の全23条文を構造化
  - 61件の要件を詳細化
  - 36件の条文間参照を記録
  - 10件の前文参照を記録
  - 6件の付属書参照を記録

## 📚 関連ファイル

このJSONデータセットは以下のファイルと共に使用することを推奨します：

1. **article-types.ts** - TypeScript型定義
2. **article-schema.json** - JSON Schema（バリデーション用）
3. **implementation_guide.md** - 実装ガイド
4. **article_schema_proposal.md** - 構造設計ドキュメント

## ⚠️ 注意事項

1. **公式文書との照合**
   - このデータは参考資料であり、正式な法的解釈は原文を参照してください
   - 最新の法令改正については公式サイトを確認してください

2. **データの精度**
   - スライド資料からの抽出のため、一部簡略化されている箇所があります
   - 詳細な解釈が必要な場合は原文（Official Journal）を参照してください

3. **バージョン管理**
   - このデータは2024年10月27日版のスライドに基づいています
   - 法令の改正に伴い、データも更新が必要になる場合があります

4. **利用制限**
   - このデータは教育・研究目的での使用を想定しています
   - 商用利用の際は適切なライセンス確認を行ってください

## 📞 サポート

データ構造や使用方法についての質問があれば、以下を参照してください：
- **実装ガイド**: `implementation_guide.md`
- **型定義**: `article-types.ts`
- **スキーマ**: `article-schema.json`

## 📄 ライセンス

このデータセットの構造設計およびJSON形式は独自の著作物です。
欧州AI法の条文内容自体は欧州連合の公式文書に基づきます。

---

**作成日**: 2025年11月4日  
**最終更新**: 2025年11月4日  
**バージョン**: 1.0  
**条文数**: 23条  
**総要件数**: 61件
