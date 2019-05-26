//=============================================================================
// dice2000_YEP_BuffStatesFanPatch.js
//=============================================================================
//
// ----------------------------------------------------------------------------
// NAK a.k.a. 22番目の素数
// [Blog]   : https://dice2000.tumblr.com/
// [GitHub] : https://github.com/DICE2000
// ----------------------------------------------------------------------------
/*:
 * @plugindesc YEPのBuffStatesCoreの仕様を変更するプラグイン
 * @author 22番目の素数(NAK)
 * 
 * @param YEP BSC Rate Counters
 * @text バフ／デバフをカウント表示する
 * @type boolean
 * @on ON
 * @off OFF
 * @default true
 *
 * @param YEP BSC Percentage of Rate
 * @text バフ／デバフ割合
 * @desc 1回あたりの上昇／下降率を％で入力します。
 * @type number
 * @min 1
 * @default 25
 *
 * @help このスクリプトはYEPシリーズの下に置いてください。
 *
 * ★YEP_BuffsStatesCoreでバフの割合を百分率表示ではなく
 *   回数表示に変更します。
 *   この変更にともなってBSC本体のCounter SettingsのAlignmentが
 *   有効になります。（1.14時点では強制センタリングされ無効）
 *
 */

//グローバルに定義されている変数の存在チェック
var Imported = Imported || {};
var Yanfly = Yanfly || {};

var paramBSCRateCounter = (PluginManager.parameters('dice2000_YEP_BuffStatesFanPatch')['YEP BSC Rate Counters']  === 'true');
var paramBSCRatePercentage = Number((PluginManager.parameters('dice2000_YEP_BuffStatesFanPatch')['YEP BSC Percentage of Rate']));

if (Imported.YEP_BuffsStatesCore) {
if (Yanfly.BSC.version) {
    Sprite_StateIcon.prototype.drawBuffRate = function(paramId) {
        if (!Yanfly.Param.BSCShowTurns) return;
        var value = this._battler.paramBuffRate(paramId);
        var text = Math.floor(value * 100) + '%';
        if(paramBSCRateCounter){
            value = Math.floor(((value * 100) - 100) / paramBSCRatePercentage);
            text = String(Math.abs(value));
        }
        var wx = Yanfly.Param.BSCCounterBufferX || 0;
        var wy = (Yanfly.Param.BSCCounterBufferY || 8) - 2;
        var ww = Window_Base._iconWidth;
        var wh = Window_Base.prototype.lineHeight.call(this);
        var align = Yanfly.Param.BSCCounterAlign;
        var contents = this._turnCounterSprite.bitmap;
        contents.fontSize = Yanfly.Param.BSCFontSize * 0.75;
        contents.textColor = this.textColor(0);
        contents.drawText(text, wx, wy, ww, wh, align);
    };

    Window_Base.prototype.drawBuffRate = function(actor, paramId, wx, wy) {
      var value = actor.paramBuffRate(paramId);
      if (value === undefined) return;
      if(paramBSCRateCounter){
            value = Math.floor(((value * 100) - 100) / paramBSCRatePercentage);
            value = String(Math.abs(value));
      }else{
            value = Math.floor(value * 100) + '%';
      }
      this.contents.fontSize = (Yanfly.Param.BSCCounterSize || 16) * 0.75;
      wx += Yanfly.Param.BSCCounterBufferX || 0;
      wy += Yanfly.Param.BSCCounterBufferY || 8;
      var align = Yanfly.Param.BSCCounterAlign;
      this.changePaintOpacity(true);
      this.drawText(value, wx, wy, Window_Base._iconWidth, align);
      this.resetFontSettings();
      this.resetTextColor();
    };
}   // Yanfly.BSC.version
};  // YEP_BuffsStatesCore

//=============================================================================
// FILE NO OWARI
//=============================================================================