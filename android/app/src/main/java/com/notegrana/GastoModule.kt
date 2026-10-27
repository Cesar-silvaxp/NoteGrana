package com.notegrana

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap

class GastoModule(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(
    reactContext
) {

    override fun getName(): String {
        return "GastoModule"
    }

    @ReactMethod
    fun definirUsuarioAtivo(
        usuarioId: Double,
        promise: Promise
    ) {
        try {
            val id =
                usuarioId.toLong()

            if (id <= 0) {
                promise.reject(
                    "USUARIO_INVALIDO",
                    "ID do usuário inválido."
                )
                return
            }

            UsuarioAtivoStorage.salvar(
                reactApplicationContext,
                id
            )

            promise.resolve(true)

        } catch (e: Exception) {
            promise.reject(
                "ERRO_DEFINIR_USUARIO_ATIVO",
                e.message,
                e
            )
        }
    }

    @ReactMethod
    fun limparUsuarioAtivo(
        promise: Promise
    ) {
        try {
            UsuarioAtivoStorage.limpar(
                reactApplicationContext
            )

            promise.resolve(true)

        } catch (e: Exception) {
            promise.reject(
                "ERRO_LIMPAR_USUARIO_ATIVO",
                e.message,
                e
            )
        }
    }

    @ReactMethod
    fun listarGastos(
        promise: Promise
    ) {
        try {
            val usuarioId =
                obterUsuarioAtivo()

            if (usuarioId == null) {
                promise.reject(
                    "USUARIO_NAO_AUTENTICADO",
                    "Nenhum usuário ativo."
                )
                return
            }

            val database =
                GastoDatabaseHelper(
                    reactApplicationContext
                )

            val gastos =
                database.listarGastos(
                    usuarioId
                )

            val lista =
                Arguments.createArray()

            gastos.forEach { gasto ->
                lista.pushMap(
                    converterGastoParaMap(
                        gasto
                    )
                )
            }

            promise.resolve(lista)

        } catch (e: Exception) {
            promise.reject(
                "ERRO_LISTAR_GASTOS",
                e.message,
                e
            )
        }
    }

    @ReactMethod
    fun listarGastosPendentes(
        promise: Promise
    ) {
        try {
            val usuarioId =
                obterUsuarioAtivo()

            if (usuarioId == null) {
                promise.reject(
                    "USUARIO_NAO_AUTENTICADO",
                    "Nenhum usuário ativo."
                )
                return
            }

            val database =
                GastoDatabaseHelper(
                    reactApplicationContext
                )

            val gastos =
                database.listarGastosPendentes(
                    usuarioId
                )

            val lista =
                Arguments.createArray()

            gastos.forEach { gasto ->
                lista.pushMap(
                    converterGastoParaMap(
                        gasto
                    )
                )
            }

            promise.resolve(lista)

        } catch (e: Exception) {
            promise.reject(
                "ERRO_LISTAR_GASTOS_PENDENTES",
                e.message,
                e
            )
        }
    }

    @ReactMethod
    fun marcarGastoSincronizado(
        idLocal: String,
        apiId: Double,
        promise: Promise
    ) {
        try {
            val usuarioId =
                obterUsuarioAtivo()

            if (usuarioId == null) {
                promise.reject(
                    "USUARIO_NAO_AUTENTICADO",
                    "Nenhum usuário ativo."
                )
                return
            }

            val database =
                GastoDatabaseHelper(
                    reactApplicationContext
                )

            val atualizado =
                database
                    .marcarGastoSincronizado(
                        idLocal,
                        apiId.toLong(),
                        usuarioId
                    )

            if (atualizado) {
                promise.resolve(true)
            } else {
                promise.reject(
                    "GASTO_NAO_ENCONTRADO",
                    "O gasto informado não foi encontrado para o usuário ativo."
                )
            }

        } catch (e: Exception) {
            promise.reject(
                "ERRO_MARCAR_SINCRONIZADO",
                e.message,
                e
            )
        }
    }

    @ReactMethod
    fun atualizarStatusGasto(
        id: String,
        status: String,
        promise: Promise
    ) {
        try {
            if (
                status != "ATIVO" &&
                status != "IGNORADO"
            ) {
                promise.reject(
                    "STATUS_INVALIDO",
                    "Status de gasto inválido."
                )
                return
            }

            val usuarioId =
                obterUsuarioAtivo()

            if (usuarioId == null) {
                promise.reject(
                    "USUARIO_NAO_AUTENTICADO",
                    "Nenhum usuário ativo."
                )
                return
            }

            val database =
                GastoDatabaseHelper(
                    reactApplicationContext
                )

            val atualizado =
                database
                    .atualizarStatusGasto(
                        id,
                        status,
                        usuarioId
                    )

            if (atualizado) {
                promise.resolve(true)
            } else {
                promise.reject(
                    "GASTO_NAO_ENCONTRADO",
                    "O gasto informado não foi encontrado para o usuário ativo."
                )
            }

        } catch (e: Exception) {
            promise.reject(
                "ERRO_ATUALIZAR_GASTO",
                e.message,
                e
            )
        }
    }

    private fun obterUsuarioAtivo(): Long? {
        return UsuarioAtivoStorage.obter(
            reactApplicationContext
        )
    }

    private fun converterGastoParaMap(
        gasto: Gasto
    ): WritableMap {

        val item =
            Arguments.createMap()

        item.putString(
            "id",
            gasto.id
        )

        item.putDouble(
            "valor",
            gasto.valor
        )

        item.putString(
            "titulo",
            gasto.titulo
        )

        item.putString(
            "descricao",
            gasto.descricao
        )

        item.putString(
            "pacoteOrigem",
            gasto.pacoteOrigem
        )

        item.putDouble(
            "dataHora",
            gasto.dataHora.toDouble()
        )

        item.putString(
            "status",
            gasto.status
        )

        if (gasto.apiId != null) {
            item.putDouble(
                "apiId",
                gasto.apiId.toDouble()
            )
        } else {
            item.putNull(
                "apiId"
            )
        }

        item.putBoolean(
            "sincronizado",
            gasto.sincronizado
        )

        if (gasto.usuarioId != null) {
            item.putDouble(
                "usuarioId",
                gasto.usuarioId.toDouble()
            )
        } else {
            item.putNull(
                "usuarioId"
            )
        }

        return item
    }
}