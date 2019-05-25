//=============================================================================
// dice2000_changeLeader.js:隊列の変更ショートカットキープラグイン
//=============================================================================
//
// このプラグインは NYSL Version 0.9982 (http://www.kmonos.net/nysl/) に従います。
// また一切のサポートを行いません。ご了承ください。
//
// A. 本ソフトウェアは Everyone'sWare です。このソフトを手にした一人一人が、
//    ご自分の作ったものを扱うのと同じように、自由に利用することが出来ます。
//      A-1. フリーウェアです。作者からは使用料等を要求しません。
//      A-2. 有料無料や媒体の如何を問わず、自由に転載・再配布できます。
//      A-3. いかなる種類の 改変・他プログラムでの利用 を行っても構いません。
//      A-4. 変更したものや部分的に使用したものは、あなたのものになります。
//           公開する場合は、あなたの名前の下で行って下さい。
// B. このソフトを利用することによって生じた損害等について、作者は
//    責任を負わないものとします。各自の責任においてご利用下さい。
// C. 著作者人格権はNAK（22番目の素数）に帰属します。著作権は放棄します。
// D. 以上の３項は、ソース・実行バイナリの双方に適用されます。
// 
// 更新履歴
// 18/1/28
// LoopOnlyBattleMembersがtrueの時に、現在のパーティ人数が戦闘参加人数を下回るか
// 否かの判定を見落としていたので追加。
// リファクタリング。
// 18/1/27
// dice2000_ExtraCommands.jsから切り出して作成。
// ----------------------------------------------------------------------------
// NAK a.k.a. 22番目の素数
// [Blog]   : http://dice2000.tumblr.com/
// [GitHub] : https://github.com/DICE2000
// ----------------------------------------------------------------------------

/*:
 * @plugindesc 隊列の変更ショートカットキープラグイン
 * @author NAK（22番目の素数）
 *
 * @param SkipDeadMembers
 * @desc 戦闘不能の仲間は先頭に出さない(true)出す(false)
 * @default false
 * @type boolean
 *
 * @param LoopOnlyBattleMembers
 * @desc 戦闘に出るキャラのみ先頭に出す(true)パーティーメンバー全員を出す(false)※$gameParty.battleMembers()で判定する
 * @default false
 * @type boolean
 * 
 * @param DisabledKeysEvent
 * @desc 「並び替え禁止の変更」で禁止が指定されるとショートカットキーも無効になる(true)ならない(false)
 * @default true
 * @type boolean
 * 
 * @param changeLeaderSE
 * @desc 隊列の変更が行われた際になる効果音です。指定しないとカーソル移動の音が鳴ります。
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @help 先頭キャラをQ/Wのショートカットキーで入れ替えるように出来るプラグインです。
 * 自分用に制作したものに多少の機能追加を行ったものですので
 * 最低限の機能しかありません。
 *
 */
(function() {
    //https://triacontane.blogspot.jp/2016/10/mv.html
    'use strict';
    
    //ここから：-----プラグインパラメータ-----
    
    var ParamSkipDeadMembers      = (PluginManager.parameters('dice2000_changeLeader')['SkipDeadMembers'] === 'true');
    var ParamLoopBattleMembers    = (PluginManager.parameters('dice2000_changeLeader')['LoopOnlyBattleMembers'] === 'true');
    var ParamDisabledKeys = (PluginManager.parameters('dice2000_changeLeader')['DisabledKeysEvent'] === 'true');
    var ParamchangeLeaderSE = PluginManager.parameters('dice2000_changeLeader')['changeLeaderSE'];

    //ここまで：-----プラグインパラメータ-----

    //ここから：-----★隊列関係：pagedown/pageupで隊列の並べ替えを行う-----

    //Scene_Map
    //隊列を変更する関数の追加
    Game_Party.prototype.changeLeader = function(direction) {
        if (direction == 0) return;
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
        //while文用の真理値を用意
        var loopcheck = true;
        var splitMembers = ParamLoopBattleMembers && (this.size() > $gameParty.maxBattleMembers());
        var temp_ary = this._actors;
        var temp_e = 0;
        if(splitMembers){
            //部分配列の取り出し
            temp_ary = this._actors.slice(0, $gameParty.maxBattleMembers());
            //削除しておく
            this._actors.splice(0, $gameParty.maxBattleMembers());
        }
        while (loopcheck) {
            //次の要素を前に
            if(direction > 0){
                temp_e = temp_ary.shift();
                temp_ary.push(temp_e);                                
            //最後尾を前に
            }else{
                temp_e = temp_ary.pop();
                temp_ary.unshift(temp_e);
            }
            //入れ替えた結果を見て必要があればループ
            if(!(ParamSkipDeadMembers && $gameActors.actor(temp_ary[0]).isDead())){
                loopcheck = false;
            }            
        }
        if(splitMembers){
            Array.prototype.push.apply(temp_ary, this._actors);
        }
        this._actors = temp_ary;
        $gamePlayer.refresh();
    };
    
    Game_Party.prototype.updateOnSceneMap = function(sceneActive){
        var flag = true;
        if(ParamDisabledKeys) flag = $gameSystem.isFormationEnabled();
        if(sceneActive && $gameParty.size() >= 2 && flag){
            var input = 0;
            if (Input.isTriggered('pagedown')) input = 1;
            if (Input.isTriggered('pageup')) input = -1;
            $gameParty.changeLeader(input);
        }
    };
    
    var dice2000_Scene_Map_updatemain = Scene_Map.prototype.updateMain;
    Scene_Map.prototype.updateMain = function() {
        dice2000_Scene_Map_updatemain.apply(this, arguments);
        if(!$gameMap.isEventRunning()) $gameParty.updateOnSceneMap(this.isActive());
    };

    //ここまで：-----★隊列関係：pagedown/pageupで隊列の並べ替えを行う-----

})();