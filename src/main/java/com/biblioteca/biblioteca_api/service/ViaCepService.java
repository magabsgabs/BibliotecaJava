package com.biblioteca.biblioteca_api.service;

import com.biblioteca.biblioteca_api.dto.ViaCepDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class ViaCepService {

    private final RestClient restClient = RestClient.create();

    public ViaCepDTO buscarCep(String cep) {
        String cepLimpo = cep.replaceAll("\\D", "");
        if (cepLimpo.length() != 8) {
            throw new IllegalArgumentException("CEP invalido. Informe 8 digitos.");
        }

        ViaCepDTO resposta = restClient.get()
                .uri("https://viacep.com.br/ws/{cep}/json/", cepLimpo)
                .retrieve()
                .body(ViaCepDTO.class);

        if (resposta == null || Boolean.TRUE.equals(resposta.getErro())) {
            throw new IllegalArgumentException("CEP nao encontrado no ViaCEP.");
        }
        return resposta;
    }
}