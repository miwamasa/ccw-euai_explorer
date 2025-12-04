いいですね。以下は「このスライド（添付画像）をテンプレート化して、以降は文字列でレイアウト指定・差し替えできるようにする」ための**LLM向け自然言語プロンプト／仕様書**です。
そのままLLMに投げればスライド（あるいはスライドを表現するJSONや命令列）を出力できるように設計しています。
--------------------------------------------------------

# 使い方概要（最初に添える短い説明）

「このプロンプトは、与えられたメタデータ（JSON）をもとに、スライドテンプレートを作成し、指定されたプレースホルダに文字列を配置するための指示を生成します。出力は（a）テンプレート定義（プレースホルダ名・位置・スタイル）と、（b）該当プレースホルダにテキストを入れる操作コマンド（JSON形式）が含まれます。日本語・英語の両言語に対応します。」

---

# 1. テンプレート全体のレイアウト仕様（LLMにその通り作らせる指示）

1. スライドサイズ：横長（16:9）。余白（マージン）上30px / 左30px / 右30px / 下20px。
2. 背景：左上から右下へ薄いグレー（#F2F4F6 → #E9EDF0）グラデーション。右上に斜めの濃いグレーの装飾帯（アクセント）を配置（幅約180px、高さ30%程度、角を丸める）。
3. グリッド：主要領域は左側に小見出し・本文、上部にタイトル、右下に小さな注記領域。行間を広めに取り読みやすく。
4. 総合的な視覚トーン：ビジネス／技術向け。抑えた落ち着いた配色（グレー系 + コーポレートブルー）で、強調はコーポレートブルー（#0B5FFF）を使用。
5. アクセシビリティ：文字サイズは最小でも12pt相当（対比比率4.5:1以上を目安）。色のコントラストを確保する。

---

# 2. フォントとタイポグラフィ

* 日本語フォント優先：Noto Sans JP（あるいは游ゴシック）。英語フォント：Inter または Noto Sans。
* フォントウェイト：タイトルは700（Bold）、セクション見出しは600（SemiBold）、本文は400（Regular）。
* サイズ（16:9スライド想定、一覧）：

  * スライドタイトル（英日併記領域）：40〜44pt（最大2行）
  * セクションラベル（左側の青縦ライン横の短い見出し）：18pt（SemiBold）
  * メイン強調テキスト（白抜きボックスの大きな本文）：28〜32pt（Bold）
  * 要件箇条（箇条書き）：16〜18pt（Regular）、行間 1.4
  * フッター／注記：10〜12pt（Regular）
* 箇条書き（Bullets）：丸黒（•）か小さめのスクエア。インデントは階層ごとに +16px。

---

# 3. プレースホルダ（名前付け） — **必須項目**

以下のプレースホルダ名（ユニーク）をテンプレートに用意してください。各プレースホルダは言語別（_ja / _en）で同時に持てるようにします。

1. `header_title_ja` / `header_title_en`

   * 位置：スライド上部左寄せのタイトル領域（上から30px、左30px）。
   * 用途：スライドの大見出し（例：「15条：正確性・頑健性・セキュリティ」）。
   * スタイル：40pt、Bold、単行または2行。

2. `subheader_en`

   * 位置：タイトル右側の小さい英語説明（右寄せでも可）。
   * 用途：英語サブタイトル（例："Article 15: Accuracy, Robustness and Cybersecurity"）。
   * スタイル：14pt、Regular、淡いグレー（#6B7280）。

3. `overview_box`

   * 位置：中央上寄り、白背景ボックスで目立たせる（画像の白い枠）。
   * 用途：短い要約テキスト（article_text）。
   * スタイル：フォント28pt、Bold、ボックスに薄い影、角丸4px。横幅はスライド幅の約60%。

4. `section_label`

   * 位置：左端の縦青ライン（アクセント）に連動して表示される小ラベル（例：「概要」「代表的な要件」など）。
   * 用途：左脇のセクション見出し（小さめ）。
   * スタイル：18pt、SemiBold、カラー #0B5FFF（コーポレートブルー）。

5. `requirements_list`

   * 位置：白ボックスの下、または左寄り本文領域（箇条書き領域）。
   * 用途：requirements 配列を箇条書きで表示。各要件は `req_id` を太字で先頭に付ける（例：**15(1):** 適切な〜）。
   * スタイル：箇条16〜18pt、行間1.4、番号なしbulletsだが `req_id` を先頭で強調。階層サブアイテムはインデントを深く。

