//=============================================================================
// dice2000_YEP_SkillCoreFanPatch.js
//=============================================================================
//
// YanflyEnginePluginのバグや仕様をああだこうだする
//
// ----------------------------------------------------------------------------
// NAK a.k.a. 22番目の素数
// [Blog]   : http://nak.hits.jp/documents/rpgmaker.html
// [GitHub] : https://github.com/DICE2000
// ----------------------------------------------------------------------------
/*:
 * @plugindesc YEPのSkillCore一括選択
 * @author 22番目の素数(NAK)
 *
 * @help このスクリプトはYEPシリーズの下に置いてください。
 * 
 * @param YEP battle command skill name
 * @text 戦闘のスキル一括選択
 * @desc 文字列を指定するとそのコマンド名でスキルを一括選択できます。
 * @default 
 * @type string
 * 
 */

//グローバルに定義されている変数の存在チェック
var Imported = Imported || {};
var Yanfly = Yanfly || {};

var parameters     = PluginManager.parameters('dice2000_YEP_SkillCoreFanPatch');
var paramYEPSkillBattleCommandSkillName = String(parameters['YEP battle command skill name']);


if (Imported.YEP_SkillCore) {
if (Yanfly.Skill.version) {

  //ここから：-----スキル表示結合-----
  if(paramYEPSkillBattleCommandSkillName !== ''){
    var dice2000_YEPSkillCoreFanPatch_Window_SkillList_includes = Window_SkillList.prototype.includes;
    Window_SkillList.prototype.includes = function(item) {
      if (this._actor) {
        if (!this._actor.noHiddenSkillConditionsMet(item)) return false;
      }
      if(this._stypeId === 0){
        return item;
      }else{
        return dice2000_YEPSkillCoreFanPatch_Window_SkillList_includes.call(this, item);
      }
    };

    Window_ActorCommand.prototype.addSkillCommands = function() {
        this.addCommand(paramYEPSkillBattleCommandSkillName, 'skill', true);
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

}   // Yanfly.Skill.version
};  // Imported.YEP_SkillCore

//=============================================================================
// FILE NO OWARI
//=============================================================================