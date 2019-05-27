//=============================================================================
// dice2000_YEP_BattleStatusWindowEx.js
//=============================================================================
//
// ----------------------------------------------------------------------------
// NAK a.k.a. 22番目の素数
// [Blog]   : https://dice2000.tumblr.com/
// [GitHub] : https://github.com/DICE2000
// ----------------------------------------------------------------------------
/*:
 * @plugindesc YEP BattleStatusWindowを拡張するプラグイン
 * @author 22番目の素数(NAK)
 *
 * @help
 * YanflyのBattleStatusWindowの顔グラフィックを
 * 戦闘の状況に応じて変化させます。
 * 
 * @param alive
 * @type number
 * @text 生存
 * @default 0
 *
 * @param dead
 * @type number
 * @text 死亡
 * @default 1
 * 
 * @param pinch
 * @type number
 * @text ピンチ
 * @default 2
 * 
 * @param friend
 * @type number
 * @text 味方に対する行動
 * @default 3
 * 
 * @param guard
 * @type number
 * @text 防御
 * @default 4
 *
 * @param opponent
 * @type number
 * @text 敵に対する行動
 * @default 5
 * 
 * @param magic
 * @type number
 * @text 魔法の使用
 * @default 6
 * 
 * @param damage
 * @type number
 * @text 行動不能／被ダメージ
 * @default 7
 * 
 * @param evade
 * @type number
 * @text 回避
 * @default 8
 * 
 * @param specific
 * @type number
 * @text 特殊行動
 * @default 9
 * 
 * @param SpecificSkillType
 * @desc 特殊行動に該当するスキルタイプを指定します。
 * @default []
 * @type number[]
 * @min 1
 * 
 */

//グローバルに定義されている変数の存在チェック
var Imported = Imported || {};
var Yanfly = Yanfly || {};

var paramfaceIndexAlive = Number((PluginManager.parameters('dice2000_YEP_BattleStatusWindowEx')['alive']));
var paramfaceIndexDead = Number((PluginManager.parameters('dice2000_YEP_BattleStatusWindowEx')['dead']));
var paramfaceIndexPinch = Number((PluginManager.parameters('dice2000_YEP_BattleStatusWindowEx')['pinch']));
var paramfaceIndexFriend = Number((PluginManager.parameters('dice2000_YEP_BattleStatusWindowEx')['friend']));
var paramfaceIndexGuard = Number((PluginManager.parameters('dice2000_YEP_BattleStatusWindowEx')['guard']));
var paramfaceIndexOpponent = Number((PluginManager.parameters('dice2000_YEP_BattleStatusWindowEx')['opponent']));
var paramfaceIndexMagic = Number((PluginManager.parameters('dice2000_YEP_BattleStatusWindowEx')['magic']));
var paramfaceIndexDamage = Number((PluginManager.parameters('dice2000_YEP_BattleStatusWindowEx')['damage']));
var paramfaceIndexEvade = Number((PluginManager.parameters('dice2000_YEP_BattleStatusWindowEx')['evade']));
var paramfaceIndexSpecific = Number((PluginManager.parameters('dice2000_YEP_BattleStatusWindowEx')['specific']));

var paramSkillType = JSON.parse(PluginManager.parameters('dice2000_YEP_BattleStatusWindowEx')['SpecificSkillType'] || []);

