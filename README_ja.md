# debugtrace-js

[English](README.md)

*debugtrace-js* は、JavaScriptプログラムのデバッグ時にトレースログを出力するライブラリで、Node.js 16以降で利用できます。  
関数の開始と終了箇所に`debugtrace.enter()`および`debugtrace.leave()`を埋め込む事で、開発中のJavaScriptプログラムの実行状況をログに出力する事ができます。

### 1. 特徴

* 呼び出し元の関数名、ソースファイルおよび行番号を自動的に出力。
* 関数やオブジェクトのネストで、ログを自動的にインデント。
* 実行時に依存するライブラリがない。

### 2. 使用方法

デバッグ対象および関連する関数に対して以下を行います。

1. 関数の先頭に`debugtrace.enter()`を挿入する。
1. 関数の終了(または`return`文の直前)に`debugtrace.leave()`を挿入する。
1. 必要に応じて、引数、ローカル変数、戻り値をログに出力する`debugtrace.print('foo', foo)`を挿入する。

以下は、debugtraceの関数を使用したJavaScriptの例とそれを実行した際のログです。

```JavaScript:ReadmeExample.js
// ReadmeExample.js
const debugtrace = require('debugtrace-js') // TODO: Debug

class Contact {
  constructor(id, firstName, lastName, birthday) {
    this.id = id
    this.firstName = firstName
    this.lastName = lastName
    this.birthday = birthday
  }
}

const func2 = () => {
  debugtrace.enter() // TODO: Debug
  let contacts = [
    new Contact(1, 'Akane' , 'Apple', new Date(Date.UTC(1991, 2, 3))),
    new Contact(2, 'Yukari', 'Apple', new Date(Date.UTC(1992, 3, 4)))
  ]
  debugtrace.print('contacts', contacts) // TODO: Debug
  debugtrace.leave() // TODO: Debug
}

const func1 = () => {
  debugtrace.enter() // TODO: Debug
  debugtrace.printMessage('Hello, World!')
  func2()
  debugtrace.leave() // TODO: Debug
}

func1()
```

```log:debugtrace.log
2025-02-11 15:49:38.591+09:00 debugtrace-js 2.2.0 on Node.js 22.13.1
2025-02-11 15:49:38.617+09:00
2025-02-11 15:49:38.618+09:00 Enter func1 (ReadmeExample.js:25)
2025-02-11 15:49:38.618+09:00 | Hello, World! (ReadmeExample.js:26)
2025-02-11 15:49:38.618+09:00 | Enter func2 (ReadmeExample.js:15)
2025-02-11 15:49:38.620+09:00 | | contacts = [
2025-02-11 15:49:38.620+09:00 | |   (Contact){
2025-02-11 15:49:38.620+09:00 | |     id: 1, firstName: 'Akane', lastName: 'Apple',
2025-02-11 15:49:38.620+09:00 | |     birthday: 1991-03-03 09:00:00.000+09:00
2025-02-11 15:49:38.621+09:00 | |   },
2025-02-11 15:49:38.621+09:00 | |   (Contact){
2025-02-11 15:49:38.621+09:00 | |     id: 2, firstName: 'Yukari', lastName: 'Apple',
2025-02-11 15:49:38.621+09:00 | |     birthday: 1992-04-04 09:00:00.000+09:00
2025-02-11 15:49:38.622+09:00 | |   }
2025-02-11 15:49:38.622+09:00 | | ] (ReadmeExample.js:20)
2025-02-11 15:49:38.622+09:00 | Leave func2 (ReadmeExample.js:21) duration: 00:00:00.004
2025-02-11 15:49:38.622+09:00 Leave func1 (ReadmeExample.js:28) duration: 00:00:00.004
```

### 3. 関数一覧

このライブラリには以下の関数があります。

