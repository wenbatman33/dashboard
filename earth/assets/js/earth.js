// var API = "../data/EarthDataJson_1.json";
var API = Dashboard.url.earth  //"http://172.16.81.11/dashboard/webapi/helpmessagelog/1/getcurrent?recordDate=2016-05-25&recordHour=21";
console.log(Dashboard.url.earth);
// var rotationNum=0.0005;
var rotationNum=0;
var earthLights = THREE.ImageUtils.loadTexture('img/earth-lights.jpg'),
    earthBump = THREE.ImageUtils.loadTexture('img/earth-bump.jpg'),
    el = document.getElementById('container'),
    lines = [],
    mouse = {x: 0,y: 0},
    mouseOnDown = {x: 0, y: 0},
    rotation = {x: 0,y: Math.PI / 6},
    target = {x: 0,y: Math.PI / 6},
    targetOnDown = {x: 0,y: 0},
    distance =450,
    PI_HALF = Math.PI / 2,
    pointRadius=152,
    radius = 150,
    w = window.innerWidth;
    h = window.innerHeight;
    camera = new THREE.PerspectiveCamera(distance / 10, w / h, 1, distance * 2)
    scene = new THREE.Scene(),
    renderer = new THREE.WebGLRenderer(),
    center = new THREE.Vector3(0, 0, 0),
    geometry = new THREE.SphereGeometry(radius, 40, 40);
