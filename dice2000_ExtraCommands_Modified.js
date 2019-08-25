//=============================================================================
// dice2000_ExtraCommands_Modified.js
//=============================================================================
// 使用に際して
// 複製および転用に関する一切の制約はありません。
// クレジット表記も必要ありません。
// その代わり、バグ修正および機能追加に関する一切の対応を行いません。
// （制作者が自主的に行うことは有り得ます）
// 
// 更新履歴
// 18/7/30 必中スキル：命中率の補正、変数による補正、ウィンドウレイアウト変更
// 18/7/28 戦闘のスキル一括選択を追加。命中率判定に魔法の命中率判定追加。
//         運補正は再考中。
// 18/3/13 戦闘の命中率判定／運補正の追加。
// 18/3/2  dice2000_ExtraCommandsよりYEPシリーズと機能重複分を削除。
//         dice2000_chengeLeaderの分割にともない、隊列ショートカットキー処理削除。
// ----------------------------------------------------------------------------
// NAK a.k.a. 22番目の素数
// [Blog]   : http://dice2000.tumblr.com/
// [GitHub] : https://github.com/DICE2000
// ----------------------------------------------------------------------------


/*:
 * @plugindesc 小ネタプラグイン
 * @author 22番目の素数(NAK)
 *
 * @param ScrollSpeed
 * @text 基準点変更の速度
 * @desc スクロール速度が無指定の場合に適用されます。
 * @default 5
 * @type number
 * @min 1
 * @max 6
 * 
 * @param ignore chara hit
 * @text キャラの命中率を無視
 * @desc 物理攻撃の命中率の判定でキャラ自身の命中率を無視します。
 * @default false
 * @type boolean
 * 
 * @param magic hit rate
 * @text 魔法攻撃に命中率を適用
 * @desc 魔法攻撃に命中率の補正を加えます。
 * @default false
 * @type boolean
 * 
 * @param certain hit rate
 * @text 必中攻撃に命中率を適用
 * @desc 必中攻撃に命中率の補正を加えます。
 * @default false
 * @type boolean
 * 
 * @param hit rate variable
 * @text 必中攻撃の命中率補正
 * @desc 変数に必中攻撃の命中率の補正を入れます。0で無効。（YEP-SkillCoreの併用が前提）
 * @type variable
 * @default 0
 *
 * @param battle command skill name
 * @text 戦闘のスキル一括選択
 * @desc 文字列を指定するとそのコマンド名でスキルを一括選択できます。
 * @default 
 * @type string
 *
 * @param dice2000layout
 * @text ステータス画面に追加表示
 * @desc ステータス画面を色々改造します
 * @default false
 * @type boolean
 * 
 * @help 自分用に作ったものの内、使えそうなものを抽出しました。
 * 複数の機能を入れているので、不要なものや競合が心配されるものはコメントを参考に
 * 削除しても構いません。
 *
 * ★スクロール基準点変更
 * 「プラグインコマンド」で使います。
 * 範囲外の値や、連続した実行などで画面描画が乱れます。
 *
 * SetScrollPosX Num Speed
 * SetScrollPosY Num Speed
 * Numの分だけスクロール基準点をずらします。
 * 正の値で右または下、負の値で左または上に移動します。
 * Speedでスクロールスピードを指定します。
 * 省略した場合、オプションの値が適用されます。
 *
 * UnsetScrollPos Speed
 * ずれた基準点を戻します。Speedに0以下の値を指定すると一瞬で戻ります。
 * これもSpeedを省略するとオプションの値が適用されます。
 * 
 * ★敵のスリップダメージを割合で調整する
 * データベース「敵キャラ」のメモ欄に、百分率で設定します。
 * <SlipDamageRate: 50>
 * これで通常の設定の半分しか効果が出なくなります。
 * 
 * 制限事項：設定できるのは、敵のみ／「全てのスリップダメージ」に影響が出る
 *
 * ★隊列関係 
 * イベント中に隊列キャラの向きを変更します。
 * !!プラグインコマンドではなく「スクリプト」で呼び出してください!!
 * 
 * $gamePlayer.synchDirection();
 * このコマンドを実行することで、パーティーキャラ全員が先頭キャラと同じ方向を向きます。
 *
 * $gamePlayer.FaceToFace();
 * このコマンドを実行することで、先頭キャラと二番目のキャラが向き合います。
 * 
 * ★戦闘判定式関連
 * HizCalc.js: http://hiz-tkool.tumblr.com/post/144295166285/hzhitcalcjs
 * MITプラグインの取り込みです。
 * 
 * 【物理攻撃】
 * 命中率を無視しない：スキルの命中率 + (キャラの命中率 - 100%) - 対象の回避率
 * 命中率を無視する：スキルの命中率 - 対象の回避率
 * 【魔法攻撃】
 * スキルの命中率 - 対象の魔法回避率
 * 命中率を適用時：スキルの命中率 + (キャラの命中率 - 100%) - 対象の魔法回避率
 * 【必中攻撃】
 * スキルの命中率
 * 命中率を適用時：スキルの命中率 + (キャラの命中率 - 100%)
 * 変数の補正適用時：スキルの命中率 + (キャラの命中率 - 100%) + （設定した変数の値）
 * ※変数による補正はYEP-SkillCoreの導入を前提としています
 * 
 * ★戦闘のスキル一括選択
 * バトルイベントでのスキルコマンドを一つの選択肢にまとめます。
 * Window_ActorCommandにコマンドを追加する他のプラグインと相性があるので
 * プラグインの配置を工夫してください。
 *
 * ★自分のためのイベントメモ
 * 
 * ●プロフィール書きかえ
 * $gameActors.actor(アクターID).setProfile("プロフィール")
 *
 * ●任意のマップのセルフスイッチを操作
 * $gameSelfSwitches.setValue([mapId, eventId, "A~D"], true/false);
 * 
 * ●キャラが移動しきるまでウェイトを取る
 * 
 * $gameMap._interpreter.gameDataOperand(5, eventID, 0~5);
 * eventID: -1 で主人公
 * 0:Map X 1:Map Y 2:Direction 3:Screen X 4:Screen Y
 * 
 * 例：
 *◆ループ
 *  ◆注釈：◆変数の操作：#0001 TEMP01 = メアリのマップX
 *  ◆スクリプト：$gameVariables._data[1] = $gameMap._interpreter.gameDataOperand(5, 5, 0);
 *  ◆注釈：◆変数の操作：#0004 TEMP04 = シリルのマップX
 *  ◆スクリプト：$gameVariables._data[4] = $gameMap._interpreter.gameDataOperand(5, 2, 0);
 *  ◆注釈：◆変数の操作：#0002 X = 主人公のマップX
 *  ◆スクリプト：$gameVariables._data[2] = $gameMap._interpreter.gameDataOperand(5, -1, 0);
 *  ◆条件分岐：TEMP01 = 18
 *    ◆条件分岐：X = 18
 *      ◆条件分岐：TEMP4 = 19
 *        ◆ループの中断
 *        ◆
 *      ：分岐終了
 *      ◆
 *    ：分岐終了
 *    ◆
 *  ：分岐終了
 *  ◆ウェイト：1フレーム
 *  ◆
 *：以上繰り返し
 */

