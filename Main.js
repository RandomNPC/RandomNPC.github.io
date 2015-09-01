function Point(x,y)
{
	this.x = x;
	this.y = y;
}

function Bounds(PointA,PointB)
{
	this.PointA = PointA;
	this.PointB = PointB;
}

function Node(name,priority,bounds,circle)
{
	this.name = name;
	this.visited = false;
	this.priority = priority;
	this.bounds = bounds;
	this.selected = false;
	this.circle = circle;
}

function AddNode(name,priority,x1,y1,x2,y2,circleX,circleY)
{
	locations.push(new Node(name,priority,new Bounds(new Point(x1,y1),new Point(x2,y2)),new Point(circleX,circleY)));
	
}

function Clicked(clickedX,clickedY,PointA,PointB)
{
	if(clickedX < PointA.x || clickedX > PointB.x)
	{
		return false;
	}
	else if(clickedY > PointA.y || clickedY < PointB.y)
	{
		return false;
	}
	else {
		return true;
	}
}

function Evaluate()
{
	for(var k = 0; k < locations.length; k++)
	{
		var iter = locations[k];
		if(iter.selected)
		{
			list.push(iter);
		}
	}
	
	var originX = 705;
	var originY = 484;
	
	//start
	for(var p = 0; p < 60; p++)
	{
		var lowest = 10;
		//Find lowest number not visited yet
		for(var k = 0; k < list.length; k++)
		{
			var iter = list[k];
			if(iter.visited == false){
				if(iter.priority <= lowest)
				lowest = iter.priority;
			}
			else
			{
				var index = list.indexOf(iter);
				if (index > -1) {
				list.splice(index, 1);
}
			}
		}
		var j = 0;
		
		for(var k = 0; k < list.length; k++)
		{
			var iter = list[k];
			if(iter.visited == false)
			{
				j++;
			}
		}
		if(j <= 0) break;
		
		
		var next = 0;
		var highest = 99999;
		for(var k = 0; k < list.length; k++)
		{
			var iter = list[k];
			var distance = Math.sqrt(Math.pow(originX - iter.circle.x, 2) + Math.pow(originY - iter.circle.y, 2) );
			if(distance <= highest)
			{
				if(iter.priority <= lowest){
					next = iter;
					highest = distance;
				}
			}
		}
		next.visited = true;
		var c = document.getElementById("canvas");
		var ctx=c.getContext("2d");
		ctx.lineWidth = 5;
		ctx.fillStyle = "#CC0066";
		ctx.beginPath();
		ctx.moveTo(originX,originY);
		ctx.lineTo(next.circle.x,next.circle.y);
		ctx.stroke();
		
		originX = next.circle.x;
		originY = next.circle.y;
	}
	
	
}

var locations = [];
var list = [];

window.addEventListener('load',main,false);




function main()
{
	window.addEventListener('touchstart',onTouchStart,false);
	var c = document.getElementById("canvas");
	window.addEventListener('click',MouseClicked,false);
	window.addEventListener('touchend', CallEval,false);
	var ctx=c.getContext("2d");
	
	function onTouchStart(e){
		
		for(var i = 0; i < locations.length; i++)
		{
			var loc = locations[i];
			var state = Clicked(e.changedTouches[0].clientX,e.changedTouches[0].clientY,loc.bounds.PointA,loc.bounds.PointB);
			if(state)
			{
				if(loc.selected)
				{
					ctx.fillStyle = "#003399";
					loc.selected = false;
				}
				else
				{
					ctx.fillStyle = "#FFFF00";
					loc.selected = true;
				}
				ctx.beginPath();
				ctx.arc(loc.circle.x,loc.circle.y,25,0,2*Math.PI);
				ctx.fill();

			}
		}
		
		e.preventDefault();
	}
	
	function CallEval(e)
	{
		var canvas = document.getElementById('canvas');
		if(e.changedTouches[0].clientX >= canvas.width) Evaluate();
	
		e.preventDefault();
	}
	
	function MouseClicked(e)
	{
	
		for(var i = 0; i < locations.length; i++)
		{
			var loc = locations[i];
			var state = Clicked(e.clientX,e.clientY,loc.bounds.PointA,loc.bounds.PointB);
			if(state)
			{
				if(loc.selected)
				{
					ctx.fillStyle = "#003399";
					loc.selected = false;
				}
				else
				{
					ctx.fillStyle = "#FFFF00";
					loc.selected = true;
				}
				ctx.beginPath();
				ctx.arc(loc.circle.x,loc.circle.y,25,0,2*Math.PI);
				ctx.fill();

			}
		}
	}
	
	AddNode("Lunar Isle",1,4,140,95,92,93,31);
	AddNode("Relleka",0,220,158,316,34,362,58);
	AddNode("Piscatoris",0,56,303,200,218,239,222);
	AddNode("Isafdar",2,82,428,183,338,211,423);
	AddNode("Ardougne",0,18,572,172,469,382,509);
	AddNode("South Ardougne",0,200,740,345,599,382,674);
	AddNode("Barbarian Outpost",0,349,294,514,244,314,267);
	AddNode("Ape Atoll",2,362,818,450,777,508,805);
	AddNode("Draynor",0,511,555,648,392,705,484);
	AddNode("Karamja",0,607,757,737,649,571,657);
	AddNode("Burthrope",0,592,203,754,77,604,246);
	AddNode("Mortaynia",1,1103,404,1201,340,1020,386);
	AddNode("Port Phasmatys",1,1050,251,1193,185,1200,274);
	AddNode("Keldagrim",2,790,355,891,301,765,281);
	AddNode("Dogesh-Kaan",2,765,604,880,553,810,519);
	AddNode("Desert",0,971,702,1092,594,925,661);
	AddNode("Al Kaharid",0,974,563,1134,464,911,489);
	
	AddNode("Gnome Stronghold",1,336,411,502,365,315,333);
	AddNode("Varrock",0,680,415,772,325,820,383);
	AddNode("Zanaris",1,657,605,731,562,758,500);
	AddNode("Mos Le Harmless",3,881,253,1026,192,1118,297);
	
	
	for(var i = 0; i < locations.length; i++)
	{
		var loc = locations[i];
		ctx.fillStyle = "#003399";
		ctx.beginPath();
		ctx.arc(loc.circle.x,loc.circle.y,25,0,2*Math.PI);
		ctx.fill();
	}
	
	
}