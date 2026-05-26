package com.andrearovea.tasktracker.task.dto;

import com.andrearovea.tasktracker.task.TaskStatus;
import jakarta.validation.constraints.Size;

public record TaskUpdateRequest(
        @Size(max = 200) String title,
        @Size(max = 2000) String description,
        TaskStatus status
) {}
