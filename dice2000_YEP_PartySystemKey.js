//=============================================================================
// dice2000_YEP_PartySystemKey.js
//=============================================================================
//
// ----------------------------------------------------------------------------
// NAK a.k.a. 22番目の素数
// [Blog]   : https://dice2000.tumblr.com/
// [GitHub] : https://github.com/DICE2000
// ----------------------------------------------------------------------------
/*:
 * @plugindesc YEP PartySystemにショートカットキーを入れる
 * @author 22番目の素数(NAK)
 *
 * @param changeLeaderSE
 * @desc 隊列の変更が行われた際に鳴る効果音です。指定しないとカーソル移動の音が鳴ります。
 * @require 1
 * @dir audio/se/
 * @type file
 * 
 * @help
 * YEPのPartySystemを導入した状態で
 * 隊列の並べ替えのショートカットキー(pagedown/pageup)を
 * 使えるようにしたプラグインです。
 * 
 */

//グローバルに定義されている変数の存在チェック
var Imported = Imported || {};
var Yanfly = Yanfly || {};

var ParamchangeLeaderSE = PluginManager.parameters('dice2000_YEP_PartySystemKey')['changeLeaderSE'];

if (Imported.YEP_PartySystem) {
if (Yanfly.Party.version) {
    Game_Party.prototype.updateOnSceneMap = function(sceneActive){
        if(sceneActive && $gameParty.size() >= 2 && $gameSystem.isFormationEnabled()){
            var input = 0;
            if (Input.isTriggered('pagedown')) input = 1;
            if (Input.isTriggered('pageup')) input = -1;
            if (input !== 0) $gameParty.YEP_changeLeader(input);
        }
    };
    
    var dice2000_Scene_Map_updatemain = Scene_Map.prototype.updateMain;
    Scene_Map.prototype.updateMain = function() {
        dice2000_Scene_Map_updatemain.apply(this, arguments);
        if(!$gameMap.isEventRunning()) $gameParty.updateOnSceneMap(this.isActive());
    };

    Game_Party.prototype.swapOrderAllMembers = function(index1, index2) {
        var bm = this._battleMembers;
        if (bm.length > index1 && bm.length > index2) {
          var actorId1 = this._battleMembers[index1];
          var actorId2 = this._battleMembers[index2];
        } else if (bm.length > index1) {
          var actorId1 = this._battleMembers[index1];
          var actorId2 = this._actors[index2];
        } else if (bm.length > index2) {
          var actorId1 = this._actors[index1];
          var actorId2 = this._battleMembers[index2];
        } else {
          var actorId1 = this._actors[index1];
          var actorId2 = this._actors[index2];
        }
        if (bm.length <= index1 || bm.length <= index2){
            this._actors[index1] = actorId2;
            this._actors[index2] = actorId1;
        }
        if (bm.length > index1) this._battleMembers[index1] = actorId2;
        if (bm.length > index2) this._battleMembers[index2] = actorId1;
    };

    Game_Party.prototype.rearrangeActorsAll = function() {
        if (this._battleMembers === null) this.initializeBattleMembers();
        var battleArray = [];
        for (var i = 0; i < this._battleMembers.length; ++i) {
            var actorId = this._battleMembers[i];
            if (actorId === null) continue;
            if ($gameActors.actor(actorId)) battleArray.push(actorId);
        }
        var reserveArray = [];
        for (var i = 0; i < this._actors.length; ++i) {
            var actorId = this._actors[i];
            if (battleArray.contains(actorId)) continue;
            if ($gameActors.actor(actorId) === null) continue;
            reserveArray.push(actorId);
        }
        //↓犯人↓（強制的に並び替えてしまう）
        //reserveArray = this.sortReserveParty(reserveArray);
        this._actors = battleArray.concat(reserveArray);
    };

    //隊列を変更する関数の追加
    Game_Party.prototype.YEP_changeLeader = function(direction) {
        if(ParamchangeLeaderSE === ''){
            SoundManager.playCursor();
        }else{
            var se = {name:ParamchangeLeaderSE, pan:0, pitch:100, volume:90};
            AudioManager.playStaticSe(se);
        }
        //ずらす方向
        // +1か-1かを入れる
        // -1 …後ろが前にくる
        // +1 …前が後ろに行く
        var length = this.size();
        if(direction === 1){
            for (var i = 0; i < length - 1; i++){
                this.swapOrderAllMembers(i, i + 1);
                this.rearrangeActorsAll();
            }
    	}else{
            for (var i = length - 1; i > 0; i--){
                this.swapOrderAllMembers(i - 1, i);
                this.rearrangeActorsAll();
            }
    	}
    	$gamePlayer.refresh();
    };
}   // Yanfly.Party.version
};  // YEP_PartySystem

//=============================================================================
// FILE NO OWARI
//=============================================================================