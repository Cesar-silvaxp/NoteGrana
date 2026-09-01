package com.notegrana

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class GastoModule(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "GastoModule"
    }

    @ReactMethod
    fun listarGastos(promise: Promise) {
        try {
            val database =
                GastoDatabaseHelper(reactApplicationContext)

            val gastos =
                database.listarGastos()

            val lista =
                Arguments.createArray()

            gastos.forEach { gasto ->
                val item =
                    Arguments.createMap()

                item.putString("id", gasto.id)
                item.putDouble("valor", gasto.valor)
                item.putString("titulo", gasto.titulo)
                item.putString("descricao", gasto.descricao)
                item.putString(
                    "pacoteOrigem",
                    gasto.pacoteOrigem
                )
                item.putDouble(
                    "dataHora",
                    gasto.dataHora.toDouble()
                )
                item.putString("status", gasto.status)

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
}