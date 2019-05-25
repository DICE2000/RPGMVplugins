//=============================================================================
// dice2000_MBS_FPLE_patch.js
//=============================================================================
// https://github.com/MaskedRpg/JS/blob/master/mv/MBS_FPLE.js
// MBS - FPLE MV Ver.1.50(2017-01-09)
// http://yanfly.moe/2015/10/09/yep-1-core-engine/
// Yanfly Core Engine Ver.1.28
// http://ytomy.sakura.ne.jp/tkool/rpgtech/tech_mv/map/minimap.html
// KameSoft ミニマップ Ver.0.1.2
// 以上を併用できるようにする補助スクリプトです。
// 上記以外のバージョンでも使えるかもしれません。
// その場合はスクリプト内のバージョンチェックを書きかえてください（無保証）。
//
// 本プラグインは NYSL Version 0.9982(http://www.kmonos.net/nysl/) に従い、
// 著作者人格権を行使せず、その他の著作権に関する一切の権利を放棄します。
// 19/5/20
// ↓止めていなかったので止めさせた。
// 18/12/23
// Yanfly Core Engineのバージョンチェックを止めた。
// 18/7/28
// 初版。
// ----------------------------------------------------------------------------
// NAK a.k.a. 22番目の素数
// [Blog]   : http://dice2000.tumblr.com/
// [GitHub] : https://github.com/DICE2000
// ----------------------------------------------------------------------------
/*:
 * @plugindesc MBS_FPLEにYEPCore適用／ミニマップ追加補助
 * @author 22番目の素数(NAK)
 *
 * @help このスクリプトはMBS_FPLE/YEP CoreEngineの下、KMS_Minimapの上に置いてください。
 */

//グローバルに定義されている変数の存在チェック
var Imported = Imported || {};
var Yanfly = Yanfly || {};

if(Imported['MBS - FPLE'] === 1.40) {
    if (Imported.YEP_CoreEngine) {
    if (Yanfly.Core.version) {
        var dice2000_YEPCE_Scene_Map_snapForBattleBackground = Scene_Map.prototype.snapForBattleBackground;
        Scene_Map.prototype.snapForBattleBackground = function() {
            if(this.useFPLE()){
                Yanfly.Core.Scene_Map_snapForBattleBackground.call(this);
            }else{
                dice2000_YEPCE_Scene_Map_snapForBattleBackground.call(this);
            }
        };
    }   // Yanfly.Core.version
    };  // YEP_CoreEngine

    //以下は https://github.com/triacontane/RPGMakerMV/blob/master/MBS_FPLE.js より
    var aliasCreateSpriteset            = Scene_Map.prototype.createSpriteset;
    Scene_Map.prototype.createSpriteset = function() {
        if (this.useFPLE()) {
            this._spriteset                      = new Spriteset_Base();
            this._spriteset._blackScreen.opacity = 0;
            this.addChild(this._spriteset);
            if (this.createMiniMap) {
                this.createMiniMap();
                this.updateMiniMap();
            }
        } else {
            aliasCreateSpriteset.apply(this, arguments);
        }
    };

    if (Object.keys(PluginManager.parameters('KMS_Minimap')).length > 0) {
        Scene_Map.prototype.createMiniMap = function() {
            Spriteset_Map.prototype.createMinimap.call(this._spriteset);
        };

        Scene_Map.prototype.updateMiniMap = function() {
            Spriteset_Map.prototype.updateMinimap.call(this._spriteset);
        };
    }
}

//=============================================================================
// FILE NO OWARI
//=============================================================================