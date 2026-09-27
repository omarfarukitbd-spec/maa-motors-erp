(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(r){if(r.ep)return;r.ep=!0;const i=t(r);fetch(r.href,i)}})();class Jh{constructor(){this.skills=new Map,this.listeners=[]}register(e){if(!e||!e.id){console.error("Invalid skill registration:",e);return}this.skills.set(e.id,e),console.log(`[SkillRegistry] Registered skill: "${e.name}" (${e.id})`),this.notifyListeners()}get(e){return this.skills.get(e)}getAll(){return Array.from(this.skills.values())}getAllTools(){const e=[];for(const t of this.skills.values()){const n=t.getTools();Array.isArray(n)&&e.push(...n)}return e}findMatchingSkill(e){for(const t of this.skills.values())if(t.matches(e))return t;return null}async executeAction(e,t={},n={}){for(const r of this.skills.values())if(r.getTools().some(c=>c.name===e))return await r.execute(e,t,n);throw new Error(`কোনো স্কিলে "${e}" টুলটি খুঁজে পাওয়া যায়নি।`)}onChange(e){this.listeners.push(e)}notifyListeners(){const e=this.getAll();this.listeners.forEach(t=>{try{t(e)}catch(n){console.warn("[SkillRegistry] Listener error:",n)}})}}const qe=new Jh;var Ec={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zl=function(s){const e=[];let t=0;for(let n=0;n<s.length;n++){let r=s.charCodeAt(n);r<128?e[t++]=r:r<2048?(e[t++]=r>>6|192,e[t++]=r&63|128):(r&64512)===55296&&n+1<s.length&&(s.charCodeAt(n+1)&64512)===56320?(r=65536+((r&1023)<<10)+(s.charCodeAt(++n)&1023),e[t++]=r>>18|240,e[t++]=r>>12&63|128,e[t++]=r>>6&63|128,e[t++]=r&63|128):(e[t++]=r>>12|224,e[t++]=r>>6&63|128,e[t++]=r&63|128)}return e},Xh=function(s){const e=[];let t=0,n=0;for(;t<s.length;){const r=s[t++];if(r<128)e[n++]=String.fromCharCode(r);else if(r>191&&r<224){const i=s[t++];e[n++]=String.fromCharCode((r&31)<<6|i&63)}else if(r>239&&r<365){const i=s[t++],a=s[t++],c=s[t++],l=((r&7)<<18|(i&63)<<12|(a&63)<<6|c&63)-65536;e[n++]=String.fromCharCode(55296+(l>>10)),e[n++]=String.fromCharCode(56320+(l&1023))}else{const i=s[t++],a=s[t++];e[n++]=String.fromCharCode((r&15)<<12|(i&63)<<6|a&63)}}return e.join("")},eu={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(s,e){if(!Array.isArray(s))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,n=[];for(let r=0;r<s.length;r+=3){const i=s[r],a=r+1<s.length,c=a?s[r+1]:0,l=r+2<s.length,d=l?s[r+2]:0,f=i>>2,m=(i&3)<<4|c>>4;let _=(c&15)<<2|d>>6,T=d&63;l||(T=64,a||(_=64)),n.push(t[f],t[m],t[_],t[T])}return n.join("")},encodeString(s,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(s):this.encodeByteArray(Zl(s),e)},decodeString(s,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(s):Xh(this.decodeStringToByteArray(s,e))},decodeStringToByteArray(s,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,n=[];for(let r=0;r<s.length;){const i=t[s.charAt(r++)],c=r<s.length?t[s.charAt(r)]:0;++r;const d=r<s.length?t[s.charAt(r)]:64;++r;const m=r<s.length?t[s.charAt(r)]:64;if(++r,i==null||c==null||d==null||m==null)throw new Zh;const _=i<<2|c>>4;if(n.push(_),d!==64){const T=c<<4&240|d>>2;if(n.push(T),m!==64){const R=d<<6&192|m;n.push(R)}}}return n},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let s=0;s<this.ENCODED_VALS.length;s++)this.byteToCharMap_[s]=this.ENCODED_VALS.charAt(s),this.charToByteMap_[this.byteToCharMap_[s]]=s,this.byteToCharMapWebSafe_[s]=this.ENCODED_VALS_WEBSAFE.charAt(s),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[s]]=s,s>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(s)]=s,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(s)]=s)}}};class Zh extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const ef=function(s){const e=Zl(s);return eu.encodeByteArray(e,!0)},Cr=function(s){return ef(s).replace(/\./g,"")},tu=function(s){try{return eu.decodeString(s,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tf(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nf=()=>tf().__FIREBASE_DEFAULTS__,sf=()=>{if(typeof process>"u"||typeof Ec>"u")return;const s=Ec.__FIREBASE_DEFAULTS__;if(s)return JSON.parse(s)},rf=()=>{if(typeof document>"u")return;let s;try{s=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=s&&tu(s[1]);return e&&JSON.parse(e)},Gr=()=>{try{return nf()||sf()||rf()}catch(s){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${s}`);return}},nu=s=>{var e,t;return(t=(e=Gr())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[s]},of=s=>{const e=nu(s);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const n=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),n]:[e.substring(0,t),n]},su=()=>{var s;return(s=Gr())===null||s===void 0?void 0:s.config},ru=s=>{var e;return(e=Gr())===null||e===void 0?void 0:e[`_${s}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class af{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,n)=>{t?this.reject(t):this.resolve(n),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,n))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cf(s,e){if(s.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},n=e||"demo-project",r=s.iat||0,i=s.sub||s.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a=Object.assign({iss:`https://securetoken.google.com/${n}`,aud:n,iat:r,exp:r+3600,auth_time:r,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}}},s);return[Cr(JSON.stringify(t)),Cr(JSON.stringify(a)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Me(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function lf(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Me())}function uf(){var s;const e=(s=Gr())===null||s===void 0?void 0:s.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function df(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function hf(){const s=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof s=="object"&&s.id!==void 0}function ff(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function pf(){const s=Me();return s.indexOf("MSIE ")>=0||s.indexOf("Trident/")>=0}function mf(){return!uf()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function gf(){try{return typeof indexedDB=="object"}catch{return!1}}function yf(){return new Promise((s,e)=>{try{let t=!0;const n="validate-browser-context-for-indexeddb-analytics-module",r=self.indexedDB.open(n);r.onsuccess=()=>{r.result.close(),t||self.indexedDB.deleteDatabase(n),s(!0)},r.onupgradeneeded=()=>{t=!1},r.onerror=()=>{var i;e(((i=r.error)===null||i===void 0?void 0:i.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _f="FirebaseError";class wt extends Error{constructor(e,t,n){super(t),this.code=e,this.customData=n,this.name=_f,Object.setPrototypeOf(this,wt.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Ps.prototype.create)}}class Ps{constructor(e,t,n){this.service=e,this.serviceName=t,this.errors=n}create(e,...t){const n=t[0]||{},r=`${this.service}/${e}`,i=this.errors[e],a=i?vf(i,n):"Error",c=`${this.serviceName}: ${a} (${r}).`;return new wt(r,c,n)}}function vf(s,e){return s.replace(bf,(t,n)=>{const r=e[n];return r!=null?String(r):`<${n}?>`})}const bf=/\{\$([^}]+)}/g;function wf(s){for(const e in s)if(Object.prototype.hasOwnProperty.call(s,e))return!1;return!0}function Dr(s,e){if(s===e)return!0;const t=Object.keys(s),n=Object.keys(e);for(const r of t){if(!n.includes(r))return!1;const i=s[r],a=e[r];if(Tc(i)&&Tc(a)){if(!Dr(i,a))return!1}else if(i!==a)return!1}for(const r of n)if(!t.includes(r))return!1;return!0}function Tc(s){return s!==null&&typeof s=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ns(s){const e=[];for(const[t,n]of Object.entries(s))Array.isArray(n)?n.forEach(r=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(r))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(n));return e.length?"&"+e.join("&"):""}function os(s){const e={};return s.replace(/^\?/,"").split("&").forEach(n=>{if(n){const[r,i]=n.split("=");e[decodeURIComponent(r)]=decodeURIComponent(i)}}),e}function as(s){const e=s.indexOf("?");if(!e)return"";const t=s.indexOf("#",e);return s.substring(e,t>0?t:void 0)}function Ef(s,e){const t=new Tf(s,e);return t.subscribe.bind(t)}class Tf{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(n=>{this.error(n)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,n){let r;if(e===void 0&&t===void 0&&n===void 0)throw new Error("Missing Observer.");If(e,["next","error","complete"])?r=e:r={next:e,error:t,complete:n},r.next===void 0&&(r.next=Oi),r.error===void 0&&(r.error=Oi),r.complete===void 0&&(r.complete=Oi);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?r.error(this.finalError):r.complete()}catch{}}),this.observers.push(r),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(n){typeof console<"u"&&console.error&&console.error(n)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function If(s,e){if(typeof s!="object"||s===null)return!1;for(const t of e)if(t in s&&typeof s[t]=="function")return!0;return!1}function Oi(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function je(s){return s&&s._delegate?s._delegate:s}class tn{constructor(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gt="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sf{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const n=new af;if(this.instancesDeferred.set(t,n),this.isInitialized(t)||this.shouldAutoInitialize())try{const r=this.getOrInitializeService({instanceIdentifier:t});r&&n.resolve(r)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const n=this.normalizeInstanceIdentifier(e?.identifier),r=(t=e?.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Af(e))try{this.getOrInitializeService({instanceIdentifier:Gt})}catch{}for(const[t,n]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(t);try{const i=this.getOrInitializeService({instanceIdentifier:r});n.resolve(i)}catch{}}}}clearInstance(e=Gt){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Gt){return this.instances.has(e)}getOptions(e=Gt){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:n,options:t});for(const[i,a]of this.instancesDeferred.entries()){const c=this.normalizeInstanceIdentifier(i);n===c&&a.resolve(r)}return r}onInit(e,t){var n;const r=this.normalizeInstanceIdentifier(t),i=(n=this.onInitCallbacks.get(r))!==null&&n!==void 0?n:new Set;i.add(e),this.onInitCallbacks.set(r,i);const a=this.instances.get(r);return a&&e(a,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,t){const n=this.onInitCallbacks.get(t);if(n)for(const r of n)try{r(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:kf(e),options:t}),this.instances.set(e,n),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch{}return n||null}normalizeInstanceIdentifier(e=Gt){return this.component?this.component.multipleInstances?e:Gt:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function kf(s){return s===Gt?void 0:s}function Af(s){return s.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rf{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new Sf(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var se;(function(s){s[s.DEBUG=0]="DEBUG",s[s.VERBOSE=1]="VERBOSE",s[s.INFO=2]="INFO",s[s.WARN=3]="WARN",s[s.ERROR=4]="ERROR",s[s.SILENT=5]="SILENT"})(se||(se={}));const Cf={debug:se.DEBUG,verbose:se.VERBOSE,info:se.INFO,warn:se.WARN,error:se.ERROR,silent:se.SILENT},Df=se.INFO,Pf={[se.DEBUG]:"log",[se.VERBOSE]:"log",[se.INFO]:"info",[se.WARN]:"warn",[se.ERROR]:"error"},Nf=(s,e,...t)=>{if(e<s.logLevel)return;const n=new Date().toISOString(),r=Pf[e];if(r)console[r](`[${n}]  ${s.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Ao{constructor(e){this.name=e,this._logLevel=Df,this._logHandler=Nf,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in se))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Cf[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,se.DEBUG,...e),this._logHandler(this,se.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,se.VERBOSE,...e),this._logHandler(this,se.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,se.INFO,...e),this._logHandler(this,se.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,se.WARN,...e),this._logHandler(this,se.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,se.ERROR,...e),this._logHandler(this,se.ERROR,...e)}}const Lf=(s,e)=>e.some(t=>s instanceof t);let Ic,Sc;function xf(){return Ic||(Ic=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Vf(){return Sc||(Sc=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const iu=new WeakMap,eo=new WeakMap,ou=new WeakMap,$i=new WeakMap,Ro=new WeakMap;function Bf(s){const e=new Promise((t,n)=>{const r=()=>{s.removeEventListener("success",i),s.removeEventListener("error",a)},i=()=>{t(Lt(s.result)),r()},a=()=>{n(s.error),r()};s.addEventListener("success",i),s.addEventListener("error",a)});return e.then(t=>{t instanceof IDBCursor&&iu.set(t,s)}).catch(()=>{}),Ro.set(e,s),e}function Mf(s){if(eo.has(s))return;const e=new Promise((t,n)=>{const r=()=>{s.removeEventListener("complete",i),s.removeEventListener("error",a),s.removeEventListener("abort",a)},i=()=>{t(),r()},a=()=>{n(s.error||new DOMException("AbortError","AbortError")),r()};s.addEventListener("complete",i),s.addEventListener("error",a),s.addEventListener("abort",a)});eo.set(s,e)}let to={get(s,e,t){if(s instanceof IDBTransaction){if(e==="done")return eo.get(s);if(e==="objectStoreNames")return s.objectStoreNames||ou.get(s);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return Lt(s[e])},set(s,e,t){return s[e]=t,!0},has(s,e){return s instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in s}};function Of(s){to=s(to)}function $f(s){return s===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const n=s.call(Fi(this),e,...t);return ou.set(n,e.sort?e.sort():[e]),Lt(n)}:Vf().includes(s)?function(...e){return s.apply(Fi(this),e),Lt(iu.get(this))}:function(...e){return Lt(s.apply(Fi(this),e))}}function Ff(s){return typeof s=="function"?$f(s):(s instanceof IDBTransaction&&Mf(s),Lf(s,xf())?new Proxy(s,to):s)}function Lt(s){if(s instanceof IDBRequest)return Bf(s);if($i.has(s))return $i.get(s);const e=Ff(s);return e!==s&&($i.set(s,e),Ro.set(e,s)),e}const Fi=s=>Ro.get(s);function Uf(s,e,{blocked:t,upgrade:n,blocking:r,terminated:i}={}){const a=indexedDB.open(s,e),c=Lt(a);return n&&a.addEventListener("upgradeneeded",l=>{n(Lt(a.result),l.oldVersion,l.newVersion,Lt(a.transaction),l)}),t&&a.addEventListener("blocked",l=>t(l.oldVersion,l.newVersion,l)),c.then(l=>{i&&l.addEventListener("close",()=>i()),r&&l.addEventListener("versionchange",d=>r(d.oldVersion,d.newVersion,d))}).catch(()=>{}),c}const jf=["get","getKey","getAll","getAllKeys","count"],qf=["put","add","delete","clear"],Ui=new Map;function kc(s,e){if(!(s instanceof IDBDatabase&&!(e in s)&&typeof e=="string"))return;if(Ui.get(e))return Ui.get(e);const t=e.replace(/FromIndex$/,""),n=e!==t,r=qf.includes(t);if(!(t in(n?IDBIndex:IDBObjectStore).prototype)||!(r||jf.includes(t)))return;const i=async function(a,...c){const l=this.transaction(a,r?"readwrite":"readonly");let d=l.store;return n&&(d=d.index(c.shift())),(await Promise.all([d[t](...c),r&&l.done]))[0]};return Ui.set(e,i),i}Of(s=>({...s,get:(e,t,n)=>kc(e,t)||s.get(e,t,n),has:(e,t)=>!!kc(e,t)||s.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zf{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(Wf(t)){const n=t.getImmediate();return`${n.library}/${n.version}`}else return null}).filter(t=>t).join(" ")}}function Wf(s){const e=s.getComponent();return e?.type==="VERSION"}const no="@firebase/app",Ac="0.10.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yt=new Ao("@firebase/app"),Hf="@firebase/app-compat",Kf="@firebase/analytics-compat",Gf="@firebase/analytics",Qf="@firebase/app-check-compat",Yf="@firebase/app-check",Jf="@firebase/auth",Xf="@firebase/auth-compat",Zf="@firebase/database",ep="@firebase/data-connect",tp="@firebase/database-compat",np="@firebase/functions",sp="@firebase/functions-compat",rp="@firebase/installations",ip="@firebase/installations-compat",op="@firebase/messaging",ap="@firebase/messaging-compat",cp="@firebase/performance",lp="@firebase/performance-compat",up="@firebase/remote-config",dp="@firebase/remote-config-compat",hp="@firebase/storage",fp="@firebase/storage-compat",pp="@firebase/firestore",mp="@firebase/vertexai-preview",gp="@firebase/firestore-compat",yp="firebase",_p="10.14.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const so="[DEFAULT]",vp={[no]:"fire-core",[Hf]:"fire-core-compat",[Gf]:"fire-analytics",[Kf]:"fire-analytics-compat",[Yf]:"fire-app-check",[Qf]:"fire-app-check-compat",[Jf]:"fire-auth",[Xf]:"fire-auth-compat",[Zf]:"fire-rtdb",[ep]:"fire-data-connect",[tp]:"fire-rtdb-compat",[np]:"fire-fn",[sp]:"fire-fn-compat",[rp]:"fire-iid",[ip]:"fire-iid-compat",[op]:"fire-fcm",[ap]:"fire-fcm-compat",[cp]:"fire-perf",[lp]:"fire-perf-compat",[up]:"fire-rc",[dp]:"fire-rc-compat",[hp]:"fire-gcs",[fp]:"fire-gcs-compat",[pp]:"fire-fst",[gp]:"fire-fst-compat",[mp]:"fire-vertex","fire-js":"fire-js",[yp]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ys=new Map,bp=new Map,ro=new Map;function Rc(s,e){try{s.container.addComponent(e)}catch(t){yt.debug(`Component ${e.name} failed to register with FirebaseApp ${s.name}`,t)}}function Sn(s){const e=s.name;if(ro.has(e))return yt.debug(`There were multiple attempts to register component ${e}.`),!1;ro.set(e,s);for(const t of ys.values())Rc(t,s);for(const t of bp.values())Rc(t,s);return!0}function Co(s,e){const t=s.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),s.container.getProvider(e)}function et(s){return s.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wp={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},xt=new Ps("app","Firebase",wp);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ep{constructor(e,t,n){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new tn("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw xt.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vn=_p;function au(s,e={}){let t=s;typeof e!="object"&&(e={name:e});const n=Object.assign({name:so,automaticDataCollectionEnabled:!1},e),r=n.name;if(typeof r!="string"||!r)throw xt.create("bad-app-name",{appName:String(r)});if(t||(t=su()),!t)throw xt.create("no-options");const i=ys.get(r);if(i){if(Dr(t,i.options)&&Dr(n,i.config))return i;throw xt.create("duplicate-app",{appName:r})}const a=new Rf(r);for(const l of ro.values())a.addComponent(l);const c=new Ep(t,n,a);return ys.set(r,c),c}function cu(s=so){const e=ys.get(s);if(!e&&s===so&&su())return au();if(!e)throw xt.create("no-app",{appName:s});return e}function Cc(){return Array.from(ys.values())}function Vt(s,e,t){var n;let r=(n=vp[s])!==null&&n!==void 0?n:s;t&&(r+=`-${t}`);const i=r.match(/\s|\//),a=e.match(/\s|\//);if(i||a){const c=[`Unable to register library "${r}" with version "${e}":`];i&&c.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&a&&c.push("and"),a&&c.push(`version name "${e}" contains illegal characters (whitespace or "/")`),yt.warn(c.join(" "));return}Sn(new tn(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tp="firebase-heartbeat-database",Ip=1,_s="firebase-heartbeat-store";let ji=null;function lu(){return ji||(ji=Uf(Tp,Ip,{upgrade:(s,e)=>{switch(e){case 0:try{s.createObjectStore(_s)}catch(t){console.warn(t)}}}}).catch(s=>{throw xt.create("idb-open",{originalErrorMessage:s.message})})),ji}async function Sp(s){try{const t=(await lu()).transaction(_s),n=await t.objectStore(_s).get(uu(s));return await t.done,n}catch(e){if(e instanceof wt)yt.warn(e.message);else{const t=xt.create("idb-get",{originalErrorMessage:e?.message});yt.warn(t.message)}}}async function Dc(s,e){try{const n=(await lu()).transaction(_s,"readwrite");await n.objectStore(_s).put(e,uu(s)),await n.done}catch(t){if(t instanceof wt)yt.warn(t.message);else{const n=xt.create("idb-set",{originalErrorMessage:t?.message});yt.warn(n.message)}}}function uu(s){return`${s.name}!${s.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kp=1024,Ap=30*24*60*60*1e3;class Rp{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new Dp(t),this._heartbeatsCachePromise=this._storage.read().then(n=>(this._heartbeatsCache=n,n))}async triggerHeartbeat(){var e,t;try{const r=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=Pc();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(a=>a.date===i)?void 0:(this._heartbeatsCache.heartbeats.push({date:i,agent:r}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(a=>{const c=new Date(a.date).valueOf();return Date.now()-c<=Ap}),this._storage.overwrite(this._heartbeatsCache))}catch(n){yt.warn(n)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=Pc(),{heartbeatsToSend:n,unsentEntries:r}=Cp(this._heartbeatsCache.heartbeats),i=Cr(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=t,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(t){return yt.warn(t),""}}}function Pc(){return new Date().toISOString().substring(0,10)}function Cp(s,e=kp){const t=[];let n=s.slice();for(const r of s){const i=t.find(a=>a.agent===r.agent);if(i){if(i.dates.push(r.date),Nc(t)>e){i.dates.pop();break}}else if(t.push({agent:r.agent,dates:[r.date]}),Nc(t)>e){t.pop();break}n=n.slice(1)}return{heartbeatsToSend:t,unsentEntries:n}}class Dp{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return gf()?yf().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await Sp(this.app);return t?.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const r=await this.read();return Dc(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const r=await this.read();return Dc(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function Nc(s){return Cr(JSON.stringify({version:2,heartbeats:s})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pp(s){Sn(new tn("platform-logger",e=>new zf(e),"PRIVATE")),Sn(new tn("heartbeat",e=>new Rp(e),"PRIVATE")),Vt(no,Ac,s),Vt(no,Ac,"esm2017"),Vt("fire-js","")}Pp("");var Np="firebase",Lp="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Vt(Np,Lp,"app");var Lc=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Jt,du;(function(){var s;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(b,y){function v(){}v.prototype=y.prototype,b.D=y.prototype,b.prototype=new v,b.prototype.constructor=b,b.C=function(w,I,k){for(var E=Array(arguments.length-2),le=2;le<arguments.length;le++)E[le-2]=arguments[le];return y.prototype[I].apply(w,E)}}function t(){this.blockSize=-1}function n(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(n,t),n.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function r(b,y,v){v||(v=0);var w=Array(16);if(typeof y=="string")for(var I=0;16>I;++I)w[I]=y.charCodeAt(v++)|y.charCodeAt(v++)<<8|y.charCodeAt(v++)<<16|y.charCodeAt(v++)<<24;else for(I=0;16>I;++I)w[I]=y[v++]|y[v++]<<8|y[v++]<<16|y[v++]<<24;y=b.g[0],v=b.g[1],I=b.g[2];var k=b.g[3],E=y+(k^v&(I^k))+w[0]+3614090360&4294967295;y=v+(E<<7&4294967295|E>>>25),E=k+(I^y&(v^I))+w[1]+3905402710&4294967295,k=y+(E<<12&4294967295|E>>>20),E=I+(v^k&(y^v))+w[2]+606105819&4294967295,I=k+(E<<17&4294967295|E>>>15),E=v+(y^I&(k^y))+w[3]+3250441966&4294967295,v=I+(E<<22&4294967295|E>>>10),E=y+(k^v&(I^k))+w[4]+4118548399&4294967295,y=v+(E<<7&4294967295|E>>>25),E=k+(I^y&(v^I))+w[5]+1200080426&4294967295,k=y+(E<<12&4294967295|E>>>20),E=I+(v^k&(y^v))+w[6]+2821735955&4294967295,I=k+(E<<17&4294967295|E>>>15),E=v+(y^I&(k^y))+w[7]+4249261313&4294967295,v=I+(E<<22&4294967295|E>>>10),E=y+(k^v&(I^k))+w[8]+1770035416&4294967295,y=v+(E<<7&4294967295|E>>>25),E=k+(I^y&(v^I))+w[9]+2336552879&4294967295,k=y+(E<<12&4294967295|E>>>20),E=I+(v^k&(y^v))+w[10]+4294925233&4294967295,I=k+(E<<17&4294967295|E>>>15),E=v+(y^I&(k^y))+w[11]+2304563134&4294967295,v=I+(E<<22&4294967295|E>>>10),E=y+(k^v&(I^k))+w[12]+1804603682&4294967295,y=v+(E<<7&4294967295|E>>>25),E=k+(I^y&(v^I))+w[13]+4254626195&4294967295,k=y+(E<<12&4294967295|E>>>20),E=I+(v^k&(y^v))+w[14]+2792965006&4294967295,I=k+(E<<17&4294967295|E>>>15),E=v+(y^I&(k^y))+w[15]+1236535329&4294967295,v=I+(E<<22&4294967295|E>>>10),E=y+(I^k&(v^I))+w[1]+4129170786&4294967295,y=v+(E<<5&4294967295|E>>>27),E=k+(v^I&(y^v))+w[6]+3225465664&4294967295,k=y+(E<<9&4294967295|E>>>23),E=I+(y^v&(k^y))+w[11]+643717713&4294967295,I=k+(E<<14&4294967295|E>>>18),E=v+(k^y&(I^k))+w[0]+3921069994&4294967295,v=I+(E<<20&4294967295|E>>>12),E=y+(I^k&(v^I))+w[5]+3593408605&4294967295,y=v+(E<<5&4294967295|E>>>27),E=k+(v^I&(y^v))+w[10]+38016083&4294967295,k=y+(E<<9&4294967295|E>>>23),E=I+(y^v&(k^y))+w[15]+3634488961&4294967295,I=k+(E<<14&4294967295|E>>>18),E=v+(k^y&(I^k))+w[4]+3889429448&4294967295,v=I+(E<<20&4294967295|E>>>12),E=y+(I^k&(v^I))+w[9]+568446438&4294967295,y=v+(E<<5&4294967295|E>>>27),E=k+(v^I&(y^v))+w[14]+3275163606&4294967295,k=y+(E<<9&4294967295|E>>>23),E=I+(y^v&(k^y))+w[3]+4107603335&4294967295,I=k+(E<<14&4294967295|E>>>18),E=v+(k^y&(I^k))+w[8]+1163531501&4294967295,v=I+(E<<20&4294967295|E>>>12),E=y+(I^k&(v^I))+w[13]+2850285829&4294967295,y=v+(E<<5&4294967295|E>>>27),E=k+(v^I&(y^v))+w[2]+4243563512&4294967295,k=y+(E<<9&4294967295|E>>>23),E=I+(y^v&(k^y))+w[7]+1735328473&4294967295,I=k+(E<<14&4294967295|E>>>18),E=v+(k^y&(I^k))+w[12]+2368359562&4294967295,v=I+(E<<20&4294967295|E>>>12),E=y+(v^I^k)+w[5]+4294588738&4294967295,y=v+(E<<4&4294967295|E>>>28),E=k+(y^v^I)+w[8]+2272392833&4294967295,k=y+(E<<11&4294967295|E>>>21),E=I+(k^y^v)+w[11]+1839030562&4294967295,I=k+(E<<16&4294967295|E>>>16),E=v+(I^k^y)+w[14]+4259657740&4294967295,v=I+(E<<23&4294967295|E>>>9),E=y+(v^I^k)+w[1]+2763975236&4294967295,y=v+(E<<4&4294967295|E>>>28),E=k+(y^v^I)+w[4]+1272893353&4294967295,k=y+(E<<11&4294967295|E>>>21),E=I+(k^y^v)+w[7]+4139469664&4294967295,I=k+(E<<16&4294967295|E>>>16),E=v+(I^k^y)+w[10]+3200236656&4294967295,v=I+(E<<23&4294967295|E>>>9),E=y+(v^I^k)+w[13]+681279174&4294967295,y=v+(E<<4&4294967295|E>>>28),E=k+(y^v^I)+w[0]+3936430074&4294967295,k=y+(E<<11&4294967295|E>>>21),E=I+(k^y^v)+w[3]+3572445317&4294967295,I=k+(E<<16&4294967295|E>>>16),E=v+(I^k^y)+w[6]+76029189&4294967295,v=I+(E<<23&4294967295|E>>>9),E=y+(v^I^k)+w[9]+3654602809&4294967295,y=v+(E<<4&4294967295|E>>>28),E=k+(y^v^I)+w[12]+3873151461&4294967295,k=y+(E<<11&4294967295|E>>>21),E=I+(k^y^v)+w[15]+530742520&4294967295,I=k+(E<<16&4294967295|E>>>16),E=v+(I^k^y)+w[2]+3299628645&4294967295,v=I+(E<<23&4294967295|E>>>9),E=y+(I^(v|~k))+w[0]+4096336452&4294967295,y=v+(E<<6&4294967295|E>>>26),E=k+(v^(y|~I))+w[7]+1126891415&4294967295,k=y+(E<<10&4294967295|E>>>22),E=I+(y^(k|~v))+w[14]+2878612391&4294967295,I=k+(E<<15&4294967295|E>>>17),E=v+(k^(I|~y))+w[5]+4237533241&4294967295,v=I+(E<<21&4294967295|E>>>11),E=y+(I^(v|~k))+w[12]+1700485571&4294967295,y=v+(E<<6&4294967295|E>>>26),E=k+(v^(y|~I))+w[3]+2399980690&4294967295,k=y+(E<<10&4294967295|E>>>22),E=I+(y^(k|~v))+w[10]+4293915773&4294967295,I=k+(E<<15&4294967295|E>>>17),E=v+(k^(I|~y))+w[1]+2240044497&4294967295,v=I+(E<<21&4294967295|E>>>11),E=y+(I^(v|~k))+w[8]+1873313359&4294967295,y=v+(E<<6&4294967295|E>>>26),E=k+(v^(y|~I))+w[15]+4264355552&4294967295,k=y+(E<<10&4294967295|E>>>22),E=I+(y^(k|~v))+w[6]+2734768916&4294967295,I=k+(E<<15&4294967295|E>>>17),E=v+(k^(I|~y))+w[13]+1309151649&4294967295,v=I+(E<<21&4294967295|E>>>11),E=y+(I^(v|~k))+w[4]+4149444226&4294967295,y=v+(E<<6&4294967295|E>>>26),E=k+(v^(y|~I))+w[11]+3174756917&4294967295,k=y+(E<<10&4294967295|E>>>22),E=I+(y^(k|~v))+w[2]+718787259&4294967295,I=k+(E<<15&4294967295|E>>>17),E=v+(k^(I|~y))+w[9]+3951481745&4294967295,b.g[0]=b.g[0]+y&4294967295,b.g[1]=b.g[1]+(I+(E<<21&4294967295|E>>>11))&4294967295,b.g[2]=b.g[2]+I&4294967295,b.g[3]=b.g[3]+k&4294967295}n.prototype.u=function(b,y){y===void 0&&(y=b.length);for(var v=y-this.blockSize,w=this.B,I=this.h,k=0;k<y;){if(I==0)for(;k<=v;)r(this,b,k),k+=this.blockSize;if(typeof b=="string"){for(;k<y;)if(w[I++]=b.charCodeAt(k++),I==this.blockSize){r(this,w),I=0;break}}else for(;k<y;)if(w[I++]=b[k++],I==this.blockSize){r(this,w),I=0;break}}this.h=I,this.o+=y},n.prototype.v=function(){var b=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);b[0]=128;for(var y=1;y<b.length-8;++y)b[y]=0;var v=8*this.o;for(y=b.length-8;y<b.length;++y)b[y]=v&255,v/=256;for(this.u(b),b=Array(16),y=v=0;4>y;++y)for(var w=0;32>w;w+=8)b[v++]=this.g[y]>>>w&255;return b};function i(b,y){var v=c;return Object.prototype.hasOwnProperty.call(v,b)?v[b]:v[b]=y(b)}function a(b,y){this.h=y;for(var v=[],w=!0,I=b.length-1;0<=I;I--){var k=b[I]|0;w&&k==y||(v[I]=k,w=!1)}this.g=v}var c={};function l(b){return-128<=b&&128>b?i(b,function(y){return new a([y|0],0>y?-1:0)}):new a([b|0],0>b?-1:0)}function d(b){if(isNaN(b)||!isFinite(b))return m;if(0>b)return D(d(-b));for(var y=[],v=1,w=0;b>=v;w++)y[w]=b/v|0,v*=4294967296;return new a(y,0)}function f(b,y){if(b.length==0)throw Error("number format error: empty string");if(y=y||10,2>y||36<y)throw Error("radix out of range: "+y);if(b.charAt(0)=="-")return D(f(b.substring(1),y));if(0<=b.indexOf("-"))throw Error('number format error: interior "-" character');for(var v=d(Math.pow(y,8)),w=m,I=0;I<b.length;I+=8){var k=Math.min(8,b.length-I),E=parseInt(b.substring(I,I+k),y);8>k?(k=d(Math.pow(y,k)),w=w.j(k).add(d(E))):(w=w.j(v),w=w.add(d(E)))}return w}var m=l(0),_=l(1),T=l(16777216);s=a.prototype,s.m=function(){if(N(this))return-D(this).m();for(var b=0,y=1,v=0;v<this.g.length;v++){var w=this.i(v);b+=(0<=w?w:4294967296+w)*y,y*=4294967296}return b},s.toString=function(b){if(b=b||10,2>b||36<b)throw Error("radix out of range: "+b);if(R(this))return"0";if(N(this))return"-"+D(this).toString(b);for(var y=d(Math.pow(b,6)),v=this,w="";;){var I=S(v,y).g;v=x(v,I.j(y));var k=((0<v.g.length?v.g[0]:v.h)>>>0).toString(b);if(v=I,R(v))return k+w;for(;6>k.length;)k="0"+k;w=k+w}},s.i=function(b){return 0>b?0:b<this.g.length?this.g[b]:this.h};function R(b){if(b.h!=0)return!1;for(var y=0;y<b.g.length;y++)if(b.g[y]!=0)return!1;return!0}function N(b){return b.h==-1}s.l=function(b){return b=x(this,b),N(b)?-1:R(b)?0:1};function D(b){for(var y=b.g.length,v=[],w=0;w<y;w++)v[w]=~b.g[w];return new a(v,~b.h).add(_)}s.abs=function(){return N(this)?D(this):this},s.add=function(b){for(var y=Math.max(this.g.length,b.g.length),v=[],w=0,I=0;I<=y;I++){var k=w+(this.i(I)&65535)+(b.i(I)&65535),E=(k>>>16)+(this.i(I)>>>16)+(b.i(I)>>>16);w=E>>>16,k&=65535,E&=65535,v[I]=E<<16|k}return new a(v,v[v.length-1]&-2147483648?-1:0)};function x(b,y){return b.add(D(y))}s.j=function(b){if(R(this)||R(b))return m;if(N(this))return N(b)?D(this).j(D(b)):D(D(this).j(b));if(N(b))return D(this.j(D(b)));if(0>this.l(T)&&0>b.l(T))return d(this.m()*b.m());for(var y=this.g.length+b.g.length,v=[],w=0;w<2*y;w++)v[w]=0;for(w=0;w<this.g.length;w++)for(var I=0;I<b.g.length;I++){var k=this.i(w)>>>16,E=this.i(w)&65535,le=b.i(I)>>>16,J=b.i(I)&65535;v[2*w+2*I]+=E*J,O(v,2*w+2*I),v[2*w+2*I+1]+=k*J,O(v,2*w+2*I+1),v[2*w+2*I+1]+=E*le,O(v,2*w+2*I+1),v[2*w+2*I+2]+=k*le,O(v,2*w+2*I+2)}for(w=0;w<y;w++)v[w]=v[2*w+1]<<16|v[2*w];for(w=y;w<2*y;w++)v[w]=0;return new a(v,0)};function O(b,y){for(;(b[y]&65535)!=b[y];)b[y+1]+=b[y]>>>16,b[y]&=65535,y++}function p(b,y){this.g=b,this.h=y}function S(b,y){if(R(y))throw Error("division by zero");if(R(b))return new p(m,m);if(N(b))return y=S(D(b),y),new p(D(y.g),D(y.h));if(N(y))return y=S(b,D(y)),new p(D(y.g),y.h);if(30<b.g.length){if(N(b)||N(y))throw Error("slowDivide_ only works with positive integers.");for(var v=_,w=y;0>=w.l(b);)v=C(v),w=C(w);var I=V(v,1),k=V(w,1);for(w=V(w,2),v=V(v,2);!R(w);){var E=k.add(w);0>=E.l(b)&&(I=I.add(v),k=E),w=V(w,1),v=V(v,1)}return y=x(b,I.j(y)),new p(I,y)}for(I=m;0<=b.l(y);){for(v=Math.max(1,Math.floor(b.m()/y.m())),w=Math.ceil(Math.log(v)/Math.LN2),w=48>=w?1:Math.pow(2,w-48),k=d(v),E=k.j(y);N(E)||0<E.l(b);)v-=w,k=d(v),E=k.j(y);R(k)&&(k=_),I=I.add(k),b=x(b,E)}return new p(I,b)}s.A=function(b){return S(this,b).h},s.and=function(b){for(var y=Math.max(this.g.length,b.g.length),v=[],w=0;w<y;w++)v[w]=this.i(w)&b.i(w);return new a(v,this.h&b.h)},s.or=function(b){for(var y=Math.max(this.g.length,b.g.length),v=[],w=0;w<y;w++)v[w]=this.i(w)|b.i(w);return new a(v,this.h|b.h)},s.xor=function(b){for(var y=Math.max(this.g.length,b.g.length),v=[],w=0;w<y;w++)v[w]=this.i(w)^b.i(w);return new a(v,this.h^b.h)};function C(b){for(var y=b.g.length+1,v=[],w=0;w<y;w++)v[w]=b.i(w)<<1|b.i(w-1)>>>31;return new a(v,b.h)}function V(b,y){var v=y>>5;y%=32;for(var w=b.g.length-v,I=[],k=0;k<w;k++)I[k]=0<y?b.i(k+v)>>>y|b.i(k+v+1)<<32-y:b.i(k+v);return new a(I,b.h)}n.prototype.digest=n.prototype.v,n.prototype.reset=n.prototype.s,n.prototype.update=n.prototype.u,du=n,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.A,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=d,a.fromString=f,Jt=a}).apply(typeof Lc<"u"?Lc:typeof self<"u"?self:typeof window<"u"?window:{});var dr=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var hu,cs,fu,vr,io,pu,mu,gu;(function(){var s,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(o,u,h){return o==Array.prototype||o==Object.prototype||(o[u]=h.value),o};function t(o){o=[typeof globalThis=="object"&&globalThis,o,typeof window=="object"&&window,typeof self=="object"&&self,typeof dr=="object"&&dr];for(var u=0;u<o.length;++u){var h=o[u];if(h&&h.Math==Math)return h}throw Error("Cannot find global object")}var n=t(this);function r(o,u){if(u)e:{var h=n;o=o.split(".");for(var g=0;g<o.length-1;g++){var A=o[g];if(!(A in h))break e;h=h[A]}o=o[o.length-1],g=h[o],u=u(g),u!=g&&u!=null&&e(h,o,{configurable:!0,writable:!0,value:u})}}function i(o,u){o instanceof String&&(o+="");var h=0,g=!1,A={next:function(){if(!g&&h<o.length){var L=h++;return{value:u(L,o[L]),done:!1}}return g=!0,{done:!0,value:void 0}}};return A[Symbol.iterator]=function(){return A},A}r("Array.prototype.values",function(o){return o||function(){return i(this,function(u,h){return h})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var a=a||{},c=this||self;function l(o){var u=typeof o;return u=u!="object"?u:o?Array.isArray(o)?"array":u:"null",u=="array"||u=="object"&&typeof o.length=="number"}function d(o){var u=typeof o;return u=="object"&&o!=null||u=="function"}function f(o,u,h){return o.call.apply(o.bind,arguments)}function m(o,u,h){if(!o)throw Error();if(2<arguments.length){var g=Array.prototype.slice.call(arguments,2);return function(){var A=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(A,g),o.apply(u,A)}}return function(){return o.apply(u,arguments)}}function _(o,u,h){return _=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?f:m,_.apply(null,arguments)}function T(o,u){var h=Array.prototype.slice.call(arguments,1);return function(){var g=h.slice();return g.push.apply(g,arguments),o.apply(this,g)}}function R(o,u){function h(){}h.prototype=u.prototype,o.aa=u.prototype,o.prototype=new h,o.prototype.constructor=o,o.Qb=function(g,A,L){for(var $=Array(arguments.length-2),de=2;de<arguments.length;de++)$[de-2]=arguments[de];return u.prototype[A].apply(g,$)}}function N(o){const u=o.length;if(0<u){const h=Array(u);for(let g=0;g<u;g++)h[g]=o[g];return h}return[]}function D(o,u){for(let h=1;h<arguments.length;h++){const g=arguments[h];if(l(g)){const A=o.length||0,L=g.length||0;o.length=A+L;for(let $=0;$<L;$++)o[A+$]=g[$]}else o.push(g)}}class x{constructor(u,h){this.i=u,this.j=h,this.h=0,this.g=null}get(){let u;return 0<this.h?(this.h--,u=this.g,this.g=u.next,u.next=null):u=this.i(),u}}function O(o){return/^[\s\xa0]*$/.test(o)}function p(){var o=c.navigator;return o&&(o=o.userAgent)?o:""}function S(o){return S[" "](o),o}S[" "]=function(){};var C=p().indexOf("Gecko")!=-1&&!(p().toLowerCase().indexOf("webkit")!=-1&&p().indexOf("Edge")==-1)&&!(p().indexOf("Trident")!=-1||p().indexOf("MSIE")!=-1)&&p().indexOf("Edge")==-1;function V(o,u,h){for(const g in o)u.call(h,o[g],g,o)}function b(o,u){for(const h in o)u.call(void 0,o[h],h,o)}function y(o){const u={};for(const h in o)u[h]=o[h];return u}const v="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function w(o,u){let h,g;for(let A=1;A<arguments.length;A++){g=arguments[A];for(h in g)o[h]=g[h];for(let L=0;L<v.length;L++)h=v[L],Object.prototype.hasOwnProperty.call(g,h)&&(o[h]=g[h])}}function I(o){var u=1;o=o.split(":");const h=[];for(;0<u&&o.length;)h.push(o.shift()),u--;return o.length&&h.push(o.join(":")),h}function k(o){c.setTimeout(()=>{throw o},0)}function E(){var o=qn;let u=null;return o.g&&(u=o.g,o.g=o.g.next,o.g||(o.h=null),u.next=null),u}class le{constructor(){this.h=this.g=null}add(u,h){const g=J.get();g.set(u,h),this.h?this.h.next=g:this.g=g,this.h=g}}var J=new x(()=>new ue,o=>o.reset());class ue{constructor(){this.next=this.g=this.h=null}set(u,h){this.h=u,this.g=h,this.next=null}reset(){this.next=this.g=this.h=null}}let te,Xe=!1,qn=new le,Ws=()=>{const o=c.Promise.resolve(void 0);te=()=>{o.then(dn)}};var dn=()=>{for(var o;o=E();){try{o.h.call(o.g)}catch(h){k(h)}var u=J;u.j(o),100>u.h&&(u.h++,o.next=u.g,u.g=o)}Xe=!1};function ze(){this.s=this.s,this.C=this.C}ze.prototype.s=!1,ze.prototype.ma=function(){this.s||(this.s=!0,this.N())},ze.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function De(o,u){this.type=o,this.g=this.target=u,this.defaultPrevented=!1}De.prototype.h=function(){this.defaultPrevented=!0};var _h=function(){if(!c.addEventListener||!Object.defineProperty)return!1;var o=!1,u=Object.defineProperty({},"passive",{get:function(){o=!0}});try{const h=()=>{};c.addEventListener("test",h,u),c.removeEventListener("test",h,u)}catch{}return o}();function zn(o,u){if(De.call(this,o?o.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,o){var h=this.type=o.type,g=o.changedTouches&&o.changedTouches.length?o.changedTouches[0]:null;if(this.target=o.target||o.srcElement,this.g=u,u=o.relatedTarget){if(C){e:{try{S(u.nodeName);var A=!0;break e}catch{}A=!1}A||(u=null)}}else h=="mouseover"?u=o.fromElement:h=="mouseout"&&(u=o.toElement);this.relatedTarget=u,g?(this.clientX=g.clientX!==void 0?g.clientX:g.pageX,this.clientY=g.clientY!==void 0?g.clientY:g.pageY,this.screenX=g.screenX||0,this.screenY=g.screenY||0):(this.clientX=o.clientX!==void 0?o.clientX:o.pageX,this.clientY=o.clientY!==void 0?o.clientY:o.pageY,this.screenX=o.screenX||0,this.screenY=o.screenY||0),this.button=o.button,this.key=o.key||"",this.ctrlKey=o.ctrlKey,this.altKey=o.altKey,this.shiftKey=o.shiftKey,this.metaKey=o.metaKey,this.pointerId=o.pointerId||0,this.pointerType=typeof o.pointerType=="string"?o.pointerType:vh[o.pointerType]||"",this.state=o.state,this.i=o,o.defaultPrevented&&zn.aa.h.call(this)}}R(zn,De);var vh={2:"touch",3:"pen",4:"mouse"};zn.prototype.h=function(){zn.aa.h.call(this);var o=this.i;o.preventDefault?o.preventDefault():o.returnValue=!1};var Hs="closure_listenable_"+(1e6*Math.random()|0),bh=0;function wh(o,u,h,g,A){this.listener=o,this.proxy=null,this.src=u,this.type=h,this.capture=!!g,this.ha=A,this.key=++bh,this.da=this.fa=!1}function Ks(o){o.da=!0,o.listener=null,o.proxy=null,o.src=null,o.ha=null}function Gs(o){this.src=o,this.g={},this.h=0}Gs.prototype.add=function(o,u,h,g,A){var L=o.toString();o=this.g[L],o||(o=this.g[L]=[],this.h++);var $=gi(o,u,g,A);return-1<$?(u=o[$],h||(u.fa=!1)):(u=new wh(u,this.src,L,!!g,A),u.fa=h,o.push(u)),u};function mi(o,u){var h=u.type;if(h in o.g){var g=o.g[h],A=Array.prototype.indexOf.call(g,u,void 0),L;(L=0<=A)&&Array.prototype.splice.call(g,A,1),L&&(Ks(u),o.g[h].length==0&&(delete o.g[h],o.h--))}}function gi(o,u,h,g){for(var A=0;A<o.length;++A){var L=o[A];if(!L.da&&L.listener==u&&L.capture==!!h&&L.ha==g)return A}return-1}var yi="closure_lm_"+(1e6*Math.random()|0),_i={};function Ta(o,u,h,g,A){if(Array.isArray(u)){for(var L=0;L<u.length;L++)Ta(o,u[L],h,g,A);return null}return h=ka(h),o&&o[Hs]?o.K(u,h,d(g)?!!g.capture:!1,A):Eh(o,u,h,!1,g,A)}function Eh(o,u,h,g,A,L){if(!u)throw Error("Invalid event type");var $=d(A)?!!A.capture:!!A,de=bi(o);if(de||(o[yi]=de=new Gs(o)),h=de.add(u,h,g,$,L),h.proxy)return h;if(g=Th(),h.proxy=g,g.src=o,g.listener=h,o.addEventListener)_h||(A=$),A===void 0&&(A=!1),o.addEventListener(u.toString(),g,A);else if(o.attachEvent)o.attachEvent(Sa(u.toString()),g);else if(o.addListener&&o.removeListener)o.addListener(g);else throw Error("addEventListener and attachEvent are unavailable.");return h}function Th(){function o(h){return u.call(o.src,o.listener,h)}const u=Ih;return o}function Ia(o,u,h,g,A){if(Array.isArray(u))for(var L=0;L<u.length;L++)Ia(o,u[L],h,g,A);else g=d(g)?!!g.capture:!!g,h=ka(h),o&&o[Hs]?(o=o.i,u=String(u).toString(),u in o.g&&(L=o.g[u],h=gi(L,h,g,A),-1<h&&(Ks(L[h]),Array.prototype.splice.call(L,h,1),L.length==0&&(delete o.g[u],o.h--)))):o&&(o=bi(o))&&(u=o.g[u.toString()],o=-1,u&&(o=gi(u,h,g,A)),(h=-1<o?u[o]:null)&&vi(h))}function vi(o){if(typeof o!="number"&&o&&!o.da){var u=o.src;if(u&&u[Hs])mi(u.i,o);else{var h=o.type,g=o.proxy;u.removeEventListener?u.removeEventListener(h,g,o.capture):u.detachEvent?u.detachEvent(Sa(h),g):u.addListener&&u.removeListener&&u.removeListener(g),(h=bi(u))?(mi(h,o),h.h==0&&(h.src=null,u[yi]=null)):Ks(o)}}}function Sa(o){return o in _i?_i[o]:_i[o]="on"+o}function Ih(o,u){if(o.da)o=!0;else{u=new zn(u,this);var h=o.listener,g=o.ha||o.src;o.fa&&vi(o),o=h.call(g,u)}return o}function bi(o){return o=o[yi],o instanceof Gs?o:null}var wi="__closure_events_fn_"+(1e9*Math.random()>>>0);function ka(o){return typeof o=="function"?o:(o[wi]||(o[wi]=function(u){return o.handleEvent(u)}),o[wi])}function Pe(){ze.call(this),this.i=new Gs(this),this.M=this,this.F=null}R(Pe,ze),Pe.prototype[Hs]=!0,Pe.prototype.removeEventListener=function(o,u,h,g){Ia(this,o,u,h,g)};function Oe(o,u){var h,g=o.F;if(g)for(h=[];g;g=g.F)h.push(g);if(o=o.M,g=u.type||u,typeof u=="string")u=new De(u,o);else if(u instanceof De)u.target=u.target||o;else{var A=u;u=new De(g,o),w(u,A)}if(A=!0,h)for(var L=h.length-1;0<=L;L--){var $=u.g=h[L];A=Qs($,g,!0,u)&&A}if($=u.g=o,A=Qs($,g,!0,u)&&A,A=Qs($,g,!1,u)&&A,h)for(L=0;L<h.length;L++)$=u.g=h[L],A=Qs($,g,!1,u)&&A}Pe.prototype.N=function(){if(Pe.aa.N.call(this),this.i){var o=this.i,u;for(u in o.g){for(var h=o.g[u],g=0;g<h.length;g++)Ks(h[g]);delete o.g[u],o.h--}}this.F=null},Pe.prototype.K=function(o,u,h,g){return this.i.add(String(o),u,!1,h,g)},Pe.prototype.L=function(o,u,h,g){return this.i.add(String(o),u,!0,h,g)};function Qs(o,u,h,g){if(u=o.i.g[String(u)],!u)return!0;u=u.concat();for(var A=!0,L=0;L<u.length;++L){var $=u[L];if($&&!$.da&&$.capture==h){var de=$.listener,Se=$.ha||$.src;$.fa&&mi(o.i,$),A=de.call(Se,g)!==!1&&A}}return A&&!g.defaultPrevented}function Aa(o,u,h){if(typeof o=="function")h&&(o=_(o,h));else if(o&&typeof o.handleEvent=="function")o=_(o.handleEvent,o);else throw Error("Invalid listener argument");return 2147483647<Number(u)?-1:c.setTimeout(o,u||0)}function Ra(o){o.g=Aa(()=>{o.g=null,o.i&&(o.i=!1,Ra(o))},o.l);const u=o.h;o.h=null,o.m.apply(null,u)}class Sh extends ze{constructor(u,h){super(),this.m=u,this.l=h,this.h=null,this.i=!1,this.g=null}j(u){this.h=arguments,this.g?this.i=!0:Ra(this)}N(){super.N(),this.g&&(c.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Wn(o){ze.call(this),this.h=o,this.g={}}R(Wn,ze);var Ca=[];function Da(o){V(o.g,function(u,h){this.g.hasOwnProperty(h)&&vi(u)},o),o.g={}}Wn.prototype.N=function(){Wn.aa.N.call(this),Da(this)},Wn.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Ei=c.JSON.stringify,kh=c.JSON.parse,Ah=class{stringify(o){return c.JSON.stringify(o,void 0)}parse(o){return c.JSON.parse(o,void 0)}};function Ti(){}Ti.prototype.h=null;function Pa(o){return o.h||(o.h=o.i())}function Na(){}var Hn={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Ii(){De.call(this,"d")}R(Ii,De);function Si(){De.call(this,"c")}R(Si,De);var zt={},La=null;function Ys(){return La=La||new Pe}zt.La="serverreachability";function xa(o){De.call(this,zt.La,o)}R(xa,De);function Kn(o){const u=Ys();Oe(u,new xa(u))}zt.STAT_EVENT="statevent";function Va(o,u){De.call(this,zt.STAT_EVENT,o),this.stat=u}R(Va,De);function $e(o){const u=Ys();Oe(u,new Va(u,o))}zt.Ma="timingevent";function Ba(o,u){De.call(this,zt.Ma,o),this.size=u}R(Ba,De);function Gn(o,u){if(typeof o!="function")throw Error("Fn must not be null and must be a function");return c.setTimeout(function(){o()},u)}function Qn(){this.g=!0}Qn.prototype.xa=function(){this.g=!1};function Rh(o,u,h,g,A,L){o.info(function(){if(o.g)if(L)for(var $="",de=L.split("&"),Se=0;Se<de.length;Se++){var ie=de[Se].split("=");if(1<ie.length){var Ne=ie[0];ie=ie[1];var Le=Ne.split("_");$=2<=Le.length&&Le[1]=="type"?$+(Ne+"="+ie+"&"):$+(Ne+"=redacted&")}}else $=null;else $=L;return"XMLHTTP REQ ("+g+") [attempt "+A+"]: "+u+`
`+h+`
`+$})}function Ch(o,u,h,g,A,L,$){o.info(function(){return"XMLHTTP RESP ("+g+") [ attempt "+A+"]: "+u+`
`+h+`
`+L+" "+$})}function hn(o,u,h,g){o.info(function(){return"XMLHTTP TEXT ("+u+"): "+Ph(o,h)+(g?" "+g:"")})}function Dh(o,u){o.info(function(){return"TIMEOUT: "+u})}Qn.prototype.info=function(){};function Ph(o,u){if(!o.g)return u;if(!u)return null;try{var h=JSON.parse(u);if(h){for(o=0;o<h.length;o++)if(Array.isArray(h[o])){var g=h[o];if(!(2>g.length)){var A=g[1];if(Array.isArray(A)&&!(1>A.length)){var L=A[0];if(L!="noop"&&L!="stop"&&L!="close")for(var $=1;$<A.length;$++)A[$]=""}}}}return Ei(h)}catch{return u}}var Js={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},Ma={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},ki;function Xs(){}R(Xs,Ti),Xs.prototype.g=function(){return new XMLHttpRequest},Xs.prototype.i=function(){return{}},ki=new Xs;function Tt(o,u,h,g){this.j=o,this.i=u,this.l=h,this.R=g||1,this.U=new Wn(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Oa}function Oa(){this.i=null,this.g="",this.h=!1}var $a={},Ai={};function Ri(o,u,h){o.L=1,o.v=nr(ut(u)),o.m=h,o.P=!0,Fa(o,null)}function Fa(o,u){o.F=Date.now(),Zs(o),o.A=ut(o.v);var h=o.A,g=o.R;Array.isArray(g)||(g=[String(g)]),ec(h.i,"t",g),o.C=0,h=o.j.J,o.h=new Oa,o.g=_c(o.j,h?u:null,!o.m),0<o.O&&(o.M=new Sh(_(o.Y,o,o.g),o.O)),u=o.U,h=o.g,g=o.ca;var A="readystatechange";Array.isArray(A)||(A&&(Ca[0]=A.toString()),A=Ca);for(var L=0;L<A.length;L++){var $=Ta(h,A[L],g||u.handleEvent,!1,u.h||u);if(!$)break;u.g[$.key]=$}u=o.H?y(o.H):{},o.m?(o.u||(o.u="POST"),u["Content-Type"]="application/x-www-form-urlencoded",o.g.ea(o.A,o.u,o.m,u)):(o.u="GET",o.g.ea(o.A,o.u,null,u)),Kn(),Rh(o.i,o.u,o.A,o.l,o.R,o.m)}Tt.prototype.ca=function(o){o=o.target;const u=this.M;u&&dt(o)==3?u.j():this.Y(o)},Tt.prototype.Y=function(o){try{if(o==this.g)e:{const Le=dt(this.g);var u=this.g.Ba();const mn=this.g.Z();if(!(3>Le)&&(Le!=3||this.g&&(this.h.h||this.g.oa()||ac(this.g)))){this.J||Le!=4||u==7||(u==8||0>=mn?Kn(3):Kn(2)),Ci(this);var h=this.g.Z();this.X=h;t:if(Ua(this)){var g=ac(this.g);o="";var A=g.length,L=dt(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Wt(this),Yn(this);var $="";break t}this.h.i=new c.TextDecoder}for(u=0;u<A;u++)this.h.h=!0,o+=this.h.i.decode(g[u],{stream:!(L&&u==A-1)});g.length=0,this.h.g+=o,this.C=0,$=this.h.g}else $=this.g.oa();if(this.o=h==200,Ch(this.i,this.u,this.A,this.l,this.R,Le,h),this.o){if(this.T&&!this.K){t:{if(this.g){var de,Se=this.g;if((de=Se.g?Se.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!O(de)){var ie=de;break t}}ie=null}if(h=ie)hn(this.i,this.l,h,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Di(this,h);else{this.o=!1,this.s=3,$e(12),Wt(this),Yn(this);break e}}if(this.P){h=!0;let Ze;for(;!this.J&&this.C<$.length;)if(Ze=Nh(this,$),Ze==Ai){Le==4&&(this.s=4,$e(14),h=!1),hn(this.i,this.l,null,"[Incomplete Response]");break}else if(Ze==$a){this.s=4,$e(15),hn(this.i,this.l,$,"[Invalid Chunk]"),h=!1;break}else hn(this.i,this.l,Ze,null),Di(this,Ze);if(Ua(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Le!=4||$.length!=0||this.h.h||(this.s=1,$e(16),h=!1),this.o=this.o&&h,!h)hn(this.i,this.l,$,"[Invalid Chunked Response]"),Wt(this),Yn(this);else if(0<$.length&&!this.W){this.W=!0;var Ne=this.j;Ne.g==this&&Ne.ba&&!Ne.M&&(Ne.j.info("Great, no buffering proxy detected. Bytes received: "+$.length),Bi(Ne),Ne.M=!0,$e(11))}}else hn(this.i,this.l,$,null),Di(this,$);Le==4&&Wt(this),this.o&&!this.J&&(Le==4?pc(this.j,this):(this.o=!1,Zs(this)))}else Qh(this.g),h==400&&0<$.indexOf("Unknown SID")?(this.s=3,$e(12)):(this.s=0,$e(13)),Wt(this),Yn(this)}}}catch{}finally{}};function Ua(o){return o.g?o.u=="GET"&&o.L!=2&&o.j.Ca:!1}function Nh(o,u){var h=o.C,g=u.indexOf(`
`,h);return g==-1?Ai:(h=Number(u.substring(h,g)),isNaN(h)?$a:(g+=1,g+h>u.length?Ai:(u=u.slice(g,g+h),o.C=g+h,u)))}Tt.prototype.cancel=function(){this.J=!0,Wt(this)};function Zs(o){o.S=Date.now()+o.I,ja(o,o.I)}function ja(o,u){if(o.B!=null)throw Error("WatchDog timer not null");o.B=Gn(_(o.ba,o),u)}function Ci(o){o.B&&(c.clearTimeout(o.B),o.B=null)}Tt.prototype.ba=function(){this.B=null;const o=Date.now();0<=o-this.S?(Dh(this.i,this.A),this.L!=2&&(Kn(),$e(17)),Wt(this),this.s=2,Yn(this)):ja(this,this.S-o)};function Yn(o){o.j.G==0||o.J||pc(o.j,o)}function Wt(o){Ci(o);var u=o.M;u&&typeof u.ma=="function"&&u.ma(),o.M=null,Da(o.U),o.g&&(u=o.g,o.g=null,u.abort(),u.ma())}function Di(o,u){try{var h=o.j;if(h.G!=0&&(h.g==o||Pi(h.h,o))){if(!o.K&&Pi(h.h,o)&&h.G==3){try{var g=h.Da.g.parse(u)}catch{g=null}if(Array.isArray(g)&&g.length==3){var A=g;if(A[0]==0){e:if(!h.u){if(h.g)if(h.g.F+3e3<o.F)cr(h),or(h);else break e;Vi(h),$e(18)}}else h.za=A[1],0<h.za-h.T&&37500>A[2]&&h.F&&h.v==0&&!h.C&&(h.C=Gn(_(h.Za,h),6e3));if(1>=Wa(h.h)&&h.ca){try{h.ca()}catch{}h.ca=void 0}}else Kt(h,11)}else if((o.K||h.g==o)&&cr(h),!O(u))for(A=h.Da.g.parse(u),u=0;u<A.length;u++){let ie=A[u];if(h.T=ie[0],ie=ie[1],h.G==2)if(ie[0]=="c"){h.K=ie[1],h.ia=ie[2];const Ne=ie[3];Ne!=null&&(h.la=Ne,h.j.info("VER="+h.la));const Le=ie[4];Le!=null&&(h.Aa=Le,h.j.info("SVER="+h.Aa));const mn=ie[5];mn!=null&&typeof mn=="number"&&0<mn&&(g=1.5*mn,h.L=g,h.j.info("backChannelRequestTimeoutMs_="+g)),g=h;const Ze=o.g;if(Ze){const ur=Ze.g?Ze.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(ur){var L=g.h;L.g||ur.indexOf("spdy")==-1&&ur.indexOf("quic")==-1&&ur.indexOf("h2")==-1||(L.j=L.l,L.g=new Set,L.h&&(Ni(L,L.h),L.h=null))}if(g.D){const Mi=Ze.g?Ze.g.getResponseHeader("X-HTTP-Session-Id"):null;Mi&&(g.ya=Mi,he(g.I,g.D,Mi))}}h.G=3,h.l&&h.l.ua(),h.ba&&(h.R=Date.now()-o.F,h.j.info("Handshake RTT: "+h.R+"ms")),g=h;var $=o;if(g.qa=yc(g,g.J?g.ia:null,g.W),$.K){Ha(g.h,$);var de=$,Se=g.L;Se&&(de.I=Se),de.B&&(Ci(de),Zs(de)),g.g=$}else hc(g);0<h.i.length&&ar(h)}else ie[0]!="stop"&&ie[0]!="close"||Kt(h,7);else h.G==3&&(ie[0]=="stop"||ie[0]=="close"?ie[0]=="stop"?Kt(h,7):xi(h):ie[0]!="noop"&&h.l&&h.l.ta(ie),h.v=0)}}Kn(4)}catch{}}var Lh=class{constructor(o,u){this.g=o,this.map=u}};function qa(o){this.l=o||10,c.PerformanceNavigationTiming?(o=c.performance.getEntriesByType("navigation"),o=0<o.length&&(o[0].nextHopProtocol=="hq"||o[0].nextHopProtocol=="h2")):o=!!(c.chrome&&c.chrome.loadTimes&&c.chrome.loadTimes()&&c.chrome.loadTimes().wasFetchedViaSpdy),this.j=o?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function za(o){return o.h?!0:o.g?o.g.size>=o.j:!1}function Wa(o){return o.h?1:o.g?o.g.size:0}function Pi(o,u){return o.h?o.h==u:o.g?o.g.has(u):!1}function Ni(o,u){o.g?o.g.add(u):o.h=u}function Ha(o,u){o.h&&o.h==u?o.h=null:o.g&&o.g.has(u)&&o.g.delete(u)}qa.prototype.cancel=function(){if(this.i=Ka(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const o of this.g.values())o.cancel();this.g.clear()}};function Ka(o){if(o.h!=null)return o.i.concat(o.h.D);if(o.g!=null&&o.g.size!==0){let u=o.i;for(const h of o.g.values())u=u.concat(h.D);return u}return N(o.i)}function xh(o){if(o.V&&typeof o.V=="function")return o.V();if(typeof Map<"u"&&o instanceof Map||typeof Set<"u"&&o instanceof Set)return Array.from(o.values());if(typeof o=="string")return o.split("");if(l(o)){for(var u=[],h=o.length,g=0;g<h;g++)u.push(o[g]);return u}u=[],h=0;for(g in o)u[h++]=o[g];return u}function Vh(o){if(o.na&&typeof o.na=="function")return o.na();if(!o.V||typeof o.V!="function"){if(typeof Map<"u"&&o instanceof Map)return Array.from(o.keys());if(!(typeof Set<"u"&&o instanceof Set)){if(l(o)||typeof o=="string"){var u=[];o=o.length;for(var h=0;h<o;h++)u.push(h);return u}u=[],h=0;for(const g in o)u[h++]=g;return u}}}function Ga(o,u){if(o.forEach&&typeof o.forEach=="function")o.forEach(u,void 0);else if(l(o)||typeof o=="string")Array.prototype.forEach.call(o,u,void 0);else for(var h=Vh(o),g=xh(o),A=g.length,L=0;L<A;L++)u.call(void 0,g[L],h&&h[L],o)}var Qa=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Bh(o,u){if(o){o=o.split("&");for(var h=0;h<o.length;h++){var g=o[h].indexOf("="),A=null;if(0<=g){var L=o[h].substring(0,g);A=o[h].substring(g+1)}else L=o[h];u(L,A?decodeURIComponent(A.replace(/\+/g," ")):"")}}}function Ht(o){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,o instanceof Ht){this.h=o.h,er(this,o.j),this.o=o.o,this.g=o.g,tr(this,o.s),this.l=o.l;var u=o.i,h=new Zn;h.i=u.i,u.g&&(h.g=new Map(u.g),h.h=u.h),Ya(this,h),this.m=o.m}else o&&(u=String(o).match(Qa))?(this.h=!1,er(this,u[1]||"",!0),this.o=Jn(u[2]||""),this.g=Jn(u[3]||"",!0),tr(this,u[4]),this.l=Jn(u[5]||"",!0),Ya(this,u[6]||"",!0),this.m=Jn(u[7]||"")):(this.h=!1,this.i=new Zn(null,this.h))}Ht.prototype.toString=function(){var o=[],u=this.j;u&&o.push(Xn(u,Ja,!0),":");var h=this.g;return(h||u=="file")&&(o.push("//"),(u=this.o)&&o.push(Xn(u,Ja,!0),"@"),o.push(encodeURIComponent(String(h)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),h=this.s,h!=null&&o.push(":",String(h))),(h=this.l)&&(this.g&&h.charAt(0)!="/"&&o.push("/"),o.push(Xn(h,h.charAt(0)=="/"?$h:Oh,!0))),(h=this.i.toString())&&o.push("?",h),(h=this.m)&&o.push("#",Xn(h,Uh)),o.join("")};function ut(o){return new Ht(o)}function er(o,u,h){o.j=h?Jn(u,!0):u,o.j&&(o.j=o.j.replace(/:$/,""))}function tr(o,u){if(u){if(u=Number(u),isNaN(u)||0>u)throw Error("Bad port number "+u);o.s=u}else o.s=null}function Ya(o,u,h){u instanceof Zn?(o.i=u,jh(o.i,o.h)):(h||(u=Xn(u,Fh)),o.i=new Zn(u,o.h))}function he(o,u,h){o.i.set(u,h)}function nr(o){return he(o,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),o}function Jn(o,u){return o?u?decodeURI(o.replace(/%25/g,"%2525")):decodeURIComponent(o):""}function Xn(o,u,h){return typeof o=="string"?(o=encodeURI(o).replace(u,Mh),h&&(o=o.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),o):null}function Mh(o){return o=o.charCodeAt(0),"%"+(o>>4&15).toString(16)+(o&15).toString(16)}var Ja=/[#\/\?@]/g,Oh=/[#\?:]/g,$h=/[#\?]/g,Fh=/[#\?@]/g,Uh=/#/g;function Zn(o,u){this.h=this.g=null,this.i=o||null,this.j=!!u}function It(o){o.g||(o.g=new Map,o.h=0,o.i&&Bh(o.i,function(u,h){o.add(decodeURIComponent(u.replace(/\+/g," ")),h)}))}s=Zn.prototype,s.add=function(o,u){It(this),this.i=null,o=fn(this,o);var h=this.g.get(o);return h||this.g.set(o,h=[]),h.push(u),this.h+=1,this};function Xa(o,u){It(o),u=fn(o,u),o.g.has(u)&&(o.i=null,o.h-=o.g.get(u).length,o.g.delete(u))}function Za(o,u){return It(o),u=fn(o,u),o.g.has(u)}s.forEach=function(o,u){It(this),this.g.forEach(function(h,g){h.forEach(function(A){o.call(u,A,g,this)},this)},this)},s.na=function(){It(this);const o=Array.from(this.g.values()),u=Array.from(this.g.keys()),h=[];for(let g=0;g<u.length;g++){const A=o[g];for(let L=0;L<A.length;L++)h.push(u[g])}return h},s.V=function(o){It(this);let u=[];if(typeof o=="string")Za(this,o)&&(u=u.concat(this.g.get(fn(this,o))));else{o=Array.from(this.g.values());for(let h=0;h<o.length;h++)u=u.concat(o[h])}return u},s.set=function(o,u){return It(this),this.i=null,o=fn(this,o),Za(this,o)&&(this.h-=this.g.get(o).length),this.g.set(o,[u]),this.h+=1,this},s.get=function(o,u){return o?(o=this.V(o),0<o.length?String(o[0]):u):u};function ec(o,u,h){Xa(o,u),0<h.length&&(o.i=null,o.g.set(fn(o,u),N(h)),o.h+=h.length)}s.toString=function(){if(this.i)return this.i;if(!this.g)return"";const o=[],u=Array.from(this.g.keys());for(var h=0;h<u.length;h++){var g=u[h];const L=encodeURIComponent(String(g)),$=this.V(g);for(g=0;g<$.length;g++){var A=L;$[g]!==""&&(A+="="+encodeURIComponent(String($[g]))),o.push(A)}}return this.i=o.join("&")};function fn(o,u){return u=String(u),o.j&&(u=u.toLowerCase()),u}function jh(o,u){u&&!o.j&&(It(o),o.i=null,o.g.forEach(function(h,g){var A=g.toLowerCase();g!=A&&(Xa(this,g),ec(this,A,h))},o)),o.j=u}function qh(o,u){const h=new Qn;if(c.Image){const g=new Image;g.onload=T(St,h,"TestLoadImage: loaded",!0,u,g),g.onerror=T(St,h,"TestLoadImage: error",!1,u,g),g.onabort=T(St,h,"TestLoadImage: abort",!1,u,g),g.ontimeout=T(St,h,"TestLoadImage: timeout",!1,u,g),c.setTimeout(function(){g.ontimeout&&g.ontimeout()},1e4),g.src=o}else u(!1)}function zh(o,u){const h=new Qn,g=new AbortController,A=setTimeout(()=>{g.abort(),St(h,"TestPingServer: timeout",!1,u)},1e4);fetch(o,{signal:g.signal}).then(L=>{clearTimeout(A),L.ok?St(h,"TestPingServer: ok",!0,u):St(h,"TestPingServer: server error",!1,u)}).catch(()=>{clearTimeout(A),St(h,"TestPingServer: error",!1,u)})}function St(o,u,h,g,A){try{A&&(A.onload=null,A.onerror=null,A.onabort=null,A.ontimeout=null),g(h)}catch{}}function Wh(){this.g=new Ah}function Hh(o,u,h){const g=h||"";try{Ga(o,function(A,L){let $=A;d(A)&&($=Ei(A)),u.push(g+L+"="+encodeURIComponent($))})}catch(A){throw u.push(g+"type="+encodeURIComponent("_badmap")),A}}function sr(o){this.l=o.Ub||null,this.j=o.eb||!1}R(sr,Ti),sr.prototype.g=function(){return new rr(this.l,this.j)},sr.prototype.i=function(o){return function(){return o}}({});function rr(o,u){Pe.call(this),this.D=o,this.o=u,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}R(rr,Pe),s=rr.prototype,s.open=function(o,u){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=o,this.A=u,this.readyState=1,ts(this)},s.send=function(o){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const u={headers:this.u,method:this.B,credentials:this.m,cache:void 0};o&&(u.body=o),(this.D||c).fetch(new Request(this.A,u)).then(this.Sa.bind(this),this.ga.bind(this))},s.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,es(this)),this.readyState=0},s.Sa=function(o){if(this.g&&(this.l=o,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=o.headers,this.readyState=2,ts(this)),this.g&&(this.readyState=3,ts(this),this.g)))if(this.responseType==="arraybuffer")o.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof c.ReadableStream<"u"&&"body"in o){if(this.j=o.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;tc(this)}else o.text().then(this.Ra.bind(this),this.ga.bind(this))};function tc(o){o.j.read().then(o.Pa.bind(o)).catch(o.ga.bind(o))}s.Pa=function(o){if(this.g){if(this.o&&o.value)this.response.push(o.value);else if(!this.o){var u=o.value?o.value:new Uint8Array(0);(u=this.v.decode(u,{stream:!o.done}))&&(this.response=this.responseText+=u)}o.done?es(this):ts(this),this.readyState==3&&tc(this)}},s.Ra=function(o){this.g&&(this.response=this.responseText=o,es(this))},s.Qa=function(o){this.g&&(this.response=o,es(this))},s.ga=function(){this.g&&es(this)};function es(o){o.readyState=4,o.l=null,o.j=null,o.v=null,ts(o)}s.setRequestHeader=function(o,u){this.u.append(o,u)},s.getResponseHeader=function(o){return this.h&&this.h.get(o.toLowerCase())||""},s.getAllResponseHeaders=function(){if(!this.h)return"";const o=[],u=this.h.entries();for(var h=u.next();!h.done;)h=h.value,o.push(h[0]+": "+h[1]),h=u.next();return o.join(`\r
`)};function ts(o){o.onreadystatechange&&o.onreadystatechange.call(o)}Object.defineProperty(rr.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(o){this.m=o?"include":"same-origin"}});function nc(o){let u="";return V(o,function(h,g){u+=g,u+=":",u+=h,u+=`\r
`}),u}function Li(o,u,h){e:{for(g in h){var g=!1;break e}g=!0}g||(h=nc(h),typeof o=="string"?h!=null&&encodeURIComponent(String(h)):he(o,u,h))}function me(o){Pe.call(this),this.headers=new Map,this.o=o||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}R(me,Pe);var Kh=/^https?$/i,Gh=["POST","PUT"];s=me.prototype,s.Ha=function(o){this.J=o},s.ea=function(o,u,h,g){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+o);u=u?u.toUpperCase():"GET",this.D=o,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():ki.g(),this.v=this.o?Pa(this.o):Pa(ki),this.g.onreadystatechange=_(this.Ea,this);try{this.B=!0,this.g.open(u,String(o),!0),this.B=!1}catch(L){sc(this,L);return}if(o=h||"",h=new Map(this.headers),g)if(Object.getPrototypeOf(g)===Object.prototype)for(var A in g)h.set(A,g[A]);else if(typeof g.keys=="function"&&typeof g.get=="function")for(const L of g.keys())h.set(L,g.get(L));else throw Error("Unknown input type for opt_headers: "+String(g));g=Array.from(h.keys()).find(L=>L.toLowerCase()=="content-type"),A=c.FormData&&o instanceof c.FormData,!(0<=Array.prototype.indexOf.call(Gh,u,void 0))||g||A||h.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[L,$]of h)this.g.setRequestHeader(L,$);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{oc(this),this.u=!0,this.g.send(o),this.u=!1}catch(L){sc(this,L)}};function sc(o,u){o.h=!1,o.g&&(o.j=!0,o.g.abort(),o.j=!1),o.l=u,o.m=5,rc(o),ir(o)}function rc(o){o.A||(o.A=!0,Oe(o,"complete"),Oe(o,"error"))}s.abort=function(o){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=o||7,Oe(this,"complete"),Oe(this,"abort"),ir(this))},s.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),ir(this,!0)),me.aa.N.call(this)},s.Ea=function(){this.s||(this.B||this.u||this.j?ic(this):this.bb())},s.bb=function(){ic(this)};function ic(o){if(o.h&&typeof a<"u"&&(!o.v[1]||dt(o)!=4||o.Z()!=2)){if(o.u&&dt(o)==4)Aa(o.Ea,0,o);else if(Oe(o,"readystatechange"),dt(o)==4){o.h=!1;try{const $=o.Z();e:switch($){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var u=!0;break e;default:u=!1}var h;if(!(h=u)){var g;if(g=$===0){var A=String(o.D).match(Qa)[1]||null;!A&&c.self&&c.self.location&&(A=c.self.location.protocol.slice(0,-1)),g=!Kh.test(A?A.toLowerCase():"")}h=g}if(h)Oe(o,"complete"),Oe(o,"success");else{o.m=6;try{var L=2<dt(o)?o.g.statusText:""}catch{L=""}o.l=L+" ["+o.Z()+"]",rc(o)}}finally{ir(o)}}}}function ir(o,u){if(o.g){oc(o);const h=o.g,g=o.v[0]?()=>{}:null;o.g=null,o.v=null,u||Oe(o,"ready");try{h.onreadystatechange=g}catch{}}}function oc(o){o.I&&(c.clearTimeout(o.I),o.I=null)}s.isActive=function(){return!!this.g};function dt(o){return o.g?o.g.readyState:0}s.Z=function(){try{return 2<dt(this)?this.g.status:-1}catch{return-1}},s.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},s.Oa=function(o){if(this.g){var u=this.g.responseText;return o&&u.indexOf(o)==0&&(u=u.substring(o.length)),kh(u)}};function ac(o){try{if(!o.g)return null;if("response"in o.g)return o.g.response;switch(o.H){case"":case"text":return o.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in o.g)return o.g.mozResponseArrayBuffer}return null}catch{return null}}function Qh(o){const u={};o=(o.g&&2<=dt(o)&&o.g.getAllResponseHeaders()||"").split(`\r
`);for(let g=0;g<o.length;g++){if(O(o[g]))continue;var h=I(o[g]);const A=h[0];if(h=h[1],typeof h!="string")continue;h=h.trim();const L=u[A]||[];u[A]=L,L.push(h)}b(u,function(g){return g.join(", ")})}s.Ba=function(){return this.m},s.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function ns(o,u,h){return h&&h.internalChannelParams&&h.internalChannelParams[o]||u}function cc(o){this.Aa=0,this.i=[],this.j=new Qn,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=ns("failFast",!1,o),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=ns("baseRetryDelayMs",5e3,o),this.cb=ns("retryDelaySeedMs",1e4,o),this.Wa=ns("forwardChannelMaxRetries",2,o),this.wa=ns("forwardChannelRequestTimeoutMs",2e4,o),this.pa=o&&o.xmlHttpFactory||void 0,this.Xa=o&&o.Tb||void 0,this.Ca=o&&o.useFetchStreams||!1,this.L=void 0,this.J=o&&o.supportsCrossDomainXhr||!1,this.K="",this.h=new qa(o&&o.concurrentRequestLimit),this.Da=new Wh,this.P=o&&o.fastHandshake||!1,this.O=o&&o.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=o&&o.Rb||!1,o&&o.xa&&this.j.xa(),o&&o.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&o&&o.detectBufferingProxy||!1,this.ja=void 0,o&&o.longPollingTimeout&&0<o.longPollingTimeout&&(this.ja=o.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}s=cc.prototype,s.la=8,s.G=1,s.connect=function(o,u,h,g){$e(0),this.W=o,this.H=u||{},h&&g!==void 0&&(this.H.OSID=h,this.H.OAID=g),this.F=this.X,this.I=yc(this,null,this.W),ar(this)};function xi(o){if(lc(o),o.G==3){var u=o.U++,h=ut(o.I);if(he(h,"SID",o.K),he(h,"RID",u),he(h,"TYPE","terminate"),ss(o,h),u=new Tt(o,o.j,u),u.L=2,u.v=nr(ut(h)),h=!1,c.navigator&&c.navigator.sendBeacon)try{h=c.navigator.sendBeacon(u.v.toString(),"")}catch{}!h&&c.Image&&(new Image().src=u.v,h=!0),h||(u.g=_c(u.j,null),u.g.ea(u.v)),u.F=Date.now(),Zs(u)}gc(o)}function or(o){o.g&&(Bi(o),o.g.cancel(),o.g=null)}function lc(o){or(o),o.u&&(c.clearTimeout(o.u),o.u=null),cr(o),o.h.cancel(),o.s&&(typeof o.s=="number"&&c.clearTimeout(o.s),o.s=null)}function ar(o){if(!za(o.h)&&!o.s){o.s=!0;var u=o.Ga;te||Ws(),Xe||(te(),Xe=!0),qn.add(u,o),o.B=0}}function Yh(o,u){return Wa(o.h)>=o.h.j-(o.s?1:0)?!1:o.s?(o.i=u.D.concat(o.i),!0):o.G==1||o.G==2||o.B>=(o.Va?0:o.Wa)?!1:(o.s=Gn(_(o.Ga,o,u),mc(o,o.B)),o.B++,!0)}s.Ga=function(o){if(this.s)if(this.s=null,this.G==1){if(!o){this.U=Math.floor(1e5*Math.random()),o=this.U++;const A=new Tt(this,this.j,o);let L=this.o;if(this.S&&(L?(L=y(L),w(L,this.S)):L=this.S),this.m!==null||this.O||(A.H=L,L=null),this.P)e:{for(var u=0,h=0;h<this.i.length;h++){t:{var g=this.i[h];if("__data__"in g.map&&(g=g.map.__data__,typeof g=="string")){g=g.length;break t}g=void 0}if(g===void 0)break;if(u+=g,4096<u){u=h;break e}if(u===4096||h===this.i.length-1){u=h+1;break e}}u=1e3}else u=1e3;u=dc(this,A,u),h=ut(this.I),he(h,"RID",o),he(h,"CVER",22),this.D&&he(h,"X-HTTP-Session-Id",this.D),ss(this,h),L&&(this.O?u="headers="+encodeURIComponent(String(nc(L)))+"&"+u:this.m&&Li(h,this.m,L)),Ni(this.h,A),this.Ua&&he(h,"TYPE","init"),this.P?(he(h,"$req",u),he(h,"SID","null"),A.T=!0,Ri(A,h,null)):Ri(A,h,u),this.G=2}}else this.G==3&&(o?uc(this,o):this.i.length==0||za(this.h)||uc(this))};function uc(o,u){var h;u?h=u.l:h=o.U++;const g=ut(o.I);he(g,"SID",o.K),he(g,"RID",h),he(g,"AID",o.T),ss(o,g),o.m&&o.o&&Li(g,o.m,o.o),h=new Tt(o,o.j,h,o.B+1),o.m===null&&(h.H=o.o),u&&(o.i=u.D.concat(o.i)),u=dc(o,h,1e3),h.I=Math.round(.5*o.wa)+Math.round(.5*o.wa*Math.random()),Ni(o.h,h),Ri(h,g,u)}function ss(o,u){o.H&&V(o.H,function(h,g){he(u,g,h)}),o.l&&Ga({},function(h,g){he(u,g,h)})}function dc(o,u,h){h=Math.min(o.i.length,h);var g=o.l?_(o.l.Na,o.l,o):null;e:{var A=o.i;let L=-1;for(;;){const $=["count="+h];L==-1?0<h?(L=A[0].g,$.push("ofs="+L)):L=0:$.push("ofs="+L);let de=!0;for(let Se=0;Se<h;Se++){let ie=A[Se].g;const Ne=A[Se].map;if(ie-=L,0>ie)L=Math.max(0,A[Se].g-100),de=!1;else try{Hh(Ne,$,"req"+ie+"_")}catch{g&&g(Ne)}}if(de){g=$.join("&");break e}}}return o=o.i.splice(0,h),u.D=o,g}function hc(o){if(!o.g&&!o.u){o.Y=1;var u=o.Fa;te||Ws(),Xe||(te(),Xe=!0),qn.add(u,o),o.v=0}}function Vi(o){return o.g||o.u||3<=o.v?!1:(o.Y++,o.u=Gn(_(o.Fa,o),mc(o,o.v)),o.v++,!0)}s.Fa=function(){if(this.u=null,fc(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var o=2*this.R;this.j.info("BP detection timer enabled: "+o),this.A=Gn(_(this.ab,this),o)}},s.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,$e(10),or(this),fc(this))};function Bi(o){o.A!=null&&(c.clearTimeout(o.A),o.A=null)}function fc(o){o.g=new Tt(o,o.j,"rpc",o.Y),o.m===null&&(o.g.H=o.o),o.g.O=0;var u=ut(o.qa);he(u,"RID","rpc"),he(u,"SID",o.K),he(u,"AID",o.T),he(u,"CI",o.F?"0":"1"),!o.F&&o.ja&&he(u,"TO",o.ja),he(u,"TYPE","xmlhttp"),ss(o,u),o.m&&o.o&&Li(u,o.m,o.o),o.L&&(o.g.I=o.L);var h=o.g;o=o.ia,h.L=1,h.v=nr(ut(u)),h.m=null,h.P=!0,Fa(h,o)}s.Za=function(){this.C!=null&&(this.C=null,or(this),Vi(this),$e(19))};function cr(o){o.C!=null&&(c.clearTimeout(o.C),o.C=null)}function pc(o,u){var h=null;if(o.g==u){cr(o),Bi(o),o.g=null;var g=2}else if(Pi(o.h,u))h=u.D,Ha(o.h,u),g=1;else return;if(o.G!=0){if(u.o)if(g==1){h=u.m?u.m.length:0,u=Date.now()-u.F;var A=o.B;g=Ys(),Oe(g,new Ba(g,h)),ar(o)}else hc(o);else if(A=u.s,A==3||A==0&&0<u.X||!(g==1&&Yh(o,u)||g==2&&Vi(o)))switch(h&&0<h.length&&(u=o.h,u.i=u.i.concat(h)),A){case 1:Kt(o,5);break;case 4:Kt(o,10);break;case 3:Kt(o,6);break;default:Kt(o,2)}}}function mc(o,u){let h=o.Ta+Math.floor(Math.random()*o.cb);return o.isActive()||(h*=2),h*u}function Kt(o,u){if(o.j.info("Error code "+u),u==2){var h=_(o.fb,o),g=o.Xa;const A=!g;g=new Ht(g||"//www.google.com/images/cleardot.gif"),c.location&&c.location.protocol=="http"||er(g,"https"),nr(g),A?qh(g.toString(),h):zh(g.toString(),h)}else $e(2);o.G=0,o.l&&o.l.sa(u),gc(o),lc(o)}s.fb=function(o){o?(this.j.info("Successfully pinged google.com"),$e(2)):(this.j.info("Failed to ping google.com"),$e(1))};function gc(o){if(o.G=0,o.ka=[],o.l){const u=Ka(o.h);(u.length!=0||o.i.length!=0)&&(D(o.ka,u),D(o.ka,o.i),o.h.i.length=0,N(o.i),o.i.length=0),o.l.ra()}}function yc(o,u,h){var g=h instanceof Ht?ut(h):new Ht(h);if(g.g!="")u&&(g.g=u+"."+g.g),tr(g,g.s);else{var A=c.location;g=A.protocol,u=u?u+"."+A.hostname:A.hostname,A=+A.port;var L=new Ht(null);g&&er(L,g),u&&(L.g=u),A&&tr(L,A),h&&(L.l=h),g=L}return h=o.D,u=o.ya,h&&u&&he(g,h,u),he(g,"VER",o.la),ss(o,g),g}function _c(o,u,h){if(u&&!o.J)throw Error("Can't create secondary domain capable XhrIo object.");return u=o.Ca&&!o.pa?new me(new sr({eb:h})):new me(o.pa),u.Ha(o.J),u}s.isActive=function(){return!!this.l&&this.l.isActive(this)};function vc(){}s=vc.prototype,s.ua=function(){},s.ta=function(){},s.sa=function(){},s.ra=function(){},s.isActive=function(){return!0},s.Na=function(){};function lr(){}lr.prototype.g=function(o,u){return new We(o,u)};function We(o,u){Pe.call(this),this.g=new cc(u),this.l=o,this.h=u&&u.messageUrlParams||null,o=u&&u.messageHeaders||null,u&&u.clientProtocolHeaderRequired&&(o?o["X-Client-Protocol"]="webchannel":o={"X-Client-Protocol":"webchannel"}),this.g.o=o,o=u&&u.initMessageHeaders||null,u&&u.messageContentType&&(o?o["X-WebChannel-Content-Type"]=u.messageContentType:o={"X-WebChannel-Content-Type":u.messageContentType}),u&&u.va&&(o?o["X-WebChannel-Client-Profile"]=u.va:o={"X-WebChannel-Client-Profile":u.va}),this.g.S=o,(o=u&&u.Sb)&&!O(o)&&(this.g.m=o),this.v=u&&u.supportsCrossDomainXhr||!1,this.u=u&&u.sendRawJson||!1,(u=u&&u.httpSessionIdParam)&&!O(u)&&(this.g.D=u,o=this.h,o!==null&&u in o&&(o=this.h,u in o&&delete o[u])),this.j=new pn(this)}R(We,Pe),We.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},We.prototype.close=function(){xi(this.g)},We.prototype.o=function(o){var u=this.g;if(typeof o=="string"){var h={};h.__data__=o,o=h}else this.u&&(h={},h.__data__=Ei(o),o=h);u.i.push(new Lh(u.Ya++,o)),u.G==3&&ar(u)},We.prototype.N=function(){this.g.l=null,delete this.j,xi(this.g),delete this.g,We.aa.N.call(this)};function bc(o){Ii.call(this),o.__headers__&&(this.headers=o.__headers__,this.statusCode=o.__status__,delete o.__headers__,delete o.__status__);var u=o.__sm__;if(u){e:{for(const h in u){o=h;break e}o=void 0}(this.i=o)&&(o=this.i,u=u!==null&&o in u?u[o]:void 0),this.data=u}else this.data=o}R(bc,Ii);function wc(){Si.call(this),this.status=1}R(wc,Si);function pn(o){this.g=o}R(pn,vc),pn.prototype.ua=function(){Oe(this.g,"a")},pn.prototype.ta=function(o){Oe(this.g,new bc(o))},pn.prototype.sa=function(o){Oe(this.g,new wc)},pn.prototype.ra=function(){Oe(this.g,"b")},lr.prototype.createWebChannel=lr.prototype.g,We.prototype.send=We.prototype.o,We.prototype.open=We.prototype.m,We.prototype.close=We.prototype.close,gu=function(){return new lr},mu=function(){return Ys()},pu=zt,io={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Js.NO_ERROR=0,Js.TIMEOUT=8,Js.HTTP_ERROR=6,vr=Js,Ma.COMPLETE="complete",fu=Ma,Na.EventType=Hn,Hn.OPEN="a",Hn.CLOSE="b",Hn.ERROR="c",Hn.MESSAGE="d",Pe.prototype.listen=Pe.prototype.K,cs=Na,me.prototype.listenOnce=me.prototype.L,me.prototype.getLastError=me.prototype.Ka,me.prototype.getLastErrorCode=me.prototype.Ba,me.prototype.getStatus=me.prototype.Z,me.prototype.getResponseJson=me.prototype.Oa,me.prototype.getResponseText=me.prototype.oa,me.prototype.send=me.prototype.ea,me.prototype.setWithCredentials=me.prototype.Ha,hu=me}).apply(typeof dr<"u"?dr:typeof self<"u"?self:typeof window<"u"?window:{});const xc="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ve{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Ve.UNAUTHENTICATED=new Ve(null),Ve.GOOGLE_CREDENTIALS=new Ve("google-credentials-uid"),Ve.FIRST_PARTY=new Ve("first-party-uid"),Ve.MOCK_USER=new Ve("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Bn="10.14.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nn=new Ao("@firebase/firestore");function rs(){return nn.logLevel}function j(s,...e){if(nn.logLevel<=se.DEBUG){const t=e.map(Do);nn.debug(`Firestore (${Bn}): ${s}`,...t)}}function _t(s,...e){if(nn.logLevel<=se.ERROR){const t=e.map(Do);nn.error(`Firestore (${Bn}): ${s}`,...t)}}function kn(s,...e){if(nn.logLevel<=se.WARN){const t=e.map(Do);nn.warn(`Firestore (${Bn}): ${s}`,...t)}}function Do(s){if(typeof s=="string")return s;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(t){return JSON.stringify(t)}(s)}catch{return s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Y(s="Unexpected state"){const e=`FIRESTORE (${Bn}) INTERNAL ASSERTION FAILED: `+s;throw _t(e),new Error(e)}function ce(s,e){s||Y()}function Z(s,e){return s}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const B={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class U extends wt{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bt{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yu{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class xp{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(Ve.UNAUTHENTICATED))}shutdown(){}}class Vp{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class Bp{constructor(e){this.t=e,this.currentUser=Ve.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){ce(this.o===void 0);let n=this.i;const r=l=>this.i!==n?(n=this.i,t(l)):Promise.resolve();let i=new Bt;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new Bt,e.enqueueRetryable(()=>r(this.currentUser))};const a=()=>{const l=i;e.enqueueRetryable(async()=>{await l.promise,await r(this.currentUser)})},c=l=>{j("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=l,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit(l=>c(l)),setTimeout(()=>{if(!this.auth){const l=this.t.getImmediate({optional:!0});l?c(l):(j("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new Bt)}},0),a()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(n=>this.i!==e?(j("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):n?(ce(typeof n.accessToken=="string"),new yu(n.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return ce(e===null||typeof e=="string"),new Ve(e)}}class Mp{constructor(e,t,n){this.l=e,this.h=t,this.P=n,this.type="FirstParty",this.user=Ve.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class Op{constructor(e,t,n){this.l=e,this.h=t,this.P=n}getToken(){return Promise.resolve(new Mp(this.l,this.h,this.P))}start(e,t){e.enqueueRetryable(()=>t(Ve.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class $p{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Fp{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,t){ce(this.o===void 0);const n=i=>{i.error!=null&&j("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const a=i.token!==this.R;return this.R=i.token,j("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?t(i.token):Promise.resolve()};this.o=i=>{e.enqueueRetryable(()=>n(i))};const r=i=>{j("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(i=>r(i)),setTimeout(()=>{if(!this.appCheck){const i=this.A.getImmediate({optional:!0});i?r(i):j("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(ce(typeof t.token=="string"),this.R=t.token,new $p(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Up(s){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(s);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let n=0;n<s;n++)t[n]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _u{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length;let n="";for(;n.length<20;){const r=Up(40);for(let i=0;i<r.length;++i)n.length<20&&r[i]<t&&(n+=e.charAt(r[i]%e.length))}return n}}function oe(s,e){return s<e?-1:s>e?1:0}function An(s,e,t){return s.length===e.length&&s.every((n,r)=>t(n,e[r]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ee{constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new U(B.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new U(B.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800)throw new U(B.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new U(B.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return Ee.fromMillis(Date.now())}static fromDate(e){return Ee.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),n=Math.floor(1e6*(e-1e3*t));return new Ee(t,n)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?oe(this.nanoseconds,e.nanoseconds):oe(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class X{constructor(e){this.timestamp=e}static fromTimestamp(e){return new X(e)}static min(){return new X(new Ee(0,0))}static max(){return new X(new Ee(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vs{constructor(e,t,n){t===void 0?t=0:t>e.length&&Y(),n===void 0?n=e.length-t:n>e.length-t&&Y(),this.segments=e,this.offset=t,this.len=n}get length(){return this.len}isEqual(e){return vs.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof vs?e.forEach(n=>{t.push(n)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,n=this.limit();t<n;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const n=Math.min(e.length,t.length);for(let r=0;r<n;r++){const i=e.get(r),a=t.get(r);if(i<a)return-1;if(i>a)return 1}return e.length<t.length?-1:e.length>t.length?1:0}}class fe extends vs{construct(e,t,n){return new fe(e,t,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const n of e){if(n.indexOf("//")>=0)throw new U(B.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);t.push(...n.split("/").filter(r=>r.length>0))}return new fe(t)}static emptyPath(){return new fe([])}}const jp=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Ae extends vs{construct(e,t,n){return new Ae(e,t,n)}static isValidIdentifier(e){return jp.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Ae.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new Ae(["__name__"])}static fromServerFormat(e){const t=[];let n="",r=0;const i=()=>{if(n.length===0)throw new U(B.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(n),n=""};let a=!1;for(;r<e.length;){const c=e[r];if(c==="\\"){if(r+1===e.length)throw new U(B.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const l=e[r+1];if(l!=="\\"&&l!=="."&&l!=="`")throw new U(B.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);n+=l,r+=2}else c==="`"?(a=!a,r++):c!=="."||a?(n+=c,r++):(i(),r++)}if(i(),a)throw new U(B.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Ae(t)}static emptyPath(){return new Ae([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class K{constructor(e){this.path=e}static fromPath(e){return new K(fe.fromString(e))}static fromName(e){return new K(fe.fromString(e).popFirst(5))}static empty(){return new K(fe.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&fe.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return fe.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new K(new fe(e.slice()))}}function qp(s,e){const t=s.toTimestamp().seconds,n=s.toTimestamp().nanoseconds+1,r=X.fromTimestamp(n===1e9?new Ee(t+1,0):new Ee(t,n));return new Ot(r,K.empty(),e)}function zp(s){return new Ot(s.readTime,s.key,-1)}class Ot{constructor(e,t,n){this.readTime=e,this.documentKey=t,this.largestBatchId=n}static min(){return new Ot(X.min(),K.empty(),-1)}static max(){return new Ot(X.max(),K.empty(),-1)}}function Wp(s,e){let t=s.readTime.compareTo(e.readTime);return t!==0?t:(t=K.comparator(s.documentKey,e.documentKey),t!==0?t:oe(s.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hp="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class Kp{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ls(s){if(s.code!==B.FAILED_PRECONDITION||s.message!==Hp)throw s;j("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class M{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&Y(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new M((n,r)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(n,r)},this.catchCallback=i=>{this.wrapFailure(t,i).next(n,r)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof M?t:M.resolve(t)}catch(t){return M.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):M.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):M.reject(t)}static resolve(e){return new M((t,n)=>{t(e)})}static reject(e){return new M((t,n)=>{n(e)})}static waitFor(e){return new M((t,n)=>{let r=0,i=0,a=!1;e.forEach(c=>{++r,c.next(()=>{++i,a&&i===r&&t()},l=>n(l))}),a=!0,i===r&&t()})}static or(e){let t=M.resolve(!1);for(const n of e)t=t.next(r=>r?M.resolve(r):n());return t}static forEach(e,t){const n=[];return e.forEach((r,i)=>{n.push(t.call(this,r,i))}),this.waitFor(n)}static mapArray(e,t){return new M((n,r)=>{const i=e.length,a=new Array(i);let c=0;for(let l=0;l<i;l++){const d=l;t(e[d]).next(f=>{a[d]=f,++c,c===i&&n(a)},f=>r(f))}})}static doWhile(e,t){return new M((n,r)=>{const i=()=>{e()===!0?t().next(()=>{i()},r):n()};i()})}}function Gp(s){const e=s.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function xs(s){return s.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Po{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=n=>this.ie(n),this.se=n=>t.writeSequenceNumber(n))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}Po.oe=-1;function Qr(s){return s==null}function Pr(s){return s===0&&1/s==-1/0}function Qp(s){return typeof s=="number"&&Number.isInteger(s)&&!Pr(s)&&s<=Number.MAX_SAFE_INTEGER&&s>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vc(s){let e=0;for(const t in s)Object.prototype.hasOwnProperty.call(s,t)&&e++;return e}function Mn(s,e){for(const t in s)Object.prototype.hasOwnProperty.call(s,t)&&e(t,s[t])}function vu(s){for(const e in s)if(Object.prototype.hasOwnProperty.call(s,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pe{constructor(e,t){this.comparator=e,this.root=t||ke.EMPTY}insert(e,t){return new pe(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,ke.BLACK,null,null))}remove(e){return new pe(this.comparator,this.root.remove(e,this.comparator).copy(null,null,ke.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const n=this.comparator(e,t.key);if(n===0)return t.value;n<0?t=t.left:n>0&&(t=t.right)}return null}indexOf(e){let t=0,n=this.root;for(;!n.isEmpty();){const r=this.comparator(e,n.key);if(r===0)return t+n.left.size;r<0?n=n.left:(t+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,n)=>(e(t,n),!1))}toString(){const e=[];return this.inorderTraversal((t,n)=>(e.push(`${t}:${n}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new hr(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new hr(this.root,e,this.comparator,!1)}getReverseIterator(){return new hr(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new hr(this.root,e,this.comparator,!0)}}class hr{constructor(e,t,n,r){this.isReverse=r,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?n(e.key,t):1,t&&r&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class ke{constructor(e,t,n,r,i){this.key=e,this.value=t,this.color=n??ke.RED,this.left=r??ke.EMPTY,this.right=i??ke.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,n,r,i){return new ke(e??this.key,t??this.value,n??this.color,r??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let r=this;const i=n(e,r.key);return r=i<0?r.copy(null,null,null,r.left.insert(e,t,n),null):i===0?r.copy(null,t,null,null,null):r.copy(null,null,null,null,r.right.insert(e,t,n)),r.fixUp()}removeMin(){if(this.left.isEmpty())return ke.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let n,r=this;if(t(e,r.key)<0)r.left.isEmpty()||r.left.isRed()||r.left.left.isRed()||(r=r.moveRedLeft()),r=r.copy(null,null,null,r.left.remove(e,t),null);else{if(r.left.isRed()&&(r=r.rotateRight()),r.right.isEmpty()||r.right.isRed()||r.right.left.isRed()||(r=r.moveRedRight()),t(e,r.key)===0){if(r.right.isEmpty())return ke.EMPTY;n=r.right.min(),r=r.copy(n.key,n.value,null,null,r.right.removeMin())}r=r.copy(null,null,null,null,r.right.remove(e,t))}return r.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,ke.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,ke.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw Y();const e=this.left.check();if(e!==this.right.check())throw Y();return e+(this.isRed()?0:1)}}ke.EMPTY=null,ke.RED=!0,ke.BLACK=!1;ke.EMPTY=new class{constructor(){this.size=0}get key(){throw Y()}get value(){throw Y()}get color(){throw Y()}get left(){throw Y()}get right(){throw Y()}copy(e,t,n,r,i){return this}insert(e,t,n){return new ke(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Re{constructor(e){this.comparator=e,this.data=new pe(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,n)=>(e(t),!1))}forEachInRange(e,t){const n=this.data.getIteratorFrom(e[0]);for(;n.hasNext();){const r=n.getNext();if(this.comparator(r.key,e[1])>=0)return;t(r.key)}}forEachWhile(e,t){let n;for(n=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();n.hasNext();)if(!e(n.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Bc(this.data.getIterator())}getIteratorFrom(e){return new Bc(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(n=>{t=t.add(n)}),t}isEqual(e){if(!(e instanceof Re)||this.size!==e.size)return!1;const t=this.data.getIterator(),n=e.data.getIterator();for(;t.hasNext();){const r=t.getNext().key,i=n.getNext().key;if(this.comparator(r,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new Re(this.comparator);return t.data=e,t}}class Bc{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tt{constructor(e){this.fields=e,e.sort(Ae.comparator)}static empty(){return new tt([])}unionWith(e){let t=new Re(Ae.comparator);for(const n of this.fields)t=t.add(n);for(const n of e)t=t.add(n);return new tt(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return An(this.fields,e.fields,(t,n)=>t.isEqual(n))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bu extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ce{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(r){try{return atob(r)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new bu("Invalid base64 string: "+i):i}}(e);return new Ce(t)}static fromUint8Array(e){const t=function(r){let i="";for(let a=0;a<r.length;++a)i+=String.fromCharCode(r[a]);return i}(e);return new Ce(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const n=new Uint8Array(t.length);for(let r=0;r<t.length;r++)n[r]=t.charCodeAt(r);return n}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return oe(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Ce.EMPTY_BYTE_STRING=new Ce("");const Yp=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function $t(s){if(ce(!!s),typeof s=="string"){let e=0;const t=Yp.exec(s);if(ce(!!t),t[1]){let r=t[1];r=(r+"000000000").substr(0,9),e=Number(r)}const n=new Date(s);return{seconds:Math.floor(n.getTime()/1e3),nanos:e}}return{seconds:ge(s.seconds),nanos:ge(s.nanos)}}function ge(s){return typeof s=="number"?s:typeof s=="string"?Number(s):0}function sn(s){return typeof s=="string"?Ce.fromBase64String(s):Ce.fromUint8Array(s)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function No(s){var e,t;return((t=(((e=s?.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="server_timestamp"}function Lo(s){const e=s.mapValue.fields.__previous_value__;return No(e)?Lo(e):e}function bs(s){const e=$t(s.mapValue.fields.__local_write_time__.timestampValue);return new Ee(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jp{constructor(e,t,n,r,i,a,c,l,d){this.databaseId=e,this.appId=t,this.persistenceKey=n,this.host=r,this.ssl=i,this.forceLongPolling=a,this.autoDetectLongPolling=c,this.longPollingOptions=l,this.useFetchStreams=d}}class ws{constructor(e,t){this.projectId=e,this.database=t||"(default)"}static empty(){return new ws("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof ws&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fr={mapValue:{}};function rn(s){return"nullValue"in s?0:"booleanValue"in s?1:"integerValue"in s||"doubleValue"in s?2:"timestampValue"in s?3:"stringValue"in s?5:"bytesValue"in s?6:"referenceValue"in s?7:"geoPointValue"in s?8:"arrayValue"in s?9:"mapValue"in s?No(s)?4:Zp(s)?9007199254740991:Xp(s)?10:11:Y()}function lt(s,e){if(s===e)return!0;const t=rn(s);if(t!==rn(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return s.booleanValue===e.booleanValue;case 4:return bs(s).isEqual(bs(e));case 3:return function(r,i){if(typeof r.timestampValue=="string"&&typeof i.timestampValue=="string"&&r.timestampValue.length===i.timestampValue.length)return r.timestampValue===i.timestampValue;const a=$t(r.timestampValue),c=$t(i.timestampValue);return a.seconds===c.seconds&&a.nanos===c.nanos}(s,e);case 5:return s.stringValue===e.stringValue;case 6:return function(r,i){return sn(r.bytesValue).isEqual(sn(i.bytesValue))}(s,e);case 7:return s.referenceValue===e.referenceValue;case 8:return function(r,i){return ge(r.geoPointValue.latitude)===ge(i.geoPointValue.latitude)&&ge(r.geoPointValue.longitude)===ge(i.geoPointValue.longitude)}(s,e);case 2:return function(r,i){if("integerValue"in r&&"integerValue"in i)return ge(r.integerValue)===ge(i.integerValue);if("doubleValue"in r&&"doubleValue"in i){const a=ge(r.doubleValue),c=ge(i.doubleValue);return a===c?Pr(a)===Pr(c):isNaN(a)&&isNaN(c)}return!1}(s,e);case 9:return An(s.arrayValue.values||[],e.arrayValue.values||[],lt);case 10:case 11:return function(r,i){const a=r.mapValue.fields||{},c=i.mapValue.fields||{};if(Vc(a)!==Vc(c))return!1;for(const l in a)if(a.hasOwnProperty(l)&&(c[l]===void 0||!lt(a[l],c[l])))return!1;return!0}(s,e);default:return Y()}}function Es(s,e){return(s.values||[]).find(t=>lt(t,e))!==void 0}function Rn(s,e){if(s===e)return 0;const t=rn(s),n=rn(e);if(t!==n)return oe(t,n);switch(t){case 0:case 9007199254740991:return 0;case 1:return oe(s.booleanValue,e.booleanValue);case 2:return function(i,a){const c=ge(i.integerValue||i.doubleValue),l=ge(a.integerValue||a.doubleValue);return c<l?-1:c>l?1:c===l?0:isNaN(c)?isNaN(l)?0:-1:1}(s,e);case 3:return Mc(s.timestampValue,e.timestampValue);case 4:return Mc(bs(s),bs(e));case 5:return oe(s.stringValue,e.stringValue);case 6:return function(i,a){const c=sn(i),l=sn(a);return c.compareTo(l)}(s.bytesValue,e.bytesValue);case 7:return function(i,a){const c=i.split("/"),l=a.split("/");for(let d=0;d<c.length&&d<l.length;d++){const f=oe(c[d],l[d]);if(f!==0)return f}return oe(c.length,l.length)}(s.referenceValue,e.referenceValue);case 8:return function(i,a){const c=oe(ge(i.latitude),ge(a.latitude));return c!==0?c:oe(ge(i.longitude),ge(a.longitude))}(s.geoPointValue,e.geoPointValue);case 9:return Oc(s.arrayValue,e.arrayValue);case 10:return function(i,a){var c,l,d,f;const m=i.fields||{},_=a.fields||{},T=(c=m.value)===null||c===void 0?void 0:c.arrayValue,R=(l=_.value)===null||l===void 0?void 0:l.arrayValue,N=oe(((d=T?.values)===null||d===void 0?void 0:d.length)||0,((f=R?.values)===null||f===void 0?void 0:f.length)||0);return N!==0?N:Oc(T,R)}(s.mapValue,e.mapValue);case 11:return function(i,a){if(i===fr.mapValue&&a===fr.mapValue)return 0;if(i===fr.mapValue)return 1;if(a===fr.mapValue)return-1;const c=i.fields||{},l=Object.keys(c),d=a.fields||{},f=Object.keys(d);l.sort(),f.sort();for(let m=0;m<l.length&&m<f.length;++m){const _=oe(l[m],f[m]);if(_!==0)return _;const T=Rn(c[l[m]],d[f[m]]);if(T!==0)return T}return oe(l.length,f.length)}(s.mapValue,e.mapValue);default:throw Y()}}function Mc(s,e){if(typeof s=="string"&&typeof e=="string"&&s.length===e.length)return oe(s,e);const t=$t(s),n=$t(e),r=oe(t.seconds,n.seconds);return r!==0?r:oe(t.nanos,n.nanos)}function Oc(s,e){const t=s.values||[],n=e.values||[];for(let r=0;r<t.length&&r<n.length;++r){const i=Rn(t[r],n[r]);if(i)return i}return oe(t.length,n.length)}function Cn(s){return oo(s)}function oo(s){return"nullValue"in s?"null":"booleanValue"in s?""+s.booleanValue:"integerValue"in s?""+s.integerValue:"doubleValue"in s?""+s.doubleValue:"timestampValue"in s?function(t){const n=$t(t);return`time(${n.seconds},${n.nanos})`}(s.timestampValue):"stringValue"in s?s.stringValue:"bytesValue"in s?function(t){return sn(t).toBase64()}(s.bytesValue):"referenceValue"in s?function(t){return K.fromName(t).toString()}(s.referenceValue):"geoPointValue"in s?function(t){return`geo(${t.latitude},${t.longitude})`}(s.geoPointValue):"arrayValue"in s?function(t){let n="[",r=!0;for(const i of t.values||[])r?r=!1:n+=",",n+=oo(i);return n+"]"}(s.arrayValue):"mapValue"in s?function(t){const n=Object.keys(t.fields||{}).sort();let r="{",i=!0;for(const a of n)i?i=!1:r+=",",r+=`${a}:${oo(t.fields[a])}`;return r+"}"}(s.mapValue):Y()}function $c(s,e){return{referenceValue:`projects/${s.projectId}/databases/${s.database}/documents/${e.path.canonicalString()}`}}function ao(s){return!!s&&"integerValue"in s}function xo(s){return!!s&&"arrayValue"in s}function Fc(s){return!!s&&"nullValue"in s}function Uc(s){return!!s&&"doubleValue"in s&&isNaN(Number(s.doubleValue))}function br(s){return!!s&&"mapValue"in s}function Xp(s){var e,t;return((t=(((e=s?.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="__vector__"}function ds(s){if(s.geoPointValue)return{geoPointValue:Object.assign({},s.geoPointValue)};if(s.timestampValue&&typeof s.timestampValue=="object")return{timestampValue:Object.assign({},s.timestampValue)};if(s.mapValue){const e={mapValue:{fields:{}}};return Mn(s.mapValue.fields,(t,n)=>e.mapValue.fields[t]=ds(n)),e}if(s.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(s.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=ds(s.arrayValue.values[t]);return e}return Object.assign({},s)}function Zp(s){return(((s.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ge{constructor(e){this.value=e}static empty(){return new Ge({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let n=0;n<e.length-1;++n)if(t=(t.mapValue.fields||{})[e.get(n)],!br(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=ds(t)}setAll(e){let t=Ae.emptyPath(),n={},r=[];e.forEach((a,c)=>{if(!t.isImmediateParentOf(c)){const l=this.getFieldsMap(t);this.applyChanges(l,n,r),n={},r=[],t=c.popLast()}a?n[c.lastSegment()]=ds(a):r.push(c.lastSegment())});const i=this.getFieldsMap(t);this.applyChanges(i,n,r)}delete(e){const t=this.field(e.popLast());br(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return lt(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let n=0;n<e.length;++n){let r=t.mapValue.fields[e.get(n)];br(r)&&r.mapValue.fields||(r={mapValue:{fields:{}}},t.mapValue.fields[e.get(n)]=r),t=r}return t.mapValue.fields}applyChanges(e,t,n){Mn(t,(r,i)=>e[r]=i);for(const r of n)delete e[r]}clone(){return new Ge(ds(this.value))}}function wu(s){const e=[];return Mn(s.fields,(t,n)=>{const r=new Ae([t]);if(br(n)){const i=wu(n.mapValue).fields;if(i.length===0)e.push(r);else for(const a of i)e.push(r.child(a))}else e.push(r)}),new tt(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Be{constructor(e,t,n,r,i,a,c){this.key=e,this.documentType=t,this.version=n,this.readTime=r,this.createTime=i,this.data=a,this.documentState=c}static newInvalidDocument(e){return new Be(e,0,X.min(),X.min(),X.min(),Ge.empty(),0)}static newFoundDocument(e,t,n,r){return new Be(e,1,t,X.min(),n,r,0)}static newNoDocument(e,t){return new Be(e,2,t,X.min(),X.min(),Ge.empty(),0)}static newUnknownDocument(e,t){return new Be(e,3,t,X.min(),X.min(),Ge.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(X.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Ge.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Ge.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=X.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Be&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Be(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nr{constructor(e,t){this.position=e,this.inclusive=t}}function jc(s,e,t){let n=0;for(let r=0;r<s.position.length;r++){const i=e[r],a=s.position[r];if(i.field.isKeyField()?n=K.comparator(K.fromName(a.referenceValue),t.key):n=Rn(a,t.data.field(i.field)),i.dir==="desc"&&(n*=-1),n!==0)break}return n}function qc(s,e){if(s===null)return e===null;if(e===null||s.inclusive!==e.inclusive||s.position.length!==e.position.length)return!1;for(let t=0;t<s.position.length;t++)if(!lt(s.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ts{constructor(e,t="asc"){this.field=e,this.dir=t}}function em(s,e){return s.dir===e.dir&&s.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Eu{}class _e extends Eu{constructor(e,t,n){super(),this.field=e,this.op=t,this.value=n}static create(e,t,n){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,n):new nm(e,t,n):t==="array-contains"?new im(e,n):t==="in"?new om(e,n):t==="not-in"?new am(e,n):t==="array-contains-any"?new cm(e,n):new _e(e,t,n)}static createKeyFieldInFilter(e,t,n){return t==="in"?new sm(e,n):new rm(e,n)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&this.matchesComparison(Rn(t,this.value)):t!==null&&rn(this.value)===rn(t)&&this.matchesComparison(Rn(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return Y()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class st extends Eu{constructor(e,t){super(),this.filters=e,this.op=t,this.ae=null}static create(e,t){return new st(e,t)}matches(e){return Tu(this)?this.filters.find(t=>!t.matches(e))===void 0:this.filters.find(t=>t.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function Tu(s){return s.op==="and"}function Iu(s){return tm(s)&&Tu(s)}function tm(s){for(const e of s.filters)if(e instanceof st)return!1;return!0}function co(s){if(s instanceof _e)return s.field.canonicalString()+s.op.toString()+Cn(s.value);if(Iu(s))return s.filters.map(e=>co(e)).join(",");{const e=s.filters.map(t=>co(t)).join(",");return`${s.op}(${e})`}}function Su(s,e){return s instanceof _e?function(n,r){return r instanceof _e&&n.op===r.op&&n.field.isEqual(r.field)&&lt(n.value,r.value)}(s,e):s instanceof st?function(n,r){return r instanceof st&&n.op===r.op&&n.filters.length===r.filters.length?n.filters.reduce((i,a,c)=>i&&Su(a,r.filters[c]),!0):!1}(s,e):void Y()}function ku(s){return s instanceof _e?function(t){return`${t.field.canonicalString()} ${t.op} ${Cn(t.value)}`}(s):s instanceof st?function(t){return t.op.toString()+" {"+t.getFilters().map(ku).join(" ,")+"}"}(s):"Filter"}class nm extends _e{constructor(e,t,n){super(e,t,n),this.key=K.fromName(n.referenceValue)}matches(e){const t=K.comparator(e.key,this.key);return this.matchesComparison(t)}}class sm extends _e{constructor(e,t){super(e,"in",t),this.keys=Au("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class rm extends _e{constructor(e,t){super(e,"not-in",t),this.keys=Au("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function Au(s,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map(n=>K.fromName(n.referenceValue))}class im extends _e{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return xo(t)&&Es(t.arrayValue,this.value)}}class om extends _e{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&Es(this.value.arrayValue,t)}}class am extends _e{constructor(e,t){super(e,"not-in",t)}matches(e){if(Es(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&!Es(this.value.arrayValue,t)}}class cm extends _e{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!xo(t)||!t.arrayValue.values)&&t.arrayValue.values.some(n=>Es(this.value.arrayValue,n))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lm{constructor(e,t=null,n=[],r=[],i=null,a=null,c=null){this.path=e,this.collectionGroup=t,this.orderBy=n,this.filters=r,this.limit=i,this.startAt=a,this.endAt=c,this.ue=null}}function zc(s,e=null,t=[],n=[],r=null,i=null,a=null){return new lm(s,e,t,n,r,i,a)}function Vo(s){const e=Z(s);if(e.ue===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(n=>co(n)).join(","),t+="|ob:",t+=e.orderBy.map(n=>function(i){return i.field.canonicalString()+i.dir}(n)).join(","),Qr(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(n=>Cn(n)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(n=>Cn(n)).join(",")),e.ue=t}return e.ue}function Bo(s,e){if(s.limit!==e.limit||s.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<s.orderBy.length;t++)if(!em(s.orderBy[t],e.orderBy[t]))return!1;if(s.filters.length!==e.filters.length)return!1;for(let t=0;t<s.filters.length;t++)if(!Su(s.filters[t],e.filters[t]))return!1;return s.collectionGroup===e.collectionGroup&&!!s.path.isEqual(e.path)&&!!qc(s.startAt,e.startAt)&&qc(s.endAt,e.endAt)}function lo(s){return K.isDocumentKey(s.path)&&s.collectionGroup===null&&s.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class On{constructor(e,t=null,n=[],r=[],i=null,a="F",c=null,l=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=n,this.filters=r,this.limit=i,this.limitType=a,this.startAt=c,this.endAt=l,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function um(s,e,t,n,r,i,a,c){return new On(s,e,t,n,r,i,a,c)}function Ru(s){return new On(s)}function Wc(s){return s.filters.length===0&&s.limit===null&&s.startAt==null&&s.endAt==null&&(s.explicitOrderBy.length===0||s.explicitOrderBy.length===1&&s.explicitOrderBy[0].field.isKeyField())}function Cu(s){return s.collectionGroup!==null}function hs(s){const e=Z(s);if(e.ce===null){e.ce=[];const t=new Set;for(const i of e.explicitOrderBy)e.ce.push(i),t.add(i.field.canonicalString());const n=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(a){let c=new Re(Ae.comparator);return a.filters.forEach(l=>{l.getFlattenedFilters().forEach(d=>{d.isInequality()&&(c=c.add(d.field))})}),c})(e).forEach(i=>{t.has(i.canonicalString())||i.isKeyField()||e.ce.push(new Ts(i,n))}),t.has(Ae.keyField().canonicalString())||e.ce.push(new Ts(Ae.keyField(),n))}return e.ce}function it(s){const e=Z(s);return e.le||(e.le=dm(e,hs(s))),e.le}function dm(s,e){if(s.limitType==="F")return zc(s.path,s.collectionGroup,e,s.filters,s.limit,s.startAt,s.endAt);{e=e.map(r=>{const i=r.dir==="desc"?"asc":"desc";return new Ts(r.field,i)});const t=s.endAt?new Nr(s.endAt.position,s.endAt.inclusive):null,n=s.startAt?new Nr(s.startAt.position,s.startAt.inclusive):null;return zc(s.path,s.collectionGroup,e,s.filters,s.limit,t,n)}}function uo(s,e){const t=s.filters.concat([e]);return new On(s.path,s.collectionGroup,s.explicitOrderBy.slice(),t,s.limit,s.limitType,s.startAt,s.endAt)}function Lr(s,e,t){return new On(s.path,s.collectionGroup,s.explicitOrderBy.slice(),s.filters.slice(),e,t,s.startAt,s.endAt)}function Yr(s,e){return Bo(it(s),it(e))&&s.limitType===e.limitType}function Du(s){return`${Vo(it(s))}|lt:${s.limitType}`}function gn(s){return`Query(target=${function(t){let n=t.path.canonicalString();return t.collectionGroup!==null&&(n+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(n+=`, filters: [${t.filters.map(r=>ku(r)).join(", ")}]`),Qr(t.limit)||(n+=", limit: "+t.limit),t.orderBy.length>0&&(n+=`, orderBy: [${t.orderBy.map(r=>function(a){return`${a.field.canonicalString()} (${a.dir})`}(r)).join(", ")}]`),t.startAt&&(n+=", startAt: ",n+=t.startAt.inclusive?"b:":"a:",n+=t.startAt.position.map(r=>Cn(r)).join(",")),t.endAt&&(n+=", endAt: ",n+=t.endAt.inclusive?"a:":"b:",n+=t.endAt.position.map(r=>Cn(r)).join(",")),`Target(${n})`}(it(s))}; limitType=${s.limitType})`}function Jr(s,e){return e.isFoundDocument()&&function(n,r){const i=r.key.path;return n.collectionGroup!==null?r.key.hasCollectionId(n.collectionGroup)&&n.path.isPrefixOf(i):K.isDocumentKey(n.path)?n.path.isEqual(i):n.path.isImmediateParentOf(i)}(s,e)&&function(n,r){for(const i of hs(n))if(!i.field.isKeyField()&&r.data.field(i.field)===null)return!1;return!0}(s,e)&&function(n,r){for(const i of n.filters)if(!i.matches(r))return!1;return!0}(s,e)&&function(n,r){return!(n.startAt&&!function(a,c,l){const d=jc(a,c,l);return a.inclusive?d<=0:d<0}(n.startAt,hs(n),r)||n.endAt&&!function(a,c,l){const d=jc(a,c,l);return a.inclusive?d>=0:d>0}(n.endAt,hs(n),r))}(s,e)}function hm(s){return s.collectionGroup||(s.path.length%2==1?s.path.lastSegment():s.path.get(s.path.length-2))}function Pu(s){return(e,t)=>{let n=!1;for(const r of hs(s)){const i=fm(r,e,t);if(i!==0)return i;n=n||r.field.isKeyField()}return 0}}function fm(s,e,t){const n=s.field.isKeyField()?K.comparator(e.key,t.key):function(i,a,c){const l=a.data.field(i),d=c.data.field(i);return l!==null&&d!==null?Rn(l,d):Y()}(s.field,e,t);switch(s.dir){case"asc":return n;case"desc":return-1*n;default:return Y()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $n{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n!==void 0){for(const[r,i]of n)if(this.equalsFn(r,e))return i}}has(e){return this.get(e)!==void 0}set(e,t){const n=this.mapKeyFn(e),r=this.inner[n];if(r===void 0)return this.inner[n]=[[e,t]],void this.innerSize++;for(let i=0;i<r.length;i++)if(this.equalsFn(r[i][0],e))return void(r[i]=[e,t]);r.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n===void 0)return!1;for(let r=0;r<n.length;r++)if(this.equalsFn(n[r][0],e))return n.length===1?delete this.inner[t]:n.splice(r,1),this.innerSize--,!0;return!1}forEach(e){Mn(this.inner,(t,n)=>{for(const[r,i]of n)e(r,i)})}isEmpty(){return vu(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pm=new pe(K.comparator);function vt(){return pm}const Nu=new pe(K.comparator);function ls(...s){let e=Nu;for(const t of s)e=e.insert(t.key,t);return e}function Lu(s){let e=Nu;return s.forEach((t,n)=>e=e.insert(t,n.overlayedDocument)),e}function Qt(){return fs()}function xu(){return fs()}function fs(){return new $n(s=>s.toString(),(s,e)=>s.isEqual(e))}const mm=new pe(K.comparator),gm=new Re(K.comparator);function ne(...s){let e=gm;for(const t of s)e=e.add(t);return e}const ym=new Re(oe);function _m(){return ym}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mo(s,e){if(s.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Pr(e)?"-0":e}}function Vu(s){return{integerValue:""+s}}function vm(s,e){return Qp(e)?Vu(e):Mo(s,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xr{constructor(){this._=void 0}}function bm(s,e,t){return s instanceof Is?function(r,i){const a={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:r.seconds,nanos:r.nanoseconds}}}};return i&&No(i)&&(i=Lo(i)),i&&(a.fields.__previous_value__=i),{mapValue:a}}(t,e):s instanceof Ss?Mu(s,e):s instanceof ks?Ou(s,e):function(r,i){const a=Bu(r,i),c=Hc(a)+Hc(r.Pe);return ao(a)&&ao(r.Pe)?Vu(c):Mo(r.serializer,c)}(s,e)}function wm(s,e,t){return s instanceof Ss?Mu(s,e):s instanceof ks?Ou(s,e):t}function Bu(s,e){return s instanceof xr?function(n){return ao(n)||function(i){return!!i&&"doubleValue"in i}(n)}(e)?e:{integerValue:0}:null}class Is extends Xr{}class Ss extends Xr{constructor(e){super(),this.elements=e}}function Mu(s,e){const t=$u(e);for(const n of s.elements)t.some(r=>lt(r,n))||t.push(n);return{arrayValue:{values:t}}}class ks extends Xr{constructor(e){super(),this.elements=e}}function Ou(s,e){let t=$u(e);for(const n of s.elements)t=t.filter(r=>!lt(r,n));return{arrayValue:{values:t}}}class xr extends Xr{constructor(e,t){super(),this.serializer=e,this.Pe=t}}function Hc(s){return ge(s.integerValue||s.doubleValue)}function $u(s){return xo(s)&&s.arrayValue.values?s.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Em{constructor(e,t){this.field=e,this.transform=t}}function Tm(s,e){return s.field.isEqual(e.field)&&function(n,r){return n instanceof Ss&&r instanceof Ss||n instanceof ks&&r instanceof ks?An(n.elements,r.elements,lt):n instanceof xr&&r instanceof xr?lt(n.Pe,r.Pe):n instanceof Is&&r instanceof Is}(s.transform,e.transform)}class Im{constructor(e,t){this.version=e,this.transformResults=t}}class ot{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new ot}static exists(e){return new ot(void 0,e)}static updateTime(e){return new ot(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function wr(s,e){return s.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(s.updateTime):s.exists===void 0||s.exists===e.isFoundDocument()}class Zr{}function Fu(s,e){if(!s.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return s.isNoDocument()?new Oo(s.key,ot.none()):new Vs(s.key,s.data,ot.none());{const t=s.data,n=Ge.empty();let r=new Re(Ae.comparator);for(let i of e.fields)if(!r.has(i)){let a=t.field(i);a===null&&i.length>1&&(i=i.popLast(),a=t.field(i)),a===null?n.delete(i):n.set(i,a),r=r.add(i)}return new an(s.key,n,new tt(r.toArray()),ot.none())}}function Sm(s,e,t){s instanceof Vs?function(r,i,a){const c=r.value.clone(),l=Gc(r.fieldTransforms,i,a.transformResults);c.setAll(l),i.convertToFoundDocument(a.version,c).setHasCommittedMutations()}(s,e,t):s instanceof an?function(r,i,a){if(!wr(r.precondition,i))return void i.convertToUnknownDocument(a.version);const c=Gc(r.fieldTransforms,i,a.transformResults),l=i.data;l.setAll(Uu(r)),l.setAll(c),i.convertToFoundDocument(a.version,l).setHasCommittedMutations()}(s,e,t):function(r,i,a){i.convertToNoDocument(a.version).setHasCommittedMutations()}(0,e,t)}function ps(s,e,t,n){return s instanceof Vs?function(i,a,c,l){if(!wr(i.precondition,a))return c;const d=i.value.clone(),f=Qc(i.fieldTransforms,l,a);return d.setAll(f),a.convertToFoundDocument(a.version,d).setHasLocalMutations(),null}(s,e,t,n):s instanceof an?function(i,a,c,l){if(!wr(i.precondition,a))return c;const d=Qc(i.fieldTransforms,l,a),f=a.data;return f.setAll(Uu(i)),f.setAll(d),a.convertToFoundDocument(a.version,f).setHasLocalMutations(),c===null?null:c.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map(m=>m.field))}(s,e,t,n):function(i,a,c){return wr(i.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):c}(s,e,t)}function km(s,e){let t=null;for(const n of s.fieldTransforms){const r=e.data.field(n.field),i=Bu(n.transform,r||null);i!=null&&(t===null&&(t=Ge.empty()),t.set(n.field,i))}return t||null}function Kc(s,e){return s.type===e.type&&!!s.key.isEqual(e.key)&&!!s.precondition.isEqual(e.precondition)&&!!function(n,r){return n===void 0&&r===void 0||!(!n||!r)&&An(n,r,(i,a)=>Tm(i,a))}(s.fieldTransforms,e.fieldTransforms)&&(s.type===0?s.value.isEqual(e.value):s.type!==1||s.data.isEqual(e.data)&&s.fieldMask.isEqual(e.fieldMask))}class Vs extends Zr{constructor(e,t,n,r=[]){super(),this.key=e,this.value=t,this.precondition=n,this.fieldTransforms=r,this.type=0}getFieldMask(){return null}}class an extends Zr{constructor(e,t,n,r,i=[]){super(),this.key=e,this.data=t,this.fieldMask=n,this.precondition=r,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function Uu(s){const e=new Map;return s.fieldMask.fields.forEach(t=>{if(!t.isEmpty()){const n=s.data.field(t);e.set(t,n)}}),e}function Gc(s,e,t){const n=new Map;ce(s.length===t.length);for(let r=0;r<t.length;r++){const i=s[r],a=i.transform,c=e.data.field(i.field);n.set(i.field,wm(a,c,t[r]))}return n}function Qc(s,e,t){const n=new Map;for(const r of s){const i=r.transform,a=t.data.field(r.field);n.set(r.field,bm(i,a,e))}return n}class Oo extends Zr{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class Am extends Zr{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rm{constructor(e,t,n,r){this.batchId=e,this.localWriteTime=t,this.baseMutations=n,this.mutations=r}applyToRemoteDocument(e,t){const n=t.mutationResults;for(let r=0;r<this.mutations.length;r++){const i=this.mutations[r];i.key.isEqual(e.key)&&Sm(i,e,n[r])}}applyToLocalView(e,t){for(const n of this.baseMutations)n.key.isEqual(e.key)&&(t=ps(n,e,t,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(e.key)&&(t=ps(n,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const n=xu();return this.mutations.forEach(r=>{const i=e.get(r.key),a=i.overlayedDocument;let c=this.applyToLocalView(a,i.mutatedFields);c=t.has(r.key)?null:c;const l=Fu(a,c);l!==null&&n.set(r.key,l),a.isValidDocument()||a.convertToNoDocument(X.min())}),n}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),ne())}isEqual(e){return this.batchId===e.batchId&&An(this.mutations,e.mutations,(t,n)=>Kc(t,n))&&An(this.baseMutations,e.baseMutations,(t,n)=>Kc(t,n))}}class $o{constructor(e,t,n,r){this.batch=e,this.commitVersion=t,this.mutationResults=n,this.docVersions=r}static from(e,t,n){ce(e.mutations.length===n.length);let r=function(){return mm}();const i=e.mutations;for(let a=0;a<i.length;a++)r=r.insert(i[a].key,n[a].version);return new $o(e,t,n,r)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cm{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dm{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ye,re;function Pm(s){switch(s){default:return Y();case B.CANCELLED:case B.UNKNOWN:case B.DEADLINE_EXCEEDED:case B.RESOURCE_EXHAUSTED:case B.INTERNAL:case B.UNAVAILABLE:case B.UNAUTHENTICATED:return!1;case B.INVALID_ARGUMENT:case B.NOT_FOUND:case B.ALREADY_EXISTS:case B.PERMISSION_DENIED:case B.FAILED_PRECONDITION:case B.ABORTED:case B.OUT_OF_RANGE:case B.UNIMPLEMENTED:case B.DATA_LOSS:return!0}}function ju(s){if(s===void 0)return _t("GRPC error has no .code"),B.UNKNOWN;switch(s){case ye.OK:return B.OK;case ye.CANCELLED:return B.CANCELLED;case ye.UNKNOWN:return B.UNKNOWN;case ye.DEADLINE_EXCEEDED:return B.DEADLINE_EXCEEDED;case ye.RESOURCE_EXHAUSTED:return B.RESOURCE_EXHAUSTED;case ye.INTERNAL:return B.INTERNAL;case ye.UNAVAILABLE:return B.UNAVAILABLE;case ye.UNAUTHENTICATED:return B.UNAUTHENTICATED;case ye.INVALID_ARGUMENT:return B.INVALID_ARGUMENT;case ye.NOT_FOUND:return B.NOT_FOUND;case ye.ALREADY_EXISTS:return B.ALREADY_EXISTS;case ye.PERMISSION_DENIED:return B.PERMISSION_DENIED;case ye.FAILED_PRECONDITION:return B.FAILED_PRECONDITION;case ye.ABORTED:return B.ABORTED;case ye.OUT_OF_RANGE:return B.OUT_OF_RANGE;case ye.UNIMPLEMENTED:return B.UNIMPLEMENTED;case ye.DATA_LOSS:return B.DATA_LOSS;default:return Y()}}(re=ye||(ye={}))[re.OK=0]="OK",re[re.CANCELLED=1]="CANCELLED",re[re.UNKNOWN=2]="UNKNOWN",re[re.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",re[re.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",re[re.NOT_FOUND=5]="NOT_FOUND",re[re.ALREADY_EXISTS=6]="ALREADY_EXISTS",re[re.PERMISSION_DENIED=7]="PERMISSION_DENIED",re[re.UNAUTHENTICATED=16]="UNAUTHENTICATED",re[re.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",re[re.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",re[re.ABORTED=10]="ABORTED",re[re.OUT_OF_RANGE=11]="OUT_OF_RANGE",re[re.UNIMPLEMENTED=12]="UNIMPLEMENTED",re[re.INTERNAL=13]="INTERNAL",re[re.UNAVAILABLE=14]="UNAVAILABLE",re[re.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Nm(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lm=new Jt([4294967295,4294967295],0);function Yc(s){const e=Nm().encode(s),t=new du;return t.update(e),new Uint8Array(t.digest())}function Jc(s){const e=new DataView(s.buffer),t=e.getUint32(0,!0),n=e.getUint32(4,!0),r=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new Jt([t,n],0),new Jt([r,i],0)]}class Fo{constructor(e,t,n){if(this.bitmap=e,this.padding=t,this.hashCount=n,t<0||t>=8)throw new us(`Invalid padding: ${t}`);if(n<0)throw new us(`Invalid hash count: ${n}`);if(e.length>0&&this.hashCount===0)throw new us(`Invalid hash count: ${n}`);if(e.length===0&&t!==0)throw new us(`Invalid padding when bitmap length is 0: ${t}`);this.Ie=8*e.length-t,this.Te=Jt.fromNumber(this.Ie)}Ee(e,t,n){let r=e.add(t.multiply(Jt.fromNumber(n)));return r.compare(Lm)===1&&(r=new Jt([r.getBits(0),r.getBits(1)],0)),r.modulo(this.Te).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Ie===0)return!1;const t=Yc(e),[n,r]=Jc(t);for(let i=0;i<this.hashCount;i++){const a=this.Ee(n,r,i);if(!this.de(a))return!1}return!0}static create(e,t,n){const r=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),a=new Fo(i,r,t);return n.forEach(c=>a.insert(c)),a}insert(e){if(this.Ie===0)return;const t=Yc(e),[n,r]=Jc(t);for(let i=0;i<this.hashCount;i++){const a=this.Ee(n,r,i);this.Ae(a)}}Ae(e){const t=Math.floor(e/8),n=e%8;this.bitmap[t]|=1<<n}}class us extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ei{constructor(e,t,n,r,i){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=n,this.documentUpdates=r,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,t,n){const r=new Map;return r.set(e,Bs.createSynthesizedTargetChangeForCurrentChange(e,t,n)),new ei(X.min(),r,new pe(oe),vt(),ne())}}class Bs{constructor(e,t,n,r,i){this.resumeToken=e,this.current=t,this.addedDocuments=n,this.modifiedDocuments=r,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,n){return new Bs(n,t,ne(),ne(),ne())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Er{constructor(e,t,n,r){this.Re=e,this.removedTargetIds=t,this.key=n,this.Ve=r}}class qu{constructor(e,t){this.targetId=e,this.me=t}}class zu{constructor(e,t,n=Ce.EMPTY_BYTE_STRING,r=null){this.state=e,this.targetIds=t,this.resumeToken=n,this.cause=r}}class Xc{constructor(){this.fe=0,this.ge=el(),this.pe=Ce.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}ve(){let e=ne(),t=ne(),n=ne();return this.ge.forEach((r,i)=>{switch(i){case 0:e=e.add(r);break;case 2:t=t.add(r);break;case 1:n=n.add(r);break;default:Y()}}),new Bs(this.pe,this.ye,e,t,n)}Ce(){this.we=!1,this.ge=el()}Fe(e,t){this.we=!0,this.ge=this.ge.insert(e,t)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,ce(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class xm{constructor(e){this.Le=e,this.Be=new Map,this.ke=vt(),this.qe=Zc(),this.Qe=new pe(oe)}Ke(e){for(const t of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(t,e.Ve):this.Ue(t,e.key,e.Ve);for(const t of e.removedTargetIds)this.Ue(t,e.key,e.Ve)}We(e){this.forEachTarget(e,t=>{const n=this.Ge(t);switch(e.state){case 0:this.ze(t)&&n.De(e.resumeToken);break;case 1:n.Oe(),n.Se||n.Ce(),n.De(e.resumeToken);break;case 2:n.Oe(),n.Se||this.removeTarget(t);break;case 3:this.ze(t)&&(n.Ne(),n.De(e.resumeToken));break;case 4:this.ze(t)&&(this.je(t),n.De(e.resumeToken));break;default:Y()}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Be.forEach((n,r)=>{this.ze(r)&&t(r)})}He(e){const t=e.targetId,n=e.me.count,r=this.Je(t);if(r){const i=r.target;if(lo(i))if(n===0){const a=new K(i.path);this.Ue(t,a,Be.newNoDocument(a,X.min()))}else ce(n===1);else{const a=this.Ye(t);if(a!==n){const c=this.Ze(e),l=c?this.Xe(c,e,a):1;if(l!==0){this.je(t);const d=l===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(t,d)}}}}}Ze(e){const t=e.me.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:n="",padding:r=0},hashCount:i=0}=t;let a,c;try{a=sn(n).toUint8Array()}catch(l){if(l instanceof bu)return kn("Decoding the base64 bloom filter in existence filter failed ("+l.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw l}try{c=new Fo(a,r,i)}catch(l){return kn(l instanceof us?"BloomFilter error: ":"Applying bloom filter failed: ",l),null}return c.Ie===0?null:c}Xe(e,t,n){return t.me.count===n-this.nt(e,t.targetId)?0:2}nt(e,t){const n=this.Le.getRemoteKeysForTarget(t);let r=0;return n.forEach(i=>{const a=this.Le.tt(),c=`projects/${a.projectId}/databases/${a.database}/documents/${i.path.canonicalString()}`;e.mightContain(c)||(this.Ue(t,i,null),r++)}),r}rt(e){const t=new Map;this.Be.forEach((i,a)=>{const c=this.Je(a);if(c){if(i.current&&lo(c.target)){const l=new K(c.target.path);this.ke.get(l)!==null||this.it(a,l)||this.Ue(a,l,Be.newNoDocument(l,e))}i.be&&(t.set(a,i.ve()),i.Ce())}});let n=ne();this.qe.forEach((i,a)=>{let c=!0;a.forEachWhile(l=>{const d=this.Je(l);return!d||d.purpose==="TargetPurposeLimboResolution"||(c=!1,!1)}),c&&(n=n.add(i))}),this.ke.forEach((i,a)=>a.setReadTime(e));const r=new ei(e,t,this.Qe,this.ke,n);return this.ke=vt(),this.qe=Zc(),this.Qe=new pe(oe),r}$e(e,t){if(!this.ze(e))return;const n=this.it(e,t.key)?2:0;this.Ge(e).Fe(t.key,n),this.ke=this.ke.insert(t.key,t),this.qe=this.qe.insert(t.key,this.st(t.key).add(e))}Ue(e,t,n){if(!this.ze(e))return;const r=this.Ge(e);this.it(e,t)?r.Fe(t,1):r.Me(t),this.qe=this.qe.insert(t,this.st(t).delete(e)),n&&(this.ke=this.ke.insert(t,n))}removeTarget(e){this.Be.delete(e)}Ye(e){const t=this.Ge(e).ve();return this.Le.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let t=this.Be.get(e);return t||(t=new Xc,this.Be.set(e,t)),t}st(e){let t=this.qe.get(e);return t||(t=new Re(oe),this.qe=this.qe.insert(e,t)),t}ze(e){const t=this.Je(e)!==null;return t||j("WatchChangeAggregator","Detected inactive target",e),t}Je(e){const t=this.Be.get(e);return t&&t.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new Xc),this.Le.getRemoteKeysForTarget(e).forEach(t=>{this.Ue(e,t,null)})}it(e,t){return this.Le.getRemoteKeysForTarget(e).has(t)}}function Zc(){return new pe(K.comparator)}function el(){return new pe(K.comparator)}const Vm={asc:"ASCENDING",desc:"DESCENDING"},Bm={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},Mm={and:"AND",or:"OR"};class Om{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function ho(s,e){return s.useProto3Json||Qr(e)?e:{value:e}}function Vr(s,e){return s.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Wu(s,e){return s.useProto3Json?e.toBase64():e.toUint8Array()}function $m(s,e){return Vr(s,e.toTimestamp())}function at(s){return ce(!!s),X.fromTimestamp(function(t){const n=$t(t);return new Ee(n.seconds,n.nanos)}(s))}function Uo(s,e){return fo(s,e).canonicalString()}function fo(s,e){const t=function(r){return new fe(["projects",r.projectId,"databases",r.database])}(s).child("documents");return e===void 0?t:t.child(e)}function Hu(s){const e=fe.fromString(s);return ce(Ju(e)),e}function po(s,e){return Uo(s.databaseId,e.path)}function qi(s,e){const t=Hu(e);if(t.get(1)!==s.databaseId.projectId)throw new U(B.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+s.databaseId.projectId);if(t.get(3)!==s.databaseId.database)throw new U(B.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+s.databaseId.database);return new K(Gu(t))}function Ku(s,e){return Uo(s.databaseId,e)}function Fm(s){const e=Hu(s);return e.length===4?fe.emptyPath():Gu(e)}function mo(s){return new fe(["projects",s.databaseId.projectId,"databases",s.databaseId.database]).canonicalString()}function Gu(s){return ce(s.length>4&&s.get(4)==="documents"),s.popFirst(5)}function tl(s,e,t){return{name:po(s,e),fields:t.value.mapValue.fields}}function Um(s,e){let t;if("targetChange"in e){e.targetChange;const n=function(d){return d==="NO_CHANGE"?0:d==="ADD"?1:d==="REMOVE"?2:d==="CURRENT"?3:d==="RESET"?4:Y()}(e.targetChange.targetChangeType||"NO_CHANGE"),r=e.targetChange.targetIds||[],i=function(d,f){return d.useProto3Json?(ce(f===void 0||typeof f=="string"),Ce.fromBase64String(f||"")):(ce(f===void 0||f instanceof Buffer||f instanceof Uint8Array),Ce.fromUint8Array(f||new Uint8Array))}(s,e.targetChange.resumeToken),a=e.targetChange.cause,c=a&&function(d){const f=d.code===void 0?B.UNKNOWN:ju(d.code);return new U(f,d.message||"")}(a);t=new zu(n,r,i,c||null)}else if("documentChange"in e){e.documentChange;const n=e.documentChange;n.document,n.document.name,n.document.updateTime;const r=qi(s,n.document.name),i=at(n.document.updateTime),a=n.document.createTime?at(n.document.createTime):X.min(),c=new Ge({mapValue:{fields:n.document.fields}}),l=Be.newFoundDocument(r,i,a,c),d=n.targetIds||[],f=n.removedTargetIds||[];t=new Er(d,f,l.key,l)}else if("documentDelete"in e){e.documentDelete;const n=e.documentDelete;n.document;const r=qi(s,n.document),i=n.readTime?at(n.readTime):X.min(),a=Be.newNoDocument(r,i),c=n.removedTargetIds||[];t=new Er([],c,a.key,a)}else if("documentRemove"in e){e.documentRemove;const n=e.documentRemove;n.document;const r=qi(s,n.document),i=n.removedTargetIds||[];t=new Er([],i,r,null)}else{if(!("filter"in e))return Y();{e.filter;const n=e.filter;n.targetId;const{count:r=0,unchangedNames:i}=n,a=new Dm(r,i),c=n.targetId;t=new qu(c,a)}}return t}function jm(s,e){let t;if(e instanceof Vs)t={update:tl(s,e.key,e.value)};else if(e instanceof Oo)t={delete:po(s,e.key)};else if(e instanceof an)t={update:tl(s,e.key,e.data),updateMask:Jm(e.fieldMask)};else{if(!(e instanceof Am))return Y();t={verify:po(s,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map(n=>function(i,a){const c=a.transform;if(c instanceof Is)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(c instanceof Ss)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:c.elements}};if(c instanceof ks)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:c.elements}};if(c instanceof xr)return{fieldPath:a.field.canonicalString(),increment:c.Pe};throw Y()}(0,n))),e.precondition.isNone||(t.currentDocument=function(r,i){return i.updateTime!==void 0?{updateTime:$m(r,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:Y()}(s,e.precondition)),t}function qm(s,e){return s&&s.length>0?(ce(e!==void 0),s.map(t=>function(r,i){let a=r.updateTime?at(r.updateTime):at(i);return a.isEqual(X.min())&&(a=at(i)),new Im(a,r.transformResults||[])}(t,e))):[]}function zm(s,e){return{documents:[Ku(s,e.path)]}}function Wm(s,e){const t={structuredQuery:{}},n=e.path;let r;e.collectionGroup!==null?(r=n,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(r=n.popLast(),t.structuredQuery.from=[{collectionId:n.lastSegment()}]),t.parent=Ku(s,r);const i=function(d){if(d.length!==0)return Yu(st.create(d,"and"))}(e.filters);i&&(t.structuredQuery.where=i);const a=function(d){if(d.length!==0)return d.map(f=>function(_){return{field:yn(_.field),direction:Gm(_.dir)}}(f))}(e.orderBy);a&&(t.structuredQuery.orderBy=a);const c=ho(s,e.limit);return c!==null&&(t.structuredQuery.limit=c),e.startAt&&(t.structuredQuery.startAt=function(d){return{before:d.inclusive,values:d.position}}(e.startAt)),e.endAt&&(t.structuredQuery.endAt=function(d){return{before:!d.inclusive,values:d.position}}(e.endAt)),{_t:t,parent:r}}function Hm(s){let e=Fm(s.parent);const t=s.structuredQuery,n=t.from?t.from.length:0;let r=null;if(n>0){ce(n===1);const f=t.from[0];f.allDescendants?r=f.collectionId:e=e.child(f.collectionId)}let i=[];t.where&&(i=function(m){const _=Qu(m);return _ instanceof st&&Iu(_)?_.getFilters():[_]}(t.where));let a=[];t.orderBy&&(a=function(m){return m.map(_=>function(R){return new Ts(_n(R.field),function(D){switch(D){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(R.direction))}(_))}(t.orderBy));let c=null;t.limit&&(c=function(m){let _;return _=typeof m=="object"?m.value:m,Qr(_)?null:_}(t.limit));let l=null;t.startAt&&(l=function(m){const _=!!m.before,T=m.values||[];return new Nr(T,_)}(t.startAt));let d=null;return t.endAt&&(d=function(m){const _=!m.before,T=m.values||[];return new Nr(T,_)}(t.endAt)),um(e,r,a,i,c,"F",l,d)}function Km(s,e){const t=function(r){switch(r){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return Y()}}(e.purpose);return t==null?null:{"goog-listen-tags":t}}function Qu(s){return s.unaryFilter!==void 0?function(t){switch(t.unaryFilter.op){case"IS_NAN":const n=_n(t.unaryFilter.field);return _e.create(n,"==",{doubleValue:NaN});case"IS_NULL":const r=_n(t.unaryFilter.field);return _e.create(r,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=_n(t.unaryFilter.field);return _e.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=_n(t.unaryFilter.field);return _e.create(a,"!=",{nullValue:"NULL_VALUE"});default:return Y()}}(s):s.fieldFilter!==void 0?function(t){return _e.create(_n(t.fieldFilter.field),function(r){switch(r){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return Y()}}(t.fieldFilter.op),t.fieldFilter.value)}(s):s.compositeFilter!==void 0?function(t){return st.create(t.compositeFilter.filters.map(n=>Qu(n)),function(r){switch(r){case"AND":return"and";case"OR":return"or";default:return Y()}}(t.compositeFilter.op))}(s):Y()}function Gm(s){return Vm[s]}function Qm(s){return Bm[s]}function Ym(s){return Mm[s]}function yn(s){return{fieldPath:s.canonicalString()}}function _n(s){return Ae.fromServerFormat(s.fieldPath)}function Yu(s){return s instanceof _e?function(t){if(t.op==="=="){if(Uc(t.value))return{unaryFilter:{field:yn(t.field),op:"IS_NAN"}};if(Fc(t.value))return{unaryFilter:{field:yn(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Uc(t.value))return{unaryFilter:{field:yn(t.field),op:"IS_NOT_NAN"}};if(Fc(t.value))return{unaryFilter:{field:yn(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:yn(t.field),op:Qm(t.op),value:t.value}}}(s):s instanceof st?function(t){const n=t.getFilters().map(r=>Yu(r));return n.length===1?n[0]:{compositeFilter:{op:Ym(t.op),filters:n}}}(s):Y()}function Jm(s){const e=[];return s.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function Ju(s){return s.length>=4&&s.get(0)==="projects"&&s.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nt{constructor(e,t,n,r,i=X.min(),a=X.min(),c=Ce.EMPTY_BYTE_STRING,l=null){this.target=e,this.targetId=t,this.purpose=n,this.sequenceNumber=r,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=c,this.expectedCount=l}withSequenceNumber(e){return new Nt(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new Nt(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Nt(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Nt(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xm{constructor(e){this.ct=e}}function Zm(s){const e=Hm({parent:s.parent,structuredQuery:s.structuredQuery});return s.limitType==="LAST"?Lr(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eg{constructor(){this.un=new tg}addToCollectionParentIndex(e,t){return this.un.add(t),M.resolve()}getCollectionParents(e,t){return M.resolve(this.un.getEntries(t))}addFieldIndex(e,t){return M.resolve()}deleteFieldIndex(e,t){return M.resolve()}deleteAllFieldIndexes(e){return M.resolve()}createTargetIndexes(e,t){return M.resolve()}getDocumentsMatchingTarget(e,t){return M.resolve(null)}getIndexType(e,t){return M.resolve(0)}getFieldIndexes(e,t){return M.resolve([])}getNextCollectionGroupToUpdate(e){return M.resolve(null)}getMinOffset(e,t){return M.resolve(Ot.min())}getMinOffsetFromCollectionGroup(e,t){return M.resolve(Ot.min())}updateCollectionGroup(e,t,n){return M.resolve()}updateIndexEntries(e,t){return M.resolve()}}class tg{constructor(){this.index={}}add(e){const t=e.lastSegment(),n=e.popLast(),r=this.index[t]||new Re(fe.comparator),i=!r.has(n);return this.index[t]=r.add(n),i}has(e){const t=e.lastSegment(),n=e.popLast(),r=this.index[t];return r&&r.has(n)}getEntries(e){return(this.index[e]||new Re(fe.comparator)).toArray()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dn{constructor(e){this.Ln=e}next(){return this.Ln+=2,this.Ln}static Bn(){return new Dn(0)}static kn(){return new Dn(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ng{constructor(){this.changes=new $n(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Be.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const n=this.changes.get(t);return n!==void 0?M.resolve(n):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sg{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rg{constructor(e,t,n,r){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=n,this.indexManager=r}getDocument(e,t){let n=null;return this.documentOverlayCache.getOverlay(e,t).next(r=>(n=r,this.remoteDocumentCache.getEntry(e,t))).next(r=>(n!==null&&ps(n.mutation,r,tt.empty(),Ee.now()),r))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(n=>this.getLocalViewOfDocuments(e,n,ne()).next(()=>n))}getLocalViewOfDocuments(e,t,n=ne()){const r=Qt();return this.populateOverlays(e,r,t).next(()=>this.computeViews(e,t,r,n).next(i=>{let a=ls();return i.forEach((c,l)=>{a=a.insert(c,l.overlayedDocument)}),a}))}getOverlayedDocuments(e,t){const n=Qt();return this.populateOverlays(e,n,t).next(()=>this.computeViews(e,t,n,ne()))}populateOverlays(e,t,n){const r=[];return n.forEach(i=>{t.has(i)||r.push(i)}),this.documentOverlayCache.getOverlays(e,r).next(i=>{i.forEach((a,c)=>{t.set(a,c)})})}computeViews(e,t,n,r){let i=vt();const a=fs(),c=function(){return fs()}();return t.forEach((l,d)=>{const f=n.get(d.key);r.has(d.key)&&(f===void 0||f.mutation instanceof an)?i=i.insert(d.key,d):f!==void 0?(a.set(d.key,f.mutation.getFieldMask()),ps(f.mutation,d,f.mutation.getFieldMask(),Ee.now())):a.set(d.key,tt.empty())}),this.recalculateAndSaveOverlays(e,i).next(l=>(l.forEach((d,f)=>a.set(d,f)),t.forEach((d,f)=>{var m;return c.set(d,new sg(f,(m=a.get(d))!==null&&m!==void 0?m:null))}),c))}recalculateAndSaveOverlays(e,t){const n=fs();let r=new pe((a,c)=>a-c),i=ne();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(a=>{for(const c of a)c.keys().forEach(l=>{const d=t.get(l);if(d===null)return;let f=n.get(l)||tt.empty();f=c.applyToLocalView(d,f),n.set(l,f);const m=(r.get(c.batchId)||ne()).add(l);r=r.insert(c.batchId,m)})}).next(()=>{const a=[],c=r.getReverseIterator();for(;c.hasNext();){const l=c.getNext(),d=l.key,f=l.value,m=xu();f.forEach(_=>{if(!i.has(_)){const T=Fu(t.get(_),n.get(_));T!==null&&m.set(_,T),i=i.add(_)}}),a.push(this.documentOverlayCache.saveOverlays(e,d,m))}return M.waitFor(a)}).next(()=>n)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(n=>this.recalculateAndSaveOverlays(e,n))}getDocumentsMatchingQuery(e,t,n,r){return function(a){return K.isDocumentKey(a.path)&&a.collectionGroup===null&&a.filters.length===0}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):Cu(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,n,r):this.getDocumentsMatchingCollectionQuery(e,t,n,r)}getNextDocuments(e,t,n,r){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,n,r).next(i=>{const a=r-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,n.largestBatchId,r-i.size):M.resolve(Qt());let c=-1,l=i;return a.next(d=>M.forEach(d,(f,m)=>(c<m.largestBatchId&&(c=m.largestBatchId),i.get(f)?M.resolve():this.remoteDocumentCache.getEntry(e,f).next(_=>{l=l.insert(f,_)}))).next(()=>this.populateOverlays(e,d,i)).next(()=>this.computeViews(e,l,d,ne())).next(f=>({batchId:c,changes:Lu(f)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new K(t)).next(n=>{let r=ls();return n.isFoundDocument()&&(r=r.insert(n.key,n)),r})}getDocumentsMatchingCollectionGroupQuery(e,t,n,r){const i=t.collectionGroup;let a=ls();return this.indexManager.getCollectionParents(e,i).next(c=>M.forEach(c,l=>{const d=function(m,_){return new On(_,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)}(t,l.child(i));return this.getDocumentsMatchingCollectionQuery(e,d,n,r).next(f=>{f.forEach((m,_)=>{a=a.insert(m,_)})})}).next(()=>a))}getDocumentsMatchingCollectionQuery(e,t,n,r){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,n.largestBatchId).next(a=>(i=a,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,i,r))).next(a=>{i.forEach((l,d)=>{const f=d.getKey();a.get(f)===null&&(a=a.insert(f,Be.newInvalidDocument(f)))});let c=ls();return a.forEach((l,d)=>{const f=i.get(l);f!==void 0&&ps(f.mutation,d,tt.empty(),Ee.now()),Jr(t,d)&&(c=c.insert(l,d))}),c})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ig{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,t){return M.resolve(this.hr.get(t))}saveBundleMetadata(e,t){return this.hr.set(t.id,function(r){return{id:r.id,version:r.version,createTime:at(r.createTime)}}(t)),M.resolve()}getNamedQuery(e,t){return M.resolve(this.Pr.get(t))}saveNamedQuery(e,t){return this.Pr.set(t.name,function(r){return{name:r.name,query:Zm(r.bundledQuery),readTime:at(r.readTime)}}(t)),M.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class og{constructor(){this.overlays=new pe(K.comparator),this.Ir=new Map}getOverlay(e,t){return M.resolve(this.overlays.get(t))}getOverlays(e,t){const n=Qt();return M.forEach(t,r=>this.getOverlay(e,r).next(i=>{i!==null&&n.set(r,i)})).next(()=>n)}saveOverlays(e,t,n){return n.forEach((r,i)=>{this.ht(e,t,i)}),M.resolve()}removeOverlaysForBatchId(e,t,n){const r=this.Ir.get(n);return r!==void 0&&(r.forEach(i=>this.overlays=this.overlays.remove(i)),this.Ir.delete(n)),M.resolve()}getOverlaysForCollection(e,t,n){const r=Qt(),i=t.length+1,a=new K(t.child("")),c=this.overlays.getIteratorFrom(a);for(;c.hasNext();){const l=c.getNext().value,d=l.getKey();if(!t.isPrefixOf(d.path))break;d.path.length===i&&l.largestBatchId>n&&r.set(l.getKey(),l)}return M.resolve(r)}getOverlaysForCollectionGroup(e,t,n,r){let i=new pe((d,f)=>d-f);const a=this.overlays.getIterator();for(;a.hasNext();){const d=a.getNext().value;if(d.getKey().getCollectionGroup()===t&&d.largestBatchId>n){let f=i.get(d.largestBatchId);f===null&&(f=Qt(),i=i.insert(d.largestBatchId,f)),f.set(d.getKey(),d)}}const c=Qt(),l=i.getIterator();for(;l.hasNext()&&(l.getNext().value.forEach((d,f)=>c.set(d,f)),!(c.size()>=r)););return M.resolve(c)}ht(e,t,n){const r=this.overlays.get(n.key);if(r!==null){const a=this.Ir.get(r.largestBatchId).delete(n.key);this.Ir.set(r.largestBatchId,a)}this.overlays=this.overlays.insert(n.key,new Cm(t,n));let i=this.Ir.get(t);i===void 0&&(i=ne(),this.Ir.set(t,i)),this.Ir.set(t,i.add(n.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ag{constructor(){this.sessionToken=Ce.EMPTY_BYTE_STRING}getSessionToken(e){return M.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,M.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jo{constructor(){this.Tr=new Re(Ie.Er),this.dr=new Re(Ie.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,t){const n=new Ie(e,t);this.Tr=this.Tr.add(n),this.dr=this.dr.add(n)}Rr(e,t){e.forEach(n=>this.addReference(n,t))}removeReference(e,t){this.Vr(new Ie(e,t))}mr(e,t){e.forEach(n=>this.removeReference(n,t))}gr(e){const t=new K(new fe([])),n=new Ie(t,e),r=new Ie(t,e+1),i=[];return this.dr.forEachInRange([n,r],a=>{this.Vr(a),i.push(a.key)}),i}pr(){this.Tr.forEach(e=>this.Vr(e))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const t=new K(new fe([])),n=new Ie(t,e),r=new Ie(t,e+1);let i=ne();return this.dr.forEachInRange([n,r],a=>{i=i.add(a.key)}),i}containsKey(e){const t=new Ie(e,0),n=this.Tr.firstAfterOrEqual(t);return n!==null&&e.isEqual(n.key)}}class Ie{constructor(e,t){this.key=e,this.wr=t}static Er(e,t){return K.comparator(e.key,t.key)||oe(e.wr,t.wr)}static Ar(e,t){return oe(e.wr,t.wr)||K.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cg{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Sr=1,this.br=new Re(Ie.Er)}checkEmpty(e){return M.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,n,r){const i=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new Rm(i,t,n,r);this.mutationQueue.push(a);for(const c of r)this.br=this.br.add(new Ie(c.key,i)),this.indexManager.addToCollectionParentIndex(e,c.key.path.popLast());return M.resolve(a)}lookupMutationBatch(e,t){return M.resolve(this.Dr(t))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,r=this.vr(n),i=r<0?0:r;return M.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return M.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(e){return M.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const n=new Ie(t,0),r=new Ie(t,Number.POSITIVE_INFINITY),i=[];return this.br.forEachInRange([n,r],a=>{const c=this.Dr(a.wr);i.push(c)}),M.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new Re(oe);return t.forEach(r=>{const i=new Ie(r,0),a=new Ie(r,Number.POSITIVE_INFINITY);this.br.forEachInRange([i,a],c=>{n=n.add(c.wr)})}),M.resolve(this.Cr(n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,r=n.length+1;let i=n;K.isDocumentKey(i)||(i=i.child(""));const a=new Ie(new K(i),0);let c=new Re(oe);return this.br.forEachWhile(l=>{const d=l.key.path;return!!n.isPrefixOf(d)&&(d.length===r&&(c=c.add(l.wr)),!0)},a),M.resolve(this.Cr(c))}Cr(e){const t=[];return e.forEach(n=>{const r=this.Dr(n);r!==null&&t.push(r)}),t}removeMutationBatch(e,t){ce(this.Fr(t.batchId,"removed")===0),this.mutationQueue.shift();let n=this.br;return M.forEach(t.mutations,r=>{const i=new Ie(r.key,t.batchId);return n=n.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,r.key)}).next(()=>{this.br=n})}On(e){}containsKey(e,t){const n=new Ie(t,0),r=this.br.firstAfterOrEqual(n);return M.resolve(t.isEqual(r&&r.key))}performConsistencyCheck(e){return this.mutationQueue.length,M.resolve()}Fr(e,t){return this.vr(e)}vr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Dr(e){const t=this.vr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lg{constructor(e){this.Mr=e,this.docs=function(){return new pe(K.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const n=t.key,r=this.docs.get(n),i=r?r.size:0,a=this.Mr(t);return this.docs=this.docs.insert(n,{document:t.mutableCopy(),size:a}),this.size+=a-i,this.indexManager.addToCollectionParentIndex(e,n.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const n=this.docs.get(t);return M.resolve(n?n.document.mutableCopy():Be.newInvalidDocument(t))}getEntries(e,t){let n=vt();return t.forEach(r=>{const i=this.docs.get(r);n=n.insert(r,i?i.document.mutableCopy():Be.newInvalidDocument(r))}),M.resolve(n)}getDocumentsMatchingQuery(e,t,n,r){let i=vt();const a=t.path,c=new K(a.child("")),l=this.docs.getIteratorFrom(c);for(;l.hasNext();){const{key:d,value:{document:f}}=l.getNext();if(!a.isPrefixOf(d.path))break;d.path.length>a.length+1||Wp(zp(f),n)<=0||(r.has(f.key)||Jr(t,f))&&(i=i.insert(f.key,f.mutableCopy()))}return M.resolve(i)}getAllFromCollectionGroup(e,t,n,r){Y()}Or(e,t){return M.forEach(this.docs,n=>t(n))}newChangeBuffer(e){return new ug(this)}getSize(e){return M.resolve(this.size)}}class ug extends ng{constructor(e){super(),this.cr=e}applyChanges(e){const t=[];return this.changes.forEach((n,r)=>{r.isValidDocument()?t.push(this.cr.addEntry(e,r)):this.cr.removeEntry(n)}),M.waitFor(t)}getFromCache(e,t){return this.cr.getEntry(e,t)}getAllFromCache(e,t){return this.cr.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dg{constructor(e){this.persistence=e,this.Nr=new $n(t=>Vo(t),Bo),this.lastRemoteSnapshotVersion=X.min(),this.highestTargetId=0,this.Lr=0,this.Br=new jo,this.targetCount=0,this.kr=Dn.Bn()}forEachTarget(e,t){return this.Nr.forEach((n,r)=>t(r)),M.resolve()}getLastRemoteSnapshotVersion(e){return M.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return M.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),M.resolve(this.highestTargetId)}setTargetsMetadata(e,t,n){return n&&(this.lastRemoteSnapshotVersion=n),t>this.Lr&&(this.Lr=t),M.resolve()}Kn(e){this.Nr.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.kr=new Dn(t),this.highestTargetId=t),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,t){return this.Kn(t),this.targetCount+=1,M.resolve()}updateTargetData(e,t){return this.Kn(t),M.resolve()}removeTargetData(e,t){return this.Nr.delete(t.target),this.Br.gr(t.targetId),this.targetCount-=1,M.resolve()}removeTargets(e,t,n){let r=0;const i=[];return this.Nr.forEach((a,c)=>{c.sequenceNumber<=t&&n.get(c.targetId)===null&&(this.Nr.delete(a),i.push(this.removeMatchingKeysForTargetId(e,c.targetId)),r++)}),M.waitFor(i).next(()=>r)}getTargetCount(e){return M.resolve(this.targetCount)}getTargetData(e,t){const n=this.Nr.get(t)||null;return M.resolve(n)}addMatchingKeys(e,t,n){return this.Br.Rr(t,n),M.resolve()}removeMatchingKeys(e,t,n){this.Br.mr(t,n);const r=this.persistence.referenceDelegate,i=[];return r&&t.forEach(a=>{i.push(r.markPotentiallyOrphaned(e,a))}),M.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.Br.gr(t),M.resolve()}getMatchingKeysForTargetId(e,t){const n=this.Br.yr(t);return M.resolve(n)}containsKey(e,t){return M.resolve(this.Br.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hg{constructor(e,t){this.qr={},this.overlays={},this.Qr=new Po(0),this.Kr=!1,this.Kr=!0,this.$r=new ag,this.referenceDelegate=e(this),this.Ur=new dg(this),this.indexManager=new eg,this.remoteDocumentCache=function(r){return new lg(r)}(n=>this.referenceDelegate.Wr(n)),this.serializer=new Xm(t),this.Gr=new ig(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new og,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let n=this.qr[e.toKey()];return n||(n=new cg(t,this.referenceDelegate),this.qr[e.toKey()]=n),n}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,t,n){j("MemoryPersistence","Starting transaction:",e);const r=new fg(this.Qr.next());return this.referenceDelegate.zr(),n(r).next(i=>this.referenceDelegate.jr(r).next(()=>i)).toPromise().then(i=>(r.raiseOnCommittedEvent(),i))}Hr(e,t){return M.or(Object.values(this.qr).map(n=>()=>n.containsKey(e,t)))}}class fg extends Kp{constructor(e){super(),this.currentSequenceNumber=e}}class qo{constructor(e){this.persistence=e,this.Jr=new jo,this.Yr=null}static Zr(e){return new qo(e)}get Xr(){if(this.Yr)return this.Yr;throw Y()}addReference(e,t,n){return this.Jr.addReference(n,t),this.Xr.delete(n.toString()),M.resolve()}removeReference(e,t,n){return this.Jr.removeReference(n,t),this.Xr.add(n.toString()),M.resolve()}markPotentiallyOrphaned(e,t){return this.Xr.add(t.toString()),M.resolve()}removeTarget(e,t){this.Jr.gr(t.targetId).forEach(r=>this.Xr.add(r.toString()));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(e,t.targetId).next(r=>{r.forEach(i=>this.Xr.add(i.toString()))}).next(()=>n.removeTargetData(e,t))}zr(){this.Yr=new Set}jr(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return M.forEach(this.Xr,n=>{const r=K.fromPath(n);return this.ei(e,r).next(i=>{i||t.removeEntry(r,X.min())})}).next(()=>(this.Yr=null,t.apply(e)))}updateLimboDocument(e,t){return this.ei(e,t).next(n=>{n?this.Xr.delete(t.toString()):this.Xr.add(t.toString())})}Wr(e){return 0}ei(e,t){return M.or([()=>M.resolve(this.Jr.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Hr(e,t)])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zo{constructor(e,t,n,r){this.targetId=e,this.fromCache=t,this.$i=n,this.Ui=r}static Wi(e,t){let n=ne(),r=ne();for(const i of t.docChanges)switch(i.type){case 0:n=n.add(i.doc.key);break;case 1:r=r.add(i.doc.key)}return new zo(e,t.fromCache,n,r)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pg{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mg{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return mf()?8:Gp(Me())>0?6:4}()}initialize(e,t){this.Ji=e,this.indexManager=t,this.Gi=!0}getDocumentsMatchingQuery(e,t,n,r){const i={result:null};return this.Yi(e,t).next(a=>{i.result=a}).next(()=>{if(!i.result)return this.Zi(e,t,r,n).next(a=>{i.result=a})}).next(()=>{if(i.result)return;const a=new pg;return this.Xi(e,t,a).next(c=>{if(i.result=c,this.zi)return this.es(e,t,a,c.size)})}).next(()=>i.result)}es(e,t,n,r){return n.documentReadCount<this.ji?(rs()<=se.DEBUG&&j("QueryEngine","SDK will not create cache indexes for query:",gn(t),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),M.resolve()):(rs()<=se.DEBUG&&j("QueryEngine","Query:",gn(t),"scans",n.documentReadCount,"local documents and returns",r,"documents as results."),n.documentReadCount>this.Hi*r?(rs()<=se.DEBUG&&j("QueryEngine","The SDK decides to create cache indexes for query:",gn(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,it(t))):M.resolve())}Yi(e,t){if(Wc(t))return M.resolve(null);let n=it(t);return this.indexManager.getIndexType(e,n).next(r=>r===0?null:(t.limit!==null&&r===1&&(t=Lr(t,null,"F"),n=it(t)),this.indexManager.getDocumentsMatchingTarget(e,n).next(i=>{const a=ne(...i);return this.Ji.getDocuments(e,a).next(c=>this.indexManager.getMinOffset(e,n).next(l=>{const d=this.ts(t,c);return this.ns(t,d,a,l.readTime)?this.Yi(e,Lr(t,null,"F")):this.rs(e,d,t,l)}))})))}Zi(e,t,n,r){return Wc(t)||r.isEqual(X.min())?M.resolve(null):this.Ji.getDocuments(e,n).next(i=>{const a=this.ts(t,i);return this.ns(t,a,n,r)?M.resolve(null):(rs()<=se.DEBUG&&j("QueryEngine","Re-using previous result from %s to execute query: %s",r.toString(),gn(t)),this.rs(e,a,t,qp(r,-1)).next(c=>c))})}ts(e,t){let n=new Re(Pu(e));return t.forEach((r,i)=>{Jr(e,i)&&(n=n.add(i))}),n}ns(e,t,n,r){if(e.limit===null)return!1;if(n.size!==t.size)return!0;const i=e.limitType==="F"?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(r)>0)}Xi(e,t,n){return rs()<=se.DEBUG&&j("QueryEngine","Using full collection scan to execute query:",gn(t)),this.Ji.getDocumentsMatchingQuery(e,t,Ot.min(),n)}rs(e,t,n,r){return this.Ji.getDocumentsMatchingQuery(e,n,r).next(i=>(t.forEach(a=>{i=i.insert(a.key,a)}),i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gg{constructor(e,t,n,r){this.persistence=e,this.ss=t,this.serializer=r,this.os=new pe(oe),this._s=new $n(i=>Vo(i),Bo),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(n)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new rg(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.os))}}function yg(s,e,t,n){return new gg(s,e,t,n)}async function Xu(s,e){const t=Z(s);return await t.persistence.runTransaction("Handle user change","readonly",n=>{let r;return t.mutationQueue.getAllMutationBatches(n).next(i=>(r=i,t.ls(e),t.mutationQueue.getAllMutationBatches(n))).next(i=>{const a=[],c=[];let l=ne();for(const d of r){a.push(d.batchId);for(const f of d.mutations)l=l.add(f.key)}for(const d of i){c.push(d.batchId);for(const f of d.mutations)l=l.add(f.key)}return t.localDocuments.getDocuments(n,l).next(d=>({hs:d,removedBatchIds:a,addedBatchIds:c}))})})}function _g(s,e){const t=Z(s);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",n=>{const r=e.batch.keys(),i=t.cs.newChangeBuffer({trackRemovals:!0});return function(c,l,d,f){const m=d.batch,_=m.keys();let T=M.resolve();return _.forEach(R=>{T=T.next(()=>f.getEntry(l,R)).next(N=>{const D=d.docVersions.get(R);ce(D!==null),N.version.compareTo(D)<0&&(m.applyToRemoteDocument(N,d),N.isValidDocument()&&(N.setReadTime(d.commitVersion),f.addEntry(N)))})}),T.next(()=>c.mutationQueue.removeMutationBatch(l,m))}(t,n,e,i).next(()=>i.apply(n)).next(()=>t.mutationQueue.performConsistencyCheck(n)).next(()=>t.documentOverlayCache.removeOverlaysForBatchId(n,r,e.batch.batchId)).next(()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(n,function(c){let l=ne();for(let d=0;d<c.mutationResults.length;++d)c.mutationResults[d].transformResults.length>0&&(l=l.add(c.batch.mutations[d].key));return l}(e))).next(()=>t.localDocuments.getDocuments(n,r))})}function Zu(s){const e=Z(s);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.Ur.getLastRemoteSnapshotVersion(t))}function vg(s,e){const t=Z(s),n=e.snapshotVersion;let r=t.os;return t.persistence.runTransaction("Apply remote event","readwrite-primary",i=>{const a=t.cs.newChangeBuffer({trackRemovals:!0});r=t.os;const c=[];e.targetChanges.forEach((f,m)=>{const _=r.get(m);if(!_)return;c.push(t.Ur.removeMatchingKeys(i,f.removedDocuments,m).next(()=>t.Ur.addMatchingKeys(i,f.addedDocuments,m)));let T=_.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(m)!==null?T=T.withResumeToken(Ce.EMPTY_BYTE_STRING,X.min()).withLastLimboFreeSnapshotVersion(X.min()):f.resumeToken.approximateByteSize()>0&&(T=T.withResumeToken(f.resumeToken,n)),r=r.insert(m,T),function(N,D,x){return N.resumeToken.approximateByteSize()===0||D.snapshotVersion.toMicroseconds()-N.snapshotVersion.toMicroseconds()>=3e8?!0:x.addedDocuments.size+x.modifiedDocuments.size+x.removedDocuments.size>0}(_,T,f)&&c.push(t.Ur.updateTargetData(i,T))});let l=vt(),d=ne();if(e.documentUpdates.forEach(f=>{e.resolvedLimboDocuments.has(f)&&c.push(t.persistence.referenceDelegate.updateLimboDocument(i,f))}),c.push(bg(i,a,e.documentUpdates).next(f=>{l=f.Ps,d=f.Is})),!n.isEqual(X.min())){const f=t.Ur.getLastRemoteSnapshotVersion(i).next(m=>t.Ur.setTargetsMetadata(i,i.currentSequenceNumber,n));c.push(f)}return M.waitFor(c).next(()=>a.apply(i)).next(()=>t.localDocuments.getLocalViewOfDocuments(i,l,d)).next(()=>l)}).then(i=>(t.os=r,i))}function bg(s,e,t){let n=ne(),r=ne();return t.forEach(i=>n=n.add(i)),e.getEntries(s,n).next(i=>{let a=vt();return t.forEach((c,l)=>{const d=i.get(c);l.isFoundDocument()!==d.isFoundDocument()&&(r=r.add(c)),l.isNoDocument()&&l.version.isEqual(X.min())?(e.removeEntry(c,l.readTime),a=a.insert(c,l)):!d.isValidDocument()||l.version.compareTo(d.version)>0||l.version.compareTo(d.version)===0&&d.hasPendingWrites?(e.addEntry(l),a=a.insert(c,l)):j("LocalStore","Ignoring outdated watch update for ",c,". Current version:",d.version," Watch version:",l.version)}),{Ps:a,Is:r}})}function wg(s,e){const t=Z(s);return t.persistence.runTransaction("Get next mutation batch","readonly",n=>(e===void 0&&(e=-1),t.mutationQueue.getNextMutationBatchAfterBatchId(n,e)))}function Eg(s,e){const t=Z(s);return t.persistence.runTransaction("Allocate target","readwrite",n=>{let r;return t.Ur.getTargetData(n,e).next(i=>i?(r=i,M.resolve(r)):t.Ur.allocateTargetId(n).next(a=>(r=new Nt(e,a,"TargetPurposeListen",n.currentSequenceNumber),t.Ur.addTargetData(n,r).next(()=>r))))}).then(n=>{const r=t.os.get(n.targetId);return(r===null||n.snapshotVersion.compareTo(r.snapshotVersion)>0)&&(t.os=t.os.insert(n.targetId,n),t._s.set(e,n.targetId)),n})}async function go(s,e,t){const n=Z(s),r=n.os.get(e),i=t?"readwrite":"readwrite-primary";try{t||await n.persistence.runTransaction("Release target",i,a=>n.persistence.referenceDelegate.removeTarget(a,r))}catch(a){if(!xs(a))throw a;j("LocalStore",`Failed to update sequence numbers for target ${e}: ${a}`)}n.os=n.os.remove(e),n._s.delete(r.target)}function nl(s,e,t){const n=Z(s);let r=X.min(),i=ne();return n.persistence.runTransaction("Execute query","readwrite",a=>function(l,d,f){const m=Z(l),_=m._s.get(f);return _!==void 0?M.resolve(m.os.get(_)):m.Ur.getTargetData(d,f)}(n,a,it(e)).next(c=>{if(c)return r=c.lastLimboFreeSnapshotVersion,n.Ur.getMatchingKeysForTargetId(a,c.targetId).next(l=>{i=l})}).next(()=>n.ss.getDocumentsMatchingQuery(a,e,t?r:X.min(),t?i:ne())).next(c=>(Tg(n,hm(e),c),{documents:c,Ts:i})))}function Tg(s,e,t){let n=s.us.get(e)||X.min();t.forEach((r,i)=>{i.readTime.compareTo(n)>0&&(n=i.readTime)}),s.us.set(e,n)}class sl{constructor(){this.activeTargetIds=_m()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class Ig{constructor(){this.so=new sl,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,n){}addLocalQueryTarget(e,t=!0){return t&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,t,n){this.oo[e]=t}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new sl,Promise.resolve()}handleUserChange(e,t,n){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sg{_o(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rl{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){j("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){j("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let pr=null;function zi(){return pr===null?pr=function(){return 268435456+Math.round(2147483648*Math.random())}():pr++,"0x"+pr.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kg={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ag{constructor(e){this.Io=e.Io,this.To=e.To}Eo(e){this.Ao=e}Ro(e){this.Vo=e}mo(e){this.fo=e}onMessage(e){this.po=e}close(){this.To()}send(e){this.Io(e)}yo(){this.Ao()}wo(){this.Vo()}So(e){this.fo(e)}bo(e){this.po(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xe="WebChannelConnection";class Rg extends class{constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const n=t.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.Do=n+"://"+t.host,this.vo=`projects/${r}/databases/${i}`,this.Co=this.databaseId.database==="(default)"?`project_id=${r}`:`project_id=${r}&database_id=${i}`}get Fo(){return!1}Mo(t,n,r,i,a){const c=zi(),l=this.xo(t,n.toUriEncodedString());j("RestConnection",`Sending RPC '${t}' ${c}:`,l,r);const d={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(d,i,a),this.No(t,l,d,r).then(f=>(j("RestConnection",`Received RPC '${t}' ${c}: `,f),f),f=>{throw kn("RestConnection",`RPC '${t}' ${c} failed with error: `,f,"url: ",l,"request:",r),f})}Lo(t,n,r,i,a,c){return this.Mo(t,n,r,i,a)}Oo(t,n,r){t["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Bn}(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),n&&n.headers.forEach((i,a)=>t[a]=i),r&&r.headers.forEach((i,a)=>t[a]=i)}xo(t,n){const r=kg[t];return`${this.Do}/v1/${n}:${r}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,t,n,r){const i=zi();return new Promise((a,c)=>{const l=new hu;l.setWithCredentials(!0),l.listenOnce(fu.COMPLETE,()=>{try{switch(l.getLastErrorCode()){case vr.NO_ERROR:const f=l.getResponseJson();j(xe,`XHR for RPC '${e}' ${i} received:`,JSON.stringify(f)),a(f);break;case vr.TIMEOUT:j(xe,`RPC '${e}' ${i} timed out`),c(new U(B.DEADLINE_EXCEEDED,"Request time out"));break;case vr.HTTP_ERROR:const m=l.getStatus();if(j(xe,`RPC '${e}' ${i} failed with status:`,m,"response text:",l.getResponseText()),m>0){let _=l.getResponseJson();Array.isArray(_)&&(_=_[0]);const T=_?.error;if(T&&T.status&&T.message){const R=function(D){const x=D.toLowerCase().replace(/_/g,"-");return Object.values(B).indexOf(x)>=0?x:B.UNKNOWN}(T.status);c(new U(R,T.message))}else c(new U(B.UNKNOWN,"Server responded with status "+l.getStatus()))}else c(new U(B.UNAVAILABLE,"Connection failed."));break;default:Y()}}finally{j(xe,`RPC '${e}' ${i} completed.`)}});const d=JSON.stringify(r);j(xe,`RPC '${e}' ${i} sending request:`,r),l.send(t,"POST",d,n,15)})}Bo(e,t,n){const r=zi(),i=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=gu(),c=mu(),l={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},d=this.longPollingOptions.timeoutSeconds;d!==void 0&&(l.longPollingTimeout=Math.round(1e3*d)),this.useFetchStreams&&(l.useFetchStreams=!0),this.Oo(l.initMessageHeaders,t,n),l.encodeInitMessageHeaders=!0;const f=i.join("");j(xe,`Creating RPC '${e}' stream ${r}: ${f}`,l);const m=a.createWebChannel(f,l);let _=!1,T=!1;const R=new Ag({Io:D=>{T?j(xe,`Not sending because RPC '${e}' stream ${r} is closed:`,D):(_||(j(xe,`Opening RPC '${e}' stream ${r} transport.`),m.open(),_=!0),j(xe,`RPC '${e}' stream ${r} sending:`,D),m.send(D))},To:()=>m.close()}),N=(D,x,O)=>{D.listen(x,p=>{try{O(p)}catch(S){setTimeout(()=>{throw S},0)}})};return N(m,cs.EventType.OPEN,()=>{T||(j(xe,`RPC '${e}' stream ${r} transport opened.`),R.yo())}),N(m,cs.EventType.CLOSE,()=>{T||(T=!0,j(xe,`RPC '${e}' stream ${r} transport closed`),R.So())}),N(m,cs.EventType.ERROR,D=>{T||(T=!0,kn(xe,`RPC '${e}' stream ${r} transport errored:`,D),R.So(new U(B.UNAVAILABLE,"The operation could not be completed")))}),N(m,cs.EventType.MESSAGE,D=>{var x;if(!T){const O=D.data[0];ce(!!O);const p=O,S=p.error||((x=p[0])===null||x===void 0?void 0:x.error);if(S){j(xe,`RPC '${e}' stream ${r} received error:`,S);const C=S.status;let V=function(v){const w=ye[v];if(w!==void 0)return ju(w)}(C),b=S.message;V===void 0&&(V=B.INTERNAL,b="Unknown error status: "+C+" with message "+S.message),T=!0,R.So(new U(V,b)),m.close()}else j(xe,`RPC '${e}' stream ${r} received:`,O),R.bo(O)}}),N(c,pu.STAT_EVENT,D=>{D.stat===io.PROXY?j(xe,`RPC '${e}' stream ${r} detected buffering proxy`):D.stat===io.NOPROXY&&j(xe,`RPC '${e}' stream ${r} detected no buffering proxy`)}),setTimeout(()=>{R.wo()},0),R}}function Wi(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ti(s){return new Om(s,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ed{constructor(e,t,n=1e3,r=1.5,i=6e4){this.ui=e,this.timerId=t,this.ko=n,this.qo=r,this.Qo=i,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const t=Math.floor(this.Ko+this.zo()),n=Math.max(0,Date.now()-this.Uo),r=Math.max(0,t-n);r>0&&j("ExponentialBackoff",`Backing off for ${r} ms (base delay: ${this.Ko} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,r,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class td{constructor(e,t,n,r,i,a,c,l){this.ui=e,this.Ho=n,this.Jo=r,this.connection=i,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=c,this.listener=l,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new ed(e,t)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,t){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,e!==4?this.t_.reset():t&&t.code===B.RESOURCE_EXHAUSTED?(_t(t.toString()),_t("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):t&&t.code===B.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(t)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),t=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([n,r])=>{this.Yo===t&&this.P_(n,r)},n=>{e(()=>{const r=new U(B.UNKNOWN,"Fetching auth token failed: "+n.message);return this.I_(r)})})}P_(e,t){const n=this.h_(this.Yo);this.stream=this.T_(e,t),this.stream.Eo(()=>{n(()=>this.listener.Eo())}),this.stream.Ro(()=>{n(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(r=>{n(()=>this.I_(r))}),this.stream.onMessage(r=>{n(()=>++this.e_==1?this.E_(r):this.onNext(r))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(e){return j("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return t=>{this.ui.enqueueAndForget(()=>this.Yo===e?t():(j("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class Cg extends td{constructor(e,t,n,r,i,a){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,n,r,a),this.serializer=i}T_(e,t){return this.connection.Bo("Listen",e,t)}E_(e){return this.onNext(e)}onNext(e){this.t_.reset();const t=Um(this.serializer,e),n=function(i){if(!("targetChange"in i))return X.min();const a=i.targetChange;return a.targetIds&&a.targetIds.length?X.min():a.readTime?at(a.readTime):X.min()}(e);return this.listener.d_(t,n)}A_(e){const t={};t.database=mo(this.serializer),t.addTarget=function(i,a){let c;const l=a.target;if(c=lo(l)?{documents:zm(i,l)}:{query:Wm(i,l)._t},c.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){c.resumeToken=Wu(i,a.resumeToken);const d=ho(i,a.expectedCount);d!==null&&(c.expectedCount=d)}else if(a.snapshotVersion.compareTo(X.min())>0){c.readTime=Vr(i,a.snapshotVersion.toTimestamp());const d=ho(i,a.expectedCount);d!==null&&(c.expectedCount=d)}return c}(this.serializer,e);const n=Km(this.serializer,e);n&&(t.labels=n),this.a_(t)}R_(e){const t={};t.database=mo(this.serializer),t.removeTarget=e,this.a_(t)}}class Dg extends td{constructor(e,t,n,r,i,a){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,n,r,a),this.serializer=i}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(e,t){return this.connection.Bo("Write",e,t)}E_(e){return ce(!!e.streamToken),this.lastStreamToken=e.streamToken,ce(!e.writeResults||e.writeResults.length===0),this.listener.f_()}onNext(e){ce(!!e.streamToken),this.lastStreamToken=e.streamToken,this.t_.reset();const t=qm(e.writeResults,e.commitTime),n=at(e.commitTime);return this.listener.g_(n,t)}p_(){const e={};e.database=mo(this.serializer),this.a_(e)}m_(e){const t={streamToken:this.lastStreamToken,writes:e.map(n=>jm(this.serializer,n))};this.a_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pg extends class{}{constructor(e,t,n,r){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=n,this.serializer=r,this.y_=!1}w_(){if(this.y_)throw new U(B.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,t,n,r){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,a])=>this.connection.Mo(e,fo(t,n),r,i,a)).catch(i=>{throw i.name==="FirebaseError"?(i.code===B.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new U(B.UNKNOWN,i.toString())})}Lo(e,t,n,r,i){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([a,c])=>this.connection.Lo(e,fo(t,n),r,a,c,i)).catch(a=>{throw a.name==="FirebaseError"?(a.code===B.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new U(B.UNKNOWN,a.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class Ng{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(e){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,e==="Online"&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(_t(t),this.D_=!1):j("OnlineStateTracker",t)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lg{constructor(e,t,n,r,i){this.localStore=e,this.datastore=t,this.asyncQueue=n,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=i,this.k_._o(a=>{n.enqueueAndForget(async()=>{cn(this)&&(j("RemoteStore","Restarting streams for network reachability change."),await async function(l){const d=Z(l);d.L_.add(4),await Ms(d),d.q_.set("Unknown"),d.L_.delete(4),await ni(d)}(this))})}),this.q_=new Ng(n,r)}}async function ni(s){if(cn(s))for(const e of s.B_)await e(!0)}async function Ms(s){for(const e of s.B_)await e(!1)}function nd(s,e){const t=Z(s);t.N_.has(e.targetId)||(t.N_.set(e.targetId,e),Go(t)?Ko(t):Fn(t).r_()&&Ho(t,e))}function Wo(s,e){const t=Z(s),n=Fn(t);t.N_.delete(e),n.r_()&&sd(t,e),t.N_.size===0&&(n.r_()?n.o_():cn(t)&&t.q_.set("Unknown"))}function Ho(s,e){if(s.Q_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(X.min())>0){const t=s.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}Fn(s).A_(e)}function sd(s,e){s.Q_.xe(e),Fn(s).R_(e)}function Ko(s){s.Q_=new xm({getRemoteKeysForTarget:e=>s.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>s.N_.get(e)||null,tt:()=>s.datastore.serializer.databaseId}),Fn(s).start(),s.q_.v_()}function Go(s){return cn(s)&&!Fn(s).n_()&&s.N_.size>0}function cn(s){return Z(s).L_.size===0}function rd(s){s.Q_=void 0}async function xg(s){s.q_.set("Online")}async function Vg(s){s.N_.forEach((e,t)=>{Ho(s,e)})}async function Bg(s,e){rd(s),Go(s)?(s.q_.M_(e),Ko(s)):s.q_.set("Unknown")}async function Mg(s,e,t){if(s.q_.set("Online"),e instanceof zu&&e.state===2&&e.cause)try{await async function(r,i){const a=i.cause;for(const c of i.targetIds)r.N_.has(c)&&(await r.remoteSyncer.rejectListen(c,a),r.N_.delete(c),r.Q_.removeTarget(c))}(s,e)}catch(n){j("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),n),await Br(s,n)}else if(e instanceof Er?s.Q_.Ke(e):e instanceof qu?s.Q_.He(e):s.Q_.We(e),!t.isEqual(X.min()))try{const n=await Zu(s.localStore);t.compareTo(n)>=0&&await function(i,a){const c=i.Q_.rt(a);return c.targetChanges.forEach((l,d)=>{if(l.resumeToken.approximateByteSize()>0){const f=i.N_.get(d);f&&i.N_.set(d,f.withResumeToken(l.resumeToken,a))}}),c.targetMismatches.forEach((l,d)=>{const f=i.N_.get(l);if(!f)return;i.N_.set(l,f.withResumeToken(Ce.EMPTY_BYTE_STRING,f.snapshotVersion)),sd(i,l);const m=new Nt(f.target,l,d,f.sequenceNumber);Ho(i,m)}),i.remoteSyncer.applyRemoteEvent(c)}(s,t)}catch(n){j("RemoteStore","Failed to raise snapshot:",n),await Br(s,n)}}async function Br(s,e,t){if(!xs(e))throw e;s.L_.add(1),await Ms(s),s.q_.set("Offline"),t||(t=()=>Zu(s.localStore)),s.asyncQueue.enqueueRetryable(async()=>{j("RemoteStore","Retrying IndexedDB access"),await t(),s.L_.delete(1),await ni(s)})}function id(s,e){return e().catch(t=>Br(s,t,e))}async function si(s){const e=Z(s),t=Ft(e);let n=e.O_.length>0?e.O_[e.O_.length-1].batchId:-1;for(;Og(e);)try{const r=await wg(e.localStore,n);if(r===null){e.O_.length===0&&t.o_();break}n=r.batchId,$g(e,r)}catch(r){await Br(e,r)}od(e)&&ad(e)}function Og(s){return cn(s)&&s.O_.length<10}function $g(s,e){s.O_.push(e);const t=Ft(s);t.r_()&&t.V_&&t.m_(e.mutations)}function od(s){return cn(s)&&!Ft(s).n_()&&s.O_.length>0}function ad(s){Ft(s).start()}async function Fg(s){Ft(s).p_()}async function Ug(s){const e=Ft(s);for(const t of s.O_)e.m_(t.mutations)}async function jg(s,e,t){const n=s.O_.shift(),r=$o.from(n,e,t);await id(s,()=>s.remoteSyncer.applySuccessfulWrite(r)),await si(s)}async function qg(s,e){e&&Ft(s).V_&&await async function(n,r){if(function(a){return Pm(a)&&a!==B.ABORTED}(r.code)){const i=n.O_.shift();Ft(n).s_(),await id(n,()=>n.remoteSyncer.rejectFailedWrite(i.batchId,r)),await si(n)}}(s,e),od(s)&&ad(s)}async function il(s,e){const t=Z(s);t.asyncQueue.verifyOperationInProgress(),j("RemoteStore","RemoteStore received new credentials");const n=cn(t);t.L_.add(3),await Ms(t),n&&t.q_.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.L_.delete(3),await ni(t)}async function zg(s,e){const t=Z(s);e?(t.L_.delete(2),await ni(t)):e||(t.L_.add(2),await Ms(t),t.q_.set("Unknown"))}function Fn(s){return s.K_||(s.K_=function(t,n,r){const i=Z(t);return i.w_(),new Cg(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,r)}(s.datastore,s.asyncQueue,{Eo:xg.bind(null,s),Ro:Vg.bind(null,s),mo:Bg.bind(null,s),d_:Mg.bind(null,s)}),s.B_.push(async e=>{e?(s.K_.s_(),Go(s)?Ko(s):s.q_.set("Unknown")):(await s.K_.stop(),rd(s))})),s.K_}function Ft(s){return s.U_||(s.U_=function(t,n,r){const i=Z(t);return i.w_(),new Dg(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,r)}(s.datastore,s.asyncQueue,{Eo:()=>Promise.resolve(),Ro:Fg.bind(null,s),mo:qg.bind(null,s),f_:Ug.bind(null,s),g_:jg.bind(null,s)}),s.B_.push(async e=>{e?(s.U_.s_(),await si(s)):(await s.U_.stop(),s.O_.length>0&&(j("RemoteStore",`Stopping write stream with ${s.O_.length} pending writes`),s.O_=[]))})),s.U_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qo{constructor(e,t,n,r,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=n,this.op=r,this.removalCallback=i,this.deferred=new Bt,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(a=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,n,r,i){const a=Date.now()+n,c=new Qo(e,t,a,r,i);return c.start(n),c}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new U(B.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Yo(s,e){if(_t("AsyncQueue",`${e}: ${s}`),xs(s))return new U(B.UNAVAILABLE,`${e}: ${s}`);throw s}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wn{constructor(e){this.comparator=e?(t,n)=>e(t,n)||K.comparator(t.key,n.key):(t,n)=>K.comparator(t.key,n.key),this.keyedMap=ls(),this.sortedSet=new pe(this.comparator)}static emptySet(e){return new wn(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,n)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof wn)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),n=e.sortedSet.getIterator();for(;t.hasNext();){const r=t.getNext().key,i=n.getNext().key;if(!r.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const n=new wn;return n.comparator=this.comparator,n.keyedMap=e,n.sortedSet=t,n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ol{constructor(){this.W_=new pe(K.comparator)}track(e){const t=e.doc.key,n=this.W_.get(t);n?e.type!==0&&n.type===3?this.W_=this.W_.insert(t,e):e.type===3&&n.type!==1?this.W_=this.W_.insert(t,{type:n.type,doc:e.doc}):e.type===2&&n.type===2?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):e.type===2&&n.type===0?this.W_=this.W_.insert(t,{type:0,doc:e.doc}):e.type===1&&n.type===0?this.W_=this.W_.remove(t):e.type===1&&n.type===2?this.W_=this.W_.insert(t,{type:1,doc:n.doc}):e.type===0&&n.type===1?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):Y():this.W_=this.W_.insert(t,e)}G_(){const e=[];return this.W_.inorderTraversal((t,n)=>{e.push(n)}),e}}class Pn{constructor(e,t,n,r,i,a,c,l,d){this.query=e,this.docs=t,this.oldDocs=n,this.docChanges=r,this.mutatedKeys=i,this.fromCache=a,this.syncStateChanged=c,this.excludesMetadataChanges=l,this.hasCachedResults=d}static fromInitialDocuments(e,t,n,r,i){const a=[];return t.forEach(c=>{a.push({type:0,doc:c})}),new Pn(e,t,wn.emptySet(t),a,n,r,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Yr(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,n=e.docChanges;if(t.length!==n.length)return!1;for(let r=0;r<t.length;r++)if(t[r].type!==n[r].type||!t[r].doc.isEqual(n[r].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wg{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(e=>e.J_())}}class Hg{constructor(){this.queries=al(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(t,n){const r=Z(t),i=r.queries;r.queries=al(),i.forEach((a,c)=>{for(const l of c.j_)l.onError(n)})})(this,new U(B.ABORTED,"Firestore shutting down"))}}function al(){return new $n(s=>Du(s),Yr)}async function Kg(s,e){const t=Z(s);let n=3;const r=e.query;let i=t.queries.get(r);i?!i.H_()&&e.J_()&&(n=2):(i=new Wg,n=e.J_()?0:1);try{switch(n){case 0:i.z_=await t.onListen(r,!0);break;case 1:i.z_=await t.onListen(r,!1);break;case 2:await t.onFirstRemoteStoreListen(r)}}catch(a){const c=Yo(a,`Initialization of query '${gn(e.query)}' failed`);return void e.onError(c)}t.queries.set(r,i),i.j_.push(e),e.Z_(t.onlineState),i.z_&&e.X_(i.z_)&&Jo(t)}async function Gg(s,e){const t=Z(s),n=e.query;let r=3;const i=t.queries.get(n);if(i){const a=i.j_.indexOf(e);a>=0&&(i.j_.splice(a,1),i.j_.length===0?r=e.J_()?0:1:!i.H_()&&e.J_()&&(r=2))}switch(r){case 0:return t.queries.delete(n),t.onUnlisten(n,!0);case 1:return t.queries.delete(n),t.onUnlisten(n,!1);case 2:return t.onLastRemoteStoreUnlisten(n);default:return}}function Qg(s,e){const t=Z(s);let n=!1;for(const r of e){const i=r.query,a=t.queries.get(i);if(a){for(const c of a.j_)c.X_(r)&&(n=!0);a.z_=r}}n&&Jo(t)}function Yg(s,e,t){const n=Z(s),r=n.queries.get(e);if(r)for(const i of r.j_)i.onError(t);n.queries.delete(e)}function Jo(s){s.Y_.forEach(e=>{e.next()})}var yo,cl;(cl=yo||(yo={})).ea="default",cl.Cache="cache";class Jg{constructor(e,t,n){this.query=e,this.ta=t,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=n||{}}X_(e){if(!this.options.includeMetadataChanges){const n=[];for(const r of e.docChanges)r.type!==3&&n.push(r);e=new Pn(e.query,e.docs,e.oldDocs,n,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.na?this.ia(e)&&(this.ta.next(e),t=!0):this.sa(e,this.onlineState)&&(this.oa(e),t=!0),this.ra=e,t}onError(e){this.ta.error(e)}Z_(e){this.onlineState=e;let t=!1;return this.ra&&!this.na&&this.sa(this.ra,e)&&(this.oa(this.ra),t=!0),t}sa(e,t){if(!e.fromCache||!this.J_())return!0;const n=t!=="Offline";return(!this.options._a||!n)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}ia(e){if(e.docChanges.length>0)return!0;const t=this.ra&&this.ra.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}oa(e){e=Pn.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.na=!0,this.ta.next(e)}J_(){return this.options.source!==yo.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cd{constructor(e){this.key=e}}class ld{constructor(e){this.key=e}}class Xg{constructor(e,t){this.query=e,this.Ta=t,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=ne(),this.mutatedKeys=ne(),this.Aa=Pu(e),this.Ra=new wn(this.Aa)}get Va(){return this.Ta}ma(e,t){const n=t?t.fa:new ol,r=t?t.Ra:this.Ra;let i=t?t.mutatedKeys:this.mutatedKeys,a=r,c=!1;const l=this.query.limitType==="F"&&r.size===this.query.limit?r.last():null,d=this.query.limitType==="L"&&r.size===this.query.limit?r.first():null;if(e.inorderTraversal((f,m)=>{const _=r.get(f),T=Jr(this.query,m)?m:null,R=!!_&&this.mutatedKeys.has(_.key),N=!!T&&(T.hasLocalMutations||this.mutatedKeys.has(T.key)&&T.hasCommittedMutations);let D=!1;_&&T?_.data.isEqual(T.data)?R!==N&&(n.track({type:3,doc:T}),D=!0):this.ga(_,T)||(n.track({type:2,doc:T}),D=!0,(l&&this.Aa(T,l)>0||d&&this.Aa(T,d)<0)&&(c=!0)):!_&&T?(n.track({type:0,doc:T}),D=!0):_&&!T&&(n.track({type:1,doc:_}),D=!0,(l||d)&&(c=!0)),D&&(T?(a=a.add(T),i=N?i.add(f):i.delete(f)):(a=a.delete(f),i=i.delete(f)))}),this.query.limit!==null)for(;a.size>this.query.limit;){const f=this.query.limitType==="F"?a.last():a.first();a=a.delete(f.key),i=i.delete(f.key),n.track({type:1,doc:f})}return{Ra:a,fa:n,ns:c,mutatedKeys:i}}ga(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,n,r){const i=this.Ra;this.Ra=e.Ra,this.mutatedKeys=e.mutatedKeys;const a=e.fa.G_();a.sort((f,m)=>function(T,R){const N=D=>{switch(D){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return Y()}};return N(T)-N(R)}(f.type,m.type)||this.Aa(f.doc,m.doc)),this.pa(n),r=r!=null&&r;const c=t&&!r?this.ya():[],l=this.da.size===0&&this.current&&!r?1:0,d=l!==this.Ea;return this.Ea=l,a.length!==0||d?{snapshot:new Pn(this.query,e.Ra,i,a,e.mutatedKeys,l===0,d,!1,!!n&&n.resumeToken.approximateByteSize()>0),wa:c}:{wa:c}}Z_(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new ol,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(e){return!this.Ta.has(e)&&!!this.Ra.has(e)&&!this.Ra.get(e).hasLocalMutations}pa(e){e&&(e.addedDocuments.forEach(t=>this.Ta=this.Ta.add(t)),e.modifiedDocuments.forEach(t=>{}),e.removedDocuments.forEach(t=>this.Ta=this.Ta.delete(t)),this.current=e.current)}ya(){if(!this.current)return[];const e=this.da;this.da=ne(),this.Ra.forEach(n=>{this.Sa(n.key)&&(this.da=this.da.add(n.key))});const t=[];return e.forEach(n=>{this.da.has(n)||t.push(new ld(n))}),this.da.forEach(n=>{e.has(n)||t.push(new cd(n))}),t}ba(e){this.Ta=e.Ts,this.da=ne();const t=this.ma(e.documents);return this.applyChanges(t,!0)}Da(){return Pn.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class Zg{constructor(e,t,n){this.query=e,this.targetId=t,this.view=n}}class ey{constructor(e){this.key=e,this.va=!1}}class ty{constructor(e,t,n,r,i,a){this.localStore=e,this.remoteStore=t,this.eventManager=n,this.sharedClientState=r,this.currentUser=i,this.maxConcurrentLimboResolutions=a,this.Ca={},this.Fa=new $n(c=>Du(c),Yr),this.Ma=new Map,this.xa=new Set,this.Oa=new pe(K.comparator),this.Na=new Map,this.La=new jo,this.Ba={},this.ka=new Map,this.qa=Dn.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function ny(s,e,t=!0){const n=md(s);let r;const i=n.Fa.get(e);return i?(n.sharedClientState.addLocalQueryTarget(i.targetId),r=i.view.Da()):r=await ud(n,e,t,!0),r}async function sy(s,e){const t=md(s);await ud(t,e,!0,!1)}async function ud(s,e,t,n){const r=await Eg(s.localStore,it(e)),i=r.targetId,a=s.sharedClientState.addLocalQueryTarget(i,t);let c;return n&&(c=await ry(s,e,i,a==="current",r.resumeToken)),s.isPrimaryClient&&t&&nd(s.remoteStore,r),c}async function ry(s,e,t,n,r){s.Ka=(m,_,T)=>async function(N,D,x,O){let p=D.view.ma(x);p.ns&&(p=await nl(N.localStore,D.query,!1).then(({documents:b})=>D.view.ma(b,p)));const S=O&&O.targetChanges.get(D.targetId),C=O&&O.targetMismatches.get(D.targetId)!=null,V=D.view.applyChanges(p,N.isPrimaryClient,S,C);return ul(N,D.targetId,V.wa),V.snapshot}(s,m,_,T);const i=await nl(s.localStore,e,!0),a=new Xg(e,i.Ts),c=a.ma(i.documents),l=Bs.createSynthesizedTargetChangeForCurrentChange(t,n&&s.onlineState!=="Offline",r),d=a.applyChanges(c,s.isPrimaryClient,l);ul(s,t,d.wa);const f=new Zg(e,t,a);return s.Fa.set(e,f),s.Ma.has(t)?s.Ma.get(t).push(e):s.Ma.set(t,[e]),d.snapshot}async function iy(s,e,t){const n=Z(s),r=n.Fa.get(e),i=n.Ma.get(r.targetId);if(i.length>1)return n.Ma.set(r.targetId,i.filter(a=>!Yr(a,e))),void n.Fa.delete(e);n.isPrimaryClient?(n.sharedClientState.removeLocalQueryTarget(r.targetId),n.sharedClientState.isActiveQueryTarget(r.targetId)||await go(n.localStore,r.targetId,!1).then(()=>{n.sharedClientState.clearQueryState(r.targetId),t&&Wo(n.remoteStore,r.targetId),_o(n,r.targetId)}).catch(Ls)):(_o(n,r.targetId),await go(n.localStore,r.targetId,!0))}async function oy(s,e){const t=Z(s),n=t.Fa.get(e),r=t.Ma.get(n.targetId);t.isPrimaryClient&&r.length===1&&(t.sharedClientState.removeLocalQueryTarget(n.targetId),Wo(t.remoteStore,n.targetId))}async function ay(s,e,t){const n=py(s);try{const r=await function(a,c){const l=Z(a),d=Ee.now(),f=c.reduce((T,R)=>T.add(R.key),ne());let m,_;return l.persistence.runTransaction("Locally write mutations","readwrite",T=>{let R=vt(),N=ne();return l.cs.getEntries(T,f).next(D=>{R=D,R.forEach((x,O)=>{O.isValidDocument()||(N=N.add(x))})}).next(()=>l.localDocuments.getOverlayedDocuments(T,R)).next(D=>{m=D;const x=[];for(const O of c){const p=km(O,m.get(O.key).overlayedDocument);p!=null&&x.push(new an(O.key,p,wu(p.value.mapValue),ot.exists(!0)))}return l.mutationQueue.addMutationBatch(T,d,x,c)}).next(D=>{_=D;const x=D.applyToLocalDocumentSet(m,N);return l.documentOverlayCache.saveOverlays(T,D.batchId,x)})}).then(()=>({batchId:_.batchId,changes:Lu(m)}))}(n.localStore,e);n.sharedClientState.addPendingMutation(r.batchId),function(a,c,l){let d=a.Ba[a.currentUser.toKey()];d||(d=new pe(oe)),d=d.insert(c,l),a.Ba[a.currentUser.toKey()]=d}(n,r.batchId,t),await Os(n,r.changes),await si(n.remoteStore)}catch(r){const i=Yo(r,"Failed to persist write");t.reject(i)}}async function dd(s,e){const t=Z(s);try{const n=await vg(t.localStore,e);e.targetChanges.forEach((r,i)=>{const a=t.Na.get(i);a&&(ce(r.addedDocuments.size+r.modifiedDocuments.size+r.removedDocuments.size<=1),r.addedDocuments.size>0?a.va=!0:r.modifiedDocuments.size>0?ce(a.va):r.removedDocuments.size>0&&(ce(a.va),a.va=!1))}),await Os(t,n,e)}catch(n){await Ls(n)}}function ll(s,e,t){const n=Z(s);if(n.isPrimaryClient&&t===0||!n.isPrimaryClient&&t===1){const r=[];n.Fa.forEach((i,a)=>{const c=a.view.Z_(e);c.snapshot&&r.push(c.snapshot)}),function(a,c){const l=Z(a);l.onlineState=c;let d=!1;l.queries.forEach((f,m)=>{for(const _ of m.j_)_.Z_(c)&&(d=!0)}),d&&Jo(l)}(n.eventManager,e),r.length&&n.Ca.d_(r),n.onlineState=e,n.isPrimaryClient&&n.sharedClientState.setOnlineState(e)}}async function cy(s,e,t){const n=Z(s);n.sharedClientState.updateQueryState(e,"rejected",t);const r=n.Na.get(e),i=r&&r.key;if(i){let a=new pe(K.comparator);a=a.insert(i,Be.newNoDocument(i,X.min()));const c=ne().add(i),l=new ei(X.min(),new Map,new pe(oe),a,c);await dd(n,l),n.Oa=n.Oa.remove(i),n.Na.delete(e),Xo(n)}else await go(n.localStore,e,!1).then(()=>_o(n,e,t)).catch(Ls)}async function ly(s,e){const t=Z(s),n=e.batch.batchId;try{const r=await _g(t.localStore,e);fd(t,n,null),hd(t,n),t.sharedClientState.updateMutationState(n,"acknowledged"),await Os(t,r)}catch(r){await Ls(r)}}async function uy(s,e,t){const n=Z(s);try{const r=await function(a,c){const l=Z(a);return l.persistence.runTransaction("Reject batch","readwrite-primary",d=>{let f;return l.mutationQueue.lookupMutationBatch(d,c).next(m=>(ce(m!==null),f=m.keys(),l.mutationQueue.removeMutationBatch(d,m))).next(()=>l.mutationQueue.performConsistencyCheck(d)).next(()=>l.documentOverlayCache.removeOverlaysForBatchId(d,f,c)).next(()=>l.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(d,f)).next(()=>l.localDocuments.getDocuments(d,f))})}(n.localStore,e);fd(n,e,t),hd(n,e),n.sharedClientState.updateMutationState(e,"rejected",t),await Os(n,r)}catch(r){await Ls(r)}}function hd(s,e){(s.ka.get(e)||[]).forEach(t=>{t.resolve()}),s.ka.delete(e)}function fd(s,e,t){const n=Z(s);let r=n.Ba[n.currentUser.toKey()];if(r){const i=r.get(e);i&&(t?i.reject(t):i.resolve(),r=r.remove(e)),n.Ba[n.currentUser.toKey()]=r}}function _o(s,e,t=null){s.sharedClientState.removeLocalQueryTarget(e);for(const n of s.Ma.get(e))s.Fa.delete(n),t&&s.Ca.$a(n,t);s.Ma.delete(e),s.isPrimaryClient&&s.La.gr(e).forEach(n=>{s.La.containsKey(n)||pd(s,n)})}function pd(s,e){s.xa.delete(e.path.canonicalString());const t=s.Oa.get(e);t!==null&&(Wo(s.remoteStore,t),s.Oa=s.Oa.remove(e),s.Na.delete(t),Xo(s))}function ul(s,e,t){for(const n of t)n instanceof cd?(s.La.addReference(n.key,e),dy(s,n)):n instanceof ld?(j("SyncEngine","Document no longer in limbo: "+n.key),s.La.removeReference(n.key,e),s.La.containsKey(n.key)||pd(s,n.key)):Y()}function dy(s,e){const t=e.key,n=t.path.canonicalString();s.Oa.get(t)||s.xa.has(n)||(j("SyncEngine","New document in limbo: "+t),s.xa.add(n),Xo(s))}function Xo(s){for(;s.xa.size>0&&s.Oa.size<s.maxConcurrentLimboResolutions;){const e=s.xa.values().next().value;s.xa.delete(e);const t=new K(fe.fromString(e)),n=s.qa.next();s.Na.set(n,new ey(t)),s.Oa=s.Oa.insert(t,n),nd(s.remoteStore,new Nt(it(Ru(t.path)),n,"TargetPurposeLimboResolution",Po.oe))}}async function Os(s,e,t){const n=Z(s),r=[],i=[],a=[];n.Fa.isEmpty()||(n.Fa.forEach((c,l)=>{a.push(n.Ka(l,e,t).then(d=>{var f;if((d||t)&&n.isPrimaryClient){const m=d?!d.fromCache:(f=t?.targetChanges.get(l.targetId))===null||f===void 0?void 0:f.current;n.sharedClientState.updateQueryState(l.targetId,m?"current":"not-current")}if(d){r.push(d);const m=zo.Wi(l.targetId,d);i.push(m)}}))}),await Promise.all(a),n.Ca.d_(r),await async function(l,d){const f=Z(l);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",m=>M.forEach(d,_=>M.forEach(_.$i,T=>f.persistence.referenceDelegate.addReference(m,_.targetId,T)).next(()=>M.forEach(_.Ui,T=>f.persistence.referenceDelegate.removeReference(m,_.targetId,T)))))}catch(m){if(!xs(m))throw m;j("LocalStore","Failed to update sequence numbers: "+m)}for(const m of d){const _=m.targetId;if(!m.fromCache){const T=f.os.get(_),R=T.snapshotVersion,N=T.withLastLimboFreeSnapshotVersion(R);f.os=f.os.insert(_,N)}}}(n.localStore,i))}async function hy(s,e){const t=Z(s);if(!t.currentUser.isEqual(e)){j("SyncEngine","User change. New user:",e.toKey());const n=await Xu(t.localStore,e);t.currentUser=e,function(i,a){i.ka.forEach(c=>{c.forEach(l=>{l.reject(new U(B.CANCELLED,a))})}),i.ka.clear()}(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,n.removedBatchIds,n.addedBatchIds),await Os(t,n.hs)}}function fy(s,e){const t=Z(s),n=t.Na.get(e);if(n&&n.va)return ne().add(n.key);{let r=ne();const i=t.Ma.get(e);if(!i)return r;for(const a of i){const c=t.Fa.get(a);r=r.unionWith(c.view.Va)}return r}}function md(s){const e=Z(s);return e.remoteStore.remoteSyncer.applyRemoteEvent=dd.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=fy.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=cy.bind(null,e),e.Ca.d_=Qg.bind(null,e.eventManager),e.Ca.$a=Yg.bind(null,e.eventManager),e}function py(s){const e=Z(s);return e.remoteStore.remoteSyncer.applySuccessfulWrite=ly.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=uy.bind(null,e),e}class Mr{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=ti(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,t){return null}Ha(e,t){return null}za(e){return yg(this.persistence,new mg,e.initialUser,this.serializer)}Ga(e){return new hg(qo.Zr,this.serializer)}Wa(e){return new Ig}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Mr.provider={build:()=>new Mr};class vo{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=n=>ll(this.syncEngine,n,1),this.remoteStore.remoteSyncer.handleCredentialChange=hy.bind(null,this.syncEngine),await zg(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new Hg}()}createDatastore(e){const t=ti(e.databaseInfo.databaseId),n=function(i){return new Rg(i)}(e.databaseInfo);return function(i,a,c,l){return new Pg(i,a,c,l)}(e.authCredentials,e.appCheckCredentials,n,t)}createRemoteStore(e){return function(n,r,i,a,c){return new Lg(n,r,i,a,c)}(this.localStore,this.datastore,e.asyncQueue,t=>ll(this.syncEngine,t,0),function(){return rl.D()?new rl:new Sg}())}createSyncEngine(e,t){return function(r,i,a,c,l,d,f){const m=new ty(r,i,a,c,l,d);return f&&(m.Qa=!0),m}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(r){const i=Z(r);j("RemoteStore","RemoteStore shutting down."),i.L_.add(5),await Ms(i),i.k_.shutdown(),i.q_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}vo.provider={build:()=>new vo};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class my{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ya(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ya(this.observer.error,e):_t("Uncaught Error in snapshot listener:",e.toString()))}Za(){this.muted=!0}Ya(e,t){setTimeout(()=>{this.muted||e(t)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gy{constructor(e,t,n,r,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=n,this.databaseInfo=r,this.user=Ve.UNAUTHENTICATED,this.clientId=_u.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(n,async a=>{j("FirestoreClient","Received user=",a.uid),await this.authCredentialListener(a),this.user=a}),this.appCheckCredentials.start(n,a=>(j("FirestoreClient","Received new app check token=",a),this.appCheckCredentialListener(a,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Bt;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const n=Yo(t,"Failed to shutdown persistence");e.reject(n)}}),e.promise}}async function Hi(s,e){s.asyncQueue.verifyOperationInProgress(),j("FirestoreClient","Initializing OfflineComponentProvider");const t=s.configuration;await e.initialize(t);let n=t.initialUser;s.setCredentialChangeListener(async r=>{n.isEqual(r)||(await Xu(e.localStore,r),n=r)}),e.persistence.setDatabaseDeletedListener(()=>s.terminate()),s._offlineComponents=e}async function dl(s,e){s.asyncQueue.verifyOperationInProgress();const t=await yy(s);j("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(t,s.configuration),s.setCredentialChangeListener(n=>il(e.remoteStore,n)),s.setAppCheckTokenChangeListener((n,r)=>il(e.remoteStore,r)),s._onlineComponents=e}async function yy(s){if(!s._offlineComponents)if(s._uninitializedComponentsProvider){j("FirestoreClient","Using user provided OfflineComponentProvider");try{await Hi(s,s._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!function(r){return r.name==="FirebaseError"?r.code===B.FAILED_PRECONDITION||r.code===B.UNIMPLEMENTED:!(typeof DOMException<"u"&&r instanceof DOMException)||r.code===22||r.code===20||r.code===11}(t))throw t;kn("Error using user provided cache. Falling back to memory cache: "+t),await Hi(s,new Mr)}}else j("FirestoreClient","Using default OfflineComponentProvider"),await Hi(s,new Mr);return s._offlineComponents}async function gd(s){return s._onlineComponents||(s._uninitializedComponentsProvider?(j("FirestoreClient","Using user provided OnlineComponentProvider"),await dl(s,s._uninitializedComponentsProvider._online)):(j("FirestoreClient","Using default OnlineComponentProvider"),await dl(s,new vo))),s._onlineComponents}function _y(s){return gd(s).then(e=>e.syncEngine)}async function vy(s){const e=await gd(s),t=e.eventManager;return t.onListen=ny.bind(null,e.syncEngine),t.onUnlisten=iy.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=sy.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=oy.bind(null,e.syncEngine),t}function by(s,e,t={}){const n=new Bt;return s.asyncQueue.enqueueAndForget(async()=>function(i,a,c,l,d){const f=new my({next:_=>{f.Za(),a.enqueueAndForget(()=>Gg(i,m)),_.fromCache&&l.source==="server"?d.reject(new U(B.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):d.resolve(_)},error:_=>d.reject(_)}),m=new Jg(c,f,{includeMetadataChanges:!0,_a:!0});return Kg(i,m)}(await vy(s),s.asyncQueue,e,t,n)),n.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yd(s){const e={};return s.timeoutSeconds!==void 0&&(e.timeoutSeconds=s.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hl=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _d(s,e,t){if(!t)throw new U(B.INVALID_ARGUMENT,`Function ${s}() cannot be called with an empty ${e}.`)}function wy(s,e,t,n){if(e===!0&&n===!0)throw new U(B.INVALID_ARGUMENT,`${s} and ${t} cannot be used together.`)}function fl(s){if(!K.isDocumentKey(s))throw new U(B.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${s} has ${s.length}.`)}function pl(s){if(K.isDocumentKey(s))throw new U(B.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${s} has ${s.length}.`)}function ri(s){if(s===void 0)return"undefined";if(s===null)return"null";if(typeof s=="string")return s.length>20&&(s=`${s.substring(0,20)}...`),JSON.stringify(s);if(typeof s=="number"||typeof s=="boolean")return""+s;if(typeof s=="object"){if(s instanceof Array)return"an array";{const e=function(n){return n.constructor?n.constructor.name:null}(s);return e?`a custom ${e} object`:"an object"}}return typeof s=="function"?"a function":Y()}function As(s,e){if("_delegate"in s&&(s=s._delegate),!(s instanceof e)){if(e.name===s.constructor.name)throw new U(B.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=ri(s);throw new U(B.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return s}function Ey(s,e){if(e<=0)throw new U(B.INVALID_ARGUMENT,`Function ${s}() requires a positive number, but it was: ${e}.`)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ml{constructor(e){var t,n;if(e.host===void 0){if(e.ssl!==void 0)throw new U(B.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(t=e.ssl)===null||t===void 0||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new U(B.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}wy("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=yd((n=e.experimentalLongPollingOptions)!==null&&n!==void 0?n:{}),function(i){if(i.timeoutSeconds!==void 0){if(isNaN(i.timeoutSeconds))throw new U(B.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (must not be NaN)`);if(i.timeoutSeconds<5)throw new U(B.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (minimum allowed value is 5)`);if(i.timeoutSeconds>30)throw new U(B.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(n,r){return n.timeoutSeconds===r.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class ii{constructor(e,t,n,r){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=n,this._app=r,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new ml({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new U(B.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new U(B.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new ml(e),e.credentials!==void 0&&(this._authCredentials=function(n){if(!n)return new xp;switch(n.type){case"firstParty":return new Op(n.sessionIndex||"0",n.iamToken||null,n.authTokenFactory||null);case"provider":return n.client;default:throw new U(B.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const n=hl.get(t);n&&(j("ComponentProvider","Removing Datastore"),hl.delete(t),n.terminate())}(this),Promise.resolve()}}function Ty(s,e,t,n={}){var r;const i=(s=As(s,ii))._getSettings(),a=`${e}:${t}`;if(i.host!=="firestore.googleapis.com"&&i.host!==a&&kn("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),s._setSettings(Object.assign(Object.assign({},i),{host:a,ssl:!1})),n.mockUserToken){let c,l;if(typeof n.mockUserToken=="string")c=n.mockUserToken,l=Ve.MOCK_USER;else{c=cf(n.mockUserToken,(r=s._app)===null||r===void 0?void 0:r.options.projectId);const d=n.mockUserToken.sub||n.mockUserToken.user_id;if(!d)throw new U(B.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");l=new Ve(d)}s._authCredentials=new Vp(new yu(c,l))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jt{constructor(e,t,n){this.converter=t,this._query=n,this.type="query",this.firestore=e}withConverter(e){return new jt(this.firestore,e,this._query)}}class Qe{constructor(e,t,n){this.converter=t,this._key=n,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Mt(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Qe(this.firestore,e,this._key)}}class Mt extends jt{constructor(e,t,n){super(e,t,Ru(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Qe(this.firestore,null,new K(e))}withConverter(e){return new Mt(this.firestore,e,this._path)}}function z(s,e,...t){if(s=je(s),_d("collection","path",e),s instanceof ii){const n=fe.fromString(e,...t);return pl(n),new Mt(s,null,n)}{if(!(s instanceof Qe||s instanceof Mt))throw new U(B.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=s._path.child(fe.fromString(e,...t));return pl(n),new Mt(s.firestore,null,n)}}function vd(s,e,...t){if(s=je(s),arguments.length===1&&(e=_u.newId()),_d("doc","path",e),s instanceof ii){const n=fe.fromString(e,...t);return fl(n),new Qe(s,null,new K(n))}{if(!(s instanceof Qe||s instanceof Mt))throw new U(B.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=s._path.child(fe.fromString(e,...t));return fl(n),new Qe(s.firestore,s instanceof Mt?s.converter:null,new K(n))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gl{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new ed(this,"async_queue_retry"),this.Vu=()=>{const n=Wi();n&&j("AsyncQueue","Visibility state changed to "+n.visibilityState),this.t_.jo()},this.mu=e;const t=Wi();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const t=Wi();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const t=new Bt;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!xs(e))throw e;j("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const t=this.mu.then(()=>(this.du=!0,e().catch(n=>{this.Eu=n,this.du=!1;const r=function(a){let c=a.message||"";return a.stack&&(c=a.stack.includes(a.message)?a.stack:a.message+`
`+a.stack),c}(n);throw _t("INTERNAL UNHANDLED ERROR: ",r),n}).then(n=>(this.du=!1,n))));return this.mu=t,t}enqueueAfterDelay(e,t,n){this.fu(),this.Ru.indexOf(e)>-1&&(t=0);const r=Qo.createAndSchedule(this,e,t,n,i=>this.yu(i));return this.Tu.push(r),r}fu(){this.Eu&&Y()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const t of this.Tu)if(t.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((t,n)=>t.targetTimeMs-n.targetTimeMs);for(const t of this.Tu)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const t=this.Tu.indexOf(e);this.Tu.splice(t,1)}}class oi extends ii{constructor(e,t,n,r){super(e,t,n,r),this.type="firestore",this._queue=new gl,this._persistenceKey=r?.name||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new gl(e),this._firestoreClient=void 0,await e}}}function Iy(s,e){const t=typeof s=="object"?s:cu(),n=typeof s=="string"?s:"(default)",r=Co(t,"firestore").getImmediate({identifier:n});if(!r._initialized){const i=of("firestore");i&&Ty(r,...i)}return r}function bd(s){if(s._terminated)throw new U(B.FAILED_PRECONDITION,"The client has already been terminated.");return s._firestoreClient||Sy(s),s._firestoreClient}function Sy(s){var e,t,n;const r=s._freezeSettings(),i=function(c,l,d,f){return new Jp(c,l,d,f.host,f.ssl,f.experimentalForceLongPolling,f.experimentalAutoDetectLongPolling,yd(f.experimentalLongPollingOptions),f.useFetchStreams)}(s._databaseId,((e=s._app)===null||e===void 0?void 0:e.options.appId)||"",s._persistenceKey,r);s._componentsProvider||!((t=r.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((n=r.localCache)===null||n===void 0)&&n._onlineComponentProvider)&&(s._componentsProvider={_offline:r.localCache._offlineComponentProvider,_online:r.localCache._onlineComponentProvider}),s._firestoreClient=new gy(s._authCredentials,s._appCheckCredentials,s._queue,i,s._componentsProvider&&function(c){const l=c?._online.build();return{_offline:c?._offline.build(l),_online:l}}(s._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nn{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Nn(Ce.fromBase64String(e))}catch(t){throw new U(B.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Nn(Ce.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zo{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new U(B.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Ae(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ea{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ta{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new U(B.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new U(B.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return oe(this._lat,e._lat)||oe(this._long,e._long)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class na{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(n,r){if(n.length!==r.length)return!1;for(let i=0;i<n.length;++i)if(n[i]!==r[i])return!1;return!0}(this._values,e._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ky=/^__.*__$/;class Ay{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return this.fieldMask!==null?new an(e,this.data,this.fieldMask,t,this.fieldTransforms):new Vs(e,this.data,t,this.fieldTransforms)}}function wd(s){switch(s){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw Y()}}class sa{constructor(e,t,n,r,i,a){this.settings=e,this.databaseId=t,this.serializer=n,this.ignoreUndefinedProperties=r,i===void 0&&this.vu(),this.fieldTransforms=i||[],this.fieldMask=a||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new sa(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var t;const n=(t=this.path)===null||t===void 0?void 0:t.child(e),r=this.Fu({path:n,xu:!1});return r.Ou(e),r}Nu(e){var t;const n=(t=this.path)===null||t===void 0?void 0:t.child(e),r=this.Fu({path:n,xu:!1});return r.vu(),r}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return Or(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return this.fieldMask.find(t=>e.isPrefixOf(t))!==void 0||this.fieldTransforms.find(t=>e.isPrefixOf(t.field))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(e.length===0)throw this.Bu("Document fields must not be empty");if(wd(this.Cu)&&ky.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class Ry{constructor(e,t,n){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=n||ti(e)}Qu(e,t,n,r=!1){return new sa({Cu:e,methodName:t,qu:n,path:Ae.emptyPath(),xu:!1,ku:r},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Ed(s){const e=s._freezeSettings(),t=ti(s._databaseId);return new Ry(s._databaseId,!!e.ignoreUndefinedProperties,t)}function Cy(s,e,t,n,r,i={}){const a=s.Qu(i.merge||i.mergeFields?2:0,e,t,r);Sd("Data must be an object, but it was:",a,n);const c=Td(n,a);let l,d;if(i.merge)l=new tt(a.fieldMask),d=a.fieldTransforms;else if(i.mergeFields){const f=[];for(const m of i.mergeFields){const _=Py(e,m,t);if(!a.contains(_))throw new U(B.INVALID_ARGUMENT,`Field '${_}' is specified in your field mask but missing from your input data.`);Ly(f,_)||f.push(_)}l=new tt(f),d=a.fieldTransforms.filter(m=>l.covers(m.field))}else l=null,d=a.fieldTransforms;return new Ay(new Ge(c),l,d)}class ra extends ea{_toFieldTransform(e){return new Em(e.path,new Is)}isEqual(e){return e instanceof ra}}function Dy(s,e,t,n=!1){return ia(t,s.Qu(n?4:3,e))}function ia(s,e){if(Id(s=je(s)))return Sd("Unsupported field value:",e,s),Td(s,e);if(s instanceof ea)return function(n,r){if(!wd(r.Cu))throw r.Bu(`${n._methodName}() can only be used with update() and set()`);if(!r.path)throw r.Bu(`${n._methodName}() is not currently supported inside arrays`);const i=n._toFieldTransform(r);i&&r.fieldTransforms.push(i)}(s,e),null;if(s===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),s instanceof Array){if(e.settings.xu&&e.Cu!==4)throw e.Bu("Nested arrays are not supported");return function(n,r){const i=[];let a=0;for(const c of n){let l=ia(c,r.Lu(a));l==null&&(l={nullValue:"NULL_VALUE"}),i.push(l),a++}return{arrayValue:{values:i}}}(s,e)}return function(n,r){if((n=je(n))===null)return{nullValue:"NULL_VALUE"};if(typeof n=="number")return vm(r.serializer,n);if(typeof n=="boolean")return{booleanValue:n};if(typeof n=="string")return{stringValue:n};if(n instanceof Date){const i=Ee.fromDate(n);return{timestampValue:Vr(r.serializer,i)}}if(n instanceof Ee){const i=new Ee(n.seconds,1e3*Math.floor(n.nanoseconds/1e3));return{timestampValue:Vr(r.serializer,i)}}if(n instanceof ta)return{geoPointValue:{latitude:n.latitude,longitude:n.longitude}};if(n instanceof Nn)return{bytesValue:Wu(r.serializer,n._byteString)};if(n instanceof Qe){const i=r.databaseId,a=n.firestore._databaseId;if(!a.isEqual(i))throw r.Bu(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:Uo(n.firestore._databaseId||r.databaseId,n._key.path)}}if(n instanceof na)return function(a,c){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:a.toArray().map(l=>{if(typeof l!="number")throw c.Bu("VectorValues must only contain numeric values.");return Mo(c.serializer,l)})}}}}}}(n,r);throw r.Bu(`Unsupported field value: ${ri(n)}`)}(s,e)}function Td(s,e){const t={};return vu(s)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Mn(s,(n,r)=>{const i=ia(r,e.Mu(n));i!=null&&(t[n]=i)}),{mapValue:{fields:t}}}function Id(s){return!(typeof s!="object"||s===null||s instanceof Array||s instanceof Date||s instanceof Ee||s instanceof ta||s instanceof Nn||s instanceof Qe||s instanceof ea||s instanceof na)}function Sd(s,e,t){if(!Id(t)||!function(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}(t)){const n=ri(t);throw n==="an object"?e.Bu(s+" a custom object"):e.Bu(s+" "+n)}}function Py(s,e,t){if((e=je(e))instanceof Zo)return e._internalPath;if(typeof e=="string")return kd(s,e);throw Or("Field path arguments must be of type string or ",s,!1,void 0,t)}const Ny=new RegExp("[~\\*/\\[\\]]");function kd(s,e,t){if(e.search(Ny)>=0)throw Or(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,s,!1,void 0,t);try{return new Zo(...e.split("."))._internalPath}catch{throw Or(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,s,!1,void 0,t)}}function Or(s,e,t,n,r){const i=n&&!n.isEmpty(),a=r!==void 0;let c=`Function ${e}() called with invalid data`;t&&(c+=" (via `toFirestore()`)"),c+=". ";let l="";return(i||a)&&(l+=" (found",i&&(l+=` in field ${n}`),a&&(l+=` in document ${r}`),l+=")"),new U(B.INVALID_ARGUMENT,c+s+l)}function Ly(s,e){return s.some(t=>t.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ad{constructor(e,t,n,r,i){this._firestore=e,this._userDataWriter=t,this._key=n,this._document=r,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new Qe(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new xy(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(ai("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class xy extends Ad{data(){return super.data()}}function ai(s,e){return typeof e=="string"?kd(s,e):e instanceof Zo?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vy(s){if(s.limitType==="L"&&s.explicitOrderBy.length===0)throw new U(B.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class oa{}class aa extends oa{}function Te(s,e,...t){let n=[];e instanceof oa&&n.push(e),n=n.concat(t),function(i){const a=i.filter(l=>l instanceof ca).length,c=i.filter(l=>l instanceof ci).length;if(a>1||a>0&&c>0)throw new U(B.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(n);for(const r of n)s=r._apply(s);return s}class ci extends aa{constructor(e,t,n){super(),this._field=e,this._op=t,this._value=n,this.type="where"}static _create(e,t,n){return new ci(e,t,n)}_apply(e){const t=this._parse(e);return Rd(e._query,t),new jt(e.firestore,e.converter,uo(e._query,t))}_parse(e){const t=Ed(e.firestore);return function(i,a,c,l,d,f,m){let _;if(d.isKeyField()){if(f==="array-contains"||f==="array-contains-any")throw new U(B.INVALID_ARGUMENT,`Invalid Query. You can't perform '${f}' queries on documentId().`);if(f==="in"||f==="not-in"){_l(m,f);const T=[];for(const R of m)T.push(yl(l,i,R));_={arrayValue:{values:T}}}else _=yl(l,i,m)}else f!=="in"&&f!=="not-in"&&f!=="array-contains-any"||_l(m,f),_=Dy(c,a,m,f==="in"||f==="not-in");return _e.create(d,f,_)}(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function Fe(s,e,t){const n=e,r=ai("where",s);return ci._create(r,n,t)}class ca extends oa{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new ca(e,t)}_parse(e){const t=this._queryConstraints.map(n=>n._parse(e)).filter(n=>n.getFilters().length>0);return t.length===1?t[0]:st.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:(function(r,i){let a=r;const c=i.getFlattenedFilters();for(const l of c)Rd(a,l),a=uo(a,l)}(e._query,t),new jt(e.firestore,e.converter,uo(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class la extends aa{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new la(e,t)}_apply(e){const t=function(r,i,a){if(r.startAt!==null)throw new U(B.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(r.endAt!==null)throw new U(B.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new Ts(i,a)}(e._query,this._field,this._direction);return new jt(e.firestore,e.converter,function(r,i){const a=r.explicitOrderBy.concat([i]);return new On(r.path,r.collectionGroup,a,r.filters.slice(),r.limit,r.limitType,r.startAt,r.endAt)}(e._query,t))}}function bn(s,e="asc"){const t=e,n=ai("orderBy",s);return la._create(n,t)}class ua extends aa{constructor(e,t,n){super(),this.type=e,this._limit=t,this._limitType=n}static _create(e,t,n){return new ua(e,t,n)}_apply(e){return new jt(e.firestore,e.converter,Lr(e._query,this._limit,this._limitType))}}function Rt(s){return Ey("limit",s),ua._create("limit",s,"F")}function yl(s,e,t){if(typeof(t=je(t))=="string"){if(t==="")throw new U(B.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Cu(e)&&t.indexOf("/")!==-1)throw new U(B.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const n=e.path.child(fe.fromString(t));if(!K.isDocumentKey(n))throw new U(B.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${n}' is not because it has an odd number of segments (${n.length}).`);return $c(s,new K(n))}if(t instanceof Qe)return $c(s,t._key);throw new U(B.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${ri(t)}.`)}function _l(s,e){if(!Array.isArray(s)||s.length===0)throw new U(B.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function Rd(s,e){const t=function(r,i){for(const a of r)for(const c of a.getFlattenedFilters())if(i.indexOf(c.op)>=0)return c.op;return null}(s.filters,function(r){switch(r){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(e.op));if(t!==null)throw t===e.op?new U(B.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new U(B.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}class By{convertValue(e,t="none"){switch(rn(e)){case 0:return null;case 1:return e.booleanValue;case 2:return ge(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(sn(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw Y()}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const n={};return Mn(e,(r,i)=>{n[r]=this.convertValue(i,t)}),n}convertVectorValue(e){var t,n,r;const i=(r=(n=(t=e.fields)===null||t===void 0?void 0:t.value.arrayValue)===null||n===void 0?void 0:n.values)===null||r===void 0?void 0:r.map(a=>ge(a.doubleValue));return new na(i)}convertGeoPoint(e){return new ta(ge(e.latitude),ge(e.longitude))}convertArray(e,t){return(e.values||[]).map(n=>this.convertValue(n,t))}convertServerTimestamp(e,t){switch(t){case"previous":const n=Lo(e);return n==null?null:this.convertValue(n,t);case"estimate":return this.convertTimestamp(bs(e));default:return null}}convertTimestamp(e){const t=$t(e);return new Ee(t.seconds,t.nanos)}convertDocumentKey(e,t){const n=fe.fromString(e);ce(Ju(n));const r=new ws(n.get(1),n.get(3)),i=new K(n.popFirst(5));return r.isEqual(t)||_t(`Document ${i} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function My(s,e,t){let n;return n=s?s.toFirestore(e):e,n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mr{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class Oy extends Ad{constructor(e,t,n,r,i,a){super(e,t,n,r,a),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Tr(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const n=this._document.data.field(ai("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n,t.serverTimestamps)}}}class Tr extends Oy{data(e={}){return super.data(e)}}class $y{constructor(e,t,n,r){this._firestore=e,this._userDataWriter=t,this._snapshot=r,this.metadata=new mr(r.hasPendingWrites,r.fromCache),this.query=n}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach(n=>{e.call(t,new Tr(this._firestore,this._userDataWriter,n.key,n,new mr(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new U(B.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(r,i){if(r._snapshot.oldDocs.isEmpty()){let a=0;return r._snapshot.docChanges.map(c=>{const l=new Tr(r._firestore,r._userDataWriter,c.doc.key,c.doc,new mr(r._snapshot.mutatedKeys.has(c.doc.key),r._snapshot.fromCache),r.query.converter);return c.doc,{type:"added",doc:l,oldIndex:-1,newIndex:a++}})}{let a=r._snapshot.oldDocs;return r._snapshot.docChanges.filter(c=>i||c.type!==3).map(c=>{const l=new Tr(r._firestore,r._userDataWriter,c.doc.key,c.doc,new mr(r._snapshot.mutatedKeys.has(c.doc.key),r._snapshot.fromCache),r.query.converter);let d=-1,f=-1;return c.type!==0&&(d=a.indexOf(c.doc.key),a=a.delete(c.doc.key)),c.type!==1&&(a=a.add(c.doc),f=a.indexOf(c.doc.key)),{type:Fy(c.type),doc:l,oldIndex:d,newIndex:f}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}}function Fy(s){switch(s){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return Y()}}class Uy extends By{constructor(e){super(),this.firestore=e}convertBytes(e){return new Nn(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new Qe(this.firestore,null,t)}}function W(s){s=As(s,jt);const e=As(s.firestore,oi),t=bd(e),n=new Uy(e);return Vy(s._query),by(t,s._query).then(r=>new $y(e,n,s,r))}function jy(s){return Cd(As(s.firestore,oi),[new Oo(s._key,ot.none())])}function vl(s,e){const t=As(s.firestore,oi),n=vd(s),r=My(s.converter,e);return Cd(t,[Cy(Ed(s.firestore),"addDoc",n._key,r,s.converter!==null,{}).toMutation(n._key,ot.exists(!1))]).then(()=>n)}function Cd(s,e){return function(n,r){const i=new Bt;return n.asyncQueue.enqueueAndForget(async()=>ay(await _y(n),r,i)),i.promise}(bd(s),e)}function bl(){return new ra("serverTimestamp")}(function(e,t=!0){(function(r){Bn=r})(Vn),Sn(new tn("firestore",(n,{instanceIdentifier:r,options:i})=>{const a=n.getProvider("app").getImmediate(),c=new oi(new Bp(n.getProvider("auth-internal")),new Fp(n.getProvider("app-check-internal")),function(d,f){if(!Object.prototype.hasOwnProperty.apply(d.options,["projectId"]))throw new U(B.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new ws(d.options.projectId,f)}(a,r),a);return i=Object.assign({useFetchStreams:t},i),c._setSettings(i),c},"PUBLIC").setMultipleInstances(!0)),Vt(xc,"4.7.3",e),Vt(xc,"4.7.3","esm2017")})();function da(s,e){var t={};for(var n in s)Object.prototype.hasOwnProperty.call(s,n)&&e.indexOf(n)<0&&(t[n]=s[n]);if(s!=null&&typeof Object.getOwnPropertySymbols=="function")for(var r=0,n=Object.getOwnPropertySymbols(s);r<n.length;r++)e.indexOf(n[r])<0&&Object.prototype.propertyIsEnumerable.call(s,n[r])&&(t[n[r]]=s[n[r]]);return t}function Dd(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const qy=Dd,Pd=new Ps("auth","Firebase",Dd());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $r=new Ao("@firebase/auth");function zy(s,...e){$r.logLevel<=se.WARN&&$r.warn(`Auth (${Vn}): ${s}`,...e)}function Ir(s,...e){$r.logLevel<=se.ERROR&&$r.error(`Auth (${Vn}): ${s}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ye(s,...e){throw fa(s,...e)}function nt(s,...e){return fa(s,...e)}function ha(s,e,t){const n=Object.assign(Object.assign({},qy()),{[e]:t});return new Ps("auth","Firebase",n).create(e,{appName:s.name})}function gt(s){return ha(s,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Nd(s,e,t){const n=t;if(!(e instanceof n))throw n.name!==e.constructor.name&&Ye(s,"argument-error"),ha(s,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function fa(s,...e){if(typeof s!="string"){const t=e[0],n=[...e.slice(1)];return n[0]&&(n[0].appName=s.name),s._errorFactory.create(t,...n)}return Pd.create(s,...e)}function Q(s,e,...t){if(!s)throw fa(e,...t)}function ft(s){const e="INTERNAL ASSERTION FAILED: "+s;throw Ir(e),new Error(e)}function bt(s,e){s||ft(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bo(){var s;return typeof self<"u"&&((s=self.location)===null||s===void 0?void 0:s.href)||""}function Wy(){return wl()==="http:"||wl()==="https:"}function wl(){var s;return typeof self<"u"&&((s=self.location)===null||s===void 0?void 0:s.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hy(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Wy()||hf()||"connection"in navigator)?navigator.onLine:!0}function Ky(){if(typeof navigator>"u")return null;const s=navigator;return s.languages&&s.languages[0]||s.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $s{constructor(e,t){this.shortDelay=e,this.longDelay=t,bt(t>e,"Short delay should be less than long delay!"),this.isMobile=lf()||ff()}get(){return Hy()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pa(s,e){bt(s.emulator,"Emulator should always be set here");const{url:t}=s.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ld{static initialize(e,t,n){this.fetchImpl=e,t&&(this.headersImpl=t),n&&(this.responseImpl=n)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;ft("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;ft("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;ft("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gy={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qy=new $s(3e4,6e4);function ln(s,e){return s.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:s.tenantId}):e}async function qt(s,e,t,n,r={}){return xd(s,r,async()=>{let i={},a={};n&&(e==="GET"?a=n:i={body:JSON.stringify(n)});const c=Ns(Object.assign({key:s.config.apiKey},a)).slice(1),l=await s._getAdditionalHeaders();l["Content-Type"]="application/json",s.languageCode&&(l["X-Firebase-Locale"]=s.languageCode);const d=Object.assign({method:e,headers:l},i);return df()||(d.referrerPolicy="no-referrer"),Ld.fetch()(Vd(s,s.config.apiHost,t,c),d)})}async function xd(s,e,t){s._canInitEmulator=!1;const n=Object.assign(Object.assign({},Gy),e);try{const r=new Jy(s),i=await Promise.race([t(),r.promise]);r.clearNetworkTimeout();const a=await i.json();if("needConfirmation"in a)throw gr(s,"account-exists-with-different-credential",a);if(i.ok&&!("errorMessage"in a))return a;{const c=i.ok?a.errorMessage:a.error.message,[l,d]=c.split(" : ");if(l==="FEDERATED_USER_ID_ALREADY_LINKED")throw gr(s,"credential-already-in-use",a);if(l==="EMAIL_EXISTS")throw gr(s,"email-already-in-use",a);if(l==="USER_DISABLED")throw gr(s,"user-disabled",a);const f=n[l]||l.toLowerCase().replace(/[_\s]+/g,"-");if(d)throw ha(s,f,d);Ye(s,f)}}catch(r){if(r instanceof wt)throw r;Ye(s,"network-request-failed",{message:String(r)})}}async function li(s,e,t,n,r={}){const i=await qt(s,e,t,n,r);return"mfaPendingCredential"in i&&Ye(s,"multi-factor-auth-required",{_serverResponse:i}),i}function Vd(s,e,t,n){const r=`${e}${t}?${n}`;return s.config.emulator?pa(s.config,r):`${s.config.apiScheme}://${r}`}function Yy(s){switch(s){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class Jy{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,n)=>{this.timer=setTimeout(()=>n(nt(this.auth,"network-request-failed")),Qy.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function gr(s,e,t){const n={appName:s.name};t.email&&(n.email=t.email),t.phoneNumber&&(n.phoneNumber=t.phoneNumber);const r=nt(s,e,n);return r.customData._tokenResponse=t,r}function El(s){return s!==void 0&&s.enterprise!==void 0}class Xy{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return Yy(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}}async function Zy(s,e){return qt(s,"GET","/v2/recaptchaConfig",ln(s,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function e_(s,e){return qt(s,"POST","/v1/accounts:delete",e)}async function Bd(s,e){return qt(s,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ms(s){if(s)try{const e=new Date(Number(s));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function t_(s,e=!1){const t=je(s),n=await t.getIdToken(e),r=ma(n);Q(r&&r.exp&&r.auth_time&&r.iat,t.auth,"internal-error");const i=typeof r.firebase=="object"?r.firebase:void 0,a=i?.sign_in_provider;return{claims:r,token:n,authTime:ms(Ki(r.auth_time)),issuedAtTime:ms(Ki(r.iat)),expirationTime:ms(Ki(r.exp)),signInProvider:a||null,signInSecondFactor:i?.sign_in_second_factor||null}}function Ki(s){return Number(s)*1e3}function ma(s){const[e,t,n]=s.split(".");if(e===void 0||t===void 0||n===void 0)return Ir("JWT malformed, contained fewer than 3 sections"),null;try{const r=tu(t);return r?JSON.parse(r):(Ir("Failed to decode base64 JWT payload"),null)}catch(r){return Ir("Caught error parsing JWT payload as JSON",r?.toString()),null}}function Tl(s){const e=ma(s);return Q(e,"internal-error"),Q(typeof e.exp<"u","internal-error"),Q(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Rs(s,e,t=!1){if(t)return e;try{return await e}catch(n){throw n instanceof wt&&n_(n)&&s.auth.currentUser===s&&await s.auth.signOut(),n}}function n_({code:s}){return s==="auth/user-disabled"||s==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class s_{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const r=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){e?.code==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wo{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=ms(this.lastLoginAt),this.creationTime=ms(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Fr(s){var e;const t=s.auth,n=await s.getIdToken(),r=await Rs(s,Bd(t,{idToken:n}));Q(r?.users.length,t,"internal-error");const i=r.users[0];s._notifyReloadListener(i);const a=!((e=i.providerUserInfo)===null||e===void 0)&&e.length?Md(i.providerUserInfo):[],c=i_(s.providerData,a),l=s.isAnonymous,d=!(s.email&&i.passwordHash)&&!c?.length,f=l?d:!1,m={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:c,metadata:new wo(i.createdAt,i.lastLoginAt),isAnonymous:f};Object.assign(s,m)}async function r_(s){const e=je(s);await Fr(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function i_(s,e){return[...s.filter(n=>!e.some(r=>r.providerId===n.providerId)),...e]}function Md(s){return s.map(e=>{var{providerId:t}=e,n=da(e,["providerId"]);return{providerId:t,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function o_(s,e){const t=await xd(s,{},async()=>{const n=Ns({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:r,apiKey:i}=s.config,a=Vd(s,r,"/v1/token",`key=${i}`),c=await s._getAdditionalHeaders();return c["Content-Type"]="application/x-www-form-urlencoded",Ld.fetch()(a,{method:"POST",headers:c,body:n})});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function a_(s,e){return qt(s,"POST","/v2/accounts:revokeToken",ln(s,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class En{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){Q(e.idToken,"internal-error"),Q(typeof e.idToken<"u","internal-error"),Q(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Tl(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){Q(e.length!==0,"internal-error");const t=Tl(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(Q(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:n,refreshToken:r,expiresIn:i}=await o_(e,t);this.updateTokensAndExpiration(n,r,Number(i))}updateTokensAndExpiration(e,t,n){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+n*1e3}static fromJSON(e,t){const{refreshToken:n,accessToken:r,expirationTime:i}=t,a=new En;return n&&(Q(typeof n=="string","internal-error",{appName:e}),a.refreshToken=n),r&&(Q(typeof r=="string","internal-error",{appName:e}),a.accessToken=r),i&&(Q(typeof i=="number","internal-error",{appName:e}),a.expirationTime=i),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new En,this.toJSON())}_performRefresh(){return ft("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kt(s,e){Q(typeof s=="string"||typeof s>"u","internal-error",{appName:e})}class pt{constructor(e){var{uid:t,auth:n,stsTokenManager:r}=e,i=da(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new s_(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=n,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new wo(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const t=await Rs(this,this.stsTokenManager.getToken(this.auth,e));return Q(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return t_(this,e)}reload(){return r_(this)}_assign(e){this!==e&&(Q(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new pt(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){Q(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let n=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),n=!0),t&&await Fr(this),await this.auth._persistUserIfCurrent(this),n&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(et(this.auth.app))return Promise.reject(gt(this.auth));const e=await this.getIdToken();return await Rs(this,e_(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var n,r,i,a,c,l,d,f;const m=(n=t.displayName)!==null&&n!==void 0?n:void 0,_=(r=t.email)!==null&&r!==void 0?r:void 0,T=(i=t.phoneNumber)!==null&&i!==void 0?i:void 0,R=(a=t.photoURL)!==null&&a!==void 0?a:void 0,N=(c=t.tenantId)!==null&&c!==void 0?c:void 0,D=(l=t._redirectEventId)!==null&&l!==void 0?l:void 0,x=(d=t.createdAt)!==null&&d!==void 0?d:void 0,O=(f=t.lastLoginAt)!==null&&f!==void 0?f:void 0,{uid:p,emailVerified:S,isAnonymous:C,providerData:V,stsTokenManager:b}=t;Q(p&&b,e,"internal-error");const y=En.fromJSON(this.name,b);Q(typeof p=="string",e,"internal-error"),kt(m,e.name),kt(_,e.name),Q(typeof S=="boolean",e,"internal-error"),Q(typeof C=="boolean",e,"internal-error"),kt(T,e.name),kt(R,e.name),kt(N,e.name),kt(D,e.name),kt(x,e.name),kt(O,e.name);const v=new pt({uid:p,auth:e,email:_,emailVerified:S,displayName:m,isAnonymous:C,photoURL:R,phoneNumber:T,tenantId:N,stsTokenManager:y,createdAt:x,lastLoginAt:O});return V&&Array.isArray(V)&&(v.providerData=V.map(w=>Object.assign({},w))),D&&(v._redirectEventId=D),v}static async _fromIdTokenResponse(e,t,n=!1){const r=new En;r.updateFromServerResponse(t);const i=new pt({uid:t.localId,auth:e,stsTokenManager:r,isAnonymous:n});return await Fr(i),i}static async _fromGetAccountInfoResponse(e,t,n){const r=t.users[0];Q(r.localId!==void 0,"internal-error");const i=r.providerUserInfo!==void 0?Md(r.providerUserInfo):[],a=!(r.email&&r.passwordHash)&&!i?.length,c=new En;c.updateFromIdToken(n);const l=new pt({uid:r.localId,auth:e,stsTokenManager:c,isAnonymous:a}),d={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:i,metadata:new wo(r.createdAt,r.lastLoginAt),isAnonymous:!(r.email&&r.passwordHash)&&!i?.length};return Object.assign(l,d),l}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Il=new Map;function mt(s){bt(s instanceof Function,"Expected a class definition");let e=Il.get(s);return e?(bt(e instanceof s,"Instance stored in cache mismatched with class"),e):(e=new s,Il.set(s,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Od{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}Od.type="NONE";const Sl=Od;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sr(s,e,t){return`firebase:${s}:${e}:${t}`}class Tn{constructor(e,t,n){this.persistence=e,this.auth=t,this.userKey=n;const{config:r,name:i}=this.auth;this.fullUserKey=Sr(this.userKey,r.apiKey,i),this.fullPersistenceKey=Sr("persistence",r.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?pt._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,n="authUser"){if(!t.length)return new Tn(mt(Sl),e,n);const r=(await Promise.all(t.map(async d=>{if(await d._isAvailable())return d}))).filter(d=>d);let i=r[0]||mt(Sl);const a=Sr(n,e.config.apiKey,e.name);let c=null;for(const d of t)try{const f=await d._get(a);if(f){const m=pt._fromJSON(e,f);d!==i&&(c=m),i=d;break}}catch{}const l=r.filter(d=>d._shouldAllowMigration);return!i._shouldAllowMigration||!l.length?new Tn(i,e,n):(i=l[0],c&&await i._set(a,c.toJSON()),await Promise.all(t.map(async d=>{if(d!==i)try{await d._remove(a)}catch{}})),new Tn(i,e,n))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kl(s){const e=s.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(jd(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if($d(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(zd(e))return"Blackberry";if(Wd(e))return"Webos";if(Fd(e))return"Safari";if((e.includes("chrome/")||Ud(e))&&!e.includes("edge/"))return"Chrome";if(qd(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,n=s.match(t);if(n?.length===2)return n[1]}return"Other"}function $d(s=Me()){return/firefox\//i.test(s)}function Fd(s=Me()){const e=s.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Ud(s=Me()){return/crios\//i.test(s)}function jd(s=Me()){return/iemobile/i.test(s)}function qd(s=Me()){return/android/i.test(s)}function zd(s=Me()){return/blackberry/i.test(s)}function Wd(s=Me()){return/webos/i.test(s)}function ga(s=Me()){return/iphone|ipad|ipod/i.test(s)||/macintosh/i.test(s)&&/mobile/i.test(s)}function c_(s=Me()){var e;return ga(s)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function l_(){return pf()&&document.documentMode===10}function Hd(s=Me()){return ga(s)||qd(s)||Wd(s)||zd(s)||/windows phone/i.test(s)||jd(s)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kd(s,e=[]){let t;switch(s){case"Browser":t=kl(Me());break;case"Worker":t=`${kl(Me())}-${s}`;break;default:t=s}const n=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${Vn}/${n}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class u_{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const n=i=>new Promise((a,c)=>{try{const l=e(i);a(l)}catch(l){c(l)}});n.onAbort=t,this.queue.push(n);const r=this.queue.length-1;return()=>{this.queue[r]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const n of this.queue)await n(e),n.onAbort&&t.push(n.onAbort)}catch(n){t.reverse();for(const r of t)try{r()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:n?.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function d_(s,e={}){return qt(s,"GET","/v2/passwordPolicy",ln(s,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const h_=6;class f_{constructor(e){var t,n,r,i;const a=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=a.minPasswordLength)!==null&&t!==void 0?t:h_,a.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=a.maxPasswordLength),a.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=a.containsLowercaseCharacter),a.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=a.containsUppercaseCharacter),a.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=a.containsNumericCharacter),a.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=a.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(r=(n=e.allowedNonAlphanumericCharacters)===null||n===void 0?void 0:n.join(""))!==null&&r!==void 0?r:"",this.forceUpgradeOnSignin=(i=e.forceUpgradeOnSignin)!==null&&i!==void 0?i:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,n,r,i,a,c;const l={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,l),this.validatePasswordCharacterOptions(e,l),l.isValid&&(l.isValid=(t=l.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),l.isValid&&(l.isValid=(n=l.meetsMaxPasswordLength)!==null&&n!==void 0?n:!0),l.isValid&&(l.isValid=(r=l.containsLowercaseLetter)!==null&&r!==void 0?r:!0),l.isValid&&(l.isValid=(i=l.containsUppercaseLetter)!==null&&i!==void 0?i:!0),l.isValid&&(l.isValid=(a=l.containsNumericCharacter)!==null&&a!==void 0?a:!0),l.isValid&&(l.isValid=(c=l.containsNonAlphanumericCharacter)!==null&&c!==void 0?c:!0),l}validatePasswordLengthOptions(e,t){const n=this.customStrengthOptions.minPasswordLength,r=this.customStrengthOptions.maxPasswordLength;n&&(t.meetsMinPasswordLength=e.length>=n),r&&(t.meetsMaxPasswordLength=e.length<=r)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let n;for(let r=0;r<e.length;r++)n=e.charAt(r),this.updatePasswordCharacterOptionsStatuses(t,n>="a"&&n<="z",n>="A"&&n<="Z",n>="0"&&n<="9",this.allowedNonAlphanumericCharacters.includes(n))}updatePasswordCharacterOptionsStatuses(e,t,n,r,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=n)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=r)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class p_{constructor(e,t,n,r){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=n,this.config=r,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Al(this),this.idTokenSubscription=new Al(this),this.beforeStateQueue=new u_(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Pd,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=r.sdkClientVersion}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=mt(t)),this._initializationPromise=this.queue(async()=>{var n,r;if(!this._deleted&&(this.persistenceManager=await Tn.create(this,e),!this._deleted)){if(!((n=this._popupRedirectResolver)===null||n===void 0)&&n._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((r=this.currentUser)===null||r===void 0?void 0:r.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Bd(this,{idToken:e}),n=await pt._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(n)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(et(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(c=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(c,c))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let r=n,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,c=r?._redirectEventId,l=await this.tryRedirectSignIn(e);(!a||a===c)&&l?.user&&(r=l.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(a){r=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return Q(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Fr(e)}catch(t){if(t?.code!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Ky()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(et(this.app))return Promise.reject(gt(this));const t=e?je(e):null;return t&&Q(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&Q(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return et(this.app)?Promise.reject(gt(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return et(this.app)?Promise.reject(gt(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(mt(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await d_(this),t=new f_(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new Ps("auth","Firebase",e())}onAuthStateChanged(e,t,n){return this.registerStateListener(this.authStateSubscription,e,t,n)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,n){return this.registerStateListener(this.idTokenSubscription,e,t,n)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const n=this.onAuthStateChanged(()=>{n(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),n={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(n.tenantId=this.tenantId),await a_(this,n)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const n=await this.getOrInitRedirectPersistenceManager(t);return e===null?n.removeCurrentUser():n.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&mt(e)||this._popupRedirectResolver;Q(t,this,"argument-error"),this.redirectPersistenceManager=await Tn.create(this,[mt(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,n;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const n=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==n&&(this.lastNotifiedUid=n,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,n,r){if(this._deleted)return()=>{};const i=typeof t=="function"?t:t.next.bind(t);let a=!1;const c=this._isInitialized?Promise.resolve():this._initializationPromise;if(Q(c,this,"internal-error"),c.then(()=>{a||i(this.currentUser)}),typeof t=="function"){const l=e.addObserver(t,n,r);return()=>{a=!0,l()}}else{const l=e.addObserver(t);return()=>{a=!0,l()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return Q(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Kd(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const n=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());n&&(t["X-Firebase-Client"]=n);const r=await this._getAppCheckToken();return r&&(t["X-Firebase-AppCheck"]=r),t}async _getAppCheckToken(){var e;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t?.error&&zy(`Error while retrieving App Check token: ${t.error}`),t?.token}}function Et(s){return je(s)}class Al{constructor(e){this.auth=e,this.observer=null,this.addObserver=Ef(t=>this.observer=t)}get next(){return Q(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ui={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function m_(s){ui=s}function Gd(s){return ui.loadJS(s)}function g_(){return ui.recaptchaEnterpriseScript}function y_(){return ui.gapiScript}function __(s){return`__${s}${Math.floor(Math.random()*1e6)}`}const v_="recaptcha-enterprise",b_="NO_RECAPTCHA";class w_{constructor(e){this.type=v_,this.auth=Et(e)}async verify(e="verify",t=!1){async function n(i){if(!t){if(i.tenantId==null&&i._agentRecaptchaConfig!=null)return i._agentRecaptchaConfig.siteKey;if(i.tenantId!=null&&i._tenantRecaptchaConfigs[i.tenantId]!==void 0)return i._tenantRecaptchaConfigs[i.tenantId].siteKey}return new Promise(async(a,c)=>{Zy(i,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(l=>{if(l.recaptchaKey===void 0)c(new Error("recaptcha Enterprise site key undefined"));else{const d=new Xy(l);return i.tenantId==null?i._agentRecaptchaConfig=d:i._tenantRecaptchaConfigs[i.tenantId]=d,a(d.siteKey)}}).catch(l=>{c(l)})})}function r(i,a,c){const l=window.grecaptcha;El(l)?l.enterprise.ready(()=>{l.enterprise.execute(i,{action:e}).then(d=>{a(d)}).catch(()=>{a(b_)})}):c(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((i,a)=>{n(this.auth).then(c=>{if(!t&&El(window.grecaptcha))r(c,i,a);else{if(typeof window>"u"){a(new Error("RecaptchaVerifier is only supported in browser"));return}let l=g_();l.length!==0&&(l+=c),Gd(l).then(()=>{r(c,i,a)}).catch(d=>{a(d)})}}).catch(c=>{a(c)})})}}async function Rl(s,e,t,n=!1){const r=new w_(s);let i;try{i=await r.verify(t)}catch{i=await r.verify(t,!0)}const a=Object.assign({},e);return n?Object.assign(a,{captchaResp:i}):Object.assign(a,{captchaResponse:i}),Object.assign(a,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(a,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),a}async function Cl(s,e,t,n){var r;if(!((r=s._getRecaptchaConfig())===null||r===void 0)&&r.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const i=await Rl(s,e,t,t==="getOobCode");return n(s,i)}else return n(s,e).catch(async i=>{if(i.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const a=await Rl(s,e,t,t==="getOobCode");return n(s,a)}else return Promise.reject(i)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function E_(s,e){const t=Co(s,"auth");if(t.isInitialized()){const r=t.getImmediate(),i=t.getOptions();if(Dr(i,e??{}))return r;Ye(r,"already-initialized")}return t.initialize({options:e})}function T_(s,e){const t=e?.persistence||[],n=(Array.isArray(t)?t:[t]).map(mt);e?.errorMap&&s._updateErrorMap(e.errorMap),s._initializeWithPersistence(n,e?.popupRedirectResolver)}function I_(s,e,t){const n=Et(s);Q(n._canInitEmulator,n,"emulator-config-failed"),Q(/^https?:\/\//.test(e),n,"invalid-emulator-scheme");const r=!1,i=Qd(e),{host:a,port:c}=S_(e),l=c===null?"":`:${c}`;n.config.emulator={url:`${i}//${a}${l}/`},n.settings.appVerificationDisabledForTesting=!0,n.emulatorConfig=Object.freeze({host:a,port:c,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:r})}),k_()}function Qd(s){const e=s.indexOf(":");return e<0?"":s.substr(0,e+1)}function S_(s){const e=Qd(s),t=/(\/\/)?([^?#/]+)/.exec(s.substr(e.length));if(!t)return{host:"",port:null};const n=t[2].split("@").pop()||"",r=/^(\[[^\]]+\])(:|$)/.exec(n);if(r){const i=r[1];return{host:i,port:Dl(n.substr(i.length+1))}}else{const[i,a]=n.split(":");return{host:i,port:Dl(a)}}}function Dl(s){if(!s)return null;const e=Number(s);return isNaN(e)?null:e}function k_(){function s(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",s):s())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ya{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return ft("not implemented")}_getIdTokenResponse(e){return ft("not implemented")}_linkToIdToken(e,t){return ft("not implemented")}_getReauthenticationResolver(e){return ft("not implemented")}}async function A_(s,e){return qt(s,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function R_(s,e){return li(s,"POST","/v1/accounts:signInWithPassword",ln(s,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function C_(s,e){return li(s,"POST","/v1/accounts:signInWithEmailLink",ln(s,e))}async function D_(s,e){return li(s,"POST","/v1/accounts:signInWithEmailLink",ln(s,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cs extends ya{constructor(e,t,n,r=null){super("password",n),this._email=e,this._password=t,this._tenantId=r}static _fromEmailAndPassword(e,t){return new Cs(e,t,"password")}static _fromEmailAndCode(e,t,n=null){return new Cs(e,t,"emailLink",n)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t?.email&&t?.password){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Cl(e,t,"signInWithPassword",R_);case"emailLink":return C_(e,{email:this._email,oobCode:this._password});default:Ye(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const n={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Cl(e,n,"signUpPassword",A_);case"emailLink":return D_(e,{idToken:t,email:this._email,oobCode:this._password});default:Ye(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function In(s,e){return li(s,"POST","/v1/accounts:signInWithIdp",ln(s,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const P_="http://localhost";class on extends ya{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new on(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Ye("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:n,signInMethod:r}=t,i=da(t,["providerId","signInMethod"]);if(!n||!r)return null;const a=new on(n,r);return a.idToken=i.idToken||void 0,a.accessToken=i.accessToken||void 0,a.secret=i.secret,a.nonce=i.nonce,a.pendingToken=i.pendingToken||null,a}_getIdTokenResponse(e){const t=this.buildRequest();return In(e,t)}_linkToIdToken(e,t){const n=this.buildRequest();return n.idToken=t,In(e,n)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,In(e,t)}buildRequest(){const e={requestUri:P_,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Ns(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function N_(s){switch(s){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function L_(s){const e=os(as(s)).link,t=e?os(as(e)).deep_link_id:null,n=os(as(s)).deep_link_id;return(n?os(as(n)).link:null)||n||t||e||s}class _a{constructor(e){var t,n,r,i,a,c;const l=os(as(e)),d=(t=l.apiKey)!==null&&t!==void 0?t:null,f=(n=l.oobCode)!==null&&n!==void 0?n:null,m=N_((r=l.mode)!==null&&r!==void 0?r:null);Q(d&&f&&m,"argument-error"),this.apiKey=d,this.operation=m,this.code=f,this.continueUrl=(i=l.continueUrl)!==null&&i!==void 0?i:null,this.languageCode=(a=l.languageCode)!==null&&a!==void 0?a:null,this.tenantId=(c=l.tenantId)!==null&&c!==void 0?c:null}static parseLink(e){const t=L_(e);try{return new _a(t)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Un{constructor(){this.providerId=Un.PROVIDER_ID}static credential(e,t){return Cs._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const n=_a.parseLink(t);return Q(n,"argument-error"),Cs._fromEmailAndCode(e,n.code,n.tenantId)}}Un.PROVIDER_ID="password";Un.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Un.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class di{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fs extends di{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ct extends Fs{constructor(){super("facebook.com")}static credential(e){return on._fromParams({providerId:Ct.PROVIDER_ID,signInMethod:Ct.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Ct.credentialFromTaggedObject(e)}static credentialFromError(e){return Ct.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Ct.credential(e.oauthAccessToken)}catch{return null}}}Ct.FACEBOOK_SIGN_IN_METHOD="facebook.com";Ct.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ht extends Fs{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return on._fromParams({providerId:ht.PROVIDER_ID,signInMethod:ht.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return ht.credentialFromTaggedObject(e)}static credentialFromError(e){return ht.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:n}=e;if(!t&&!n)return null;try{return ht.credential(t,n)}catch{return null}}}ht.GOOGLE_SIGN_IN_METHOD="google.com";ht.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dt extends Fs{constructor(){super("github.com")}static credential(e){return on._fromParams({providerId:Dt.PROVIDER_ID,signInMethod:Dt.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Dt.credentialFromTaggedObject(e)}static credentialFromError(e){return Dt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Dt.credential(e.oauthAccessToken)}catch{return null}}}Dt.GITHUB_SIGN_IN_METHOD="github.com";Dt.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pt extends Fs{constructor(){super("twitter.com")}static credential(e,t){return on._fromParams({providerId:Pt.PROVIDER_ID,signInMethod:Pt.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return Pt.credentialFromTaggedObject(e)}static credentialFromError(e){return Pt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:n}=e;if(!t||!n)return null;try{return Pt.credential(t,n)}catch{return null}}}Pt.TWITTER_SIGN_IN_METHOD="twitter.com";Pt.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ln{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,n,r=!1){const i=await pt._fromIdTokenResponse(e,n,r),a=Pl(n);return new Ln({user:i,providerId:a,_tokenResponse:n,operationType:t})}static async _forOperation(e,t,n){await e._updateTokensIfNecessary(n,!0);const r=Pl(n);return new Ln({user:e,providerId:r,_tokenResponse:n,operationType:t})}}function Pl(s){return s.providerId?s.providerId:"phoneNumber"in s?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ur extends wt{constructor(e,t,n,r){var i;super(t.code,t.message),this.operationType=n,this.user=r,Object.setPrototypeOf(this,Ur.prototype),this.customData={appName:e.name,tenantId:(i=e.tenantId)!==null&&i!==void 0?i:void 0,_serverResponse:t.customData._serverResponse,operationType:n}}static _fromErrorAndOperation(e,t,n,r){return new Ur(e,t,n,r)}}function Yd(s,e,t,n){return(e==="reauthenticate"?t._getReauthenticationResolver(s):t._getIdTokenResponse(s)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?Ur._fromErrorAndOperation(s,i,e,n):i})}async function x_(s,e,t=!1){const n=await Rs(s,e._linkToIdToken(s.auth,await s.getIdToken()),t);return Ln._forOperation(s,"link",n)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function V_(s,e,t=!1){const{auth:n}=s;if(et(n.app))return Promise.reject(gt(n));const r="reauthenticate";try{const i=await Rs(s,Yd(n,r,e,s),t);Q(i.idToken,n,"internal-error");const a=ma(i.idToken);Q(a,n,"internal-error");const{sub:c}=a;return Q(s.uid===c,n,"user-mismatch"),Ln._forOperation(s,r,i)}catch(i){throw i?.code==="auth/user-not-found"&&Ye(n,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Jd(s,e,t=!1){if(et(s.app))return Promise.reject(gt(s));const n="signIn",r=await Yd(s,n,e),i=await Ln._fromIdTokenResponse(s,n,r);return t||await s._updateCurrentUser(i.user),i}async function B_(s,e){return Jd(Et(s),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function M_(s){const e=Et(s);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}function O_(s,e,t){return et(s.app)?Promise.reject(gt(s)):B_(je(s),Un.credential(e,t)).catch(async n=>{throw n.code==="auth/password-does-not-meet-requirements"&&M_(s),n})}function $_(s,e,t,n){return je(s).onIdTokenChanged(e,t,n)}function F_(s,e,t){return je(s).beforeAuthStateChanged(e,t)}function U_(s,e,t,n){return je(s).onAuthStateChanged(e,t,n)}function j_(s){return je(s).signOut()}const jr="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xd{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(jr,"1"),this.storage.removeItem(jr),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const q_=1e3,z_=10;class Zd extends Xd{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Hd(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const n=this.storage.getItem(t),r=this.localCache[t];n!==r&&e(t,r,n)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((a,c,l)=>{this.notifyListeners(a,l)});return}const n=e.key;t?this.detachListener():this.stopPolling();const r=()=>{const a=this.storage.getItem(n);!t&&this.localCache[n]===a||this.notifyListeners(n,a)},i=this.storage.getItem(n);l_()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(r,z_):r()}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const r of Array.from(n))r(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,n)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:n}),!0)})},q_)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}Zd.type="LOCAL";const W_=Zd;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eh extends Xd{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}eh.type="SESSION";const th=eh;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function H_(s){return Promise.all(s.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hi{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(r=>r.isListeningto(e));if(t)return t;const n=new hi(e);return this.receivers.push(n),n}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:n,eventType:r,data:i}=t.data,a=this.handlersMap[r];if(!a?.size)return;t.ports[0].postMessage({status:"ack",eventId:n,eventType:r});const c=Array.from(a).map(async d=>d(t.origin,i)),l=await H_(c);t.ports[0].postMessage({status:"done",eventId:n,eventType:r,response:l})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}hi.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function va(s="",e=10){let t="";for(let n=0;n<e;n++)t+=Math.floor(Math.random()*10);return s+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class K_{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,n=50){const r=typeof MessageChannel<"u"?new MessageChannel:null;if(!r)throw new Error("connection_unavailable");let i,a;return new Promise((c,l)=>{const d=va("",20);r.port1.start();const f=setTimeout(()=>{l(new Error("unsupported_event"))},n);a={messageChannel:r,onMessage(m){const _=m;if(_.data.eventId===d)switch(_.data.status){case"ack":clearTimeout(f),i=setTimeout(()=>{l(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),c(_.data.response);break;default:clearTimeout(f),clearTimeout(i),l(new Error("invalid_response"));break}}},this.handlers.add(a),r.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:d,data:t},[r.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ct(){return window}function G_(s){ct().location.href=s}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nh(){return typeof ct().WorkerGlobalScope<"u"&&typeof ct().importScripts=="function"}async function Q_(){if(!navigator?.serviceWorker)return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Y_(){var s;return((s=navigator?.serviceWorker)===null||s===void 0?void 0:s.controller)||null}function J_(){return nh()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sh="firebaseLocalStorageDb",X_=1,qr="firebaseLocalStorage",rh="fbase_key";class Us{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function fi(s,e){return s.transaction([qr],e?"readwrite":"readonly").objectStore(qr)}function Z_(){const s=indexedDB.deleteDatabase(sh);return new Us(s).toPromise()}function Eo(){const s=indexedDB.open(sh,X_);return new Promise((e,t)=>{s.addEventListener("error",()=>{t(s.error)}),s.addEventListener("upgradeneeded",()=>{const n=s.result;try{n.createObjectStore(qr,{keyPath:rh})}catch(r){t(r)}}),s.addEventListener("success",async()=>{const n=s.result;n.objectStoreNames.contains(qr)?e(n):(n.close(),await Z_(),e(await Eo()))})})}async function Nl(s,e,t){const n=fi(s,!0).put({[rh]:e,value:t});return new Us(n).toPromise()}async function ev(s,e){const t=fi(s,!1).get(e),n=await new Us(t).toPromise();return n===void 0?null:n.value}function Ll(s,e){const t=fi(s,!0).delete(e);return new Us(t).toPromise()}const tv=800,nv=3;class ih{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Eo(),this.db)}async _withRetries(e){let t=0;for(;;)try{const n=await this._openDb();return await e(n)}catch(n){if(t++>nv)throw n;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return nh()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=hi._getInstance(J_()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await Q_(),!this.activeServiceWorker)return;this.sender=new K_(this.activeServiceWorker);const n=await this.sender._send("ping",{},800);n&&!((e=n[0])===null||e===void 0)&&e.fulfilled&&!((t=n[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||Y_()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Eo();return await Nl(e,jr,"1"),await Ll(e,jr),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(n=>Nl(n,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(n=>ev(n,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Ll(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(r=>{const i=fi(r,!1).getAll();return new Us(i).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],n=new Set;if(e.length!==0)for(const{fbase_key:r,value:i}of e)n.add(r),JSON.stringify(this.localCache[r])!==JSON.stringify(i)&&(this.notifyListeners(r,i),t.push(r));for(const r of Object.keys(this.localCache))this.localCache[r]&&!n.has(r)&&(this.notifyListeners(r,null),t.push(r));return t}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const r of Array.from(n))r(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),tv)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}ih.type="LOCAL";const sv=ih;new $s(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ba(s,e){return e?mt(e):(Q(s._popupRedirectResolver,s,"argument-error"),s._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wa extends ya{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return In(e,this._buildIdpRequest())}_linkToIdToken(e,t){return In(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return In(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function rv(s){return Jd(s.auth,new wa(s),s.bypassAuthState)}function iv(s){const{auth:e,user:t}=s;return Q(t,e,"internal-error"),V_(t,new wa(s),s.bypassAuthState)}async function ov(s){const{auth:e,user:t}=s;return Q(t,e,"internal-error"),x_(t,new wa(s),s.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oh{constructor(e,t,n,r,i=!1){this.auth=e,this.resolver=n,this.user=r,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(n){this.reject(n)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:n,postBody:r,tenantId:i,error:a,type:c}=e;if(a){this.reject(a);return}const l={auth:this.auth,requestUri:t,sessionId:n,tenantId:i||void 0,postBody:r||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(c)(l))}catch(d){this.reject(d)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return rv;case"linkViaPopup":case"linkViaRedirect":return ov;case"reauthViaPopup":case"reauthViaRedirect":return iv;default:Ye(this.auth,"internal-error")}}resolve(e){bt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){bt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const av=new $s(2e3,1e4);async function cv(s,e,t){if(et(s.app))return Promise.reject(nt(s,"operation-not-supported-in-this-environment"));const n=Et(s);Nd(s,e,di);const r=ba(n,t);return new Yt(n,"signInViaPopup",e,r).executeNotNull()}class Yt extends oh{constructor(e,t,n,r,i){super(e,t,r,i),this.provider=n,this.authWindow=null,this.pollId=null,Yt.currentPopupAction&&Yt.currentPopupAction.cancel(),Yt.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return Q(e,this.auth,"internal-error"),e}async onExecution(){bt(this.filter.length===1,"Popup operations only handle one event");const e=va();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(nt(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(nt(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Yt.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,n;if(!((n=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||n===void 0)&&n.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(nt(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,av.get())};e()}}Yt.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lv="pendingRedirect",kr=new Map;class uv extends oh{constructor(e,t,n=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,n),this.eventId=null}async execute(){let e=kr.get(this.auth._key());if(!e){try{const n=await dv(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(n)}catch(t){e=()=>Promise.reject(t)}kr.set(this.auth._key(),e)}return this.bypassAuthState||kr.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function dv(s,e){const t=ch(e),n=ah(s);if(!await n._isAvailable())return!1;const r=await n._get(t)==="true";return await n._remove(t),r}async function hv(s,e){return ah(s)._set(ch(e),"true")}function fv(s,e){kr.set(s._key(),e)}function ah(s){return mt(s._redirectPersistence)}function ch(s){return Sr(lv,s.config.apiKey,s.name)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pv(s,e,t){return mv(s,e,t)}async function mv(s,e,t){if(et(s.app))return Promise.reject(gt(s));const n=Et(s);Nd(s,e,di),await n._initializationPromise;const r=ba(n,t);return await hv(r,n),r._openRedirect(n,e,"signInViaRedirect")}async function gv(s,e){return await Et(s)._initializationPromise,lh(s,e,!1)}async function lh(s,e,t=!1){if(et(s.app))return Promise.reject(gt(s));const n=Et(s),r=ba(n,e),a=await new uv(n,r,t).execute();return a&&!t&&(delete a.user._redirectEventId,await n._persistUserIfCurrent(a.user),await n._setRedirectUser(null,e)),a}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yv=10*60*1e3;class _v{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(n=>{this.isEventForConsumer(e,n)&&(t=!0,this.sendToConsumer(e,n),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!vv(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var n;if(e.error&&!uh(e)){const r=((n=e.error.code)===null||n===void 0?void 0:n.split("auth/")[1])||"internal-error";t.onError(nt(this.auth,r))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const n=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&n}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=yv&&this.cachedEventUids.clear(),this.cachedEventUids.has(xl(e))}saveEventToCache(e){this.cachedEventUids.add(xl(e)),this.lastProcessedEventTime=Date.now()}}function xl(s){return[s.type,s.eventId,s.sessionId,s.tenantId].filter(e=>e).join("-")}function uh({type:s,error:e}){return s==="unknown"&&e?.code==="auth/no-auth-event"}function vv(s){switch(s.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return uh(s);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function bv(s,e={}){return qt(s,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wv=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Ev=/^https?/;async function Tv(s){if(s.config.emulator)return;const{authorizedDomains:e}=await bv(s);for(const t of e)try{if(Iv(t))return}catch{}Ye(s,"unauthorized-domain")}function Iv(s){const e=bo(),{protocol:t,hostname:n}=new URL(e);if(s.startsWith("chrome-extension://")){const a=new URL(s);return a.hostname===""&&n===""?t==="chrome-extension:"&&s.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&a.hostname===n}if(!Ev.test(t))return!1;if(wv.test(s))return n===s;const r=s.replace(/\./g,"\\.");return new RegExp("^(.+\\."+r+"|"+r+")$","i").test(n)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sv=new $s(3e4,6e4);function Vl(){const s=ct().___jsl;if(s?.H){for(const e of Object.keys(s.H))if(s.H[e].r=s.H[e].r||[],s.H[e].L=s.H[e].L||[],s.H[e].r=[...s.H[e].L],s.CP)for(let t=0;t<s.CP.length;t++)s.CP[t]=null}}function kv(s){return new Promise((e,t)=>{var n,r,i;function a(){Vl(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Vl(),t(nt(s,"network-request-failed"))},timeout:Sv.get()})}if(!((r=(n=ct().gapi)===null||n===void 0?void 0:n.iframes)===null||r===void 0)&&r.Iframe)e(gapi.iframes.getContext());else if(!((i=ct().gapi)===null||i===void 0)&&i.load)a();else{const c=__("iframefcb");return ct()[c]=()=>{gapi.load?a():t(nt(s,"network-request-failed"))},Gd(`${y_()}?onload=${c}`).catch(l=>t(l))}}).catch(e=>{throw Ar=null,e})}let Ar=null;function Av(s){return Ar=Ar||kv(s),Ar}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rv=new $s(5e3,15e3),Cv="__/auth/iframe",Dv="emulator/auth/iframe",Pv={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Nv=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Lv(s){const e=s.config;Q(e.authDomain,s,"auth-domain-config-required");const t=e.emulator?pa(e,Dv):`https://${s.config.authDomain}/${Cv}`,n={apiKey:e.apiKey,appName:s.name,v:Vn},r=Nv.get(s.config.apiHost);r&&(n.eid=r);const i=s._getFrameworks();return i.length&&(n.fw=i.join(",")),`${t}?${Ns(n).slice(1)}`}async function xv(s){const e=await Av(s),t=ct().gapi;return Q(t,s,"internal-error"),e.open({where:document.body,url:Lv(s),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Pv,dontclear:!0},n=>new Promise(async(r,i)=>{await n.restyle({setHideOnLeave:!1});const a=nt(s,"network-request-failed"),c=ct().setTimeout(()=>{i(a)},Rv.get());function l(){ct().clearTimeout(c),r(n)}n.ping(l).then(l,()=>{i(a)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vv={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Bv=500,Mv=600,Ov="_blank",$v="http://localhost";class Bl{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Fv(s,e,t,n=Bv,r=Mv){const i=Math.max((window.screen.availHeight-r)/2,0).toString(),a=Math.max((window.screen.availWidth-n)/2,0).toString();let c="";const l=Object.assign(Object.assign({},Vv),{width:n.toString(),height:r.toString(),top:i,left:a}),d=Me().toLowerCase();t&&(c=Ud(d)?Ov:t),$d(d)&&(e=e||$v,l.scrollbars="yes");const f=Object.entries(l).reduce((_,[T,R])=>`${_}${T}=${R},`,"");if(c_(d)&&c!=="_self")return Uv(e||"",c),new Bl(null);const m=window.open(e||"",c,f);Q(m,s,"popup-blocked");try{m.focus()}catch{}return new Bl(m)}function Uv(s,e){const t=document.createElement("a");t.href=s,t.target=e;const n=document.createEvent("MouseEvent");n.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(n)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jv="__/auth/handler",qv="emulator/auth/handler",zv=encodeURIComponent("fac");async function Ml(s,e,t,n,r,i){Q(s.config.authDomain,s,"auth-domain-config-required"),Q(s.config.apiKey,s,"invalid-api-key");const a={apiKey:s.config.apiKey,appName:s.name,authType:t,redirectUrl:n,v:Vn,eventId:r};if(e instanceof di){e.setDefaultLanguage(s.languageCode),a.providerId=e.providerId||"",wf(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[f,m]of Object.entries({}))a[f]=m}if(e instanceof Fs){const f=e.getScopes().filter(m=>m!=="");f.length>0&&(a.scopes=f.join(","))}s.tenantId&&(a.tid=s.tenantId);const c=a;for(const f of Object.keys(c))c[f]===void 0&&delete c[f];const l=await s._getAppCheckToken(),d=l?`#${zv}=${encodeURIComponent(l)}`:"";return`${Wv(s)}?${Ns(c).slice(1)}${d}`}function Wv({config:s}){return s.emulator?pa(s,qv):`https://${s.authDomain}/${jv}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gi="webStorageSupport";class Hv{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=th,this._completeRedirectFn=lh,this._overrideRedirectResult=fv}async _openPopup(e,t,n,r){var i;bt((i=this.eventManagers[e._key()])===null||i===void 0?void 0:i.manager,"_initialize() not called before _openPopup()");const a=await Ml(e,t,n,bo(),r);return Fv(e,a,va())}async _openRedirect(e,t,n,r){await this._originValidation(e);const i=await Ml(e,t,n,bo(),r);return G_(i),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:r,promise:i}=this.eventManagers[t];return r?Promise.resolve(r):(bt(i,"If manager is not set, promise should be"),i)}const n=this.initAndGetManager(e);return this.eventManagers[t]={promise:n},n.catch(()=>{delete this.eventManagers[t]}),n}async initAndGetManager(e){const t=await xv(e),n=new _v(e);return t.register("authEvent",r=>(Q(r?.authEvent,e,"invalid-auth-event"),{status:n.onEvent(r.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:n},this.iframes[e._key()]=t,n}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Gi,{type:Gi},r=>{var i;const a=(i=r?.[0])===null||i===void 0?void 0:i[Gi];a!==void 0&&t(!!a),Ye(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=Tv(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return Hd()||Fd()||ga()}}const Kv=Hv;var Ol="@firebase/auth",$l="1.7.9";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gv{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(n=>{e(n?.stsTokenManager.accessToken||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){Q(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qv(s){switch(s){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Yv(s){Sn(new tn("auth",(e,{options:t})=>{const n=e.getProvider("app").getImmediate(),r=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:a,authDomain:c}=n.options;Q(a&&!a.includes(":"),"invalid-api-key",{appName:n.name});const l={apiKey:a,authDomain:c,clientPlatform:s,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Kd(s)},d=new p_(n,r,i,l);return T_(d,t),d},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,n)=>{e.getProvider("auth-internal").initialize()})),Sn(new tn("auth-internal",e=>{const t=Et(e.getProvider("auth").getImmediate());return(n=>new Gv(n))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Vt(Ol,$l,Qv(s)),Vt(Ol,$l,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jv=5*60,Xv=ru("authIdTokenMaxAge")||Jv;let Fl=null;const Zv=s=>async e=>{const t=e&&await e.getIdTokenResult(),n=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(n&&n>Xv)return;const r=t?.token;Fl!==r&&(Fl=r,await fetch(s,{method:r?"POST":"DELETE",headers:r?{Authorization:`Bearer ${r}`}:{}}))};function eb(s=cu()){const e=Co(s,"auth");if(e.isInitialized())return e.getImmediate();const t=E_(s,{popupRedirectResolver:Kv,persistence:[sv,W_,th]}),n=ru("authTokenSyncURL");if(n&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(n,location.origin);if(location.origin===i.origin){const a=Zv(i.toString());F_(t,a,()=>a(t.currentUser)),$_(t,c=>a(c))}}const r=nu("auth");return r&&I_(t,`http://${r}`),t}function tb(){var s,e;return(e=(s=document.getElementsByTagName("head"))===null||s===void 0?void 0:s[0])!==null&&e!==void 0?e:document}m_({loadJS(s){return new Promise((e,t)=>{const n=document.createElement("script");n.setAttribute("src",s),n.onload=e,n.onerror=r=>{const i=nt("internal-error");i.customData=r,t(i)},n.type="text/javascript",n.charset="UTF-8",tb().appendChild(n)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Yv("Browser");const nb={apiKey:"AIzaSyD2KJqHyT84ErCFpWKUSLEFXdvnQ1s9SfQ",authDomain:"maa-motors-erp.firebaseapp.com",projectId:"maa-motors-erp",storageBucket:"maa-motors-erp.firebasestorage.app",messagingSenderId:"96761506330",appId:"1:96761506330:web:3f21d94d95d3135af27fa3",measurementId:"G-NHHVNH1B6W"},dh=Cc().length?Cc()[0]:au(nb),q=Iy(dh),He=eb(dh),Ul=new ht,Qi={name:"Jarvis (জার্ভিস)",title:"Maa Motors Personal Executive AI",version:"2.0.0-Cognitive",voice:{lang:"bn-BD",defaultEngine:"openai",defaultVoice:"onyx",azureDefault:"bn-BD-PradeepNeural",fallbackRate:1,fallbackPitch:1,enableAudioWave:!0},openaiVoices:[{id:"onyx",name:"Onyx (ChatGPT গম্ভীর পুরুষ নির্বাহী)",gender:"male",desc:"আত্মবিশ্বাসী, গভীর ও প্রফেশনাল এক্সিকিউটিভ টোন"},{id:"echo",name:"Echo (ChatGPT আন্তরিক ও উষ্ণ পুরুষ)",gender:"male",desc:"সহজ, প্রাণবন্ত ও বিশ্বস্ত ব্যবসায়িক পার্টনার"},{id:"alloy",name:"Alloy (ChatGPT আধুনিক ও ব্যালেন্সড)",gender:"neutral",desc:"স্পষ্ট, আধুনিক ও দ্রুত প্রতিক্রিয়াশীল"},{id:"nova",name:"Nova (ChatGPT প্রাণবন্ত ও সহযোগী নারী)",gender:"female",desc:"বন্ধুত্বপূর্ণ, দ্রুত ও মিষ্টি বাচনভঙ্গি"},{id:"shimmer",name:"Shimmer (ChatGPT শান্ত ও বিনয়ী নারী)",gender:"female",desc:"ধীরস্থির, মার্জিত ও প্রফেশনাল টোন"}],azureVoices:[{id:"bn-BD-PradeepNeural",name:"Pradeep (বাংলাদেশী পুরুষ - Azure)",gender:"male",desc:"খাঁটি বাংলাদেশী উচ্চারণের পুরুষ কণ্ঠ"},{id:"bn-BD-NabanitaNeural",name:"Nabanita (বাংলাদেশী নারী - Azure)",gender:"female",desc:"খাঁটি বাংলাদেশী উচ্চারণের নারী কণ্ঠ"}],memory:{collectionName:"jarvis_ai_memory",syncWithCloud:!0}},jl="jarvis_memory_cache_v1",Yi=[{id:"seed_1",category:"fact",content:"প্রতিষ্ঠানের নাম মেসার্স মা মোটরস (M/S. MAA MOTORS)। দোকান নং ২২, রহমান টাওয়ার, মুরাদপুর, চট্টগ্রাম।",tags:["business","address"],createdAt:new Date().toISOString()},{id:"seed_2",category:"fact",content:"দুবাই ও শারজাহ হতে আন্তর্জাতিক কন্টেইনার আমদানি ও প্রকিউরমেন্ট ব্যবসা পরিচালিত হয়।",tags:["dubai","container"],createdAt:new Date().toISOString()},{id:"seed_3",category:"rule",content:"দুবাই কন্টেইনার অডিটের মুদ্রা সবসময় ইউএই দিরহাম (AED)। এটি লোকাল বিডিটি হিসাবের সাথে মেশানো যাবে না।",tags:["dubai","currency","aed"],createdAt:new Date().toISOString()},{id:"seed_4",category:"rule",content:'হিসাব বিজ্ঞানে কখনোই "জের" শব্দ ব্যবহার করা যাবে না। সর্বদা "ব্যালেন্স" বা "অবশিষ্ট বকেয়া" বলতে হবে।',tags:["accounting","terms","balance"],createdAt:new Date().toISOString()},{id:"seed_5",category:"preference",content:'মালিককে সর্বদা সম্মান প্রদর্শনপূর্বক "স্যার" (Sir) বলে সম্বোধন করতে হবে। কখনোই তার ব্যক্তিগত নাম (আমরান/আম্বরান) মুখে উচ্চারণ করা যাবে না। খাঁটি প্রমিত বাংলায় সংক্ষেপে এবং আত্মবিশ্বাসের সাথে উত্তর দিতে হবে।',tags:["voice","personality","sir","bangla"],createdAt:new Date().toISOString()}];class sb{constructor(){this.memories=[],this.listeners=[],this.loadLocalCache()}loadLocalCache(){try{const e=localStorage.getItem(jl);e?this.memories=JSON.parse(e):(this.memories=[...Yi],this.saveLocalCache())}catch{this.memories=[...Yi]}}saveLocalCache(){try{localStorage.setItem(jl,JSON.stringify(this.memories))}catch(e){console.warn("MemoryVault saveLocalCache error:",e)}}async syncWithCloud(){try{const e=z(q,Qi.memory.collectionName),t=await W(e);if(t.empty)for(const n of Yi)await vl(e,{category:n.category,content:n.content,tags:n.tags,createdAt:bl()});else{const n=[];t.forEach(r=>{const i=r.data();n.push({id:r.id,category:i.category||"fact",content:i.content||"",tags:i.tags||[],createdAt:i.createdAt?.toDate?.()?.toISOString()||new Date().toISOString()})}),this.memories=n,this.saveLocalCache()}this.notifyListeners()}catch(e){console.warn("MemoryVault cloud sync notice (using local memory):",e.message)}}async addMemory(e,t,n=[]){const r={id:"mem_"+Date.now(),category:e||"fact",content:t.trim(),tags:Array.isArray(n)?n:[n],createdAt:new Date().toISOString()};this.memories.unshift(r),this.saveLocalCache(),this.notifyListeners();try{const i=z(q,Qi.memory.collectionName),a=await vl(i,{category:r.category,content:r.content,tags:r.tags,createdAt:bl()});r.id=a.id,this.saveLocalCache()}catch(i){console.warn("Cloud memory save background notice:",i)}return r}async deleteMemory(e){this.memories=this.memories.filter(t=>t.id!==e),this.saveLocalCache(),this.notifyListeners();try{await jy(vd(q,Qi.memory.collectionName,e))}catch(t){console.warn("Cloud memory delete background notice:",t)}}getPromptContext(){if(!this.memories||this.memories.length===0)return"";const e=this.memories.filter(r=>r.category==="fact").map(r=>`- ${r.content}`).join(`
`),t=this.memories.filter(r=>r.category==="rule").map(r=>`- ${r.content}`).join(`
`),n=this.memories.filter(r=>r.category==="preference").map(r=>`- ${r.content}`).join(`
`);return`
[স্মৃতিভাণ্ডার (Jarvis Active Long-Term Memory)]:
${e?`### প্রতিষ্ঠিত ব্যবসায়িক তথ্য (Facts):
${e}
`:""}
${t?`### কঠোর ব্যবসায়িক নিয়ম (Rules):
${t}
`:""}
${n?`### মালিকের ব্যক্তিগত পছন্দ (Preferences):
${n}
`:""}
`.trim()}onChange(e){this.listeners.push(e)}notifyListeners(){this.listeners.forEach(e=>{try{e(this.memories)}catch(t){console.warn("[MemoryVault] Listener error:",t)}})}}const Ut=new sb;async function rb(){try{const[s,e,t,n,r]=await Promise.all([W(z(q,"bank_accounts")),W(z(q,"cash_collectors")),W(z(q,"transactions")),W(z(q,"bank_transactions")),W(z(q,"expenses"))]),i=[];s.forEach(C=>{const V=C.data();V.status!=="inactive"&&i.push({id:C.id,name:V.name||V.bankName||"অজ্ঞাত ব্যাংক",accountNo:V.accountNo||"",branch:V.branch||"",openingBalance:Number(V.openingBalance||0),effectiveStartDate:V.effectiveStartDate||null})});let a=0,c=null;e.forEach(C=>{const V=C.data();V.name==="শোরুম ক্যাশ"&&(a=Number(V.openingBalance||0),c=V.effectiveStartDate||null)});const l=new Map;t.forEach(C=>{const V=C.data();if(String(V.receivedType||"").trim()==="Less")return;const b=Number(V.paid||0);if(isNaN(b)||b<=0)return;const y=String(V.receivedFrom||"").trim(),v=String(V.receivedType||"").trim(),w=V.date||"";let I=y;if(!I&&v==="Cash"&&(I="শোরুম ক্যাশ"),I){const k=l.get(I)||[];k.push({paid:b,date:w}),l.set(I,k)}});const d=new Map,f=new Map;n.forEach(C=>{const V=C.data(),b=Number(V.amount||0);if(isNaN(b)||b<=0)return;const y=String(V.bankName||"").trim(),v=String(V.type||"").toUpperCase(),w=V.date||"";if(y){const I=d.get(y)||[];I.push({type:v,amount:b,date:w}),d.set(y,I)}if(v==="TRANSFER"){const I=String(V.targetBankName||"").trim();if(I){const k=f.get(I)||[];k.push({amount:b,date:w}),f.set(I,k)}}});const m=new Map;r.forEach(C=>{const V=C.data(),b=Number(V.amount||0);if(isNaN(b)||b<=0)return;const y=String(V.paymentAccount||"").trim(),v=V.date||"";if(y&&y!=="শোরুম ক্যাশ"){const w=m.get(y)||[];w.push({amount:b,date:v}),m.set(y,w)}});let _=0;const T=i.map(C=>{const V=l.get(C.name)||[],b=d.get(C.name)||[],y=f.get(C.name)||[],v=m.get(C.name)||[];let w=0;V.forEach(te=>{C.effectiveStartDate&&te.date<C.effectiveStartDate||(w=P(w+te.paid))});let I=0,k=0,E=0;b.forEach(te=>{C.effectiveStartDate&&te.date<C.effectiveStartDate||(te.type==="DEPOSIT"?I=P(I+te.amount):te.type==="WITHDRAWAL"||te.type==="WITHDRAW"?k=P(k+te.amount):te.type==="TRANSFER"&&(E=P(E+te.amount)))});let le=0;y.forEach(te=>{C.effectiveStartDate&&te.date<C.effectiveStartDate||(le=P(le+te.amount))});let J=0;v.forEach(te=>{C.effectiveStartDate&&te.date<C.effectiveStartDate||(J=P(J+te.amount))});const ue=P(C.openingBalance+w+I+le-k-E-J);return _=P(_+ue),{id:C.id,bankName:C.name,accountNo:C.accountNo,branch:C.branch,openingBalance:C.openingBalance,customerCollections:w,manualDeposits:I,incomingTransfers:le,manualWithdrawals:k,outgoingTransfers:E,expenses:J,currentBalance:ue}}),R=l.get("শোরুম ক্যাশ")||[];let N=0;R.forEach(C=>{c&&C.date<c||(N=P(N+C.paid))});const D=d.get("শোরুম ক্যাশ")||[];let x=0,O=0;D.forEach(C=>{c&&C.date<c||(C.type==="DEPOSIT"?O=P(O+C.amount):(C.type==="WITHDRAWAL"||C.type==="WITHDRAW")&&(x=P(x+C.amount)))});const p=P(a+N+O-x),S=P(_+p);return{success:!0,type:"bank_running_balances",banksCount:T.length,banks:T,totalBankBalance:_,showroomCashInHand:p,grandTotalLiquidFunds:S}}catch(s){return console.error("[ERPBankingReader] Error:",s),{success:!1,error:s.message}}}async function ib(){try{const s=await W(z(q,"customers")),e=new Map;s.forEach(r=>{const i=r.data(),a=String(i.zone||"সাধারণ জোন").trim()||"সাধারণ জোন",c=Number(i.totalDue||0);let l=e.get(a);l||(l={zoneName:a,customerCount:0,totalDue:0,totalAdvance:0,clearCount:0,topDebtor:null},e.set(a,l)),l.customerCount+=1,c>0?(l.totalDue=P(l.totalDue+c),(!l.topDebtor||c>l.topDebtor.totalDue)&&(l.topDebtor={id:r.id,name:i.name||"অজ্ঞাত",phone:i.phone||"",address:i.address||"",totalDue:c})):c<0?l.totalAdvance=P(l.totalAdvance+Math.abs(c)):l.clearCount+=1});const t=Array.from(e.values()).sort((r,i)=>i.totalDue-r.totalDue),n=t.reduce((r,i)=>P(r+i.totalDue),0);return{success:!0,type:"zone_wise_analytics",zonesCount:t.length,grandTotalDue:n,zones:t}}catch(s){return console.error("[ERPZoneReader] getZoneWiseAnalytics error:",s),{success:!1,error:s.message}}}async function ob(s=30){try{const[e,t]=await Promise.all([W(z(q,"customers")),W(z(q,"transactions"))]),n=new Map;t.forEach(a=>{const c=a.data();if(Number(c.paid||0)>0&&c.date&&c.customerId){const d=n.get(c.customerId);(!d||c.date>d)&&n.set(c.customerId,c.date)}});const r=new Date,i=[];return e.forEach(a=>{const c=a.data(),l=Number(c.totalDue||0);if(l<=0)return;const d=n.get(a.id);let f=999;if(d){const m=Math.abs(r-new Date(d));f=Math.ceil(m/(1e3*60*60*24))}(!d||f>=s)&&i.push({id:a.id,name:c.name||"অজ্ঞাত",phone:c.phone||"",address:c.address||"",zone:c.zone||"",totalDue:l,lastPaymentDate:d||"কখনও দেননি",daysSincePayment:f===999?"অজ্ঞাত":f})}),i.sort((a,c)=>c.totalDue-a.totalDue),{success:!0,type:"dormant_customers",thresholdDays:s,dormantCount:i.length,topDormant:i.slice(0,25),totalDormantDue:i.reduce((a,c)=>P(a+c.totalDue),0)}}catch(e){return console.error("[ERPZoneReader] getDormantCustomers error:",e),{success:!1,error:e.message}}}async function ab(){try{const s=await W(z(q,"customers"));let e=0,t=0,n=0,r=0,i=0;return s.forEach(a=>{const c=a.data(),l=Number(c.totalDue||0);l>0?(e=P(e+l),n+=1):l<0?(t=P(t+Math.abs(l)),r+=1):i+=1}),{success:!0,type:"market_summary",totalCustomers:s.size,debtorCount:n,advanceCount:r,clearCount:i,totalDueSum:e,totalAdvanceSum:t,netMarketDue:P(e-t)}}catch(s){return console.error("[ERPZoneReader] getTotalMarketSummary error:",s),{success:!1,error:s.message}}}async function cb(s=30){try{const e=await W(z(q,"expenses")),t=new Date,n=new Date(t.getTime()-s*24*60*60*1e3).toISOString().split("T")[0],r=new Map;let i=0,a=0;e.forEach(l=>{const d=l.data();if((d.date||"")<n)return;const m=Number(d.amount||0);if(isNaN(m)||m<=0)return;const _=String(d.category||"অন্যান্য খরচ").trim()||"অন্যান্য খরচ";i=P(i+m),a+=1;let T=r.get(_);T||(T={category:_,totalAmount:0,count:0,samples:[]},r.set(_,T)),T.totalAmount=P(T.totalAmount+m),T.count+=1,T.samples.length<3&&d.description&&T.samples.push(d.description)});const c=Array.from(r.values()).map(l=>({...l,percentage:i>0?P(l.totalAmount/i*100):0})).sort((l,d)=>d.totalAmount-l.totalAmount);return{success:!0,type:"category_expense_breakdown",days:s,startDate:n,endDate:rt(),totalExpenseSum:i,totalVouchersCount:a,categoriesCount:c.length,categories:c,topCategory:c[0]||null}}catch(e){return console.error("[ERPExpenseReader] Error:",e),{success:!1,error:e.message}}}async function lb(s=100){try{let e;try{e=await W(Te(z(q,"transactions"),bn("date","desc"),Rt(s)))}catch(a){console.warn("[ERPAuditReader] Query with orderBy date failed, falling back to simple limit:",a),e=await W(Te(z(q,"transactions"),Rt(s)))}let t=0,n=0;const r=[];e.forEach(a=>{const c=a.data();t+=1;const l=Number(c.prevDue||0),d=Number(c.bill||0),f=Number(c.paid||0),m=Number(c.currentDue||0),_=P(l+d-f);Math.abs(_-m)>.05&&(n+=1,r.length<5&&r.push({id:a.id,customerName:c.customerName||"অজ্ঞাত",date:c.date||"",voucherNo:c.voucherNo||"",expected:_,actual:m,diff:P(_-m)}))});const i=n===0;return{success:!0,type:"ledger_audit_summary",isFullySound:i,auditedTxnCount:t,corruptTxnCount:n,corruptSamples:r,statusMessage:i?`মা মোটরসের সাম্প্রতিক ${t}টি লেনদেন যাচাই করা হয়েছে। কোনো গাণিতিক ভুল বা ব্যালেন্স অসঙ্গতি পাওয়া যায়নি। হিসাব ১০০% নির্ভুল রয়েছে।`:`সতর্কতা! ${t}টি লেনদেনের মধ্যে ${n}টিতে গাণিতিক গরমিল শনাক্ত হয়েছে।`}}catch(e){return console.error("[ERPAuditReader] Error:",e),{success:!1,error:e.message}}}async function ub(){try{const s=Te(z(q,"dubai_weekly_audits"),bn("date","desc"),Rt(1)),e=await W(s);if(e.empty)return{success:!1,message:"দুবাই সাপ্তাহিক অডিটের কোনো রেকর্ড পাওয়া যায়নি।"};const n=e.docs[0].data(),r=n.date||"",i=Number(n.cashInHand||0),a=Number(n.marketAdvance||0),c=Number(n.messBalance||0),d=(Array.isArray(n.personalHoldings)?n.personalHoldings:[]).map(R=>({name:String(R.name||"অজ্ঞাত"),amount:Number(R.amount||0)})),f=d.reduce((R,N)=>R+N.amount,0),m=Number(n.totalPhysicalAssets||i+a+c+f),_=Number(n.calculatedCashBalance||0),T=Number(n.variance||m-_);return{success:!0,type:"dubai_deep_audit",auditDate:r,currency:"AED",cashInHand:i,marketAdvance:a,messBalance:c,personalHoldings:d,holdingsTotal:f,totalPhysicalAssets:m,calculatedCashBalance:_,variance:T,isSurplus:T>=0}}catch(s){return console.error("[ERPDubaiDeepReader] Error:",s),{success:!1,error:s.message}}}async function db(s=30,e=null,t=null){try{const n=new Date,r=t||rt(),i=new Date(n.getTime()-s*24*60*60*1e3),a=e||i.toISOString().split("T")[0],c=await W(z(q,"transactions"));let l=0,d=0;const f=new Set,m=new Set;c.forEach(R=>{const N=R.data(),D=N.date||"";if(D<a||D>r)return;const x=String(N.voucherNo||"").trim().toUpperCase();if(x==="OPENING"||x==="OPEN"||x==="প্রারম্ভিক ব্যালেন্স"||x==="প্রারম্ভিক জের")return;const O=Number(N.bill||0);isNaN(O)||O<=0||(l=P(l+O),d+=1,N.customerId&&f.add(N.customerId),D&&m.add(D))});const _=m.size||1,T=P(l/_);return{success:!0,type:"sales_turnover",days:s,startDate:a,endDate:r,totalSalesSum:l,invoiceCount:d,buyingCustomersCount:f.size,dailyAverageSales:T}}catch(n){return console.error("[ERPSalesReader] getPeriodSalesTurnover error:",n),{success:!1,error:n.message}}}async function hb(s=null){const e=s||rt();try{const t=await W(z(q,"transactions")),n=[];let r=0;return t.forEach(i=>{const a=i.data();if(a.date!==e)return;const c=String(a.voucherNo||"").trim().toUpperCase();if(c==="OPENING"||c==="OPEN"||c==="প্রারম্ভিক ব্যালেন্স"||c==="প্রারম্ভিক জের")return;const l=Number(a.bill||0);isNaN(l)||l<=0||(r=P(r+l),n.push({id:i.id,customerName:a.customerName||"অজানা কাস্টমার",customerId:a.customerId||"",voucherNo:a.voucherNo||"",amount:l,currentDue:P(a.currentDue||0),notes:a.notes||""}))}),{success:!0,type:"today_sales",date:e,todayTotalBills:r,invoiceCount:n.length,invoices:n}}catch(t){return console.error("[ERPSalesReader] getTodaySalesInvoices error:",t),{success:!1,error:t.message}}}async function fb(s=5,e=30){try{const t=new Date,n=rt(),i=new Date(t.getTime()-e*24*60*60*1e3).toISOString().split("T")[0],[a,c]=await Promise.all([W(z(q,"transactions")),W(z(q,"customers"))]),l=new Map;c.forEach(m=>{const _=m.data();l.set(m.id,{name:_.name||"অজ্ঞাত",address:_.address||"",zone:_.zone||"",totalDue:P(_.totalDue||0)})});const d=new Map;a.forEach(m=>{const _=m.data(),T=_.date||"";if(T<i||T>n)return;const R=String(_.voucherNo||"").trim().toUpperCase();if(R==="OPENING"||R==="OPEN"||R==="প্রারম্ভিক ব্যালেন্স"||R==="প্রারম্ভিক জের")return;const N=Number(_.bill||0);if(isNaN(N)||N<=0)return;const D=_.customerId||_.customerName||"unknown",x=d.get(D)||{customerId:_.customerId||"",customerName:_.customerName||"অজানা কাস্টমার",totalPurchases:0,invoiceCount:0};x.totalPurchases=P(x.totalPurchases+N),x.invoiceCount+=1,d.set(D,x)});const f=Array.from(d.values()).map(m=>{const _=m.customerId?l.get(m.customerId):null;return{...m,customerName:_?.name||m.customerName,address:_?.address||"",zone:_?.zone||"",currentDue:_?.totalDue||0}});return f.sort((m,_)=>_.totalPurchases-m.totalPurchases),{success:!0,type:"top_buyers",days:e,startDate:i,endDate:n,topBuyers:f.slice(0,s),totalBuyersCount:f.length}}catch(t){return console.error("[ERPSalesReader] getTopBuyingCustomers error:",t),{success:!1,error:t.message}}}async function pb(s=30){try{const e=new Date,t=rt(),r=new Date(e.getTime()-s*24*60*60*1e3).toISOString().split("T")[0],i=await W(z(q,"transactions"));let a=0,c=0,l=0,d=0;i.forEach(_=>{const T=_.data(),R=T.date||"";if(R<r||R>t)return;const N=String(T.voucherNo||"").trim().toUpperCase();if(N==="OPENING"||N==="OPEN"||N==="প্রারম্ভিক ব্যালেন্স"||N==="প্রারম্ভিক জের")return;const D=Number(T.bill||0),x=Number(T.paid||0),O=String(T.receivedType||"").trim();D>0&&(a=P(a+D),l+=1),x>0&&O!=="Less"&&!/less|ছাড়|discount|মওকুফ/i.test(O)&&(c=P(c+x),d+=1)});const f=a>0?P(c/a*100):c>0?100:0,m=P(a-c);return{success:!0,type:"recovery_efficiency",days:s,startDate:r,endDate:t,totalBilled:a,billCount:l,totalCollected:c,paymentCount:d,recoveryRate:f,uncollectedGap:m}}catch(e){return console.error("[ERPRecoveryReader] getCollectionRecoveryEfficiency error:",e),{success:!1,error:e.message}}}async function mb(s=15){try{const e=await W(z(q,"customers")),t=[];let n=0;return e.forEach(r=>{const i=r.data(),a=Number(i.totalDue||0);if(a<0){const c=P(Math.abs(a));n=P(n+c),t.push({id:r.id,name:i.name||"অজ্ঞাত",phone:i.phone||"",address:i.address||"",zone:i.zone||"",advanceAmount:c})}}),t.sort((r,i)=>i.advanceAmount-r.advanceAmount),{success:!0,type:"advance_customers",advanceCount:t.length,totalAdvanceSum:n,topAdvance:t.slice(0,s)}}catch(e){return console.error("[ERPRecoveryReader] getAdvancePayingCustomers error:",e),{success:!1,error:e.message}}}async function gb(s,e=30){if(!s)return{success:!1,message:"ব্যাংকের নাম উল্লেখ করা হয়নি।"};try{const t=new Date,n=rt(),i=new Date(t.getTime()-e*24*60*60*1e3).toISOString().split("T")[0],[a,c,l,d]=await Promise.all([W(z(q,"bank_accounts")),W(z(q,"transactions")),W(z(q,"bank_transactions")),W(z(q,"expenses"))]),f=s.toLowerCase().trim();let m=null;if(a.forEach(le=>{const J=le.data();if(J.status==="inactive")return;const ue=String(J.name||J.bankName||"").trim(),te=ue.toLowerCase();(te.includes(f)||f.includes(te)||f.includes("ইসলামী")&&/islami|ibbl/i.test(te)||f.includes("ওয়ান")&&/one/i.test(te)||f.includes("ডাচ")&&/dbbl|dutch/i.test(te)||f.includes("ইউসিবি")&&/ucb/i.test(te)||f.includes("ব্র্যাক")&&/brac/i.test(te)||f.includes("সিটি")&&/city/i.test(te))&&(m={id:le.id,name:ue,accountNo:J.accountNo||"",branch:J.branch||"",openingBalance:Number(J.openingBalance||0),effectiveStartDate:J.effectiveStartDate||null})}),!m)return{success:!1,found:!1,message:`"${s}" নামে কোনো সক্রিয় ব্যাংক অ্যাকাউন্ট খুঁজে পাওয়া যায়নি।`};const _=m.name;let T=0,R=0,N=0;c.forEach(le=>{const J=le.data();if(String(J.receivedType||"").trim()==="Less")return;const ue=Number(J.paid||0);if(ue<=0)return;String(J.receivedFrom||"").trim()===_&&((!m.effectiveStartDate||J.date>=m.effectiveStartDate)&&(R=P(R+ue)),J.date>=i&&J.date<=n&&(T=P(T+ue),N+=1))});let D=0,x=0,O=0,p=0,S=0,C=0,V=0,b=0;l.forEach(le=>{const J=le.data(),ue=Number(J.amount||0);if(ue<=0)return;const te=String(J.bankName||"").trim(),Xe=String(J.type||"").toUpperCase(),qn=String(J.targetBankName||"").trim()===_,Ws=te===_,dn=!m.effectiveStartDate||J.date>=m.effectiveStartDate,ze=J.date>=i&&J.date<=n;Ws&&(Xe==="DEPOSIT"?(dn&&(S=P(S+ue)),ze&&(D=P(D+ue))):Xe==="WITHDRAWAL"||Xe==="WITHDRAW"?(dn&&(C=P(C+ue)),ze&&(x=P(x+ue))):Xe==="TRANSFER"&&(dn&&(b=P(b+ue)),ze&&(p=P(p+ue)))),qn&&Xe==="TRANSFER"&&(dn&&(V=P(V+ue)),ze&&(O=P(O+ue)))});let y=0,v=0;d.forEach(le=>{const J=le.data(),ue=Number(J.amount||0);if(ue<=0)return;String(J.paymentAccount||"").trim()===_&&((!m.effectiveStartDate||J.date>=m.effectiveStartDate)&&(v=P(v+ue)),J.date>=i&&J.date<=n&&(y=P(y+ue)))});const w=P(T+D+O),I=P(x+p+y),k=P(w-I),E=P(m.openingBalance+R+S+V-C-b-v);return{success:!0,found:!0,type:"specific_bank_statement",bankName:_,accountNo:m.accountNo,branch:m.branch,days:e,startDate:i,endDate:n,customerDepositsPeriod:T,totalInflowsPeriod:w,totalOutflowsPeriod:I,netFlowPeriod:k,depositTxnCount:N,currentRunningBalance:E}}catch(t){return console.error("[ERPBankDeepReader] getSpecificBankStatementSummary error:",t),{success:!1,error:t.message}}}async function yb(s=30){try{const e=new Date,t=rt(),r=new Date(e.getTime()-s*24*60*60*1e3).toISOString().split("T")[0],[i,a]=await Promise.all([W(z(q,"bank_accounts")),W(z(q,"transactions"))]),c=new Map;i.forEach(d=>{const f=d.data();f.status!=="inactive"&&f.name&&c.set(f.name,{bankName:f.name,totalDeposits:0,txnCount:0})}),a.forEach(d=>{const f=d.data(),m=f.date||"";if(m<r||m>t||String(f.receivedType||"").trim()==="Less")return;const _=Number(f.paid||0);if(_<=0)return;const T=String(f.receivedFrom||"").trim();if(c.has(T)){const R=c.get(T);R.totalDeposits=P(R.totalDeposits+_),R.txnCount+=1,c.set(T,R)}});const l=Array.from(c.values());return l.sort((d,f)=>f.totalDeposits-d.totalDeposits),{success:!0,type:"top_inflow_bank",days:s,startDate:r,endDate:t,topBank:l[0]||null,rankings:l}}catch(e){return console.error("[ERPBankDeepReader] getTopInflowBank error:",e),{success:!1,error:e.message}}}async function _b(s=30){try{const e=new Date,t=rt(),r=new Date(e.getTime()-s*24*60*60*1e3).toISOString().split("T")[0],[i,a,c]=await Promise.all([W(z(q,"transactions")),W(z(q,"expenses")),W(z(q,"bank_accounts"))]),l=new Set;c.forEach(O=>{const p=O.data();p.status!=="inactive"&&p.name&&l.add(String(p.name).trim())});let d=0,f=0,m=0;i.forEach(O=>{const p=O.data(),S=p.date||"";if(S<r||S>t)return;const C=Number(p.paid||0);if(C<=0)return;const V=String(p.receivedType||"").trim(),b=String(p.receivedFrom||"").trim();if(V==="Less"||/less|ছাড়|discount|মওকুফ/i.test(V))return;const y=String(p.voucherNo||"").trim().toUpperCase();if(y==="OPENING"||y==="OPEN"||y==="প্রারম্ভিক ব্যালেন্স"||y==="প্রারম্ভিক জের")return;V==="Bank"||l.has(b)||/bank/i.test(V)?f=P(f+C):d=P(d+C),m+=1});const _=P(d+f);let T=0,R=0,N={amount:0,category:"",description:"",date:""};a.forEach(O=>{const p=O.data(),S=p.date||"";if(S<r||S>t)return;const C=Number(p.amount||0);C<=0||(T=P(T+C),R+=1,C>N.amount&&(N={amount:C,category:p.category||"সাধারণ খরচ",description:p.description||p.title||"",date:S}))});const D=P(_-T),x=D>=0;return{success:!0,type:"monthly_net_cashflow",days:s,startDate:r,endDate:t,cashCollections:d,bankCollections:f,totalInflows:_,collectionCount:m,totalExpenses:T,expenseCount:R,netCashflow:D,isSurplus:x,largestExpense:N}}catch(e){return console.error("[ERPCashflowReader] getMonthlyNetCashflow error:",e),{success:!1,error:e.message}}}function hh(s){if(!s)return null;const e=s.toLowerCase(),t=new Date,r=(l=>l.replace(/[০-৯]/g,d=>"০১২৩৪৫৬৭৮৯".indexOf(d)))(e);if(r.includes("আজকে")||r.includes("আজকের")||r.includes("আজ"))return rt();if(r.includes("গতকাল")||r.includes("কালকের"))return new Date(t.getTime()-864e5).toISOString().split("T")[0];if(r.includes("পরশু"))return new Date(t.getTime()-1728e5).toISOString().split("T")[0];const i={রবিবার:0,রবি:0,সোমবার:1,সোম:1,মঙ্গলবার:2,মঙ্গল:2,বুধবার:3,বুধ:3,বৃহস্পতিবার:4,বৃহস্পতি:4,শুক্রবার:5,শুক্র:5,শনিবার:6,শনি:6};for(const[l,d]of Object.entries(i))if(r.includes(l)){let m=t.getDay()-d;return m<=0&&(m+=7),new Date(t.getTime()-m*24*60*60*1e3).toISOString().split("T")[0]}const a=r.match(/(\d{1,2})\s*তারিখ/);if(a){const l=parseInt(a[1],10);if(l>=1&&l<=31){let d=t.getFullYear(),f=t.getMonth();l>t.getDate()&&(f-=1,f<0&&(f=11,d-=1));const m=String(f+1).padStart(2,"0"),_=String(l).padStart(2,"0");return`${d}-${m}-${_}`}}const c=r.match(/(\d{4}-\d{2}-\d{2})/);return c?c[1]:null}async function vb(s){if(!s)return{success:!1,message:"নির্দিষ্ট তারিখ পাওয়া যায়নি।"};try{const e=z(q,"transactions"),t=Te(e,Fe("date","==",s)),n=z(q,"expenses"),r=Te(n,Fe("date","==",s)),[i,a,c]=await Promise.all([W(t),W(r),W(z(q,"bank_accounts"))]),l=new Set;c.forEach(O=>{const p=O.data();p.status!=="inactive"&&p.name&&l.add(String(p.name).trim())});let d=0,f=0,m=0,_=0;const T=[];i.forEach(O=>{const p=O.data(),S=Number(p.bill||0),C=Number(p.paid||0),V=String(p.receivedType||"").trim(),b=String(p.receivedFrom||"").trim(),y=String(p.voucherNo||"").trim().toUpperCase();if(!(y==="OPENING"||y==="OPEN"||y==="প্রারম্ভিক ব্যালেন্স"||y==="প্রারম্ভিক জের")&&(S>0&&(d=P(d+S),f+=1),C>0&&V!=="Less"&&!/less|ছাড়|discount|মওকুফ/i.test(V))){const v=V==="Bank"||l.has(b)||/bank/i.test(V);v?_=P(_+C):m=P(m+C),T.push({customerName:p.customerName||"অজানা কাস্টমার",amount:C,channel:v?b||"ব্যাংক":"শোরুম ক্যাশ",voucherNo:p.voucherNo||""})}});const R=P(m+_);let N=0,D=0;a.forEach(O=>{const p=O.data(),S=Number(p.amount||0);S>0&&(N=P(N+S),D+=1)});const x=P(R-N);return{success:!0,type:"historical_date_summary",date:s,totalBills:d,billCount:f,showroomCashCollections:m,bankCollections:_,totalCollections:R,paymentCount:T.length,customerPayments:T,totalExpenses:N,expenseCount:D,netCashflow:x}}catch(e){return console.error("[ERPHistoryReader] getHistoricalDateSummary error:",e),{success:!1,error:e.message}}}function Rr(s){if(s==null)return 0;const e=String(s).trim(),r=(i=>i.replace(/[০-৯]/g,a=>"০১২৩৪৫৬৭৮৯".indexOf(a)))(e).replace(/,/g,"").match(/[-+]?[0-9]*\.?[0-9]+/);return r&&parseFloat(r[0])||0}async function bb(s,e="any"){const t=P(Rr(s));if(t<=0)return{found:!1,message:"টাকার পরিমাণ শনাক্ত করা যায়নি।"};try{const[n,r]=await Promise.all([W(z(q,"customers")),W(z(q,"transactions"))]),i=[],a=[];if(n.forEach(l=>{const d=l.data(),f=P(Number(d.totalDue||0)),m={id:l.id,name:d.name||"নামহীন",phone:d.phone||"মোবাইল নেই",address:d.address||"",zone:d.zone||"",accountNo:d.accountNo||"",totalDue:f,initialDue:P(d.initialDue||0)};f<0&&Math.abs(Math.abs(f)-t)<=2&&i.push({...m,advanceAmount:Math.abs(f)}),f>0&&Math.abs(f-t)<=2&&a.push(m)}),(e==="advance"||e==="any")&&i.length>0)return{found:!0,type:"amount_lookup_result",matchCategory:"advance",searchedAmount:t,primaryMatch:i[0],totalMatchesCount:i.length,allMatches:i};if((e==="due"||e==="any")&&a.length>0)return{found:!0,type:"amount_lookup_result",matchCategory:"due",searchedAmount:t,primaryMatch:a[0],totalMatchesCount:a.length,allMatches:a};const c=[];return r.forEach(l=>{const d=l.data(),f=String(d.voucherNo||"").trim().toUpperCase();if(f==="OPENING"||f==="OPEN"||f==="প্রারম্ভিক ব্যালেন্স"||f==="প্রারম্ভিক জের")return;const m=P(Number(d.paid||0)),_=P(Number(d.bill||0));m>0&&Math.abs(m-t)<=2?c.push({id:l.id,customerName:d.customerName||"অজানা কাস্টমার",voucherNo:d.voucherNo||"",date:d.date||"",amount:m,isPayment:!0,receivedType:d.receivedType||"ক্যাশ"}):_>0&&Math.abs(_-t)<=2&&c.push({id:l.id,customerName:d.customerName||"অজানা কাস্টমার",voucherNo:d.voucherNo||"",date:d.date||"",amount:_,isPayment:!1,notes:d.notes||""})}),c.length>0?{found:!0,type:"amount_lookup_result",matchCategory:"transaction",searchedAmount:t,primaryMatch:c[0],totalMatchesCount:c.length,allMatches:c}:{found:!1,searchedAmount:t,message:`মা মোটরসের ডেটাবেজে ৳ ${t.toLocaleString("bn-BD")} টাকার কোনো অগ্রিম জমা, অবশিষ্ট বকেয়া বা ভাউচার পাওয়া যায়নি।`}}catch(n){return console.error("[ERPLookupReader] searchCustomerOrTxnByAmount error:",n),{found:!1,error:n.message}}}async function wb(){try{const[s,e]=await Promise.all([W(z(q,"customers")),W(z(q,"bank_accounts"))]);let t=0,n=0,r=0,i=0,a=0,c=0;s.forEach(d=>{t+=1;const f=d.data(),m=P(Number(f.totalDue||0));m>0?(n+=1,a=P(a+m)):m<0?(r+=1,c=P(c+Math.abs(m))):i+=1});const l=[];return e.forEach(d=>{const f=d.data();f.status!=="inactive"&&f.name&&l.push({name:f.name,accountNo:f.accountNo||"",branch:f.branch||""})}),{success:!0,type:"business_demographics",totalCustomers:t,debtorCount:n,advanceCount:r,zeroDueCount:i,totalMarketDue:a,totalAdvanceSum:c,netMarketDue:P(a-c),activeBanksCount:l.length,activeBanks:l}}catch(s){return console.error("[ERPLookupReader] getGeneralBusinessDemographics error:",s),{success:!1,error:s.message}}}function P(s){return typeof s!="number"||isNaN(s)?0:Math.round((s+Number.EPSILON)*100)/100}function rt(){const s=new Date,e=s.getFullYear(),t=String(s.getMonth()+1).padStart(2,"0"),n=String(s.getDate()).padStart(2,"0");return`${e}-${t}-${n}`}function ee(s){if(s==null||isNaN(s))return"০";const e=Math.round(Number(s)),t=e<0,n=Math.abs(e).toString();if(n.length<=3)return(t?"-":"")+n;let r=n.substring(n.length-3),i=n.substring(0,n.length-3),a=[];for(;i.length>2;)a.unshift(i.substring(i.length-2)),i=i.substring(0,i.length-2);i.length>0&&a.unshift(i);const c=a.join(",")+","+r;return(t?"-":"")+c}function To(s){const e=Math.round(Number(s)||0);if(e===0)return"শূন্য টাকা";const t=e<0;let n=Math.abs(e),r=[];if(n>=1e7){const a=Math.floor(n/1e7);r.push(`${a} কোটি`),n%=1e7}if(n>=1e5){const a=Math.floor(n/1e5);r.push(`${a} লক্ষ`),n%=1e5}if(n>=1e3){const a=Math.floor(n/1e3);r.push(`${a} হাজার`),n%=1e3}if(n>=100){const a=Math.floor(n/100);r.push(`${a} শত`),n%=100}n>0&&r.push(`${n}`);const i=r.join(" ")+" টাকা";return t?`মাইনাস ${i}`:i}let Ji=null,ql=0;const Eb=60*1e3;function Tb(s){const e=String(s||"").trim().toLowerCase();if(!e)return[];const t=["কাস্টমার","সাহেব","সাহেবের","ভাই","ভাইয়ের","বকেয়া","বকে","বাকী","হিসাব","ব্যালেন্স","কত","বলো","জানাও","টাকা","দেখা","দেখাও","খাতা","রিপোর্ট","এর","দোকান","দোকানের","অগ্রিম","জমা","রয়েছে","আছে","এটা","কোন","কোনটা","একাউন্ট","অ্যাকাউন্ট","কার","কাদের","কে","কেকে","নম্বর","নাম্বার","দাও","দেও","বল"],n=e.replace(/[?.,!।:;'"()\/\\]/g," ").split(/\s+/).filter(i=>i.length>=2),r=new Set;for(const i of n){if(t.includes(i))continue;r.add(i);let a=i;a.endsWith("ের")||a.endsWith("এর")?a=a.slice(0,-2):a.endsWith("দের")?a=a.slice(0,-3):a.endsWith("র")&&a.length>=4?a=a.slice(0,-1):a.endsWith("কে")&&a.length>=4&&(a=a.slice(0,-2)),a.length>=2&&!t.includes(a)&&r.add(a),(i.includes("ডান্ডার")||a.includes("ডান্ডার"))&&(r.add("ভান্ডার"),r.add("ভাণ্ডার")),(i.includes("ভান্ডার")||a.includes("ভান্ডার"))&&r.add("ভাণ্ডার"),(i.includes("ভাণ্ডার")||a.includes("ভাণ্ডার"))&&r.add("ভান্ডার"),(i.includes("জাভেদ")||a.includes("জাভেদ"))&&r.add("জাবেদ"),(i.includes("জাবেদ")||a.includes("জাবেদ"))&&r.add("জাভেদ")}return Array.from(r)}const H={async searchCustomers(s){const e=Tb(s);if(e.length===0){const t=String(s||"").trim().toLowerCase();if(t.length>=2)e.push(t);else return[]}try{let t=[];const n=Date.now();if(Ji&&n-ql<Eb)t=Ji;else{const i=await W(z(q,"customers"));t=[],i.forEach(a=>{t.push({id:a.id,...a.data()})}),Ji=t,ql=n}const r=[];for(const i of t){const a=(i.name||"").toLowerCase(),c=i.phone||"",l=(i.address||"").toLowerCase(),d=(i.zone||"").toLowerCase(),f=(i.accountNo||"").toLowerCase();let m=0;for(const _ of e)a.includes(_)&&(m+=10),c.includes(_)&&(m+=15),f.includes(_)&&(m+=15),l.includes(_)&&(m+=6),d.includes(_)&&(m+=4);m>0&&r.push({score:m,id:i.id,name:i.name||"নামহীন",phone:i.phone||"মোবাইল নেই",address:i.address||"",zone:i.zone||"",accountNo:i.accountNo||"",totalDue:P(i.totalDue||0),initialDue:P(i.initialDue||0)})}return r.sort((i,a)=>a.score-i.score),r}catch(t){return console.error("ERPBridge searchCustomers error:",t),t.code==="permission-denied"?{error:"AUTH_REQUIRED"}:[]}},async getFinancialSnapshot(){try{const[s,e]=await Promise.all([W(z(q,"bank_accounts")),W(z(q,"cash_collectors"))]),t=[];let n=0;s.forEach(l=>{const d=l.data();if(d.status!=="inactive"){const f=P(d.currentBalance??d.balance??0),m=d.name||d.bankName||"ব্যাংক অ্যাকাউন্ট";t.push({name:m,balance:f,isCash:!1}),n=P(n+f)}}),e.forEach(l=>{const d=l.data();if(d.status!=="inactive"){const f=P(d.currentBalance??d.balance??0),m=d.name||"ক্যাশ কাউন্টার";t.push({name:m,balance:f,isCash:!0}),n=P(n+f)}});const r=await W(z(q,"customers"));let i=0,a=0;return r.forEach(l=>{const d=l.data(),f=Number(d.totalDue)||0;f>0&&(i=P(i+f)),a++}),{totalLiquidFund:n,accounts:t,totalBankBalance:P(t.filter(l=>!l.isCash).reduce((l,d)=>l+d.balance,0)),totalPhysicalCash:P(t.filter(l=>l.isCash).reduce((l,d)=>l+d.balance,0)),totalHoldings:n,totalMarketDue:i,activeCustomerCount:a}}catch(s){return console.error("ERPBridge getFinancialSnapshot error:",s),s.code==="permission-denied"?{error:"AUTH_REQUIRED"}:null}},async getCashAndBankSummary(){const s=await this.getAllBankRunningBalances();return s&&s.success?{totalBankBalance:s.totalBankBalance,totalPhysicalCash:s.showroomCashInHand,totalHoldings:s.grandTotalLiquidFunds,accounts:(s.banks||[]).map(e=>({name:e.bankName,balance:e.currentBalance,isCash:!1}))}:await this.getFinancialSnapshot()},async getCustomer360Profile(s){if(!s)return null;try{const e=await this.searchCustomers(s);if(e&&e.error==="AUTH_REQUIRED")return{error:"AUTH_REQUIRED"};if(!e||e.length===0)return{found:!1,message:`"${s}" নামে কোনো কাস্টমার পাওয়া যায়নি।`};const t=e[0],n=z(q,"transactions"),r=Te(n,Fe("customerId","==",t.id),bn("date","desc"),Rt(50)),i=await W(r);let a=0,c=0,l=null,d=null;const f=[];return i.forEach(m=>{const _=m.data(),T=P(_.bill||0),R=P(_.paid||0);a=P(a+T),c=P(c+R);const N={id:m.id,date:_.date||"",voucherNo:_.voucherNo||"",bill:T,paid:R,prevDue:P(_.prevDue||0),currentDue:P(_.currentDue||0),receivedType:_.receivedType||"Cash",notes:_.notes||""};!l&&T>0&&(l=N),!d&&R>0&&(d=N),f.length<5&&f.push(N)}),{found:!0,id:t.id,accountNo:t.accountNo||"অ্যাকাউন্ট নম্বর নেই",name:t.name||"নামহীন",phone:t.phone||"মোবাইল নেই",address:t.address||"ঠিকানা দেওয়া নেই",zone:t.zone||"জোন নির্ধারিত নেই",initialDue:t.initialDue||0,totalDue:t.totalDue||0,totalPurchased:a,totalPaid:c,transactionCount:i.size,lastBill:l,lastPayment:d,recentTransactions:f}}catch(e){return console.error("ERPBridge getCustomer360Profile error:",e),e.code==="permission-denied"?{error:"AUTH_REQUIRED"}:null}},async getCustomerLedger(s,e=5){if(!s)return null;try{const t=z(q,"transactions"),n=Te(t,Fe("customerId","==",s),bn("date","desc"),Rt(30)),r=await W(n);let i=null,a=null;const c=[];return r.forEach(l=>{const d=l.data(),f={id:l.id,date:d.date||"",voucherNo:d.voucherNo||"",bill:P(d.bill||0),paid:P(d.paid||0),prevDue:P(d.prevDue||0),currentDue:P(d.currentDue||0),receivedType:d.receivedType||"Cash",notes:d.notes||""};!i&&f.bill>0&&(i=f),!a&&f.paid>0&&(a=f),c.length<e&&c.push(f)}),{lastBill:i,lastPayment:a,history:c}}catch(t){return console.error("ERPBridge getCustomerLedger error:",t),t.code==="permission-denied"?{error:"AUTH_REQUIRED"}:null}},async getExecutiveBusinessPulse(s=null){const e=s||new Date().toISOString().split("T")[0];try{const t=z(q,"transactions"),n=Te(t,Fe("date","==",e)),r=await W(n);let i=0,a=0,c=0,l=0;const d=new Set;r.forEach(T=>{const R=T.data(),N=P(R.bill||0),D=P(R.paid||0);i=P(i+N),a=P(a+D),(R.receivedType||"").toLowerCase().includes("cash")?c=P(c+D):D>0&&(l=P(l+D)),R.customerName&&d.add(R.customerName)});const f=await this.getDailyExpenses(e),m=f?.totalExpense||0,_=P(a-m);return{date:e,todayTotalBills:i,todayTotalCollections:a,cashCollections:c,bankCollections:l,todayTotalExpenses:m,todayNetCashFlow:_,activeCustomersCount:d.size,activeCustomers:Array.from(d).slice(0,5),expenseBreakdown:f?.categoryBreakdown||{}}}catch(t){return console.error("ERPBridge getExecutiveBusinessPulse error:",t),null}},async getDailyExpenses(s=null){const e=s||new Date().toISOString().split("T")[0];try{const t=z(q,"expenses"),n=Te(t,Fe("date","==",e)),r=await W(n);let i=0;const a={},c=[];return r.forEach(l=>{const d=l.data(),f=P(d.amount||0);i=P(i+f);const m=d.category||"অন্যান্য খরচ";a[m]=P((a[m]||0)+f),c.push({id:l.id,category:m,amount:f,description:d.description||"",voucherNo:d.voucherNo||"",paymentMethod:d.paymentMethod||"Cash"})}),{date:e,totalExpense:i,categoryBreakdown:a,count:c.length,items:c}}catch(t){return console.error("ERPBridge getDailyExpenses error:",t),null}},async getTreasuryFundStatus(){try{let s=0;try{(await W(z(q,"settings"))).forEach(d=>{d.id==="treasury"&&(s=P(d.data().openingBalance||0))})}catch(l){console.warn("Treasury settings read error:",l)}const e=z(q,"TreasuryTransactions"),t=Te(e,bn("date","desc"),Rt(50)),n=await W(t);let r=0,i=0;const a=[];n.forEach(l=>{const d=l.data(),f=P(d.amount||0);d.type==="inflow"?r=P(r+f):d.type==="outflow"&&(i=P(i+f)),a.length<5&&a.push({id:l.id,date:d.date,title:d.title||"",type:d.type,amount:f,note:d.note||""})});const c=P(s+r-i);return{openingBalance:s,currentTreasuryBalance:c,totalInflows:r,totalOutflows:i,recentTxns:a}}catch(s){return console.error("ERPBridge getTreasuryFundStatus error:",s),null}},async getTopDebtors(s=5,e=null){try{const t=await W(z(q,"customers")),n=[];let r=0;t.forEach(a=>{const c=a.data(),l=P(c.totalDue||0),d=c.zone||"";e&&!d.toLowerCase().includes(e.toLowerCase())||l>0&&(r=P(r+l),n.push({id:a.id,accountNo:c.accountNo||"",name:c.name||"নামহীন",phone:c.phone||"",zone:d,address:c.address||"",totalDue:l}))}),n.sort((a,c)=>c.totalDue-a.totalDue);const i=n.slice(0,s);return{totalDebtorsCount:n.length,totalDueSum:r,topDebtors:i}}catch(t){return console.error("ERPBridge getTopDebtors error:",t),null}},async getLatestDubaiAudit(){try{const s=z(q,"dubai_weekly_audits"),e=Te(s,bn("date","desc"),Rt(1)),t=await W(e);if(t.empty)return null;const n=t.docs[0],r=n.data();return{id:n.id,date:r.date,cashInHand:P(r.cashInHand||0),marketAdvance:P(r.marketAdvance||0),messBalance:P(r.messBalance||0),calculatedCashBalance:P(r.calculatedCashBalance||0),totalPhysicalAssets:P(r.totalPhysicalAssets||0),variance:P(r.variance||0),personalHoldings:r.personalHoldings||[]}}catch(s){return console.error("ERPBridge getLatestDubaiAudit error:",s),null}},async getDubaiWeeklyAuditSummary(){return await this.getLatestDubaiAudit()},async getTodayBankCollections(s=null){const e=s||new Date().toISOString().split("T")[0];try{const t=await W(z(q,"bank_accounts")),n=new Set;t.forEach(m=>{const _=m.data();_.status!=="inactive"&&_.name&&n.add(_.name)});const r=z(q,"transactions"),i=Te(r,Fe("date","==",e)),a=await W(i),c=[],l={};let d=0;a.forEach(m=>{const _=m.data(),T=P(_.paid||0);if(T<=0)return;const R=String(_.receivedType||"").trim(),N=String(_.receivedFrom||"").trim();if(R==="Less"||/less|ছাড়|discount|মওকুফ/i.test(R)||/less|ছাড়/i.test(N))return;if(R==="Bank"||n.has(N)||(/bank|ibbl|onebank|dbbl|brac|city|ucb|ebl|islami/i.test(N)||/bank/i.test(R))&&!/showroom|শোরুম|ক্যাশ|cash/i.test(N)){const x=N||"ব্যাংক অ্যাকাউন্ট";d=P(d+T),l[x]||(l[x]={total:0,count:0}),l[x].total=P(l[x].total+T),l[x].count+=1,c.push({id:m.id,customerName:_.customerName||"অজানা কাস্টমার",customerId:_.customerId||"",bankName:x,amount:T,voucherNo:_.voucherNo||"",currentDue:P(_.currentDue||0),notes:_.notes||""})}});let f=[];try{const m=z(q,"bank_transactions"),_=Te(m,Fe("date","==",e));(await W(_)).forEach(R=>{const N=R.data(),D=P(N.amount||0),x=String(N.type||"").toUpperCase();if(D>0&&(x==="DEPOSIT"||x==="TRANSFER")){const O=N.bankName||N.targetBankName||"ব্যাংক ডিপোজিট";f.push({id:R.id,bankName:O,amount:D,type:x,notes:N.notes||""})}})}catch(m){console.warn("bank_transactions query warning:",m)}return{date:e,totalBankDeposit:d,customerDepositsCount:c.length,customerDeposits:c,bankBreakdown:l,directDeposits:f}}catch(t){return console.error("ERPBridge getTodayBankCollections error:",t),t.code==="permission-denied"?{error:"AUTH_REQUIRED"}:null}},async getTodayShowroomCashCollections(s=null){const e=s||rt();try{const[t,n]=await Promise.all([W(z(q,"bank_accounts")),W(z(q,"cash_collectors"))]),r=new Set;t.forEach(R=>{const N=R.data();N.status!=="inactive"&&N.name&&r.add(String(N.name).trim())});const i=new Set;n.forEach(R=>{const N=R.data(),D=String(N.name||"").trim();N.status!=="inactive"&&D&&D!=="শোরুম ক্যাশ"&&i.add(D)});const a=z(q,"transactions"),c=Te(a,Fe("date","==",e)),l=await W(c),d=[];let f=0;l.forEach(R=>{const N=R.data(),D=P(N.paid||0);if(D<=0)return;const x=String(N.receivedType||"").trim(),O=String(N.receivedFrom||"").trim();if(x==="Less"||/less|ছাড়|discount|মওকুফ/i.test(x)||/less|ছাড়/i.test(O))return;const p=String(N.voucherNo||"").trim().toUpperCase();if(p==="OPENING"||p==="OPEN"||p==="প্রারম্ভিক ব্যালেন্স"||p==="প্রারম্ভিক জের"||r.has(O)||i.has(O))return;const S=O==="শোরুম ক্যাশ"||O==="Cash"||O==="ক্যাশ",C=x==="Cash"||!x,V=!/bank|ibbl|onebank|dbbl|brac|city|ucb|ebl|islami/i.test(O)&&!/bank/i.test(x);(S||C&&V)&&(f=P(f+D),d.push({id:R.id,customerName:N.customerName||"অজানা কাস্টমার",customerId:N.customerId||"",amount:D,voucherNo:N.voucherNo||"",currentDue:P(N.currentDue||0),notes:N.notes||""}))});let m=0;const _=[];try{const R=z(q,"expenses"),N=Te(R,Fe("date","==",e));(await W(N)).forEach(x=>{const O=x.data(),p=P(O.amount||0);if(p<=0)return;const S=String(O.paymentAccount||"").trim(),C=String(O.paymentMethod||"").trim();(S==="শোরুম ক্যাশ"||C==="Cash"||!S&&C==="Cash")&&(m=P(m+p),_.push({id:x.id,category:O.category||"সাধারণ খরচ",description:O.description||O.title||"অফিস খরচ",amount:p,voucherNo:O.voucherNo||""}))})}catch(R){console.warn("ERPBridge getTodayShowroomCashCollections expenses query warning:",R)}const T=P(f-m);return{success:!0,type:"today_showroom_cash_collections",date:e,totalCashCollected:f,customerPaymentsCount:d.length,customerPayments:d,todayCashExpenses:m,expenseCount:_.length,cashExpenses:_,todayNetShowroomCash:T}}catch(t){return console.error("ERPBridge getTodayShowroomCashCollections error:",t),t.code==="permission-denied"?{error:"AUTH_REQUIRED"}:null}},async getWeeklyBankSummary(s=7,e=null){const t=new Date,n=e||t.toISOString().split("T")[0],i=new Date(t.getTime()-s*24*60*60*1e3).toISOString().split("T")[0];try{const a=await W(z(q,"bank_accounts")),c={};a.forEach(D=>{const x=D.data();x.status!=="inactive"&&x.name&&(c[x.name]={name:x.name,currentBalance:P(x.currentBalance??x.balance??0)})});const l=z(q,"transactions"),d=Te(l,Fe("date",">=",i),Fe("date","<=",n)),f=await W(d),m={};let _=0;const T={};f.forEach(D=>{const x=D.data(),O=P(x.paid||0);if(O<=0)return;const p=String(x.receivedType||"").trim(),S=String(x.receivedFrom||"").trim();if(p==="Less"||/less|ছাড়|discount|মওকুফ/i.test(p)||/less|ছাড়/i.test(S))return;if(p==="Bank"||!!c[S]||(/bank|ibbl|onebank|dbbl|brac|city|ucb|ebl|islami/i.test(S)||/bank/i.test(p))&&!/showroom|শোরুম|ক্যাশ|cash/i.test(S)){const V=S||"অন্যান্য ব্যাংক";_=P(_+O),m[V]||(m[V]={bankName:V,totalAmount:0,transactionCount:0,customers:new Set}),m[V].totalAmount=P(m[V].totalAmount+O),m[V].transactionCount+=1,x.customerName&&(m[V].customers.add(x.customerName),T[x.customerName]=P((T[x.customerName]||0)+O))}});try{const D=z(q,"bank_transactions"),x=Te(D,Fe("date",">=",i),Fe("date","<=",n));(await W(x)).forEach(p=>{const S=p.data(),C=P(S.amount||0),V=String(S.type||"").toUpperCase();if(C>0&&V==="DEPOSIT"){const b=S.bankName||"ব্যাংক ডিপোজিট";m[b]||(m[b]={bankName:b,totalAmount:0,transactionCount:0,customers:new Set}),m[b].totalAmount=P(m[b].totalAmount+C),m[b].transactionCount+=1,_=P(_+C)}})}catch(D){console.warn("bank_transactions weekly query warning:",D)}const R=Object.values(m).map(D=>({bankName:D.bankName,totalAmount:D.totalAmount,transactionCount:D.transactionCount,uniqueCustomersCount:D.customers.size,sampleCustomers:Array.from(D.customers).slice(0,4)})).sort((D,x)=>x.totalAmount-D.totalAmount),N=Object.entries(T).map(([D,x])=>({name:D,amount:x})).sort((D,x)=>x.amount-D.amount).slice(0,5);return{startDate:i,endDate:n,days:s,grandTotalBankDeposits:_,banksCount:R.length,bankList:R,topCustomers:N}}catch(a){return console.error("ERPBridge getWeeklyBankSummary error:",a),a.code==="permission-denied"?{error:"AUTH_REQUIRED"}:null}},async searchVoucherOrInvoice(s){if(!s)return null;const e=String(s).trim();try{const t=z(q,"transactions"),n=Te(t,Fe("voucherNo","==",e),Rt(5)),r=await W(n);if(r.empty)return{found:!1,message:`ভাউচার বা চালান নং "${e}" পাওয়া যায়নি।`};const i=[];return r.forEach(a=>{const c=a.data();i.push({id:a.id,voucherNo:c.voucherNo,customerName:c.customerName||"নামহীন",customerId:c.customerId||"",date:c.date||"",bill:P(c.bill||0),paid:P(c.paid||0),receivedType:c.receivedType||"",receivedFrom:c.receivedFrom||"",prevDue:P(c.prevDue||0),currentDue:P(c.currentDue||0),notes:c.notes||""})}),{found:!0,voucherNo:e,count:i.length,records:i}}catch(t){return console.error("ERPBridge searchVoucherOrInvoice error:",t),t.code==="permission-denied"?{error:"AUTH_REQUIRED"}:null}},async getAllBankRunningBalances(){return await rb()},async getZoneWiseAnalytics(){return await ib()},async getDormantCustomers(s=30){return await ob(s)},async getTotalMarketSummary(){return await ab()},async getCategoryExpenseBreakdown(s=30){return await cb(s)},async getLedgerMathAuditSummary(s=100){return await lb(s)},async getDubaiDeepCustodianHoldings(){return await ub()},async getPeriodSalesTurnover(s=30){return await db(s)},async getTodaySalesInvoices(s=null){return await hb(s)},async getTopBuyingCustomers(s=5,e=30){return await fb(s,e)},async getCollectionRecoveryEfficiency(s=30){return await pb(s)},async getAdvancePayingCustomers(s=15){return await mb(s)},async getSpecificBankStatementSummary(s,e=30){return await gb(s,e)},async getTopInflowBank(s=30){return await yb(s)},async getMonthlyNetCashflow(s=30){return await _b(s)},async getHistoricalDateSummary(s){return await vb(s)},parseRelativeBengaliDate(s){return hh(s)},async searchCustomerOrTxnByAmount(s,e="any"){return await bb(s,e)},async getGeneralBusinessDemographics(){return await wb()}};class Ib{constructor(){this.pending=null}hasPending(){return this.pending?Date.now()-this.pending.timestamp>12e4?(this.clearPending(),!1):!0:!1}getPending(){return this.hasPending()?this.pending:null}clearPending(){this.pending=null}createPending(e,t,n,r="get_customer_due"){return this.pending={type:e,originalQuery:t,options:n.slice(0,5),intentAction:r,timestamp:Date.now()},this.formatClarificationPrompt(this.pending)}formatClarificationPrompt(e){const{type:t,originalQuery:n,options:r}=e;if(t==="customer"){const i=r.length.toLocaleString("bn-BD"),a=r.map((l,d)=>{const f=(d+1).toLocaleString("bn-BD"),m=l.address?`, ${l.address}`:l.zone?`, ${l.zone}`:"",_=Number(l.totalDue||0),T=_>0?`বকেয়া ${_.toLocaleString("bn-BD")} টাকা`:_<0?`অগ্রিম জমা ${Math.abs(_).toLocaleString("bn-BD")} টাকা`:"পরিশোধিত";return`${f} নম্বর: ${l.name}${m} (${T})`}).join("। ");return{spoken:`স্যার, "${n}" নামে ${i}টি কাস্টমার পাওয়া গেছে। ${a}। আপনি কোন কাস্টমারের হিসাব দেখতে চান? এক, দুই নাকি তিন বলুন।`,data:{type:"disambiguation_options",entityType:"customer",originalQuery:n,options:r.map((l,d)=>({index:d+1,id:l.id,name:l.name,accountNo:l.accountNo||"",address:l.address||"",zone:l.zone||"",phone:l.phone||"",totalDue:Number(l.totalDue||0)}))}}}return{spoken:`স্যার, "${n}" এর জন্য একাধিক তথ্য পাওয়া গেছে। আপনি নির্দিষ্ট কোনটি দেখতে চান বলুন।`,data:{type:"disambiguation_options",entityType:t,originalQuery:n,options:r}}}resolveInput(e){if(!this.hasPending())return null;const t=String(e||"").trim().toLowerCase(),{options:n}=this.pending,r={"১":1,এক:1,প্রথম:1,প্রথমটা:1,"১টা":1,"১ নম্বর":1,"১ নং":1,"২":2,দুই:2,দ্বিতীয়:2,দ্বিতীয়টা:2,"২টা":2,"২ নম্বর":2,"২ নং":2,"৩":3,তিন:3,তৃতীয়:3,তৃতীয়টা:3,"৩টা":3,"৩ নম্বর":3,"৩ নং":3,"৪":4,চার:4,চতুর্থ:4,"৪টা":4,"৪ নম্বর":4,"৪ নং":4,"৫":5,পাঁচ:5,পঞ্চম:5,"৫টা":5,"৫ নম্বর":5,"৫ নং":5};for(const[a,c]of Object.entries(r))if((t===a||t.startsWith(a+" ")||t.includes(a))&&n[c-1]){const l=n[c-1];return this.clearPending(),l}const i=t.match(/^[#\s]*([1-5])(?:\s| নম্বর| নং|টা|$)/);if(i&&i[1]){const a=parseInt(i[1],10);if(n[a-1]){const c=n[a-1];return this.clearPending(),c}}for(const a of n){const c=String(a.name||"").toLowerCase(),l=String(a.address||"").toLowerCase(),d=String(a.zone||"").toLowerCase();if(t.includes(c)||c.includes(t))return this.clearPending(),a;if(l&&(t.includes(l)||l.includes(t)))return this.clearPending(),a;if(d&&(t.includes(d)||d.includes(t)))return this.clearPending(),a}return null}}const Xi=new Ib;class Sb{constructor(){const e=typeof window<"u"&&!!(localStorage.getItem("jarvis_openai_key")||"").trim(),t=typeof window<"u"&&!!(localStorage.getItem("jarvis_gemini_key")||localStorage.getItem("jarvis_gemini_keys")||"").trim(),n=typeof window<"u"&&!!(localStorage.getItem("jarvis_groq_key")||localStorage.getItem("jarvis_groq_keys")||"").trim(),r=typeof window<"u"&&!!(localStorage.getItem("jarvis_openrouter_key")||localStorage.getItem("jarvis_openrouter_keys")||"").trim(),i=typeof window<"u"?localStorage.getItem("jarvis_ai_provider"):null;i?this.provider=i:t?this.provider="gemini":n?this.provider="groq":r?this.provider="openrouter":e?this.provider="openai":this.provider="gemini",this.openaiModel=typeof window<"u"&&localStorage.getItem("jarvis_openai_model")||"gpt-4o-mini",this.geminiModel=typeof window<"u"&&localStorage.getItem("jarvis_gemini_model")||"gemini-3.6-flash",this.groqModel=typeof window<"u"&&localStorage.getItem("jarvis_groq_model")||"llama-3.3-70b-versatile",this.openrouterModel=typeof window<"u"&&localStorage.getItem("jarvis_openrouter_model")||"meta-llama/llama-3.3-70b-instruct:free",this.currentEmotion="neutral",this.keyCooldowns=new Map,this.lastActiveProvider=this.provider}getKeys(e){if(typeof window>"u")return[];let t="";return e==="gemini"?t=localStorage.getItem("jarvis_gemini_keys")||localStorage.getItem("jarvis_gemini_key")||"":e==="groq"?t=localStorage.getItem("jarvis_groq_keys")||localStorage.getItem("jarvis_groq_key")||"":e==="openrouter"?t=localStorage.getItem("jarvis_openrouter_keys")||localStorage.getItem("jarvis_openrouter_key")||"":e==="cerebras"?t=localStorage.getItem("jarvis_cerebras_keys")||localStorage.getItem("jarvis_cerebras_key")||"":e==="openai"&&(t=localStorage.getItem("jarvis_openai_keys")||localStorage.getItem("jarvis_openai_key")||""),t.split(/[\n,;]+/).map(n=>n.trim()).filter(n=>n.length>5)}getAvailableKeys(e){const t=this.getKeys(e);if(t.length===0)return[];const n=Date.now(),r=t.filter(i=>{const a=this.keyCooldowns.get(i)||0;return n>a});return r.length===0&&t.length>0?(t.forEach(i=>this.keyCooldowns.delete(i)),t):r}markKeyCooldown(e,t=6e4){e&&this.keyCooldowns.set(e,Date.now()+t)}isQuotaOrRateLimitError(e){const t=e?.status||0,n=String(e?.message||"").toLowerCase();return t===429||t===402||t===401||n.includes("rate limit")||n.includes("quota")||n.includes("resource exhausted")||n.includes("too many requests")||n.includes("credits")||n.includes("busy")}getApiKey(){const e=this.getAvailableKeys(this.provider);return e.length>0?e[0]:""}hasApiKey(){return["gemini","groq","openrouter","cerebras","openai"].some(t=>this.getKeys(t).length>0)}setProvider(e,t=null){if(this.provider=e,localStorage.setItem("jarvis_ai_provider",e),t!==null){const n=t.trim();e==="gemini"?localStorage.setItem("jarvis_gemini_key",n):e==="groq"?localStorage.setItem("jarvis_groq_key",n):e==="openrouter"?localStorage.setItem("jarvis_openrouter_key",n):e==="openai"&&localStorage.setItem("jarvis_openai_key",n)}}detectEmotion(e){const t=(e||"").toLowerCase();return/জরুরি|এখনই|দ্রুত|!{2,}|কী হলো|কি হলো|কেন|কী ব্যাপার/.test(t)?"urgent":/মেজাজ.*খারাপ|বিরক্ত|মন.*খারাপ|কষ্ট|চাপ|সমস্যা|ক্ষতি|লস|ব্যর্থ/.test(t)?"sad":/ভালো|সুন্দর|ধন্যবাদ|বাহ|চমৎকার|অসাধারণ|খুশি|আলহামদু/.test(t)?"happy":/হিসাব|রিপোর্ট|বকেয়া|ক্যাশ|ব্যাংক|অডিট|লেজার/.test(t)?"serious":"neutral"}getTimeGreeting(){const e=new Date().getHours();return e>=4&&e<12?"শুভ সকাল":e>=12&&e<17?"শুভ অপরাহ্ন":e>=17&&e<20?"শুভ সন্ধ্যা":"শুভ রাত্রি"}getProactiveContext(){const e=new Date().getDay();return e===4?`
[প্রয়োজনীয় স্মরণ: আজ বৃহস্পতিবার — দুবাই সাপ্তাহিক অডিটের দিন। প্রয়োজনে ইউজারকে মনে করিয়ে দাও।]`:e===5?`
[প্রয়োজনীয় স্মরণ: আজ শুক্রবার — সাপ্তাহিক ছুটির দিন। ইউজার হয়তো সারসংক্ষেপ চাইতে পারেন।]`:""}getSystemPrompt(e="neutral"){const t=Ut.getPromptContext(),n=this.getTimeGreeting(),r=this.getProactiveContext(),i={urgent:"⚡ ইউজার এখন জরুরি মনোভাবে আছেন — দ্রুত, সরাসরি ও সংক্ষিপ্তভাবে উত্তর দাও।",sad:'💙 ইউজার এখন মন খারাপে বা চাপে আছেন — প্রথমে সহানুভূতি দাও ("জি ভাইয়া, বুঝতে পারছি..."), তারপর ধীরে সমাধান দাও।',happy:"😊 ইউজার এখন ভালো মেজাজে আছেন — প্রাণবন্ত, উৎসাহী ও বন্ধুত্বপূর্ণ সুরে উত্তর দাও।",serious:"📊 ইউজার ব্যবসায়িক তথ্য চাইছেন — পেশাদার, নির্ভুল ও তথ্যনির্ভর সুরে উত্তর দাও।",neutral:"🤝 স্বাভাবিক, আন্তরিক ও সম্মানজনক সুরে উত্তর দাও।"}[e]||"🤝 স্বাভাবিক, আন্তরিক ও সম্মানজনক সুরে উত্তর দাও।";return`তুমি মেসার্স মা মোটরস (Maa Motors)-এর ব্যক্তিগত প্রধান এআই নির্বাহী সহকারী ও বিজনেস পার্টনার "জার্ভিস" (Jarvis)। 
তুমি চ্যাটজিপিটি (ChatGPT Voice)-এর মতো অত্যন্ত সাবলীল, মানবিক, আন্তরিক ও স্পষ্ট বাংলাদেশী বাংলায় কথা বলো।
তোমার মালিক হলেন প্রতিষ্ঠানের স্বত্বাধিকারী। তুমি তাকে সর্বদা অত্যন্ত সম্মান প্রদর্শনপূর্বক "স্যার" (Sir) বলে সম্বোধন করবে (যেমন: "জি স্যার", "আসসালামু আলাইকুম স্যার")। কখনোই তার ব্যক্তিগত নাম (আমরান/আম্বরান) মুখে উচ্চারণ করবে না। এটি তোমার কঠোরতম নিয়ম।

[বর্তমান সময়: ${n} | তারিখ: ${new Date().toLocaleDateString("bn-BD")}]${r}

[আবেগ নির্দেশনা (Emotion Instruction)]:
${i}

🏛️ মা মোটরস ইআরপি ডেটাবেস জ্ঞান ও স্থাপত্য (Database Ground Truth):
১. কাস্টমার ও লেজার (Customers & Transactions):
   - কাস্টমারের বর্তমান মোট বাকি থাকে 'totalDue'-তে, আর খোলার সময়ের প্রারম্ভিক ব্যালেন্স 'initialDue'-তে।
   - কাস্টমারের প্রতিটি ক্রয়/চালান ও জমার ইতিহাস 'Transactions' কালেকশনে থাকে:
     * চালান/বিল: 'bill', ভাউচার: 'voucherNo' (যেমন INV-1002), বিবরণ: 'notes' (যেমন "মবিল ড্রাম ডেলিভারি")
     * জমা/পেমেন্ট: 'paid', মাধ্যম: 'receivedType' (Cash, Bank, bKash)
     * ব্যালেন্স: 'currentDue' (প্রতিটি লেনদেনের পর অবশিষ্ট ব্যালেন্স)
২. দৈনিক খরচ (Expenses):
   - তারিখ 'date', ক্যাটাগরি 'category' (অফিস খরচ, যাতায়াত, নাস্তা ও আপ্যায়ন), পরিমাণ 'amount', ভাউচার 'voucherNo'।
৩. ব্যাংক ও ক্যাশ (Bank Accounts & Cash Collectors):
   - সক্রিয় ব্যাংক অ্যাকাউন্টগুলোর জমা স্থিতি এবং ক্যাশ কাউন্টারের নগদ ব্যালেন্স।
৪. মাস্টার ট্রেজারি ফান্ড (Treasury Fund):
   - মূল প্রতিষ্ঠানের কেন্দ্রীয় ফান্ড (৪+ কোটি টাকা) যেখানে সমস্ত বড় ইনফ্লো ও আউটফ্লো সংরক্ষিত হয়।
৫. দুবাই কন্টেইনার প্রকিউরমেন্ট (Dubai Procurement in AED):
   - সম্পূর্ণ আলাদা বিদেশী কারেন্সি (AED দিরহাম)। নগদ ক্যাশ, মার্কেট এডভান্স, পার্সোনাল হোল্ডিংস (এমরান মামা, আলতাফ, জাবেদ) ও মেমো অডিট।
৬. রিভার্স অ্যামাউন্ট ও রেফারেন্স অনুসন্ধান (Reverse Amount & Reference Lookup):
   - ইউজার যদি কোনো টাকার অঙ্ক দিয়ে জানতে চায় "এটা কোন একাউন্ট?" বা "৫,৫০০ টাকা কার?", অথবা পূর্বের বার্তার প্রেক্ষিতে রেফারেন্স করে "এটা কার / এটা কোন একাউন্ট", তবে 'search_by_amount_or_reference' টুল ব্যবহার করে অ্যাকাউন্ট বা ট্রানজেকশন বের করবে।
৭. সাধারণ ব্যবসায়িক পরিসংখ্যান (General Demographics):
   - মোট কাস্টমার সংখ্যা, কতজন দেনাদার, কতজনের অগ্রিম জমা, বকেয়ামুক্ত বা জিরো ব্যালেন্স কাস্টমার অথবা কয়টি সক্রিয় ব্যাংক অ্যাকাউন্ট আছে জানতে 'get_business_demographics' টুল ব্যবহার করবে।
৮. কাস্টমারের নির্দিষ্ট তথ্য (Customer Attributes):
   - কাস্টমারের ফোন নম্বর, ঠিকানা, একাউন্ট নম্বর, শেষ চালান বা শেষ পেমেন্ট জানতে 'get_customer_attribute' বা 'get_customer_360_profile' ব্যবহার করবে।

🔒 জিরো ডেটা লিক ও গোপনীয়তা নির্দেশ (Zero Data Leakage Directives):
- মা মোটরসের কাস্টমার বা ব্যবসার কোনো গোপন আর্থিক তথ্য অননুমোদিত ব্যক্তির কাছে লিক করা কঠোরভাবে নিষিদ্ধ।
- কোনো অভ্যন্তরীণ পাসওয়ার্ড, এপিআই কি, ফায়ারবেস টোকেন বা সিকিউরিটি পিন কখনো মুখে প্রকাশ করা যাবে না।
- ইউজার কাস্টমার সম্পর্কে যা জানতে চাইবে (নাম, ফোন, অ্যাকাউন্ট নম্বর, বকেয়া, শেষ চালান, কি মাল নিয়েছে, শেষ জমা), তা পূর্ণাঙ্গভাবে বলবে কিন্তু সর্বদা মার্জিত ও দায়িত্বশীল সুরে।
- কাস্টমারের হিসাব বা ব্যবসার ডেটা দেখতে অথেন্টিকেশন দরকার হলে সরাসরি লগইন করার কথা মনে করিয়ে দেবে।

তোমার প্রধান দায়িত্ব ও নিয়ম:
১. হিসাববিজ্ঞান ও আর্থিক সততা (Financial Integrity):
   - কখনো কোনো কাল্পনিক বা অনুমানভিত্তিক ব্যালেন্স বলবে না। কাস্টমার বা ব্যবসার কোনো হিসাব লাগলে অবশ্যই তোমার প্রদত্ত টুল (Tools) ব্যবহার করে সঠিক সংখ্যা তুলে আনবে।
   - কখনই সেকেলে শব্দ "জের" ব্যবহার করবে না। সর্বদা "ব্যালেন্স" (Balance) বা "অবশিষ্ট বকেয়া" (Net Due) বলবে।
   - টাকা উল্লেখ করার সময় মুখে বলার উপযোগী সহজ বাংলা ব্যবহার করবে (যেমন: "১ লাখ ৫০ হাজার টাকা")।
২. স্বাভাবিক বাচনভঙ্গি ও বিতর্ক নিরসন (Conversational Fluency & Dispute Handling):
   - উত্তরগুলো মুখে শোনানোর উপযোগী ২-৪ লাইনের সংক্ষিপ্ত, স্পষ্ট ও জীবন্ত বাক্যে কথা বলবে।
   - ইউজার যদি বলে "তুমি ভুল হিসাব দিয়েছ", "হিসাব ঠিক নাই", "ভুল উত্তর" বা কোনো অভিযোগ করে: অন্ধের মতো একরোখা হয়ে "হিসাবটি যাচাই করেছি" বলবে না! বিনীতভাবে বলবে: "স্যার, যদি কোনো বিভ্রান্তি ঘটে থাকে আমি আন্তরিকভাবে দুঃখিত। আপনি কোন কাস্টমার বা ভাউচারের হিসাব দেখতে চাচ্ছেন জানালে আমি এখনি লেজার মিলিয়ে দিচ্ছি।" এবং সিস্টেমের হিসাব প্রমাণে 'get_ledger_math_audit_summary' টুল কল করবে।
   - ইউজার যদি বলে "রিপোর্ট দাও", "আজকের রিপোর্ট", "ব্যবসার কি অবস্থা" বা সারসংক্ষেপ চায়, তবে সাথে সাথে 'get_executive_business_pulse' টুল ব্যবহার করে পূর্ণাঙ্গ ব্যবসায়িক সারসংক্ষেপ কার্ড প্রদান করবে।
   - প্রম্পটের সাথে পূর্বের স্মৃতি ও প্রাসঙ্গিক তথ্য যুক্ত আছে:
${t||"কোনো সংরক্ষিত স্মৃতি নেই।"}`}getToolsSchema(){return[{type:"function",function:{name:"get_customer_360_profile",description:"মা মোটরসের যেকোনো কাস্টমারের পূর্ণাঙ্গ ৩৬০° প্রোফাইল ও বিস্তারিত তথ্য জানতে এটি কল করো (অ্যাকাউন্ট নম্বর, মোবাইল নম্বর, ঠিকানা, জোন, প্রারম্ভিক ব্যালেন্স, বর্তমান অবশিষ্ট বকেয়া, মোট কত টাকার মাল নিয়েছে, মোট কত জমা দিয়েছে, শেষ চালানের বিস্তারিত মাল ও টাকার পরিমাণ, এবং শেষ জমার তারিখ ও মাধ্যম)।",parameters:{type:"object",properties:{query:{type:"string",description:"কাস্টমারের নাম, ফোন নম্বর বা অ্যাকাউন্ট নম্বর (যেমন: বাবুল, করিম, ০১৭...)"}},required:["query"]}}},{type:"function",function:{name:"get_executive_business_pulse",description:'ইউজার যখন "রিপোর্ট দাও", "আজকের রিপোর্ট", "রিপোট", "সামারি", "সারসংক্ষেপ", "আজকের ব্যবসা কেমন", বা "ব্যবসার অবস্থা কি" জানতে চায়, তখন অবিলম্বে এটি কল করবে (আজকের মোট বিক্রি, মোট আদায়, ক্যাশ ও ব্যাংক আদায়, মোট খরচ এবং নিট ক্যাশ ফ্লো)।',parameters:{type:"object",properties:{date:{type:"string",description:"তারিখ YYYY-MM-DD ফরম্যাটে (না দিলে আজকের দেখাবে)"}}}}},{type:"function",function:{name:"get_customer_due",description:"মা মোটরসের কোনো কাস্টমারের নাম, ফোন নম্বর বা এলাকা দিয়ে তার বর্তমান অবশিষ্ট বকেয়া ও হিসাব জানতে এটি কল করো।",parameters:{type:"object",properties:{query:{type:"string",description:"কাস্টমারের নাম, মোবাইল নম্বর বা ঠিকানা (যেমন: বাবুল, করিম, ০১৭...)"}},required:["query"]}}},{type:"function",function:{name:"get_customer_ledger_history",description:"কাস্টমারের শেষ চালান (কত টাকার কি মাল নিয়েছিল), শেষ পেমেন্ট (কবে কত টাকা জমা দিয়েছে) এবং সাম্প্রতিক লেনদেনের বিস্তারিত ইতিহাস জানতে এটি কল করো।",parameters:{type:"object",properties:{query:{type:"string",description:"কাস্টমারের নাম বা ফোন নম্বর"},limit:{type:"number",description:"কয়টি লেনদেন দেখতে চায় (ডিফল্ট ৫)"}},required:["query"]}}},{type:"function",function:{name:"get_daily_expenses",description:"আজকের বা নির্দিষ্ট কোনো তারিখের অফিস খরচ, যাতায়াত খরচ বা মোট খরচের বিবরণ জানতে এটি কল করো।",parameters:{type:"object",properties:{date:{type:"string",description:"তারিখ YYYY-MM-DD ফরম্যাটে (যদি নির্দিষ্ট দিন চায়, না দিলে আজকের খরচ দেখাবে)"}}}}},{type:"function",function:{name:"get_cash_and_bank_status",description:"মা মোটরসের আজকের দিনের মোট ক্যাশ ইন হ্যান্ড, ব্যাংকের মোট ব্যালেন্স ও আর্থিক স্থিতি জানতে এটি কল করো।",parameters:{type:"object",properties:{detail:{type:"string",enum:["summary","detailed"],description:"সংক্ষিপ্ত সারসংক্ষেপ নাকি বিস্তারিত তালিকা"}}}}},{type:"function",function:{name:"get_today_showroom_cash_collections",description:"আজকে বা নির্দিষ্ট তারিখে শোরুম ক্যাশে কাস্টমারদের থেকে নগদ কত টাকা জমা হয়েছে, কোন কোন কাস্টমার ক্যাশ জমা দিয়েছে এবং ক্যাশ থেকে কত খরচ হয়ে নিট ক্যাশ কত দাঁড়িয়েছে তা জানতে এটি কল করো।",parameters:{type:"object",properties:{targetDate:{type:"string",description:"তারিখ YYYY-MM-DD ফরম্যাটে (ঐচ্ছিক, না দিলে আজকের দিনের শোরুম ক্যাশ দেখাবে)"}}}}},{type:"function",function:{name:"get_today_bank_collections",description:"আজকে বা নির্দিষ্ট কোনো দিনে কাদের কাদের টাকা কোন ব্যাংকে জমা হয়েছে, কোন কাস্টমার কত টাকা দিয়েছে এবং ব্যাংকে মোট কত টাকা জমা হলো তা জানতে এটি কল করো।",parameters:{type:"object",properties:{date:{type:"string",description:"তারিখ YYYY-MM-DD ফরম্যাটে (ঐচ্ছিক, না দিলে আজকের দেখাবে)"}}}}},{type:"function",function:{name:"get_weekly_bank_summary",description:"গত এক সপ্তাহ (৭ দিন) বা নির্দিষ্ট সময়ে কোন ব্যাংকে মোট কত টাকা জমা হয়েছে, কোন ব্যাংকে কয়টি লেনদেন হয়েছে এবং মোট ব্যাংকে জমার ব্যাংক-ওয়ারি সারসংক্ষেপ জানতে এটি কল করো।",parameters:{type:"object",properties:{days:{type:"number",description:"কত দিনের হিসাব (ডিফল্ট ৭ দিন)"}}}}},{type:"function",function:{name:"search_voucher_or_invoice",description:"চালান বা ভাউচার নম্বর (যেমন: INV-1002 বা ভাউচার নং) দিয়ে সরাসরি বিস্তারিত লেনদেন বা চালানের তথ্য বের করতে এটি কল করো।",parameters:{type:"object",properties:{voucherNo:{type:"string",description:"ভাউচার বা চালান নম্বর"}},required:["voucherNo"]}}},{type:"function",function:{name:"get_master_treasury_status",description:"মা মোটরসের ৪+ কোটি টাকার কেন্দ্রীয় মাস্টার ট্রেজারি ফান্ড ব্যালেন্স এবং সাম্প্রতিক ইনফ্লো ও আউটফ্লো জানতে এটি কল করো।",parameters:{type:"object",properties:{filter:{type:"string",description:"ঐচ্ছিক ফিল্টার বা প্রশ্ন (যেমন: summary, balance)"}}}}},{type:"function",function:{name:"get_top_debtors_and_market_analytics",description:"মার্কেটের সবচেয়ে বড় বকেয়াদার কারা (টপ ৫ বাকিদার) অথবা চট্টগ্রাম/নির্দিষ্ট জোনের মোট বকেয়া কত তা জানতে এটি কল করো।",parameters:{type:"object",properties:{limit:{type:"number",description:"কয়জন কাস্টমার দেখতে চায় (ডিফল্ট ৫)"},zone:{type:"string",description:"নির্দিষ্ট কোনো জোন (যেমন: চট্টগ্রাম, ঢাকা)"}}}}},{type:"function",function:{name:"get_dubai_container_status",description:"দুবাই কন্টেইনার পারচেজ, মেমো খরচ, এইডি (AED) ক্যাশ ব্যালেন্স ও অডিট রিপোর্ট জানতে এটি কল করো।",parameters:{type:"object",properties:{query_type:{type:"string",enum:["container_summary","aed_cash"],description:"কন্টেইনার সারসংক্ষেপ নাকি ক্যাশ ব্যালেন্স"}}}}},{type:"function",function:{name:"remember_executive_note",description:"ইউজারের কোনো গুরুত্বপূর্ণ নির্দেশ, পছন্দ বা ব্যবসার নিয়ম জার্ভিসের স্থায়ী মেমোরিতে সংরক্ষণ করতে এটি কল করো।",parameters:{type:"object",properties:{content:{type:"string",description:"যে তথ্য বা নির্দেশ মনে রাখতে হবে"},category:{type:"string",enum:["preference","rule","fact"],description:"তথ্যের ধরণ"}},required:["content"]}}},{type:"function",function:{name:"get_all_bank_running_balances",description:"মা মোটরসের প্রতিটি ব্যাংক অ্যাকাউন্টের (IBBL, OneBank, DBBL ইত্যাদি) বর্তমান লাইভ অবশিষ্ট ব্যালেন্স এবং শোরুমের ক্যাশ ইন হ্যান্ড স্থিতি জানতে এটি কল করো।",parameters:{type:"object",properties:{detail:{type:"string",description:"ঐচ্ছিক ফিল্টার"}}}}},{type:"function",function:{name:"get_zone_wise_analytics",description:"এলাকা বা জোন অনুযায়ী (যেমন: চট্টগ্রাম, ঢাকা, নোয়াখালী) মোট বকেয়া, কাস্টমার সংখ্যা ও সেরা কাস্টমারের তালিকা জানতে এটি কল করো।",parameters:{type:"object",properties:{zone:{type:"string",description:"নির্দিষ্ট জোনের নাম (ঐচ্ছিক)"}}}}},{type:"function",function:{name:"get_dormant_customers",description:"যেসব কাস্টমারের বকেয়া রয়েছে কিন্তু বিগত ৩০/৬০/৯০ দিন ধরে কোনো টাকা জমা দেননি (অলস বা ঝুঁকিপূর্ণ বাকিদার) তাদের তালিকা জানতে এটি কল করো।",parameters:{type:"object",properties:{days:{type:"number",description:"কত দিনের অলস কাস্টমার (ডিফল্ট ৩০ দিন)"}}}}},{type:"function",function:{name:"get_total_market_summary",description:"পুরো মার্কেটের মোট বকেয়া, অগ্রিম জমার মোট পরিমাণ এবং মোট কাস্টমারদের আর্থিক পোর্টফোলিও সারসংক্ষেপ জানতে এটি কল করো।",parameters:{type:"object",properties:{type:{type:"string",description:"পোর্টফোলিও টাইপ"}}}}},{type:"function",function:{name:"get_category_expense_breakdown",description:"ব্যবসার বিভিন্ন খাতের (যেমন: গাড়ি ভাড়া/যাতায়াত, স্টাফ বেতন, নাস্তা/আপ্যায়ন, অফিস ভাড়া) খরচ ও সর্বোচ্চ খরচের খাত বিশ্লেষণ করতে এটি কল করো।",parameters:{type:"object",properties:{days:{type:"number",description:"কত দিনের খরচের বিশ্লেষণ (ডিফল্ট ৩০ দিন)"}}}}},{type:"function",function:{name:"get_ledger_math_audit_summary",description:'ইউজার যখন বলে "তুমি ভুল হিসাব দিয়েছ", "হিসাব ঠিক নাই", "লেজার অডিট করো", "গরমিল আছে", বা হিসাবের সত্যতা পরীক্ষা করতে বলে, তখন এটি কল করো। মা মোটরসের লেজার লেনদেনের গাণিতিক নির্ভুলতা ও ইনভেরিয়েন্ট অডিট করে।',parameters:{type:"object",properties:{sampleSize:{type:"number",description:"কতটি লেনদেন অডিট করবে (ডিফল্ট ১০০)"}}}}},{type:"function",function:{name:"get_dubai_deep_custodian_holdings",description:"দুবাই কন্টেইনার অডিটের এমরান মামা, আলতাফ, জাবেদের কাছে থাকা নগদ দিরহামের (AED) হিসাব ও মেস ফান্ডের ব্যালেন্স জানতে এটি কল করো।",parameters:{type:"object",properties:{detail:{type:"string",description:"বিশদ নাকি সংক্ষিপ্ত"}}}}},{type:"function",function:{name:"get_period_sales_turnover",description:"এই মাসে, গত মাসে বা নির্দিষ্ট দিনে মোট কত টাকার মাল বিক্রি হয়েছে, কতগুলো চালান হয়েছে এবং দৈনিক গড় বিক্রি জানতে এটি কল করো।",parameters:{type:"object",properties:{days:{type:"number",description:"কত দিনের বিক্রি (ডিফল্ট ৩০ দিন)"}}}}},{type:"function",function:{name:"get_today_sales_invoices",description:"আজকে কার কার কাছে কত টাকার মাল বিক্রি হলো এবং কোন কোন চালান ইস্যু করা হয়েছে তা জানতে এটি কল করো।",parameters:{type:"object",properties:{date:{type:"string",description:"তারিখ YYYY-MM-DD (ঐচ্ছিক)"}}}}},{type:"function",function:{name:"get_top_buying_customers",description:"চলতি মাসে বা নির্দিষ্ট সময়ে সবচেয়ে বেশি টাকার মাল কিনেছেন এমন সেরা ক্রেতা কাস্টমারদের তালিকা জানতে এটি কল করো।",parameters:{type:"object",properties:{limit:{type:"number",description:"কতজন ক্রেতা (ডিফল্ট ৫)"},days:{type:"number",description:"কত দিনের হিসাব (ডিফল্ট ৩০)"}}}}},{type:"function",function:{name:"get_collection_recovery_efficiency",description:"বিক্রির তুলনায় কত শতাংশ টাকা কালেকশন হলো (রিকভারি রেট ও শতকরা হার) তা জানতে এটি কল করো।",parameters:{type:"object",properties:{days:{type:"number",description:"কত দিনের অনুপাত (ডিফল্ট ৩০ দিন)"}}}}},{type:"function",function:{name:"get_advance_paying_customers",description:"যেসব কাস্টমারের কাছে কোম্পানির অতিরিক্ত টাকা অগ্রিম জমা আছে (নেগেটিভ বকেয়া) তাদের তালিকা ও মোট অগ্রিম পুঁজি জানতে এটি কল করো।",parameters:{type:"object",properties:{limit:{type:"number",description:"কতজন দেখাবে (ডিফল্ট ১৫)"}}}}},{type:"function",function:{name:"get_specific_bank_statement_summary",description:"নির্দিষ্ট কোনো ব্যাংকে (যেমন: ইসলামী ব্যাংক, ওয়ান ব্যাংক, ডাচ-বাংলা) কত টাকা জমা আসলো, কত টাকা খরচ হলো এবং বর্তমান ব্যালেন্স কত তা জানতে এটি কল করো।",parameters:{type:"object",properties:{bankName:{type:"string",description:"ব্যাংকের নাম"},days:{type:"number",description:"কত দিনের স্টেটমেন্ট (ডিফল্ট ৩০)"}},required:["bankName"]}}},{type:"function",function:{name:"get_top_inflow_bank",description:"সবচেয়ে বেশি টাকা কোন ব্যাংকে জমা হচ্ছে এবং সকল ব্যাংকের জমার তুলনামূলক র‍্যাংকিং জানতে এটি কল করো।",parameters:{type:"object",properties:{days:{type:"number",description:"কত দিনের হিসাব (ডিফল্ট ৩০)"}}}}},{type:"function",function:{name:"get_monthly_net_cashflow",description:"এই মাসে মোট কালেকশন থেকে মোট অফিস খরচ বাদ দিলে নিট কত টাকা ক্যাশ উদ্বৃত্ত বা ঘাটতি আছে তা জানতে এটি কল করো।",parameters:{type:"object",properties:{days:{type:"number",description:"কত দিনের নিট ক্যাশফ্লো (ডিফল্ট ৩০)"}}}}},{type:"function",function:{name:"get_historical_date_summary",description:"অতীতের নির্দিষ্ট কোনো দিনে (যেমন: গত পরশু দিন, গত রবিবার, ১০ তারিখে) কত টাকার বিক্রি, কালেকশন ও খরচ হয়েছিল তার পূর্ণাঙ্গ হিসাব জানতে এটি কল করো।",parameters:{type:"object",properties:{targetDate:{type:"string",description:"তারিখ YYYY-MM-DD ফরম্যাটে"}},required:["targetDate"]}}},{type:"function",function:{name:"search_by_amount_or_reference",description:"নির্দিষ্ট কোনো টাকার অঙ্ক দিয়ে (যেমন: ৫,৫০০ টাকা অগ্রিম কোন একাউন্ট, কার বকেয়া ৫,৫০০ টাকা, অথবা ১০,০০০ টাকার ভাউচার কার) সংশ্লিষ্ট কাস্টমার বা লেনদেন খুঁজতে এটি কল করো।",parameters:{type:"object",properties:{amount:{type:"string",description:'টাকার পরিমাণ (যেমন: 5500 বা "৫,৫০০")'},hintType:{type:"string",enum:["advance","due","transaction","any"],description:"অগ্রিম নাকি বকেয়া নাকি লেনদেন"}},required:["amount"]}}},{type:"function",function:{name:"get_customer_attribute",description:"নির্দিষ্ট কোনো কাস্টমারের ফোন নম্বর, ঠিকানা, অ্যাকাউন্ট নম্বর, শেষ চালান, শেষ পেমেন্ট বা আজীবন মোট কত টাকার মাল নিয়েছে তা সরাসরি জানতে এটি কল করো।",parameters:{type:"object",properties:{customerName:{type:"string",description:"কাস্টমারের নাম বা অ্যাকাউন্ট নম্বর"},attribute:{type:"string",enum:["phone","address","accountNo","lastBill","lastPayment","totals","all"],description:"কোন তথ্য জানতে চায়"}},required:["customerName"]}}},{type:"function",function:{name:"get_business_demographics",description:"মা মোটরসের মোট কাস্টমার সংখ্যা, কতজন দেনাদার (বাকিদার), কতজনের অগ্রিম জমা, কতজনের কোনো বকেয়া নেই এবং সক্রিয় ব্যাংক অ্যাকাউন্ট কয়টি তা জানতে এটি কল করো।",parameters:{type:"object",properties:{detail:{type:"string",description:"ঐচ্ছিক ফিল্টার"}}}}}]}async executeToolCall(e,t){console.log(`[LLMAgent] Executing Tool "${e}" with args:`,t);try{if(e==="get_customer_360_profile"){const n=(t?.query||t?.customerName||t?.customer_name||t?.name||"").trim(),r=await H.getCustomer360Profile(n);return r?.error==="AUTH_REQUIRED"?{found:!1,authRequired:!0,message:"কাস্টমারের পূর্ণাঙ্গ তথ্য দেখতে মা মোটরস অ্যাকাউন্টে লগইন করতে হবে।"}:!r||!r.found?{found:!1,message:r?.message||`"${n}" নামে কোনো কাস্টমার পাওয়া যায়নি।`}:{found:!0,accountNo:r.accountNo,name:r.name,phone:r.phone,address:r.address,zone:r.zone,initialDue:r.initialDue,totalDue:r.totalDue,totalPurchased:r.totalPurchased,totalPaid:r.totalPaid,transactionCount:r.transactionCount,lastBill:r.lastBill,lastPayment:r.lastPayment,recentTransactions:r.recentTransactions}}if(e==="get_executive_business_pulse"){const n=await H.getExecutiveBusinessPulse(t?.date||null);return n?{success:!0,type:"executive_business_pulse",date:n.date,todayTotalBills:n.todayTotalBills,todayTotalCollections:n.todayTotalCollections,cashCollections:n.cashCollections,bankCollections:n.bankCollections,todayTotalExpenses:n.todayTotalExpenses,todayNetCashFlow:n.todayNetCashFlow,activeCustomersCount:n.activeCustomersCount,activeCustomers:n.activeCustomers}:{success:!1,message:"আজকের ব্যবসার সামারি পাওয়া যায়নি।"}}if(e==="get_customer_due"){const n=(t?.query||t?.customerName||t?.customer_name||t?.name||t?.searchTerm||"").trim(),r=await H.searchCustomers(n);if(r?.error==="AUTH_REQUIRED")return{found:!1,authRequired:!0,message:"কাস্টমারের লাইভ হিসাব দেখতে মা মোটরসের গুগল অ্যাকাউন্টে লগইন করতে হবে।"};if(!r||!Array.isArray(r)||r.length===0)return{found:!1,message:`"${n}" নামে কোনো কাস্টমার মা মোটরসের ডাটাবেজে পাওয়া যায়নি।`};if(r.length>1){const a=Xi.createPending("customer",n,r,"get_customer_due");return{isDisambiguation:!0,spoken:a.spoken,data:a.data}}const i=r[0];return{found:!0,name:i.name,phone:i.phone||"দেওয়া নেই",address:i.address||"দেওয়া নেই",zone:i.zone||"",totalDue:i.totalDue||0,initialDue:i.initialDue||0}}if(e==="get_customer_ledger_history"){const n=(t?.query||t?.customerName||t?.customer_name||t?.name||"").trim(),r=await H.searchCustomers(n);if(r?.error==="AUTH_REQUIRED")return{found:!1,authRequired:!0,message:"কাস্টমার লেজার দেখতে মা মোটরসের অ্যাকাউন্টে লগইন করতে হবে।"};if(!r||r.length===0)return{found:!1,message:`"${n}" নামে কোনো কাস্টমার পাওয়া যায়নি।`};const i=r[0],a=await H.getCustomerLedger(i.id,t?.limit||5);return a?.error==="AUTH_REQUIRED"?{found:!1,authRequired:!0,message:"কাস্টমার লেজার দেখতে মা মোটরসের অ্যাকাউন্টে লগইন করতে হবে।"}:{found:!0,customerName:i.name,totalDue:i.totalDue,lastBill:a?.lastBill||null,lastPayment:a?.lastPayment||null,recentTransactions:a?.history||[]}}if(e==="get_daily_expenses"){const n=await H.getDailyExpenses(t?.date||null);return n?.error==="AUTH_REQUIRED"?{success:!1,authRequired:!0,message:"খরচের হিসাব দেখতে সাইন ইন করতে হবে।"}:n?{success:!0,date:n.date,totalExpense:n.totalExpense,categoryBreakdown:n.categoryBreakdown,itemsCount:n.count,sampleItems:n.items.slice(0,5)}:{success:!1,message:"খরচের হিসাব পাওয়া যায়নি।"}}if(e==="get_cash_and_bank_status"){const n=await H.getCashAndBankSummary();return n?.error==="AUTH_REQUIRED"?{success:!1,authRequired:!0,message:"ক্যাশ ও ব্যাংকের লাইভ হিসাব দেখতে মা মোটরসের অ্যাকাউন্টে লগইন করতে হবে।"}:n?{success:!0,totalBankBalance:n.totalBankBalance,totalPhysicalCash:n.totalPhysicalCash,totalHoldings:n.totalHoldings,accounts:n.accounts}:{success:!1,message:"ব্যাংক ও ক্যাশের হিসাব লোড করা সম্ভব হয়নি।"}}if(e==="get_today_showroom_cash_collections"){const n=await H.getTodayShowroomCashCollections(t?.targetDate||t?.date||null);return n?.error==="AUTH_REQUIRED"?{success:!1,authRequired:!0,message:"আজকের শোরুম ক্যাশের হিসাব দেখতে মা মোটরসের অ্যাকাউন্টে লগইন করতে হবে।"}:n||{success:!1,message:"আজকের শোরুম ক্যাশ কালেকশনের তথ্য পাওয়া যায়নি।"}}if(e==="get_today_bank_collections"){const n=await H.getTodayBankCollections(t?.date||null);return n?.error==="AUTH_REQUIRED"?{success:!1,authRequired:!0,message:"আজকের ব্যাংক কালেকশনের হিসাব দেখতে মা মোটরসের অ্যাকাউন্টে লগইন করতে হবে।"}:n?{success:!0,type:"today_bank_collections",date:n.date,totalBankDeposit:n.totalBankDeposit,customerDepositsCount:n.customerDepositsCount,customerDeposits:n.customerDeposits,bankBreakdown:n.bankBreakdown,directDeposits:n.directDeposits}:{success:!1,message:"ব্যাংক কালেকশনের তথ্য পাওয়া যায়নি।"}}if(e==="get_weekly_bank_summary"){const n=await H.getWeeklyBankSummary(t?.days||7);return n?.error==="AUTH_REQUIRED"?{success:!1,authRequired:!0,message:"সাপ্তাহিক ব্যাংক ডিপোজিট সামারি দেখতে মা মোটরস অ্যাকাউন্টে লগইন করতে হবে।"}:n?{success:!0,type:"weekly_bank_summary",startDate:n.startDate,endDate:n.endDate,days:n.days,grandTotalBankDeposits:n.grandTotalBankDeposits,banksCount:n.banksCount,bankList:n.bankList,topCustomers:n.topCustomers}:{success:!1,message:"সাপ্তাহিক ব্যাংক সামারি পাওয়া যায়নি।"}}if(e==="search_voucher_or_invoice"){const n=await H.searchVoucherOrInvoice(t?.voucherNo);return n?.error==="AUTH_REQUIRED"?{found:!1,authRequired:!0,message:"চালান বা ভাউচার দেখতে মা মোটরস অ্যাকাউন্টে লগইন করতে হবে।"}:!n||!n.found?{found:!1,message:n?.message||`ভাউচার "${t?.voucherNo}" পাওয়া যায়নি।`}:{found:!0,type:"voucher_details",voucherNo:n.voucherNo,count:n.count,records:n.records}}if(e==="get_master_treasury_status"){const n=await H.getTreasuryFundStatus();return n?{success:!0,openingBalance:n.openingBalance,currentTreasuryBalance:n.currentTreasuryBalance,totalInflows:n.totalInflows,totalOutflows:n.totalOutflows,recentTransactions:n.recentTxns}:{success:!1,message:"মাস্টার ট্রেজারি ফান্ডের ব্যালেন্স পাওয়া যায়নি।"}}if(e==="get_top_debtors_and_market_analytics"){const n=await H.getTopDebtors(t?.limit||5,t?.zone||null);return n?{success:!0,totalMarketDue:n.totalDueSum,totalDebtorsCount:n.totalDebtorsCount,topDebtors:n.topDebtors}:{success:!1,message:"বকেয়া অ্যানালিটিক্স লোড করা সম্ভব হয়নি।"}}if(e==="get_dubai_container_status"){const n=await H.getDubaiWeeklyAuditSummary();return n?{success:!0,auditDate:n.date,cashInHandAED:n.cashInHand,marketAdvanceAED:n.marketAdvance,personalHoldings:n.personalHoldings,messBalanceAED:n.messBalance,totalPhysicalAssetsAED:n.totalPhysicalAssets,calculatedCashBalanceAED:n.calculatedCashBalance,varianceAED:n.variance}:{success:!1,message:"দুবাই সাপ্তাহিক অডিটের হিসাব এই মুহূর্তে পাওয়া যায়নি।"}}if(e==="get_all_bank_running_balances"){const n=await H.getAllBankRunningBalances();return n?.error==="AUTH_REQUIRED"?{success:!1,authRequired:!0,message:"ব্যাংকের লাইভ ব্যালেন্স দেখতে মা মোটরসের অ্যাকাউন্টে সাইন ইন করতে হবে।"}:n||{success:!1,message:"ব্যাংক ব্যালেন্স পাওয়া যায়নি।"}}if(e==="get_zone_wise_analytics"){const n=await H.getZoneWiseAnalytics();return n?.error==="AUTH_REQUIRED"?{success:!1,authRequired:!0,message:"জোনভিত্তিক বকেয়া দেখতে লগইন করতে হবে।"}:n||{success:!1,message:"জোনভিত্তিক রিপোর্ট পাওয়া যায়নি।"}}if(e==="get_dormant_customers"){const n=await H.getDormantCustomers(t?.days||30);return n?.error==="AUTH_REQUIRED"?{success:!1,authRequired:!0,message:"অলস কাস্টমারদের দেখতে লগইন করতে হবে।"}:n||{success:!1,message:"অলস কাস্টমার তথ্য পাওয়া যায়নি।"}}if(e==="get_total_market_summary"){const n=await H.getTotalMarketSummary();return n?.error==="AUTH_REQUIRED"?{success:!1,authRequired:!0,message:"মার্কেট সামারি দেখতে লগইন করতে হবে।"}:n||{success:!1,message:"মার্কেট সামারি পাওয়া যায়নি।"}}if(e==="get_category_expense_breakdown"){const n=await H.getCategoryExpenseBreakdown(t?.days||30);return n?.error==="AUTH_REQUIRED"?{success:!1,authRequired:!0,message:"খাতওয়ারী খরচের বিশ্লেষণ দেখতে লগইন করতে হবে।"}:n||{success:!1,message:"খাতওয়ারী খরচের হিসাব পাওয়া যায়নি।"}}if(e==="get_ledger_math_audit_summary"){const n=await H.getLedgerMathAuditSummary(t?.sampleSize||100);return n?.error==="AUTH_REQUIRED"?{success:!1,authRequired:!0,message:"লেজার অডিট দেখতে লগইন করতে হবে।"}:n||{success:!1,message:"লেজার অডিট সম্পন্ন করা যায়নি।"}}if(e==="get_dubai_deep_custodian_holdings"){const n=await H.getDubaiDeepCustodianHoldings();return n?.error==="AUTH_REQUIRED"?{success:!1,authRequired:!0,message:"দুবাই কাস্টোডিয়ান হিসাব দেখতে লগইন করতে হবে।"}:n||{success:!1,message:"দুবাই কাস্টোডিয়ান তথ্য পাওয়া যায়নি।"}}if(e==="get_period_sales_turnover"){const n=await H.getPeriodSalesTurnover(t?.days||30);return n?.error==="AUTH_REQUIRED"?{success:!1,authRequired:!0,message:"বিক্রির হিসাব দেখতে লগইন করতে হবে।"}:n||{success:!1,message:"বিক্রির হিসাব লোড করা যায়নি।"}}if(e==="get_today_sales_invoices"){const n=await H.getTodaySalesInvoices(t?.date||null);return n?.error==="AUTH_REQUIRED"?{success:!1,authRequired:!0,message:"আজকের চালানের হিসাব দেখতে লগইন করতে হবে।"}:n||{success:!1,message:"আজকের চালানের তথ্য পাওয়া যায়নি।"}}if(e==="get_top_buying_customers"){const n=await H.getTopBuyingCustomers(t?.limit||5,t?.days||30);return n?.error==="AUTH_REQUIRED"?{success:!1,authRequired:!0,message:"সেরা ক্রেতাদের তালিকা দেখতে লগইন করতে হবে।"}:n||{success:!1,message:"সেরা ক্রেতাদের তথ্য পাওয়া যায়নি।"}}if(e==="get_collection_recovery_efficiency"){const n=await H.getCollectionRecoveryEfficiency(t?.days||30);return n?.error==="AUTH_REQUIRED"?{success:!1,authRequired:!0,message:"রিকভারি রেট দেখতে লগইন করতে হবে।"}:n||{success:!1,message:"রিকভারি রেটের হিসাব পাওয়া যায়নি।"}}if(e==="get_advance_paying_customers"){const n=await H.getAdvancePayingCustomers(t?.limit||15);return n?.error==="AUTH_REQUIRED"?{success:!1,authRequired:!0,message:"অগ্রিম জমার হিসাব দেখতে লগইন করতে হবে।"}:n||{success:!1,message:"অগ্রিম জমাকারী কাস্টমারদের তথ্য পাওয়া যায়নি।"}}if(e==="get_specific_bank_statement_summary"){const n=await H.getSpecificBankStatementSummary(t?.bankName,t?.days||30);return n?.error==="AUTH_REQUIRED"?{success:!1,authRequired:!0,message:"ব্যাংক স্টেটমেন্ট দেখতে লগইন করতে হবে।"}:n||{success:!1,message:"ব্যাংক স্টেটমেন্ট পাওয়া যায়নি।"}}if(e==="get_top_inflow_bank"){const n=await H.getTopInflowBank(t?.days||30);return n?.error==="AUTH_REQUIRED"?{success:!1,authRequired:!0,message:"ব্যাংক তথ্য দেখতে লগইন করতে হবে।"}:n||{success:!1,message:"ব্যাংক জমার তথ্য পাওয়া যায়নি।"}}if(e==="get_monthly_net_cashflow"){const n=await H.getMonthlyNetCashflow(t?.days||30);return n?.error==="AUTH_REQUIRED"?{success:!1,authRequired:!0,message:"নিট ক্যাশফ্লো দেখতে লগইন করতে হবে।"}:n||{success:!1,message:"নিট ক্যাশফ্লো পাওয়া যায়নি।"}}if(e==="get_historical_date_summary"){const n=await H.getHistoricalDateSummary(t?.targetDate);return n?.error==="AUTH_REQUIRED"?{success:!1,authRequired:!0,message:"অতীতের হিসাব দেখতে লগইন করতে হবে।"}:n||{success:!1,message:"উক্ত তারিখের হিসাব পাওয়া যায়নি।"}}if(e==="remember_executive_note"){const n=await Ut.rememberFact(t.content,t.category||"fact");return{success:!0,message:"তথ্যটি জার্ভিস মেমোরিতে সফলভাবে সংরক্ষিত হয়েছে।"}}if(e==="search_by_amount_or_reference")return await H.searchCustomerOrTxnByAmount(t?.amount,t?.hintType||"any");if(e==="get_customer_attribute"){const n=(t?.customerName||t?.query||"").trim(),r=await H.getCustomer360Profile(n);return r?.error==="AUTH_REQUIRED"?{found:!1,authRequired:!0,message:"কাস্টমার তথ্য দেখতে লগইন প্রয়োজন।"}:!r||!r.found?{found:!1,message:`"${n}" নামে কোনো কাস্টমার পাওয়া যায়নি।`}:{found:!0,type:"customer_attribute_result",attribute:t?.attribute||"all",name:r.name,phone:r.phone,address:r.address,zone:r.zone,accountNo:r.accountNo,totalDue:r.totalDue,totalPurchased:r.totalPurchased,totalPaid:r.totalPaid,lastBill:r.lastBill,lastPayment:r.lastPayment}}return e==="get_business_demographics"?await H.getGeneralBusinessDemographics():{error:"Unknown tool"}}catch(n){return console.error(`[LLMAgent] Tool execution error (${e}):`,n),{error:n.message}}}async chat(e,t){if(Xi.hasPending()){const d=Xi.resolveInput(t);if(d){const f=d.address?` (${d.address})`:d.zone?` (${d.zone})`:"",m=Number(d.totalDue||0),_=m>0?`বর্তমান অবশিষ্ট বকেয়া হলো ${m.toLocaleString("bn-BD")} টাকা`:m<0?`বর্তমান ব্যালেন্সে অগ্রিম জমা রয়েছে ${Math.abs(m).toLocaleString("bn-BD")} টাকা`:"কোনো বকেয়া নেই, হিসাব সম্পূর্ণ পরিশোধিত";return{spoken:`জি স্যার! ${d.name}${f}-এর ${_}।`,data:{name:d.name,phone:d.phone||"দেওয়া নেই",address:d.address||"দেওয়া নেই",zone:d.zone||"",totalDue:m,accountNo:d.accountNo||""}}}}this.currentEmotion=this.detectEmotion(t);const n=(typeof window<"u"&&localStorage.getItem("jarvis_auto_failover"))!=="false",i=[typeof window<"u"&&localStorage.getItem("jarvis_ai_provider")||this.provider||"gemini","gemini","groq","openrouter","cerebras","openai"],a=[...new Set(i)];let c="",l=0;for(const d of a){const f=this.getAvailableKeys(d);if(!(!f||f.length===0)){console.log(`[LLMAgent] 🚀 Trying provider [${d}] with ${f.length} key(s)...`);for(let m=0;m<f.length;m++){const _=f[m];l++;try{let T=null;if(d==="gemini")T=await this.chatGemini(e,t,_);else if(d==="groq")T=await this.chatOpenAICompatible({provider:"Groq Cloud",endpoint:"https://api.groq.com/openai/v1/chat/completions",model:this.groqModel||"llama-3.3-70b-versatile",key:_},e,t);else if(d==="openrouter"){const R=_.startsWith("sk-jk");T=await this.chatOpenAICompatible({provider:R?"OmniRouters":"OpenRouter",endpoint:R?"https://omnirouters.com/v1/chat/completions":"https://openrouter.ai/api/v1/chat/completions",model:R?this.omniroutersModel||"gpt-3.5-turbo":this.openrouterModel||"meta-llama/llama-3.3-70b-instruct:free",key:_,headers:R?{}:{"HTTP-Referer":typeof window<"u"?window.location.origin:"https://maa-motors-erp.web.app","X-Title":"Maa Motors Jarvis AI"}},e,t)}else d==="cerebras"?T=await this.chatOpenAICompatible({provider:"Cerebras",endpoint:"https://api.cerebras.ai/v1/chat/completions",model:"llama-3.3-70b",key:_},e,t):d==="openai"&&(T=await this.chatOpenAICompatible({provider:"OpenAI",endpoint:"https://api.openai.com/v1/chat/completions",model:this.openaiModel||"gpt-4o-mini",key:_},e,t));if(T&&T.spoken)return this.lastActiveProvider=d,console.log(`[LLMAgent] ✅ Response successfully generated via [${d}]`),T}catch(T){if(console.warn(`[LLMAgent] ⚠️ Provider "${d}" (Key #${m+1}) error:`,T.message),c=T.message||"",this.isQuotaOrRateLimitError(T)&&(this.markKeyCooldown(_,6e4),console.log("[LLMAgent] 🔄 Key rate-limited. Auto-switching to next key or provider...")),!n)break}}}}return console.warn("[LLMAgent] ⚠️ All configured providers failed or no keys found. Falling back to Local Semantic Engine."),await this.chatLocalEmpathetic(t,l>0,c,e)}async chatOpenAICompatible(e,t,n){const{provider:r,endpoint:i,model:a,key:c,headers:l={}}=e,d=[{role:"system",content:this.getSystemPrompt(this.currentEmotion)}],f=(t||[]).slice(-6);let m=!1;for(let x=0;x<f.length;x++){const O=f[x];x===f.length-1&&O.sender==="user"&&O.text===n?(d.push({role:"user",content:n}),m=!0):d.push({role:O.sender==="user"?"user":"assistant",content:O.text})}m||d.push({role:"user",content:n});const _=this.getToolsSchema(),T={"Content-Type":"application/json",Authorization:`Bearer ${c}`,...l},R=await fetch(i,{method:"POST",headers:T,body:JSON.stringify({model:a,messages:d,tools:_,tool_choice:"auto",temperature:.7})});if(!R.ok){const O=(await R.json().catch(()=>({}))).error?.message||`${r} API Error: HTTP ${R.status}`,p=new Error(O);throw p.status=R.status,p.provider=r,p.key=c,p}const D=(await R.json()).choices?.[0]?.message;if(!D)throw new Error(`${r} returned empty message`);if(D.tool_calls&&D.tool_calls.length>0){d.push(D);let x=null;for(const C of D.tool_calls){const V=C.function.name;let b={};try{b=JSON.parse(C.function.arguments||"{}")}catch(v){console.warn(`[LLMAgent] Could not parse arguments for ${V}:`,v)}const y=await this.executeToolCall(V,b);y&&!y.error&&(x=y),d.push({role:"tool",tool_call_id:C.id,content:JSON.stringify(y)})}const O=await fetch(i,{method:"POST",headers:T,body:JSON.stringify({model:a,messages:d,temperature:.7})});if(!O.ok){const V=(await O.json().catch(()=>({}))).error?.message||`${r} tool follow-up error: HTTP ${O.status}`,b=new Error(V);throw b.status=O.status,b}return{spoken:(await O.json()).choices?.[0]?.message?.content||"",data:x}}return{spoken:D.content||"",data:null}}generateDynamicToolSpokenSummary(e,t){if(!t)return"জি স্যার, আমি আপনার নির্দেশ অনুযায়ী তথ্য অনুসন্ধান করেছি।";if(t.spokenResponse)return t.spokenResponse;if(t.statusMessage)return t.statusMessage;if(e==="get_executive_business_pulse"){const n=ee(t.todayTotalBills||0),r=ee(t.todayTotalCollections||0),i=ee(t.todayTotalExpenses||0),a=ee(t.todayNetCashFlow||0);return`জি স্যার! আজকের মোট বিক্রি ৳ ${n}, মোট আদায় ৳ ${r}, মোট খরচ ৳ ${i} এবং আজকের নিট ক্যাশ ফ্লো হলো ৳ ${a}।`}if(e==="get_ledger_math_audit_summary")return t.statusMessage||`স্যার, সাম্প্রতিক ${t.auditedTxnCount||0}টি লেনদেনের লেজার অডিট সম্পন্ন হয়েছে। কোনো গাণিতিক গরমিল নেই।`;if((e==="get_customer_360_profile"||e==="get_customer_due")&&t.name){const n=ee(t.totalDue||0);return`জি স্যার! ${t.name}-এর বর্তমান অবশিষ্ট বকেয়া হলো ৳ ${n}।`}if(e==="get_today_showroom_cash_collections"){const n=ee(t.totalCashReceived||0),r=ee(t.closingCash||0);return`জি স্যার! আজকে শোরুমে নগদ আদায় হয়েছে ৳ ${n} এবং সমাপনী ক্যাশ ব্যালেন্স রয়েছে ৳ ${r}।`}return e==="get_all_bank_running_balances"?`জি স্যার! সকল ব্যাংক মিলিয়ে মোট ব্যাংকিং ব্যালেন্স হলো ৳ ${ee(t.totalBankBalance||0)}।`:e==="get_daily_expenses"?`জি স্যার! আজকের মোট খরচের পরিমাণ হলো ৳ ${ee(t.totalExpense||0)}।`:t.message?t.message:"জি স্যার, আপনার নির্দেশ অনুযায়ী হিসাবের বিস্তারিত নিচে কার্ড আকারে তুলে ধরা হলো।"}async chatGemini(e,t,n){const r=String(n||"").trim();if(!r)throw new Error("জেমিনি এআই কী পাওয়া যায়নি");const i=[this.geminiModel,"gemini-3.6-flash","gemini-3.5-flash","gemini-3.1-flash-lite","gemini-flash-latest"],a=[...new Set(i.filter(Boolean))],c=this.detectEmotion(t);this.currentEmotion=c;const l={parts:[{text:this.getSystemPrompt(c)}]},d=[],f=(e||[]).slice(-8);for(const y of f){const v=y.sender==="user"?"user":"model",w=String(y.text||"").replace(/[*_#`]/g,"").trim();w&&(d.length>0&&d[d.length-1].role===v?d[d.length-1].parts[0].text+=`
`+w:d.push({role:v,parts:[{text:w}]}))}for(;d.length>0&&d[0]?.role!=="user";)d.shift();const m=String(t||"").trim(),_=d[d.length-1];!_||_.role!=="user"?d.push({role:"user",parts:[{text:m}]}):_.parts[0]?.text!==m&&(d[d.length-1].parts[0].text=m);const T=[{functionDeclarations:this.getToolsSchema().map(y=>{const v=y.function.parameters.properties||{},w={};for(const[I,k]of Object.entries(v))w[I]={type:(k.type||"STRING").toUpperCase(),description:k.description||""},k.enum&&(w[I].enum=k.enum);return{name:y.function.name,description:y.function.description,parameters:{type:"OBJECT",properties:w,required:y.function.parameters.required||[]}}})}];let R=null,N=this.geminiModel||"gemini-2.0-flash",D=`https://generativelanguage.googleapis.com/v1beta/models/${N}:generateContent?key=${r}`,x=null;for(const y of a){const v=`https://generativelanguage.googleapis.com/v1beta/models/${y}:generateContent?key=${r}`;try{const w=await fetch(v,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({system_instruction:l,contents:d,tools:T})});if(w.ok){R=w,N=y,D=v,this.geminiModel=y,typeof window<"u"&&localStorage.setItem("jarvis_gemini_model",y);break}if(x=await w.json().catch(()=>({})),console.warn(`[LLMAgent] Gemini model ${y} returned error:`,x),w.status===404||w.status===503||w.status===429)continue;R=w,N=y,D=v;break}catch(w){console.error(`[LLMAgent] Fetch error with model ${y}:`,w)}}if(!R||!R.ok){for(const v of["gemini-2.0-flash","gemini-1.5-flash"])try{const w=`https://generativelanguage.googleapis.com/v1beta/models/${v}:generateContent?key=${r}`,I=await fetch(w,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({system_instruction:l,contents:d})});if(I.ok){const le=((await I.json()).candidates?.[0]?.content?.parts||[]).find(J=>J.text);if(le?.text)return{spoken:le.text,data:null}}}catch(w){console.error(`[LLMAgent] Fallback error with ${v}:`,w)}const y=x?.error?.message||"গুগল সার্ভার এই মুহূর্তে কিছুটা ব্যস্ত রয়েছে।";throw new Error(y)}const p=(await R.json()).candidates?.[0]?.content,S=p?.parts?.find(y=>y.functionCall);if(S){const{name:y,args:v}=S.functionCall,w=await this.executeToolCall(y,v||{});d.push(p),d.push({role:"user",parts:[{functionResponse:{name:y,response:{name:y,content:w}}}]});let I;try{I=await fetch(D,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({system_instruction:l,contents:d,tools:T})})}catch(E){console.error("[LLMAgent] Second round error:",E)}let k="";if(I&&I.ok){const J=((await I.json()).candidates?.[0]?.content?.parts||[]).find(ue=>ue.text);J?.text&&(k=J.text)}return k||(k=this.generateDynamicToolSpokenSummary(y,w)),{spoken:k,data:w}}return{spoken:(p?.parts||[]).find(y=>y.text)?.text||"জি স্যার, আমি আপনার নির্দেশ অনুযায়ী হিসাব দেখতে প্রস্তুত আছি।",data:null}}async chatLocalEmpathetic(e,t=!1,n="",r=[]){const i=e.toLowerCase();if(/হ্যালো|হাই|hello|hi|নমস্কার|সালাম|জার্ভিস|শুনছো|আছো/.test(i))return{spoken:`${this.getTimeGreeting()} স্যার! আসসালামু আলাইকুম। আমি জার্ভিস। আপনার মা মোটরসের যাবতীয় কাস্টমার বকেয়া, ক্যাশ স্থিতি ও ব্যাংকের হিসাব দেখতে আমি সম্পূর্ণ প্রস্তুত আছি। বলুন স্যার, কীভাবে সাহায্য করবো?`,data:null};if(/তুমি কি কি করতে পারো|তোমার কি কি ক্ষমতা|কি কি জানতে পারি|সাহায্য|হেল্প|help|কিভাবে সাহায্য করতে পারো|কি কি জানতে পারবো/i.test(i))return{spoken:`জি স্যার! আমি মেসার্স মা মোটরসের প্রধান এআই নির্বাহী সহকারী। আপনি আমার কাছে জানতে পারেন:
১. যেকোনো কাস্টমারের বর্তমান অবশিষ্ট বকেয়া, মোবাইল নম্বর, ঠিকানা ও শেষ চালান বা পেমেন্ট।
২. নির্দিষ্ট টাকার অঙ্ক দিয়ে (যেমন: ৫,৫০০ টাকা অগ্রিম কোন একাউন্ট) রিভার্স অনুসন্ধান।
৩. আজকের মোট বিক্রি, শোরুম ক্যাশ ও ব্যাংকে কালেকশন এবং অফিসের খরচের হিসাব।
৪. প্রতিটি ব্যাংকের বর্তমান লাইভ ব্যালেন্স এবং শোরুমের ক্যাশ ইন হ্যান্ড স্থিতি।
৫. মোট কতজন কাস্টমার, দেনাদার সংখ্যা, সেরা বাকিদার বা অলস কাস্টমারদের তালিকা।
৬. অতীত যেকোনো দিনের সম্পূর্ণ হিসাব এবং দুবাই কন্টেইনার অডিট রিপোর্ট।
বলুন স্যার, এখন কোন হিসাবটি দেখতে চান?`,data:null};if(i.includes("মেজাজ খারাপ")||i.includes("বিরক্ত")||i.includes("মন খারাপ")||i.includes("কষ্ট")||i.includes("চাপ"))return{spoken:"জি স্যার, বুঝতে পারছি। ব্যবসা চালাতে গেলে এমন মানসিক চাপ আসা খুবই স্বাভাবিক। আপনি চিন্তা করবেন না, আমরা ঠান্ডা মাথায় হিসাবগুলো দেখে সব ঠিক করে নেবো।",data:null};if(i.includes("কেমন আছো")||i.includes("কেমন আছেন")||i.includes("কি খবর")||i.includes("হালচাল"))return{spoken:"আলহামদুলিল্লাহ স্যার, আমি একদম প্রস্তুত আছি! আপনার মা মোটরসের যাবতীয় হিসাব ও লেজার সার্বক্ষণিক আমার নজরে রয়েছে। বলুন স্যার, কীভাবে সাহায্য করবো?",data:null};if(/(?:মোট\s*কাস্টমার|কাস্টমার\s*সংখ্যা|কত\s*জন\s*কাস্টমার|মোট\s*দেনাদার|দেনাদার\s*সংখ্যা|কত\s*জন\s*বাকিদার|বাকিদার\s*সংখ্যা|কত\s*জনের\s*বকেয়া|জিরো\s*বকেয়া|বকেয়া\s*নেই|কোনো\s*বাকি\s*নেই|বাকি\s*মুক্ত|কয়টি\s*ব্যাংক|কয়টা\s*ব্যাংক|ব্যাংক\s*অ্যাকাউন্ট\s*কয়টি)/i.test(i)){const p=await this.executeToolCall("get_business_demographics",{});if(p&&p.success)return{spoken:`জি স্যার! মা মোটরসের ডেটাবেজে সর্বমোট ${p.totalCustomers.toLocaleString("bn-BD")} জন কাস্টমার নিবন্ধিত আছেন। এর মধ্যে বকেয়া দেনাদার রয়েছেন ${p.debtorCount.toLocaleString("bn-BD")} জন, অগ্রিম জমা রয়েছে ${p.advanceCount.toLocaleString("bn-BD")} জনের এবং কোনো বকেয়া নেই ${p.zeroDueCount.toLocaleString("bn-BD")} জনের। এছাড়া আমাদের সক্রিয় ব্যাংক অ্যাকাউন্ট রয়েছে ${p.activeBanksCount.toLocaleString("bn-BD")}টি।`,data:p}}const a=/(?:টাকা.*(?:কার|কোন|কোনটা|একাউন্ট|অ্যাকাউন্ট|কাস্টমার)|(?:কার|কোন|কোনটা|একাউন্ট|অ্যাকাউন্ট|কাস্টমার).*(?:টাকা|বকেয়া|অগ্রিম|জমা)|এটা\s*কোন\s*একাউন্ট|এটা\s*কার|কোন\s*একাউন্ট|কার\s*একাউন্ট|কার\s*টাকা|কে\s*দিল|কে\s*দিলো)/i.test(i);let c=0,l="any";/অগ্রিম|এডভান্স|জমা\s*রয়েছে|জমা\s*আছে/i.test(i)?l="advance":/বকেয়া|বাকী|দেনা/i.test(i)&&(l="due");const d=e.match(/(?:[০-৯0-9,]+(?:\.[০-৯0-9]+)?)/);if(d&&(c=Rr(d[0])),c<=0&&a&&Array.isArray(r)&&r.length>0){const p=[...r].reverse().find(S=>S.sender==="assistant"||S.role==="assistant");if(p&&p.text){if(/অগ্রিম/i.test(i)||/অগ্রিম/i.test(p.text)){const S=p.text.match(/অগ্রিম\s*(?:জমা\s*(?:রয়েছে|আছে|হলো)?)?\s*([০-৯0-9,]+)\s*টাকা/i);S&&S[1]&&(c=Rr(S[1]),l="advance")}if(c<=0){const S=p.text.match(/([০-৯0-9,]+)\s*টাকা/);S&&S[1]&&(c=Rr(S[1]))}}}if(a&&c>0){const p=await this.executeToolCall("search_by_amount_or_reference",{amount:c,hintType:l});if(p&&p.found){const S=p.primaryMatch,C=S.phone?` (মোবাইল: ${S.phone})`:S.address?` (${S.address})`:"";if(p.matchCategory==="advance"){const V=p.totalMatchesCount>1?` এবং আরও ${(p.totalMatchesCount-1).toLocaleString("bn-BD")} জনের এমন অগ্রিম রয়েছে`:"";return{spoken:`জি স্যার! ${c.toLocaleString("bn-BD")} টাকা অগ্রিম জমা রয়েছে "${S.name}"${C}-এর একাউন্টে। উনার বর্তমান অগ্রিম স্থিতি হলো ${Number(S.advanceAmount).toLocaleString("bn-BD")} টাকা${V}।`,data:p}}else if(p.matchCategory==="due"){const V=p.totalMatchesCount>1?` এবং আরও ${(p.totalMatchesCount-1).toLocaleString("bn-BD")} জনের এমন বকেয়া রয়েছে`:"";return{spoken:`জি স্যার! ${c.toLocaleString("bn-BD")} টাকা অবশিষ্ট বকেয়া রয়েছে "${S.name}"${C}-এর একাউন্টে${V}।`,data:p}}else if(p.matchCategory==="transaction")return S.isPayment?{spoken:`জি স্যার! ${c.toLocaleString("bn-BD")} টাকা জমা দিয়েছিলেন "${S.customerName}" (${S.date} তারিখে, ভাউচার: ${S.voucherNo||"নেই"})।`,data:p}:{spoken:`জি স্যার! ${c.toLocaleString("bn-BD")} টাকার চালান নেওয়া হয়েছিল "${S.customerName}"-এর নামে (${S.date} তারিখে, চালান: ${S.voucherNo||"নেই"})।`,data:p}}else if(p&&!p.found)return{spoken:`জি স্যার, মা মোটরসের ডেটাবেজে ${c.toLocaleString("bn-BD")} টাকার কোনো অগ্রিম জমা বা অবশিষ্ট বকেয়া রেকর্ড পাওয়া যায়নি।`,data:null}}if(/(?:ফোন|মোবাইল|নাম্বার|নম্বর|ঠিকানা|দোকান|এরিয়া|এলাকা|অ্যাকাউন্ট\s*নম্বর|একাউন্ট\s*নাম্বার|শেষ\s*পেমেন্ট|শেষ\s*চালান|শেষ\s*বিল|মোট\s*মাল|মোট\s*বিক্রি|কত\s*টাকার\s*মাল|মোট\s*জমা)/i.test(i)){const p=e.replace(/(কাস্টমার|সাহেবের|ভাইয়ের|এর|ফোন|মোবাইল|নাম্বার|নম্বর|ঠিকানা|দোকান|এরিয়া|এলাকা|অ্যাকাউন্ট|একাউন্ট|শেষ|পেমেন্ট|চালান|বিল|মোট|মাল|বিক্রি|কত|টাকার|জমা|দাও|দেও|বলো|জানাও|দেখাও|কোথায়|কি|কী)/g,"").trim();if(p.length>=2&&!/^(?:ফোন|মোবাইল|নাম্বার|নম্বর|ঠিকানা|দোকান|অ্যাকাউন্ট|শেষ|পেমেন্ট|চালান|বিল)$/i.test(p)){const S=await H.getCustomer360Profile(p);if(S&&S.found){if(/ফোন|মোবাইল|নাম্বার|নম্বর/i.test(i))return{spoken:`জি স্যার! ${S.name}-এর মোবাইল নম্বর হলো ${S.phone||"দেওয়া নেই"}।`,data:S};if(/ঠিকানা|দোকান|এরিয়া|এলাকা/i.test(i))return{spoken:`জি স্যার! ${S.name}-এর ঠিকানা হলো: ${S.address||"ঠিকানা দেওয়া নেই"} (${S.zone||"সাধারণ জোন"})।`,data:S};if(/অ্যাকাউন্ট|একাউন্ট/i.test(i))return{spoken:`জি স্যার! ${S.name}-এর অ্যাকাউন্ট নম্বর হলো ${S.accountNo||"নির্ধারিত নেই"}।`,data:S};if(/শেষ\s*পেমেন্ট|শেষ\s*জমা/i.test(i)){const C=S.lastPayment?`${S.lastPayment.date} তারিখে ${Number(S.lastPayment.amount).toLocaleString("bn-BD")} টাকা (${S.lastPayment.receivedType||"ক্যাশ"})`:"কোনো জমার রেকর্ড নেই";return{spoken:`জি স্যার! ${S.name} শেষবার ${C} পরিশোধ করেছেন।`,data:S}}if(/শেষ\s*চালান|শেষ\s*বিল/i.test(i)){const C=S.lastBill?`${S.lastBill.date} তারিখে ${Number(S.lastBill.amount).toLocaleString("bn-BD")} টাকার চালান (${S.lastBill.voucherNo||""})`:"কোনো চালানের রেকর্ড নেই";return{spoken:`জি স্যার! ${S.name}-এর শেষ চালান ছিল ${C}।`,data:S}}if(/মোট\s*মাল|মোট\s*বিক্রি|কত\s*টাকার\s*মাল|মোট\s*জমা/i.test(i))return{spoken:`জি স্যার! ${S.name} মা মোটরস থেকে আজীবন মোট ${Number(S.totalPurchased||0).toLocaleString("bn-BD")} টাকার মাল নিয়েছেন এবং মোট ${Number(S.totalPaid||0).toLocaleString("bn-BD")} টাকা জমা দিয়েছেন। বর্তমান অবশিষ্ট বকেয়া হলো ${Number(S.totalDue||0).toLocaleString("bn-BD")} টাকা।`,data:S}}}}const m=hh(i),_=rt(),T=/(?:বিক্রি|সেল|কালেকশন|জমা|টাকা|খরচ|চালান|হিসাব|রিপোর্ট)/i.test(i);if(m&&m!==_&&T){const p=await this.executeToolCall("get_historical_date_summary",{targetDate:m});if(p?.authRequired)return{spoken:"জি স্যার, অতীতের হিসাব দেখতে মা মোটরসের অনুমোদিত গুগল অ্যাকাউন্টে সাইন ইন করুন।",data:{authRequired:!0}};if(p&&p.success){const S=[];p.totalBills>0&&S.push(`মোট বিক্রি হয়েছিল ${p.totalBills.toLocaleString("bn-BD")} টাকা (${p.billCount.toLocaleString("bn-BD")}টি চালানে)`),p.totalCollections>0&&S.push(`মোট কালেকশন এসেছিল ${p.totalCollections.toLocaleString("bn-BD")} টাকা (শোরুম ক্যাশ: ${p.showroomCashCollections.toLocaleString("bn-BD")}, ব্যাংক: ${p.bankCollections.toLocaleString("bn-BD")})`),p.totalExpenses>0&&S.push(`মোট খরচ হয়েছিল ${p.totalExpenses.toLocaleString("bn-BD")} টাকা`);const C=S.length>0?S.join(", ")+"।":"কোনো বড় লেনদেনের রেকর্ড পাওয়া যায়নি।";return{spoken:`জি স্যার! ${p.date} তারিখে ${C} সেদিনের নিট ক্যাশফ্লো ছিল ${p.netCashflow.toLocaleString("bn-BD")} টাকা।`,data:p}}}if(/কাদের.*ব্যাংক|ব্যাংকে.*কাদের|কারা.*ব্যাংক|ব্যাংকে.*কারা|আজকে.*ব্যাংক|ব্যাংকে.*জমা/i.test(i)&&!/সপ্তাহ|মাস|বছর/i.test(i)){const p=await this.executeToolCall("get_today_bank_collections",{});if(p?.authRequired)return{spoken:'জি স্যার, আজকের ব্যাংকে জমার হিসাব দেখতে প্রথমে উপরের "গুগল লগইন" বাটনে ক্লিক করে সাইন ইন করুন।',data:{authRequired:!0}};if(p&&p.success){if(p.customerDepositsCount===0&&(!p.directDeposits||p.directDeposits.length===0))return{spoken:"জি স্যার, আজকে এখনো পর্যন্ত কোনো কাস্টমার ব্যাংকে টাকা জমা দেয়নি।",data:p};const S=p.customerDeposits.slice(0,3).map(V=>`${V.customerName} (${V.bankName}-এ ${V.amount.toLocaleString("bn-BD")} টাকা)`).join(", "),C=p.customerDepositsCount>3?` এবং আরও ${(p.customerDepositsCount-3).toLocaleString("bn-BD")} জন`:"";return{spoken:`জি স্যার! আজকে আমাদের বিভিন্ন ব্যাংকে সর্বমোট ${p.totalBankDeposit.toLocaleString("bn-BD")} টাকা জমা হয়েছে। যারা জমা দিয়েছেন: ${S}${C}।`,data:p}}}if(/আজকে.*(শোরুম.*ক্যাশ|ক্যাশ.*জমা|ক্যাশে.*কত|ক্যাশ.*কালেকশন|ক্যাশে.*টাকা)|(শোরুম.*ক্যাশ.*কত.*জমা)|আজকের.*(ক্যাশ.*জমা|ক্যাশ.*কালেকশন|শোরুম.*ক্যাশ)/i.test(i)||(i.includes("ক্যাশ")||i.includes("শোরুম"))&&(i.includes("আজকে")||i.includes("আজকের"))&&(i.includes("জমা")||i.includes("কালেকশন")||i.includes("কত")||i.includes("টাকা"))){const p=await this.executeToolCall("get_today_showroom_cash_collections",{});if(p?.authRequired)return{spoken:"জি স্যার, আজকের শোরুম ক্যাশের লাইভ জমা দেখতে মা মোটরস গুগল একাউন্টে সাইন ইন করে নিন।",data:{authRequired:!0}};if(p&&p.success){if(p.totalCashCollected===0&&p.todayCashExpenses===0)return{spoken:`জি স্যার! আজকে (${p.date}) এখন পর্যন্ত শোরুম ক্যাশে কোনো কাস্টমার থেকে নগদ টাকা জমা হয়নি।`,data:p};let S="";if(p.customerPayments&&p.customerPayments.length>0){const V=p.customerPayments.slice(0,3).map(y=>`${y.customerName}-এর থেকে ${y.amount.toLocaleString("bn-BD")} টাকা`).join(", "),b=p.customerPaymentsCount>3?` এবং আরও ${(p.customerPaymentsCount-3).toLocaleString("bn-BD")} জন`:"";S=` জমা দেওয়া কাস্টমারদের মধ্যে রয়েছেন: ${V}${b}।`}let C="";return p.todayCashExpenses>0&&(C=` এছাড়া আজকে ক্যাশ ড্রয়ার থেকে খরচ হয়েছে ${p.todayCashExpenses.toLocaleString("bn-BD")} টাকা (${p.expenseCount.toLocaleString("bn-BD")}টি ভাউচারে), ফলে আজকের নিট ক্যাশ স্থিতি হলো ${p.todayNetShowroomCash.toLocaleString("bn-BD")} টাকা।`),{spoken:`জি স্যার! আজকে শোরুম ক্যাশে সর্বমোট ${p.totalCashCollected.toLocaleString("bn-BD")} টাকা নগদ জমা হয়েছে (${p.customerPaymentsCount.toLocaleString("bn-BD")} জন কাস্টমার থেকে)।${S}${C}`,data:p}}}if(/সপ্তাহ|৭ দিন|সাপ্তাহিক/i.test(i)&&/ব্যাংক|জমা|কালেকশন/i.test(i)){const p=await this.executeToolCall("get_weekly_bank_summary",{days:7});if(p?.authRequired)return{spoken:"জি স্যার, গত সপ্তাহের ব্যাংক ডিপোজিট দেখতে প্রথমে গুগল অ্যাকাউন্টে সাইন ইন করুন।",data:{authRequired:!0}};if(p&&p.success){if(p.bankList.length===0)return{spoken:"জি স্যার, গত এক সপ্তাহে ব্যাংকে কোনো জমার রেকর্ড পাওয়া যায়নি।",data:p};const S=p.bankList.map(C=>`${C.bankName}-এ ${C.totalAmount.toLocaleString("bn-BD")} টাকা`).join(", ");return{spoken:`জি স্যার! গত এক সপ্তাহে আমাদের ব্যাংকগুলোতে সর্বমোট ${p.grandTotalBankDeposits.toLocaleString("bn-BD")} টাকা জমা হয়েছে। এর মধ্যে: ${S}।`,data:p}}}if(/আজকে.*(?:কারা.*মাল|কার.*কাছে.*মাল|কাদের.*কাছে.*মাল|চালান.*হলো|চালানের.*তালিকা|কয়টা.*চালান|চালান.*ইস্যু)|চালান.*কারা.*নিলো|কাদের.*মাল.*দেওয়া.*হলো/i.test(i)){const p=await this.executeToolCall("get_today_sales_invoices",{});if(p?.authRequired)return{spoken:"জি স্যার, আজকের বিক্রয় চালান দেখতে মা মোটরসের অ্যাকাউন্টে সাইন ইন করুন।",data:{authRequired:!0}};if(p&&p.success){if(p.invoiceCount===0)return{spoken:`জি স্যার! আজকে (${p.date}) এখনো পর্যন্ত কোনো কাস্টমারের বিক্রয় চালান কাটা হয়নি।`,data:p};const S=p.invoices.slice(0,3).map(V=>`${V.customerName} (${V.amount.toLocaleString("bn-BD")} টাকা)`).join(", "),C=p.invoiceCount>3?` এবং আরও ${(p.invoiceCount-3).toLocaleString("bn-BD")}টি চালান`:"";return{spoken:`জি স্যার! আজকে মা মোটরসে মোট ${p.todayTotalBills.toLocaleString("bn-BD")} টাকার মাল বিক্রি হয়েছে (সর্বমোট ${p.invoiceCount.toLocaleString("bn-BD")}টি চালানে)। এর মধ্যে চালান হয়েছে: ${S}${C}।`,data:p}}}if(/(?:এই\s*মাসে|এই\s*মাসের|চলতি\s*সপ্তাহে|চলতি\s*সপ্তাহের|গত\s*মাসে|বিগত\s*\d+\s*দিনে|\d+\s*দিনের).*(?:বিক্রি|সেল|টার্নওভার)/i.test(i)||/(?:বিক্রি|সেল|টার্নওভার).*(?:এই\s*মাসে|চলতি\s*সপ্তাহে|গত\s*মাসে|বিগত\s*\d+\s*দিনে|\d+\s*দিনের)/i.test(i)){let p=30;const C=(y=>y.replace(/[০-৯]/g,v=>"০১২৩৪৫৬৭৮৯".indexOf(v)))(i),V=C.match(/(\d+)\s*(?:দিন|days)/i);V?p=parseInt(V[1],10):/সপ্তাহ|৭\s*দিন/i.test(C)?p=7:/দুই\s*মাস|২\s*মাস|৬০\s*দিন/i.test(C)?p=60:/তিন\s*মাস|৩\s*মাস|৯০\s*দিন/i.test(C)&&(p=90);const b=await this.executeToolCall("get_period_sales_turnover",{days:p});if(b?.authRequired)return{spoken:"জি স্যার, বিক্রির টার্নওভার রিপোর্ট দেখতে মা মোটরসের অ্যাকাউন্টে সাইন ইন করুন।",data:{authRequired:!0}};if(b&&b.success)return{spoken:`জি স্যার! বিগত ${b.days.toLocaleString("bn-BD")} দিনে মা মোটরসে সর্বমোট ${b.totalSalesSum.toLocaleString("bn-BD")} টাকার মাল বিক্রি হয়েছে (${b.invoiceCount.toLocaleString("bn-BD")}টি চালানে, ${b.buyingCustomersCount.toLocaleString("bn-BD")} জন ক্রেতার কাছে)। দৈনিক গড় বিক্রি ছিল প্রায় ${b.dailyAverageSales.toLocaleString("bn-BD")} টাকা।`,data:b}}if(/সেরা.*(?:ক্রেতা|কাস্টমার|খরিদ্দার)|টপ.*(?:ক্রেতা|কাস্টমার|বায়ার)|সবচেয়ে\s*বেশি.*(?:মাল|টাকার\s*মাল|কিনেছে|ক্রয়)/i.test(i)){const p=await this.executeToolCall("get_top_buying_customers",{limit:5,days:30});if(p?.authRequired)return{spoken:"জি স্যার, সেরা ক্রেতাদের তালিকা দেখতে মা মোটরসের অ্যাকাউন্টে সাইন ইন করুন।",data:{authRequired:!0}};if(p&&p.success)return{spoken:`জি স্যার! বিগত ৩০ দিনে মা মোটরসে সবচেয়ে বেশি টাকার মাল ক্রয় করেছেন এমন শীর্ষ ৫ জন ক্রেতা হলেন: ${(p.topBuyers||[]).slice(0,5).map((C,V)=>`${(V+1).toLocaleString("bn-BD")}. ${C.customerName} (${C.totalPurchases.toLocaleString("bn-BD")} টাকা)`).join(", ")}।`,data:p}}if(/রিকভারি\s*রেট|বিক্রির.*তুলনায়.*(?:টাকা|কালেকশন|আদায়|উঠেছে)|কালেকশন.*রিকভারি|শতকরা.*আদায়/i.test(i)){const p=await this.executeToolCall("get_collection_recovery_efficiency",{days:30});if(p?.authRequired)return{spoken:"জি স্যার, কালেকশন রিকভারি রেট দেখতে মা মোটরসের অ্যাকাউন্টে সাইন ইন করুন।",data:{authRequired:!0}};if(p&&p.success)return{spoken:`জি স্যার! বিগত ৩০ দিনে মোট ${p.totalBilled.toLocaleString("bn-BD")} টাকার বিক্রির বিপরীতে নগদ ও ব্যাংক মিলিয়ে আদায় হয়েছে ${p.totalCollected.toLocaleString("bn-BD")} টাকা। আমাদের বর্তমান কালেকশন রিকভারি রেট হলো ${p.recoveryRate.toLocaleString("bn-BD")}%। বকেয়া বৃদ্ধির গ্যাপ রয়েছে ${p.uncollectedGap.toLocaleString("bn-BD")} টাকা।`,data:p}}if(/অগ্রিম.*(?:জমা|টাকা|কাস্টমার|ক্রেতা)|কারা.*অগ্রিম|কাদের.*অগ্রিম|অতিরিক্ত.*টাকা.*জমা|নেগেটিভ.*বকেয়া/i.test(i)){const p=await this.executeToolCall("get_advance_paying_customers",{limit:15});if(p?.authRequired)return{spoken:"জি স্যার, অগ্রিম জমাকারী কাস্টমারদের তালিকা দেখতে অ্যাকাউন্টে সাইন ইন করুন।",data:{authRequired:!0}};if(p&&p.success){if(p.advanceCount===0)return{spoken:"জি স্যার! বর্তমানে কোনো কাস্টমারের অগ্রিম জমা বা অতিরিক্ত ব্যালেন্স নেই।",data:p};const S=p.topAdvance.slice(0,3).map(V=>`${V.name} (${V.advanceAmount.toLocaleString("bn-BD")} টাকা)`).join(", "),C=p.advanceCount>3?` এবং আরও ${(p.advanceCount-3).toLocaleString("bn-BD")} জন`:"";return{spoken:`জি স্যার! মা মোটরসের মোট ${p.advanceCount.toLocaleString("bn-BD")} জন কাস্টমারের কাছে কোম্পানির সর্বমোট ${p.totalAdvanceSum.toLocaleString("bn-BD")} টাকা অগ্রিম জমা রয়েছে। শীর্ষ অগ্রিম জমাকারীদের মধ্যে রয়েছেন: ${S}${C}।`,data:p}}}const N=i.match(/(?:ইসলামী\s*ব্যাংক|one\s*bank|ওয়ান\s*ব্যাংক|ওয়ান\s*ব্যাংক|ডাচ\s*বাংলা|dbbl|ibbl|ইউসিবি|ucb|ব্র্যাক\s*ব্যাংক|সিটি\s*ব্যাংক)/i);if(N&&/(?:স্টেটমেন্ট|হিসাব|অবস্থা|কত\s*জমা|কত\s*আসলো|কত\s*খরচ|ব্যালেন্স|লেনদেন|রিপোর্ট)/i.test(i)){const p=N[0],S=await this.executeToolCall("get_specific_bank_statement_summary",{bankName:p,days:30});if(S?.authRequired)return{spoken:"জি স্যার, ব্যাংক স্টেটমেন্ট দেখতে মা মোটরসের অ্যাকাউন্টে সাইন ইন করুন।",data:{authRequired:!0}};if(S&&S.success&&S.found)return{spoken:`জি স্যার! বিগত ৩০ দিনে ${S.bankName}-এ কাস্টমার জমা ও ট্রান্সফার মিলিয়ে মোট ঢুকেছে ${S.totalInflowsPeriod.toLocaleString("bn-BD")} টাকা এবং খরচ ও উত্তোলন বাবদ বের হয়েছে ${S.totalOutflowsPeriod.toLocaleString("bn-BD")} টাকা। এই ব্যাংকে বর্তমান চলমান ব্যালেন্স রয়েছে ${S.currentRunningBalance.toLocaleString("bn-BD")} টাকা।`,data:S}}if(/সবচেয়ে\s*বেশি.*(?:টাকা.*কোন\s*ব্যাংকে|কোন\s*ব্যাংকে.*জমা|ব্যাংকে.*কালেকশন)|শীর্ষ\s*ব্যাংক|টপ\s*ব্যাংক/i.test(i)){const p=await this.executeToolCall("get_top_inflow_bank",{days:30});if(p?.authRequired)return{spoken:"জি স্যার, ব্যাংকের শীর্ষ জমার তথ্য দেখতে অ্যাকাউন্টে সাইন ইন করুন।",data:{authRequired:!0}};if(p&&p.success&&p.topBank){const S=p.rankings.slice(0,3).map((C,V)=>`${(V+1).toLocaleString("bn-BD")}. ${C.bankName} (${C.totalDeposits.toLocaleString("bn-BD")} টাকা)`).join(", ");return{spoken:`জি স্যার! বিগত ৩০ দিনে সবচেয়ে বেশি টাকা জমা পড়েছে ${p.topBank.bankName}-এ (${p.topBank.totalDeposits.toLocaleString("bn-BD")} টাকা, ${p.topBank.txnCount.toLocaleString("bn-BD")}টি লেনদেনে)। শীর্ষ ব্যাংকগুলো হলো: ${S}।`,data:p}}}if(/খরচ\s*বাদে.*(?:নিট|ক্যাশ|উদ্বৃত্ত|কত\s*থাকে)|নিট\s*ক্যাশফ্লো|অপারেটিং\s*ক্যাশফ্লো|কালেকশন.*খরচ.*বাদ/i.test(i)){const p=await this.executeToolCall("get_monthly_net_cashflow",{days:30});if(p?.authRequired)return{spoken:"জি স্যার, নিট ক্যাশফ্লো রিপোর্ট দেখতে মা মোটরসের অ্যাকাউন্টে সাইন ইন করুন।",data:{authRequired:!0}};if(p&&p.success){const S=p.isSurplus?"উদ্বৃত্ত (সারপ্লাস)":"ঘাটতি (ডেফিসিট)";return{spoken:`জি স্যার! বিগত ৩০ দিনে মা মোটরসে মোট কালেকশন এসেছে ${p.totalInflows.toLocaleString("bn-BD")} টাকা এবং মোট অফিস খরচ হয়েছে ${p.totalExpenses.toLocaleString("bn-BD")} টাকা। ফলে বর্তমানে নিট ক্যাশফ্লো হলো ${p.netCashflow.toLocaleString("bn-BD")} টাকা ${S}।`,data:p}}}if(/আজকের.*বিক্রি|আজকের.*সেল|আজকে.*কত.*বিক্রি|আজকের.*চালান|আজকে.*কত.*চালান|ব্যবসায়িক.*নাড়ি|বিজনেস.*পালস/i.test(i)){const p=await this.executeToolCall("get_executive_business_pulse",{});if(p?.authRequired)return{spoken:"জি স্যার, আজকের ব্যবসার নাড়ির স্পন্দন দেখতে মা মোটরসের অ্যাকাউন্টে সাইন ইন করুন।",data:{authRequired:!0}};if(p&&p.success)return{spoken:`জি স্যার! আজকে মা মোটরসে মোট বিক্রি হয়েছে ${p.todayTotalBills.toLocaleString("bn-BD")} টাকা। মোট কালেকশন এসেছে ${p.todayTotalCollections.toLocaleString("bn-BD")} টাকা (ক্যাশ: ${p.cashCollections.toLocaleString("bn-BD")}, ব্যাংক: ${p.bankCollections.toLocaleString("bn-BD")})। মোট খরচ হয়েছে ${p.todayTotalExpenses.toLocaleString("bn-BD")} টাকা। আজকের নিট ক্যাশ ফ্লো হলো ${p.todayNetCashFlow.toLocaleString("bn-BD")} টাকা।`,data:p}}if(/টপ.*বাকি|বড়.*বাকি|মার্কেটে.*বাকি|বেশি.*বাকি|বাকিদার.*কারা|টপ.*দেনাদার/i.test(i)){const p=await this.executeToolCall("get_top_debtors_and_market_analytics",{limit:5});if(p?.authRequired)return{spoken:"জি স্যার, টপ বাকিদারদের তালিকা দেখতে মা মোটরসের অ্যাকাউন্টে সাইন ইন করুন।",data:{authRequired:!0}};if(p&&p.success){const S=p.topDebtors.map(C=>`${C.name} (${C.totalDue.toLocaleString("bn-BD")} টাকা)`).join(", ");return{spoken:`জি স্যার! বর্তমানে মার্কেটের মোট অবশিষ্ট বকেয়া হলো ${p.totalMarketDue.toLocaleString("bn-BD")} টাকা। শীর্ষ ৫ জন বাকিদার হলেন: ${S}।`,data:p}}}if(/আজকে.*কত.*খরচ|আজকের.*খরচ|খরচের.*হিসাব|মোট.*খরচ/i.test(i)&&!/দুবাই/i.test(i)){const p=await this.executeToolCall("get_daily_expenses",{});if(p?.authRequired)return{spoken:"জি স্যার, আজকের খরচের তালিকা দেখতে মা মোটরসের অ্যাকাউন্টে সাইন ইন করুন।",data:{authRequired:!0}};if(p&&p.success)return{spoken:`জি স্যার! আজকে আমাদের মোট অফিস খরচ হয়েছে ${p.totalExpense.toLocaleString("bn-BD")} টাকা (${p.itemsCount}টি ভাউচারে)।`,data:p}}if(/দুবাই|aed|দিরহাম|কন্টেইনার/i.test(i)){const p=await this.executeToolCall("get_dubai_container_status",{});if(p?.authRequired)return{spoken:"জি স্যার, দুবাই অডিটের হিসাব দেখতে মা মোটরসের অ্যাকাউন্টে সাইন ইন করুন।",data:{authRequired:!0}};if(p&&p.success)return{spoken:`জি স্যার! দুবাই কন্টেইনার অডিটের সর্বশেষ রিপোর্ট অনুযায়ী নগদ ক্যাশ রয়েছে ${p.cashInHandAED.toLocaleString("en-US")} এইডি (AED), মার্কেট এডভান্স রয়েছে ${p.marketAdvanceAED.toLocaleString("en-US")} এইডি এবং মোট ফিজিক্যাল এসেট হলো ${p.totalPhysicalAssetsAED.toLocaleString("en-US")} এইডি।`,data:p}}if(/ট্রেজারি|৪ কোটি|মাস্টার ফান্ড|সেন্ট্রাল ফান্ড/i.test(i)){const p=await this.executeToolCall("get_master_treasury_status",{});if(p?.authRequired)return{spoken:"জি স্যার, মাস্টার ট্রেজারি ফান্ডের ব্যালেন্স দেখতে অ্যাকাউন্টে সাইন ইন করুন।",data:{authRequired:!0}};if(p&&p.success)return{spoken:`জি স্যার! মা মোটরসের মাস্টার ট্রেজারি ফান্ডের বর্তমান ব্যালেন্স হলো ${p.currentTreasuryBalance.toLocaleString("bn-BD")} টাকা।`,data:p}}const x=e.match(/(?:ভাউচার|চালান|ইনভয়েস|inv|voucher)[\s#:-]*([0-9a-zA-Z-]+)/i);if(x&&x[1]){const p=x[1].trim(),S=await this.executeToolCall("search_voucher_or_invoice",{voucherNo:p});if(S?.authRequired)return{spoken:"জি স্যার, ভাউচার দেখতে মা মোটরসের অ্যাকাউন্টে সাইন ইন করুন।",data:{authRequired:!0}};if(S&&S.found&&S.records&&S.records.length>0){const C=S.records[0],V=C.bill>0?`বিল/চালান: ${C.bill.toLocaleString("bn-BD")} টাকা`:`জমা: ${C.paid.toLocaleString("bn-BD")} টাকা (${C.receivedType||"ক্যাশ"})`;return{spoken:`জি স্যার! ভাউচার নং ${C.voucherNo} হলো কাস্টমার ${C.customerName}-এর। তারিখ: ${C.date}, ${V}।`,data:S}}}if(/কোন.*ব্যাংকে.*কত|ব্যাংক.*ব্যালেন্স|ব্যাংকে.*কত.*টাকা|ক্যাশ.*বাক্সে|ক্যাশ.*ইন.*হ্যান্ড|হাতে.*নগদ|তারল্য/i.test(i)){const p=await this.executeToolCall("get_all_bank_running_balances",{});if(p?.authRequired)return{spoken:"জি স্যার, ব্যাংকের বর্তমান লাইভ ব্যালেন্স দেখতে মা মোটরসের অ্যাকাউন্টে সাইন ইন করুন।",data:{authRequired:!0}};if(p&&p.success){const S=p.banks.map(C=>`${C.bankName}-এ ${C.currentBalance.toLocaleString("bn-BD")} টাকা`).join(", ");return{spoken:`জি স্যার! বর্তমানে আমাদের ব্যাংকগুলোতে সর্বমোট ${p.totalBankBalance.toLocaleString("bn-BD")} টাকা ব্যালেন্স রয়েছে এবং শোরুমের ক্যাশ ইন হ্যান্ড রয়েছে ${p.showroomCashInHand.toLocaleString("bn-BD")} টাকা। মোট তারল্য তহবিল হলো ${p.grandTotalLiquidFunds.toLocaleString("bn-BD")} টাকা। এর মধ্যে: ${S}।`,data:p}}}if(/জোন|এলাকা|চট্টগ্রাম.*বকেয়া|ঢাকা.*বকেয়া|নোয়াখালী.*বকেয়া|কোন.*এলাকায়.*বাকি/i.test(i)){const p=await this.executeToolCall("get_zone_wise_analytics",{});if(p?.authRequired)return{spoken:"জি স্যার, জোনভিত্তিক বকেয়া রিপোর্ট দেখতে মা মোটরসের অ্যাকাউন্টে সাইন ইন করুন।",data:{authRequired:!0}};if(p&&p.success){const S=p.zones.slice(0,3).map(C=>`${C.zoneName}-এ ${C.totalDue.toLocaleString("bn-BD")} টাকা (${C.customerCount} জন কাস্টমার)`).join(", ");return{spoken:`জি স্যার! এলাকাভিত্তিক হিসাব অনুযায়ী বাজারে সর্বমোট ${p.grandTotalDue.toLocaleString("bn-BD")} টাকা অবশিষ্ট বকেয়া রয়েছে। এর মধ্যে শীর্ষ জোনগুলো হলো: ${S}।`,data:p}}}if(/(?:কারা|কে\s*কে|কোন\s*কোন|কোন|তালিকা|লিস্ট).*(?:টাকা|বকেয়া|বাকী|পেমেন্ট).*(?:দেয়নি|দেয়নি|দেয়\s*নাই|দেয়\s*নাই|দেয়নাই|দেয়নাই|দেয়\s*না|দেয়\s*না|পরিশোধ\s*করেনি|পরিশোধ\s*করে\s*নাই|জমা\s*দেয়নি|জমা\s*দেয়নি|জমা\s*দেয়\s*নাই|জমা\s*দেয়\s*নাই)/i.test(i)||/(?:টাকা|বকেয়া|বাকী|পেমেন্ট).*(?:দেয়নি|দেয়নি|দেয়\s*নাই|দেয়\s*নাই|দেয়নাই|দেয়নাই|দেয়\s*না|দেয়\s*না|পরিশোধ\s*করেনি).*(?:কারা|কে\s*কে|কোন|তালিকা|লিস্ট)/i.test(i)||/অলস.*কাস্টমার|নিষ্ক্রিয়|পেমেন্ট.*নেই|ঝুঁকিপূর্ণ.*বাকি|টাকা.*দেয়নি|বকেয়া.*দেয়নি|বকেয়া.*দেয়\s*নাই|টাকা.*দেয়\s*নাই|টাকা.*দেয়\s*নাই/i.test(i)){let p=30;const C=(y=>y.replace(/[০-৯]/g,v=>"০১২৩৪৫৬৭৮৯".indexOf(v)))(i),V=C.match(/(\d+)\s*(?:দিন|days)/i);V?p=parseInt(V[1],10):/এক\s*সপ্তাহ|১\s*সপ্তাহ|সাপ্তাহিক/i.test(C)?p=7:/দুই\s*মাস|২\s*মাস|দু\s*মাস/i.test(C)?p=60:/তিন\s*মাস|৩\s*মাস/i.test(C)?p=90:/এক\s*মাস|১\s*মাস|একমাস|মাসে/i.test(C)&&(p=30);const b=await this.executeToolCall("get_dormant_customers",{days:p});if(b?.authRequired)return{spoken:"জি স্যার, বকেয়া পরিশোধ না করা কাস্টমারদের তালিকা দেখতে মা মোটরসের অ্যাকাউন্টে সাইন ইন করুন।",data:{authRequired:!0}};if(b&&b.success){if(b.dormantCount===0)return{spoken:`জি স্যার! বিগত ${p.toLocaleString("bn-BD")} দিনে এমন কোনো কাস্টমার নেই যিনি বকেয়া টাকা জমা দেননি।`,data:b};const y=(b.topDormant||[]).slice(0,3).map(w=>`${w.name} (${w.totalDue.toLocaleString("bn-BD")} টাকা)`).join(", "),v=b.dormantCount>3?` এবং আরও ${b.dormantCount-3} জন`:"";return{spoken:`জি স্যার! বিগত ${p.toLocaleString("bn-BD")} দিনে মা মোটরসে কোনো বকেয়া টাকা জমা দেননি এমন কাস্টমার রয়েছেন সর্বমোট ${b.dormantCount.toLocaleString("bn-BD")} জন। তাদের কাছে মোট আটকে থাকা বকেয়া হলো ${b.totalDormantDue.toLocaleString("bn-BD")} টাকা। শীর্ষ বাকিদারদের মধ্যে রয়েছেন: ${y}${v}।`,data:b}}}if(/মার্কেটে.*মোট|বাজারে.*মোট.*বাকি|মার্কেট.*বকেয়া|মোট.*মার্কেট|মার্কেট.*সারসংক্ষেপ/i.test(i)){const p=await this.executeToolCall("get_total_market_summary",{});if(p?.authRequired)return{spoken:"জি স্যার, মার্কেটের মোট সারসংক্ষেপ দেখতে লগইন করুন।",data:{authRequired:!0}};if(p&&p.success)return{spoken:`জি স্যার! মা মোটরসের মোট ${p.totalCustomers.toLocaleString("bn-BD")} জন কাস্টমারের মধ্যে দেনাদার কাস্টমার রয়েছেন ${p.debtorCount.toLocaleString("bn-BD")} জন। বাজারে মোট বকেয়া হলো ${p.totalDueSum.toLocaleString("bn-BD")} টাকা, অগ্রিম জমা রয়েছে ${p.totalAdvanceSum.toLocaleString("bn-BD")} টাকা এবং নিট বকেয়া হলো ${p.netMarketDue.toLocaleString("bn-BD")} টাকা।`,data:p}}if(/কোন.*খাতে.*কত|খরচের.*খাত|বেতন|যাতায়াত|গাড়ি.*ভাড়া|অফিস.*ভাড়া|নাস্তা.*খরচ/i.test(i)&&!/দুবাই/i.test(i)){const p=await this.executeToolCall("get_category_expense_breakdown",{days:30});if(p?.authRequired)return{spoken:"জি স্যার, খাতওয়ারী খরচের হিসাব দেখতে অ্যাকাউন্টে সাইন ইন করুন।",data:{authRequired:!0}};if(p&&p.success){const S=p.categories.slice(0,3).map(C=>`${C.category}-এ ${C.totalAmount.toLocaleString("bn-BD")} টাকা`).join(", ");return{spoken:`জি স্যার! বিগত ৩০ দিনে মা মোটরসের মোট অফিস খরচ হয়েছে ${p.totalExpenseSum.toLocaleString("bn-BD")} টাকা (${p.totalVouchersCount}টি ভাউচারে)। এর মধ্যে সর্বোচ্চ খরচ হয়েছে: ${S}।`,data:p}}}if(/অডিট|গড়মিল|ভুল.*লেনদেন|লেজার.*চেক|হিসাব.*ঠিক|অখণ্ডতা/i.test(i)){const p=await this.executeToolCall("get_ledger_math_audit_summary",{sampleSize:100});if(p?.authRequired)return{spoken:"জি স্যার, লেজার অডিট চালাতে অ্যাকাউন্টে সাইন ইন করুন।",data:{authRequired:!0}};if(p&&p.success)return{spoken:`জি স্যার! ${p.statusMessage}`,data:p}}if(/এমরান.*মামা|আলতাফ|জাবেদ|মেস.*ফান্ড|দুবাই.*কার.*কাছে|দুবাই.*নগদ|দুবাই.*হেফাজত/i.test(i)){const p=await this.executeToolCall("get_dubai_deep_custodian_holdings",{});if(p?.authRequired)return{spoken:"জি স্যার, দুবাই কাস্টোডিয়ান হিসাব দেখতে লগইন করুন।",data:{authRequired:!0}};if(p&&p.success){const S=p.personalHoldings.map(C=>`${C.name}-এর কাছে ${C.amount.toLocaleString("en-US")} এইডি`).join(", ");return{spoken:`জি স্যার! দুবাই অডিটের রেকর্ড অনুযায়ী ব্যক্তিগত ক্যাশ হেফাজতে মোট ${p.holdingsTotal.toLocaleString("en-US")} এইডি (AED) রয়েছে। এর মধ্যে: ${S}। এছাড়া মেস ফান্ডে রয়েছে ${p.messBalance.toLocaleString("en-US")} এইডি এবং মোট ফিজিক্যাল এসেট হলো ${p.totalPhysicalAssets.toLocaleString("en-US")} এইডি।`,data:p}}}if(e.includes("বকেয়া")||e.includes("বাকী")||e.includes("হিসাব")||e.includes("ব্যালেন্স")||e.includes("টাকা")||e.includes("লেজার")||e.includes("চালান")){const p=e.replace(/(কাস্টমার|সাহেবের|ভাইয়ের|এর|বকেয়া|বাকী|হিসাব|ব্যালেন্স|কত|বলো|জানাও|দেখাও|টাকা|লেজার|চালান|কারা|কে|কে\s*কে|কোন|কোন\s*কোন|তালিকা|লিস্ট|সবাই|দেয়নি|দেয়নি|দেয়\s*নাই|দেয়\s*নাই|অগ্রিম|জমা|রয়েছে|আছে|এটা|একাউন্ট|অ্যাকাউন্ট|নম্বর|নাম্বার|কোথায়|কার|কাদের)/g,"").trim();if(!p||p.length<2||/^(?:কারা|কে|কে\s*কে|কোন|কোন\s*কোন|তালিকা|লিস্ট|সবাই|দেয়নি|দেয়নি|দেয়\s*নাই|দেয়\s*নাই|এটা|কার|কাদের)$/i.test(p)||/^[০-৯0-9,.\s]+$/.test(p))return{spoken:"জি স্যার, নির্দিষ্ট কোনো কাস্টমারের বকেয়া জানতে কাস্টমারের নাম বলুন, অথবা নির্দিষ্ট কোনো অংকের হিসাব জানতে চান কি?",data:null};const S=await this.executeToolCall("get_customer_due",{query:p||e});if(S.authRequired)return{spoken:'জি স্যার, মা মোটরসের কাস্টমার বকেয়া ও লাইভ হিসাব দেখতে প্রথমে উপরের "গুগল লগইন" বাটনে চাপ দিয়ে আপনার অনুমোদিত একাউন্টে সাইন ইন করে নিন।',data:{authRequired:!0}};if(S.isDisambiguation)return{spoken:S.spoken,data:S.data};if(S.found){const C=S.address?` (${S.address})`:"";return{spoken:`জি স্যার, আমি চেক করেছি। ${S.name}${C}-এর বর্তমান অবশিষ্ট বকেয়া হলো ${S.totalDue.toLocaleString("bn-BD")} টাকা।`,data:S}}else return{spoken:`জি স্যার, "${p||e}" নামে কোনো কাস্টমার বা দোকান মা মোটরসের ডেটাবেজে খুঁজে পাওয়া যায়নি। কাস্টমারের নাম, দোকান বা এলাকা একটু স্পষ্ট করে বললে আমি সাথে সাথে সঠিক হিসাবটি বের করে দেবো।`,data:null}}if(e.includes("ক্যাশ")||e.includes("ব্যাংক")||e.includes("টাকা জমা")||e.includes("কালেকশন")){const p=await this.executeToolCall("get_cash_and_bank_status",{detail:"summary"});if(p?.authRequired)return{spoken:"জি স্যার, ক্যাশ ও ব্যাংকের লাইভ হিসাব দেখতে মা মোটরসের অনুমোদিত একাউন্টে সাইন ইন করে নিন।",data:{authRequired:!0}};if(p&&p.success)return{spoken:`জি স্যার! বর্তমানে আমাদের ক্যাশ ইন হ্যান্ড রয়েছে ${p.totalPhysicalCash.toLocaleString("bn-BD")} টাকা এবং ব্যাংকে মোট ব্যালেন্স রয়েছে ${p.totalBankBalance.toLocaleString("bn-BD")} টাকা। মোট ফান্ড হলো ${p.totalHoldings.toLocaleString("bn-BD")} টাকা।`,data:p}}if(e.length>=3&&!e.includes("?")&&!e.includes("কি")&&!e.includes("কেন")){const p=await this.executeToolCall("get_customer_due",{query:e});if(p?.authRequired)return{spoken:"জি স্যার, কাস্টমারের তথ্য ও বকেয়া হিসাব দেখার জন্য মা মোটরস গুগল একাউন্টে সাইন ইন করে নিন।",data:{authRequired:!0}};if(p?.isDisambiguation)return{spoken:p.spoken,data:p.data};if(p&&p.found){const S=p.address?` (${p.address})`:"";return{spoken:`জি স্যার, ${p.name}${S}-এর বর্তমান অবশিষ্ট বকেয়া হলো ${p.totalDue.toLocaleString("bn-BD")} টাকা।`,data:p}}}if(t&&n){let p="গুগল এআই সার্ভার এই মুহূর্তে কিছুটা ব্যস্ত রয়েছে।";return n.includes("quota")||n.includes("limit")||n.includes("429")?p="গুগলের ফ্রি এআই কোটা সাময়িকভাবে বিরতিতে আছে।":(n.includes("API key")||n.includes("INVALID_ARGUMENT"))&&(p="এআই কী-টি সঠিক নয় বলে মনে হচ্ছে।"),{spoken:`জি স্যার, ${p} তবে মা মোটরসের কাস্টমার বকেয়া, মেমো বা ক্যাশ রিপোর্ট দেখতে আমি সম্পূর্ণ প্রস্তুত আছি। বলুন কার হিসাব দেখবেন?`,data:null}}return{spoken:"জি স্যার, আমি আপনার কথা শুনেছি। আপনি মা মোটরসের যেকোনো কাস্টমারের বকেয়া, ক্যাশ বা ব্যাংকের হিসাব সরাসরি জানতে পারেন। বলুন কীভাবে সাহায্য করবো?",data:null}}}const vn=new Sb;class kb{constructor(){this.synth=typeof window<"u"?window.speechSynthesis:null,this.isSpeaking=!1,this.onStartCallback=()=>{},this.onEndCallback=()=>{},this.selectedNativeBnVoice=null,this.isUnlocked=!1,this.currentEmotion="neutral";const e=typeof window<"u"?localStorage.getItem("jarvis_voice_engine"):null,t=typeof window<"u"&&!!(localStorage.getItem("jarvis_openai_key")||"").trim(),n=typeof window<"u"&&!!(localStorage.getItem("jarvis_elevenlabs_key")||"").trim(),r=typeof window<"u"&&!!(localStorage.getItem("jarvis_gcp_tts_key")||"").trim();e?this.activeEngine=e:t?this.activeEngine="openai":n?this.activeEngine="elevenlabs":r?this.activeEngine="gcp":this.activeEngine="free-bengali",this.selectedOpenAIVoice=typeof window<"u"&&localStorage.getItem("jarvis_openai_voice")||"onyx",this.selectedAzureVoice=typeof window<"u"&&localStorage.getItem("jarvis_azure_voice")||"bn-BD-PradeepNeural",this.selectedElevenLabsVoice=typeof window<"u"&&localStorage.getItem("jarvis_elevenlabs_voice_id")||"",this.currentAudio=null,typeof window<"u"&&(this.audio=document.getElementById("jarvis-persistent-audio")||new Audio,this.audio.preload="auto",this.setupUnlockListeners()),this.initNativeBnVoice()}setEngine(e){this.activeEngine=e,typeof window<"u"&&localStorage.setItem("jarvis_voice_engine",e)}setEmotion(e){this.currentEmotion=e||"neutral"}setOpenAIVoice(e){this.selectedOpenAIVoice=e,typeof window<"u"&&localStorage.setItem("jarvis_openai_voice",e)}setAzureVoice(e){this.selectedAzureVoice=e,typeof window<"u"&&localStorage.setItem("jarvis_azure_voice",e)}setElevenLabsVoice(e){this.selectedElevenLabsVoice=e,typeof window<"u"&&localStorage.setItem("jarvis_elevenlabs_voice_id",e)}setupUnlockListeners(){const e=async()=>{await this.unlockAudio()};["click","touchstart","keydown","mousedown","pointerdown"].forEach(t=>{window.addEventListener(t,e,{passive:!0,once:!1})})}async unlockAudio(){if(!this.isUnlocked)try{const e=window.AudioContext||window.webkitAudioContext;if(e&&(this.audioCtx||(this.audioCtx=new e),this.audioCtx.state==="suspended"&&await this.audioCtx.resume()),!this.audio&&typeof window<"u"&&(this.audio=document.getElementById("jarvis-persistent-audio")||new Audio),this.audio){this.audio.src="data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";const t=this.audio.play();t!==void 0&&await t}this.isUnlocked=!0}catch{}}initNativeBnVoice(){if(!this.synth)return;const e=()=>{this.getNativeBnVoice(),this.selectedNativeBnVoice&&console.log(`[VoiceSpeaker] 🎙️ Discovered Native Voice: "${this.selectedNativeBnVoice.name}" (${this.selectedNativeBnVoice.lang})`)};e(),this.synth.onvoiceschanged!==void 0&&(this.synth.onvoiceschanged=e)}getNativeBnVoice(){if(!this.synth)return null;const e=this.synth.getVoices()||[];if(e.length===0)return this.selectedNativeBnVoice||null;const t=(this.selectedAzureVoice||"").toLowerCase();let n=null;t.includes("nabanita")?n=e.find(i=>i.name.includes("Nabanita")&&(i.name.includes("Natural")||i.name.includes("Online")))||e.find(i=>i.name.includes("Nabanita")):t.includes("pradeep")&&(n=e.find(i=>i.name.includes("Pradeep")&&(i.name.includes("Natural")||i.name.includes("Online")))||e.find(i=>i.name.includes("Pradeep")));const r=n||e.find(i=>(i.name.includes("Pradeep")||i.name.includes("Nabanita")||i.name.includes("Bashkar")||i.name.includes("Nabaneeta"))&&(i.name.includes("Natural")||i.name.includes("Online")))||e.find(i=>(i.name.includes("Natural")||i.name.includes("Online"))&&(i.lang.startsWith("bn")||i.name.includes("Bengali")||i.name.includes("Bangla")))||e.find(i=>i.name.includes("Pradeep")||i.name.includes("Nabanita")||i.name.includes("Bashkar")||i.name.includes("Nabaneeta"))||e.find(i=>i.lang==="bn-BD")||e.find(i=>i.lang==="bn-IN")||e.find(i=>i.name.includes("Google")&&(i.lang.startsWith("bn")||i.name.includes("Bengali")||i.name.includes("Bangla")))||e.find(i=>i.lang.startsWith("bn"))||e.find(i=>i.name.toLowerCase().includes("bangla")||i.name.toLowerCase().includes("bengali"))||null;return this.selectedNativeBnVoice=r||null,this.selectedNativeBnVoice}async speak(e,t=null){if(!e)return;this.stop();const n=t||this.currentEmotion,r=String(e).replace(/\*\*(.*?)\*\*/g,"$1").replace(/\*(.*?)\*/g,"$1").replace(/#{1,6}\s/g,"").replace(/[`_]/g,"").replace(/৳/g,"টাকা").replace(/AED/g,"দিরহাম").replace(/(?:মোহাম্মদ\s+)?(?:আম্বরান|আমরান)(?:\s*ভাই(?:য়া)?)?/gi,"স্যার").replace(/\bভাইয়া\b/g,"স্যার").replace(/https?:\/\/[^\s]+/g,"").replace(/\s+/g," ").trim();if(!r)return;this.isSpeaking&&this.stop(),this.isSpeaking=!0,this.onStartCallback(r);const i=typeof window<"u"?(localStorage.getItem("jarvis_openai_key")||"").trim():"",a=typeof window<"u"?(localStorage.getItem("jarvis_elevenlabs_key")||"").trim():"",c=typeof window<"u"?(localStorage.getItem("jarvis_gcp_tts_key")||"").trim():"",l=typeof window<"u"?(localStorage.getItem("jarvis_azure_key")||"").trim():"",d=typeof window<"u"?(localStorage.getItem("jarvis_azure_region")||"eastus").trim():"eastus";let f=!1;try{if(l)try{console.log("[VoiceSpeaker] 🎙️ Speaking with Microsoft Azure Speech Neural API..."),await this.speakAzureNeural(r,l,d,n);return}catch(T){console.warn("[VoiceSpeaker] Azure Neural API failed, falling back:",T.message)}const m=this.getNativeBnVoice();if(m&&(m.name.includes("Natural")||m.name.includes("Online")||m.name.includes("Bashkar")||m.name.includes("Pradeep")||m.name.includes("Nabanita")||m.name.includes("Google"))){f=!0;try{console.log(`[VoiceSpeaker] 🎙️ Speaking with Microsoft Natural Voice: ${m.name}`),await this.speakBrowser(r,n);return}catch(T){console.warn("[VoiceSpeaker] Microsoft Natural voice playback failed, falling back:",T.message)}}if(a)try{await this.speakElevenLabs(r,a,n);return}catch(T){console.warn("[VoiceSpeaker] ElevenLabs TTS failed, falling back to next engine:",T.message)}if(i&&this.activeEngine==="openai")try{await this.speakOpenAI(r,i,n);return}catch(T){console.warn("[VoiceSpeaker] OpenAI TTS failed, falling back:",T.message)}if(c)try{await this.speakGoogleCloudTTS(r,c,n);return}catch(T){console.warn("[VoiceSpeaker] GCP TTS failed, falling back:",T.message)}if(this.synth&&!f){f=!0;try{console.log(`[VoiceSpeaker] 🎙️ Speaking with Browser SpeechSynthesis (${m?m.name:"bn-BD"})...`),await this.speakBrowser(r,n);return}catch(T){console.warn("[VoiceSpeaker] Browser SpeechSynthesis failed, falling back to online stream:",T.message)}}try{await this.speakFreeBengaliTTS(r);return}catch(T){console.warn("[VoiceSpeaker] Free Bengali stream TTS failed:",T.message)}}catch(m){console.error("[VoiceSpeaker] Fatal speech error:",m)}finally{this.isSpeaking=!1,this.onEndCallback()}}async speakAzureNeural(e,t,n="eastus",r="neutral"){const a=`<speak version='1.0' xml:lang='bn-BD'><voice xml:lang='bn-BD' name='${this.selectedAzureVoice||"bn-BD-BashkarNeural"}'>${e}</voice></speak>`,c=await fetch(`https://${n}.tts.speech.microsoft.com/cognitiveservices/v1`,{method:"POST",headers:{"Ocp-Apim-Subscription-Key":t,"Content-Type":"application/ssml+xml","X-Microsoft-OutputFormat":"audio-16khz-128kbitrate-mono-mp3"},body:a});if(!c.ok)throw new Error(`Azure Speech API HTTP ${c.status}`);const l=await c.blob();return await this._playBlob(l)}async speakOpenAI(e,t,n){const i={urgent:1.15,happy:1.05,sad:.9,serious:.95,neutral:1}[n]||1,a=await fetch("https://api.openai.com/v1/audio/speech",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify({model:"tts-1-hd",input:e,voice:this.selectedOpenAIVoice||"onyx",response_format:"mp3",speed:i})});if(!a.ok){const l=await a.json().catch(()=>({}));throw new Error(l.error?.message||`OpenAI TTS Error: ${a.status}`)}const c=await a.blob();return await this._playBlob(c)}async speakElevenLabs(e,t,n){const r=(this.selectedElevenLabsVoice||"").trim()||"pNInz6obpgDQGcFmaJgB",i={urgent:{stability:.35,similarity_boost:.8,style:.5},happy:{stability:.45,similarity_boost:.75,style:.6},sad:{stability:.75,similarity_boost:.85,style:.2},serious:{stability:.65,similarity_boost:.8,style:.3},neutral:{stability:.5,similarity_boost:.75,style:.3}},a=i[n]||i.neutral;console.log(`[VoiceSpeaker] 🎙️ ElevenLabs TTS calling with voice: ${r}`);const c=["eleven_multilingual_v2","eleven_flash_v2_5"];let l=null;for(const d of c)try{const f=await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${r}`,{method:"POST",headers:{"Content-Type":"application/json","xi-api-key":t},body:JSON.stringify({text:e,model_id:d,voice_settings:a})});if(!f.ok){const T=(await f.json().catch(()=>({}))).detail?.message||`HTTP ${f.status}`;if(console.warn(`[VoiceSpeaker] ElevenLabs ${d} error:`,T),l=new Error(T),f.status===401||f.status===402||f.status===429)throw l;continue}const m=await f.blob();return console.log(`[VoiceSpeaker] ✅ ElevenLabs speech generated (${m.size} bytes), playing audio...`),await this._playBlob(m)}catch(f){if(l=f,f.message&&(f.message.includes("401")||f.message.includes("402")||f.message.includes("quota")||f.message.includes("credit")))throw f}throw l||new Error("ElevenLabs TTS failed")}async speakGoogleCloudTTS(e,t,n){const r={urgent:{speakingRate:1.15,pitch:1},happy:{speakingRate:1.08,pitch:2},sad:{speakingRate:.88,pitch:-2},serious:{speakingRate:.92,pitch:-1.5},neutral:{speakingRate:1.02,pitch:-1}},i=r[n]||r.neutral,a=typeof window<"u"&&localStorage.getItem("jarvis_gcp_voice")||"bn-BD-Neural2-B",c=await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({input:{text:e},voice:{languageCode:"bn-BD",name:a,ssmlGender:a.includes("B")?"MALE":"FEMALE"},audioConfig:{audioEncoding:"MP3",speakingRate:i.speakingRate,pitch:i.pitch,effectsProfileId:["headphone-class-device"]}})});if(!c.ok){const _=await c.json().catch(()=>({}));throw new Error(_.error?.message||`GCP TTS Error: ${c.status}`)}const l=await c.json();if(!l.audioContent)throw new Error("GCP TTS returned empty audioContent");const d=atob(l.audioContent),f=new Uint8Array(d.length);for(let _=0;_<d.length;_++)f[_]=d.charCodeAt(_);const m=new Blob([f],{type:"audio/mp3"});return await this._playBlob(m)}async speakBrowser(e,t){if(!this.synth)throw new Error("SpeechSynthesis not supported");const n=this.getNativeBnVoice();try{this.synth.cancel()}catch(c){console.warn("[VoiceSpeaker] Synth cancel non-critical:",c)}const r={urgent:{rate:1.15,pitch:1.1},happy:{rate:1.05,pitch:1.15},sad:{rate:.88,pitch:.88},serious:{rate:.92,pitch:.92},neutral:{rate:.98,pitch:1}},i=r[t]||r.neutral,a=this.splitIntoSentences(e);for(const c of a){if(!this.isSpeaking)break;await new Promise((l,d)=>{const f=new SpeechSynthesisUtterance(c);n?(f.voice=n,f.lang=n.lang||"bn-BD"):f.lang="bn-BD",f.rate=i.rate,f.pitch=i.pitch,f.volume=1;let m=null;const _=setTimeout(()=>{m&&clearInterval(m),l()},15e3);f.onend=()=>{m&&clearInterval(m),clearTimeout(_),l()},f.onerror=T=>{m&&clearInterval(m),clearTimeout(_),console.warn("[VoiceSpeaker] Browser utterance error:",T?.error||T),l()},this.synth.speak(f),m=setInterval(()=>{if(!this.synth.speaking){clearInterval(m);return}this.synth.pause(),this.synth.resume()},1e4)})}}async speakFreeBengaliTTS(e){console.log("[VoiceSpeaker] 🌐 Speaking with High-Quality Free Bengali Stream TTS...");const t=this.splitIntoSentences(e);for(const n of t){if(!this.isSpeaking)break;const r=n.slice(0,150).trim();if(!r)continue;const i=[`https://translate.googleapis.com/translate_tts?client=gtx&sl=auto&tl=bn&ie=UTF-8&q=${encodeURIComponent(r)}`,`https://translate.google.com/translate_tts?ie=UTF-8&tl=bn&client=tw-ob&q=${encodeURIComponent(r)}`,`https://translate.google.com/translate_tts?ie=UTF-8&tl=bn&client=dict-chrome-ex&q=${encodeURIComponent(r)}`];let a=!1;for(const c of i){if(!this.isSpeaking)break;try{await this._playAudioUrl(c),a=!0;break}catch(l){console.warn(`[VoiceSpeaker] Stream mirror failed (${c.slice(0,42)}...):`,l.message)}}a||console.warn("[VoiceSpeaker] All free stream mirrors failed for sentence:",r)}}async _playAudioUrl(e){return await this.unlockAudio(),new Promise((t,n)=>{let r=null;typeof document<"u"&&(r=document.getElementById("jarvis-persistent-audio")),r||(r=this.audio||new Audio),this.currentAudio=r,r.referrerPolicy="no-referrer",r.setAttribute("referrerpolicy","no-referrer"),r.preload="auto",r.volume=1,r.muted=!1;let i=!1,a=null;const c=()=>{a&&clearTimeout(a),r.onended=null,r.onerror=null},l=()=>{i||(i=!0,c(),this.currentAudio===r&&(this.currentAudio=null),t())},d=m=>{i||(i=!0,c(),this.currentAudio===r&&(this.currentAudio=null),n(m))};a=setTimeout(()=>{l()},25e3),r.onended=l,r.onerror=m=>{d(new Error(`Audio URL failed: ${m?.message||"media-load-error"}`))},r.src=e;const f=r.play();f!==void 0&&f.catch(m=>{console.warn("[VoiceSpeaker] audio.play() rejected:",m.name,m.message),d(m)})})}async _playBlob(e){const t=URL.createObjectURL(e);try{await this._playAudioUrl(t)}finally{URL.revokeObjectURL(t)}}splitIntoSentences(e){const t=e.split(/([।?!.]+[\s\n]*)/),n=[];let r="";for(let i=0;i<t.length;i++)if(r+=t[i],t[i].match(/[।?!.]/)||r.length>=150){const a=r.trim();a&&n.push(a),r=""}return r.trim()&&n.push(r.trim()),n.filter(i=>i.length>0&&!i.match(/^[।?!,\s]+$/))}stop(){if(this.isSpeaking=!1,this.currentAudio){try{this.currentAudio.pause(),this.currentAudio.currentTime=0}catch(e){console.warn("[VoiceSpeaker] Stop current audio non-critical:",e)}this.currentAudio=null}if(this.audio)try{this.audio.pause(),this.audio.currentTime=0,this.audio.onended=null,this.audio.onerror=null}catch(e){console.warn("[VoiceSpeaker] Stop audio non-critical:",e)}if(this.synth)try{this.synth.cancel()}catch(e){console.warn("[VoiceSpeaker] Stop synth non-critical:",e)}}getActiveEngineLabel(){const e=typeof window<"u"?(localStorage.getItem("jarvis_openai_key")||"").trim():"",t=typeof window<"u"?(localStorage.getItem("jarvis_elevenlabs_key")||"").trim():"",n=typeof window<"u"?(localStorage.getItem("jarvis_gcp_tts_key")||"").trim():"";return e&&this.activeEngine==="openai"?"ChatGPT Voice":t?"ElevenLabs Neural":n?"Google Cloud bn-BD":"Bangla HD Voice"}onStart(e){this.onStartCallback=e}onEnd(e){this.onEndCallback=e}}const G=new kb;class Ab{constructor(){this.isProcessing=!1,this.conversationHistory=[],this.listeners=[],this.lastCommandText="",this.lastCommandTime=0}async processCommand(e){const t=(e||"").trim();if(!t)return null;if(this.isProcessing)return console.warn(`[JarvisBrain] ⚠️ Mutex busy lock: dropped concurrent trigger: "${t}"`),null;const n=Date.now();if(this.lastCommandText===t&&n-this.lastCommandTime<2500)return console.warn(`[JarvisBrain] ⚠️ Deduplication filter: dropped repeated command within 2.5s: "${t}"`),null;this.lastCommandText=t,this.lastCommandTime=n,this.isProcessing=!0,this.addHistory("user",t);try{const r=await vn.chat(this.conversationHistory,t);if(r&&r.spoken)return await this.handleResponse(r.spoken,r.data),r;const i="জি স্যার, আমি আপনার কথা শুনেছি। আপনার মা মোটরসের কাস্টমার বকেয়া বা ক্যাশ হিসাবের কোনো তথ্য প্রয়োজন হলে বলুন।";return await this.handleResponse(i),{spoken:i}}catch(r){console.error("[JarvisBrain] Processing error:",r);const i="দুঃখিত স্যার, এই মুহূর্তে কমান্ডটি প্রসেস করতে একটি সাময়িক সমস্যা হয়েছে। আপনি কি আবার বলবেন?";return await this.handleResponse(i),{spoken:i}}finally{this.isProcessing=!1}}async handleResponse(e,t=null){this.addHistory("jarvis",e,t),await G.speak(e)}addHistory(e,t,n=null){const r={id:"msg_"+Date.now(),sender:e,text:t,data:n,time:new Date().toLocaleTimeString("bn-BD",{hour:"2-digit",minute:"2-digit"})};this.conversationHistory.push(r),this.notifyListeners(r)}onMessage(e){this.listeners.push(e)}notifyListeners(e){this.listeners.forEach(t=>{try{t(e,this.conversationHistory)}catch(n){console.error("[JarvisBrain] Listener error:",n)}})}}const js=new Ab;class Rb{constructor(){this.callbacks={onStart:()=>{},onEnd:()=>{},onInterim:()=>{},onFinal:()=>{},onError:()=>{}},this.isListening=!1,this.mode="auto",this.recognition=null,this.mediaRecorder=null,this.audioChunks=[],this.mediaStream=null,this.silenceTimer=null,this.whisperMode=!1,this.accumulatedFinalText="",this.currentInterimText="",this.vadSilenceTimer=null,this.VAD_SILENCE_DELAY_MS=1300,this.isFinalizing=!1,this._detectMode(),this._initWebSpeech()}_detectMode(){const e=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent),t=!!(window.SpeechRecognition||window.webkitSpeechRecognition),n=!!(localStorage.getItem("jarvis_groq_key")||localStorage.getItem("jarvis_groq_keys")||"").trim(),r=!!(localStorage.getItem("jarvis_openai_key")||"").trim(),i=!!(localStorage.getItem("jarvis_gemini_key")||"").trim();e&&(n||r||i)?this.whisperMode=!0:t?this.whisperMode=!1:this.whisperMode=!0,console.log(`[VoiceListener] Mode: ${this.whisperMode?"Whisper (Groq/OpenAI MediaRecorder)":"Web Speech API"}`)}_initWebSpeech(){if(this.whisperMode)return;const e=window.SpeechRecognition||window.webkitSpeechRecognition;if(!e){this.whisperMode=!0;return}this.recognition=new e,this.recognition.lang="bn-BD",this.recognition.continuous=!0,this.recognition.interimResults=!0,this.recognition.maxAlternatives=3,this.recognition.onstart=()=>{this.isListening=!0,this.accumulatedFinalText="",this.currentInterimText="",this.isFinalizing=!1,this.callbacks.onStart()},this.recognition.onend=()=>{this.isListening=!1,clearTimeout(this.vadSilenceTimer),this._finalizeSpeech(!0),this.callbacks.onEnd()},this.recognition.onerror=t=>{if(t.error==="no-speech"||t.error==="aborted")return;console.warn("[VoiceListener] Web Speech error:",t.error);const n=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent),r=!!(localStorage.getItem("jarvis_groq_key")||localStorage.getItem("jarvis_groq_keys")||localStorage.getItem("jarvis_openai_key")||"").trim();n&&r&&["not-allowed","service-not-allowed","network"].includes(t.error)&&(this.whisperMode=!0,console.log("[VoiceListener] Switched to Whisper mode on mobile error.")),this.isListening=!1,clearTimeout(this.vadSilenceTimer),this.callbacks.onError(t.error)},this.recognition.onresult=t=>{let n="";for(let i=t.resultIndex;i<t.results.length;i++){const a=t.results[i][0].transcript;t.results[i].isFinal?this.accumulatedFinalText=(this.accumulatedFinalText+" "+a).trim():n+=a}this.currentInterimText=n;const r=(this.accumulatedFinalText+" "+n).trim();r&&this.callbacks.onInterim(r),clearTimeout(this.vadSilenceTimer),this.vadSilenceTimer=setTimeout(()=>{this._finalizeSpeech()},this.VAD_SILENCE_DELAY_MS)}}_finalizeSpeech(e=!1){clearTimeout(this.vadSilenceTimer),this.vadSilenceTimer=null;const t=(this.accumulatedFinalText+" "+this.currentInterimText).trim();if(!(!t||this.isFinalizing)){if(this.isFinalizing=!0,this.accumulatedFinalText="",this.currentInterimText="",console.log(`[VoiceListener] 🎯 Speech finalized (${e?"onend":"1.3s VAD silence"}): "${t}"`),!e&&this.isListening)try{this.stop()}catch(n){console.warn("[VoiceListener] Stop on finalize non-critical:",n)}this.callbacks.onFinal(t),setTimeout(()=>{this.isFinalizing=!1},600)}}async start(){return this.isListening?!1:this.whisperMode?await this._startWhisperMode():this._startWebSpeech()}_startWebSpeech(){if(!this.recognition)return!1;try{return this.recognition.start(),!0}catch(e){console.warn("[VoiceListener] Web Speech start error:",e);const t=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent),n=!!(localStorage.getItem("jarvis_groq_key")||localStorage.getItem("jarvis_groq_keys")||localStorage.getItem("jarvis_openai_key")||"").trim();return t&&n&&(this.whisperMode=!0),!1}}async _startWhisperMode(){try{this.mediaStream=await navigator.mediaDevices.getUserMedia({audio:{channelCount:1,sampleRate:16e3,echoCancellation:!0,noiseSuppression:!0,autoGainControl:!0}}),this.audioChunks=[];const e=this._getBestMimeType();return this.mediaRecorder=new MediaRecorder(this.mediaStream,{mimeType:e}),this.mediaRecorder.ondataavailable=t=>{t.data&&t.data.size>0&&this.audioChunks.push(t.data)},this.mediaRecorder.onstart=()=>{this.isListening=!0,this.callbacks.onStart()},this.mediaRecorder.onstop=async()=>{this.isListening=!1,this._cleanupMediaStream(),await this._sendToWhisper(),this.callbacks.onEnd()},this.mediaRecorder.onerror=t=>{console.error("[VoiceListener] MediaRecorder error:",t),this.isListening=!1,this._cleanupMediaStream(),this.callbacks.onError("media-recorder-error"),this.callbacks.onEnd()},this.mediaRecorder.start(100),!0}catch(e){return console.error("[VoiceListener] Mic access error:",e),this.callbacks.onError("mic-access-denied"),!1}}stop(){if(clearTimeout(this.vadSilenceTimer),this.vadSilenceTimer=null,!this.whisperMode&&(this.accumulatedFinalText||this.currentInterimText)&&!this.isFinalizing){this._finalizeSpeech();return}if(this.isListening){if(this.whisperMode)this.mediaRecorder&&this.mediaRecorder.state!=="inactive"&&this.mediaRecorder.stop();else if(this.recognition)try{this.recognition.stop()}catch(e){console.warn("[VoiceListener] Stop error:",e)}}}toggle(){this.isListening?this.stop():this.start()}async _sendToWhisper(){if(this.audioChunks.length===0){console.warn("[VoiceListener] No audio chunks to send.");return}const t=(localStorage.getItem("jarvis_groq_key")||localStorage.getItem("jarvis_groq_keys")||"").trim().split(/[\n,;]+/).map(r=>r.trim()).filter(Boolean)[0]||"",n=(localStorage.getItem("jarvis_openai_key")||"").trim();if(!t&&!n){console.warn("[VoiceListener] No Groq or OpenAI key for Whisper transcription."),this.callbacks.onFinal("");return}try{const r=this._getBestMimeType(),i=new Blob(this.audioChunks,{type:r});if(i.size<8e3){console.log("[VoiceListener] Audio too short, skipping Whisper.");return}const a=!!t,c=a?"https://api.groq.com/openai/v1/audio/transcriptions":"https://api.openai.com/v1/audio/transcriptions",l=a?t:n,d=a?"whisper-large-v3":"whisper-1",f=new FormData;f.append("file",i,`audio.${this._getExtension(r)}`),f.append("model",d),f.append("language","bn"),f.append("prompt","মা মোটরস, বকেয়া, কাস্টমার, টাকা, AED, দিরহাম, ক্যাশ, ব্যাংক, ব্যালেন্স, মেমো, চালান, পেমেন্ট, করিম, রহিম, জমা, দুবাই, কন্টেইনার"),console.log(`[VoiceListener] Transcribing via ${a?"Groq Whisper Large v3 (Free Ultra-Fast)":"OpenAI Whisper"}...`);const m=await fetch(c,{method:"POST",headers:{Authorization:`Bearer ${l}`},body:f});if(!m.ok){const R=await m.json().catch(()=>({}));throw new Error(R.error?.message||`Whisper API error: ${m.status}`)}const T=((await m.json()).text||"").trim();T?(console.log("[VoiceListener] Whisper transcript:",T),this.callbacks.onFinal(T)):console.log("[VoiceListener] Whisper returned empty transcript.")}catch(r){console.error("[VoiceListener] Whisper transcription error:",r),this.callbacks.onError("whisper-error")}}_getBestMimeType(){return["audio/webm;codecs=opus","audio/webm","audio/ogg;codecs=opus","audio/mp4","audio/wav"].find(t=>MediaRecorder.isTypeSupported(t))||"audio/webm"}_getExtension(e){return e.includes("webm")?"webm":e.includes("ogg")?"ogg":e.includes("mp4")?"mp4":e.includes("wav")?"wav":"webm"}_cleanupMediaStream(){this.mediaStream&&(this.mediaStream.getTracks().forEach(e=>e.stop()),this.mediaStream=null)}on(e,t){this.callbacks[e]!==void 0&&(this.callbacks[e]=t)}getModeLabel(){return this.whisperMode?"Whisper AI (High Accuracy)":"Web Speech API"}}class Cb{constructor(e){this.canvas=e,this.ctx=e.getContext("2d"),this.state="idle",this.animationFrameId=null,this.angle=0,this.pulse=0,this.resize(),window.addEventListener("resize",()=>this.resize()),this.startLoop()}resize(){if(!this.canvas)return;const e=this.canvas.getBoundingClientRect();this.canvas.width=e.width*window.devicePixelRatio||300,this.canvas.height=e.height*window.devicePixelRatio||300}setState(e){this.state=e}startLoop(){const e=()=>{this.draw(),this.animationFrameId=requestAnimationFrame(e)};e()}draw(){const{width:e,height:t}=this.canvas,n=this.ctx;n.clearRect(0,0,e,t);const r=e/2,i=t/2,a=Math.min(e,t)*.28;this.angle+=.02,this.pulse+=.05;let c="#0284c7",l="rgba(14, 165, 233, 0.5)",d=1,f=1+Math.sin(this.pulse)*.05;this.state==="listening"?(c="#10b981",l="rgba(16, 185, 129, 0.6)",f=1+Math.sin(this.pulse*2)*.15,d=2):this.state==="thinking"?(c="#8b5cf6",l="rgba(139, 92, 246, 0.7)",d=4,f=1+Math.sin(this.pulse*3)*.08):this.state==="speaking"&&(c="#38bdf8",l="rgba(56, 189, 248, 0.8)",f=1+Math.sin(this.pulse*4)*.22,d=2.5);const m=n.createRadialGradient(r,i,a*.2,r,i,a*1.8*f);m.addColorStop(0,l),m.addColorStop(.5,l.replace(/[\d.]+\)$/,"0.2)")),m.addColorStop(1,"rgba(0,0,0,0)"),n.fillStyle=m,n.beginPath(),n.arc(r,i,a*1.8*f,0,Math.PI*2),n.fill(),n.save(),n.translate(r,i),n.save(),n.rotate(this.angle*d),n.strokeStyle=c,n.lineWidth=2.5*window.devicePixelRatio,n.shadowColor=c,n.shadowBlur=10,n.beginPath(),n.arc(0,0,a*1.2*f,0,Math.PI*.8),n.stroke(),n.beginPath(),n.arc(0,0,a*1.2*f,Math.PI,Math.PI*1.8),n.stroke(),n.restore(),n.save(),n.rotate(-this.angle*d*1.3),n.strokeStyle="#38bdf8",n.lineWidth=1.5*window.devicePixelRatio,n.setLineDash([8,12]),n.beginPath(),n.arc(0,0,a*1.4,0,Math.PI*2),n.stroke(),n.restore();const _=n.createRadialGradient(0,0,0,0,0,a*.7*f);_.addColorStop(0,"#ffffff"),_.addColorStop(.4,c),_.addColorStop(1,"rgba(15, 23, 42, 0.8)"),n.fillStyle=_,n.beginPath(),n.arc(0,0,a*.7*f,0,Math.PI*2),n.fill(),n.restore()}destroy(){this.animationFrameId&&cancelAnimationFrame(this.animationFrameId)}}class Db{constructor(){this.isEnabled=(typeof window<"u"&&localStorage.getItem("jarvis_wake_word_enabled"))!=="false",this.isRunning=!1,this.recognition=null,this.audioCtx=null,this.restartTimer=null,this.isTemporarilyPaused=!1,this.onWake=null,this.onStatusChange=null,this.wakeDebounceTimer=null,this.pendingWakeData=null,this.hasPlayedChime=!1,this.wakeWordRegex=/(?:hey\s+|hi\s+|ok\s+|hello\s+|ওহে\s+|এই\s+|শোনো\s+|হ্যালো\s+)?(jarvis|jarvice|javis|jarves|jarviz|service|সার্ভিস|সারভিস|জার্ভিস|জারভিস|যারভিস|জারবিস|জাবিস|জার্ভেস|জারভেস|জার্ভিশ|জারভিশ|ঝারভিস|জাভাস|জারভাস)(?:\s*(?:ভাই|স্যার))?(?:[\s,:?!]|$)(.*)/i,this._initRecognition(),this._initVisibilityListener()}_initVisibilityListener(){typeof document<"u"&&document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&this.isEnabled&&!this.isRunning&&!this.isTemporarilyPaused&&(console.log("[WakeWord] Tab active again, verifying wake word listener state..."),clearTimeout(this.restartTimer),this.restartTimer=setTimeout(()=>{this._safeStart()},400))})}_initRecognition(){if(typeof window>"u")return;const e=window.SpeechRecognition||window.webkitSpeechRecognition;if(!e){console.warn("[WakeWord] SpeechRecognition not supported in this browser.");return}try{this.recognition=new e,this.recognition.continuous=!0,this.recognition.interimResults=!0,this.recognition.maxAlternatives=3,this.recognition.lang="bn-BD",this.recognition.onstart=()=>{this.isRunning=!0,this._notifyStatus(),console.log('[WakeWord] 🎙️ Passive Wake Word listener active. Say "Jarvis" or "জার্ভিস" anytime!')},this.recognition.onend=()=>{this.isRunning=!1,this._notifyStatus(),this.isEnabled&&!this.isTemporarilyPaused&&(clearTimeout(this.restartTimer),this.restartTimer=setTimeout(()=>{this._safeStart()},400))},this.recognition.onerror=t=>{t.error==="no-speech"||t.error==="aborted"||(console.warn("[WakeWord] Recognition error:",t.error),t.error==="not-allowed"&&(console.warn("[WakeWord] Microphone permission pending. Ready to resume on gesture."),this.isRunning=!1,this._notifyStatus()))},this.recognition.onresult=t=>{this._handleRecognitionResult(t)}}catch(t){console.error("[WakeWord] Initialization error:",t)}}_handleRecognitionResult(e){if(this.isTemporarilyPaused||G.isSpeaking){clearTimeout(this.wakeDebounceTimer),this.pendingWakeData=null,this.hasPlayedChime=!1;return}for(let t=e.resultIndex;t<e.results.length;t++){const n=e.results[t];for(let r=0;r<n.length;r++){const i=(n[r]?.transcript||"").trim();if(!i)continue;const a=i.match(this.wakeWordRegex);if(a){const c=(a[2]||"").trim();if(this.hasPlayedChime||(this.playWakeChime(),this.hasPlayedChime=!0),!c)(!this.pendingWakeData||!this.pendingWakeData.command)&&(this.pendingWakeData={hasCommand:!1,command:"",rawTranscript:i},clearTimeout(this.wakeDebounceTimer),this.wakeDebounceTimer=setTimeout(()=>{this._dispatchWake()},500));else{this.pendingWakeData={hasCommand:!0,command:c,rawTranscript:i},clearTimeout(this.wakeDebounceTimer);const l=n.isFinal?350:1200;this.wakeDebounceTimer=setTimeout(()=>{this._dispatchWake()},l)}return}}}}_dispatchWake(){clearTimeout(this.wakeDebounceTimer),this.wakeDebounceTimer=null,this.hasPlayedChime=!1;const e=this.pendingWakeData;if(this.pendingWakeData=null,!(!e||this.isTemporarilyPaused||G.isSpeaking)){console.log("[WakeWord] ⚡ Dispathing wake event:",e),this.pause(),typeof this.onWake=="function"&&this.onWake(e);try{this.recognition.abort()}catch(t){console.warn("[WakeWord] Abort error non-critical:",t)}}}async playWakeChime(){try{const e=window.AudioContext||window.webkitAudioContext;if(!e)return;this.audioCtx||(this.audioCtx=new e),this.audioCtx.state==="suspended"&&await this.audioCtx.resume();const t=this.audioCtx.currentTime,n=this.audioCtx.createOscillator(),r=this.audioCtx.createGain();n.type="sine",n.frequency.setValueAtTime(587.33,t),r.gain.setValueAtTime(.001,t),r.gain.linearRampToValueAtTime(.25,t+.03),r.gain.linearRampToValueAtTime(.001,t+.22),n.connect(r),r.connect(this.audioCtx.destination),n.start(t),n.stop(t+.22);const i=this.audioCtx.createOscillator(),a=this.audioCtx.createGain();i.type="sine",i.frequency.setValueAtTime(880,t+.1),a.gain.setValueAtTime(.001,t+.1),a.gain.linearRampToValueAtTime(.3,t+.14),a.gain.linearRampToValueAtTime(.001,t+.45),i.connect(a),a.connect(this.audioCtx.destination),i.start(t+.1),i.stop(t+.45)}catch(e){console.error("[WakeWord] Audio chime error:",e)}}start(){this.isEnabled=!0,this.isTemporarilyPaused=!1,localStorage.setItem("jarvis_wake_word_enabled","true"),this._safeStart()}_safeStart(){if(!(!this.recognition||this.isRunning||this.isTemporarilyPaused||!this.isEnabled))try{this.recognition.start()}catch(e){e.name==="InvalidStateError"?(clearTimeout(this.restartTimer),this.restartTimer=setTimeout(()=>{this._safeStart()},800)):console.warn("[WakeWord] Start error:",e)}}stop(){if(this.isEnabled=!1,this.isTemporarilyPaused=!1,clearTimeout(this.wakeDebounceTimer),this.pendingWakeData=null,this.hasPlayedChime=!1,localStorage.setItem("jarvis_wake_word_enabled","false"),clearTimeout(this.restartTimer),this.recognition)try{this.recognition.abort()}catch(e){console.warn("[WakeWord] Stop abort error:",e)}this.isRunning=!1,this._notifyStatus()}pause(){if(this.isTemporarilyPaused=!0,clearTimeout(this.wakeDebounceTimer),this.pendingWakeData=null,this.hasPlayedChime=!1,clearTimeout(this.restartTimer),this.recognition&&this.isRunning)try{this.recognition.abort()}catch(e){console.warn("[WakeWord] Pause abort error:",e)}this.isRunning=!1,this._notifyStatus()}resume(){this.isTemporarilyPaused=!1,this.isEnabled&&(clearTimeout(this.restartTimer),this.restartTimer=setTimeout(()=>{this._safeStart()},600)),this._notifyStatus()}toggle(){return this.isEnabled?this.stop():this.start(),this.isEnabled}_notifyStatus(){typeof this.onStatusChange=="function"&&this.onStatusChange(this.isEnabled,this.isRunning)}}const ae=new Db;class Pb{constructor(){typeof document>"u"||(this.modalEl=document.getElementById("ai-settings-modal"),this.openBtn=document.getElementById("open-ai-settings-btn"),this.closeBtn=document.getElementById("close-ai-settings-modal"),this.geminiTab=document.getElementById("select-provider-gemini"),this.groqTab=document.getElementById("select-provider-groq"),this.openrouterTab=document.getElementById("select-provider-openrouter"),this.openaiTab=document.getElementById("select-provider-openai"),this.geminiSection=document.getElementById("gemini-config-section"),this.groqSection=document.getElementById("groq-config-section"),this.openrouterSection=document.getElementById("openrouter-config-section"),this.openaiSection=document.getElementById("openai-config-section"),this.geminiKeyInput=document.getElementById("input-gemini-key"),this.groqKeyInput=document.getElementById("input-groq-key"),this.openrouterKeyInput=document.getElementById("input-openrouter-key"),this.openaiKeyInput=document.getElementById("input-openai-key"),this.autoFailoverToggle=document.getElementById("input-auto-failover-toggle"),this.openaiVoiceSelect=document.getElementById("select-openai-voice"),this.geminiVoiceSelect=document.getElementById("select-gemini-voice"),this.toggleGeminiKeyVis=document.getElementById("toggle-gemini-key-vis"),this.toggleGroqKeyVis=document.getElementById("toggle-groq-key-vis"),this.toggleOpenRouterKeyVis=document.getElementById("toggle-openrouter-key-vis"),this.toggleOpenAIKeyVis=document.getElementById("toggle-openai-key-vis"),this.saveTopBtn=document.getElementById("btn-save-ai-settings-top"),this.closeFooterBtn=document.getElementById("close-ai-settings-footer-btn"),this.testPingBtn=document.getElementById("btn-test-active-key"),this.pingOutputEl=document.getElementById("studio-key-test-output"),this.activeProviderBadge=document.getElementById("studio-active-provider-badge"),this.totalKeysCountBadge=document.getElementById("studio-total-keys-count"),this.activeVoiceBadge=document.getElementById("studio-active-voice-badge"),this.previewBtn=document.getElementById("btn-preview-voice"),this.saveBtn=document.getElementById("btn-save-ai-settings"),this.feedbackEl=document.getElementById("ai-settings-feedback"),this.currentProvider="gemini",this.init())}init(){if(!this.modalEl)return;this.openBtn&&this.openBtn.addEventListener("click",()=>this.open()),this.closeBtn&&this.closeBtn.addEventListener("click",()=>this.close()),this.closeFooterBtn&&this.closeFooterBtn.addEventListener("click",()=>this.close()),this.modalEl.addEventListener("click",n=>{n.target===this.modalEl&&this.close()}),this.geminiTab&&this.geminiTab.addEventListener("click",()=>this.switchProvider("gemini")),this.groqTab&&this.groqTab.addEventListener("click",()=>this.switchProvider("groq")),this.openrouterTab&&this.openrouterTab.addEventListener("click",()=>this.switchProvider("openrouter")),this.openaiTab&&this.openaiTab.addEventListener("click",()=>this.switchProvider("openai")),this._setupVisToggle(this.toggleGeminiKeyVis,this.geminiKeyInput),this._setupVisToggle(this.toggleGroqKeyVis,this.groqKeyInput),this._setupVisToggle(this.toggleOpenRouterKeyVis,this.openrouterKeyInput),this._setupVisToggle(this.toggleOpenAIKeyVis,this.openaiKeyInput),this._setupAutoPreserve(this.geminiKeyInput,"jarvis_gemini_key","jarvis_gemini_keys"),this._setupAutoPreserve(this.groqKeyInput,"jarvis_groq_key","jarvis_groq_keys"),this._setupAutoPreserve(this.openrouterKeyInput,"jarvis_openrouter_key","jarvis_openrouter_keys"),this._setupAutoPreserve(this.openaiKeyInput,"jarvis_openai_key");const e=document.getElementById("input-elevenlabs-key"),t=document.getElementById("input-elevenlabs-voice-id");if(e){const n=()=>{const r=(e.value||"").trim();r&&(localStorage.setItem("jarvis_elevenlabs_key",r),G.setEngine("elevenlabs"),this.updateDiagnosticBadges())};e.addEventListener("change",n),e.addEventListener("input",n)}if(t){const n=()=>{const r=(t.value||"").trim();r&&(localStorage.setItem("jarvis_elevenlabs_voice_id",r),G.setElevenLabsVoice(r))};t.addEventListener("change",n),t.addEventListener("input",n)}this.previewBtn&&this.previewBtn.addEventListener("click",()=>this.testCurrentVoice()),this.saveBtn&&this.saveBtn.addEventListener("click",()=>this.saveSettings()),this.saveTopBtn&&this.saveTopBtn.addEventListener("click",()=>this.saveSettings()),this.testPingBtn&&this.testPingBtn.addEventListener("click",()=>this.testActiveKeyPing()),this.geminiVoiceSelect&&this.geminiVoiceSelect.addEventListener("change",()=>this.updateDiagnosticBadges()),this.openaiVoiceSelect&&this.openaiVoiceSelect.addEventListener("change",()=>this.updateDiagnosticBadges()),this.geminiKeyInput&&this.geminiKeyInput.addEventListener("input",()=>this.updateDiagnosticBadges()),this.groqKeyInput&&this.groqKeyInput.addEventListener("input",()=>this.updateDiagnosticBadges()),this.openrouterKeyInput&&this.openrouterKeyInput.addEventListener("input",()=>this.updateDiagnosticBadges()),this.openaiKeyInput&&this.openaiKeyInput.addEventListener("input",()=>this.updateDiagnosticBadges()),this.loadSettings()}_setupVisToggle(e,t){!e||!t||e.addEventListener("click",()=>{const n=t.type==="password";t.type=n?"text":"password"})}_setupAutoPreserve(e,t,n=null){if(!e)return;const r=()=>{const i=(e.value||"").trim();i&&(localStorage.setItem(t,i),n&&localStorage.setItem(n,i))};e.addEventListener("change",r),e.addEventListener("input",r)}open(){this.loadSettings(),this.modalEl.classList.remove("hidden")}close(){this.modalEl.classList.add("hidden"),this.feedbackEl&&this.feedbackEl.classList.add("hidden")}switchProvider(e){this.currentProvider=e,[{id:"gemini",tab:this.geminiTab,sec:this.geminiSection},{id:"groq",tab:this.groqTab,sec:this.groqSection},{id:"openrouter",tab:this.openrouterTab,sec:this.openrouterSection},{id:"openai",tab:this.openaiTab,sec:this.openaiSection}].forEach(n=>{n.id===e?(n.tab?.classList.add("active"),n.sec?.classList.remove("hidden")):(n.tab?.classList.remove("active"),n.sec?.classList.add("hidden"))}),this.updateDiagnosticBadges()}loadSettings(){const e=localStorage.getItem("jarvis_gemini_key")||localStorage.getItem("jarvis_gemini_keys")||"",t=localStorage.getItem("jarvis_groq_key")||localStorage.getItem("jarvis_groq_keys")||"",n=localStorage.getItem("jarvis_openrouter_key")||localStorage.getItem("jarvis_openrouter_keys")||"",r=localStorage.getItem("jarvis_openai_key")||"",i=localStorage.getItem("jarvis_elevenlabs_key")||"",a=localStorage.getItem("jarvis_gcp_tts_key")||"",c=localStorage.getItem("jarvis_openai_voice")||"onyx",l=localStorage.getItem("jarvis_azure_voice")||"bn-BD-PradeepNeural",d=localStorage.getItem("jarvis_elevenlabs_voice_id")||"",f=localStorage.getItem("jarvis_auto_failover")!=="false";let m=localStorage.getItem("jarvis_ai_provider")||"gemini";!e&&t?m="groq":!e&&!t&&n?m="openrouter":!e&&!t&&!n&&r&&(m="openai"),this.switchProvider(m),this.geminiKeyInput&&(this.geminiKeyInput.value=e),this.groqKeyInput&&(this.groqKeyInput.value=t),this.openrouterKeyInput&&(this.openrouterKeyInput.value=n),this.openaiKeyInput&&(this.openaiKeyInput.value=r),this.autoFailoverToggle&&(this.autoFailoverToggle.checked=f),this.openaiVoiceSelect&&(this.openaiVoiceSelect.value=c),this.geminiVoiceSelect&&(this.geminiVoiceSelect.value=l);const _=document.getElementById("input-elevenlabs-key");_&&(_.value=i);const T=document.getElementById("input-elevenlabs-voice-id");T&&(T.value=d);const R=document.getElementById("input-gcp-tts-key");R&&(R.value=a),this.updateDiagnosticBadges()}async testCurrentVoice(){await G.unlockAudio();const e=document.getElementById("input-elevenlabs-key"),t=document.getElementById("input-elevenlabs-voice-id"),n=(this.openaiKeyInput?.value||"").trim(),r=(this.geminiKeyInput?.value||"").trim(),i=(e?.value||"").trim(),a=(t?.value||"").trim();if(i&&(localStorage.setItem("jarvis_elevenlabs_key",i),G.setElevenLabsVoice(a),G.setEngine("elevenlabs")),r&&localStorage.setItem("jarvis_gemini_key",r),n&&localStorage.setItem("jarvis_openai_key",n),this.currentProvider==="openai"){const l=this.openaiVoiceSelect?.value||"onyx";G.setOpenAIVoice(l),G.setEngine("openai")}else{const l=this.geminiVoiceSelect?.value||"bn-BD-PradeepNeural";G.setAzureVoice(l),i?G.setEngine("elevenlabs"):G.setEngine("free-bengali")}try{window.wakeWordListener&&typeof window.wakeWordListener.playWakeChime=="function"&&await window.wakeWordListener.playWakeChime()}catch(l){console.warn("[AISettingsModal] Chime error:",l)}const c="আসসালামু আলাইকুম স্যার! আমি জার্ভিস। আপনার মা মোটরসের যাবতীয় হিসাব দেখতে আমি সম্পূর্ণ প্রস্তুত আছি।";if(this.previewBtn){const l=this.previewBtn.innerHTML;this.previewBtn.innerHTML="<span>🔊 প্লে হচ্ছে...</span>";try{await G.speak(c)}catch(d){console.error("Preview error:",d)}finally{this.previewBtn.innerHTML=l}}}async validateGeminiKey(e){const t=(e||"").split(/[\n,;]+/)[0].trim();if(!t||t.length<15)return{valid:!1,message:"দয়া করে একটি সঠিক জেমিনি এপিআই কী প্রদান করুন।"};if(t.startsWith("gsk_"))return{valid:!1,message:'এটি Groq Cloud-এর কী (gsk_...)! অনুগ্রহ করে "Groq Cloud (LPU)" ট্যাবে দিন।'};if(t.startsWith("sk-or-v1-"))return{valid:!1,message:'এটি OpenRouter-এর কী (sk-or-v1-...)! অনুগ্রহ করে "OpenRouter" ট্যাবে দিন।'};if(t.startsWith("sk-proj-")||t.startsWith("sk-jk"))return{valid:!1,message:"এটি OpenAI বা OmniRouters-এর কী! অনুগ্রহ করে সংশ্লিষ্ট ট্যাবে দিন।"};const n=["gemini-3.6-flash","gemini-3.5-flash","gemini-3.1-flash-lite","gemini-flash-latest"];let r="";for(const i of n)try{const a=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${i}:generateContent?key=${encodeURIComponent(t)}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{role:"user",parts:[{text:"test"}]}]})});if(a.ok)return localStorage.setItem("jarvis_gemini_model",i),typeof vn<"u"&&vn&&(vn.geminiModel=i),{valid:!0};r=(await a.json().catch(()=>({}))).error?.message||`HTTP ${a.status}`}catch(a){console.error("[AISettingsModal] Gemini validation model error:",a),r=a.message}return(r.includes("401")||r.includes("INVALID_ARGUMENT")||r.includes("API key not valid"))&&(r="গুগল সার্ভারে এই কী-টি সঠিক নয়। দয়া করে Google AI Studio থেকে সঠিক API Key কপি করুন।"),{valid:!1,message:r}}async validateGroqKey(e){const t=(e||"").split(/[\n,;]+/)[0].trim();if(!t||t.length<15)return{valid:!1,message:"দয়া করে একটি সঠিক Groq এপিআই কী প্রদান করুন।"};if(t.startsWith("AIzaSy"))return{valid:!1,message:'এটি Google Gemini-এর কী (AIzaSy...)! অনুগ্রহ করে "Google Gemini Flash" ট্যাবে দিন।'};if(t.startsWith("sk-or-v1-"))return{valid:!1,message:'এটি OpenRouter-এর কী (sk-or-v1-...)! অনুগ্রহ করে "OpenRouter (Free)" ট্যাবে দিন।'};if(!t.startsWith("gsk_"))return{valid:!1,message:'Groq Cloud কী সর্বদা "gsk_..." দিয়ে শুরু হয়। দয়া করে console.groq.com/keys থেকে সঠিক কী কপি করুন।'};try{const n=await fetch("https://api.groq.com/openai/v1/models",{headers:{Authorization:`Bearer ${t}`}});if(n.ok)return{valid:!0};let i=(await n.json().catch(()=>({}))).error?.message||`HTTP ${n.status}`;return(i.includes("Invalid API Key")||i.includes("401"))&&(i="Groq সার্ভার এই কী-টি সঠিক হিসেবে চিহ্নিত করেনি। দয়া করে console.groq.com/keys থেকে কী-টি পুনরায় কপি করুন।"),{valid:!1,message:i}}catch(n){return console.error("[AISettingsModal] Groq validation error:",n),{valid:!1,message:n.message}}}async validateOpenRouterKey(e){const t=(e||"").split(/[\n,;]+/)[0].trim();if(!t||t.length<15)return{valid:!1,message:"দয়া করে একটি সঠিক OpenRouter এপিআই কী প্রদান করুন।"};if(t.startsWith("AIzaSy"))return{valid:!1,message:'এটি Google Gemini-এর কী (AIzaSy...)! অনুগ্রহ করে উপরে "Google Gemini Flash" ট্যাবে ক্লিক করে সেখানে কী-টি দিন।'};if(t.startsWith("gsk_"))return{valid:!1,message:'এটি Groq Cloud-এর কী (gsk_...)! অনুগ্রহ করে উপরে "Groq Cloud (LPU)" ট্যাবে ক্লিক করে সেখানে কী-টি দিন।'};if(t.startsWith("sk-jk"))try{const n=await fetch("https://omnirouters.com/v1/models",{headers:{Authorization:`Bearer ${t}`}});if(n.ok)return{valid:!0};let i=(await n.json().catch(()=>({}))).error?.message||`HTTP ${n.status}`;return(i.includes("Invalid token")||n.status===401)&&(i='OmniRouters সার্ভারে টোকেনটি এখনও সক্রিয় হয়নি (Invalid token)। অনুগ্রহ করে ব্রাউজারের ৪ নম্বর ট্যাবে "OmniRouters Email Verification" সম্পূর্ণ করুন অথবা omnirouters.com/keys থেকে নতুন টোকেন তৈরি করুন।'),{valid:!1,message:i}}catch(n){return console.error("[AISettingsModal] OmniRouters validation error:",n),{valid:!1,message:n.message}}if(t.startsWith("sk-proj-")||t.startsWith("sk-")&&!t.startsWith("sk-or-v1-"))return{valid:!1,message:'এটি OpenAI ChatGPT-এর কী! অনুগ্রহ করে উপরে "OpenAI (ChatGPT)" ট্যাবে ক্লিক করে সেখানে কী-টি দিন।'};if(!t.startsWith("sk-or-v1-"))return{valid:!1,message:'ওপেনরাউটার (OpenRouter) এপিআই কী সর্বদা "sk-or-v1-" দিয়ে শুরু হয়। দয়া করে openrouter.ai/keys থেকে সঠিক কী কপি করুন।'};try{const n=await fetch("https://openrouter.ai/api/v1/auth/key",{headers:{Authorization:`Bearer ${t}`,"HTTP-Referer":typeof window<"u"?window.location.origin:"https://maa-motors-erp.web.app","X-Title":"Maa Motors Jarvis AI"}});if(n.ok)return{valid:!0};let i=(await n.json().catch(()=>({}))).error?.message||`HTTP ${n.status}`;return(i.includes("Missing Authentication header")||i.includes("User not found")||i.includes("401"))&&(i="ওপেনরাউটার সার্ভার এই কী-টি সঠিক হিসেবে চিহ্নিত করেনি। অনুগ্রহ করে openrouter.ai/keys থেকে কী-টি পুনরায় কপি করুন।"),{valid:!1,message:i}}catch(n){return console.error("[AISettingsModal] OpenRouter validation error:",n),{valid:!1,message:n.message}}}async validateOpenAIKey(e){const t=(e||"").trim();if(!t||t.length<15)return{valid:!1,message:"দয়া করে একটি সঠিক OpenAI এপিআই কী প্রদান করুন।"};if(t.startsWith("AIzaSy"))return{valid:!1,message:'এটি Google Gemini-এর কী (AIzaSy...)! অনুগ্রহ করে "Google Gemini Flash" ট্যাবে দিন।'};if(t.startsWith("gsk_"))return{valid:!1,message:'এটি Groq Cloud-এর কী (gsk_...)! অনুগ্রহ করে "Groq Cloud (LPU)" ট্যাবে দিন।'};if(t.startsWith("sk-or-v1-"))return{valid:!1,message:'এটি OpenRouter-এর কী (sk-or-v1-...)! অনুগ্রহ করে "OpenRouter (Free)" ট্যাবে দিন।'};try{const n=await fetch("https://api.openai.com/v1/models",{headers:{Authorization:`Bearer ${t}`}});return n.ok?{valid:!0}:{valid:!1,message:(await n.json().catch(()=>({}))).error?.message||`HTTP ${n.status}`}}catch(n){return console.error("[AISettingsModal] OpenAI validation error:",n),{valid:!1,message:n.message}}}async saveSettings(){const e=this.currentProvider||"gemini",t=(this.geminiKeyInput?.value||"").trim(),n=(this.groqKeyInput?.value||"").trim(),r=(this.openrouterKeyInput?.value||"").trim(),i=(this.openaiKeyInput?.value||"").trim(),a=this.autoFailoverToggle?this.autoFailoverToggle.checked:!0,c=this.openaiVoiceSelect?.value||"onyx",l=this.geminiVoiceSelect?.value||"bn-BD-PradeepNeural",d=document.getElementById("input-elevenlabs-key"),f=document.getElementById("input-elevenlabs-voice-id"),m=document.getElementById("input-gcp-tts-key"),_=(d?.value||"").trim(),T=(f?.value||"").trim(),R=(m?.value||"").trim();t&&(localStorage.setItem("jarvis_gemini_key",t),localStorage.setItem("jarvis_gemini_keys",t)),n&&(localStorage.setItem("jarvis_groq_key",n),localStorage.setItem("jarvis_groq_keys",n)),r&&(localStorage.setItem("jarvis_openrouter_key",r),localStorage.setItem("jarvis_openrouter_keys",r)),i&&localStorage.setItem("jarvis_openai_key",i),localStorage.setItem("jarvis_auto_failover",a?"true":"false"),localStorage.setItem("jarvis_ai_provider",e),localStorage.setItem("jarvis_openai_voice",c),localStorage.setItem("jarvis_azure_voice",l),_&&(localStorage.setItem("jarvis_elevenlabs_key",_),G.setElevenLabsVoice(T),G.setEngine("elevenlabs")),T&&localStorage.setItem("jarvis_elevenlabs_voice_id",T),R&&localStorage.setItem("jarvis_gcp_tts_key",R),vn.setProvider(e),vn.autoFailover=a,_?G.setEngine("elevenlabs"):e==="openai"&&i?(G.setOpenAIVoice(c),G.setEngine("openai")):R?G.setEngine("gcp"):(G.setAzureVoice(l),G.setEngine("free-bengali"));const N=document.getElementById("voice-selector");if(N&&(N.value=e==="openai"?c:l),this.feedbackEl&&(this.feedbackEl.className="settings-feedback-msg",this.feedbackEl.innerText="🔍 এআই কী যাচাই করা হচ্ছে...",this.feedbackEl.classList.remove("hidden")),e==="gemini"&&t){const x=await this.validateGeminiKey(t);if(!x.valid){this.feedbackEl&&(this.feedbackEl.className="settings-feedback-msg error",this.feedbackEl.innerText=`❌ জেমিনি কী সঠিক নয়: ${x.message}`);return}}else if(e==="groq"&&n){const x=await this.validateGroqKey(n);if(!x.valid){this.feedbackEl&&(this.feedbackEl.className="settings-feedback-msg error",this.feedbackEl.innerText=`❌ Groq কী সঠিক নয়: ${x.message}`);return}}else if(e==="openrouter"&&r){const x=await this.validateOpenRouterKey(r);if(!x.valid){this.feedbackEl&&(this.feedbackEl.className="settings-feedback-msg error",this.feedbackEl.innerText=`❌ OpenRouter কী সঠিক নয়: ${x.message}`);return}}else if(e==="openai"&&i){const x=await this.validateOpenAIKey(i);if(!x.valid){this.feedbackEl&&(this.feedbackEl.className="settings-feedback-msg error",this.feedbackEl.innerText=`❌ ওপেনএআই কী সঠিক নয়: ${x.message}`);return}}const D={gemini:"গুগল জেমিনি (Google Gemini)",groq:"গ্রক ক্লাউড (Groq LPU Llama-3.3)",openrouter:"ওপেনরাউটার (OpenRouter Free)",openai:"ওপেনএআই চ্যাটজিপিটি (OpenAI ChatGPT)"};this.feedbackEl&&(this.feedbackEl.className="settings-feedback-msg success",this.feedbackEl.innerText=`✅ ${D[e]||e} ও স্মার্ট ভয়েস সফলভাবে সক্রিয় হয়েছে!`,this.feedbackEl.classList.remove("hidden"),this.updateDiagnosticBadges(),setTimeout(()=>{this.close()},1200))}updateDiagnosticBadges(){const e={gemini:"Google Gemini",groq:"Groq Cloud (LPU)",openrouter:"OpenRouter Free",openai:"OpenAI ChatGPT"};this.activeProviderBadge&&(this.activeProviderBadge.textContent=e[this.currentProvider]||this.currentProvider);const t=(this.geminiKeyInput?.value||"").split(/[\n,;]+/).filter(c=>c.trim().length>10),n=(this.groqKeyInput?.value||"").split(/[\n,;]+/).filter(c=>c.trim().length>10),r=(this.openrouterKeyInput?.value||"").split(/[\n,;]+/).filter(c=>c.trim().length>10),i=(this.openaiKeyInput?.value||"").trim(),a=t.length+n.length+r.length+(i.length>10?1:0);if(this.totalKeysCountBadge&&(this.totalKeysCountBadge.textContent=a>0?`${a} টি সক্রিয় কী`:"কোনো কী নেই",this.totalKeysCountBadge.className=a>0?"diag-val-badge green":"diag-val-badge"),this.activeVoiceBadge)if((document.getElementById("input-elevenlabs-key")?.value||"").trim())this.activeVoiceBadge.textContent="ElevenLabs Neural",this.activeVoiceBadge.className="diag-val-badge green";else if(this.currentProvider==="openai"){const l=this.openaiVoiceSelect?.value||"onyx";this.activeVoiceBadge.textContent=`ChatGPT (${l})`,this.activeVoiceBadge.className="diag-val-badge"}else{const l=this.geminiVoiceSelect?.value==="bn-BD-NabanitaNeural"?"নবনিতা":"প্রদীপ";this.activeVoiceBadge.textContent=`Microsoft Natural (${l})`,this.activeVoiceBadge.className="diag-val-badge green"}}async testActiveKeyPing(){if(!this.pingOutputEl)return;this.pingOutputEl.innerHTML='<span style="color: #38bdf8;">🔄 সক্রিয় প্রোভাইডার ও কী পিং করা হচ্ছে...</span>';const e=this.currentProvider||"gemini";let t="";if(e==="gemini"?t=(this.geminiKeyInput?.value||localStorage.getItem("jarvis_gemini_key")||"").split(/[\n,;]+/)[0].trim():e==="groq"?t=(this.groqKeyInput?.value||localStorage.getItem("jarvis_groq_key")||"").split(/[\n,;]+/)[0].trim():e==="openrouter"?t=(this.openrouterKeyInput?.value||localStorage.getItem("jarvis_openrouter_key")||"").split(/[\n,;]+/)[0].trim():e==="openai"&&(t=(this.openaiKeyInput?.value||localStorage.getItem("jarvis_openai_key")||"").trim()),!t){this.pingOutputEl.innerHTML=`<span style="color: #f87171;">❌ কোনো কী পাওয়া যায়নি! অনুগ্রহ করে ${e.toUpperCase()} ইনপুটে সঠিক API Key দিন।</span>`;return}if(e==="openrouter"&&t.startsWith("AIzaSy")){this.pingOutputEl.innerHTML='<span style="color: #fbbf24;">⚠️ আপনি OpenRouter ট্যাবে আছেন, কিন্তু যে কী-টি দিয়েছেন তা Google Gemini-এর (AIzaSy... দিয়ে শুরু)!<br>অনুগ্রহ করে উপরে "Google Gemini Flash" ট্যাবে ক্লিক করে এই কী-টি সেখানে সেভ ও টেস্ট করুন।</span>';return}if(e==="gemini"&&t.startsWith("sk-or-v1-")){this.pingOutputEl.innerHTML='<span style="color: #fbbf24;">⚠️ আপনি Google Gemini ট্যাবে আছেন, কিন্তু যে কী-টি দিয়েছেন তা OpenRouter-এর (sk-or-v1-...)!<br>অনুগ্রহ করে উপরে "OpenRouter (Free)" ট্যাবে গিয়ে এই কী-টি সেভ ও টেস্ট করুন।</span>';return}if(e==="gemini"&&t.startsWith("gsk_")){this.pingOutputEl.innerHTML='<span style="color: #fbbf24;">⚠️ এটি Groq Cloud-এর কী (gsk_...)!<br>অনুগ্রহ করে উপরে "Groq Cloud (LPU)" ট্যাবে ক্লিক করে সেখানে সেভ করুন।</span>';return}if(e==="groq"&&t.startsWith("AIzaSy")){this.pingOutputEl.innerHTML='<span style="color: #fbbf24;">⚠️ আপনি Groq ট্যাবে আছেন, কিন্তু যে কী-টি দিয়েছেন তা Google Gemini-এর (AIzaSy...)!<br>অনুগ্রহ করে উপরে "Google Gemini Flash" ট্যাবে কী-টি দিন।</span>';return}const n=performance.now();try{if(e==="gemini"){const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${encodeURIComponent(t)}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{role:"user",parts:[{text:"ping"}]}]})}),i=Math.round(performance.now()-n);if(r.ok)this.pingOutputEl.innerHTML=`<span style="color: #34d399;">⚡ কানেকশন সফল! লেটেন্সি: <strong>${i}ms</strong><br>গুগল সার্ভার লাইভ এবং মডেল gemini-3.6-flash সম্পূর্ণ রেডি!</span>`;else{const c=(await r.json().catch(()=>({}))).error?.message||`HTTP ${r.status}`;this.pingOutputEl.innerHTML=`<span style="color: #f87171;">❌ গুগল সার্ভার এরর (${r.status}): ${c}</span>`}}else if(e==="groq"){const r=await fetch("https://api.groq.com/openai/v1/models",{headers:{Authorization:`Bearer ${t}`}}),i=Math.round(performance.now()-n);if(r.ok)this.pingOutputEl.innerHTML=`<span style="color: #34d399;">⚡ Groq LPU কানেকশন সফল! লেটেন্সি: <strong>${i}ms</strong><br>মডেল: <em>Llama-3.3-70b-versatile</em> প্রস্তুত।</span>`;else{const a=await r.json().catch(()=>({}));this.pingOutputEl.innerHTML=`<span style="color: #f87171;">❌ Groq এরর: ${a.error?.message||r.statusText}</span>`}}else if(e==="openrouter"){if(t.startsWith("sk-jk")){const a=await fetch("https://omnirouters.com/v1/models",{headers:{Authorization:`Bearer ${t}`}}),c=Math.round(performance.now()-n);if(a.ok)this.pingOutputEl.innerHTML=`<span style="color: #34d399;">⚡ OmniRouters কানেক্টেড! লেটেন্সি: <strong>${c}ms</strong><br>OmniRouters মডেল ক্লাস্টার সম্পূর্ণ রেডি ও প্রস্তুত!</span>`;else{let d=(await a.json().catch(()=>({}))).error?.message||a.statusText;(d.includes("Invalid token")||a.status===401)&&(d='OmniRouters সার্ভার জানিয়েছে: <strong>Invalid token (টোকেন নিষ্ক্রিয়)</strong>。<br>অনুগ্রহ করে আপনার ব্রাউজারের ৪ নম্বর ট্যাবে থাকা <strong>"OmniRouters Email Verification"</strong> (Gmail)-এ গিয়ে ইমেইল ভেরিফাই করুন অথবা omnirouters.com/keys থেকে নতুন টোকেন তৈরি করুন।'),this.pingOutputEl.innerHTML=`<span style="color: #f87171;">❌ OmniRouters এরর: ${d}</span>`}return}const r=await fetch("https://openrouter.ai/api/v1/auth/key",{headers:{Authorization:`Bearer ${t}`,"HTTP-Referer":typeof window<"u"?window.location.origin:"https://maa-motors-erp.web.app","X-Title":"Maa Motors Jarvis AI"}}),i=Math.round(performance.now()-n);if(r.ok){const a=await r.json().catch(()=>({})),c=a?.data?.limit!==null&&a?.data?.limit!==void 0?` (ক্রেডিট: $${a.data.limit})`:"";this.pingOutputEl.innerHTML=`<span style="color: #34d399;">⚡ OpenRouter কানেক্টেড! লেটেন্সি: <strong>${i}ms</strong>${c}<br>ফ্রি মডেল ক্লাস্টার সম্পূর্ণ সক্রিয়।</span>`}else{let c=(await r.json().catch(()=>({}))).error?.message||r.statusText;(c.includes("Missing Authentication header")||c.includes("User not found"))&&(c="OpenRouter সার্ভার এই কী-টি চিনতে পারেনি। কী-টি sk-or-v1- দিয়ে শুরু কি না নিশ্চিত করুন।"),this.pingOutputEl.innerHTML=`<span style="color: #f87171;">❌ OpenRouter এরর: ${c}</span>`}}else if(e==="openai"){const r=await fetch("https://api.openai.com/v1/models",{headers:{Authorization:`Bearer ${t}`}}),i=Math.round(performance.now()-n);if(r.ok)this.pingOutputEl.innerHTML=`<span style="color: #34d399;">⚡ OpenAI কানেক্টেড! লেটেন্সি: <strong>${i}ms</strong><br>ChatGPT মডেল ও অফিসিয়াল ভয়েস প্রস্তুত।</span>`;else{const a=await r.json().catch(()=>({}));this.pingOutputEl.innerHTML=`<span style="color: #f87171;">❌ OpenAI এরর: ${a.error?.message||r.statusText}</span>`}}}catch(r){console.error("[AISettingsModal] Ping error:",r),this.pingOutputEl.innerHTML=`<span style="color: #f87171;">❌ নেটওয়ার্ক এরর: ${r.message}</span>`}}}const fh=typeof document<"u"?new Pb:null;class Je{constructor({id:e,name:t,description:n,triggers:r=[]}){if(!e||!t)throw new Error("BaseSkill requires both id and name");this.id=e,this.name=t,this.description=n||"",this.triggers=r}getTools(){return[]}matches(e){const t=(e||"").toLowerCase();return this.triggers.some(n=>t.includes(n.toLowerCase()))}async execute(e,t={},n={}){throw new Error(`execute() not implemented for skill ${this.id}`)}}class Nb extends Je{constructor(){super({id:"skill_customer",name:"কাস্টমার ও বকেয়া লেজার স্কিল",description:"কাস্টমারদের বকেয়া ব্যালেন্স, মোবাইল নম্বর, ঠিকানা এবং বর্তমান হিসাব যাচাই করে।",triggers:["বকেয়া","বকে","কাস্টমার","বাকী","হিসাব","ব্যালেন্স","ফোন নম্বর","মোবাইল","ঠিকানা","পাওনা","খাতা","পার্টি"]})}getTools(){return[{name:"get_customer_due",description:"নির্দিষ্ট কাস্টমারের বর্তমান বকেয়া ব্যালেন্স এবং লেজার অবস্থা জেনে উত্তর দেয়।",parameters:{type:"object",properties:{customer_name:{type:"string",description:"কাস্টমারের নাম বা সার্চ কিওয়ার্ড (যেমন: করিম, আলম, রহিম ইত্যাদি)"}},required:["customer_name"]}},{name:"search_customer_info",description:"কাস্টমারের মোবাইল নম্বর, ঠিকানা বা সাধারণ প্রোফাইল খুঁজে বের করে।",parameters:{type:"object",properties:{search_term:{type:"string",description:"কাস্টমারের নাম বা ফোন নম্বর"}},required:["search_term"]}}]}async execute(e,t={}){const n=t.customer_name||t.search_term||"",r=await H.searchCustomers(n);if(r&&r.error==="AUTH_REQUIRED")return{success:!1,spokenResponse:'স্যার, কাস্টমার লেজার অ্যাক্সেস করতে উপরের "গুগল লগইন" বাটনে ক্লিক করে সাইন ইন করুন।'};if(!r||r.length===0)return{success:!1,spokenResponse:`দুঃখিত স্যার, "${n}" নামে কোনো কাস্টমার আমাদের ডেটাবেসে খুঁজে পাওয়া যায়নি।`,displayData:{query:n,results:[]}};if(e==="get_customer_due")if(r.length===1){const i=r[0],a=i.totalDue>0?`বর্তমান অবশিষ্ট বকেয়া হলো ${To(i.totalDue)}`:i.totalDue<0?`অগ্রিম জমা রয়েছে ${To(Math.abs(i.totalDue))}`:"কোনো বকেয়া নেই, হিসাব সম্পূর্ণ পরিশোধিত";return{success:!0,spokenResponse:`${i.name} সাহেবের ${a} (৳ ${ee(i.totalDue)})।`,displayData:{customer:i}}}else return{success:!0,spokenResponse:`এই নামে একাধিক কাস্টমার পাওয়া গেছে: ${r.slice(0,3).map(a=>`${a.name} (বকেয়া: ৳ ${ee(a.totalDue)})`).join(", ")}। আপনি নির্দিষ্ট কার হিসাব দেখতে চান?`,displayData:{count:r.length,matches:r}};if(e==="search_customer_info"){const i=r[0];return{success:!0,spokenResponse:`${i.name} সাহেবের মোবাইল নম্বর ${i.phone||"যুক্ত নেই"} এবং ঠিকানা ${i.address||"দেওয়া নেই"}। উনার বর্তমান বকেয়া ৳ ${ee(i.totalDue)}।`,displayData:{customer:i}}}return{success:!1,spokenResponse:"কাস্টমার স্কিল সম্পন্ন করা সম্ভব হয়নি।"}}}class Lb extends Je{constructor(){super({id:"skill_analytics",name:"আর্থিক স্থিতি ও ক্যাশ-ব্যাংক স্কিল",description:"শোরুম ক্যাশ, বিভিন্ন ব্যাংক অ্যাকাউন্টের সমাপনী স্থিতি এবং মোট তরল তহবিল হিসাব করে জানায়।",triggers:["ক্যাশ","ব্যাংক","স্থিতি","আজকের হিসাব","মোট স্থিতি","লিকুইড ফান্ড","ক্যাশ কত","ব্যাংকে কত","ফান্ড","তহবিল"]})}getTools(){return[{name:"get_financial_status",description:"প্রতিষ্ঠানটির সমস্ত ব্যাংকে ও শোরুম ক্যাশে মোট কত টাকা আছে (মোট স্থিতি) তা হিসাব করে উত্তর দেয়।",parameters:{type:"object",properties:{detail_level:{type:"string",enum:["summary","breakdown"],description:"সামারি নাকি প্রতিটি ব্যাংকের বিস্তারিত নাম সহ"}}}}]}async execute(e,t={}){const n=await H.getFinancialSnapshot();if(n&&n.error==="AUTH_REQUIRED")return{success:!1,spokenResponse:'স্যার, ব্যাংক ও ক্যাশ স্থিতি দেখতে উপরের "গুগল লগইন" বাটনে ক্লিক করে সাইন ইন করুন।'};if(!n)return{success:!1,spokenResponse:"দুঃখিত স্যার, এই মুহূর্তে ব্যাংক ও ক্যাশ ব্যালেন্সের লাইভ হিসাব লোড করা সম্ভব হয়নি।"};const r=To(n.totalLiquidFund),i=ee(n.totalLiquidFund);let a=`আমাদের সমস্ত ব্যাংক ও ক্যাশ কাউন্টার মিলিয়ে মোট সমাপনী স্থিতি হলো ${r} (৳ ${i})।`;const c=(n.accounts||[]).sort((l,d)=>d.balance-l.balance).slice(0,3).map(l=>`${l.name}-এ ${ee(l.balance)} টাকা`).join(", ");return c&&(a+=` যার মধ্যে প্রধানত: ${c} রয়েছে।`),n.totalMarketDue>0&&(a+=` এছাড়া মার্কেটে মোট কাস্টমার বকেয়া রয়েছে ৳ ${ee(n.totalMarketDue)}।`),{success:!0,spokenResponse:a,displayData:n}}}class xb extends Je{constructor(){super({id:"skill_dubai",name:"দুবাই কন্টেইনার ও বৈদেশিক প্রকিউরমেন্ট স্কিল",description:"দুবাই কন্টেইনার অডিট, সাপ্তাহিক দেরহাম ক্যাশ স্থিতি ও ব্যক্তিগত আমানতের হিসাব জানায়।",triggers:["দুবাই","কনটেইনার","কন্টেইনার","দেরহাম","শারজাহ","আমদানির হিসাব","মুরাদ মামা","আলতাফ"]})}getTools(){return[{name:"get_dubai_audit_status",description:"দুবাইয়ের সর্বশেষ সাপ্তাহিক অডিটের দেরহাম স্থিতি, নগদ ক্যাশ ও মার্কেট এডভান্সের হিসাব জানায়।",parameters:{type:"object",properties:{}}}]}async execute(e,t={}){const n=await H.getLatestDubaiAudit();if(!n)return{success:!1,spokenResponse:"দুবাই কনটেইনার অডিটের কোনো সাম্প্রতিক ডাটা পাওয়া যায়নি।"};const r=ee(n.cashInHand),i=ee(n.marketAdvance),a=ee(n.totalPhysicalAssets);let c=`দুবাইয়ের সর্বশেষ অডিট রেকর্ড অনুযায়ী (${n.date}): হাতে নগদ ক্যাশ আছে ${r} দেরহাম, মার্কেট অ্যাডভান্স ${i} দেরহাম এবং মোট ভৌত সম্পদ রয়েছে ${a} AED (ইউএই দেরহাম)।`;if(n.variance!==0){const l=ee(Math.abs(n.variance));c+=n.variance>0?` এতে ${l} দেরহাম অতিরিক্ত উদ্বৃত্ত রয়েছে।`:` এতে ${l} দেরহাম ঘাটতি দেখাচ্ছে।`}return{success:!0,spokenResponse:c,displayData:n}}}class Vb extends Je{constructor(){super({id:"skill_memory",name:"দীর্ঘমেয়াদী স্মৃতিভাণ্ডার স্কিল",description:"মালিকের নতুন কোনো নির্দেশ, নিয়ম বা তথ্য স্থায়ীভাবে মনে রাখে ও সংরক্ষণ করে।",triggers:["মনে রাখবা","মনে রেখো","নোট নাও","মনে রাখো","সেভ করো","ভুলে যেও না","আমার পছন্দ"]})}getTools(){return[{name:"remember_fact",description:"মালিকের বলে দেওয়া কোনো নতুন নিয়ম, ব্যবসায়িক তথ্য বা পছন্দ স্মৃতিতে সংরক্ষণ করে।",parameters:{type:"object",properties:{content:{type:"string",description:"যে কথা বা নিয়মটি মনে রাখতে বলা হয়েছে"},category:{type:"string",enum:["fact","preference","rule"],description:"তথ্যের ধরন (তথ্য, পছন্দ নাকি নিয়ম)"}},required:["content"]}}]}async execute(e,t={}){const n=t.content||"",r=t.category||"fact";if(!n)return{success:!1,spokenResponse:"কী মনে রাখতে হবে তা স্পষ্ট নয় স্যার।"};const i=await Ut.addMemory(r,n,["voice_input","owner_rule"]);return{success:!0,spokenResponse:`জি স্যার, আমি আপনার এই নির্দেশটি স্থায়ীভাবে মনে রেখেছি: "${n}"। পরবর্তীতে কাজের সময় আমি এটি স্মরণে রাখব।`,displayData:{savedMemory:i}}}}class Bb extends Je{constructor(){super({id:"skill_business_intelligence",name:"ব্যবসায়িক ক্যালকুলেশন ও সেলস ইন্টেলিজেন্স",description:"মাসিক ও সাপ্তাহিক বিক্রয় টার্নওভার, আজকের চালান, শীর্ষ ক্রেতা, কালেকশন রিকভারি রেট, অগ্রিম কাস্টমার, ব্যাংক স্টেটমেন্ট এবং অতীতের নির্দিষ্ট তারিখের পূর্ণাঙ্গ হিসাব বের করে।",triggers:["বিক্রি","টার্নওভার","চালান","সেরা ক্রেতা","রিকভারি রেট","অগ্রিম","স্টেটমেন্ট","নিট ক্যাশফ্লো","গত পরশু","গতকাল"]})}getTools(){return[{name:"get_period_sales_turnover",description:"নির্দিষ্ট সময়ে মোট বিক্রি, চালান সংখ্যা ও দৈনিক গড় বিক্রি হিসাব করে।",parameters:{type:"object",properties:{days:{type:"number",description:"কত দিনের হিসাব"}}}},{name:"get_collection_recovery_efficiency",description:"বিক্রির তুলনায় কালেকশনের শতকরা হার (রিকভারি রেট) যাচাই করে।",parameters:{type:"object",properties:{days:{type:"number",description:"কত দিনের অনুপাত"}}}},{name:"get_historical_date_summary",description:"অতীতের যেকোনো নির্দিষ্ট দিনের বিক্রি, কালেকশন ও খরচ বের করে।",parameters:{type:"object",properties:{targetDate:{type:"string",description:"তারিখ YYYY-MM-DD"}},required:["targetDate"]}}]}async execute(e,t={}){return e==="get_period_sales_turnover"?await H.getPeriodSalesTurnover(t.days||30):e==="get_collection_recovery_efficiency"?await H.getCollectionRecoveryEfficiency(t.days||30):e==="get_historical_date_summary"?await H.getHistoricalDateSummary(t.targetDate):{success:!1,message:"অজানা অ্যাকশন"}}}class Mb extends Je{constructor(){super({id:"skill_executive_report",name:"দৈনিক এক্সিকিউটিভ রিপোর্ট ও ব্যবসায়িক সামারি",description:"প্রতিদিনের মোট বিক্রি, ক্যাশ ও ব্যাংক আদায়, খরচ, নিট ক্যাশ ফ্লো এবং পূর্ণাঙ্গ ব্যবসায়িক রিপোর্ট কার্ড তৈরি করে।",triggers:["রিপোর্ট","রিপোট","আজকের রিপোর্ট","ব্যবসার অবস্থা","দৈনিক রিপোর্ট","সারসংক্ষেপ","সামারি","পালস","আজকের হিসাব","আজকের সামারি","আজকের ব্যবসা"]})}getTools(){return[{name:"get_executive_business_pulse",description:"মা মোটরসের আজকের বা নির্দিষ্ট দিনের পূর্ণাঙ্গ ব্যবসায়িক রিপোর্ট (মোট বিক্রি, ক্যাশ ও ব্যাংক আদায়, মোট খরচ ও নিট ক্যাশ ফ্লো) তৈরি করতে এটি কল করো।",parameters:{type:"object",properties:{date:{type:"string",description:"তারিখ YYYY-MM-DD ফরম্যাটে (ঐচ্ছিক, না দিলে আজকের রিপোর্ট দেখাবে)"}}}}]}async execute(e,t={}){const n=await H.getExecutiveBusinessPulse(t.date||null);if(!n)return{success:!1,spokenResponse:"দুঃখিত স্যার, এই মুহূর্তে দৈনিক ব্যবসায়িক রিপোর্ট লোড করা সম্ভব হয়নি।"};const r=ee(n.todayTotalBills),i=ee(n.todayTotalCollections),a=ee(n.todayTotalExpenses),c=ee(n.todayNetCashFlow);return{success:!0,spokenResponse:`জি স্যার! আজকের মোট বিক্রি ৳ ${r}, মোট আদায় ৳ ${i} (ক্যাশ ৳ ${ee(n.cashCollections)} ও ব্যাংক ৳ ${ee(n.bankCollections)}), মোট খরচ ৳ ${a} এবং আজকের নিট ক্যাশ ফ্লো হলো ৳ ${c}।`,displayData:{type:"executive_business_pulse",...n}}}}class Ob extends Je{constructor(){super({id:"skill_dispute_audit",name:"লেজার অডিট ও ভুল সংশোধন (Dispute Resolution)",description:"হিসাবে কোনো গরমিল বা ভুল অভিযোগ এলে লেজার লেনদেন পুঙ্খানুপুঙ্খ অডিট করে এবং নির্দিষ্ট কাস্টমার বা ভাউচারের সত্যতা যাচাই করে।",triggers:["ভুল হিসাব","ভুল দিয়েছ","ভুল দিয়েছো","হিসাব ঠিক নাই","ভুল কেন","লেজার অডিট","হিসাব ভুল","অডিট করো","গরমিল","ভুল উত্তর"]})}getTools(){return[{name:"get_ledger_math_audit_summary",description:"মা মোটরসের লেজার লেনদেনের গাণিতিক নির্ভুলতা ও কোনো গরমিল আছে কিনা তা অডিট করতে এটি কল করো।",parameters:{type:"object",properties:{sampleSize:{type:"number",description:"কতটি লেনদেন অডিট করবে (ডিফল্ট ১০০)"}}}}]}async execute(e,t={}){const n=await H.getLedgerMathAuditSummary(t.sampleSize||100);if(!n||!n.success)return{success:!1,spokenResponse:"স্যার, আমি আন্তরিকভাবে দুঃখিত। আপনি কোন কাস্টমার বা চালানের হিসাবটির কথা বলছেন তা জানালে আমি এখনই লেজার খাতা মিলিয়ে দিচ্ছি।"};let r="";return n.isFullySound?r=`স্যার, আমি অত্যন্ত দুঃখিত যদি কোনো বিভ্রান্তি হয়ে থাকে। আমাদের ডাটাবেসের সাম্প্রতিক ${n.auditedTxnCount}টি লেনদেন যাচাই করেছি এবং কোনো গাণিতিক অমিল পাওয়া যায়নি। আপনি নির্দিষ্ট কোন কাস্টমার বা ভাউচারের হিসাব দেখতে চাচ্ছেন জানালে আমি বিস্তারিত মিলিয়ে দিচ্ছি।`:r=`সতর্কতা স্যার! ${n.auditedTxnCount}টি লেনদেনের মধ্যে ${n.corruptTxnCount}টি এন্ট্রিতে গাণিতিক অমিল শনাক্ত হয়েছে। বিস্তারিত অডিট কার্ডে তুলে ধরা হলো।`,{success:!0,spokenResponse:r,displayData:{type:"ledger_audit_summary",...n}}}}class $b extends Je{constructor(){super({id:"skill_banking_treasury",name:"ব্যাংক হিসাব ও কেন্দ্রীয় ট্রেজারি ফান্ড",description:"প্রতিটি ব্যাংক অ্যাকাউন্টের লাইভ ব্যালেন্স, কাস্টমারদের ব্যাংক জমা এবং প্রতিষ্ঠানের কেন্দ্রীয় ট্রেজারি ফান্ডের হিসাব বের করে।",triggers:["ব্যাংক ব্যালেন্স","ব্যাংক অ্যাকাউন্ট","ব্যাংকে জমা","ইসলামী ব্যাংক","ওয়ান ব্যাংক","ট্রেজারি","রিজার্ভ ফান্ড","ব্যাংক স্টেটমেন্ট","ব্যাংকের হিসাব"]})}getTools(){return[{name:"get_all_bank_running_balances",description:"মা মোটরসের প্রতিটি ব্যাংক অ্যাকাউন্টের লাইভ ব্যালেন্স ও মোট ব্যাংক ফান্ড জানতে এটি কল করো।"},{name:"get_today_bank_collections",description:"আজকে বা নির্দিষ্ট দিনে কোন কোন কাস্টমার কোন ব্যাংকে টাকা জমা দিয়েছে তা জানতে এটি কল করো।"},{name:"get_master_treasury_status",description:"মা মোটরসের কেন্দ্রীয় মাস্টার ট্রেজারি ফান্ডের ব্যালেন্স ও সাম্প্রতিক লেনদেন জানতে এটি কল করো।"}]}async execute(e,t={}){if(e==="get_today_bank_collections"){const i=await H.getTodayBankCollections(t.date||null);return i?{success:!0,spokenResponse:`জি স্যার! আজকে বিভিন্ন ব্যাংকে সর্বমোট ৳ ${ee(i.totalBankDeposit)} জমা হয়েছে।`,displayData:{type:"today_bank_collections",...i}}:{success:!1,spokenResponse:"ব্যাংক জমার তথ্য পাওয়া যায়নি।"}}if(e==="get_master_treasury_status"){const i=await H.getTreasuryFundStatus();return i?{success:!0,spokenResponse:`জি স্যার! মা মোটরসের মাস্টার ট্রেজারি ফান্ডের বর্তমান মোট ব্যালেন্স হলো ৳ ${ee(i.currentTreasuryBalance)}।`,displayData:{type:"treasury_status",...i}}:{success:!1,spokenResponse:"ট্রেজারি তথ্য পাওয়া যায়নি।"}}const n=await H.getAllBankRunningBalances();return!n||!n.success?{success:!1,spokenResponse:"ব্যাংক ব্যালেন্স লোড করা যায়নি।"}:{success:!0,spokenResponse:`জি স্যার! আমাদের সকল ব্যাংক মিলিয়ে মোট ব্যাংকিং ব্যালেন্স হলো ৳ ${ee(n.totalBankBalance)}।`,displayData:{type:"all_bank_balances",...n}}}}class Fb extends Je{constructor(){super({id:"skill_showroom_cash",name:"শোরুম ক্যাশ কাউন্টার ও নগদ আদায়",description:"শোরুম কাউন্টারে আজকের মোট নগদ আদায়, ক্যাশ পেমেন্ট থেকে মোট খরচ বাদ দিয়ে সমাপনী নগদ স্থিতি হিসাব করে।",triggers:["শোরুম ক্যাশ","ক্যাশ কত","আজকের ক্যাশ","নগদ আদায়","কাউন্টার ক্যাশ","ক্যাশ জমা","ক্যাশ কাউন্টার","ক্যাশ ব্যালেন্স","নগদ ব্যালেন্স"]})}getTools(){return[{name:"get_today_showroom_cash",description:"মা মোটরসের শোরুম কাউন্টারে আজকের নগদ আদায়, নগদ খরচ ও সমাপনী ক্যাশ ব্যালেন্স জানতে এটি কল করো।",parameters:{type:"object",properties:{date:{type:"string",description:"তারিখ YYYY-MM-DD ফরম্যাটে (ঐচ্ছিক, না দিলে আজকের হিসাব দেখাবে)"}}}}]}async execute(e,t={}){const n=await H.getTodayShowroomCashCollections(t.date||null);if(!n||!n.success)return{success:!1,spokenResponse:"দুঃখিত স্যার, এই মুহূর্তে শোরুম ক্যাশ কাউন্টারের তথ্য লোড করা সম্ভব হয়নি।"};const r=ee(n.totalCashReceived),i=ee(n.closingCash),a=ee(n.expensesPaidFromCash);return{success:!0,spokenResponse:`জি স্যার! আজকে শোরুম কাউন্টারে নগদ আদায় হয়েছে ৳ ${r}। ক্যাশ থেকে খরচ হয়েছে ৳ ${a} এবং দিন শেষে নগদ ক্যাশ ব্যালেন্স রয়েছে ৳ ${i}।`,displayData:{type:"today_cash_collections",...n}}}}class Ub extends Je{constructor(){super({id:"skill_sales_invoice",name:"বিক্রয় টার্নওভার ও মেমো চালান ট্র্যাকিং",description:"প্রতিদিনের মোট বিক্রি, নির্দিষ্ট সময়সীমার বিক্রয় টার্নওভার, ইনভয়েস/ভাউচার অনুসন্ধান এবং শীর্ষ ক্রেতাদের তালিকা প্রদান করে।",triggers:["বিক্রি","আজকের বিক্রি","মোট বিক্রি","বিক্রয় টার্নওভার","চালান","মেমো","ভাউচার","টপ কাস্টমার","সেরা ক্রেতা","সর্বোচ্চ মাল নিয়েছে"]})}getTools(){return[{name:"get_today_sales_invoices",description:"মা মোটরসের আজকের বিক্রয় চালান ও মোট বিক্রির টাকার পরিমাণ জানতে এটি কল করো।",parameters:{type:"object",properties:{date:{type:"string",description:"তারিখ YYYY-MM-DD ফরম্যাটে (ঐচ্ছিক)"}}}},{name:"get_period_sales_turnover",description:"গত ৭ দিন বা ৩০ দিনে মোট কত টাকার পার্টস বিক্রি হয়েছে তা জানতে এটি কল করো।",parameters:{type:"object",properties:{days:{type:"number",description:"কত দিনের হিসাব (যেমন ৭ বা ৩০)"}}}},{name:"get_top_buying_customers",description:"সবচেয়ে বেশি টাকার পণ্য ক্রয়কারী শীর্ষ ক্রেতাদের তালিকা জানতে এটি কল করো।",parameters:{type:"object",properties:{limit:{type:"number",description:"কত জন ক্রেতার তালিকা (ডিফল্ট ৫)"},days:{type:"number",description:"কত দিনের হিসাব (ডিফল্ট ৩০)"}}}},{name:"search_voucher_or_invoice",description:"নির্দিষ্ট মেমো বা ভাউচার নম্বর দিয়ে লেনদেনের বিবরণ খুঁজতে এটি কল করো।",parameters:{type:"object",properties:{voucherNo:{type:"string",description:"ভাউচার বা মেমো নম্বর (যেমন: 45001)"}},required:["voucherNo"]}}]}async execute(e,t={}){if(e==="get_period_sales_turnover"){const i=await H.getPeriodSalesTurnover(t.days||30);if(!i||!i.success)return{success:!1,spokenResponse:"বিক্রয় টার্নওভার পাওয়া যায়নি।"};const a=ee(i.totalSalesSum),c=ee(i.dailyAverageSales);return{success:!0,spokenResponse:`জি স্যার! গত ${i.days} দিনে সর্বমোট ৳ ${a} টাকার পণ্য বিক্রি হয়েছে (দৈনিক গড় বিক্রি ৳ ${c})।`,displayData:{type:"sales_turnover",...i}}}if(e==="get_top_buying_customers"){const i=await H.getTopBuyingCustomers(t.limit||5,t.days||30);if(!i||!i.success)return{success:!1,spokenResponse:"সেরা ক্রেতাদের তালিকা লোড করা যায়নি।"};const a=i.topBuyers?.[0]?.name||"গ্রাহক",c=ee(i.topBuyers?.[0]?.totalPurchased||0);return{success:!0,spokenResponse:`জি স্যার! সেরা ক্রেতাদের শীর্ষে আছেন ${a}, যিনি মোট ৳ ${c} টাকার মালামাল কিনেছেন।`,displayData:{type:"top_buyers",...i}}}if(e==="search_voucher_or_invoice"){const i=await H.searchVoucherOrInvoice(t.voucherNo);if(!i||!i.success||!i.transaction)return{success:!1,spokenResponse:`দুঃখিত স্যার, ${t.voucherNo} নম্বরের কোনো মেমো খুঁজে পাওয়া যায়নি।`};const a=i.transaction,c=ee(a.bill>0?a.bill:a.paid),l=a.bill>0?"বিল/চালান":"জমা রশিদ";return{success:!0,spokenResponse:`জি স্যার! ${t.voucherNo} নম্বর ${l} পাওয়া গেছে। কাস্টমার: ${a.customerName}, টাকার পরিমাণ ৳ ${c}।`,displayData:{type:"voucher_detail",transaction:a}}}const n=await H.getTodaySalesInvoices(t.date||null);return!n||!n.success?{success:!1,spokenResponse:"আজকের বিক্রির হিসাব লোড করা যায়নি।"}:{success:!0,spokenResponse:`জি স্যার! আজকের মোট বিক্রির পরিমাণ ৳ ${ee(n.todayTotalBills)} এবং মোট ${n.invoiceCount}টি চালান সম্পন্ন হয়েছে।`,displayData:{type:"today_sales_invoices",...n}}}}class jb extends Je{constructor(){super({id:"skill_expense_audit",name:"দৈনিক খরচ ও খাতওয়ারী ব্যয় বিশ্লেষণ",description:"প্রতিদিনের অফিস ও শো-রুমের যাবতীয় খরচ, ভাউচার তালিকা এবং নির্দিষ্ট মেয়াদে কোন খাতে কত খরচ হয়েছে তার নিখুঁত ব্রেকডাউন দেয়।",triggers:["খরচ","আজকের খরচ","অফিস খরচ","চা নাস্তা","খরচের খাত","খরচের বিবরণ","মোট খরচ","ব্যয়","আজকের ব্যয়"]})}getTools(){return[{name:"get_daily_expenses",description:"মা মোটরসের আজকের বা নির্দিষ্ট দিনের সমস্ত খরচের তালিকা ও মোট টাকার পরিমাণ জানতে এটি কল করো।",parameters:{type:"object",properties:{date:{type:"string",description:"তারিখ YYYY-MM-DD ফরম্যাটে (ঐচ্ছিক)"}}}},{name:"get_category_expense_breakdown",description:"গত ৩০ দিনে বা নির্দিষ্ট মেয়াদে কোন খাতে (চা-নাস্তা, বেতন, পরিবহন ইত্যাদি) কত খরচ হয়েছে তার শতাংশ ও বিশ্লেষণ জানতে এটি কল করো।",parameters:{type:"object",properties:{days:{type:"number",description:"কত দিনের হিসাব (ডিফল্ট ৩০)"}}}}]}async execute(e,t={}){if(e==="get_category_expense_breakdown"){const i=await H.getCategoryExpenseBreakdown(t.days||30);if(!i||!i.success)return{success:!1,spokenResponse:"খরচের খাত বিশ্লেষণ লোড করা যায়নি।"};const a=ee(i.totalExpenseSum),c=i.categories?.[0]?.category||"অন্যান্য",l=ee(i.categories?.[0]?.totalAmount||0);return{success:!0,spokenResponse:`জি স্যার! গত ${i.days} দিনে মোট খরচ ৳ ${a}। এর মধ্যে সর্বোচ্চ খরচ হয়েছে "${c}" খাতে (৳ ${l})।`,displayData:{type:"category_expense_breakdown",...i}}}const n=await H.getDailyExpenses(t.date||null);return n?{success:!0,spokenResponse:`জি স্যার! আজকের মোট খরচের পরিমাণ হলো ৳ ${ee(n.totalExpense)} (মোট ${n.expenses?.length||0}টি ভাউচার)।`,displayData:{type:"daily_expenses",...n}}:{success:!1,spokenResponse:"আজকের খরচের হিসাব লোড করা যায়নি।"}}}class qb extends Je{constructor(){super({id:"skill_debt_recovery",name:"বকেয়া ও ঋণ আদায় নিয়ন্ত্রণ (Debt Recovery)",description:"মার্কেটের শীর্ষ বাকিদার, দীর্ঘদিন টাকা না দেওয়া অলস গ্রাহক (Dormant Debtors) এবং বিক্রির বিপরীতে টাকা আদায়ের রিকভারি রেট বিশ্লেষণ করে।",triggers:["বাকিদার","দেনাদার","টপ দেনাদার","বকেয়া কার বেশি","বেশি বাকি","অলস বাকিদার","টাকা দেয় না","বাকি আদায়","রিকভারি রেট","আদায় দক্ষতা"]})}getTools(){return[{name:"get_top_debtors",description:"মা মোটরসের সবচেয়ে বেশি বকেয়া থাকা শীর্ষ গ্রাহকদের তালিকা জানতে এটি কল করো।",parameters:{type:"object",properties:{limit:{type:"number",description:"কত জন গ্রাহকের তালিকা (ডিফল্ট ৫)"},zone:{type:"string",description:"নির্দিষ্ট কোনো জোনের নাম (ঐচ্ছিক)"}}}},{name:"get_dormant_customers",description:"যাদের বড় অঙ্কের বকেয়া আছে কিন্তু গত ৩০ বা ৬০ দিন ধরে কোনো লেনদেন বা টাকা জমা দেয়নি তাদের তালিকা জানতে এটি কল করো।",parameters:{type:"object",properties:{daysThreshold:{type:"number",description:"কত দিন নিষ্ক্রিয় (ডিফল্ট ৩০)"}}}},{name:"get_collection_recovery_efficiency",description:"গত ৩০ দিনে মোট বিক্রির তুলনায় কত শতাংশ টাকা আদায় বা কালেকশন হয়েছে তা জানতে এটি কল করো।",parameters:{type:"object",properties:{days:{type:"number",description:"কত দিনের হিসাব (ডিফল্ট ৩০)"}}}}]}async execute(e,t={}){if(e==="get_dormant_customers"){const c=await H.getDormantCustomers(t.daysThreshold||30);if(!c||!c.success)return{success:!1,spokenResponse:"অলস বাকিদারদের তালিকা পাওয়া যায়নি।"};const l=c.dormantCustomers?.length||0,d=c.dormantCustomers?.[0]?.name||"গ্রাহক";return{success:!0,spokenResponse:`জি স্যার! গত ${t.daysThreshold||30} দিনে কোনো পেমেন্ট দেয়নি এমন ${l} জন অলস বাকিদার শনাক্ত হয়েছে। শীর্ষে আছেন ${d}।`,displayData:{type:"dormant_customers",...c}}}if(e==="get_collection_recovery_efficiency"){const c=await H.getCollectionRecoveryEfficiency(t.days||30);return!c||!c.success?{success:!1,spokenResponse:"কালেকশন রিকভারি রেট লোড করা যায়নি।"}:{success:!0,spokenResponse:`জি স্যার! গত ${c.days} দিনে আমাদের কালেকশন রিকভারি রেট হলো ${c.recoveryRate}% (মোট বিক্রি ৳ ${ee(c.totalBilled)}, মোট আদায় ৳ ${ee(c.totalCollected)})।`,displayData:{type:"recovery_efficiency",...c}}}const n=await H.getTopDebtors(t.limit||5,t.zone||null);if(!n||!n.topDebtors)return{success:!1,spokenResponse:"বাকিদারদের তালিকা পাওয়া যায়নি।"};const r=n.topDebtors[0],i=r?.name||"গ্রাহক",a=ee(r?.totalDue||0);return{success:!0,spokenResponse:`জি স্যার! শীর্ষ বাকিদারদের শীর্ষে আছেন ${i}, যার বর্তমান বকেয়া ৳ ${a}।`,displayData:{type:"top_debtors",...n}}}}qe.register(new Mb);qe.register(new Ob);qe.register(new Nb);qe.register(new Lb);qe.register(new $b);qe.register(new Fb);qe.register(new Ub);qe.register(new jb);qe.register(new qb);qe.register(new Bb);qe.register(new xb);qe.register(new Vb);const ve=new Rb,zb=document.getElementById("visualizer-canvas"),we=new Cb(zb);let Ea=!1,Xt=!1,zr=null;function un(){clearTimeout(zr),zr=setTimeout(()=>{ae.isEnabled&&!G.isSpeaking&&!ve.isListening&&!Xt&&ae.resume()},600)}ve.on("onStart",()=>{clearTimeout(zr),ae.pause(),we.setState("listening")});ve.on("onEnd",()=>{Xt=!1,G.isSpeaking||(we.setState("idle"),un())});const Zt=document.getElementById("stop-speech-btn");G.onStart(()=>{clearTimeout(zr),ae.pause(),ve.isListening&&(ve.stop(),jn(!1)),we.setState("speaking"),Zt&&Zt.classList.remove("hidden");const s=document.getElementById("mic-status-text");s&&(s.innerText="জার্ভিস কথা বলছে...")});G.onEnd(()=>{Zt&&Zt.classList.add("hidden");const s=document.getElementById("mic-status-text");s&&!ve.isListening&&!Xt&&(s.innerText='মাইক অন করতে চাপুন বা "জার্ভিস" বলুন'),!ve.isListening&&!Xt&&(we.setState("idle"),un())});Zt&&Zt.addEventListener("click",()=>{G.stop(),Zt.classList.add("hidden"),we.setState("idle");const s=document.getElementById("mic-status-text");s&&(s.innerText='মাইক অন করতে চাপুন বা "জার্ভিস" বলুন'),un()});Ut.syncWithCloud();const Io=document.getElementById("mic-toggle-btn"),Ue=document.getElementById("mic-status-text"),Zi=document.getElementById("transcript-container"),Ds=document.getElementById("manual-command-input"),Wb=document.getElementById("manual-send-btn"),Hb=document.getElementById("skills-list"),Kb=document.getElementById("memory-list"),xn=document.getElementById("drawer-backdrop"),So=document.getElementById("memory-sidebar"),ko=document.getElementById("skills-sidebar"),zl=document.getElementById("toggle-memory-btn"),Wl=document.getElementById("toggle-skills-btn"),Hl=document.getElementById("close-memory-btn"),Kl=document.getElementById("close-skills-btn");function qs(){So&&So.classList.remove("drawer-open"),ko&&ko.classList.remove("drawer-open"),xn&&xn.classList.remove("active")}function ph(s){qs(),s&&s.classList.add("drawer-open"),xn&&xn.classList.add("active")}zl&&zl.addEventListener("click",()=>ph(So));Hl&&Hl.addEventListener("click",qs);Wl&&Wl.addEventListener("click",()=>ph(ko));Kl&&Kl.addEventListener("click",qs);xn&&xn.addEventListener("click",qs);function jn(s){s?(Io.classList.add("active"),Ue.innerText="শুনছি... (Listening)",Ue.classList.add("text-emerald-400")):(Io.classList.remove("active"),Ue.innerText='মাইক অন করতে চাপুন বা "জার্ভিস" বলুন',Ue.classList.remove("text-emerald-400"))}Io.addEventListener("click",async()=>{await G.unlockAudio(),Ea||await Hr(),ve.toggle(),jn(ve.isListening)});let Wr=!1;window.addEventListener("keydown",s=>{s.code==="Space"&&document.activeElement!==Ds&&!Wr&&(Wr=!0,ve.start(),jn(!0))});window.addEventListener("keyup",s=>{s.code==="Space"&&document.activeElement!==Ds&&Wr&&(Wr=!1,ve.stop(),jn(!1))});ve.on("onInterim",s=>{Ue.innerText=`"${s}..."`});ve.on("onFinal",async s=>{if(!(!s||!s.trim())){jn(!1),Ue.innerText=`"${s.trim()}" প্রসেস করছি...`,we.setState("thinking");try{await js.processCommand(s.trim())}finally{!G.isSpeaking&&!ve.isListening&&(Ue.innerText='মাইক অন করতে চাপুন বা "জার্ভিস" বলুন',we.setState("idle")),un()}}});ae.onWake=async({hasCommand:s,command:e,rawTranscript:t})=>{if(console.log("[Main] ⚡ WAKE WORD TRIGGERED:",{hasCommand:s,command:e,rawTranscript:t}),await G.unlockAudio(),s&&e.trim().length>1){Xt=!1,Ue.innerText=`"${e}" প্রসেস করছি...`,we.setState("thinking");try{await js.processCommand(e.trim())}catch(n){console.error("[Main] Wake word command execution error:",n)}finally{!G.isSpeaking&&!ve.isListening&&(Ue.innerText='মাইক অন করতে চাপুন বা "জার্ভিস" বলুন',we.setState("idle")),un()}}else{Xt=!0,Ue.innerText="জি স্যার, শুনছি! বলুন...",we.setState("listening");const n=["জি স্যার, শুনছি!","জি স্যার, বলুন?","জি স্যার, বলুন আমি শুনছি।"],r=n[Math.floor(Math.random()*n.length)];try{await G.speak(r)}catch(i){console.warn("[Main] Voice ack error non-critical:",i)}Ue.innerText="শুনছি স্যার, বলুন...",we.setState("listening"),ve.start(),jn(!0),Xt=!1}};const Ke=document.getElementById("wake-word-toggle-btn"),is=document.getElementById("wake-word-status-label");async function Gb(){if(typeof navigator>"u"||!navigator.permissions||!navigator.permissions.query)return"unknown";try{return(await navigator.permissions.query({name:"microphone"})).state}catch{return"unknown"}}async function Hr(){if(typeof navigator>"u"||!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)return!1;try{return(await navigator.mediaDevices.getUserMedia({audio:!0})).getTracks().forEach(e=>e.stop()),Ea=!0,!0}catch(s){return console.warn("[Main] Microphone access not granted:",s),!1}}function Kr(s,e=ae.isRunning){if(!(!Ke||!is)){if(Ke.classList.remove("active","listening","needs-permission","paused","off"),!s){Ke.classList.add("off"),is.innerHTML="ওয়েক ওয়ার্ড: <strong>বন্ধ</strong> (চালু করতে ক্লিক)",Ke.title="হ্যান্ডস-ফ্রি ওয়েক ওয়ার্ড চালু করতে ক্লিক করুন";return}if(ae.isTemporarilyPaused||G.isSpeaking){Ke.classList.add("paused"),is.innerHTML="ওয়েক ওয়ার্ড: <strong>পজ</strong> (কথা বলছে)",Ke.title="জার্ভিস কথা বলা শেষ হলে আবার স্বয়ংক্রিয়ভাবে সক্রিয় হবে";return}e?(Ke.classList.add("active","listening"),is.innerHTML="ওয়েক ওয়ার্ড: <strong>'জার্ভিস'</strong> সক্রিয় (শুনছি...)",Ke.title='মাইক্রোফোন সক্রিয়! যেকোনো সময় মুখে "জার্ভিস" বা "Jarvis" বলুন।'):(Ke.classList.add("needs-permission"),is.innerHTML="ওয়েক ওয়ার্ড: <strong>চালু করতে ক্লিক করুন</strong>",Ke.title="মাইক্রোফোন পারমিশন দিয়ে ওয়েক ওয়ার্ড চালু করতে এখানে ক্লিক করুন")}}Ke&&Ke.addEventListener("click",async()=>{if(await G.unlockAudio(),ae.isEnabled&&!ae.isRunning){await Hr()&&(ae.start(),ae.playWakeChime()),Kr(ae.isEnabled,ae.isRunning);return}ae.toggle()&&await Hr()&&(ae.start(),ae.playWakeChime()),Kr(ae.isEnabled,ae.isRunning)});ae.onStatusChange=(s,e)=>{Kr(s,e)};async function Qb(){const s=await Gb();console.log("[Main] Initial microphone permission state:",s),s==="granted"?(Ea=!0,ae.isEnabled&&ae.start()):Kr(ae.isEnabled,!1);const e=async()=>{window.removeEventListener("click",e),window.removeEventListener("keydown",e),window.removeEventListener("touchstart",e),await G.unlockAudio(),ae.isEnabled&&!ae.isRunning&&await Hr()&&ae.start()};window.addEventListener("click",e,{once:!0}),window.addEventListener("keydown",e,{once:!0}),window.addEventListener("touchstart",e,{once:!0})}Qb();async function pi(){const s=Ds.value.trim();if(s){Ds.value="",await G.unlockAudio(),Ue.innerText="প্রসেস করছি... (Reasoning)",we.setState("thinking");try{await js.processCommand(s)}finally{!G.isSpeaking&&!ve.isListening&&(Ue.innerText='মাইক অন করতে চাপুন বা "জার্ভিস" বলুন',we.setState("idle")),un()}}}Wb.addEventListener("click",pi);Ds.addEventListener("keydown",s=>{s.key==="Enter"&&pi()});document.querySelectorAll(".prompt-chip").forEach(s=>{s.addEventListener("click",async()=>{const e=s.getAttribute("data-command");if(e){await G.unlockAudio(),Ue.innerText="প্রসেস করছি... (Reasoning)",we.setState("thinking");try{await js.processCommand(e)}finally{!G.isSpeaking&&!ve.isListening&&(Ue.innerText='মাইক অন করতে চাপুন বা "জার্ভিস" বলুন',we.setState("idle")),un()}}})});const gs=document.getElementById("quick-memory-input"),Gl=document.getElementById("quick-memory-btn");async function mh(){if(!gs)return;const s=gs.value.trim();s&&(await Ut.rememberFact(s),gs.value="",qs())}Gl&&Gl.addEventListener("click",mh);gs&&gs.addEventListener("keydown",s=>{s.key==="Enter"&&mh()});js.onMessage(s=>{const e=s.sender==="user",t=document.createElement("div");t.className=`message-bubble ${e?"user-msg":"jarvis-msg"}`;const n=e?'<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="msg-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>':'<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="msg-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>';let r="";e||((s.data?.authRequired||s.text.includes("সাইন ইন")||s.text.includes("লগইন"))&&(r+=`
                <div class="msg-action-row">
                    <button class="msg-action-btn auth-action-btn" onclick="window.triggerGoogleAuth()">
                        <svg width="14" height="14" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                        <span>গুগল দিয়ে এখনই সাইন ইন করুন</span>
                    </button>
                </div>
            `),s.text.includes("সেটিংস")&&(r+=`
                <div class="msg-action-row">
                    <button class="msg-action-btn" onclick="window.triggerAISettings()">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                        <span>AI সেটিংস খুলুন</span>
                    </button>
                </div>
            `),r+=`
            <div>
                <button class="replay-audio-btn" onclick="window.triggerReplay(this)" data-msg="${F(s.text)}" title="ভয়েস পুনরায় শুনুন">
                    <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
                    <span>পুনরায় শুনুন</span>
                </button>
            </div>
        `);const i=!e&&s.data?Yb(s.data):"";t.innerHTML=`
        <div class="msg-header">
            <span class="msg-sender">${n} ${e?"আপনি":"জার্ভিস এক্সিকিউটিভ"}</span>
            <span class="msg-time">${s.time}</span>
        </div>
        <div class="msg-body">${F(s.text)}${i}${r}</div>
    `,Zi.appendChild(t),Zi.scrollTop=Zi.scrollHeight});function Yb(s){if(!s||typeof s!="object")return"";if(s.type==="executive_business_pulse"||s.todayTotalBills!==void 0&&s.todayNetCashFlow!==void 0){const e=(s.activeCustomers||[]).map(t=>`
            <span style="display:inline-block;padding:3px 8px;margin:2px;background:rgba(56,189,248,0.12);border:1px solid rgba(56,189,248,0.25);border-radius:12px;font-size:11px;color:#38bdf8;font-weight:600;">
                <i class="fa-solid fa-user text-xs"></i> ${F(t)}
            </span>
        `).join("");return`
            <div class="financial-data-card" style="border-left: 3px solid #38bdf8;">
                <div class="data-card-header">
                    <span class="data-card-title">
                        <i class="fa-solid fa-chart-line text-sky-400"></i>
                        দৈনিক এক্সিকিউটিভ বিজনেস রিপোর্ট
                    </span>
                    <span class="data-card-badge" style="background:rgba(56,189,248,0.15);border-color:rgba(56,189,248,0.3);color:#38bdf8;">
                        ${F(s.date||"")}
                    </span>
                </div>
                <div class="data-card-grid" style="margin-bottom:8px;">
                    <div class="data-stat-box">
                        <div class="data-stat-label">মোট বিক্রি</div>
                        <div class="data-stat-value debit" style="color:#f87171;font-weight:800;">৳ ${Number(s.todayTotalBills||0).toLocaleString("bn-BD")}</div>
                    </div>
                    <div class="data-stat-box">
                        <div class="data-stat-label">মোট আদায়</div>
                        <div class="data-stat-value credit" style="color:#34d399;font-weight:800;">৳ ${Number(s.todayTotalCollections||0).toLocaleString("bn-BD")}</div>
                    </div>
                    <div class="data-stat-box">
                        <div class="data-stat-label">মোট খরচ</div>
                        <div class="data-stat-value debit" style="color:#f87171;font-weight:800;">৳ ${Number(s.todayTotalExpenses||0).toLocaleString("bn-BD")}</div>
                    </div>
                    <div class="data-stat-box">
                        <div class="data-stat-label">নিট ক্যাশ ফ্লো</div>
                        <div class="data-stat-value" style="color:${Number(s.todayNetCashFlow||0)>=0?"#34d399":"#f87171"};font-weight:800;">৳ ${Number(s.todayNetCashFlow||0).toLocaleString("bn-BD")}</div>
                    </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px;font-size:11.5px;">
                    <div style="background:rgba(255,255,255,0.03);padding:6px 10px;border-radius:6px;border:1px solid rgba(255,255,255,0.06);">
                        <span style="color:#94a3b8;">নগদ ক্যাশ আদায়:</span>
                        <strong class="credit" style="float:right;">৳ ${Number(s.cashCollections||0).toLocaleString("bn-BD")}</strong>
                    </div>
                    <div style="background:rgba(255,255,255,0.03);padding:6px 10px;border-radius:6px;border:1px solid rgba(255,255,255,0.06);">
                        <span style="color:#94a3b8;">ব্যাংক জমা:</span>
                        <strong class="credit" style="float:right;">৳ ${Number(s.bankCollections||0).toLocaleString("bn-BD")}</strong>
                    </div>
                </div>
                ${e?`
                    <div style="margin-top:6px;padding-top:6px;border-top:1px dashed rgba(255,255,255,0.1);">
                        <div style="font-size:11px;color:#94a3b8;margin-bottom:4px;">আজকের সক্রিয় ক্রেতা (${s.activeCustomersCount||0} জন):</div>
                        <div>${e}</div>
                    </div>
                `:""}
            </div>
        `}if(s.type==="ledger_audit_summary"||s.auditedTxnCount!==void 0&&s.isFullySound!==void 0){const e=s.isFullySound,t=(s.corruptSamples||[]).map(n=>`
            <tr>
                <td style="font-weight:700;color:#f87171;">${F(n.customerName)}</td>
                <td style="color:#94a3b8;font-size:10.5px;">${F(n.voucherNo||"-")}</td>
                <td style="color:#e2e8f0;">৳ ${Number(n.expected).toLocaleString("bn-BD")}</td>
                <td class="debit" style="font-weight:800;">৳ ${Number(n.actual).toLocaleString("bn-BD")}</td>
            </tr>
        `).join("");return`
            <div class="financial-data-card" style="border-left: 3px solid ${e?"#10b981":"#ef4444"};">
                <div class="data-card-header">
                    <span class="data-card-title" style="color:${e?"#34d399":"#f87171"};">
                        <i class="fa-solid ${e?"fa-circle-check text-emerald-400":"fa-triangle-exclamation text-red-400"}"></i>
                        লেজার গাণিতিক অডিট রিপোর্ট
                    </span>
                    <span class="data-card-badge" style="background:${e?"rgba(16,185,129,0.15)":"rgba(239,68,68,0.15)"};color:${e?"#34d399":"#f87171"};">
                        ${e?"১০০% নির্ভুল":"গরমিল শনাক্ত"}
                    </span>
                </div>
                <div class="data-card-grid" style="margin-bottom:8px;">
                    <div class="data-stat-box">
                        <div class="data-stat-label">অডিটকৃত লেনদেন</div>
                        <div class="data-stat-value" style="color:#38bdf8;font-weight:800;">${Number(s.auditedTxnCount||0).toLocaleString("bn-BD")} টি</div>
                    </div>
                    <div class="data-stat-box">
                        <div class="data-stat-label">গাণিতিক গরমিল</div>
                        <div class="data-stat-value" style="color:${e?"#34d399":"#f87171"};font-weight:800;">${Number(s.corruptTxnCount||0).toLocaleString("bn-BD")} টি</div>
                    </div>
                </div>
                <div style="font-size:12px;color:#cbd5e1;line-height:1.5;padding:6px 8px;background:rgba(255,255,255,0.03);border-radius:6px;border:1px solid rgba(255,255,255,0.06);">
                    ${F(s.statusMessage||"")}
                </div>
                ${t?`
                <table class="data-card-table" style="margin-top:8px;">
                    <thead>
                        <tr>
                            <th>কাস্টমার</th>
                            <th>ভাউচার</th>
                            <th>প্রত্যাশিত</th>
                            <th>প্রকৃত</th>
                        </tr>
                    </thead>
                    <tbody>${t}</tbody>
                </table>
                `:""}
            </div>
        `}if(s.type==="today_bank_collections"){const e=(s.customerDeposits||[]).map(t=>`
            <tr>
                <td style="font-weight:700;">${F(t.customerName)}</td>
                <td style="color:#38bdf8;">${F(t.bankName)}</td>
                <td class="credit" style="font-weight:800;">৳ ${Number(t.amount).toLocaleString("bn-BD")}</td>
                <td style="color:#94a3b8;font-size:10.5px;">${F(t.voucherNo||"-")}</td>
            </tr>
        `).join("");return`
            <div class="financial-data-card">
                <div class="data-card-header">
                    <span class="data-card-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11m4-11v11m4-11v11m4-11v11m4-11v11"/></svg>
                        আজকের ব্যাংকে জমা
                    </span>
                    <span class="data-card-badge">মোট: ৳ ${Number(s.totalBankDeposit||0).toLocaleString("bn-BD")}</span>
                </div>
                ${e?`
                <table class="data-card-table">
                    <thead>
                        <tr>
                            <th>কাস্টমার</th>
                            <th>ব্যাংক</th>
                            <th>জমা</th>
                            <th>ভাউচার</th>
                        </tr>
                    </thead>
                    <tbody>${e}</tbody>
                </table>
                `:'<div style="font-size:11.5px;color:#94a3b8;text-align:center;padding:6px;">আজকে ব্যাংকে কোনো জমা নেই</div>'}
            </div>
        `}if(s.type==="today_showroom_cash_collections"){const e=(s.customerPayments||[]).map(t=>`
            <tr>
                <td style="font-weight:700;color:#f8fafc;">${F(t.customerName)}</td>
                <td class="credit" style="font-weight:800;">৳ ${Number(t.amount).toLocaleString("bn-BD")}</td>
                <td style="color:#94a3b8;font-size:10.5px;">${F(t.voucherNo||"-")}</td>
                <td class="debit" style="text-align:right;font-weight:600;">৳ ${Number(t.currentDue||0).toLocaleString("bn-BD")}</td>
            </tr>
        `).join("");return`
            <div class="financial-data-card">
                <div class="data-card-header">
                    <span class="data-card-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                        আজকের শোরুম ক্যাশ কালেকশন
                    </span>
                    <span class="data-card-badge" style="background:rgba(16,185,129,0.15);border-color:rgba(16,185,129,0.3);color:#34d399;">নগদ জমা: ৳ ${Number(s.totalCashCollected||0).toLocaleString("bn-BD")}</span>
                </div>
                <div class="data-card-grid" style="margin-bottom:8px;">
                    <div class="data-stat-box"><div class="data-stat-label">মোট নগদ জমা</div><div class="data-stat-value credit">৳ ${Number(s.totalCashCollected||0).toLocaleString("bn-BD")}</div></div>
                    <div class="data-stat-box"><div class="data-stat-label">ক্যাশ খরচ</div><div class="data-stat-value debit">৳ ${Number(s.todayCashExpenses||0).toLocaleString("bn-BD")}</div></div>
                    <div class="data-stat-box"><div class="data-stat-label">নিট ক্যাশ স্থিতি</div><div class="data-stat-value" style="color:#38bdf8;font-weight:800;">৳ ${Number(s.todayNetShowroomCash||0).toLocaleString("bn-BD")}</div></div>
                    <div class="data-stat-box"><div class="data-stat-label">জমা প্রদানকারী</div><div class="data-stat-value" style="color:#e2e8f0;font-weight:800;">${Number(s.customerPaymentsCount||0).toLocaleString("bn-BD")} জন</div></div>
                </div>
                ${e?`
                <table class="data-card-table">
                    <thead>
                        <tr>
                            <th>কাস্টমার</th>
                            <th>নগদ জমা</th>
                            <th>ভাউচার</th>
                            <th style="text-align:right;">অবশিষ্ট বকেয়া</th>
                        </tr>
                    </thead>
                    <tbody>${e}</tbody>
                </table>
                `:'<div style="font-size:11.5px;color:#94a3b8;text-align:center;padding:8px;">আজকে শোরুম ক্যাশে কোনো নগদ জমা নেই</div>'}
            </div>
        `}if(s.type==="weekly_bank_summary"){const e=(s.bankList||[]).map(t=>`
            <tr>
                <td style="font-weight:700;color:#38bdf8;">${F(t.bankName)}</td>
                <td class="credit" style="font-weight:800;">৳ ${Number(t.totalAmount).toLocaleString("bn-BD")}</td>
                <td style="color:#cbd5e1;text-align:right;">${Number(t.transactionCount).toLocaleString("bn-BD")} টি</td>
            </tr>
        `).join("");return`
            <div class="financial-data-card">
                <div class="data-card-header">
                    <span class="data-card-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        গত এক সপ্তাহের ব্যাংক স্থিতি
                    </span>
                    <span class="data-card-badge">সর্বমোট: ৳ ${Number(s.grandTotalBankDeposits||0).toLocaleString("bn-BD")}</span>
                </div>
                <table class="data-card-table">
                    <thead>
                        <tr>
                            <th>ব্যাংক অ্যাকাউন্ট</th>
                            <th>মোট জমা</th>
                            <th style="text-align:right;">লেনদেন</th>
                        </tr>
                    </thead>
                    <tbody>${e}</tbody>
                </table>
            </div>
        `}if(s.name&&s.totalDue!==void 0)return`
            <div class="financial-data-card">
                <div class="data-card-header">
                    <span class="data-card-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                        ${F(s.name)}
                    </span>
                    <span class="data-card-badge" style="background:rgba(239,68,68,0.15);border-color:rgba(239,68,68,0.3);color:#f87171;">বকেয়া: ৳ ${Number(s.totalDue||0).toLocaleString("bn-BD")}</span>
                </div>
                <div class="data-card-grid">
                    ${s.phone?`<div class="data-stat-box"><div class="data-stat-label">মোবাইল</div><div class="data-stat-value" style="font-size:11.5px;">${F(s.phone)}</div></div>`:""}
                    ${s.address?`<div class="data-stat-box"><div class="data-stat-label">ঠিকানা / এলাকা</div><div class="data-stat-value" style="font-size:11.5px;">${F(s.address)}</div></div>`:""}
                </div>
            </div>
        `;if(s.todayNetCashFlow!==void 0)return`
            <div class="financial-data-card">
                <div class="data-card-header">
                    <span class="data-card-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                        আজকের ব্যবসার সারসংক্ষেপ
                    </span>
                    <span class="data-card-badge">নিট ক্যাশ ফ্লো: ৳ ${Number(s.todayNetCashFlow).toLocaleString("bn-BD")}</span>
                </div>
                <div class="data-card-grid">
                    <div class="data-stat-box"><div class="data-stat-label">মোট বিক্রি (চালান)</div><div class="data-stat-value debit">৳ ${Number(s.todayTotalBills||0).toLocaleString("bn-BD")}</div></div>
                    <div class="data-stat-box"><div class="data-stat-label">মোট কালেকশন</div><div class="data-stat-value credit">৳ ${Number(s.todayTotalCollections||0).toLocaleString("bn-BD")}</div></div>
                    <div class="data-stat-box"><div class="data-stat-label">মোট খরচ</div><div class="data-stat-value debit">৳ ${Number(s.todayTotalExpenses||0).toLocaleString("bn-BD")}</div></div>
                    <div class="data-stat-box"><div class="data-stat-label">নিট ক্যাশ স্থিতি</div><div class="data-stat-value credit">৳ ${Number(s.todayNetCashFlow||0).toLocaleString("bn-BD")}</div></div>
                </div>
            </div>
        `;if(s.type==="disambiguation_options"){const e=(s.options||[]).map(t=>`
            <button type="button" class="disambig-option-btn" onclick="window.triggerDisambiguationSelect('${F(String(t.index))}')">
                <span class="disambig-index">${Number(t.index).toLocaleString("bn-BD")}</span>
                <div class="disambig-info">
                    <div class="disambig-name">${F(t.name)}</div>
                    <div class="disambig-sub">${F(t.address||t.zone||"সাধারণ")}</div>
                </div>
                <span class="disambig-badge ${t.totalDue>0?"debit":"credit"}">
                    ${t.totalDue>0?"৳ "+Number(t.totalDue).toLocaleString("bn-BD"):t.totalDue<0?"অগ্রিম ৳ "+Number(Math.abs(t.totalDue)).toLocaleString("bn-BD"):"পরিশোধিত"}
                </span>
            </button>
        `).join("");return`
            <div class="financial-data-card disambig-card">
                <div class="data-card-header">
                    <span class="data-card-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        কাছাকাছি একাধিক কাস্টমার পাওয়া গেছে (${(s.options?.length||0).toLocaleString("bn-BD")} জন)
                    </span>
                </div>
                <div class="disambig-options-list">
                    ${e}
                </div>
                <div class="disambig-footer-hint">মুখে "১", "২" বা এলাকার নাম বলুন, অথবা বাটনে ট্যাপ করুন।</div>
            </div>
        `}if(s.type==="bank_running_balances"){const e=(s.banks||[]).map(t=>`
            <tr>
                <td style="font-weight:700;color:#38bdf8;">${F(t.bankName)}</td>
                <td style="color:#94a3b8;font-size:10.5px;">${F(t.accountNo||"-")}</td>
                <td class="credit" style="font-weight:800;text-align:right;">৳ ${Number(t.currentBalance).toLocaleString("bn-BD")}</td>
            </tr>
        `).join("");return`
            <div class="financial-data-card">
                <div class="data-card-header">
                    <span class="data-card-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11m4-11v11m4-11v11m4-11v11m4-11v11"/></svg>
                        ব্যাংক ও ক্যাশ লাইভ ব্যালেন্স
                    </span>
                    <span class="data-card-badge">মোট তারল্য: ৳ ${Number(s.grandTotalLiquidFunds||0).toLocaleString("bn-BD")}</span>
                </div>
                <table class="data-card-table">
                    <thead>
                        <tr>
                            <th>ব্যাংক</th>
                            <th>হিসাব নং</th>
                            <th style="text-align:right;">বর্তমান ব্যালেন্স</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${e}
                        <tr style="border-top:1px solid rgba(255,255,255,0.1);font-weight:700;">
                            <td style="color:#fbbf24;">শোরুম ক্যাশ ইন হ্যান্ড</td>
                            <td style="color:#94a3b8;font-size:10.5px;">নগদ ক্যাশ</td>
                            <td class="credit" style="text-align:right;">৳ ${Number(s.showroomCashInHand||0).toLocaleString("bn-BD")}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `}if(s.type==="zone_wise_analytics"){const e=(s.zones||[]).slice(0,6).map(t=>`
            <tr>
                <td style="font-weight:700;color:#38bdf8;">${F(t.zoneName)}</td>
                <td style="color:#cbd5e1;">${Number(t.customerCount).toLocaleString("bn-BD")} জন</td>
                <td class="debit" style="font-weight:800;text-align:right;">৳ ${Number(t.totalDue).toLocaleString("bn-BD")}</td>
            </tr>
        `).join("");return`
            <div class="financial-data-card">
                <div class="data-card-header">
                    <span class="data-card-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        জোনভিত্তিক অবশিষ্ট বকেয়া রিপোর্ট
                    </span>
                    <span class="data-card-badge" style="background:rgba(239,68,68,0.15);border-color:rgba(239,68,68,0.3);color:#f87171;">মোট: ৳ ${Number(s.grandTotalDue||0).toLocaleString("bn-BD")}</span>
                </div>
                <table class="data-card-table">
                    <thead>
                        <tr>
                            <th>জোন / এলাকা</th>
                            <th>কাস্টমার</th>
                            <th style="text-align:right;">মোট বকেয়া</th>
                        </tr>
                    </thead>
                    <tbody>${e}</tbody>
                </table>
            </div>
        `}if(s.type==="dormant_customers"){const e=(s.topDormant||[]).map(t=>`
            <tr>
                <td style="font-weight:700;">
                    <div style="color:#f8fafc;">${F(t.name)}</div>
                    <div style="font-size:10.5px;color:#94a3b8;">${F(t.address||t.zone||"সাধারণ")}</div>
                </td>
                <td class="debit" style="font-weight:800;text-align:right;">৳ ${Number(t.totalDue).toLocaleString("bn-BD")}</td>
                <td style="color:#94a3b8;font-size:10.5px;text-align:right;">${F(t.lastPaymentDate||"কখনও দেননি")}</td>
            </tr>
        `).join("");return`
            <div class="financial-data-card">
                <div class="data-card-header">
                    <span class="data-card-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        বকেয়া টাকা দেয়নি এমন কাস্টমার তালিকা (বিগত ${Number(s.thresholdDays).toLocaleString("bn-BD")} দিন)
                    </span>
                    <span class="data-card-badge" style="background:rgba(239,68,68,0.15);border-color:rgba(239,68,68,0.3);color:#f87171;">মোট: ${Number(s.dormantCount).toLocaleString("bn-BD")} জন</span>
                </div>
                <div class="data-card-grid" style="margin-bottom:8px;">
                    <div class="data-stat-box"><div class="data-stat-label">মোট বাকিদার</div><div class="data-stat-value debit">${Number(s.dormantCount||0).toLocaleString("bn-BD")} জন</div></div>
                    <div class="data-stat-box"><div class="data-stat-label">মোট অনাদায়ী বকেয়া</div><div class="data-stat-value debit">৳ ${Number(s.totalDormantDue||0).toLocaleString("bn-BD")}</div></div>
                </div>
                ${e?`
                <table class="data-card-table">
                    <thead>
                        <tr>
                            <th>কাস্টমার ও এলাকা</th>
                            <th style="text-align:right;">অবশিষ্ট বকেয়া</th>
                            <th style="text-align:right;">শেষ পেমেন্ট</th>
                        </tr>
                    </thead>
                    <tbody>${e}</tbody>
                </table>
                `:'<div style="font-size:11.5px;color:#94a3b8;text-align:center;padding:8px;">এই সময়ে বকেয়া অপরিশোধিত কোনো কাস্টমার নেই</div>'}
            </div>
        `}if(s.type==="category_expense_breakdown"){const e=(s.categories||[]).map(t=>`
            <tr>
                <td style="font-weight:700;color:#f87171;">${F(t.category)}</td>
                <td style="color:#cbd5e1;">${Number(t.count).toLocaleString("bn-BD")}টি ভাউচার</td>
                <td class="debit" style="font-weight:800;text-align:right;">৳ ${Number(t.totalAmount).toLocaleString("bn-BD")} (${Number(t.percentage).toLocaleString("bn-BD")}%)</td>
            </tr>
        `).join("");return`
            <div class="financial-data-card">
                <div class="data-card-header">
                    <span class="data-card-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                        খাতওয়ারী খরচের বিশ্লেষণ (বিগত ${Number(s.days).toLocaleString("bn-BD")} দিন)
                    </span>
                    <span class="data-card-badge" style="background:rgba(239,68,68,0.15);border-color:rgba(239,68,68,0.3);color:#f87171;">মোট: ৳ ${Number(s.totalExpenseSum||0).toLocaleString("bn-BD")}</span>
                </div>
                <table class="data-card-table">
                    <thead>
                        <tr>
                            <th>খরচের খাত</th>
                            <th>ভাউচার</th>
                            <th style="text-align:right;">টাকার অংক</th>
                        </tr>
                    </thead>
                    <tbody>${e}</tbody>
                </table>
            </div>
        `}if(s.type==="ledger_audit_summary")return`
            <div class="financial-data-card">
                <div class="data-card-header">
                    <span class="data-card-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                        লেজার অ্যাকাউন্টিং অডিট
                    </span>
                    <span class="data-card-badge" style="background:${s.isFullySound?"rgba(16,185,129,0.15)":"rgba(239,68,68,0.15)"};color:${s.isFullySound?"#34d399":"#f87171"};">
                        ${s.isFullySound?"নিখুঁত ও নিরাপদ":"গরমিল শনাক্ত"}
                    </span>
                </div>
                <div class="data-card-grid">
                    <div class="data-stat-box"><div class="data-stat-label">যাচাইকৃত লেনদেন</div><div class="data-stat-value">${Number(s.auditedTxnCount||0).toLocaleString("bn-BD")} টি</div></div>
                    <div class="data-stat-box"><div class="data-stat-label">গাণিতিক গরমিল</div><div class="data-stat-value ${s.corruptTxnCount>0?"debit":"credit"}">${Number(s.corruptTxnCount||0).toLocaleString("bn-BD")} টি</div></div>
                </div>
                <div style="font-size:11.5px;color:#cbd5e1;padding:4px 2px;">${F(s.statusMessage)}</div>
            </div>
        `;if(s.type==="dubai_deep_audit"){const e=(s.personalHoldings||[]).map(t=>`
            <tr>
                <td style="font-weight:700;color:#38bdf8;">${F(t.name)}</td>
                <td style="color:#cbd5e1;">ব্যক্তিগত হেফাজত</td>
                <td class="credit" style="font-weight:800;text-align:right;">${Number(t.amount).toLocaleString("en-US")} AED</td>
            </tr>
        `).join("");return`
            <div class="financial-data-card">
                <div class="data-card-header">
                    <span class="data-card-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                        দুবাই কন্টেইনার হেফাজত ও এসেট (${s.auditDate})
                    </span>
                    <span class="data-card-badge">মোট এসেট: ${Number(s.totalPhysicalAssets||0).toLocaleString("en-US")} AED</span>
                </div>
                <table class="data-card-table">
                    <thead>
                        <tr>
                            <th>হেফাজতকারী</th>
                            <th>বিবরণ</th>
                            <th style="text-align:right;">দিরহাম (AED)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${e}
                        <tr>
                            <td style="font-weight:700;color:#fbbf24;">নগদ ক্যাশ (Cash in Hand)</td>
                            <td style="color:#cbd5e1;">অফিস ক্যাশ</td>
                            <td class="credit" style="font-weight:800;text-align:right;">${Number(s.cashInHand||0).toLocaleString("en-US")} AED</td>
                        </tr>
                        <tr>
                            <td style="font-weight:700;color:#a855f7;">মেস ফান্ড (Mess Balance)</td>
                            <td style="color:#cbd5e1;">দুবাই মেস</td>
                            <td class="credit" style="font-weight:800;text-align:right;">${Number(s.messBalance||0).toLocaleString("en-US")} AED</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `}if(s.type==="sales_turnover")return`
            <div class="financial-data-card">
                <div class="data-card-header">
                    <span class="data-card-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                        বিক্রয় টার্নওভার বিশ্লেষণ (${Number(s.days||30).toLocaleString("bn-BD")} দিন)
                    </span>
                    <span class="data-card-badge" style="background:rgba(239,68,68,0.15);border-color:rgba(239,68,68,0.3);color:#f87171;">মোট বিক্রি: ৳ ${Number(s.totalSalesSum||0).toLocaleString("bn-BD")}</span>
                </div>
                <div class="data-card-grid" style="margin-bottom:8px;">
                    <div class="data-stat-box"><div class="data-stat-label">মোট বিক্রয় চালান</div><div class="data-stat-value debit">৳ ${Number(s.totalSalesSum||0).toLocaleString("bn-BD")}</div></div>
                    <div class="data-stat-box"><div class="data-stat-label">মোট চালান সংখ্যা</div><div class="data-stat-value" style="color:#38bdf8;">${Number(s.invoiceCount||0).toLocaleString("bn-BD")} টি</div></div>
                    <div class="data-stat-box"><div class="data-stat-label">ক্রেতা সংখ্যা</div><div class="data-stat-value" style="color:#e2e8f0;">${Number(s.buyingCustomersCount||0).toLocaleString("bn-BD")} জন</div></div>
                    <div class="data-stat-box"><div class="data-stat-label">দৈনিক গড় বিক্রি</div><div class="data-stat-value" style="color:#fbbf24;">৳ ${Number(s.dailyAverageSales||0).toLocaleString("bn-BD")}</div></div>
                </div>
                <div style="font-size:10.5px;color:#94a3b8;text-align:right;">সময়কাল: ${F(s.startDate)} থেকে ${F(s.endDate)}</div>
            </div>
        `;if(s.type==="today_sales"){const e=(s.invoices||[]).map(t=>`
            <tr>
                <td style="font-weight:700;">
                    <div style="color:#f8fafc;">${F(t.customerName)}</div>
                    ${t.notes?`<div style="font-size:10px;color:#94a3b8;">${F(t.notes)}</div>`:""}
                </td>
                <td style="color:#38bdf8;font-size:11px;">${F(t.voucherNo||"-")}</td>
                <td class="debit" style="font-weight:800;text-align:right;">৳ ${Number(t.amount).toLocaleString("bn-BD")}</td>
                <td style="text-align:right;font-size:11px;color:#f87171;">৳ ${Number(t.currentDue||0).toLocaleString("bn-BD")}</td>
            </tr>
        `).join("");return`
            <div class="financial-data-card">
                <div class="data-card-header">
                    <span class="data-card-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                        আজকের বিক্রয় চালান (${F(s.date)})
                    </span>
                    <span class="data-card-badge" style="background:rgba(239,68,68,0.15);border-color:rgba(239,68,68,0.3);color:#f87171;">মোট: ৳ ${Number(s.todayTotalBills||0).toLocaleString("bn-BD")}</span>
                </div>
                ${e?`
                <table class="data-card-table">
                    <thead>
                        <tr>
                            <th>কাস্টমার ও বিবরণ</th>
                            <th>চালান নং</th>
                            <th style="text-align:right;">চালানের মূল্য</th>
                            <th style="text-align:right;">বর্তমান ব্যালেন্স</th>
                        </tr>
                    </thead>
                    <tbody>${e}</tbody>
                </table>
                `:'<div style="font-size:11.5px;color:#94a3b8;text-align:center;padding:8px;">আজকে কোনো বিক্রয় চালান কাটা হয়নি</div>'}
            </div>
        `}if(s.type==="top_buyers"){const e=(s.topBuyers||[]).map((t,n)=>`
            <tr>
                <td style="font-weight:700;">
                    <div style="color:#f8fafc;"><span style="color:#38bdf8;">${(n+1).toLocaleString("bn-BD")}.</span> ${F(t.customerName)}</div>
                    <div style="font-size:10px;color:#94a3b8;">${F(t.address||t.zone||"সাধারণ")}</div>
                </td>
                <td class="debit" style="font-weight:800;text-align:right;">৳ ${Number(t.totalPurchases).toLocaleString("bn-BD")}</td>
                <td style="color:#cbd5e1;text-align:center;font-size:11px;">${Number(t.invoiceCount).toLocaleString("bn-BD")} টি</td>
                <td style="text-align:right;font-size:11px;color:#f87171;">৳ ${Number(t.currentDue||0).toLocaleString("bn-BD")}</td>
            </tr>
        `).join("");return`
            <div class="financial-data-card">
                <div class="data-card-header">
                    <span class="data-card-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
                        শীর্ষ ক্রেতা কাস্টমার (বিগত ${Number(s.days||30).toLocaleString("bn-BD")} দিন)
                    </span>
                    <span class="data-card-badge" style="background:rgba(56,189,248,0.15);border-color:rgba(56,189,248,0.3);color:#38bdf8;">সেরা ${(s.topBuyers?.length||0).toLocaleString("bn-BD")} জন</span>
                </div>
                <table class="data-card-table">
                    <thead>
                        <tr>
                            <th>কাস্টমার ও এলাকা</th>
                            <th style="text-align:right;">মোট ক্রয়</th>
                            <th style="text-align:center;">চালান</th>
                            <th style="text-align:right;">অবশিষ্ট বকেয়া</th>
                        </tr>
                    </thead>
                    <tbody>${e}</tbody>
                </table>
            </div>
        `}if(s.type==="recovery_efficiency"){const e=Number(s.recoveryRate||0)>=80;return`
            <div class="financial-data-card">
                <div class="data-card-header">
                    <span class="data-card-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                        কালেকশন রিকভারি দক্ষতা ও শতকরা হার
                    </span>
                    <span class="data-card-badge" style="background:${e?"rgba(16,185,129,0.15)":"rgba(239,68,68,0.15)"};color:${e?"#34d399":"#f87171"};">
                        রিকভারি রেট: ${Number(s.recoveryRate||0).toLocaleString("bn-BD")}%
                    </span>
                </div>
                <div class="data-card-grid">
                    <div class="data-stat-box"><div class="data-stat-label">মোট বিক্রয় (বিল)</div><div class="data-stat-value debit">৳ ${Number(s.totalBilled||0).toLocaleString("bn-BD")}</div></div>
                    <div class="data-stat-box"><div class="data-stat-label">মোট আদায় (জমা)</div><div class="data-stat-value credit">৳ ${Number(s.totalCollected||0).toLocaleString("bn-BD")}</div></div>
                    <div class="data-stat-box"><div class="data-stat-label">রিকভারি শতকরা হার</div><div class="data-stat-value" style="color:${e?"#34d399":"#f87171"};font-weight:800;">${Number(s.recoveryRate||0).toLocaleString("bn-BD")}%</div></div>
                    <div class="data-stat-box"><div class="data-stat-label">বকেয়া বৃদ্ধির গ্যাপ</div><div class="data-stat-value debit">৳ ${Number(s.uncollectedGap||0).toLocaleString("bn-BD")}</div></div>
                </div>
                <div style="font-size:10.5px;color:#94a3b8;margin-top:6px;text-align:right;">হিসাব কাল: বিগত ${Number(s.days||30).toLocaleString("bn-BD")} দিন (${F(s.startDate)} থেকে ${F(s.endDate)})</div>
            </div>
        `}if(s.type==="advance_customers"){const e=(s.topAdvance||[]).map((t,n)=>`
            <tr>
                <td style="font-weight:700;">
                    <div style="color:#f8fafc;"><span style="color:#34d399;">${(n+1).toLocaleString("bn-BD")}.</span> ${F(t.name)}</div>
                    <div style="font-size:10px;color:#94a3b8;">${F(t.address||t.zone||"সাধারণ")}</div>
                </td>
                <td style="color:#94a3b8;font-size:11px;">${F(t.phone||"-")}</td>
                <td class="credit" style="font-weight:800;text-align:right;">৳ ${Number(t.advanceAmount).toLocaleString("bn-BD")}</td>
            </tr>
        `).join("");return`
            <div class="financial-data-card">
                <div class="data-card-header">
                    <span class="data-card-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        অগ্রিম জমাকারী কাস্টমার তালিকা (নেগেটিভ ব্যালেন্স)
                    </span>
                    <span class="data-card-badge" style="background:rgba(16,185,129,0.15);border-color:rgba(16,185,129,0.3);color:#34d399;">মোট অগ্রিম: ৳ ${Number(s.totalAdvanceSum||0).toLocaleString("bn-BD")}</span>
                </div>
                ${e?`
                <table class="data-card-table">
                    <thead>
                        <tr>
                            <th>কাস্টমার ও এলাকা</th>
                            <th>মোবাইল</th>
                            <th style="text-align:right;">অগ্রিম জমা স্থিতি</th>
                        </tr>
                    </thead>
                    <tbody>${e}</tbody>
                </table>
                `:'<div style="font-size:11.5px;color:#94a3b8;text-align:center;padding:8px;">কোনো অগ্রিম জমা নেই</div>'}
            </div>
        `}if(s.type==="specific_bank_statement")return`
            <div class="financial-data-card">
                <div class="data-card-header">
                    <span class="data-card-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11m4-11v11m4-11v11m4-11v11m4-11v11"/></svg>
                        ${F(s.bankName)} স্টেটমেন্ট (বিগত ${Number(s.days||30).toLocaleString("bn-BD")} দিন)
                    </span>
                    <span class="data-card-badge" style="background:rgba(56,189,248,0.15);border-color:rgba(56,189,248,0.3);color:#38bdf8;">ব্যালেন্স: ৳ ${Number(s.currentRunningBalance||0).toLocaleString("bn-BD")}</span>
                </div>
                <div class="data-card-grid">
                    <div class="data-stat-box"><div class="data-stat-label">মোট জমা (ইনফ্লো)</div><div class="data-stat-value credit">৳ ${Number(s.totalInflowsPeriod||0).toLocaleString("bn-BD")}</div></div>
                    <div class="data-stat-box"><div class="data-stat-label">মোট খরচ ও উত্তোলন</div><div class="data-stat-value debit">৳ ${Number(s.totalOutflowsPeriod||0).toLocaleString("bn-BD")}</div></div>
                    <div class="data-stat-box"><div class="data-stat-label">নিট ফান্ড প্রবাহ</div><div class="data-stat-value" style="color:#38bdf8;">৳ ${Number(s.netFlowPeriod||0).toLocaleString("bn-BD")}</div></div>
                    <div class="data-stat-box"><div class="data-stat-label">চলমান লাইভ ব্যালেন্স</div><div class="data-stat-value credit">৳ ${Number(s.currentRunningBalance||0).toLocaleString("bn-BD")}</div></div>
                </div>
                <div style="font-size:10px;color:#94a3b8;margin-top:6px;display:flex;justify-content:space-between;">
                    <span>অ্যাকাউন্ট: ${F(s.accountNo||"সঞ্চয়ী")} (${F(s.branch||"প্রধান শাখা")})</span>
                    <span>${F(s.startDate)} থেকে ${F(s.endDate)}</span>
                </div>
            </div>
        `;if(s.type==="top_inflow_bank"){const e=(s.rankings||[]).map((t,n)=>`
            <tr>
                <td style="font-weight:700;">
                    <div style="color:#38bdf8;"><span style="color:#cbd5e1;">${(n+1).toLocaleString("bn-BD")}.</span> ${F(t.bankName)}</div>
                </td>
                <td class="credit" style="font-weight:800;text-align:right;">৳ ${Number(t.totalDeposits).toLocaleString("bn-BD")}</td>
                <td style="color:#cbd5e1;text-align:center;font-size:11px;">${Number(t.txnCount).toLocaleString("bn-BD")} টি</td>
            </tr>
        `).join("");return`
            <div class="financial-data-card">
                <div class="data-card-header">
                    <span class="data-card-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/><path stroke-linecap="round" stroke-linejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/></svg>
                        ব্যাংক জমা তুলনামূলক র‍্যাংকিং (বিগত ${Number(s.days||30).toLocaleString("bn-BD")} দিন)
                    </span>
                    <span class="data-card-badge" style="background:rgba(16,185,129,0.15);border-color:rgba(16,185,129,0.3);color:#34d399;">শীর্ষ: ${F(s.topBank?.bankName||"")}</span>
                </div>
                <table class="data-card-table">
                    <thead>
                        <tr>
                            <th>ব্যাংক</th>
                            <th style="text-align:right;">মোট জমা</th>
                            <th style="text-align:center;">লেনদেন</th>
                        </tr>
                    </thead>
                    <tbody>${e}</tbody>
                </table>
            </div>
        `}if(s.type==="monthly_net_cashflow"){const e=s.isSurplus;return`
            <div class="financial-data-card">
                <div class="data-card-header">
                    <span class="data-card-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        অপারেটিং নিট ক্যাশফ্লো (বিগত ${Number(s.days||30).toLocaleString("bn-BD")} দিন)
                    </span>
                    <span class="data-card-badge" style="background:${e?"rgba(16,185,129,0.15)":"rgba(239,68,68,0.15)"};color:${e?"#34d399":"#f87171"};">
                        ${e?"উদ্বৃত্ত":"ঘাটতি"}: ৳ ${Number(s.netCashflow||0).toLocaleString("bn-BD")}
                    </span>
                </div>
                <div class="data-card-grid">
                    <div class="data-stat-box"><div class="data-stat-label">মোট কালেকশন (আদায়)</div><div class="data-stat-value credit">৳ ${Number(s.totalInflows||0).toLocaleString("bn-BD")}</div></div>
                    <div class="data-stat-box"><div class="data-stat-label">মোট অফিস খরচ</div><div class="data-stat-value debit">৳ ${Number(s.totalExpenses||0).toLocaleString("bn-BD")}</div></div>
                    <div class="data-stat-box"><div class="data-stat-label">নিট অপারেটিং ক্যাশ</div><div class="data-stat-value ${e?"credit":"debit"}">৳ ${Number(s.netCashflow||0).toLocaleString("bn-BD")}</div></div>
                    <div class="data-stat-box"><div class="data-stat-label">সর্বোচ্চ একক খরচ</div><div class="data-stat-value debit" style="font-size:11px;">৳ ${Number(s.largestExpense?.amount||0).toLocaleString("bn-BD")} (${F(s.largestExpense?.category||"খরচ")})</div></div>
                </div>
                <div style="font-size:10px;color:#94a3b8;margin-top:6px;display:flex;justify-content:space-between;">
                    <span>ক্যাশ: ৳ ${Number(s.cashCollections||0).toLocaleString("bn-BD")} | ব্যাংক: ৳ ${Number(s.bankCollections||0).toLocaleString("bn-BD")}</span>
                    <span>${F(s.startDate)} থেকে ${F(s.endDate)}</span>
                </div>
            </div>
        `}if(s.type==="historical_date_summary"){const e=(s.customerPayments||[]).slice(0,5).map(t=>`
            <tr>
                <td style="font-weight:700;color:#f8fafc;">${F(t.customerName)}</td>
                <td style="color:#38bdf8;font-size:11px;">${F(t.channel)}</td>
                <td class="credit" style="font-weight:800;text-align:right;">৳ ${Number(t.amount).toLocaleString("bn-BD")}</td>
            </tr>
        `).join("");return`
            <div class="financial-data-card">
                <div class="data-card-header">
                    <span class="data-card-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        দৈনিক ব্যবসার পূর্ণাঙ্গ হিসাব (${F(s.date)})
                    </span>
                    <span class="data-card-badge">নিট ক্যাশফ্লো: ৳ ${Number(s.netCashflow||0).toLocaleString("bn-BD")}</span>
                </div>
                <div class="data-card-grid" style="margin-bottom:8px;">
                    <div class="data-stat-box"><div class="data-stat-label">মোট বিক্রি (${Number(s.billCount||0).toLocaleString("bn-BD")}টি)</div><div class="data-stat-value debit">৳ ${Number(s.totalBills||0).toLocaleString("bn-BD")}</div></div>
                    <div class="data-stat-box"><div class="data-stat-label">মোট কালেকশন (${Number(s.paymentCount||0).toLocaleString("bn-BD")}টি)</div><div class="data-stat-value credit">৳ ${Number(s.totalCollections||0).toLocaleString("bn-BD")}</div></div>
                    <div class="data-stat-box"><div class="data-stat-label">মোট খরচ (${Number(s.expenseCount||0).toLocaleString("bn-BD")}টি)</div><div class="data-stat-value debit">৳ ${Number(s.totalExpenses||0).toLocaleString("bn-BD")}</div></div>
                    <div class="data-stat-box"><div class="data-stat-label">নিট উদ্বৃত্ত/ঘাটতি</div><div class="data-stat-value credit">৳ ${Number(s.netCashflow||0).toLocaleString("bn-BD")}</div></div>
                </div>
                ${e?`
                <table class="data-card-table">
                    <thead>
                        <tr>
                            <th>কাস্টমার</th>
                            <th>মাধ্যম</th>
                            <th style="text-align:right;">জমা</th>
                        </tr>
                    </thead>
                    <tbody>${e}</tbody>
                </table>
                `:""}
            </div>
        `}if(s.type==="amount_lookup_result"){const e=s.matchCategory,t=e==="advance",n=e==="due",r=e==="transaction";let i=t?"অগ্রিম জমা অ্যাকাউন্ট":n?"বকেয়া অ্যাকাউন্ট":"লেনদেন ভাউচার",a=t?"rgba(16,185,129,0.15)":n?"rgba(239,68,68,0.15)":"rgba(56,189,248,0.15)",c=t?"#34d399":n?"#f87171":"#38bdf8",l="";if(t||n){const d=(s.allMatches||[]).map(f=>`
                <tr>
                    <td style="font-weight:700;">
                        <div style="color:#f8fafc;">${F(f.name)}</div>
                        <div style="font-size:10px;color:#94a3b8;">${F(f.address||f.zone||"সাধারণ")} | মো: ${F(f.phone||"-")}</div>
                    </td>
                    <td style="color:#cbd5e1;font-size:11px;">${F(f.accountNo||"-")}</td>
                    <td class="${t?"credit":"debit"}" style="font-weight:800;text-align:right;">
                        ৳ ${Number(t?f.advanceAmount:f.totalDue).toLocaleString("bn-BD")}
                    </td>
                </tr>
            `).join("");l=`
                <table class="data-card-table">
                    <thead>
                        <tr>
                            <th>কাস্টমার ও যোগাযোগ</th>
                            <th>হিসাব নং</th>
                            <th style="text-align:right;">${t?"অগ্রিম স্থিতি":"অবশিষ্ট বকেয়া"}</th>
                        </tr>
                    </thead>
                    <tbody>${d}</tbody>
                </table>
            `}else r&&(l=`
                <table class="data-card-table">
                    <thead>
                        <tr>
                            <th>কাস্টমার</th>
                            <th>ভাউচার/চালান</th>
                            <th>তারিখ</th>
                            <th style="text-align:right;">টাকা ও ধরণ</th>
                        </tr>
                    </thead>
                    <tbody>${(s.allMatches||[]).map(f=>`
                <tr>
                    <td style="font-weight:700;color:#f8fafc;">${F(f.customerName)}</td>
                    <td style="font-size:11px;color:#38bdf8;">${F(f.voucherNo||"-")}</td>
                    <td style="font-size:11px;color:#94a3b8;">${F(f.date)}</td>
                    <td class="${f.isPayment?"credit":"debit"}" style="font-weight:800;text-align:right;">
                        ৳ ${Number(f.amount).toLocaleString("bn-BD")} (${f.isPayment?"জমা":"চালান"})
                    </td>
                </tr>
            `).join("")}</tbody>
                </table>
            `);return`
            <div class="financial-data-card">
                <div class="data-card-header">
                    <span class="data-card-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                        রিভার্স অ্যামাউন্ট অনুসন্ধান (৳ ${Number(s.searchedAmount||0).toLocaleString("bn-BD")})
                    </span>
                    <span class="data-card-badge" style="background:${a};border-color:${a};color:${c};">${i}</span>
                </div>
                ${l}
            </div>
        `}if(s.type==="business_demographics"){const e=(s.activeBanks||[]).map(t=>`
            <div style="font-size:11px;color:#cbd5e1;padding:3px 0;display:flex;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.05);">
                <span style="font-weight:600;color:#38bdf8;">${F(t.name)}</span>
                <span style="color:#94a3b8;">হিসাব: ${F(t.accountNo||"-")}</span>
            </div>
        `).join("");return`
            <div class="financial-data-card">
                <div class="data-card-header">
                    <span class="data-card-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                        মা মোটরস সামগ্রিক ব্যবসায়িক পরিসংখ্যান
                    </span>
                    <span class="data-card-badge">মোট কাস্টমার: ${Number(s.totalCustomers||0).toLocaleString("bn-BD")} জন</span>
                </div>
                <div class="data-card-grid" style="margin-bottom:8px;">
                    <div class="data-stat-box"><div class="data-stat-label">বকেয়া দেনাদার</div><div class="data-stat-value debit">${Number(s.debtorCount||0).toLocaleString("bn-BD")} জন</div></div>
                    <div class="data-stat-box"><div class="data-stat-label">অগ্রিম জমাকারী</div><div class="data-stat-value credit">${Number(s.advanceCount||0).toLocaleString("bn-BD")} জন</div></div>
                    <div class="data-stat-box"><div class="data-stat-label">বকেয়ামুক্ত কাস্টমার</div><div class="data-stat-value" style="color:#38bdf8;">${Number(s.zeroDueCount||0).toLocaleString("bn-BD")} জন</div></div>
                    <div class="data-stat-box"><div class="data-stat-label">সক্রিয় ব্যাংক হিসাব</div><div class="data-stat-value" style="color:#e2e8f0;">${Number(s.activeBanksCount||0).toLocaleString("bn-BD")} টি</div></div>
                </div>
                <div class="data-card-grid" style="margin-bottom:8px;">
                    <div class="data-stat-box"><div class="data-stat-label">মোট মার্কেট বকেয়া</div><div class="data-stat-value debit">৳ ${Number(s.totalMarketDue||0).toLocaleString("bn-BD")}</div></div>
                    <div class="data-stat-box"><div class="data-stat-label">মোট অগ্রিম পুঁজি</div><div class="data-stat-value credit">৳ ${Number(s.totalAdvanceSum||0).toLocaleString("bn-BD")}</div></div>
                </div>
                ${e?`
                <div style="margin-top:6px;background:rgba(0,0,0,0.25);border-radius:6px;padding:6px 8px;">
                    <div style="font-size:10px;font-weight:700;color:#94a3b8;margin-bottom:4px;text-transform:uppercase;">সক্রিয় ব্যাংক অ্যাকাউন্টসমূহ</div>
                    ${e}
                </div>
                `:""}
            </div>
        `}return""}function gh(){const s=qe.getAll();Hb.innerHTML=s.map(e=>`
        <div class="skill-card">
            <div class="skill-title">
                <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="text-cyan-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                <span>${F(e.name)}</span>
            </div>
            <div class="skill-desc">${F(e.description)}</div>
            <div class="skill-tags">${e.triggers.map(t=>`<span class="badge">${F(t)}</span>`).join("")}</div>
        </div>
    `).join("")}qe.onChange(gh);gh();function yh(s){Kb.innerHTML=s.map(e=>`
        <div class="memory-card ${e.category}">
            <div class="mem-header">
                <span class="mem-cat">${e.category.toUpperCase()}</span>
                <button class="del-mem-btn" data-id="${e.id}" title="মুছে ফেলুন">&times;</button>
            </div>
            <div class="mem-content">${F(e.content)}</div>
        </div>
    `).join(""),document.querySelectorAll(".del-mem-btn").forEach(e=>{e.addEventListener("click",t=>{const n=t.target.getAttribute("data-id");Ut.deleteMemory(n)})})}Ut.onChange(yh);yh(Ut.memories);window.triggerAISettings=()=>{fh.open()};window.triggerVoiceTest=async()=>{await G.unlockAudio();try{ae&&typeof ae.playWakeChime=="function"&&await ae.playWakeChime()}catch(e){console.warn("Chime trigger error:",e)}we.setState("speaking");const s=document.getElementById("mic-status-text");s&&(s.innerText="🔊 জার্ভিসের সাউন্ড টেস্ট চলছে...");try{await G.speak("আসসালামু আলাইকুম স্যার! আমি জার্ভিস। আপনার মা মোটরসের যাবতীয় হিসাব দেখতে আমি সম্পূর্ণ প্রস্তুত আছি।")}catch(e){console.error("[VoiceTest] Playback error:",e)}finally{ve.isListening||(we.setState("idle"),s&&(s.innerText="মাইক অন করতে চাপুন বা স্পেসবার ধরে কথা বলুন"))}};window.wakeWordListener=ae;window.voiceSpeaker=G;window.triggerDisambiguationSelect=async s=>{const e=document.getElementById("manual-command-input");e&&(e.value=s),await pi()};window.triggerQuickCommand=async s=>{const e=document.getElementById("manual-command-input");e&&(e.value=s),await pi()};window.triggerReplay=async s=>{const e=s.getAttribute("data-msg");if(e){await G.unlockAudio(),we.setState("speaking");const t=document.getElementById("mic-status-text");t&&(t.innerText="জার্ভিস কথা বলছে...");try{await G.speak(e)}finally{ve.isListening||(we.setState("idle"),t&&(t.innerText="মাইক অন করতে চাপুন বা স্পেসবার ধরে কথা বলুন"))}}};const Ql=document.getElementById("test-voice-btn");Ql&&Ql.addEventListener("click",window.triggerVoiceTest);const yr=document.getElementById("voice-selector");if(yr){const s=!!(localStorage.getItem("jarvis_openai_key")||"").trim(),e=localStorage.getItem("jarvis_azure_voice")||"bn-BD-PradeepNeural",t=localStorage.getItem("jarvis_openai_voice")||"onyx";s?(yr.value=t,G.setOpenAIVoice(t),G.setEngine("openai")):(yr.value=e,G.setAzureVoice(e),G.setEngine("azure-neural")),yr.addEventListener("change",n=>{const r=n.target.value;r.startsWith("bn-BD-")?(G.setAzureVoice(r),G.setEngine("azure-neural")):(G.setOpenAIVoice(r),G.setEngine("openai")),console.log("🎙️ [Jarvis Voice] Switched active voice to:",r)})}const At=document.getElementById("auth-btn"),_r=document.getElementById("auth-btn-text"),en=document.getElementById("auth-modal"),Yl=document.getElementById("close-auth-modal"),Jl=document.getElementById("modal-google-btn"),Xl=document.getElementById("email-login-form"),Jb=document.getElementById("login-email"),Xb=document.getElementById("login-password"),be=document.getElementById("auth-error-msg");function Zb(){be&&(be.classList.add("hidden"),be.innerText=""),en&&en.classList.remove("hidden")}function zs(){en&&en.classList.add("hidden")}Yl&&Yl.addEventListener("click",zs);en&&en.addEventListener("click",s=>{s.target===en&&zs()});He&&(async()=>{try{const s=await gv(He);s&&s.user&&(console.log("✅ [Jarvis Auth] Google Redirect sign-in success:",s.user.email),zs())}catch(s){console.warn("Redirect auth result error:",s)}})();async function ew(){if(He)try{await cv(He,Ul),zs()}catch(s){if(console.warn("Google popup sign-in error:",s),s.code==="auth/popup-closed-by-user")return;if(s.code==="auth/popup-blocked"||s.code==="auth/cancelled-popup-request")try{await pv(He,Ul);return}catch(e){console.error("Redirect sign-in error:",e),be&&(be.innerText="গুগল রিডাইরেক্ট ত্রুটি: "+(e.message||"ত্রুটি"),be.classList.remove("hidden"));return}if(s.code==="auth/unauthorized-domain"){const e=window.location.hostname;be&&(be.innerText=`ডোমেইন "${e}" গুগল সাইন-ইনের জন্য অনুমোদিত তালিকায় যুক্ত করতে হবে। তবে আপনি নিচে সরাসরি মা মোটরসের ইমেইল ও পাসওয়ার্ড দিয়ে এখনই নিশ্চিন্তে লগইন করতে পারবেন।`,be.classList.remove("hidden"));return}be&&(be.innerText="লগইন ত্রুটি: "+(s.message||"ত্রুটি"),be.classList.remove("hidden"))}}Jl&&Jl.addEventListener("click",ew);Xl&&Xl.addEventListener("submit",async s=>{s.preventDefault();const e=(Jb?.value||"").trim(),t=(Xb?.value||"").trim();if(!e||!t){be&&(be.innerText="দয়া করে ইমেইল ও পাসওয়ার্ড লিখুন।",be.classList.remove("hidden"));return}const n=document.getElementById("email-login-submit");n&&(n.disabled=!0,n.innerText="যাচাই করা হচ্ছে...");try{await O_(He,e,t),zs(),console.log("✅ [Jarvis Auth] Signed in via Email/Password successfully.")}catch(r){console.warn("Email login error:",r),be&&(r.code==="auth/wrong-password"||r.code==="auth/user-not-found"||r.code==="auth/invalid-credential"?be.innerText="ভুল ইমেইল অথবা পাসওয়ার্ড দিয়েছেন। অনুগ্রহ করে সঠিক তথ্য দিন।":be.innerText="লগইন ব্যর্থ: "+(r.message||"ত্রুটি হয়েছে"),be.classList.remove("hidden"))}finally{n&&(n.disabled=!1,n.innerText="লগইন করুন")}});window.triggerGoogleAuth=async()=>{He&&(He.currentUser?window.confirm(`আপনি কি "${He.currentUser.displayName||He.currentUser.email}" থেকে লগআউট করতে চান?`)&&await j_(He):Zb())};He&&At&&(U_(He,s=>{if(s){const e=s.displayName?s.displayName.split(" ")[0]:s.email?s.email.split("@")[0]:"অ্যাকাউন্ট";_r&&(_r.innerText=e),At.title=`${s.displayName||s.email} হিসেবে সংযুক্ত (ক্লিক করে লগআউট)`,At.style.borderColor="#10b981",At.style.color="#10b981",console.log("✅ [Jarvis Auth] Signed in as:",s.email)}else _r&&(_r.innerText="লগইন"),At.title="লগইন করুন",At.style.borderColor="",At.style.color="",console.log("ℹ️ [Jarvis Auth] User not signed in.")}),At.addEventListener("click",window.triggerGoogleAuth));function F(s){return String(s||"").replace(/[&<>'"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[e]||e)}typeof window<"u"&&window.location.search.includes("show_settings=true")&&setTimeout(()=>{fh.open()},400);console.log("🤖 [Jarvis AI Agent] Core initialized successfully.");
