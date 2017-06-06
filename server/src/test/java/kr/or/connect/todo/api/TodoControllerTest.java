package kr.or.connect.todo.api;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

@RunWith(SpringRunner.class)
@SpringBootTest
@Transactional
public class TodoControllerTest {

	@Autowired
	WebApplicationContext wac;
	MockMvc mvc;
	
	@Before
	public void setUp() {
		this.mvc = webAppContextSetup(this.wac)
			.alwaysDo(print(System.out))
			.build();
	}
	
	@Test
	public void shouldCreate() throws Exception {
		String requestBody = "{\"todo\":\"부스트캠프\"}";
		
		mvc.perform(
			post("/api/todos/")
				.contentType(MediaType.APPLICATION_JSON)
				.content(requestBody)
			)
			.andExpect(status().isCreated())
			.andExpect(jsonPath("$.id").exists())
			.andExpect(jsonPath("$.todo").value("부스트캠프"))
			.andExpect(jsonPath("$.completed").value(0));
	}
	
	@Test
	public void shouldSelect() throws Exception {
		mvc.perform(
				get("/api/todos/")
					.contentType(MediaType.APPLICATION_JSON)
				)
				.andExpect(status().isOk());
	}
	
	@Test
	public void shouldUpdate() throws Exception {
		mvc.perform(
			put("/api/todos/100/completed")
				.contentType(MediaType.APPLICATION_JSON)
			)
			.andExpect(status().isOk());
	}

	@Test
	public void shouldDelete() throws Exception {
		mvc.perform(
			delete("/api/todos/99")
				.contentType(MediaType.APPLICATION_JSON)
		)
		.andExpect(status().isOk());
	}
	
	@Test
	public void shouldDeleteAll() throws Exception {
		mvc.perform(
			delete("/api/todos/")
				.contentType(MediaType.APPLICATION_JSON)
		)
		.andExpect(status().isOk());
	}
}
