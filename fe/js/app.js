(function (window) {

	//Load List
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
        	alert('데이터 로드에 실패하였습니다.');
        }	
	});
	
	//Insert Data
	$('.new-todo').keypress(function(e) { 
		if (e.keyCode == 13){
	        var todo = $('.new-todo').val().trim();
	        if(todo === '') {
	        	alert('문자를 입력하세요');
	        	$('.new-todo').val('');
	        	return;
	        }

	        var obj = new Object();
	        obj.todo = todo; 
	         
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
	            	
	            	//List Size
	            	var size = $('.todo-count').children().first();
	            	size.text(Number(size.text())+1);
	            },
	            error: function(err){
	            	alert('데이터 입력에 실패하였습니다.');
	            }		            
	        });
	    }   
	});
	
	//Update CheckBox
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
					} else alert('데이터 편집에 실패하였습니다.');
				}
			});
		}
	});
	
	//Delete Data
	$(document).on('click', '.destroy', function() { 
		var id = $(this).parent().attr('id');
		var deleted = $(this).parent().parent();
		var checked = $(this).parent().children().first().prop('checked');
		var size = $('.todo-count').children().first();
		
		$.ajax({
			type: 'DELETE',
			url: '/api/todos/'+ id,
			success: function(result){
				if(result) {
					deleted.remove();
					if(!checked) size.text(size.text()-1);
				} else alert('데이터 삭제에 실패하였습니다.');
			}
		});
	});
	
	//Change Filters
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
	
	//Delete Completed
	$(document).on('click', '.clear-completed', function() {
		$.ajax({
			type: 'DELETE',
			url: '/api/todos/',
			success: function(result){
				if(result) {
					$('.todo-list li').each(function() { 
						if($(this).attr('class')==='completed') $(this).remove();
					});
				} else alert('데이터 삭제에 실패하였습니다.');
			}
		});
	});
	
	//Edit Data
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
				if (e.keyCode == 13){
					e.preventDefault();
			        var todo = $(edit).val().trim();
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
			            	} else alert('데이터 편집에 실패하였습니다.');
			            },
			            error: function(err){
			            	alert('데이터 편집에 실패하였습니다.');
			            }		            
			        });
			    }   
			});
		}
	});


})(window);
