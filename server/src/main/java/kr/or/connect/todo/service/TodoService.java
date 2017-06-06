package kr.or.connect.todo.service;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;

import org.springframework.stereotype.Service;

import kr.or.connect.todo.domain.Todo;
import kr.or.connect.todo.persistence.TodoDao;

@Service
public class TodoService {
	private TodoDao dao;
	
	public TodoService(TodoDao dao) {
		this.dao = dao;
	}

	public Todo create(Todo todo) {
		SimpleDateFormat formatter = new SimpleDateFormat ("yyyy-MM-dd hh:mm:ss");
		Calendar cal = Calendar.getInstance();
		String today = formatter.format(cal.getTime());
		Timestamp date = Timestamp.valueOf(today);
		
		//default 값
		todo.setCompleted(0);
		todo.setDate(date);
		
		Integer id = dao.insert(todo);
		todo.setId(id);
		return todo;
	}
	
	public List<Todo> findAll() {
		return dao.selectAll();
	}
	
	public boolean updateCompleted(Integer id) {
		int affected = dao.updateCompleted(id);
		return affected == 1;
	}
	
	public boolean delete(Integer id) {
		int affected = dao.deleteById(id);
		return affected == 1;
	}
	
	public boolean deleteCompleted() {
		int affected = dao.deleteCompleted();
		return affected >= 1;
	}
	
	public boolean update(Todo todo) {
		int affected = dao.update(todo);
		return affected == 1;
	}

}
