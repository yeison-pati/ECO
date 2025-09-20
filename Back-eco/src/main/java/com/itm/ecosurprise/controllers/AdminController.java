package com.itm.ecosurprise.controllers;

import com.itm.ecosurprise.services.ComercianteService;
import com.itm.ecosurprise.services.ConsumidorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private ConsumidorService consumidorService;
    @Autowired
    private ComercianteService comercianteService;

    @GetMapping("/consumidores/todos")
    public ResponseEntity<?> obtenerConsumidoress() {
        return consumidorService.obtenerTodos();
    }

    @GetMapping("/consumidores/{idConsumidor}")
    public ResponseEntity<?> obtenerConsumidoresPorId(@PathVariable int idConsumidor) {
        return consumidorService.obtenerPorId(idConsumidor);
    }

    @GetMapping("/comerciantes/todos")
    public ResponseEntity<?> obtenerTodos() {
        return comercianteService.obtenerTodos();
    }

    @GetMapping("/comerciantes/{idComerciante}")
    public ResponseEntity<?> obtenerXID(@PathVariable int idComerciante) {
        return comercianteService.obtenerPorId(idComerciante);
    }


}
