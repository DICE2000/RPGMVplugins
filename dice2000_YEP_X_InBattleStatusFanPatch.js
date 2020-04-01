//=============================================================================
// dice2000_YEP_X_InBattleStatusFanPatch.js
//=============================================================================
//
// YanflyEnginePluginのバグや仕様をああだこうだする
//
// ----------------------------------------------------------------------------
// NAK a.k.a. 22番目の素数
// [GitHub] : https://github.com/DICE2000
// ----------------------------------------------------------------------------
/*:
 * @plugindesc YEPの戦闘内ステータスウィンドウの描画変更
 * @author 22番目の素数(NAK)
 * 
 * @param show BS help window
 * @text ヘルプウィンドウを表示する
 * @desc ヘルプウィンドウの表示を設定します。
 * @default false
 * @type boolean
 * 
 * @param Select Key UpDown
 * @text 上下でページ切替
 * @desc カーソルキー上下でもページを切り替えられるようにします。
 * @default true
 * @type boolean
 * 
 * @param Show luk
 * @text 運の表示
 * @desc 運の値を表示します。
 * @default true
 * @type boolean
 * 
 * @param Show hit rate
 * @text 命中率の表示
 * @desc 命中率を表示します。
 * @default false
 * @type boolean
 * 
 * @param Show eva rate
 * @text 回避率の表示
 * @desc 回避率を表示します。
 * @default false
 * @type boolean
 * 
 * @param Show mev rate
 * @text 魔法回避率の表示
 * @desc 魔法回避率を表示します。
 * @default false
 * @type boolean
 * 
 * @param Mev Name
 * @text 魔法回避率の名前
 * @desc 魔法回避率の名前を設定します。
 * @default 魔法回避率
 * @type string
 *
 * @help このスクリプトはYEPシリーズの下に置いてください。
 *
 * 上下キーでもキャラクターを切り替えられるようにしました。
 * 
 * ヘルプウィンドウが無内容なのですが
 * とりあえずプラグインパラメータでON/OFFできるようにしました。
 * （せめて状態異常のヘルプはメモ欄でも参照してくれないと使えない）
 * 
 * ヘルプウィンドウ非表示＆上下キー切り替え表示で
 * 状態異常のカーソル表示が無効になります。
 * 
 * 絶対に表示されるステータス
 * 攻撃力・防御力・魔法攻撃・魔法防御・敏捷性
 * 
 * 表示の有無が切り替えられる
 * 運・命中率・物理回避率・魔法回避率
 * 
 * 項目数が多いと二列で描画してくれますが判定はてきとうです
 * 
 * 魔法回避率はデータベースで名前を設定できないので
 * プラグインコマンドで設定してください。
 * 
 */

//グローバルに定義されている変数の存在チェック
var Imported = Imported || {};
var Yanfly = Yanfly || {};


var parameters = PluginManager.parameters('dice2000_YEP_X_InBattleStatusFanPatch');
var paramShowBSHelpWindow = (parameters['show BS help window']  === 'true');
var paramSelectKeyUpDownInBattleStatus = (parameters['Select Key UpDown']  === 'true');
var paramShowLukInBattleStatus = (parameters['Show luk']  === 'true');
var paramShowHitInBattleStatus = (parameters['Show hit rate']  === 'true');
var paramShowEvaInBattleStatus = (parameters['Show eva rate']  === 'true');
var paramShowMevInBattleStatus = (parameters['Show mev rate']  === 'true');
var paramMevNameInBattleStatus = String(parameters['Mev Name']);