<table>
  <caption>関数一覧</caption>
  <tr>
    <th style="text-align:center">関数名</th>
    <th style="text-align:center">引 数</th>
    <th style="text-align:center">戻り値</th>
    <th style="text-align:center">説 明</th>
  </tr>
  <tr>
    <td><code>enter</code></td>
    <td>なし</td>
    <td>なし</td>
    <td>関数の開始をログに出力する</td>
  </tr>
  <tr>
    <td><code>leave</code></td>
    <td>なし</td>
    <td>なし</td>
    <td>関数の終了をログに出力する</td>
  </tr>
  <tr>
    <td><code>printMessage</code></td>
    <td><code>message</code>: メッセージ</td>
    <td>メッセージ</td>
    <td>メッセージをログに出力する</td>
  </tr>
  <tr>
    <td><code>print</code></td>
    <td>
      <code>name</code>: 値の名前<br>
      <code>value</code>: 値<br>
      <code>printOptions</code>: 以下のプロパティを持つ (省略可)<br>
      <ul>
        <code>stringLength</code>: <code>true</code>なら文字列長を出力する<br>
        <code>arrayLength</code>: <code>true</code>なら配列長を出力する<br>
        <code>size</code>: <code>true</code>なら<code>Map</code>および<code>Set</code>のサイズを出力する<br>
        <code>collectionLimit</code>: <code>Map</code>および<code>Set</code>の要素の出力数の制限値<br>
        <code>stringLimit</code>: 文字列の出力文字数の制限値<br>
        <code>reflectionNestLimit</code>: フレクションのネスト数の制限値
      </ul>
    </td>
    <td>引数の値</td>
    <td><code><値の名前> = <値></code><br>の形式でログに出力する</td>
  </tr>
</table>

### 4. *debugtrace-js* のプロパティ

debugtrace には以下のプロパティを指定できます。