//燈光
var earthGeometry = new THREE.SphereGeometry(radius, 40, 40);
var earthMaterial = new THREE.MeshPhongMaterial({
  bumpMap: earthBump,
  bumpScale: 4,
  emissiveMap: earthLights,
  emissive: '#ffffff',
  map: earthLights,
  specular: '#ffffff'
});
var shaders = {
  'atmosphere': {
    uniforms: {},
    vertexShader: ['varying vec3 vNormal;', 'void main() {', 'vNormal = normalize( normalMatrix * normal );', 'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );', '}'].join('\n'),
    fragmentShader: ['varying vec3 vNormal;', 'void main() {', 'float intensity = pow( 0.8 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 3.0 );', 'gl_FragColor = vec4( 20,20, 20, 0.06 ) * intensity;', '}'].join('\n')
  }
};
var atmosphereMaterial = new THREE.ShaderMaterial({
  vertexShader: shaders['atmosphere'].vertexShader,
  fragmentShader: shaders['atmosphere'].fragmentShader,
  side: THREE.BackSide,
  blending: THREE.AdditiveBlending,
  transparent: true
});
var atmosphere = new THREE.Mesh(earthGeometry, atmosphereMaterial);
atmosphere.scale.set(1.5,1.5,1.5);
//地球
var sphere = new THREE.Mesh(geometry, earthMaterial);
var starGeometry = new THREE.Geometry();
for (var i = 0; i < 3000; i++) {
  var x = -1 + Math.random() * 2;
  var y = -1 + Math.random() * 2;
  var z = -1 + Math.random() * 2;
  var d = -1 / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
  x *= d;
  y *= d;
  z *= d;
  var vertex = new THREE.Vector3(x * distance, y * distance, z * distance);
  starGeometry.vertices.push(vertex);
}
var stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({
  color: '#333333',
  size: 1
}));
var restTimer,timer;
var gapx,gapy;
var onTouch=false;
function init() {
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.autoClear = true;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // Composer 效果
  composer = new THREE.EffectComposer(renderer);
  composer.addPass(new THREE.RenderPass(scene, camera));
  // var effectBloom = new THREE.BloomPass(1);
  var effectFilm = new THREE.FilmPass(0.1, 0.1, 2048, 0);
  var effectShift = new THREE.ShaderPass(THREE.RGBShiftShader);
  effectShift.uniforms['amount'].value = 0.0005;
  effectShift.renderToScreen = true;
  composer.addPass(effectFilm);
  // composer.addPass(effectShift);
  el.appendChild(renderer.domElement);
  scene.add(sphere);
  scene.add(atmosphere);
  scene.add(camera);
  camera.position.z = 5;
  el.addEventListener('mousedown', onMouseDown, false);
  el.addEventListener('touchstart', onTouchStart, false);
  window.addEventListener('resize', onWindowResize, false);
  wheel(wheelUp, wheelDown);
  render();
}
// -------------------------------------
//   觸碰控制項
// -------------------------------------
function onTouchStart(event) {
  event.preventDefault();
  //alert("onTouchstart");
  el.addEventListener('touchmove', onTouchMove, false);
  el.addEventListener('touchend', onTouchEnd, false);
  mouseOnDown.x = -event.changedTouches[0].clientX;
  mouseOnDown.y = event.changedTouches[0].clientY;
  targetOnDown.x = target.x;
  targetOnDown.y = target.y;
  onTouch=true;
  clearTimeout(timer);
  clearTimeout(restTimer);
}
function onTouchMove(event) {
  event.preventDefault();
  mouse.x = -event.changedTouches[0].clientX;
  mouse.y = event.changedTouches[0].clientY;
  target.x = targetOnDown.x + (mouse.x - mouseOnDown.x) * 0.005;
  target.y = targetOnDown.y + (mouse.y - mouseOnDown.y) * 0.005;
  target.y = target.y > PI_HALF ? PI_HALF : target.y;
  target.y = target.y < -PI_HALF ? -PI_HALF : target.y;
}
function onTouchEnd(event) {
  event.preventDefault();
  onTouch=false;
  timer = setTimeout(lookatPoint, 1000);
}
// -------------------------------------
//   滑鼠控制項
// -------------------------------------
function onMouseDown(event) {
  event.preventDefault();
  el.addEventListener('mouseup', onMouseUp, false);
  el.addEventListener('mousemove', onMouseMove, false);
  el.addEventListener('mouseout', onMouseOut, false);
  mouseOnDown.x = -event.clientX;
  mouseOnDown.y = event.clientY;
  targetOnDown.x = target.x;
  targetOnDown.y = target.y;
  el.style.cursor = 'move';
  clearTimeout(timer);
  clearTimeout(restTimer);
}
function onMouseMove(event) {
  event.preventDefault();
  mouse.x = -event.clientX;
  mouse.y = event.clientY;
  target.x = targetOnDown.x + (mouse.x - mouseOnDown.x) * 0.005;
  target.y = targetOnDown.y + (mouse.y - mouseOnDown.y) * 0.005;
  target.y = target.y > PI_HALF ? PI_HALF : target.y;
  target.y = target.y < -PI_HALF ? -PI_HALF : target.y;
}
function onMouseUp(event) {
  event.preventDefault();
  el.removeEventListener('mousemove', onMouseMove, false);
  el.removeEventListener('mouseup', onMouseUp, false);
  el.removeEventListener('mouseout', onMouseOut, false);
  el.style.cursor = 'auto';
  timer = setTimeout(lookatPoint, 1000);
}
function onMouseOut(event) {
  event.preventDefault();
  el.removeEventListener('mouseup', onMouseUp, false);
  el.removeEventListener('mouseout', onMouseOut, false);
}
// -------------------------------------
function onWindowResize(event) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function wheel(upFn, downFn) {
    window.onmousewheel = getWheelDalta;
    if (window.addEventListener) {
        window.addEventListener("DOMMouseScroll", getWheelDalta, false);
    }
    function getWheelDalta(event) {
        var event = event || window.event;
        var delta = 0;
        if (event.wheelDelta) {
            delta = event.wheelDelta / 120;
            if (window.opera) delta = -delta;
        } else if (event.detail) {
            delta = -event.detail / 3;
        }
        if (delta > 0) {
            upFn();
        } else {
            downFn();
        }
        prevent(event);

        function prevent(evt) {
            if (evt.preventDefault) {
                evt.preventDefault();
            } else {
                evt.returnValue = false;
            }
        }
    }
}
function wheelUp() {
  distance+=3;
  if(distance>=600){
    distance=600;
  }
}
function wheelDown() {
  distance-=3;
  if(distance<=240){
    distance=240;
  }
}

