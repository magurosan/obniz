# obniz.js sdk for javascript
obnizをbrowser/nodejsのjavascriptから。

## install

### browser

index.jsを読み込みます。
```html
  <script src="//parts.obniz.io/obniz.js"></script>
```
### nodejs
Install obniz
```shell
  npm install obniz
```
そしてjsの中でimportして下さい。
```javascript
  const Obniz = require('obniz');
```

## connect
obnizをobniz idを使ってインスタンス化します。
そして接続が完了した時に呼ばれる関数をセットします。
```javascript
  var obniz = new Obniz("0000-0000");
  obniz.onconnect = async function () {

  }
```
接続完了後にobnizやobnizにつながれた部品を扱えます。
```javascript
  var obniz = new Obniz("0000-0000");
  obniz.onconnect = async function () {
    obniz.display.print("hello!");
    obniz.switch.onchange = function(state) {
      if (state === "push") {
        obniz.display.print("Button Pressed");
      }
    }
  }
```
IOペリフェラルも利用可能です。詳しくはそれぞれのペリフェラルドキュメントを見てください。
```javascript
  var obniz = new Obniz("0000-0000");
  obniz.onconnect = async function () {
    obniz.io.outputType("push-pull")
    obniz.io0.output(true)
    obniz.io1.pullup();
    obniz.io1.outputType("open-drain");
    obniz.io1.output(true);
    obniz.io2.outputType("push-pull3v");
    obniz.io2.output(true);

    obniz.ad3.start(function(voltage){
      console.log("changed to "+voltage+" v")
    });

    var pwm = obniz.getpwm();
    pwm.start(4);   // start pwm at io2
    pwm.freq(1000); // set pwm. frequency to 1khz
    pwm.duty(50)    // set pwm pulse witdh 50%

    obniz.uart0.start(5, 6, 119200);
    obniz.uart0.onreceive = function(data, text) {
      console.log(data);
    }
    obniz.uart0.send("Hello");
  }
```

## Parts library
パーツライブラリはobniz.jsに含まれています。ドキュメントはこちらで

[obniz Parts Library](https://parts.obniz.io/)

obnizにつながれた部品をつかうにはpartsをonconnect関数の中でインスタンス化します。どんな関数があるかなども [obniz Parts Library](https://parts.obniz.io/) で確認できます。

例えば LED [https://parts.obniz.io/LED](https://parts.obniz.io/LED)
```javascript
  var obniz = new Obniz("0000-0000");
  obniz.onconnect = async function () {
    var led = obniz.wired("LED", 0, 1);
    led.blink();
  }
```

HC-SR40(distance measure) [https://parts.obniz.io/HC-SR04](https://parts.obniz.io/HC-SR04)
```javascript
  var obniz = new Obniz("0000-0000");
  obniz.onconnect = async function () {
    var hcsr04 = obniz.wired("HC-SR04", 3,2,1,0);
    hcsr04.unit("inch");
    hcsr04.measure(function( distance ){
      console.log("distance " + distance + " inch")
    })
  }
```

## browser integrates hardware
HTML上のUIとハードウェアの連携も簡単です。
```html
<input id="slider" type="range"  min="0" max="180" />

<script src="//parts.obniz.io/obniz.js"></script>
<script>
var obniz = new Obniz("0000-0000");
obniz.onconnect = async function () {
  var servo = obniz.wired("ServoMotor", 0, 1, 2);
  $("#slider").on('input', function() {
    servo.angle($("#slider").val())
  });
}
</script>
```

## integrate web services
DropboxやTwitterなどのwebサービスとの連携もとても簡単に行なえます。
```javascript
// save data from obniz to dropbox
var obniz = new Obniz("0000-0000");
obniz.onconnect = async function () {
  var dbx = new Dropbox({ accessToken: '<YOUR ACCESS TOKEN HERE>' });
  var button = obniz.wired("Button", 0, 1);
  button.onChange(function(pressed){
    if (pressed) {
  　　dbx.filesUpload({path: '/obniz.txt', contents: "[Button Pressed]\n" + new Date(), mode: 'overwrite' });
    }
  });
}
```

## integrate two or more obniz
web-obnizだけでなくobniz-obnizの連携も簡単に行なえます。  
obnizにつながれたサーボモーターを別のobnizにつながれたつまみから操作してみます。
```javascript
// control servomotor from potention meter which connected to another obniz.
var obnizA = new Obniz("0000-0000");
obnizA.onconnect = async function () {
  var obnizB = new Obniz("0000-0001");
  obnizB.onconnect = async function(){
    var meter = obnizA.wired("PotentionMeter", 0, 1, 2);
    var servo = obnizB.wired("ServoMotor", 0, 1, 2);
    meter.onChange(function(position) {
      servo.angle(position * 180);
    }); 
  }
}
```