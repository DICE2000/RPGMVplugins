//=============================================================================
// NobleMushroom.js (1.10.0) + バックログ
// ----------------------------------------------------------------------------
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// NobleMushroomで実装されるノベルゲーム画面にバックログを（雑に）追加したものです。
//
// 変更履歴
// 2020/1/26
// Ver.0.26 Ver.1.10.0に合わせた。その影響でバックログが通常メッセージでも使えるようになった。
// 2018/12/16
// Ver.0.25 Ver.1.7.3にあわせてロードでウィンドウをそのままにする機能の削除。
//          アイコンの本文における折り返し描画に暫定対応。
// 2018/12/7
// Ver.0.24 undefinedがログに書き込まれる不具合に対処
// 2018/11/30
// Ver.0.23 バックログページ送りをタッチで送る際ロングプレスに反応しないよう修正
// 2018/11/29
// Ver.0.22 Ver.1.7.2にあわせた
//          バックログ送りの際のタッチ有効範囲を設定できるようにした
//          バックログの折り返し描画にバグがあったのを修正
//          シーンが遷移してもバックログがクリアされないようにした
//          既知の不具合：バックログが縦書きにならない（要望があるまでペンディング）
// 2018/11/27（暫定）
// Ver.0.21 ポーズメニュー無効の際のプラグインコマンド追加
//          CallHistory => CallNovelHistory
//          CallNovelLoad,CallNovelSave,CallNovelQLoad,CallNovelQSave追加
// 2018/11/23（暫定）
// Ver.0.20 ポーズメニュー無効の際のバックログ呼び出しを廃止
//          プラグインコマンドCallHistoryの導入
//          タッチでのページ送りをオプションで指定可能にした
// 2018/3/11
// Ver.0.19 テキスト一括表示が動いていなかったので修正。
//          ※自動改行を有効にしてギリギリまで文字を表示するとおそらくバグる。
// 2018/3/2
// Ver.0.18 テキスト一括表示を追加。
//          過去ログのテキストの折り返しの判定が甘かったので修正。
// 2018/2/22
// Ver.0.17 ロード時にファイルリストウィンドウを閉じない処理の修正。
// 2017/12/30
// Ver.0.16 ポーズメニューがOFFの時には無条件でバックログを呼び出すことにした。
// Ver.0.15 Ver.1.6.1に合わせた。（Ver.1.7.0の縦書きに対応するかどうかは未定）
//          相対フォントサイズ指定のバグを除去。
// Ver.0.14 Ver.1.6.0に合わせた。
// 2017/8/15
// Ver.0.13 過去ログの内容をロード時に復帰するオプション（おまけ）
//          既知の不具合：顔グラフィック・アイコン表示の復帰が行われない、\の除去が不徹底
//          制限事項：\v[n],\n[n],\p[n]の正常な表示
// 2017/8/13
// Ver.0.13（アルファ）
//          過去ログの内容をロード時に復帰する処理の見直し
//          制御文字の除去処理が書けていないがバックアップのために上書きしておく
// 2017/8/12
// Ver.0.12 過去ログの内容をセーブデータに含めるオプションの追加。
//          （過去ログのページによってはセーブデータが肥大化するので注意）
//          ポーズメニューの微調整。
// 2017/5/27
// Ver.0.11 過去ログに顔グラフィック表示とアイコン表示を追加。
// 2017/5/25
// Ver.0.10 NobleMushroomをver.1.5.2にバージョンアップ
//          競合する機能（グローバルセーブ抑止）の削除
// 2017/5/24
// Ver.0.09 ロード時に決定キーを押しっぱなしにしてしまうと
//          ロードがうまく行かなくなることの修正
//          オートセーブ抑止=>グローバルセーブ抑止に名称変更
//          オートセーブなし＆グローバルセーブ抑止でグローバルセーブ完全停止
// 2017/5/21
// Ver.0.08 オートセーブ抑止を追加。
// 2017/5/20
// Ver.0.07 バックログをマウス・タッチ操作でめくれるようにした
// 2017/1/10
// Ver.0.06 バックログの外見を変更できる設定項目を追加
//          バックログ表示の際のウィンドウ消去が不完全だったバグに対応
//          
// Ver.0.05 省略しすぎてログの改行処理に問題があったので修正
//          バックログとノベル画面の表示の互換性の強化
// 
// Ver.0.04 コードがあまりに汚いので大幅に整理した
//          （処理自体にはほとんど変更無し）
// 
// 2016/11/29
// Ver.0.03  ログプッシュにバグがあったので差し戻し
// 2016/11/21
// Ver.0.02  過去ログのY座標表示に余白の設定を追加
// 2016/11/7
// Ver.0.01b ログプッシュのタイミングを変更
// Ver.0.01a 初版にテキスト折り返し描画のバグがあったため差し替え
// Ver.0.01  初版
//
// Todo（優先度順）
// ・選択肢の文章を過去ログに残す
// →選んだ選択肢を残す？　選択肢自身も残す？　選択肢の描画を見ること
// 　要望があれば考える（実装するとは言っていない）
// ×過去ログ記録自体のONOFF
// →NobleMusshroom.jsを使いましょう
// ◎通常ウィンドウにも過去ログを実装する
// →Ver.1.10.0の実装にともなって実現した
//
// ----------------------------------------------------------------------------
// 22番目の素数(NAK)
// [Blog]   : http://dice2000.tumblr.com/
// [GitHub] : https://github.com/DICE2000
//=============================================================================
//
// 以下は NobleMushroom.jsの履歴です。
//
// NobleMushroom.js
// ----------------------------------------------------------------------------
// (C) 2016 DOWANGO Co., Ltd
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.10.0 2019/12/15 通常メッセージ表示のときもポーズメニューが表示されるよう仕様変更
//                   ポーズメニューの表示を禁止できるスイッチを追加
// 1.9.1 2019/12/15 1.9.0で通常ウィンドウモードのときにメニューを開くとエラーになる問題を修正
// 1.9.0 2019/12/07 通常のメニュー画面の代わりにポーズメニューを使用できる機能を追加
// 1.8.1 2019/06/27 クリック瞬間表示が有効なとき、\!以後の文章が瞬間表示されてしまう問題を修正
// 1.8.0 2019/03/04 ウィンドウクローズ時のポーズサインの色調を設定できるよう仕様変更
// 1.7.3 2018/12/14 ロード、クイックロード時に決定ボタンを押し続けているとロード処理が繰り返されてしまう問題を修正
//                  アイコン画像が自動改行時に考慮されない問題を修正
// 1.7.2 2018/09/25 MessageSkip.jsと組み合わせたときにオート待機フレームの際に取得するテキスト文字数が正しく取得できていなかった競合を解消
// 1.7.1 2017/12/30 相対フォントサイズにマイナス値を設定しても反映されなかった問題を修正
// 1.7.0 2017/12/17 ノベルメッセージの縦書きの対応
// 1.6.1 2017/10/29 場所移動のフェードアウト中にポーズメニューを押下すると、移動後にイベントが進まなくなる不具合を修正
// 1.6.0 2017/10/07 自動改行が有効な場合、自動改行位置と入力した改行が重なったときに2回改行されてしまう問題を修正
//                  パラメータの型指定機能に対応
// 1.5.2 2017/05/25 1.5.1で オートセーブ無効時にイベントメニューからセーブすると空でセーブされてしまう問題を修正
// 1.5.1 2017/04/03 オートセーブ無効時でも一部の条件でオートセーブされていた問題を修正
// 1.5.0 2016/12/05 高速でメッセージを送った場合に顔グラフィックを表示しようとするとエラーになる場合がある不具合を修正
//                  ノベル表示中に選択肢ウィンドウと数値入力ウィンドウの表示位置を調整できる機能を追加
// 1.4.0 2016/11/11 オートセーブ有効時、一定の手順を踏むとセーブデータをロードできなくなる不具合を修正
//                  選択肢表示後、直後にメッセージ表示がない場合でもウィンドウを閉じないよう修正
// 1.3.0 2016/09/28 ウィンドウ枠を自由に調整できる機能を追加
//                  ウィンドウの枠外をクリックしたときに文章を進めない設定を追加
//                  フォント名を指定できる機能を追加（デバイスにインストールされているフォントを使用します）
//                  明朝体、ゴシック体をどちらも使わない場合にフォントが小さく表示されてしまう問題を修正
//                  Edgeでフォントが小さく表示されてしまう問題を修正
// 1.2.0 2016/09/22 セーブファイルをひとつしか作成できない制約を解消
//                  オートセーブを単独で動作するよう修正
//                  イベント中にセーブやロードができるポーズメニューを追加
//                  クイックセーブ＆ロード機能を追加
//                  セーブファイルに表示できるチャプター表示機能を追加
// 1.1.0 2016/09/20 画面サイズ変更およびモバイル用の画面サイズ設定を追加
// 1.0.0 2016/08/16 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ノベルゲーム総合プラグイン(Ver.1.10.0) + バックログ
 * @author トリアコンタン（改造：NAK/22番目の素数）
 *
 * @param InitialViewType
 * @desc メッセージ表示タイプの初期値です。(0:通常 1:ノベル)
 * @default 1
 * @type select
 * @option Normal
 * @value 0
 * @option Novel
 * @value 1
 *
 * @param TitleViewType
 * @desc タイトル画面のコマンドウィンドウの表示方法です。(0:通常 1:ノベル)
 * @default 1
 * @type select
 * @option Normal
 * @value 0
 * @option Novel
 * @value 1
 *
 * @param WaitByCommand
 * @desc イベントコマンド「文章の表示」ひとつごとに続く文章の表示を待機します。(ON/OFF)
 * @default true
 * @type boolean
 *
 * @param VariableSpeed
 * @desc メッセージ表示速度を格納する変数の番号です。変数の値が1文字描画ごとに待機するフレーム数です。
 * @default 1
 * @type variable
 *
 * @param InitialSpeed
 * @desc 表示速度変数に格納されるメッセージ表示速度の初期値です。
 * @default 1
 * @type number
 *
 * @param RapidShowClick
 * @desc 文章の表示中に決定ボタンや左クリックで文章を瞬間表示します。(ON/OFF)
 * @default true
 * @type boolean
 *
 * @param ClickInFrame
 * @desc マウス関連の操作がメッセージウィンドウの枠内の場合でのみ有効になります。(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param AutoWordWrap
 * @desc 文章がウィンドウ枠に収まらない場合に自動で改行します。(ON/OFF)
 * @default true
 * @type boolean
 *
 * @param RelativeFontSize
 * @desc ノベルウィンドウのフォントサイズです。デフォルトフォントサイズからの相対値で指定します。
 * @default 6
 * @type number
 * @min -32
 * @max 32
 *
 * @param ViewMincho
 * @desc 明朝体系フォントがデバイスにインストールされていれば優先的に使用します。(ON/OFF)
 * @default true
 * @type boolean
 *
 * @param ViewGothic
 * @desc ゴシック体系フォントがデバイスにインストールされていれば優先的に使用します。(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param ViewCustomFont
 * @desc 指定されたフォントがデバイスにインストールされていれば優先的に使用します。(複数指定する場合はカンマ区切り)
 * @default
 *
 * @param SelectionPrefix
 * @desc 選択肢の接頭辞です。(0:使用しない 1:アルファベット 2:数字)
 * @default 0
 * @type select
 * @option No Use
 * @value 0
 * @option Alphabet
 * @value 1
 * @option Number
 * @value 2
 *
 * @param ScreenWidth
 * @desc 横方向の画面サイズです。0を指定すると変更しません。
 * @default 0
 * @type number
 *
 * @param ScreenHeight
 * @desc 縦方向の画面サイズです。0を指定すると変更しません。
 * @default 0
 * @type number
 *
 * @param ScreenWidthMobile
 * @desc スマホ等を使用した場合の横方向の画面サイズです。0を指定すると変更しません。
 * @default 0
 * @type number
 *
 * @param ScreenHeightMobile
 * @desc スマホ等を使用した場合の縦方向の画面サイズです。0を指定すると変更しません。
 * @default 0
 * @type number
 *
 * @param MobileMode
 * @desc PC上でもモバイルモードで実行します。主にテスト用に使用するオプションですが音が鳴らない制約があります。
 * @default false
 * @type boolean
 *
 * @param AutoSave
 * @desc 進行状況が自動でセーブされるようになります。ミニゲームとしてサウンドノベルを利用する場合などはOFFを推奨します。
 * @default true
 * @type boolean
 *
 * @param CanPause
 * @desc 表示タイプがノベルならイベント実行中にキャンセルボタンでポーズメニューが表示され、セーブやロードができます。
 * @default true
 * @type boolean
 *
 * @param UsePauseMenuAlways
 * @desc イベント実行時以外もポーズメニューを使用できます。その場合、通常のメニュー画面は使用不可となります。
 * @default false
 * @type boolean
 *
 * @param DisablePauseSwitch
 * @desc 指定した番号のスイッチがONのとき、ポーズメニューが使用できなくなります。
 * @default 0
 * @type switch
 *
 * @param NameAutoSave
 * @desc セーブ画面に表示されるオートセーブ名称です。
 * @default オートセーブ
 *
 * @param CommandLoad
 * @desc ポーズメニューの「ロード」のコマンド名称です。
 * @default ロード
 *
 * @param CommandQuickSave
 * @desc ポーズメニューの「クイックセーブ」のコマンド名称です。
 * @default クイックセーブ
 *
 * @param CommandQuickLoad
 * @desc ポーズメニューの「クイックロード」のコマンド名称です。
 * @default クイックロード
 *
 * @param VerticalWriting
 * @desc ノベル文章表示を縦書きにします。(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param PauseColor
 * @desc ウィンドウクローズ時のポーズサインの色調(R,G,B,A)です。通常時のポーズサインと差別化する場合に指定してください。
 * @default 255,0,0,128
 *
 * @type boolean
 * @param バックログコマンド
 * @desc ポーズメニューの「バックログ」のコマンド名称です。
 * @default テキスト履歴
 *
 * @param バックログ保持数
 * @desc バックログを保持するページ数です。
 * @default 30
 * @type number
 * 
 * @param バックログウィンドウ設定
 * @desc X座標,Y座標,幅(0で画面に合わせる),高さ(0で画面に合わせる),ウィンドウ種類(0:通常 1:暗くする 2:透明)
 * @default 0,0,0,0,0
 *
 * @param タッチでログのページ送り
 * @desc ウィンドウをタッチすることでログのページを操作します。
 * @default true
 * @type boolean
 * 
 * @param 前ページ送りのウィンドウタッチ範囲
 * @desc ログを前ページ送りする際のウィンドウタッチ有効範囲を指定します（x,yがタッチ時の座標）
 * @default x < Graphics.boxWidth / 4
 * @type string
 * 
 * @param 次ページ送りのウィンドウタッチ範囲
 * @desc ログを次ページ送りする際のウィンドウタッチ有効範囲を指定します（x,yがタッチ時の座標）
 * @default 3 * Graphics.boxWidth / 4 < x
 * @type string
 *
 * @param バックログ復帰
 * @desc ロード時にバックログを復帰します。
 * @default false
 * @type boolean
 * 
 * @param テキスト一括表示スイッチ
 * @desc 「オートセーブが無効の時に」この番号のスイッチがONであれば\wcまでテキストを一括表示します。0で無効。
 * @type switch
 * @default 0
 *
 * @help ノベルゲーム総合プラグインにバックログを追加したものです。
 * プラグインコマンドの追加はありません。
 * バックログコマンド・バックログ保持数・バックログウィンドウ設定について
 * 設定項目が追加されています。
 * 
 * ゲーム起動中には顔グラフィックや制御文字が除去されて正常な描画が行われますが、
 * ロード時に復帰するログではこれらの除去を行いません。
 * その他、ロード時の復帰は描画が狂いやすいので、おまけと考えてください。
 *
 * 【プラグインコマンド追加】
 * ポーズメニューを無効にした場合、以下のプラグインコマンドでバックログと
 * セーブロード処理を直接呼び出せるようになります。
 * 
 * CallNovelHistory
 * CallNovelLoad
 * CallNovelSave
 * CallNovelQLoad
 * CallNovelQSave
 * 
 * ----------↓以下はノベルゲーム総合プラグインのヘルプです。↓----------
 * 
 * It is a base plug-in for creating sound novel easily with RPG Maker MV
 * When applied, the display of the message window becomes the entire screen,
 * and the displayed message is not erased and accumulated on the screen.
 *
 * Cancel button or right click (multi-touch) while displaying the Novel window
 * The progress of the event stops and the pause menu is displayed.
 * From the pause menu you can.
 *
 * Save
 * Load
 * Quick Save
 * Quick Load
 * To Title
 * Cancel
 *
 * Control Character
 * \UL    # Wait for entering sentences Immediately cancel the wait and advance the event command.
 * \WC    # Close the window. It will be auto saved at this stage.
 * \MS[n] # Temporarily change the character display speed to "n" frame.
 *
 * Plugin Command
 *
 * NM_タイプ変更 1     # メッセージの表示タイプを変更します。
 *                       設定は場所移動後に反映されます。
 * NM_CHANGE_TYPE 1    # 同上
 * NM_再ウェイト       # 制御文字[\UL]で解除した入力待ちを再度有効にします。
 * NM_RE_WAIT          # 同上
 * NM_閉じる           # ウィンドウを明示的に閉じます。
 * NM_CLOSE            # 同上
 * NM_設定固定         # ウィンドウの表示設定を現在の設定で固定します。
 *                       固定された状態では以後の文章の表示での設定は無視されます。
 * NM_SETTING_FIXED    # 同上
 * NM_設定固定解除     # ウィンドウの表示設定固定を元に戻します。
 * NM_SETTING_RELEASE  # 同上
 * NM_名前入力 1       # アクターID[1]の名前を入力するポップアップを表示します(※)
 * NM_INPUT_NAME 1     # 同上
 * ※このコマンドはRPGアツマールでは使用できません。
 *
 * NM_チャプター設定 A # セーブファイルに出力するチャプタータイトルを設定します。
 * NM_SET_CHAPTER A    # 同上
 * NM_オートセーブ     # オートセーブを実行します。
 * NM_AUTO_SAVE        # 同上
 *
 * ・ノベルウィンドウの表示位置をX, Y, 横幅、高さを指定して調整できます。
 * 　引数を指定しなかった場合、表示位置をデフォルトに戻します。
 * NM_ノベルウィンドウ位置設定 0 0 600 300 # ウィンドウの矩形を設定します。
 * NM_SET_RECT_NOVEL_WINDOW 0 0 600 300    # 同上
 *
 * ・ノベルウィンドウの選択肢の中心座標をX, Yを指定して調整できます。
 * 　引数を指定しなかった場合、表示位置をデフォルトに戻します。
 * NM_ノベルコマンド位置設定 0 0 # ノベルコマンドの中心座標を設定します。
 * NM_SET_RECT_NOVEL_COMMAND 0 0 # 同上
 *
 * ・NM_タイプ変更 or NM_CHANGE_TYPE
 * メッセージを表示タイプを変更します。タイプには以下が存在します。
 *
 * 0:通常のメッセージ表示です。
 * 1:ノベルメッセージ表示です。メッセージが画面全体に表示され、蓄積されます。
 *   選択肢や数値入力なども合わせて表示方法が自動調整されます。
 *
 * 設定変更は場所移動するまで反映されないので注意してください。
 *
 * ・NM_設定固定 or NM_SETTING_FIXED
 * ウィンドウの設定を現在のもので固定します。対象は以下の通りです。
 *
 * 1. 顔グラフィックの設定
 * 2. タイプ(ウィンドウ、暗くする、透明)
 * 3. 位置(上　中　下)
 *
 * 固定している限り、文章の表示での設定は無視されます。
 * 再度有効にする場合は、NM_設定固定解除を実行してください。
 *
 * ・NM_名前入力 or NM_INPUT_NAME
 * 専用の画面を使わない簡易版の名前入力の処理です。
 * 第二引数に文字列を指定すると、ダイアログに指定した説明が表示されます。
 * 入力値を空欄にする、もしくはキャンセルした場合、名前は変更されません。
 * (例)
 * NM_名前入力 1 名前を入力してください。
 *
 * ・NM_ノベルウィンドウ位置設定 or NM_SET_RECT_NOVEL_WINDOW
 * 通常は画面全体に表示されるノベルウィンドウの表示位置(X, Y, 横幅, 高さ)を
 * 指定できます。引数を指定しないと、デフォルトサイズに戻ります。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
/*:ja
 * @plugindesc ノベルゲーム総合プラグイン(Ver.1.10.0) + バックログ
 * @author トリアコンタン（改造：NAK/22番目の素数）
 *
 * @param 表示タイプ初期値
 * @desc メッセージ表示タイプの初期値です。(0:通常 1:ノベル)
 * @default 1
 * @type select
 * @option 通常
 * @value 0
 * @option ノベル
 * @value 1
 *
 * @param タイトル表示タイプ
 * @desc タイトル画面のコマンドウィンドウの表示方法です。(0:通常 1:ノベル)
 * @default 1
 * @type select
 * @option 通常
 * @value 0
 * @option ノベル
 * @value 1
 *
 * @param コマンド単位ウェイト
 * @desc イベントコマンド「文章の表示」ひとつごとに続く文章の表示を待機します。(ON/OFF)
 * @default true
 * @type boolean
 *
 * @param 表示速度変数
 * @desc メッセージ表示速度を格納する変数の番号です。変数の値が1文字描画ごとに待機するフレーム数です。
 * @default 1
 * @type variable
 *
 * @param 表示速度初期値
 * @desc 表示速度変数に格納されるメッセージ表示速度の初期値です。
 * @default 1
 * @type number
 *
 * @param クリック瞬間表示
 * @desc 文章の表示中に決定ボタンや左クリックで文章を瞬間表示します。(ON/OFF)
 * @default true
 * @type boolean
 *
 * @param クリック範囲限定
 * @desc マウス関連の操作がメッセージウィンドウの枠内の場合でのみ有効になります。(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param 自動改行
 * @desc 文章がウィンドウ枠に収まらない場合に自動で改行します。(ON/OFF)
 * @default true
 * @type boolean
 *
 * @param 相対フォントサイズ
 * @desc ノベルウィンドウのフォントサイズです。デフォルトフォントサイズからの相対値で指定します。
 * @default 6
 * @type number
 * @min -32
 * @max 32
 *
 * @param 明朝体表示
 * @desc 明朝体系フォントがデバイスにインストールされていれば優先的に使用します。(ON/OFF)
 * @default true
 * @type boolean
 *
 * @param ゴシック体表示
 * @desc ゴシック体系フォントがデバイスにインストールされていれば優先的に使用します。(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param 固有フォント表示
 * @desc 指定されたフォントがデバイスにインストールされていれば優先的に使用します。(複数指定する場合はカンマ区切り)
 * @default
 *
 * @param 選択肢接頭辞
 * @desc 選択肢の接頭辞です。(0:使用しない 1:アルファベット 2:数字)
 * @default 0
 * @type select
 * @option 使用しない
 * @value 0
 * @option アルファベット
 * @value 1
 * @option 数字
 * @value 2
 *
 * @param 画面横サイズ
 * @desc 横方向の画面サイズです。0を指定すると変更しません。
 * @default 0
 * @type number
 *
 * @param 画面縦サイズ
 * @desc 縦方向の画面サイズです。0を指定すると変更しません。
 * @default 0
 * @type number
 *
 * @param モバイル画面横サイズ
 * @desc スマホ等を使用した場合の横方向の画面サイズです。0を指定すると変更しません。
 * @default 0
 * @type number
 *
 * @param モバイル画面縦サイズ
 * @desc スマホ等を使用した場合の縦方向の画面サイズです。0を指定すると変更しません。
 * @default 0
 * @type number
 *
 * @param モバイルモード
 * @desc PC上でもモバイルモードで実行します。主にテスト用に使用するオプションですが音が鳴らない制約があります。
 * @default false
 * @type boolean
 *
 * @param オートセーブ
 * @desc 進行状況が自動でセーブされるようになります。ミニゲームとしてサウンドノベルを利用する場合などはOFFを推奨します。
 * @default true
 * @type boolean
 *
 * @param ポーズ可能
 * @desc イベント実行中にキャンセルボタンでポーズメニューが表示され、セーブやロードができます。
 * @default true
 * @type boolean
 *
 * @param 常にポーズメニュー使用
 * @desc イベント実行時以外もポーズメニューを使用できます。その場合、通常のメニュー画面は使用不可となります。
 * @default false
 * @type boolean
 *
 * @param ポーズ禁止スイッチ
 * @desc 指定した番号のスイッチがONのとき、ポーズメニューが使用できなくなります。
 * @default 0
 * @type switch
 *
 * @param ポーズカラー
 * @desc ウィンドウクローズ時のポーズサインの色調(R,G,B,A)です。通常時のポーズサインと差別化する場合に指定してください。
 * @default 255,0,0,128
 *
 * @param オートセーブ名称
 * @desc セーブ画面に表示されるオートセーブ名称です。
 * @default オートセーブ
 *
 * @param ロードコマンド
 * @desc ポーズメニューの「ロード」のコマンド名称です。
 * @default ロード
 *
 * @param Qセーブコマンド
 * @desc ポーズメニューの「クイックセーブ」のコマンド名称です。
 * @default クイックセーブ
 *
 * @param Qロードコマンド
 * @desc ポーズメニューの「クイックロード」のコマンド名称です。
 * @default クイックロード
 *
 * @param 縦書き
 * @desc ノベル文章表示を縦書きにします。(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param バックログコマンド
 * @desc ポーズメニューの「バックログ」のコマンド名称です。
 * @default テキスト履歴
 *
 * @param バックログ保持数
 * @desc バックログを保持するページ数です。
 * @default 30
 * @type number
 * 
 * @param バックログウィンドウ設定
 * @desc X座標,Y座標,幅(0で画面に合わせる),高さ(0で画面に合わせる),ウィンドウ種類(0:通常 1:暗くする 2:透明)
 * @default 0,0,0,0,0
 * 
 * @param タッチでページ送り
 * @desc ウィンドウの左端／右端をタッチするとログのページ送りをします。
 * @default true
 * @type boolean
 *
 * @param 前ページ送りのウィンドウタッチ範囲
 * @desc ログを前ページ送りする際のウィンドウタッチ有効範囲を指定します（x,yがタッチ時の座標）
 * @default x < Graphics.boxWidth / 4
 * @type string
 * 
 * @param 次ページ送りのウィンドウタッチ範囲
 * @desc ログを次ページ送りする際のウィンドウタッチ有効範囲を指定します（x,yがタッチ時の座標）
 * @default 3 * Graphics.boxWidth / 4 < x
 * @type string
 *
 * @param バックログ復帰
 * @desc ロード時にバックログを復帰します。
 * @default false
 * @type boolean
 *
 * @param テキスト一括表示スイッチ
 * @desc 「オートセーブが無効の時に」この番号のスイッチがONであれば\wcまでテキストを一括表示します。0で無効。
 * @type switch
 * @default 0
 *
 * @help ノベルゲーム総合プラグインにバックログを追加したものです。
 * 
 * バックログコマンド・バックログ保持数・バックログウィンドウ設定について
 * 設定項目が追加されています。
 * 
 * ゲーム起動中には顔グラフィックや制御文字が除去されて正常な描画が行われますが、
 * ロード時に復帰するログではこれらの除去を行いません。
 * その他、ロード時の復帰は描画が狂いやすいので、おまけと考えてください。
 *
 *【プラグインコマンド追加】
 * ポーズメニューを無効にした場合、以下のプラグインコマンドでバックログと
 * セーブロード処理を直接呼び出せるようになります。
 * 
 * CallNovelHistory
 * CallNovelLoad
 * CallNovelSave
 * CallNovelQLoad
 * CallNovelQSave
 * 
 * ----------↓以下はノベルゲーム総合プラグインのヘルプです。↓----------
 *
 * RPGツクールMVでサウンドノベルを手軽に作成するためのベースプラグインです。
 * 適用すると、メッセージウィンドウの表示が画面全体になり
 * 表示したメッセージが消去されず画面に蓄積されるようになります。
 *
 * ノベルウィンドウを表示中にキャンセルボタンまたは右クリック（マルチタッチ）すると
 * イベントの進行が停止し、ポーズメニューが表示されます。ポーズメニューからは
 * 以下が可能です。
 *
 * ・セーブ
 * ・ロード
 * ・クイックセーブ（前回ロードしたデータに再度セーブ）
 * ・クイックロード（最新のデータをロード）
 * ・タイトルへ（タイトル画面に戻る）
 * ・やめる（イベントに戻る）
 *
 * また、オートセーブを有効にすると進行状況が自動でセーブされるようになります。
 * オートセーブ機能は、ノベルウィンドウとは別に単独で動作可能です。
 * セーブされるタイミングは以下の通りです。
 *
 * ・ノベルウィンドウが閉じられたとき（通常ウィンドウの場合はセーブされません）
 * ・場所移動した直後
 * ・メニューや戦闘からマップに戻った直後
 * ・「チャプター」を変更した直後
 * ・任意のタイミング（プラグインコマンド実行）
 *
 * 制御文字詳細
 *  文章中に含めることで効果を発揮します。
 * \UL    # 文章の入力待ちウェイトを即解除してイベント命令を次に進めます。
 * \WC    # ウィンドウを閉じます。この段階でオートセーブされます。
 * \MS[n] # 文字の表示スピードを一時的に「n」フレームに変更します。
 *
 * プラグインコマンド概要
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * NM_タイプ変更 1     # メッセージの表示タイプを変更します。
 *                       設定は場所移動後に反映されます。
 * NM_CHANGE_TYPE 1    # 同上
 * NM_再ウェイト       # 制御文字[\UL]で解除した入力待ちを再度有効にします。
 * NM_RE_WAIT          # 同上
 * NM_閉じる           # ウィンドウを明示的に閉じます。
 * NM_CLOSE            # 同上
 * NM_設定固定         # ウィンドウの表示設定を現在の設定で固定します。
 *                       固定された状態では以後の文章の表示での設定は無視されます。
 * NM_SETTING_FIXED    # 同上
 * NM_設定固定解除     # ウィンドウの表示設定固定を元に戻します。
 * NM_SETTING_RELEASE  # 同上
 * NM_名前入力 1       # アクターID[1]の名前を入力するポップアップを表示します(※)
 * NM_INPUT_NAME 1     # 同上
 * ※このコマンドはRPGアツマールでは使用できません。
 *
 * NM_チャプター設定 A # セーブファイルに出力するチャプタータイトルを設定します。
 * NM_SET_CHAPTER A    # 同上
 * NM_オートセーブ     # オートセーブを実行します。
 * NM_AUTO_SAVE        # 同上
 *
 * ・ノベルウィンドウの表示位置をX, Y, 横幅、高さを指定して調整できます。
 * 　引数を指定しなかった場合、表示位置をデフォルトに戻します。
 * NM_ノベルウィンドウ位置設定 0 0 600 300 # ウィンドウの矩形を設定します。
 * NM_SET_RECT_NOVEL_WINDOW 0 0 600 300    # 同上
 *
 * ・ノベルウィンドウの選択肢の中心座標をX, Yを指定して調整できます。
 * 　引数を指定しなかった場合、表示位置をデフォルトに戻します。
 * NM_ノベルコマンド位置設定 0 0 # ノベルコマンドの中心座標を設定します。
 * NM_SET_RECT_NOVEL_COMMAND 0 0 # 同上
 *
 * ・NM_タイプ変更 or NM_CHANGE_TYPE
 * メッセージを表示タイプを変更します。タイプには以下が存在します。
 *
 * 0:通常のメッセージ表示です。
 * 1:ノベルメッセージ表示です。メッセージが画面全体に表示され、蓄積されます。
 *   選択肢や数値入力なども合わせて表示方法が自動調整されます。
 *
 * 設定変更は場所移動するまで反映されないので注意してください。
 *
 * ・NM_設定固定 or NM_SETTING_FIXED
 * ウィンドウの設定を現在のもので固定します。対象は以下の通りです。
 *
 * 1. 顔グラフィックの設定
 * 2. タイプ(ウィンドウ、暗くする、透明)
 * 3. 位置(上　中　下)
 *
 * 固定している限り、文章の表示での設定は無視されます。
 * 再度有効にする場合は、NM_設定固定解除を実行してください。
 *
 * ・NM_名前入力 or NM_INPUT_NAME
 * 専用の画面を使わない簡易版の名前入力の処理です。
 * 第二引数に文字列を指定すると、ダイアログに指定した説明が表示されます。
 * 入力値を空欄にする、もしくはキャンセルした場合、名前は変更されません。
 * (例)
 * NM_名前入力 1 名前を入力してください。
 *
 * ・NM_ノベルウィンドウ位置設定 or NM_SET_RECT_NOVEL_WINDOW
 * 通常は画面全体に表示されるノベルウィンドウの表示位置(X, Y, 横幅, 高さ)を
 * 指定できます。引数を指定しないと、デフォルトサイズに戻ります。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var pluginName    = 'NobleMushroom_with_history';
    var metaTagPrefix = 'NM_';
    var setting       = {
        unlockCode      : 'UL',
        windowCloseCode : 'WC',
        messageSpeedCode: 'MS',
    };

    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value === null ? '' : value;
    };

    var getParamBoolean = function(paramNames) {
        var value = (getParamOther(paramNames) || '').toUpperCase();
        return value === 'ON' || value === 'TRUE';
    };

    var getParamArrayNumber = function (paramNames, min, max) {
        var values = (getParamOther(paramNames) || '').split(',');
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return values.map(function(value) {
            return parseInt(value).clamp(min, max);
        });
    };

    var getArgString = function(arg, upperFlg) {
        arg = convertEscapeCharacters(arg);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg), 10) || 0).clamp(min, max);
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramInitialViewType    = getParamNumber(['InitialViewType', '表示タイプ初期値'], 0);
    var paramTitleViewType      = getParamNumber(['TitleViewType', 'タイトル表示タイプ'], 0);
    var paramVariableSpeed      = getParamNumber(['VariableSpeed', '表示速度変数'], 1, 5000);
    var paramRapidShowClick     = getParamBoolean(['RapidShowClick', 'クリック瞬間表示']);
    var paramClickInFrame       = getParamBoolean(['ClickInFrame', 'クリック範囲限定']);
    var paramInitialSpeed       = getParamNumber(['InitialSpeed', '表示速度初期値'], 0);
    var paramWaitByCommand      = getParamBoolean(['WaitByCommand', 'コマンド単位ウェイト']);
    var paramAutoWordWrap       = getParamBoolean(['AutoWordWrap', '自動改行']);
    var paramRelativeFontSize   = getParamNumber(['RelativeFontSize', '相対フォントサイズ'], -32, 32);
    var paramViewMincho         = getParamBoolean(['ViewMincho', '明朝体表示']);
    var paramViewGothic         = getParamBoolean(['ViewGothic', 'ゴシック体表示']);
    var paramViewCustomFont     = getParamString(['ViewCustomFont', '固有フォント表示']);
    var paramSelectionPrefix    = getParamNumber(['SelectionPrefix', '選択肢接頭辞'], 0, 2);
    var paramScreenWidth        = getParamNumber(['ScreenWidth', '画面横サイズ'], 0);
    var paramScreenHeight       = getParamNumber(['ScreenHeight', '画面縦サイズ'], 0);
    var paramScreenWidthMobile  = getParamNumber(['ScreenWidthMobile', 'モバイル画面横サイズ'], 0);
    var paramScreenHeightMobile = getParamNumber(['ScreenHeightMobile', 'モバイル画面縦サイズ'], 0);
    var paramMobileMode         = getParamBoolean(['MobileMode', 'モバイルモード']);
    var paramAutoSave           = getParamBoolean(['AutoSave', 'オートセーブ']);
    var paramCanPause           = getParamBoolean(['CanPause', 'ポーズ可能']);
    var paramNameAutoSave       = getParamString(['NameAutoSave', 'オートセーブ名称']);
    var paramCommandLoad        = getParamString(['CommandLoad', 'ロードコマンド']);
    var paramCommandQuickLoad   = getParamString(['CommandQuickSave', 'Qロードコマンド']);
    var paramCommandQuickSave   = getParamString(['CommandQuickLoad', 'Qセーブコマンド']);
    var paramVerticalWriting    = getParamBoolean(['VerticalWriting', '縦書き']);
    var paramPauseColor         = getParamArrayNumber(['PauseColor', 'ポーズカラー'], 0, 255);
    var paramUsePauseMenuAlways = getParamBoolean(['UsePauseMenuAlways', '常にポーズメニュー使用']);
    var paramDisablePauseSwitch = getParamNumber(['DisablePauseSwitch', 'ポーズ禁止スイッチ'], 0);

    //=============================================================================
    // インタフェースの定義
    //=============================================================================
    var _InterfaceWindow_Message      = Window_Message;
    var _InterfaceWindow_TitleCommand = Window_TitleCommand;
    var _InterfaceWindow_ChoiceList   = Window_ChoiceList;
    var _InterfaceWindow_NumberInput  = Window_NumberInput;

    //=============================================================================
    // Utils
    //  文字列の挿入処理
    //=============================================================================
    Utils.spliceString = function(originalString, index, howMany, addString) {
        if (howMany < 0) howMany = 0;
        return (originalString.slice(0, index) + addString + originalString.slice(index + howMany));
    };

    var _Utils_isMobileDevice = Utils.isMobileDevice;
    Utils.isMobileDevice      = function() {
        return paramMobileMode || _Utils_isMobileDevice.apply(this, arguments);
    };

    Utils.isMsEdge = function() {
        var r = /edge/i;
        return !!navigator.userAgent.match(r);
    };

    //=============================================================================
    // TouchInput
    //  ホイール回転時に座標を記録
    //=============================================================================
    var _TouchInput__onWheel = TouchInput._onWheel;
    TouchInput._onWheel      = function(event) {
        _TouchInput__onWheel.apply(this, arguments);
        this._x = Graphics.pageToCanvasX(event.pageX);
        this._y = Graphics.pageToCanvasY(event.pageY);
    };

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        if (!command.match(new RegExp('^' + metaTagPrefix))) return;
        this.pluginCommandBlueMushroom(command.replace(metaTagPrefix, ''), args);
    };

    Game_Interpreter.prototype.pluginCommandBlueMushroom = function(command, args) {
        switch (getCommandName(command)) {
            case '再ウェイト' :
            case 'RE_WAIT' :
                if ($gameMessage.isBusy()) this.setWaitMode('message');
                break;
            case 'タイプ変更' :
            case 'CHANGE_TYPE' :
                $gameSystem.changeMessageType(getArgNumber(args[0], 0));
                break;
            case '閉じる' :
            case 'CLOSE' :
                $gameMessage.setCloseForce(true);
                break;
            case '設定固定' :
            case 'SETTING_FIXED' :
                $gameSystem.setMessageSettingFixed(true);
                break;
            case '設定固定解除' :
            case 'SETTING_RELEASE' :
                $gameSystem.setMessageSettingFixed(false);
                break;
            case '名前入力' :
            case 'INPUT_NAME' :
                $gameMessage.popupNameInputPrompt(getArgNumber(args[0], 1), getArgString(args[1]));
                break;
            case 'チャプター設定' :
            case 'SET_CHAPTER' :
                $gameSystem.setChapterTitle(getArgString(args[0]));
                $gameSystem.executeAutoSave();
                break;
            case 'オートセーブ' :
            case 'AUTO_SAVE' :
                $gameSystem.executeAutoSave();
                break;
            case 'ノベルウィンドウ位置設定' :
            case 'SET_RECT_NOVEL_WINDOW' :
                var rect = [];
                if (args.length > 0) {
                    rect[0] = getArgNumber(args[0], 0);
                    rect[1] = getArgNumber(args[1], 0);
                    rect[2] = getArgNumber(args[2], 1);
                    rect[3] = getArgNumber(args[3], 1);
                }
                $gameSystem.setNovelWindowRectangle.apply($gameSystem, rect);
                break;
            case 'ノベルコマンド位置設定':
            case 'SET_RECT_NOVEL_COMMAND':
                var position = [];
                if (args.length > 0) {
                    position[0] = getArgNumber(args[0], 0);
                    position[1] = getArgNumber(args[1], 0);
                }
                $gameSystem.setNovelCommandPosition.apply($gameSystem, position);
                break;
        }
    };

    var _Game_Interpreter_command101      = Game_Interpreter.prototype.command101;
    Game_Interpreter.prototype.command101 = function() {
        if (!$gameMessage.isBusy()) {
            $gameMessage.setInterpreter(this);
        }
        _Game_Interpreter_command101.apply(this, arguments);
    };

    var _Game_Interpreter_update      = Game_Interpreter.prototype.update;
    Game_Interpreter.prototype.update = function() {
        if ($gameMessage.isPause()) return;
        _Game_Interpreter_update.apply(this, arguments);
    };

    Game_Interpreter.prototype.rewindIndexUntilShowText = function() {
        this._originalIndex = this._index;
        while(this._list[this._index].code !== 101 && this._index > 1) {
            this._index--;
        }
        this._index--;
    };

    Game_Interpreter.prototype.restoreIndex = function() {
        if (this._originalIndex !== undefined) {
            this._index = this._originalIndex;
        }
    };

    Game_Interpreter.prototype.isMessageWait = function() {
        return this._waitMode === 'message';
    };

    //=============================================================================
    // Game_System
    //  全画面ウィンドウの有効フラグを管理します。
    //=============================================================================
    var _Game_System_initialize      = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.apply(this, arguments);
        this._messageViewType      = paramInitialViewType;
        this._messageSetting       = null;
        this._chapterTitle         = '';
        this._novelWindowRectangle = null;
        this._novelCommandPosition = null;
    };

    Game_System.prototype.getNovelWindowRectangle = function() {
        return this._novelWindowRectangle;
    };

    Game_System.prototype.setNovelWindowRectangle = function(x, y, width, height) {
        if (arguments.length === 0) {
            this._novelWindowRectangle = null;
        } else {
            this._novelWindowRectangle = new Rectangle(x, y, width, height);
        }
    };

    Game_System.prototype.getNovelCommandPosition = function() {
        return this._novelCommandPosition;
    };

    Game_System.prototype.setNovelCommandPosition = function(x, y) {
        if (arguments.length === 0) {
            this._novelCommandPosition = null;
        } else {
            this._novelCommandPosition = new Point(x, y);
        }
    };

    Game_System.prototype.getMessageType = function() {
        return this._messageViewType;
    };

    Game_System.prototype.isMessageTypeNovel = function() {
        return this._messageViewType === 1;
    };

    Game_System.prototype.changeMessageType = function(value) {
        this._messageViewType = value.clamp(0, 1);
    };

    Game_System.prototype.setMessageSettingFixed = function(value) {
        this._messageSetting = !!value;
    };

    Game_System.prototype.isMessageSettingFixed = function() {
        return this._messageSetting;
    };

    Game_System.prototype.setFaceImage = function(faceName, faceIndex) {
        if (!this.isMessageSettingFixed()) {
            this._faceName  = faceName;
            this._faceIndex = faceIndex;
        }
    };

    Game_System.prototype.setBackground = function(background) {
        if (!this.isMessageSettingFixed()) {
            this._background = background;
        }
    };

    Game_System.prototype.setPositionType = function(positionType) {
        if (!this.isMessageSettingFixed()) {
            this._positionType = positionType;
        }
    };

    Game_System.prototype.executeAutoSave = function() {
        this.onBeforeSave();
        DataManager.saveGameAuto();
    };

    Game_System.prototype.getChapterTitle = function() {
        return this._chapterTitle || '';
    };

    Game_System.prototype.setChapterTitle = function(value) {
        this._chapterTitle = value;
    };

    //=============================================================================
    // Game_Message
    //  ウェイト解除処理を追加定義します。
    //=============================================================================
    var _Game_Message_clear      = Game_Message.prototype.clear;
    Game_Message.prototype.clear = function() {
        _Game_Message_clear.apply(this, arguments);
        this._interpreter = null;
        this._closeForce  = false;
    };

    Game_Message.prototype.setPause = function(value) {
        this._pauseing = !!value;
    };

    Game_Message.prototype.isPause = function() {
        return !!this._pauseing;
    };

    Game_Message.prototype.setInterpreter = function(interpreter) {
        this._interpreter = interpreter;
    };

    Game_Message.prototype.setWaitMode = function(value) {
        if (this._interpreter) {
            this._interpreter.setWaitMode(value);
        }
    };

    Game_Message.prototype.setNoWait = function() {
        if (this._texts.length > 0) {
            this._texts[this._texts.length - 1] += '\\^';
        }
    };

    Game_Message.prototype.setCloseForce = function(value) {
        this._closeForce = !!value;
    };

    Game_Message.prototype.isCloseForce = function() {
        return this._closeForce;
    };

    var _Game_Message_setFaceImage      = Game_Message.prototype.setFaceImage;
    Game_Message.prototype.setFaceImage = function(faceName, faceIndex) {
        _Game_Message_setFaceImage.apply(this, arguments);
        $gameSystem.setFaceImage(faceName, faceIndex);
    };

    var _Game_Message_setBackground      = Game_Message.prototype.setBackground;
    Game_Message.prototype.setBackground = function(background) {
        _Game_Message_setBackground.apply(this, arguments);
        $gameSystem.setBackground(background);
    };

    var _Game_Message_setPositionType      = Game_Message.prototype.setPositionType;
    Game_Message.prototype.setPositionType = function(positionType) {
        _Game_Message_setPositionType.apply(this, arguments);
        $gameSystem.setPositionType(positionType);
    };

    var _Game_Message_faceName      = Game_Message.prototype.faceName;
    Game_Message.prototype.faceName = function() {
        return _Game_Message_faceName.apply($gameSystem.isMessageSettingFixed() ? $gameSystem : this, arguments);
    };

    var _Game_Message_faceIndex      = Game_Message.prototype.faceIndex;
    Game_Message.prototype.faceIndex = function() {
        return _Game_Message_faceIndex.apply($gameSystem.isMessageSettingFixed() ? $gameSystem : this, arguments);
    };

    var _Game_Message_background      = Game_Message.prototype.background;
    Game_Message.prototype.background = function() {
        return _Game_Message_background.apply($gameSystem.isMessageSettingFixed() ? $gameSystem : this, arguments);
    };

    var _Game_Message_positionType      = Game_Message.prototype.positionType;
    Game_Message.prototype.positionType = function() {
        return _Game_Message_positionType.apply($gameSystem.isMessageSettingFixed() ? $gameSystem : this, arguments);
    };

    Game_Message.prototype.popupNameInputPrompt = function(actorId, message) {
        var actor        = $gameActors.actor(actorId);
        var defaultValue = actor ? actor.name() : '';
        var result       = window.prompt(message || '', defaultValue);
        if (Utils.isNwjs()) {
            var gui = require('nw.gui');
            var win = gui.Window.get();
            win.focus();
            Input.clear();
        }
        if (result) actor.setName(result);
    };

    Game_Message.prototype.canCallPause = function() {
        if (!paramCanPause) {
            return false;
        }
        if (!$gameMap.isEventRunning() && !paramUsePauseMenuAlways) {
            return false;
        }
        if ($gameMap.isEventRunning() && !$gameMap.isEventMessageWait()) {
            return false;
        }
        if ($gamePlayer.isTransferring()) {
            return false;
        }
        if (this.isPause()) {
            return false;
        }
        if ($gameSwitches.value(paramDisablePauseSwitch)) {
            return false;
        }
        return true;
    };

    //=============================================================================
    // Game_Map
    //  メッセージ表示待機中かどうかを返します。
    //=============================================================================
    Game_Map.prototype.isEventMessageWait = function() {
        return this._interpreter.isMessageWait();
    };

    Game_Map.prototype.executeAutoSaveForPause = function() {
        if (!this.isEventRunning()) {
            $gameSystem.executeAutoSave();
        } else if (!$gameSystem.isMessageTypeNovel()) {
            this._interpreter.rewindIndexUntilShowText();
            $gameSystem.executeAutoSave();
            this._interpreter.restoreIndex();
        }
    };

    //=============================================================================
    // SceneManager
    //  画面サイズを再設定します。
    //=============================================================================
    var _SceneManager_initialize = SceneManager.initialize;
    SceneManager.initialize      = function() {
        _SceneManager_initialize.apply(this, arguments);
        StorageManager.makeSaveDirectly();
    };

    var _SceneManager_initGraphics = SceneManager.initGraphics;
    SceneManager.initGraphics      = function() {
        this.setScreenSize();
        _SceneManager_initGraphics.apply(this, arguments);
    };

    SceneManager.setScreenSize = function() {
        var width, height;
        if (Utils.isMobileDevice()) {
            width  = paramScreenWidthMobile || paramScreenWidth;
            height = paramScreenHeightMobile || paramScreenHeight;
        } else {
            width  = paramScreenWidth;
            height = paramScreenHeight;
        }
        this._screenWidth  = width || this._screenWidth;
        this._screenHeight = height || this._screenHeight;
        this._boxWidth     = width || this._boxWidth;
        this._boxHeight    = height || this._boxHeight;
        if (width || height) {
            var dw = this._screenWidth - window.innerWidth;
            var dh = this._screenHeight - window.innerHeight;
            window.moveBy(-dw / 2, -dh / 2);
            window.resizeBy(dw, dh);
        }
    };

    //=============================================================================
    // DataManager
    //  オートセーブを追加定義します。
    //=============================================================================
    Object.defineProperty(DataManager, '_lastAccessedId', {
        get: function() {
            return this.__lastAccessedId;
        },
        set: function(value) {
            if (value !== this.getAutoSaveId()) {
                this.__lastAccessedId = value;
            }
        }
    });

    DataManager._isShiftAutoSave = false;

    var _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects      = function() {
        _DataManager_createGameObjects.apply(this, arguments);
        $gameVariables.setValue(paramVariableSpeed, paramInitialSpeed);
    };

    var _DataManager_makeSavefileInfo = DataManager.makeSavefileInfo;
    DataManager.makeSavefileInfo      = function() {
        var info     = _DataManager_makeSavefileInfo.apply(this, arguments);
        info.chapter = $gameSystem.getChapterTitle();
        return info;
    };

    DataManager.getAutoSaveId = function() {
        return this.maxSavefiles() + 1;
    };

    DataManager.shiftAutoSave = function(saveFileId) {
        this._isShiftAutoSave = true;
        var result            = this.saveGame(saveFileId);
        this._isShiftAutoSave = false;
        return result;
    };

    DataManager.saveGameAuto = function() {
        this._processAutoSave = true;
        if (paramAutoSave) {
            this.saveGameWithoutRescue(this.getAutoSaveId());
        } else {
            var json = JsonEx.stringify(this.makeSaveContents());
            if (json.length >= 200000) {
                console.warn('Save data too big!');
            }
            StorageManager.save(this.getAutoSaveId(), json);
        }
        this._processAutoSave = false;
    };

    var _DataManager_latestSavefileId = DataManager.latestSavefileId;
    DataManager.latestSavefileId      = function() {
        var id = _DataManager_latestSavefileId.apply(this, arguments);
        return this.convertToGlobalFileId(id);
    };

    var _DataManager_loadGame = DataManager.loadGame;
    DataManager.loadGame      = function(savefileId) {
        arguments[0] = this.convertToAutoSaveId(savefileId);
        return _DataManager_loadGame.apply(this, arguments);
    };

    DataManager.loadGameReserve = function() {
        return this.loadGame(this._resvereLoadFileId);
    };

    DataManager.reserveLoad = function(savefileId) {
        savefileId = this.convertToAutoSaveId(savefileId);
        var result = this.isThisGameFile(savefileId);
        if (result) {
            this._resvereLoadFileId = savefileId;
        }
        return result;
    };

    DataManager.convertToAutoSaveId = function(savefileId) {
        return savefileId === 0 ? this.getAutoSaveId() : savefileId;
    };

    DataManager.convertToGlobalFileId = function(savefileId) {
        return savefileId === this.getAutoSaveId() ? 0 : savefileId;
    };

    DataManager.isShiftAutoSave = function() {
        return this._isShiftAutoSave;
    };

    DataManager.isProcessAutoSave = function() {
        return this._processAutoSave;
    };

    //=============================================================================
    // StorageManager
    //  オートセーブ時にjson文字列を保持します。
    //=============================================================================
    StorageManager._autoSaveJson = null;

    var _StorageManager_save = StorageManager.save;
    StorageManager.save      = function(savefileId, json) {
        if (this.isAutoSave(savefileId)) {
            this._autoSaveJson = json;
            if (!paramAutoSave) return;
        }
        if (DataManager.isShiftAutoSave() && savefileId > 0) {
            arguments[1] = this._autoSaveJson;
        }
        _StorageManager_save.apply(this, arguments);
    };

    var _StorageManager_saveToLocalFile = StorageManager.saveToLocalFile;
    StorageManager.saveToLocalFile      = function(savefileId, json) {
        if (DataManager.isProcessAutoSave() && this.isAutoSave(savefileId)) {
            var data     = LZString.compressToBase64(json);
            var fs       = require('fs');
            var filePath = this.localFilePath(savefileId);
            fs.writeFile(filePath, data, null, function(err) {
                if (!err) return;
                console.log(err.stack);
                this.makeSaveDirectly();
            }.bind(this));
        } else {
            _StorageManager_saveToLocalFile.apply(this, arguments);
        }
    };

    StorageManager.isAutoSave = function(savefileId) {
        return savefileId === DataManager.getAutoSaveId();
    };

    StorageManager.isGlobalSave = function(savefileId) {
        return savefileId === 0;
    };

    StorageManager.makeSaveDirectly = function() {
        if (this.isLocalMode()) {
            var fs      = require('fs');
            var dirPath = this.localFileDirectoryPath();
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
            }
        }
    };

    //=============================================================================
    // Scene_AutoLoad
    //  オートロード画面を追加定義します。
    //=============================================================================
    function Scene_AutoLoad() {
        this.initialize.apply(this, arguments);
    }

    Scene_AutoLoad.prototype             = Object.create(Scene_Load.prototype);
    Scene_AutoLoad.prototype.constructor = Scene_AutoLoad;

    Scene_AutoLoad.prototype.create = function() {
    };

    Scene_AutoLoad.prototype.start = function() {
        this.executeAutoLoad();
    };

    Scene_AutoLoad.prototype.onLoadSuccess = function() {
        this.reloadMapIfUpdated();
        SceneManager.goto(Scene_Map);
        $gameSystem.onAfterLoad();
    };

    Scene_AutoLoad.prototype.executeAutoLoad = function() {
        if (DataManager.loadGameReserve()) {
            this.onLoadSuccess();
        } else {
            SoundManager.playBuzzer();
            SceneManager.goto(Scene_Map);
        }
    };

    //=============================================================================
    // Scene_Title
    //  フラグによってコマンドウィンドウのクラスを変更します。
    //=============================================================================
    var _Scene_Title_createCommandWindow      = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function() {
        this.changeImplementationWindowCommand(paramTitleViewType);
        _Scene_Title_createCommandWindow.apply(this, arguments);
        this.restoreImplementationWindowCommand();
    };

    Scene_Title.prototype.changeImplementationWindowCommand = function(type) {
        var classWindow_TitleCommand;
        switch (type) {
            case 1 :
                classWindow_TitleCommand = Window_NovelTitleCommand;
                break;
            default :
                classWindow_TitleCommand = _InterfaceWindow_TitleCommand;
        }
        Window_TitleCommand = classWindow_TitleCommand;
    };

    Scene_Title.prototype.restoreImplementationWindowCommand = function() {
        Window_TitleCommand = _InterfaceWindow_TitleCommand;
    };

    //=============================================================================
    // Scene_Load
    //  オートセーブ有効時にオートセーブ用のインデックスを有効にします。
    //=============================================================================
    Scene_Load.prototype.savefileId = function() {
        return Scene_File.prototype.savefileId.apply(this, arguments) - (paramAutoSave ? 1 : 0);
    };

    var _Scene_Load_firstSavefileIndex      = Scene_Load.prototype.firstSavefileIndex;
    Scene_Load.prototype.firstSavefileIndex = function() {
        return _Scene_Load_firstSavefileIndex.apply(this, arguments) + (paramAutoSave ? 1 : 0);
    };

    //=============================================================================
    // Scene_Map
    //  フラグによってメッセージウィンドウのクラスを変更します。
    //=============================================================================
    Scene_Map.symbolSave = 'save';
    Scene_Map.symbolLoad = 'load';

    var _Scene_Map_createDisplayObjects      = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function() {
        _Scene_Map_createDisplayObjects.apply(this, arguments);
        this.createPauseWindow();
    };

    Scene_Map.prototype.createPauseWindow = function() {
        this._pauseWindow = new Window_PauseMenu();
        this._pauseWindow.setHandler(Scene_Map.symbolSave, this.callSave.bind(this));
        this._pauseWindow.setHandler(Scene_Map.symbolLoad, this.callLoad.bind(this));
        this._pauseWindow.setHandler('quickSave', this.callQuickSave.bind(this));
        this._pauseWindow.setHandler('quickLoad', this.callQuickLoad.bind(this));
        this._pauseWindow.setHandler('toTitle', this.callToTitle.bind(this));
        this._pauseWindow.setHandler('cancel', this.offPause.bind(this));
        this.addWindow(this._pauseWindow);
    };

    Scene_Map.prototype.createListWindow = function() {
        var x                = 0;
        var y                = 0;
        var width            = Graphics.boxWidth;
        var height           = Graphics.boxHeight - y;
        this._fileListWindow = new Window_SavefileList(x, y, width, height);
        this.addWindow(this._fileListWindow);
        this._fileListWindow.openness = 0;
        this._fileListWindow.hide();
    };

    Scene_Map.prototype.callSave = function() {
        this._fileMode = Scene_Map.symbolSave;
        this.setupFileListWindow();
    };

    Scene_Map.prototype.callLoad = function() {
        this._fileMode = Scene_Map.symbolLoad;
        this.setupFileListWindow();
    };

    Scene_Map.prototype.callQuickSave = function() {
        this.processSave(DataManager.lastAccessedSavefileId());
        this._pauseWindow.activate();
    };

    Scene_Map.prototype.callQuickLoad = function() {
        this.processLoad(DataManager.latestSavefileId());
    };

    Scene_Map.prototype.callToTitle = function() {
        SceneManager.goto(Scene_Title);
    };

    Scene_Map.prototype.isFileModeSave = function() {
        return this._fileMode === Scene_Map.symbolSave;
    };

    Scene_Map.prototype.setupFileListWindow = function() {
        if (!this._fileListWindow) {
            this.createListWindow();
        }
        this._fileListWindow.setHandler('ok', this.onFileListWindowOk.bind(this));
        this._fileListWindow.setHandler('cancel', this.onFileListWindowCancel.bind(this));
        this._fileListWindow.setupForMapSave(this.firstSavefileIndex(), this._fileMode);
        this._pauseWindow.deactivate();
    };

    Scene_Map.prototype.firstSavefileIndex = function() {
        if (this.isFileModeSave()) {
            return Scene_Save.prototype.firstSavefileIndex.apply(this, arguments);
        } else {
            return Scene_Load.prototype.firstSavefileIndex.apply(this, arguments);
        }
    };

    Scene_Map.prototype.onFileListWindowOk = function() {
        if (this.isFileModeSave()) {
            this.processSave(this.savefileId());
            this._pauseWindow.activate();
        } else {
            this.processLoad(this.savefileId());
        }
        this.closeListWindow();
    };

    Scene_Map.prototype.onFileListWindowCancel = function() {
        this.closeListWindow();
        this._pauseWindow.activate();
    };

    Scene_Map.prototype.processSave = function(saveFileId) {
        $gameMap.executeAutoSaveForPause();
        if (DataManager.shiftAutoSave(saveFileId)) {
            SoundManager.playSave();
            StorageManager.cleanBackup(saveFileId);
        } else {
            SoundManager.playBuzzer();
        }
    };

    Scene_Map.prototype.processLoad = function(saveFileId) {
        if (DataManager.reserveLoad(saveFileId)) {
            SoundManager.playLoad();
            this.fadeOutAll();
            SceneManager.goto(Scene_AutoLoad);
            $gameMessage.setPause(true);
        } else {
            SoundManager.playBuzzer();
        }
    };

    Scene_Map.prototype.savefileId = function() {
        return this._fileListWindow.getSaveFileId();
    };

    Scene_Map.prototype.closeListWindow = function() {
        this._fileListWindow.close();
        this._fileListWindow.deactivate();
    };

    var _Scene_Map_createMessageWindow      = Scene_Map.prototype.createMessageWindow;
    Scene_Map.prototype.createMessageWindow = function() {
        this.changeImplementationWindowMessage($gameSystem.getMessageType());
        _Scene_Map_createMessageWindow.apply(this, arguments);
        this.restoreImplementationWindowMessage();
        this._messageWindow.setPauseHandler(this.onPause.bind(this), null);
    };

    Scene_Map.prototype.changeImplementationWindowMessage = function(type) {
        var classWindow_Message, classWindow_ChoiceList, classWindow_NumberInput;
        switch (type) {
            case 1 :
                classWindow_Message     = Window_NovelMessage;
                classWindow_ChoiceList  = Window_NovelChoiceList;
                classWindow_NumberInput = Window_NovelNumberInput;
                break;
            default :
                classWindow_Message     = _InterfaceWindow_Message;
                classWindow_ChoiceList  = _InterfaceWindow_ChoiceList;
                classWindow_NumberInput = _InterfaceWindow_NumberInput;
        }
        Window_Message     = classWindow_Message;
        Window_ChoiceList  = classWindow_ChoiceList;
        Window_NumberInput = classWindow_NumberInput;
    };

    Scene_Map.prototype.restoreImplementationWindowMessage = function() {
        Window_Message     = _InterfaceWindow_Message;
        Window_ChoiceList  = _InterfaceWindow_ChoiceList;
        Window_NumberInput = _InterfaceWindow_NumberInput;
    };

    var _Scene_Map_start      = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_start.apply(this, arguments);
        $gameSystem.executeAutoSave();
    };

    Scene_Map.prototype.onPause = function() {
        Input.clear();
        $gameMessage.setPause(true);
        this._pauseWindow.show();
        this._pauseWindow.open();
        this._pauseWindow.activate();
        this._messageWindow.keepActivationSubWindow();
    };

    Scene_Map.prototype.offPause = function() {
        Input.clear();
        $gameMessage.setPause(false);
        this._pauseWindow.close();
        this._pauseWindow.deactivate();
        this._messageWindow.restoreActivationSubWindow();
    };

    var _Scene_Map_callMenu = Scene_Map.prototype.callMenu;
    Scene_Map.prototype.callMenu = function() {
        if (!$gameMessage.canCallPause()) {
            _Scene_Map_callMenu.apply(this, arguments);
        } else {
            this.menuCalling = false;
        }
    };

    var _Game_Message_isBusy = Game_Message.prototype.isBusy;
    Game_Message.prototype.isBusy = function() {
        return _Game_Message_isBusy.apply(this, arguments) || this.isPause();
    };

    //=============================================================================
    // Window_SavefileList
    //  セーブファイルリスト画面
    //=============================================================================
    Window_SavefileList.prototype.isModeLoad = function() {
        return this._mode === 'load';
    };

    Window_SavefileList.prototype.isNeedAutoSave = function() {
        return this.isModeLoad() && paramAutoSave;
    };

    Window_SavefileList.prototype.setupForMapSave = function(index, mode) {
        this.setMode(mode);
        this.select(index);
        this.setTopRow(index - 2);
        this.changePaintOpacity(true);
        this.backOpacity = 240;
        this.refresh();
        this.show();
        this.open();
        this.activate();
    };

    var _Window_SavefileList_maxItems      = Window_SavefileList.prototype.maxItems;
    Window_SavefileList.prototype.maxItems = function() {
        return _Window_SavefileList_maxItems.apply(this, arguments) + (this.isNeedAutoSave() ? 1 : 0);
    };

    var _Window_SavefileList_drawItem      = Window_SavefileList.prototype.drawItem;
    Window_SavefileList.prototype.drawItem = function(index) {
        if (index > 0 || !this.isNeedAutoSave()) {
            if (this.isNeedAutoSave()) arguments[0]--;
            _Window_SavefileList_drawItem.apply(this, arguments);
        } else {
            var rect       = this.itemRectForText(-1);
            var autoSaveId = DataManager.getAutoSaveId();
            var valid      = DataManager.isThisGameFile(autoSaveId);
            var info       = DataManager.loadSavefileInfo(autoSaveId);
            this.resetTextColor();
            if (this._mode === 'load') {
                this.changePaintOpacity(valid);
            }
            this.drawText(paramNameAutoSave, rect.x, rect.y, 180);
            if (info) {
                this.changePaintOpacity(valid);
                this.drawContents(info, rect, valid);
                this.changePaintOpacity(true);
            }
        }
    };

    Window_SavefileList.prototype.itemRectForText = function(index) {
        return Window_Selectable.prototype.itemRectForText.call(this, index + (this.isNeedAutoSave() ? 1 : 0));
    };

    Window_SavefileList.prototype.getSaveFileId = function() {
        return this.index() + 1 - (this.isNeedAutoSave() ? 1 : 0);
    };

    var _Window_SavefileList_drawGameTitle      = Window_SavefileList.prototype.drawGameTitle;
    Window_SavefileList.prototype.drawGameTitle = function(info, x, y, width) {
        _Window_SavefileList_drawGameTitle.apply(this, arguments);
        if (info.chapter) {
            this.drawText(info.chapter, x, y, width, 'right');
        }
    };

    //=============================================================================
    // Window_Message
    //  メッセージの表示速度などを調整します。
    //=============================================================================
    var _Window_Message_updateWait      = Window_Message.prototype.updateWait;
    Window_Message.prototype.updateWait = function() {
        if (paramRapidShowClick && this._textState && this.isTriggered() && !this.pause) {
            this._showAll = true;
        }
        return _Window_Message_updateWait.apply(this, arguments);
    };

    var _Window_Message_updateMessage      = Window_Message.prototype.updateMessage;
    Window_Message.prototype.updateMessage = function() {
        var speed = this.getMessageSpeed();
        if (this._textState && !this._lineShowFast) {
            if (speed <= 0 || this._showAll) {
                this._showFast = true;
            } else {
                this._waitCount = speed - 1;
            }
        }
        return _Window_Message_updateMessage.apply(this, arguments);
    };

    Window_Message.prototype.getMessageSpeed = function() {
        return this._tempMessageSpeed !== null ? this._tempMessageSpeed : $gameVariables.value(paramVariableSpeed);
    };

    Window_Message.prototype.setTempMessageSpeed = function(speed) {
        if (speed >= 0) {
            this._tempMessageSpeed = speed;
            if (speed > 0) this._showFast = false;
        } else {
            this._tempMessageSpeed = null;
        }
    };

    var _Window_Message_clearFlags      = Window_Message.prototype.clearFlags;
    Window_Message.prototype.clearFlags = function() {
        _Window_Message_clearFlags.apply(this, arguments);
        this._windowClosing    = false;
        this._showAll          = false;
        this._tempMessageSpeed = null;
    };

    var _Window_Message_processEscapeCharacter      = Window_Message.prototype.processEscapeCharacter;
    Window_Message.prototype.processEscapeCharacter = function(code, textState) {
        if (code === '>') this._waitCount = 0;
        switch (code) {
            case setting.unlockCode:
                $gameMessage.setWaitMode('');
                break;
            case setting.windowCloseCode:
                if (this.isNovelWindow()) this.setWindowClosing();
                break;
            case setting.messageSpeedCode:
                this.setTempMessageSpeed(this.obtainEscapeParam(textState));
                break;
            default:
                _Window_Message_processEscapeCharacter.apply(this, arguments);
        }
    };

    Window_Message.prototype.isNovelWindow = function() {
        return false;
    };

    Window_Message.prototype.isNormalMessageWindow = function() {
        return true;
    };

    Window_Message.prototype.setPauseHandler = function(handler, args) {
        this._pauseHandler = [handler, args];
    };

    Window_Message.prototype.callPauseHandler = function() {
        var handler = this._pauseHandler;
        if (handler) {
            handler[0].apply(this, handler[1]);
        }
    };

    var _Window_Message_update      = Window_Message.prototype.update;
    Window_Message.prototype.update = function() {
        this.checkInputPause();
        if ($gameMessage.isPause()) {
            return;
        }
        _Window_Message_update.apply(this, arguments);
    };

    Window_Message.prototype.checkInputPause = function() {
        if ($gameMessage.canCallPause() && this.isTriggeredPause()) {
            SoundManager.playOk();
            this.callPauseHandler();
        }
    };

    Window_Message.prototype.isTriggeredPause = function() {
        return Input.isTriggered('escape') || (TouchInput.isCancelled() && this.isTouchedInsideFrame());
    };

    Window_Message.prototype.keepActivationSubWindow = function() {
        this._keepActivation = [];
        this.subWindows().forEach(function(subWindow) {
            this._keepActivation.push(subWindow.active);
            subWindow.deactivate();
        }.bind(this));
    };

    Window_Message.prototype.restoreActivationSubWindow = function() {
        this.subWindows().forEach(function(subWindow) {
            var active = this._keepActivation.shift();
            if (active) {
                subWindow.activate();
            } else {
                subWindow.deactivate();
            }
        }.bind(this));
    };

    var _Window_Message_isTriggered      = Window_Message.prototype.isTriggered;
    Window_Message.prototype.isTriggered = function() {
        var result = _Window_Message_isTriggered.apply(this, arguments);
        if (!Input.isRepeated('ok') && !Input.isRepeated('cancel')) {
            result = (result || TouchInput.wheelY >= 1) && this.isTouchedInsideFrame();
        }
        return result;
    };

    Window_Message.prototype.isTouchedInsideFrame = function() {
        return !paramClickInFrame || Window_Selectable.prototype.isTouchedInsideFrame.apply(this, arguments);
    };

    //=============================================================================
    // Window_NovelMessage
    //  ノベルメッセージ表示用のクラスです。
    //=============================================================================
    function Window_NovelMessage() {
        this.initialize.apply(this, arguments);
    }

    Window_NovelMessage.prototype             = Object.create(Window_Message.prototype);
    Window_NovelMessage.prototype.constructor = Window_Message;

    Window_NovelMessage.fontFaceMincho = '"ヒラギノ明朝 ProN W3","Hiragino Mincho ProN","ＭＳ Ｐ明朝","MS PMincho",';
    Window_NovelMessage.fontFaceGothic = '"ヒラギノゴシック ProN W3","Hiragino Gothic ProN","ＭＳ Ｐゴシック","MS PGothic",';

    Window_NovelMessage.prototype.windowWidth = function() {
        return Graphics.boxWidth;
    };

    Window_NovelMessage.prototype.windowHeight = function() {
        return Graphics.boxHeight;
    };

    Window_NovelMessage.prototype.standardFontSize = function() {
        return Window_Base.prototype.standardFontSize.apply(this, arguments) + paramRelativeFontSize;
    };

    Window_NovelMessage.prototype.standardFontFace = function() {
        var fontFace = '';
        if (paramViewCustomFont) {
            fontFace += paramViewCustomFont;
            if (fontFace[fontFace.length - 1] !== ',') fontFace += ',';
        }
        if (paramViewMincho) fontFace += Window_NovelMessage.fontFaceMincho;
        if (paramViewGothic) fontFace += Window_NovelMessage.fontFaceGothic;
        fontFace += Window_Base.prototype.standardFontFace.call(this);
        return fontFace;
    };

    Window_NovelMessage.prototype.startInput = function() {
        var result = _InterfaceWindow_Message.prototype.startInput.apply(this, arguments);
        if (result) {
            if (!this.isOpen() || !this._textState) {
                this.contents.clear();
                this.open();
            }
        } else {
            this.startClose();
        }
        return result;
    };

    Window_NovelMessage.prototype.startClose = function() {
        if ($gameMessage.isCloseForce()) {
            $gameMessage.setCloseForce(false);
            this.closeForce();
        }
    };

    Window_NovelMessage.prototype.startMessage = function() {
        if (!paramWaitByCommand) {
            $gameMessage.setNoWait();
        }
        if (!this._prevTextState) {
            _InterfaceWindow_Message.prototype.startMessage.apply(this, arguments);
        } else {
            this._textState      = this._prevTextState;
            this._textState.text = this.convertEscapeCharacters($gameMessage.allText());
            this._textState.top  = this._textState.y;
            this.processNewLine(this._textState);
            this._textState.index = 0;
            this.resetFontSettings();
            this.clearFlags();
            this.loadMessageFace();
            this.open();
            if (this.initializeMessageAutoCount) {
                this.initializeMessageAutoCount();
            }
        }
    };

    Window_NovelMessage.prototype.updatePlacement = function() {
        var rectangle  = $gameSystem.getNovelWindowRectangle();
        var prevWidth  = this.width;
        var prevHeight = this.height;
        if (rectangle) {
            this.move(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
        } else {
            this.move(0, 0, this.windowWidth(), this.windowHeight());
        }
        if (prevWidth !== this.width || prevHeight !== this.height) {
            this.createContents();
        }
    };

    Window_NovelMessage.prototype.newPage = function(textState) {
        textState.top = 0;
        textState.y   = 0;
        _InterfaceWindow_Message.prototype.newPage.apply(this, arguments);
    };

    Window_NovelMessage.prototype.onEndOfText = function() {
        this.dumpMessage();
        $gameMessage.setFaceImage('', 0);
        _InterfaceWindow_Message.prototype.onEndOfText.apply(this, arguments);
    };

    Window_NovelMessage.prototype.dumpMessage = function() {
        this._prevTextState = (!this._windowClosing ? this._textState : null);
    };

    Window_NovelMessage.prototype.clearDumpMessage = function() {
        this._prevTextState = null;
    };

    Window_NovelMessage.prototype.startPause = function() {
        _InterfaceWindow_Message.prototype.startPause.apply(this, arguments);
        var position = this._signPositionNewLine ? this._signPositionNewLine : this.getPauseSignSpritePosition();
        this.setPauseSignSpritePosition(position);
    };

    Window_NovelMessage.prototype.setPauseSignSpritePosition = function(position) {
        var signSprite = this._windowPauseSignSprite;
        signSprite.x   = position.x;
        signSprite.y   = position.y;
        if (paramPauseColor) {
            signSprite.setBlendColor(this._windowClosing || this._signPositionNewLine ? paramPauseColor : [0, 0, 0, 0]);
        }
    };

    Window_NovelMessage.prototype.getPauseSignSpritePosition = function() {
        var signSprite = this._windowPauseSignSprite;
        var x = 0, y = 0;
        if (paramVerticalWriting) {
            x = this.contents.width - this._textState.y - this.padding + (this.contents.fontSize / 2);
            y = this._textState.x + this.padding + signSprite.height;
        } else {
            x = this._textState.x + this.padding + (signSprite.width * signSprite.anchor.x);
            y = this._textState.y + this._textState.height + this.padding;
        }
        return {x: x, y: y};
    };

    Window_NovelMessage.prototype.terminateMessage = function() {
        _InterfaceWindow_Message.prototype.terminateMessage.apply(this, arguments);
        if (!this._windowClosing) {
            this.open();
        } else {
            $gameSystem.executeAutoSave();
        }
    };

    Window_NovelMessage.prototype.processNormalCharacter = function(textState) {
        if (paramVerticalWriting) {
            var c = textState.text[textState.index++];
            var w = this.textWidth(c);
            var x = this.contents.width - textState.y - (textState.height / 2 + w / 2);
            var y = textState.x;
            this.contents.drawText(c, x, y, w * 2, textState.height, 'left');
            textState.x += this.contents.fontSize;
        } else {
            _InterfaceWindow_Message.prototype.processNormalCharacter.apply(this, arguments);
        }
        if (paramAutoWordWrap) {
            this.processAutoWordWrap(textState);
        }
    };

    Window_NovelMessage.prototype.processNewLine = function(textState) {
        textState.left            = this.newLineX();
        this._signPositionNewLine = this.getPauseSignSpritePosition();
        _InterfaceWindow_Message.prototype.processNewLine.apply(this, arguments);
        this._signPositionNewLine = null;
    };

    Window_NovelMessage.prototype.newLineX = function() {
        var x = _InterfaceWindow_Message.prototype.newLineX.apply(this, arguments);
        return (this._textState.y - this._textState.top >= Window_Base._faceHeight) ? 0 : x;
    };

    Window_NovelMessage.prototype.processAutoWordWrap = function(textState) {
        var c         = textState.text[textState.index];
        var textNextX = textState.x + (c ? this.textWidth(c) : 0);
        var index = textState.index;
        if (c === '\x1b' && this.obtainEscapeCode(textState) === 'I') {
            textNextX = textState.x + Window_Base._iconWidth;
        }
        textState.index = index;
        var maxWidth  = (paramVerticalWriting ? this.contents.height : this.contents.width);
        if (textNextX > maxWidth && c !== '\n') {
            textState.index--;
            this.processNewLine(textState);
        }
    };

    Window_NovelMessage.prototype.drawMessageFace = function() {
        if (!this._prevTextState || !this._textState) {
            _InterfaceWindow_Message.prototype.drawMessageFace.apply(this, arguments);
        } else {
            this.drawFace($gameMessage.faceName(), $gameMessage.faceIndex(), 0, this._textState.y);
        }
    };

    Window_NovelMessage.prototype.getNovelChoiceTop = function() {
        if (this._textState) {
            return this.y + this._textState.y + this._textState.height + this.padding;
        } else {
            return this.y;
        }
    };

    Window_NovelMessage.prototype.setWindowClosing = function() {
        this._windowClosing = true;
    };

    Window_NovelMessage.prototype.closeForce = function() {
        this.commitMessage();
        this.setWindowClosing();
        this.close();
    };

    Window_NovelMessage.prototype.commitMessage = function() {
        $gameSystem.executeAutoSave();
        this.clearDumpMessage();
    };

    Window_NovelMessage.prototype.isNovelWindow = function() {
        return true;
    };

    Window_NovelMessage.prototype.isNormalMessageWindow = function() {
        return false;
    };

    Window_NovelMessage.prototype.doesContinue = function() {
        return Window_Message.prototype.doesContinue.apply(this, arguments) || !this._windowClosing;
    };

    Window_NovelMessage.prototype.needsNewPage = function(textState) {
        if (paramVerticalWriting) {
            return (!this.isEndOfText(textState) && textState.y + textState.height > this.contents.width);
        } else {
            return Window_Message.prototype.needsNewPage.apply(this, arguments);
        }
    };

    //=============================================================================
    // Window_NovelChoiceList
    //  ノベルウィンドウ用のコマンド表示クラスです。
    //=============================================================================
    function Window_NovelChoiceList() {
        this.initialize.apply(this, arguments);
    }

    Window_NovelChoiceList._prefixAlphabet = ['A. ', 'B. ', 'C. ', 'D. ', 'E. ', 'F. ', 'G. ', 'H. '];
    Window_NovelChoiceList._prefixNumber   = ['1. ', '2. ', '3. ', '4. ', '5. ', '6. ', '7. ', '8. '];

    Window_NovelChoiceList.prototype             = Object.create(Window_ChoiceList.prototype);
    Window_NovelChoiceList.prototype.constructor = Window_NovelChoiceList;

    Window_NovelChoiceList.prototype.updatePlacement = function() {
        this.move(this.windowX(), this.windowY(), this.windowWidth(), this.windowHeight());
        this.moveCustomPosition();
    };

    Window_NovelChoiceList.prototype.standardFontSize    = Window_NovelMessage.prototype.standardFontSize;
    Window_NovelChoiceList.prototype.standardFontFace    = Window_NovelMessage.prototype.standardFontFace;
    Window_NovelChoiceList.prototype.processAutoWordWrap = Window_NovelMessage.prototype.processAutoWordWrap;

    Window_NovelChoiceList.prototype.windowX = function() {
        return this._messageWindow.x;
    };

    Window_NovelChoiceList.prototype.windowY = function() {
        return this._messageWindow.getNovelChoiceTop();
    };

    Window_NovelChoiceList.prototype.moveCustomPosition = function() {
        var position = $gameSystem.getNovelCommandPosition();
        if (position) {
            this.x = position.x - this.windowWidth() / 2;
            this.y = position.y - this.windowHeight() / 2;
        }
    };

    Window_NovelChoiceList.prototype.windowWidth = function() {
        return this._messageWindow.width;
    };

    Window_NovelChoiceList.prototype.windowHeight = function() {
        return this._messageWindow.height;
    };

    Window_NovelChoiceList.prototype.contentsHeight = function() {
        return this.getAllTextHeight() || Window_Base.prototype.contentsHeight.apply(this, arguments);
    };

    Window_NovelChoiceList.prototype.numVisibleRows = function() {
        return $gameMessage.choices().length;
    };

    Window_NovelChoiceList.prototype.updateBackground = function() {
        this.setBackgroundType(this.getNovelBackgroundType());
    };

    Window_NovelChoiceList.prototype.getNovelBackgroundType = function() {
        return !!$gameSystem.getNovelCommandPosition() ? 0 : 2;
    };

    Window_NovelChoiceList.prototype.makeCommandList = function() {
        _InterfaceWindow_ChoiceList.prototype.makeCommandList.apply(this, arguments);
        this._textHieghts = [];
        for (var i = 0, n = this._list.length; i < n; i++) {
            this._textHieghts[i] = this.drawItem(i) + 8;
        }
    };

    Window_NovelChoiceList.prototype.commandName = function(index) {
        var prefix = '';
        switch (paramSelectionPrefix) {
            case 1:
                prefix = Window_NovelChoiceList._prefixAlphabet[index];
                break;
            case 2:
                prefix = Window_NovelChoiceList._prefixNumber[index];
                break;
        }
        return prefix + Window_Command.prototype.commandName.apply(this, arguments);
    };

    Window_NovelChoiceList.prototype.getAllTextHeight = function() {
        return this._textHieghts.reduce(function(preValue, value) {
            return preValue + value;
        }, 0);
    };

    Window_NovelChoiceList.prototype.itemRect = function(index) {
        var rect = _InterfaceWindow_ChoiceList.prototype.itemRect.apply(this, arguments);
        rect.y   = 0;
        for (var i = 0; i < index; i++) {
            rect.y += this._textHieghts[i];
        }
        rect.height = this._textHieghts[index];
        return rect;
    };

    Window_NovelChoiceList.prototype.drawItem = function(index) {
        var rect         = this.itemRectForText(index);
        var textState    = {index: 0, x: rect.x, y: rect.y, left: rect.x};
        textState.text   = this.convertEscapeCharacters(this.commandName(index));
        textState.height = this.calcTextHeight(textState, false);
        this.resetFontSettings();
        while (textState.index < textState.text.length) {
            this.processCharacter(textState);
            this.processAutoWordWrap(textState);
        }
        return textState.y + textState.height - rect.y;
    };

    Window_NovelChoiceList.prototype.callOkHandler = function() {
        this._messageWindow.commitMessage();
        _InterfaceWindow_ChoiceList.prototype.callOkHandler.apply(this, arguments);
    };

    Window_NovelChoiceList.prototype.callCancelHandler = function() {
        this._messageWindow.commitMessage();
        _InterfaceWindow_ChoiceList.prototype.callCancelHandler.apply(this, arguments);
    };

    Window_NovelChoiceList.prototype.textPadding = function() {
        return 24;
    };

    //=============================================================================
    // Window_NovelChoiceList
    //  ノベルウィンドウ用のコマンド表示クラスです。
    //=============================================================================
    function Window_NovelNumberInput() {
        this.initialize.apply(this, arguments);
    }

    Window_NovelNumberInput.prototype             = Object.create(Window_NumberInput.prototype);
    Window_NovelNumberInput.prototype.constructor = Window_NovelNumberInput;

    Window_NovelNumberInput.prototype.standardFontSize = Window_NovelMessage.prototype.standardFontSize;
    Window_NovelNumberInput.prototype.standardFontFace = Window_NovelMessage.prototype.standardFontFace;

    Window_NovelNumberInput.prototype.moveCustomPosition = Window_NovelChoiceList.prototype.moveCustomPosition;
    Window_NovelNumberInput.prototype.updateBackground   = Window_NovelChoiceList.prototype.updateBackground;
    Window_NovelNumberInput.prototype.updateBackground   = Window_NovelChoiceList.prototype.getNovelBackgroundType;

    Window_NovelNumberInput.prototype.updatePlacement = function() {
        var y = this._messageWindow.getNovelChoiceTop();
        var x = Graphics.boxWidth / 2 - this.windowWidth() / 2;
        this.move(x, y, this.windowWidth(), this.windowHeight());
        this.moveCustomPosition();
        this.updateBackground();
    };

    Window_NovelNumberInput.prototype.processOk = function() {
        this._messageWindow.commitMessage();
        _InterfaceWindow_NumberInput.prototype.processOk.apply(this, arguments);
    };

    //=============================================================================
    // Window_NovelTitleCommand
    //  ノベルゲーム風のタイトルコマンドウィンドウです。
    //=============================================================================
    function Window_NovelTitleCommand() {
        this.initialize.apply(this, arguments);
    }

    Window_NovelTitleCommand.prototype             = Object.create(Window_TitleCommand.prototype);
    Window_NovelTitleCommand.prototype.constructor = Window_NovelTitleCommand;

    Window_NovelTitleCommand.prototype.maxCols = function() {
        return this.maxItems();
    };

    Window_NovelTitleCommand.prototype.windowWidth = function() {
        return Graphics.boxWidth - 64;
    };

    Window_NovelTitleCommand.prototype.updatePlacement = function() {
        _InterfaceWindow_TitleCommand.prototype.updatePlacement.apply(this, arguments);
        this.setBackgroundType(1);
    };

    Window_NovelTitleCommand.prototype.standardFontSize = Window_NovelMessage.prototype.standardFontSize;
    Window_NovelTitleCommand.prototype.standardFontFace = Window_NovelMessage.prototype.standardFontFace;

    //=============================================================================
    // Window_PauseMenu
    //  イベント中ポーズメニュー表示用のクラスです。
    //=============================================================================
    function Window_PauseMenu() {
        this.initialize.apply(this, arguments);
    }

    Window_PauseMenu.prototype             = Object.create(Window_Command.prototype);
    Window_PauseMenu.prototype.constructor = Window_PauseMenu;

    Window_PauseMenu.prototype.initialize = function() {
        var x = (Graphics.boxWidth - this.windowWidth()) / 2;
        var y = (Graphics.boxHeight - this.windowHeight()) / 2;
        Window_Command.prototype.initialize.call(this, x, y);
        this.openness = 0;
        this.hide();
    };

    Window_PauseMenu.prototype.windowWidth = function() {
        return 240;
    };

    Window_PauseMenu.prototype.numVisibleRows = function() {
        return 6;
    };

    Window_PauseMenu.prototype.makeCommandList = function() {
        this.addCommand(TextManager.save, 'save');
        this.addCommand(paramCommandLoad, 'load');
        this.addCommand(paramCommandQuickSave, 'quickSave');
        this.addCommand(paramCommandQuickLoad, 'quickLoad');
        this.addCommand(TextManager.toTitle, 'toTitle');
        this.addCommand(TextManager.cancel, 'cancel');
    };

    Window_PauseMenu.prototype.playOkSound = function() {
        if (this.index() === 2 || this.index() === 3) return;
        Window_Selectable.prototype.playOkSound.apply(this, arguments);
    };

    //=============================================================================
    // ウィンドウを透過して重なり合ったときの表示を自然にします。
    //=============================================================================
    if (!WindowLayer.throughWindow) {
        WindowLayer.throughWindow = true;
        //=============================================================================
        //  WindowLayer
        //   ウィンドウのマスク処理を除去します。
        //=============================================================================
        WindowLayer.prototype._maskWindow            = function(window) {};
        WindowLayer.prototype._canvasClearWindowRect = function(renderSession, window) {};
    }

    //------------------------------------------------------------------------------
    //  以下がバックログの実装に伴う追加のコードです。
    //------------------------------------------------------------------------------

    //追加
    var paramShowAtOnce     = getParamNumber(['テキスト一括表示スイッチ'], 0);
    var paramHistoryRestore = getParamBoolean(['バックログ復帰']);
    var paramHistoryTouch   = getParamBoolean(['タッチでページ送り']);
    var paramHistoryName    = getParamString(['バックログコマンド']);
    var paramHistoryPages   = getParamNumber(['バックログ保持数'], 30);
    var paramTouchPrev      = PluginManager.parameters('NobleMushroom_with_history')['前ページ送りのウィンドウタッチ範囲'];
    var paramTouchNext      = PluginManager.parameters('NobleMushroom_with_history')['次ページ送りのウィンドウタッチ範囲'];
    var paramHWstring       = PluginManager.parameters('NobleMushroom_with_history')['バックログウィンドウ設定'];
    var paramHistoryWindow  = paramHWstring.split(",");
    var HistoryWindowX = 0;
    var HistoryWindowY = 0;
    var HistoryWindowWidth = 0;
    var HistoryWindowHeight = 0;
    var HistoryWindowType = 0;
    if (paramHistoryWindow[0] != null) {
        HistoryWindowX = Number(paramHistoryWindow[0]);
    }
    if (paramHistoryWindow[1] != null) {
        HistoryWindowY = Number(paramHistoryWindow[1]);
    }    
    if (paramHistoryWindow[2] != null) {
        HistoryWindowWidth = Number(paramHistoryWindow[2]);
    }
    if (paramHistoryWindow[3] != null) {
        HistoryWindowHeight = Number(paramHistoryWindow[3]);
    }
    if (paramHistoryWindow[4] != null) {
        HistoryWindowType = Number(paramHistoryWindow[4]);
        if (HistoryWindowType < 0 || HistoryWindowType > 2) {
            HistoryWindowType = 0;
        }
    }
    
    //ログ記録用
    var _novel79mv_textlog  = new Array();
    //バックログロードの判定
    var _novel79mv_resetLog = true;

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var dice2000_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        dice2000_Game_Interpreter_pluginCommand.apply(this, arguments);
        this.pluginCommandDice2000(command, args);
    };

    Game_Interpreter.prototype.pluginCommandDice2000 = function(command, args) {
        switch (getCommandName(command)) {
            //ポーズメニュー無効の時のみ有効になる
            //シーンマネージャーで強引にScene_Mapで定義しているポーズメニューを呼び出す
            //ちと危うい気がする
            case 'CALLNOVELHISTORY' :
            	if (SceneManager._scene.constructor === Scene_Map && !paramCanPause){
                    SceneManager._scene.onPause();
            	}
            break;
            case 'CALLNOVELLOAD' :
            	if (SceneManager._scene.constructor === Scene_Map && !paramCanPause){
                    SceneManager._scene.callLoad();
            	}
            break;
            case 'CALLNOVELSAVE' :
            	if (SceneManager._scene.constructor === Scene_Map && !paramCanPause){
                    SceneManager._scene.callSave();
            	}
            break;
            case 'CALLNOVELQLOAD' :
            	if (SceneManager._scene.constructor === Scene_Map && !paramCanPause){
                    SceneManager._scene.callQuickLoad();
            	}
            break;
            case 'CALLNOVELQSAVE' :
            	if (SceneManager._scene.constructor === Scene_Map && !paramCanPause){
                    SceneManager._scene.callQuickSave();
            	}
            break;
        }
    };

    //=============================================================================
    // Game_System
    //=============================================================================

    var dice2000_Game_System_onAfterLoad      = Game_System.prototype.onAfterLoad;
    Game_System.prototype.onAfterLoad = function() {
        dice2000_Game_System_onAfterLoad.apply(this, arguments);
        //バックログ復帰がONの場合
        if(paramHistoryRestore) _novel79mv_resetLog = false;
    };

    //=============================================================================
    // Game_Interpreter
    //=============================================================================
    Game_Interpreter.prototype.extractNovel = function(index) {
        var novel = [];
        var element = "";
        var regExp = /^[\$\.\|\^!><\{\}\\]|^[A-Z]+/;
        var newPage = false;
        for (var i = 0; i < index; i++) {
            if (this._list[i]["code"] === 401){
                var str = this._list[i]["parameters"][0];
                if(/wc/.test(str)){
                    str = str.slice(0, -3);
                    newPage = true;
                }
                for (var j = 0; j < str.length; j++){
                    if (regExp.test(str[j])){
                        //追加の処理を書くかもしれないので残しておく
                        //console.log(str[j])
                    }else{
                        element += str[j];
                    }
                }
                if (newPage){
                    novel.push(element);
                    element = "";
                    newPage = false;
                }else{
                    element += '\n';
                }
            }
        }
        //console.log(novel);
        return novel;
    };

    //=============================================================================
    // Scene_Map
    // ポーズメニューにメッセージ履歴呼び出しを追加します。
    //=============================================================================

    //★ログをリセットする
    var dice2000_Scene_Map_create = Scene_Map.prototype.create;
    Scene_Map.prototype.create = function() {
        dice2000_Scene_Map_create.apply(this, arguments);
        if(_novel79mv_resetLog){
                if(_novel79mv_textlog == null) _novel79mv_textlog = [];
            }else{
                _novel79mv_textlog = $gameMap._interpreter.extractNovel($gameMap._interpreter._index);
            }
        _novel79mv_resetLog = true;
    };

    //★ポーズメニューにハンドラを追加
    Scene_Map.prototype.createPauseWindow = function() {
        this._pauseWindow = new Window_PauseMenu();
        this._pauseWindow.setHandler(Scene_Map.symbolSave, this.callSave.bind(this));
        this._pauseWindow.setHandler(Scene_Map.symbolLoad, this.callLoad.bind(this));
        this._pauseWindow.setHandler('quickSave', this.callQuickSave.bind(this));
        this._pauseWindow.setHandler('quickLoad', this.callQuickLoad.bind(this));
        this._pauseWindow.setHandler('toTitle', this.callToTitle.bind(this));
        this._pauseWindow.setHandler('cancel', this.offPause.bind(this));
        //★メッセージログ呼び出しの追加
        this._pauseWindow.setHandler('messageLog', this.callMessageLog.bind(this));
        this.addWindow(this._pauseWindow);
    };

    //★ハンドラ用メソッド
    Scene_Map.prototype.callMessageLog = function(){
        this.setupMessageLogWindow();
    };

    //★メッセージログウィンドウセットアップ
    Scene_Map.prototype.setupMessageLogWindow = function() {
        if (!this._MessageLogWindow) {
           this.createMessageLogWindow();
           this._MessageLogWindow.setHandler('cancel', this.closeMessageLogWindow.bind(this));
        }
        if (_novel79mv_textlog != null) this._MessageLogWindow.drawItem(_novel79mv_textlog.length -1);
        this._MessageLogWindow.show();
        this._MessageLogWindow.open();
        this._MessageLogWindow.activate();
        this._messageWindow.hide();
        this._messageWindow.hideActiveSubWindow();
        if(paramCanPause){
            this._pauseWindow.hide();
            this._pauseWindow.deactivate();
        }
    };

    //★メッセージログウィンドウ作成
    Scene_Map.prototype.createMessageLogWindow = function() {
        this._MessageLogWindow = new Window_MessageLog();
        this.addWindow(this._MessageLogWindow);
    };
    
    //★メッセージログウィンドウ閉じる
    Scene_Map.prototype.closeMessageLogWindow = function() {
        this._MessageLogWindow.close();
        this._MessageLogWindow.deactivate();
        this._MessageLogWindow.hide();
        this._messageWindow.show();
        this._messageWindow.showActiveSubWindow();
        if(paramCanPause){
            this._pauseWindow.show();
            this._pauseWindow.activate();
        }else{
            this.offPause();
        }
    };

    var dice2000_Scene_Map_onPause = Scene_Map.prototype.onPause;
    Scene_Map.prototype.onPause = function() {
    	if(!paramCanPause){
            Input.clear();
            $gameMessage.setPause(true);
            this.setupMessageLogWindow();
            this._messageWindow.keepActivationSubWindow();
    	}else{
            dice2000_Scene_Map_onPause.call(this);
    	}
    };

    var dice2000_Scene_Map_offPause = Scene_Map.prototype.offPause;
    Scene_Map.prototype.offPause = function() {
    	if(!paramCanPause){
            Input.clear();
            $gameMessage.setPause(false);
            this._messageWindow.restoreActivationSubWindow();
    	}else{
            dice2000_Scene_Map_offPause.call(this);
    	}
    };

    Scene_Map.prototype.callQuickSave = function() {
        this.processSave(DataManager.lastAccessedSavefileId());
        if(paramCanPause) this._pauseWindow.activate();
    };

    var dice2000_Scene_Map_setupFileListWindow = Scene_Map.prototype.setupFileListWindow;
    Scene_Map.prototype.setupFileListWindow = function() {
        //ポーズメニュー無効：直接呼び出し
        if(!paramCanPause){
            Input.clear();
            $gameMessage.setPause(true);
            this._messageWindow.keepActivationSubWindow();
            if (!this._fileListWindow) {
                this.createListWindow();
            }
            this._fileListWindow.setHandler('ok', this.onFileListWindowOk.bind(this));
            this._fileListWindow.setHandler('cancel', this.closeListWindow.bind(this));
            this._fileListWindow.setupForMapSave(this.firstSavefileIndex(), this._fileMode);
        }else{
            dice2000_Scene_Map_setupFileListWindow.call(this);
        }
    };

    var dice2000_Scene_Map_onFileListWindowOk = Scene_Map.prototype.onFileListWindowOk;
    Scene_Map.prototype.onFileListWindowOk = function() {
    	if(!paramCanPause && this.isFileModeSave()){
            this.processSave(this.savefileId());
            this.closeListWindow();
    	}else{
            dice2000_Scene_Map_onFileListWindowOk.call(this);
    	}
     };

    var dice2000_Scene_Map_closeListWindow = Scene_Map.prototype.closeListWindow;
    Scene_Map.prototype.closeListWindow = function() {
    	dice2000_Scene_Map_closeListWindow.call(this);
        //ポーズメニュー無効：直接呼び出し
        if(!paramCanPause){
            Input.clear();
            $gameMessage.setPause(false);
            this._messageWindow.restoreActivationSubWindow();
        }
    };

    //=============================================================================
    // Window_Message
    // サブウィンドウの一括表示／消去を設定します。
    //=============================================================================

    Window_Message.prototype.hideActiveSubWindow = function() {
        this.subWindows().forEach(function(subWindow) {
            subWindow.hide();
        });
    };

    Window_Message.prototype.showActiveSubWindow = function() {
        this.subWindows().forEach(function(subWindow) {
            subWindow.show();
        });
    };

    //=============================================================================
    // Window_Message
    //  通常のメッセージ表示用クラスにテキストログ追加
    //=============================================================================

    Window_Message.prototype.addtextLogState = function(text) {
        this._textLogState += text;
    };
    
    Window_Message.prototype.cleartextLogState = function() {
        this._textLogState = "";
    };
    
    Window_Message.prototype.pushtextLog = function() {
        _novel79mv_textlog.push(this._textLogState);
        if (_novel79mv_textlog.length > paramHistoryPages) _novel79mv_textlog.shift();
    };

    var dice2000_Window_Message_initMembers = Window_Message.prototype.initMembers;
    Window_Message.prototype.initMembers = function() {
        //★メッセージログのテキストをクリア
        this.cleartextLogState();
        //★元のメソッドを呼び出す
        dice2000_Window_Message_initMembers.apply(this, arguments);
    };

    var dice2000_Window_Message_processNewLine = Window_Message.prototype.processNewLine;
    Window_Message.prototype.processNewLine = function(textState) {
    	//★ログに改行を挿入
        this.addtextLogState('\n');
    	dice2000_Window_Message_processNewLine.call(this, textState);
    };

    var dice2000_Window_Message_newPage = Window_Message.prototype.newPage;
    Window_Message.prototype.newPage = function(textState) {
    	if (this._textLogState !== ""){
            this.pushtextLog();
            this.cleartextLogState();
    	}
    	dice2000_Window_Message_newPage.call(this, textState);
    };
    
    var dice2000_Window_Message_terminateMessage = Window_Message.prototype.terminateMessage;
    Window_Message.prototype.terminateMessage = function() {
        this.pushtextLog();
        this.cleartextLogState();        
        dice2000_Window_Message_terminateMessage.apply(this, arguments);
    };

    var dice2000_Window_Message_processNormalCharacter = Window_Message.prototype.processNormalCharacter;
    Window_Message.prototype.processNormalCharacter = function(textState) {
        //★制御文字を取り除いた後の一文字をログに入れる
        if(textState.text[textState.index]) this.addtextLogState(textState.text[textState.index]);
        dice2000_Window_Message_processNormalCharacter.apply(this, arguments);
    };
    
    // この辺の実装はVX Aceでノベルゲームの改造プラグイン作った時にやったのを移植
    // http://dice2000.tumblr.com/post/138847890927/
    var dice2000_Window_Message_drawMessageFace = Window_Message.prototype.drawMessageFace;
    Window_Message.prototype.drawMessageFace = function() {
        var face_name = "";
        var face_param = "[faceoff]";
        if (!this._prevTextState || !this._textState) {
            if ($gameMessage.faceName() !== "") {
                face_name = $gameMessage.faceName() + "," + $gameMessage.faceIndex() + ",0";
                face_param = "[faceon:" + face_name + "]";
            }
            dice2000_Window_Message_drawMessageFace.apply(this, arguments);
        } else {
            if ($gameMessage.faceName() !== "") {
                face_name = $gameMessage.faceName() + "," + $gameMessage.faceIndex() + "," + this._textState.y;
                face_param = "[faceon:" + face_name + "]";
            }
            this.drawFace($gameMessage.faceName(), $gameMessage.faceIndex(), 0, this._textState.y);
        }
        this.addtextLogState(face_param);
    };
    
    var _Window_Message_processDrawIcon = Window_Message.prototype.processDrawIcon
    Window_Message.prototype.processDrawIcon = function(iconIndex, textState) {
        this.addtextLogState("\x1b" + "I[" + iconIndex + "]");
        _Window_Message_processDrawIcon.apply(this, arguments);
    };

    //=============================================================================
    // Window_NovelMessage
    //  ノベルメッセージ表示用のクラスです。
    //=============================================================================

    Window_NovelMessage.prototype.terminateMessage = function() {
        //元のWindows_MessageのterminateMessageの処理を持ってくる
        this.close();
        this._goldWindow.close();
        $gameMessage.clear();
        if (!this._windowClosing) {
            this.open();
        } else {
            this.pushtextLog();
            this.cleartextLogState();
            $gameSystem.executeAutoSave();
        }
    };

    //=============================================================================
    // Window_PauseMenu
    //  イベント中ポーズメニュー表示用のクラスです。
    //=============================================================================

    Window_PauseMenu.prototype.numVisibleRows = function() {
        return 7;
    };

    var dice2000_Window_PauseMenu_makeCommandList = Window_PauseMenu.prototype.makeCommandList;
    Window_PauseMenu.prototype.makeCommandList = function() {
    	//★メッセージ履歴コマンド追加
    	this.addCommand(paramHistoryName, 'messageLog');
        dice2000_Window_PauseMenu_makeCommandList.apply(this, arguments);
    };

    //=============================================================================
    // Window_MessageLog
    //  履歴専用ウィンドウ
    //  コマンドウィンドウなのはキー入力をウィンドウに拾わせるのを不精してるからだよ
    //=============================================================================

    function Window_MessageLog() {
        this.initialize.apply(this, arguments);
    };

    Window_MessageLog.prototype             = Object.create(Window_Command.prototype);
    Window_MessageLog.prototype.constructor = Window_MessageLog;

    Window_MessageLog.prototype.initialize = function() {
        //super
        Window_Command.prototype.initialize.call(this, HistoryWindowX, HistoryWindowY);
        this.setBackgroundType(HistoryWindowType);
        //顔グラフィックフラグ
        this._showFace = false;
        //とても雑なY座標修正用の何か
        this._adjustPosY = 0;
        //カーソルを消す
        this.deselect();
    };

    Window_MessageLog.prototype.windowWidth = function() {
        if (HistoryWindowWidth <= 0) {
            return Graphics.boxWidth;            
        }else{
            return HistoryWindowWidth;
        }
    };

    Window_MessageLog.prototype.windowHeight = function() {
        if (HistoryWindowHeight <= 0) {
            return Graphics.boxHeight;
        }else{
            return HistoryWindowHeight;
        }
    };

    Window_MessageLog.prototype.standardFontSize = function() {
        return Window_Base.prototype.standardFontSize.apply(this, arguments) + paramRelativeFontSize;
    };

    Window_MessageLog.prototype.standardFontFace = function() {
        var fontFace = '';
        if (paramViewCustomFont) {
            fontFace += paramViewCustomFont;
            if (fontFace[fontFace.length - 1] !== ',') fontFace += ',';
        }
        if (paramViewMincho) fontFace += Window_NovelMessage.fontFaceMincho;
        if (paramViewGothic) fontFace += Window_NovelMessage.fontFaceGothic;
        fontFace += Window_Base.prototype.standardFontFace.call(this);
        return fontFace;
    };

    Window_MessageLog.prototype.processCursorMove = function() {
        if (Input.isRepeated('down')) {
            this.pagedownMessageLog();
        }
        if (Input.isRepeated('up')) {
            this.pageupMessageLog();
        }
        if (Input.isRepeated('right')) {
            this.pagedownMessageLog();
        }
        if (Input.isRepeated('left')) {
            this.pageupMessageLog();
        }
        if (Input.isRepeated('pagedown')) {
            this.pagedownMessageLog();
        }
        if (Input.isRepeated('pageup')) {
            this.pageupMessageLog();
        }
    };

    Window_MessageLog.prototype.onTouch = function(triggered) {
        //var lastIndex = this.index();
        var x = this.canvasToLocalX(TouchInput.x);
        var y = this.canvasToLocalY(TouchInput.y);
        //Indexは-1固定
        //var hitIndex = this.hitTest(x, y);
        //ロングプレス時にページ送りして欲しければtriggeredを外す
        if(paramHistoryTouch && triggered){
            if (eval(paramTouchPrev)){
                this.pageupMessageLog();
            }else if (eval(paramTouchNext)){
                this.pagedownMessageLog();
            }            
        }
    };

    Window_MessageLog.prototype.pageupMessageLog = function() {
        //console.log("UP");
        if (this._lastIndex > 0 && this.visible){
            SoundManager.playCursor();
            this.drawItem(this._lastIndex - 1);
        }
    };

    Window_MessageLog.prototype.pagedownMessageLog = function() {
        //console.log("DOWN");
        if (this._lastIndex + 1 < _novel79mv_textlog.length && this.visible){
            SoundManager.playCursor();
            this.drawItem(this._lastIndex + 1);
        }
    };

    //項目の描画
    Window_MessageLog.prototype.drawItem = function(idx) {
    	this._lastIndex = idx;
    	this.contents.clear();
    	var text = _novel79mv_textlog[idx];
    	if (text != null){
            this.drawLog(text);
    	}
    };
    
    //Face指定解析
    Window_MessageLog.prototype.scanFace = function(text) {
        var face_name = text.match(/\[faceon[^\]]+\]/);
        if (face_name != null){
            this._showFace = true;
            this.convertFace(face_name[0]);
            text = text.replace(/\[faceon[^\]]+\]/, "");
        }else{
            face_name = text.match(/\[faceoff\]/);
            if (face_name != null){
                this._showFace = false
                text = text.replace(/\[faceoff\]/, "");
            }
        }
        return text;
    };
    
    Window_MessageLog.prototype.convertFace = function(text) {
        text = text.replace(/\[faceon:/, "");
        text = text.replace(/\]/, "");
        var ary = text.split(",");
        console.log(ary[0]);
        this.drawFace(ary[0], Number(ary[1]), 0, Number(ary[2]));
        //↓Number(ary[2])の値をpos_yに投げないと描画がずれるよ
        this._adjustPosY = Number(ary[2]);
    };    

    //描画本体
    //テキストの折り返しを実装する
    Window_MessageLog.prototype.drawLog = function(text) {
        //改行コードでスプリットする
        var ary_text = text.split("\n");
        var pos_x = 0;
        var pos_y = 0;
        this._adjustPosY = 0;
        //改行コードsplitしたテキスト配列を一行ずつ回す
        for(var i = 0; i < ary_text.length; i++){
            var e = ary_text[i];
            //顔グラフィック表示
            e = this.scanFace(e);
            //顔グラフィック表示による修正
            pos_x = (this._showFace ? 168 : 0);
            pos_y = (this._showFace ? this._adjustPosY : pos_y);
            //折り返し描画
            pos_y = this.drawLogSentence(e, pos_x, pos_y);
            this._adjustPosY = pos_y;
            pos_x = (this._showFace ? 168 : 0);
        }
    };
   
    //折り返しありの描画
    Window_MessageLog.prototype.drawLogSentence = function(text, x, y){
        var c = text.split("");
        var pos_x = x;
        var pos_y = y;
        var special_case = false;
        for(var i = 0; i < c.length; i++){
            if (special_case){
                switch (c[i]) {
                case 'C':
                    break;
                case 'I':
                    var j = i + 2;
                    var icon_index = "";
                    while (c[j].match(/^[0-9]/)){
                        icon_index += c[j];
                        j++;
                    }
                    if (pos_x > this.contents.width - Window_Base._iconWidth){
                        pos_x = (this._showFace ? 168 : 0);
                        pos_y += this.standardFontSize() + this.textPadding();
                    }
                    this.drawIcon(Number(icon_index), pos_x, pos_y);
                    pos_x += Window_Base._iconWidth;
                    break;
                case '{':
	                special_case = false;
                    break;
                case '}':
	                special_case = false;
                    break;
                case ']':
                    special_case = false;
                    break;
                default:
                    break;
                }
            }else{
                if(c[i] === '\x1b'){
                    special_case = true;
                }else if(c[i]){
                    //通常描画
                    if (pos_x > this.contents.width - this.textWidth(c[i])){
                        pos_x = (this._showFace ? 168 : 0);
                        pos_y += this.standardFontSize() + this.textPadding();
                    }                    
                    this.drawTextEx(c[i], pos_x, pos_y);
                    pos_x += this.textWidth(c[i]);
                }                
            }
        }
        pos_y += this.standardFontSize() + this.textPadding();
        return pos_y;
    };

    //==========================================================================
    // Window_NovelMessage
    // オプション「一括表示」の適用
    //==========================================================================

    var dice2000_Window_NovelMessage_updateWait      = Window_NovelMessage.prototype.updateWait;
    Window_NovelMessage.prototype.updateWait = function() {
        if($gameSwitches.value(paramShowAtOnce) && !paramAutoSave){
            this._showAll = true;
        }
        return dice2000_Window_NovelMessage_updateWait.apply(this, arguments);
    };

    var dice2000_Window_NovelMessage_onEndOfText = Window_NovelMessage.prototype.onEndOfText;
    Window_NovelMessage.prototype.onEndOfText = function() {
    	var flag = ($gameSwitches.value(paramShowAtOnce) && !paramAutoSave);
        if (flag && !this._windowClosing) this._pauseSkip = true;
        if (flag && this._windowClosing) this._pauseSkip = false;
        dice2000_Window_NovelMessage_onEndOfText.apply(this, arguments);
    };

})();
