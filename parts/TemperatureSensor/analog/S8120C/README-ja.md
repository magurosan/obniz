# Temperature Sensor - S8120C





![photo of AnalogTempratureSensor](./wired.png)



## wired(obniz, {vcc, output, gnd})
Obnizに温度センサをつなぎます。
```javascript
// Javascript Example
var tempsens = obniz.wired("S8120C",  { gnd:0 , output:1, vcc:2});
```

## onchange
温度センサの値に変化があった場合にcallback関数を呼び出します。
温度は摂氏で返されます。
```javascript
// Javascript Example
var tempsens = obniz.wired("S8120C",  { gnd:0 , output:1, vcc:2});
tempsens.onchange = function(temp){
  console.log(temp);
};
```


## getWait

温度センサの値を一度だけ取得します
温度は摂氏で返されます。

```javascript
// Javascript Example
var tempsens = obniz.wired("S8120C",   { gnd:0 , output:1, vcc:2});
var temp = tempsens.getWait();
console.log(temp);
```
 