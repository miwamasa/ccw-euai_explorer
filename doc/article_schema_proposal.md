# 欧州AI法 条目毎の共通JSON構造案

## 構造化の目的
- 条文情報の一貫した管理
- 専用エディタでの表示・編集
- スライド生成の自動化

## 提案する共通構造

### レベル1: 基本構造
```json
{
  "article_id": "string",           // 条文ID（例："article_9", "article_3_1"）
  "article_number": "string",       // 条文番号（例："9条", "3条"）
  "section_id": "string",          // セクションID（例："3-1", "3-4"）
  "title_ja": "string",            // 日本語タイトル
  "title_en": "string",            // 英語タイトル（Article名）
  "slide_pages": [int],            // 対応スライドページ番号の配列
  "category": "string",            // カテゴリ（例："definition", "obligation", "prohibition"）
  "risk_level": "string",          // 関連するリスクレベル（例："high-risk", "general", "prohibited"）
  "article_text": {                // 条文本文
    "ja": "string",
    "en": "string"
  },
  "requirements": [],              // 要件リスト（詳細は後述）
  "related_articles": [],          // 関連条文の配列
  "related_recitals": [],          // 関連前文の配列
  "related_annexes": [],           // 関連付属書の配列
  "notes": [],                     // 注釈・補足説明の配列
  "visual_elements": {},           // 図表・フローチャート等の情報
  "metadata": {}                   // メタデータ
}
```

### レベル2: 詳細構造

#### 2.1 requirements（要件リスト）
条文に含まれる個別の要件を構造化：

```json
{
  "requirements": [
    {
      "req_id": "string",              // 要件ID（例："9-2-a"）
      "type": "string",                // 要件タイプ（例："mandatory", "conditional", "recommendation"）
      "description_ja": "string",      // 日本語説明
      "description_en": "string",      // 英語説明
      "sub_items": [                   // サブ項目（該当する場合）
        {
          "item_id": "string",
          "description_ja": "string",
          "description_en": "string"
        }
      ],
      "conditions": "string",          // 適用条件
      "verification_method": "string", // 検証方法
      "responsible_party": "string"    // 責任者（provider, deployer等）
    }
  ]
}
```

#### 2.2 related_articles（関連条文）
```json
{
  "related_articles": [
    {
      "article_id": "string",       // 関連条文ID
      "article_number": "string",   // 条文番号
      "relation_type": "string",    // 関係性（例："references", "prerequisite", "related"）
      "description": "string"       // 関係性の説明
    }
  ]
}
```

#### 2.3 related_recitals（関連前文）
```json
{
  "related_recitals": [
    {
      "recital_number": "string",   // 前文番号（例："前文66"）
      "summary_ja": "string",       // 日本語要約
      "summary_en": "string",       // 英語要約
      "relevance": "string"         // 関連性の説明
    }
  ]
}
```

#### 2.4 related_annexes（関連付属書）
```json
{
  "related_annexes": [
    {
      "annex_id": "string",         // 付属書ID（例："Annex_IV"）
      "section": "string",          // セクション（例："Annex IV-2"）
      "title_ja": "string",
      "title_en": "string",
      "description": "string",      // 内容説明
      "items": []                   // 付属書の項目リスト
    }
  ]
}
```

#### 2.5 notes（注釈・補足）
```json
{
  "notes": [
    {
      "note_id": "string",
      "type": "string",             // タイプ（例："explanation", "reference", "caution"）
      "content_ja": "string",
      "content_en": "string",
      "position": "string"          // 注釈の位置情報
    }
  ]
}
```

#### 2.6 visual_elements（ビジュアル要素）
```json
{
  "visual_elements": {
    "has_flowchart": boolean,
    "has_diagram": boolean,
    "has_table": boolean,
    "elements": [
      {
        "type": "string",           // 要素タイプ（例："flowchart", "table", "diagram"）
        "description": "string",    // 説明
        "data": {},                 // 要素のデータ（構造は要素タイプによる）
        "image_path": "string"      // 画像パス（該当する場合）
      }
    ]
  }
}
```

#### 2.7 metadata（メタデータ）
```json
{
  "metadata": {
    "created_at": "string",         // 作成日時（ISO 8601形式）
    "updated_at": "string",         // 更新日時
    "version": "string",            // バージョン
    "author": "string",             // 作成者
    "status": "string",             // ステータス（例："draft", "reviewed", "approved"）
    "tags": [],                     // タグの配列
    "comments": []                  // コメントの配列
  }
}
```

## カテゴリ分類案

### category（条文カテゴリ）
- `definition` - 定義（3条等）
- `scope` - 範囲・目的（1条、2条）
- `prohibition` - 禁止事項（5条）
- `classification` - 分類（6条等）
- `obligation_provider` - 提供者の義務（9-17条、50-55条等）
- `obligation_deployer` - 配備者の義務（26条等）
- `quality_management` - 品質管理（17条）
- `conformity_assessment` - 適合性評価（43条）
- `transparency` - 透明性（13条、50条等）
- `testing` - テスト（60条）
- `monitoring` - モニタリング（72条）
- `gpai` - 汎用AI関連（51条、53条、55条）

### risk_level（リスクレベル）
- `prohibited` - 禁止
- `high-risk` - 高リスク
- `gpai` - 汎用AI
- `gpai_systemic` - システミックリスクを持つ汎用AI
- `limited-risk` - 限定的リスク（透明性義務）
- `minimal-risk` - 最小リスク
- `general` - 一般（定義、範囲等）

## 実装上の考慮事項

### 1. 階層構造
- 1つの条文が複数のスライドにまたがる場合
- 1つのスライドに複数の要件が含まれる場合
- Annexの詳細が別スライドで展開される場合

### 2. 参照関係
- 条文間の相互参照
- 前文との関連
- Annexとの関連
- 外部規制・指令との関連

### 3. 拡張性
- 今後の法改正への対応
- カスタムフィールドの追加
- 言語の追加（多言語対応）

### 4. バリデーション
- 必須フィールドの定義
- データ型の制約
- 参照整合性のチェック

## 次のステップ

1. この構造案をレビュー・調整
2. サンプルとして2-3の条文をこの構造でJSON化
3. エディタのUI/UX設計
4. スライド生成ロジックの設計
5. 全条文の構造化作業

## 検討が必要な点

1. **粒度のバランス**：
   - どこまで細かく構造化するか
   - 編集のしやすさとデータの完全性のバランス

2. **スライド表現との対応**：
   - フローチャートや図表をどう表現するか
   - レイアウト情報をどこまで保持するか

3. **バージョン管理**：
   - 法令の改正への対応
   - スライドの更新履歴管理

4. **多言語対応**：
   - 日英以外の言語への拡張可能性
   - 翻訳管理の方法
