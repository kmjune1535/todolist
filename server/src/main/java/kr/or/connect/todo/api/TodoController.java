package kr.or.connect.todo.api;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import kr.or.connect.todo.domain.Todo;
import kr.or.connect.todo.service.TodoService;

@RestController
@RequestMapping("/api/todos")
public class TodoController {

	private final TodoService service;
	private final Logger log = LoggerFactory.getLogger(TodoController.class);
	
	@Autowired
	public TodoController(TodoService service) {
		this.service = service;
	}
	
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	Todo create(@RequestBody Todo todo) {
		Todo newTodo = service.create(todo);	
		log.info("todo created : {}" , newTodo);	
		return todo;
	}
	
	@GetMapping
	List<Todo> readList() {
		List<Todo> list = service.findAll(); 
		return list;
	}
	
	@PutMapping("/{id}/completed")
	@ResponseStatus(HttpStatus.OK)
	boolean updateCompleted(@PathVariable Integer id) {
		return service.updateCompleted(id);
	}
	
	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.OK)
	boolean delete(@PathVariable Integer id) {
		return service.delete(id);
	}
	
	@DeleteMapping
	@ResponseStatus(HttpStatus.OK)
	boolean deleteCompleted() {
		return service.deleteCompleted();
	}
	
	@PutMapping("/{id}")
	@ResponseStatus(HttpStatus.OK)
	boolean update(@PathVariable Integer id, @RequestBody Todo todo) {
		todo.setId(id);
		return service.update(todo);
	}
}
