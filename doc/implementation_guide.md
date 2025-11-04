# 欧州AI法対応ガイドブック 構造化プロジェクト
## 実装ガイド v1.0

---

## 📋 プロジェクト概要

### 目的
添付の「欧州AI法対応ガイドブック」のP23～P70（３章：「欧州AI法」の詳細）の条文情報を構造化し、専用エディタで表示・編集・スライド生成を可能にする。

### スコープ
- **対象範囲**: P23～P70の条文情報
- **条文数**: 約30条文（3条、5条、9～17条、26条、43条、50～55条、60条、72条等）
- **出力形式**: JSON（条文ごとのオブジェクト）
- **用途**: 
  - 専用エディタでの表示・編集
  - スライド自動生成
  - 検索・フィルタリング
  - バージョン管理

---

## 🏗️ 構造設計

### 1. データ構造の階層

```
ArticleCollection
├── schema_version
├── description
└── articles[]
    ├── 基本情報（ID、タイトル、カテゴリ等）
    ├── 条文本文（日英）
    ├── requirements[]（要件リスト）
    │   └── sub_items[]（サブ項目）
    ├── related_articles[]（関連条文）
    ├── related_recitals[]（関連前文）
    ├── related_annexes[]（関連付属書）
    ├── notes[]（注釈）
    ├── visual_elements（図表情報）
    │   └── elements[]
    └── metadata（メタデータ）
```

### 2. 主要なフィールド

#### 基本情報
- `article_id`: 条文の一意識別子（例: "article_9"）
- `article_number`: 表示用条文番号（例: "9条"）
- `section_id`: スライド内のセクションID（例: "3-4"）
- `title_ja/en`: 日英タイトル
- `slide_pages`: 対応スライドページ番号
- `category`: 条文カテゴリ（12種類）
- `risk_level`: リスクレベル（7種類）

#### 要件情報
- `requirements`: 条文の個別要件の配列
  - `req_id`: 要件ID（例: "9-2-a"）
  - `type`: 要件タイプ（mandatory, conditional等）
  - `description_ja/en`: 日英説明
  - `sub_items`: サブ項目の配列
  - `conditions`: 適用条件
  - `verification_method`: 検証方法
  - `responsible_party`: 責任者（provider, deployer等）

#### 関連情報
- `related_articles`: 他の条文への参照
- `related_recitals`: 前文との関連
- `related_annexes`: 付属書との関連
- `notes`: 補足説明・注釈

#### ビジュアル要素
- `visual_elements`: フローチャート、図表、表等の情報
  - `has_flowchart/diagram/table`: 要素の有無
  - `elements`: 個別要素の配列

#### メタデータ
- `created_at/updated_at`: 作成・更新日時
- `version`: バージョン
- `author`: 作成者
- `status`: ステータス（draft, reviewed, approved, published）
- `tags`: タグ
- `comments`: コメント

---

## 📝 カテゴリとタイプの定義

### 条文カテゴリ（category）

| カテゴリ | 説明 | 該当条文例 |
|---------|------|-----------|
| `definition` | 定義 | 3条 |
| `scope` | 範囲・目的 | 1条、2条 |
| `prohibition` | 禁止事項 | 5条 |
| `classification` | 分類 | 6条 |
| `obligation_provider` | 提供者の義務 | 9-17条、50-55条 |
| `obligation_deployer` | 配備者の義務 | 26条 |
| `quality_management` | 品質管理 | 17条 |
| `conformity_assessment` | 適合性評価 | 43条 |
| `transparency` | 透明性 | 13条、50条 |
| `testing` | テスト | 60条 |
| `monitoring` | モニタリング | 72条 |
| `gpai` | 汎用AI関連 | 51条、53条、55条 |

### リスクレベル（risk_level）

| レベル | 説明 |
|-------|------|
| `prohibited` | 禁止 |
| `high-risk` | 高リスク |
| `gpai` | 汎用AI |
| `gpai_systemic` | システミックリスクを持つ汎用AI |
| `limited-risk` | 限定的リスク（透明性義務） |
| `minimal-risk` | 最小リスク |
| `general` | 一般（定義、範囲等） |

### 要件タイプ（requirement.type）

| タイプ | 説明 | 例 |
|-------|------|---|
| `mandatory` | 必須 | リスク管理システムの確立 |
| `conditional` | 条件付き | 実世界テストが必要な場合 |
| `recommendation` | 推奨 | ベストプラクティス |
| `prohibition` | 禁止 | サブリミナル手法の使用 |
| `definition` | 定義 | 用語の定義 |
| `scope_definition` | 範囲定義 | リスクの範囲限定 |
| `consideration` | 考慮事項 | 脆弱な人への配慮 |