//グローバル定義 Mathクラス拡張
//---- ここから：http://blog.asial.co.jp/1191 ----

var Math = Math || {};

/**
 * 与えられた値の小数点以下の桁数を返す 
 * multiply, subtractで使用
 * 
 * 例)
 *   10.12  => 2  
 *   99.999 => 3
 *   33.100 => 1
 */
Math._getDecimalLength = function(value) {
    var list = (value + '').split('.'), result = 0;
    if (list[1] !== undefined && list[1].length > 0) {
        result = list[1].length;
    }
    return result;
};

/**
 * 乗算処理
 *
 * value1, value2から小数点を取り除き、整数値のみで乗算を行う。 
 * その後、小数点の桁数Nの数だけ10^Nで除算する
 */
Math.multiply = function(value1, value2) {
    var intValue1 = +(value1 + '').replace('.', ''),
        intValue2 = +(value2 + '').replace('.', ''),
        decimalLength = Math._getDecimalLength(value1) + Math._getDecimalLength(value2),
        result;

    result = (intValue1 * intValue2) / Math.pow(10, decimalLength);

    return result;
};

/**
 * 減算処理
 *
 * value1,value2を整数値に変換して減算
 * その後、小数点の桁数分だけ小数点位置を戻す
 */
Math.subtract = function(value1, value2) {
    var max = Math.max(Math._getDecimalLength(value1), Math._getDecimalLength(value2)),
        k = Math.pow(10, max);
    return (Math.multiply(value1, k) - Math.multiply(value2, k)) / k;
};

