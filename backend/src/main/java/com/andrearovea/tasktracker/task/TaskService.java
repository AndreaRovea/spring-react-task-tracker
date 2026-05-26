package com.andrearovea.tasktracker.task;

import com.andrearovea.tasktracker.task.dto.TaskCreateRequest;
import com.andrearovea.tasktracker.task.dto.TaskResponse;
import com.andrearovea.tasktracker.task.dto.TaskUpdateRequest;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class TaskService {

    private final TaskRepository repository;

    public TaskService(TaskRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> list(TaskStatus filterStatus) {
        List<Task> tasks = filterStatus != null
                ? repository.findByStatus(filterStatus)
                : repository.findAll();
        return tasks.stream().map(TaskResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public TaskResponse get(Long id) {
        Task task = repository.findById(id).orElseThrow(() -> new TaskNotFoundException(id));
        return TaskResponse.from(task);
    }

    public TaskResponse create(TaskCreateRequest request) {
        Task task = new Task(request.title(), request.description(), request.status());
        return TaskResponse.from(repository.save(task));
    }

    public TaskResponse update(Long id, TaskUpdateRequest request) {
        Task task = repository.findById(id).orElseThrow(() -> new TaskNotFoundException(id));
        if (request.title() != null) {
            task.setTitle(request.title());
        }
        if (request.description() != null) {
            task.setDescription(request.description());
        }
        if (request.status() != null) {
            task.setStatus(request.status());
        }
        return TaskResponse.from(repository.save(task));
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new TaskNotFoundException(id);
        }
        repository.deleteById(id);
    }
}
