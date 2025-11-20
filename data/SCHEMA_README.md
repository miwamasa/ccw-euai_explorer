# EU AI Act データスキーマ

## 概要

このディレクトリには欧州AI法条文データのJSON Schemaが含まれています。

## ファイル

- **eu_ai_act_schema.json**: 条文データコレクション全体のJSON Schema (Version 1.1)
- **eu_ai_act_articles_complete.json**: 最新の条文データ（24条文、100要件以上）
- **eu_ai_act_articles_updated.json**: 更新用データファイル（24条文）

## スキーマ構造

### トップレベル

```json
{
  "schema_version": "1.1",
  "description": "欧州AI法 P23～P70の全条文データ",
  "created_at": "2025-11-04T13:59:51.597357",
  "updated_at": "2025-11-20T14:30:00.000000",
  "articles": [...]
}
```

- **schema_version**: スキーマバージョン（現在 1.1）
- **description**: データセットの説明
- **created_at**: 作成日時（ISO 8601形式）
- **updated_at**: 更新日時（ISO 8601形式、オプショナル）
- **articles**: 条文の配列

### 条文 (Article)

各条文は以下の構造を持ちます：

- **article_id**: 条文ID（例: "article_9"）
- **article_number**: 条文番号（例: "9条"）
- **section_id**: セクションID（例: "3-4"）
- **title_ja**: 日本語タイトル
- **title_en**: 英語タイトル
- **slide_pages**: 対応スライドページ番号の配列
- **category**: 条文カテゴリ
- **risk_level**: リスクレベル
- **article_text**: 条文本文（日英、オプショナル）
- **summary**: 条文の要約（日英、最大3行、オプショナル）
- **requirements**: 要件の配列
- **related_articles**: 関連条文の配列
- **related_recitals**: 関連前文の配列
- **related_annexes**: 関連付属書の配列
- **notes**: 注釈の配列
- **visual_elements**: ビジュアル要素
- **metadata**: メタデータ

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
- `general` - 一般

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

## バリデーション方法

### Node.js (ajv)を使用

```bash
npm install -g ajv-cli
ajv validate -s data/eu_ai_act_schema.json -d data/eu_ai_act_articles_complete.json
```

### Python (jsonschema)を使用

```python
import json
from jsonschema import validate, ValidationError

# スキーマを読み込む
with open('data/eu_ai_act_schema.json', 'r', encoding='utf-8') as f:
    schema = json.load(f)

# データを読み込む
with open('data/eu_ai_act_articles_complete.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# バリデーション
try:
    validate(instance=data, schema=schema)
    print("✅ データはスキーマに準拠しています")
except ValidationError as e:
    print(f"❌ バリデーションエラー: {e.message}")
```

### オンラインツールを使用

1. https://www.jsonschemavalidator.net/ にアクセス
2. 左側に `eu_ai_act_schema.json` の内容を貼り付け
3. 右側にデータファイルの内容を貼り付け
4. 自動的にバリデーションが実行されます

## スキーマの特徴

### 柔軟性

- **article_text**: オプショナルフィールド（一部の条文では欠けている場合がある）
- **requirements.conditions**, **verification_method**, **responsible_party**: 空文字列を許可
- **slide_pages**: 空配列を許可（新規作成時）

### 厳格性

- **article_id**: `article_` で始まる必要がある
- **article_number**: `数字条` の形式（例: "9条"）
- **section_id**: `数字-数字または文字` の形式（例: "3-4", "3-x"）、または "TBD"（未定）
- **category**, **risk_level**, **requirement.type**: 事前定義された値のみ許可
- **日時フィールド**: ISO 8601形式

## データの拡張

新しいフィールドを追加する場合：

1. スキーマファイルの該当する `definitions` セクションを更新
2. 必要に応じて `required` 配列を更新
3. `enum` の値リストを更新（該当する場合）
4. このREADMEを更新

## 関連ドキュメント

- [データ構造設計](../doc/article_schema_proposal.md)
- [実装ガイド](../doc/implementation_guide.md)
- [データ仕様書](../doc/README_articles.md)

## バージョン履歴

- **1.1** (2025-11-20): スキーマの最新化
  - 24条文に対応（Article 56「実践規範」を追加）
  - トップレベルに updated_at フィールドを追加
  - section_id に "TBD" 値を許可
  - 前文タイトル（title_ja/title_en）の日本語翻訳を追加（181件）
  - 条文要約（summary.ja）の日本語翻訳を追加（23件）
  - 主要なAI法専門用語を日本語化（AI法、高リスクAIシステム、リスク管理システム等）

- **1.0** (2025-11-20): 初版スキーマ作成
  - 23条文、100要件のデータに対応
  - article_textをオプショナル化
  - サブ項目の編集機能に対応
  - summaryフィールドを追加（日英、最大3行）
  - euact/*.txtファイルからsummaryとarticle_textを自動抽出
  - euact/recitals.txtから180個の前文タイトルを抽出
  - related_recitalsにtitle_ja/title_enフィールドを追加
  - summaryの表示順序を日本語→英語に統一

## ライセンス

このスキーマ定義は本プロジェクト専用です。
欧州AI法の条文内容自体は欧州連合の公式文書に基づきます。
