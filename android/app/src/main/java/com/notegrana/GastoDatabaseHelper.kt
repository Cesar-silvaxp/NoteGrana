package com.notegrana

import android.content.ContentValues
import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

class GastoDatabaseHelper(
    context: Context
) : SQLiteOpenHelper(
    context,
    DATABASE_NAME,
    null,
    DATABASE_VERSION
) {

    override fun onCreate(db: SQLiteDatabase) {
        val sql = """
            CREATE TABLE $TABLE_GASTOS (
                id TEXT PRIMARY KEY,
                valor REAL NOT NULL,
                titulo TEXT NOT NULL,
                descricao TEXT NOT NULL,
                pacote_origem TEXT NOT NULL,
                data_hora INTEGER NOT NULL,
                status TEXT NOT NULL
            )
        """.trimIndent()

        db.execSQL(sql)
    }

    override fun onUpgrade(
        db: SQLiteDatabase,
        oldVersion: Int,
        newVersion: Int
    ) {
        db.execSQL("DROP TABLE IF EXISTS $TABLE_GASTOS")
        onCreate(db)
    }

    fun inserirGasto(gasto: Gasto): Boolean {
        val db = writableDatabase

        val values = ContentValues().apply {
            put("id", gasto.id)
            put("valor", gasto.valor)
            put("titulo", gasto.titulo)
            put("descricao", gasto.descricao)
            put("pacote_origem", gasto.pacoteOrigem)
            put("data_hora", gasto.dataHora)
            put("status", gasto.status)
        }

        val resultado = db.insert(
            TABLE_GASTOS,
            null,
            values
        )

        db.close()

        return resultado != -1L
    }

    fun listarGastos(): List<Gasto> {
        val gastos = mutableListOf<Gasto>()
        val db = readableDatabase

        val cursor = db.query(
            TABLE_GASTOS,
            null,
            null,
            null,
            null,
            null,
            "data_hora ASC"
        )

        cursor.use {
            while (it.moveToNext()) {
                val gasto = Gasto(
                    id = it.getString(
                        it.getColumnIndexOrThrow("id")
                    ),
                    valor = it.getDouble(
                        it.getColumnIndexOrThrow("valor")
                    ),
                    titulo = it.getString(
                        it.getColumnIndexOrThrow("titulo")
                    ),
                    descricao = it.getString(
                        it.getColumnIndexOrThrow("descricao")
                    ),
                    pacoteOrigem = it.getString(
                        it.getColumnIndexOrThrow("pacote_origem")
                    ),
                    dataHora = it.getLong(
                        it.getColumnIndexOrThrow("data_hora")
                    ),
                    status = it.getString(
                        it.getColumnIndexOrThrow("status")
                    )
                )

                gastos.add(gasto)
            }
        }

        db.close()

        return gastos
    }

    fun contarGastos(): Int {
        val db = readableDatabase

        val cursor = db.rawQuery(
            "SELECT COUNT(*) FROM $TABLE_GASTOS",
            null
        )

        var total = 0

        cursor.use {
            if (it.moveToFirst()) {
                total = it.getInt(0)
            }
        }

        db.close()

        return total
    }

    companion object {
        private const val DATABASE_NAME = "notegrana.db"
        private const val DATABASE_VERSION = 1

        const val TABLE_GASTOS = "gastos"
    }
}