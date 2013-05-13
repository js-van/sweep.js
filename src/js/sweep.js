var SWEEP=SWEEP||{};SWEEP.SVGNS="http://www.w3.org/2000/svg";SWEEP.compare=function(a,b){return a.compare(b)};SWEEP.animationSpeed=1;SWEEP.Simulation=function(a){function b(){requestAnimationFrame(b);TWEEN.update()}var c=this;this.width=a;this.sweepActive=!1;this.svg=document.createElementNS(SWEEP.SVGNS,"svg");this.svg.setAttribute("viewBox","-1, -1, 102, 102");this.svg.setAttribute("width",this.width+"px");this.svg.setAttribute("height",this.width+"px");document.body.appendChild(this.svg);bg=document.createElementNS(SWEEP.SVGNS,"rect");bg.setAttribute("x",-1);bg.setAttribute("y",-1);bg.setAttribute("width",102);bg.setAttribute("height",
102);bg.setAttribute("class","bg");this.svg.appendChild(bg);this.sweepline=new SWEEP.Sweepline(this);this.points=new js_cols.RedBlackSet(SWEEP.compare);this.events=new js_cols.RedBlackSet(SWEEP.compare);this.intersections=[];this.addLine(29,42,70,10);this.addLine(70,70,40,22);this.addLine(85,60,20,80);this.addLine(10,32,60,90);this.addLine(25,95,65,4);this.addLine(12,14,22,26);this.addLine(79,7,93,55);this.addLine(67,53,97,44);this.start=document.createElement("div");this.start.innerHTML="Sweep";
this.start.setAttribute("class","button");this.start.addEventListener("click",function(){c.sweep()},!1);document.body.appendChild(this.start);b()};
SWEEP.Simulation.prototype={constructor:SWEEP.Simulation,addPoint:function(a,b,c){a=new SWEEP.Point(this.svg,a,b,!1);a.addLine(c);a.draw();this.points.insert(a);return a},addLine:function(a,b,c,d){var g=new SWEEP.Line(this),a=this.addPoint(a,b,g),c=this.addPoint(c,d,g);g.setPoints(a,c)},sweep:function(){this.sweepActive||(this.sweepActive=!0,this.cleanup(),this.sweepline.sweepNext(this.events.getMin()))},cleanup:function(){this.sweepline.position=0;this.sweepline.setPosition();this.sweepline.status.clear();
this.events.clear();this.events.insertAll(this.points);for(var a=0;a<this.intersections.length;a++)this.intersections[a].remove();this.intersections=[]},onEnd:function(){console.log("\nIntersections:");for(var a=0;a<this.intersections.length;a++)console.log("\t"+this.intersections[a].toString());this.sweepActive=!1;this.sweepline.status.isEmpty()||console.warn("status not empty")}};SWEEP.Sweepline=function(a){this.simulation=a;this.line=document.createElementNS(SWEEP.SVGNS,"line");this.line.setAttribute("x1",0);this.line.setAttribute("x2",100);this.line.setAttribute("class","sweepline");this.simulation.svg.appendChild(this.line);this.position=0;this.setPosition();this.status=new js_cols.RedBlackSet(SWEEP.compare);this.pairs=[]};
SWEEP.Sweepline.prototype={constructor:SWEEP.Sweepline,setPosition:function(){this.line.setAttribute("y1",this.position);this.line.setAttribute("y2",this.position)},eventCall:function(){var a=this.current;if(a.intersection){console.log("Event:"+a.toString()+"; Switching; Status:");var b=this.status.clone();this.status.clear();this.status.insertAll(b);var b=this.status.predecessor(a.lines.getMax()),c=this.status.successor(a.lines.getMin());null!==b&&this.pairs.push([b,a.lines.getMax()]);null!==c&&
this.pairs.push([a.lines.getMin(),c])}else{var d=a.lines.getMin();d.startPoint===a?(console.log("Event:"+a.toString()+"; Adding; Status:"),this.status.insert(d),b=this.status.predecessor(d),c=this.status.successor(d),null!==b&&this.pairs.push([b,d]),null!==c&&this.pairs.push([d,c])):(console.log("Event:"+a.toString()+"; Removing; Status:"),b=this.status.predecessor(d),c=this.status.successor(d),this.status.remove(d),null!==b&&null!==c&&this.pairs.push([b,c]))}this.status.traverse(function(a){console.log("\t"+
a.toString())},this);this.doPairs()},doPairs:function(){0<this.pairs.length?this.intersectionCheck(this.pairs.pop()):this.sweepNext(this.simulation.events.successor(this.current))},intersectionCheck:function(a){var b=a[0],c=a[1];this.action=0;b.line.style.stroke="red";c.line.style.stroke="red";a=b.intersect(c);null!==a&&(a=new SWEEP.Point(this.simulation.svg,a[0],a[1],!0),this.simulation.events.contains(a)||(a.addLine(b),a.addLine(c),a.draw(),this.simulation.events.insert(a),this.simulation.intersections.push(a)));
(new TWEEN.Tween(this)).to({action:100},400*SWEEP.animationSpeed).onUpdate(function(){var a=(50-Math.abs(this.action-50))*0.02+0.5;b.line.style.strokeWidth=a+"px";c.line.style.strokeWidth=a+"px"}).onComplete(function(){b.line.style.stroke="#ccc";c.line.style.stroke="#ccc";this.doPairs()}).start()},sweepNext:function(a){null!==a?(this.current=a,this.sweepTo(a.y,function(){a.animate(this)})):this.sweepTo(100,function(){this.simulation.onEnd()})},sweepTo:function(a,b){(new TWEEN.Tween(this)).to({position:a},
25*(a-this.position)*SWEEP.animationSpeed).onUpdate(function(){this.setPosition()}).onComplete(b).start()}};SWEEP.Line=function(a){this.simulation=a;this.endPoint=this.startPoint=void 0;this.line=document.createElementNS(SWEEP.SVGNS,"line");this.line.setAttribute("class","line");this.simulation.svg.appendChild(this.line)};
SWEEP.Line.prototype={constructor:SWEEP.Line,setPoints:function(a,b){a.y<b.y?(this.startPoint=a,this.endPoint=b):(this.startPoint=b,this.endPoint=a);this.line.setAttribute("x1",this.startPoint.x);this.line.setAttribute("y1",this.startPoint.y);this.line.setAttribute("x2",this.endPoint.x);this.line.setAttribute("y2",this.endPoint.y)},compare:function(a){return this.getSweepIntersection()<a.getSweepIntersection()?-1:a.getSweepIntersection()<this.getSweepIntersection()?1:0},getSweepIntersection:function(){var a=
(this.endPoint.y-this.startPoint.y)/(this.endPoint.x-this.startPoint.x);return(this.simulation.sweepline.position+0.001-(this.endPoint.y-a*this.endPoint.x))/a},intersect:function(a){var b=this.startPoint.x,c=this.startPoint.y,d=this.endPoint.x,g=this.endPoint.y,f=a.startPoint.x,e=a.startPoint.y,h=a.endPoint.x,a=a.endPoint.y,i=(d-b)*(a-e)-(g-c)*(h-f);return 0!==i&&(e=((f-b)*(a-e)-(e-c)*(h-f))/i,f=(b-f+e*(d-b))/(h-f),0<=e&&1>=e&&0<=f&&1>=f)?[b+e*(d-b),c+e*(g-c)]:null},toString:function(){return"{line:["+
this.startPoint.toString()+","+this.endPoint.toString()+"]}"}};SWEEP.Point=function(a,b,c,d){this.svg=a;this.x=b;this.y=c;this.lines=new js_cols.RedBlackSet(SWEEP.compare);this.intersection=d};
SWEEP.Point.prototype={constructor:SWEEP.Point,draw:function(){this.point=document.createElementNS(SWEEP.SVGNS,"circle");this.point.setAttribute("cx",this.x);this.point.setAttribute("cy",this.y);this.point.setAttribute("r",1);this.point.setAttribute("class","point");this.point.style.fill=this.intersection?"#157":"#999";this.svg.appendChild(this.point)},remove:function(){this.svg.removeChild(this.point)},addLine:function(a){this.lines.insert(a)},animate:function(a){this.action=-100;this.point.style.fill=
"red";(new TWEEN.Tween(this)).to({action:100},400*SWEEP.animationSpeed).onUpdate(function(){this.setSize(0.02*(100-Math.abs(this.action))+1)}).onComplete(function(){this.point.style.fill=this.intersection?"#157":"#999";a.eventCall()}).start()},setSize:function(a){this.point.setAttribute("r",a)},toString:function(){return"{x:"+Math.round(100*this.x)/100+",y:"+Math.round(100*this.y)/100+"}"},compare:function(a){return this.y<a.y?-1:a.y<this.y?1:0}};
