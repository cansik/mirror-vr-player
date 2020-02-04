package ch.zhdk.vr

import com.google.gson.Gson
import com.google.gson.GsonBuilder
import io.ktor.application.install
import io.ktor.features.*
import io.ktor.gson.GsonConverter
import io.ktor.http.ContentType
import io.ktor.locations.KtorExperimentalLocationsAPI
import io.ktor.locations.Locations
import io.ktor.routing.routing
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty

@KtorExperimentalLocationsAPI
class VRPlayerServer {
    companion object {
        @JvmStatic
        fun main(args: Array<String>) {
            VRPlayerServer().start(args)
        }
    }

    val gson: Gson = GsonBuilder()
        .setPrettyPrinting()
        .excludeFieldsWithoutExposeAnnotation()
        .serializeSpecialFloatingPointValues()
        .create()


    fun start(args: Array<String>) {
        val server = embeddedServer(Netty, port = 8900) {
            install(DefaultHeaders)
            install(CallLogging)
            install(Locations)
            install(ConditionalHeaders)
            install(PartialContent) {
                maxRangeCount = 10
            }
            install(Compression) {
                default()
                excludeContentType(ContentType.Video.Any)
            }
            install(CORS)
            {
                anyHost()
            }
            install(ContentNegotiation) {
                register(ContentType.Application.Json, GsonConverter(gson))
            }

            routing {
                vrPlayerRoutes()
            }
        }
        server.start()
    }
}