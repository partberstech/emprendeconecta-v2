package com.market.market.controladores;

import com.market.market.dto.MensajeResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/uploads")
public class UploadControlador {

    private final Path rutaSubida;

    public UploadControlador(@Value("${app.upload.path:/uploads}") String ruta) {
        this.rutaSubida = Paths.get(ruta).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.rutaSubida);
        } catch (IOException e) {
            throw new RuntimeException("No se pudo crear el directorio de subida: " + this.rutaSubida, e);
        }
    }

    @PostMapping
    public ResponseEntity<?> subirArchivo(@RequestParam("archivo") MultipartFile archivo) {
        if (archivo.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new MensajeResponse("El archivo está vacío"));
        }

        var nombreOriginal = archivo.getOriginalFilename();
        if (nombreOriginal == null || nombreOriginal.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new MensajeResponse("Nombre de archivo inválido"));
        }

        var extension = "";
        var ultimoPunto = nombreOriginal.lastIndexOf('.');
        if (ultimoPunto > 0) {
            extension = nombreOriginal.substring(ultimoPunto);
        }

        var nombreUnico = UUID.randomUUID().toString() + extension;
        var rutaDestino = rutaSubida.resolve(nombreUnico);

        try {
            Files.copy(archivo.getInputStream(), rutaDestino, StandardCopyOption.REPLACE_EXISTING);
            var url = "/uploads/" + nombreUnico;
            return ResponseEntity.ok(new UploadResponse(url, nombreOriginal));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MensajeResponse("Error al subir el archivo: " + e.getMessage()));
        }
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<MensajeResponse> manejarExcesoDeTamanio() {
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                .body(new MensajeResponse("El archivo excede el tamaño máximo permitido de 5MB"));
    }

    record UploadResponse(String url, String nombreOriginal) {}
}
