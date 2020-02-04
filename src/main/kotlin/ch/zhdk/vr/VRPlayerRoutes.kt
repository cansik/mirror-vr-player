package ch.zhdk.vr

import io.ktor.application.call
import io.ktor.http.content.*
import io.ktor.locations.KtorExperimentalLocationsAPI
import io.ktor.locations.Location
import io.ktor.locations.get
import io.ktor.response.respond
import io.ktor.response.respondFile
import io.ktor.response.respondText
import io.ktor.routing.Route
import java.io.File
import java.io.FileInputStream
import javax.print.DocFlavor
import javax.print.SimpleDoc
import javax.print.attribute.HashPrintRequestAttributeSet
import javax.print.attribute.standard.Copies


@KtorExperimentalLocationsAPI
@Location("api/test/{id}/")
data class TestRoute(val id: String)

@KtorExperimentalLocationsAPI
fun Route.vrPlayerRoutes() {

    // webapp routes
    static("app/") {
        staticRootFolder = File("app/dist") // Establishes a root folder
        default("index.html")
        file("bundle.js", "bundle.js")
        file("main.css", "main.css")
        static("libs") {
            files("libs")
        }
        static("assets") {
            files("assets")
        }
        static("") {
            files("")
        }
    }

    // api routes
    get<TestRoute> { id ->
        call.respond("Test id was: $id")
    }
}