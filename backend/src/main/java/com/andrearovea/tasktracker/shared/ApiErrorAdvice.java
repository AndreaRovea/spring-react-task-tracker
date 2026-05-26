package com.andrearovea.tasktracker.shared;

import com.andrearovea.tasktracker.task.TaskNotFoundException;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiErrorAdvice {

    @ExceptionHandler(TaskNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(TaskNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body(HttpStatus.NOT_FOUND, ex.getMessage(), null));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        List<Map<String, String>> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> Map.of("field", err.getField(), "message", err.getDefaultMessage() != null ? err.getDefaultMessage() : "invalid"))
                .toList();
        return ResponseEntity.badRequest().body(body(HttpStatus.BAD_REQUEST, "validation failed", errors));
    }

    private static Map<String, Object> body(HttpStatus status, String message, Object details) {
        return Map.of(
                "timestamp", Instant.now().toString(),
                "status", status.value(),
                "error", status.getReasonPhrase(),
                "message", message,
                "details", details != null ? details : List.of()
        );
    }
}
