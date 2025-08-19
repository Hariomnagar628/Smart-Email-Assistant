package com.email.writer.app;

import lombok.Data;

import java.util.Collection;

@Data
public class EmailRequest {
    private String emailContent;
    private String tone;


}
