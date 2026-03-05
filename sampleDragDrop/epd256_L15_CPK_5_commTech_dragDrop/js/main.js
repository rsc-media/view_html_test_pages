//JS for dragDrop using Jquery Helper/cloning claire.griese@riosalado.edu


var draggerArray = [];
var draggerCount = 0;
var parsedID;
var parsedGoal;
var isAccepted=false;
var retiredAry=[];



$(document).ready(function(){

	loadXML();
	populateLabels();
	populateDraggers();
	setTargets();
	

});



function loadXML() {
/*The following code segment loads an XML file of terms and definitions using this format:

	<?xml version="1.0" encoding="utf-8"?>
	<theDraggers>
		<dragger>
			<text>Collar tie</text>
			<target>t0</target>
        </dragger>
	</theDraggers>
	NOTE - if the data is ever not loading, check the XML for proper formatting / broken tags, etc
	make sure to wrap html data in <![CDATA[ ]]>
*/

    $.ajax({
        type: "GET",
        url: "data.xml",
        dataType: "xml",
        cache: false,
        async: false,
        success: function (xml) {
            draggerCount = 0;
            headerLabel = $(xml).find('headerLabel').text();
            directionLabel = $(xml).find('directionLabel').text();
			
			
            $(xml).find('dragger').each(function (i) {
                draggerArray[draggerCount] = {}; 
                draggerArray[draggerCount].txt = $(this).find('text').text().trim();
                draggerArray[draggerCount].goal = $(this).find('target').text().trim();
				
                draggerCount++;
            });

        },
        error: function () {
            alert('Failed to load XML');
        }
    });

}



function populateLabels(){
	
	$('#headerLabel').html(headerLabel);
	$('#directionLabel').html(directionLabel);
	
}



function populateDraggers(){

	var mixed = randomGen(draggerArray.length);

	var dragBlock = '';

	for(i=0;i<draggerArray.length;i++){

		var aDragger = '';
		aDragger = '<div id="dragger'+mixed[i]+'" class="dragger">'+draggerArray[mixed[i]].txt+'</div>';
		dragBlock = dragBlock + aDragger;

	}

    $('#maindiv_all').append(dragBlock);

    var blockArray = $('.dragger').toArray();

    $('#dragHolder').append(blockArray);

   
    $(".dragger")
      .velocity("transition.slideUpIn", { stagger: 50 })
      .delay(750);
  

	$('.dragger').draggable({
		revert:true, 
		revertDuration:250, 
		containment:'#maindiv_all', 
		zIndex:1000, 
		helper:"clone",
		start:function(event, ui){
			if($(this).hasClass('returned')){
					   
				$(this).removeClass('returned'); 
		    }
				   
			if($(ui.helper).hasClass('returned')){
					   
				$(ui.helper).removeClass('returned'); 
			}
			$(this).removeClass('doPress');
			$(ui.helper).removeClass('doPress');
			
			//separate the css for the clone and original
			$(this).addClass('startDrag');
			$(ui.helper).addClass('startDragHelper');

		},
		stop:function(){

			if(isAccepted){
					   
				isAccepted = false;  
				//$(this).removeClass('startDrag');
				
				
			}
			else if(isAccepted === false){
				$(this).removeClass('startDrag');
				$(this).addClass('returned');

				 
			}
		}
	});

	$('.dragger').on('mousedown',function(){


		parsedID = parseInt($(this).attr('id').replace('dragger',''),10);
		parsedGoal = parseInt(draggerArray[parsedID].goal.replace('t',''),10);
	
		
		$(this).addClass('doPress');
		
	
    });

    $('.dragger').on('mouseup',function(){

		$(this).removeClass('doPress');
	
    });


    //set dragHolder height

    //var holderH = $('#dragHolder').height();
    //$('#dragHolder').css('height',holderH + 'px');
    
}



function setTargets(){

	var tArray = $('.dragTarget').toArray();
    for(var i=0;i<tArray.length;i++){

    	
    	$('#'+$(tArray[i]).attr('id')).droppable({
			
			drop:function(event, ui){
				
				var dropID = $(this).attr('id');
				var parsedtID = parseInt(dropID.replace('t',''),10);

				if(parsedtID===parsedGoal){

					isAccepted = true;

					//dragger and clone prop changes
					$('#dragger'+parsedID)
					    .off();

					$('#dragger'+parsedID)
					    .removeClass('startDrag')
					    .addClass('accepted');
					
					$(ui.helper).remove();
					    
					//drop field
					$(this)
						//.addClass('matched')
						//.text($('#dragger'+parsedID).text())
						//.droppable('disable')
						//.append($('#dragger'+parsedID))
						.append($(ui.draggable).clone().addClass('acceptedHelper').removeClass('accepted'));
						


					//completion tracker
				    retiredAry.push(parsedID);
				  
				    setTimeout(function() {
	 
					    if(retiredAry.length === draggerArray.length){
						  
					        getFeedback();
								
				        }
					
				    }, 300);
					

				}

			},
			

        });


    }
	
}



function getFeedback(){


	$("#feedback")
      .velocity("transition.slideLeftIn",
	    {
	        duration:1000,
	      	delay:100,
	      	complete: function(){

		      	$('a.reset').on('click',function(){

				    resetThis();
			    });

	    }
	 

    });
  

}



function resetThis(){
	
	$('#dragHolder').html('');

	$('.dragTarget')
		.droppable('enable')
		.text('')
		.removeClass('matched');

	populateDraggers();
	setTargets();
	
	$('#feedback').css('display','none');

	isAccepted=false;
	retiredAry = [];


}