<table>
  <caption>debugtrace.properties</caption>
  <tr>
    <th style="text-align:center">プロパティ名</th>
    <th style="text-align:center">説 明</th>
  </tr>
  <tr>
    <td><code>formatEnter</code></td>
    <td>
      関数に入る際に出力するログのフォーマット関数<br>
      <span style="font-size:small;font-weight:bold">設定例 (初期設定):</span>
      <code>
    debugtrace.formatEnter = (name, fileName, lineNumber) =>
      `Enter ${name} (${fileName}:${lineNumber})`
      </code>
      <br>
      <span style="font-size:small;font-weight:bold">パラメータ:</span>
      <ul>
        <code>name</code>: 関数名<br>
        <code>fileName</code>: ファイル名<br>
        <code>lineNumber</code>: 行番号
      </ul>
    </td>
  </tr>
  <tr>
    <td><code>formatLeave</code></td>
    <td>
      関数から出る際に出力するログのフォーマット関数<br>
      <span style="font-size:small;font-weight:bold">設定例 (初期設定):</span>
      <code>
    debugtrace.formatLeave = (name, fileName, lineNumber, duration) =>
      `Leave ${name} (${fileName}:${lineNumber}) duration: ${duration}`<br>
      </code>
      <br>
      <span style="font-size:small;font-weight:bold">パラメータ:</span>
      <ul>
        <code>name</code>: 関数名<br>
        <code>fileName</code>: ファイル名<br>
        <code>lineNumber</code>: 行番号<br>
        <code>duration</code>: 対応する<code>enter</code>関数を呼び出してからの時間
      </ul>
    </td>
  </tr>
  <tr>
    <td><code>indentString</code></td>
    <td>コードのインデント文字列<br>
      <span style="font-size:small;font-weight:bold">設定例 (初期設定):</span>
      <code>
    debugtrace.indentString = '| '</code>
    </td>
  </tr>
  <tr>
    <td><code>dataIndentString</code></td>
    <td>
      データのインデント文字列<br>
      <span style="font-size:small;font-weight:bold">設定例 (初期設定):</span>
      <code>
    debugtrace.dataIndentString = '  '</code>
    </td>
  </tr>
  <tr>
    <td><code>limitString</code></td>
    <td>
      制限を超えた場合に出力する文字列<br>
      <span style="font-size:small;font-weight:bold">設定例 (初期設定):</span>
      <code>
    debugtrace.limitString = '...'</code>
    </td>
  </tr>
  <tr>
    <td><code>cyclicReferenceString</code></td>
    <td>
      循環参照している場合に出力する文字列<br>
      <span style="font-size:small;font-weight:bold">設定例 (初期設定):</span>
      <code>
    debugtrace.cyclicReferenceString = '*** cyclic reference ***'</code>
    </td>
  </tr>
  <tr>
    <td><code>varNameValueSeparator</code></td>
    <td>
      変数名と値のセパレータ文字列<br>
      <span style="font-size:small;font-weight:bold">設定例 (初期設定):</span>
      <code>
    debugtrace.varNameValueSeparator = ' = '</code>
    </td>
  </tr>
  <tr>
    <td><code>keyValueSeparator</code></td>
    <td>
      マップのキーと値のセパレータ文字列<br>
      <span style="font-size:small;font-weight:bold">設定例 (初期設定):</span>
      <code>
    debugtrace.keyValueSeparator = ': '</code>
    </td>
  </tr>
  <tr>
    <td><code>formatPrintSuffix</code></td>
    <td>
      <code>print</code>関数で付加される文字列のフォーマット関数<br>
      <span style="font-size:small;font-weight:bold">設定例 (初期設定):</span>
      <code>
    debugtrace.formatPrintSuffix = (name, fileName, lineNumber) =>
      `(${fileName}:${lineNumber})`</code>
      <br>
      <span style="font-size:small;font-weight:bold">パラメータ:</span>
      <ul>
        <code>name</code>: 関数名 <span style="font-size:small">_(初期設定では未使用)_</span><br>
        <code>fileName</code>: ファイル名<br>
        <code>lineNumber</code>: 行番号
      </ul>
    </td>
  </tr>
  <tr>
    <td><code>formatLength</code></td>
    <td>
      配列および文字列長のフォーマット関数<br>
      <span style="font-size:small;font-weight:bold">設定例 (初期設定):</span>
      <code>
    debugtrace.formatLength = length => `length:${length}`</code>
      <br>
      <span style="font-size:small;font-weight:bold">パラメータ:</span>
      <ul>
        <code>length</code>: 要素数または文字列長
      </ul>
    </td>
  </tr>
  <tr>
    <td><code>formatSize</code></td>
    <td>
      <code>Map</code>および<code>Set</code>の要素数のフォーマット関数<br>
      <span style="font-size:small;font-weight:bold">設定例 (初期設定):</span>
      <code>
    debugtrace.formatSize = size => `size:${size}`</code>
      <br>
      <span style="font-size:small;font-weight:bold">パラメータ:</span>
      <ul>
        <code>size</code>: 要素数
      </ul>
    </td>
  </tr>
  <tr>
    <td><code>formatDate</code></td>
    <td>
      <code>Date</code>のフォーマット関数<br>
      <span style="font-size:small;font-weight:bold">設定例 (初期設定):</span>
      <code>
    debugtrace.formatDate = date => {
      let timezoneOffset = date.getTimezoneOffset()
      const offsetSign = timezoneOffset < 0 ? '+' : '-'
      if (timezoneOffset < 0)
        timezoneOffset = -timezoneOffset
      const str =date.getFullYear() + '-' +
        ('0' + (date.getMonth() + 1 )).slice(-2) + '-' +
        ('0' + date.getDate ()).slice(-2) + ' ' +
        ('0' + date.getHours()).slice(-2) + ':' +
        ('0' + date.getMinutes()).slice(-2) + ':' +
        ('0' + date.getSeconds()).slice(-2) + '.' +
        ('00' +date.getMilliseconds() ).slice(-3) + offsetSign +
        ('0'+Math.floor(timezoneOffset / 60)).slice(-2) + ':' +
        ('0'+timezoneOffset % 60).slice(-2)
      return str
    }</code>
      <br>
      <span style="font-size:small;font-weight:bold">パラメータ:</span>
      <ul>
        <code>date</code>: 日時
      </ul>
    </td>
  </tr>
  <tr>
    <td><code>formatTime</code></td>
    <td>
      <code>formatLeave</code>の<code>duration</code>のフォーマット関数<br>
      <span style="font-size:small;font-weight:bold">設定例 (初期設定):</span>
      <code>
    debugtrace.formatTime = date =>
      ('0' + date.getUTCHours  ()).slice(-2) + ':' +
      ('0' + date.getUTCMinutes()).slice(-2) + ':' +
      ('0' + date.getUTCSeconds()).slice(-2) + '.' +
      ('00' + date.getUTCMilliseconds()).slice(-3)</code>
    <br>
    <span style="font-size:small;font-weight:bold">パラメータ:</span>
    <ul>
      <code>date</code>: 時刻差
    </ul>
    </td>
  </tr>
  <tr>
    <td><code>formatLogDate</code></td>
    <td>
      ログの日時のフォーマット関数<br>
      <span style="font-size:small;font-weight:bold">設定例 (初期設定):</span>
      <code>formatDate</code> <span style="font-size:small">参照</span><br>
      <span style="font-size:small;font-weight:bold">パラメータ:</span>
      <ul>
        <code>date</code>: 日時
      </ul>
    </td>
  </tr>
  <tr>
    <td><code>maximumDataOutputWidth</code></td>
    <td>
      データの出力幅の最大値<br>
      <span style="font-size:small;font-weight:bold">設定例 (初期設定):</span>
      <code>
    debugtrace.maximumDataOutputWidth = 70</code>
    </td>
  </tr>
  <tr>
    <td><code>collectionLimit</code></td>
    <td>
      配列、<code>Map</code>および<code>Set</code>の要素の出力数の制限値<br>
      <span style="font-size:small;font-weight:bold">設定例 (初期設定):</span>
      <code>
    debugtrace.collectionLimit = 128</code>
    </td>
  </tr>
  <tr>
    <td><code>stringLimit</code></td>
    <td>
      文字列の出力文字数の制限値<br>
      <span style="font-size:small;font-weight:bold">設定例 (初期設定):</span>
      <code>
    debugtrace.stringLimit = 256</code>
    </td>
  </tr>
  <tr>
    <td><code>reflectionNestLimit</code></td>
    <td>
      リフレクションのネスト数の制限値<br>
      <span style="font-size:small;font-weight:bold">設定例 (初期設定):</span>
      <code>
    debugtrace.reflectionNestLimit = 4</code>
    </td>
  </tr>
  <tr>
    <td><code>basicPrint</code></td>
    <td>
      基本的出力関数<br>
      <span style="font-size:small;font-weight:bold">設定例 (初期設定):</span>
      <code>
    debugtrace.basicPrint = console.log</code>
      <br>
      <span style="font-size:small;font-weight:bold">設定例 (標準エラーに出力):</span>
      <code>
    debugtrace.basicPrint = console.error <span style="font-size:small"></code>
    </td>
  </tr>
