function isBlacklisted(arr,arg)
{
	for(var k=0; k < arr.length; k++)
	{
		if(arr[k] === arg){	
			return true;
		}
	}
	return false;
}

function refresh()
{
	for(var m=1; m<=5; m++)
	{
		for(var n=0; n<=9; n++)
		{
			var source = document.getElementById(n + "" + m + "0");
			source.classList.remove(source.className);
			source.classList.add("Header-"+m);
		}
	}
	
}
function OnSubmit()
{
	
	var blacklist = []; //create blacklist array to prevent role being called again
	var selector = []; //create selection array to select valid candidates
	
	refresh();
	
	for(var i=1; i<=5; i++) //Scans roles
	{
		selector = [];
		
		for(var j=0; j<=9; j++) //Scans names
		{
			var status = document.getElementById(j+""+i).checked;
			
			if(status)
			{
				if(!isBlacklisted(blacklist,j)) //not on blacklist
				{
					selector.push(j); //push the slot
				}
			}
		
		}
		
		//Select the new value from candidates
		if(selector.length > 0)
		{
			var result = selector[Math.floor(Math.random() * (selector.length))];
			var target = document.getElementById(result + "" + i + "0");
			target.classList.remove(target.className);
			target.classList.add("Header-6");
			blacklist.push(result);
		}
		
	}
	
	//clear blacklist array
}