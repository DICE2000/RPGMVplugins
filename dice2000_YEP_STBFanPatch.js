//=============================================================================
// dice2000_YEP_STBFanPatch.js
//=============================================================================
//
// ----------------------------------------------------------------------------
// NAK a.k.a. 22番目の素数
// [Blog]   : https://dice2000.tumblr.com/
// [GitHub] : https://github.com/DICE2000
// ----------------------------------------------------------------------------
/*:
 * @plugindesc YEP STBの調整をするプラグイン
 * @author 22番目の素数(NAK)
 *
 * @help
 * YanflyのStandard Turn Battleのバグを修正します。
 * ★逃走に失敗すると戦闘ターンが初期化されるバグ
 * ★StartTurnとEndTurnのウェイトは検証の結果STBには不要と判断したので除去
 * ★フロントビューに不要と思われるウェイトの除去
 */

//グローバルに定義されている変数の存在チェック
var Imported = Imported || {};
var Yanfly = Yanfly || {};

if (Imported.YEP_X_BattleSysSTB) {
if (Yanfly.STB.version) {

    //↓ターン冒頭に変なウェイトを掛ける犯人
    Window_BattleLog.prototype.startTurn = function() {
        //this.push('wait');
    };

    //endTurnでのポップアップ再生ウェイト　STBだと変な間が開くので抑止
    BattleManager.endTurn = function() {
        //console.log('endTurn');
        //if (this.isTurnBased() && this._spriteset.isPopupPlaying()) return;
        if (this.isTurnBased() && this._enteredEndPhase) {
            this._phase = 'turnEnd';
            this._preemptive = false;
            this._surprise = false;
            return;
        }
        this._enteredEndPhase = true;
        Yanfly.BEC.BattleManager_endTurn.call(this);
        BattleManager.refreshAllMembers();
    };

    //サイドビューのアニメのウェイトを取る
    BattleManager.actionPerformAction = function() {
        this._logWindow.performAction(this._subject, this._action);
        if (this._subject.isActor() && this._subject.isSpriteVisible) {
          if(!$gameSystem.isSideView()) this._logWindow._waitCount += 20;
          return false;
        }
        return true;
    };

    BattleManager.actionMotionWait = function(actionArgs) {
        var targets = this.makeActionTargets(actionArgs[0]);
        if (targets[0].isActor() && targets[0].isSpriteVisible()) {
          if(!$gameSystem.isSideView()) this._logWindow._waitCount += 12;
          return false;
        }
        return true;
    };

    BattleManager.processEscape = function() {
        $gameParty.performEscape();
        SoundManager.playEscape();
        var success = this._preemptive ? true : (Math.random() < this._escapeRatio);
        if ($gamePlayer.isDebugThrough()) success = true;
        if (success) {
            $gameParty.performEscapeSuccess();
            this.displayEscapeSuccessMessage();
            this._escaped = true;
            this.processAbort();
        } else {
            this.displayEscapeFailureMessage();
            this._escapeRatio += this._escapeFailBoost;
            if(!this.isSTB()) $gameParty.clearActions();
            this.startTurn();
        }
        return success;
    };
}   // Yanfly.STB.version
};  // YEP_X_BattleSysSTB

//=============================================================================
// FILE NO OWARI
//=============================================================================