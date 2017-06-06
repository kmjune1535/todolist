(function (window) {
	'use strict';

	// Your starting point. Enjoy the ride!


	$.ajax({
		type: 'GET',
        url: '/api/todos',
        success: function(responseDataList)
        {
        	var size = responseDataList.length;
        	for ( var i = 0; i < responseDataList.length; i++) {
	        	$('.todo-list').prepend('<li'+(responseDataList[i].completed === 1 ? ' class=\"completed\"' : '')+'>'
	        								+'<div id=\"'+responseDataList[i].id+'\" class=\"view\">'
	        									+'<input class=\"toggle\" type=\"checkbox\"'
	        									+(responseDataList[i].completed === 1 ? ' checked' : '')+'>'
	        									+'<label>'+responseDataList[i].todo+'</label>'
												+'<button class=\"destroy\"></button>'
											+'</div>'
											+'<input class=\"edit\" value=\"'+responseDataList[i].todo+'\">'
										+'</li>');
	        	if(responseDataList[i].completed === 1) {
	        		size--;
	        		$('#'+responseDataList[i].id).children().first().attr('disabled',true);  
	        	}
        	}
        	$('.new-todo').val('');
        	$('.todo-count').children().first().append(size);
        },
        error: function(err){
        	alert('실패');
        }	
	});
	
	$('.new-todo').keypress(function(e) { 
		if (e.keyCode == 13){
	        var todo = $('.new-todo').val().trim();
	        if(todo === '') {
	        	alert('문자를 입력하세요');
	        	$('.new-todo').val('');
	        	return;
	        }

	        var obj = new Object(); // JSON형식으로 변환 할 오브젝트
	        obj.todo = todo; // input의 값을 오브젝트에 저장
	         
	        var json_data = JSON.stringify(obj);

	        $.ajax({
	            type: 'POST',
	            url: '/api/todos',
	            dataType:'json',
	            contentType: 'application/json', 
	            data: json_data,

	            success: function(responseData)
	            {
	            	$('.todo-list').prepend('<li>'
	            								+'<div id=\"'+responseData.id+'\" class=\"view\">'
	            									+'<input class=\"toggle\" type=\"checkbox\">'
	            									+'<label>'+responseData.todo+'</label>'
													+'<button class=\"destroy\"></button>'
												+'</div>'
												+'<input class=\"edit\" value=\"'+responseData.todo+'\">'
											+'</li>');
	            	$('.new-todo').val('');
	            	
	            	var size = $('.todo-count').children().first();
	            	//문자열 추가??
	            	size.text(Number(size.text())+1);
	            },
	            error: function(err){
	            	alert('실패');
	            }		            
	        });
	    }   
	});
	
	$(document).on('click', '.toggle', function(e){ 
		var checkbox = $(this);
		var id = $(this).parent().attr('id');
		var completed = $(this).parent().parent(); 
		var size = $('.todo-count').children().first();
		var notChecked = $(this).prop('checked');
		if(notChecked){
			$.ajax({
				type: 'PUT',
				url: '/api/todos/'+ id + '/completed',
				dataType: 'json',
				success: function(result){
					if(result) {
						checkbox.prop('checked', true);
						checkbox.attr('disabled',true);
						completed.attr('class', 'completed');
						size.text(size.text()-1);
					}
				}
	
			});
		}
	});
	
	$(document).on('click', '.destroy', function() { 
		var id = $(this).parent().attr('id');
		var deleted = $(this).parent().parent();
		var checked = $(this).parent().children().first().prop('checked');
		var size = $('.todo-count').children().first();
		
		$.ajax({
			type: 'DELETE',
			url: '/api/todos/'+ id,
			success: function(result){
				//result===true 체크
				deleted.remove();
				if(!checked) size.text(size.text()-1);
			}
		});
	});
	
	$(document).on('click', '.filters li', function() { 
		var aTag = $(this).children().first();
		$('.selected').removeAttr('class');
		aTag.attr('class', 'selected');
		
		$('.todo-list li').each(function() { 
			$(this).show();
		}); 
		
		var text = aTag.text();

		if(text==='Active'){
			$('.todo-list li').each(function() { 
				if($(this).attr('class')==='completed') $(this).hide();
			}); 
		}else if(text==='Completed'){
			$('.todo-list li').each(function() { 
				if($(this).attr('class')!=='completed') $(this).hide();
			});
		}
	});
	
	$(document).on('click', '.clear-completed', function() {
		$.ajax({
			type: 'DELETE',
			url: '/api/todos/',
			success: function(result){
				$('.todo-list li').each(function() { 
					if($(this).attr('class')==='completed') $(this).remove();
				});
			}
		});
	});
	$(document).on('dblclick', '.todo-list li', function() {
		var $this = $(this);
		var checked = $this.children().first().children().eq(0).prop('checked');
		var label = $this.children().first().children().eq(1);
		var edit = $this.children().eq(1);
		var id = $this.children().eq(0).attr('id');
		$('.todo-list li').each(function() { 
			if($(this).attr('class')==='editing') $(this).removeAttr('class');
		});
		
		if(!checked) {
			$this.attr('class', 'editing');
			
			$(edit).keypress(function(e) { 
				e.preventDefault();
				if (e.keyCode == 13){
			        var todo = $(edit).val();
			        if(todo==='') {
			        	alert('문자를 입력하세요'); 	
			        	return;
			        }

			        var obj = new Object(); // JSON형식으로 변환 할 오브젝트
			        obj.todo = todo; // input의 값을 오브젝트에 저장
			         
			        var json_data = JSON.stringify(obj);

			        $.ajax({
			            type: 'PUT',
			            url: '/api/todos/'+ id,
			            dataType:'json',
			            contentType: 'application/json', 
			            data: json_data,

			            success: function(responseData)
			            {
			            	if(responseData) {
			            		label.text(edit.val());
			            		$this.removeClass('editing');
			            	}
			            },
			            error: function(err){
			            	alert('실패했습니다.');
			            }		            
			        });
			    }   
			});
		}
	});


})(window);
