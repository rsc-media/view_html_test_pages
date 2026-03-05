//JS Utililties claire.griese@riosalado.edu, chris.patrick@riosalado.edu



//browserCheck
//var theName = navigator.appName;
//navAgentResult = navigator.appVersion; //checks for Mozilla version (not specific browsers)
//var ieAlarm = Boolean;
//var splitResult = navAgentResult.split('(')[0];
//var parseResult = parseFloat(splitResult);
//

/*( navigator.sayswho= (function(){
  var N= navigator.appName, ua= navigator.userAgent, tem;
  var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
  if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
  M= M? [M[1], M[2]]: [N, navigator.appVersion,'-?'];
  return M;
 })();
 
function browserCheck() {
//IE version check

	if(parseResult == 5 && theName == "Microsoft Internet Explorer"){
		//for now, let it go either way
		//is this ie7 or ie8?
		ieAlarm = true;
		  
	}
		  
	//ie9 or something else ok
	else{
		  
		ieAlarm = false;
		  
	}

}


*/




//prototypes
String.prototype.trim = function() {//this trims extra spaces before and after a string and converts multi spaces to single spaces
var str = this;
str = str.replace(/\s{2,}/g, ' ');
return str.replace(/^\s+|\s+$/g, "");
}

String.prototype.capitalize = function() { //Capitalize the first letter of a string 
return this.replace(/\S+/g, function(a) { 
return a.charAt(0).toUpperCase() + a.slice(1).toLowerCase(); 
}); 
} 


String.prototype.makeAlphaNum = function() {//removes anything besides numbers or letters 
return this.replace(/[^a-zA-Z0-9]/g, ""); 
} 

String.prototype.noTags = function() {//removes all tags from a string 
return this.replace(/<([^<]*)>/gi, ""); 
}

//randomGen UTILITY
//jQuery.fn.extend({
	function randomGen(value) {
		
		var myChosenLength = value;
		
		var myChosenLengthArray = new Array();
		var myMixedNumbers = new Array();
		
		for(var ibb=0;ibb<myChosenLength;ibb++){
			myChosenLengthArray.push(ibb);
			
		}
		
		var randomNum;
		var tempArray = new Array(); //store value for the check to reject repeat numbers
		var myCheck;
			  
		for (var ic=0; ic<myChosenLength;ic++){
				
			   do{
							
					randomNum = Math.floor(Math.random()*myChosenLength);
					myCheck = tempArray.indexOf(randomNum);
						
			   }
			   while (myCheck > -1);
						
			   if(myCheck == -1){
							  
					myMixedNumbers[randomNum] = myChosenLengthArray[ic];
					tempArray.push(randomNum);
						  
			   }
				  
		}
		   
		return myMixedNumbers;
	
	}

//});





//IE8 only if indexOf method is wanted
//call the function in document.ready or, if the line: function setUpIndexOf() is commented out, it will be ready to call upon without a function call
function setUpIndexOf() {
	
//indexOf prototype for IE8
	if (!Array.prototype.indexOf) {
		  Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
			'use strict';
			if (this == null) {
			  throw new TypeError();
			}
			var n, k, t = Object(this),
				len = t.length >>> 0;
		
			if (len === 0) {
			  return -1;
			}
			n = 0;
			if (arguments.length > 1) {
			  n = Number(arguments[1]);
			  if (n != n) { // shortcut for verifying if it's NaN
				n = 0;
			  } else if (n != 0 && n != Infinity && n != -Infinity) {
				n = (n > 0 || -1) * Math.floor(Math.abs(n));
			  }
			}
			if (n >= len) {
			  return -1;
			}
			for (k = n >= 0 ? n : Math.max(len - Math.abs(n), 0); k < len; k++) {
			  if (k in t && t[k] === searchElement) {
				return k;
			  }
			}
			return -1;
		  };
		}
	
}

//EXTERNAL DATA LOAD EXAMPLE

function loadXML() {
	
	  /*The following code segment loads an XML file of terms and definitions using this format:

		  <?xml version="1.0" encoding="iso-8859-1"?>
		  <activityData>
		  <headerLabel></headerLabel>
		  <directionLabel><![CDATA[ Use the <span class="linkTxt">definition buttons</span> to get details on a term's meaning.  Drag the terms to the best matching fields in the Journal area.]]></directionLabel>
		  
		  
		  <listTitle><![CDATA[Defensive Climate Behaviors]]></listTitle>
		  <listTitle><![CDATA[Supportive Climate Behaviors]]></listTitle>
		  
		  
		  <dragger>
		  <term><![CDATA[Evaluation]]></term>
		  <def><![CDATA[Use of "you" language calls into question the worth of another person.]]></def>
		  <target>target5</target>
		  <whichList>0</whichList>
		  </dragger>
		  
		  </activityData>

	  NOTE - if the data is ever not loading, check the XML for proper formatting / broken tags, etc
	  make sure to wrap html data in <![CDATA[ ]]>
	  */

	$.ajax({
		  type: "GET",
		  url: 'data.xml',
		  dataType: "xml",
		  cache: false,
		  async: false, 
		  success: function(xml) {
		 
		  var listCount = 0;
		  var draggerCount = 0;
		  var quizCount = 0;
		 
		  
		     headerInfo.push($(xml).find('headerLabel').text().trim());
			 headerInfo.push($(xml).find('directionLabel').text().trim());
		     
			 
		     $(xml).find('listTitle').each(function(){
				 
				    listArray[listCount] = {};
				    listArray[listCount].title = $(this).text().trim();
				    listCount++;
			 
			 });
				 	
					
			 $(xml).find('dragger').each(function() {
						
						draggerInfo[draggerCount] = {};
						
						draggerInfo[draggerCount].term = $(this).find('term').text().trim();
						draggerInfo[draggerCount].def = $(this).find('def').text().trim();
						draggerInfo[draggerCount].target = $(this).find('target').text().trim();
						draggerInfo[draggerCount].list = parseInt(($(this).find('whichList').text().trim()),10);
						draggerCount++;
			  
			  });
					
			  
			  $(xml).find('quiz').each(function() {
				  
						quizInfo[quizCount] = {};
						quizInfo[quizCount].title = $(this).children('quizTitle').text().trim();
						quizInfo[quizCount].img = $(this).children('quizImg').text().trim();
						quizInfo[quizCount].text = $(this).children('quizText').text().trim();
						quizCount++;
				  
			  });
			 
		      
			
			},
			error: function() {
				alert('Failed to load XML');
			  }
			
			});
		
		
	
}


/*
function appendCSS(){
	
	if(addCSS.length > 0){
	
	$('head').append('"'+addCSS+'"');
	
	}
	
}

*/


/////////////////////////////////////////////////////////////////////////
