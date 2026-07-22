package com.market.market.repositories;

import com.market.market.entities.Usuario;
import com.market.market.entities.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByCorreoElectronico(String correoElectronico);
    List<Usuario> findByRol(Rol rol);
    List<Usuario> findByActivoTrue();
}
