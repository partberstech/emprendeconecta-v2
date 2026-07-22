package com.market.market.exceptions;

import com.market.market.dto.MensajeResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
public class ManejadorExcepciones {

    @ExceptionHandler(AuthExcepcion.class)
    public ResponseEntity<MensajeResponse> manejarAuthExcepcion(AuthExcepcion ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new MensajeResponse(ex.getMessage()));
    }

    @ExceptionHandler(RecursoNoEncontradoExcepcion.class)
    public ResponseEntity<MensajeResponse> manejarRecursoNoEncontrado(RecursoNoEncontradoExcepcion ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new MensajeResponse(ex.getMessage()));
    }

    @ExceptionHandler(AccesoDenegadoExcepcion.class)
    public ResponseEntity<MensajeResponse> manejarAccesoDenegado(AccesoDenegadoExcepcion ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new MensajeResponse(ex.getMessage()));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<MensajeResponse> manejarCredencialesInvalidas() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new MensajeResponse("Credenciales inválidas"));
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<MensajeResponse> manejarUsuarioNoEncontrado() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new MensajeResponse("Credenciales inválidas"));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<MensajeResponse> manejarValidacion(MethodArgumentNotValidException ex) {
        var errores = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new MensajeResponse(errores));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<MensajeResponse> manejarArgumentoInvalido(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new MensajeResponse(ex.getMessage()));
    }
}