if (Imported.YEP_X_InBattleStatus) {
    if (Yanfly.IBS.version) {      
        if(paramSelectKeyUpDownInBattleStatus){
          Window_InBattleStateList.prototype.cursorDown = function(wrap) {
            var index = $gameParty.battleMembers().indexOf(this._battler);
            var current = index;
            index += 1;
            index = index.clamp(0, $gameParty.battleMembers().length - 1);
            if (current !== index) {
              var battler = $gameParty.battleMembers()[index];
              this.setBattler(battler);
              SoundManager.playCursor();
            }
          };
          
          Window_InBattleStateList.prototype.cursorUp = function(wrap) {
            var index = $gameParty.battleMembers().indexOf(this._battler);
            var current = index;
            index -= 1;
            index = index.clamp(0, $gameParty.battleMembers().length - 1);
            if (current !== index) {
              var battler = $gameParty.battleMembers()[index];
              this.setBattler(battler);
              SoundManager.playCursor();
            }
          };
        }

        var dice2000_Scene_Battle_commandInBattleStatus = Scene_Battle.prototype.commandInBattleStatus;
        Scene_Battle.prototype.commandInBattleStatus = function() {
          dice2000_Scene_Battle_commandInBattleStatus.apply(this, arguments);
          this._helpWindow.visible = paramShowBSHelpWindow;
        };

        var Window_InBattleStateList_setBattler = Window_InBattleStateList.prototype.setBattler;
        Window_InBattleStateList.prototype.setBattler = function(battler) {
          if(!paramShowBSHelpWindow && paramSelectKeyUpDownInBattleStatus){
            this._battler = battler;
            this._parentWindow.setBattler(battler);
            this.refresh();
            this.deselect();
            if (this._statusWindow) {
              var index = $gameParty.battleMembers().indexOf(battler)
              this._statusWindow.select(index);
            }
          }else{
            Window_InBattleStateList_setBattler.apply(this, arguments);
          }
        };
    
        Window_InBattleStatus.prototype.refresh = function() {  
          this.contents.clear();
          if (!this._battler) return;
          var x = this.standardPadding() + eval(Yanfly.Param.IBSStatusListWidth);
          this.drawActorFace(this._battler, x, 0, Window_Base._faceWidth);
          var x2 = x + Window_Base._faceWidth + this.standardPadding();
          var w = this.contents.width - x2;
          this.drawActorSimpleStatus(this._battler, x2, 0, w);
          w = this.contents.width - x;
          var y = Math.ceil(this.lineHeight() * 4.5);
          var h = this.contents.height - y;
          //攻撃・防御・魔法攻撃・魔法防御・敏捷性は確定で描画
          var number_status = 5;
          if(paramShowLukInBattleStatus) number_status++;
          if(paramShowHitInBattleStatus) number_status++;
          if(paramShowEvaInBattleStatus) number_status++;
          if(paramShowMevInBattleStatus) number_status++;
          //6項目以上描画する場合
          if(number_status > 6){
            w = Math.floor(w / 2);
          }
          for (var i = 2; i < 7; ++i) {
            this.drawParam(i, x, y, w, this.lineHeight());
            y += this.lineHeight();
          }
          if(number_status > 6){
            x += w;
            y = Math.ceil(this.lineHeight() * 4.5);            
          }
          //運
          var i = 7;
          if(paramShowLukInBattleStatus){
            this.drawParam(i, x, y, w, this.lineHeight());
            y += this.lineHeight();
          }
          //命中率
          i = 8;
          if(paramShowHitInBattleStatus){
            this.drawParam(i, x, y, w, this.lineHeight());
            y += this.lineHeight();
          }
          //回避率
          i = 9;
          if(paramShowEvaInBattleStatus){
            this.drawParam(i, x, y, w, this.lineHeight());
            y += this.lineHeight();
          }
          //魔法回避率
          //ちなみに10は会心率、11は会心回避率
          i = 12;
          if(paramShowMevInBattleStatus){
            this.drawParam(i, x, y, w, this.lineHeight());
            y += this.lineHeight();
          }
        };
    
        var dice2000_Window_InBattleStatus_drawParam = Window_InBattleStatus.prototype.drawParam;
        Window_InBattleStatus.prototype.drawParam = function(paramId, dx, dy, dw, dh) {
            if (paramId >= 8){
                //命中率、回避率
                this.drawDarkRect(dx, dy, dw, dh);
                var level = this._battler._buffs[paramId];
                var icon = this._battler.buffIconIndex(level, paramId);
                this.drawIcon(icon, dx + 2, dy + 2);
                dx += Window_Base._iconWidth + 4;
                dw -= Window_Base._iconWidth + 4 + this.textPadding() + 2;
                this.changeTextColor(this.systemColor());
                if(paramId <= 9){
                    this.drawText(TextManager.param(paramId), dx, dy, dw);
                }else{
                    this.drawText(paramMevNameInBattleStatus, dx, dy, dw);
                }
                //丸める
                var value = Math.round(this._battler.xparam(paramId - 8) * 100);
                this.changeTextColor(this.paramchangeTextColor(level));
                this.drawText(Yanfly.Util.toGroup(value) + '%', dx, dy, dw, 'right');            
            }else{
                dice2000_Window_InBattleStatus_drawParam.apply(this, arguments);
            }
        };
    }   // Yanfly.IBS.version
};  // YEP_X_InBattleStatus

//=============================================================================
// FILE NO OWARI
//=============================================================================
