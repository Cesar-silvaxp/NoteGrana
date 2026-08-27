package com.notegrana

import java.text.Normalizer

object NotificationProcessor {

    private val ignoredPackages = setOf(
        "com.whatsapp",
        "com.whatsapp.w4b",
        "org.telegram.messenger",
        "com.google.android.gm",
        "com.instagram.android",
        "com.facebook.orca",
        "com.google.android.apps.messaging"
    )

    private val financialPatterns = listOf(
        "pix enviado",
        "pix realizado",
        "pix efetuado",
        "pix transferido",
        "pagamento realizado",
        "pagamento efetuado",
        "pagamento aprovado",
        "compra aprovada",
        "compra realizada",
        "transferencia realizada",
        "transferencia enviada",
        "debito realizado"
    )

    fun isIgnoredApp(packageName: String): Boolean {
        return ignoredPackages.contains(packageName)
    }

    fun isFinancialTransaction(
        title: String,
        text: String
    ): Boolean {
        val content = normalize("$title $text")

        return financialPatterns.any { pattern ->
            content.contains(normalize(pattern))
        }
    }

    fun extractValue(
        title: String,
        text: String
    ): Double? {
        val content = "$title $text"

        val regex = Regex(
            """R\$\s*([0-9]{1,3}(?:\.[0-9]{3})*(?:,[0-9]{2})|[0-9]+(?:,[0-9]{2})?)"""
        )

        val match = regex.find(content) ?: return null
        val rawValue = match.groupValues[1]

        return rawValue
            .replace(".", "")
            .replace(",", ".")
            .toDoubleOrNull()
    }

    private fun normalize(value: String): String {
        return Normalizer
            .normalize(
                value.lowercase(),
                Normalizer.Form.NFD
            )
            .replace("\\p{Mn}+".toRegex(), "")
    }
}