//---- ここまで：http://blog.asial.co.jp/1191 ----

(function() {
    //https://triacontane.blogspot.jp/2016/10/mv.html
    'use strict';
    
    //ここから：-----プラグインパラメータ-----
    var parameters     = PluginManager.parameters('dice2000_ExtraCommands_Modified');
    var default_speed = Number(parameters['ScrollSpeed']);
    var ignoreCharaHit = (parameters['ignore chara hit'] === 'true');
    var applyMagicHit = (parameters['magic hit rate'] === 'true');
    var applyCertainHit = (parameters['certain hit rate'] === 'true');
    var HitRateVariable = Number(parameters['hit rate variable']);
    var BattleCommandSkillName = parameters['battle command skill name'];
    var Dice2000layout = (parameters['dice2000layout'] === 'true');

    //ここまで：-----プラグインパラメータ-----

    var pos_x = 0;
    var pos_y = 0;

    //ここから：-----★スクロール基準点変更-----
    //Game_Interpreter
    var dice2000_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        dice2000_Game_Interpreter_pluginCommand.call(this, command, args);
        var direction = 2;
        var speed = default_speed;
        if (command === "SetScrollPosX"){
            pos_x += Number(args[0]);
            if (args[1] != null) speed = Number(args[1]);
            if (pos_x < 0) direction = 4;
            if (pos_x > 0) direction = 6;
            if (pos_x != 0) $gameMap.startScroll(direction, Math.abs(pos_x), speed);
        }
        if (command === "SetScrollPosY"){
            pos_y += Number(args[0]);
            if (args[1] != null) speed = Number(args[1]);
            if (pos_y < 0) direction = 8;
            if (pos_y > 0) direction = 2;
            if (pos_y != 0) $gameMap.startScroll(direction, Math.abs(pos_y), speed);
        }
        if (command === "UnsetScrollPos"){
            if (args[0] == null){
                speed = default_speed;
            }else{
                speed = Number(args[0]);
            }
            //スクロールして基準点を戻す
            if (speed > 0){
                if (pos_x < 0) direction = 6;
                if (pos_x > 0) direction = 4;
                if (pos_x != 0) $gameMap.startScroll(direction, Math.abs(pos_x), speed);
                if (pos_y < 0) direction = 2;
                if (pos_y > 0) direction = 8;
                if (pos_y != 0) $gameMap.startScroll(direction, Math.abs(pos_y), speed);
                pos_x = 0;
                pos_y = 0;
            }else{
            //一瞬で基準点を戻す
                pos_x = 0;
                pos_y = 0;
                $gameMap.setDisplayPos($gamePlayer.x - Math.floor($gameMap.screenTileX() / 2), $gamePlayer.y - Math.floor($gameMap.screenTileY() / 2));                
            }
        }
    };    
    //ここまで：-----★スクロール基準点変更-----

    //ここから：-----★隊列関係：隊列キャラの向きを変更-----
    // Game_Player
    Game_Player.prototype.center = function(x, y) {
        return $gameMap.setDisplayPos(x - this.centerX() + pos_x, y - this.centerY() + pos_y);
    };

    Game_Player.prototype.updateScroll = function(lastScrolledX, lastScrolledY) {
        var x1 = lastScrolledX + pos_x;
        var y1 = lastScrolledY + pos_y;
        var x2 = this.scrolledX() + pos_x;
        var y2 = this.scrolledY() + pos_y;
        if (y2 > y1 && y2 > this.centerY()) {
            $gameMap.scrollDown(y2 - y1);
        }
        if (x2 < x1 && x2 < this.centerX()) {
            $gameMap.scrollLeft(x1 - x2);
        }
        if (x2 > x1 && x2 > this.centerX()) {
            $gameMap.scrollRight(x2 - x1);
        }
        if (y2 < y1 && y2 < this.centerY()) {
            $gameMap.scrollUp(y1 - y2);
        }
    };

    // 先頭キャラと付いてきているキャラを同じ方向に
    Game_Player.prototype.synchDirection = function() {
        var d = this.direction();
        this._followers.forEach(function(follower) {
            follower.setDirection(d);
        });
    };

    // 先頭キャラと2番目のキャラが向き合う
    Game_Player.prototype.FaceToFace = function() {
        var sub_x = this._followers.follower(0)._x;
        var sub_y = this._followers.follower(0)._y;
        if (sub_x == this._x){
            //縦に並んでいる場合
            if (sub_y < this._y){
                    //× ←下を向く
                    //□ ←上を向く
                    this._followers.follower(0).setDirection(2);
                    this.setDirection(8);
            }else{
                    //□ ←下を向く
                    //× ←上を向く
                    this._followers.follower(0).setDirection(8);
                    this.setDirection(2);
            }
        }else{
            //横に並んでいる場合
            if (sub_x < this._x){
                    //　右を向く→×　□←左を向く
                    this._followers.follower(0).setDirection(6);
                    this.setDirection(4);
            }else{
                    //　右を向く→□　×←左を向く
                    this._followers.follower(0).setDirection(4);
                    this.setDirection(6);
            }
        }
    };
    //ここまで：-----★隊列関係：隊列キャラの向きを変更-----

    //ここから：-----★敵のスリップダメージを割合にする-----

    //https://github.com/rutan/torigoya_rpg_maker_mv_plugins/blob/master/utils/Torigoya_MaxSlipDamageSetting.js
    //Ruたん鳥小屋txt
    //http://torigoya.hatenadiary.jp/entry/rpgmaker_mv_small_plugin
    //<SlipDamageRate: 50>
    //スリップダメージの番号に対応するスリップダメージのRateと味方にもその内に対応しよう（するとは言っていない）

    var dice2000_Game_Enemy_regenerateHp= Game_Enemy.prototype.regenerateHp;
    Game_Enemy.prototype.regenerateHp = function() {
            var SlipDamageRate = this.enemy().meta['SlipDamageRate'];
            if (SlipDamageRate){
                var rate = ~~SlipDamageRate / 100;
                var value = Math.floor(this.mhp * this.hrg * rate);
                value = Math.max(value, -this.maxSlipDamage());
                if (value !== 0) {
                    this.gainHp(value);
                }
            } else {
                dice2000_Game_Enemy_regenerateHp.apply(this);
            }
    };
    //ここまで：-----★敵のスリップダメージを割合にする-----

    //ここから：-----命中率調整-----
    Game_Action.prototype.itemHit = function(target) {
        //キャラの持つ命中率
        var charaHit = Math.subtract(this.subject().hit, 1.0);
        //スキルの命中率（百分率）
        var resultRate = Math.multiply(this.item().successRate, 0.01);
        if (this.isPhysical()) {
            //命中率を無視しない場合、補正を入れる
            if (!ignoreCharaHit) resultRate += charaHit;
            //回避率を適用
            return (Math.subtract(resultRate, target.eva));
        } else if (this.isMagical()) {
            //命中率を入れる場合、補正を入れる
            if (applyMagicHit) resultRate += charaHit;
            //魔法回避率を適用
            return (Math.subtract(resultRate, target.mev));
        } else {
            //命中率を入れる場合、補正を入れる
            if (applyCertainHit) resultRate += charaHit;
            //変数による補正を入れる（要YEP-SkillCore）
            if (HitRateVariable !== 0) resultRate += Math.multiply($gameVariables.value(HitRateVariable), 0.01);
            //回避率適用は無し
            return (resultRate);
        }
    };

    Game_Action.prototype.itemEva = function(target) {
        return 0;
    };
    //ここまで：-----命中率調整-----

    //ここから：-----スキル表示結合-----
    if(BattleCommandSkillName !== ''){
        Window_SkillList.prototype.includes = function(item) {
            if(this._stypeId === 0){
                return item;
            }else{
                return item && item.stypeId === this._stypeId;
            }
        };

        Window_ActorCommand.prototype.addSkillCommands = function() {
                this.addCommand(BattleCommandSkillName, 'skill', true);
        };

        Scene_Battle.prototype.commandSkill = function() {
            this._skillWindow.setActor(BattleManager.actor());
            this._skillWindow.setStypeId(0);
            this._skillWindow.refresh();
            this._skillWindow.show();
            this._skillWindow.activate();
        };
    }
    //ここまで：-----スキル表示結合-----

    //以下は自分用

    /*
        Window_Status.prototype.refresh = function() {
            this.contents.clear();
            if (this._actor) {
                var lineHeight = this.lineHeight();
                this.drawBlock1(lineHeight * 0);
                this.drawHorzLine(lineHeight * 1);
                this.drawBlock2(lineHeight * 2);
                this.drawHorzLine(lineHeight * 6);
                this.drawBlock3(lineHeight * 7);
                this.drawHorzLine(lineHeight * 13);
                this.drawBlock4(lineHeight * 14);
            }
        };

        Window_Status.prototype.drawBlock2 = function(y) {
            this.drawActorFace(this._actor, 12, y);
            this.drawBasicInfo(204, y);
            this.drawExpInfo(456, y);
        };

        Window_Status.prototype.drawBlock4 = function(y) {
            this.drawProfile(6, y);
        };
    */

    if(Dice2000layout){

        Window_Status.prototype.refresh = function() {
            this.contents.clear();
            if (this._actor) {
                var lineHeight = this.lineHeight();
                this.drawBlock1(lineHeight * 0);
                this.drawHorzLine(lineHeight * 1);
                this.drawBlock2(lineHeight * 2);
                this.drawHorzLine(lineHeight * 6);
                this.drawBlock3(lineHeight * 7);
                //運を殺しているので1行空きが出来た
                this.drawHorzLine(lineHeight * 12);
                this.drawBlock4(lineHeight * 13);
            }
        };

		Window_Status.prototype.drawActorName = function(actor, x, y, width) {
		    width = width || this.contents.measureTextWidth(actor.name());
		    this.changeTextColor(this.hpColor(actor));
		    this.drawText(actor.name(), x, y, width);
		};

		Window_Status.prototype.drawActorNickname = function(actor, x, y, width) {
		    width = width || this.contents.measureTextWidth(actor.nickname());
		    this.resetTextColor();
		    this.drawText(actor.nickname(), x, y, width);
		};

        Window_Status.prototype.drawBlock1 = function(y) {
            this.drawActorName(this._actor, this.contents.fontSize, y);
            var pos_x = this.contents.measureTextWidth(this._actor.name());
            this.drawActorNickname(this._actor, pos_x + this.contents.fontSize, y);
        };

        Window_Status.prototype.drawBlock2 = function(y) {
        	var pos_x = this.contentsWidth() / 3;
            //this.drawActorFace(this._actor, 12, y);
            this.drawBasicInfo(this.contents.fontSize, y);
            this.drawExpInfo(this.contents.fontSize + pos_x, y);
        };

        Window_Status.prototype.drawBlock3 = function(y) {
        	var pos_x = this.contentsWidth() / 3;
            this.drawParameters(this.contents.fontSize + 0, y);
            this.drawParametersEx(this.contents.fontSize + pos_x , y);
            this.drawEquipments(this.contents.fontSize + pos_x * 2, y);
        };

		//運を殺す、略して（略さなくていい）
		Window_Status.prototype.drawParameters = function(x, y) {
		    var lineHeight = this.lineHeight();
		    for (var i = 0; i < 5; i++) {
		        var paramId = i + 2;
		        var y2 = y + lineHeight * i;
		        this.changeTextColor(this.systemColor());
		        this.drawText(TextManager.param(paramId), x, y2, 160);
		        this.resetTextColor();
		        this.drawText(this._actor.param(paramId), x + 160, y2, 60, 'right');
		    }
		};

        Window_Status.prototype.drawParametersEx = function(x, y) {
            var lineHeight = this.lineHeight();
            for (var i = 0; i < 2; i++) {
                var paramId = i;
                //if (paramId === 2) paramId += 2;
                var y2 = y + lineHeight * i;
                this.changeTextColor(this.systemColor());
                if (paramId !== 4) this.drawText(TextManager.param(paramId + 8), x, y2, 160);
                //if (paramId === 4) this.drawText("魔法回避率", x, y2, 160);
                this.resetTextColor();
                var text = (this._actor.xparam(paramId) * 100) + '%';
                this.drawText(text, x + 160, y2, 60, 'right');
            }
        };
    }

/*
	//考え中
	Game_Action.prototype.itemCri = function(target) {
		//これを相手との運の差にするとか？
		//Math.max(this.lukEffectRate(target)), 0.0)
	    return this.item().damage.critical ? this.subject().cri * (1 - target.cev) : 0;
	};
*/

})();;