</table>

### 5. ライセンス

[MIT ライセンス(MIT)](LICENSE.txt)

_(C) 2015 Masato Kokubo_

### 6. リリースノート

#### debugtrace-js 2.2.0 - 2025/2/16

* 以下のプロパティを削除しました。
  * `debugtrace.minimumOutputLengthAndSize`
  * `debugtrace.minimumOutputStringLength`

* 以下のプロパティの初期値を変更しました。
  |プロパティ名                  |初期値|旧初期値|
  |:---------------------------|----:|------:|
  |`debugtrace.collectionLimit`|  128|    512|
  |`debugtrace.stringLimit`    |  256|   8192|

* `print`関数に`printOptions`引数(省略可)を追加しました。

#### debugtrace-js 2.1.2 - 2022/3/13

* `print`, `printMessage`関数は引数値を返すようにしました。

#### debugtrace-js 2.1.1 - 2021/10/9

* 型名の出力時に例外がスローされる不具合を修正しました。
* 起動時にNode.jsのバージョンを出力するようにしました。

#### debugtrace-js 2.1.0 - 2021/8/9

* 関数の出力の改善 (関数定義の最初の行のみ出力する)
* `basicPrint`関数を追加しました。
* データ出力の改行処理を改善しました。

#### debugtrace-js 2.0.0 - 2020/8/2

* Node.js 10以降に対応しました。
* データ出力の改行処理を改善しました。