---

## 📦 成果物

### 1. スキーマ定義

#### TypeScript型定義: `article-types.ts`
```typescript
export interface Article {
  article_id: string;
  article_number: string;
  // ... 完全な型定義
}
```

**用途**: 
- TypeScript/JavaScriptでの型安全な開発
- IDEの自動補完サポート
- コンパイル時の型チェック

#### JSON Schema: `article-schema.json`
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "EU AI Act Article",
  // ... 完全なスキーマ定義
}
```

**用途**:
- JSONデータのバリデーション
- エディタでのスキーマ補完
- ドキュメント自動生成

### 2. サンプルデータ: `articles_samples.json`

以下の3条文の完全なサンプルを含む:
- **3条（定義）**: 基本的な用語定義
- **5条（禁止）**: 禁止されるAIプラクティス  
- **9条（リスク管理）**: 高リスクAIの詳細要件（フル版）

### 3. 設計ドキュメント: `article_schema_proposal.md`

構造設計の詳細説明と検討事項を記載

---

## 🚀 実装ステップ

### Phase 1: 準備と検証（完了）
- ✅ スライド内容の分析
- ✅ 共通構造の設計
- ✅ TypeScript型定義の作成
- ✅ JSON Schemaの作成
- ✅ サンプルデータの作成（3条文）

### Phase 2: データ構造化（次のステップ）
1. **条文の抽出**
   - [ ] PowerPointからの自動抽出スクリプト作成
   - [ ] 条文テキストの日英マッピング
   - [ ] 要件の階層構造の識別

2. **データ入力**
   - [ ] 残りの全条文のJSON化（約27条文）
   - [ ] 関連情報の紐付け
   - [ ] ビジュアル要素の記録

3. **検証**
   - [ ] JSON Schemaによるバリデーション
   - [ ] データの整合性チェック
   - [ ] 参照関係の確認

### Phase 3: エディタ開発
1. **基本機能**
   - [ ] 条文一覧表示（フィルタ・検索）
   - [ ] 条文詳細表示
   - [ ] 条文編集（WYSIWYG）
   - [ ] 関連情報の表示

2. **高度な機能**
   - [ ] 関連条文の可視化（グラフ表示）
   - [ ] バージョン管理
   - [ ] 変更履歴
   - [ ] コメント機能
   - [ ] 多人数での編集（同時編集）

3. **エクスポート機能**
   - [ ] JSON形式でのエクスポート
   - [ ] Markdown形式でのエクスポート
   - [ ] PDF形式でのエクスポート

### Phase 4: スライド生成機能
1. **テンプレート設計**
   - [ ] 条文種別ごとのスライドテンプレート
   - [ ] レイアウトルールの定義

2. **生成ロジック**
   - [ ] JSONからスライドへの変換
   - [ ] ビジュアル要素の配置
   - [ ] スタイルの適用

3. **出力**
   - [ ] PowerPoint形式での出力
   - [ ] Google Slides形式での出力

---

## 🛠️ 技術スタック提案

### フロントエンド
- **Framework**: React / Vue.js / Next.js
- **UI Library**: Material-UI / Ant Design / shadcn/ui
- **State Management**: Redux / Zustand / Jotai
- **Editor**: 
  - Rich Text: Slate.js / ProseMirror / TipTap
  - JSON Editor: react-json-view / jsoneditor
- **Visualization**: D3.js / Cytoscape.js（関連図）

### バックエンド（必要に応じて）
- **API**: Node.js (Express/Fastify) / Python (FastAPI)
- **Database**: PostgreSQL / MongoDB（JSONデータの保存）
- **Storage**: S3 / Cloud Storage（スライド画像等）

### バリデーション・ツール
- **JSON Schema Validator**: ajv
- **TypeScript**: 型チェック
- **Linting**: ESLint / Prettier

---

## 📚 使用例

### 1. データの読み込み

```typescript
import { Article, ArticleCollection } from './article-types';
import articlesData from './articles_samples.json';

const collection: ArticleCollection = articlesData;

// 特定の条文を取得
const article9 = collection.articles.find(
  a => a.article_id === 'article_9'
);

console.log(article9?.title_ja); // "リスク管理システム"
```

### 2. フィルタリング

```typescript
// 高リスクAIに関する条文のみ抽出
const highRiskArticles = collection.articles.filter(
  a => a.risk_level === 'high-risk'
);