function render() {
  if (el.style.cursor != 'move' | onTouch==true){
    target.x += rotationNum;
  }
  gapx=target.x-rotation.x;
  gapy=target.y-rotation.y;
  if(Math.abs(gapx)>10){
    gapx-=10;
  }
  rotation.x += gapx * 0.1;
  rotation.y += gapy * 0.1;
  camera.position.x = distance * Math.sin(rotation.x) * Math.cos(rotation.y);
  camera.position.y = distance * Math.sin(rotation.y);
  camera.position.z = distance * Math.cos(rotation.x) * Math.cos(rotation.y);
  camera.lookAt(center);
  renderer.render(scene, camera);
  composer.render();
  requestAnimationFrame(render);
}
function _toRadians(degrees) {
    return degrees * (Math.PI / 180);
}
function _toDegrees(radians) {
    return radians * 180 / Math.PI;
}
init();
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
function lookatPoint() {
  point.position.set(points[currentNum].position.x, points[currentNum].position.y, points[currentNum].position.z);
  point.material.color.setHex(0xffa200);
  point.material.opacity=0.9;
  point.scale.x = 2.5; // SCALE
  point.scale.y = 2.5; // SCALE
  point.scale.z = 2.5; // SCALE
  target.x=Number(1.6+(data[currentNum].long* Math.PI / 180));
  target.y=Number((data[currentNum].lat* Math.PI / 180));
  ////////////////////////////////////////
  //顯示的訊息.////////////////////////////
  $("#time").html( 'Taipei time ' + new DateTimeUtility(data[currentNum].date).AddHours(-8).getDateTime().format("yyyy-mm-dd HH:MM:ss"));
  $("#fname").html(data[currentNum].message);
  var cityStr='<i class="fa fa-map-marker fa-3x" aria-hidden="true"></i> '
  $("#city").html(cityStr+data[currentNum].city);

  ////////////////////////
  currentNum+=1;
  if(currentNum>=totalNum){
    currentNum=0;
  }
  restTimer = setTimeout(resetPoint, 5000);
  // setTimeout(resetPoint, 5000);
}
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

// var API = "http://www.tutorabc.com/aspx/GTRWebService/DataRequest.aspx?dataquery=client_attend_list_s&rnd=78";
var data =[];
var points = [];
var geometry_1;
var geometry_2;
var curveObject;
var curveObject2;
var point_2;
var currentNum = 0;
var totalNum;
$.getJSON( API, {}).done(function( JSONdata ) {
  data = JSONdata.data;
  loop();
});
var _loop = function (i) {
  points.push(new setPoint(data[i].lat, data[i].long, 3, i));
};
var materialIndex = Math.floor(Math.random() * 10);
function loop() {
  for (var i = 0; i < data.length; i++) {
    totalNum= data.length;
    _loop(i);
    point.position.set(points[i].position.x, points[i].position.y, points[i].position.z);
    scene.add(point);
  }

   timer = setTimeout(lookatPoint, 2000);
}

/////////////////////////////////////////
function latLongToVector3(lat, lon, r) {
  // http://www.smartjava.org/content/render-open-data-3d-world-globe-threejs
  var phi = lat * Math.PI / 180;
  var theta = (lon - 180) * Math.PI / 180;
  var x = -r * Math.cos(phi) * Math.cos(theta);
  var y = r * Math.sin(phi);
  var z = r * Math.cos(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}
function setPoint(lat, lng, r, i) {
  var position = latLongToVector3(lat, lng, radius);
  var pointGeometry = new THREE.SphereGeometry(r, 20, 20);
  var pointMaterial = new THREE.MeshBasicMaterial({
    color: '#ff0000',
    opacity: .5,
    side: THREE.DoubleSide,
    transparent: true
  });
  point = new THREE.Mesh(pointGeometry, pointMaterial);
  point.position.set(position.x, position.y, position.z);
  point.scale.set(1,1,1);
  return point;
}
function resetPoint() {
  $("#time").html('');
  $("#fname").html('');
  $("#city").html('');
  timer = setTimeout(lookatPoint, 1000);
  // setTimeout(lookatPoint, 1000);
}
function transformNum(num) {
  var TN;
  TN=(num%18.5);
  return TN ;
}
$("#Asia").click(function(){  goto('Asia');});
$("#NorthAmerica").click(function(){  goto('NorthAmerica');});
$("#SouthAmerica").click(function(){  goto('SouthAmerica');});
$("#Europe").click(function(){  goto('Europe');});
$("#Australia").click(function(){  goto('Australia');});
function goto(area) {
  if(area=='Asia'){
    target.x= -2.8;
    target.y= 0.63;
  }else if(area=='NorthAmerica'){
    target.x= 0.030;
    target.y= 0.52;
  }else if(area=='SouthAmerica'){
    target.x=0.61;
    target.y=-0.375;
  }else if(area=='Europe'){
    target.x= -4.5;
    target.y=0.73;
  }else if(area=='Australia'){
    target.x=-2.4;
    target.y=-0.375;
  }
}
