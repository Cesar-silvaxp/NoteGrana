package com.notegrana

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class GastoModule(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(
    reactContext
) {

    override fun getName(): String {
        return "GastoModule"
    }

    @ReactMethod
    fun listarGastos(promise: Promise) {
        try {
            val database =
                GastoDatabaseHelper(
                    reactApplicationContext
                )

            val gastos =
                database.listarGastos()

            val lista =
                Arguments.createArray()

            gastos.forEach { gasto ->
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

                lista.pushMap(item)
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

            val database =
                GastoDatabaseHelper(
                    reactApplicationContext
                )

            val atualizado =
                database.atualizarStatusGasto(
                    id,
                    status
                )

            if (atualizado) {
                promise.resolve(true)
            } else {
                promise.reject(
                    "GASTO_NAO_ENCONTRADO",
                    "O gasto informado não foi encontrado."
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
}