//=============================================================================
// dice2000_YEP_MessageFanPatch.js
//=============================================================================
//
// ----------------------------------------------------------------------------
// NAK a.k.a. 22番目の素数
// [Blog]   : http://nak.hits.jp/documents/rpgmaker.html
// [GitHub] : https://github.com/DICE2000
// ----------------------------------------------------------------------------
/*:
 * @plugindesc YEPのMessageCoreの仕様変更
 * @author 22番目の素数(NAK)
 * 
 * @param MessageCore Break Word
 * @text 強制改行
 * @desc MessageCore：スペースで区切られていない単語も強制的に改行します。
 * @default false
 * @type boolean
 *
 * @param YEP MC NameBoxY
 * @text 名前ウィンドウ微調整
 * @desc 変数で位置を調整できます。
 * @type variable
 * @default 0
 * 
 * @help
 * ★日本語でもWordWrapできるようにした
 * ★名前ウィンドウのY座標を変数で動かせるようにした
 * ★3行メッセージウィンドウ向けにlineheight等を微調整した（うろ覚え）
 * 
 */

//グローバルに定義されている変数の存在チェック
var Imported = Imported || {};
var Yanfly = Yanfly || {};

//オプションの値
var paramWordBreak = (PluginManager.parameters('dice2000_YEP_MessageFanPatch')['MessageCore Break Word']  === 'true');
var paramMCnameboxY = Number((PluginManager.parameters('dice2000_YEP_MessageFanPatch')['YEP MC NameBoxY']));

if (Imported.YEP_MessageCore) {
if (Yanfly.Message.version) {
    var dice2000_YEPMC_wordbreak_Window_Base_checkWordWrap = Window_Base.prototype.checkWordWrap;
    Window_Base.prototype.checkWordWrap = function(textState) {
        var flagcheck = paramWordBreak && this._wordWrap && !!textState;
        if(flagcheck){
            //YED_WordWrap.jsの引き写しです!!
            var word = textState.text[textState.index];
            var size = this.textWidthExCheck(word);
            var result = (size + textState.x > this.wordwrapWidth());
            if(result) textState.index--;
            return result;
        }else{
            dice2000_YEPMC_wordbreak_Window_Base_checkWordWrap.apply(this, arguments);
        }
    };

    Window_Message.prototype.windowHeight = function() {
        //デフォルト：180
        var value = (this.fittingHeight(this.numVisibleRows()) > 180) ? this.fittingHeight(this.numVisibleRows()) : 180;
        return value;
    };

    Window_Message.prototype.lineHeight = function() {
        return ($gameSystem.getMessageFontSize() + 8);
    };

    Window_Message.prototype.newPage = function(textState) {
        this.adjustWindowSettings();
        this.contents.clear();
        this.resetFontSettings();
        this.clearFlags();
        this.loadMessageFace();
        textState.x = this.newLineX();
        var y = (180 - (this.lineHeight() * this.numVisibleRows() + this.standardPadding() * 2)) / 2;
        textState.y = y;
        textState.left = this.newLineX();
        textState.height = this.calcTextHeight(textState, false);
    };

    Window_NameBox.prototype.adjustPositionY = function() {
        if ($gameMessage.positionType() === 0) {
            this.y = this._parentWindow.y + this._parentWindow.height;
            this.y -= eval(Yanfly.Param.MSGNameBoxBufferY);
            if(paramMCnameboxY !== 0) this.y += $gameVariables.value(paramMCnameboxY);
        } else {
            this.y = this._parentWindow.y;
            this.y -= this.height;
            this.y += eval(Yanfly.Param.MSGNameBoxBufferY);
            if(paramMCnameboxY !== 0) this.y += $gameVariables.value(paramMCnameboxY);
        }
        if (this.y < 0) {
            this.y = this._parentWindow.y + this._parentWindow.height;
            this.y -= eval(Yanfly.Param.MSGNameBoxBufferY);
            if(paramMCnameboxY !== 0) this.y += $gameVariables.value(paramMCnameboxY);
        }
    };

}   // Yanfly.Message.version
};  // YEP_MessageCore

//=============================================================================
// FILE NO OWARI
//=============================================================================
