//=============================================================================
// dice2000_YEP_BattleEngineFanPatch.js
//=============================================================================
//
// YanflyEnginePluginのバグや仕様をああだこうだする
// 
// ★YEP_BattleEngineCore(Ver.1.46)でSelect Help Windowをtrueにした際に
//   選択肢のロック処理ができていないのを修正。
//   味方全体（戦闘不能）単体のスキル／アイテムを生存者に使おうとする時に
//   エラー音が返るように修正。
//   味方単体のスキルを戦闘不能者に使おうとする時にもエラー音が返る仕様に。
//   Todo:味方全体（戦闘不能）全体スキルで、全員が点滅してしまう
//
// ----------------------------------------------------------------------------
// NAK a.k.a. 22番目の素数
// [Blog]   : https://dice2000.tumblr.com/
// [GitHub] : https://github.com/DICE2000
// ----------------------------------------------------------------------------
/*:
 * @plugindesc YEPのBattleEngineの仕様変更プラグイン
 * @author 22番目の素数(NAK)
 *
 * @help このスクリプトはYEPシリーズの下に置いてください。
 * 
 * @param Ignore Miss
 * @text 失敗判定を無視
 * @desc 失敗判定の演出を無視し、回避判定の演出に統一します。
 * @type boolean
 * @on ON
 * @off OFF
 * @default false
 *
 * @param ResultWindowPos
 * @text 戦闘結果のウィンドウ位置
 * @type select
 * @option 上
 * @value 0
 * @option 中央
 * @value 1
 * @option 下
 * @value 2
 * @default 2
 *
 * @param BattleLogPosY
 * @text バトルログのY座標
 * @type number
 * @default 0
 *
 */

//グローバルに定義されている変数の存在チェック
var Imported = Imported || {};
var Yanfly = Yanfly || {};

var paramIgnoreMiss = (PluginManager.parameters('dice2000_YEP_BattleEngineFanPatch')['Ignore Miss']  === 'true');
var paramResultWindowPos = Number((PluginManager.parameters('dice2000_YEP_BattleEngineFanPatch')['ResultWindowPos']));
var paramBattleLogPosY = Number((PluginManager.parameters('dice2000_YEP_BattleEngineFanPatch')['BattleLogPosY']));

