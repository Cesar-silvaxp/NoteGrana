package com.notegrana

data class Gasto(
    val id: String,
    val valor: Double,
    val titulo: String,
    val descricao: String,
    val pacoteOrigem: String,
    val dataHora: Long,
    val status: String = "ATIVO"
)