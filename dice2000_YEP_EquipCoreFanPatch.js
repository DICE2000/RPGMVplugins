//=============================================================================
// dice2000_YEP_EquipCoreFanPatch.js
//=============================================================================
//
// YanflyEnginePluginのバグや仕様をああだこうだする
//
//
// ----------------------------------------------------------------------------
// NAK a.k.a. 22番目の素数
// [GitHub] : https://github.com/DICE2000
// ----------------------------------------------------------------------------
/*:
 * @plugindesc YEPのEquipCore導入時の比較ウィンドウ変更
 * @author 22番目の素数(NAK)
 * 
 * @param Show HP and MP
 * @text HPとMPの表示
 * @desc 装備変更時にHPとMPを比較表示します。
 * @default true
 * @type boolean
 * 
 * @param Show luk
 * @text 運の表示
 * @desc 装備変更時に運の値を比較表示します。
 * @default true
 * @type boolean
 * 
 * @param Show hit rate
 * @text 命中率の表示
 * @desc 装備変更時に命中率を比較表示します。
 * @default false
 * @type boolean
 * 
 * @param Show eva rate
 * @text 回避率の表示
 * @desc 装備変更時に回避率を比較表示します。
 * @default false
 * @type boolean
 * 
 * @param Show mev rate
 * @text 魔法回避率の表示
 * @desc 装備変更時に魔法回避率を比較表示します。
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
 * 装備変更時のウィンドウに表示されるステータスを変更するプラグインです。
 * ・HPとMPは要らない（ゲージ描画でわかる）
 * ・回避率を表示したい
 * という需要が自分にあったので作りました。
 *
 */

//グローバルに定義されている変数の存在チェック
var Imported = Imported || {};
var Yanfly = Yanfly || {};

var parameters = PluginManager.parameters('dice2000_YEP_EquipCoreFanPatch');
var paramShowHpMpInEquip = (parameters['Show HP and MP']  === 'true');
var paramShowLukInEquip = (parameters['Show luk']  === 'true');
var paramShowHitInEquip = (parameters['Show hit rate']  === 'true');
var paramShowEvaInEquip = (parameters['Show eva rate']  === 'true');
var paramShowMevInEquip = (parameters['Show mev rate']  === 'true');
var paramMevNameInEquip = String(parameters['Mev Name']);

if (Imported.YEP_EquipCore) {
    if (Yanfly.Equip.version) {
        Window_StatCompare.prototype.refresh = function() {
            this.contents.clear();
            if (!this._actor) return;
            var y = 0;
            //HPとMPの表示がある場合
            if(paramShowHpMpInEquip){
                for (var i = 0; i < 7; ++i) {
                    this.drawItem(0, this.lineHeight() * i, i);
                }
                y = 7;          
            }else{
                //攻撃・防御・魔攻・魔防・敏捷
                for (var i = 2; i < 7; ++i) {
                    this.drawItem(0, this.lineHeight() * (i - 2), i);
                }
                y = 5;
            }
            var ItemId = 7;
            if(paramShowLukInEquip){
                this.drawItem(0, this.lineHeight() * y, ItemId);
                y++;
            }
            var ItemId = 8;
            if(paramShowHitInEquip){
                this.drawItem(0, this.lineHeight() * y, ItemId);
                y++;
            }
            var ItemId = 9;            
            if(paramShowEvaInEquip){
                this.drawItem(0, this.lineHeight() * y, ItemId);
                y++;
            }
            var ItemId = 12;            
            if(paramShowMevInEquip){
                this.drawItem(0, this.lineHeight() * y, ItemId);
                y++;
            }
        };

        Window_StatCompare.prototype.drawParamName = function(y, paramId) {
            var x = this.textPadding();
            this.changeTextColor(this.systemColor());
            if(paramId === 12){
                this.drawText(paramMevNameInEquip, x, y, this._paramNameWidth);    
            }else{
                this.drawText(TextManager.param(paramId), x, y, this._paramNameWidth);
            }
        };
    
        Window_StatCompare.prototype.drawCurrentParam = function(y, paramId) {
            var x = this.contents.width - this.textPadding();
            x -= this._paramValueWidth * 2 + this._arrowWidth + this._bonusValueWidth;
            this.resetTextColor();
            var actorparam = 0;
            var str_percent = '';
            if(paramId >= 8){
                str_percent = '%';
                var value = this._actor.xparam(paramId - 8) * 100;
                actorparam = Yanfly.Util.toGroup(value);
            }else{
                actorparam = Yanfly.Util.toGroup(this._actor.param(paramId));
            }
            this.drawText(actorparam + str_percent, x, y, this._paramValueWidth, 'right');
        };
    
        Window_StatCompare.prototype.drawNewParam = function(y, paramId) {
            var x = this.contents.width - this.textPadding();
            x -= this._paramValueWidth + this._bonusValueWidth;
            var newValue = 0;
            var diffvalue = 0;
            var str_percent = '';
            if(paramId >= 8){
                str_percent = '%';
                newValue = this._tempActor.xparam(paramId - 8) * 100;
                diffvalue = newValue - this._actor.xparam(paramId - 8) * 100;
            }else{
                newValue = this._tempActor.param(paramId);
                diffvalue = newValue - this._actor.param(paramId);
            }
            var actorparam = Yanfly.Util.toGroup(newValue);
            this.changeTextColor(this.paramchangeTextColor(diffvalue));
            this.drawText(actorparam + str_percent, x, y, this._paramValueWidth, 'right');
        };
    
        Window_StatCompare.prototype.drawParamDifference = function(y, paramId) {
            var x = this.contents.width - this.textPadding();
            x -= this._bonusValueWidth;
            var newValue = 0;
            var diffvalue = 0;
            var str_percent = '';
            if(paramId >= 8){
                newValue = this._tempActor.xparam(paramId - 8) * 100;
                diffvalue = newValue - this._actor.xparam(paramId - 8) * 100;
            }else{
                newValue = this._tempActor.param(paramId);
                diffvalue = newValue - this._actor.param(paramId);
            }
            if (diffvalue === 0) return;
            var actorparam = Yanfly.Util.toGroup(newValue);
            this.changeTextColor(this.paramchangeTextColor(diffvalue));
            var text = Yanfly.Util.toGroup(diffvalue);
            if (diffvalue > 0) {
              text = ' (+' + text + ')';
            } else {
              text = ' (' + text + ')';
            }
            this.drawText(text, x, y, this._bonusValueWidth, 'left');
        };
    }   // Yanfly.Equip.version
};  // YEP_EquipCore

//=============================================================================
// FILE NO OWARI
//=============================================================================