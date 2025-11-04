/**
 * 欧州AI法 条文データ構造の型定義
 * @version 1.0
 */

/**
 * 条文データの基本構造
 */
export interface Article {
  /** 条文ID (例: "article_9", "article_3_1") */
  article_id: string;
  
  /** 条文番号 (例: "9条", "3条") */
  article_number: string;
  
  /** セクションID (例: "3-1", "3-4") */
  section_id: string;
  
  /** 日本語タイトル */
  title_ja: string;
  
  /** 英語タイトル */
  title_en: string;
  
  /** 対応スライドページ番号の配列 */
  slide_pages: number[];
  
  /** カテゴリ */
  category: ArticleCategory;
  
  /** 関連するリスクレベル */
  risk_level: RiskLevel;
  
  /** 条文本文 */
  article_text?: ArticleText;
  
  /** 要件リスト */
  requirements: Requirement[];
  
  /** 関連条文 */
  related_articles: RelatedArticle[];
  
  /** 関連前文 */
  related_recitals: RelatedRecital[];
  
  /** 関連付属書 */
  related_annexes: RelatedAnnex[];
  
  /** 注釈・補足説明 */
  notes: Note[];
  
  /** ビジュアル要素 */
  visual_elements: VisualElements;
  
  /** メタデータ */
  metadata: Metadata;
}

/**
 * 条文本文（多言語対応）
 */
export interface ArticleText {
  ja: string;
  en: string;
}

/**
 * 要件データ
 */
export interface Requirement {
  /** 要件ID (例: "9-1", "9-2-a") */
  req_id: string;
  
  /** 要件タイプ */
  type: RequirementType;
  
  /** 日本語説明 */
  description_ja: string;
  
  /** 英語説明 */
  description_en: string;
  
  /** サブ項目 */
  sub_items: SubItem[];
  
  /** 適用条件 */
  conditions: string;
  
  /** 検証方法 */
  verification_method: string;
  
  /** 責任者 */
  responsible_party: ResponsibleParty;
}

/**
 * サブ項目
 */
export interface SubItem {
  item_id: string;
  description_ja: string;
  description_en: string;
}

/**
 * 関連条文
 */
export interface RelatedArticle {
  article_id: string;
  article_number: string;
  relation_type: RelationType;
  description: string;
}

/**
 * 関連前文
 */
export interface RelatedRecital {
  recital_number: string;
  summary_ja: string;
  summary_en: string;
  relevance: string;
}

/**
 * 関連付属書
 */
export interface RelatedAnnex {
  annex_id: string;
  section: string;
  title_ja: string;
  title_en: string;
  description: string;
  items: AnnexItem[];
}

/**
 * 付属書項目
 */
export interface AnnexItem {
  item_id: string;
  content_ja: string;
  content_en: string;
}

/**
 * 注釈
 */
export interface Note {
  note_id: string;
  type: NoteType;
  content_ja: string;
  content_en: string;
  position: string;
}

/**
 * ビジュアル要素
 */
export interface VisualElements {
  has_flowchart: boolean;
  has_diagram: boolean;
  has_table: boolean;
  elements: VisualElement[];
}

/**
 * ビジュアル要素の詳細
 */
export interface VisualElement {
  type: VisualElementType;
  description: string;
  data: Record<string, any>;
  image_path?: string;
}

/**
 * メタデータ
 */
export interface Metadata {
  created_at: string;
  updated_at: string;
  version: string;
  author: string;
  status: Status;
  tags: string[];
  comments: Comment[];
}

/**
 * コメント
 */
export interface Comment {
  comment_id: string;
  author: string;
  content: string;
  created_at: string;
}

// ===== 型定義（Enum代替） =====

/**
 * 条文カテゴリ
 */
export type ArticleCategory =
  | 'definition'              // 定義
  | 'scope'                   // 範囲・目的
  | 'prohibition'             // 禁止事項
  | 'classification'          // 分類
  | 'obligation_provider'     // 提供者の義務
  | 'obligation_deployer'     // 配備者の義務
  | 'quality_management'      // 品質管理
  | 'conformity_assessment'   // 適合性評価
  | 'transparency'            // 透明性
  | 'testing'                 // テスト
  | 'monitoring'              // モニタリング
  | 'gpai';                   // 汎用AI関連

/**
 * リスクレベル
 */
export type RiskLevel =
  | 'prohibited'      // 禁止
  | 'high-risk'       // 高リスク
  | 'gpai'            // 汎用AI
  | 'gpai_systemic'   // システミックリスクを持つ汎用AI
  | 'limited-risk'    // 限定的リスク
  | 'minimal-risk'    // 最小リスク
  | 'general';        // 一般

/**
 * 要件タイプ
 */
export type RequirementType =
  | 'mandatory'         // 必須
  | 'conditional'       // 条件付き
  | 'recommendation'    // 推奨
  | 'prohibition'       // 禁止
  | 'definition'        // 定義
  | 'scope_definition'  // 範囲定義
  | 'consideration';    // 考慮事項

/**
 * 責任者
 */
export type ResponsibleParty =
  | 'provider'
  | 'deployer'
  | 'provider, deployer'
  | 'importer'
  | 'distributor'
  | '';

/**
 * 関係性タイプ
 */
export type RelationType =
  | 'references'        // 参照
  | 'prerequisite'      // 前提条件
  | 'related'           // 関連
  | 'uses_definition'   // 定義を使用
  | 'implements';       // 実装

/**
 * 注釈タイプ
 */
export type NoteType =
  | 'explanation'   // 説明
  | 'reference'     // 参照
  | 'caution'       // 注意
  | 'example';      // 例

/**
 * ビジュアル要素タイプ
 */
export type VisualElementType =
  | 'flowchart'   // フローチャート
  | 'table'       // 表
  | 'diagram'     // 図
  | 'graph';      // グラフ

/**
 * ステータス
 */
export type Status =
  | 'draft'       // 下書き
  | 'reviewed'    // レビュー済み
  | 'approved'    // 承認済み
  | 'published';  // 公開済み

// ===== コレクション型 =====

/**
 * 条文コレクション
 */
export interface ArticleCollection {
  schema_version: string;
  description: string;
  articles: Article[];
}

// ===== ユーティリティ型 =====

/**
 * 条文の部分更新用型
 */
export type PartialArticle = Partial<Article>;

/**
 * 条文フィルター条件
 */
export interface ArticleFilter {
  category?: ArticleCategory[];
  risk_level?: RiskLevel[];
  tags?: string[];
  status?: Status[];
}

/**
 * 条文ソート条件
 */
export interface ArticleSort {
  field: keyof Article;
  order: 'asc' | 'desc';
}