if (Imported.YEP_BattleEngineCore) {
if (Yanfly.BEC.version) {
    
    Game_Battler.prototype.performResultEffects = function() {
        var result = this.result();
        if(paramIgnoreMiss){
            if (result.missed || result.evaded) {
              if (result.physical) {
                this.performEvasion();
              } else {
                this.performMagicEvasion();
              }
            }            
        }else{
            //元の定義
            if (result.missed && result.physical) this.performMiss();
            if (result.evaded) {
              if (result.physical) {
                this.performEvasion();
              } else {
                this.performMagicEvasion();
              }
            }
        }
        if (result.hpAffected) {
          if (result.hpDamage > 0 && !result.drain) {
            this.performDamage();
          }
          if (result.hpDamage < 0) {
            this.performRecovery();
          }
        }
        if (this.isAlive() && result.mpDamage !== 0 && result.mpDamage < 0) {
          this.performRecovery();
        }
        if (this.isAlive() && result.tpDamage !== 0 && result.tpDamage < 0) {
          this.performRecovery();
        }
    };
    
    Window_BattleActor.prototype.autoSelect = function() {
        var action = BattleManager.inputtingAction();
        if (!action) return;
        this._inputLock = false;
        this._selectDead = false;
        this._selectAll = false;
        if (action.isForUser()) {
            this.select(BattleManager.actor().index());
            this._inputLock = true;
        } else if (action.isForAll()) {
            this._inputLock = true;
            this._selectAll = true;
            this.updateCursor();
        } else if (action.isForDeadFriend()) {
            this._selectDead = true;
            this.autoSelectFirstDeadActor();
        }
    };

    Window_BattleActor.prototype.updateCursor = function() {
        if (this._cursorAll || this._selectAll) {
            var allRowsHeight = this.maxRows() * this.itemHeight();
            this.setCursorRect(0, 0, this.contents.width, allRowsHeight);
            this.setTopRow(0);
        } else if (this.isCursorVisible()) {
            var rect = this.itemRect(this.index());
            this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
        } else {
            this.setCursorRect(0, 0, 0, 0);
        }
    };

    var dice2000_Window_BattleActor_processOk = Window_BattleActor.prototype.processOk;
    Window_BattleActor.prototype.processOk = function() {
        if(this._selectDead && !this.actor().isDead()){
            this.playBuzzerSound();
        }else if(!this._selectDead && this.actor().isDead()){
            this.playBuzzerSound();
        }else{
            dice2000_Window_BattleActor_processOk.call(this);
        }
    };

    Window_BattleActor.prototype.isOkEnabled = function() {
        return Window_Selectable.prototype.isOkEnabled.call(this);
    };

    //戦闘終了メッセージウィンドウ位置
    var dice2000_BattleManager_displayVictoryMessage = BattleManager.displayVictoryMessage;
    BattleManager.displayVictoryMessage = function() {
        $gameMessage.setPositionType(paramResultWindowPos);
        dice2000_BattleManager_displayVictoryMessage.call(this);
    };

    var dice2000_BattleManager_displayDefeatMessage = BattleManager.displayDefeatMessage;
    BattleManager.displayDefeatMessage = function() {
        $gameMessage.setPositionType(paramResultWindowPos);
        dice2000_BattleManager_displayDefeatMessage.call(this);
    };

    var dice2000_BattleManager_displayEscapeSuccessMessage = BattleManager.displayEscapeSuccessMessage;
    BattleManager.displayEscapeSuccessMessage = function() {
        $gameMessage.setPositionType(paramResultWindowPos);
        dice2000_BattleManager_displayEscapeSuccessMessage.call(this);
    };

    var dice2000_BattleManager_displayEscapeFailureMessage = BattleManager.displayEscapeFailureMessage;
    BattleManager.displayEscapeFailureMessage = function() {
        $gameMessage.setPositionType(paramResultWindowPos);
        dice2000_BattleManager_displayEscapeFailureMessage.call(this);
    };

    //バトルログの位置調整
    var dice2000_Window_BattleLog_initialize = Window_BattleLog.prototype.initialize;
    Window_BattleLog.prototype.initialize = function() {
        dice2000_Window_BattleLog_initialize.call(this);
        this.y = paramBattleLogPosY;
    };

    Window_BattleLog.prototype.displayCurrentState = function(subject) {
        if (!Yanfly.Param.BECShowStateText) return;
        var stateText = subject.mostImportantStateText();
        if (stateText) {
            this.push('addText', '<CENTER>' + subject.name() + stateText);
            this.push('wait');
            this.push('clear');
        }
    };

    Window_BattleLog.prototype.displayAddedStates = function(target) {
        if (!Yanfly.Param.BECShowStateText) return;
        target.result().addedStateObjects().forEach(function(state) {
            var stateMsg = target.isActor() ? state.message1 : state.message2;
            if (state.id === target.deathStateId()) {
                this.push('performCollapse', target);
            }
            if (stateMsg) {
                this.push('popBaseLine');
                this.push('pushBaseLine');
                this.push('addText', '<CENTER>' + target.name() + stateMsg);
                this.push('waitForEffect');
            }
        }, this);
    };

    Window_BattleLog.prototype.displayRemovedStates = function(target) {
        if (!Yanfly.Param.BECShowStateText) return;
        target.result().removedStateObjects().forEach(function(state) {
            if (state.message4) {
                this.push('popBaseLine');
                this.push('pushBaseLine');
                this.push('addText', '<CENTER>' + target.name() + state.message4);
            }
        }, this);
    };

}   // Yanfly.BEC.version
};  // YEP_BattleEngineCore

//=============================================================================
// FILE NO OWARI
//=============================================================================