package com.biblioteca.biblioteca_api.config;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Object handleBadRequest(IllegalArgumentException ex) {
        String mensagem = ex.getMessage() != null ? ex.getMessage() : "Requisicao invalida.";
        return Map.of("erro", mensagem);
    }

    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Object handleNotFound(RuntimeException ex) {
        String mensagem = ex.getMessage() != null ? ex.getMessage() : "Recurso nao encontrado.";
        return Map.of("erro", mensagem);
    }
}