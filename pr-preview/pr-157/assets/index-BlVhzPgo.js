(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function a(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(o){if(o.ep)return;o.ep=!0;const r=a(o);fetch(o.href,r)}})();let Qt=!1;const un=async t=>{if(Qt)return Promise.resolve();Qt=!0;const e=await t();return Qt=!1,e},Ar={new:({container:t,fetchPreviousContent:e,fetchNextContent:a})=>({attach:()=>t.addEventListener("scroll",()=>{const n=t,o=n.scrollTop,r=n.clientHeight,i=n.scrollHeight-(n.clientHeight+n.scrollTop);o<.5*r?un(()=>e.fetch().then(l=>{if(!l)return;const c=n.scrollHeight-n.scrollTop;e.render(l),n.scrollTop=n.scrollHeight-c})):i<.5*r&&un(()=>a.fetch().then(l=>{l&&a.render(l)}))})})},Ir=t=>{const e=document.createElement("template");if(t=t.trim(),e.innerHTML=t,e.content.childElementCount!==1)throw new Error("Should render exactly one node");return e.content.firstElementChild},wr=t=>typeof t=="string"?{key:t,ctrl:!1}:t,Sr=(t,e)=>a=>{const{key:n,ctrl:o}=wr(t);a.ctrlKey===o&&a.key===n&&!a.repeat&&e(a)},Tr=t=>{for(;t.firstChild;)t.removeChild(t.firstChild)},Xe={htmlToElement:Ir,whenKey:Sr,purgeNode:Tr},Cr="modulepreload",Mr=function(t){return"/pr-preview/pr-157/"+t},pn={},s=function(e,a,n){let o=Promise.resolve();if(a&&a.length>0){document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),l=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));o=Promise.allSettled(a.map(c=>{if(c=Mr(c),c in pn)return;pn[c]=!0;const d=c.endsWith(".css"),g=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${g}`))return;const _=document.createElement("link");if(_.rel=d?"stylesheet":Cr,d||(_.as="script"),_.crossOrigin="",_.href=c,l&&_.setAttribute("nonce",l),document.head.appendChild(_),d)return new Promise((f,E)=>{_.addEventListener("load",f),_.addEventListener("error",()=>E(new Error(`Unable to preload CSS for ${c}`)))})}))}function r(i){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=i,window.dispatchEvent(l),!l.defaultPrevented)throw i}return o.then(i=>{for(const l of i||[])l.status==="rejected"&&r(l.reason);return e().catch(r)})},Zn=(t,e,a)=>{const n=t[e];return n?typeof n=="function"?n():Promise.resolve(n):new Promise((o,r)=>{(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(r.bind(null,new Error("Unknown variable dynamic import: "+e+(e.split("/").length!==a?". Note that variables only represent file names one level deep.":""))))})};var q=(t=>(t.Shacharis="שחרית",t.Mincha="מנחה",t.Maariv="מעריב",t.Megillah="מגילה",t))(q||{}),B=(t=>(t.Main="Main",t.LastAliyah="שביעי",t.Maftir="מפטיר",t.Haftarah="הפטרה",t.Megillah="מגילה",t))(B||{});const Lr={new:({startingAt:t})=>{let e=0,a=0;return{previous:()=>(e+=1,t-e),next:()=>(a+=1,t+a)}}};/*! @hebcal/hdate v0.12.0 */const mn=[0,31,28,31,30,31,30,31,31,30,31,30,31],Wn=[mn,mn.slice()];Wn[1][2]=29;function Xt(t,e){return t-e*Math.floor(t/e)}function Ae(t,e){return Math.floor(t/e)}function Dr(t){const e=t-1,a=Ae(e,146097),n=Xt(e,146097),o=Ae(n,36524),r=Xt(n,36524),i=Ae(r,1461),l=Xt(r,1461),c=Ae(l,365),d=400*a+100*o+4*i+c;return o!==4&&c!==4?d+1:d}function Yt(t){return!(t%4)&&(!!(t%100)||!(t%400))}function Rr(t,e){return Wn[+Yt(e)][t]}function Za(t){return typeof t=="object"&&Date.prototype.isPrototypeOf(t)}function It(t,e,a){const n=t-1;return 365*n+Ae(n,4)-Ae(n,100)+Ae(n,400)+Ae(367*e-362,12)+(e<=2?0:Yt(t)?-1:-2)+a}function Qn(t){if(!Za(t))throw new TypeError(`Argument not a Date: ${t}`);return It(t.getFullYear(),t.getMonth()+1,t.getDate())}function Xn(t){if(typeof t!="number")throw new TypeError(`Argument not a Number: ${t}`);t=Math.trunc(t);const e=Dr(t),a=t-It(e,1,1),n=t<It(e,3,1)?0:Yt(e)?1:2,o=Ae(12*(a+n)+373,367),r=t-It(e,o,1)+1,i=new Date(e,o-1,r);return e<100&&e>=0&&i.setFullYear(e),i}/*! @hebcal/hdate v0.12.0 */var Ve;Ve||(Ve={});Ve.abs2greg=Xn;Ve.daysInMonth=Rr;Ve.greg2abs=Qn;Ve.isDate=Za;Ve.isLeapYear=Yt;/*! @hebcal/hdate v0.12.0 */const Wa=1,Mt=2,va=3,Lt=4,xa=5,Dt=6,Je=7,Qa=8,Xa=9,Rt=10,Aa=11,Ht=12,Pt=13,V={NISAN:Wa,IYYAR:Mt,SIVAN:va,TAMUZ:Lt,AV:xa,ELUL:Dt,TISHREI:Je,CHESHVAN:Qa,KISLEV:Xa,TEVET:Rt,SHVAT:Aa,ADAR_I:Ht,ADAR_II:Pt},fn=["","Nisan","Iyyar","Sivan","Tamuz","Av","Elul","Tishrei","Cheshvan","Kislev","Tevet","Sh'vat"],Hr=[fn.concat(["Adar","Nisan"]),fn.concat(["Adar I","Adar II","Nisan"])],bn=new Map,Ot=-1373428,Pr=365.24682220597794;function Ge(t,e){if(typeof t!="number"||isNaN(t))throw new TypeError(`invalid parameter '${e}' not a number: ${t}`)}function ut(t,e,a){if(Ge(t,"year"),Ge(e,"month"),Ge(a,"day"),t<1)throw new RangeError(`hebrew2abs: invalid year ${t}`);let n=a;if(e<Je){for(let o=Je;o<=Oe(t);o++)n+=Ie(o,t);for(let o=Wa;o<e;o++)n+=Ie(o,t)}else for(let o=Je;o<e;o++)n+=Ie(o,t);return Ot+Nt(t)+n-1}function Or(t){return Ot+Nt(t)}function Nr(t){if(Ge(t,"abs"),t=Math.trunc(t),t<=Ot)throw new RangeError(`abs2hebrew: ${t} is before epoch`);let e=Math.floor((t-Ot)/Pr);for(;Or(e)<=t;)++e;--e;let a=t<ut(e,1,1)?7:1;for(;t>ut(e,a,Ie(a,e));)++a;const n=1+t-ut(e,a,1);return{yy:e,mm:a,dd:n}}function je(t){return(1+t*7)%19<7}function Oe(t){return 12+ +je(t)}function Ie(t,e){switch(t){case Mt:case Lt:case Dt:case Rt:case Pt:return 29}return t===Ht&&!je(e)||t===Qa&&!eo(e)||t===Xa&&to(e)?29:30}function gn(t,e){if(Ge(t,"month"),Ge(e,"year"),t<1||t>14)throw new TypeError(`bad month argument ${t}`);return Hr[+je(e)][t]}function Nt(t){const e=bn.get(t);if(typeof e=="number")return e;const a=Vr(t);return bn.set(t,a),a}function Vr(t){const e=t-1,a=235*Math.floor(e/19)+12*(e%19)+Math.floor((e%19*7+1)/19),n=204+793*(a%1080),o=5+12*a+793*Math.floor(a/1080)+Math.floor(n/1080),r=n%1080+1080*(o%24),i=1+29*a+Math.floor(o/24);let l=i;return(r>=19440||i%7===2&&r>=9924&&!je(t)||i%7===1&&r>=16789&&je(e))&&l++,l%7===0||l%7===3||l%7===5?l+1:l}function en(t){return Nt(t+1)-Nt(t)}function eo(t){return en(t)%10===5}function to(t){return en(t)%10===3}function jr(t){if(typeof t=="number"){if(isNaN(t)||t<1||t>14)throw new RangeError(`Invalid month name: ${t}`);return t}let e=t.trim().toLowerCase();switch(e[0]==="ב"&&(e=e.substring(1)),e[0]){case"n":case"נ":if(e[1]==="o")break;return Wa;case"i":return Mt;case"e":return Dt;case"c":case"ח":return Qa;case"k":case"כ":return Xa;case"s":switch(e[1]){case"i":return va;case"h":return Aa}break;case"t":switch(e[1]){case"a":return Lt;case"i":return Je;case"e":return Rt}break;case"a":switch(e[1]){case"v":return xa;case"d":return/(1|[^i]i|a|א)$/i.test(t)?Ht:Pt}break;case"ס":return va;case"ט":return Rt;case"ש":return Aa;case"א":switch(e[1]){case"ב":return xa;case"ד":return/(1|[^i]i|a|א)$/i.test(t)?Ht:Pt;case"י":return Mt;case"ל":return Dt}break;case"ת":switch(e[1]){case"מ":return Lt;case"ש":return Je}break}throw new RangeError(`Unable to parse month name: ${t}`)}/*! @hebcal/hdate v0.12.0 */const Ia="׳",$r="״",zr={א:1,ב:2,ג:3,ד:4,ה:5,ו:6,ז:7,ח:8,ט:9,י:10,כ:20,ל:30,מ:40,נ:50,ס:60,ע:70,פ:80,צ:90,ק:100,ר:200,ש:300,ת:400},ao=new Map,wt=new Map;for(const[t,e]of Object.entries(zr))ao.set(t,e),wt.set(e,t);function kn(t){const e=[];for(;t>0;){if(t===15||t===16){e.push(9),e.push(t-9);break}let a=100,n;for(n=400;n>t;n-=a)n===a&&(a=a/10);e.push(n),t-=n}return e}function _n(t){const a=parseInt(t,10);if(!a||a<0)throw new TypeError(`invalid gematriya number: ${t}`);let n="";const o=Math.floor(a/1e3);if(o>0&&o!==5){const i=kn(o);for(const l of i)n+=wt.get(l);n+=Ia}const r=kn(a%1e3);if(r.length===1)return n+wt.get(r[0])+Ia;for(let i=0;i<r.length;i++)i+1===r.length&&(n+=$r),n+=wt.get(r[i]);return n}function wa(t){let e=0;const a=t.indexOf(Ia);if(a!==-1&&a!==t.length-1){const n=t.substring(0,a);e+=wa(n)*1e3,t=t.substring(a)}for(const n of t){const o=ao.get(n);typeof o=="number"&&(e+=o)}return e}/*! @hebcal/hdate v0.12.0 */function no(t){return t<0?"-00"+no(-t):t<10?"000"+t:t<100?"00"+t:t<1e3?"0"+t:String(t)}function yn(t){return t>=0&&t<10?"0"+t:String(t)}/*! @hebcal/hdate v0.12.0 */function oo(t){return no(t.getFullYear())+"-"+yn(t.getMonth()+1)+"-"+yn(t.getDate())}/*! @hebcal/hdate v0.12.0 */var ro={headers:{"plural-forms":"nplurals=2; plural=(n > 1);"},contexts:{"":{Tevet:["Teves"]}}};/*! @hebcal/hdate v0.12.0 */var Kt={headers:{"plural-forms":"nplurals=2; plural=(n > 1);"},contexts:{"":{Adar:["אַדָר"],"Adar I":["אַדָר א׳"],"Adar II":["אַדָר ב׳"],Av:["אָב"],Cheshvan:["חֶשְׁוָן"],Elul:["אֱלוּל"],Iyyar:["אִיָיר"],Kislev:["כִּסְלֵו"],Nisan:["נִיסָן"],"Sh'vat":["שְׁבָט"],Sivan:["סִיוָן"],Tamuz:["תַּמּוּז"],Tevet:["טֵבֵת"],Tishrei:["תִּשְׁרֵי"]}}};/*! @hebcal/hdate v0.12.0 */const tn={headers:{"plural-forms":"nplurals=2; plural=(n!=1);"},contexts:{"":{}}},Br={h:"he",a:"ashkenazi",s:"en","":"en"},St=new Map;let ea,ta;function aa(t){const e=["th","st","nd","rd"],a=t%100;return t+(e[(a-20)%10]||e[a]||e[0])}function Sa(t){if(typeof t!="string")throw new TypeError(`Invalid locale name: ${t}`);return t.toLowerCase()}function na(t){const e=Sa(t),a=St.get(e);if(!a)throw new RangeError(`Locale '${t}' not found`);return a}class P{static lookupTranslation(e,a){const o=(typeof a=="string"&&St.get(a.toLowerCase())||ea)[e];if(o!=null&&o.length&&o[0].length)return o[0]}static gettext(e,a){const n=this.lookupTranslation(e,a);return typeof n>"u"?e:n}static addLocale(e,a){if(e=Sa(e),typeof a.contexts!="object"||typeof a.contexts[""]!="object")throw new TypeError(`Locale '${e}' invalid compact format`);St.set(e,a.contexts[""])}static addTranslation(e,a,n){const o=na(e);if(typeof a!="string"||a.length===0)throw new TypeError(`Invalid id string: ${a}`);const r=Array.isArray(n);if(r){const i=n[0];if(typeof i!="string"||i.length===0)throw new TypeError(`Invalid translation array: ${n}`)}else if(typeof n!="string")throw new TypeError(`Invalid translation string: ${n}`);o[a]=r?n:[n]}static addTranslations(e,a){const n=na(e);if(typeof a.contexts!="object"||typeof a.contexts[""]!="object")throw new TypeError(`Locale '${e}' invalid compact format`);const o=a.contexts[""];Object.assign(n,o)}static useLocale(e){const a=Sa(e),n=na(a);return ta=Br[a]||a,ea=n,ea}static getLocaleName(){return ta}static getLocaleNames(){return Array.from(St.keys()).sort((a,n)=>a.localeCompare(n))}static ordinal(e,a){const o=(a==null?void 0:a.toLowerCase())||ta;if(!o)return aa(e);switch(o){case"en":case"s":case"a":return aa(e);case"es":return e+"º";case"h":case"he":case"he-x-nonikud":return String(e)}return o.startsWith("ashkenazi")?aa(e):e+"."}static hebrewStripNikkud(e){return e.replace(/[\u0590-\u05bd]/g,"").replace(/[\u05bf-\u05c7]/g,"")}}P.addLocale("en",tn);P.addLocale("s",tn);P.addLocale("",tn);P.useLocale("en");P.addLocale("ashkenazi",ro);P.addLocale("a",ro);P.addLocale("he",Kt);P.addLocale("h",Kt);const Yr=Kt.contexts[""],so={};for(const[t,e]of Object.entries(Yr))so[t]=[P.hebrewStripNikkud(e[0])];const Kr={headers:Kt.headers,contexts:{"":so}};P.addLocale("he-x-NoNikud",Kr);/*! @hebcal/hdate v0.12.0 */function Fr(t,e){return t-e*Math.floor(t/e)}function Ur(t){return t.yy!==void 0}const Ta="day",Ca="week",En="month",Ma="year";class u{constructor(e,a,n){if(arguments.length===2||arguments.length>3)throw new TypeError("HDate constructor requires 0, 1 or 3 arguments");if(arguments.length===3){this.dd=this.mm=1;const o=typeof n=="string"?parseInt(n,10):n;if(isNaN(o))throw new TypeError(`HDate called with bad year argument: ${n}`);this.yy=o,Gr(this,a);const r=typeof e=="string"?parseInt(e,10):e;if(isNaN(r))throw new TypeError(`HDate called with bad day argument: ${e}`);Zr(this,r)}else{(typeof e>"u"||e===null)&&(e=new Date);const o=typeof e=="number"&&!isNaN(e)?e:Za(e)?Qn(e):Ur(e)?e:null;if(o===null)throw new TypeError(`HDate called with bad argument: ${e}`);const r=typeof o=="number",i=r?Nr(o):o;this.yy=i.yy,this.mm=i.mm,this.dd=i.dd,r&&(this.rd=o)}}getFullYear(){return this.yy}isLeapYear(){return je(this.yy)}getMonth(){return this.mm}getTishreiMonth(){const e=Oe(this.getFullYear());return(this.getMonth()+e-6)%e||e}daysInMonth(){return Ie(this.getMonth(),this.getFullYear())}getDate(){return this.dd}getDay(){return Fr(this.abs(),7)}greg(){return Xn(this.abs())}abs(){return typeof this.rd!="number"&&(this.rd=ut(this.yy,this.mm,this.dd)),this.rd}static hebrew2abs(e,a,n){return ut(e,a,n)}getMonthName(){return gn(this.getMonth(),this.getFullYear())}render(e,a=!0){const n=e||P.getLocaleName(),o=this.getDate(),i=P.gettext(this.getMonthName(),n).replace(/'/g,"’"),l=P.ordinal(o,n),c=Jr(n),d=`${l}${c} ${i}`;if(a){const g=this.getFullYear();return`${d}, ${g}`}else return d}renderGematriya(e=!1){const a=this.getDate(),n=e?"he-x-NoNikud":"he",o=P.gettext(this.getMonthName(),n),r=this.getFullYear();return _n(a)+" "+o+" "+_n(r)}before(e){return nt(e,this,-1)}onOrBefore(e){return nt(e,this,0)}nearest(e){return nt(e,this,3)}onOrAfter(e){return nt(e,this,6)}after(e){return nt(e,this,7)}next(){return new u(this.abs()+1)}prev(){return new u(this.abs()-1)}add(e,a="d"){if(e=typeof e=="string"?parseInt(e,10):e,!e)return new u(this);if(a=qr(a),a===Ta)return new u(this.abs()+e);if(a===Ca)return new u(this.abs()+7*e);if(a===Ma)return new u(this.getDate(),this.getMonth(),this.getFullYear()+e);{let n=new u(this);const o=e>0?1:-1;e=Math.abs(e);for(let r=0;r<e;r++)n=new u(n.abs()+o*n.daysInMonth());return n}}subtract(e,a="d"){return this.add(e*-1,a)}deltaDays(e){return this.abs()-e.abs()}isSameDate(e){return this.yy===e.yy&&this.mm===e.mm&&this.dd===e.dd}toString(){const e=this.getDate(),a=this.getFullYear(),n=this.getMonthName();return`${e} ${n} ${a}`}static isLeapYear(e){return je(e)}static monthsInYear(e){return Oe(e)}static daysInMonth(e,a){return Ie(e,a)}static getMonthName(e,a){return gn(e,a)}static monthNum(e){if(typeof e=="number"){if(isNaN(e)||e>14)throw new RangeError(`Invalid month number: ${e}`);return e}return e.charCodeAt(0)>=48&&e.charCodeAt(0)<=57?parseInt(e,10):u.monthFromName(e)}static daysInYear(e){return en(e)}static longCheshvan(e){return eo(e)}static shortKislev(e){return to(e)}static monthFromName(e){if(typeof e=="number"){if(isNaN(e)||e<1||e>14)throw new RangeError(`Invalid month name: ${e}`);return e}const a=P.hebrewStripNikkud(e);return jr(a)}static dayOnOrBefore(e,a){return a-(a-e)%7}static isHDate(e){return e!==null&&typeof e=="object"&&typeof e.yy=="number"&&typeof e.mm=="number"&&typeof e.dd=="number"&&typeof e.greg=="function"&&typeof e.abs=="function"}static fromGematriyaString(e,a=5e3){const n=e.split(" ").filter(g=>g.length!==0),o=n.length;if(o!==3&&o!==4)throw new RangeError(`Unable to parse gematriya string: "${e}"`);const r=wa(n[0]),i=o===3?n[1]:n[1]+" "+n[2],l=u.monthFromName(i),c=o===3?n[2]:n[3];let d=wa(c);return d<1e3&&(d+=a),new u(r,l,d)}}function qr(t){switch(t){case"d":return Ta;case"w":return Ca;case"M":return En;case"y":return Ma}const e=String(t||"").toLowerCase().replace(/s$/,"");switch(e){case Ta:case Ca:case En:case Ma:return e}throw new TypeError(`Invalid units '${t}'`)}function Jr(t){switch(t){case"en":case"s":case"a":case"ashkenazi":return" of"}const e=P.lookupTranslation("of",t);return e?" "+e:t.startsWith("ashkenazi")?" of":""}function Gr(t,e){return t.mm=u.monthNum(e),Ne(t),t}function Zr(t,e){return t.dd=e,Ne(t),t}function Ne(t){io(t),Wr(t)}function Wr(t){t.dd<1&&(t.mm===V.TISHREI&&(t.yy-=1),t.dd+=Ie(t.mm,t.yy),t.mm-=1,Ne(t)),t.dd>Ie(t.mm,t.yy)&&(t.mm===V.ELUL&&(t.yy+=1),t.dd-=Ie(t.mm,t.yy),t.mm===Oe(t.yy)?t.mm=1:t.mm+=1,Ne(t)),io(t)}function io(t){t.mm===V.ADAR_II&&!t.isLeapYear()?(t.mm-=1,Ne(t)):t.mm<1?(t.mm+=Oe(t.yy),t.yy-=1,Ne(t)):t.mm>Oe(t.yy)&&(t.mm-=Oe(t.yy),t.yy+=1,Ne(t)),delete t.rd}function nt(t,e,a){return new u(u.dayOnOrBefore(t,e.abs()+a))}/*! @hebcal/leyning v9.0.2 */const Qr=[0,31,25,24,26,32,22,24,22,29,32,32,20,18,24,21,16,27,33,38,18,34,24,20,67,34,35,46,22,35,43,54,33,20,31,29,43,36,30,23,23,57,38,34,34,28,34,31,22,33,26],Xr=[0,22,25,22,31,23,30,29,28,35,29,10,51,22,31,27,36,16,27,25,26,37,30,33,18,40,37,21,43,46,38,18,35,23,35,35,38,29,31,43,38],es=[0,17,16,17,35,26,23,38,36,24,20,47,8,59,57,33,34,16,30,37,27,24,33,44,23,55,46,34],ts=[0,54,34,51,49,31,27,89,26,23,36,35,16,33,45,41,35,28,32,22,29,35,41,30,25,19,65,23,31,39,17,54,42,56,29,34,13],as=[0,46,37,29,49,30,25,26,20,29,22,32,31,19,29,23,22,20,22,21,20,23,29,26,22,19,19,26,69,28,20,30,52,29,12],ns=[0,18,24,17,24,15,27,26,35,27,43,23,24,33,15,63,10,18,28,51,9,45,34,16,33],os=[0,36,23,31,24,31,40,25,35,57,18,40,15,25,20,20,31,13,31,30,48,25],rs=[0,22,23,18,22],ss=[0,31,22,26,6,30,13,25,23,20,34,16,6,22,32,9,14,14,7,25,6,17,25,18,23,12,21,13,29,24,33,9,20,24,17,10,22,38,22,8,31,29,25,28,28,25,13,15,22,26,11,23,15,12,17,13,12,21,14,21,22,11,12,19,11,25,24],is=[0,19,37,25,31,31,30,34,23,25,25,23,17,27,22,21,21,27,23,15,18,14,30,40,10,38,24,22,17,32,24,40,44,26,22,19,32,21,28,18,16,18,22,13,30,5,28,7,47,39,46,64,34],ls=[0,22,22,66,22,22],cs=[0,22,35,38,37,9,72],ds=[0,22,23,15,17,14,14,10,17,32,3],hs=[0,18,26,22,17,19,12,29,17,18,20,10,14],us=[0,28,10,27,17,17,14,27,18,11,22,25,28,23,23,8,63,24,32,14,44,37,31,49,27,17,21,36,26,21,26,18,32,33,31,15,38,28,23,29,49,26,20,27,31,25,24,23,35],ps=[0,21,49,100,34,30,29,28,27,27,21,45,13,64,42],ms=[0,9,25,5,19,15,11,16,14,17,15,11,15,15,10],fs=[0,20,27,5,21],bs=[0,15,16,15,13,27,14,17,14,15],gs=[0,21],ks=[0,16,11,10,11],_s=[0,16,13,12,14,14,16,20],ys=[0,14,14,19],Es=[0,17,20,19],vs=[0,18,15,20],xs=[0,15,23],As=[0,17,17,10,14,11,15,14,23,17,12,17,14,9,21],Is=[0,14,17,24];var ws={Genesis:Qr,Exodus:Xr,Leviticus:es,Numbers:ts,Deuteronomy:as,Joshua:ns,Judges:os,Ruth:rs,"I Samuel":[0,28,36,21,22,12,21,17,22,27,27,15,25,23,52,35,23,58,30,24,42,16,23,28,23,43,25,12,25,11,31,13],"II Samuel":[0,27,32,39,12,25,23,29,18,13,19,27,31,39,33,37,23,29,32,44,26,22,51,39,25],"I Kings":[0,53,46,28,20,32,38,51,66,28,29,43,33,34,31,34,34,24,46,21,43,29,54],"II Kings":[0,18,25,27,44,27,33,20,29,37,36,20,22,25,29,38,20,41,37,37,21,26,20,37,20,30],Isaiah:ss,Jeremiah:is,Lamentations:ls,Baruch:cs,Esther:ds,Ecclesiastes:hs,"Song of Songs":[0,17,17,11,16,16,12,14,14],Ezekiel:us,Daniel:ps,Hosea:ms,Joel:fs,Amos:bs,Obadiah:gs,Jonah:ks,Micah:_s,Nachum:ys,Habakkuk:Es,Zephaniah:vs,Haggai:xs,Zechariah:As,Malachi:Is};/*! @hebcal/leyning v9.0.2 */const Ft=["","Genesis","Exodus","Leviticus","Numbers","Deuteronomy"],lo=ws;function ft(t){if(typeof t=="string")return t;if(!Array.isArray(t)||t.length===0||t.length>2)throw new TypeError(`Bad parsha argument: ${t}`);let e=t[0];return t.length===2&&(e+="-"+t[1]),e}function Le(t){if(t.v)return t.v;const e=t.b.split(":"),a=t.e.split(":"),n=parseInt(e[0],10),o=parseInt(a[0],10),r=parseInt(e[1],10),i=parseInt(a[1],10);if(n===o)t.v=i-r+1;else if(typeof t.k=="string"){const l=lo[t.k];if(typeof l!="object"||!l.length)throw new ReferenceError(`Can't find numverses for ${t.k}`);let c=l[n]-r+1;for(let d=n+1;d<o;d++)c+=l[d];c+=i,t.v=c}return t.v}function vn(t,e){const a=t.b,n=t.e,o=e?t.k+" ":"";if(a===n)return`${o}${a}`;const r=a.split(":"),i=n.split(":"),l=r[0]===i[0]?i[1]:n;return`${o}${a}-${l}`}const co={torah:Ft},Ss=Object.fromEntries(Object.entries(co).flatMap(([t,e])=>e.map((a,n)=>[a,{scroll:t,b:n}])));function oa(t,e){return{start:a(t.b),end:a(t.e),index:e};function a(n){const[o,r]=n.split(":");return{...Ss[t.k]??{scroll:t.k.toLowerCase(),b:1},c:parseInt(o),v:parseInt(r)}}}function Ts(t,e){const a={b:`${t.c}:${t.v}`,e:`${e.c}:${e.v}`,k:Cs(t)};return Le(a)-1}function Cs(t){var e;return((e=co[t.scroll])==null?void 0:e[t.b])??an(t.scroll)}function an(t){return t.charAt(0).toUpperCase()+t.slice(1).replace(/songs/,"Songs")}function Ms(t){return t==="M"?"Maftir":parseInt(t)}function Ls(t,e){return t.end.b!==e.start.b?!1:t.end.c===e.start.c?!0:t.end.c>e.start.c?!1:Ts(t.end,e.start)<50}function pt(t,e){return Array.isArray(e)?e.some(a=>pt(t,a)):Ds(t)?t.aliyot.some(a=>pt(a,e)):La(t.start,e)<=0&&La(t.end,e)>=0}function La(t,e){return t.b!=e.b?ra(t.b,e.b):t.c!=e.c?ra(t.c,e.c):ra(t.v,e.v)}function ra(t,e){return t===e?0:t<e?-1:1}function Ds(t){return"aliyot"in t}function ho(t){const a=t.getTimezoneOffset()*60*1e3;return new Date(+t-a).toISOString().substring(0,10)}function uo(t){const e=new Date(t),n=e.getTimezoneOffset()*60*1e3;return new Date(+e+n)}function Ze(t){return t[t.length-1]}function Rs(t,e){for(let a=t.length-1;a>=0;a--)if(e(t[a]))return a;return-1}function po(t){return Object.fromEntries(Object.entries(t).map(([e,a])=>[a,e]))}function Hs(t,e){return Array.from({length:e-t+1},(a,n)=>t+n)}function nn(t,e,a){return t.length!==e.length?!1:t.every((n,o)=>a(n,e[o]))}class Ps{constructor(){this.previousEndIndex=-1}getLabelsForLine(e,a){if(e&&e!==this.previousRun&&(this.previousEndIndex=-1),!a.length)return[];if(!e&&this.previousEndIndex<0)return[];const n=[];for(const o of a){const r=(e==null?void 0:e.aliyot.filter(i=>i.index&&An(i.start,o)))??[];if(n.push(...r.map(i=>Vt(i.index,e)).filter(i=>i)),this.previousEndIndex>=0){const i=`סוף ${Vt(this.previousRun.aliyot[this.previousEndIndex].index,this.previousRun,{isEnd:!0})}`;r.length?e&&!r.includes(e==null?void 0:e.aliyot[this.previousEndIndex+1])&&n.push(i):n.push(i)}this.previousEndIndex=e?Rs(e.aliyot,i=>An(i.end,o)):-1}return this.previousRun=e,n}}const xn=["ראשון","שני","שלישי","רביעי","חמישי","ששי","שביעי"];function Vt(t,e,{isEnd:a}={}){if(!t)return"";if(t==="Maftir")return"מפטיר";if(t<1||t>xn.length)return"";if(!a&&t===1)return e.leining.date.title.he;if(e.leining.date.title.he==="שמחת תורה"){if(t===6)return"חתן תורה";if(t===7)return"חתן בראשית"}return xn[t-1]}function An(t,e){return La(t,e)===0}async function Os(t){let e;return e=await Zn(Object.assign({"./data/tables-of-contents/esther.json":()=>s(()=>import("./esther-BwxxWpVi.js"),[]),"./data/tables-of-contents/torah.json":()=>s(()=>import("./torah-CP5g1UIz.js"),[])}),`./data/tables-of-contents/${t}.json`,4),new Ns(t,e.default)}class Ns{constructor(e,a){this.scroll=e,this.toc=a}getPageCount(){const e=Math.max(...Object.keys(this.toc).map(Number)),a=Math.max(...Object.keys(this.toc[e]).map(Number)),n=Math.max(...Object.keys(this.toc[e][a]).map(Number));return this.toc[e][a][n].p}physicalLocationFromRef({b:e,c:a,v:n,scroll:o}){if(o!==this.scroll)throw new Error(`Cannot read scroll ${o} from resolver for ${this.scroll}`);if(!this.toc[e])throw new Error(`Unknown book ${o} #${e}`);const{p:r,l:i}=this.toc[e][a][n];return{pageNumber:r,lineNumber:i}}}class we{constructor(e,a,n){this.generator=e,this.relevantRuns=a,this.resolver=Os(n.scroll);const o=this.loadAndConsumeScroll(n);this.currentContentIndex=o.then(({currentIndex:r})=>r),this.startingLocation=o.then(({location:r})=>r)}async loadAndConsumeScroll(e){const a=await this.resolver,{pageNumber:n,lineNumber:o}=await a.physicalLocationFromRef(e),r=await this.contentIndexFromPageNumber(n),i=await this.fetchPage(r);if(!i)throw new Error(`First page ${r} must exist`);return{location:{page:i,lineNumber:o},currentIndex:Lr.new({startingAt:r})}}static forId(e,a){const n=e.parseId(a);return n?n.type===B.Megillah?new jt(e,n):n.leining.isParsha&&n.type===B.Main?new jt(e,n):new Vs(e,n):null}static forDate(e,a){const n=e.aroundDate(a);a=uo(ho(a));const o=n.find(r=>r.date>=a)??Ze(n);return we.forId(e,o.leinings[0].runs[0].id)}static forRef(e,a){let n;a.scroll==="torah"?n=mo(e,new Date):n=e.forEntireChumash(new u(new Date)).flatMap(r=>r.leinings).flatMap(r=>r.runs);const o=n.find(r=>r.scroll===a.scroll&&pt(r,a))??n[0];return we.forId(e,o.id)}async fetchPreviousPage(){return this.fetchPage((await this.currentContentIndex).previous())}async fetchNextPage(){return this.fetchPage((await this.currentContentIndex).next())}async fetchPage(e){const a=await this.pageNumberFromContentIndex(e);if(typeof a=="object")return a;if(!a||a<=0)return null;let n;n=await Zn(Object.assign({"../data/pages/esther/1.json":()=>s(()=>import("./1-ChF497LR.js"),[]),"../data/pages/esther/10.json":()=>s(()=>import("./10-BXZI3M59.js"),[]),"../data/pages/esther/11.json":()=>s(()=>import("./11-CT5xaqaw.js"),[]),"../data/pages/esther/12.json":()=>s(()=>import("./12-C6Ksn_ca.js"),[]),"../data/pages/esther/13.json":()=>s(()=>import("./13-acj9rIf3.js"),[]),"../data/pages/esther/14.json":()=>s(()=>import("./14-Dpo2cJyW.js"),[]),"../data/pages/esther/15.json":()=>s(()=>import("./15-Dh-Yps9G.js"),[]),"../data/pages/esther/16.json":()=>s(()=>import("./16-C8HwkGc5.js"),[]),"../data/pages/esther/17.json":()=>s(()=>import("./17-K6fnWhzg.js"),[]),"../data/pages/esther/2.json":()=>s(()=>import("./2-jkebxOJh.js"),[]),"../data/pages/esther/3.json":()=>s(()=>import("./3-CcaZZmnh.js"),[]),"../data/pages/esther/4.json":()=>s(()=>import("./4-ChF3Wblp.js"),[]),"../data/pages/esther/5.json":()=>s(()=>import("./5-CMUq19eg.js"),[]),"../data/pages/esther/6.json":()=>s(()=>import("./6-IY7OrdLx.js"),[]),"../data/pages/esther/7.json":()=>s(()=>import("./7-Bx9sMKQD.js"),[]),"../data/pages/esther/8.json":()=>s(()=>import("./8-CjfNSYIw.js"),[]),"../data/pages/esther/9.json":()=>s(()=>import("./9-CKYUCkMS.js"),[]),"../data/pages/torah/1.json":()=>s(()=>import("./1-CHwJOncC.js"),[]),"../data/pages/torah/10.json":()=>s(()=>import("./10-md31fddn.js"),[]),"../data/pages/torah/100.json":()=>s(()=>import("./100-BaEejMsf.js"),[]),"../data/pages/torah/101.json":()=>s(()=>import("./101-DdW6eApk.js"),[]),"../data/pages/torah/102.json":()=>s(()=>import("./102-b8cByWeS.js"),[]),"../data/pages/torah/103.json":()=>s(()=>import("./103-3VDuGSzk.js"),[]),"../data/pages/torah/104.json":()=>s(()=>import("./104-DAE3eoUB.js"),[]),"../data/pages/torah/105.json":()=>s(()=>import("./105-BO9_oq-a.js"),[]),"../data/pages/torah/106.json":()=>s(()=>import("./106-DEQITdEZ.js"),[]),"../data/pages/torah/107.json":()=>s(()=>import("./107-BoY26PML.js"),[]),"../data/pages/torah/108.json":()=>s(()=>import("./108-pluxbCv9.js"),[]),"../data/pages/torah/109.json":()=>s(()=>import("./109-_MU-4swK.js"),[]),"../data/pages/torah/11.json":()=>s(()=>import("./11-DPcAhz4I.js"),[]),"../data/pages/torah/110.json":()=>s(()=>import("./110-CJDcUKKH.js"),[]),"../data/pages/torah/111.json":()=>s(()=>import("./111-DN77-GZj.js"),[]),"../data/pages/torah/112.json":()=>s(()=>import("./112-Cf3bu_7B.js"),[]),"../data/pages/torah/113.json":()=>s(()=>import("./113-ZevKACaL.js"),[]),"../data/pages/torah/114.json":()=>s(()=>import("./114-3IrlrDD6.js"),[]),"../data/pages/torah/115.json":()=>s(()=>import("./115-oFQrYlCj.js"),[]),"../data/pages/torah/116.json":()=>s(()=>import("./116-BC2mCD0J.js"),[]),"../data/pages/torah/117.json":()=>s(()=>import("./117-CL-X3jx6.js"),[]),"../data/pages/torah/118.json":()=>s(()=>import("./118-8w1uN-Fw.js"),[]),"../data/pages/torah/119.json":()=>s(()=>import("./119-ClP7iBpw.js"),[]),"../data/pages/torah/12.json":()=>s(()=>import("./12-B_thsMF7.js"),[]),"../data/pages/torah/120.json":()=>s(()=>import("./120-Bhvk2u67.js"),[]),"../data/pages/torah/121.json":()=>s(()=>import("./121-CPERH51e.js"),[]),"../data/pages/torah/122.json":()=>s(()=>import("./122-DUFIodPR.js"),[]),"../data/pages/torah/123.json":()=>s(()=>import("./123-CujKC9r9.js"),[]),"../data/pages/torah/124.json":()=>s(()=>import("./124-CB6B-tMH.js"),[]),"../data/pages/torah/125.json":()=>s(()=>import("./125-CUzq_tGY.js"),[]),"../data/pages/torah/126.json":()=>s(()=>import("./126-D5IxOjmk.js"),[]),"../data/pages/torah/127.json":()=>s(()=>import("./127-EiRKM_he.js"),[]),"../data/pages/torah/128.json":()=>s(()=>import("./128-cxeMaYiB.js"),[]),"../data/pages/torah/129.json":()=>s(()=>import("./129-DihyG6f0.js"),[]),"../data/pages/torah/13.json":()=>s(()=>import("./13-BRIstlRW.js"),[]),"../data/pages/torah/130.json":()=>s(()=>import("./130-DzC0U9jd.js"),[]),"../data/pages/torah/131.json":()=>s(()=>import("./131-BbNNAd3T.js"),[]),"../data/pages/torah/132.json":()=>s(()=>import("./132-CMy0puvQ.js"),[]),"../data/pages/torah/133.json":()=>s(()=>import("./133-CEXbetpG.js"),[]),"../data/pages/torah/134.json":()=>s(()=>import("./134-CB_trZTx.js"),[]),"../data/pages/torah/135.json":()=>s(()=>import("./135-BgT9NH4q.js"),[]),"../data/pages/torah/136.json":()=>s(()=>import("./136-Dy64hsM3.js"),[]),"../data/pages/torah/137.json":()=>s(()=>import("./137-Dco63Rl3.js"),[]),"../data/pages/torah/138.json":()=>s(()=>import("./138-DEzTMss1.js"),[]),"../data/pages/torah/139.json":()=>s(()=>import("./139-p96OgkkM.js"),[]),"../data/pages/torah/14.json":()=>s(()=>import("./14-BE9ES_k3.js"),[]),"../data/pages/torah/140.json":()=>s(()=>import("./140-BOogXNpR.js"),[]),"../data/pages/torah/141.json":()=>s(()=>import("./141-CMz_5NoQ.js"),[]),"../data/pages/torah/142.json":()=>s(()=>import("./142-1LvQYCZd.js"),[]),"../data/pages/torah/143.json":()=>s(()=>import("./143-DUezscZ3.js"),[]),"../data/pages/torah/144.json":()=>s(()=>import("./144-_V-sSdFc.js"),[]),"../data/pages/torah/145.json":()=>s(()=>import("./145-Dt1Ad1aT.js"),[]),"../data/pages/torah/146.json":()=>s(()=>import("./146-k-GyIYRE.js"),[]),"../data/pages/torah/147.json":()=>s(()=>import("./147-nkR3x40B.js"),[]),"../data/pages/torah/148.json":()=>s(()=>import("./148-CS-zvCEA.js"),[]),"../data/pages/torah/149.json":()=>s(()=>import("./149-Cbo8CYhf.js"),[]),"../data/pages/torah/15.json":()=>s(()=>import("./15-H2tzCpEe.js"),[]),"../data/pages/torah/150.json":()=>s(()=>import("./150-BMPKcdDD.js"),[]),"../data/pages/torah/151.json":()=>s(()=>import("./151-DTwDFQfD.js"),[]),"../data/pages/torah/152.json":()=>s(()=>import("./152-6j__KjWU.js"),[]),"../data/pages/torah/153.json":()=>s(()=>import("./153-CQtzmIKC.js"),[]),"../data/pages/torah/154.json":()=>s(()=>import("./154-bVUciUAE.js"),[]),"../data/pages/torah/155.json":()=>s(()=>import("./155-D_mMhqoj.js"),[]),"../data/pages/torah/156.json":()=>s(()=>import("./156-DQxwj8yc.js"),[]),"../data/pages/torah/157.json":()=>s(()=>import("./157-Cg5G3SiA.js"),[]),"../data/pages/torah/158.json":()=>s(()=>import("./158-DEtl5GT5.js"),[]),"../data/pages/torah/159.json":()=>s(()=>import("./159-D6hHNsRJ.js"),[]),"../data/pages/torah/16.json":()=>s(()=>import("./16-nPrfgXce.js"),[]),"../data/pages/torah/160.json":()=>s(()=>import("./160-Ca8uei-y.js"),[]),"../data/pages/torah/161.json":()=>s(()=>import("./161-D8UvpBlW.js"),[]),"../data/pages/torah/162.json":()=>s(()=>import("./162-CMyP4TF0.js"),[]),"../data/pages/torah/163.json":()=>s(()=>import("./163-BjayUH8I.js"),[]),"../data/pages/torah/164.json":()=>s(()=>import("./164-B8JrVKC8.js"),[]),"../data/pages/torah/165.json":()=>s(()=>import("./165-Cj1oFSHQ.js"),[]),"../data/pages/torah/166.json":()=>s(()=>import("./166-C6NIoXMv.js"),[]),"../data/pages/torah/167.json":()=>s(()=>import("./167-C47uFUun.js"),[]),"../data/pages/torah/168.json":()=>s(()=>import("./168-D2xayJRI.js"),[]),"../data/pages/torah/169.json":()=>s(()=>import("./169-ypD1Gg_N.js"),[]),"../data/pages/torah/17.json":()=>s(()=>import("./17-BsRFusMw.js"),[]),"../data/pages/torah/170.json":()=>s(()=>import("./170-DYZnhaW6.js"),[]),"../data/pages/torah/171.json":()=>s(()=>import("./171-C1Uipm6F.js"),[]),"../data/pages/torah/172.json":()=>s(()=>import("./172-CFnDK3lf.js"),[]),"../data/pages/torah/173.json":()=>s(()=>import("./173-7hmRKIxr.js"),[]),"../data/pages/torah/174.json":()=>s(()=>import("./174-CKjL22yS.js"),[]),"../data/pages/torah/175.json":()=>s(()=>import("./175-hkSovx_Z.js"),[]),"../data/pages/torah/176.json":()=>s(()=>import("./176-BRkibE8M.js"),[]),"../data/pages/torah/177.json":()=>s(()=>import("./177-CUP9JKMQ.js"),[]),"../data/pages/torah/178.json":()=>s(()=>import("./178-iCAagg9l.js"),[]),"../data/pages/torah/179.json":()=>s(()=>import("./179-DE34dTlc.js"),[]),"../data/pages/torah/18.json":()=>s(()=>import("./18-BHUA6b_r.js"),[]),"../data/pages/torah/180.json":()=>s(()=>import("./180-Dn1G29Rw.js"),[]),"../data/pages/torah/181.json":()=>s(()=>import("./181-CZWVZcsa.js"),[]),"../data/pages/torah/182.json":()=>s(()=>import("./182-DzJGuDOU.js"),[]),"../data/pages/torah/183.json":()=>s(()=>import("./183-39wMOTuo.js"),[]),"../data/pages/torah/184.json":()=>s(()=>import("./184-tmlNS69D.js"),[]),"../data/pages/torah/185.json":()=>s(()=>import("./185-62jToQ3t.js"),[]),"../data/pages/torah/186.json":()=>s(()=>import("./186-dPFNXa6P.js"),[]),"../data/pages/torah/187.json":()=>s(()=>import("./187-Dg_QnXPm.js"),[]),"../data/pages/torah/188.json":()=>s(()=>import("./188-B504OqGV.js"),[]),"../data/pages/torah/189.json":()=>s(()=>import("./189-DTgaAva9.js"),[]),"../data/pages/torah/19.json":()=>s(()=>import("./19-DJbwb8CZ.js"),[]),"../data/pages/torah/190.json":()=>s(()=>import("./190-BdjHl_cY.js"),[]),"../data/pages/torah/191.json":()=>s(()=>import("./191-EOpiTkOZ.js"),[]),"../data/pages/torah/192.json":()=>s(()=>import("./192-C15utEXN.js"),[]),"../data/pages/torah/193.json":()=>s(()=>import("./193-bumB41s5.js"),[]),"../data/pages/torah/194.json":()=>s(()=>import("./194-Bzzm2u-H.js"),[]),"../data/pages/torah/195.json":()=>s(()=>import("./195-BsD-Wxyy.js"),[]),"../data/pages/torah/196.json":()=>s(()=>import("./196-2UyvFClo.js"),[]),"../data/pages/torah/197.json":()=>s(()=>import("./197-CxRLlZtK.js"),[]),"../data/pages/torah/198.json":()=>s(()=>import("./198-DLxf0iTF.js"),[]),"../data/pages/torah/199.json":()=>s(()=>import("./199-BZ1Ct2qs.js"),[]),"../data/pages/torah/2.json":()=>s(()=>import("./2-ANTzLkJr.js"),[]),"../data/pages/torah/20.json":()=>s(()=>import("./20-BS08neGY.js"),[]),"../data/pages/torah/200.json":()=>s(()=>import("./200-Bm6jzuQp.js"),[]),"../data/pages/torah/201.json":()=>s(()=>import("./201-B5SoSGZG.js"),[]),"../data/pages/torah/202.json":()=>s(()=>import("./202-BXRtnMf6.js"),[]),"../data/pages/torah/203.json":()=>s(()=>import("./203-BjXk6-vn.js"),[]),"../data/pages/torah/204.json":()=>s(()=>import("./204-BrwEf0nS.js"),[]),"../data/pages/torah/205.json":()=>s(()=>import("./205-mo5N5veR.js"),[]),"../data/pages/torah/206.json":()=>s(()=>import("./206-ctMyq0yy.js"),[]),"../data/pages/torah/207.json":()=>s(()=>import("./207-CzPNEIDJ.js"),[]),"../data/pages/torah/208.json":()=>s(()=>import("./208-DotaKWIF.js"),[]),"../data/pages/torah/209.json":()=>s(()=>import("./209-BkmfUegV.js"),[]),"../data/pages/torah/21.json":()=>s(()=>import("./21-CIrqi5ae.js"),[]),"../data/pages/torah/210.json":()=>s(()=>import("./210-BnvtnRXq.js"),[]),"../data/pages/torah/211.json":()=>s(()=>import("./211-DlCrlIxY.js"),[]),"../data/pages/torah/212.json":()=>s(()=>import("./212-DFl5d5Xa.js"),[]),"../data/pages/torah/213.json":()=>s(()=>import("./213-DMVx7zbv.js"),[]),"../data/pages/torah/214.json":()=>s(()=>import("./214-Bh7lGET0.js"),[]),"../data/pages/torah/215.json":()=>s(()=>import("./215-B58IdGYz.js"),[]),"../data/pages/torah/216.json":()=>s(()=>import("./216-608QIr4u.js"),[]),"../data/pages/torah/217.json":()=>s(()=>import("./217-k2s_HNk4.js"),[]),"../data/pages/torah/218.json":()=>s(()=>import("./218-BZMmNdh8.js"),[]),"../data/pages/torah/219.json":()=>s(()=>import("./219-tkLjaLCs.js"),[]),"../data/pages/torah/22.json":()=>s(()=>import("./22-B4s7Cqaj.js"),[]),"../data/pages/torah/220.json":()=>s(()=>import("./220-COVHQ89r.js"),[]),"../data/pages/torah/221.json":()=>s(()=>import("./221-B-Lfh1oq.js"),[]),"../data/pages/torah/222.json":()=>s(()=>import("./222-v0NAqeW6.js"),[]),"../data/pages/torah/223.json":()=>s(()=>import("./223-BHGJ2cjH.js"),[]),"../data/pages/torah/224.json":()=>s(()=>import("./224-Bo8BG82K.js"),[]),"../data/pages/torah/225.json":()=>s(()=>import("./225-DUP6msYg.js"),[]),"../data/pages/torah/226.json":()=>s(()=>import("./226-CRPWWYgQ.js"),[]),"../data/pages/torah/227.json":()=>s(()=>import("./227-ETGZ5WGB.js"),[]),"../data/pages/torah/228.json":()=>s(()=>import("./228-DmkyEn4_.js"),[]),"../data/pages/torah/229.json":()=>s(()=>import("./229-BN8txw3I.js"),[]),"../data/pages/torah/23.json":()=>s(()=>import("./23-BV3Q8NAI.js"),[]),"../data/pages/torah/230.json":()=>s(()=>import("./230-_Euvc4vN.js"),[]),"../data/pages/torah/231.json":()=>s(()=>import("./231-Bht-e9fa.js"),[]),"../data/pages/torah/232.json":()=>s(()=>import("./232-BGJLy5c1.js"),[]),"../data/pages/torah/233.json":()=>s(()=>import("./233-DB5jKKFh.js"),[]),"../data/pages/torah/234.json":()=>s(()=>import("./234-DDMR3o6Q.js"),[]),"../data/pages/torah/235.json":()=>s(()=>import("./235-ntK3KoZb.js"),[]),"../data/pages/torah/236.json":()=>s(()=>import("./236-Cf_nTBYW.js"),[]),"../data/pages/torah/237.json":()=>s(()=>import("./237-AwcjA28h.js"),[]),"../data/pages/torah/238.json":()=>s(()=>import("./238-BRb76zw3.js"),[]),"../data/pages/torah/239.json":()=>s(()=>import("./239-CS1Xpyz4.js"),[]),"../data/pages/torah/24.json":()=>s(()=>import("./24-CmUvUjaI.js"),[]),"../data/pages/torah/240.json":()=>s(()=>import("./240-BpK5wLe0.js"),[]),"../data/pages/torah/241.json":()=>s(()=>import("./241-B8IBmJlA.js"),[]),"../data/pages/torah/242.json":()=>s(()=>import("./242-wBRqPTZM.js"),[]),"../data/pages/torah/243.json":()=>s(()=>import("./243-2AYOOvpH.js"),[]),"../data/pages/torah/244.json":()=>s(()=>import("./244-DRxwuk3Z.js"),[]),"../data/pages/torah/245.json":()=>s(()=>import("./245-DbfM-8y2.js"),[]),"../data/pages/torah/25.json":()=>s(()=>import("./25-Cm7UHqDs.js"),[]),"../data/pages/torah/26.json":()=>s(()=>import("./26-CcY-8fSp.js"),[]),"../data/pages/torah/27.json":()=>s(()=>import("./27-B8VxPnqa.js"),[]),"../data/pages/torah/28.json":()=>s(()=>import("./28-TK6JkwlY.js"),[]),"../data/pages/torah/29.json":()=>s(()=>import("./29-CXV5ej-f.js"),[]),"../data/pages/torah/3.json":()=>s(()=>import("./3-EyjuUGC-.js"),[]),"../data/pages/torah/30.json":()=>s(()=>import("./30-COB2ygwC.js"),[]),"../data/pages/torah/31.json":()=>s(()=>import("./31-DBm6eAUO.js"),[]),"../data/pages/torah/32.json":()=>s(()=>import("./32-BxmpVBWk.js"),[]),"../data/pages/torah/33.json":()=>s(()=>import("./33-sqDSqN9r.js"),[]),"../data/pages/torah/34.json":()=>s(()=>import("./34-DtoKokFX.js"),[]),"../data/pages/torah/35.json":()=>s(()=>import("./35-drzEZi26.js"),[]),"../data/pages/torah/36.json":()=>s(()=>import("./36-Cc0I9xVg.js"),[]),"../data/pages/torah/37.json":()=>s(()=>import("./37-C2MtBCIw.js"),[]),"../data/pages/torah/38.json":()=>s(()=>import("./38-ssVSCAFc.js"),[]),"../data/pages/torah/39.json":()=>s(()=>import("./39-Bhd3SGou.js"),[]),"../data/pages/torah/4.json":()=>s(()=>import("./4-h7Y1in0h.js"),[]),"../data/pages/torah/40.json":()=>s(()=>import("./40-Dy8QvSBi.js"),[]),"../data/pages/torah/41.json":()=>s(()=>import("./41-D43NeGPU.js"),[]),"../data/pages/torah/42.json":()=>s(()=>import("./42-D3vWLobI.js"),[]),"../data/pages/torah/43.json":()=>s(()=>import("./43-Bnp3sySD.js"),[]),"../data/pages/torah/44.json":()=>s(()=>import("./44-CrUlKMY_.js"),[]),"../data/pages/torah/45.json":()=>s(()=>import("./45-DE_Pmuoa.js"),[]),"../data/pages/torah/46.json":()=>s(()=>import("./46-Da3LVtxu.js"),[]),"../data/pages/torah/47.json":()=>s(()=>import("./47-CVvMVUmJ.js"),[]),"../data/pages/torah/48.json":()=>s(()=>import("./48-DFHO5kdm.js"),[]),"../data/pages/torah/49.json":()=>s(()=>import("./49-CmcW-fDs.js"),[]),"../data/pages/torah/5.json":()=>s(()=>import("./5-Dhz2g72n.js"),[]),"../data/pages/torah/50.json":()=>s(()=>import("./50-BFEC8iuB.js"),[]),"../data/pages/torah/51.json":()=>s(()=>import("./51-CQG_-qKa.js"),[]),"../data/pages/torah/52.json":()=>s(()=>import("./52-OR6zthp-.js"),[]),"../data/pages/torah/53.json":()=>s(()=>import("./53-CtU6oOMX.js"),[]),"../data/pages/torah/54.json":()=>s(()=>import("./54-VGBasY12.js"),[]),"../data/pages/torah/55.json":()=>s(()=>import("./55-BJK4MQvG.js"),[]),"../data/pages/torah/56.json":()=>s(()=>import("./56-DKfFVyg6.js"),[]),"../data/pages/torah/57.json":()=>s(()=>import("./57-B3F2wccm.js"),[]),"../data/pages/torah/58.json":()=>s(()=>import("./58-HHu3DPED.js"),[]),"../data/pages/torah/59.json":()=>s(()=>import("./59-CStJoXzn.js"),[]),"../data/pages/torah/6.json":()=>s(()=>import("./6-Dt3X27FU.js"),[]),"../data/pages/torah/60.json":()=>s(()=>import("./60-CL8QlZff.js"),[]),"../data/pages/torah/61.json":()=>s(()=>import("./61-CWHo0Rw1.js"),[]),"../data/pages/torah/62.json":()=>s(()=>import("./62-CPe4R8_N.js"),[]),"../data/pages/torah/63.json":()=>s(()=>import("./63-ClGiOw_M.js"),[]),"../data/pages/torah/64.json":()=>s(()=>import("./64-BTLyCEt7.js"),[]),"../data/pages/torah/65.json":()=>s(()=>import("./65-DYewW-dW.js"),[]),"../data/pages/torah/66.json":()=>s(()=>import("./66-C01wVx-T.js"),[]),"../data/pages/torah/67.json":()=>s(()=>import("./67-YLKPxowa.js"),[]),"../data/pages/torah/68.json":()=>s(()=>import("./68-DXxU4pnK.js"),[]),"../data/pages/torah/69.json":()=>s(()=>import("./69-BTQeLhdl.js"),[]),"../data/pages/torah/7.json":()=>s(()=>import("./7-BYu8nEb0.js"),[]),"../data/pages/torah/70.json":()=>s(()=>import("./70-_Zp4Qo3M.js"),[]),"../data/pages/torah/71.json":()=>s(()=>import("./71-CPL0pf-3.js"),[]),"../data/pages/torah/72.json":()=>s(()=>import("./72-CPAzIIj_.js"),[]),"../data/pages/torah/73.json":()=>s(()=>import("./73-oljHEEuk.js"),[]),"../data/pages/torah/74.json":()=>s(()=>import("./74-BCH51fn4.js"),[]),"../data/pages/torah/75.json":()=>s(()=>import("./75-BMTIUvk8.js"),[]),"../data/pages/torah/76.json":()=>s(()=>import("./76-CeRoNfUW.js"),[]),"../data/pages/torah/77.json":()=>s(()=>import("./77-BKgXamlf.js"),[]),"../data/pages/torah/78.json":()=>s(()=>import("./78-zfeoLzqF.js"),[]),"../data/pages/torah/79.json":()=>s(()=>import("./79-BjmgJqz2.js"),[]),"../data/pages/torah/8.json":()=>s(()=>import("./8-CCckaV8y.js"),[]),"../data/pages/torah/80.json":()=>s(()=>import("./80-DmmPaTIJ.js"),[]),"../data/pages/torah/81.json":()=>s(()=>import("./81-DtaDpWwx.js"),[]),"../data/pages/torah/82.json":()=>s(()=>import("./82-BFhRxiMG.js"),[]),"../data/pages/torah/83.json":()=>s(()=>import("./83-DXe7fj15.js"),[]),"../data/pages/torah/84.json":()=>s(()=>import("./84-Cddd9zOV.js"),[]),"../data/pages/torah/85.json":()=>s(()=>import("./85-DJQCvR1F.js"),[]),"../data/pages/torah/86.json":()=>s(()=>import("./86-ClkjKcPd.js"),[]),"../data/pages/torah/87.json":()=>s(()=>import("./87-CoEhMRQY.js"),[]),"../data/pages/torah/88.json":()=>s(()=>import("./88-BXG3WMLw.js"),[]),"../data/pages/torah/89.json":()=>s(()=>import("./89-nys7RoD-.js"),[]),"../data/pages/torah/9.json":()=>s(()=>import("./9-CpDeEprm.js"),[]),"../data/pages/torah/90.json":()=>s(()=>import("./90-DduA32QV.js"),[]),"../data/pages/torah/91.json":()=>s(()=>import("./91-BN-TmmS5.js"),[]),"../data/pages/torah/92.json":()=>s(()=>import("./92-BYJejP5e.js"),[]),"../data/pages/torah/93.json":()=>s(()=>import("./93-BDsAnP_C.js"),[]),"../data/pages/torah/94.json":()=>s(()=>import("./94-xQK_bYUU.js"),[]),"../data/pages/torah/95.json":()=>s(()=>import("./95-D61aOJba.js"),[]),"../data/pages/torah/96.json":()=>s(()=>import("./96-BK_Uc1Dn.js"),[]),"../data/pages/torah/97.json":()=>s(()=>import("./97-Bn0sHu1m.js"),[]),"../data/pages/torah/98.json":()=>s(()=>import("./98-DnVECpKr.js"),[]),"../data/pages/torah/99.json":()=>s(()=>import("./99-M_aO2jOV.js"),[])}),`../data/pages/${this.relevantRuns[0].scroll}/${a}.json`,5);let o,r=[];const i=new Ps;return{type:"page",lines:n.default.map(c=>{const d=c.verses.map(js);return d.length&&([o,r]=this.findContainingAliyot(d,o)),{...c,verses:d,run:o,aliyot:r,labels:i.getLabelsForLine(o,d)}})}}findContainingAliyot(e,a){if(a){const n=a.aliyot.filter(o=>pt(o,e));if(n.length)return[a,n]}for(const n of this.relevantRuns){const o=n.aliyot.filter(r=>pt(r,e));if(o.length)return[n,o]}return[void 0,[]]}}class jt extends we{constructor(e,a){super(e,jt.calculateRuns(e,a),a.aliyot[0].start),this.pageCount=this.resolver.then(n=>n.getPageCount())}async pageNumberFromContentIndex(e){return e+1>await this.pageCount?-1:e+1}async contentIndexFromPageNumber(e){return e-1}static calculateRuns(e,a){return a.scroll!=="torah"?[a]:mo(e,a.leining.date.date)}}function mo(t,e){return t.forEntireChumash(new u(e)).flatMap(a=>a.leinings).filter(a=>a.isParsha||a.runs.some(fo)).map(a=>a.runs[0])}function fo(t){var e,a;return t.leining.id===q.Shacharis&&((e=t.aliyot[0])==null?void 0:e.start.b)===5&&((a=t.aliyot[0])==null?void 0:a.start.c)===33}class Vs extends we{constructor(e,a){super(e,a.leining.runs.filter(n=>n.scroll===a.scroll),a.aliyot[0].start),this.pages=this.fetchPages()}async fetchPages(){let e=0;const a=await this.resolver;return this.relevantRuns.flatMap(n=>{const o=a.physicalLocationFromRef(n.aliyot[0].start),r=a.physicalLocationFromRef(Ze(n.aliyot).end),i=[];if(e){const l=o.pageNumber-e;i.push({type:"message",text:`✃ ${l} ${l===1?"עמוד":"עמודים"} ✁`})}return e=r.pageNumber,i.concat(Hs(o.pageNumber,r.pageNumber))})}async pageNumberFromContentIndex(e){return(await this.pages)[e]}async contentIndexFromPageNumber(e){return(await this.pages).indexOf(e)}}function js(t){return{b:t.book,c:t.chapter,v:t.verse}}/*! @hebcal/core v5.8.2 */var bo={headers:{"plural-forms":"nplurals=2; plural=(n > 1);"},contexts:{"":{Shabbat:["Shabbos"],"Achrei Mot":["Achrei Mos"],Bechukotai:["Bechukosai"],"Beha'alotcha":["Beha’aloscha"],Bereshit:["Bereshis"],Chukat:["Chukas"],"Erev Shavuot":["Erev Shavuos"],"Erev Sukkot":["Erev Sukkos"],"Ki Tavo":["Ki Savo"],"Ki Teitzei":["Ki Seitzei"],"Ki Tisa":["Ki Sisa"],Matot:["Matos"],"Purim Katan":["Purim Koton"],"Shabbat Chazon":["Shabbos Chazon"],"Shabbat HaChodesh":["Shabbos HaChodesh"],"Shabbat HaGadol":["Shabbos HaGadol"],"Shabbat Nachamu":["Shabbos Nachamu"],"Shabbat Parah":["Shabbos Parah"],"Shabbat Shekalim":["Shabbos Shekalim"],"Shabbat Shuva":["Shabbos Shuvah"],"Shabbat Zachor":["Shabbos Zachor"],Shavuot:["Shavuos"],"Shavuot I":["Shavuos I"],"Shavuot II":["Shavuos II"],Shemot:["Shemos"],"Shmini Atzeret":["Shmini Atzeres"],"Simchat Torah":["Simchas Torah"],Sukkot:["Sukkos"],"Sukkot I":["Sukkos I"],"Sukkot II":["Sukkos II"],"Sukkot II (CH''M)":["Sukkos II (CH’’M)"],"Sukkot III (CH''M)":["Sukkos III (CH’’M)"],"Sukkot IV (CH''M)":["Sukkos IV (CH’’M)"],"Sukkot V (CH''M)":["Sukkos V (CH’’M)"],"Sukkot VI (CH''M)":["Sukkos VI (CH’’M)"],"Sukkot VII (Hoshana Raba)":["Sukkos VII (Hoshana Raba)"],"Ta'anit Bechorot":["Ta’anis Bechoros"],"Ta'anit Esther":["Ta’anis Esther"],Toldot:["Toldos"],Vaetchanan:["Vaeschanan"],Yitro:["Yisro"],"Vezot Haberakhah":["Vezos Haberakhah"],Parashat:["Parshas"],"Leil Selichot":["Leil Selichos"],"Shabbat Mevarchim Chodesh":["Shabbos Mevorchim Chodesh"],"Shabbat Shirah":["Shabbos Shirah"],"Asara B'Tevet":["Asara B’Teves"],"Alot HaShachar":["Alos HaShachar"],"Kriat Shema, sof zeman":["Krias Shema, sof zman"],"Tefilah, sof zeman":["Tefilah, sof zman"],"Kriat Shema, sof zeman (MGA)":["Krias Shema, sof zman (MGA)"],"Tefilah, sof zeman (MGA)":["Tefilah, sof zman (MGA)"],"Chatzot HaLailah":["Chatzos HaLailah"],"Chatzot hayom":["Chatzos"],"Tzeit HaKochavim":["Tzeis HaKochavim"],"Birkat Hachamah":["Birkas Hachamah"],"Shushan Purim Katan":["Shushan Purim Koton"]}}};/*! @hebcal/core v5.8.2 */var Ut={headers:{"plural-forms":"nplurals=2; plural=(n > 1);"},contexts:{"":{Shabbat:["שַׁבָּת"],"Daf Yomi":["דַף יוֹמִי"],Parashat:["פָּרָשַׁת"],"Achrei Mot":["אַחֲרֵי מוֹת"],Balak:["בָּלָק"],Bamidbar:["בְּמִדְבַּר"],Bechukotai:["בְּחֻקֹּתַי"],"Beha'alotcha":["בְּהַעֲלֹתְךָ"],Behar:["בְּהַר"],Bereshit:["בְּרֵאשִׁית"],Beshalach:["בְּשַׁלַּח"],Bo:["בֹּא"],"Chayei Sara":["חַיֵּי שָֹרָה"],Chukat:["חֻקַּת"],Devarim:["דְּבָרִים"],Eikev:["עֵקֶב"],Emor:["אֱמוֹר"],"Ha'azinu":["הַאֲזִינוּ"],Kedoshim:["קְדשִׁים"],"Ki Tavo":["כִּי־תָבוֹא"],"Ki Teitzei":["כִּי־תֵצֵא"],"Ki Tisa":["כִּי תִשָּׂא"],Korach:["קוֹרַח"],"Lech-Lecha":["לֶךְ־לְךָ"],Masei:["מַסְעֵי"],Matot:["מַּטּוֹת"],Metzora:["מְּצֹרָע"],Miketz:["מִקֵּץ"],Mishpatim:["מִּשְׁפָּטִים"],Nasso:["נָשׂא"],Nitzavim:["נִצָּבִים"],Noach:["נֹחַ"],Pekudei:["פְקוּדֵי"],Pinchas:["פִּינְחָס"],"Re'eh":["רְאֵה"],"Sh'lach":["שְׁלַח־לְךָ"],Shemot:["שְׁמוֹת"],Shmini:["שְּׁמִינִי"],Shoftim:["שׁוֹפְטִים"],Tazria:["תַזְרִיעַ"],Terumah:["תְּרוּמָה"],Tetzaveh:["תְּצַוֶּה"],Toldot:["תּוֹלְדוֹת"],Tzav:["צַו"],Vaera:["וָאֵרָא"],Vaetchanan:["וָאֶתְחַנַּן"],Vayakhel:["וַיַּקְהֵל"],Vayechi:["וַיְחִי"],Vayeilech:["וַיֵּלֶךְ"],Vayera:["וַיֵּרָא"],Vayeshev:["וַיֵּשֶׁב"],Vayetzei:["וַיֵּצֵא"],Vayigash:["וַיִּגַּשׁ"],Vayikra:["וַיִּקְרָא"],Vayishlach:["וַיִּשְׁלַח"],"Vezot Haberakhah":["וְזֹאת הַבְּרָכָה"],Yitro:["יִתְרוֹ"],"Asara B'Tevet":["עֲשָׂרָה בְּטֵבֵת"],"Candle lighting":["הַדְלָקַת נֵרוֹת"],Chanukah:["חֲנוּכָּה"],"Chanukah: 1 Candle":["חֲנוּכָּה: א׳ נֵר"],"Chanukah: 2 Candles":["חֲנוּכָּה: ב׳ נֵרוֹת"],"Chanukah: 3 Candles":["חֲנוּכָּה: ג׳ נֵרוֹת"],"Chanukah: 4 Candles":["חֲנוּכָּה: ד׳ נֵרוֹת"],"Chanukah: 5 Candles":["חֲנוּכָּה: ה׳ נֵרוֹת"],"Chanukah: 6 Candles":["חֲנוּכָּה: ו׳ נֵרוֹת"],"Chanukah: 7 Candles":["חֲנוּכָּה: ז׳ נֵרוֹת"],"Chanukah: 8 Candles":["חֲנוּכָּה: ח׳ נֵרוֹת"],"Chanukah: 8th Day":["חֲנוּכָּה: יוֹם ח׳"],"Days of the Omer":["סְפִירַת הָעוֹמֶר"],Omer:["עוֹמֶר"],"day of the Omer":["בָּעוֹמֶר"],"Erev Pesach":["עֶרֶב פֶּסַח"],"Erev Purim":["עֶרֶב פּוּרִים"],"Erev Rosh Hashana":["עֶרֶב רֹאשׁ הַשָּׁנָה"],"Erev Shavuot":["עֶרֶב שָׁבוּעוֹת"],"Erev Simchat Torah":["עֶרֶב שִׂמְחַת תּוֹרָה"],"Erev Sukkot":["עֶרֶב סוּכּוֹת"],"Erev Tish'a B'Av":["עֶרֶב תִּשְׁעָה בְּאָב"],"Erev Yom Kippur":["עֶרֶב יוֹם כִּפּוּר"],Havdalah:["הַבְדָּלָה"],"Lag BaOmer":["ל״ג בָּעוֹמֶר"],"Leil Selichot":["סליחות"],Pesach:["פֶּסַח"],"Pesach I":["פֶּסַח א׳"],"Pesach II":["פֶּסַח ב׳"],"Pesach II (CH''M)":["פֶּסַח ב׳ (חוה״מ)"],"Pesach III (CH''M)":["פֶּסַח ג׳ (חוה״מ)"],"Pesach IV (CH''M)":["פֶּסַח ד׳ (חוה״מ)"],"Pesach Sheni":["פֶּסַח שני"],"Pesach V (CH''M)":["פֶּסַח ה׳ (חוה״מ)"],"Pesach VI (CH''M)":["פֶּסַח ו׳ (חוה״מ)"],"Pesach VII":["פֶּסַח ז׳"],"Pesach VIII":["פֶּסַח ח׳"],Purim:["פּוּרִים"],"Purim Katan":["פּוּרִים קָטָן"],"Rosh Chodesh %s":["רֹאשׁ חוֹדֶשׁ %s"],"Rosh Chodesh":["רֹאשׁ חוֹדֶשׁ"],"Rosh Hashana":["רֹאשׁ הַשָּׁנָה"],"Rosh Hashana I":["רֹאשׁ הַשָּׁנָה א׳"],"Rosh Hashana II":["רֹאשׁ הַשָּׁנָה ב׳"],"Shabbat Chazon":["שַׁבָּת חֲזוֹן"],"Shabbat HaChodesh":["שַׁבָּת הַחֹדֶשׁ"],"Shabbat HaGadol":["שַׁבָּת הַגָּדוֹל"],"Shabbat Nachamu":["שַׁבָּת נַחֲמוּ"],"Shabbat Parah":["שַׁבָּת פּרה"],"Shabbat Shekalim":["שַׁבָּת שְׁקָלִים"],"Shabbat Shuva":["שַׁבָּת שׁוּבָה"],"Shabbat Zachor":["שַׁבָּת זָכוֹר"],Shavuot:["שָׁבוּעוֹת"],"Shavuot I":["שָׁבוּעוֹת א׳"],"Shavuot II":["שָׁבוּעוֹת ב׳"],"Shmini Atzeret":["שְׁמִינִי עֲצֶרֶת"],"Shushan Purim":["שׁוּשָׁן פּוּרִים"],Sigd:["סיגד"],"Simchat Torah":["שִׂמְחַת תּוֹרָה"],Sukkot:["סוּכּוֹת"],"Sukkot I":["סוּכּוֹת א׳"],"Sukkot II":["סוּכּוֹת ב׳"],"Sukkot II (CH''M)":["סוּכּוֹת ב׳ (חוה״מ)"],"Sukkot III (CH''M)":["סוּכּוֹת ג׳ (חוה״מ)"],"Sukkot IV (CH''M)":["סוּכּוֹת ד׳ (חוה״מ)"],"Sukkot V (CH''M)":["סוּכּוֹת ה׳ (חוה״מ)"],"Sukkot VI (CH''M)":["סוּכּוֹת ו׳ (חוה״מ)"],"Sukkot VII (Hoshana Raba)":["סוּכּוֹת ז׳ (הוֹשַׁעְנָא רַבָּה)"],"Ta'anit Bechorot":["תַּעֲנִית בְּכוֹרוֹת"],"Ta'anit Esther":["תַּעֲנִית אֶסְתֵּר"],"Tish'a B'Av":["תִּשְׁעָה בְּאָב"],"Tu B'Av":["טוּ בְּאָב"],"Tu BiShvat":["טוּ בִּשְׁבָט"],"Tu B'Shvat":["טוּ בִּשְׁבָט"],"Tzom Gedaliah":["צוֹם גְּדַלְיָה"],"Tzom Tammuz":["צוֹם תָּמוּז"],"Yom HaAtzma'ut":["יוֹם הָעַצְמָאוּת"],"Yom HaShoah":["יוֹם הַשּׁוֹאָה"],"Yom HaZikaron":["יוֹם הַזִּכָּרוֹן"],"Yom Kippur":["יוֹם כִּפּוּר"],"Yom Yerushalayim":["יוֹם יְרוּשָׁלַיִם"],"Yom HaAliyah":["יוֹם הַעֲלִיָּה"],"Yom HaAliyah School Observance":["שְׁמִירָת בֵּית הַסֵפֶר לְיוֹם הַעֲלִיָּה"],"Rosh Chodesh Adar":["רֹאשׁ חוֹדֶשׁ אַדָר"],"Rosh Chodesh Adar I":["רֹאשׁ חוֹדֶשׁ אַדָר א׳"],"Rosh Chodesh Adar II":["רֹאשׁ חוֹדֶשׁ אַדָר ב׳"],"Rosh Chodesh Av":["רֹאשׁ חוֹדֶשׁ אָב"],"Rosh Chodesh Cheshvan":["רֹאשׁ חוֹדֶשׁ חֶשְׁוָן"],"Rosh Chodesh Elul":["רֹאשׁ חוֹדֶשׁ אֱלוּל"],"Rosh Chodesh Iyyar":["רֹאשׁ חוֹדֶשׁ אִיָיר"],"Rosh Chodesh Kislev":["רֹאשׁ חוֹדֶשׁ כִּסְלֵו"],"Rosh Chodesh Nisan":["רֹאשׁ חוֹדֶשׁ נִיסָן"],"Rosh Chodesh Sh'vat":["רֹאשׁ חוֹדֶשׁ שְׁבָט"],"Rosh Chodesh Sivan":["רֹאשׁ חוֹדֶשׁ סִיוָן"],"Rosh Chodesh Tamuz":["רֹאשׁ חוֹדֶשׁ תָּמוּז"],"Rosh Chodesh Tevet":["רֹאשׁ חוֹדֶשׁ טֵבֵת"],min:["דַּקּוֹת"],"Fast begins":["תחילת הַצוֹם"],"Fast ends":["סִיּוּם הַצוֹם"],"Rosh Hashana LaBehemot":["רֹאשׁ הַשָּׁנָה לְמַעְשַׂר בְּהֵמָה"],"Tish'a B'Av (observed)":["תִּשְׁעָה בְּאָב נִדחֶה"],"Shabbat Mevarchim Chodesh":["שַׁבָּת מְבָרְכִים חוֹדֶשׁ"],"Shabbat Shirah":["שַׁבָּת שִׁירָה"],"Chatzot HaLailah":["חֲצוֹת הַלַיְלָה"],"Alot haShachar":["עֲלוֹת הַשַּׁחַר"],Misheyakir:["מִשֶּׁיַּכִּיר"],"Misheyakir Machmir":["מִשֶּׁיַּכִּיר מַחמִיר"],Dawn:["דִּימְדּוּמֵי בּוֹקֵר"],Sunrise:["הַנֵץ הַחַמָּה"],"Kriat Shema, sof zeman":["סוֹף זְמַן קְרִיאַת שְׁמַע גר״א"],"Tefilah, sof zeman":["סוֹף זְמַן תְּפִלָּה גר״א"],"Kriat Shema, sof zeman (MGA)":["סוֹף זְמַן קְרִיאַת שְׁמַע מג״א"],"Tefilah, sof zeman (MGA)":["סוֹף זְמַן תְּפִלָּה מג״א"],"Chatzot hayom":["חֲצוֹת הַיּוֹם"],"Mincha Gedolah":["מִנְחָה גְּדוֹלָה"],"Mincha Ketanah":["מִנְחָה קְטַנָּה"],"Plag HaMincha":["פְּלַג הַמִּנְחָה"],Dusk:["דִּימְדּוּמֵי עֶרֶב"],Sunset:["שְׁקִיעָה"],"Nightfall - End of ordained fasts":["לַיְלָה - גמר תעניות דרבנן"],"Tzeit HaKochavim":["צֵאת הַכּוֹכָבִים"],Lovingkindness:["חֶֽסֶד"],Might:["גְבוּרָה"],Beauty:["תִּפאֶרֶת"],Eternity:["נֶּֽצַח"],Splendor:["הוֹד"],Foundation:["יְּסוֹד"],Majesty:["מַּלְכוּת"],day:["יוֹם"],"Yom Kippur Katan":["יוֹם כִּפּוּר קָטָן"],Yizkor:["יִזְכּוֹר"],"Family Day":["יוֹם הַמִּשׁפָּחָה"],"Yitzhak Rabin Memorial Day":["יוֹם הַזִּכָּרוֹן ליצחק רבין"],"Jabotinsky Day":["יוֹם ז׳בוטינסקי"],"Herzl Day":["יוֹם הרצל"],"Ben-Gurion Day":["יוֹם בן־גוריון"],"Hebrew Language Day":["יוֹם הַשָׂפָה הַעִברִית"],"Birkat Hachamah":["בִרְכַּת הַחַמָּה"],"Shushan Purim Katan":["שׁוּשָׁן פּוּרִים קָטָן"],"Purim Meshulash":["פּוּרִים מְשׁוּלָּשׁ"],"after sunset":["לְאַחַר הַשְׁקִיעָה"],Yerushalmi:["יְרוּשַׁלְמִי"],"Chag HaBanot":["חַג הַבָּנוֹת"],Joshua:["יְהוֹשׁוּעַ"],Judges:["שׁוֹפְטִים"],"I Samuel":["שְׁמוּאֵל רִאשׁוֹן"],"II Samuel":["שְׁמוּאֵל שֵׁנִי"],"I Kings":["מְלָכִים רִאשׁוֹן"],"II Kings":["מְלָכִים שֵׁנִי"],Isaiah:["יְשַׁעְיָהוּ"],Jeremiah:["יִרְמְיָהוּ"],Ezekiel:["יְחֶזְקֵאל"],Hosea:["הוֹשֵׁעַ"],Joel:["יוֹאֵל"],Amos:["עָמוּס"],Obadiah:["עוֹבַדְיָה"],Jonah:["יוֹנָה"],Micah:["מִיכָה"],Nachum:["נַחוּם"],Habakkuk:["חֲבַקּוּק"],Zephaniah:["צְפַנְיָה"],Haggai:["חַגַּי"],Zechariah:["זְכַרְיָה"],Malachi:["מַלְאָכִי"],Psalms:["תְּהִלִּים"],Proverbs:["מִשְׁלֵי"],Job:["אִיּוֹב"],"Song of Songs":["שִׁיר הַשִּׁירִים"],Ruth:["רוּת"],Lamentations:["אֵיכָה"],Ecclesiastes:["קֹהֶלֶת"],Esther:["אֶסְתֵּר"],Daniel:["דָּנִיֵּאל"],Ezra:["עֶזְרָא"],Nehemiah:["נְחֶמְיָה"],"I Chronicles":["דִברֵי הַיָמִים רִאשׁוֹן"],"II Chronicles":["דִברֵי הַיָמִים שֵׁנִי"],Molad:["מוֹלָד הָלְּבָנָה"],chalakim:["חֲלָקִים"],"Pirkei Avot":["פִּרְקֵי אָבוֹת"]}}};/*! @hebcal/core v5.8.2 */P.addTranslations("he",Ut);P.addTranslations("h",Ut);P.addTranslations("ashkenazi",bo);P.addTranslations("a",bo);const $s=Ut.contexts[""],go={};for(const[t,e]of Object.entries($s))go[t]=[P.hebrewStripNikkud(e[0])];const zs={headers:Ut.headers,contexts:{"":go}};P.addTranslations("he-x-NoNikud",zs);/*! @hebcal/core v5.8.2 */function ko(t,e){const a=e??P.getLocaleName();let n=P.gettext(t[0],a);return t.length===2&&(n+=(a==="he"?"־":"-")+P.gettext(t[1],a)),n=n.replace(/'/g,"’"),(P.gettext("Parashat",e)+" "+n).normalize()}class _o extends Map{constructor(e={}){if(super(),!(e.maxSize&&e.maxSize>0))throw new TypeError("`maxSize` must be a number greater than 0");if(typeof e.maxAge=="number"&&e.maxAge===0)throw new TypeError("`maxAge` must be a number greater than 0");this.maxSize=e.maxSize,this.maxAge=e.maxAge||Number.POSITIVE_INFINITY,this.onEviction=e.onEviction,this.cache=new Map,this.oldCache=new Map,this._size=0}_emitEvictions(e){if(typeof this.onEviction=="function")for(const[a,n]of e)this.onEviction(a,n.value)}_deleteIfExpired(e,a){return typeof a.expiry=="number"&&a.expiry<=Date.now()?(typeof this.onEviction=="function"&&this.onEviction(e,a.value),this.delete(e)):!1}_getOrDeleteIfExpired(e,a){if(this._deleteIfExpired(e,a)===!1)return a.value}_getItemValue(e,a){return a.expiry?this._getOrDeleteIfExpired(e,a):a.value}_peek(e,a){const n=a.get(e);return this._getItemValue(e,n)}_set(e,a){this.cache.set(e,a),this._size++,this._size>=this.maxSize&&(this._size=0,this._emitEvictions(this.oldCache),this.oldCache=this.cache,this.cache=new Map)}_moveToRecent(e,a){this.oldCache.delete(e),this._set(e,a)}*_entriesAscending(){for(const e of this.oldCache){const[a,n]=e;this.cache.has(a)||this._deleteIfExpired(a,n)===!1&&(yield e)}for(const e of this.cache){const[a,n]=e;this._deleteIfExpired(a,n)===!1&&(yield e)}}get(e){if(this.cache.has(e)){const a=this.cache.get(e);return this._getItemValue(e,a)}if(this.oldCache.has(e)){const a=this.oldCache.get(e);if(this._deleteIfExpired(e,a)===!1)return this._moveToRecent(e,a),a.value}}set(e,a,{maxAge:n=this.maxAge}={}){const o=typeof n=="number"&&n!==Number.POSITIVE_INFINITY?Date.now()+n:void 0;return this.cache.has(e)?this.cache.set(e,{value:a,expiry:o}):this._set(e,{value:a,expiry:o}),this}has(e){return this.cache.has(e)?!this._deleteIfExpired(e,this.cache.get(e)):this.oldCache.has(e)?!this._deleteIfExpired(e,this.oldCache.get(e)):!1}peek(e){if(this.cache.has(e))return this._peek(e,this.cache);if(this.oldCache.has(e))return this._peek(e,this.oldCache)}delete(e){const a=this.cache.delete(e);return a&&this._size--,this.oldCache.delete(e)||a}clear(){this.cache.clear(),this.oldCache.clear(),this._size=0}resize(e){if(!(e&&e>0))throw new TypeError("`maxSize` must be a number greater than 0");const a=[...this._entriesAscending()],n=a.length-e;n<0?(this.cache=new Map(a),this.oldCache=new Map,this._size=a.length):(n>0&&this._emitEvictions(a.slice(0,n)),this.oldCache=new Map(a.slice(n)),this.cache=new Map,this._size=0),this.maxSize=e}*keys(){for(const[e]of this)yield e}*values(){for(const[,e]of this)yield e}*[Symbol.iterator](){for(const e of this.cache){const[a,n]=e;this._deleteIfExpired(a,n)===!1&&(yield[a,n.value])}for(const e of this.oldCache){const[a,n]=e;this.cache.has(a)||this._deleteIfExpired(a,n)===!1&&(yield[a,n.value])}}*entriesDescending(){let e=[...this.cache];for(let a=e.length-1;a>=0;--a){const n=e[a],[o,r]=n;this._deleteIfExpired(o,r)===!1&&(yield[o,r.value])}e=[...this.oldCache];for(let a=e.length-1;a>=0;--a){const n=e[a],[o,r]=n;this.cache.has(o)||this._deleteIfExpired(o,r)===!1&&(yield[o,r.value])}}*entriesAscending(){for(const[e,a]of this._entriesAscending())yield[e,a.value]}get size(){if(!this._size)return this.oldCache.size;let e=0;for(const a of this.oldCache.keys())this.cache.has(a)||e++;return Math.min(this._size+e,this.maxSize)}entries(){return this.entriesAscending()}forEach(e,a=this){for(const[n,o]of this.entriesAscending())e.call(a,o,n,this)}get[Symbol.toStringTag](){return JSON.stringify([...this.entriesAscending()])}}/*! @hebcal/core v5.8.2 */const Bs=0,Ys=1,Ks=2;function Fs(t){const e=u.longCheshvan(t),a=u.shortKislev(t);return e&&!a?Ks:!e&&a?Bs:Ys}class Us{constructor(e,a){e=+e,this.year=e;const n=new u(1,V.TISHREI,e),o=n.abs(),r=n.getDay()+1;this.firstSaturday=u.dayOnOrBefore(6,o+6);const i=+u.isLeapYear(e);this.il=!!a;const l=Fs(e);let c=`${i}${r}${l}`;if(se[c]?this.theSedraArray=se[c]:(c=c+ +this.il,this.theSedraArray=se[c]),!this.theSedraArray)throw new Error(`improper sedra year type ${c} calculated for ${e}`)}get(e){return this.lookup(e).parsha}getString(e,a){const n=this.get(e);return ko(n,a)}isParsha(e){return!this.lookup(e).chag}find(e){if(typeof e=="number"){if(e>=Ue.length||e<0&&!kt(e))throw new RangeError(`Invalid parsha number: ${e}`);return this.findInternal(e)}else if(typeof e=="string"){const a=ht.get(e);return typeof a=="number"?this.find(a):e.indexOf("-")!==-1?e===Pe||e===on?this.findInternal(e):this.find(e.split("-")):this.findInternal(e)}else if(Array.isArray(e)){const a=e.length;if(a!==1&&a!==2||typeof e[0]!="string")throw new TypeError(`Invalid parsha argument: ${JSON.stringify(e)}`);if(a===1)return this.find(e[0]);const n=e[0],o=e[1],r=ht.get(n),i=ht.get(o);if(typeof r!="number"||typeof i!="number"||i!==r+1||!kt(-r))throw new RangeError(`Unrecognized parsha name: ${n}-${o}`);return this.find(-r)}return null}findInternal(e){const a=this.theSedraArray.indexOf(e);return a===-1?null:new u(this.firstSaturday+a*7)}findContaining(e){const a=this.find(e);if(a)return a;if(typeof e=="number"){const n=-e;return kt(n)?this.find(n):this.find(n+1)}else{const n=ht.get(e);if(n){const o=-n;return kt(o)?this.find(o):this.find(o+1)}else{const[o]=e.split("-");return this.find(o)}}}getSedraArray(){return this.theSedraArray}getFirstSaturday(){return this.firstSaturday}getYear(){return this.year}lookup(e){const a=typeof e=="number"?e:u.isHDate(e)?e.abs():NaN;if(isNaN(a))throw new TypeError(`Bad date argument: ${e}`);const n=u.dayOnOrBefore(6,a+6),o=(n-this.firstSaturday)/7,r=this.theSedraArray[o];if(typeof r>"u")return We(this.year+1,this.il).lookup(n);const i=new u(n);if(typeof r=="string")return{parsha:[r],chag:!0,hdate:i};if(r>=0)return{parsha:[Ue[r]],chag:!1,num:r+1,hdate:i};const l=H(r);return{parsha:[Ue[l],Ue[l+1]],chag:!1,num:[l+1,l+2],hdate:i}}}const Ue=["Bereshit","Noach","Lech-Lecha","Vayera","Chayei Sara","Toldot","Vayetzei","Vayishlach","Vayeshev","Miketz","Vayigash","Vayechi","Shemot","Vaera","Bo","Beshalach","Yitro","Mishpatim","Terumah","Tetzaveh","Ki Tisa","Vayakhel","Pekudei","Vayikra","Tzav","Shmini","Tazria","Metzora","Achrei Mot","Kedoshim","Emor","Behar","Bechukotai","Bamidbar","Nasso","Beha'alotcha","Sh'lach","Korach","Chukat","Balak","Pinchas","Matot","Masei","Devarim","Vaetchanan","Eikev","Re'eh","Shoftim","Ki Teitzei","Ki Tavo","Nitzavim","Vayeilech","Ha'azinu"],ht=new Map;for(let t=0;t<Ue.length;t++){const e=Ue[t];ht.set(e,t)}const qs=[21,26,28,31,38,41,50];function kt(t){return qs.includes(-t)}function H(t){return-t}const Js="Rosh Hashana",Gs="Yom Kippur",Zs="Sukkot",on="Sukkot Shabbat Chol ha-Moed",Ws="Shmini Atzeret",_t="Pesach",In="Pesach I",Pe="Pesach Shabbat Chol ha-Moed",sa="Pesach VII",wn="Pesach VIII",ia="Shavuot";function G(t,e){return Array.from({length:e-t+1},(a,n)=>n+t)}const Ye=[51,52,on],ot=[52,Gs,on],yt=[Js,52,Zs,Ws],Ke=G(0,20),Fe=G(0,27),rt=G(33,40),He=G(43,49),st=G(43,50),se={"020":Ye.concat(Ke,H(21),23,24,_t,25,H(26),H(28),30,H(31),rt,H(41),He,H(50)),"0220":Ye.concat(Ke,H(21),23,24,_t,25,H(26),H(28),30,H(31),33,ia,G(34,37),H(38),40,H(41),He,H(50)),"0510":ot.concat(Ke,H(21),23,24,In,wn,25,H(26),H(28),30,H(31),rt,H(41),st),"0511":ot.concat(Ke,H(21),23,24,_t,25,H(26),H(28),G(30,40),H(41),st),"052":ot.concat(G(0,24),sa,25,H(26),H(28),30,H(31),rt,H(41),st),"070":yt.concat(Ke,H(21),23,24,sa,25,H(26),H(28),30,H(31),rt,H(41),st),"072":yt.concat(Ke,H(21),23,24,Pe,25,H(26),H(28),30,H(31),rt,H(41),He,H(50)),1200:Ye.concat(Fe,Pe,G(28,33),ia,G(34,37),H(38),40,H(41),He,H(50)),1201:Ye.concat(Fe,Pe,G(28,40),H(41),He,H(50)),1220:Ye.concat(Fe,In,wn,G(28,40),H(41),st),1221:Ye.concat(Fe,_t,G(28,50)),150:ot.concat(G(0,28),sa,G(29,50)),152:ot.concat(G(0,28),Pe,G(29,49),H(50)),170:yt.concat(Fe,Pe,G(28,40),H(41),He,H(50)),1720:yt.concat(Fe,Pe,G(28,33),ia,G(34,37),H(38),40,H(41),He,H(50))};se["0221"]=se["020"];se["0310"]=se["0220"];se["0311"]=se["020"];se[1310]=se[1220];se[1311]=se[1221];se[1721]=se[170];const Sn=new _o({maxSize:400});function We(t,e){const a=`${t}-${e?1:0}`;let n=Sn.get(a);return n||(n=new Us(t,e),Sn.set(a,n)),n}/*! @hebcal/core v5.8.2 */const D={CHAG:1,LIGHT_CANDLES:2,YOM_TOV_ENDS:4,CHUL_ONLY:8,IL_ONLY:16,LIGHT_CANDLES_TZEIS:32,CHANUKAH_CANDLES:64,ROSH_CHODESH:128,MINOR_FAST:256,SPECIAL_SHABBAT:512,PARSHA_HASHAVUA:1024,DAF_YOMI:2048,OMER_COUNT:4096,MODERN_HOLIDAY:8192,MAJOR_FAST:16384,SHABBAT_MEVARCHIM:32768,MOLAD:65536,USER_EVENT:131072,HEBREW_DATE:262144,MINOR_HOLIDAY:524288,EREV:1048576,CHOL_HAMOED:2097152,MISHNA_YOMI:4194304,YOM_KIPPUR_KATAN:8388608,YERUSHALMI_YOMI:16777216,NACH_YOMI:33554432,DAILY_LEARNING:67108864,YIZKOR:134217728},Qs=[[D.MAJOR_FAST,"holiday","major","fast"],[D.CHANUKAH_CANDLES,"holiday","major"],[D.HEBREW_DATE,"hebdate"],[D.MINOR_FAST,"holiday","fast"],[D.MINOR_HOLIDAY,"holiday","minor"],[D.MODERN_HOLIDAY,"holiday","modern"],[D.MOLAD,"molad"],[D.OMER_COUNT,"omer"],[D.PARSHA_HASHAVUA,"parashat"],[D.ROSH_CHODESH,"roshchodesh"],[D.SHABBAT_MEVARCHIM,"mevarchim"],[D.SPECIAL_SHABBAT,"holiday","shabbat"],[D.USER_EVENT,"user"]];let yo=class Eo{constructor(e,a,n=0,o){if(u.isHDate(e)){if(typeof a!="string")throw new TypeError(`Invalid Event description: ${a}`)}else throw new TypeError(`Invalid Event date: ${e}`);this.date=e,this.desc=a,this.mask=+n,typeof o=="object"&&o!==null&&Object.assign(this,o)}getDate(){return this.date}getDesc(){return this.desc}getFlags(){return this.mask}render(e){return P.gettext(this.desc,e)}renderBrief(e){return this.render(e)}getEmoji(){return this.emoji||null}basename(){return this.getDesc()}url(){}observedInIsrael(){return!(this.mask&D.CHUL_ONLY)}observedInDiaspora(){return!(this.mask&D.IL_ONLY)}observedIn(e){return e?this.observedInIsrael():this.observedInDiaspora()}clone(){const e=new Eo(this.date,this.desc,this.mask);for(const a in this)this.hasOwnProperty(a)&&Object.defineProperty(e,a,{value:this[a]});return e}getCategories(){const e=this.getFlags();for(const a of Qs){const n=a[0];if(e&n)return a.slice(1)}return["unknown"]}};/*! @hebcal/leyning v9.0.2 */var qt={headers:{"plural-forms":"nplurals=2; plural=(n > 1);"},contexts:{"":{"Shabbat Machar Chodesh":["שַׁבָּת מָחָר חוֹדֶשׁ"],"Shabbat Rosh Chodesh":["שַׁבָּת רֹאשׁ חוֹדֶשׁ"],"Pesach I (on Shabbat)":["פֶּסַח יוֹם א׳ (בְּשַׁבָּת)"],"Pesach Chol ha-Moed Day 1":["פֶּסַח חוֹל הַמּוֹעֵד יוֹם א׳"],"Pesach Chol ha-Moed Day 2":["פֶּסַח חוֹל הַמּוֹעֵד יוֹם ב׳"],"Pesach Chol ha-Moed Day 2 on Sunday":["פֶּסַח חוֹל הַמּוֹעֵד יוֹם ב׳ (בְּיוֹם רִאשׁוֹן)"],"Pesach Chol ha-Moed Day 3":["פֶּסַח חוֹל הַמּוֹעֵד יוֹם ג׳"],"Pesach Chol ha-Moed Day 3 on Monday":["פֶּסַח חוֹל הַמּוֹעֵד יוֹם ג׳ (בְּיוֹם שָׁנִי)"],"Pesach Chol ha-Moed Day 4":["פֶּסַח חוֹל הַמּוֹעֵד יוֹם ד׳"],"Pesach Chol ha-Moed Day 5":["פֶּסַח חוֹל הַמּוֹעֵד יוֹם ה׳"],"Pesach Shabbat Chol ha-Moed":["פֶּסַח שַׁבָּת חוֹל הַמּוֹעֵד"],"Pesach VII (on Shabbat)":["פֶּסַח ז׳ (בְּשַׁבָּת)"],"Pesach VIII (on Shabbat)":["פֶּסַח ח׳ (בְּשַׁבָּת)"],"Shavuot II (on Shabbat)":["שָׁבוּעוֹת יוֹם ב׳ (בְּשַׁבָּת)"],"Rosh Hashana I (on Shabbat)":["רֹאשׁ הַשָּׁנָה יוֹם א׳ (בְּשַׁבָּת)"],"Yom Kippur (on Shabbat)":["יוֹם כִּפּוּר (בְּשַׁבָּת)"],"Yom Kippur (Mincha, Traditional)":["יוֹם כִּפּוּר מִנחָה"],"Yom Kippur (Mincha, Alternate)":["יוֹם כִּפּוּר מִנחָה"],"Sukkot I (on Shabbat)":["סוּכּוֹת יוֹם א׳ (בְּשַׁבָּת)"],"Sukkot Chol ha-Moed Day 1":["סוּכּוֹת חוֹל הַמּוֹעֵד יוֹם א׳"],"Sukkot Chol ha-Moed Day 2":["סוּכּוֹת חוֹל הַמּוֹעֵד יוֹם ב׳"],"Sukkot Chol ha-Moed Day 3":["סוּכּוֹת חוֹל הַמּוֹעֵד יוֹם ג׳"],"Sukkot Chol ha-Moed Day 4":["סוּכּוֹת חוֹל הַמּוֹעֵד יוֹם ד׳"],"Sukkot Chol ha-Moed Day 5":["סוּכּוֹת חוֹל הַמּוֹעֵד יוֹם ה׳"],"Sukkot Shabbat Chol ha-Moed":["סוּכּוֹת שַׁבָּת חוֹל הַמּוֹעֵד"],"Sukkot Final Day (Hoshana Raba)":["סוּכּוֹת ז׳ (הוֹשַׁעְנָא רַבָּה)"],"Shmini Atzeret (on Shabbat)":["שְׁמִינִי עֲצֶרֶת (בְּשַׁבָּת)"],"Chanukah Day 1":["חֲנוּכָּה יוֹם א׳"],"Chanukah Day 2":["חֲנוּכָּה יוֹם ב׳"],"Chanukah Day 3":["חֲנוּכָּה יוֹם ג׳"],"Chanukah Day 4":["חֲנוּכָּה יוֹם ד׳"],"Chanukah Day 5":["חֲנוּכָּה יוֹם ה׳"],"Chanukah Day 6":["חֲנוּכָּה יוֹם ו׳"],"Chanukah Day 7":["חֲנוּכָּה יוֹם ז׳"],"Chanukah Day 7 (on Rosh Chodesh)":["חֲנוּכָּה יוֹם ז׳ (רֹאשׁ חוֹדֶשׁ)"],"Chanukah Day 8":["חֲנוּכָּה יוֹם ח׳"],"Chanukah Day 1 (on Shabbat)":["חֲנוּכָּה יוֹם א׳ (בְּשַׁבָּת)"],"Chanukah Day 2 (on Shabbat)":["חֲנוּכָּה יוֹם ב׳ (בְּשַׁבָּת)"],"Chanukah Day 3 (on Shabbat)":["חֲנוּכָּה יוֹם ג׳ (בְּשַׁבָּת)"],"Chanukah Day 4 (on Shabbat)":["חֲנוּכָּה יוֹם ד׳ (בְּשַׁבָּת)"],"Chanukah Day 5 (on Shabbat)":["חֲנוּכָּה יוֹם ה׳ (בְּשַׁבָּת)"],"Chanukah Day 7 (on Shabbat)":["חֲנוּכָּה יוֹם ז׳ (בְּשַׁבָּת)"],"Chanukah Day 8 (on Shabbat)":["חֲנוּכָּה יוֹם ח׳ (בְּשַׁבָּת)"],"Shabbat Rosh Chodesh Chanukah":["שַׁבָּת רֹאשׁ חוֹדֶשׁ חֲנוּכָּה"],"Yom Kippur (Mincha)":["יוֹם כִּפּוּר מִנחָה"],"Tish'a B'Av (Mincha)":["תִּשְׁעָה בְּאָב מִנחָה"],"Asara B'Tevet (Mincha)":["עֲשָׂרָה בְּטֵבֵת מִנחָה"],"Ta'anit Bechorot (Mincha)":["תַּעֲנִית בְּכוֹרוֹת מִנחָה"],"Ta'anit Esther (Mincha)":["תַּעֲנִית אֶסְתֵּר מִנחָה"],"Tzom Gedaliah (Mincha)":["צוֹם גְּדַלְיָה מִנחָה"],"Tzom Tammuz (Mincha)":["צוֹם תָּמוּז מִנחָה"]}}};/*! @hebcal/leyning v9.0.2 */P.addTranslations("he",qt);P.addTranslations("h",qt);const Xs=qt.contexts[""],vo={};for(const[t,e]of Object.entries(Xs))vo[t]=[P.hebrewStripNikkud(e[0])];const ei={headers:qt.headers,contexts:{"":vo}};P.addTranslations("he-x-NoNikud",ei);/*! @hebcal/leyning v9.0.2 */function $e(t){return JSON.parse(JSON.stringify(t))}function De(t){if(!t)return t;const e=$e(t);return Array.isArray(e)?e.map(Le):Le(e),e}function Qe(t){return Array.isArray(t)?t.reduce((e,a)=>e+a.v,0):t.v}/*! @hebcal/leyning v9.0.2 */const ti={note:"Israel only",il:!0,megillah:"Ruth",haft:[{k:"Ezekiel",b:"1:1",e:"1:28"},{k:"Ezekiel",b:"3:12",e:"3:12"}],fullkriyah:{1:{p:17,k:2,b:"19:1",e:"19:6"},2:{p:17,k:2,b:"19:7",e:"19:13"},3:{p:17,k:2,b:"19:14",e:"19:19"},4:{p:17,k:2,b:"19:20",e:"20:14"},5:{p:17,k:2,b:"20:15",e:"20:23"},M:{p:41,k:4,b:"28:26",e:"28:31"}}},ai={megillah:"Esther",fullkriyah:{1:{p:16,k:2,b:"17:8",e:"17:10"},2:{p:16,k:2,b:"17:11",e:"17:13"},3:{p:16,k:2,b:"17:14",e:"17:16"}}};var ni={"Pesach I":{haft:[{k:"Joshua",b:"3:5",e:"3:7"},{k:"Joshua",b:"5:2",e:"6:1"},{k:"Joshua",b:"6:27",e:"6:27"}],seph:[{k:"Joshua",b:"5:2",e:"6:1"},{k:"Joshua",b:"6:27",e:"6:27"}],fullkriyah:{1:{p:15,k:2,b:"12:21",e:"12:24"},2:{p:15,k:2,b:"12:25",e:"12:28"},3:{p:15,k:2,b:"12:29",e:"12:36"},4:{p:15,k:2,b:"12:37",e:"12:42"},5:{p:15,k:2,b:"12:43",e:"12:51"},M:{p:41,k:4,b:"28:16",e:"28:25"}}},"Pesach I (on Shabbat)":{haft:[{k:"Joshua",b:"3:5",e:"3:7"},{k:"Joshua",b:"5:2",e:"6:1"},{k:"Joshua",b:"6:27",e:"6:27"}],seph:[{k:"Joshua",b:"5:2",e:"6:1"},{k:"Joshua",b:"6:27",e:"6:27"}],fullkriyah:{1:{p:15,k:2,b:"12:21",e:"12:24"},2:{p:15,k:2,b:"12:25",e:"12:28"},3:{p:15,k:2,b:"12:29",e:"12:32"},4:{p:15,k:2,b:"12:33",e:"12:36"},5:{p:15,k:2,b:"12:37",e:"12:42"},6:{p:15,k:2,b:"12:43",e:"12:47"},7:{p:15,k:2,b:"12:48",e:"12:51"},M:{p:41,k:4,b:"28:16",e:"28:25"}}},"Pesach II":{haft:[{k:"II Kings",b:"23:1",e:"23:9"},{k:"II Kings",b:"23:21",e:"23:25"}],fullkriyah:{1:{p:31,k:3,b:"22:26",e:"23:3"},2:{p:31,k:3,b:"23:4",e:"23:14"},3:{p:31,k:3,b:"23:15",e:"23:22"},4:{p:31,k:3,b:"23:23",e:"23:32"},5:{p:31,k:3,b:"23:33",e:"23:44"},M:{p:41,k:4,b:"28:16",e:"28:25"}}},"Pesach II (CH''M)":{note:"Israel only - according to Vaani T'fillati Siddur Yisraeli",il:!0,fullkriyah:{1:{p:31,k:3,b:"22:26",e:"23:8"},2:{p:31,k:3,b:"23:9",e:"23:14"},3:{p:31,k:3,b:"23:15",e:"23:44"},4:{p:41,k:4,b:"28:19",e:"28:25"}}},"Pesach Chol ha-Moed Day 1":{fullkriyah:{1:{p:15,k:2,b:"13:1",e:"13:4"},2:{p:15,k:2,b:"13:5",e:"13:10"},3:{p:15,k:2,b:"13:11",e:"13:16"},4:{p:41,k:4,b:"28:19",e:"28:25"}}},"Pesach Chol ha-Moed Day 2":{fullkriyah:{1:{p:18,k:2,b:"22:24",e:"22:26"},2:{p:18,k:2,b:"22:27",e:"23:5"},3:{p:18,k:2,b:"23:6",e:"23:19"},4:{p:41,k:4,b:"28:19",e:"28:25"}}},"Pesach Chol ha-Moed Day 3":{fullkriyah:{1:{p:21,k:2,b:"34:1",e:"34:10"},2:{p:21,k:2,b:"34:11",e:"34:17"},3:{p:21,k:2,b:"34:18",e:"34:26"},4:{p:41,k:4,b:"28:19",e:"28:25"}}},"Pesach Chol ha-Moed Day 4":{fullkriyah:{1:{p:36,k:4,b:"9:1",e:"9:5"},2:{p:36,k:4,b:"9:6",e:"9:8"},3:{p:36,k:4,b:"9:9",e:"9:14"},4:{p:41,k:4,b:"28:19",e:"28:25"}}},"Pesach Shabbat Chol ha-Moed":{megillah:"Song of Songs",haft:{k:"Ezekiel",b:"37:1",e:"37:14"},fullkriyah:{1:{p:21,k:2,b:"33:12",e:"33:16"},2:{p:21,k:2,b:"33:17",e:"33:19"},3:{p:21,k:2,b:"33:20",e:"33:23"},4:{p:21,k:2,b:"34:1",e:"34:3"},5:{p:21,k:2,b:"34:4",e:"34:10"},6:{p:21,k:2,b:"34:11",e:"34:17"},7:{p:21,k:2,b:"34:18",e:"34:26"},M:{p:41,k:4,b:"28:19",e:"28:25"}}},"Pesach VII":{haft:{k:"II Samuel",b:"22:1",e:"22:51"},fullkriyah:{1:{p:16,k:2,b:"13:17",e:"13:22"},2:{p:16,k:2,b:"14:1",e:"14:8"},3:{p:16,k:2,b:"14:9",e:"14:14"},4:{p:16,k:2,b:"14:15",e:"14:25"},5:{p:16,k:2,b:"14:26",e:"15:26"},M:{p:41,k:4,b:"28:19",e:"28:25"}}},"Pesach VII (on Shabbat)":{megillah:"Song of Songs",haft:{k:"II Samuel",b:"22:1",e:"22:51"},fullkriyah:{1:{p:16,k:2,b:"13:17",e:"13:19"},2:{p:16,k:2,b:"13:20",e:"13:22"},3:{p:16,k:2,b:"14:1",e:"14:4"},4:{p:16,k:2,b:"14:5",e:"14:8"},5:{p:16,k:2,b:"14:9",e:"14:14"},6:{p:16,k:2,b:"14:15",e:"14:25"},7:{p:16,k:2,b:"14:26",e:"15:26"},M:{p:41,k:4,b:"28:19",e:"28:25"}}},"Pesach VIII":{haft:{k:"Isaiah",b:"10:32",e:"12:6"},fullkriyah:{1:{p:47,k:5,b:"15:19",e:"15:23"},2:{p:47,k:5,b:"16:1",e:"16:3"},3:{p:47,k:5,b:"16:4",e:"16:8"},4:{p:47,k:5,b:"16:9",e:"16:12"},5:{p:47,k:5,b:"16:13",e:"16:17"},M:{p:41,k:4,b:"28:19",e:"28:25"}}},"Pesach VIII (on Shabbat)":{megillah:"Song of Songs",haft:{k:"Isaiah",b:"10:32",e:"12:6"},fullkriyah:{1:{p:47,k:5,b:"14:22",e:"14:29"},2:{p:47,k:5,b:"15:1",e:"15:18"},3:{p:47,k:5,b:"15:19",e:"15:23"},4:{p:47,k:5,b:"16:1",e:"16:3"},5:{p:47,k:5,b:"16:4",e:"16:8"},6:{p:47,k:5,b:"16:9",e:"16:12"},7:{p:47,k:5,b:"16:13",e:"16:17"},M:{p:41,k:4,b:"28:19",e:"28:25"}}},"Pesach III (CH''M)":{alias:!0,il:!0,key:"Pesach Chol ha-Moed Day 1"},"Pesach IV (CH''M)":{alias:!0,il:!0,key:"Pesach Chol ha-Moed Day 2"},"Pesach V (CH''M)":{alias:!0,il:!0,key:"Pesach Chol ha-Moed Day 3"},"Pesach VI (CH''M)":{alias:!0,il:!0,key:"Pesach Chol ha-Moed Day 4"},"Pesach Chol ha-Moed Day 2 on Sunday":{alias:!0,il:!1,key:"Pesach Chol ha-Moed Day 1"},"Pesach Chol ha-Moed Day 3 on Monday":{alias:!0,il:!1,key:"Pesach Chol ha-Moed Day 2"},Shavuot:ti,"Shavuot I":{haft:[{k:"Ezekiel",b:"1:1",e:"1:28"},{k:"Ezekiel",b:"3:12",e:"3:12"}],fullkriyah:{1:{p:17,k:2,b:"19:1",e:"19:6"},2:{p:17,k:2,b:"19:7",e:"19:13"},3:{p:17,k:2,b:"19:14",e:"19:19"},4:{p:17,k:2,b:"19:20",e:"20:14"},5:{p:17,k:2,b:"20:15",e:"20:23"},M:{p:41,k:4,b:"28:26",e:"28:31"}}},"Shavuot II":{megillah:"Ruth",haft:{k:"Habakkuk",b:"3:1",e:"3:19"},seph:{k:"Habakkuk",b:"2:20",e:"3:19"},fullkriyah:{1:{p:47,k:5,b:"15:19",e:"15:23"},2:{p:47,k:5,b:"16:1",e:"16:3"},3:{p:47,k:5,b:"16:4",e:"16:8"},4:{p:47,k:5,b:"16:9",e:"16:12"},5:{p:47,k:5,b:"16:13",e:"16:17"},M:{p:41,k:4,b:"28:26",e:"28:31"}}},"Shavuot II (on Shabbat)":{megillah:"Ruth",haft:{k:"Habakkuk",b:"3:1",e:"3:19"},seph:{k:"Habakkuk",b:"2:20",e:"3:19"},fullkriyah:{1:{p:47,k:5,b:"14:22",e:"14:29"},2:{p:47,k:5,b:"15:1",e:"15:18"},3:{p:47,k:5,b:"15:19",e:"15:23"},4:{p:47,k:5,b:"16:1",e:"16:3"},5:{p:47,k:5,b:"16:4",e:"16:8"},6:{p:47,k:5,b:"16:9",e:"16:12"},7:{p:47,k:5,b:"16:13",e:"16:17"},M:{p:41,k:4,b:"28:26",e:"28:31"}}},"Fast Day (Morning)":{fullkriyah:{1:{p:21,k:2,b:"32:11",e:"32:14"},2:{p:21,k:2,b:"34:1",e:"34:3"},3:{p:21,k:2,b:"34:4",e:"34:10"}}},"Fast Day (Afternoon)":{haft:{k:"Isaiah",b:"55:6",e:"56:8"},fullkriyah:{1:{p:21,k:2,b:"32:11",e:"32:14"},2:{p:21,k:2,b:"34:1",e:"34:3"},M:{p:21,k:2,b:"34:4",e:"34:10"}}},"Asara B'Tevet":{alias:!0,key:"Fast Day (Morning)"},"Ta'anit Esther":{alias:!0,key:"Fast Day (Morning)"},"Tzom Gedaliah":{alias:!0,key:"Fast Day (Morning)"},"Tzom Tammuz":{alias:!0,key:"Fast Day (Morning)"},"Asara B'Tevet (Mincha)":{alias:!0,key:"Fast Day (Afternoon)"},"Ta'anit Esther (Mincha)":{alias:!0,key:"Fast Day (Afternoon)"},"Tzom Gedaliah (Mincha)":{alias:!0,key:"Fast Day (Afternoon)"},"Tzom Tammuz (Mincha)":{alias:!0,key:"Fast Day (Afternoon)"},"Erev Tish'a B'Av":{megillah:"Lamentations"},"Tish'a B'Av":{haft:{k:"Jeremiah",b:"8:13",e:"9:23"},fullkriyah:{1:{p:45,k:5,b:"4:25",e:"4:29"},2:{p:45,k:5,b:"4:30",e:"4:35"},3:{p:45,k:5,b:"4:36",e:"4:40"}}},"Tish'a B'Av (Mincha)":{alias:!0,key:"Fast Day (Afternoon)"},"Rosh Hashana I":{haft:{k:"I Samuel",b:"1:1",e:"2:10"},fullkriyah:{1:{p:4,k:1,b:"21:1",e:"21:4"},2:{p:4,k:1,b:"21:5",e:"21:12"},3:{p:4,k:1,b:"21:13",e:"21:21"},4:{p:4,k:1,b:"21:22",e:"21:27"},5:{p:4,k:1,b:"21:28",e:"21:34"},M:{p:41,k:4,b:"29:1",e:"29:6"}}},"Rosh Hashana I (on Shabbat)":{haft:{k:"I Samuel",b:"1:1",e:"2:10"},fullkriyah:{1:{p:4,k:1,b:"21:1",e:"21:4"},2:{p:4,k:1,b:"21:5",e:"21:8"},3:{p:4,k:1,b:"21:9",e:"21:12"},4:{p:4,k:1,b:"21:13",e:"21:17"},5:{p:4,k:1,b:"21:18",e:"21:21"},6:{p:4,k:1,b:"21:22",e:"21:27"},7:{p:4,k:1,b:"21:28",e:"21:34"},M:{p:41,k:4,b:"29:1",e:"29:6"}}},"Rosh Hashana II":{haft:{k:"Jeremiah",b:"31:2",e:"31:20",note:"labeled 31:1–19 in some books"},fullkriyah:{1:{p:4,k:1,b:"22:1",e:"22:3"},2:{p:4,k:1,b:"22:4",e:"22:8"},3:{p:4,k:1,b:"22:9",e:"22:14"},4:{p:4,k:1,b:"22:15",e:"22:19"},5:{p:4,k:1,b:"22:20",e:"22:24"},M:{p:41,k:4,b:"29:1",e:"29:6"}}},"Yom Kippur":{haft:{k:"Isaiah",b:"57:14",e:"58:14"},fullkriyah:{1:{p:29,k:3,b:"16:1",e:"16:6"},2:{p:29,k:3,b:"16:7",e:"16:11"},3:{p:29,k:3,b:"16:12",e:"16:17"},4:{p:29,k:3,b:"16:18",e:"16:24"},5:{p:29,k:3,b:"16:25",e:"16:30"},6:{p:29,k:3,b:"16:31",e:"16:34"},M:{p:41,k:4,b:"29:7",e:"29:11"}}},"Yom Kippur (on Shabbat)":{haft:{k:"Isaiah",b:"57:14",e:"58:14"},fullkriyah:{1:{p:29,k:3,b:"16:1",e:"16:3"},2:{p:29,k:3,b:"16:4",e:"16:6"},3:{p:29,k:3,b:"16:7",e:"16:11"},4:{p:29,k:3,b:"16:12",e:"16:17"},5:{p:29,k:3,b:"16:18",e:"16:24"},6:{p:29,k:3,b:"16:25",e:"16:30"},7:{p:29,k:3,b:"16:31",e:"16:34"},M:{p:41,k:4,b:"29:7",e:"29:11"}}},"Yom Kippur (Mincha)":{alias:!0,key:"Yom Kippur (Mincha, Traditional)"},"Yom Kippur (Mincha, Traditional)":{haft:[{k:"Jonah",b:"1:1",e:"4:11"},{k:"Micah",b:"7:18",e:"7:20"}],fullkriyah:{1:{p:29,k:3,b:"18:1",e:"18:5"},2:{p:29,k:3,b:"18:6",e:"18:21"},M:{p:29,k:3,b:"18:22",e:"18:30"}}},"Yom Kippur (Mincha, Alternate)":{haft:[{k:"Jonah",b:"1:1",e:"4:11"},{k:"Micah",b:"7:18",e:"7:20"}],fullkriyah:{1:{p:30,k:3,b:"19:1",e:"19:4"},2:{p:30,k:3,b:"19:5",e:"19:10"},M:{p:30,k:3,b:"19:11",e:"19:18"}}},"Sukkot I":{haft:{k:"Zechariah",b:"14:1",e:"14:21"},fullkriyah:{1:{p:31,k:3,b:"22:26",e:"23:3"},2:{p:31,k:3,b:"23:4",e:"23:14"},3:{p:31,k:3,b:"23:15",e:"23:22"},4:{p:31,k:3,b:"23:23",e:"23:32"},5:{p:31,k:3,b:"23:33",e:"23:44"},M:{p:41,k:4,b:"29:12",e:"29:16"}}},"Sukkot I (on Shabbat)":{haft:{k:"Zechariah",b:"14:1",e:"14:21"},fullkriyah:{1:{p:31,k:3,b:"22:26",e:"22:33"},2:{p:31,k:3,b:"23:1",e:"23:3"},3:{p:31,k:3,b:"23:4",e:"23:8"},4:{p:31,k:3,b:"23:9",e:"23:14"},5:{p:31,k:3,b:"23:15",e:"23:22"},6:{p:31,k:3,b:"23:23",e:"23:32"},7:{p:31,k:3,b:"23:33",e:"23:44"},M:{p:41,k:4,b:"29:12",e:"29:16"}}},"Sukkot II":{haft:{k:"I Kings",b:"8:2",e:"8:21"},fullkriyah:{1:{p:31,k:3,b:"22:26",e:"23:3"},2:{p:31,k:3,b:"23:4",e:"23:14"},3:{p:31,k:3,b:"23:15",e:"23:22"},4:{p:31,k:3,b:"23:23",e:"23:32"},5:{p:31,k:3,b:"23:33",e:"23:44"},M:{p:41,k:4,b:"29:12",e:"29:16"}}},"Sukkot Chol ha-Moed Day 1":{fullkriyah:{1:{p:41,k:4,b:"29:17",e:"29:19"},2:{p:41,k:4,b:"29:20",e:"29:22"},3:{p:41,k:4,b:"29:23",e:"29:25"},4:{p:41,k:4,b:"29:17",e:"29:22"}}},"Sukkot Chol ha-Moed Day 2":{fullkriyah:{1:{p:41,k:4,b:"29:20",e:"29:22"},2:{p:41,k:4,b:"29:23",e:"29:25"},3:{p:41,k:4,b:"29:26",e:"29:28"},4:{p:41,k:4,b:"29:20",e:"29:25"}}},"Sukkot Chol ha-Moed Day 3":{fullkriyah:{1:{p:41,k:4,b:"29:23",e:"29:25"},2:{p:41,k:4,b:"29:26",e:"29:28"},3:{p:41,k:4,b:"29:29",e:"29:31"},4:{p:41,k:4,b:"29:23",e:"29:28"}}},"Sukkot Chol ha-Moed Day 4":{fullkriyah:{1:{p:41,k:4,b:"29:26",e:"29:28"},2:{p:41,k:4,b:"29:29",e:"29:31"},3:{p:41,k:4,b:"29:32",e:"29:34"},4:{p:41,k:4,b:"29:26",e:"29:31"}}},"Sukkot Chol ha-Moed Day 5":{fullkriyah:{1:{p:41,k:4,b:"29:29",e:"29:31"},2:{p:41,k:4,b:"29:32",e:"29:34"},3:{p:41,k:4,b:"29:35",e:"29:37"},4:{p:41,k:4,b:"29:29",e:"29:34"}}},"Sukkot Shabbat Chol ha-Moed":{megillah:"Ecclesiastes",haft:{k:"Ezekiel",b:"38:18",e:"39:16"},fullkriyah:{1:{p:21,k:2,b:"33:12",e:"33:16"},2:{p:21,k:2,b:"33:17",e:"33:19"},3:{p:21,k:2,b:"33:20",e:"33:23"},4:{p:21,k:2,b:"34:1",e:"34:3"},5:{p:21,k:2,b:"34:4",e:"34:10"},6:{p:21,k:2,b:"34:11",e:"34:17"},7:{p:21,k:2,b:"34:18",e:"34:26"},"M-day1":{p:41,k:4,b:"29:17",e:"29:22"},"M-day2":{p:41,k:4,b:"29:20",e:"29:25"},"M-day3":{p:41,k:4,b:"29:23",e:"29:28"},"M-day4":{p:41,k:4,b:"29:26",e:"29:31"},"M-day5":{p:41,k:4,b:"29:29",e:"29:34"}}},"Sukkot Final Day (Hoshana Raba)":{fullkriyah:{1:{p:41,k:4,b:"29:26",e:"29:28"},2:{p:41,k:4,b:"29:29",e:"29:31"},3:{p:41,k:4,b:"29:32",e:"29:34"},4:{p:41,k:4,b:"29:29",e:"29:34"}}},"Shmini Atzeret":{haft:{k:"I Kings",b:"8:54",e:"8:66"},fullkriyah:{1:{p:47,k:5,b:"14:22",e:"14:29"},2:{p:47,k:5,b:"15:1",e:"15:18"},3:{p:47,k:5,b:"15:19",e:"16:3"},4:{p:47,k:5,b:"16:4",e:"16:8"},5:{p:47,k:5,b:"16:9",e:"16:17"},M:{p:41,k:4,b:"29:35",e:"30:1"}}},"Shmini Atzeret (on Shabbat)":{megillah:"Ecclesiastes",haft:{k:"I Kings",b:"8:54",e:"8:66"},fullkriyah:{1:{p:47,k:5,b:"14:22",e:"14:29"},2:{p:47,k:5,b:"15:1",e:"15:18"},3:{p:47,k:5,b:"15:19",e:"15:23"},4:{p:47,k:5,b:"16:1",e:"16:3"},5:{p:47,k:5,b:"16:4",e:"16:8"},6:{p:47,k:5,b:"16:9",e:"16:12"},7:{p:47,k:5,b:"16:13",e:"16:17"},M:{p:41,k:4,b:"29:35",e:"30:1"}}},"Erev Simchat Torah":{fullkriyah:{1:{p:54,k:5,b:"33:1",e:"33:7"},2:{p:54,k:5,b:"33:8",e:"33:12"},3:{p:54,k:5,b:"33:13",e:"33:17"}}},"Simchat Torah":{haft:{k:"Joshua",b:"1:1",e:"1:18"},fullkriyah:{1:{p:54,k:5,b:"33:1",e:"33:7"},2:{p:54,k:5,b:"33:8",e:"33:12"},3:{p:54,k:5,b:"33:13",e:"33:17"},4:{p:54,k:5,b:"33:18",e:"33:21"},5:{p:54,k:5,b:"33:22",e:"33:26"},6:{p:54,k:5,b:"33:27",e:"34:12"},7:{p:1,k:1,b:"1:1",e:"2:3"},M:{p:41,k:4,b:"29:35",e:"30:1"}}},"Simchat Torah (on Shabbat)":{megillah:"Ecclesiastes",haft:{k:"Joshua",b:"1:1",e:"1:18"},fullkriyah:{1:{p:54,k:5,b:"33:1",e:"33:7"},2:{p:54,k:5,b:"33:8",e:"33:12"},3:{p:54,k:5,b:"33:13",e:"33:17"},4:{p:54,k:5,b:"33:18",e:"33:21"},5:{p:54,k:5,b:"33:22",e:"33:26"},6:{p:54,k:5,b:"33:27",e:"33:29"},7:{p:54,k:5,b:"34:1",e:"34:12"},8:{p:1,k:1,b:"1:1",e:"2:3"},M:{p:41,k:4,b:"29:35",e:"30:1"}}},"Shabbat Rosh Chodesh Chanukah":{haft:{k:"Zechariah",b:"2:14",e:"4:7"},fullkriyah:{7:{p:41,k:4,b:"28:9",e:"28:15"},M:{p:35,k:4,b:"7:42",e:"7:47"}}},"Chanukah Day 1":{fullkriyah:{1:{p:35,k:4,b:"7:1",e:"7:11"},2:{p:35,k:4,b:"7:12",e:"7:14"},3:{p:35,k:4,b:"7:15",e:"7:17"}},alt:{1:{p:35,k:4,b:"7:1",e:"7:3"},2:{p:35,k:4,b:"7:4",e:"7:11"},3:{p:35,k:4,b:"7:12",e:"7:17"}}},"Chanukah Day 1 (on Shabbat)":{haft:{k:"Zechariah",b:"2:14",e:"4:7"},fullkriyah:{M:{p:35,k:4,b:"7:1",e:"7:17"}}},"Chanukah Day 2":{fullkriyah:{1:{p:35,k:4,b:"7:18",e:"7:20"},2:{p:35,k:4,b:"7:21",e:"7:23"},3:{p:35,k:4,b:"7:24",e:"7:29"}},alt:{1:{p:35,k:4,b:"7:18",e:"7:20"},2:{p:35,k:4,b:"7:21",e:"7:23"},3:{p:35,k:4,b:"7:18",e:"7:23"}}},"Chanukah Day 2 (on Shabbat)":{haft:{k:"Zechariah",b:"2:14",e:"4:7"},fullkriyah:{M:{p:35,k:4,b:"7:18",e:"7:23"}}},"Chanukah Day 3":{fullkriyah:{1:{p:35,k:4,b:"7:24",e:"7:26"},2:{p:35,k:4,b:"7:27",e:"7:29"},3:{p:35,k:4,b:"7:30",e:"7:35"}},alt:{1:{p:35,k:4,b:"7:24",e:"7:26"},2:{p:35,k:4,b:"7:27",e:"7:29"},3:{p:35,k:4,b:"7:24",e:"7:29"}}},"Chanukah Day 3 (on Shabbat)":{haft:{k:"Zechariah",b:"2:14",e:"4:7"},fullkriyah:{M:{p:35,k:4,b:"7:24",e:"7:29"}}},"Chanukah Day 4":{fullkriyah:{1:{p:35,k:4,b:"7:30",e:"7:32"},2:{p:35,k:4,b:"7:33",e:"7:35"},3:{p:35,k:4,b:"7:36",e:"7:41"}},alt:{1:{p:35,k:4,b:"7:30",e:"7:32"},2:{p:35,k:4,b:"7:33",e:"7:35"},3:{p:35,k:4,b:"7:30",e:"7:35"}}},"Chanukah Day 4 (on Shabbat)":{haft:{k:"Zechariah",b:"2:14",e:"4:7"},fullkriyah:{M:{p:35,k:4,b:"7:30",e:"7:35"}}},"Chanukah Day 5":{fullkriyah:{1:{p:35,k:4,b:"7:36",e:"7:38"},2:{p:35,k:4,b:"7:39",e:"7:41"},3:{p:35,k:4,b:"7:42",e:"7:47"}},alt:{1:{p:35,k:4,b:"7:36",e:"7:38"},2:{p:35,k:4,b:"7:39",e:"7:41"},3:{p:35,k:4,b:"7:36",e:"7:41"}}},"Chanukah Day 5 (on Shabbat)":{haft:{k:"Zechariah",b:"2:14",e:"4:7"},fullkriyah:{M:{p:35,k:4,b:"7:36",e:"7:41"}}},"Chanukah Day 6":{fullkriyah:{1:{p:41,k:4,b:"28:1",e:"28:5"},2:{p:41,k:4,b:"28:6",e:"28:10"},3:{p:41,k:4,b:"28:11",e:"28:15"},4:{p:35,k:4,b:"7:42",e:"7:47"}}},"Chanukah Day 7":{fullkriyah:{1:{p:35,k:4,b:"7:48",e:"7:50"},2:{p:35,k:4,b:"7:51",e:"7:53"},3:{p:35,k:4,b:"7:54",e:"7:59"}},alt:{1:{p:35,k:4,b:"7:48",e:"7:50"},2:{p:35,k:4,b:"7:51",e:"7:53"},3:{p:35,k:4,b:"7:48",e:"7:53"}}},"Chanukah Day 7 (on Rosh Chodesh)":{fullkriyah:{1:{p:41,k:4,b:"28:1",e:"28:5"},2:{p:41,k:4,b:"28:6",e:"28:10"},3:{p:41,k:4,b:"28:11",e:"28:15"},4:{p:35,k:4,b:"7:48",e:"7:53"}}},"Chanukah Day 7 (on Shabbat)":{haft:{k:"Zechariah",b:"2:14",e:"4:7"},fullkriyah:{M:{p:35,k:4,b:"7:48",e:"7:53"}}},"Chanukah Day 8":{fullkriyah:{1:{p:35,k:4,b:"7:54",e:"7:56"},2:{p:35,k:4,b:"7:57",e:"7:59"},3:{p:35,k:4,b:"7:60",e:"8:4"}}},"Chanukah Day 8 (on Shabbat)":{haft:{k:"I Kings",b:"7:40",e:"7:50"},fullkriyah:{M:{p:35,k:4,b:"7:54",e:"8:4"}}},"Erev Purim":{megillah:"Esther"},Purim:ai,"Shushan Purim":{note:"Jerusalem & walled cities only",il:!0,megillah:"Esther",fullkriyah:{1:{p:16,k:2,b:"17:8",e:"17:10"},2:{p:16,k:2,b:"17:11",e:"17:13"},3:{p:16,k:2,b:"17:14",e:"17:16"}}},"Shushan Purim (on Shabbat)":{il:!0,note:"Jerusalem & walled cities only: special maftir Exodus 17:8-16, same Haftara as Shabbat Zachor"},"Shabbat HaChodesh":{haft:{k:"Ezekiel",b:"45:16",e:"46:18"},seph:{k:"Ezekiel",b:"45:18",e:"46:15"},fullkriyah:{M:{p:15,k:2,b:"12:1",e:"12:20"}}},"Shabbat HaChodesh (on Rosh Chodesh)":{haft:{k:"Ezekiel",b:"45:16",e:"46:18"},seph:{k:"Ezekiel",b:"45:18",e:"46:15"},fullkriyah:{7:{p:41,k:4,b:"28:9",e:"28:15"},M:{p:15,k:2,b:"12:1",e:"12:20"}}},"Shabbat HaGadol":{haft:{k:"Malachi",b:"3:4",e:"3:24"}},"Shabbat Parah":{haft:{k:"Ezekiel",b:"36:16",e:"36:38"},seph:{k:"Ezekiel",b:"36:16",e:"36:36"},fullkriyah:{M:{p:39,k:4,b:"19:1",e:"19:22"}}},"Shabbat Shekalim":{haft:{k:"II Kings",b:"12:1",e:"12:17"},seph:{k:"II Kings",b:"11:17",e:"12:17"},fullkriyah:{M:{p:21,k:2,b:"30:11",e:"30:16"}}},"Shabbat Shekalim (on Rosh Chodesh)":{haft:{k:"II Kings",b:"12:1",e:"12:17"},seph:{k:"II Kings",b:"11:17",e:"12:17"},fullkriyah:{7:{p:41,k:4,b:"28:9",e:"28:15"},M:{p:21,k:2,b:"30:11",e:"30:16"}}},"Shabbat Shuva (with Vayeilech)":{haft:[{k:"Hosea",b:"14:2",e:"14:10"},{k:"Micah",b:"7:18",e:"7:20"}]},"Shabbat Shuva (with Ha'azinu)":{haft:[{k:"Hosea",b:"14:2",e:"14:10"},{k:"Joel",b:"2:15",e:"2:27"}],seph:[{k:"Hosea",b:"14:2",e:"14:10"},{k:"Micah",b:"7:18",e:"7:20"}]},"Shabbat Shuva":{haft:[{k:"Hosea",b:"14:2",e:"14:10"},{k:"Micah",b:"7:18",e:"7:20"},{k:"Joel",b:"2:15",e:"2:27"}]},"Shabbat Zachor":{haft:{k:"I Samuel",b:"15:2",e:"15:34"},seph:{k:"I Samuel",b:"15:1",e:"15:34"},fullkriyah:{M:{p:49,k:5,b:"25:17",e:"25:19"}}},"Pinchas occurring after 17 Tammuz":{haft:{k:"Jeremiah",b:"1:1",e:"2:3"}},"Kedoshim following Special Shabbat":{haft:{k:"Amos",b:"9:7",e:"9:15"},seph:{k:"Ezekiel",b:"20:2",e:"20:20"}},"Masei on Shabbat Rosh Chodesh":{haft:[{k:"Jeremiah",b:"2:4",e:"2:28"},{k:"Jeremiah",b:"3:4",e:"3:4"}],seph:[{k:"Jeremiah",b:"2:4",e:"2:28"},{k:"Jeremiah",b:"4:1",e:"4:2"},{k:"Isaiah",b:"66:1",e:"66:1"},{k:"Isaiah",b:"66:23",e:"66:23"}],fullkriyah:{M:{p:41,k:4,b:"28:9",e:"28:15"}}},"Matot-Masei on Shabbat Rosh Chodesh":{alias:!0,key:"Masei on Shabbat Rosh Chodesh"},"Ki Teitzei with 3rd Haftarah of Consolation":{haft:[{k:"Isaiah",b:"54:1",e:"54:10"},{k:"Isaiah",b:"54:11",e:"55:5"}]},"Rosh Chodesh":{fullkriyah:{1:{p:41,k:4,b:"28:1",e:"28:3"},2:{p:41,k:4,b:"28:3",e:"28:5"},3:{p:41,k:4,b:"28:6",e:"28:10"},4:{p:41,k:4,b:"28:11",e:"28:15"}}},"Rosh Chodesh Nisan":{alias:!0,key:"Rosh Chodesh"},"Rosh Chodesh Iyyar":{alias:!0,key:"Rosh Chodesh"},"Rosh Chodesh Sivan":{alias:!0,key:"Rosh Chodesh"},"Rosh Chodesh Tamuz":{alias:!0,key:"Rosh Chodesh"},"Rosh Chodesh Av":{alias:!0,key:"Rosh Chodesh"},"Rosh Chodesh Elul":{alias:!0,key:"Rosh Chodesh"},"Rosh Chodesh Tishrei":{alias:!0,key:"Rosh Chodesh"},"Rosh Chodesh Cheshvan":{alias:!0,key:"Rosh Chodesh"},"Rosh Chodesh Kislev":{alias:!0,key:"Rosh Chodesh"},"Rosh Chodesh Sh'vat":{alias:!0,key:"Rosh Chodesh"},"Rosh Chodesh Adar":{alias:!0,key:"Rosh Chodesh"},"Rosh Chodesh Adar I":{alias:!0,key:"Rosh Chodesh"},"Rosh Chodesh Adar II":{alias:!0,key:"Rosh Chodesh"},"Shabbat Rosh Chodesh":{haft:{k:"Isaiah",b:"66:1",e:"66:24"},fullkriyah:{M:{p:41,k:4,b:"28:9",e:"28:15"}}},"Shabbat Machar Chodesh":{haft:{k:"I Samuel",b:"20:18",e:"20:42"}}};/*! @hebcal/leyning v9.0.2 */const Da=ni;function la(t){return typeof Da[t]=="object"}function xo(t){let e=Da[t];if(typeof e>"u")return;if(e.alias){const n=Da[e.key];if(typeof n>"u")throw new Error(`Leyning alias ${t} => ${e.key} not found`);e=n}const a=e.fullkriyah?$e(e):e;if(a.fullkriyah)for(const n of Object.values(a.fullkriyah))typeof n.k=="number"&&(n.k=Ft[n.k]);return e.note&&(a.note=e.note),a}/*! @hebcal/leyning v9.0.2 */const Ao=D.DAF_YOMI|D.OMER_COUNT|D.SHABBAT_MEVARCHIM|D.MOLAD|D.USER_EVENT|D.HEBREW_DATE|D.MISHNA_YOMI|D.MODERN_HOLIDAY|D.YERUSHALMI_YOMI;function rn(t,e=!1){if(typeof t.eventTime<"u")return;const a=t.getFlags();if(a&Ao)return;const n=t.getDesc();if(a&D.EREV&&!la(n))return;const o=t.getDate(),r=o.getDate(),i=o.abs()%7,l=o.getMonth(),c=i===6,d=r===1||r===30,g=t.basename(),_=g==="Pesach";if(e&&_)return c?r===15||r===21?n+" (on Shabbat)":"Pesach Shabbat Chol ha-Moed":n;if(r===1&&l===V.TISHREI)return c?"Rosh Hashana I (on Shabbat)":"Rosh Hashana I";const f=t.cholHaMoedDay;if(typeof f=="number"){if(c)return g+" Shabbat Chol ha-Moed";if(n==="Sukkot VII (Hoshana Raba)")return"Sukkot Final Day (Hoshana Raba)";if(_&&f){if(i===0&&n==="Pesach IV (CH''M)")return"Pesach Chol ha-Moed Day 2 on Sunday";if(i===1&&n==="Pesach V (CH''M)")return"Pesach Chol ha-Moed Day 3 on Monday"}return`${g} Chol ha-Moed Day ${f}`}const E=t.chanukahDay;if(typeof E=="number")return c&&d?"Shabbat Rosh Chodesh Chanukah":d&&E===7?"Chanukah Day 7 (on Rosh Chodesh)":c?`Chanukah Day ${E} (on Shabbat)`:`Chanukah Day ${E}`;if(d&&(n==="Shabbat HaChodesh"||n==="Shabbat Shekalim"))return n+" (on Rosh Chodesh)";if(e&&n==="Shmini Atzeret")return"Simchat Torah"+(c?" (on Shabbat)":"");if(n!=="Chag HaBanot"){if(c&&n.substring(0,7)!=="Shabbat"){if(d)return n==="Rosh Chodesh Tevet"?"Shabbat Rosh Chodesh Chanukah":"Shabbat Rosh Chodesh";const C=n+" (on Shabbat)";if(la(C))return C}if(la(n))return n;if(c){const C=o.next().getDate();if(C===30||C===1)return"Shabbat Machar Chodesh"}if(n!=="Rosh Hashana LaBehemot"){if(n==="Rosh Chodesh Tevet")return c?"Shabbat Rosh Chodesh Chanukah":r===30||u.shortKislev(o.getFullYear())?"Chanukah Day 6":"Chanukah Day 7 (on Rosh Chodesh)";if(d)return n;if(n==="Tish'a B'Av (observed)")return"Tish'a B'Av"}}}/*! @hebcal/leyning v9.0.2 */function oi(t,e){const a=t.split(":").map(o=>+o),n=e.split(":").map(o=>+o);return a[0]*100+a[1]<n[0]*100+n[1]}function Jt(t){const e=Object.keys(t).filter(r=>{if(r.length===1)return!0;const i=r.charCodeAt(0);return i>=48&&i<=57});let a=t[e[0]],n=a;const o=[];for(let r=0;r<e.length;r++){const i=e[r],l=t[i];if(r===e.length-1&&l.k===n.k&&l.e===n.e)continue;const c=+n.e.split(":")[0],d=+l.b.split(":")[0],g=d===c||d===c+1;r!==0&&(l.k!==a.k||oi(l.b,a.e)||!g)&&(o.push({k:a.k,b:a.b,e:n.e}),a=l),n=l}return o.push({k:a.k,b:a.b,e:n.e}),o}function be(t){Array.isArray(t)||(t=[t]);let e=t[0],a=vn(e,!0);for(let n=1;n<t.length;n++){const o=t[n];o.k===e.k?a+=", ":a+=`; ${o.k} `,a+=vn(o,!1),e=o}return a}/*! @hebcal/leyning v9.0.2 */function $t(t,e,a){if(typeof t!="string")return;const n=xo(t);if(typeof n>"u")return;const o=n.il;if(typeof o=="boolean"&&typeof a=="boolean"&&a!==o)return;const r={name:{en:t,he:P.lookupTranslation(t,"he")}};if(n.fullkriyah){if(r.fullkriyah=$e(n.fullkriyah),t==="Sukkot Shabbat Chol ha-Moed"&&e){r.fullkriyah.M=r.fullkriyah[`M-day${e}`];for(let l=1;l<=5;l++)delete r.fullkriyah[`M-day${l}`]}if(typeof r.fullkriyah[1]=="object"){const l=Jt(r.fullkriyah);r.summary=be(l),l.length>1&&(r.summaryParts=l)}Object.values(r.fullkriyah).map(l=>Le(l))}if(n.haft){const l=r.haft=De(n.haft);r.haftara=be(l),r.haftaraNumV=Qe(l)}if(n.seph){const l=r.seph=De(n.seph);r.sephardic=be(l),r.sephardicNumV=Qe(l)}let i=n.megillah;if(a&&t==="Pesach I (on Shabbat)"&&(i="Song of Songs"),i){const l=lo[i],c={};for(let d=1;d<l.length;d++){const g=l[d];c[`${d}`]={k:i,b:`${d}:1`,e:`${d}:${g}`,v:g}}r.megillah=c}return n.note&&(r.note=n.note),r}function ri(t,e=!1){if(typeof t!="object"||typeof t.getFlags!="function")throw new TypeError(`Bad event argument: ${JSON.stringify(t)}`);if(typeof t.eventTime<"u")return;if(t.getFlags()&D.PARSHA_HASHAVUA)throw new TypeError(`Event should be a holiday: ${t.getDesc()}`);if(t.getFlags()&Ao)return;const a=rn(t,e);return $t(a,t.cholHaMoedDay,e)}/*! @hebcal/leyning v9.0.2 */const si={num:1,hebrew:"בְּרֵאשִׁית",book:1,haft:{k:"Isaiah",b:"42:5",e:"43:10"},seph:{k:"Isaiah",b:"42:5",e:"42:21"},fullkriyah:{1:["1:1","2:3"],2:["2:4","2:19"],3:["2:20","3:21"],4:["3:22","4:18"],5:["4:19","4:22"],6:["4:23","5:24"],7:["5:25","6:8"],M:["6:5","6:8"]},weekday:{1:["1:1","1:5"],2:["1:6","1:8"],3:["1:9","1:13"]}},ii={num:2,hebrew:"נֹחַ",book:1,haft:{k:"Isaiah",b:"54:1",e:"55:5"},seph:{k:"Isaiah",b:"54:1",e:"54:10"},fullkriyah:{1:["6:9","6:22"],2:["7:1","7:16"],3:["7:17","8:14"],4:["8:15","9:7"],5:["9:8","9:17"],6:["9:18","10:32"],7:["11:1","11:32"],M:["11:29","11:32"]},weekday:{1:["6:9","6:16"],2:["6:17","6:19"],3:["6:20","6:22"]}},li={num:4,hebrew:"וַיֵּרָא",book:1,haft:{k:"II Kings",b:"4:1",e:"4:37"},seph:{k:"II Kings",b:"4:1",e:"4:23"},fullkriyah:{1:["18:1","18:14"],2:["18:15","18:33"],3:["19:1","19:20"],4:["19:21","21:4"],5:["21:5","21:21"],6:["21:22","21:34"],7:["22:1","22:24"],M:["22:20","22:24"]},weekday:{1:["18:1","18:5"],2:["18:6","18:8"],3:["18:9","18:14"]}},ci={num:6,hebrew:"תּוֹלְדוֹת",book:1,haft:{k:"Malachi",b:"1:1",e:"2:7"},fullkriyah:{1:["25:19","26:5"],2:["26:6","26:12"],3:["26:13","26:22"],4:["26:23","26:29"],5:["26:30","27:27"],6:["27:28","28:4"],7:["28:5","28:9"],M:["28:7","28:9"]},weekday:{1:["25:19","25:22"],2:["25:23","25:26"],3:["25:27","26:5"]}},di={num:7,hebrew:"וַיֵּצֵא",book:1,haft:{k:"Hosea",b:"12:13",e:"14:10"},seph:{k:"Hosea",b:"11:7",e:"12:12"},fullkriyah:{1:["28:10","28:22"],2:["29:1","29:17"],3:["29:18","30:13"],4:["30:14","30:27"],5:["30:28","31:16"],6:["31:17","31:42"],7:["31:43","32:3"],M:["32:1","32:3"]},weekday:{1:["28:10","28:12"],2:["28:13","28:17"],3:["28:18","28:22"]}},hi={num:8,hebrew:"וַיִּשְׁלַח",book:1,haft:{k:"Obadiah",b:"1:1",e:"1:21"},fullkriyah:{1:["32:4","32:13"],2:["32:14","32:30"],3:["32:31","33:5"],4:["33:6","33:20"],5:["34:1","35:11"],6:["35:12","36:19"],7:["36:20","36:43"],M:["36:40","36:43"]},weekday:{1:["32:4","32:6"],2:["32:7","32:9"],3:["32:10","32:13"]}},ui={num:9,hebrew:"וַיֵּשֶׁב",book:1,haft:{k:"Amos",b:"2:6",e:"3:8"},fullkriyah:{1:["37:1","37:11"],2:["37:12","37:22"],3:["37:23","37:36"],4:["38:1","38:30"],5:["39:1","39:6"],6:["39:7","39:23"],7:["40:1","40:23"],M:["40:20","40:23"]},weekday:{1:["37:1","37:3"],2:["37:4","37:7"],3:["37:8","37:11"]}},pi={num:10,hebrew:"מִקֵּץ",book:1,haft:{k:"I Kings",b:"3:15",e:"4:1"},fullkriyah:{1:["41:1","41:14"],2:["41:15","41:38"],3:["41:39","41:52"],4:["41:53","42:18"],5:["42:19","43:15"],6:["43:16","43:29"],7:["43:30","44:17"],M:["44:14","44:17"]},weekday:{1:["41:1","41:4"],2:["41:5","41:7"],3:["41:8","41:14"]}},mi={num:11,hebrew:"וַיִּגַּשׁ",book:1,haft:{k:"Ezekiel",b:"37:15",e:"37:28"},fullkriyah:{1:["44:18","44:30"],2:["44:31","45:7"],3:["45:8","45:18"],4:["45:19","45:27"],5:["45:28","46:27"],6:["46:28","47:10"],7:["47:11","47:27"],M:["47:25","47:27"]},weekday:{1:["44:18","44:20"],2:["44:21","44:24"],3:["44:25","44:30"]}},fi={num:12,hebrew:"וַיְחִי",book:1,haft:{k:"I Kings",b:"2:1",e:"2:12"},fullkriyah:{1:["47:28","48:9"],2:["48:10","48:16"],3:["48:17","48:22"],4:["49:1","49:18"],5:["49:19","49:26"],6:["49:27","50:20"],7:["50:21","50:26"],M:["50:23","50:26"]},weekday:{1:["47:28","47:31"],2:["48:1","48:3"],3:["48:4","48:9"]}},bi={num:13,hebrew:"שְׁמוֹת",book:2,haft:[{k:"Isaiah",b:"27:6",e:"28:13"},{k:"Isaiah",b:"29:22",e:"29:23"}],seph:{k:"Jeremiah",b:"1:1",e:"2:3"},fullkriyah:{1:["1:1","1:17"],2:["1:18","2:10"],3:["2:11","2:25"],4:["3:1","3:15"],5:["3:16","4:17"],6:["4:18","4:31"],7:["5:1","6:1"],M:["5:22","6:1"]},weekday:{1:["1:1","1:7"],2:["1:8","1:12"],3:["1:13","1:17"]}},gi={num:14,hebrew:"וָאֵרָא",book:2,haft:{k:"Ezekiel",b:"28:25",e:"29:21"},fullkriyah:{1:["6:2","6:13"],2:["6:14","6:28"],3:["6:29","7:7"],4:["7:8","8:6"],5:["8:7","8:18"],6:["8:19","9:16"],7:["9:17","9:35"],M:["9:33","9:35"]},weekday:{1:["6:2","6:5"],2:["6:6","6:9"],3:["6:10","6:13"]}},ki={num:15,hebrew:"בֹּא",book:2,haft:{k:"Jeremiah",b:"46:13",e:"46:28"},fullkriyah:{1:["10:1","10:11"],2:["10:12","10:23"],3:["10:24","11:3"],4:["11:4","12:20"],5:["12:21","12:28"],6:["12:29","12:51"],7:["13:1","13:16"],M:["13:14","13:16"]},weekday:{1:["10:1","10:3"],2:["10:4","10:6"],3:["10:7","10:11"]}},_i={num:16,hebrew:"בְּשַׁלַּח",book:2,haft:{k:"Judges",b:"4:4",e:"5:31"},seph:{k:"Judges",b:"5:1",e:"5:31"},fullkriyah:{1:["13:17","14:8"],2:["14:9","14:14"],3:["14:15","14:25"],4:["14:26","15:26"],5:["15:27","16:10"],6:["16:11","16:36"],7:["17:1","17:16"],M:["17:14","17:16"]},weekday:{1:["13:17","13:22"],2:["14:1","14:4"],3:["14:5","14:8"]}},yi={num:17,hebrew:"יִתְרוֹ",book:2,haft:[{k:"Isaiah",b:"6:1",e:"7:6"},{k:"Isaiah",b:"9:5",e:"9:6"}],seph:{k:"Isaiah",b:"6:1",e:"6:13"},fullkriyah:{1:["18:1","18:12"],2:["18:13","18:23"],3:["18:24","18:27"],4:["19:1","19:6"],5:["19:7","19:19"],6:["19:20","20:14"],7:["20:15","20:23"],M:["20:19","20:23"]},weekday:{1:["18:1","18:4"],2:["18:5","18:8"],3:["18:9","18:12"]}},Ei={num:18,hebrew:"מִּשְׁפָּטִים",book:2,haft:[{k:"Jeremiah",b:"34:8",e:"34:22"},{k:"Jeremiah",b:"33:25",e:"33:26"}],fullkriyah:{1:["21:1","21:19"],2:["21:20","22:3"],3:["22:4","22:26"],4:["22:27","23:5"],5:["23:6","23:19"],6:["23:20","23:25"],7:["23:26","24:18"],M:["24:15","24:18"]},weekday:{1:["21:1","21:6"],2:["21:7","21:11"],3:["21:12","21:19"]}},vi={num:19,hebrew:"תְּרוּמָה",book:2,haft:{k:"I Kings",b:"5:26",e:"6:13"},fullkriyah:{1:["25:1","25:16"],2:["25:17","25:30"],3:["25:31","26:14"],4:["26:15","26:30"],5:["26:31","26:37"],6:["27:1","27:8"],7:["27:9","27:19"],M:["27:17","27:19"]},weekday:{1:["25:1","25:5"],2:["25:6","25:9"],3:["25:10","25:16"]}},xi={num:20,hebrew:"תְּצַוֶּה",book:2,haft:{k:"Ezekiel",b:"43:10",e:"43:27"},fullkriyah:{1:["27:20","28:12"],2:["28:13","28:30"],3:["28:31","28:43"],4:["29:1","29:18"],5:["29:19","29:37"],6:["29:38","29:46"],7:["30:1","30:10"],M:["30:8","30:10"]},weekday:{1:["27:20","28:5"],2:["28:6","28:9"],3:["28:10","28:12"]}},Ai={num:22,hebrew:"וַיַּקְהֵל",book:2,haft:{k:"I Kings",b:"7:40",e:"7:50"},seph:{k:"I Kings",b:"7:13",e:"7:26"},fullkriyah:{1:["35:1","35:20"],2:["35:21","35:29"],3:["35:30","36:7"],4:["36:8","36:19"],5:["36:20","37:16"],6:["37:17","37:29"],7:["38:1","38:20"],M:["38:18","38:20"]},weekday:{1:["35:1","35:3"],2:["35:4","35:10"],3:["35:11","35:20"]}},Ii={num:23,hebrew:"פְקוּדֵי",book:2,haft:{k:"I Kings",b:"7:51",e:"8:21"},seph:{k:"I Kings",b:"7:40",e:"7:50"},fullkriyah:{1:["38:21","39:1"],2:["39:2","39:21"],3:["39:22","39:32"],4:["39:33","39:43"],5:["40:1","40:16"],6:["40:17","40:27"],7:["40:28","40:38"],M:["40:34","40:38"]},weekday:{1:["38:21","38:23"],2:["38:24","38:27"],3:["38:28","39:1"]}},wi={num:24,hebrew:"וַיִּקְרָא",book:3,haft:{k:"Isaiah",b:"43:21",e:"44:23"},fullkriyah:{1:["1:1","1:13"],2:["1:14","2:6"],3:["2:7","2:16"],4:["3:1","3:17"],5:["4:1","4:26"],6:["4:27","5:10"],7:["5:11","5:26"],M:["5:24","5:26"]},weekday:{1:["1:1","1:4"],2:["1:5","1:9"],3:["1:10","1:13"]}},Si={num:25,hebrew:"צַו",book:3,haft:[{k:"Jeremiah",b:"7:21",e:"8:3"},{k:"Jeremiah",b:"9:22",e:"9:23"}],fullkriyah:{1:["6:1","6:11"],2:["6:12","7:10"],3:["7:11","7:38"],4:["8:1","8:13"],5:["8:14","8:21"],6:["8:22","8:29"],7:["8:30","8:36"],M:["8:33","8:36"]},weekday:{1:["6:1","6:3"],2:["6:4","6:6"],3:["6:7","6:11"]}},Ti={num:26,hebrew:"שְּׁמִינִי",book:3,haft:{k:"II Samuel",b:"6:1",e:"7:17"},seph:{k:"II Samuel",b:"6:1",e:"6:19"},fullkriyah:{1:["9:1","9:16"],2:["9:17","9:23"],3:["9:24","10:11"],4:["10:12","10:15"],5:["10:16","10:20"],6:["11:1","11:32"],7:["11:33","11:47"],M:["11:45","11:47"]},weekday:{1:["9:1","9:6"],2:["9:7","9:10"],3:["9:11","9:16"]}},Ci={num:27,hebrew:"תַזְרִיעַ",book:3,haft:{k:"II Kings",b:"4:42",e:"5:19"},fullkriyah:{1:["12:1","13:5"],2:["13:6","13:17"],3:["13:18","13:23"],4:["13:24","13:28"],5:["13:29","13:39"],6:["13:40","13:54"],7:["13:55","13:59"],M:["13:57","13:59"]},weekday:{1:["12:1","12:4"],2:["12:5","12:8"],3:["13:1","13:5"]}},Mi={num:28,hebrew:"מְּצֹרָע",book:3,haft:{k:"II Kings",b:"7:3",e:"7:20"},fullkriyah:{1:["14:1","14:12"],2:["14:13","14:20"],3:["14:21","14:32"],4:["14:33","14:53"],5:["14:54","15:15"],6:["15:16","15:28"],7:["15:29","15:33"],M:["15:31","15:33"]},weekday:{1:["14:1","14:5"],2:["14:6","14:9"],3:["14:10","14:12"]}},Li={num:30,hebrew:"קְדשִׁים",book:3,haft:{k:"Ezekiel",b:"22:1",e:"22:19"},seph:{k:"Ezekiel",b:"20:2",e:"20:20"},fullkriyah:{1:["19:1","19:14"],2:["19:15","19:22"],3:["19:23","19:32"],4:["19:33","19:37"],5:["20:1","20:7"],6:["20:8","20:22"],7:["20:23","20:27"],M:["20:25","20:27"]},weekday:{1:["19:1","19:4"],2:["19:5","19:10"],3:["19:11","19:14"]}},Di={num:31,hebrew:"אֱמוֹר",book:3,haft:{k:"Ezekiel",b:"44:15",e:"44:31"},fullkriyah:{1:["21:1","21:15"],2:["21:16","22:16"],3:["22:17","22:33"],4:["23:1","23:22"],5:["23:23","23:32"],6:["23:33","23:44"],7:["24:1","24:23"],M:["24:21","24:23"]},weekday:{1:["21:1","21:6"],2:["21:7","21:12"],3:["21:13","21:15"]}},Ri={num:32,hebrew:"בְּהַר",book:3,haft:{k:"Jeremiah",b:"32:6",e:"32:27"},fullkriyah:{1:["25:1","25:13"],2:["25:14","25:18"],3:["25:19","25:24"],4:["25:25","25:28"],5:["25:29","25:38"],6:["25:39","25:46"],7:["25:47","26:2"],M:["25:55","26:2"]},weekday:{1:["25:1","25:3"],2:["25:4","25:7"],3:["25:8","25:13"]}},Hi={num:33,hebrew:"בְּחֻקֹּתַי",book:3,haft:{k:"Jeremiah",b:"16:19",e:"17:14"},fullkriyah:{1:["26:3","26:5"],2:["26:6","26:9"],3:["26:10","26:46"],4:["27:1","27:15"],5:["27:16","27:21"],6:["27:22","27:28"],7:["27:29","27:34"],M:["27:32","27:34"]},weekday:{1:["26:3","26:5"],2:["26:6","26:9"],3:["26:10","26:13"]}},Pi={num:34,hebrew:"בְּמִדְבַּר",book:4,haft:{k:"Hosea",b:"2:1",e:"2:22"},fullkriyah:{1:["1:1","1:19"],2:["1:20","1:54"],3:["2:1","2:34"],4:["3:1","3:13"],5:["3:14","3:39"],6:["3:40","3:51"],7:["4:1","4:20"],M:["4:17","4:20"]},weekday:{1:["1:1","1:4"],2:["1:5","1:16"],3:["1:17","1:19"]}},Oi={num:35,hebrew:"נָשׂא",book:4,haft:{k:"Judges",b:"13:2",e:"13:25"},fullkriyah:{1:["4:21","4:37"],2:["4:38","4:49"],3:["5:1","5:10"],4:["5:11","6:27"],5:["7:1","7:41"],6:["7:42","7:71"],7:["7:72","7:89"],M:["7:87","7:89"]},weekday:{1:["4:21","4:24"],2:["4:25","4:28"],3:["4:29","4:33"]}},Ni={num:38,hebrew:"קוֹרַח",book:4,haft:{k:"I Samuel",b:"11:14",e:"12:22"},fullkriyah:{1:["16:1","16:13"],2:["16:14","16:19"],3:["16:20","17:8"],4:["17:9","17:15"],5:["17:16","17:24"],6:["17:25","18:20"],7:["18:21","18:32"],M:["18:30","18:32"]},weekday:{1:["16:1","16:3"],2:["16:4","16:7"],3:["16:8","16:13"]}},Vi={num:39,hebrew:"חֻקַּת",book:4,haft:{k:"Judges",b:"11:1",e:"11:33"},fullkriyah:{1:["19:1","19:17"],2:["19:18","20:6"],3:["20:7","20:13"],4:["20:14","20:21"],5:["20:22","21:9"],6:["21:10","21:20"],7:["21:21","22:1"],M:["21:34","22:1"]},weekday:{1:["19:1","19:6"],2:["19:7","19:9"],3:["19:10","19:17"]}},ji={num:40,hebrew:"בָּלָק",book:4,haft:{k:"Micah",b:"5:6",e:"6:8"},fullkriyah:{1:["22:2","22:12"],2:["22:13","22:20"],3:["22:21","22:38"],4:["22:39","23:12"],5:["23:13","23:26"],6:["23:27","24:13"],7:["24:14","25:9"],M:["25:7","25:9"]},weekday:{1:["22:2","22:4"],2:["22:5","22:7"],3:["22:8","22:12"]}},$i={num:41,hebrew:"פִּינְחָס",book:4,haft:{k:"I Kings",b:"18:46",e:"19:21"},fullkriyah:{1:["25:10","26:4"],2:["26:5","26:51"],3:["26:52","27:5"],4:["27:6","27:23"],5:["28:1","28:15"],6:["28:16","29:11"],7:["29:12","30:1"],M:["29:35","30:1"]},weekday:{1:["25:10","25:12"],2:["25:13","25:15"],3:["25:16","26:4"]}},zi={num:42,hebrew:"מַּטּוֹת",book:4,haft:{k:"Jeremiah",b:"1:1",e:"2:3"},fullkriyah:{1:["30:2","30:17"],2:["31:1","31:12"],3:["31:13","31:24"],4:["31:25","31:41"],5:["31:42","31:54"],6:["32:1","32:19"],7:["32:20","32:42"],M:["32:39","32:42"]},weekday:{1:["30:2","30:9"],2:["30:10","30:13"],3:["30:14","30:17"]}},Bi={num:43,hebrew:"מַסְעֵי",book:4,haft:[{k:"Jeremiah",b:"2:4",e:"2:28"},{k:"Jeremiah",b:"3:4",e:"3:4"}],seph:[{k:"Jeremiah",b:"2:4",e:"2:28"},{k:"Jeremiah",b:"4:1",e:"4:2"}],fullkriyah:{1:["33:1","33:10"],2:["33:11","33:49"],3:["33:50","34:15"],4:["34:16","34:29"],5:["35:1","35:8"],6:["35:9","35:34"],7:["36:1","36:13"],M:["36:11","36:13"]},weekday:{1:["33:1","33:3"],2:["33:4","33:6"],3:["33:7","33:10"]}},Yi={num:44,hebrew:"דְּבָרִים",book:5,haft:{k:"Isaiah",b:"1:1",e:"1:27"},fullkriyah:{1:["1:1","1:10"],2:["1:11","1:21"],3:["1:22","1:38"],4:["1:39","2:1"],5:["2:2","2:30"],6:["2:31","3:14"],7:["3:15","3:22"],M:["3:20","3:22"]},weekday:{1:["1:1","1:3"],2:["1:4","1:7"],3:["1:8","1:11"]}},Ki={num:45,hebrew:"וָאֶתְחַנַּן",book:5,haft:{k:"Isaiah",b:"40:1",e:"40:26"},fullkriyah:{1:["3:23","4:4"],2:["4:5","4:40"],3:["4:41","4:49"],4:["5:1","5:18"],5:["5:19","6:3"],6:["6:4","6:25"],7:["7:1","7:11"],M:["7:9","7:11"]},weekday:{1:["3:23","3:25"],2:["3:26","4:4"],3:["4:5","4:8"]}},Fi={num:46,hebrew:"עֵקֶב",book:5,haft:{k:"Isaiah",b:"49:14",e:"51:3"},fullkriyah:{1:["7:12","8:10"],2:["8:11","9:3"],3:["9:4","9:29"],4:["10:1","10:11"],5:["10:12","11:9"],6:["11:10","11:21"],7:["11:22","11:25"],M:["11:22","11:25"]},weekday:{1:["7:12","7:21"],2:["7:22","8:3"],3:["8:4","8:10"]}},Ui={num:48,hebrew:"שׁוֹפְטִים",book:5,haft:{k:"Isaiah",b:"51:12",e:"52:12"},fullkriyah:{1:["16:18","17:13"],2:["17:14","17:20"],3:["18:1","18:5"],4:["18:6","18:13"],5:["18:14","19:13"],6:["19:14","20:9"],7:["20:10","21:9"],M:["21:7","21:9"]},weekday:{1:["16:18","16:20"],2:["16:21","17:10"],3:["17:11","17:13"]}},qi={num:51,hebrew:"נִצָּבִים",book:5,haft:{k:"Isaiah",b:"61:10",e:"63:9"},fullkriyah:{1:["29:9","29:11"],2:["29:12","29:14"],3:["29:15","29:28"],4:["30:1","30:6"],5:["30:7","30:10"],6:["30:11","30:14"],7:["30:15","30:20"],M:["30:15","30:20"]},weekday:{1:["29:9","29:11"],2:["29:12","29:14"],3:["29:15","29:28"]}},Ji={num:52,hebrew:"וַיֵּלֶךְ",book:5,haft:{k:"Isaiah",b:"55:6",e:"56:8"},fullkriyah:{1:["31:1","31:3"],2:["31:4","31:6"],3:["31:7","31:9"],4:["31:10","31:13"],5:["31:14","31:19"],6:["31:20","31:24"],7:["31:25","31:30"],M:["31:28","31:30"]},weekday:{1:["31:1","31:3"],2:["31:4","31:6"],3:["31:7","31:13"]}};var Gi={Bereshit:si,Noach:ii,"Lech-Lecha":{num:3,hebrew:"לֶךְ־לְךָ",book:1,haft:{k:"Isaiah",b:"40:27",e:"41:16"},fullkriyah:{1:["12:1","12:13"],2:["12:14","13:4"],3:["13:5","13:18"],4:["14:1","14:20"],5:["14:21","15:6"],6:["15:7","17:6"],7:["17:7","17:27"],M:["17:24","17:27"]},weekday:{1:["12:1","12:3"],2:["12:4","12:9"],3:["12:10","12:13"]}},Vayera:li,"Chayei Sara":{num:5,hebrew:"חַיֵּי שָֹרָה",book:1,haft:{k:"I Kings",b:"1:1",e:"1:31"},fullkriyah:{1:["23:1","23:16"],2:["23:17","24:9"],3:["24:10","24:26"],4:["24:27","24:52"],5:["24:53","24:67"],6:["25:1","25:11"],7:["25:12","25:18"],M:["25:16","25:18"]},weekday:{1:["23:1","23:7"],2:["23:8","23:12"],3:["23:13","23:16"]}},Toldot:ci,Vayetzei:di,Vayishlach:hi,Vayeshev:ui,Miketz:pi,Vayigash:mi,Vayechi:fi,Shemot:bi,Vaera:gi,Bo:ki,Beshalach:_i,Yitro:yi,Mishpatim:Ei,Terumah:vi,Tetzaveh:xi,"Ki Tisa":{num:21,hebrew:"כִּי תִשָּׂא",book:2,haft:{k:"I Kings",b:"18:1",e:"18:39"},seph:{k:"I Kings",b:"18:20",e:"18:39"},fullkriyah:{1:["30:11","31:17"],2:["31:18","33:11"],3:["33:12","33:16"],4:["33:17","33:23"],5:["34:1","34:9"],6:["34:10","34:26"],7:["34:27","34:35"],M:["34:33","34:35"]},weekday:{1:["30:11","30:13"],2:["30:14","30:16"],3:["30:17","30:21"]}},Vayakhel:Ai,Pekudei:Ii,Vayikra:wi,Tzav:Si,Shmini:Ti,Tazria:Ci,Metzora:Mi,"Achrei Mot":{num:29,hebrew:"אַחֲרֵי מוֹת",book:3,haft:{k:"Amos",b:"9:7",e:"9:15"},seph:{k:"Ezekiel",b:"22:1",e:"22:16"},fullkriyah:{1:["16:1","16:17"],2:["16:18","16:24"],3:["16:25","16:34"],4:["17:1","17:7"],5:["17:8","18:5"],6:["18:6","18:21"],7:["18:22","18:30"],M:["18:28","18:30"]},weekday:{1:["16:1","16:6"],2:["16:7","16:11"],3:["16:12","16:17"]}},Kedoshim:Li,Emor:Di,Behar:Ri,Bechukotai:Hi,Bamidbar:Pi,Nasso:Oi,"Beha'alotcha":{num:36,hebrew:"בְּהַעֲלֹתְךָ",book:4,haft:{k:"Zechariah",b:"2:14",e:"4:7"},fullkriyah:{1:["8:1","8:14"],2:["8:15","8:26"],3:["9:1","9:14"],4:["9:15","10:10"],5:["10:11","10:34"],6:["10:35","11:29"],7:["11:30","12:16"],M:["12:14","12:16"]},weekday:{1:["8:1","8:4"],2:["8:5","8:9"],3:["8:10","8:14"]}},"Sh'lach":{num:37,hebrew:"שְׁלַח־לְךָ",book:4,haft:{k:"Joshua",b:"2:1",e:"2:24"},fullkriyah:{1:["13:1","13:20"],2:["13:21","14:7"],3:["14:8","14:25"],4:["14:26","15:7"],5:["15:8","15:16"],6:["15:17","15:26"],7:["15:27","15:41"],M:["15:37","15:41"]},weekday:{1:["13:1","13:3"],2:["13:4","13:16"],3:["13:17","13:20"]}},Korach:Ni,Chukat:Vi,Balak:ji,Pinchas:$i,Matot:zi,Masei:Bi,Devarim:Yi,Vaetchanan:Ki,Eikev:Fi,"Re'eh":{num:47,hebrew:"רְאֵה",book:5,haft:{k:"Isaiah",b:"54:11",e:"55:5"},fullkriyah:{1:["11:26","12:10"],2:["12:11","12:28"],3:["12:29","13:19"],4:["14:1","14:21"],5:["14:22","14:29"],6:["15:1","15:18"],7:["15:19","16:17"],M:["16:13","16:17"]},weekday:{1:["11:26","11:31"],2:["11:32","12:5"],3:["12:6","12:10"]}},Shoftim:Ui,"Ki Teitzei":{num:49,hebrew:"כִּי־תֵצֵא",book:5,haft:{k:"Isaiah",b:"54:1",e:"54:10"},fullkriyah:{1:["21:10","21:21"],2:["21:22","22:7"],3:["22:8","23:7"],4:["23:8","23:24"],5:["23:25","24:4"],6:["24:5","24:13"],7:["24:14","25:19"],M:["25:17","25:19"]},weekday:{1:["21:10","21:14"],2:["21:15","21:17"],3:["21:18","21:21"]}},"Ki Tavo":{num:50,hebrew:"כִּי־תָבוֹא",book:5,haft:{k:"Isaiah",b:"60:1",e:"60:22"},fullkriyah:{1:["26:1","26:11"],2:["26:12","26:15"],3:["26:16","26:19"],4:["27:1","27:10"],5:["27:11","28:6"],6:["28:7","28:69"],7:["29:1","29:8"],M:["29:6","29:8"]},weekday:{1:["26:1","26:3"],2:["26:4","26:11"],3:["26:12","26:15"]}},Nitzavim:qi,Vayeilech:Ji,"Ha'azinu":{num:53,hebrew:"הַאֲזִינוּ",book:5,haft:{k:"II Samuel",b:"22:1",e:"22:51"},fullkriyah:{1:["32:1","32:6"],2:["32:7","32:12"],3:["32:13","32:18"],4:["32:19","32:28"],5:["32:29","32:39"],6:["32:40","32:43"],7:["32:44","32:52"],M:["32:48","32:52"]},weekday:{1:["32:1","32:3"],2:["32:4","32:6"],3:["32:7","32:12"]}},"Vezot Haberakhah":{num:54,hebrew:"וְזֹאת הַבְּרָכָה",book:5,haft:{k:"Joshua",b:"1:1",e:"1:18"},seph:{k:"Joshua",b:"1:1",e:"1:9"},fullkriyah:{1:["33:1","33:7"],2:["33:8","33:12"],3:["33:13","33:17"],4:["33:18","33:21"],5:["33:22","33:26"],6:["33:27","33:29"],7:["34:1","34:12"]},weekday:{1:["33:1","33:7"],2:["33:8","33:12"],3:["33:13","33:17"]}},"Vayakhel-Pekudei":{num:[22,23],combined:!0,p1:"Vayakhel",p2:"Pekudei",num1:22,num2:23,book:2,fullkriyah:{1:["35:1","35:29"],2:["35:30","37:16"],3:["37:17","37:29"],4:["38:1","39:1"],5:["39:2","39:21"],6:["39:22","39:43"],7:["40:1","40:38"],M:["40:34","40:38"]}},"Tazria-Metzora":{num:[27,28],combined:!0,p1:"Tazria",p2:"Metzora",num1:27,num2:28,book:3,fullkriyah:{1:["12:1","13:23"],2:["13:24","13:39"],3:["13:40","13:54"],4:["13:55","14:20"],5:["14:21","14:32"],6:["14:33","15:15"],7:["15:16","15:33"],M:["15:31","15:33"]}},"Achrei Mot-Kedoshim":{num:[29,30],combined:!0,p1:"Achrei Mot",p2:"Kedoshim",num1:29,num2:30,book:3,haft:{k:"Amos",b:"9:7",e:"9:15"},seph:{k:"Ezekiel",b:"20:2",e:"20:20"},fullkriyah:{1:["16:1","16:24"],2:["16:25","17:7"],3:["17:8","18:21"],4:["18:22","19:14"],5:["19:15","19:32"],6:["19:33","20:7"],7:["20:8","20:27"],M:["20:25","20:27"]}},"Behar-Bechukotai":{num:[32,33],combined:!0,p1:"Behar",p2:"Bechukotai",num1:32,num2:33,book:3,fullkriyah:{1:["25:1","25:18"],2:["25:19","25:28"],3:["25:29","25:38"],4:["25:39","26:9"],5:["26:10","26:46"],6:["27:1","27:15"],7:["27:16","27:34"],M:["27:32","27:34"]}},"Chukat-Balak":{num:[39,40],combined:!0,p1:"Chukat",p2:"Balak",num1:39,num2:40,book:4,fullkriyah:{1:["19:1","20:6"],2:["20:7","20:21"],3:["20:22","21:20"],4:["21:21","22:12"],5:["22:13","22:38"],6:["22:39","23:26"],7:["23:27","25:9"],M:["25:7","25:9"]}},"Matot-Masei":{num:[42,43],combined:!0,p1:"Matot",p2:"Masei",num1:42,num2:43,book:4,fullkriyah:{1:["30:2","31:12"],2:["31:13","31:54"],3:["32:1","32:19"],4:["32:20","33:49"],5:["33:50","34:15"],6:["34:16","35:8"],7:["35:9","36:13"],M:["36:11","36:13"]}},"Nitzavim-Vayeilech":{num:[51,52],combined:!0,p1:"Nitzavim",p2:"Vayeilech",num1:51,num2:52,book:5,fullkriyah:{1:["29:9","29:28"],2:["30:1","30:6"],3:["30:7","30:14"],4:["30:15","31:6"],5:["31:7","31:13"],6:["31:14","31:19"],7:["31:20","31:30"],M:["31:28","31:30"]}}};/*! @hebcal/core v5.8.2 */const Io=0,Zi=2,Wi=5,Qi=6,Tt=V.NISAN,Xi=V.IYYAR;function el(t){if(t<5711)return null;let e=new u(27,Tt,t);return e.getDay()===Wi?e=new u(26,Tt,t):e.getDay()===Io&&(e=new u(28,Tt,t)),e}function tl(t){if(t<5708)return null;let e;const n=new u(15,Tt,t).getDay();return n===Io?e=2:n===Qi?e=3:t<5764?e=4:n===Zi?e=5:e=4,new u(e,Xi,t)}/*! @hebcal/core v5.8.2 */const X=V.NISAN,zt=V.IYYAR,Et=V.SIVAN,al=V.TAMUZ,nl=V.AV,Tn=V.ELUL,U=V.TISHREI,ca=V.CHESHVAN,wo=V.KISLEV,So=V.SHVAT,da=V.ADAR_II,ee=D.CHAG,fe=D.LIGHT_CANDLES,ue=D.YOM_TOV_ENDS,J=D.CHUL_ONLY,te=D.IL_ONLY,it=D.LIGHT_CANDLES_TZEIS,ol=D.CHANUKAH_CANDLES,rl=D.MAJOR_FAST,ye=D.MINOR_HOLIDAY,Ee=D.EREV,Z=D.CHOL_HAMOED,ie="🫓",oe="🌿🍋",To="Rosh Hashana II",Co="Erev Yom Kippur",Mo="Yom Kippur",Ra="Erev Sukkot",Ha="Sukkot I",Lo="Sukkot II",Pa="Sukkot III (CH''M)",Oa="Sukkot IV (CH''M)",Na="Sukkot V (CH''M)",Va="Sukkot VI (CH''M)",ja="Shmini Atzeret",Do="Simchat Torah",Ro="Sukkot II (CH''M)",Ho="Sukkot VII (Hoshana Raba)",Po="Chanukah: 1 Candle",Oo="Tu BiShvat",No="Erev Purim",Vo="Purim",jo="Shushan Purim",$a="Erev Pesach",za="Pesach I",$o="Pesach II",zo="Pesach II (CH''M)",Ba="Pesach III (CH''M)",Ya="Pesach IV (CH''M)",Ka="Pesach V (CH''M)",Fa="Pesach VI (CH''M)",Ua="Pesach VII",Bo="Pesach VIII",Yo="Pesach Sheni",Ko="Lag BaOmer",Fo="Erev Shavuot",Uo="Shavuot",qo="Shavuot I",Jo="Shavuot II",Go="Tu B'Av",Zo="Rosh Hashana LaBehemot",Wo="Erev Rosh Hashana",Qo="Yom Yerushalayim",Xo="Ben-Gurion Day",er="Family Day",tr="Yitzhak Rabin Memorial Day",ar="Herzl Day",nr="Jabotinsky Day",or="Sigd",rr="Yom HaAliyah",sr="Yom HaAliyah School Observance",ir="Hebrew Language Day",j={ASARA_BTEVET:"Asara B'Tevet",BIRKAT_HACHAMAH:"Birkat Hachamah",CHAG_HABANOT:"Chag HaBanot",CHANUKAH_8TH_DAY:"Chanukah: 8th Day",EREV_TISHA_BAV:"Erev Tish'a B'Av",LEIL_SELICHOT:"Leil Selichot",PURIM_KATAN:"Purim Katan",PURIM_MESHULASH:"Purim Meshulash",SHABBAT_CHAZON:"Shabbat Chazon",SHABBAT_HACHODESH:"Shabbat HaChodesh",SHABBAT_HAGADOL:"Shabbat HaGadol",SHABBAT_NACHAMU:"Shabbat Nachamu",SHABBAT_PARAH:"Shabbat Parah",SHABBAT_SHEKALIM:"Shabbat Shekalim",SHABBAT_SHIRAH:"Shabbat Shirah",SHABBAT_SHUVA:"Shabbat Shuva",SHABBAT_ZACHOR:"Shabbat Zachor",SHUSHAN_PURIM_KATAN:"Shushan Purim Katan",TAANIT_BECHOROT:"Ta'anit Bechorot",TAANIT_ESTHER:"Ta'anit Esther",TISHA_BAV:"Tish'a B'Av",TZOM_GEDALIAH:"Tzom Gedaliah",TZOM_TAMMUZ:"Tzom Tammuz",YOM_HAATZMA_UT:"Yom HaAtzma'ut",YOM_HASHOAH:"Yom HaShoah",YOM_HAZIKARON:"Yom HaZikaron",BEN_GURION_DAY:Xo,CHANUKAH_1_CANDLE:Po,EREV_PESACH:$a,EREV_PURIM:No,EREV_ROSH_HASHANA:Wo,EREV_SHAVUOT:Fo,EREV_SUKKOT:Ra,EREV_YOM_KIPPUR:Co,FAMILY_DAY:er,HEBREW_LANGUAGE_DAY:ir,HERZL_DAY:ar,JABOTINSKY_DAY:nr,LAG_BAOMER:Ko,PESACH_I:za,PESACH_II:$o,PESACH_III_CHM:Ba,PESACH_II_CHM:zo,PESACH_IV_CHM:Ya,PESACH_SHENI:Yo,PESACH_VII:Ua,PESACH_VIII:Bo,PESACH_VI_CHM:Fa,PESACH_V_CHM:Ka,PURIM:Vo,ROSH_HASHANA_II:To,ROSH_HASHANA_LABEHEMOT:Zo,SHAVUOT:Uo,SHAVUOT_I:qo,SHAVUOT_II:Jo,SHMINI_ATZERET:ja,SHUSHAN_PURIM:jo,SIGD:or,SIMCHAT_TORAH:Do,SUKKOT_I:Ha,SUKKOT_II:Lo,SUKKOT_III_CHM:Pa,SUKKOT_II_CHM:Ro,SUKKOT_IV_CHM:Oa,SUKKOT_VII_HOSHANA_RABA:Ho,SUKKOT_VI_CHM:Va,SUKKOT_V_CHM:Na,TU_BAV:Go,TU_BISHVAT:Oo,YITZHAK_RABIN_MEMORIAL_DAY:tr,YOM_HAALIYAH:rr,YOM_HAALIYAH_SCHOOL_OBSERVANCE:sr,YOM_KIPPUR:Mo,YOM_YERUSHALAYIM:Qo},sl=[{mm:U,dd:2,desc:To,flags:ee|ue,emoji:"🍏🍯"},{mm:U,dd:9,desc:Co,flags:Ee|fe},{mm:U,dd:10,desc:Mo,flags:ee|rl|ue},{mm:U,dd:14,desc:Ra,flags:J|Ee|fe,emoji:oe},{mm:U,dd:15,desc:Ha,flags:J|ee|it,emoji:oe},{mm:U,dd:16,desc:Lo,flags:J|ee|ue,emoji:oe},{mm:U,dd:17,desc:Pa,flags:J|Z,chmDay:1,emoji:oe},{mm:U,dd:18,desc:Oa,flags:J|Z,chmDay:2,emoji:oe},{mm:U,dd:19,desc:Na,flags:J|Z,chmDay:3,emoji:oe},{mm:U,dd:20,desc:Va,flags:J|Z,chmDay:4,emoji:oe},{mm:U,dd:22,desc:ja,flags:J|ee|it},{mm:U,dd:23,desc:Do,flags:J|ee|ue},{mm:U,dd:14,desc:Ra,flags:te|Ee|fe,emoji:oe},{mm:U,dd:15,desc:Ha,flags:te|ee|ue,emoji:oe},{mm:U,dd:16,desc:Ro,flags:te|Z,chmDay:1,emoji:oe},{mm:U,dd:17,desc:Pa,flags:te|Z,chmDay:2,emoji:oe},{mm:U,dd:18,desc:Oa,flags:te|Z,chmDay:3,emoji:oe},{mm:U,dd:19,desc:Na,flags:te|Z,chmDay:4,emoji:oe},{mm:U,dd:20,desc:Va,flags:te|Z,chmDay:5,emoji:oe},{mm:U,dd:22,desc:ja,flags:te|ee|ue},{mm:U,dd:21,desc:Ho,flags:fe|Z,chmDay:-1,emoji:oe},{mm:wo,dd:24,desc:Po,flags:Ee|ye|ol,emoji:"🕎1️⃣"},{mm:So,dd:15,desc:Oo,flags:ye,emoji:"🌳"},{mm:da,dd:13,desc:No,flags:Ee|ye,emoji:"🎭️📜"},{mm:da,dd:14,desc:Vo,flags:ye,emoji:"🎭️📜"},{mm:da,dd:15,desc:jo,flags:ye,emoji:"🎭️📜"},{mm:X,dd:14,desc:$a,flags:te|Ee|fe,emoji:"🫓🍷"},{mm:X,dd:15,desc:za,flags:te|ee|ue,emoji:ie},{mm:X,dd:16,desc:zo,flags:te|Z,chmDay:1,emoji:ie},{mm:X,dd:17,desc:Ba,flags:te|Z,chmDay:2,emoji:ie},{mm:X,dd:18,desc:Ya,flags:te|Z,chmDay:3,emoji:ie},{mm:X,dd:19,desc:Ka,flags:te|Z,chmDay:4,emoji:ie},{mm:X,dd:20,desc:Fa,flags:te|Z|fe,chmDay:5,emoji:ie},{mm:X,dd:21,desc:Ua,flags:te|ee|ue,emoji:ie},{mm:X,dd:14,desc:$a,flags:J|Ee|fe,emoji:"🫓🍷"},{mm:X,dd:15,desc:za,flags:J|ee|it,emoji:"🫓🍷"},{mm:X,dd:16,desc:$o,flags:J|ee|ue,emoji:ie},{mm:X,dd:17,desc:Ba,flags:J|Z,chmDay:1,emoji:ie},{mm:X,dd:18,desc:Ya,flags:J|Z,chmDay:2,emoji:ie},{mm:X,dd:19,desc:Ka,flags:J|Z,chmDay:3,emoji:ie},{mm:X,dd:20,desc:Fa,flags:J|Z|fe,chmDay:4,emoji:ie},{mm:X,dd:21,desc:Ua,flags:J|ee|it,emoji:ie},{mm:X,dd:22,desc:Bo,flags:J|ee|ue,emoji:ie},{mm:zt,dd:14,desc:Yo,flags:ye},{mm:zt,dd:18,desc:Ko,flags:ye,emoji:"🔥"},{mm:Et,dd:5,desc:Fo,flags:Ee|fe,emoji:"⛰️🌸"},{mm:Et,dd:6,desc:Uo,flags:te|ee|ue,emoji:"⛰️🌸"},{mm:Et,dd:6,desc:qo,flags:J|ee|it,emoji:"⛰️🌸"},{mm:Et,dd:7,desc:Jo,flags:J|ee|ue,emoji:"⛰️🌸"},{mm:nl,dd:15,desc:Go,flags:ye,emoji:"❤️"},{mm:Tn,dd:1,desc:Zo,flags:ye,emoji:"🐑"},{mm:Tn,dd:29,desc:Wo,flags:Ee|fe,emoji:"🍏🍯"}],il=[{firstYear:5727,mm:zt,dd:28,desc:Qo,chul:!0},{firstYear:5737,mm:wo,dd:6,desc:Xo,satPostponeToSun:!0,friPostponeToSun:!0},{firstYear:5750,mm:So,dd:30,desc:er},{firstYear:5758,mm:ca,dd:12,desc:tr,friSatMovetoThu:!0},{firstYear:5764,mm:zt,dd:10,desc:ar,satPostponeToSun:!0},{firstYear:5765,mm:al,dd:29,desc:nr,satPostponeToSun:!0},{firstYear:5769,mm:ca,dd:29,desc:or,chul:!0,suppressEmoji:!0},{firstYear:5777,mm:X,dd:10,desc:rr,chul:!0},{firstYear:5777,mm:ca,dd:7,desc:sr},{firstYear:5773,mm:V.TEVET,dd:21,desc:ir,friSatMovetoThu:!0}];/*! @hebcal/core v5.8.2 */class z extends yo{basename(){return this.getDesc().replace(/ \d{4}$/,"").replace(/ \(CH''M\)$/,"").replace(/ \(observed\)$/,"").replace(/ \(Hoshana Raba\)$/,"").replace(/ [IV]+$/,"").replace(/: \d Candles?$/,"").replace(/: 8th Day$/,"").replace(/^Erev /,"")}url(){if(this.getDate().greg().getFullYear()<100)return;const a="https://www.hebcal.com/holidays/"+this.basename().toLowerCase().replace(/'/g,"").replace(/ /g,"-")+"-"+this.urlDateSuffix();return this.getFlags()&D.IL_ONLY?a+"?i=on":a}urlDateSuffix(){const e=this.getDate().greg().getFullYear();return String(e)}getEmoji(){return this.emoji?this.emoji:this.getFlags()&D.SPECIAL_SHABBAT?"🕍":"✡️"}getCategories(){if(this.cholHaMoedDay)return["holiday","major","cholhamoed"];const e=super.getCategories();if(e[0]!=="unknown")return e;switch(this.getDesc()){case j.LAG_BAOMER:case j.LEIL_SELICHOT:case j.PESACH_SHENI:case j.EREV_PURIM:case j.PURIM_KATAN:case j.SHUSHAN_PURIM:case j.TU_BAV:case j.TU_BISHVAT:case j.ROSH_HASHANA_LABEHEMOT:return["holiday","minor"]}return["holiday","major"]}render(e){return super.render(e).replace(/'/g,"’")}renderBrief(e){return super.renderBrief(e).replace(/'/g,"’")}clone(){const e=new z(this.date,this.desc,this.mask);for(const a in this)this.hasOwnProperty(a)&&Object.defineProperty(e,a,{value:this[a]});return e}}class ll extends z{urlDateSuffix(){return oo(this.getDate().greg()).replace(/-/g,"")}}class cl extends z{constructor(e,a,n){super(e,`Rosh Hashana ${a}`,n),this.hyear=a}render(e){return P.gettext("Rosh Hashana",e)+" "+this.hyear}getEmoji(){return"🍏🍯"}}const ha="Rosh Chodesh";class ua extends z{constructor(e,a){super(e,`${ha} ${a}`,D.ROSH_CHODESH)}render(e){const a=this.getDesc().substring(ha.length+1),o=P.gettext(a,e).replace(/'/g,"’");return P.gettext(ha,e)+" "+o}basename(){return this.getDesc()}getEmoji(){return this.emoji||"🌒"}}/*! @hebcal/core v5.8.2 */const pa="Yom Kippur Katan";class dl extends z{constructor(e,a){super(e,`${pa} ${a}`,D.MINOR_FAST|D.YOM_KIPPUR_KATAN),this.nextMonthName=a,this.memo=`Minor Day of Atonement on the day preceeding Rosh Chodesh ${a}`}basename(){return this.getDesc()}render(e){const n=P.gettext(this.nextMonthName,e).replace(/'/g,"’");return P.gettext(pa,e)+" "+n}renderBrief(e){return P.gettext(pa,e)}url(){}}/*! @hebcal/core v5.8.2 */function hl(t){return t.observedInIsrael()}function ul(t){return t.observedInDiaspora()}function pl(t){return t?hl:ul}function lr(t,e){const a=u.isHDate(t)?t:new u(t),n=a.toString(),r=vl(a.getFullYear()).get(n);return typeof e>"u"||typeof r>"u"?r:r.filter(pl(e))}const ml=D.CHAG,fl=D.IL_ONLY,bl=D.LIGHT_CANDLES_TZEIS,gl=D.CHANUKAH_CANDLES,lt=D.MINOR_FAST,ve=D.SPECIAL_SHABBAT,ct=D.MODERN_HOLIDAY,Cn=D.MAJOR_FAST,Ce=D.MINOR_HOLIDAY,Mn=D.EREV,kl=0,_l=2,vt=4,ma=5,le=6,Ct=V.NISAN,Ln=V.TAMUZ,yl=V.AV,dt=V.TISHREI,fa=V.KISLEV,ba=V.TEVET,Dn=V.ADAR_I,cr=V.ADAR_II,Rn={emoji:"🇮🇱"},Hn="🕎",Pn=new _o({maxSize:400}),El=["0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣"];function vl(t){if(typeof t!="number")throw new TypeError(`bad Hebrew year: ${t}`);if(t<1||t>32658)throw new RangeError(`Hebrew year ${t} out of range 1-32658`);const e=Pn.get(t);if(e)return e;const a=new u(1,dt,t),n=new u(15,Ct,t),o=new Map;function r(...h){for(const x of h){const v=x.date.toString(),k=o.get(v);typeof k=="object"?k[0].getFlags()&Mn?k.unshift(x):k.push(x):o.set(v,[x])}}for(const h of sl){const x=new u(h.dd,h.mm,t),v=new z(x,h.desc,h.flags);h.emoji&&(v.emoji=h.emoji),h.chmDay&&(v.cholHaMoedDay=h.chmDay),r(v)}r(new cl(a,t,ml|bl));const i=a.getDay()===vt?4:3;r(new z(new u(i,dt,t),j.TZOM_GEDALIAH,lt)),r(new z(new u(u.dayOnOrBefore(le,7+a.abs())),j.SHABBAT_SHUVA,ve));const l=u.shortKislev(t)?new u(1,ba,t):new u(30,fa,t);r(new z(l,j.CHAG_HABANOT,Ce));for(let h=2;h<=8;h++){const x=new u(23+h,fa,t);r(new z(x,`Chanukah: ${h} Candles`,Ce|gl,{chanukahDay:h-1,emoji:Hn+El[h]}))}r(new z(new u(32,fa,t),j.CHANUKAH_8TH_DAY,Ce,{chanukahDay:8,emoji:Hn})),r(new ll(new u(10,ba,t),j.ASARA_BTEVET,lt));const c=n.abs();r(new z(new u(u.dayOnOrBefore(le,c-43)),j.SHABBAT_SHEKALIM,ve),new z(new u(u.dayOnOrBefore(le,c-30)),j.SHABBAT_ZACHOR,ve),new z(new u(c-(n.getDay()===_l?33:31)),j.TAANIT_ESTHER,lt));const d=u.dayOnOrBefore(le,c-14);r(new z(new u(d-7),j.SHABBAT_PARAH,ve),new z(new u(d),j.SHABBAT_HACHODESH,ve),new z(new u(u.dayOnOrBefore(le,c-1)),j.SHABBAT_HAGADOL,ve),new z(n.prev().getDay()===le?n.onOrBefore(vt):new u(14,Ct,t),j.TAANIT_BECHOROT,lt)),r(new z(new u(u.dayOnOrBefore(le,new u(1,dt,t+1).abs()-4)),j.LEIL_SELICHOT,Ce,{emoji:"🕍"})),n.getDay()===kl&&r(new z(new u(16,cr,t),j.PURIM_MESHULASH,Ce)),u.isLeapYear(t)&&(r(new z(new u(14,Dn,t),j.PURIM_KATAN,Ce,{emoji:"🎭️"})),r(new z(new u(15,Dn,t),j.SHUSHAN_PURIM_KATAN,Ce,{emoji:"🎭️"})));const g=el(t);g&&r(new z(g,j.YOM_HASHOAH,ct));const _=tl(t);_&&r(new z(_,j.YOM_HAZIKARON,ct,Rn),new z(_.next(),j.YOM_HAATZMA_UT,ct,Rn));for(const h of il)if(t>=h.firstYear){let x=new u(h.dd,h.mm,t);const v=x.getDay();h.friSatMovetoThu&&(v===ma||v===le)?x=x.onOrBefore(vt):h.friPostponeToSun&&v===ma?x=new u(x.abs()+2):h.satPostponeToSun&&v===le&&(x=x.next());const k=h.chul?ct:ct|fl,p=new z(x,h.desc,k);h.suppressEmoji||(p.emoji="🇮🇱"),r(p)}let f=new u(17,Ln,t),E;f.getDay()===le&&(f=new u(18,Ln,t),E={observed:!0}),r(new z(f,j.TZOM_TAMMUZ,lt,E));let C=new u(9,yl,t),m=j.TISHA_BAV,I;C.getDay()===le&&(C=C.next(),I={observed:!0},m+=" (observed)");const w=C.abs();r(new z(new u(u.dayOnOrBefore(le,w)),j.SHABBAT_CHAZON,ve),new z(C.prev(),j.EREV_TISHA_BAV,Mn|Cn,I),new z(C,m,Cn,I),new z(new u(u.dayOnOrBefore(le,w+7)),j.SHABBAT_NACHAMU,ve));const A=u.monthsInYear(t);for(let h=1;h<=A;h++){const x=u.getMonthName(h,t);(h===Ct?u.daysInMonth(u.monthsInYear(t-1),t-1):u.daysInMonth(h-1,t))===30?(r(new ua(new u(1,h,t),x)),r(new ua(new u(30,h-1,t),x))):h!==dt&&r(new ua(new u(1,h,t),x))}for(let h=V.IYYAR;h<=A;h++){const x=h+1;if(x===dt||x===V.CHESHVAN||x===ba)continue;let v=new u(29,h,t);const k=v.getDay();(k===ma||k===le)&&(v=v.onOrBefore(vt));const p=u.getMonthName(x,t),M=new dl(v,p);r(M)}const y=We(t,!1).find(15);r(new z(y,j.SHABBAT_SHIRAH,ve));const S=xl(t);if(S){const h=new u(S);r(new z(h,j.BIRKAT_HACHAMAH,Ce,{emoji:"☀️"}))}return Pn.set(t,o),o}function xl(t){const e=u.isLeapYear(t),a=e?cr:Ct,n=e?20:1,o=u.hebrew2abs(t,a,n);for(let r=0;r<=40;r++){const i=o+r;if((i+1373429)%10227===172)return i}return 0}/*! @hebcal/leyning v9.0.2 */function Al(t){const e=$e(t[6]),a=t[7];if(e.k!==a.k)throw new Error("Impossible to combine aliyot 6 & 7: "+JSON.stringify(t));delete t[7],t[6]={k:e.k,b:e.b,e:a.e},e.v&&a.v&&(t[6].v=e.v+a.v)}function Il(t,e){e[7]&&(Al(t),t[7]=$e(e[7]),Le(t[7])),e.M&&(t.M=$e(e.M),Le(t.M))}function wl(t,e,a,n){let o,r,i=!1;const l={};function c(f){const E=xo(f);if(E&&!(typeof E.il=="boolean"&&a!==E.il)&&(E.haft&&!i&&(o=De(E.haft),l.haftara=f,i=!0,E.seph&&(r=De(E.seph),l.sephardic=f)),E.fullkriyah)){const C=$e(n);Il(C,E.fullkriyah);for(const m of Object.keys(E.fullkriyah))l[m]=f;n=C}}const d=ft(t),_=(lr(e,a)||[]).filter(f=>!(f.getFlags()&D.ROSH_CHODESH));for(const f of _)if(f.getDesc()==="Shabbat Shuva")c(`Shabbat Shuva (with ${d})`);else{const E=rn(f,a);E&&c(E)}if(!o){const f=e.getDate();if(d==="Pinchas"&&f>17)c("Pinchas occurring after 17 Tammuz");else if(f===30||f===1){const E=d==="Masei"||d==="Matot-Masei"?`${d} on Shabbat Rosh Chodesh`:"Shabbat Rosh Chodesh";c(E)}else if(d==="Ki Teitzei"&&f===14)c("Ki Teitzei with 3rd Haftarah of Consolation");else if(d==="Kedoshim"&&(f===26||f===28||f===6))c("Kedoshim following Special Shabbat");else if(e.getMonth()!==V.AV){const E=e.next().getDate();(E===30||E===1)&&c("Shabbat Machar Chodesh")}}return{aliyot:n,reason:l,haft:o,seph:r}}/*! @hebcal/leyning v9.0.2 */const qa=Gi;function Sl(t){const e=t[0];return t.length===2&&e==="Achrei Mot"?ft(t):t.length===1||e==="Nitzavim"?e:t[1]}function dr(t){return{en:ft(t),he:t.map(a=>P.lookupTranslation(a,"he")).join("־")}}function Tl(t){const e=Bt(t),a={},n=Ft[e.book];for(const[f,E]of Object.entries(e.fullkriyah)){const C={k:n,b:E[0],e:E[1]};Le(C),a[f]=C}const o=ft(t),r=e.combined?[e.p1,e.p2]:[o],i=Jt(a),l=be(i),c={name:dr(r),parsha:r,parshaNum:e.num,summary:l,fullkriyah:a,haftara:"",haft:[]};i.length>1&&(c.summaryParts=i);const d=Sl(r),g=qa[d].haft;if(g){const f=c.haft=De(g);c.haftara=be(f),c.haftaraNumV=Qe(f)}const _=qa[d].seph;if(_){const f=c.seph=De(_);c.sephardic=be(f),c.sephardicNumV=Qe(f)}return c}function Cl(t){const e=Bt(t),n=(e.combined?Bt(e.p1):e).weekday;if(!n)throw new Error(`Parsha missing weekday: ${t}`);const o=Ft[e.book],r={};for(let i=1;i<=3;i++){const l=""+i,c=n[l],d={k:o,b:c[0],e:c[1]};Le(d),r[l]=d}return r}function Ml(t,e=!1){if(typeof t!="object"||typeof t.getFlags!="function")throw new TypeError(`Bad event argument: ${t}`);if(t.getFlags()!==D.PARSHA_HASHAVUA)throw new TypeError(`Event must be parsha hashavua: ${t.getDesc()}`);const a=t.parsha,n=Tl(a),o=t.getDate(),r=wl(a,o,e,n.fullkriyah),i=r.reason;if(r.haft){const c=n.haft=De(r.haft);if(n.haftara=be(c),n.haftaraNumV=Qe(c),r.seph){const d=n.seph=De(r.seph);n.sephardic=be(d),n.sephardicNumV=Qe(d)}else n.seph&&(delete n.seph,delete n.sephardic,delete n.sephardicNumV)}if(i[7]||i.M){n.fullkriyah=r.aliyot;const c=Jt(n.fullkriyah);n.summary=be(c),n.summaryParts=c}const l=Object.keys(i);if(l.length!==0){n.reason=i;for(const c of l)if(c==="haftara"||c==="sephardic"){const d=n[c==="haftara"?"haft":"seph"],g=Array.isArray(d)?d:[d];for(const _ of g)_.reason=i[c]}else{const d=n.fullkriyah[c];typeof d=="object"&&(d.reason=i[c])}}return n}function Bt(t){const e=ft(t),a=qa[e];if(typeof a!="object")throw new TypeError(`Bad parsha argument: ${t}`);if(a.combined){const[n,o]=e.split("-");if(a.hebrew||(a.hebrew=P.gettext(n,"he")+"־"+P.gettext(o,"he")),!a.haft){const r=n==="Nitzavim"?n:o;a.haft=Bt(r).haft}}return a}/*! @hebcal/core v5.8.2 */class Ll extends yo{constructor(e,a,n=!1,o=-1){if(!Array.isArray(a)||a.length===0||a.length>2)throw new TypeError("Bad parsha argument");const r="Parashat "+a.join("-");super(e,r,D.PARSHA_HASHAVUA),this.parsha=a,this.il=!!n,this.num=o||-1}render(e){return ko(this.parsha,e)}basename(){return this.parsha.join("-")}url(){if(this.getDate().greg().getFullYear()<100)return;const a=this.urlDateSuffix(),n="https://www.hebcal.com/sedrot/"+this.basename().toLowerCase().replace(/'/g,"").replace(/ /g,"-")+"-"+a;return this.il?n+"?i=on":n}urlDateSuffix(){return oo(this.getDate().greg()).replace(/-/g,"")}}/*! @hebcal/leyning v9.0.2 */function Dl(t,e){const a=t.getFullYear(),n=We(a,e),o=n.lookup(t);if(!o.chag)return o;if(t.getMonth()===V.TISHREI){const l=t.getDate(),c=e?22:23;if(l>2&&l<=c)return{parsha:["Vezot Haberakhah"],chag:!1,num:54,hdate:t}}const r=new u(1,V.TISHREI,a+1).abs()-1,i=r+30;for(let l=t.abs()+7;l<=i;l+=7){const d=(l>r?We(a+1,e):n).lookup(l);if(!d.chag)return d}throw new Error(`can't findParshaHaShavua for ${t}/${e}`)}function Rl(t,e,a=!1){const n=t.getDay(),o=[];let r=!1;if(n===6){const c=t.getFullYear(),g=We(c,e).lookup(t);if(!g.chag){const _=new Ll(t,g.parsha,e),f=Ml(_,e);if(a)r=!0,o.push(f);else return f}}const i=lr(t,e)||[];let l=!1;for(const c of i){const d=!!(c.getFlags()&(D.SPECIAL_SHABBAT|D.ROSH_CHODESH));if(r&&d)continue;const g=ri(c,e);if(g){if(o.some(m=>m.name.en===g.name.en))continue;const _=g.fullkriyah;_&&(l=!0),r&&l&&_.M&&!_[1]||o.push(g);const E=Hl(c,e);E&&o.push(E);const C=c.getDesc();if(e&&C==="Sukkot VII (Hoshana Raba)"||!e&&C==="Shmini Atzeret"){const m=$t("Erev Simchat Torah");o.push(m)}}}if(!l&&(n===1||n===4)){const c=t.onOrAfter(6),d=Dl(c,e),g=Cl(d.parsha),_=Jt(g),f={name:dr(d.parsha),parsha:d.parsha,parshaNum:d.num,weekday:g,summary:be(_)};o.unshift(f)}return a?o:o[0]}const On=" (Mincha)";function Hl(t,e){const a=t.getDesc()+On,n=$t(a,t.cholHaMoedDay,e);if(n)return n;const o=rn(t,e);if(o){const r=$t(o+On,t.cholHaMoedDay,e);if(r)return r}}function Pl(t,e){return nn(t.leinings,e.leinings,Ol)}function Ol(t,e){return nn(t.runs,e.runs,Nl)}function Nl(t,e){return nn(t.aliyot,e.aliyot,(a,n)=>JSON.stringify(a)===JSON.stringify(n))}const hr={[q.Megillah]:"megillah",[q.Shacharis]:"shacharis",[q.Mincha]:"mincha",[q.Maariv]:"maariv"},ur={[B.Main]:"main",[B.LastAliyah]:"last-aliyah",[B.Maftir]:"maftir",[B.Haftarah]:"haftara",[B.Megillah]:"megillah"},Vl=po(hr),jl=po(ur);class $l{constructor(e){this.settings=e}parseId(e){const[,a,n,o]=/^([-\d]+):(\w+),([\w-]+)$/.exec(e)??[],r=Vl[n],i=jl[o];if(!a||!r||!i)return null;const l=this.createLeiningDate(new u(uo(a)));if(!l)return null;const c=l.leinings.find(d=>d.id===r);return(c==null?void 0:c.runs.find(d=>d.type===i))??null}forHebrewYear(e){return this.generateCalendar({start:new u(1,V.TISHREI,e),until:new u(1,V.TISHREI,e+1)})}forEntireChumash(e){const a=this.settings.israel?23:24;let n=new u(a,V.TISHREI,e.getFullYear());n.greg()<=e.greg()&&(n=new u(a,V.TISHREI,1+e.getFullYear()));const o=We(n.getFullYear()-1,this.settings.israel);return this.generateCalendar({start:o.find("Bereshit"),until:n})}aroundDate(e){const a=new u(e);return this.generateCalendar({start:a.subtract(8,"day"),until:a.add(9,"day")})}generateCalendar({start:e,until:a}){const n=[];for(let o=e;o.abs()<a.abs();o=o.add(1,"day")){const r=this.createLeiningDate(o);r&&n.push(r)}return n}createLeiningDate(e){let a=Rl(e,this.settings.israel,!0);if(a=a.filter(o=>!o.weekday),!a.length)return null;const n={date:e.greg(),id:ho(e.greg()),title:{en:a[0].name.en??"TODO: unknown",he:P.hebrewStripNikkud(a[0].name.he??"TODO: unknown")},leinings:[]};return a[0].parsha&&(n.title={en:`Parshat ${n.title.en}`,he:`פרשת ${n.title.he}`}),n.leinings=a.flatMap(o=>{const r=[];if(!zl(o))return r;o.megillah&&o.name.en!=="Erev Purim"&&r.push(this.instanceFromMegillah(o.megillah,n));const i=this.instanceFromMainLeining(n,o);i.runs.length&&r.push(i);const l=this.settings.ashkenazi?o.haft:o.seph;return l&&i.runs.push(this.runFromHaftara(l,i)),r}),n}instanceFromMainLeining(e,a){let n=q.Shacharis;return a.name.en.includes("Mincha")&&(n=q.Mincha),a.name.en.includes("Erev")&&(n=q.Maariv),this.createInstance({date:e,isParsha:!!a.parsha,id:n,runs:this.runFromAliyot(a.fullkriyah)})}runFromHaftara(e,a){return this.createRun({aliyot:[e].flat().map(n=>oa(n)),leining:a,type:B.Haftarah})}instanceFromMegillah(e,a){const n=Object.values(e);return this.createInstance({date:a,isParsha:!1,id:q.Megillah,runs:[{aliyot:[oa({...n[0],e:Ze(n).e})],type:B.Megillah}]})}runFromAliyot(e){const a=[];let n;for(const o in e){if(!Object.prototype.hasOwnProperty.call(e,o))continue;const r=oa(e[o],Ms(o));if(n&&Ls(Ze(n.aliyot),r)){n.aliyot.push(r);continue}let i=B.Main;o!=="1"&&(i=B.LastAliyah),o==="M"&&(i=B.Maftir),n={type:i,aliyot:[r]},a.push(n)}return a}createInstance(e){const a={...e,runs:[]};return a.runs=e.runs.map(n=>this.createRun({...n,leining:a})),a}createRun(e){return{...e,id:`${e.leining.date.id}:${hr[e.leining.id]},${ur[e.type]}`,scroll:e.aliyot[0].start.scroll}}}function zl(t){return"fullkriyah"in t||"megillah"in t}const Nn=[{glyph:"א",value:1},{glyph:"ב",value:2},{glyph:"ג",value:3},{glyph:"ד",value:4},{glyph:"ה",value:5},{glyph:"ו",value:6},{glyph:"ז",value:7},{glyph:"ח",value:8},{glyph:"ט",value:9},{glyph:"י",value:10},{glyph:"כ",value:20},{glyph:"ל",value:30},{glyph:"מ",value:40},{glyph:"נ",value:50},{glyph:"ס",value:60},{glyph:"ע",value:70},{glyph:"פ",value:80},{glyph:"צ",value:90},{glyph:"ק",value:100},{glyph:"ר",value:200},{glyph:"ש",value:300},{glyph:"ת",value:400}].reverse(),pr=t=>{if(t<=0)return"";if(t===15)return"טו";if(t===16)return"טז";let e=0;for(;t<Nn[e].value;)++e;const a=Nn[e];return`${a.glyph}${pr(t-a.value)}`},Bl=t=>t.length?t.length===1?t[0]:[t[0],t[t.length-1]].join("-"):"",Yl=t=>Bl(t.map(e=>{const a=[];return e.v===1&&a.push(e.c),a.push(e.v),a.map(n=>pr(n)).join(":")})),Kl={asVersesRange:Yl},xe="׆",Fl=t=>t.replace("#(פ)","").replace(`(${xe})#`,`${xe} `).replace(`#(${xe})`,` ${xe}`).split(" ").map(e=>e.split("־").map(a=>{const n=a.split("#");return n.length<=1?n[0]:n.slice(1)}).join("־")).join(" ").replace(/\[/g,"{").replace(/\]/g,"}"),Ul=t=>t.replace("#(פ)","").replace(`(${xe})#`,`${xe} `).replace(`#(${xe})`,` ${xe}`).replace(/־/g," ").replace(/#\[.+?\]/g," ").replace(new RegExp(`[^א-ת\\s${xe}]`,"g"),"").replace(/\s{2,}/g," "),Vn=({text:t,annotated:e})=>e?Fl(t):Ul(t),jn=t=>t.replace(/[{]/g,'<span class="ktiv-kri">').replace(/[}]/g,"</span>").trim(),ql=t=>t?"mod-petucha":"",$n=t=>t.length>1?"mod-setuma":"",Jl=({text:t,verses:e,isPetucha:a,labels:n,lineIndex:o})=>`
  <tr data-class="line" data-line-index="${o}">
    <td class="line ${ql(a)}">
      ${t.map(r=>`
        <div class="column">
          ${r.map(i=>`
            <span class="fragment ${$n(r)} mod-annotations-on">${jn(Vn({text:i,annotated:!0}))}</span>
            <span class="fragment ${$n(r)} mod-annotations-off">${jn(Vn({text:i,annotated:!1}))}</span>
          `).join("")}
        </div>
      `).join("")}
      <span class="location-indicator mod-verses">${Kl.asVersesRange(e)}</span>
      <span class="location-indicator mod-aliyot" data-target-id="aliyot-range">${n}</span>
    </td>
  </tr>
`,Gl=t=>`
  <table>
    ${t.lines.map((e,a)=>Jl({lineIndex:a,...e})).join("")}
  </table>
`,{htmlToElement:Zl,purgeNode:Wl}=Xe;class Ql{constructor(e,a){this.viewModel=e,this.root=a,this.renderPrevious=this.generateRender("afterbegin"),this.renderNext=this.generateRender("beforeend"),Wl(a),this.rendered=e.startingLocation.then(async({page:n,lineNumber:o})=>{const i=[...(await this.renderNext(n)).querySelectorAll(".line")],l=o-1;if(l<i.length/2){const c=await e.fetchPreviousPage();c&&await this.renderPrevious(c)}else{const c=await e.fetchNextPage();c&&await this.renderNext(c)}return i[l]}),this.scrolled=this.rendered.then(async n=>{await new Promise(requestAnimationFrame),this.scrollTo({element:n})})}scrollTo({element:e}){const a=e.offsetTop+e.offsetParent.offsetTop;this.root.scrollTop=a+e.offsetHeight/2-this.root.offsetHeight/2,this.root.dispatchEvent(new Event("scroll"))}generateRender(e){return a=>{let n;return a.type==="message"?n=ec(a):n=Xl(a),this.root.insertAdjacentElement(e,n),n}}}function Xl(t){const e=document.createElement("div");return e.classList.add("tikkun-page"),e.tikkunPage=t,e.appendChild(Zl(Gl(t))),e}function ec(t){const e=document.createElement("div");e.classList.add("tikkun-message");const a=document.createElement("span");return a.classList.add("tikkun-message-text"),a.textContent=t.text,e.appendChild(a),e}class mr{constructor(){this.listeners={}}emit(e,a){(this.listeners[e]||[]).forEach(o=>{o(a)})}on(e,a){const n=this.listeners[e]||[];n.push(a),this.listeners[e]=n}}const tc={new:()=>new mr};class ac extends mr{constructor(e){super(),this.book=e,this.top=e.getBoundingClientRect().y+parseFloat(getComputedStyle(e).paddingTop),this.lineTrackers={first:new ka(mt.Down,e),center:new ka(mt.Down,e),last:new ka(mt.Up,e)},this.update(),e.addEventListener("scroll",oc(()=>this.update(),300))}update(){let e=!1;const a=document.documentElement.clientHeight;this.lineTrackers.first.update(this.top)&&(e=!0),this.lineTrackers.center.update(a/2)&&(e=!0),this.lineTrackers.last.update(a-1)&&(e=!0),e&&this.emit("viewport-updated",{first:this.lineTrackers.first.current,center:this.lineTrackers.center.current,last:this.lineTrackers.last.current})}}const mt={Down:{coordinate:"top",nextElement:"nextNode"},Up:{coordinate:"bottom",nextElement:"previousNode"}},nc={[-1]:mt.Up,1:mt.Down},ga=Math.sign;class ka{constructor(e,a){this.direction=e,this.root=a,this.walker=document.createTreeWalker(a,NodeFilter.SHOW_ELEMENT,n=>!(n instanceof HTMLElement)||n.tagName==="TD"?NodeFilter.FILTER_REJECT:n.dataset.lineIndex?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP)}get current(){return zn(this.walker.currentNode)}resetWalker(e){const a=document.elementFromPoint(document.documentElement.clientWidth/2,e);this.walker.currentNode=(a==null?void 0:a.closest("[data-line-index]"))??a??this.root}update(e){const a=this.current;return this.maybeUpdate(e),a!==this.current}maybeUpdate(e){var r;if(this.walker.currentNode===this.root&&this.resetWalker(e),this.walker.currentNode.isConnected||this.resetWalker(e),!(this.walker.currentNode instanceof Element))throw new Error("Not an element?");let a=!0,n=ga(0);for(;;){const i=this.walker.currentNode.getBoundingClientRect(),l=e-i[this.direction.coordinate];if(Math.abs(l)<.8*this.walker.currentNode.clientHeight)break;if(a&&Math.abs(l)>100){this.resetWalker(e),a=!1;continue}if(a=!1,n&&n!==ga(l)||(n=ga(l),!n))break;const c=this.walker.currentNode;if(this.walker[nc[n].nextElement](),this.walker.currentNode===c)break}let o=0;for(;!((r=zn(this.walker.currentNode))!=null&&r.aliyot.length)&&++o<40;)this.walker[this.direction.nextElement]()}}function zn(t){var a;if(!(t instanceof HTMLElement))return null;const e=t.closest(".tikkun-page");return((a=e==null?void 0:e.tikkunPage)==null?void 0:a.lines[Number(t.dataset.lineIndex)])??null}function oc(t,e){let a,n;return function(...o){return a||(a=!0,setTimeout(()=>a=!1,e),n=t.apply(this,o)),n}}class rc{constructor(){this.currentInfo={aliyahRange:[],currentRun:null,previousLink:null,nextLink:null,relatedRuns:[]},this.firstAliyah=null,this.lastAliyah=null}get info(){return this.currentInfo}setLine(e,a){var l,c,d,g,_,f,E,C,m,I;const n={...this.currentInfo},o=((l=a.first)==null?void 0:l.aliyot[0])??((c=a.center)==null?void 0:c.aliyot[0]),r=((d=a.last)==null?void 0:d.aliyot[0])??((g=a.center)==null?void 0:g.aliyot[0]),i=((_=a.center)==null?void 0:_.run)??((f=a.last)==null?void 0:f.run)??((E=a.first)==null?void 0:E.run);if(!i)return this.currentInfo;if(n.currentRun=i,n.currentRun!==this.currentInfo.currentRun&&n.currentRun){n.relatedRuns=n.currentRun.leining.runs.map(y=>({label:Vt(y.aliyot[0].index,y)||y.type,targetRun:y}));const w=n.currentRun.leining.date,A=e.generator.aroundDate(w.date).filter(y=>y.id===w.id||!Pl(y,w)).flatMap(y=>y.leinings),b=A.findIndex(y=>{var S;return y.date.id===w.id&&y.id===((S=n.currentRun)==null?void 0:S.leining.id)});n.previousLink=Bn(A[b-1],n.currentRun),n.nextLink=Bn(A[b+1],n.currentRun)}if(((C=n.currentRun)==null?void 0:C.scroll)!=="torah")n.aliyahRange=[];else if(o!==((m=this.firstAliyah)==null?void 0:m.aliyah)||r!==((I=this.lastAliyah)==null?void 0:I.aliyah)||n.currentRun!==this.currentInfo.currentRun){let w=function(A){return A?{aliyah:A,run:Object.values(a).find(b=>b==null?void 0:b.aliyot.includes(A)).run}:null};this.firstAliyah=w(o),this.lastAliyah=w(r),(o||r)&&(n.aliyahRange=this.generateAliyahRange(n.currentRun))}return this.currentInfo=n,this.currentInfo}generateAliyahRange(e){var a,n;return(((a=this.firstAliyah)==null?void 0:a.aliyah)===((n=this.lastAliyah)==null?void 0:n.aliyah)?[this.firstAliyah]:[this.firstAliyah,this.lastAliyah]).filter(o=>o!=null).map(o=>{const r=Vt(o.aliyah.index,o.run,{isEnd:!0});return o.run===e?r:`${o.run.leining.date.title.he} ${r}`})}}function Bn(t,e){return{targetRun:t.runs[0],label:[t.date.id===e.leining.date.id?"":t.date.title.he,t.id].join(" ").trim()}}function sn(t){return`#/run/${t.id}`}const _a={run(t,e){return we.forId(t,e)},r(t,e){if(!e)return null;const[,a,n,o]=e.match(/^(\d+)-(\d+)-(\d+)$/)??[];return!a||!n||!o?null:we.forRef(t,{scroll:"torah",b:Number(a),c:Number(n),v:Number(o)})},next(t){return we.forDate(t,new Date)}};function sc(t,e){var o;const[a,...n]=e.split("/").filter(r=>r);return((o=_a[a])==null?void 0:o.call(_a,t,...n))??null}const ic=t=>e=>new RegExp(t.split("").join(".*"),"i").test(e),fr=(t,e)=>{const a=t.split(""),n=e.split(""),o=[];let r=0;for(let i=0;i<n.length&&!(a[r].toLowerCase()===n[i].toLowerCase()&&(o.push(i),++r,r>=a.length));i++);return o},lc=(t,e)=>{const a=fr(t,e);return a.map(n=>n-a[0]).reduce((n,o)=>n+o,0)},cc=(t,e)=>a=>{const{minScore:n,index:o}=e(a).map(r=>ic(t)(r)?lc(t,r):1/0).reduce(({minScore:r,index:i},l,c)=>l<r?{minScore:l,index:c}:{minScore:r,index:i},{minScore:1/0,index:0});return isFinite(n)?{score:n,item:a,match:{index:o,indexes:fr(t,e(a)[o])}}:{item:a,score:n,match:{index:NaN,indexes:[]}}},br=(t,e,a=n=>[n.toString()])=>t.map(cc(e,a)).filter(({score:n})=>isFinite(n)).sort((n,o)=>{const r=n.score,i=o.score,l=r-i;return l===0?n.match.indexes[0]-o.match.indexes[0]:l}),{htmlToElement:gr}=Xe,Yn=({string:t,atIndexes:e,withDecoration:a})=>{let n=0;return t.split("").map((o,r)=>e[n]!==r?o:(++n,a(o)),"").join("")},Kn=t=>`<strong>${t}</strong>`,dc=({match:t,item:e})=>gr(`
  <a data-target-class="parsha-result" href="${sn(e.runs[0])}">
    <p class="search-result-tag mod-hebrew" data-target-class="result-hebrew">${t.index===0?Yn({string:e.date.title.he,atIndexes:t.indexes,withDecoration:Kn}):e.date.title.he}: ${e.id}
    </p>
    <p class="search-result-tag">${t.index===1?Yn({string:e.date.title.en,atIndexes:t.indexes,withDecoration:Kn}):e.date.title.en}
    </p>
  </a>
`),hc=()=>gr(`<p class="" style="text-align: center; color: var(--light-text-color);">
  No results
</p>
`),{htmlToElement:Fn}=Xe,uc=(t,e)=>{const a=[...t.querySelectorAll('[data-target-class="list-item"]')],n=Math.max(a.findIndex(i=>i.getAttribute("data-selected")==="true"),0);a[n].removeAttribute("data-selected");const r=(e(n)+a.length)%a.length;a[r].setAttribute("data-selected","true")},pc=t=>t.querySelector('[data-target-class="list-item"][data-selected="true"]'),mc=(t,e,a)=>{const n=Fn(`
    <ol class="list"></ol>
  `);return t.forEach(o=>{const r=Fn('<li class="list-item" data-target-class="list-item"></li>');r.appendChild(o),r.addEventListener("click",()=>{a(r)}),n.appendChild(r)}),n.querySelector('[data-target-class="list-item"]').setAttribute("data-selected","true"),n},{htmlToElement:fc,whenKey:Un,purgeNode:bc}=Xe,gc=({search:t,emitter:e})=>{let a;const n=fc(`
    <div class="search">
      <div class="search-bar">
        <span class="search-icon">⚲</span>
        <input class="search-input" placeholder="Search..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
      </div>
      <div class="search-results u-hidden">
      </div>
    </div>
  `);n.addEventListener("keydown",Un("Enter",()=>{e.emit("selection",pc(a))}));const o=l=>e.emit("selection",l);[{key:"ArrowDown",adjustment:l=>l+1},{key:"ArrowUp",adjustment:l=>l-1},{key:{key:"n",ctrl:!0},adjustment:l=>l+1},{key:{key:"p",ctrl:!0},adjustment:l=>l-1}].forEach(({key:l,adjustment:c})=>n.addEventListener("keydown",Un(l,d=>{d.preventDefault(),uc(a,c)})));const r=n.querySelector(".search-input"),i=n.querySelector(".search-results");return r.addEventListener("input",l=>{const c=l.target.value;if(bc(i),c){e.emit("search",c);const d=t(c);a=mc(d,r,o),i.appendChild(a),i.classList.remove("u-hidden")}else e.emit("clear"),i.classList.add("u-hidden")}),{node:n,focus:()=>{r.focus()}}},{htmlToElement:kc}=Xe,_c=Intl.DateTimeFormat(void 0,{dateStyle:"medium"}),Ja=t=>`
  <li><a
    class="parsha"
    href="${sn(t.runs[0])}"
  >
    ${kr(t)}
  </a></li>
  `,yc=t=>`
  <li class="parsha-book">
    <ol class="parsha-list">
      ${t.map(Ja).join("")}
    </ol>
  </li>
`,Ec=(t,e)=>`
  <li style="display: table-cell; width: calc(100% / 3); padding: 0 0.5em;">
    <div class="stack small" style="display: flex; flex-direction: column; align-items: center;">
      <a
        href="${e===0?"#/next":sn(t.runs[0])}"
        class="coming-up-button"
      >${kr(t,{forCalendar:!0})}</a>
      <time class="coming-up-date">${_c.format(t.date.date)}</time>
    </div>
  </li>
  `,vc=t=>`
  <section dir="ltr" id="coming-up" class="section mod-alternate mod-padding">
    <div class="stack medium">
      <label class="section-label">Coming up</label>
      <div style="overflow-x: auto;">
        <ol id="coming-up-readings-list" class="cluster" style="list-style: none; display: table; margin-left: auto; margin-right: auto; white-space: nowrap;">
          ${t.map(Ec).join("")}
        </ol>
      </div>
    </div>
  </section>
`,xc=["ראש השנה א׳","סוכות א׳","שבועות א׳","פסח א׳"],Ac=t=>{const e=[[]];for(const a of t)a.isParsha||Ze(e).length&&a.date.title.he.startsWith("ראש חודש")||a.date.title.he.startsWith("תענית אסתר")||(xc.includes(a.date.title.he)&&e.push([]),Ze(e).push(a));return e},Ic=t=>`
  <div class="browse">
    <h2 class="section-heading">פרשת השבוע</h2>
    <ol class="parsha-books mod-emphasize-first-in-group">
      ${t.filter(e=>e.isParsha||fo(e.runs[0])).reduce((e,a,n)=>{const o=a.runs[0].aliyot[0].start.b;return e[o]=e[o]||[],e[o].push({...a,idx:n}),e},[]).map(yc).join("")}
    </ol>

    <h2 class="section-heading">חגים</h2>
    <ol class="parsha-books">
      ${Ac(t).map(e=>`
        <li class="parsha-book">
          <ol class="parsha-list">
            ${e.map(Ja).join(`
`)}
          </ol>
        </li>
      `).join(`
`)}
    </ol>

    <h2 class="section-heading">מגילות</h2>
    <ol class="parsha-books">
      <li class="parsha-book">
        <ol class="parsha-list">
          ${t.filter(e=>e.id===q.Megillah).map(Ja).join(`
`)}
        </ol>
      </li>
    </ol>
  </div>
`,wc=t=>(e,a)=>a<t,Sc=(t,e)=>{const a=br(t,e,n=>[n.date.title.he,n.date.title.en]);return a.length?a.filter(wc(5)).map(n=>dc(n)):[hc()]};function kr(t,e){if(t.id===q.Megillah)return P.gettext(an(t.runs[0].scroll),"he-x-nonikud");let a=t.date.title.he.replace("פרשת ","");return t.id!==q.Shacharis&&(a+=`: ${t.id}`),!(e!=null&&e.forCalendar)&&a.startsWith("ראש חודש")?"ראש חודש":a}const _r=t=>{const e=t.forEntireChumash(new u).flatMap(i=>i.leinings),a=tc.new(),n=gc({search:Sc.bind(null,e),emitter:a}),o=e.filter(i=>i.date.date>new Date).slice(0,3),r=kc(`
    <div class="parsha-picker">
      <div class="stack xlarge">
        <div class="centerize">
          <div id="search" style="display: inline-block;"></div>
        </div>
        ${vc(o)}
        ${Ic(e)}
      </div>
    </div>
  `);return[...r.querySelectorAll('[data-target-class="coming-up-reading"]')].forEach((i,l)=>{i.addEventListener("click",()=>{gtag("event","coming_up_selection",{event_category:"navigation",event_label:["due up","on deck","in the hole"][l]})})}),a.on("selection",i=>{gtag("event","search_selection",{event_category:"navigation",event_label:i.querySelector('[data-target-class="result-hebrew"]').textContent.trim()})}),a.on("search",i=>{r.querySelector(".browse").classList.add("u-hidden"),r.querySelector("#coming-up").classList.add("u-hidden"),gtag("event","search",{event_category:"navigation",event_label:i})}),a.on("clear",()=>{r.querySelector(".browse").classList.remove("u-hidden"),r.querySelector("#coming-up").classList.remove("u-hidden")}),r.querySelector("#search").parentNode.replaceChild(n.node,r.querySelector("#search")),[...r.querySelectorAll('[data-target-id="parsha"]')].forEach(i=>{i.addEventListener("click",l=>{const c=l.target;gtag("event","browse_selection",{event_category:"navigation",event_label:c.textContent.trim()})})}),{node:r,onMount:()=>{setTimeout(()=>n.focus(),0)}}},Tc={Tishrei:"תשרי",Cheshvan:"חשוון",Kislev:"כסלו",Tevet:"טבת","Sh'vat":"שבט",Shvat:"שבט",Adar:"אדר","Adar I":"אדר א׳","Adar II":"אדר ב׳",Nisan:"ניסן",Iyar:"אייר",Iyyar:"אייר",Sivan:"סיוון",Tammuz:"תמוז",Tamuz:"תמוז",Av:"אב",Elul:"אלול"};function Cc(t){return Tc[t]??t}function re(t){const e=t instanceof u?t:new u(t);return`${e.getDate()} ב${Cc(e.getMonthName())}`}function Se(t){const e=[];for(const a of t.runs){const n=`#/run/${a.id}`;a.type===B.Main?e.push({label:"קריאה",url:n,type:a.type}):a.type===B.Maftir?e.push({label:"מפטיר",url:n,type:a.type}):a.type===B.Haftarah?e.push({label:"הפטרה",url:n,type:a.type}):a.type===B.Megillah&&e.push({label:"מגילה",url:n,type:a.type})}return e}const Mc=new Intl.DateTimeFormat("en-US",{weekday:"short",month:"short",day:"numeric",year:"numeric"}),Lc=new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric"});function ge(t,e=!1){return e?Lc.format(t):Mc.format(t)}function W(t){if(t.id===q.Megillah)return P.gettext(an(t.runs[0].scroll),"he-x-nonikud");let e=t.date.title.he.replace("פרשת ","");return t.id!==q.Shacharis&&(e+=` (${t.id===q.Mincha?"מנחה":"ערבית"})`),e}const Dc=t=>{const e=document.createElement("style");e.textContent=`
    .collapsible-container {
      direction: rtl;
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 15px;
      color: var(--text-color, #333);
    }
    .collapsible-header {
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: var(--paper-color, #fafafa);
      padding: 15px;
      border-radius: 8px;
      border: 1px solid var(--medium-accent-color, #ddd);
      margin-bottom: 20px;
    }
    .collapsible-year-switcher {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }
    .collapsible-year-title {
      font-size: 18px;
      font-weight: bold;
      color: var(--text-color, #111);
    }
    .collapsible-btn {
      padding: 6px 14px;
      border: 1px solid var(--heavy-accent-color, #ccc);
      background: var(--paper-color, #fff);
      color: var(--text-color, #333);
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      user-select: none;
    }
    .collapsible-btn:hover {
      background: var(--light-accent-color, #f0f0f0);
    }
    .collapsible-date-jump {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
    }
    .collapsible-date-input {
      padding: 5px 8px;
      border: 1px solid var(--heavy-accent-color, #ccc);
      border-radius: 6px;
      font-size: 14px;
      background: var(--paper-color, #fff);
      color: var(--text-color, #333);
    }
    .collapsible-group {
      margin-bottom: 12px;
      border: 1px solid var(--medium-accent-color, #ddd);
      border-radius: 8px;
      overflow: hidden;
      background: var(--paper-color, #fff);
    }
    .collapsible-group-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 15px;
      background: var(--light-accent-color, #f5f5f5);
      cursor: pointer;
      user-select: none;
      font-weight: bold;
      font-size: 16px;
      border-bottom: 1px solid var(--medium-accent-color, #ddd);
    }
    .collapsible-group.is-collapsed .collapsible-group-header {
      border-bottom-color: transparent;
    }
    .collapsible-group.is-collapsed .collapsible-group-content {
      display: none;
    }
    .collapsible-group-arrow {
      font-size: 12px;
      transition: transform 0.2s;
      transform: rotate(90deg);
    }
    .collapsible-group.is-collapsed .collapsible-group-arrow {
      transform: rotate(0deg);
    }
    .collapsible-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .collapsible-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 15px;
      border-bottom: 1px solid var(--light-accent-color, #eee);
    }
    .collapsible-item:last-child {
      border-bottom: none;
    }
    .collapsible-item-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .collapsible-item-title {
      font-size: 16px;
      font-weight: bold;
      color: var(--text-color, #222);
    }
    .collapsible-item-date {
      font-size: 12px;
      color: var(--light-text-color, #777);
      display: flex;
      gap: 8px;
    }
    .collapsible-shortcuts {
      display: flex;
      gap: 8px;
    }
    .collapsible-shortcut-btn {
      text-decoration: none;
      padding: 5px 10px;
      font-size: 13px;
      border-radius: 4px;
      border: 1px solid #0b57d0;
      color: #0b57d0;
      background: transparent;
      font-weight: 500;
      transition: all 0.2s;
    }
    .collapsible-shortcut-btn:hover {
      background: #0b57d0;
      color: #fff;
    }
  `,document.head.appendChild(e);const a=document.createElement("div");a.className="parsha-picker collapsible-container";let n=new u().getFullYear(),o={"book-1":!1,"book-2":!0,"book-3":!0,"book-4":!0,"book-5":!0,holidays:!1,megillot:!0};const r=()=>{a.innerHTML="";const i=document.createElement("div");i.className="collapsible-header";const l=document.createElement("div");l.className="collapsible-year-switcher";const c=document.createElement("button");c.className="collapsible-btn",c.textContent=`שנה קודמת (${n-1})`,c.addEventListener("click",()=>{n--,r()});const d=document.createElement("span");d.className="collapsible-year-title",d.textContent=`שנת ${n}`;const g=document.createElement("button");g.className="collapsible-btn",g.textContent=`שנה הבאה (${n+1})`,g.addEventListener("click",()=>{n++,r()}),l.appendChild(c),l.appendChild(d),l.appendChild(g),i.appendChild(l);const _=document.createElement("div");_.className="collapsible-date-jump";const f=document.createElement("span");f.textContent="קפוץ לתאריך:";const E=document.createElement("input");E.type="date",E.className="collapsible-date-input",E.addEventListener("change",()=>{if(!E.value)return;const b=E.value.split("-"),y=new Date(Number(b[0]),Number(b[1])-1,Number(b[2])),S=t.createLeiningDate(new u(y));if(S&&S.leinings.length){const h=S.leinings[0].runs[0];location.hash=`#/run/${h.id}`}else alert("אין קריאת תורה בתאריך זה.")}),_.appendChild(f),_.appendChild(E),i.appendChild(_),a.appendChild(i);const C=t.forHebrewYear(n),m={1:{name:"ספר בראשית",leinings:[]},2:{name:"ספר שמות",leinings:[]},3:{name:"ספר ויקרא",leinings:[]},4:{name:"ספר במדבר",leinings:[]},5:{name:"ספר דברים",leinings:[]}},I=[],w=[];C.forEach(b=>{b.leinings.forEach(y=>{if(y.isParsha){const S=y.runs[0].aliyot[0].start.b;m[S]&&m[S].leinings.push({date:b,inst:y})}else y.id===q.Megillah?w.push({date:b,inst:y}):I.push({date:b,inst:y})})});const A=(b,y,S)=>{if(!S.length)return;const h=document.createElement("div");h.className=`collapsible-group ${o[b]?"is-collapsed":""}`;const x=document.createElement("div");x.className="collapsible-group-header",x.innerHTML=`
        <span>${y} (${S.length})</span>
        <span class="collapsible-group-arrow">◀</span>
      `,x.addEventListener("click",()=>{o[b]=!o[b],h.classList.toggle("is-collapsed",o[b])});const v=document.createElement("div");v.className="collapsible-group-content";const k=document.createElement("ul");k.className="collapsible-list",S.forEach(({date:p,inst:M})=>{const T=document.createElement("li");T.className="collapsible-item";const L=document.createElement("div");L.className="collapsible-item-info";const O=document.createElement("span");O.className="collapsible-item-title",O.textContent=W(M);const R=document.createElement("span");R.className="collapsible-item-date",R.innerHTML=`
          <span>${re(p.date)}</span>
          <span>|</span>
          <span>${ge(p.date,!0)}</span>
        `,L.appendChild(O),L.appendChild(R);const $=document.createElement("div");$.className="collapsible-shortcuts",Se(M).forEach(K=>{const ne=document.createElement("a");ne.href=K.url,ne.className="collapsible-shortcut-btn",ne.textContent=K.label,$.appendChild(ne)}),T.appendChild(L),T.appendChild($),k.appendChild(T)}),v.appendChild(k),h.appendChild(x),h.appendChild(v),a.appendChild(h)};for(let b=1;b<=5;b++)A(`book-${b}`,m[b].name,m[b].leinings);A("holidays","חגים ומועדים",I),A("megillot","חמש מגילות",w)};return r(),{node:a,onMount:()=>{console.log("Collapsible List Mounted")},onDestroy:()=>{e.remove()}}},Rc={Tishrei:"תשרי",Cheshvan:"חשוון",Kislev:"כסלו",Tevet:"טבת","Sh'vat":"שבט",Adar:"אדר","Adar I":"אדר א׳","Adar II":"אדר ב׳",Nisan:"ניסן",Iyar:"אייר",Iyyar:"אייר",Sivan:"סיוון",Tammuz:"תמוז",Tamuz:"תמוז",Av:"אב",Elul:"אלול"},Hc=t=>{const e=document.createElement("style");e.textContent=`
    .timeline-container {
      direction: rtl;
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      height: calc(100vh - var(--header-height) - 60px);
      overflow: hidden;
      background: var(--paper-color, #fdfdfd);
    }
    
    /* Side Navbar */
    .timeline-nav {
      width: 75px;
      border-left: 1px solid var(--medium-accent-color, #eee);
      background: var(--paper-color, #fafafa);
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px 0;
      gap: 8px;
      user-select: none;
    }
    .timeline-nav-item {
      font-size: 13px;
      font-weight: bold;
      padding: 6px 4px;
      width: 85%;
      text-align: center;
      border-radius: 6px;
      cursor: pointer;
      color: var(--light-text-color, #666);
      border: 1px solid transparent;
      transition: all 0.2s;
    }
    .timeline-nav-item:hover {
      background: var(--light-accent-color, #f0f0f0);
      color: var(--text-color, #111);
    }
    .timeline-nav-item.is-active {
      background: #0b57d0;
      color: #fff;
      border-color: #0b57d0;
    }

    /* Scrollable list */
    .timeline-cards {
      flex: 1;
      overflow-y: auto;
      padding: 15px;
      display: flex;
      flex-direction: column;
      gap: 15px;
      scroll-behavior: smooth;
    }
    
    /* Reading card */
    .timeline-card {
      display: flex;
      flex-shrink: 0;
      background: var(--paper-color, #fff);
      border: 1px solid var(--medium-accent-color, #ddd);
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 6px rgba(0,0,0,0.04);
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }
    .timeline-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
    
    /* Month Marker for groups */
    .timeline-month-header {
      font-size: 18px;
      font-weight: bold;
      color: #0b57d0;
      border-bottom: 2px solid #0b57d0;
      padding-bottom: 6px;
      margin-top: 15px;
      margin-bottom: 5px;
    }
    .timeline-month-header:first-child {
      margin-top: 0;
    }
    
    /* Card Left Column: Date Block */
    .timeline-card-date {
      width: 70px;
      background: var(--light-accent-color, #f5f5f5);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-left: 1px solid var(--medium-accent-color, #eee);
      padding: 10px;
    }
    .timeline-date-num {
      font-size: 24px;
      font-weight: 900;
      color: var(--text-color, #222);
    }
    .timeline-date-name {
      font-size: 11px;
      color: var(--light-text-color, #666);
      text-align: center;
    }
    
    /* Card Right Column: Content */
    .timeline-card-content {
      flex: 1;
      padding: 12px 15px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 10px;
    }
    .timeline-card-top {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .timeline-card-title {
      font-size: 18px;
      font-weight: bold;
      color: var(--text-color, #111);
    }
    .timeline-card-subtitle {
      font-size: 12px;
      color: var(--light-text-color, #666);
      display: flex;
      gap: 8px;
    }
    
    /* Badge icons */
    .timeline-badge {
      display: inline-block;
      background: #e8f0fe;
      color: #1a73e8;
      font-size: 11px;
      font-weight: bold;
      padding: 2px 6px;
      border-radius: 10px;
      align-self: flex-start;
    }
    
    .timeline-card-actions {
      display: flex;
      gap: 8px;
    }
    .timeline-action-btn {
      text-decoration: none;
      padding: 6px 12px;
      font-size: 13px;
      border-radius: 5px;
      background: #0b57d0;
      color: #fff;
      font-weight: bold;
      text-align: center;
      transition: background 0.2s;
    }
    .timeline-action-btn:hover {
      background: #0842a0;
    }
    .timeline-action-btn.mod-secondary {
      background: transparent;
      color: #0b57d0;
      border: 1px solid #0b57d0;
    }
    .timeline-action-btn.mod-secondary:hover {
      background: rgba(11, 87, 208, 0.05);
    }
    
    .timeline-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 15px;
      background: var(--paper-color, #fff);
      border-bottom: 1px solid var(--medium-accent-color, #eee);
      direction: ltr;
    }
    .timeline-controls-btn {
      padding: 5px 12px;
      border: 1px solid var(--heavy-accent-color, #999);
      border-radius: 4px;
      background: transparent;
      color: var(--text-color, #333);
      cursor: pointer;
    }
  `,document.head.appendChild(e);const a=document.createElement("div");a.style.display="flex",a.style.flexDirection="column",a.className="parsha-picker";let n=new u().getFullYear();const o=()=>{a.innerHTML="";const r=document.createElement("div");r.className="timeline-controls";const i=document.createElement("button");i.className="timeline-controls-btn",i.textContent=`« ${n-1}`,i.addEventListener("click",()=>{n--,o()});const l=document.createElement("span");l.textContent=`Hebrew Year ${n}`,l.style.fontWeight="bold";const c=document.createElement("button");c.className="timeline-controls-btn",c.textContent=`${n+1} »`,c.addEventListener("click",()=>{n++,o()}),r.appendChild(i),r.appendChild(l),r.appendChild(c),a.appendChild(r);const d=document.createElement("div");d.className="timeline-container";const g=document.createElement("div");g.className="timeline-nav";const _=document.createElement("div");_.className="timeline-cards";const f=t.forHebrewYear(n),E={},C=[],m={};f.forEach(I=>{I.leinings.forEach(w=>{const b=new u(I.date).getMonthName(),y=Rc[b]||b;m[y]||(m[y]=[]),m[y].push({date:I,inst:w})})}),Object.entries(m).forEach(([I,w])=>{if(!w.length)return;const A=document.createElement("div");A.className="timeline-month-header",A.textContent=I,_.appendChild(A),E[I]=A;const b=document.createElement("div");b.className="timeline-nav-item",b.textContent=I,b.addEventListener("click",()=>{g.querySelectorAll(".timeline-nav-item").forEach(y=>y.classList.remove("is-active")),b.classList.add("is-active"),A.scrollIntoView({behavior:"smooth",block:"start"})}),g.appendChild(b),C.push(b),w.forEach(({date:y,inst:S})=>{const h=document.createElement("div");h.className="timeline-card";const x=new u(y.date),k=["ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת"][y.date.getDay()],p=document.createElement("div");p.className="timeline-card-date",p.innerHTML=`
          <span class="timeline-date-num">${x.getDate()}</span>
          <span class="timeline-date-name">יום ${k}</span>
        `;const M=document.createElement("div");M.className="timeline-card-content";const T=document.createElement("div");T.className="timeline-card-top";let L="";S.isParsha?S.runs.some(K=>K.type===B.Maftir)&&(L="שבת מיוחדת"):L="חג/מועד";const O=document.createElement("div");O.className="timeline-card-title",O.textContent=W(S);const R=document.createElement("div");if(R.className="timeline-card-subtitle",R.innerHTML=`
          <span>${ge(y.date,!0)}</span>
          <span>|</span>
          <span>${y.title.he}</span>
        `,T.appendChild(O),T.appendChild(R),L){const K=document.createElement("span");K.className="timeline-badge",K.textContent=L,T.appendChild(K)}M.appendChild(T);const $=document.createElement("div");$.className="timeline-card-actions",Se(S).forEach(K=>{const ne=document.createElement("a");ne.href=K.url,ne.className=`timeline-action-btn ${K.type!==B.Main?"mod-secondary":""}`,ne.textContent=K.label,$.appendChild(ne)}),M.appendChild($),h.addEventListener("click",K=>{if(K.target.tagName==="A")return;const ne=S.runs[0];ne&&(location.hash=`#/run/${ne.id}`)}),h.appendChild(p),h.appendChild(M),_.appendChild(h)})}),_.addEventListener("scroll",()=>{let I="";const w=_.getBoundingClientRect().top+20;Object.entries(E).forEach(([A,b])=>{b.getBoundingClientRect().top<=w&&(I=A)}),I&&g.querySelectorAll(".timeline-nav-item").forEach(A=>{const b=A.textContent===I;A.classList.toggle("is-active",b)})}),C.length&&C[0].classList.add("is-active"),d.appendChild(g),d.appendChild(_),a.appendChild(d)};return o(),{node:a,onMount:()=>{console.log("Timeline Flow Mounted")},onDestroy:()=>{e.remove()}}},Pc=t=>{const e=document.createElement("style");e.textContent=`
    .hud-container {
      direction: rtl;
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 650px;
      margin: 0 auto;
      padding: 20px 15px;
      color: var(--text-color, #333);
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .hud-palette {
      background: var(--paper-color, #fff);
      border: 1px solid var(--heavy-accent-color, #999);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15);
      overflow: hidden;
    }
    .hud-search-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      border-bottom: 1px solid var(--medium-accent-color, #ddd);
      padding: 12px 18px;
      background: var(--light-accent-color, #fafafa);
    }
    .hud-search-icon {
      font-size: 18px;
      margin-left: 12px;
      color: var(--light-text-color, #777);
    }
    .hud-search-input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font-size: 18px;
      color: var(--text-color, #222);
      font-family: inherit;
    }
    .hud-search-input::placeholder {
      color: var(--light-text-color, #999);
    }
    .hud-kbd-hint {
      font-size: 11px;
      color: var(--light-text-color, #888);
      border: 1px solid var(--medium-accent-color, #ccc);
      padding: 2px 5px;
      border-radius: 4px;
      background: var(--paper-color, #fff);
      direction: ltr;
      user-select: none;
    }

    /* Quick jumps */
    .hud-quickjumps {
      padding: 15px 18px;
      background: var(--light-accent-color, #f9f9f9);
      border-bottom: 1px solid var(--medium-accent-color, #eee);
    }
    .hud-quickjumps-label {
      font-size: 12px;
      font-weight: bold;
      color: var(--light-text-color, #777);
      margin-bottom: 8px;
      display: block;
    }
    .hud-quickjumps-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }
    .hud-quick-card {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 10px 12px;
      border: 1px solid var(--medium-accent-color, #ddd);
      border-radius: 8px;
      background: var(--paper-color, #fff);
      text-decoration: none;
      color: inherit;
      cursor: pointer;
      transition: all 0.2s;
    }
    .hud-quick-card:hover {
      border-color: #0b57d0;
      background: rgba(11, 87, 208, 0.02);
    }
    .hud-quick-title {
      font-size: 14px;
      font-weight: bold;
      color: var(--text-color, #111);
    }
    .hud-quick-desc {
      font-size: 11px;
      color: var(--light-text-color, #666);
    }
    
    /* Results */
    .hud-results {
      max-height: 380px;
      overflow-y: auto;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .hud-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 18px;
      border-bottom: 1px solid var(--light-accent-color, #eee);
      cursor: pointer;
      transition: all 0.15s;
    }
    .hud-row:last-child {
      border-bottom: none;
    }
    .hud-row.is-highlighted {
      background: rgba(11, 87, 208, 0.08);
    }
    .hud-row-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .hud-badge {
      font-size: 11px;
      font-weight: bold;
      padding: 3px 8px;
      border-radius: 5px;
    }
    .hud-badge.mod-torah {
      background: #e6f4ea;
      color: #137333;
    }
    .hud-badge.mod-holiday {
      background: #fef7e0;
      color: #b06000;
    }
    .hud-badge.mod-megillah {
      background: #fce8e6;
      color: #c5221f;
    }
    .hud-row-info {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .hud-row-title {
      font-size: 16px;
      font-weight: bold;
      color: var(--text-color, #111);
    }
    .hud-row-meta {
      font-size: 12px;
      color: var(--light-text-color, #666);
      display: flex;
      gap: 8px;
    }
    .hud-row-shortcuts {
      display: flex;
      gap: 6px;
    }
    .hud-shortcut-btn {
      text-decoration: none;
      padding: 4px 8px;
      font-size: 12px;
      border-radius: 4px;
      background: transparent;
      color: #0b57d0;
      border: 1px solid #0b57d0;
      font-weight: bold;
      transition: all 0.2s;
    }
    .hud-shortcut-btn:hover {
      background: #0b57d0;
      color: #fff;
    }
    
    .hud-no-results {
      padding: 30px;
      text-align: center;
      color: var(--light-text-color, #666);
      font-size: 15px;
    }
  `,document.head.appendChild(e);const a=document.createElement("div");a.className="parsha-picker hud-container";const n=document.createElement("div");n.className="hud-palette";const o=document.createElement("div");o.className="hud-search-wrapper",o.innerHTML=`
    <span class="hud-search-icon">🔍</span>
    <input type="text" class="hud-search-input" placeholder="חפש פרשה, חג, או תאריך (עברי או לועזי)..." autocomplete="off" autofocus>
    <span class="hud-kbd-hint">↑↓ Enter</span>
  `;const r=o.querySelector(".hud-search-input"),i=document.createElement("div");i.className="hud-quickjumps";const l=document.createElement("ul");l.className="hud-results",n.appendChild(o),n.appendChild(i),n.appendChild(l),a.appendChild(n);const c=new u().getFullYear(),d=[...t.forHebrewYear(c),...t.forHebrewYear(c+1)],g=[];d.forEach(A=>{A.leinings.forEach(b=>{new u(A.date);let y="holiday";b.isParsha?y="torah":b.id===q.Megillah&&(y="megillah"),g.push({date:A,inst:b,titleHe:W(b),titleEn:b.date.title.en,englishDateStr:ge(A.date),hebrewDateStr:re(A.date),type:y})})}),(()=>{const A=new Date,b=g.find(v=>v.date.date>=A&&v.type==="torah");let y;b&&(y=g.find(v=>v.date.date>b.date.date&&v.type==="torah"));const S=g.find(v=>v.date.date>=A&&v.type==="holiday");i.innerHTML='<span class="hud-quickjumps-label">קיצורי דרך מהירים</span>';const h=document.createElement("div");h.className="hud-quickjumps-grid";const x=(v,k,p)=>{if(!k)return;const M=document.createElement("a");M.className="hud-quick-card",M.href=`#/run/${k.inst.runs[0].id}`,M.innerHTML=`
        <span class="hud-quick-title">${v}</span>
        <span class="hud-quick-desc" style="font-weight: bold; color: #0b57d0;">${k.titleHe}</span>
        <span class="hud-quick-desc">${k.hebrewDateStr}</span>
      `,h.appendChild(M)};x("השבת הקרובה",b),x("השבת הבאה",y),x("החג הקרוב",S),i.appendChild(h)})();let f=-1;const E=()=>Array.from(l.querySelectorAll(".hud-row")),C=A=>{const b=E();b.length&&(A==="down"?f=(f+1)%b.length:f=(f-1+b.length)%b.length,b.forEach((y,S)=>{const h=S===f;y.classList.toggle("is-highlighted",h),h&&y.scrollIntoView({block:"nearest"})}))},m=()=>{const A=E();if(f>=0&&f<A.length){const b=A[f].querySelector("a");b&&b.click()}};r.addEventListener("keydown",A=>{A.key==="ArrowDown"?(A.preventDefault(),C("down")):A.key==="ArrowUp"?(A.preventDefault(),C("up")):A.key==="Enter"&&(A.preventDefault(),m())});const I=A=>{switch(A){case"torah":return{className:"mod-torah",text:"תורה"};case"holiday":return{className:"mod-holiday",text:"חג"};case"megillah":return{className:"mod-megillah",text:"מגילה"}}},w=A=>{if(l.innerHTML="",f=-1,!A.trim()){i.style.display="block";return}i.style.display="none";const b=br(g,A,S=>[S.titleHe,S.titleEn,S.hebrewDateStr,S.englishDateStr]);if(!b.length){l.innerHTML=`<div class="hud-no-results">לא נמצאו תוצאות עבור "${A}"</div>`;return}b.slice(0,8).forEach(S=>{const h=S.item,x=document.createElement("li");x.className="hud-row",x.addEventListener("click",$=>{if($.target.tagName==="A")return;const K=h.inst.runs[0];location.hash=`#/run/${K.id}`});const v=document.createElement("div");v.className="hud-row-left";const k=I(h.type),p=document.createElement("span");p.className=`hud-badge ${k.className}`,p.textContent=k.text;const M=document.createElement("div");M.className="hud-row-info";const T=document.createElement("span");T.className="hud-row-title",T.textContent=h.titleHe;const L=document.createElement("span");L.className="hud-row-meta",L.innerHTML=`
        <span>${h.hebrewDateStr}</span>
        <span>|</span>
        <span>${h.englishDateStr}</span>
      `,M.appendChild(T),M.appendChild(L),v.appendChild(p),v.appendChild(M);const O=document.createElement("div");O.className="hud-row-shortcuts",Se(h.inst).forEach($=>{const Y=document.createElement("a");Y.href=$.url,Y.className="hud-shortcut-btn",Y.textContent=$.label,O.appendChild(Y)}),x.appendChild(v),x.appendChild(O),l.appendChild(x)})};return r.addEventListener("input",()=>{w(r.value)}),{node:a,onMount:()=>{console.log("HUD Mounted"),setTimeout(()=>r.focus(),50)},onDestroy:()=>{e.remove()}}},Oc=t=>{const e=document.createElement("style");e.textContent=`
    .map-outer-container {
      direction: rtl;
      font-family: system-ui, -apple-system, sans-serif;
      padding: 15px;
      background: var(--paper-color, #fcfcfc);
      height: calc(100vh - var(--header-height) - 60px);
      overflow-y: auto;
    }
    .map-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--paper-color, #fff);
      border: 1px solid var(--medium-accent-color, #eee);
      padding: 10px 15px;
      border-radius: 8px;
      margin-bottom: 15px;
      direction: ltr;
    }
    .map-controls-btn {
      padding: 6px 12px;
      border: 1px solid var(--heavy-accent-color, #999);
      border-radius: 5px;
      background: transparent;
      color: var(--text-color, #333);
      cursor: pointer;
      font-weight: bold;
    }
    .map-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 12px;
      align-items: start;
    }
    @media (max-width: 768px) {
      .map-grid {
        grid-template-columns: 1fr;
        gap: 15px;
      }
    }
    .map-column {
      border: 1px solid var(--medium-accent-color, #ddd);
      border-radius: 10px;
      background: var(--paper-color, #fff);
      box-shadow: 0 2px 8px rgba(0,0,0,0.03);
      overflow: hidden;
    }
    .map-column-header {
      background: #0b57d0;
      color: #fff;
      padding: 10px;
      text-align: center;
      font-weight: bold;
      font-size: 16px;
    }
    .map-tiles {
      display: flex;
      flex-direction: column;
      padding: 10px;
      gap: 8px;
    }
    .map-tile {
      border: 1px solid var(--medium-accent-color, #eee);
      border-radius: 6px;
      padding: 8px 10px;
      background: var(--paper-color, #fafafa);
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .map-tile:hover {
      border-color: #0b57d0;
      background: rgba(11, 87, 208, 0.02);
    }
    .map-tile-name {
      font-weight: bold;
      font-size: 14px;
      color: var(--text-color, #222);
    }
    .map-tile-date {
      font-size: 11px;
      color: var(--light-text-color, #777);
    }
    
    /* Details Popover / Modal */
    .map-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.4);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 20000;
      padding: 15px;
    }
    .map-overlay.is-visible {
      display: flex;
    }
    .map-popover {
      background: var(--paper-color, #fff);
      border-radius: 12px;
      width: 100%;
      max-width: 480px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      animation: map-popover-in 0.2s ease-out;
    }
    @keyframes map-popover-in {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .map-popover-header {
      background: #f5f5f5;
      border-bottom: 1px solid var(--medium-accent-color, #eee);
      padding: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .map-popover-title {
      font-size: 18px;
      font-weight: bold;
      color: var(--text-color, #111);
    }
    .map-popover-close {
      background: transparent;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: var(--light-text-color, #999);
    }
    .map-popover-body {
      padding: 15px;
      overflow-y: auto;
      max-height: 350px;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    
    /* Aliyot list */
    .map-aliyot-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
      border: 1px solid var(--medium-accent-color, #eee);
      border-radius: 6px;
      padding: 8px;
      background: var(--light-accent-color, #fafafa);
    }
    .map-aliyah-row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      padding: 4px 6px;
      border-bottom: 1px solid var(--light-accent-color, #eee);
    }
    .map-aliyah-row:last-child {
      border-bottom: none;
    }
    .map-aliyah-label {
      font-weight: bold;
      color: #0b57d0;
    }
    .map-aliyah-range {
      direction: ltr;
      color: var(--light-text-color, #555);
    }
    
    .map-popover-footer {
      padding: 12px 15px;
      border-top: 1px solid var(--medium-accent-color, #eee);
      background: #fafafa;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
  `,document.head.appendChild(e);const a=document.createElement("div");a.className="parsha-picker map-outer-container";const n=document.createElement("div");n.className="map-overlay",n.innerHTML=`
    <div class="map-popover">
      <div class="map-popover-header">
        <span class="map-popover-title">פרשת בראשית</span>
        <button class="map-popover-close">×</button>
      </div>
      <div class="map-popover-body">
        <div class="map-popover-meta"></div>
        <div class="map-aliyot-list"></div>
      </div>
      <div class="map-popover-footer"></div>
    </div>
  `,n.querySelector(".map-popover-close").addEventListener("click",()=>n.classList.remove("is-visible")),n.addEventListener("click",c=>{c.target===n&&n.classList.remove("is-visible")}),document.body.appendChild(n);let r=new u().getFullYear();const i=(c,d)=>{const g=n.querySelector(".map-popover-title");g.textContent=W(d);const _=n.querySelector(".map-popover-meta");new u(c.date),_.innerHTML=`
      <div style="font-size: 14px; color: var(--light-text-color, #666); margin-bottom: 10px;">
        <strong>תאריך עברי:</strong> ${re(c.date)} ${r}<br>
        <strong>תאריך לועזי:</strong> ${ge(c.date)}
      </div>
    `;const f=n.querySelector(".map-aliyot-list");f.innerHTML="";const E=d.runs.find(I=>I.type===B.Main);E&&E.aliyot.forEach(I=>{const w=document.createElement("div");w.className="map-aliyah-row";const A=document.createElement("span");A.className="map-aliyah-label";const b=["ראשון","שני","שלישי","רביעי","חמישי","שישי","שביעי"],y=Number(I.index);A.textContent=isNaN(y)?`עליה ${I.index??""}`:b[y-1]||`עליה ${I.index??""}`;const S=document.createElement("span");S.className="map-aliyah-range",S.textContent=`${I.start.c}:${I.start.v} - ${I.end.c}:${I.end.v}`,w.appendChild(A),w.appendChild(S),f.appendChild(w)});const C=n.querySelector(".map-popover-footer");C.innerHTML="",Se(d).forEach(I=>{const w=document.createElement("a");w.href=I.url,w.className="timeline-action-btn",w.style.cssText=`
        text-decoration: none;
        padding: 6px 12px;
        font-size: 13px;
        border-radius: 5px;
        background: ${I.type===B.Main?"#0b57d0":"transparent"};
        color: ${I.type===B.Main?"#fff":"#0b57d0"};
        border: 1px solid #0b57d0;
        font-weight: bold;
        text-align: center;
      `,w.textContent=I.label,w.addEventListener("click",()=>n.classList.remove("is-visible")),C.appendChild(w)}),n.classList.add("is-visible")},l=()=>{a.innerHTML="";const c=document.createElement("div");c.className="map-controls";const d=document.createElement("button");d.className="map-controls-btn",d.textContent=`« ${r-1}`,d.addEventListener("click",()=>{r--,l()});const g=document.createElement("span");g.textContent=`Chumash Map — Year ${r}`,g.style.fontWeight="bold";const _=document.createElement("button");_.className="map-controls-btn",_.textContent=`${r+1} »`,_.addEventListener("click",()=>{r++,l()}),c.appendChild(d),c.appendChild(g),c.appendChild(_),a.appendChild(c);const f=document.createElement("div");f.className="map-grid";const E={1:{name:"ספר בראשית",leinings:[]},2:{name:"ספר שמות",leinings:[]},3:{name:"ספר ויקרא",leinings:[]},4:{name:"ספר במדבר",leinings:[]},5:{name:"ספר דברים",leinings:[]}};t.forHebrewYear(r).forEach(m=>{m.leinings.forEach(I=>{if(I.isParsha){const w=I.runs[0].aliyot[0].start.b;E[w]&&E[w].leinings.push({date:m,inst:I})}})});for(let m=1;m<=5;m++){const I=document.createElement("div");I.className="map-column";const w=document.createElement("div");w.className="map-column-header",w.textContent=E[m].name,I.appendChild(w);const A=document.createElement("div");A.className="map-tiles",E[m].leinings.forEach(({date:b,inst:y})=>{const S=document.createElement("div");S.className="map-tile";const h=document.createElement("span");h.className="map-tile-name",h.textContent=W(y);const x=document.createElement("span");x.className="map-tile-date",x.textContent=re(b.date),S.appendChild(h),S.appendChild(x),S.addEventListener("click",()=>i(b,y)),A.appendChild(S)}),I.appendChild(A),f.appendChild(I)}a.appendChild(f)};return l(),{node:a,onMount:()=>{console.log("Chumash Map Mounted")},onDestroy:()=>{e.remove(),n.remove()}}},Nc=t=>new u(1,13,t).getFullYear()===t,Vc=(t,e)=>new u(30,t,e).getMonth()!==t?29:30,ya=t=>Nc(t)?[{num:1,name:"תשרי"},{num:2,name:"חשוון"},{num:3,name:"כסלו"},{num:4,name:"טבת"},{num:5,name:"שבט"},{num:6,name:"אדר א׳"},{num:7,name:"אדר ב׳"},{num:8,name:"ניסן"},{num:9,name:"אייר"},{num:10,name:"סיוון"},{num:11,name:"תמוז"},{num:12,name:"אב"},{num:13,name:"אלול"}]:[{num:1,name:"תשרי"},{num:2,name:"חשוון"},{num:3,name:"כסלו"},{num:4,name:"טבת"},{num:5,name:"שבט"},{num:6,name:"אדר"},{num:7,name:"ניסן"},{num:8,name:"אייר"},{num:9,name:"סיוון"},{num:10,name:"תמוז"},{num:11,name:"אב"},{num:12,name:"אלול"}],jc=t=>{const e=document.createElement("style");e.textContent=`
    .cal-container {
      direction: rtl;
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 500px;
      margin: 0 auto;
      padding: 15px;
      color: var(--text-color, #333);
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    
    .cal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--paper-color, #fff);
      border: 1px solid var(--medium-accent-color, #eee);
      padding: 10px 15px;
      border-radius: 10px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.02);
    }
    .cal-month-switcher {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .cal-header-title {
      font-size: 18px;
      font-weight: bold;
      color: var(--text-color, #111);
    }
    .cal-btn {
      padding: 6px 12px;
      border: 1px solid var(--heavy-accent-color, #999);
      border-radius: 6px;
      background: transparent;
      color: var(--text-color, #333);
      cursor: pointer;
      font-weight: bold;
      user-select: none;
    }
    .cal-btn:hover {
      background: var(--light-accent-color, #f5f5f5);
    }

    /* Calendar Grid */
    .cal-grid-wrapper {
      border: 1px solid var(--medium-accent-color, #ddd);
      border-radius: 12px;
      overflow: hidden;
      background: var(--paper-color, #fff);
      box-shadow: 0 4px 12px rgba(0,0,0,0.04);
    }
    .cal-weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      background: var(--light-accent-color, #f5f5f5);
      border-bottom: 1px solid var(--medium-accent-color, #ddd);
      padding: 8px 0;
      text-align: center;
      font-weight: bold;
      font-size: 13px;
      color: var(--light-text-color, #666);
    }
    .cal-days {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      padding: 8px;
      gap: 6px;
    }
    .cal-cell {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      font-size: 14px;
      font-weight: 500;
      border-radius: 50%;
      cursor: default;
      user-select: none;
      color: var(--text-color, #444);
    }
    .cal-cell.is-empty {
      visibility: hidden;
    }
    .cal-cell.is-leining {
      cursor: pointer;
      background: rgba(11, 87, 208, 0.06);
      border: 1.5px dashed #0b57d0;
      font-weight: bold;
      color: #0b57d0;
    }
    .cal-cell.is-leining:hover {
      background: rgba(11, 87, 208, 0.15);
    }
    .cal-cell.is-active {
      background: #0b57d0 !important;
      color: #fff !important;
      border-style: solid !important;
      box-shadow: 0 2px 6px rgba(11, 87, 208, 0.3);
    }
    
    /* Details drawer */
    .cal-drawer {
      border: 1px solid var(--medium-accent-color, #ddd);
      border-radius: 12px;
      background: var(--paper-color, #fff);
      padding: 15px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.04);
      display: none;
      flex-direction: column;
      gap: 12px;
      animation: cal-drawer-in 0.25s ease-out;
    }
    .cal-drawer.is-visible {
      display: flex;
    }
    @keyframes cal-drawer-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .cal-drawer-title {
      font-size: 18px;
      font-weight: bold;
      color: var(--text-color, #111);
      border-bottom: 1px solid var(--medium-accent-color, #eee);
      padding-bottom: 8px;
    }
    .cal-drawer-meta {
      font-size: 13px;
      color: var(--light-text-color, #666);
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .cal-drawer-actions {
      display: flex;
      gap: 8px;
      margin-top: 5px;
    }
    .cal-action-btn {
      text-decoration: none;
      padding: 6px 14px;
      font-size: 13px;
      border-radius: 6px;
      background: #0b57d0;
      color: #fff;
      font-weight: bold;
      text-align: center;
      transition: background 0.2s;
    }
    .cal-action-btn:hover {
      background: #0842a0;
    }
    .cal-action-btn.mod-secondary {
      background: transparent;
      color: #0b57d0;
      border: 1px solid #0b57d0;
    }
    .cal-action-btn.mod-secondary:hover {
      background: rgba(11, 87, 208, 0.05);
    }
  `,document.head.appendChild(e);const a=document.createElement("div");a.className="parsha-picker cal-container";const n=new u;let o=n.getFullYear(),i=ya(o).findIndex(g=>g.num===n.getMonth());i===-1&&(i=0);const l=document.createElement("div");l.className="cal-drawer",l.innerHTML=`
    <div class="cal-drawer-title"></div>
    <div class="cal-drawer-meta"></div>
    <div class="cal-drawer-actions"></div>
  `;const c=()=>{a.innerHTML="";const g=ya(o);i>=g.length?i=g.length-1:i<0&&(i=0);const _=g[i],f=document.createElement("div");f.className="cal-header";const E=document.createElement("button");E.className="cal-btn",E.textContent=`« ${o-1}`,E.addEventListener("click",()=>{o--,c()});const C=document.createElement("div");C.className="cal-month-switcher";const m=document.createElement("button");m.className="cal-btn",m.textContent="◀",m.addEventListener("click",()=>{i>0?i--:(o--,i=ya(o).length-1),c()});const I=document.createElement("span");I.className="cal-header-title",I.textContent=`${_.name} ${o}`;const w=document.createElement("button");w.className="cal-btn",w.textContent="▶",w.addEventListener("click",()=>{i<g.length-1?i++:(o++,i=0),c()});const A=document.createElement("button");A.className="cal-btn",A.textContent=`${o+1} »`,A.addEventListener("click",()=>{o++,c()}),C.appendChild(m),C.appendChild(I),C.appendChild(w),f.appendChild(E),f.appendChild(C),f.appendChild(A),a.appendChild(f);const b=document.createElement("div");b.className="cal-grid-wrapper";const y=document.createElement("div");y.className="cal-weekdays",["א","ב","ג","ד","ה","ו","ש"].forEach(T=>{const L=document.createElement("span");L.textContent=T,y.appendChild(L)}),b.appendChild(y);const h=document.createElement("div");h.className="cal-days";const v=new u(1,_.num,o).greg().getDay();for(let T=0;T<v;T++){const L=document.createElement("div");L.className="cal-cell is-empty",h.appendChild(L)}const k=t.forHebrewYear(o),p={};k.forEach(T=>{T.leinings.forEach(L=>{const O=new u(T.date);O.getMonth()===_.num&&(p[O.getDate()]={date:T,inst:L})})});const M=Vc(_.num,o);for(let T=1;T<=M;T++){const L=document.createElement("div");L.className="cal-cell",L.textContent=String(T);const O=p[T];O&&(L.classList.add("is-leining"),L.addEventListener("click",()=>{h.querySelectorAll(".cal-cell").forEach(R=>R.classList.remove("is-active")),L.classList.add("is-active"),d(O.date,O.inst)})),h.appendChild(L)}b.appendChild(h),a.appendChild(b),l.classList.remove("is-visible"),a.appendChild(l)},d=(g,_)=>{const f=l.querySelector(".cal-drawer-title");f.textContent=W(_);const E=l.querySelector(".cal-drawer-meta");new u(g.date),E.innerHTML=`
      <span><strong>תאריך עברי:</strong> ${re(g.date)} ${o}</span>
      <span><strong>תאריך לועזי:</strong> ${ge(g.date)}</span>
      <span><strong>תיאור קריאה:</strong> ${g.title.he}</span>
    `;const C=l.querySelector(".cal-drawer-actions");C.innerHTML="",Se(_).forEach(I=>{const w=document.createElement("a");w.href=I.url,w.className=`cal-action-btn ${I.type!==B.Main?"mod-secondary":""}`,w.textContent=I.label,C.appendChild(w)}),l.classList.add("is-visible")};return c(),{node:a,onMount:()=>{console.log("Calendar Grid Mounted")},onDestroy:()=>{e.remove()}}},$c=t=>{const e=document.createElement("style");e.textContent=`
    .miller-container {
      direction: rtl;
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      border: 1px solid var(--medium-accent-color, #ddd);
      border-radius: 12px;
      overflow: hidden;
      background: var(--paper-color, #fff);
      box-shadow: 0 4px 16px rgba(0,0,0,0.05);
      height: calc(100vh - var(--header-height) - 120px);
    }
    
    /* Each column pane */
    .miller-column {
      flex: 1;
      border-left: 1px solid var(--medium-accent-color, #eee);
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      min-width: 130px;
    }
    .miller-column:last-child {
      border-left: none;
      flex: 1.2; /* Make details pane slightly wider */
      background: var(--light-accent-color, #fafafa);
      min-width: 180px;
    }
    
    .miller-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .miller-item {
      padding: 10px 15px;
      font-size: 14px;
      cursor: pointer;
      user-select: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--light-accent-color, #f5f5f5);
      color: var(--text-color, #333);
    }
    .miller-item:hover {
      background: var(--light-accent-color, #f0f0f0);
    }
    .miller-item.is-selected {
      background: #0b57d0;
      color: #fff !important;
      font-weight: bold;
    }
    .miller-item-arrow {
      font-size: 10px;
      color: var(--light-text-color, #999);
    }
    .miller-item.is-selected .miller-item-arrow {
      color: #fff;
    }
    
    /* Details pane */
    .miller-details {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .miller-details-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--light-text-color, #888);
      font-size: 14px;
      text-align: center;
    }
    .miller-details-title {
      font-size: 20px;
      font-weight: bold;
      color: var(--text-color, #111);
      border-bottom: 2px solid #0b57d0;
      padding-bottom: 8px;
    }
    .miller-details-meta {
      font-size: 13px;
      color: var(--light-text-color, #555);
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .miller-details-actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 10px;
    }
    .miller-action-btn {
      text-decoration: none;
      padding: 8px 15px;
      font-size: 14px;
      border-radius: 6px;
      background: #0b57d0;
      color: #fff;
      font-weight: bold;
      text-align: center;
      transition: background 0.2s;
    }
    .miller-action-btn:hover {
      background: #0842a0;
    }
    .miller-action-btn.mod-secondary {
      background: transparent;
      color: #0b57d0;
      border: 1px solid #0b57d0;
    }
    .miller-action-btn.mod-secondary:hover {
      background: rgba(11, 87, 208, 0.05);
    }

    .miller-year-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--paper-color, #fff);
      border: 1px solid var(--medium-accent-color, #eee);
      padding: 8px 15px;
      border-radius: 8px;
      margin-bottom: 12px;
      direction: ltr;
    }
    .miller-year-btn {
      padding: 5px 10px;
      border: 1px solid var(--heavy-accent-color, #999);
      border-radius: 4px;
      background: transparent;
      color: var(--text-color, #333);
      cursor: pointer;
      font-weight: bold;
    }
  `,document.head.appendChild(e);const a=document.createElement("div");a.className="parsha-picker",a.style.display="flex",a.style.flexDirection="column";let n=new u().getFullYear();const o=()=>{a.innerHTML="";const r=document.createElement("div");r.className="miller-year-controls";const i=document.createElement("button");i.className="miller-year-btn",i.textContent=`« ${n-1}`,i.addEventListener("click",()=>{n--,o()});const l=document.createElement("span");l.textContent=`Cascading Columns — Year ${n}`,l.style.fontWeight="bold";const c=document.createElement("button");c.className="miller-year-btn",c.textContent=`${n+1} »`,c.addEventListener("click",()=>{n++,o()}),r.appendChild(i),r.appendChild(l),r.appendChild(c),a.appendChild(r);const d=document.createElement("div");d.className="miller-container";const g=document.createElement("div");g.className="miller-column";const _=document.createElement("div");_.className="miller-column";const f=document.createElement("div");f.className="miller-column";const E=document.createElement("div");E.className="miller-column",d.appendChild(g),d.appendChild(_),d.appendChild(f),d.appendChild(E),a.appendChild(d);const C=t.forHebrewYear(n),m={1:[],2:[],3:[],4:[],5:[]},I={"ימים נוראים":[],"סוכות ושמיני עצרת":[],"חנוכה ופורים":[],פסח:[],שבועות:[],תעניות:[],"ראש חודש":[]},w=[];C.forEach(v=>{v.leinings.forEach(k=>{if(k.isParsha){const p=k.runs[0].aliyot[0].start.b;m[p]&&m[p].push({date:v,inst:k})}else if(k.id===q.Megillah)w.push({date:v,inst:k});else{const p=k.date.title.he;p.includes("ראש השנה")||p.includes("כיפור")||p.includes("כפור")?I["ימים נוראים"].push({date:v,inst:k}):p.includes("סוכות")||p.includes("שמיני עצרת")||p.includes("שמחת תורה")||p.includes("הושענא רבא")?I["סוכות ושמיני עצרת"].push({date:v,inst:k}):p.includes("חנוכה")||p.includes("פורים")||p.includes("שבת שקלים")||p.includes("שבת זכור")?I["חנוכה ופורים"].push({date:v,inst:k}):p.includes("פסח")||p.includes("שבת הגדול")||p.includes("שבת פרה")||p.includes("שבת החודש")?I.פסח.push({date:v,inst:k}):p.includes("שבועות")?I.שבועות.push({date:v,inst:k}):p.includes("תענית")||p.includes("עשרה בטבת")||p.includes("שבעה עשר")||p.includes("איכה")||p.includes("צום")||p.includes("תשעה באב")?I.תעניות.push({date:v,inst:k}):I["ראש חודש"].push({date:v,inst:k})}})});const A=(v,k)=>{E.innerHTML="";const p=document.createElement("div");p.className="miller-details";const M=document.createElement("div");M.className="miller-details-title",M.textContent=W(k),new u(v.date);const T=document.createElement("div");T.className="miller-details-meta",T.innerHTML=`
        <span><strong>תאריך עברי:</strong> ${re(v.date)} ${n}</span>
        <span><strong>תאריך לועזי:</strong> ${ge(v.date)}</span>
        <span><strong>קריאה:</strong> ${v.title.he}</span>
      `;const L=document.createElement("div");L.className="miller-details-actions",Se(k).forEach(R=>{const $=document.createElement("a");$.href=R.url,$.className=`miller-action-btn ${R.type!==B.Main?"mod-secondary":""}`,$.textContent=R.label,L.appendChild($)}),p.appendChild(M),p.appendChild(T),p.appendChild(L),E.appendChild(p)},b=()=>{E.innerHTML='<div class="miller-details-placeholder">בחר פריט כדי להציג פרטים</div>'},y=v=>{f.innerHTML="",b();const k=document.createElement("ul");k.className="miller-list",v.forEach(({date:p,inst:M})=>{const T=document.createElement("li");T.className="miller-item",T.textContent=W(M),T.addEventListener("click",()=>{f.querySelectorAll(".miller-item").forEach(L=>L.classList.remove("is-selected")),T.classList.add("is-selected"),A(p,M)}),k.appendChild(T)}),f.appendChild(k)},S=v=>{_.innerHTML="",f.innerHTML="",b();const k=document.createElement("ul");if(k.className="miller-list",v==="torah")[{id:1,name:"ספר בראשית"},{id:2,name:"ספר שמות"},{id:3,name:"ספר ויקרא"},{id:4,name:"ספר במדבר"},{id:5,name:"ספר דברים"}].forEach(M=>{const T=document.createElement("li");T.className="miller-item",T.innerHTML=`<span>${M.name}</span><span class="miller-item-arrow">◀</span>`,T.addEventListener("click",()=>{_.querySelectorAll(".miller-item").forEach(L=>L.classList.remove("is-selected")),T.classList.add("is-selected"),y(m[M.id])}),k.appendChild(T)});else if(v==="holiday")Object.keys(I).forEach(p=>{const M=I[p];if(!M.length)return;const T=document.createElement("li");T.className="miller-item",T.innerHTML=`<span>${p}</span><span class="miller-item-arrow">◀</span>`,T.addEventListener("click",()=>{_.querySelectorAll(".miller-item").forEach(L=>L.classList.remove("is-selected")),T.classList.add("is-selected"),y(M)}),k.appendChild(T)});else if(v==="megillah"){const p=document.createElement("li");p.className="miller-item",p.innerHTML='<span>מגילות המועדים</span><span class="miller-item-arrow">◀</span>',p.addEventListener("click",()=>{_.querySelectorAll(".miller-item").forEach(M=>M.classList.remove("is-selected")),p.classList.add("is-selected"),y(w)}),k.appendChild(p)}_.appendChild(k)},h=[{id:"torah",name:"תורה וחומשים"},{id:"holiday",name:"מועדים וחגים"},{id:"megillah",name:"מגילות המועדים"}],x=document.createElement("ul");x.className="miller-list",h.forEach(v=>{const k=document.createElement("li");k.className="miller-item",k.innerHTML=`<span>${v.name}</span><span class="miller-item-arrow">◀</span>`,k.addEventListener("click",()=>{g.querySelectorAll(".miller-item").forEach(p=>p.classList.remove("is-selected")),k.classList.add("is-selected"),S(v.id)}),x.appendChild(k)}),g.appendChild(x),b()};return o(),{node:a,onMount:()=>{console.log("Miller Columns Mounted")},onDestroy:()=>{e.remove()}}},zc=t=>{const e=document.createElement("style");e.textContent=`
    .radial-picker-container {
      direction: rtl;
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      border: 1px solid var(--medium-accent-color, #ddd);
      border-radius: 12px;
      overflow: hidden;
      background: var(--paper-color, #fff);
      box-shadow: 0 4px 16px rgba(0,0,0,0.05);
      height: calc(100vh - var(--header-height) - 120px);
    }
    
    .radial-wheel-pane {
      flex: 1.5;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      background: var(--light-accent-color, #fafafa);
      border-left: 1px solid var(--medium-accent-color, #eee);
      overflow: hidden;
    }
    
    .radial-details-pane {
      flex: 1;
      padding: 25px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      overflow-y: auto;
      background: var(--paper-color, #fff);
    }
    
    .radial-details-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--light-text-color, #888);
      font-size: 14px;
      text-align: center;
    }
    
    .radial-details-title {
      font-size: 22px;
      font-weight: bold;
      color: var(--text-color, #111);
      border-bottom: 2px solid #0b57d0;
      padding-bottom: 10px;
    }
    
    .radial-details-meta {
      font-size: 14px;
      color: var(--light-text-color, #555);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .radial-details-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 15px;
    }
    
    .radial-action-btn {
      text-decoration: none;
      padding: 10px 15px;
      font-size: 14px;
      border-radius: 8px;
      background: #0b57d0;
      color: #fff;
      font-weight: bold;
      text-align: center;
      transition: background 0.2s;
    }
    .radial-action-btn:hover {
      background: #0842a0;
    }
    .radial-action-btn.mod-secondary {
      background: transparent;
      color: #0b57d0;
      border: 1px solid #0b57d0;
    }
    .radial-action-btn.mod-secondary:hover {
      background: rgba(11, 87, 208, 0.05);
    }
    
    /* SVG styles */
    .wheel-month-arc {
      fill: var(--paper-color, #fff);
      stroke: var(--medium-accent-color, #ddd);
      stroke-width: 1;
      transition: fill 0.2s;
      cursor: pointer;
    }
    .wheel-month-arc:hover {
      fill: var(--light-accent-color, #f5f5f5);
    }
    .wheel-month-text {
      font-size: 10px;
      font-weight: bold;
      fill: var(--text-color, #444);
      pointer-events: none;
      text-anchor: middle;
      dominant-baseline: middle;
    }
    
    .wheel-reading-point {
      fill: #0b57d0;
      stroke: #fff;
      stroke-width: 1.5;
      cursor: pointer;
      transition: r 0.2s, fill 0.2s;
    }
    .wheel-reading-point:hover {
      r: 8;
      fill: #0842a0;
    }
    .wheel-reading-point.is-selected {
      r: 10;
      fill: #ea4335;
      stroke: #fff;
      stroke-width: 2;
    }
    .wheel-reading-point.is-holiday {
      fill: #f9ab00;
    }
    .wheel-reading-point.is-holiday:hover {
      fill: #e37400;
    }
    .wheel-reading-point.is-holiday.is-selected {
      fill: #ea4335;
    }
    
    /* Labels for readings, visible on zoom */
    .wheel-reading-label {
      font-size: 7px;
      fill: var(--text-color, #333);
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease, font-size 0.2s;
      font-weight: bold;
      direction: ltr; /* Keep LTR layout for text-anchor consistency */
    }
    
    /* Zoom-specific label visibility */
    .zoom-q1 .q1-label { opacity: 1; }
    .zoom-q2 .q2-label { opacity: 1; }
    .zoom-q3 .q3-label { opacity: 1; }
    .zoom-q4 .q4-label { opacity: 1; }
    
    .wheel-reading-label.is-selected {
      opacity: 1 !important;
      fill: #ea4335;
      font-size: 9px;
    }
    
    .wheel-center-circle {
      cursor: pointer;
      transition: fill 0.2s;
    }
    .wheel-center-circle:hover {
      fill: var(--light-accent-color, #f0f0f0);
    }
    
    .wheel-center-label {
      font-size: 15px;
      font-weight: bold;
      fill: var(--text-color, #111);
      text-anchor: middle;
      dominant-baseline: middle;
      pointer-events: none;
    }
    .wheel-center-sublabel {
      font-size: 10px;
      fill: var(--light-text-color, #666);
      text-anchor: middle;
      dominant-baseline: middle;
      pointer-events: none;
    }
    
    .radial-year-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--paper-color, #fff);
      border: 1px solid var(--medium-accent-color, #eee);
      padding: 8px 15px;
      border-radius: 8px;
      margin-bottom: 12px;
      direction: ltr;
    }
    .radial-year-btn {
      padding: 5px 10px;
      border: 1px solid var(--heavy-accent-color, #999);
      border-radius: 4px;
      background: transparent;
      color: var(--text-color, #333);
      cursor: pointer;
      font-weight: bold;
    }
    
    .wheel-connector-line {
      stroke: var(--medium-accent-color, #eee);
      stroke-width: 1;
      stroke-dasharray: 2,2;
    }
    
    /* Zoom instructions overlay */
    .radial-zoom-hint {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(0,0,0,0.6);
      color: #fff;
      font-size: 11px;
      padding: 4px 8px;
      border-radius: 4px;
      pointer-events: none;
      font-family: inherit;
    }
    
    /* Mobile Responsiveness */
    @media (max-width: 768px) {
      .radial-picker-container {
        flex-direction: column;
        height: calc(100vh - var(--header-height) - 100px);
      }
      
      .radial-wheel-pane {
        flex: 1.3;
        border-left: none;
        border-bottom: 1px solid var(--medium-accent-color, #eee);
        min-height: 280px;
      }
      
      .radial-details-pane {
        flex: 1;
        padding: 15px;
      }
      
      .radial-details-title {
        font-size: 18px;
      }
      
      .radial-zoom-hint {
        font-size: 9px;
        padding: 2px 6px;
      }
      
      /* Scale text sizes up inside SVG for mobile screen rendering */
      .wheel-reading-label {
        font-size: 8.5px;
      }
      .wheel-reading-label.is-selected {
        font-size: 10.5px;
      }
      .wheel-month-text {
        font-size: 11.5px;
      }
      .wheel-center-label {
        font-size: 16px;
      }
      .wheel-center-sublabel {
        font-size: 11px;
      }
    }
  `,document.head.appendChild(e);const a=document.createElement("div");a.className="parsha-picker",a.style.display="flex",a.style.flexDirection="column";let n=new u().getFullYear(),o=null,r="full";const i=(g,_,f,E,C,m)=>{const I=C*Math.PI/180,w=m*Math.PI/180,A={x:g+E*Math.cos(I),y:_+E*Math.sin(I)},b={x:g+E*Math.cos(w),y:_+E*Math.sin(w)},y={x:g+f*Math.cos(w),y:_+f*Math.sin(w)},S={x:g+f*Math.cos(I),y:_+f*Math.sin(I)},h=Math.abs(m-C)>180?1:0;return[`M ${A.x} ${A.y}`,`A ${E} ${E} 0 ${h} 1 ${b.x} ${b.y}`,`L ${y.x} ${y.y}`,`A ${f} ${f} 0 ${h} 0 ${S.x} ${S.y}`,"Z"].join(" ")},l=g=>{const _=(g%360+360)%360;return _>=0&&_<90?"q4":_>=90&&_<180?"q3":_>=180&&_<270?"q2":"q1"},c=(g,_,f,E,C,m=350)=>{const I=performance.now(),w=g.viewBox.baseVal,A=w.x,b=w.y,y=w.width,S=w.height,h=x=>{const v=Math.min((x-I)/m,1),k=v<.5?2*v*v:1-Math.pow(-2*v+2,2)/2,p=A+(_-A)*k,M=b+(f-b)*k,T=y+(E-y)*k,L=S+(C-S)*k;g.setAttribute("viewBox",`${p} ${M} ${T} ${L}`),v<1&&requestAnimationFrame(h)};requestAnimationFrame(h)},d=()=>{a.innerHTML="";const g=document.createElement("div");g.className="radial-year-controls";const _=document.createElement("button");_.className="radial-year-btn",_.textContent=`« ${n-1}`,_.addEventListener("click",()=>{n--,o=null,r="full",d()});const f=document.createElement("span");f.textContent=`Radial Cycle Wheel — Year ${n}`,f.style.fontWeight="bold";const E=document.createElement("button");E.className="radial-year-btn",E.textContent=`${n+1} »`,E.addEventListener("click",()=>{n++,o=null,r="full",d()}),g.appendChild(_),g.appendChild(f),g.appendChild(E),a.appendChild(g);const C=document.createElement("div");C.className="radial-picker-container";const m=document.createElement("div");m.className="radial-wheel-pane";const I=document.createElement("div");I.className="radial-zoom-hint",I.textContent="לחץ על חודש כדי להתמקד | לחץ במרכז כדי לצאת",m.appendChild(I);const w=document.createElement("div");w.className="radial-details-pane",C.appendChild(m),C.appendChild(w),a.appendChild(C);const A=t.forHebrewYear(n);if(!A.length)return;const b=A[A.length-1].date.getTime()-A[0].date.getTime(),y={},S=new Set,h=[];A.forEach(N=>{N.leinings.forEach(F=>{const ce=-90-(N.date.getTime()-A[0].date.getTime())/(b||1)*360,me=new u(N.date).getMonth();S.add(me);const he=l(ce),de={date:N,inst:F,angleDeg:ce,quad:he};h.push(de),y[me]||(y[me]=[]),y[me].push(de)})});const x="http://www.w3.org/2000/svg",v=document.createElementNS(x,"svg");v.setAttribute("width","100%"),v.setAttribute("height","100%"),v.setAttribute("viewBox","0 0 500 500"),v.setAttribute("class",`zoom-${r}`),m.appendChild(v);const k=250,p=250,M=70,T=125,L=170,O=205,R=Array.from(S).sort((N,F)=>{const ae=y[N][0].date.date.getTime(),pe=y[F][0].date.date.getTime();return ae-pe}),Y=360/R.length,K={1:"ניסן",2:"אייר",3:"סיון",4:"תמוז",5:"אב",6:"אלול",7:"תשרי",8:"חשון",9:"כסלו",10:"טבת",11:"שבט",12:"אדר",13:"אדר ב׳"},ne={full:{x:0,y:0,w:500,h:500},q1:{x:230,y:50,w:220,h:220},q2:{x:50,y:50,w:220,h:220},q3:{x:50,y:230,w:220,h:220},q4:{x:230,y:230,w:220,h:220}};if(r!=="full"){const N=ne[r];v.setAttribute("viewBox",`${N.x} ${N.y} ${N.w} ${N.h}`)}const Zt=N=>{if(r===N)return;r=N,v.setAttribute("class",`zoom-${r}`);const F=ne[r];c(v,F.x,F.y,F.w,F.h)};R.forEach((N,F)=>{const ae=-90-F*Y,pe=-90-(F+1)*Y,ce=(ae+pe)/2,Q=document.createElementNS(x,"path");Q.setAttribute("d",i(k,p,L,O,ae,pe)),Q.setAttribute("class","wheel-month-arc"),Q.addEventListener("click",_e=>{_e.stopPropagation();const gt=l(ce);Zt(gt)}),v.appendChild(Q);const me=ce*Math.PI/180,he=(L+O)/2,de=k+he*Math.cos(me),at=p+he*Math.sin(me),Te=document.createElementNS(x,"text");Te.setAttribute("x",de.toString()),Te.setAttribute("y",at.toString()),Te.setAttribute("class","wheel-month-text"),Te.textContent=K[N]||`Month ${N}`;let ze=ce;ze<-90&&ze>-270&&(ze+=180),Te.setAttribute("transform",`rotate(${ze}, ${de}, ${at})`),v.appendChild(Te);const Re=document.createElementNS(x,"line"),Be=ae*Math.PI/180;Re.setAttribute("x1",(k+M*Math.cos(Be)).toString()),Re.setAttribute("y1",(p+M*Math.sin(Be)).toString()),Re.setAttribute("x2",(k+O*Math.cos(Be)).toString()),Re.setAttribute("y2",(p+O*Math.sin(Be)).toString()),Re.setAttribute("class","wheel-connector-line"),v.appendChild(Re)}),h.forEach(N=>{const F=N.angleDeg*Math.PI/180,ae=k+T*Math.cos(F),pe=p+T*Math.sin(F),ce=o&&o.date.id===N.date.id&&o.inst.id===N.inst.id,Q=document.createElementNS(x,"circle");Q.setAttribute("cx",ae.toString()),Q.setAttribute("cy",pe.toString()),Q.setAttribute("r","5");const me=!N.inst.isParsha;let he="wheel-reading-point";me&&(he+=" is-holiday"),ce&&(he+=" is-selected"),Q.setAttribute("class",he);const de=document.createElementNS(x,"title");de.textContent=`${W(N.inst)} (${re(N.date.date)})`,Q.appendChild(de),Q.addEventListener("click",xr=>{xr.stopPropagation(),o=N,Zt(N.quad),v.querySelectorAll(".wheel-reading-point").forEach(Wt=>Wt.classList.remove("is-selected")),Q.classList.add("is-selected"),v.querySelectorAll(".wheel-reading-label").forEach(Wt=>Wt.classList.remove("is-selected"));const hn=v.querySelector(`#label-${N.date.id}-${N.inst.id}`);hn&&hn.classList.add("is-selected"),dn(N.date,N.inst)}),v.appendChild(Q);const at=T-14,Te=k+at*Math.cos(F),ze=p+at*Math.sin(F),Be=Math.cos(F)>0?"end":"start",_e=document.createElementNS(x,"text");_e.setAttribute("id",`label-${N.date.id}-${N.inst.id}`),_e.setAttribute("x",Te.toString()),_e.setAttribute("y",ze.toString());let gt=`wheel-reading-label ${N.quad}-label`;ce&&(gt+=" is-selected"),_e.setAttribute("class",gt),_e.setAttribute("text-anchor",Be),_e.textContent=W(N.inst),v.appendChild(_e)});const bt=document.createElementNS(x,"g");v.appendChild(bt);const ke=document.createElementNS(x,"circle");ke.setAttribute("cx",k.toString()),ke.setAttribute("cy",p.toString()),ke.setAttribute("r",M.toString()),ke.setAttribute("fill","var(--paper-color, #fff)"),ke.setAttribute("stroke","var(--medium-accent-color, #ccc)"),ke.setAttribute("stroke-width","1"),ke.setAttribute("class","wheel-center-circle"),ke.addEventListener("click",N=>{N.stopPropagation(),Zt("full")}),bt.appendChild(ke);const et=document.createElementNS(x,"text");et.setAttribute("x",k.toString()),et.setAttribute("y",(p-10).toString()),et.setAttribute("class","wheel-center-label"),et.textContent="מחזור השנה",bt.appendChild(et);const tt=document.createElementNS(x,"text");tt.setAttribute("x",k.toString()),tt.setAttribute("y",(p+15).toString()),tt.setAttribute("class","wheel-center-sublabel"),tt.textContent=`שנת ${n}`,bt.appendChild(tt);const dn=(N,F)=>{w.innerHTML="";const ae=document.createElement("div");ae.style.display="flex",ae.style.flexDirection="column",ae.style.gap="15px";const pe=document.createElement("div");pe.className="radial-details-title",pe.textContent=W(F),new u(N.date);const ce=document.createElement("div");ce.className="radial-details-meta",ce.innerHTML=`
        <span><strong>תאריך עברי:</strong> ${re(N.date)} ${n}</span>
        <span><strong>תאריך לועזי:</strong> ${ge(N.date)}</span>
        <span><strong>קריאה בציבור:</strong> ${N.title.he}</span>
        <span><strong>סוג קריאה:</strong> ${F.isParsha?"פרשת השבוע":"מועד/חג"}</span>
      `;const Q=document.createElement("div");Q.className="radial-details-actions",Se(F).forEach(he=>{const de=document.createElement("a");de.href=he.url,de.className=`radial-action-btn ${he.type!==B.Main?"mod-secondary":""}`,de.textContent=he.label,Q.appendChild(de)}),ae.appendChild(pe),ae.appendChild(ce),ae.appendChild(Q),w.appendChild(ae)};o?dn(o.date,o.inst):(()=>{w.innerHTML='<div class="radial-details-placeholder">לחץ על אחת מהנקודות בגלגל כדי להציג פרטים קריאה</div>'})()};return d(),{node:a,onMount:()=>{console.log("Radial Cycle Mounted")},onDestroy:()=>{e.remove()}}},Bc=t=>{const e=document.createElement("style");e.textContent=`
    .kanban-picker-container {
      direction: rtl;
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      border: 1px solid var(--medium-accent-color, #ddd);
      border-radius: 12px;
      overflow: hidden;
      background: var(--paper-color, #fff);
      box-shadow: 0 4px 16px rgba(0,0,0,0.05);
      height: calc(100vh - var(--header-height) - 120px);
      position: relative;
    }
    
    .kanban-board {
      display: flex;
      flex: 1;
      overflow-x: auto;
      overflow-y: hidden;
      padding: 20px;
      gap: 15px;
      background: var(--light-accent-color, #f4f5f7);
      scroll-behavior: smooth;
    }
    
    .kanban-column {
      width: 260px;
      min-width: 260px;
      background: var(--paper-color, #fff);
      border-radius: 8px;
      border: 1px solid var(--medium-accent-color, #e1e4e8);
      display: flex;
      flex-direction: column;
      max-height: 100%;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    
    .kanban-column-header {
      padding: 12px 16px;
      font-weight: bold;
      font-size: 15px;
      border-bottom: 2px solid var(--light-accent-color, #e1e4e8);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--paper-color, #fafbfc);
      border-radius: 8px 8px 0 0;
      color: var(--text-color, #172b4d);
    }
    
    .kanban-column-badge {
      background: #ebecf0;
      color: #42526e;
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 10px;
      font-weight: normal;
    }
    
    .kanban-cards-list {
      padding: 10px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
    }
    
    .kanban-card {
      background: var(--paper-color, #fff);
      border: 1px solid var(--medium-accent-color, #e1e4e8);
      border-radius: 6px;
      padding: 12px;
      cursor: pointer;
      transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
      user-select: none;
      display: flex;
      flex-direction: column;
      gap: 6px;
      position: relative;
    }
    
    .kanban-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.08);
      border-color: #0b57d0;
    }
    
    .kanban-card.is-selected {
      border: 2px solid #0b57d0;
      background: rgba(11, 87, 208, 0.02);
    }
    
    .kanban-card-title {
      font-weight: bold;
      font-size: 14px;
      color: var(--text-color, #172b4d);
    }
    
    .kanban-card-date {
      font-size: 11px;
      color: var(--light-text-color, #5e6c84);
    }
    
    .kanban-card-tag {
      align-self: flex-start;
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: bold;
      background: #deebff;
      color: #0747a6;
    }
    .kanban-card-tag.mod-holiday {
      background: #fffae6;
      color: #b78103;
    }
    
    /* Bottom Details Drawer */
    .kanban-drawer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--paper-color, #fff);
      border-top: 1px solid var(--medium-accent-color, #ccc);
      box-shadow: 0 -4px 16px rgba(0,0,0,0.1);
      transform: translateY(100%);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      max-height: 200px;
      direction: rtl;
    }
    
    .kanban-drawer.is-open {
      transform: translateY(0);
    }
    
    .kanban-drawer-header {
      padding: 12px 20px;
      border-bottom: 1px solid var(--light-accent-color, #eee);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--light-accent-color, #fafafa);
    }
    
    .kanban-drawer-title {
      font-weight: bold;
      font-size: 16px;
      color: var(--text-color, #333);
    }
    
    .kanban-drawer-close {
      cursor: pointer;
      font-size: 18px;
      color: var(--light-text-color, #888);
      border: none;
      background: transparent;
    }
    
    .kanban-drawer-body {
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex: 1;
      overflow-y: auto;
    }
    
    .kanban-drawer-meta {
      font-size: 13px;
      color: var(--light-text-color, #555);
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .kanban-drawer-actions {
      display: flex;
      gap: 10px;
    }
    
    .kanban-action-btn {
      text-decoration: none;
      padding: 8px 16px;
      font-size: 13px;
      border-radius: 6px;
      background: #0b57d0;
      color: #fff;
      font-weight: bold;
      text-align: center;
      white-space: nowrap;
    }
    .kanban-action-btn:hover {
      background: #0842a0;
    }
    .kanban-action-btn.mod-secondary {
      background: transparent;
      color: #0b57d0;
      border: 1px solid #0b57d0;
    }
    .kanban-action-btn.mod-secondary:hover {
      background: rgba(11, 87, 208, 0.05);
    }
    
    .kanban-year-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--paper-color, #fff);
      border: 1px solid var(--medium-accent-color, #eee);
      padding: 8px 15px;
      border-radius: 8px;
      margin-bottom: 12px;
      direction: ltr;
    }
    .kanban-year-btn {
      padding: 5px 10px;
      border: 1px solid var(--heavy-accent-color, #999);
      border-radius: 4px;
      background: transparent;
      color: var(--text-color, #333);
      cursor: pointer;
      font-weight: bold;
    }
  `,document.head.appendChild(e);const a=document.createElement("div");a.className="parsha-picker",a.style.display="flex",a.style.flexDirection="column";let n=new u().getFullYear(),o=null;const r={7:"תשרי",8:"חשון",9:"כסלו",10:"טבת",11:"שבט",12:"אדר",13:"אדר ב׳",1:"ניסן",2:"אייר",3:"סיון",4:"תמוז",5:"אב",6:"אלול"},i=[7,8,9,10,11,12,13,1,2,3,4,5,6],l=()=>{a.innerHTML="";const c=document.createElement("div");c.className="kanban-year-controls";const d=document.createElement("button");d.className="kanban-year-btn",d.textContent=`« ${n-1}`,d.addEventListener("click",()=>{n--,o=null,l()});const g=document.createElement("span");g.textContent=`Kanban Month Board — Year ${n}`,g.style.fontWeight="bold";const _=document.createElement("button");_.className="kanban-year-btn",_.textContent=`${n+1} »`,_.addEventListener("click",()=>{n++,o=null,l()}),c.appendChild(d),c.appendChild(g),c.appendChild(_),a.appendChild(c);const f=document.createElement("div");f.className="kanban-picker-container";const E=document.createElement("div");E.className="kanban-board";const C=document.createElement("div");C.className="kanban-drawer",C.innerHTML=`
      <div class="kanban-drawer-header">
        <div class="kanban-drawer-title" id="drawer-title"></div>
        <button class="kanban-drawer-close" id="drawer-close">×</button>
      </div>
      <div class="kanban-drawer-body" id="drawer-body"></div>
    `,f.appendChild(E),f.appendChild(C),a.appendChild(f),C.querySelector("#drawer-close").addEventListener("click",()=>{C.classList.remove("is-open"),E.querySelectorAll(".kanban-card").forEach(b=>b.classList.remove("is-selected")),o=null});const I=t.forHebrewYear(n),w={};i.forEach(b=>{w[b]=[]}),I.forEach(b=>{b.leinings.forEach(y=>{const h=new u(b.date).getMonth();w[h]&&w[h].push({date:b,inst:y})})}),i.forEach(b=>{const y=w[b];if(!y||y.length===0&&b===13)return;const S=document.createElement("div");S.className="kanban-column";const h=document.createElement("div");h.className="kanban-column-header",h.innerHTML=`
        <span>${r[b]}</span>
        <span class="kanban-column-badge">${y.length} קריאות</span>
      `;const x=document.createElement("div");x.className="kanban-cards-list",y.forEach(({date:v,inst:k})=>{const p=document.createElement("div"),M=`${v.id}:${k.id}`;p.className=`kanban-card ${o===M?"is-selected":""}`;const T=!k.isParsha,L=T?"חג/מועד":"פרשה",O=T?"kanban-card-tag mod-holiday":"kanban-card-tag";p.innerHTML=`
          <div class="kanban-card-title">${W(k)}</div>
          <div class="kanban-card-date">${re(v.date)}</div>
          <div class="${O}">${L}</div>
        `,p.addEventListener("click",()=>{E.querySelectorAll(".kanban-card").forEach(R=>R.classList.remove("is-selected")),p.classList.add("is-selected"),o=M,A(v,k)}),x.appendChild(p)}),S.appendChild(h),S.appendChild(x),E.appendChild(S)});const A=(b,y)=>{const S=C.querySelector("#drawer-title"),h=C.querySelector("#drawer-body");S.textContent=W(y),new u(b.date),h.innerHTML=`
        <div class="kanban-drawer-meta">
          <span><strong>תאריך עברי:</strong> ${re(b.date)} ${n}</span>
          <span><strong>תאריך לועזי:</strong> ${ge(b.date)}</span>
          <span><strong>קריאה בציבור:</strong> ${b.title.he}</span>
        </div>
        <div class="kanban-drawer-actions" id="drawer-actions"></div>
      `;const x=h.querySelector("#drawer-actions");Se(y).forEach(k=>{const p=document.createElement("a");p.href=k.url,p.className=`kanban-action-btn ${k.type!==B.Main?"mod-secondary":""}`,p.textContent=k.label,x.appendChild(p)}),C.classList.add("is-open")};if(o){const[b,y]=o.split(":"),S=I.flatMap(h=>h.leinings.map(x=>({date:h,inst:x}))).find(h=>h.date.id===b&&h.inst.id===y);S&&A(S.date,S.inst)}};return l(),{node:a,onMount:()=>{console.log("Kanban Board Mounted")},onDestroy:()=>{e.remove()}}},Yc=t=>{const e=document.createElement("style");e.textContent=`
    .terminal-container {
      direction: ltr; /* Terminal is traditionally LTR, but we will print Hebrew text inside it nicely */
      font-family: 'Courier New', Courier, monospace;
      background: #0c0c0c;
      color: #00ff00;
      border: 2px solid #333;
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
      padding: 20px;
      height: calc(100vh - var(--header-height) - 120px);
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }
    
    .terminal-screen {
      flex: 1;
      overflow-y: auto;
      margin-bottom: 15px;
      padding-right: 10px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .terminal-line {
      line-height: 1.4;
      white-space: pre-wrap;
      word-break: break-all;
      font-size: 13px;
    }
    
    .terminal-line.mod-input {
      color: #00ffff;
      font-weight: bold;
    }
    
    .terminal-line.mod-error {
      color: #ff3333;
    }
    
    .terminal-line.mod-success {
      color: #ffff00;
    }
    
    .terminal-line.mod-header {
      color: #ffffff;
      border-bottom: 1px dashed #333;
      padding-bottom: 4px;
      margin-bottom: 4px;
    }
    
    .terminal-link {
      color: #00ff00;
      text-decoration: underline;
      cursor: pointer;
      font-weight: bold;
    }
    .terminal-link:hover {
      color: #ffffff;
      background: #003300;
    }
    
    .terminal-input-line {
      display: flex;
      align-items: center;
      gap: 8px;
      border-top: 1px solid #222;
      padding-top: 10px;
    }
    
    .terminal-prompt {
      color: #00ffff;
      font-weight: bold;
      font-size: 14px;
    }
    
    .terminal-input {
      flex: 1;
      background: transparent;
      border: none;
      color: #00ff00;
      font-family: inherit;
      font-size: 14px;
      outline: none;
    }
    
    /* Control bar for year */
    .terminal-year-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #1a1a1a;
      border: 1px solid #333;
      padding: 6px 15px;
      border-radius: 6px;
      margin-bottom: 12px;
      direction: ltr;
    }
    .terminal-year-btn {
      padding: 3px 8px;
      border: 1px solid #444;
      border-radius: 4px;
      background: #222;
      color: #00ff00;
      cursor: pointer;
      font-weight: bold;
      font-family: inherit;
      font-size: 11px;
    }
    .terminal-year-btn:hover {
      background: #333;
      color: #fff;
    }
    .terminal-year-title {
      font-weight: bold;
      font-size: 12px;
      color: #888;
    }
    
    /* RTL helper inside terminal */
    .terminal-rtl {
      direction: rtl;
      text-align: right;
      display: inline-block;
      width: 100%;
    }
  `,document.head.appendChild(e);const a=document.createElement("div");a.className="parsha-picker",a.style.display="flex",a.style.flexDirection="column";let n=new u().getFullYear(),o=[],r=-1;const i=()=>{a.innerHTML="";const l=document.createElement("div");l.className="terminal-year-bar";const c=document.createElement("button");c.className="terminal-year-btn",c.textContent=`PREV_YEAR (${n-1})`,c.addEventListener("click",()=>{n--,m(`[SYS] Calibrating terminal to year ${n}...`,"success"),i()});const d=document.createElement("span");d.className="terminal-year-title",d.textContent=`SYS_STATUS: ACTIVE | YEAR: ${n}`;const g=document.createElement("button");g.className="terminal-year-btn",g.textContent=`NEXT_YEAR (${n+1})`,g.addEventListener("click",()=>{n++,m(`[SYS] Calibrating terminal to year ${n}...`,"success"),i()}),l.appendChild(c),l.appendChild(d),l.appendChild(g),a.appendChild(l);const _=document.createElement("div");_.className="terminal-container";const f=document.createElement("div");f.className="terminal-screen";const E=document.createElement("div");E.className="terminal-input-line",E.innerHTML=`
      <span class="terminal-prompt">guest@tikkun:~$</span>
      <input type="text" class="terminal-input" autofocus autocomplete="off" spellcheck="false">
    `,_.appendChild(f),_.appendChild(E),a.appendChild(_);const C=E.querySelector(".terminal-input"),m=(y,S="normal",h=!1)=>{const x=document.createElement("div");x.className=`terminal-line mod-${S}`,h?x.innerHTML=`<span class="terminal-rtl">${y}</span>`:x.innerHTML=y,f.appendChild(x),f.scrollTop=f.scrollHeight};m("================================================================","header"),m(" TIKKUN.IO PORTION SELECTOR TERMINAL v9.0","header"),m(` CURRENT YEAR SATELLITE: HEBREW_CALENDAR_${n}`,"header"),m(' TYPE "help" OR CLICK GREEN LINKS TO BROWSE COMMANDS.',"header"),m("================================================================","header");const I=()=>t.forHebrewYear(n),w=["בראשית","שמות","ויקרא","במדבר","דברים"],A=["ימים נוראים","סוכות ושמיני עצרת","חנוכה ופורים","פסח","שבועות","תעניות","ראש חודש"],b=y=>{var v;const S=y.trim();if(!S)return;m(`guest@tikkun:~$ ${S}`,"input"),o.push(S),r=o.length;const h=S.split(" "),x=h[0].toLowerCase();if(x==="help")m("AVAILABLE COMMANDS:"),m('  <span class="terminal-link" data-cmd="help">help</span>                      - Show this screen'),m('  <span class="terminal-link" data-cmd="ls">ls</span>                        - List main root catalogs'),m('  <span class="terminal-link" data-cmd="ls torah">ls torah</span>                  - List the Five Books of Moses'),m('  <span class="terminal-link" data-cmd="ls book 1">ls book &lt;1-5/name&gt;</span>       - List portions inside a specific book'),m('  <span class="terminal-link" data-cmd="ls holidays">ls holidays</span>               - List holiday seasons'),m('  <span class="terminal-link" data-cmd="ls season פסח">ls season &lt;name&gt;</span>          - List readings in a holiday season'),m('  <span class="terminal-link" data-cmd="ls megillot">ls megillot</span>               - List Megillot scroll readings'),m('  <span class="terminal-link" data-cmd="search בראשית">search &lt;query&gt;</span>            - Find parshiot or holidays matching query'),m('  <span class="terminal-link" data-cmd="show בראשית">show &lt;name&gt;</span>               - Print metadata details of a portion'),m('  <span class="terminal-link" data-cmd="clear">clear</span>                     - Clear the screen terminal console');else if(x==="clear"||x==="cls")f.innerHTML="";else if(x==="ls"||x==="list"){const k=(v=h[1])==null?void 0:v.toLowerCase();if(!k)m("ROOT CATALOGS:"),m('  [1] <span class="terminal-link" data-cmd="ls torah">Torah (חומשי תורה)</span>'),m('  [2] <span class="terminal-link" data-cmd="ls holidays">Holidays & Seasons (מועדים וחגים)</span>'),m('  [3] <span class="terminal-link" data-cmd="ls megillot">Megillot Scrolls (מגילות המועדים)</span>');else if(k==="torah")m("THE FIVE BOOKS OF MOSES:"),w.forEach((p,M)=>{m(`  [${M+1}] <span class="terminal-link" data-cmd="ls book ${M+1}">${p}</span>`)});else if(k==="book"){const p=h.slice(2).join(" ");if(!p){m('[ERR] Specify book number (1-5) or name (e.g., "ls book 1" or "ls book בראשית")',"error");return}let M=parseInt(p);if(isNaN(M)&&(M=w.indexOf(p)+1),M<1||M>5){m(`[ERR] Book "${p}" not found. Choose 1-5 or names: ${w.join(", ")}`,"error");return}m(`PORTIONS INSIDE ${w[M-1]}:`);const T=I(),L=[];T.forEach(O=>{O.leinings.forEach(R=>{if(R.isParsha&&R.runs[0].aliyot[0].start.b===M){const Y=W(R);L.includes(Y)||(L.push(Y),m(`  - <span class="terminal-link" data-cmd="show ${Y}">${Y}</span> (${re(O.date)})`))}})})}else if(k==="holidays")m("HOLIDAY SEASONS:"),A.forEach(p=>{m(`  - <span class="terminal-link" data-cmd="ls season ${p}">${p}</span>`)});else if(k==="season"){const p=h.slice(2).join(" ");if(!p||!A.includes(p)){m(`[ERR] Specify valid season: ${A.join(", ")}`,"error");return}m(`READINGS IN "${p}":`);const M=I(),T=[];M.forEach(L=>{L.leinings.forEach(O=>{if(!O.isParsha&&O.id!==q.Megillah){const R=O.date.title.he;let $=!1;if((p==="ימים נוראים"&&(R.includes("ראש השנה")||R.includes("כיפור")||R.includes("כפור"))||p==="סוכות ושמיני עצרת"&&(R.includes("סוכות")||R.includes("שמיני עצרת")||R.includes("שמחת תורה")||R.includes("הושענא רבא"))||p==="חנוכה ופורים"&&(R.includes("חנוכה")||R.includes("פורים")||R.includes("שבת שקלים")||R.includes("שבת זכור"))||p==="פסח"&&(R.includes("פסח")||R.includes("שבת הגדול")||R.includes("שבת פרה")||R.includes("שבת החודש"))||p==="שבועות"&&R.includes("שבועות")||p==="תעניות"&&(R.includes("תענית")||R.includes("עשרה בטבת")||R.includes("שבעה עשר")||R.includes("איכה")||R.includes("צום")||R.includes("תשעה באב"))||p==="ראש חודש"&&R.includes("ראש חודש"))&&($=!0),$){const Y=W(O),K=`${Y}:${L.id}`;T.includes(K)||(T.push(K),m(`  - <span class="terminal-link" data-cmd="show ${Y}">${Y}</span> (${re(L.date)})`))}}})})}else if(k==="megillot"){m("MEGILLOT SCROLL READINGS:");const p=I(),M=[];p.forEach(T=>{T.leinings.forEach(L=>{if(L.id===q.Megillah){const O=W(L);M.push(O),m(`  - <span class="terminal-link" data-cmd="show ${O}">${O}</span> (${re(T.date)})`)}})}),M.length===0&&m("  No Megillah readings found for this year.")}else m(`[ERR] Unknown catalog: "${k}". Use "ls" to see catalogs.`,"error")}else if(x==="search"||x==="find"){const k=h.slice(1).join(" ");if(!k){m('[ERR] Specify search query (e.g., "search בראשית" or "find Pesach")',"error");return}m(`SEARCH RESULTS FOR "${k}":`);const p=I();let M=0;p.forEach(T=>{T.leinings.forEach(L=>{const O=W(L),R=T.title.en,$=re(T.date),Y=ge(T.date);(O.includes(k)||R.toLowerCase().includes(k.toLowerCase())||$.includes(k)||Y.toLowerCase().includes(k.toLowerCase()))&&(M++,m(`  [${M}] <span class="terminal-link" data-cmd="show ${O}">${O}</span>`),m(`      Type: ${L.isParsha?"Torah Portion":"Holiday"} | Date: ${$} (${Y})`))})}),M===0&&m("  No matches found. Try another term.")}else if(x==="show"){const k=h.slice(1).join(" ");if(!k){m('[ERR] Specify portion or holiday name (e.g., "show בראשית")',"error");return}const p=I();let M=null;for(const R of p){for(const $ of R.leinings)if(W($).toLowerCase()===k.toLowerCase()){M={date:R,inst:$};break}if(M)break}if(!M){m(`[ERR] Portion or reading "${k}" not found in year ${n}.`,"error");return}const{date:T,inst:L}=M;m(`PORTION DETAILS: ${W(L)}`,"header"),m(`  Hebrew Date:   ${re(T.date)} ${n}`),m(`  Gregorian:     ${ge(T.date)}`),m(`  Category:      ${L.isParsha?"Torah Book Section":"Holiday Leining"}`),m(`  Leining Title: ${T.title.he}`),m("----------------------------------------------------------------"),m("SELECT SHORTCUT JUMPS:"),Se(L).forEach(R=>{m(`  - <a href="${R.url}" style="color:#ffff00; text-decoration:underline;">[JUMP TO ${R.label.toUpperCase()}]</a>`)})}else m(`[ERR] Command not recognized: "${x}". Type "help" for options.`,"error")};C.addEventListener("keydown",y=>{if(y.key==="Enter"){const S=C.value;C.value="",b(S)}else y.key==="ArrowUp"?(y.preventDefault(),o.length>0&&r>0&&(r--,C.value=o[r])):y.key==="ArrowDown"&&(y.preventDefault(),o.length>0&&r<o.length-1?(r++,C.value=o[r]):(r=o.length,C.value=""))}),f.addEventListener("click",y=>{const S=y.target;if(S.classList.contains("terminal-link")){const h=S.getAttribute("data-cmd");h&&b(h)}}),_.addEventListener("click",()=>{C.focus()})};return i(),{node:a,onMount:()=>{console.log("Terminal HUD Mounted")},onDestroy:()=>{e.remove()}}},xt=[{id:"original",name:"Original",factory:_r},{id:"collapsible",name:"V1: Collapsible List",factory:Dc},{id:"timeline",name:"V2: Timeline Flow",factory:Hc},{id:"hud",name:"V3: Command Palette",factory:Pc},{id:"chumash-map",name:"V4: Chumash Map",factory:Oc},{id:"calendar",name:"V5: Calendar Grid",factory:jc},{id:"columns",name:"V6: Columns Cascade",factory:$c},{id:"radial",name:"V7: Radial Cycle",factory:zc},{id:"kanban",name:"V8: Kanban Board",factory:Bc},{id:"terminal",name:"V9: Terminal HUD",factory:Yc}];class Kc{constructor(){this.activeVersion="original",this.onSwitchCallback=null;const e=localStorage.getItem("selected-picker-version");e&&xt.some(a=>a.id===e)&&(this.activeVersion=e)}getActiveVersion(){return this.activeVersion}getActiveFactory(){const e=xt.find(a=>a.id===this.activeVersion);return e?e.factory:_r}onSwitch(e){this.onSwitchCallback=e}renderBar(){const e=document.createElement("div");e.className="picker-switcher-bar",e.style.cssText=`
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 8px;
      padding: 10px 15px;
      background: var(--paper-color, #fff);
      border-bottom: 1px solid var(--medium-accent-color, #ccc);
      position: sticky;
      top: 0;
      z-index: 10000;
      direction: ltr;
      font-family: sans-serif;
    `;const a=document.createElement("span");return a.textContent="Picker Design:",a.style.cssText=`
      font-weight: bold;
      font-size: 13px;
      margin-right: 5px;
      color: var(--text-color, #333);
    `,e.appendChild(a),xt.forEach(n=>{const o=document.createElement("button");o.textContent=n.name,o.style.cssText=`
        padding: 5px 10px;
        border: 1px solid var(--heavy-accent-color, #999);
        background: ${this.activeVersion===n.id?"#0b57d0":"transparent"};
        color: ${this.activeVersion===n.id?"#fff":"var(--text-color, #333)"};
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        font-weight: ${this.activeVersion===n.id?"bold":"normal"};
        transition: all 0.2s;
      `,o.addEventListener("click",()=>{this.activeVersion!==n.id&&(this.activeVersion=n.id,localStorage.setItem("selected-picker-version",n.id),e.querySelectorAll("button").forEach((r,i)=>{const l=xt[i].id===n.id;r.style.background=l?"#0b57d0":"transparent",r.style.color=l?"#fff":"var(--text-color, #333)",r.style.fontWeight=l?"bold":"normal"}),this.onSwitchCallback&&this.onSwitchCallback())}),e.appendChild(o)}),e}}const{whenKey:At}=Xe,ln=new $l({ashkenazi:!0,includeModernHolidays:!1,israel:!1});let Me;const Ga=new Kc;Ga.onSwitch(()=>{cn()&&(Gt(),Er())});const qn={jumpTo:t=>{Me=new Ql(t,document.querySelector('[data-target-id="tikkun-book"]')),Me.rendered.then(()=>{Gt()})}},yr=({selector:t,visible:e})=>{const a=document.querySelector(t).classList;a.toggle("u-hidden",!e),a.toggle("mod-animated",!e)},Er=()=>{[{selector:'[data-test-id="annotations-toggle"]',visible:!1},{selector:'[data-target-id="repo-link"]',visible:!1},{selector:'[data-target-id="tikkun-book"]',visible:!1}].forEach(({selector:o,visible:r})=>yr({selector:o,visible:r}));const e=Ga.getActiveFactory()(ln),a=document.querySelector("#js-app"),n=Ga.renderBar();a.appendChild(n),a.appendChild(e.node),requestAnimationFrame(()=>{const o=n.offsetHeight||42,r=e.node;r.style.top=`${o}px`,r.style.height=`calc(100% - ${o}px)`}),gtag("event","view",{event_category:"navigation"}),e.onMount()},Gt=()=>{[{selector:'[data-test-id="annotations-toggle"]',visible:!0},{selector:'[data-target-id="repo-link"]',visible:!0},{selector:'[data-target-id="tikkun-book"]',visible:!0}].forEach(({selector:t,visible:e})=>yr({selector:t,visible:e})),document.querySelector(".picker-switcher-bar")&&document.querySelector("#js-app").removeChild(document.querySelector(".picker-switcher-bar")),document.querySelector(".parsha-picker")&&document.querySelector("#js-app").removeChild(document.querySelector(".parsha-picker"))},cn=()=>!!document.querySelector(".parsha-picker"),Jn=()=>{cn()?Gt():Er()},Ea=t=>{const e=document.querySelector('[data-target-id="annotations-toggle"]');e.checked=!t();const a=document.querySelector("[data-target-id=tikkun-book]");a.classList.toggle("mod-annotations-on",e.checked),a.classList.toggle("mod-annotations-off",!e.checked)},qe={lastScrolledPosition:0,pageAtTop:null},Fc=()=>{if(!qe.pageAtTop)return;const t=document.querySelector(".tikkun-book"),e=qe.pageAtTop.getBoundingClientRect();t.scrollTop=qe.pageAtTop.offsetTop+qe.lastScrolledPosition*e.height},Uc=()=>{const t=document.querySelector(".tikkun-book"),e=t.getBoundingClientRect(),a={x:e.left+e.width/2,y:e.top},n=[...document.elementsFromPoint(a.x,a.y)].find(o=>o.className.includes("tikkun-page"));n&&(qe.pageAtTop=n,qe.lastScrolledPosition=(t.scrollTop-n.offsetTop)/n.clientHeight)},qc=(t,e)=>{let a;return()=>{clearTimeout(a),a=setTimeout(()=>{t()},e)}},Jc=t=>{const n=()=>{t.classList.add("mod-pull-releasing"),t.style.setProperty("--pull-translation","0")};let o=0;t.addEventListener("touchstart",r=>{t.classList.remove("mod-pull-releasing"),o=r.changedTouches[0].screenX}),t.addEventListener("touchmove",r=>{const i=r.changedTouches[0].screenX,l=-Math.max(i-o,-100);l<30||t.style.setProperty("--pull-translation",`${30-l}px`)}),t.addEventListener("touchend",n),t.addEventListener("touchcancel",n)},vr=()=>{document.documentElement.style.setProperty("--app-height",`${window.innerHeight}px`)};document.addEventListener("resize",vr);document.addEventListener("DOMContentLoaded",async()=>{const t=document.querySelector('[data-target-id="tikkun-book"]'),e=document.querySelector('[data-target-id="annotations-toggle"]'),a=new ac(t),n=new rc,o=document.querySelector('[data-target-id="parsha-title"]');a.on("viewport-updated",r=>{if(!Me.viewModel)return;n.setLine(Me.viewModel,r);const i=n.info.currentRun;o.textContent=`${i==null?void 0:i.leining.date.title.he} ${i==null?void 0:i.leining.id}: ${n.info.aliyahRange.join(" – ")}`}),t.addEventListener("mouseover",r=>{const i=document.elementsFromPoint(r.x,r.y).find(l=>l.className.includes("line"));console.log(i)}),Ar.new({container:t,fetchPreviousContent:{fetch:()=>Me.viewModel.fetchPreviousPage(),render:r=>Me.renderPrevious(r)},fetchNextContent:{fetch:()=>Me.viewModel.fetchNextPage(),render:r=>Me.renderNext(r)}}).attach(),t.addEventListener("scroll",qc(()=>{Uc()},1e3)),Jc(t),window.addEventListener("resize",()=>{Fc()}),e.addEventListener("change",()=>Ea(()=>!e.checked)),document.addEventListener("keydown",At("Shift",()=>Ea(()=>e.checked))),document.addEventListener("keyup",At("Shift",()=>Ea(()=>e.checked))),document.querySelector('[data-target-id="parsha-title"]').addEventListener("click",Jn),document.addEventListener("keydown",At("/",Jn)),document.addEventListener("keydown",At("Escape",r=>{cn()&&(r.preventDefault(),Gt())})),vr(),window.addEventListener("hashchange",()=>{const r=Gn();r&&qn.jumpTo(r)}),qn.jumpTo(Gn()??we.forDate(ln,new Date))});function Gn(){return sc(ln,location.hash.replace(/^#/,""))}