6. `related_articles_bar`

   * 位置：下部左寄せの横長小帯（ライトグレー背景）に関連記事リンク（タグ風）。
   * 用途：related_articles を小さなボタン風で並べる（例：「9条: リスク管理における〜」「13条: 精度〜」）。
   * スタイル：10〜12pt、角丸、背景 #F3F6FA、テキスト #111827。

7. `footnote`

   * 位置：スライド下部右端（細いフォントで日付・作者など）。
   * 用途：metadata の author / version / updated_at を表示。
   * スタイル：10pt、Italic、グレー #6B7280。

8. `visual_elements`

   * 位置：右側余白領域に図やアイコンを置くための枠。存在しない場合は空領域。
   * 用途：flowchart/diagram/table の有無フラグに応じて図を差し込む。

> 各プレースホルダは言語を区別して保有できる（例：`overview_box_ja` と `overview_box_en`）。
> プレースホルダは後述の「差し替え命令（JSON）」で参照して更新できる。

---

# 4. JSON → プレースホルダ マッピング（テンプレートが受け取るフィールド）

LLMへ渡す「元データJSON」から、テンプレートのどのプレースホルダに入れるかを明確に定義します。

* `article_id` → （メタ情報として `footnote` の data-attribute）
* `article_number` + `title_ja` → `header_title_ja`（例："15条：正確性・頑健性・セキュリティ"）
* `title_en` → `subheader_en`
* `article_text.ja` → `overview_box`（`overview_box_ja`）
* `article_text.en` → `overview_box_en`（もし英語版を作るなら）
* `requirements[]` → `requirements_list`：

  * 表示形式：各要件行は `• req_id (必須/任意): description_ja`
  * サブアイテム（sub_items）→ 箇条の下に小さいインデント箇条で表示（説明は `description_ja`）。
  * `verification_method` や `responsible_party` があれば、行末に小さなラベルとして添付（例：[検証: 性能テスト][責任: provider]）。
* `related_articles[]` → `related_articles_bar`（ボタン列）
* `metadata.author` / `metadata.updated_at` / `metadata.version` → `footnote`（例："AI法対応チーム — v1.0 — 2025-11-20"）
* `visual_elements` → `visual_elements`（図領域に図を入れる、falseなら空欄）

---

# 5. テンプレート出力の要求形式（LLMの返却フォーマット）

LLMには**二つの出力**を返すよう指示してください：

A) `template_definition`（スライド上での各プレースホルダ位置・大きさ・スタイルを定義したJSON）
B) `fill_commands`（プレースホルダへ何を入れるかを指定するJSON：後で別の文字列で差し替え可能）

**出力例（簡略）**：

```json
{
  "template_definition": {
    "size": {"width": 1920, "height": 1080},
    "placeholders": [
      {"name":"header_title_ja","x":30,"y":30,"width":1200,"height":120,"font":"Noto Sans JP","size":40,"weight":"700","align":"left"},
      {"name":"overview_box","x":200,"y":140,"width":1150,"height":180,"bg_color":"#FFFFFF","font":"Noto Sans JP","size":30,"weight":"700","align":"center"},
      ...
    ]
  },
  "fill_commands": [
    {"placeholder":"header_title_ja","lang":"ja","text":"15条：正確性・頑健性・セキュリティ"},
    {"placeholder":"overview_box","lang":"ja","text":"高リスクAIシステムは、適切なレベル..."},
    {"placeholder":"requirements_list","lang":"ja","items":[{"req_id":"15-1","label":"適切なレベルの精度...","verification":"性能テスト","responsible":"provider"}, ...]}
  ]
}
```

> 注：`template_definition.placeholders[].x/y/width/height` は px 指定（16:9なら 1920x1080 を基準）で出すと自動生成エンジンに親切です。

---

# 6. 差し替え（後から文字列で指示する例）

以降ユーザーが「overviewを差し替えて」と言うときの指示例（そのまま与えることができる）：

**命令スタイルA（簡潔）**：

```
差し替え: {"placeholder":"overview_box","lang":"ja","text":"新しい要約テキスト..."}
```

**命令スタイルB（複数一括差し替え）**：

```json
{
  "operations":[
    {"op":"set_text","placeholder":"header_title_ja","lang":"ja","text":"15条：正確性・頑健性・セキュリティ"},
    {"op":"set_text","placeholder":"overview_box","lang":"ja","text":"高リスクAIシステムは..."},
    {"op":"set_list","placeholder":"requirements_list","lang":"ja","items":[
      {"req_id":"15-1","text":"適切なレベルの精度、...","verification":"性能テスト"},
      {"req_id":"15-2","text":"精度、堅牢性の計測方法...","verification":"取扱説明書レビュー"}
    ]}
  ]
}
```

