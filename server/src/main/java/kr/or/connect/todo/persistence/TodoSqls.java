package kr.or.connect.todo.persistence;

public class TodoSqls {
	static final String SELECT_ALL =
			"SELECT id, todo, completed, date FROM todo";
	
	static final String UPDATE_COMPLETED =
			"UPDATE todo SET "
			+ " completed = 1"
			+ " WHERE id = :id";
	
	static final String DELETE_BY_ID =
			"DELETE FROM todo WHERE id= :id";

	static final String DELETE_COMPLETED =
			"DELETE FROM todo where completed= 1";
	
	static final String UPDATE =
			"UPDATE todo SET "
			+ " todo = :todo"
			+ " WHERE id = :id";
}