// 提供者の義務に関する条文のみ抽出
const providerObligations = collection.articles.filter(
  a => a.category === 'obligation_provider'
);
```

### 3. 検索

```typescript
// タイトルや説明文でのキーワード検索
function searchArticles(keyword: string): Article[] {
  return collection.articles.filter(article => 
    article.title_ja.includes(keyword) ||
    article.title_en.toLowerCase().includes(keyword.toLowerCase()) ||
    article.requirements.some(req => 
      req.description_ja.includes(keyword)
    )
  );
}

const results = searchArticles('リスク管理');
```

### 4. 関連条文の取得

```typescript
// 条文の関連条文を再帰的に取得
function getRelatedArticles(
  articleId: string, 
  depth: number = 1
): Article[] {
  const article = collection.articles.find(
    a => a.article_id === articleId
  );
  
  if (!article || depth === 0) return [];
  
  const related = article.related_articles.map(rel => 
    collection.articles.find(a => a.article_id === rel.article_id)
  ).filter((a): a is Article => a !== undefined);
  
  if (depth > 1) {
    related.forEach(a => {
      related.push(...getRelatedArticles(a.article_id, depth - 1));
    });
  }
  
  return [...new Set(related)]; // 重複除去
}
```

### 5. バリデーション

```typescript
import Ajv from 'ajv';
import schema from './article-schema.json';

const ajv = new Ajv();
const validate = ajv.compile(schema);

function validateArticle(article: Article): boolean {
  const valid = validate(article);
  if (!valid) {
    console.error('Validation errors:', validate.errors);
  }
  return valid;
}
```

---

## ⚠️ 実装上の注意点

### 1. データの整合性
- 条文間の参照（related_articles）が正しいことを確認
- article_idの一意性を保証
- slide_pagesの重複・欠落チェック

### 2. 多言語対応
- 日英の内容が一致していることを確認
- 将来的に他言語追加の可能性を考慮

### 3. バージョン管理
- 法令の改正に対応できるバージョン管理
- 変更履歴の記録
- 過去バージョンへのアクセス

### 4. パフォーマンス
- 大量の条文データの効率的な検索
- インデックスの活用
- 遅延読み込み（Lazy Loading）

### 5. セキュリティ
- JSONインジェクション対策
- XSS対策（エディタでのHTML入力）
- アクセス権限の管理

---

## 📊 データ統計（P23～P70）

### 条文の分布
- **定義・範囲**: 約5条文（3条、1条、2条等）
- **禁止・分類**: 約3条文（5条、6条等）
- **提供者の義務**: 約15条文（9-17条、50-55条等）
- **配備者の義務**: 約2条文（26条等）
- **その他**: 約5条文（43条、60条、72条等）

### 要件の粒度
- **条文あたりの平均要件数**: 5-10件
- **サブ項目を持つ要件の割合**: 約40%
- **関連条文の平均数**: 2-4件

---

## 🎯 次のアクションアイテム

### 即座に実施すべきこと
1. ✅ **構造レビュー**: この提案構造をレビューし、必要に応じて調整
2. ⬜ **サンプル検証**: 3つのサンプル条文が実際のユースケースに対応できるか確認
3. ⬜ **ツール選定**: エディタの実装に使用する技術スタックの決定

### 短期（1-2週間）
4. ⬜ **自動抽出スクリプト**: PowerPointからの条文データ抽出の自動化
5. ⬜ **データ入力**: 残りの全条文のJSON化
6. ⬜ **基本エディタ**: 最小限の表示・編集機能を持つプロトタイプ作成

### 中期（1-2ヶ月）
7. ⬜ **フル機能エディタ**: 完全な機能を持つエディタの開発
8. ⬜ **スライド生成**: JSONからスライドへの変換機能
9. ⬜ **テストと改善**: ユーザーテストとフィードバックに基づく改善

---

## 📞 サポートとフィードバック

### 質問事項
構造について質問や確認が必要な点があれば、以下の観点で検討してください:

1. **粒度**: データの細かさは適切か？
2. **拡張性**: 将来の変更に対応できるか？
3. **使いやすさ**: エディタでの編集が容易か？
4. **完全性**: 必要な情報が全て含まれているか？

### フィードバック
この構造案に対するフィードバックをいただければ、さらに改善・調整いたします。

---

## 📄 ファイル一覧

```
/home/claude/
├── article_schema_proposal.md     # 構造設計の詳細説明
├── article-types.ts               # TypeScript型定義
├── article-schema.json            # JSON Schema
├── article_9_sample.json          # 9条のサンプル（詳細版）
├── articles_samples.json          # 3条文のサンプル集
└── implementation_guide.md        # 本ドキュメント
```

---

**作成日**: 2024年11月4日  
**バージョン**: 1.0  
**ステータス**: 構造設計完了、実装準備中
