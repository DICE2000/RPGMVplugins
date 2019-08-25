/*:
 * @plugindesc 圧縮する (2018/7/22)
 * @author NAK
 *
 * @param Use compressed JSON
 * @text 圧縮したJSONを使う
 * @type boolean
 * @default false
 *
 * @param Generate compressed JSON
 * @text JSON圧縮モード
 * @type boolean
 * @default false
 * 
 * @help !CANTION! At Your Own Risk
 * 圧縮モードでゲームを起動するとJSONファイルが圧縮されます。
 * 圧縮した方を使いたければオプションを変更してください。
 * 
 * 画像／音声の暗号化をした際にはJSONの圧縮を再度する必要があります。
 *
 * 2018/7/22:テストプレイ外でもJSON圧縮可能にした
 * 2018/3/25:注意書きを追加
 * 2018/3/18:初版
 *
 */

(function() {
    'use strict';

    var pluginName = 'dice2000_CompressDatabase';
    var parameters = PluginManager.parameters(pluginName);
    var paramUse   = (parameters['Use compressed JSON'] === 'true');
    var paramGenerate = (parameters['Generate compressed JSON'] === 'true');

    //ロード時に強引に生成する
    var dice2000CompressDatabase_loadDataFile = DataManager.loadDataFile;
    DataManager.loadDataFile = function(name, src) {
        if(paramUse && !paramGenerate){
            var xhr = new XMLHttpRequest();
            var url = 'data/' + src + ".dat";
            xhr.open('GET', url);
            xhr.overrideMimeType('application/json');
            xhr.onload = function() {
                if (xhr.status < 400) {
                    window[name] = JSON.parse(LZString.decompressFromBase64(xhr.responseText));
                    DataManager.onLoad(window[name]);
                }
            };
            xhr.onerror = this._mapLoader || function() {
                DataManager._errorUrl = DataManager._errorUrl || url;
            };
            window[name] = null;
            xhr.send();
        }else if(paramGenerate){
            var xhr = new XMLHttpRequest();
            var url = 'data/' + src;
            xhr.open('GET', url);
            xhr.overrideMimeType('application/json');
            xhr.onload = function() {
                if (xhr.status < 400) {
                    //通常のロード処理
                    window[name] = JSON.parse(xhr.responseText);
                    DataManager.onLoad(window[name]);
                    //ここで圧縮処理をかけてセーブしてしまう
                    StorageManager.saveToLocalFile_CompressedJSON(src + ".dat", xhr.responseText);
                }
            };
            xhr.onerror = this._mapLoader || function() {
                DataManager._errorUrl = DataManager._errorUrl || url;
            };
            window[name] = null;
            xhr.send();
        }else{
            dice2000CompressDatabase_loadDataFile.apply(this, arguments);
        }
    };

    DataManager.createCompressedMapdata = function() {
        $dataMapInfos.forEach(function(val){
            if(val !== null){
                var mapId = val['id'];
                var filename = 'Map%1.json'.format(mapId.padZero(3));
                DataManager.loadDataFile('$dataMap', filename);
            }
        });
    };

    var dice2000_CD_Scene_Title_start = Scene_Title.prototype.start;
    Scene_Title.prototype.start = function() {
        if (paramGenerate) DataManager.createCompressedMapdata();
        dice2000_CD_Scene_Title_start.call(this);
    };

    //Dataフォルダを指定する
    StorageManager.localFileDirectoryPath_CompressedJSON = function() {
        var path = require('path');
        var base = path.dirname(process.mainModule.filename);
        return path.join(base, 'data/');
    };

    //JSON圧縮する
    StorageManager.saveToLocalFile_CompressedJSON = function(filename, json) {
        var data = LZString.compressToBase64(json);
        var fs = require('fs');
        var savename = this.localFileDirectoryPath_CompressedJSON() + filename;
        fs.writeFileSync(savename, data);
    };

})();