LLMに渡すときは、**必ず`placeholder`名**で指定してください。

---

# 7. 見た目の細かいルール（実装時の注意）

* `overview_box` の長文は最大2行に収める。3行以上になる場合はフォントサイズを 28→24 と段階的に下げるか、ボックスの高さを自動拡張する。
* `requirements_list` は要素が多い場合、左列に最大5件を表示し、残りは「続きは別スライド」または縮小フォント（14pt）で表示。
* 強調色（重要語）は #0B5FFF（青）。注意喚起は #D97706（オレンジ）。エラー・否定的なラベルは #DC2626（赤）。
* 箇条の先頭に `req_id` を**太字**で付ける（例：**15(1)**: 〜）。
* 右上の斜め帯は常にテンプレートに残し、必要ならそこにスライド番号を入れる（`slide_page` に対応）。

---

# 8. 出力の検証条件（LLMへの追加チェック）

テンプレート生成後、LLMは以下を検証して報告するよう指示してください：

* すべての必須プレースホルダ（上記8個）が定義されていること。
* `requirements_list` に `req_id` が存在すること。
* 色のコントラスト比（主要テキストと背景）が 4.5:1 以上であること（概算でOK）。
* 英語版が要求された場合、`_en` プレースホルダが生成されていること。

---

# 9. 実際にテンプレートを作らせるための**そのまま投げるプロンプト（日本語）** — コピペ可

以下をそのままLLMに投げるとテンプレートJSON（`template_definition` と `fill_commands`）を返します：

```
あなたはスライドテンプレート生成エンジンです。与えられた記事データ(JSON)を使って、16:9スライドのテンプレート定義（placeholders とその位置/スタイル）と、プレースホルダを埋めるための初期 fill_commands をJSONで出力してください。テンプレートは次のルールに従うこと：フォントは日本語は Noto Sans JP、英語は Noto Sans、タイトルは40pt Bold、overview_boxは28-32pt Boldの白地ボックス、箇条は16-18pt。プレースホルダ名は下記を必須で作ること：header_title_ja, header_title_en, subheader_en, overview_box, section_label, requirements_list, related_articles_bar, footnote, visual_elements。出力は以下の形に従え：{"template_definition":{...},"fill_commands":[...]}。template_definition.placeholdersは各 placeholderごとに x,y,width,height,font,size,weight,align,bg_color(optional) を含めること。fill_commandsは article_json を参照して placeholder に入れるテキストを言語ごとに設定すること。さらに生成結果を検証して、必須プレースホルダが揃っているか、requirements に req_id があるか、主要テキストの色コントラストが概算で十分かを報告すること。ここに元データを埋めます： <ここに先の article_15 の JSON を挿入> 
```

---

# 10. 追加の便利な機能（オプション）

* **自動改行／縮小ロジック**：長文が入った時に自動でフォントサイズを下げるルール。
* **スライド複製ルール**：requirements の長さに応じて自動で続きスライドを作る。
* **ローカライズフラグ**：`lang: "ja" | "en" | "both"` を受けて英日両表記（左右分割）などを自動配置。
* **アクセントテーマ切替**：コーポレート色を引数で差し替え可能にする（例 `accent_color:"#005BBB"`）。

---

# 11. 例：テンプレート差し替えリクエスト（実際に使う短いコマンド例）

* 単一差し替え：

```
{"op":"set_text","placeholder":"overview_box","lang":"ja","text":"高リスクAIシステムは、適切なレベルの精度、堅牢性、..."}
```

* 要件リスト差し替え（複数）：

```json
{"op":"set_list","placeholder":"requirements_list","lang":"ja","items":[
  {"req_id":"15-1","text":"適切なレベルの精度、堅牢性、安全性、サイバーセキュリティの達成","verification":"性能テスト"},
  {"req_id":"15-2","text":"精度、堅牢性の計測方法について委員会は...","verification":"取扱説明書レビュー"}
]}
```

---

これでテンプレート化のための自然言語指示と、以後プレースホルダを指定して差し替えるための命令フォーマットが揃いました。
ご希望なら、今から上の「そのまま投げるプロンプト」を使って私がテンプレート定義（`template_definition` + `fill_commands`）をこの会話内で**生成**します。生成を希望しますか？