if (Imported.YEP_BattleStatusWindow) {
if (Yanfly.BSW.version) {
    
    var dice2000_BattleManager_startAction = BattleManager.startAction;
    BattleManager.startAction = function() {
        dice2000_BattleManager_startAction.call(this);
        if(this._subject){
            var action = this._subject.currentAction();
            var targets = action.makeTargets();
            var type = 'opponent';
            if(this._subject.isActor()){
                if(paramSkillType.includes(action.item().stypeId + '')){
                    var type = 'specific';
                }else if(action.isMagical()){
                    //魔法スキルを先に判定する
                    type = 'magic';
                }else{
                    //味方適用のスキル
                    if(action.isForFriend()) {
                        type = 'friend';
                        this._statusWindow.target_temp = targets;
                        this._statusWindow.target_temp = this._statusWindow.target_temp.filter(function (value) {
                                                    return value != this._subject;
                                                });
                    }
                    //防御スキルの場合上書き
                    if(action.isGuard()) type = 'guard'; 
                    if(action.isForOpponent()) type = 'opponent';
                }
                //ステータス表示
                this._statusWindow.startAction(this._subject, type);
            }
        }
    };
        
    //顔グラフィックを使う場合
    BattleManager.invokeNormalAction = function(subject, target) {
        var realTarget = this.applySubstitute(target);
        this._action.apply(realTarget);
        if (subject.isEnemy()){
            this._statusWindow.target_temp.push(realTarget);
            var type = 'nodamage';
            if(realTarget.result().missed || realTarget.result().evaded){
                type = 'miss';
            }else if(realTarget.result().hpDamage !== 0 || realTarget.result().mpDamage !== 0){
                type = 'damage';
            }
            this._statusWindow.startAction(realTarget, type);
        }
        //「かばう」で全体攻撃を食らった場合などの重複削除
        this._statusWindow.target_temp = this._statusWindow.target_temp.filter(function (x, i, self) {
                                    return self.indexOf(x) === i;
                                });
        this._logWindow.displayActionResults(subject, realTarget);
    };

    var dice2000_BattleManager_endAction = BattleManager.endAction;
    BattleManager.endAction = function() {
        if (this._subject) {
            //ステータス表示
            this._statusWindow.endAction(this._subject);
        }
        dice2000_BattleManager_endAction.call(this);
    };        
        
    //ウィンドウを透明にする
    Window_BattleStatus.prototype.initialize = function() {
        var width = this.windowWidth();
        var height = this.windowHeight();
        var x = Graphics.boxWidth - width;
        var y = Graphics.boxHeight - height;
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this.setBackgroundType(2);
        this.refresh();
        this.openness = 0;
        //ターゲットの一時記憶
        this.target_temp = [];
    };           
            
    //アクションに応じて顔グラフィックを書きかえる
    var dice2000_Window_BattleStatus_initialize = Window_BattleStatus.prototype.initialize;
    Window_BattleStatus.prototype.initialize = function() {
        this._cacheMember = new Array($gameParty.maxBattleMembers());
        this._cacheMemberIndex = new Array($gameParty.battleMembers().length);
        for (var i = 0; i < $gameParty.battleMembers().length; ++i) {
          this._cacheMember.push($gameParty.battleMembers()[i]);
          this._cacheMemberIndex.push(paramfaceIndexAlive);
        }
        this._firstflag = true;
        dice2000_Window_BattleStatus_initialize.call(this);
    };

    Window_BattleStatus.prototype.startAction = function(subject, type) {
        //console.log('startAction');
        var memberIndex = $gameParty.battleMembers().indexOf(subject);
        var faceIndex = 0;
        var drawflag = true;
        //console.log('味方行動');
        switch (type) {
          case 'nodamage':
            //console.log('ノーダメージ');
            //描画無し
            drawflag = false;
            break;
          case 'damage':
            //console.log('被ダメ');
            faceIndex = paramfaceIndexDamage;
            break;
          case 'miss':
            //console.log('回避');
            faceIndex = paramfaceIndexEvade;
            break;
          case 'guard':
            //console.log('ガード');
            faceIndex = paramfaceIndexGuard;
            break;            
          case 'friend':
            //console.log('味方に対する行動');
            faceIndex = paramfaceIndexFriend;
            break;
          case 'opponent':
            //console.log('敵に対する行動');
            faceIndex = paramfaceIndexOpponent;
            break;
          case 'magic':
            //console.log('魔法');
            faceIndex = paramfaceIndexMagic;
            break;
          case 'specific':
            //console.log('魔法剣');
            faceIndex = paramfaceIndexSpecific;
            break;
        }
        if(drawflag){
            if(this._cacheMemberIndex[memberIndex] !== faceIndex){
                this.drawStatusFaceEx(memberIndex, faceIndex);
            }
            this._cacheMemberIndex[memberIndex] = faceIndex;            
        }
    };
    
    //action終了と共に顔グラフィックを戻す
    Window_BattleStatus.prototype.endAction = function(subject) {
        //console.log('endAction');
        if (this.target_temp != []){
            this.target_temp.forEach(function(target) {
                var memberIndex = $gameParty.battleMembers().indexOf(target);
                var faceIndex = 0;
                if (target.isDead()){
                    //console.log('死亡');
                    faceIndex = paramfaceIndexDead;
                }else if(target.isDying()){
                    //console.log('ピンチ');
                    faceIndex = paramfaceIndexPinch;
                }else if(target.isRestricted()){
                    //console.log('行動不能');
                    faceIndex = paramfaceIndexDamage;
                }else{
                    //console.log('target:生存');
                    faceIndex = paramfaceIndexAlive;
                }
                if(this._cacheMemberIndex[memberIndex] !== faceIndex){
                    this.drawStatusFaceEx(memberIndex, faceIndex);
                } 
                this._cacheMemberIndex[memberIndex] = faceIndex;
            }, this);
        }
        if(subject.isActor()){
            var memberIndex = $gameParty.battleMembers().indexOf(subject);
            var faceIndex = 0;
            if (subject.isDead()){
                //console.log('死亡');
                faceIndex = paramfaceIndexDead;
            }else if(subject.isDying()){
                //console.log('ピンチ');
                faceIndex = paramfaceIndexPinch;
            }else if(subject.isRestricted()){
                //console.log('行動不能');
                faceIndex = paramfaceIndexDamage;
            }else{
                //console.log('target:生存');
                faceIndex = paramfaceIndexAlive;
            }
            if(this._cacheMemberIndex[memberIndex] !== faceIndex){
                this.drawStatusFaceEx(memberIndex, faceIndex);
            } 
            this._cacheMemberIndex[memberIndex] = faceIndex;
            var wy = this.contents.height - this.lineHeight();
            this.drawIcon(Yanfly.Icon.NoAction, this.basicAreaRect(memberIndex).x + 2, wy + 2);
        }
        this.target_temp = [];
    };

    //戦闘不能者を区別して描画する
    Window_BattleStatus.prototype.drawAllFaces = function() {
        //console.log('drawAllFaces');
        var MemberState = [];
        //メンバーチェックと状態チェック
        for (var i = 0; i < $gameParty.battleMembers().length; ++i) {
            var member = $gameParty.battleMembers()[i];
            var faceIndex = 0;
            if (member.isDead()){
                //console.log('死亡');
                faceIndex = paramfaceIndexDead;
            }else if(member.isDying()){
                //console.log('ピンチ');
                faceIndex = paramfaceIndexPinch;
            }else if(member.isRestricted()){
                //console.log('行動不能');
                faceIndex = paramfaceIndexDamage;
            }else{
                //console.log('target:生存');
                faceIndex = paramfaceIndexAlive;
            }
            MemberState.push(faceIndex);
            if(this._cacheMember[i] !== $gameParty.battleMembers()[i]){
                this._firstflag = true;
            }
            var bitmap = null;
            if(this._firstflag || this._cacheMemberIndex[i] !== MemberState[i]){
                bitmap = ImageManager.loadFace(member.faceName());
                if (bitmap.width <= 0) return setTimeout(this.drawAllFaces.bind(this), 5);              
            }
        }
        //初期描画フラグがONの場合はすべての領域をクリアする
        if(this._firstflag) this._faceContents.bitmap.clear();
        //フェイス描画
        for (var i = 0; i < this.maxItems(); ++i) {
            if(this._firstflag){
                //console.log('初回');
                this.drawStatusFaceEx(i, MemberState[i]);
            }else{
                //console.log('二度目以降');
                if(this._cacheMemberIndex[i] !== MemberState[i]) this.drawStatusFaceEx(i, MemberState[i]);
            }
            this._cacheMemberIndex[i] = MemberState[i];
        }
        //メンバーキャッシュ代入
        for (var i = 0; i < $gameParty.battleMembers().length; ++i) {
            this._cacheMember[i] = $gameParty.battleMembers()[i];
        }
        //初期描画フラグオフ
        this._firstflag = false;
    };

    //ステータスに応じて描画位置をずらす
    Window_BattleStatus.prototype.drawStatusFaceEx = function(index, state_number) {
        var actor = $gameParty.battleMembers()[index];
        if(!(actor === undefined)){
            var rect = this.itemRect(index);
            var ww = Math.min(rect.width - 8, Window_Base._faceWidth);
            var wh = Math.min(rect.height - 8, Window_Base._faceHeight);
            var wx = rect.x + rect.width - ww - 6;
            var wy = rect.y + 4 + (this.lineHeight() / 2);
            var i = state_number;
            //マス毎にビットマップクリア
            if(!this._firstflag){
                this._faceContents.bitmap.clearRect(wx, wy, ww, wh);
            }
            this.drawActorFaceIndexed(actor, wx, wy, ww, wh, i);            
            //console.log('【描画】');
            //console.log(actor.faceName());
        }
    };

    Window_BattleStatus.prototype.drawActorFaceIndexed = function(actor, x, y, width, height, index) {
        this.drawFace(actor.faceName(), index, x, y, width, height);
    };

    Window_BattleStatus.prototype.drawGaugeArea = function(rect, actor) {
        this.contents.fontSize = Yanfly.Param.BSWParamFontSize;
        this._enableYBuffer = true;
        var wy = rect.y + rect.height - this.lineHeight();
        var wymod = (Imported.YEP_CoreEngine) ? Yanfly.Param.GaugeHeight : 6;
        var wymod = Math.max(16, wymod);
        this.drawActorHp(actor, rect.x, 0, rect.width);
        if (this.getGaugesDrawn(actor) <= 2) {
            this.drawActorMp(actor, rect.x, wymod, rect.width);
        } else {
            var ww = rect.width / 2;
            this.drawActorMp(actor, rect.x, wymod, ww);
            this.drawActorTp(actor, rect.x + ww, wymod, ww);
        }
        this._enableYBuffer = false;
    };

    Window_BattleStatus.prototype.drawBasicArea = function(rect, actor) {
        if (Imported.YEP_X_BattleSysATB && Yanfly.Param.ATBGaugeStyle) {
            if (BattleManager.isATB()) {
                this.drawActorAtbGauge(actor, rect.x - 2, rect.y, rect.width + 2);
            }
        }
        var iw = Window_Base._iconWidth;
        var wy = this.contents.height - this.lineHeight();
        this.drawActorActionIcon(actor, rect.x, wy);
        this.resetFontSettings();
        this.contents.fontSize = Yanfly.Param.BSWNameFontSize;
        this.drawActorName(actor, rect.x + iw + 4, wy, rect.width);
    };

    Window_BattleStatus.prototype.drawStateArea = function(rect, actor) {
        var row = Yanfly.Param.BSWStateIconRow;
        if (row === undefined) row = 1;
        var wymod = (Imported.YEP_CoreEngine) ? Yanfly.Param.GaugeHeight : 6;
        var wy = rect.y + (this.lineHeight() * row) + wymod;
        this.drawActorIcons(actor, rect.x + 2, wy, rect.width);
    };

    //味方しか準備アニメを表示しない
    //これ自分用のコードの気がするけど検証はあとで:19/5/27
    BattleManager.actionCastAnimation = function() {
        //if (!$gameSystem.isSideView() && this._subject.isActor()) return true;
        if (this._subject.isEnemy()) return true;
        if (!this._action.isAttack() && !this._action.isGuard() &&
        this._action.isSkill()) {
            if (this._action.item().castAnimation > 0) {
                var ani = $dataAnimations[this._action.item().castAnimation]
                this._logWindow.showAnimation(this._subject, [this._subject],
                this._action.item().castAnimation);
            }
        }
        return true;
    };

}   // Yanfly.BSW.version
};  // YEP_BattleStatusWindow.js


//=============================================================================
// FILE NO OWARI
//=============================================================================