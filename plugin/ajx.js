/*

console.log("mainjs");
var XHR = new window.XMLHttpRequest;
var overrideTxt = "test";


    XHR.onreadystatechange = function () {
        if(XHR.readyState === 4){
            modifyResponse()
        }
       this.onreadystatechange.apply(this,arguments)
    }


    XHR.onload = function () {
        modifyResponse()
        this.onload.apply(this,arguments)
    }



    Object.defineProperty(this,'response',{
        get(){
            this._response ? this._response : this.response
        },
        set(v) {
            this._response = v
        }
    })



    Object.defineProperty(this,'responseText',{
        get(){
            this._responseText ? this._responseText : this.responseText
        },
        set(v) {
            this._responseText = v
        }
    })


function  modifyResponse() {
    this.responseText = overrideTxt;
    this.response = overrideTxt;
}
*/
